document.addEventListener("DOMContentLoaded", function () {  
    // ニックネームが入力されている場合、確定ボタンを押すとフェードアウト＆インでページ遷移
    document.getElementById("confirm-button").addEventListener("click", function () {
        var email = document.querySelector("#emailField").value;
        var password = document.querySelector("#passwordField").value;
        var confirmpassword = document.querySelector("#confirmpasswordField").value;
        var later = document.querySelector(".later");
        
        if (email === "" || password === "" || confirmpassword === "") {
            later.textContent = "未入力の欄があります。";
            later.style.color = "var(--lighterror)";
            return;
        } else {
            if (password.length < 8) {
                later.textContent = "パスワードは8文字以上で設定してください。";
                later.style.color = "var(--lighterror)";
                return;
            } else if (password !== confirmpassword) {
                later.textContent = "パスワードが一致しません。";
                later.style.color = "var(--lighterror)";
                return;
            } else {
                later.textContent = "登録しました。";
                later.style.color = "var(--statussucess)";

                // SQLite DBに接続
                var db = window.sqlitePlugin.openDatabase({ name: 'my.db' });

                // テーブルを作成
                db.transaction(function(tx) {
                    tx.executeSql('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)');
                });

                // DBに挿入
                db.transaction(function(tx) {
                    tx.executeSql('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function(tx, res) {
                        document.body.classList.add("page-transitioning");
                        setTimeout(function () {
                            window.location.href = "defaultA.html";
                        }, 250);
                        // ページ読み込み時にloadedクラスを追加
                        document.body.classList.add("loaded");
                    }, function(error) {
                        alert('登録に失敗しました: ' + error.message);
                    });
                });

                
            }
        }
    });
    
});

document.addEventListener("DOMContentLoaded", function () {
    // スキップボタンを押すとフェードアウト＆インでページ遷移
    document.getElementById("skip-button").addEventListener("click", function (e) {
        e.preventDefault(); // リンクのデフォルト動作をキャンセル

        var email = document.querySelector("#emailField").value;
        var password = document.querySelector("#passwordField").value;
        var confirmpassword = document.querySelector("#confirmpasswordField").value;
        
        if (email !== "" || password !== "" || confirmpassword !== "") {
            var confirmSkip = confirm("入力が途中です。スキップしますか？");
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