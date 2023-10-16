document.addEventListener("DOMContentLoaded", function() {
    var applicationkey = "4dbb3d327127b2dec06b84deb304f3ce92a90fe3f413b160fbd7ad902ab74926";
    var clientkey      = "dcd03e138124816b36a669ca227f97268de84662f737a23fc4a85aa2cd327d16"; 
    var ncmb           = new NCMB(applicationkey, clientkey);
    var userName       = document.getElementById("user-name");
    var locsId         = document.getElementById("locs-id");
    var mypageIcon     = document.getElementById("mypage-icon-image");
    var icon           = document.getElementById("icon");
    var avatar         = "https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/Avatar";
    
    var currentUser  = new ncmb.User.getCurrentUser();
    if (currentUser) {
        var reader = new FileReader();
        reader.onload = function() {
            var dataUrl    = reader.result;
            mypageIcon.src = dataUrl;
            icon.src       = dataUrl;
        }
        var fileName = currentUser.get("objectId");
        ncmb.File.download(fileName, "blob")
            .then(function(blob) {
                reader.readAsDataURL(blob);
            })
            .catch(function() {
                mypageIcon.src = avatar;
                icon.src       = avatar;
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
    }

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
                var userLocation = {
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
    // initMap();

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

    // 右からスライドイン
    var slideInContent2 = document.getElementById("slide-in-content2");
    var inputUserName   = document.getElementById("mypage-user-name-input");
    var inputId         = document.getElementById("mypage-id-input");
    var errorUserName   = document.querySelector(".mypage-user-name-error");
    var errorId         = document.querySelector(".mypage-id-error");

    document.getElementById("edit").addEventListener("click", () => {
        slideInContent2.style.transform = "translateX(0%)";
    });
    let touchStartX = 0;
    document.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
    });
    document.addEventListener("touchend", (e) => {
        var touchEndX = e.changedTouches[0].clientX;
        var deltaX    = touchEndX - touchStartX;

        if (deltaX > 50) {
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
                .catch(function(error){
                    alert("ログアウトに失敗しました。");
                });
        }
    });
    document.getElementById("delete-account").addEventListener("click", () => {
        var confirmDeleteAccount = confirm("アカウント削除\n続行しますか？");
        if (confirmDeleteAccount) {
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

    var icon         = document.getElementById("icon");
    var overlay      = document.getElementById("overlay");
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
        overlayImage.style.width  = "200px";
        overlayImage.style.height = "200px";
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