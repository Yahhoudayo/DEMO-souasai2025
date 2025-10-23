// componet/map-container-component.js


class MapContainerComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentMap = 'floor1'; // 初期表示は1階に設定
        this.render();
        this.attachEventListeners();
    }

    render() {
        // 全体のセクションタイトル、タブナビゲーション、そしてマップ表示エリアを定義
        this.shadowRoot.innerHTML = `
            <style>
                /* ポップな配色・フォント定義 */
                :host {
                    --primary-color: #4CAF50;    /* メインカラー (フレッシュな緑) */
                    --accent-color: #FFC107;     /* アクセントカラー (元気な黄色) */
                    --secondary-shadow-color: #009688; /* シャドウ用の濃い青緑 */
                    --dark-color: #2A323A;       /* ダークカラー (境界線/テキスト) */
                    --bg-light: #f7f7f7;
                    
                    font-family: 'M PLUS Rounded 1c', sans-serif;
                    display: block;
                    padding: 0; 
                }
                
                /* タブナビゲーションのスタイル */
                .tab-navigation {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap; 
                    /* ⭐ 変更: マップとの間の余白をさらに削減 (0.5rem) */
                    margin-top: 4.5rem;
                    margin-bottom: 2rem; 
                    gap: 8px; /* ボタン間の間隔も詰める */
                }
                .tab-button {
                    /* ⭐ 変更: パディングをさらに削減 (7px 14px) */
                    padding: 7px 14px;
                    cursor: pointer;
                    background-color: var(--bg-light); 
                    border: 3px solid var(--dark-color);
                    border-radius: 50px; 
                    box-shadow: 4px 4px 0 var(--accent-color); 
                    
                    /* ⭐ 変更: フォントサイズを小さく (1.0rem) */
                    font-size: 1.0rem; 
                    font-weight: 700;
                    color: var(--dark-color);
                    transition: all 0.2s ease-out;
                    white-space: nowrap;
                }
                
                /* ホバー時の効果 */
                .tab-button:hover:not(.active) {
                    transform: translate(-2px, -2px);
                    box-shadow: 6px 6px 0 var(--dark-color); 
                    background-color: #fff;
                }
                
                /* アクティブなタブ (押し込みデザイン) */
                .tab-button.active {
                    background-color: var(--primary-color); 
                    color: white; 
                    transform: translateY(3px); 
                    box-shadow: 0 3px 0 var(--dark-color); 
                    border-color: var(--dark-color);
                }
                
                /* マップコンテナ - 領域最大化 */
                .map-content-container {
                    max-width: 1200px; 
                    margin: 0 auto;
                    /* ⭐ 変更: コンテナ内のパディングを最小限 (3px) */
                    padding: 3px; 
                    background: #fff;
                    border: 4px solid var(--dark-color);
                    border-radius: 16px;
                    box-shadow: 10px 10px 0 var(--secondary-shadow-color); 
                    transition: all 0.3s ease-out;
                }
                
                /* 個々のマップセクションの表示/非表示ロジック */
                .map-section {
                    display: none; 
                }
                .map-section.active {
                    display: block; 
                }
                
                /* 各マップのタイトルはナビゲーションで代用するため非表示 */
                .section-title {
                    display: none; 
                }

                @media (max-width: 768px) {
                    .map-content-container {
                        max-width: 100%; 
                        margin: 0 5px; 
                        box-shadow: 5px 5px 0 var(--secondary-shadow-color); 
                        border-radius: 10px;
                        padding: 1px; /* スマホではさらにパディングを削減 */
                    }
                    .tab-button {
                        font-size: 0.95rem; /* スマホでさらに小さく */
                        padding: 6px 12px;
                        box-shadow: 3px 3px 0 var(--accent-color); 
                    }
                    .tab-navigation {
                        gap: 5px;
                    }
                }
            </style>
            
            <nav class="tab-navigation">
                <button class="tab-button active" data-map="floor1">1階</button>
                <button class="tab-button" data-map="floor2">2階</button>
                <button class="tab-button" data-map="floor3">3階</button>
                <button class="tab-button" data-map="outdoor">屋外</button>
            </nav>

            <div class="map-content-container">
                <section id="floor1" class="map-section active">
                    <h2 class="section-title">校内マップ1階</h2>
                    <map-component></map-component>
                </section>

                <section id="floor2" class="map-section">
                    <h2 class="section-title">校内マップ2階</h2>
                    <map-component-2></map-component-2>
                </section>

                <section id="floor3" class="map-section">
                    <h2 class="section-title">校内マップ3階</h2>
                    <map-component-3></map-component-3>
                </section>

                <section id="outdoor" class="map-section">
                    <h2 class="section-title">校内屋外</h2>
                    <map-component-4></map-component-4>
                </section>
            </div>
        `;
    }

    // イベントリスナーをアタッチ
    attachEventListeners() {
        const buttons = this.shadowRoot.querySelectorAll('.tab-button');
        buttons.forEach(button => {
            button.addEventListener('click', (e) => this.switchMap(e.currentTarget.dataset.map));
        });
    }

    // マップの表示を切り替えるメソッド
    switchMap(mapId) {
        if (this.currentMap === mapId) return;

        // 1. ボタンのアクティブ状態を切り替え
        this.shadowRoot.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
            // 非アクティブ時はアクセントカラーの影に戻す
            btn.style.transform = 'translate(0, 0)';
            btn.style.boxShadow = '4px 4px 0 var(--accent-color)';
        });
        const activeButton = this.shadowRoot.querySelector(`[data-map="${mapId}"]`);
        activeButton.classList.add('active');
        // アクティブになったボタンは押し込んだ状態に
        activeButton.style.transform = 'translateY(3px)';
        activeButton.style.boxShadow = '0 3px 0 var(--dark-color)'; // 下の影はダークカラーで強調

        // 2. マップセクションの表示/非表示を切り替え
        this.shadowRoot.querySelectorAll('.map-section').forEach(section => {
            section.classList.remove('active');
        });
        const activeSection = this.shadowRoot.getElementById(mapId);
        if (activeSection) {
            activeSection.classList.add('active');
        }

        this.currentMap = mapId;
    }
}

customElements.define('map-container-component', MapContainerComponent);