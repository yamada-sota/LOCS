// URLからパラメータを取得
function getParameterByName(name) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(window.location.href);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// パラメータを変数に代入
var departureParam   = getParameterByName("departure");
var keyword1Param    = getParameterByName("keyword1");
var keyword2Param    = getParameterByName("keyword2");
var keyword3Param    = getParameterByName("keyword3");
var keyword4Param    = getParameterByName("keyword4");
var budgetParam      = getParameterByName("budget");
var timePicker1Param = getParameterByName("timePicker1");
var timePicker2Param = getParameterByName("timePicker2");
var footParam        = getParameterByName("foot");
var trainParam       = getParameterByName("train");
var carParam         = getParameterByName("car");
var bicycleParam     = getParameterByName("bicycle");
var sortParam        = getParameterByName("sort");
var mealParam        = getParameterByName("meal");

// 取得したパラメータを使う
document.getElementById("departureParam").textContent   = departureParam;
document.getElementById("keyword1Param").textContent    = keyword1Param;
document.getElementById("keyword2Param").textContent    = keyword2Param;
document.getElementById("keyword3Param").textContent    = keyword3Param;
document.getElementById("keyword4Param").textContent    = keyword4Param;
document.getElementById("budgetParam").textContent      = budgetParam;
document.getElementById("timePicker1Param").textContent = timePicker1Param;
document.getElementById("timePicker2Param").textContent = timePicker2Param;
document.getElementById("footParam").textContent        = footParam;
document.getElementById("trainParam").textContent       = trainParam;
document.getElementById("carParam").textContent         = carParam;
document.getElementById("bicycleParam").textContent     = bicycleParam;
document.getElementById("sortParam").textContent        = sortParam;
document.getElementById("mealParam").textContent        = mealParam;