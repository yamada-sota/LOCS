document.addEventListener("DOMContentLoaded", function () {
    var confirmButton = document.getElementById("confirm-button");
    
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
});

document.addEventListener("DOMContentLoaded", function () {
    var skipButton = document.getElementById("skip-button");
    
    // スキップボタンを押すとフェードアウト＆インでページ遷移
    skipButton.addEventListener("click", function (e) {
        e.preventDefault(); // リンクのデフォルト動作をキャンセル

        var nicknameInput = document.querySelector(".nickname-input-field");
        var nickname = nicknameInput.value.trim();
        
        if (nickname !== "") {
            var confirmSkip = confirm("ニックネームが入力されています。本当にスキップしますか？");
            if (confirmSkip) {
                document.body.classList.add("page-transitioning");
                setTimeout(function () {
                    window.location.href = "default.html";
                }, 250);
            }
        } else {
            document.body.classList.add("page-transitioning");
            setTimeout(function () {
                window.location.href = "default.html";
            }, 250);
        }
    });
    // ページ読み込み時にloadedクラスを追加
    document.body.classList.add("loaded");
});
