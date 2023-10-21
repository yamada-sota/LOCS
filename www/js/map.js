var map, watchID, marker, circle;
function initMap() {
    var mapOptions = {
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        disableDefaultUI: true
    };
    map = new google.maps.Map(document.getElementById("map"), mapOptions);

    // 位置情報の監視を開始
    watchID = navigator.geolocation.watchPosition(
        function (position) {
            var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

            // 以前のマーカーとサークルを削除
            if (marker) {
                marker.setMap(null);
            }
            if (circle) {
                circle.setMap(null);
            }

            // マーカーを作成
            marker = new google.maps.Marker({
                position: latLng,
                map: map,
                title: "現在の位置"
            });
            // サークルを作成
            circle = new google.maps.Circle({
                strokeColor: "#3333FF",
                strokeOpacity: 0.8,
                strokeWeight: 1,
                fillColor: "#3333FF",
                fillOpacity: 0.2,
                map: map,
                draggable: false,
                center: latLng,
                radius: position.coords.accuracy // 誤差の単位：m
            });

            // マップを中心に移動
            map.setCenter(latLng);
        },
        function () {
            alert("位置情報の取得に失敗しました");
        },
        {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000
        }
    );
}

function searchLocation() {
    var geocoder       = new google.maps.Geocoder();
    var address        = document.getElementById("keywords1").value;
    var slideInContent = document.getElementById("slide-in-content");
    geocoder.geocode({ "address": address }, function(results, status) {
        if (status === "OK") {
            var location = results[0].geometry.location;
            map.setCenter(location);
            var marker = new google.maps.Marker({
                map: map,
                position: location
            });
            slideInContent.style.transform = "translateY(100%)";
        } else {
            alert("場所が見つかりません。");
        }
    });
}
