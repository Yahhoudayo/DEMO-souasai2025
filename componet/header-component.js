class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    connectedCallback() {
        this.setupEventListeners();
    }

    disconnectedCallback() {
        if (this.hamburger) {
            this.hamburger.removeEventListener('click', this.handleHamburgerClick);
        }
        window.removeEventListener('scroll', this.handleScroll);
    }

    setupEventListeners() {
        this.hamburger = this.shadowRoot.querySelector('.hamburger');
        this.mobileMenu = this.shadowRoot.querySelector('.mobile-menu');

        this.handleHamburgerClick = this.handleHamburgerClick.bind(this);
        this.handleMenuItemClick = this.handleMenuItemClick.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        if (this.hamburger && this.mobileMenu) {
            this.hamburger.addEventListener('click', this.handleHamburgerClick);

            this.shadowRoot.querySelectorAll('.menu-item').forEach(item => {
                item.addEventListener('click', this.handleMenuItemClick);
            });

            this.mobileMenu.addEventListener('click', (e) => {
                if (e.target === this.mobileMenu) {
                    this.closeMenu();
                }
            });
        }
        window.addEventListener('scroll', this.handleScroll);
    }

    openMenu() {
        this.hamburger.classList.add('active');
        this.mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMenu() {
        this.hamburger.classList.remove('active');
        this.mobileMenu.classList.remove('active');
        document.body.style.overflow = 'auto';
    }

    handleHamburgerClick() {
        if (this.mobileMenu.classList.contains('active')) {
            this.closeMenu();
        } else {
            this.openMenu();
        }
    }

    handleMenuItemClick(e) {
        const href = e.currentTarget.getAttribute('href');
        if (href && href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }
        this.closeMenu();
    }

    handleScroll() {
        // No scroll effect
    }

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
            <header>
                <div class="logo">
                <a href="../index.html" style="color: inherit; text-decoration: none; cursor: default;">蒼阿祭2025</a>

                </div>
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </header>

            <nav class="mobile-menu">
                <div class="menu-nav">
                    <div class="menu-section">
                        <div class="menu-section-title">Menu</div>
                        <a href="index.html" class="menu-item">トップ</a>
                        <a href="#news" class="menu-item">最新情報</a>
                        <a href="#schedule" class="menu-item">スケジュール</a>
                        <a href="#exhibition" class="menu-item">展示・発表</a>
                        <a href="#map" class="menu-item">マップ</a>
                        <a href="#food" class="menu-item">たべもの</a>
                    </div>
                    
                    <div class="menu-contact">
                        <h3>Contact</h3>
                        <div class="contact-info">📧 souasaiinquiry@gmail.com</div>
                        <div class="contact-info">📍 〒774-0017 徳島県阿南市見能林町青木265</div>
                    </div>
                </div>
            </nav>
        `;
    }

    getCss() {
        return `
            @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=M+PLUS+Rounded+1c:wght@500;800&display=swap');

            :host {
                --primary-color: #00BFFF;
                --accent-color: #FF8FAB;
                --yellow-color: #FFD166;
                --dark-color: #2A323A;
                
                --font-title: 'Baloo 2', cursive;
                --font-body: 'M PLUS Rounded 1c', sans-serif;

                display: block;
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                z-index: 1000;
            }
            
            header {
                font-family: var(--font-body);
                background: #fff;
                border-bottom: 3px solid var(--primary-color);
                box-shadow: 0 4px 0 var(--primary-color);
                padding: 1.2rem 2rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                z-index: 1001;
            }

            .logo {
                font-family: var(--font-body);
                font-size: 2.2rem;
                font-weight: 800;
                color: var(--primary-color);
            }

            .hamburger {
                display: flex;
                flex-direction: column;
                cursor: pointer;
                gap: 5px;
                padding: 10px;
            }

            .hamburger span {
                width: 28px;
                height: 4px;
                background-color: var(--primary-color);
                border-radius: 2px;
                transition: all 0.3s ease;
            }

            .hamburger.active span {
                background-color: var(--dark-color);
            }

            .hamburger.active span:nth-child(1) {
                transform: rotate(45deg) translate(6px, 6px);
            }
            .hamburger.active span:nth-child(2) {
                opacity: 0;
            }
            .hamburger.active span:nth-child(3) {
                transform: rotate(-45deg) translate(6px, -6px);
            }

            .mobile-menu {
                font-family: var(--font-body);
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                background: #fff;
                border-right: 3px solid var(--dark-color);
                box-shadow: 4px 0 0 var(--dark-color);
                transform: translateX(-100%);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55), visibility 0s 0.3s; /* ⭐ 修正点 */
                z-index: 1000;
                padding-top: 100px;
                overflow-y: auto;
                box-sizing: border-box;
                visibility: hidden; /* ⭐ 修正点: 初期状態を非表示に */
            }

            .mobile-menu.active {
                transform: translateX(0);
                visibility: visible; /* ⭐ 修正点: active時に表示 */
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); /* ⭐ 修正点 */
            }

            .menu-nav {
                padding: 2rem;
                padding-bottom: 100px;
            }

            .menu-section-title {
                font-family: var(--font-title);
                color: var(--accent-color);
                font-size: 1.5rem;
                padding-bottom: 0.5rem;
                margin-bottom: 1rem;
                border-bottom: 3px solid var(--dark-color);
            }

            .menu-item {
                display: block;
                padding: 1.2rem 1rem;
                color: var(--dark-color);
                text-decoration: none;
                font-size: 1.3rem;
                font-weight: 700;
                border: 2px solid transparent;
                border-radius: 8px;
                margin-bottom: 0.5rem;
                transition: all 0.2s ease-out;
            }
            
            .menu-item:hover {
                background: var(--yellow-color);
                border-color: var(--dark-color);
                transform: translateX(5px);
                box-shadow: 2px 2px 0 var(--dark-color);
            }

            .menu-contact {
                margin-top: 3rem;
                padding-top: 1.5rem;
                border-top: 2px dashed #ccc;
            }

            .menu-contact h3 {
                font-family: var(--font-title);
                color: var(--primary-color);
                font-size: 1.5rem;
                margin-bottom: 1rem;
            }

            .contact-info {
                color: #555;
                margin-bottom: 0.5rem;
                font-weight: 500;
            }

            @media (max-width: 768px) {
                header {
                    padding: 1rem 1.5rem;
                }
                .logo {
                    font-size: 2rem;
                }
            }
        `;
    }
}

customElements.define('header-component', HeaderComponent);