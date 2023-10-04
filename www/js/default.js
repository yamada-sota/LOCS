document.addEventListener('DOMContentLoaded', function() {
    // 下からスライドインする要素と戻るボタンの要素を取得
    const slideInContent = document.getElementById('slide-in-content');

    // ボタンをクリックしたときのアクションを定義
    document.getElementById('search-bar').addEventListener('click', () => {
        slideInContent.style.transform = 'translateY(0%)'; // 下からスライドイン
    });

    // スワイプ（タッチ）イベントを処理するための変数
    let touchStartY = 0;

    // タッチ開始時のY座標を記録
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    // タッチ終了時と開始時のY座標を比較
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY    = touchEndY - touchStartY;

        if (deltaY > 50) {
            slideInContent.style.transform = 'translateY(100%)'; // 下にスワイプして戻る
        }
    });

    // 初期マップ表示
    let map;
    function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
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
                    title: '現在位置'
                });
            });
        } else {
            alert('Geolocationがサポートされていません。');
        }
    }

    initMap();

    // マップ画面
    document.querySelector('.item-globe').addEventListener('click', () => {
        document.querySelector('#content-globe').style.display = 'block';
        document.querySelector('#content-setting').style.display = 'none';
        document.querySelector('.text-globe').style.color = 'var(--accent-color800)';
        document.querySelector('.text-setting').style.color = 'var(--system-gray500)';
    });

    // 設定画面
    document.querySelector('.item-setting').addEventListener('click', () => {
        document.querySelector('#content-setting').style.display = 'block';
        document.querySelector('#content-globe').style.display = 'none';
        document.querySelector('.text-setting').style.color = 'var(--accent-color800)';
        document.querySelector('.text-globe').style.color = 'var(--system-gray500)';
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
    var endTime = new Date("2023-10-02T" + timePicker2Value);
    var timeDiff = endTime - startTime;

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
