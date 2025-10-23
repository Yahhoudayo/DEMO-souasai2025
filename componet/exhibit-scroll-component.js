class ExhibitScrollComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentIndex = 0;
        this.touchStartX = 0;
        this.touchStartY = 0;
        this.lastRotateX = 0;
        this.isSwiping = false;
        this.swipeThreshold = 30;
    }

    connectedCallback() {
        this.render();
        requestAnimationFrame(() => {
            this.setupEventListeners();
            this.arrangeInLine();

            setTimeout(() => {
                if (this.container) {
                    this.container.classList.add('is-initialized');
                }
            }, 100);
        });
    }

    setupEventListeners() {
        this.container = this.shadowRoot.getElementById('carouselContainer');
        this.items = Array.from(this.shadowRoot.querySelectorAll('.scroll-item'));
        this.modalOverlay = this.shadowRoot.getElementById('modalOverlay');
        this.modalImage = this.shadowRoot.getElementById('modalImage');
        this.modalCloseButton = this.shadowRoot.getElementById('modalCloseButton');

        if (!this.container || this.items.length === 0) {
            console.error('Exhibit component elements not found.');
            return;
        }

        this.items.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('is-center')) {
                    const src = item.getAttribute('data-src');
                    if (src) {
                        this.showModal(src);
                    }
                }
            });
        });

        if (this.modalCloseButton) {
            this.modalCloseButton.addEventListener('click', () => this.closeModal());
        }
        if (this.modalOverlay) {
            this.modalOverlay.addEventListener('click', (event) => {
                if (event.target === this.modalOverlay) {
                    this.closeModal();
                }
            });
        }

        // wheel イベントは縦横の判定が異なるため、passive: false を維持
        this.container.addEventListener('wheel', this.handleWheel.bind(this), { passive: false });
        this.container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
        // touchmove も e.preventDefault() を呼ばないため passive: true でも動作可能だが、安全のため false を維持
        this.container.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
        this.container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
    }

    // ----------------------------------------
    // --- イベントハンドラメソッド ---
    // ----------------------------------------

    handleWheel(e) {
        if (Math.abs(e.deltaX) < Math.abs(e.deltaY) * 2) {
            return;
        }

        e.preventDefault();

        if (this.isSwiping) return;
        this.isSwiping = true;

        const direction = e.deltaX > 0 ? 1 : -1;
        this.rotate(direction, 1);

        setTimeout(() => {
            this.isSwiping = false;
        }, 200);
    }

    handleTouchStart(e) {
        this.touchStartX = e.touches[0].clientX;
        this.touchStartY = e.touches[0].clientY;
        this.lastRotateX = this.touchStartX;
        this.isDragging = false;
    }

    handleTouchMove(e) {
        const currentX = e.touches[0].clientX;

        // ⭐ 修正: 縦スクロール判定と e.preventDefault() を削除し、CSS (touch-action) に処理を委譲 ⭐
        // 縦横の移動判定も、e.preventDefault() を呼ばないので不要になるが、
        // カルーセル回転ロジックに必要な計算は残す

        this.isDragging = true;

        // アニメーション中の場合は処理をスキップ
        if (this.isSwiping) {
            return;
        }

        const moveSinceLastRotate = this.lastRotateX - currentX;

        // 横移動が回転閾値を超えたら、カルーセルを回転させる
        if (Math.abs(moveSinceLastRotate) >= this.swipeThreshold * 2) {

            // e.preventDefault() は touch-action: pan-y に任せるため削除

            const direction = moveSinceLastRotate > 0 ? 1 : -1;
            this.rotate(direction, 1);
            this.lastRotateX = currentX;

            this.isSwiping = true;
            setTimeout(() => {
                this.isSwiping = false;
            }, 200);
        }
    }

    handleTouchEnd() {
        // touchendでは追加の処理は不要
    }

    // ----------------------------------------
    // --- メインロジックメソッド ---
    // ----------------------------------------

    arrangeInLine() {
        const totalItems = this.items.length;
        const z_factor = 100;
        const y_offset_factor = -20;

        const imageWidthPct = 50;

        const overlapPct = 70;
        const visibleGapPct = imageWidthPct * (1 - (overlapPct / 100));

        this.items.forEach((item, index) => {
            item.classList.remove('is-center');

            let relativeIndex = index - this.currentIndex;
            if (relativeIndex > totalItems / 2) {
                relativeIndex -= totalItems;
            } else if (relativeIndex < -totalItems / 2) {
                relativeIndex += totalItems;
            }

            if (Math.abs(relativeIndex) <= 3) {
                const distance = Math.abs(relativeIndex);
                let x = relativeIndex * visibleGapPct;
                const y = distance * y_offset_factor;
                const z = -z_factor * (distance * distance * 0.5);
                const scale = 1.0 - distance * 0.05;
                const opacity = 1.0 - distance * 0.1;

                let zIndex = 100 - distance * 10;
                if (relativeIndex === 0) {
                    zIndex = 100;
                    item.classList.add('is-center');
                } else if (Math.abs(relativeIndex) === 1) {
                    zIndex = 90;
                } else {
                    zIndex = 80 - distance * 10;
                }

                item.style.transform = `translateX(${x}vw) translateY(${y}px) translateZ(${z}px) scale(${scale})`;
                item.style.opacity = opacity;
                item.style.zIndex = zIndex;
                item.style.display = 'block';

            } else {
                item.style.display = 'none';
            }
        });
    }

    rotate(direction, step = 1) {
        this.currentIndex = (this.currentIndex + direction * step + this.items.length) % this.items.length;
        this.arrangeInLine();
    }

    showModal(imageSrc) {
        if (this.modalImage && this.modalOverlay) {
            this.modalImage.src = imageSrc;
            this.modalOverlay.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
    }

    closeModal() {
        if (this.modalOverlay) {
            this.modalOverlay.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    // ----------------------------------------
    // --- レンダリング関連メソッド ---
    // ----------------------------------------

    render() {
        const style = document.createElement('style');
        style.textContent = this.getCss();
        const template = document.createElement('template');
        template.innerHTML = this.getHtml();
        this.shadowRoot.appendChild(style);
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    getHtml() {
        return `
      <div class="carousel-wrapper">
        <div class="carousel-container" id="carouselContainer">
            <img src="../images/exhibition-posters/01.JPG" alt="展示1" class="scroll-item" data-src="../images/exhibition-posters/01.JPG">
            <img src="../images/exhibition-posters/02.JPG" alt="展示2" class="scroll-item" data-src="../images/exhibition-posters/02.JPG">
            <img src="../images/exhibition-posters/03.JPG" alt="展示3" class="scroll-item" data-src="../images/exhibition-posters/03.JPG">
            <img src="../images/exhibition-posters/04.JPG" alt="展示4" class="scroll-item" data-src="../images/exhibition-posters/04.JPG">
            <img src="../images/exhibition-posters/05.JPG" alt="展示5" class="scroll-item" data-src="../images/exhibition-posters/05.JPG">
            <img src="../images/exhibition-posters/06.JPG" alt="展示6" class="scroll-item" data-src="../images/exhibition-posters/06.JPG">
            <img src="../images/exhibition-posters/07.JPG" alt="展示7" class="scroll-item" data-src="../images/exhibition-posters/07.JPG">
        </div>
      </div>
      <div class="modal-overlay" id="modalOverlay">
          <img src="" alt="拡大画像" class="modal-image" id="modalImage">
          <span class="modal-close-button" id="modalCloseButton">&times;</span>
      </div>
    `;
    }

    getCss() {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=M+PLUS+Rounded+1c:wght@400;700&display=swap');

            :host {
                --primary-color: #0096C7;
                --accent-color: #FF8FAB;
                --yellow-color: #FFD166;
                --dark-color: #2A323A;
                
                --font-body: 'M PLUS Rounded 1c', sans-serif;
                
                display: block;
                width: 100%; 
                
                overflow-x: hidden; 
                font-family: var(--font-body);
                position: relative; 
            }

            .carousel-wrapper {
                position: relative;
                height: 500px;
                display: flex;
                justify-content: center;
                align-items: center;
                overflow-x: hidden; 
                overflow-y: visible; 
                z-index: 1; 
                
                width: 100vw; 
                margin-left: calc(50% - 50vw);
                margin-right: calc(50% - 50vw);
                
                background: none;
                background-color: transparent; 
            }

            .carousel-container {
                position: relative;
                width: 100%; 
                height: 400px; 
                transform-style: preserve-3d;
                perspective: 1500px; 
                /* ⭐ 修正: touch-action を pan-y に変更し、縦スクロールを優先させる ⭐ */
                touch-action: pan-y; 
                user-select: none;
                z-index: 10; 
            }
            
            /* 初回初期化前はアニメーションを無効化 */
            .carousel-container:not(.is-initialized) .scroll-item {
                 transition: none !important;
            }

            .scroll-item {
                position: absolute;
                width: 60vw; 
                max-width: 450px; 
                height: auto;
                top: 50%; 
                left: 50%;
                margin-left: calc(-30vw); 
                margin-top: -20vh; 
                
                border-radius: 16px; 
                border: 3px solid var(--dark-color); 
                box-shadow: 8px 8px 0px 0px var(--dark-color); 
                
                transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94), 
                            opacity 0.15s ease,
                            box-shadow 0.2s ease,
                            border-color 0.2s ease;
                transform-style: preserve-3d;
                
                cursor: default;
                background-color: white; 
                object-fit: contain; 
            }
            
            .scroll-item.is-center {
                cursor: pointer;
                border-color: var(--primary-color); 
                box-shadow: 10px 10px 0px 0px var(--primary-color), 
                            0 0 0 5px var(--yellow-color) inset; 
            }
            
            .scroll-item.is-center::after {
                content: "＋";
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                
                font-family: 'Baloo 2', sans-serif;
                font-size: 5em;
                color: var(--dark-color);
                
                opacity: 0; 
                transition: opacity 0.3s ease; 
                
                z-index: 200; 
                pointer-events: none; 
            }
            
            /* 初期化完了後に is-center の::afterに不透明度を設定し、アニメーションを有効化 */
            .carousel-container.is-initialized .scroll-item.is-center::after {
                opacity: 0.8; 
                animation: pulse 1.5s infinite; 
            }

            .scroll-item.is-center:hover::after {
                opacity: 0 !important; 
                animation: none !important;
            }
            
            @keyframes pulse {
                0% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
                50% { transform: translate(-50%, -50%) scale(1.05); opacity: 0.9; }
                100% { transform: translate(-50%, -50%) scale(0.9); opacity: 0.6; }
            }


            .scroll-item:hover {
                transform: translate(-4px, -4px) translateZ(5px) scale(1.02); 
                box-shadow: 12px 12px 0px 0px var(--accent-color); 
                border-color: var(--accent-color); 
                z-index: 101 !important; 
            }
            
            .scroll-item.is-center:hover {
                box-shadow: 15px 15px 0px 0px var(--accent-color), 
                            0 0 0 7px var(--yellow-color) inset; 
                border-color: var(--accent-color);
                transform: translate(-6px, -6px) translateZ(10px) scale(1.05); 
            }

            .modal-overlay {
                display: none;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.6);
                justify-content: center;
                align-items: center;
                z-index: 2000;
                backdrop-filter: blur(5px);
            }

            .modal-image {
                max-width: 90%;
                max-height: 80%;
                object-fit: contain;
                border: 3px solid var(--dark-color);
                border-radius: 16px;
                box-shadow: 8px 8px 0px 0px var(--dark-color);
            }

            .modal-close-button {
                position: absolute;
                top: 15px;
                right: 20px; 
                font-size: 2.5em; 
                color: var(--dark-color); 
                cursor: pointer;
                line-height: 1;
                font-weight: 700; 
                transition: all 0.2s;
            }

            .modal-close-button:hover { 
                color: var(--accent-color); 
                transform: rotate(90deg) scale(1.1); 
            }

            @media (min-width: 700px) { 
                .scroll-item {
                    margin-left: -225px; 
                }
            }
        `;
    }
}

customElements.define('exhibit-scroll-component', ExhibitScrollComponent);