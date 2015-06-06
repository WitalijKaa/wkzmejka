
function GameField(size, level) {

    this.size = size || 20;
    this.level = level || 1;
    self = this;

    var field = [];

    this.create = function() {

        var pxFieldSize = String(26 * self.size) + "px";
        $divField = $('#gameField')
            .css({"border": "1px solid #777", "border-radius": "4px", "width": pxFieldSize, "height": pxFieldSize});

        for (x = 0; x < size; x++) {
            field[x] = [];
            for (y = 0; y < size; y++) {

                field[x][y] = {cell: "empty", time: 0};

                strFormat = "000";
                strX = strFormat.substring(0, strFormat.length - String(x).length) + x;
                strY = strFormat.substring(0, strFormat.length - String(y).length) + y;

                var $cell = $("<div></div>")
                    .css({"border": "1px solid #888", "border-radius": "4px", "width": "24px", "height": "24px", "float": "left"})
                    .prop("id", "cell" + strX + "w" + strY);

                $divField.append($cell);
            }
        }
    }
}