
function GameField(fieldSize, level, cellSize) {

    var PX_CELL_BORDER = 1;

    var pxCellSize = cellSize || 24;
    var size = fieldSize || 20;
    var level = level || 1;

    var field = [];

    self = this;


    this.create = function() {

        var pxFieldSize = String((pxCellSize + PX_CELL_BORDER + PX_CELL_BORDER) * size) + "px";
        $divField = $('#gameField')
            .css({"border": PX_CELL_BORDER + "px solid #777", "border-radius": "4px", "width": pxFieldSize, "height": pxFieldSize});

        for (x = 0; x < size; x++) {
            field[x] = [];
            for (y = 0; y < size; y++) {

                field[x][y] = {cell: "empty", time: 0};

                strFormat = "000";
                strX = strFormat.substring(0, strFormat.length - String(x).length) + x;
                strY = strFormat.substring(0, strFormat.length - String(y).length) + y;

                var $cell = $("<div></div>")
                    .css({"border": PX_CELL_BORDER + "px solid #888", "border-radius": "4px", "width": pxCellSize + "px", "height": pxCellSize + "px", "float": "left"})
                    .prop("id", "cell" + strX + "w" + strY);

                $divField.append($cell);
            }
        }
    }
}