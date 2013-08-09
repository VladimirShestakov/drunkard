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
                deck.append('<li class="card '+colour[j]+'" data-value="'+i+'"><div class="value">'+text+'</div></li>');
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
                deck.children().eq(card).addClass('close').appendTo(deck_player1);
            }else{
                deck.children().eq(card).addClass('close').appendTo(deck_player2);
            }
            to_player1 = !to_player1;
        }
    };
    /**
     * Показать окно
     * @param name Класс окна
     */
    var show_window = function(name){
        $('.window').hide();
        $(window).resize();
        $('.window.'+name).fadeIn(500, function(){
            $(window).resize();
        });
    };
    /**
     * Проверка конца игры
     * @param deck_player1 jQuery Колода первого игрока
     * @param deck_player2 jQuery Колода второго игрока
     */
    var check_gameover = function(deck_player1, deck_player2){
        if (deck_player1.children().size() == 0){
            show_window('gameover-victory');
        }else
        if (deck_player2.children().size() == 0){
            show_window('gameover-loss');
        }
    };
    /**
     * Логика игры на двоих
     * @param deck jQuery Колода для раздачи
     * @param deck_player1 jQuery Пустая колода первого игрока
     * @param deck_player2 jQuery Пустая колода второго игрока
     * @param deck_game1 jQuery Зона (колода), куда кладет карты первый игрок
     * @param deck_game2 jQuery Зона (колода), куда кладет карты второй игрок
     */
    var play = function(deck, deck_player1, deck_player2, deck_game1, deck_game2){
        var moves_cnt = 1; // Кол-во доступных ходов для пользователя

        // Раздача карт
        deal_deck(deck, deck_player1, deck_player2);

        // Ход пользователя
        deck_player2.on('click', '.card:last-child', function(e){
            if (moves_cnt){
                $(this).animate({top: "-=140px", left:"-=50"}, 200, "linear", function() {
                    $(this).css({top:'auto', left: 'auto'}).appendTo(deck_game2);
                    moves_cnt--;

                    // Ход компа
                    deck_player1.children(':last-child').animate({bottom: "-=140px", right:"-=50"}, 200, "linear", function() {
                        $(this).css({bottom:'auto', right: 'auto'}).appendTo(deck_game1);

                        // Открываем карты
                        if (moves_cnt==0){
                            var card1 = deck_game1.children(':last-child');
                            var card2 = deck_game2.children(':last-child');
                            card1.removeClass('close');
                            card2.removeClass('close');

                            // Сравниваем, кто выиграл
                            var id = setTimeout(function(){
                                clearInterval(id);
                                var v1 = parseInt(card1.attr('data-value'));
                                var v2 = parseInt(card2.attr('data-value'));
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
                                // Проверка конца игры
                                check_gameover(deck_player1, deck_player1);
                            }, 800);
                        }
                    });
                })
            }
        });
    };
    /**
     * Обработка изменений размеров браузера
     * Центрирование окон
     */
    $(window).resize(function() {
		$('.window').each(function (i) {
			$(this).css({
				position:'absolute',
				left: Math.max(0, ($(window).width() - $(this).outerWidth()) / 2),
				top: Math.max(0, ($(window).height() - $(this).outerHeight()) / 2)
			});
		});
	});
    /**
     * Инициализация игры "Пьяница"
     */
    $(document).ready(function(){
        var deck = $('.start .deck');
        // Создание колоды
        fill_deck(deck);
        // Окно приветствия (старта игры)
        show_window('start');
        // Старт
        deck.on('click', function(){
            show_window('game');
            play(deck,
                $('.game .player1 .deck'),
                $('.game .player2 .deck'),
                $('.game .play .p1'),
                $('.game .play .p2')
            );
        });
    });
})(jQuery);