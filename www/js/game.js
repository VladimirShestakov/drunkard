/**
 * Карточная игра "Пьяница"
 *
 * @version 1.0
 * @date 08.08.2013
 * @author Vladimir Shestakov <boolive@yandex.ru>
 */
(function($) {
    /**
     * Заполнение колоды из 52 карт
     * @param deck jQuery Колода для заполнения
     */
    var fill_deck = function(deck){
        deck.empty();
        var i, j, text;
        var colour = ['spades', 'clubs', 'hearts', 'diams'];
        for (i = 2; i<15; i++){
            switch (i){
                case 14: text = 'A'; break;
                case 13: text = 'K'; break;
                case 12: text = 'Q'; break;
                case 11: text = 'V'; break;
                default: text = i;
            }
            for (j=0; j<4; j++){
                deck.append('<li class="card '+colour[j]+' close" data-value="'+i+'"><div class="value">'+text+'</div></li>');
            }
        }
    };
    /**
     * Раздача колоды карт двум игрокам
     * @param deck jQuery Колода карт
     * @param deck_player1 jQuery Колода первого игрока
     * @param deck_player2 jQuery Колода второго игрока
     */
    var deal_deck = function(deck, deck_player1, deck_player2){
        var to_player1 = true;
        var i, card, cnt = deck.children().size();
        for (i=0; i<cnt; i++){
            card = Math.floor(Math.random() * deck.children().size());
            if (to_player1){
                deck.children().eq(card).appendTo(deck_player1);
            }else{
                deck.children().eq(card).appendTo(deck_player2);
            }
            to_player1 = !to_player1;
        }
    };
    /**
     * Логика игры
     */
    $(document).ready(function(){
        var moves_cnt, // Кол-во доступных ходов
            deck_start = $('.game .start'), // Колода всех для раздачи
            deck_game1 = $('.game .p1'), // Область карт в игре первого игрока
            deck_game2 = $('.game .p2'), // Область карт в игре второго игрока
            deck_player1 = $('.player1 .deck'), // Колода первого игрока
            deck_player2 = $('.player2 .deck');

        // Создание колоды
        fill_deck(deck_start);

        // Старт
        deck_start.on('click', function(){
            deal_deck(deck_start, deck_player1, deck_player2);
            moves_cnt = 1;
        });

        // Ход пользователя
        $('.zone.player2').on('click', '.deck .card:last-child', function(e){
            if (moves_cnt){
                $(this).animate({top: "-=150px", left:"-=20"}, 200, "linear", function() {
                    $(this).css({top:'auto', left: 'auto'}).appendTo(deck_game2);
                    moves_cnt--;

                    // Ход компа
                    deck_player1.children(':last-child').animate({bottom: "-=150px", right:"-=100"}, 200, "linear", function() {
                        $(this).css({bottom:'auto', right: 'auto'}).appendTo(deck_game1);

                        // Скрываем карты
                        if (moves_cnt==0){
                            var card1 = deck_game1.children(':last-child');
                            var card2 = deck_game2.children(':last-child');
                            card1.removeClass('close');
                            card2.removeClass('close');
                            // Сравниваем, кто выиграл
                            var id = setTimeout(function(){
                                clearInterval(id);
                                var v1 = card1.attr('data-value')*1;
                                var v2 = card2.attr('data-value')*1;
                                if (v1 > v2){
                                    deck_game1.children().appendTo(deck_game2);
                                    deck_game2.animate({top: "-=150px"}, 200, "linear", function() {
                                        $(this).children().addClass('close').prependTo(deck_player1);
                                        $(this).css({top:'auto'});
                                        moves_cnt++;
                                    });
                                }else
                                if (v1 < v2){
                                    deck_game1.children().appendTo(deck_game2);
                                    deck_game2.animate({bottom: "-=150px"}, 200, "linear", function() {
                                        $(this).children().addClass('close').prependTo(deck_player2);
                                        $(this).css({bottom:'auto'});
                                        moves_cnt++;
                                    });
                                }else{
                                    moves_cnt+=2;
                                }
                            }, 800);
                        }
                    });
                })
            }
        });
    });
})(jQuery);