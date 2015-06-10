function Snake(gameField) {

    var body = []; // массив с телом {x: 1, y: 1, value: "snakebody"}
    var direction = "east"; // направление движения змейки
    var grow = false;

    // по-скольку нажатие кнопок обрабатывается не в функции перемещения змейки,
    // и возможно игрок отдал 2 команды на изменение направления змейки
    // между ее шагом перемещения,
    // то функция изменение направления устанавливает movedAfterDirectionChange в фолс,
    // чтобы функция поиска нового места для головы, определив что нужно менять направление дважды,
    // корректно обрабатывала переменную secondStepDirection, знающую куда менять направление на 2 шаге,
    // чтобы вообще программа после двойного нажатия меняла направление 2 раза, а не 1 раз,
    // и чтобы направление менялось 2 раза в 2 рывка змеи, а не в один
    var movedAfterDirectionChange = true;
    var secondStepDirection = direction;

    this.live = "live"; // не Гейм Овер
    this.speed = 240; // миллисекунды

    var self = this;

    // создаем минимального червяка меньше которого низзя быть
    this.create = function() {
        body[0] = {x: gameField.fieldSize / 2 + 1, y: gameField.fieldSize / 2 + 1, value: "snakehead"};
        body[1] = {x: body[0].x - 1, y: body[0].y, value: "snakebody"};
        body[2] = {x: body[0].x - 2, y: body[0].y, value: "snaketail"};
    };

    // змея сама знает какая у нее должна быть скорость в зависимости от сложности игры
    this.setSnakeSpeed = function(level) {
        self.speed = 220 - (level) * 10;
        if (self.speed < 70) { self.speed = 70; }
    };

    // тупо рисуем змейку целиком
    this.drawAllSnake = function() {
        for (i = 0; i < body.length; i++) {
            drawSnakePart(i);
        }
    };

    // обрабатываем перемещение змейки
    this.drawSnakeMove = function() {
        newHead = getNewSnakeHead(body[0]); // новая позиция головы (до перерисовки)

        if (checkHeadEmpactWall(newHead)) { self.live = "wall"; } // не врежимся ли мы в стену?
        else if (checkHeadEmpactBody(newHead)) { self.live = "body"; } // не врежимся ли сами в себя?
        else { // если следующая позиция головы не убивает нашу милую змеюшку

            body.unshift(newHead); // добавляем голову в массив
            body[1].value = "snakebody"; // меняем тип клетки которая сейчас N1, а ранее была N0 (то есть старая голова) на тело

            if (false == grow) { // если мы не скушали еду роста
                makeSnakeShorter();
            }

            //перерисовываем только 3 клетки: головы, тела за головой и хвоста, вместо отрисовки всего тела
            drawSnakePart(0);
            drawSnakePart(1);
            drawSnakePartTail();
            //self.drawAllSnake();

            grow = false; // если мы должны были расти то при движении мы это сделали 100%, так что сбрасываем триггер
        }
    };

    // продвинутое изменение направления змейки
    function getNewSnakeHead(oldHead) {
        // это обрабтка двойного нажатия изменения направления между шагом змейки.
        // например змейка двигалась на юг, а игрок в один момент приказал двигаться на запад, а потом на север...
        // то есть нажал две клавиши между шагом змейки...
        // вот мы и проверяем, если мы уже повернули на запад, но у нас в задачах еще висит поворот на север,
        // то здесь и устанавливаем направление на север
        if (movedAfterDirectionChange && secondStepDirection != direction)
            { direction = secondStepDirection; }

        switch (direction) { // двигаемся, возможно меняем направление
            case "east": newHead = {x: oldHead.x + 1, y: oldHead.y, value: "snakehead"}; break;
            case "west": newHead = {x: oldHead.x - 1, y: oldHead.y, value: "snakehead"}; break;
            case "north": newHead = {x: oldHead.x, y: oldHead.y - 1, value: "snakehead"}; break;
            case "south": newHead = {x: oldHead.x, y: oldHead.y + 1, value: "snakehead"}; break;
        }

        movedAfterDirectionChange = true; // если был запрос на изменение направления, то оно уже точно произошло
        return newHead;
    }

    this.moveUp = function() {
        // этот код был написан вторым
        if (false == movedAfterDirectionChange && // если мы повторно нажимаем кнопку со стрелко до того как змея двинется
            secondStepDirection == direction &&  // и это нажатие номер 2 (или претендует им быть)
            "south" != direction) // и оно адекватно и не заставит нас двигаться внутрь себя (то есть первое нажатие было не вниз
        { secondStepDirection = "north"; } // то запоминаем что на втором шаге изменения направления нам нужно двигаться вверх

        // сначала был написан этот код
        if (movedAfterDirectionChange && // если это первое нажатие на клаву после предыдущего движения змейки
            secondStepDirection == direction && // и нет в памяти никакого изменения направления по второму шагу
            "south" != direction) { // и нам не приказали двигаться строго обратно (в себя) (то есть мы не двигаемся вниз)
            direction = "north"; // то меняем направление на вверх
            secondStepDirection = "north"; // ставим направление второго нажатия (которого возможно и не будет) туда же
            movedAfterDirectionChange = false; // и запоминаем что мы еще не прередвинулись в новом направлении
        }
    };
    this.moveRight = function() {
        if (false == movedAfterDirectionChange && secondStepDirection == direction && "west" != direction) { secondStepDirection = "east"; }
        if (movedAfterDirectionChange && secondStepDirection == direction && "west" != direction) { direction = "east"; secondStepDirection = "east"; movedAfterDirectionChange = false; }
    };
    this.moveDown = function() {
        if (false == movedAfterDirectionChange && secondStepDirection == direction && "north" != direction) { secondStepDirection = "south"; }
        if (movedAfterDirectionChange && secondStepDirection == direction && "north" != direction) { direction = "south"; secondStepDirection = "south"; movedAfterDirectionChange = false; }
    };
    this.moveLeft = function() {
        if (false == movedAfterDirectionChange && secondStepDirection == direction && "east" != direction) { secondStepDirection = "west"; }
        if (movedAfterDirectionChange && secondStepDirection == direction && "east" != direction) { direction = "west"; secondStepDirection = "west"; movedAfterDirectionChange = false; }
    };

    // не вышли ли мы за пределы известной обитаемой вселенной
    function checkHeadEmpactWall(head) {
        if (head.x < 0 || head.x >= gameField.fieldSize ||
            head.y < 0 || head.y >= gameField.fieldSize) {
            return true;
        }
        return false;
    }

    // не убились ли мы ап себя
    function checkHeadEmpactBody(head) {
        for (i = 3; i < body.length - 1; i++) {
            if (head.x == body[i].x && head.y == body[i].y) { return true; }
        }
        return false;
    }

    // нарисовать 1 кусок змеи по индексу в массиве с телом
    function drawSnakePart(index) {
        gameField.setCell(body[index].x, body[index].y, body[index].value);
    }

    // нарисовать хвост змеи
    function drawSnakePartTail() {
        drawSnakePart(body.length - 1);
    }

    // стереть текущий хвост змеи
    function eraseSnakePartTail() {
        gameField.setCell(body[body.length - 1].x, body[body.length - 1].y, "empty");
    }

    // укарачивает змейку на 1 и все перерисовывет что нуно
    function makeSnakeShorter() {
        eraseSnakePartTail(); // стираем хвост
        body.pop(); // обрезаем хвост
        body[body.length - 1].value = "snaketail"; // из раненого тела делаем новый хвост
        drawSnakePartTail(); // перерисовуем новый хвост
    }

    // сообщаем змейке что она скушала еду роста
    this.foodEated = function() {
        grow = true;
    };

    // сообщаем змейке что она скушала еду АНТИ-роста
    this.foodBestEated = function() {
        if (body.length > 3) { // если мы не минимальной длины, а длинше
            makeSnakeShorter();
        }
    };

    // проверяет не врежится ли что-то в змейку
    this.checkBodyImpact = function(cell) {
        for (i = 0; i < body.length; i++) {
            if (cell.x == body[i].x && cell.y == body[i].y) { return true; }
        }
        return false;
    };

    // позиция головы
    this.getX = function() { return body[0].x; };
    this.getY = function() { return body[0].y; };
    // общая длина тела
    this.getBodyLenth = function() { return body.length; }
}