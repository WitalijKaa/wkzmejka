
function tempAjax() {

    $.ajax("server.php", {
            acync: true,
            cache: true,
            type: "POST",
            data: "id=7&name=wk",
            dataType: "html", // ТИП ВОЗВРАТА эт xml text script json jsonp
            timeout: 10000,
            context: $("#wrap"),
            beforeSend: function(XMLHttpRequeste) {
                // хз чо это за XMLHttpRequeste
            },
            success: function(data) {
                // благодаря параметру context здесь this это div c id wrap
                // data это хрень с сервака пришедшая
            },
            error: function(XMLHttpRequeste, textStatus, errorThrow) {
               // ups
            },
            complete: function(XMLHttpRequeste, textStatus) {
                // just finish
            }
        });

    $.get("server.php", "id=7&name=wk",
        function(data) {
            // success
        },
        "html");

    $.post("server.php", "id=7&name=wk",
        function(data) {
            // success
        },
        "html");

    $("#wrap").load("server.php", {id: 7}); // догрузить в контент объекта чонибудь из сервака
}