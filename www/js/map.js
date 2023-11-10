var map, watchID, currentMarker, pinMarker, spotMarker, circle, iconDiv;
var iconRotation = 0;

document.addEventListener("DOMContentLoaded", function() {
    var currentLocationButton = document.getElementById("current-location-button");
    document.getElementById("current-location-button").addEventListener("click", function () {
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

function resetSetting() {
    document.getElementById("departure").selectedIndex = 0;
    document.getElementById("keywords1").selectedIndex = 0;
    document.getElementById("keywords2").selectedIndex = 0;
    document.getElementById("keywords3").selectedIndex = 0;
    document.getElementById("keywords4").selectedIndex = 0;
    document.getElementById("budget").selectedIndex    = 0;
    document.getElementById("time1").value             = "00:00";
    document.getElementById("time2").value             = "00:00";
    document.getElementById("foot").checked            = false;
    document.getElementById("train").checked           = false;
    document.getElementById("car").checked             = false;
    document.getElementById("bicycle").checked         = false;
    document.getElementById("sort").selectedIndex      = 0;
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

var spotMarkers = [];
function searchLocation() {
    navigator.geolocation.clearWatch(watchID);

    var currentLocationButton = document.getElementById("current-location-button");
    var confirmPinButton      = document.getElementById("confirm-pin-button");
    var placesService         = new google.maps.places.PlacesService(map);
    var generatePlan          = document.getElementById("generate-plan");
    var searchBar             = document.getElementById("search-bar");
    var textSearch            = document.getElementById("text-search");
    var slideInContent        = document.getElementById("slide-in-content");

    var departure = document.getElementById("departure").value;
    var keyword1  = document.getElementById("keywords1").value;
    var keyword2  = document.getElementById("keywords2").value;
    var keyword3  = document.getElementById("keywords3").value;
    var keyword4  = document.getElementById("keywords4").value;
    var budget    = document.getElementById("budget").value;
    var time1     = document.getElementById("time1").value;
    var time2     = document.getElementById("time2").value;
    var date      = new Date(document.getElementById("date").value);
    var foot      = document.getElementById("foot").checked;
    var train     = document.getElementById("train").checked;
    var car       = document.getElementById("car").checked;
    var bicycle   = document.getElementById("bicycle").checked;
    var sort      = document.getElementById("sort").value;

    // 日時関連
    var datetime1 = new Date(date);
    var datetime2 = new Date(date);
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
    var hour = timeDiff / 1000 / 60;
    var radius         = 0;
    var footPerHour    = 4;
    var trainPerHour   = 48;
    var carPerHour     = 20;
    var bicyclePerHour = 12;
    if (foot) {
        radius += hour * footPerHour;
    }
    if (train) {
        radius += hour * trainPerHour;
    }
    if (car) {
        radius += hour * carPerHour;
    }
    if (bicycle) {
        radius += hour * bicyclePerHour;
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

    currentLocationButton.style.display = "none";
    generatePlan.style.display          = "flex";

    if (departure === "pin") {
        slideInContent.style.transform = "translateY(100%)";
        confirmPinButton.style.display = "flex";
        searchBar.style.display        = "none";

        if (circle) {
            circle.setMap(null);
        }
        handlePinPlacement();
    } else if (departure === "current-loc") {
        currentLocationButton.style.display = "flex";
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

                        if (sort === "distance") {
                            filteredResults.sort((a, b) => {
                                const distanceA = google.maps.geometry.spherical.computeDistanceBetween(latLng, a.geometry.location);
                                const distanceB = google.maps.geometry.spherical.computeDistanceBetween(latLng, b.geometry.location);
                                return distanceA - distanceB;
                            });
                            var placeLocation = filteredResults[0].geometry.location;
                            map.setCenter(placeLocation);
                            switch (num) {
                                case 0:
                                    spotMarker = new google.maps.Marker({
                                        map: map,
                                        position: placeLocation,
                                        icon: "https://maps.google.com/mapfiles/kml/paddle/1.png",
                                    });
                                    break;
                                case 1:
                                    spotMarker = new google.maps.Marker({
                                        map: map,
                                        position: placeLocation,
                                        icon: "https://maps.google.com/mapfiles/kml/paddle/2.png",
                                    });
                                    break;
                                case 2:
                                    spotMarker = new google.maps.Marker({
                                        map: map,
                                        position: placeLocation,
                                        icon: "https://maps.google.com/mapfiles/kml/paddle/3.png",
                                    });
                                    break;
                                case 3:
                                    spotMarker = new google.maps.Marker({
                                        map: map,
                                        position: placeLocation,
                                        icon: "https://maps.google.com/mapfiles/kml/paddle/4.png",
                                    });
                                    break;
                                default:
                                    break;
                            }
                            spotMarkers.push(spotMarker);
                            console.log("filteredResults[0].name：", filteredResults[0].name);
                            return filteredResults[0];
                        } else if (sort === "rate") {
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
                            map.setCenter(placeLocation);
                            spotMarker = new google.maps.Marker({
                                map: map,
                                position: placeLocation,
                            });
                            spotMarkers.push(spotMarker);
                            console.log("filteredResults[maxRatingIndex].name：", filteredResults[maxRatingIndex].name);
                            return filteredResults[maxRatingIndex];
                        } else if (sort === "price") {

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
                            console.log("results.name" + (i + 1) + "：", results.name);
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    generatePlan.style.display     = "none";
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

        confirmPinButton.style.display      = "none";
        currentLocationButton.style.display = "flex";
        textSearch.textContent              = "再検索";
        searchBar.style.display             = "flex";

        // 非同期処理を制御するためのPromiseを返す関数
        async function geocodeKeyword(keyword) {
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

                if (sort === "distance") {
                    filteredResults.sort((a, b) => {
                        const distanceA = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, a.geometry.location);
                        const distanceB = google.maps.geometry.spherical.computeDistanceBetween(myLatLng, b.geometry.location);
                        return distanceA - distanceB;
                    });
                    var placeLocation = filteredResults[0].geometry.location;
                    map.setCenter(placeLocation);
                    spotMarker = new google.maps.Marker({
                        map: map,
                        position: placeLocation,
                    });
                    spotMarkers.push(spotMarker);
                    console.log("filteredResults[0].name2：", filteredResults[0].name);
                    return filteredResults[0];
                } else if (sort === "rate") {
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
                    map.setCenter(placeLocation);
                    spotMarker = new google.maps.Marker({
                        map: map,
                        position: placeLocation,
                    });
                    spotMarkers.push(spotMarker);
                    console.log("filteredResults[maxRatingIndex].name2：", filteredResults[maxRatingIndex].name);
                    return filteredResults[maxRatingIndex];
                } else if (sort === "price") {

                }
                return filteredResults[0];
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
                    let results = await geocodeKeyword(keywords[i]);
                    console.log("results.name2-" + (i + 1) + "：", results);
                } catch (error) {
                    console.error(error);
                }
            }
            
            generatePlan.style.display     = "none";
            slideInContent.style.transform = "translateY(100%)";
        })();
    }
}
