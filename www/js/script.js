var map, marker, circle, id;

function init_map() { // マップ起動時
    var center_location = new google.maps.LatLng(35.6811673, 139.7670516);
    var mapOptions = {
        center: center_location,
        zoom: 15,
        mapTypeId: "roadmap"
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);
}

function success(pos) { // 現在地取得成功
    var crd = pos.coords;

    var currentPos = new google.maps.LatLng( crd.latitude, crd.longitude);

    if ( marker != undefined )  marker.setMap(null);
    if ( circle != undefined )  circle.setMap(null);

    marker = new google.maps.Marker({ position: currentPos, map: map});

    circle = new google.maps.Circle({ // 誤差範囲
        strokeColor: "#6495ed",
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: "#6495ed",
        fillOpacity: 0.25,
        map: map,
        draggable: false,
        center: currentPos,
        radius: crd.accuracy
    });

    map.setCenter(currentPos);
    map.setZoom(14);
}

function error(err) { // エラー発生時
    alert("エラーメッセージ：" + err.message);
}

function startWatchPosition() { // 現在地取得
    if ( id == undefined ) {
        var options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        id = navigator.geolocation.watchPosition(success, error, options);
    }
}

function getEndPosition() { // 目的地情報取得
    var end = document.getElementById("endpoint").value;
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({address: end}, getPositionCallback);
}

// 位置情報取得コールバック
function getPositionCallback(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
        createMap(results);
    } else {
        alert(results + " , " + status);
    }
}

// 地図取得メソッド
function createMap(results) {
    
    // 緯度経度を取得
    var endlatlng = results[0].geometry.location;
    var endlat = endlatlng.lat();
    var endlng = endlatlng.lng();
    
    // 緯度・経度を指定
    var latlng = new google.maps.LatLng(endlat, endlng);
    
    // 地図オプションを指定
    var option = {
        zoom:16,
        center:latlng,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    
    // 地図を取得
    var map = new google.maps.Map(document.getElementById("map"), option);
    
    // マーカーを設定
    var marker = new google.maps.Marker({
        position: latlng, 
        map: map
    });
}