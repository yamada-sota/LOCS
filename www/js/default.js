document.addEventListener("DOMContentLoaded", function() {
    var userName        = document.getElementById("user-name");
    var locsId          = document.getElementById("locs-id");
    var mypageIconImage = document.getElementById("mypage-icon-image");
    var icon            = document.getElementById("icon");
    var savedPlanTitle  = document.getElementById("saved-plan-title");
    var savedPlanList   = document.getElementById("saved-plan-list");
    
    var currentUser = new ncmb.User.getCurrentUser();
    if (currentUser) {
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl         = reader.result;
            mypageIconImage.src = dataUrl;
            icon.src            = dataUrl;
        }
        var fileName = currentUser.get("objectId");
        var anonymous = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
        if (!anonymous) {
            ncmb.File.download(fileName, "blob")
                .then(function(blob) {
                    reader.readAsDataURL(blob);
                })
                .catch(function() {
                })
            userName.textContent = currentUser.get("userName");
            ncmb.User.fetchById(currentUser.get("objectId"))
                .then(function(user){
                    currentUser        = user;
                    locsId.textContent = currentUser.get("locsId");
                })
                .catch(function(){
                    ncmb.User.logout();
                    window.location.href = "index.html";
                });
            savedPlanTitle.textContent  = "保存プラン一覧";
            savedPlanList.style.display = "flex";

            // 保存プラン取得
            var planId = currentUser.get("objectId");
            var Plan   = ncmb.DataStore("Plan");
            Plan.equalTo("planId", planId)
                .order("createDate", true)
                .fetchAll()
                    .then(function (plans) {
                        displaySavedPlans(plans);
                    })
                    .catch(function (error) {
                        console.error(error);
                    });
        }
    }

    // 右からスライドイン
    var slideInContent2 = document.getElementById("slide-in-content2");
    var inputUserName   = document.getElementById("mypage-user-name-input");
    var inputId         = document.getElementById("mypage-id-input");
    var errorUserName   = document.querySelector(".mypage-user-name-error");
    var errorId         = document.querySelector(".mypage-id-error");

    var title               = document.querySelector(".title");
    var mypageIcon          = document.getElementById("mypage-icon");
    var mypageUserName      = document.querySelector(".mypage-user-name");
    var mypageId            = document.querySelector(".mypage-id");
    var cancelSave          = document.querySelector(".cancel-save");
    var logoutDeleteAccount = document.querySelector(".logout-delete-account");
    var userContainer       = document.querySelector(".user-container");

    document.getElementById("edit").addEventListener("click", () => {
        var currentUser      = new ncmb.User.getCurrentUser();
        var anonymous        = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
        var registerOrLogin1 = document.getElementById("register-or-login-1");
        var later            = document.querySelector(".later");
        if (anonymous) {
            title.textContent                 = "アカウント作成";
            mypageIcon.style.display          = "none";
            mypageUserName.style.display      = "none";
            mypageId.style.display            = "none";
            cancelSave.style.display          = "none";
            logoutDeleteAccount.style.display = "none";
            userContainer.style.display       = "flex";
            registerOrLogin1.textContent      = "新規登録";
            later.textContent                 = "";
            document.getElementById("confirm-button").addEventListener("click", function () {
                var email         = document.querySelector("#emailField").value;
                var userInput     = document.getElementById("user-input");
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
                                        userInput.innerHTML          = '<input type="email" id="emailField" class="user-field" placeholder="メールアドレス"><input type="password" style="display: block" minlength="8" id="passwordField" class="user-field" placeholder="パスワード">';
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
                            // 匿名会員の削除
                            currentUser.delete()
                                .then(function(){
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
                                })
                                .catch(function(){
                                });
                        }
                    }
                }
            });
            var createAccount = confirm("アカウントを作成しますか？");
            if (createAccount) {
                slideInContent2.style.transform = "translateX(0%)";
            }
        } else {
            slideInContent2.style.transform = "translateX(0%)";
        }
    });

    let touchStartX = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });
    document.addEventListener("touchend", (e) => {
        var touchEndX         = e.changedTouches[0].clientX;
        var deltaX            = touchEndX - touchStartX;
        var currentUser       = new ncmb.User.getCurrentUser();
        var anonymous         = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
        var registerOrLogin1  = document.getElementById("register-or-login-1");

        if (deltaX > 50) {
            if (anonymous) {
                if (registerOrLogin1.textContent === "新規登録") {
                    var emailField = document.getElementById("emailField");
                    var later      = document.getElementById("later");
                    if (emailField.value != "") {
                        var confirmCancel = confirm("入力が途中です。戻りますか？");
                        if (confirmCancel) {
                            slideInContent2.style.transform = "translateX(100%)";
                            emailField.value = "";
                            later.value      = "";
                        }
                    } else {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value = "";
                        later.value      = "";
                    }
                } else if (registerOrLogin1.textContent === "ログイン") {
                    var emailField    = document.getElementById("emailField");
                    var passwordField = document.getElementById("passwordField");
                    var later         = document.getElementById("later");
                    if (emailField.value != "" || passwordField != "") {
                        var confirmCancel = confirm("入力が途中です。戻りますか？\n戻ると新規登録からやり直しになります。");
                        if (confirmCancel) {
                            slideInContent2.style.transform = "translateX(100%)";
                            emailField.value    = "";
                            passwordField.value = "";
                            later.value         = "";
                        }
                    } else {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value    = "";
                        passwordField.value = "";
                        later.value         = "";
                    }
                }
            } else {
                if (inputUserName.value != "" || inputId.value != "") {
                    var confirmCancel = confirm("編集が途中です。戻りますか？");
                    if (confirmCancel) {
                        slideInContent2.style.transform = "translateX(100%)";
                        inputUserName.value = "";
                        inputId.value       = "";
                    }
                } else {
                    slideInContent2.style.transform = "translateX(100%)";
                    inputUserName.value = "";
                    inputId.value       = "";
                }
                slideInContent2.style.transform = "translateX(100%)";
            }
        }
    });

    document.getElementById("file-input").addEventListener("change", () => {
        var fileName    = currentUser.get("objectId");
        var fileInput   = document.getElementById("file-input").files[0];
        var canvas      = document.getElementById("canvas");
        var outputImage = document.getElementById("mypage-icon-image");
        var iconImage   = document.getElementById("icon");
        var ctx         = canvas.getContext("2d");

        if (fileInput) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const img = new Image();
                img.src   = e.target.result;
                img.onload = function () {
                    const size    = Math.min(img.width, img.height);
                    canvas.width  = size;
                    canvas.height = size;
                    const x = (img.width - size) / 2;
                    const y = (img.height - size) / 2;
                    ctx.drawImage(img, x, y, size, size, 0, 0, size, size);
                    outputImage.src = canvas.toDataURL("image/jpeg");
                    iconImage.src   = canvas.toDataURL("image/jpeg");
                    var fileData = toBlob(canvas.toDataURL("image/jpeg"), "image/jpeg");
                    ncmb.File.upload(fileName, fileData)
                        .then(function () {
                            var acl = new ncmb.Acl();
                            acl.setPublicReadAccess(true)
                                .setUserWriteAccess(currentUser, true);
                            ncmb.File.updateACL(fileName, acl)
                                .then(function(){
                                    alert("アイコンを変更しました。\n変更は自動で保存されています。");
                                })
                                .catch(function(){
                                });
                        })
                        .catch(function () {
                            alert("アイコンの変更に失敗しました。");
                        });
                };
            };
            reader.readAsDataURL(fileInput);
        }
    });

    document.getElementById("back").addEventListener("click", () => {
        var currentUser       = new ncmb.User.getCurrentUser();
        var anonymous         = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
        var registerOrLogin1  = document.getElementById("register-or-login-1");

        if (anonymous) {
            if (registerOrLogin1.textContent === "新規登録") {
                var emailField = document.getElementById("emailField");
                var later      = document.getElementById("later");
                if (emailField.value != "") {
                    var confirmCancel = confirm("入力が途中です。戻りますか？");
                    if (confirmCancel) {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value = "";
                        later.value      = "";
                    }
                } else {
                    slideInContent2.style.transform = "translateX(100%)";
                    emailField.value = "";
                    later.value      = "";
                }
            } else if (registerOrLogin1.textContent === "ログイン") {
                var emailField    = document.getElementById("emailField");
                var passwordField = document.getElementById("passwordField");
                var later         = document.getElementById("later");
                if (emailField.value != "" || passwordField != "") {
                    var confirmCancel = confirm("入力が途中です。戻りますか？\n戻ると新規登録からやり直しになります。");
                    if (confirmCancel) {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value    = "";
                        passwordField.value = "";
                        later.value         = "";
                    }
                } else {
                    slideInContent2.style.transform = "translateX(100%)";
                    emailField.value    = "";
                    passwordField.value = "";
                    later.value         = "";
                }
            }
        } else {
            if (inputUserName.value != "" || inputId.value != "") {
                var confirmCancel = confirm("編集が途中です。戻りますか？");
                if (confirmCancel) {
                    slideInContent2.style.transform = "translateX(100%)";
                    inputUserName.value             = "";
                    inputId.value                   = "";
                    errorUserName.textContent       = "1～10文字（記号以外）";
                    errorId.textContent             = "4～15文字（半角英数字のみ）";
                    errorUserName.style.color       = "var(--lightmain-80)";
                    errorId.style.color             = "var(--lightmain-80)";
                }
            } else {
                slideInContent2.style.transform = "translateX(100%)";
                inputUserName.value             = "";
                inputId.value                   = "";
                errorUserName.textContent       = "1～10文字（記号以外）";
                errorId.textContent             = "4～15文字（半角英数字のみ）";
                errorUserName.style.color       = "var(--lightmain-80)";
                errorId.style.color             = "var(--lightmain-80)";
            }
        }
    });
    document.getElementById("cancel").addEventListener("click", () => {
        if (inputUserName.value != "" || inputId.value != "") {
            var confirmCancel = confirm("編集が途中です。キャンセルしますか？");
            if (confirmCancel) {
                slideInContent2.style.transform = "translateX(100%)";
                inputUserName.value             = "";
                inputId.value                   = "";
                errorUserName.textContent       = "1～10文字（記号以外）";
                errorId.textContent             = "4～15文字（半角英数字のみ）";
                errorUserName.style.color       = "var(--lightmain-80)";
                errorId.style.color             = "var(--lightmain-80)";
            }
        } else {
            slideInContent2.style.transform = "translateX(100%)";
            inputUserName.value             = "";
            inputId.value                   = "";
            errorUserName.textContent       = "1～10文字（記号以外）";
            errorId.textContent             = "4～15文字（半角英数字のみ）";
            errorUserName.style.color       = "var(--lightmain-80)";
            errorId.style.color             = "var(--lightmain-80)";
        }
    });
    document.getElementById("save").addEventListener("click", () => {
        var patternUserName = /^[A-Za-z0-9ぁ-んァ-ン一-龠々〆〤]+$/;
        var patternId       = /^[0-9a-zA-Z]+$/;
        var isValid         = true;
        
        if (inputUserName.value === "") {
            inputUserName.value = userName.textContent;
        } else if (inputUserName.value.length > 10) {
            errorUserName.textContent = "10文字以下にしてください。";
            errorUserName.style.color = "var(--lighterror)";
            isValid                   = false;
        }
        
        if (inputId.value === "") {
            inputId.value = locsId.textContent;
        } else if (inputId.value.length > 15) {
            errorId.textContent = "15文字以下にしてください。";
            errorId.style.color = "var(--lighterror)";
            isValid             = false;
        } else if (inputId.value.length < 4) {
            errorId.textContent = "4文字以上にしてください。";
            errorId.style.color = "var(--lighterror)";
            isValid             = false;
        }
        
        if (!inputUserName.value.match(patternUserName)) {
            errorUserName.textContent = "使用不可な文字列があります。";
            errorUserName.style.color = "var(--lighterror)";
            isValid                   = false;
        } else if (!inputId.value.match(patternId)) {
            errorId.textContent = "使用不可な文字列があります。";
            errorId.style.color = "var(--lighterror)";
            isValid             = false;
        }

        if (isValid) {
            currentUser
                .set("userName", inputUserName.value)
                .set("locsId", inputId.value)
                .update()
                .then(function() {
                    alert("変更を保存しました。");
                    inputUserName.value = "";
                    inputId.value       = "";
                    errorUserName.textContent   = "1～10文字（記号以外）";
                    errorId.textContent         = "4～15文字（半角英数字のみ）";
                    errorUserName.style.color   = "var(--lightmain-80)";
                    errorId.style.color         = "var(--lightmain-80)";
                    currentUser                 = new ncmb.User.getCurrentUser();
                    userName.textContent        = currentUser.get("userName");
                    locsId.textContent          = currentUser.get("locsId");
                })
                .catch(function() {
                    alert("保存に失敗しました。");
                });
        }
    });
    document.getElementById("logout").addEventListener("click", () => {
        var confirmLogout = confirm("ログアウト\n続行しますか？");
        if (confirmLogout) {
            ncmb.User.logout()
                .then(function(){
                    localStorage.clear();
                    window.location.href = "index.html";
                })
                .catch(function(){
                    alert("ログアウトに失敗しました。");
                });
        }
    });
    document.getElementById("delete-account").addEventListener("click", () => {
        var confirmDeleteAccount = confirm("アカウント削除\n続行しますか？");
        if (confirmDeleteAccount) {
            var fileName    = currentUser.get("objectId");
            var outputImage = document.getElementById("mypage-icon-image");
            if (outputImage.src != "https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/Avatar") {
                ncmb.File.delete(fileName)
                    .then(function(){
                    })
                    .catch(function(){
                        alert("アイコンファイルの削除に失敗しました。");
                    });
            }
            currentUser.delete()
                .then(function(){
                    window.location.href = "index.html";
                })
                .catch(function(){
                    alert("アカウントの削除に失敗しました。");
                });
        }
    });

    // マップ画面
    document.querySelector(".item-globe").addEventListener("click", () => {
        if (slideInContent2.style.transform === "translateX(0%)") {
            var currentUser       = new ncmb.User.getCurrentUser();
            var anonymous         = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
            var registerOrLogin1  = document.getElementById("register-or-login-1");

            if (anonymous) {
                if (registerOrLogin1.textContent === "新規登録") {
                    var emailField = document.getElementById("emailField");
                    var later      = document.getElementById("later");
                    if (emailField.value != "") {
                        var confirmCancel = confirm("入力が途中です。戻りますか？");
                        if (confirmCancel) {
                            slideInContent2.style.transform = "translateX(100%)";
                            emailField.value = "";
                            later.value      = "";
                            document.querySelector("#content-globe").style.display   = "block";
                            document.querySelector("#content-setting").style.display = "none";
                            document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                            document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                            document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                            document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                        }
                    } else {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value = "";
                        later.value      = "";
                        document.querySelector("#content-globe").style.display   = "block";
                        document.querySelector("#content-setting").style.display = "none";
                        document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                        document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                        document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                        document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                    }
                } else if (registerOrLogin1.textContent === "ログイン") {
                    var emailField    = document.getElementById("emailField");
                    var passwordField = document.getElementById("passwordField");
                    var later         = document.getElementById("later");
                    if (emailField.value != "" || passwordField != "") {
                        var confirmCancel = confirm("入力が途中です。戻りますか？\n戻ると新規登録からやり直しになります。");
                        if (confirmCancel) {
                            slideInContent2.style.transform = "translateX(100%)";
                            emailField.value    = "";
                            passwordField.value = "";
                            later.value         = "";
                            document.querySelector("#content-globe").style.display   = "block";
                            document.querySelector("#content-setting").style.display = "none";
                            document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                            document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                            document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                            document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                        }
                    } else {
                        slideInContent2.style.transform = "translateX(100%)";
                        emailField.value    = "";
                        passwordField.value = "";
                        later.value         = "";
                        document.querySelector("#content-globe").style.display   = "block";
                        document.querySelector("#content-setting").style.display = "none";
                        document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                        document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                        document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                        document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                    }
                }
            } else {
                if (inputUserName.value != "" || inputId.value != "") {
                    var confirmCancel = confirm("編集が途中です。戻りますか？");
                    if (confirmCancel) {
                        slideInContent2.style.transform = "translateX(100%)";
                        inputUserName.value             = "";
                        inputId.value                   = "";
                        errorUserName.textContent       = "1～10文字（記号以外）";
                        errorId.textContent             = "4～15文字（半角英数字のみ）";
                        errorUserName.style.color       = "var(--lightmain-80)";
                        errorId.style.color             = "var(--lightmain-80)";
                        document.querySelector("#content-globe").style.display   = "block";
                        document.querySelector("#content-setting").style.display = "none";
                        document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                        document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                        document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                        document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                    }
                } else {
                    slideInContent2.style.transform = "translateX(100%)";
                    inputUserName.value             = "";
                    inputId.value                   = "";
                    errorUserName.textContent       = "1～10文字（記号以外）";
                    errorId.textContent             = "4～15文字（半角英数字のみ）";
                    errorUserName.style.color       = "var(--lightmain-80)";
                    errorId.style.color             = "var(--lightmain-80)";
                    document.querySelector("#content-globe").style.display   = "block";
                    document.querySelector("#content-setting").style.display = "none";
                    document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
                    document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
                    document.querySelector(".globe").style.fill              = "var(--accent-color800)";
                    document.querySelector(".setting").style.fill            = "var(--system-gray500)";
                }
            }
        } else {
            document.querySelector("#content-globe").style.display   = "block";
            document.querySelector("#content-setting").style.display = "none";
            document.querySelector(".text-globe").style.color        = "var(--accent-color800)";
            document.querySelector(".text-setting").style.color      = "var(--system-gray500)";
            document.querySelector(".globe").style.fill              = "var(--accent-color800)";
            document.querySelector(".setting").style.fill            = "var(--system-gray500)";
        }
    });

    // 設定画面
    document.querySelector(".item-setting").addEventListener("click", () => {
        document.querySelector("#content-setting").style.display = "block";
        document.querySelector("#content-globe").style.display   = "none";
        document.querySelector(".text-setting").style.color      = "var(--accent-color800)";
        document.querySelector(".text-globe").style.color        = "var(--system-gray500)";
        document.querySelector(".globe").style.fill              = "var(--system-gray500)";
        document.querySelector(".setting").style.fill            = "var(--accent-color800)";
    });

    var icon            = document.getElementById("icon");
    var overlayImage    = document.getElementById("overlay-image");
    var userIconOverlay = document.getElementById("user-icon-overlay");

    icon.addEventListener("click", function() {
        var iconSrc = this.getAttribute("src");
        // オーバーレイの画像にアイコンのsrcを設定
        userIconOverlay.setAttribute("src", iconSrc);
        // オーバーレイ内の画像をクリック⇒非表示にしない
        userIconOverlay.addEventListener("click", function(event) {
            event.stopPropagation(); // イベントの伝播を停止
        });
        // オーバーレイを表示
        overlayImage.style.display   = "flex";
        userIconOverlay.style.width  = "200px";
        userIconOverlay.style.height = "200px";
    });
    // オーバーレイをクリック⇒非表示
    overlayImage.addEventListener("click", function() {
        overlayImage.style.display = "none";
    });

});

// base64形式の画像データとMIMEタイプを指定して、Blobオブジェクトを生成
function toBlob(base64, mime_type) {
    var bin = atob(base64.replace(/^.*,/, ''));
    var buffer = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i);
    }

    try{
        var blob = new Blob([buffer.buffer], {
            type: mime_type
        });
    }catch (e){
        return false;
    }
    return blob;
}

// 保存プランをテーブルに表示
function displaySavedPlans(plans) {
    var tableBody       = document.getElementById("plan-table-body");
    tableBody.innerHTML = "";

    plans.forEach(function (plan) {
        var row      = document.createElement("tr");
        var timeCell = document.createElement("td");
        var nameCell = document.createElement("td");

        var createDate    = plan.get("createDate");
        var formattedDate = formatDate(createDate);
        var planName      = plan.get("planName");

        timeCell.textContent = formattedDate;
        nameCell.textContent = planName;

        nameCell.addEventListener("click", function() {
            displayOverlay(plan);
        });

        row.appendChild(timeCell);
        row.appendChild(nameCell);

        tableBody.appendChild(row);
    });
}

// 保存時間を適切な形式にフォーマット
function formatDate(date) {
    var options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
    return new Date(date).toLocaleString("ja-JP", options);
}