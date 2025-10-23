class MapComponent extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });

    const locationData = {
      '男子トイレ': {
        image: 'images/pins/a.webp',
        detail: '男子トイレです。'
      },
      '女子トイレ': {
        image: 'images/pins/b.webp',
        detail: '女子トイレです。'
      },
      '機械専門展示(3M、4M、5M)': {
        image: 'images/exhibition-posters/mecha.webp',
        detail: '機械コースの専門展示です。<br>・歯車×ガチャ<br>・スマホスタンド<br>・チョロQ<br>・表面張力×ボート<br>・パラシュート×的あて<br>・？？？<br>・？？？'
      },
      '化学専門展示(化学実験室)': {
        image: 'images/exhibition-posters/chemistry.webp',
        detail: '化学コースの専門展示です<br>・スライムづくり<br>・バスボムづくり<br>・ミニアロマキャンドルづくり<br>・人工いくらづくり<br>・オリジナルのプラ板ストラップづくり<br>・顕微鏡体験<br>・巨大シャボン玉'
      },
      '電気専門展示': {
        image: 'images/exhibition-posters/electricity.webp',
        detail: '・ドローンの操縦<br>・スロットマシン<br>・キャップ射的<br>・LEDイルミネーション<br>・自動操縦ラジコン<br>・ラジコンカーの操縦<br>・レーザー加工キーホルダー作製<br>・脱出ゲーム'
      },
      '保健室': {
        image: 'images/pins/electricity.webp',
        detail: '保健室です。体調不良の方はお申し付けください。'
      }
    };

    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          /* マップの「四角い範囲」を定義し、高さを固定 */
          width: 90%; 
          max-width: 1000px; 
          height: 80vh; /* 表示の高さをビューポートの80%に固定 */
          margin: 20px auto;
          border: 1px solid #ccc;
          background-color: #fafafa;
          overflow: hidden; /* マップ枠外のコンテンツ（スクロールバー）を非表示 */
        }
        
        svg { 
          /* 親要素 (:host) のサイズに合わせる */
          width: 100%; 
          height: 100%; 
          display: block;
          transition: viewBox 0.6s ease-out; /* viewBoxの変更をアニメーションさせる */
        }
        
        .cg-pin-wrap {
          cursor: pointer;
          outline: none;
          transition: transform 0.3s ease-out;
        }
        
        .cg-pin-wrap:hover, 
        .cg-pin-wrap:focus {
          filter: brightness(1.2);
        }

        @keyframes pulse {
          0%, 100% { 
            filter: drop-shadow(0 0 20px rgba(255, 215, 0, 0.8)); 
          }
          50% { 
            filter: drop-shadow(0 0 30px rgba(255, 215, 0, 1)); 
          }
        }
        
        .cg-pin-wrap.highlight {
            animation: pulse 2s ease-in-out infinite;
        }

        /* モーダル表示に関するCSSは省略せず維持します */

        #modal-overlay {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.6);
          z-index: 1000;
          justify-content: center;
          align-items: center;
        }

        #modal-overlay.active {
          display: flex;
        }

        #modal-box {
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          padding: 30px;
          max-width: 60vw;
          max-height: 90vh;
          width: 100%;
          position: relative;
          animation: slideIn 0.3s ease-out;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
        }

        @keyframes slideIn {
          from {
            transform: translateY(-30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        #close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          cursor: pointer;
          color: #666;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
          z-index: 1001;
        }

        #close-btn:hover {
          color: #000;
        }

        #modal-title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 20px;
          margin-top: 10px;
        }

        #modal-image {
          max-width: 100%;
          max-height: 60vh;
          object-fit: contain;
          border-radius: 8px;
          margin-bottom: 20px;
          background: #e0e0e0;
        }

        #modal-detail {
          font-size: 16px;
          color: #666;Q
          line-height: 1.6;
          margin-bottom: 20px;
        }
      </style>

      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        xmlns:xlink="http://www.w3.org/1999/xlink" 
        width="19888"
        zoomAndPan="magnify"
        viewBox="0 0 12500 11000" 
        preserveAspectRatio="xMidYMid meet" 
        version="1.0"
        id="svgRoot"
      >
        <g id="map-shapes"></g>



<g class="cg-pin-wrap" transform="translate(5600,8070) scale(3.0)" data-name="男子トイレ" data-map-id="toilet-men" data-base-x="5600" data-base-y="8070" tabindex="0">
          <image href="images/pins/man.webp" width="60" height="60" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(5600,7800) scale(3.0)" data-name="女子トイレ" data-map-id="toilet-women" data-base-x="5600" data-base-y="7800" tabindex="0">
          <image href="images/pins/woman.webp" width="60" height="60" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(4140,8800) scale(3.0)" data-name="保健室" data-map-id="health-room" data-base-x="3620" data-base-y="8800" tabindex="0">
          <image href="images/pins/1.webp" width="350" height="350" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(2280,9590) scale(3.0)" data-name="女子トイレ" data-map-id="toilet-women" data-base-x="2280" data-base-y="9590" tabindex="0">
          <image href="images/pins/woman.webp" width="60" height="60" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(2050,9590) scale(3.0)" data-name="男子トイレ" data-map-id="toilet-men" data-base-x="2050" data-base-y="9590" tabindex="0">
          <image href="images/pins/man.webp" width="60" height="60" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(6175,1412) scale(3.0)" data-name="女子トイレ" data-map-id="toilet-women" data-base-x="6175" data-base-y="1412" tabindex="0">
          <image href="images/pins/woman.webp" width="60" height="60" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(8250,3800) scale(3.0)" data-name="機械専門展示(3M、4M、5M)" data-map-id="mecha" data-base-x="8250" data-base-y="3800" tabindex="0">
          <image href="images/pins/m.webp" width="350" height="350" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(7550,3800) scale(3.0)" data-name="機械専門展示(3M、4M、5M)" data-map-id="mecha" data-base-x="7550" data-base-y="3800" tabindex="0">
          <image href="images/pins/m.webp" width="350" height="350" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(8950,3800) scale(3.0)" data-name="機械専門展示(3M、4M、5M)" data-map-id="mecha" data-base-x="8950" data-base-y="3800" tabindex="0">
          <image href="images/pins/m.webp" width="350" height="350" x="-30" y="-30" />
</g>

<g class="cg-pin-wrap" transform="translate(5500,5590) scale(3.0)" data-name="化学専門展示(化学実験室)" data-map-id="chemistry-lab" data-base-x="5500" data-base-y="5590" tabindex="0">
          <image href="images/pins/z.webp" width="350" height="350" x="-30" y="-30" />
</g>

      </svg>

      <div id="modal-overlay">
        <div id="modal-box">
          <button id="close-btn">×</button>
          <h2 id="modal-title"></h2>
          <img id="modal-image" alt="location image" />
          <p id="modal-detail"></p>
        </div>
      </div>
    `;

    const svg = shadow.querySelector('#svgRoot');
    const overlay = shadow.querySelector('#modal-overlay');
    const closeBtn = shadow.querySelector('#close-btn');
    const modalTitle = shadow.querySelector('#modal-title');
    const modalImage = shadow.querySelector('#modal-image');
    const modalDetail = shadow.querySelector('#modal-detail');
    const pins = shadow.querySelectorAll('.cg-pin-wrap');

    function showModal(name) {
      const data = locationData[name] || {
        image: '',
        detail: '詳細情報がありません。'
      };

      modalTitle.textContent = name;
      modalDetail.innerHTML = data.detail;

      if (data.image) {
        modalImage.src = data.image;
        modalImage.style.display = 'block';
        modalImage.onerror = () => {
          modalImage.style.display = 'none';
        };
      } else {
        modalImage.style.display = 'none';
      }

      overlay.classList.add('active');
    }

    function hideModal() {
      overlay.classList.remove('active');
    }

    pins.forEach((pin) => {
      pin.addEventListener('click', (event) => {
        event.stopPropagation();
        const name = pin.getAttribute('data-name');
        showModal(name);
      });

      pin.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          pin.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        }
      });
    });

    closeBtn.addEventListener('click', hideModal);
    overlay.addEventListener('click', (event) => {
      if (event.target === overlay) {
        hideModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        hideModal();
      }
    });

    // URL パラメータから map_id を取得してハイライト
    const urlParams = new URLSearchParams(window.location.search);
    const mapId = urlParams.get('map_id');

    if (mapId) {
      // 修正: find() の代わりに filter() を使用し、一致する全てのピンを取得
      const targetPins = Array.from(pins).filter(pin =>
        pin.getAttribute('data-map-id') === mapId
      );

      if (targetPins.length > 0) {

        // --- 1. マップのズーム・パン処理 (ページ全体スクロールの代替) ---
        const pinToCenter = targetPins[0];
        const pinCenterX = parseFloat(pinToCenter.getAttribute('data-base-x'));
        const pinCenterY = parseFloat(pinToCenter.getAttribute('data-base-y'));

        const svgWidth = 12500;
        const svgHeight = 11000;
        const targetViewWidth = 4000;
        const targetViewHeight = 4000;

        // ピンを中心とするviewBoxの原点を計算
        let minX = pinCenterX - (targetViewWidth / 2);
        let minY = pinCenterY - (targetViewHeight / 2);

        // 境界チェック: マップの端を超えないように調整
        minX = Math.max(0, Math.min(minX, svgWidth - targetViewWidth));
        minY = Math.max(0, Math.min(minY, svgHeight - targetViewHeight));

        const newViewBox = `${minX} ${minY} ${targetViewWidth} ${targetViewHeight}`;

        // viewBoxを設定し、マップの表示領域をピンの位置に移動・ズームする
        svg.setAttribute('viewBox', newViewBox);

        // --- ズーム・パン処理 終了 ---


        targetPins.forEach(targetPin => { // 取得したすべてのピンに対して処理を実行
          // --- 2. ピンのハイライトと+10シフトの再適用 ---

          const currentTransform = targetPin.getAttribute('transform');
          const transformMatch = currentTransform.match(/translate\(([^,]+),([^)]+)\)/);

          let currentX = 0;
          let currentY = 0;

          if (transformMatch) {
            currentX = parseFloat(transformMatch[1]);
            currentY = parseFloat(transformMatch[2]);
          }

          // ピンを強調表示(スケールアップ)
          const newX = currentX + 10;
          const newY = currentY + 10;
          const newTransform = `translate(${newX},${newY}) scale(4.0)`;
          targetPin.setAttribute('transform', newTransform);

          // アニメーションを適用
          targetPin.classList.add('highlight');
          // --- ピンのハイライト 終了 ---
        });
      }
    }
    let currentViewBox = [0, 0, 12500, 11000]; // [minX, minY, width, height]

    function updateViewBox(newViewBox) {
      currentViewBox = newViewBox;
      svg.setAttribute('viewBox', `${newViewBox[0]} ${newViewBox[1]} ${newViewBox[2]} ${newViewBox[3]}`);
    }

    svg.addEventListener('wheel', (e) => {
      e.preventDefault(); // ページ全体のスクロールを防止

      const zoomFactor = 0.1; // ズームの速さ
      const isZoomIn = e.deltaY < 0; // マウスホイールを上に回した（奥に転がした）場合

      let [minX, minY, width, height] = currentViewBox;

      // SVG要素に対するカーソル位置の計算
      const svgRect = svg.getBoundingClientRect();
      // SVGビューポート内での相対座標 (0 to 1)
      const mouseX = (e.clientX - svgRect.left) / svgRect.width;
      const mouseY = (e.clientY - svgRect.top) / svgRect.height;

      // SVG座標系でのカーソル位置
      const cursorX = minX + mouseX * width;
      const cursorY = minY + mouseY * height;

      let newWidth, newHeight;

      if (isZoomIn) {
        // ズームイン: viewboxの幅と高さを縮小
        newWidth = width * (1 - zoomFactor);
        newHeight = height * (1 - zoomFactor);
      } else {
        // ズームアウト: viewboxの幅と高さを拡大
        newWidth = width * (1 + zoomFactor);
        newHeight = height * (1 + zoomFactor);
      }

      // ズーム後の新しいviewBox原点を計算
      // カーソル位置を新しいviewBoxの中心に保つようにオフセットを調整する
      const newMinX = cursorX - (mouseX * newWidth);
      const newMinY = cursorY - (mouseY * newHeight);

      // 境界チェック (ズームアウトしすぎないように)
      const defaultWidth = 12500;
      const defaultHeight = 11000;

      if (newWidth > defaultWidth || newHeight > defaultHeight) {
        // 元の全体表示に戻す
        updateViewBox([0, 0, defaultWidth, defaultHeight]);
        return;
      }

      updateViewBox([newMinX, newMinY, newWidth, newHeight]);
    });
  }
}
customElements.define('map-component', MapComponent);