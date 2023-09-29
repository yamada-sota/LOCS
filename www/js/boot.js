document.addEventListener("DOMContentLoaded", function () {
    var confirmButton = document.getElementById("confirm-button");
    var transitionLink = document.getElementById("transition-link");
    
    // ニックネームが入力されている場合、確定ボタンを押すとフェードアウト＆インでページ遷移
    confirmButton.addEventListener("click", function () {
        var nicknameInput = document.querySelector(".nickname-input-field");
        var nickname = nicknameInput.value.trim();
        if (nickname === "") {
            alert("ニックネームを入力してください。");
        } else {
            document.body.classList.add("page-transitioning");
            setTimeout(function () {
                window.location.href = "defaultA.html";
            }, 250);
        }
    });
    // ページ読み込み時にloadedクラスを追加
    document.body.classList.add("loaded");

    // スキップボタンを押すとフェードアウト＆インでページ遷移
    transitionLink.addEventListener("click", function (e) {
        e.preventDefault(); // リンクのデフォルトの動作をキャンセル
        document.body.classList.add("page-transitioning");
        setTimeout(function () {
            window.location.href = transitionLink.href;
        }, 250);
    });
});
