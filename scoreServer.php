<?php

session_start();

if (isset($_SESSION["score"])) {
    $totalScore = (int)$_SESSION["score"];
    $totalFood = (int)$_SESSION["food"];
} else {
    $totalScore = 0; $totalFood = 0;
}

if (false == isset($_POST['reading'])) { // если это не обращение просто за данными прошедших игр

    $gameScore = (int)$_POST["score"]; // получаем новые данные после Гейм Овера
    $gameFood = (int)$_POST["food"];

    $totalScore += $gameScore; // добавляем к всем играм
    $totalFood += $gameFood;

    $_SESSION["score"] = $totalScore; // запоминаем новые общие достижения
    $_SESSION["food"] = $totalFood;
}

// если это вызов после Гейм Овера то пишем и результат текущей игры, и в сумме всех
// иначе пишем резултат предыдущих игр
if (false == isset($_POST['reading'])): ?>php server data<br>
this game you earn <?php echo $gameScore; ?> score and eat <?php echo $gameFood; ?> meal<br>
today you earn <?php echo $totalScore; ?> score and eat <?php echo $totalFood; ?> meal<br>
<?php else: ?>php server online<br>
previos games...<br>
you earn <?php echo $totalScore; ?> score and eat <?php echo $totalFood; ?> meal<br>
<?php endif; ?>