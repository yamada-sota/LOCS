var map, watchID, marker, circle;
var iconRotation = 0;

function initMap() {
    var mapOptions = {
        zoom: 15,
        mapId: "2e1aed6c4c23f06a",
        disableDefaultUI: true,
        isFractionalZoomEnabled: true,
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // 位置情報の監視を開始
    watchID = navigator.geolocation.watchPosition(
        function (position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
            );

            // 以前のマーカーとサークルを削除
            if (marker) {
                marker.setMap(null);
            }
            if (circle) {
                circle.setMap(null);
            }

            // 回転角度
            var newIconRotation = position.coords.heading || 0;

            // アイコンを作成
            var customIcon = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "rgba(156, 124, 69, 1)",
                strokeWeight: 3,
                scale: 5,
                rotation: newIconRotation,
            };

            // マーカーを作成
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                icon: customIcon,
            });
            var iconDiv = marker.getIcon().anchor;
            if (iconDiv) {
                iconDiv.style.transform = "rotate(" + newIconRotation + "deg)";
            }

            // サークルを作成
            circle = new google.maps.Circle({
                strokeColor: "rgba(193, 161, 78, 1)",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "rgba(215, 182, 83, 1)",
                fillOpacity: 0.1,
                map: map,
                draggable: false,
                center: latLng,
                radius: position.coords.accuracy, // 誤差の単位：m
            });

            // マップを中心に移動
            map.setCenter(latLng);
            // マップを回転
            map.setHeading(newIconRotation);

            // 回転角度の更新
            iconRotation = newIconRotation;
        },
        function () {
            alert("位置情報の取得に失敗しました");
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
        },
    );
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("current-location-button").addEventListener("click", function () {
        if (watchID) {
            navigator.geolocation.clearWatch(watchID);
        }
        initMap();
    });
});

var waitingForPin = true;
var myLatLng      = 0;
function handlePinPlacement() {
    if (marker) {
        marker.setMap(null);
    }

    // マップ上でクリックした位置にピンを設置
    google.maps.event.addListener(map, "click", function (event) {
        if (marker) {
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            icon: "https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/Pin",
        });

        myLatLng = event.latLng;
    });
    waitingForPin = false;
}

function searchLocation() {
    var currentLocationButton           = document.getElementById("current-location-button");
    var confirmPinButton                = document.getElementById("confirm-pin-button");
    var placesService                   = new google.maps.places.PlacesService(map);
    var generatePlan                    = document.getElementById("generate-plan");
    currentLocationButton.style.display = "none";
    generatePlan.style.display          = "flex";

    var departure = document.getElementById("departure").value;
    var keyword1  = document.getElementById("keywords1").value;
    var keyword2  = document.getElementById("keywords2").value;
    var keyword3  = document.getElementById("keywords3").value;
    var keyword4  = document.getElementById("keywords4").value;
    var budget    = document.getElementById("budget").value;
    var time1     = document.getElementById("time1").value;
    var time2     = document.getElementById("time2").value;
    var foot      = document.getElementById("foot").checked;
    var train     = document.getElementById("train").checked;
    var car       = document.getElementById("car").checked;
    var bicycle   = document.getElementById("bicycle").checked;
    var sort      = document.getElementById("sort").value;

    // 差分計算
    // var startTime = new Date("2023-10-02T" + timePicker1);
    // var endTime   = new Date("2023-10-02T" + timePicker2);
    // var timeDiff  = endTime - startTime;
    // if (timeDiff < 3600000 || timeDiff >= 18000001) {
    //     alert("時間の差分は1時間以上 5時間以下に設定してください。");
    //     return;
    // }

    navigator.geolocation.clearWatch(watchID);
    if (marker) {
        marker.setMap(null);
    }
    if (circle) {
        circle.setMap(null);
    }

    const keywords = [];
    function addKeyword(keyword) {
        if (keyword && !keywords.includes(keyword)) {
            keywords.push(keyword);
        }
    }
    addKeyword(keyword1);
    addKeyword(keyword2);
    addKeyword(keyword3);
    addKeyword(keyword4);
    
    var slideInContent = document.getElementById("slide-in-content");

    if (departure === "pin") {
        slideInContent.style.transform = "translateY(100%)";
        confirmPinButton.style.display = "flex";

        handlePinPlacement();
    } else {
        // 非同期処理を制御するためのPromiseを返す関数
        function geocodeKeyword(keyword) {
            return new Promise((resolve, reject) => {
                // Places APIで検索
                var request = {
                    query: keyword,
                    fields: ["name", "geometry"]
                };
                placesService.findPlaceFromQuery(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        var placeLocation = results[0].geometry.location;
                        map.setCenter(placeLocation);
                        marker = new google.maps.Marker({
                            map: map,
                            position: placeLocation,
                        });
                        resolve(results);
                    } else {
                        reject("場所が見つかりません：" + keyword);
                    }
                });
            });
        }

        // Promiseを順番に実行
        (async () => {
            for (let i = 0; i < keywords.length; i++) {
                try {
                    const results = await geocodeKeyword(keywords[i]);
                    console.log(i + 1 + "件目：", results[0]);
                } catch (error) {
                    console.error(error);
                }
            }
            generatePlan.style.display     = "none";
            slideInContent.style.transform = "translateY(100%)";
        })();
    }

    confirmPinButton.addEventListener("click", function() {
        if (waitingForPin) {
            alert("ピンを設置してください。");
            return;
        }

        confirmPinButton.style.display      = "none";
        currentLocationButton.textContent   = "プランの再生成";
        currentLocationButton.style.display = "flex";

        // 非同期処理を制御するためのPromiseを返す関数
        function geocodeKeyword(keyword) {
            return new Promise((resolve, reject) => {
                // Places APIで検索
                var request = {
                    location: myLatLng,
                    query: keyword,
                    fields: ["name", "geometry"]
                };
                placesService.textSearch(request, (results, status) => {
                    if (status === google.maps.places.PlacesServiceStatus.OK) {
                        var placeLocation = results[0].geometry.location;
                        map.setCenter(placeLocation);
                        marker = new google.maps.Marker({
                            map: map,
                            position: placeLocation,
                        });
                        resolve(results);
                    } else {
                        reject("場所が見つかりません：" + keyword);
                    }
                });
            });
        }

        // Promiseを順番に実行
        (async () => {
            for (let i = 0; i < keywords.length; i++) {
                try {
                    const results = await geocodeKeyword(keywords[i]);
                    console.log(i + 1 + "件目：", results[0]);
                } catch (error) {
                    console.error(error);
                }
            }
            generatePlan.style.display     = "none";
            slideInContent.style.transform = "translateY(100%)";
        })();
    });
}
