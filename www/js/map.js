var map, watchID, marker, circle;
var iconRotation = 0;

function initMap() {
    var mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true,
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

            // var customIcon = {
            //     path: "M-1.547 12l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM0 0q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
            //     fillColor: "blue",
            //     fillOpacity: 0.6,
            //     strokeWeight: 0,
            //     rotation: 0,
            //     scale: 2,
            //     anchor: new google.maps.Point(0, 20),
            // };
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
        } else {
            alert("場所が見つかりません。");
        }
    });
}
