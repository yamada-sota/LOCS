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
    var mealCheckboxValue    = document.querySelector("#meal").checked;

    var queryParams = "?departure="   + departureValue +
                      "&keyword1="    + keyword1Value +
                      "&keyword2="    + keyword2Value +
                      "&keyword3="    + keyword3Value +
                      "&keyword4="    + keyword4Value +
                      "&budget="      + budgetValue +
                      "&timePicker1=" + timePicker1Value +
                      "&timePicker2=" + timePicker2Value +
                      "&foot="        + footCheckboxValue +
                      "&train="       + trainCheckboxValue +
                      "&car="         + carCheckboxValue +
                      "&bicycle="     + bicycleCheckboxValue +
                      "&sort="        + sortValue +
                      "&meal="        + mealCheckboxValue;

    window.location.href = "search_result.html" + queryParams;
}
