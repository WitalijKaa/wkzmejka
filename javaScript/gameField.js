
function GameField(fieldSize, cellSize) {

    var PX_CELL_BORDER = 1; // толщина границы клеточки в пикселях (а также границы поля)

    var pxCellSize = cellSize || 24; // ширина и высота клеточки в пикселях
    this.fieldSize = fieldSize || 20; // ширина и высота игрового поля в игровых клетках

    var self = this;

    this.create = function() {

        var pxFieldSize = String((pxCellSize + PX_CELL_BORDER + PX_CELL_BORDER) * self.fieldSize) + "px"; // размер игрового поля в пикселях
        var $divField = $('#gameField') // перенастраиваем объект игрового поля
            .html("")
            .css({"border": PX_CELL_BORDER + "px solid #777", "border-radius": "4px", "width": pxFieldSize, "height": pxFieldSize});

        for (y = 0; y < self.fieldSize; y++) {
            for (x = 0; x < self.fieldSize; x++) {

                var $cell = $("<div></div>") // создаем DOM клеточку
                    .css({"border": PX_CELL_BORDER + "px solid #888", "border-radius": "4px", "width": pxCellSize + "px", "height": pxCellSize + "px", "float": "left"})
                    .prop("id", defineCellID(x, y));

                $divField.append($cell);

                self.setCell(x, y, "empty"); // устанавливаем ей стиль чтобы было видно что она пустая
            }
        }
    };

    // перекрашивает клетку DOMа зная числовые координаты клетки и ее скриптовое значение (например food или snaketail)
    this.setCell = function(x, y, value) {
        $("#" + defineCellID(x, y)).removeClass().addClass(defineCellClassName(value));
    };

    // от простых числовых координат х у определяет валидный айдишник игровой клетки в DOMе с этими координатами формата cell001w011
    function defineCellID(x, y) {
        var strFormat = "000";
        var strX = strFormat.substring(0, strFormat.length - String(x).length) + x;
        var strY = strFormat.substring(0, strFormat.length - String(y).length) + y;
        return "cell" + strX + "w" + strY;
    }

    // превращает значение змейки или кушанья в валидное название класса, например food в cellFood
    function defineCellClassName(value) { return "cell" + value.charAt(0).toUpperCase() + value.substring(1); }
}