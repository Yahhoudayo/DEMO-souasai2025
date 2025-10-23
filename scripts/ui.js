// ui.js

// =================================================================
// UI関連の処理
// =================================================================

export function setupUIEventListeners() {
    // --- ハンバーガーメニューの制御 ---
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const body = document.body;

    if (hamburger && mobileMenu) {
        // ハンバーガーアイコンクリックで active クラスをトグル
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            mobileMenu.classList.toggle('active');
            body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : 'auto';
        });

        // メニューアイテムクリックでメニューを閉じる
        document.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = 'auto';
            });
        });

        // メニューの背景（モバイルメニュー要素自体）クリックでメニューを閉じる
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                hamburger.classList.remove('active');
                mobileMenu.classList.remove('active');
                body.style.overflow = 'auto';
            }
        });
    }

    // --- スクロール時のヘッダー背景変化 ---
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (header) {
            header.style.background = (window.scrollY > 100)
                ? 'rgba(255, 255, 255, 0.98)' // スクロール後はほぼ白
                : 'rgba(255, 255, 255, 0.95)'; // 初期状態
        }
    });

    // --- スムーズスクロール ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
}