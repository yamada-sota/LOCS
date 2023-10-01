document.addEventListener('DOMContentLoaded', function () {
    // 下からスライドインする要素と戻るボタンの要素を取得
    const slideInContent = document.getElementById('slide-in-content');

    // ボタンをクリックしたときのアクションを定義
    document.getElementById('search-bar').addEventListener('click', () => {
        slideInContent.style.transform = 'translateY(0%)'; // 下からスライドイン
    });

    // スワイプ（タッチ）イベントを処理するための変数
    let touchStartY = 0;

    // タッチ開始時のY座標を記録
    document.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    });

    // タッチ終了時と開始時のY座標を比較
    document.addEventListener('touchend', (e) => {
        const touchEndY = e.changedTouches[0].clientY;
        const deltaY = touchEndY - touchStartY;

        if (deltaY > 50) {
            slideInContent.style.transform = 'translateY(100%)'; // 下にスワイプして戻る
        }
    });
});

// 時間と分の要素を取得
const hourSelect = document.getElementById('hour');
const minuteSelect = document.getElementById('minute');

// 時間が変更されたときの処理
hourSelect.addEventListener('change', updateTime);
minuteSelect.addEventListener('change', updateTime);

function updateTime() {
    const selectedHour = hourSelect.value;
    const selectedMinute = minuteSelect.value;
    
    // 選択された時間と分を表示するなど、必要な処理を追加できます
    console.log(`選択された時間: ${selectedHour}:${selectedMinute}`);
}
