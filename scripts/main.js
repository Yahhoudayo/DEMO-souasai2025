// main.js

import { setupUIEventListeners } from './ui.js';
import { loadNews, loadArticle } from './news.js';


// =================================================================
// ページの読み込みが完了したら、すべての処理を開始する
// =================================================================
document.addEventListener('DOMContentLoaded', () => {

    // --- UI関連の処理を初期化 ---
    setupUIEventListeners();

    // --- ページに応じて、適切なデータ読み込み処理を実行 ---

    // ホームページ用のニュース表示（最新3件）
    if (document.getElementById('home-news-grid')) {
        loadNews(3); // 3件だけ読み込む
    }
    // ニュース一覧ページ用のニュース表示（全件）
    if (document.getElementById('all-news-grid')) {
        loadNews(); // 件数指定なしで全件読み込む
    }
    // ニュース詳細ページ用の記事表示
    if (document.getElementById('article-content')) {
        loadArticle();
    }
});