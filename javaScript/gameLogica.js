function GameLogica() {

    var NEXT_LEVEL_STEP = 13; // после сколько съеденых кушаний мы переходим на следующий уровень и ускоряем змейку

    var gameField; // объект с игровым полем
    var snake; // объект змейки
    var snakeScore; // объект с логикой подсчета очков
    var snakeFood; // объект с логикой отображения еды и определения скушана ли она кем-то
    var level = 1; // уровень сложности
    var levelNext = NEXT_LEVEL_STEP; // скоко ща осталось скушать до следующего уровня

    var gamePause; // триггер паузы кропнок Р

    var timeSnake; // миллисекунд с прошедшего вызова функции обрабатывающей движение змейки
    var timeFood; // миллисекунд с прошедшего вызова функции обрабатывающей появление и исчезновение еды

    this.restartGame = function() {
        timeSnake = 0;
        timeFood = 0;
        gamePause = false;

        gameField = new GameField(24, 22); // колличество клеточек, размер каждой клетки в пикселях
        snake = new Snake(gameField);
        snakeScore = new SnakeScore();
        snakeFood = new SnakeFood(gameField, snake, snakeScore);

        gameField.create();
        snake.drawAllSnake(); // просто рисуем змею
        snake.setSnakeSpeed(level);

        $(document).keydown(function(eventObject) {
            switch (eventObject.which) {
                case 37: snake.moveLeft(); break;
                case 38: snake.moveUp(); break;
                case 39: snake.moveRight(); break;
                case 40: snake.moveDown(); break;
                case 80: gamePause = !gamePause; break; // кнопка Р
            }
        });

        var gameTime = setInterval(function() { // общий игровой таймер стреляет раз в 10 миллисекунд
            if (false == gamePause) {

                timeSnake += 10;
                timeFood += 10;

                if (timeSnake >= snake.speed) { // движеие змейки
                    timeSnake = 0;

                    snake.drawSnakeMove(); // перерисовка змеи по ходу движения

                    // проверка на Game Over
                    if ("live" != snake.live) { clearInterval(gameTime); sendScoreToServer(); }

                    // если не умерли, то проверяем не съели ли мы кого-нибудь
                    if (snakeFood.checkEat()) {
                        levelNext--; // съеденок кушанье приближает переход на более сложный уровень
                        if (levelNext <= 0) {
                            levelNext = NEXT_LEVEL_STEP; level++; // переход
                            snake.setSnakeSpeed(level); // ускорение змейки
                        }
                        // и отображение новых данных пользователю
                        $("#level").html("level: " + level + " /next in " + levelNext + "/");
                    }
                }

                if (timeFood >= 1000) { // раз в секунду обрабатываем появление исчезновение еды
                    timeFood = 0;

                    snakeFood.foodTick();
                }
            }
        }, 10);

        getScoreFromServer(); // в начале игры закачиваем с пых сервака данные о прошлых играх
    };

    // отправляем результаты игры после Гейм Овера и получаем общие данные за все игры
    function sendScoreToServer() {
        $.ajax("./scoreServer.php", {
            type: "POST",
            data: {
                score: snakeScore.score,
                food: snakeScore.foodStandart + snakeScore.foodBest + snakeScore.foodScore },
            dataType: "html",
            timeout: 10000,
            success: function(data) {
                $("#phpserver").html(data);
            }
        });
    }

    // просто получаем данные за предыдущие игры
    function getScoreFromServer() {
        $.ajax("./scoreServer.php", {
            type: "POST",
            data: {reading: 1},
            dataType: "html",
            timeout: 10000,
            success: function(data) {
                $("#phpserver").html(data);
            }
        });
    }
}