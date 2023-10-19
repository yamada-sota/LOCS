document.addEventListener("DOMContentLoaded", function() {
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
    initMap();
});