var map, watchID, marker, circle;
var iconRotation = 0;

function initMap() {
    var mapOptions = {
        zoom: 15,
        // mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapId: "2e1aed6c4c23f06a",
        disableDefaultUI: true,
        isFractionalZoomEnabled: true,
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // 位置情報の監視を開始
    watchID = navigator.geolocation.watchPosition(
        function (position) {
            var latLng = new google.maps.LatLng(
                position.coords.latitude, position.coords.longitude
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
                title: "現在の位置",
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
        }
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

function searchLocation() {
    navigator.geolocation.clearWatch(watchID);
    var geocoder       = new google.maps.Geocoder();
    var address        = document.getElementById("keywords1").value;
    var slideInContent = document.getElementById("slide-in-content");
    geocoder.geocode({ "address": address }, function(results, status) {
        if (status === "OK") {
            var location = results[0].geometry.location;
            map.setCenter(location);
            var marker = new google.maps.Marker({
                map: map,
                position: location,
            });
            slideInContent.style.transform = "translateY(100%)";

            console.log('検索結果:', results);
            var formattedAddress = results[0].formatted_address;
            console.log('フォーマットされた住所:', formattedAddress);
        } else {
            alert("場所が見つかりません。");
        }
    });
}
