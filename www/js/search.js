document.addEventListener("DOMContentLoaded", function() {
    // 下からスライドイン
    var slideInContent = document.getElementById("slide-in-content");
    document.getElementById("search-bar").addEventListener("click", () => {
        slideInContent.style.transform = "translateY(0%)";
    });
    let touchStartY = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    });
    document.addEventListener("touchend", (e) => {
        var touchEndY = e.changedTouches[0].clientY;
        var deltaY    = touchEndY - touchStartY;

        if (deltaY > 50) {
            slideInContent.style.transform = "translateY(100%)";
        }
    });
});

function resetSetting() {
    document.getElementById("departure").selectedIndex = 0;
    document.getElementById("keywords1").selectedIndex = 0;
    document.getElementById("keywords2").selectedIndex = 0;
    document.getElementById("keywords3").selectedIndex = 0;
    document.getElementById("keywords4").selectedIndex = 0;
    document.getElementById("time1").value             = "00:00";
    document.getElementById("time2").value             = "00:00";
    document.getElementById("foot").checked            = false;
    document.getElementById("train").checked           = false;
    document.getElementById("car").checked             = false;
    document.getElementById("bicycle").checked         = false;
    document.getElementById("sort").selectedIndex      = 0;

    var date  = new Date()
    var year  = date.getFullYear()
    var month = date.getMonth() + 1
    var day   = date.getDate()
    var toTwoDigits = function (num, digit) {
        num += ""
        if (num.length < digit) {
            num = "0" + num
        }
        return num
    }
    var yyyy = toTwoDigits(year, 4)
    var mm   = toTwoDigits(month, 2)
    var dd   = toTwoDigits(day, 2)
    var ymd  = yyyy + "-" + mm + "-" + dd;
    
    document.getElementById("date").value = ymd;
}