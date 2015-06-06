
function GameField(size, level) {

    this.size = size || 20;
    this.level = level || 1;
    self = this;

    var field = [];

    this.create = function() {

        $divField = $('#gameField')
            .remove();

        for (x = 0; x < size; x++) {
            field[x] = [];
            for (y = 0; y < size; y++) {
                field[x][y] = {cell: "empty", time: 0};
                var $cell = $("<div></div>")
                    .css({"border:": "1px solid #ddd", "width": "24px", "height": "24px"});
            }
        }


    }
}