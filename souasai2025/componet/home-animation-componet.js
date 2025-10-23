class HomeAnimationStack extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    // 要素がドキュメントに接続されたときに実行
    connectedCallback() {
        this.startAnimations();
    }

    // HTML構造とCSSをShadow DOM内にレンダリング
    render() {
        const style = document.createElement('style');
        style.textContent = this.getCss();

        // 画像のsrc属性をHTMLから取得（属性がなければデフォルト値を使用）
        const mainBackSrc = this.getAttribute('back-src') || 'images/IMG_1255.PNG';
        const mainSmahoSrc = this.getAttribute('smaho-src') || 'images/smaho.PNG';
        const mainHumanSrc = this.getAttribute('human-src') || 'images/IMG_1300.PNG';

        const container = document.createElement('div');
        container.innerHTML = `
            <div class="wrapper">
                <div class="image-container">
                    <img src="${mainBackSrc}" class="main-back-image">
                    <img src="${mainSmahoSrc}" class="main-smaho" id="main-smaho">
                    <img src="${mainHumanSrc}" class="main-human" id="main-human">
                </div>
            </div>
        `;

        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(container);
    }

    // CSSとキーフレームの定義
    getCss() {
        return `
            /* 1. ラッパー (.wrapper) */
            .wrapper {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                padding: 0;
                box-sizing: border-box;
                width: 100%; /* ⭐ ここを修正しました */
            }

            /* 2. イメージコンテナ (.image-container) */
            .image-container {
                position: relative;
                width: 100%; /* ⭐ ここを修正しました */
                height: 0;
                padding-bottom: 143.90%; /* 820x1180の比率 */
            }

            /* 3. 画像 (img) の基本設定 */
            .image-container img {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
            }

            .main-back-image {
                z-index: 1;
            }

            /* ⭐︎ main-smaho の設定 (slideIn アニメーション初期状態) */
            .main-smaho {
                z-index: 2;
                top: 2vh;
                left: 2vw;
                width: calc(100% - 2vw);
                height: calc(100% - 2vh);
                transform: translateX(180px);
                opacity: 0;
            }

            /* ⭐︎ main-human の設定 (poyoyon アニメーション初期状態) */
            .main-human {
                z-index: 3;
                top: 2vh;
                left: 2vw;
                width: calc(100% - 2vw);
                height: calc(100% - 2vh);
                transform: translateX(-140px);
                opacity: 0;
            }

            /* --- アニメーションの定義 --- */
            .main-smaho.is-animated {
                animation: slideIn 2s cubic-bezier(0.25, 1, 0.5, 1) forwards;
            }
            .main-human.is-animated {
                animation: poyoyon 1.0s cubic-bezier(0.12, 0, 0.39, 0) 1 forwards;

            }

            @keyframes slideIn {
                0% { transform: translateX(180px); opacity: 0; }
                100% { transform: translateX(0); opacity: 1; }
            }

            @keyframes poyoyon {
                0% { transform: translateX(-140px); opacity: 0; }
                50% { transform: translateX(0); }
                65% { transform: translateX(30px); }
                100% { transform: translateX(0); opacity: 1; }
            }

            /* 4. メディアクエリ (スマートフォン/タブレット向け) */
            @media (max-width: 768px) {
                .wrapper {
                    align-items: flex-start;
                    min-height: auto;
                    padding-top: 5px;
                }

                .image-container {
                    /* スマホでは vw を使ってもスクロールバーが出にくいため、そのままでもOK */
                    width: 100vw;
                }

                .main-smaho {
                    top: 1vh; left: 1vw;
                    width: calc(100% - 1vw); height: calc(100% - 1vh);
                    transform: translateX(50px);
                }
                .main-human {
                    top: 1vh; left: 1vw;
                    width: calc(100% - 1vw); height: calc(100% - 1vh);
                    transform: translateX(-50px);
                }
            }
        `;
    }

    // アニメーション制御ロジック
    startAnimations() {
        const smahoImage = this.shadowRoot.getElementById('main-smaho');
        const humanImage = this.shadowRoot.getElementById('main-human');

        if (smahoImage) {
            setTimeout(() => {
                smahoImage.classList.add('is-animated');
            }, 100);
        }

        if (humanImage) {
            setTimeout(() => {
                humanImage.classList.add('is-animated');
            }, 200);
        }
    }
}

customElements.define('home-animation-component', HomeAnimationStack);