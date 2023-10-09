document.addEventListener("DOMContentLoaded", function() {
    // 下からスライドイン
    const slideInContent = document.getElementById("slide-in-content");
    document.getElementById("search-bar").addEventListener("click", () => {
        slideInContent.style.transform = "translateY(0%)";
    });
    let touchStartY = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartY = e.touches[0].clientY;
    });
    document.addEventListener("touchend", (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY    = touchEndY - touchStartY;

        if (deltaY > 50) {
            slideInContent.style.transform = "translateY(100%)";
        }
    });

    // 右からスライドイン
    const slideInContent2 = document.getElementById("slide-in-content2");
    document.getElementById("edit").addEventListener("click", () => {
        slideInContent2.style.transform = "translateX(0%)";
    });
    let touchStartX = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });
    document.addEventListener("touchend", (e) => {
        const touchEndX = e.changedTouches[0].clientX;
        const deltaX    = touchEndX - touchStartX;

        if (deltaX > 50) {
            slideInContent2.style.transform = "translateX(100%)";
        }
    });

    // 初期マップ表示
    let map;
    function initMap() {
        map = new google.maps.Map(document.getElementById("map"), {
            center: { lat: 0, lng: 0 }, // マップの初期位置
            zoom: 15 // ズームレベル (1〜20)
        });

        // 現在地を表示
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                const userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                map.setCenter(userLocation);

                new google.maps.Marker({
                    position: userLocation,
                    map: map,
                    title: "現在位置"
                });
            });
        } else {
            alert("Geolocationがサポートされていません。");
        }
    }

    initMap();

    // マップ画面
    document.querySelector(".item-globe").addEventListener("click", () => {
        document.querySelector("#content-globe").style.display   = "block";
        document.querySelector("#content-setting").style.display = "none";
        document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
        document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
        document.querySelector(".globe").style.fill              = "var(--accent-color800)";
        document.querySelector(".setting").style.fill            = "var(--system-gray500)";
    });

    // 設定画面
    document.querySelector(".item-setting").addEventListener("click", () => {
        document.querySelector("#content-setting").style.display          = "block";
        document.querySelector("#content-globe").style.display            = "none";
        document.querySelector(".text-setting").style.color               = "var(--accent-color800)";
        document.querySelector(".text-globe").style.color                 = "var(--system-gray500)";
        document.querySelector(".globe").style.fill                       = "var(--system-gray500)";
        document.querySelector(".setting").style.fill                     = "var(--accent-color800)";
    });

    var icon 　　　　　= document.getElementById("icon");
    var overlay 　　　= document.getElementById("overlay");
    var overlayImage = document.getElementById("overlay-image");

    icon.addEventListener("click", function() {
        var iconSrc = this.getAttribute("src");
        // オーバーレイの画像にアイコンのsrcを設定
        overlayImage.setAttribute("src", iconSrc);
        // オーバーレイ内の画像をクリック⇒非表示にしない
        overlayImage.addEventListener("click", function(event) {
            event.stopPropagation(); // イベントの伝播を停止
        });
        // オーバーレイを表示
        overlay.style.display     = "flex";
        overlayImage.style.width  = "150px";
        overlayImage.style.height = "150px";
    });
    // オーバーレイをクリック⇒非表示
    overlay.addEventListener("click", function() {
        overlay.style.display = "none";
    });

});

function redirectToSearchResult() {
    var departureValue       = document.querySelector(".list-departure").value;
    var keyword1Value        = document.querySelector(".keywords-pull-down-1").value;
    var keyword2Value        = document.querySelector(".keywords-pull-down-2").value;
    var keyword3Value        = document.querySelector(".keywords-pull-down-3").value;
    var keyword4Value        = document.querySelector(".keywords-pull-down-4").value;
    var budgetValue          = document.querySelector(".budget-picker").value;
    var timePicker1Value     = document.querySelector(".time-picker-1").value;
    var timePicker2Value     = document.querySelector(".time-picker-2").value;
    var footCheckboxValue    = document.querySelector("#foot").checked;
    var trainCheckboxValue   = document.querySelector("#train").checked;
    var carCheckboxValue     = document.querySelector("#car").checked;
    var bicycleCheckboxValue = document.querySelector("#bicycle").checked;
    var sortValue            = document.querySelector(".sort-pull-down").value;

    // 差分計算
    var startTime = new Date("2023-10-02T" + timePicker1Value);
    var endTime   = new Date("2023-10-02T" + timePicker2Value);
    var timeDiff  = endTime - startTime;

    if (timeDiff < 3600000 || timeDiff >= 18000001) {
        alert("時間の差分は1時間以上 5時間以下に設定してください。");
        return;
    }

    var queryParams = "?departure="   + departureValue +
                      "&keyword1="    + keyword1Value +
                      "&keyword2="    + keyword2Value +
                      "&keyword3="    + keyword3Value +
                      "&keyword4="    + keyword4Value +
                      "&budget="      + budgetValue +
                      "&timePicker1=" + timePicker1Value +
                      "&timePicker2=" + timePicker2Value +
                      "&timeDiff="    + timeDiff +
                      "&foot="        + footCheckboxValue +
                      "&train="       + trainCheckboxValue +
                      "&car="         + carCheckboxValue +
                      "&bicycle="     + bicycleCheckboxValue +
                      "&sort="        + sortValue;

    window.location.href = "search_result.html" + queryParams;
}