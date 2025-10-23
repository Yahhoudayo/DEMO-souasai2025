class NewsSectionComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    // 要素がドキュメントに接続されたときに実行
    connectedCallback() {
        // ニュース読み込みロジックを実行
        this.loadNewsContent();
    }

    // ニュースデータ読み込みロジック (loadNewsの内容を移植・修正)
    async loadNewsContent() {
        const limit = this.getAttribute('limit') ? Number(this.getAttribute('limit')) : 3;
        const newsGrid = this.shadowRoot.getElementById('home-news-grid');

        if (!newsGrid) return;

        try {
            const response = await fetch('data/news.json');
            const articles = await response.json();

            articles.sort((a, b) => Number(b.id) - Number(a.id));
            const itemsToDisplay = articles.slice(0, limit);

            newsGrid.innerHTML = '';

            if (itemsToDisplay.length === 0) {
                newsGrid.innerHTML = '<p style="color: var(--color-text-dim); text-align: center;">最新情報はありません。</p>';
                return;
            }

            itemsToDisplay.forEach(article => {
                const content = article.content || '';
                const excerpt = content.replace(/\n/g, ' ').substring(0, 30) + (content.length > 30 ? '...' : '');

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
            newsGrid.innerHTML = '<p style="color: var(--color-text-dim); text-align: center;">ニュースの読み込みに失敗しました。</p>';
        }
    }


    render() {
        const style = document.createElement('style');
        style.textContent = this.getCss();

        // リンク属性のみ取得
        const link = this.getAttribute('link') || 'news.html';

        const template = document.createElement('template');
        template.innerHTML = this.getHtml(link);

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    getHtml(link) {
        return `
            <section class="news-section">
                <div class="news-grid" id="home-news-grid">
                    </div>
                <a href="${link}" class="more-btn">すべてのニュースを見る</a>
            </section>
        `;
    }

    getCss() {
        return `
            /* 外部フォントの読み込み */
            @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700;800&display=swap');

            /* ポップな配色・フォント定義 */
            :host {
                --primary-color: #0096C7;
                --accent-color: #FF8FAB;
                --yellow-color: #FFD166;
                --dark-color: #2A323A;
                
                --font-body: 'M PLUS Rounded 1c', sans-serif;
            }
            
            .news-section {
                padding: 4rem 2rem;
                max-width: 1200px;
                margin: 0 auto;
            }

            .news-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                gap: 2.5rem;
                margin-top: 3rem;
                margin-bottom: 4rem;
            }

            .news-card {
                font-family: var(--font-body);
                background: #fff;
                border: 3px solid var(--dark-color);
                border-radius: 12px;
                box-shadow: 5px 5px 0 var(--primary-color);
                transition: all 0.2s ease-out;
                overflow: hidden;
            }

            .news-card:hover {
                transform: translate(-3px, -3px);
                box-shadow: 8px 8px 0 var(--accent-color);
            }

            .news-card-link {
                text-decoration: none;
                color: inherit;
                display: block;
                height: 100%;
                padding: 1rem; /* ⭐ ここを修正しました */
            }

            .news-date {
                color: var(--primary-color);
                font-size: 0.9rem;
                font-weight: 700;
                margin-bottom: 0.4rem; /* ⭐ ここを修正しました */
            }

            .news-title {
                font-size: 1.3rem;
                font-weight: 800;
                margin-bottom: 0.6rem; /* ⭐ ここを修正しました */
                color: var(--dark-color);
                line-height: 1.4;
            }

            .news-excerpt {
                color: #555;
                line-height: 1.7;
                font-size: 0.95rem;
            }

            .more-btn {
                display: block;
                width: 280px;
                margin: 0 auto;
                padding: 0.9rem 2rem;
                background: var(--primary-color);
                color: white;
                text-decoration: none;
                text-align: center;
                border-radius: 50px;
                font-family: var(--font-body);
                font-weight: 700;
                font-size: 1.1em;
                border: 3px solid var(--dark-color);
                box-shadow: 4px 4px 0 var(--dark-color);
                transition: all 0.2s ease-out;
            }

            .more-btn:hover {
                background: #00AADD;
                transform: translate(-2px, -2px);
                box-shadow: 6px 6px 0 var(--dark-color);
            }
            
            @media (max-width: 768px) {
                .news-section {
                    padding: 3rem 1rem;
                }
                .news-grid {
                    grid-template-columns: 1fr;
                    gap: 2rem;
                    margin-top: 0;
                }
            }
        `;
    }
}

customElements.define('news-section-component', NewsSectionComponent);