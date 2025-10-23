// news.js

// =================================================================
// ニュースデータ読み込み関連の処理
// =================================================================

/**
 * ニュースを読み込み、グリッドに表示する
 * @param {number} [limit] - 表示するニュースの最大件数。指定しない場合は全件表示。
 */
export async function loadNews(limit) {
    const gridId = limit ? 'home-news-grid' : 'all-news-grid';
    const newsGrid = document.getElementById(gridId);
    if (!newsGrid) return;

    try {
        const response = await fetch('data/news.json'); // パスは環境に合わせて調整してください
        const articles = await response.json();

        // IDの大きい順（降順）にソート
        articles.sort((a, b) => Number(b.id) - Number(a.id));

        const itemsToDisplay = limit ? articles.slice(0, limit) : articles;

        newsGrid.innerHTML = ''; // 既存の内容をクリア

        if (itemsToDisplay.length === 0) {
            newsGrid.innerHTML = '<p style="color: #E0E0E0;">最新情報はありません。</p>';
            return;
        }

        itemsToDisplay.forEach(article => {
            const content = article.content || '';
            // 50文字に丸める処理
            const excerpt = content.replace(/\n/g, ' ').substring(0, 50) + (content.length > 50 ? '...' : '');

            const card = document.createElement('article');
            card.className = 'news-card';
            card.innerHTML = `
                <a href="news.html?id=${article.id}" class="news-card-link">
                    <div class="news-date">${article.date}</div>
                    <h3 class="news-title">${article.title}</h3>
                    <p class="news-excerpt">${excerpt}</p>
                </a>
            `;
            newsGrid.appendChild(card);
        });
    } catch (error) {
        console.error('ニュースの読み込みに失敗しました:', error);
        newsGrid.innerHTML = '<p style="color: #E0E0E0;">ニュースの読み込みに失敗しました。</p>';
    }
}

/**
 * URLのIDに基づいて単一の記事を読み込み、表示する
 */
export async function loadArticle() {
    const contentDiv = document.getElementById('article-content');
    const params = new URLSearchParams(window.location.search);
    const articleId = params.get('id');

    if (!articleId) {
        contentDiv.innerHTML = '<div class="article-container"><h1>記事が指定されていません。</h1></div>';
        return;
    }

    try {
        const response = await fetch('data/news.json'); // パスは環境に合わせて調整してください
        const articles = await response.json();

        // IDは文字列として比較
        const article = articles.find(a => String(a.id) === articleId);

        if (article) {
            document.title = `${article.title} - 共創`;

            // JSONデータで改行が \n の場合、<br>に変換して表示
            const formattedContent = (article.content || '').replace(/\n/g, '<br>');

            contentDiv.innerHTML = `
                <div class="article-container">
                    <div class="article-header">
                        <div class="news-date">${article.date}</div>
                        <h1 class="article-title">${article.title}</h1>
                    </div>
                    <div class="section-divider" style="margin: 2rem 0;"></div>
                    <div class="article-body">
                        <p>${formattedContent}</p>
                    </div>
                    <a href="news.html" class="more-btn" style="margin-top: 3rem;">一覧へ戻る</a>
                </div>
            `;
        } else {
            contentDiv.innerHTML = '<div class="article-container"><h1>記事が見つかりませんでした。</h1></div>';
        }
    } catch (error) {
        console.error('記事の読み込みに失敗しました:', error);
        contentDiv.innerHTML = '<div class="article-container"><h1>記事の読み込みに失敗しました。</h1></div>';
    }
}