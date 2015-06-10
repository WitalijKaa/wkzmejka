function SnakeFood(gameField, snake, snakeScore) {

    var food = []; // массив с едой

    // у нас в игре есть полезная растишко-пища и бесполезная пища-очков, логика их появления требует два счетчика
    var countGrowingFood;
    var countScoringFood;

    // ежесекундная
    this.foodTick = function() {
        countFoodTypes();

        var create = false;
        if (0 == countGrowingFood && chance(95)) { create = true; } // если у нас 0 растишко-пищи, то с 95% вероятностью мы ее появим
        else if (1 == countGrowingFood && chance(20)) { create = true; } // ну и так далее
        else if (2 == countGrowingFood && chance(10)) { create = true; }

        if (create) { createFood(true); } // возможно соездаем пищу роста АНТИ-роста
        else { // но если нет
            if (0 == countScoringFood && chance(70)) { create = true; } // то с 70% вероятностью создаем пищу бесполезную, если ее нету еще
            else if (1 == countScoringFood && chance(45)) { create = true; } // ну и так далее
            else if (2 == countScoringFood && chance(20)) { create = true; }
            else if (3 == countScoringFood && chance(15)) { create = true; }

            if (create) { createFood(false); } // ага, фолс это бесполезная пища по 100 очков
        }

        checkFoodTime(); // убиваем пищу таймер которой вышел (протухла)
    };

    // определяем сколько у нас пищи роста и сколько пищи очков
    // дело в том что движение змейки и появление-исчезновение пищи это методы которые можно вызывать с разными интервалами, потому чтобы не было конфликтов с тем что змейка двигаясь съела пищу, а потом она еще и исчезла, то каждый раз считаем
    function countFoodTypes() {
        countGrowingFood = 0;
        countScoringFood = 0;

        for (i = 0; i < food.length; i++) {
            if ("foodscore" == food[i].value) { countScoringFood++; }
            else {countGrowingFood++; }
        }
    }

    // протухшая пища исчезает
    function checkFoodTime() {
        for (i = 0; i < food.length; i++) {
            food[i].time -= 1000;
            if (food[i].time < 10) {
                gameField.setCell(food[i].x, food[i].y, "empty");
                food.splice(i, 1);
                i--;
            }
        }
    }

    // короче бог пищи умеет проверять не съела ли голова змеи чаво-нибудь
    this.checkEat = function() {
        for (i = 0; i < food.length; i++) { // для каждого лакомства
            if (snake.getX() == food[i].x && snake.getY() == food[i].y) { // если оно в голове
                // то оно скушано
                if ("foodbest" == food[i].value) { snake.foodBestEated(); }
                else if ("food" == food[i].value) { snake.foodEated(); }
                // и за это получены очки
                snakeScore.eat(food[i].value, snake.getBodyLenth());
                // и пища исчезла в желудке
                food.splice(i, 1);
                // и даже ретурн есть
                return true;
            }
        }
        return false;
    };

    // создание пищи либо для роста growing = Тру, либо для очков growing = Фолс
    function createFood(growing) {

        var poseFinded = false; // ищем куда ее покласть
        do {
            var newPose = {
                x: randome(0, gameField.fieldSize - 1),
                y: randome(0, gameField.fieldSize - 1)
            };
            if (false == snake.checkBodyImpact(newPose) &&
                false == checkFoodFoodImpact(newPose)) {
                poseFinded = true; // если там нет змеи или других фруктов, то нашли
            }
        } while (false == poseFinded);

        var newValue = "food"; // что за еда
        if (growing) {
            if (chance(20)) { // с 20% вероятностью это еда антироста
                newValue = "foodbest";
            }
        } else { newValue = "foodscore"; }

        var newTime = randome(7000, 12000); // как долго она будет доступна для кушанья
        if ("foodbest" == newValue) { newTime = randome(4000, 8000); }
        else if ("foodscore" == newValue) { newTime = randome(8000, 21000); }

        var newFood = { // создаем
            x: newPose.x,
            y: newPose.y,
            time: newTime,
            value: newValue
        };
        food.push(newFood);

        gameField.setCell(newFood.x, newFood.y, newFood.value); // рисуем
    }

    // проверяет входящие координаты на то, не врезаются ли они в существующую пищу
    function checkFoodFoodImpact(newFood) {
        for (i = 0; i < food.length; i++) {
            if (food[i].x == newFood.x && food[i].y == newFood.y) { return true; }
        }
        return false;
    }

    function randome(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // вернет Тру если выпадет шанс с указанным процентом
    function chance(percents) {
        return randome(1, 100) <= percents;
    }
}