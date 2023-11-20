var map, watchID, currentMarker, pinMarker, spotMarker, circle, iconDiv;
var iconRotation = 0;

document.addEventListener("DOMContentLoaded", function() {
    var currentLocationButton = document.getElementById("current-location-button");
    currentLocationButton.addEventListener("click", function () {
        if (watchID) {
            navigator.geolocation.clearWatch(watchID);
        }
        if (currentLocationButton.textContent === "現在地を追跡する") {
            reInitMap();
            currentLocationButton.textContent = "現在地の追跡をやめる";
        } else if (currentLocationButton.textContent === "現在地の追跡をやめる") {
            navigator.geolocation.clearWatch(watchID);
            currentLocationButton.textContent = "現在地を追跡する";
        }
    });

    var changeDisplayButton = document.getElementById("change-display-button");
    var mapDisplay          = document.getElementById("map");
    var planDisplay         = document.getElementById("plan");
    var searchBar           = document.getElementById("search-bar");
    changeDisplayButton.addEventListener("click", function () {
        if (changeDisplayButton.textContent === "プラン表示に変える") {
            navigator.geolocation.clearWatch(watchID);
            mapDisplay.style.display            = "none";
            planDisplay.style.display           = "inline";
            changeDisplayButton.textContent     = "地図表示に変える";
            currentLocationButton.textContent   = "現在地を追跡する";
            currentLocationButton.style.display = "none";
            searchBar.style.display             = "none";
        } else if (changeDisplayButton.textContent === "地図表示に変える") {
            mapDisplay.style.display            = "inline";
            planDisplay.style.display           = "none";
            changeDisplayButton.textContent     = "プラン表示に変える";
            currentLocationButton.style.display = "flex";
            searchBar.style.display             = "flex";
        }
    });

});

function initMap() {
    var mapOptions = {
        zoom: 18,
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

            // アイコンを作成
            var customIcon = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "rgba(156, 124, 69, 1)",
                strokeWeight: 3,
                scale: 5,
                rotation: newIconRotation,
            };

            if (currentMarker) {
                currentMarker.setPosition(latLng);
                currentMarker.setIcon({
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "rgba(156, 124, 69, 1)",
                    strokeWeight: 3,
                    scale: 5,
                    rotation: newIconRotation,
                });
            } else {
                currentMarker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: customIcon,
                });
            }
            if (circle) {
                circle.setCenter(latLng);
                circle.setRadius(position.coords.accuracy);
            } else {
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
            }

            // 回転角度
            var newIconRotation = position.coords.heading || 0;

            if (currentMarker.getIcon()) {
                iconDiv = currentMarker.getIcon().anchor;
            }
            if (iconDiv) {
                iconDiv.style.transform = "rotate(" + newIconRotation + "deg)";
            }

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

function reInitMap() {
    // 位置情報の監視を開始
    watchID = navigator.geolocation.watchPosition(
        function (position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
            );

            // アイコンを作成
            var customIcon = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "rgba(156, 124, 69, 1)",
                strokeWeight: 3,
                scale: 5,
                rotation: newIconRotation,
            };

            if (currentMarker) {
                currentMarker.setPosition(latLng);
                currentMarker.setIcon({
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    strokeColor: "rgba(156, 124, 69, 1)",
                    strokeWeight: 3,
                    scale: 5,
                    rotation: newIconRotation,
                });
            } else {
                currentMarker = new google.maps.Marker({
                    position: latLng,
                    map: map,
                    icon: customIcon,
                });
            }
            if (circle) {
                circle.setCenter(latLng);
                circle.setRadius(position.coords.accuracy);
            } else {
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
            }

            // 回転角度
            var newIconRotation = position.coords.heading || 0;

            if (currentMarker.getIcon()) {
                iconDiv = currentMarker.getIcon().anchor;
            }
            if (iconDiv) {
                iconDiv.style.transform = "rotate(" + newIconRotation + "deg)";
            }

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

var waitingForPin = true;
var myLatLng      = 0;
function handlePinPlacement() {
    if (pinMarker) {
        pinMarker.setMap(null);
    }

    // マップ上でクリックした位置にピンを設置
    google.maps.event.addListener(map, "click", function (event) {
        if (pinMarker) {
            pinMarker.setMap(null);
        }

        pinMarker = new google.maps.Marker({
            position: event.latLng,
            map: map,
            icon: "https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/Pin",
        });

        myLatLng = event.latLng;
    });
    waitingForPin = false;
}

var spotMarkers  = [];
var spotNames    = [];
var stayingTimes = [];
var photoUrls    = [];
var mapUrls      = [];
function searchLocation() {
    navigator.geolocation.clearWatch(watchID);

    var planNameField   = document.getElementById("plan-name-field");
    planNameField.value = "";

    var currentLocationButton = document.getElementById("current-location-button");
    var changeDisplayButton   = document.getElementById("change-display-button");
    var confirmPinButton      = document.getElementById("confirm-pin-button");
    var placesService         = new google.maps.places.PlacesService(map);
    var generatePlan1         = document.getElementById("generate-plan-1");
    var generatePlan2         = document.getElementById("generate-plan-2");
    var searchBar             = document.getElementById("search-bar");
    var textSearch            = document.getElementById("text-search");
    var slideInContent        = document.getElementById("slide-in-content");
    
    var departure = document.getElementById("departure").value;
    var keyword1  = document.getElementById("keywords1").value;
    var keyword2  = document.getElementById("keywords2").value;
    var keyword3  = document.getElementById("keywords3").value;
    var keyword4  = document.getElementById("keywords4").value;
    var time1     = document.getElementById("time1").value;
    var time2     = document.getElementById("time2").value;
    var date      = new Date(document.getElementById("date").value);
    var foot      = document.getElementById("foot").checked;
    var train     = document.getElementById("train").checked;
    var car       = document.getElementById("car").checked;
    var bicycle   = document.getElementById("bicycle").checked;
    var sort      = document.getElementById("sort").value;

    // 日時関連
    var datetime1  = new Date(date);
    var datetime2  = new Date(date);
    var time1Parts = time1.split(":");
    var time2Parts = time2.split(":");
    datetime1.setHours(time1Parts[0], time1Parts[1]);
    datetime2.setHours(time2Parts[0], time2Parts[1]);

    function isPlaceOpenAtTime(place, date, datetime1, datetime2) {
        if (!place.opening_hours || !place.opening_hours.periods) {
            return true;
        }
        const dayOfWeek = date.getDay();
        for (let i = 0; i < place.opening_hours.periods.length; i++) {
            var period = place.opening_hours.periods[i];
            if (!period || !period.open || !period.close) {
                continue;
            }
            if (period.open.day === undefined || period.close.day === undefined) {
                continue;
            }
            if (period.open.day === dayOfWeek && period.close.day === dayOfWeek) {
                const openTime  = new Date(date);
                const closeTime = new Date(date);
                openTime.setHours(period.open.hours);
                openTime.setMinutes(period.open.minutes);
                closeTime.setHours(period.close.hours);
                closeTime.setMinutes(period.close.minutes);
                if (openTime <= datetime1 && closeTime >= datetime2) {
                    return true;
                }
            }
        }
        return false;
    }
    // 差分計算
    var startTime = new Date("2023-01-01T" + time1);
    var endTime   = new Date("2023-01-01T" + time2);
    var timeDiff  = endTime - startTime;
    if (timeDiff < 0) {
        alert("日付を跨ぐ時間は設定できません。");
        return;
    }
    if (timeDiff < 3600000 || timeDiff >= 18000001) {
        alert("時間の差分は1時間以上 5時間以下に設定してください。");
        return;
    }
    
    // キーワード関連
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
    if (keywords.length < 1) {
        alert("1つ以上のキーワードを選択してください。");
        return;
    }

    // 移動手段関連
    var hour = timeDiff / 1000 / 60 / 60;
    var radius         = 0;
    var footPerHour    = 4;
    var trainPerHour   = 48;
    var carPerHour     = 20;
    var bicyclePerHour = 12;
    if (foot) {
        radius = hour * footPerHour * 1000;
    }
    if (train) {
        radius = hour * trainPerHour * 1000;
    }
    if (car) {
        radius = hour * carPerHour * 1000;
    }
    if (bicycle) {
        radius = hour * bicyclePerHour * 1000;
    }
    if (radius > 50000) {
        radius = 50000;
    }
    if (radius === 0) {
        alert("移動手段を選択してください。");
        return;
    }
    
    // マーカーリセット
    if (pinMarker) {
        pinMarker.setMap(null);
    }
    if (spotMarkers.length > 0) {
        for (let i = 0; i < spotMarkers.length; i++) {
            if (spotMarkers[i]) {
                spotMarkers[i].setMap(null);
            }
        }
        spotMarkers = [];
    }

    // 配列リセット
    if (spotNames.length > 0) {
        spotNames = [];
    }
    if (stayingTimes.length > 0) {
        stayingTimes = [];
    }
    if (photoUrls.length > 0) {
        photoUrls = [];
    }
    if (mapUrls.length > 0) {
        mapUrls = [];
    }

    currentLocationButton.style.display = "none";
    changeDisplayButton.style.display   = "none";

    if (departure === "pin") {
        slideInContent.style.transform = "translateY(100%)";
        confirmPinButton.style.display = "flex";
        searchBar.style.display        = "none";

        if (circle) {
            circle.setMap(null);
        }
        handlePinPlacement();
    } else if (departure === "current-loc") {
        generatePlan2.style.display         = "flex";
        currentLocationButton.style.display = "flex";
        changeDisplayButton.style.display   = "flex";
        textSearch.textContent              = "再検索";

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const latLng = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                };
                // 非同期処理を制御するためのPromiseを返す関数
                async function geocodeKeyword(keyword, num) {
                    try {
                        const results = await new Promise((resolve, reject) => {
                            // Places APIで検索
                            const request = {
                                locationBias: {radius: radius, center: latLng},
                                query: keyword,
                            };
                            placesService.textSearch(request, (results, status) => {
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    resolve(results);
                                } else {
                                    reject("場所が見つかりません：" + keyword);
                                }
                            });
                        });

                        // 場所ごとに詳細情報を取得し、時間外の場所をフィルタリング
                        var filteredResults = [];
                        for (let i = 0; i < results.length; i++) {
                            const place = await getPlaceDetails(results[i].place_id);
                            if (isPlaceOpenAtTime(place, date, datetime1, datetime2)) {
                                filteredResults.push(results[i]);
                            }
                        }
                        
                        var stayingTime = "10分";
                        if (sort === "distance") {
                            if (filteredResults) {
                                filteredResults.sort((a, b) => {
                                    const distanceA = google.maps.geometry.spherical.computeDistanceBetween(latLng, a.geometry.location);
                                    const distanceB = google.maps.geometry.spherical.computeDistanceBetween(latLng, b.geometry.location);
                                    return distanceA - distanceB;
                                });
                                var placeLocation = filteredResults[0].geometry.location;
                                switch (num) {
                                    case 0:
                                        map.setCenter(placeLocation);
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                        });
                                        document.getElementById("first").style.display  = "flex";
                                        document.getElementById("first-name").innerText = filteredResults[0].name;
                                        document.getElementById("first-time").innerText = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 1:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                        });
                                        document.getElementById("fs-space").style.display = "flex";
                                        document.getElementById("second").style.display   = "flex";
                                        document.getElementById("second-name").innerText  = filteredResults[0].name;
                                        document.getElementById("second-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 2:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                        });
                                        document.getElementById("st-space").style.display = "flex";
                                        document.getElementById("third").style.display    = "flex";
                                        document.getElementById("third-name").innerText   = filteredResults[0].name;
                                        document.getElementById("third-time").innerText   = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 3:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                        });
                                        document.getElementById("tf-space").style.display = "flex";
                                        document.getElementById("fourth").style.display   = "flex";
                                        document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                        document.getElementById("fourth-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                spotMarkers.push(spotMarker);
                                spotNames.push(filteredResults[0].name);
                                stayingTimes.push(stayingTime);
                                if (filteredResults[0].photos) {
                                    photoUrls.push(filteredResults[0].photos[0].getUrl());
                                } else {
                                    photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                }
                                mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[0].geometry.location.lat()}%2C${filteredResults[0].geometry.location.lng()}&query_place_id=${filteredResults[0].place_id}&hl=ja`);
                                return filteredResults[0];
                            } else {
                                spotNames.push(null);
                                stayingTimes.push(null);
                                photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                mapUrls.push(null);
                                return [];
                            }
                        } else if (sort === "rate") {
                            if (filteredResults) {
                                var maxRating      = -1;
                                var maxRatingIndex = -1;
                                for (let i = 0; i < filteredResults.length; i++) {
                                    if (filteredResults[i].user_ratings_total > 0) {
                                        var averageRating = filteredResults[i].user_ratings_total / filteredResults[i].rating;
                                        if (averageRating > maxRating) {
                                            maxRating = averageRating;
                                            maxRatingIndex = i;
                                        }
                                    }
                                }
                                var placeLocation = filteredResults[maxRatingIndex].geometry.location;
                                switch (num) {
                                    case 0:
                                        map.setCenter(placeLocation);
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                        });
                                        document.getElementById("first").style.display  = "flex";
                                        document.getElementById("first-name").innerText = filteredResults[0].name;
                                        document.getElementById("first-time").innerText = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 1:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                        });
                                        document.getElementById("fs-space").style.display = "flex";
                                        document.getElementById("second").style.display   = "flex";
                                        document.getElementById("second-name").innerText  = filteredResults[0].name;
                                        document.getElementById("second-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 2:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                        });
                                        document.getElementById("st-space").style.display = "flex";
                                        document.getElementById("third").style.display    = "flex";
                                        document.getElementById("third-name").innerText   = filteredResults[0].name;
                                        document.getElementById("third-time").innerText   = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 3:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                        });
                                        document.getElementById("tf-space").style.display = "flex";
                                        document.getElementById("fourth").style.display   = "flex";
                                        document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                        document.getElementById("fourth-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                spotMarkers.push(spotMarker);
                                spotNames.push(filteredResults[maxRatingIndex].name);
                                stayingTimes.push(stayingTime);
                                if (filteredResults[maxRatingIndex].photos) {
                                    photoUrls.push(filteredResults[maxRatingIndex].photos[maxRatingIndex].getUrl());
                                } else {
                                    photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                }
                                mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[maxRatingIndex].geometry.location.lat()}%2C${filteredResults[maxRatingIndex].geometry.location.lng()}&query_place_id=${filteredResults[maxRatingIndex].place_id}&hl=ja`);
                                return filteredResults[maxRatingIndex];
                            } else {
                                spotNames.push(null);
                                stayingTimes.push(null);
                                photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                mapUrls.push(null);
                                return [];
                            }
                        } else if (sort === "price") {
                            filteredResults = filteredResults.filter(result => {
                                const priceLevel = result.price_level;
                                return priceLevel === undefined || priceLevel === 0 || priceLevel === 1;
                            });
                            if (filteredResults) {
                                const placeLocation = filteredResults[0].geometry.location;
                                switch (num) {
                                    case 0:
                                        map.setCenter(placeLocation);
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                        });
                                        document.getElementById("first").style.display  = "flex";
                                        document.getElementById("first-name").innerText = filteredResults[0].name;
                                        document.getElementById("first-time").innerText = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 1:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                        });
                                        document.getElementById("fs-space").style.display = "flex";
                                        document.getElementById("second").style.display   = "flex";
                                        document.getElementById("second-name").innerText  = filteredResults[0].name;
                                        document.getElementById("second-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 2:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                        });
                                        document.getElementById("st-space").style.display = "flex";
                                        document.getElementById("third").style.display    = "flex";
                                        document.getElementById("third-name").innerText   = filteredResults[0].name;
                                        document.getElementById("third-time").innerText   = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    case 3:
                                        spotMarker = new google.maps.Marker({
                                            map: map,
                                            position: placeLocation,
                                            icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                        });
                                        document.getElementById("tf-space").style.display = "flex";
                                        document.getElementById("fourth").style.display   = "flex";
                                        document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                        document.getElementById("fourth-time").innerText  = stayingTime;
                                        if (filteredResults[0].photos) {
                                            document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                        }
                                        break;
                                    default:
                                        break;
                                }
                                spotMarkers.push(spotMarker);
                                spotNames.push(filteredResults[0].name);
                                stayingTimes.push(stayingTime);
                                if (filteredResults[0].photos) {
                                    photoUrls.push(filteredResults[0].photos[0].getUrl());
                                } else {
                                    photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                }
                                mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[0].geometry.location.lat()}%2C${filteredResults[0].geometry.location.lng()}&query_place_id=${filteredResults[0].place_id}&hl=ja`);
                                return filteredResults[0];
                            } else {
                                spotNames.push(null);
                                stayingTimes.push(null);
                                photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                                mapUrls.push(null);
                                return [];
                            }
                        }
                    } catch (error) {
                        console.error(error);
                        return [];
                    }

                    function getPlaceDetails(placeId) {
                        return new Promise((resolve, reject) => {
                            const request = {
                                placeId: placeId,
                                fields: ["opening_hours"]
                            };
                            placesService.getDetails(request, (place, status) => {
                                if (status === google.maps.places.PlacesServiceStatus.OK) {
                                    resolve(place);
                                } else {
                                    reject("場所の詳細情報を取得できませんでした");
                                }
                            });
                        });
                    }
                }

                // Promiseを順番に実行
                (async () => {
                    for (let i = 0; i < keywords.length; i++) {
                        try {
                            let results = await geocodeKeyword(keywords[i], i);
                            console.log("results.name1-" + (i + 1) + "：", results.name);
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    generatePlan2.style.display    = "none";
                    slideInContent.style.transform = "translateY(100%)";
                })();
            }
        );
    }

    confirmPinButton.addEventListener("click", handleConfirmPinClick);

    function handleConfirmPinClick() {
        confirmPinButton.removeEventListener("click", handleConfirmPinClick);
        if (waitingForPin) {
            alert("ピンを設置してください。");
            return;
        }

        generatePlan1.style.display         = "flex";
        confirmPinButton.style.display      = "none";
        currentLocationButton.style.display = "flex";
        changeDisplayButton.style.display   = "flex";
        textSearch.textContent              = "再検索";
        searchBar.style.display             = "flex";

        // 非同期処理を制御するためのPromiseを返す関数
        async function geocodeKeyword(keyword, num) {
            try {
                const results = await new Promise((resolve, reject) => {
                    // Places APIで検索
                    const request = {
                        locationBias: {radius: radius, center: myLatLng},
                        query: keyword,
                    };
                    placesService.textSearch(request, (results, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            resolve(results);
                        } else {
                            reject("場所が見つかりません：" + keyword);
                        }
                    });
                });

                // 場所ごとに詳細情報を取得し、時間外の場所をフィルタリング
                var filteredResults = [];
                for (let i = 0; i < results.length; i++) {
                    const place = await getPlaceDetails(results[i].place_id);
                    if (isPlaceOpenAtTime(place, date, datetime1, datetime2)) {
                        filteredResults.push(results[i]);
                    }
                }

                var stayingTime = "10分";
                if (sort === "distance") {
                    if (filteredResults) {
                        filteredResults.sort((a, b) => {
                            const distanceA = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, a.geometry.location);
                            const distanceB = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, b.geometry.location);
                            return distanceA - distanceB;
                        });
                        var placeLocation = filteredResults[0].geometry.location;
                        switch (num) {
                            case 0:
                                map.setCenter(placeLocation);
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                });
                                document.getElementById("first").style.display  = "flex";
                                document.getElementById("first-name").innerText = filteredResults[0].name;
                                document.getElementById("first-time").innerText = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 1:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                });
                                document.getElementById("fs-space").style.display = "flex";
                                document.getElementById("second").style.display   = "flex";
                                document.getElementById("second-name").innerText  = filteredResults[0].name;
                                document.getElementById("second-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 2:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                });
                                document.getElementById("st-space").style.display = "flex";
                                document.getElementById("third").style.display    = "flex";
                                document.getElementById("third-name").innerText   = filteredResults[0].name;
                                document.getElementById("third-time").innerText   = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 3:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                });
                                document.getElementById("tf-space").style.display = "flex";
                                document.getElementById("fourth").style.display   = "flex";
                                document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                document.getElementById("fourth-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            default:
                                break;
                        }
                        spotMarkers.push(spotMarker);
                        spotNames.push(filteredResults[0].name);
                        stayingTimes.push(stayingTime);
                        if (filteredResults[0].photos) {
                            photoUrls.push(filteredResults[0].photos[0].getUrl());
                        } else {
                            photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        }
                        mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[0].geometry.location.lat()}%2C${filteredResults[0].geometry.location.lng()}&query_place_id=${filteredResults[0].place_id}&hl=ja`);
                        return filteredResults[0];
                    } else {
                        spotNames.push(null);
                        stayingTimes.push(null);
                        photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        mapUrls.push(null);
                        return [];
                    }
                } else if (sort === "rate") {
                    if (filteredResults) {
                        var maxRating      = -1;
                        var maxRatingIndex = -1;
                        for (let i = 0; i < filteredResults.length; i++) {
                            if (filteredResults[i].user_ratings_total > 0) {
                                var averageRating = filteredResults[i].user_ratings_total / filteredResults[i].rating;
                                if (averageRating > maxRating) {
                                    maxRating = averageRating;
                                    maxRatingIndex = i;
                                }
                            }
                        }
                        var placeLocation = filteredResults[maxRatingIndex].geometry.location;
                        switch (num) {
                            case 0:
                                map.setCenter(placeLocation);
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                });
                                document.getElementById("first").style.display  = "flex";
                                document.getElementById("first-name").innerText = filteredResults[0].name;
                                document.getElementById("first-time").innerText = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 1:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                });
                                document.getElementById("fs-space").style.display = "flex";
                                document.getElementById("second").style.display   = "flex";
                                document.getElementById("second-name").innerText  = filteredResults[0].name;
                                document.getElementById("second-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 2:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                });
                                document.getElementById("st-space").style.display = "flex";
                                document.getElementById("third").style.display    = "flex";
                                document.getElementById("third-name").innerText   = filteredResults[0].name;
                                document.getElementById("third-time").innerText   = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 3:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                });
                                document.getElementById("tf-space").style.display = "flex";
                                document.getElementById("fourth").style.display   = "flex";
                                document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                document.getElementById("fourth-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            default:
                                break;
                        }
                        spotMarkers.push(spotMarker);
                        spotNames.push(filteredResults[maxRatingIndex].name);
                        stayingTimes.push(stayingTime);
                        if (filteredResults[maxRatingIndex].photos) {
                            photoUrls.push(filteredResults[maxRatingIndex].photos[maxRatingIndex].getUrl());
                        } else {
                            photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        }
                        mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[maxRatingIndex].geometry.location.lat()}%2C${filteredResults[maxRatingIndex].geometry.location.lng()}&query_place_id=${filteredResults[maxRatingIndex].place_id}&hl=ja`);
                        return filteredResults[maxRatingIndex];
                    } else {
                        spotNames.push(null);
                        stayingTimes.push(null);
                        photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        mapUrls.push(null);
                        return [];
                    }
                } else if (sort === "price") {
                    filteredResults = filteredResults.filter(result => {
                        const priceLevel = result.price_level;
                        return priceLevel === undefined || priceLevel === 0 || priceLevel === 1;
                    });
                    if (filteredResults) {
                        const placeLocation = filteredResults[0].geometry.location;
                        switch (num) {
                            case 0:
                                map.setCenter(placeLocation);
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                });
                                document.getElementById("first").style.display  = "flex";
                                document.getElementById("first-name").innerText = filteredResults[0].name;
                                document.getElementById("first-time").innerText = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("first-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 1:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                });
                                document.getElementById("fs-space").style.display = "flex";
                                document.getElementById("second").style.display   = "flex";
                                document.getElementById("second-name").innerText  = filteredResults[0].name;
                                document.getElementById("second-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("second-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 2:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                });
                                document.getElementById("st-space").style.display = "flex";
                                document.getElementById("third").style.display    = "flex";
                                document.getElementById("third-name").innerText   = filteredResults[0].name;
                                document.getElementById("third-time").innerText   = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("third-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            case 3:
                                spotMarker = new google.maps.Marker({
                                    map: map,
                                    position: placeLocation,
                                    icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                });
                                document.getElementById("tf-space").style.display = "flex";
                                document.getElementById("fourth").style.display   = "flex";
                                document.getElementById("fourth-name").innerText  = filteredResults[0].name;
                                document.getElementById("fourth-time").innerText  = stayingTime;
                                if (filteredResults[0].photos) {
                                    document.getElementById("fourth-photo").src = filteredResults[0].photos[0].getUrl();
                                }
                                break;
                            default:
                                break;
                        }
                        spotMarkers.push(spotMarker);
                        spotNames.push(filteredResults[0].name);
                        stayingTimes.push(stayingTime);
                        if (filteredResults[0].photos) {
                            photoUrls.push(filteredResults[0].photos[0].getUrl());
                        } else {
                            photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        }
                        mapUrls.push(`https://www.google.com/maps/search/?api=1&query=${filteredResults[0].geometry.location.lat()}%2C${filteredResults[0].geometry.location.lng()}&query_place_id=${filteredResults[0].place_id}&hl=ja`);
                        return filteredResults[0];
                    } else {
                        spotNames.push(null);
                        stayingTimes.push(null);
                        photoUrls.push("https://mbaas.api.nifcloud.com/2013-09-01/applications/1er2zvbAsWIdFAEI/publicFiles/NoImage");
                        mapUrls.push(null);
                        return [];
                    }
                }
            } catch (error) {
                console.error(error);
                return [];
            }

            function getPlaceDetails(placeId) {
                return new Promise((resolve, reject) => {
                    const request = {
                        placeId: placeId,
                        fields: ["opening_hours"]
                    };
                    placesService.getDetails(request, (place, status) => {
                        if (status === google.maps.places.PlacesServiceStatus.OK) {
                            resolve(place);
                        } else {
                            reject("場所の詳細情報を取得できませんでした");
                        }
                    });
                });
            }
        }

        // Promiseを順番に実行
        (async () => {
            for (let i = 0; i < keywords.length; i++) {
                try {
                    let results = await geocodeKeyword(keywords[i], i);
                    console.log("results.name2-" + (i + 1) + "：", results.name);
                } catch (error) {
                    console.error(error);
                }
            }
            
            generatePlan1.style.display    = "none";
            slideInContent.style.transform = "translateY(100%)";
        })();
    }
}

// プランを保存
function savePlan() {
    var currentUser = new ncmb.User.getCurrentUser();
    var planId      = currentUser.get("objectId");

    var planNameField = document.getElementById("plan-name-field");
    var planName      = document.getElementById("plan-name-field").value;
    if (planName.length > 0) {
        var confirmPlanName = confirm("プラン名の変更はできません。\n保存してよろしいですか？");
        if (confirmPlanName) {
            planNameField.value = "";
        } else {
            return;
        }
    } else {
        var confirmPlanName = confirm("プラン名は自動で作成されます。\n保存してよろしいですか？");
        if (confirmPlanName) {
            if (spotNames[0] != undefined) {
                planName = spotNames[0];
            }
            if (spotNames[1] != undefined) {
                planName += "_" + spotNames[1];
            }
            if (spotNames[2] != undefined) {
                planName += "_" + spotNames[2];
            }
            if (spotNames[3] != undefined) {
                planName += "_" + spotNames[3];
            }
        } else {
            return;
        }
    }

    if (currentUser) {
        var anonymous = (authData = currentUser.get("authData")) && authData["anonymous"] && !currentUser.get("password");
        if (anonymous) {
            alert("アカウント作成後に保存できます。");
            return;
        } else {
            var Plan = ncmb.DataStore("Plan");
            var plan = new Plan();

            var acl = new ncmb.Acl();
            acl.setPublicReadAccess(true);
            acl.setUserWriteAccess(currentUser, true);

            plan.set("spotName", {1: spotNames[0], 2: spotNames[1], 3: spotNames[2], 4: spotNames[3]})
                .set("stayingTime", {1: stayingTimes[0], 2: stayingTimes[1], 3: stayingTimes[2], 4: stayingTimes[3]})
                .set("photoUrl", {1: photoUrls[0], 2: photoUrls[1], 3: photoUrls[2], 4: photoUrls[3]})
                .set("mapUrl", {1: mapUrls[0], 2: mapUrls[1], 3: mapUrls[2], 4: mapUrls[3]})
                .set("planId", planId)
                .set("planName", planName)
                .set("acl", acl)
                .save()
                .then(function () {
                    alert("保存しました。\n設定画面で確認できます。");
                    Plan.equalTo("planId", planId)
                        .order("createDate", true)
                        .fetchAll()
                            .then(function (plans) {
                                displaySavedPlans(plans);
                            })
                            .catch(function (error) {
                                console.error(error);
                            });
                })
                .catch(function () {
                    alert("保存に失敗しました。");
                });
        }
    }
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

function displayOverlay(plan) {
    console.log("Displaying overlay for plan:", plan);
}

// 保存時間を適切な形式にフォーマット
function formatDate(date) {
    var options = { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", second: "numeric" };
    return new Date(date).toLocaleString("ja-JP", options);
}