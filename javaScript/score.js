function SnakeScore() {
    var FOOD_STANDART = 1300;
    var FOOD_BEST = 500;
    var FOOD_SCORE = 100;

    this.score = 0;
    this.scoreStandart = 0;
    this.scoreBest = 0;
    this.scoreScore = 0;
    this.foodStandart = 0;
    this.foodBest = 0;
    this.foodScore = 0;

    var self = this;

    this.eat = function(value, snakeLenth) {
        if ("food" == value) {
            // здесь +1 нужно потому что когда в объекте еды происходит поедание растущей еды, в этот момент длина змеи еще не увеличена, она будет увеличина только на следующем шаге таймера движения змеи
            snakeLenth++;
            var mult = snakeLenth - 3; // если длина змеи (минимальная)3 то мультипликатор будет 0 благодаря -3
            var plusik = FOOD_STANDART + (100 * mult);
            self.score += plusik;
            self.scoreStandart += plusik;
            self.foodStandart++;
        }

        else if ("foodbest" == value) {
            self.score += FOOD_BEST;
            self.scoreBest += FOOD_BEST;
            self.foodBest++;
        }

        else if ("foodscore" == value) {
            self.score += FOOD_SCORE;
            self.scoreScore += FOOD_SCORE;
            self.foodScore++;
        }

        $("#score").html("total score: " + self.score);
        $("#foodStandart").html("just food: " + self.foodStandart + " /score " + self.scoreStandart + "/");
        $("#foodBest").html("best food: " + self.foodBest + " /score " + self.scoreBest + "/");
        $("#foodScore").html("score food: " + self.foodScore + " /score " + self.scoreScore + "/");
        $("#foodTotal").html("total food: " + (self.foodStandart + self.foodBest + self.foodScore));
        $("#snakeLenth").html("snake lenth: " + snakeLenth);
    }
}
