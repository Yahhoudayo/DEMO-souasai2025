// ====================================================================
// Part 1: EventCard - イベントカードコンポーネント
// ====================================================================
class EventCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.addEventListener('click', this.handleCardClick);
    }

    connectedCallback() {
        const name = this.getAttribute('name') || 'タイトル未定';
        const time = this.getAttribute('time') || '時刻未定';
        const location = this.getAttribute('location') || '場所未定';
        const tagsString = this.getAttribute('tags') || '';
        const eventId = this.getAttribute('event-id');

        const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
        const tagsHTML = tagsArray.map(tag => `<span class="tag">${tag}</span>`).join('');

        this.shadowRoot.innerHTML = `
            <style>
                /* ⭐ 変更点: Material Symbolsの読み込みを削除 */
                @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=M+PLUS+Rounded+1c:wght@400;700&display=block');

                :host {
                    --primary-color: #0096C7;
                    --accent-color: #FF8FAB;
                    --yellow-color: #FFD166;
                    --dark-color: #2A323A;
                    --bg-color: #ffffff;
                    
                    --font-title: 'Baloo 2', cursive;
                    --font-body: 'M PLUS Rounded 1c', sans-serif;
                    
                    display: block;
                    opacity: 0;
                    transform: translateY(30px);
                    animation: popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                }

                @keyframes popIn {
                    to { opacity: 1; transform: translateY(0); }
                }

                .event-card {
                    font-family: var(--font-body);
                    background: var(--bg-color);
                    border-radius: 16px;
                    border: 3px solid var(--dark-color);
                    box-shadow: 8px 8px 0px 0px var(--dark-color);
                    margin-bottom: 15px;
                    padding: 18px;
                    transition: all 0.2s ease-in-out;
                    cursor: pointer;
                }
                .event-card:hover {
                    transform: translate(-4px, -4px);
                    box-shadow: 12px 12px 0px 0px var(--dark-color);
                }
                .event-name {
                    font-family: var(--font-body);
                    font-size: 1.5em;
                    font-weight: 700;
                    color: var(--dark-color);
                    margin: 0 0 6px 0;
                    transform: translateZ(0);
                }
                .icon-text-line {
                    color: #555;
                    font-size: 0.95em;
                    margin-bottom: 8px;
                    display: flex;
                    align-items: center;
                    font-weight: 700;
                }
                /* ⭐ 変更点: <img>タグ用のスタイルに修正 */
                .icon {
                    width: 1.2em;
                    height: 1.2em;
                    margin-right: 10px;
                    vertical-align: middle; /* 上下中央揃え */
                }
                .event-tags { display: flex; flex-wrap: wrap; gap: 10px; }
                .tag {
                    background-color: var(--yellow-color);
                    color: var(--dark-color);
                    padding: 6px 16px;
                    border-radius: 50px;
                    font-size: 0.85em;
                    font-weight: 700;
                    border: 2px solid var(--dark-color);
                    transition: all 0.2s ease;
                }
                .event-card:hover .tag {
                    background-color: var(--accent-color);
                    color: white;
                }
            </style>
            
            <div class="event-card" data-id="${eventId}">
                <div class="event-details">
                    <h3 class="event-name">${name}</h3>
                    <div class="icon-text-line">
                        <img class="icon" src="${this.getAttribute('icon-location')}" alt="">
                        <span>${location}</span>
                    </div>
                    <div class="icon-text-line">
                        <img class="icon" src="${this.getAttribute('icon-time')}" alt="">
                        <span>${time}</span>
                    </div>
                    <div class="event-tags">${tagsHTML}</div>
                </div>
            </div>
        `;
    }

    handleCardClick() {
        this.dispatchEvent(new CustomEvent('event-selected', {
            bubbles: true, composed: true, detail: { id: this.getAttribute('event-id') }
        }));
    }
}
customElements.define('event-card', EventCard);


// ====================================================================
// Part 2: ScheduleComponent - スケジュール全体を管理するコンポーネント
// ====================================================================
class ScheduleComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.scheduleDataUrl = 'data/schedule.json';
        this.configUrl = 'data/schedule-config.json';
        this.fullScheduleData = [];
        this.config = null;
    }

    async connectedCallback() {
        this.mode = this.getAttribute('mode') || 'full';
        this.shadowRoot.addEventListener('event-selected', this.handleEventSelected.bind(this));

        this.renderBaseHTML();

        try {
            await this.loadFonts();

            const [configData] = await Promise.all([
                this.loadConfig(),
                this.loadScheduleData()
            ]);
            this.config = configData;
            this.renderSchedule();

            requestAnimationFrame(() => {
                this.shadowRoot.querySelector('.schedule-container').style.opacity = 1;
            });

        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            this.shadowRoot.getElementById('schedule-content').innerHTML =
                '<p class="loading" style="color: red;">スケジュールの読み込みに失敗しました。</p>';
        }
    }

    async loadFonts() {
        await Promise.all([
            document.fonts.load('700 1em "Baloo 2"'),
            document.fonts.load('400 1em "M PLUS Rounded 1c"')
        ]);
    }

    async loadConfig() {
        const response = await fetch(this.configUrl);
        if (!response.ok) throw new Error('設定ファイルの読み込みに失敗しました。');
        return await response.json();
    }

    async loadScheduleData() {
        const response = await fetch(this.scheduleDataUrl);
        if (!response.ok) throw new Error('スケジュールデータの読み込みに失敗しました。');
        const data = await response.json();
        this.fullScheduleData = data[0].events;
    }

    renderSchedule() {
        const contentDiv = this.shadowRoot.getElementById('schedule-content');
        contentDiv.innerHTML = '';
        let eventsFound = false;
        let cardDelay = 0;

        if (this.mode === 'current') {
            const now = new Date();
            const currentTime = now.getHours() * 60 + now.getMinutes();
            const timeToMinutes = (timeStr) => {
                const [hours, minutes] = timeStr.split(':').map(Number);
                return hours * 60 + minutes;
            };
            const isEventCurrent = (event) => {
                const startTime = timeToMinutes(event.time_start);
                const endTime = timeToMinutes(event.time_end);
                return currentTime >= startTime && currentTime < endTime;
            }
            let currentEvents = this.fullScheduleData.filter(event => isEventCurrent(event));
            let eventsToRender = [];
            let headerText = '';

            if (currentEvents.length > 0) {
                eventsToRender = currentEvents;
                headerText = this.config.headers.currentEvents;
            } else {
                eventsToRender = this.fullScheduleData.slice(0, 3);
                headerText = this.config.headers.nextEvents;
            }

            if (eventsToRender.length > 0) {
                const header = document.createElement('p');
                header.className = 'suggestion-header';
                header.textContent = headerText;
                contentDiv.appendChild(header);

                eventsToRender.forEach(event => {
                    const eventCard = document.createElement('event-card');
                    eventCard.setAttribute('event-id', event.name);
                    eventCard.setAttribute('name', event.name);
                    eventCard.setAttribute('time', `${event.time_start} - ${event.time_end}`);
                    eventCard.setAttribute('location', event.location);
                    eventCard.setAttribute('tags', event.tags.join(', '));
                    eventCard.setAttribute('icon-location', this.config.emojis.location);
                    eventCard.setAttribute('icon-time', this.config.emojis.time);
                    eventCard.style.animationDelay = `${cardDelay * 0.1}s`;
                    contentDiv.appendChild(eventCard);
                    cardDelay++;
                });
                eventsFound = true;

                const linkContainer = document.createElement('div');
                linkContainer.className = 'all-events-link-container';
                linkContainer.innerHTML = `<a href="schedule.html" class="all-events-link">${this.config.headers.allEventsLink}</a>`;
                contentDiv.appendChild(linkContainer);
            }
        } else {
            contentDiv.innerHTML = '<h1>Schedule</h1>';
            const eventsList = document.createElement('div');
            eventsList.className = 'events-list';

            this.fullScheduleData.forEach(event => {
                const eventCard = document.createElement('event-card');
                eventCard.setAttribute('event-id', event.name);
                eventCard.setAttribute('name', event.name);
                eventCard.setAttribute('time', `${event.time_start} - ${event.time_end}`);
                eventCard.setAttribute('location', event.location);
                eventCard.setAttribute('tags', event.tags.join(', '));
                eventCard.setAttribute('icon-location', this.config.emojis.location);
                eventCard.setAttribute('icon-time', this.config.emojis.time);
                eventCard.style.animationDelay = `${cardDelay * 0.08}s`;
                eventsList.appendChild(eventCard);
                cardDelay++;
            });
            contentDiv.appendChild(eventsList);
            eventsFound = true;
        }

        if (!eventsFound) {
            contentDiv.innerHTML = '<p class="loading">表示できるスケジュール情報がありません。</p>';
        }
    }

    handleEventSelected(event) {
        const eventId = event.detail.id;
        const eventDetails = this.fullScheduleData.find(e => e.name === eventId);
        if (eventDetails) {
            this.showModal(eventDetails);
        }
    }

    showModal(event) {
        const modalDetailsDiv = this.shadowRoot.getElementById('modal-details');
        const eventName = event.name;
        const posterUrl = event.poster_url || '';

        let modalContentHTML = '';

        if (posterUrl) {
            modalContentHTML = `
                <h2 style="text-align: center; margin-bottom: 20px;">${eventName}</h2>
                <img src="${posterUrl}" alt="${eventName} ポスター" style="max-width: 100%; height: auto; display: block; margin: 0 auto; border-radius: 8px; border: 2px solid var(--dark-color); box-shadow: 4px 4px 0px 0px var(--dark-color);">
                <p style="text-align: center; margin-top: 20px; font-size: 1.1em; color: #555;">
                    詳細については当日会場でご確認ください！
                </p>
            `;
        } else {
            const tagsHTML = event.tags.map(tag => `<span style="display:inline-block; background-color:#FFD166; color:#2A323A; padding:6px 16px; margin-right:8px; margin-bottom: 8px; border-radius:50px; font-size:0.9em; font-weight:700; border: 2px solid #2A323A;">#${tag}</span>`).join('');
            const em = this.config.modal_emojis;
            // ⭐ 変更点: <span>を<img>に変更
            modalContentHTML = `
                <h2>${eventName}</h2>
                <p class="icon-text-line" style="margin-bottom: 12px;"><img class="icon" src="${em.location}" alt=""> <strong>場所:</strong> ${event.location}</p>
                <p class="icon-text-line" style="margin-bottom: 12px;"><img class="icon" src="${em.time}" alt=""> <strong>時間:</strong> ${event.time_start} - ${event.time_end}</p> 
                <p class="icon-text-line" style="margin-bottom: 12px;"><img class="icon" src="${em.category}" alt=""> <strong>カテゴリ:</strong> ${event.category || '未分類'}</p>
                <hr style="border: none; border-top: 2px dashed #ccc; margin: 25px 0;">
                <p class="icon-text-line" style="margin-bottom: 12px;"><img class="icon" src="${em.details}" alt=""> <strong>詳細:</strong></p>
                <p>${event.description || 'イベントの詳細な説明は現在準備中です。当日をお楽しみに！'}</p>
                <div style="margin-top: 30px;">${tagsHTML}</div>
            `;
        }

        modalDetailsDiv.innerHTML = modalContentHTML;
        this.shadowRoot.getElementById('schedule-modal').style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.shadowRoot.getElementById('schedule-modal').style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    renderBaseHTML() {
        this.shadowRoot.innerHTML = `
            <style>
                /* ⭐ 変更点: Material Symbolsの読み込みを削除 */
                @import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@700&family=M+PLUS+Rounded+1c:wght@400;700&display=block');

                :host {
                    --primary-color: #0096C7;
                    --accent-color: #FF8FAB;
                    --yellow-color: #FFD166;
                    --dark-color: #2A323A;
                    
                    --font-title: 'Baloo 2', cursive;
                    --font-body: 'M PLUS Rounded 1c', sans-serif;
                }
                .schedule-container {
                    font-family: var(--font-body);
                    max-width: 900px;
                    margin: 50px auto;
                    padding: 0 20px;
                    opacity: 0; 
                    transition: opacity 0.3s ease-in-out;
                }
                h1 {
                    font-family: var(--font-title);
                    text-align: center;
                    margin-bottom: 20px;
                    font-size: 5.5em;
                    font-weight: 700;
                    transition: transform 0.3s ease;
                    background: linear-gradient(45deg, var(--yellow-color), var(--accent-color) 80%);
                    -webkit-background-clip: text;
                    background-clip: text;
                    color: transparent;
                    -webkit-text-stroke: 4px var(--dark-color);
                    text-stroke: 4px var(--dark-color);
                    text-shadow: 7px 7px 0px var(--primary-color);
                    transform: rotate(-2.5deg) translateZ(0);
                }
                h1:hover { transform: rotate(1.5deg) scale(1.05) translateZ(0); }
                
                .events-list { 
                    padding-top: 15px;
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 2rem;
                }

                @media (max-width: 768px) {
                    h1 {
                        font-size: 4em;
                        -webkit-text-stroke: 3px var(--dark-color);
                        text-stroke: 3px var(--dark-color);
                    }
                    .events-list {
                        grid-template-columns: 1fr;
                    }
                    .schedule-container {
                        padding: 0 15px;
                    }
                }
                .loading { text-align: center; color: #666; padding: 50px; font-size: 1.2em; font-weight: 700; }
                .suggestion-header { text-align: center; color: var(--dark-color); margin: 20px 0; font-size: 1.2em; font-weight: 700; background-color: var(--yellow-color); border: 3px solid var(--dark-color); padding: 15px; border-radius: 12px; box-shadow: 5px 5px 0 0 var(--dark-color); }
                .all-events-link-container { text-align: center; margin: 40px 0 20px; }
                .all-events-link { display: inline-block; padding: 15px 40px; background: var(--accent-color); color: white; text-decoration: none; border-radius: 50px; font-size: 1.3em; font-weight: 700; border: 3px solid var(--dark-color); box-shadow: 5px 5px 0 0 var(--dark-color); transition: all 0.2s ease-in-out; }
                .all-events-link:hover { transform: translate(-2px, -2px); box-shadow: 7px 7px 0 0 var(--dark-color); }
                .modal-overlay { display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.6); z-index: 1000; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
                .modal-content { font-family: var(--font-body); background: white; padding: 30px 40px; border-radius: 16px; width: 90%; max-width: 600px; position: relative; border: 4px solid var(--dark-color); box-shadow: 10px 10px 0 0 var(--dark-color); animation: popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1); }
                .modal-content h2 { 
                    font-family: var(--font-body);
                    font-weight: 700; 
                    color: var(--primary-color); 
                    border-bottom: 3px solid #eee; 
                    padding-bottom: 15px; 
                    margin: 0 0 25px 0; 
                    font-size: clamp(1.6em, 5vw, 2.5em);
                }
                .modal-content p { line-height: 1.7; margin-bottom: 12px; color: #333; }
                .modal-close { position: absolute; top: 15px; right: 20px; font-size: 2.5em; cursor: pointer; color: #ccc; font-weight: 700; transition: all 0.2s; }
                .modal-close:hover { color: var(--accent-color); transform: rotate(90deg) scale(1.1); }
                
                /* ⭐ 変更点: モーダル内でもアイコンスタイルを使えるように追加 */
                .modal-content .icon-text-line {
                    display: flex;
                    align-items: center;
                }
                .modal-content .icon {
                    width: 1.2em;
                    height: 1.2em;
                    margin-right: 10px;
                    vertical-align: middle;
                }
            </style>
            
            <div class="schedule-container">
                <div id="schedule-content">
                    <p class="loading">スケジュールデータを読み込み中...</p>
                </div>
            </div>
            
            <div id="schedule-modal" class="modal-overlay">
                <div class="modal-content">
                    <span id="modal-close-btn" class="modal-close">&times;</span>
                    <div id="modal-details"></div>
                </div>
            </div>
        `;

        const modal = this.shadowRoot.getElementById('schedule-modal');
        this.shadowRoot.getElementById('modal-close-btn').addEventListener('click', () => this.closeModal());
        modal.addEventListener('click', (e) => {
            if (e.target.id === 'schedule-modal') this.closeModal();
        });
    }
}
customElements.define('schedule-component', ScheduleComponent);