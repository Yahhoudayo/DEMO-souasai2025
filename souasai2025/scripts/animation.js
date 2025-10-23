document.addEventListener('DOMContentLoaded', () => {
    // 1. 各要素を取得
    const smahoImage = document.querySelector('.main-smaho');
    const humanImage = document.querySelector('.main-human');

    // 2. smaho を 100ミリ秒 (0.1秒) 後に開始
    if (smahoImage) {
        setTimeout(() => {
            smahoImage.classList.add('is-animated');
        }, 100); // 0.1秒 = 100ミリ秒
    }

    // 3. human を 200ミリ秒 (0.2秒) 後に開始
    if (humanImage) {
        setTimeout(() => {
            humanImage.classList.add('is-animated');
        }, 200); // 0.2秒 = 200ミリ秒
    }
});