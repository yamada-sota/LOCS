document.addEventListener("DOMContentLoaded", function() {
    var applicationkey   = "4dbb3d327127b2dec06b84deb304f3ce92a90fe3f413b160fbd7ad902ab74926";
    var clientkey        = "dcd03e138124816b36a669ca227f97268de84662f737a23fc4a85aa2cd327d16"; 
    var ncmb             = new NCMB(applicationkey, clientkey);
    var registerOrLogin1 = document.getElementById("register-or-login-1");
    var registerOrLogin2 = document.getElementById("register-or-login-2");
    var userInput        = document.getElementById("user-input");
    var userContainer    = document.querySelector(".user-container");
    var skipButton       = document.getElementById("skip-button");
    var later            = document.querySelector(".later");

    var currentUser = new ncmb.User.getCurrentUser();
    if (Object.keys(currentUser).length > 0) {
        var currentUserName = currentUser.get("userName");
        userContainer.innerHTML          = '<p style="font-size: 4vw"><span>ようこそ、</span><span style="font-weight: 700; font-size: 156%">' + currentUserName + '</span></p>';
        userContainer.style.bottom       = "28%";
        skipButton.style.display         = "none";
        registerOrLogin2.style.display   = "none";
        var tipsDiv = document.querySelector(".tips");
        tipsDiv.style.display = "flex";
        const tips = [
            "ユーザー名はマイページで変更できます。",
            "ユーザー名・LOCS IDは全体に公開されます。",
            "LOCS IDはあなただけのIDです。",
            "作成したプランはマイページに保存できます。",
        ];
        const randomTip         = tips[Math.floor(Math.random() * tips.length)];
        const spanElement       = document.querySelector(".random-tips");
        spanElement.textContent = randomTip;
        spanElement.style.color = "var(--lightmain-80)";
        setTimeout(function () {
            document.body.classList.add("page-transitioning");
            setTimeout(function () {
                window.location.href = "default.html";
            }, 250);
            // ページ読み込み時にloadedクラスを追加
            document.body.classList.add("loaded");
        }, 1000);
    } else {
        registerOrLogin2.addEventListener("click", function () {
            if (registerOrLogin1.textContent === "新規登録") {
                registerOrLogin1.textContent = "ログイン";
                registerOrLogin2.textContent = "新規登録画面へ";
                userInput.innerHTML          = '<input type="email" id="emailField" class="user-field" placeholder="メールアドレス"><input type="password" style="display: block" minlength="8" id="passwordField" class="user-field" placeholder="パスワード">';
                userContainer.style.bottom   = "20%";
                skipButton.style.display     = "none";
                later.textContent            = "";
            } else if (registerOrLogin1.textContent === "ログイン") {
                registerOrLogin1.textContent = "新規登録";
                registerOrLogin2.textContent = "ログイン画面へ";
                userInput.innerHTML          = '<input type="email" id="emailField" class="user-field" placeholder="メールアドレス">';
                userContainer.style.bottom   = "25%";
                skipButton.style.display     = "inline-flex";
                later.textContent            = "あとから登録できます。";
                later.style.color            = "var(--lightmain-80)";
            }
        });

        document.getElementById("confirm-button").addEventListener("click", function () {
            var email         = document.querySelector("#emailField").value;
            var confirmButton = document.querySelector(".confirm");
            
            if (registerOrLogin1.textContent === "新規登録") {
                if (email === "") {
                    later.textContent = "メールアドレスが未入力です。";
                    later.style.color = "var(--lighterror)";
                    return;
                } else {
                    if (!email.includes("@")){
                        later.innerHTML   = "メールアドレスの形式が<br>正しくありません。";
                        later.style.color = "var(--lighterror)";
                        return;
                    } else {
                        // ユーザーデータをDBに保存
                        ncmb.User.requestSignUpEmail(email)
                            .then(function () {
                                later.innerHTML   = "新規登録案内メールを<br>送信しました。";
                                later.style.color = "var(--lightsuccess)";
                                setTimeout(function () {
                                    registerOrLogin1.textContent = "ログイン";
                                    registerOrLogin2.textContent = "新規登録画面へ";
                                    userInput.innerHTML          = '<input type="email" id="emailField" class="user-field" placeholder="メールアドレス"><input type="password" style="display: block" minlength="8" id="passwordField" class="user-field" placeholder="パスワード">';
                                    userContainer.style.bottom   = "20%";
                                    skipButton.style.display     = "none";
                                    later.textContent            = "";
                                }, 2000);
                            })
                            .catch(function (error) {
                                later.innerHTML   = "登録に失敗しました。<br>エラーコード：" + error.code;
                                later.style.color = "var(--lighterror)";
                            });
                    }
                }
            } else if (registerOrLogin1.textContent === "ログイン") {
                var password = document.querySelector("#passwordField").value;
                if (email === "" || password === "") {
                    later.textContent = "未入力の欄があります。";
                    later.style.color = "var(--lighterror)";
                    return;
                } else {
                    if (!email.includes("@")){
                        later.innerHTML   = "メールアドレスの形式が<br>正しくありません。";
                        later.style.color = "var(--lighterror)";
                        return;
                    } else {
                        // ログイン
                        ncmb.User.loginWithMailAddress(email, password)
                            .then(function(user) {
                                var acl = new ncmb.Acl();
                                acl.setPublicReadAccess(true)
                                    .setUserWriteAccess(user, true);
                                user.set("acl", acl)
                                    .update()
                                        .then(function() {
                                        })
                                        .catch(function() {
                                        });
                                later.textContent           = "ログインに成功しました。";
                                later.style.color           = "var(--lightsuccess)";
                                confirmButton.style.display = "none";
                                setTimeout(function () {
                                    document.body.classList.add("page-transitioning");
                                    setTimeout(function () {
                                        window.location.href = "default.html";
                                    }, 250);
                                    // ページ読み込み時にloadedクラスを追加
                                    document.body.classList.add("loaded");
                                }, 800);
                            })
                            .catch(function (error) {
                                later.innerHTML   = "ログインに失敗しました。<br>エラーコード：" + error.code;
                                later.style.color = "var(--lighterror)";
                            });
                    }
                }
            }
        });

        document.getElementById("skip-button").addEventListener("click", function (e) {
            e.preventDefault(); // リンクのデフォルト動作をキャンセル
            var email = document.querySelector("#emailField").value;
            
            if (email !== "") {
                var confirmSkip = confirm("入力が途中です。スキップしますか？");
                if (confirmSkip) {
                    ncmb.User.loginAsAnonymous()
                        .then(function(){
                            document.body.classList.add("page-transitioning");
                            setTimeout(function () {
                                window.location.href = "default.html";
                            }, 250);
                        })
                        .catch(function(){
                            // エラー処理
                        });
                }
            } else {
                ncmb.User.loginAsAnonymous()
                    .then(function(anonymousUser){
                        var acl = new ncmb.Acl();
                        acl.setPublicReadAccess(true)
                            .setUserWriteAccess(anonymousUser, true);
                        anonymousUser.set("acl", acl)
                            .update()
                                .then(function() {
                                })
                                .catch(function() {
                                });
                        document.body.classList.add("page-transitioning");
                        setTimeout(function () {
                            window.location.href = "default.html";
                        }, 250);
                    })
                    .catch(function(){
                        // エラー処理
                    });
            }
        });
        // ページ読み込み時にloadedクラスを追加
        document.body.classList.add("loaded");
    }
});