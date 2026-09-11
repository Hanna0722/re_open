/* ============================================================
   BidBuy Renewal common shell
   - Standard header for index preview pages
   - Left / right drawers matched to mobile_main.html structure
   - Login state shared through localStorage
   ============================================================ */
(function () {
  'use strict';

  var LOGIN_KEY = 'bb_logged_in';
  var GRADE_ICON_DIR = 'gradeicon/';
  var GRADE_ICONS = {
    standard: 'grade_standard.png',
    premium: 'grade_premium.png',
    vip: 'grade_vip.png',
    prestige: 'grade_prestige.png'
  };
  var USER_GRADE = (window.bbUserGrade || 'vip').toLowerCase();

  function isLoggedIn() {
    if (window.bbForceGuestHeader) return false;
    return localStorage.getItem(LOGIN_KEY) === '1';
  }

  function isMainPage() {
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    return file === 'web_main.html';
  }

  function isMyPage() {
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    return file === 'web_mypage.html';
  }

  /* 상단 스토어 채널 바를 노출하는 페이지 (마크업은 이 스크립트가 주입) */
  var CHANNEL_BAR_PAGES = [
    'web_main.html', 'web_sub_main.html', 'web_category_main.html', 'web_totalsearch.html',
    'web_mainlist.html', 'web_auction.html', 'web_auction_bid_list.html', 'web_mypage.html',
    'web_login.html', 'web_payment_detail.html', 'web_payment_oversize.html',
    'web_purchase_start.html', 'web_purchase_merukari.html', 'web_purchase_store.html', 'web_purchase_url.html'
  ];
  function wantsChannelBar() {
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    return CHANNEL_BAR_PAGES.indexOf(file) > -1;
  }

  function removeNonMainNotice() {
    if (isMainPage()) return;
    document.querySelectorAll('.notice-bar, .top-notice-spacer').forEach(function (el) {
      el.remove();
    });
  }

  var PRODUCT_IMAGES = [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1516981879613-9f5da904015f?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1514228742587-6b1558fcf93a?auto=format&fit=crop&q=80'
  ];
  var productPool = PRODUCT_IMAGES.slice().sort(function () { return Math.random() - 0.5; });

  function productImage(index, width, height) {
    var base = productPool[Math.abs(index || 0) % productPool.length];
    return base + '&w=' + (width || 520) + '&h=' + (height || width || 520);
  }

  function fallbackImage(index, width, height) {
    var label = ['SHOES', 'BAG', 'GOODS', 'GAME'][Math.abs(index || 0) % 4];
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (width || 520) + '" height="' + (height || width || 520) + '" viewBox="0 0 520 520"><rect width="520" height="520" fill="#f5f7fa"/><rect x="54" y="54" width="412" height="412" rx="24" fill="#fff" stroke="#E0E4EB" stroke-width="2"/><text x="260" y="252" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#1a1a2e">' + label + '</text><text x="260" y="298" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#999baa">BidBuy product image</text></svg>';
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function isRandomImageSrc(src) {
    return /picsum\.photos|loremflickr\.com/i.test(src || '');
  }

  var PRODUCT_IMAGE_CONTEXT = '.best-card,.live-card,.rv-card,.product-thumb,.related-thumb,.m-rel-thumb,.m-si-thumb,.m-assoc-thumb,.m-gallery-placeholder,.m-thumb,.card-thumb,.item-thumb,.order-thumb,.so-thumb';

  function bindProductFallback(img, index) {
    if (!img || img.dataset.bbProductFallback) return;
    img.dataset.bbProductFallback = '1';
    img.addEventListener('error', function () {
      var count = Number(img.dataset.bbFallbackCount || 0) + 1;
      img.dataset.bbFallbackCount = String(count);
      img.src = count < productPool.length ? productImage(index + count, 520, 520) : fallbackImage(index, 520, 520);
    });
  }

  function fillProductThumb(container, index) {
    if (!container || container.querySelector('img')) return;
    var img = document.createElement('img');
    img.src = productImage(index, 520, 520);
    img.alt = '상품 이미지';
    img.loading = 'lazy';
    img.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block';
    if (getComputedStyle(container).position === 'static') container.style.position = 'relative';
    container.innerHTML = '';
    container.appendChild(img);
    bindProductFallback(img, index);
  }

  function hydrateProductImages() {
    document.querySelectorAll('img').forEach(function (img, index) {
      if (isRandomImageSrc(img.getAttribute('src'))) {
        img.src = productImage(index, 520, 520);
        bindProductFallback(img, index);
      } else if (img.matches('#galleryMainImg,.gallery-main-img') || img.closest(PRODUCT_IMAGE_CONTEXT)) {
        bindProductFallback(img, index);
      }
    });
    document.querySelectorAll('.product-thumb,.related-thumb,.m-rel-thumb,.m-si-thumb,.m-assoc-thumb,.m-gallery-placeholder,.m-thumb,.card-thumb,.item-thumb,.order-thumb,.so-thumb').forEach(fillProductThumb);
    document.querySelectorAll('#galleryMainImg').forEach(function (img) { img.src = productImage(0, 1200, 1200); });
    document.querySelectorAll('.thumb-item img,.m-thumb img').forEach(function (img, index) { img.src = productImage(index, 240, 240); });
    if (Array.isArray(window.galleryImgs)) window.galleryImgs = window.galleryImgs.map(function (_, index) { return productImage(index, 1200, 1200); });
    if (Array.isArray(window._galleryImgs)) window._galleryImgs = window._galleryImgs.map(function (_, index) { return productImage(index, 1200, 1200); });
    if (typeof window.setMainImg === 'function' && !window.setMainImg.__bbProductPatched) {
      var originalSetMainImg = window.setMainImg;
      window.setMainImg = function (target, src) {
        var thumbs = Array.prototype.slice.call(document.querySelectorAll('.thumb-item,.m-thumb'));
        var index = typeof target === 'number' ? target : Math.max(0, thumbs.indexOf(target));
        var nextSrc = isRandomImageSrc(src) ? productImage(index, 1200, 1200) : src;
        var result = originalSetMainImg.apply(this, [target, nextSrc]);
        var main = document.getElementById('galleryMainImg') || document.querySelector('.m-gallery-placeholder img');
        if (main && (typeof target === 'number' || isRandomImageSrc(main.src))) main.src = productImage(index, 1200, 1200);
        return result;
      };
      window.setMainImg.__bbProductPatched = true;
    }
  }

  var css = [
    /* 전체 페이지 공통 콘텐츠 폭 (퍼블리싱 기준 1140px) */
    ':root{--bb-page-w:1140px}',
    'body{min-width:1200px !important}',

    /* 전 페이지 공통 디자인 토큰 (계열별로 갈렸던 값 강제 통일) */
    ':root{' +
      '--page-w:var(--bb-page-w);' +
      '--rose:#E8385A;--rose-h:#C42F4C;' +
      '--brand:#E8385A;--brand-dark:#C42F4C;' +
      '--blue:#E8385A;--blue-dark:#C42F4C;' +
      '--navy:#1A3C6E;' +
      '--r-thumb:2px;--r-sm:5px;--r-md:8px;--r-card:10px;--r-lg:12px;--r-btn:12px;--r-pill:999px;' +
      '--btn-h-sm:36px;--btn-h-md:44px;--btn-h-lg:48px;' +
      '--label-col-w:230px;' +
    '}',
    /* 공통 폰트·텍스트 토큰 (DESIGN.md 기준) — 페이지 인라인 :root의 백업 */
    ":root{--font-sans:'Pretendard','Malgun Gothic','돋움','Dotum','Hiragino Sans','Yu Gothic UI','Meiryo','Noto Sans CJK JP',Arial,sans-serif;--font-num:Roboto,var(--font-sans);--tp:#1A1A2E;--ts:#666680;--tm:#999BAA}",
    'body{font-family:var(--font-sans)}',
    '.req{color:var(--rose);font-weight:700;margin-left:2px}',
    '.required-note{color:var(--ts);font-size:12px}',

    '.bbh-header{background:#fff;border-bottom:1px solid #E0E4EB;position:sticky;top:0;z-index:900;box-shadow:0 1px 0 rgba(32,36,43,.04);font-family:var(--font-sans);font-size:14px;color:var(--tp)}',
    '.bbh-hdr{max-width:var(--bb-page-w);margin:0 auto;padding:0;height:56px;display:flex;align-items:center;gap:16px}',
    '.bbh-menu{display:flex;flex-direction:column;gap:4.5px;padding:8px;border-radius:5px;cursor:pointer;background:none;border:none;margin-right:12px;transition:background .15s;flex-shrink:0}',
    '.bbh-menu:hover{background:#F5F7FA}',
    '.bbh-menu span{display:block;width:17px;height:2px;background:var(--tp);border-radius:1px}',
    '.bbh-logo{display:flex;align-items:center;flex-shrink:0;flex:1;text-decoration:none}',
    '.bbh-logo img{display:block;width:100px;height:auto}',
    '.bbh-search{flex:0 0 520px;display:flex;border:1.5px solid #E0E4EB;border-radius:8px;overflow:hidden;transition:border-color .2s}',
    '.bbh-search:focus-within{border-color:#E8385A}',
    '.bbh-search input{flex:1;border:none;background:#F5F7FA;padding:10px 14px;font-size:14px;font-family:inherit;outline:none;min-width:0}',
    '.bbh-search button{background:#E8385A;color:#fff;border:none;padding:0 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px}',
    '.bbh-search button:hover{background:#C42F4C}',
    '.bbh-right{flex:1;display:flex;align-items:center;justify-content:flex-end;gap:4px}',
    '.bbh-ibtn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 10px;border-radius:5px;cursor:pointer;color:var(--ts);font-size:10px;border:none;background:none;font-family:inherit;position:relative}',
    '.bbh-ibtn:hover{background:#F5F7FA}',
    '.bbh-ibtn i{font-size:20px}',
    '.bbh-badge{position:absolute;top:4px;right:4px;background:#E8385A;color:#fff;font-size:8px;font-weight:700;min-width:14px;height:14px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 2px}',
    '.bbh-btn-login{background:#E8385A;color:#fff;border:none;padding:8px 18px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap}',
    '.bbh-btn-login:hover{background:#C42F4C}',
    '.bbh-btn-join{background:#fff;color:var(--ts);border:1.5px solid #E0E4EB;padding:8px 16px;border-radius:5px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-right:6px}',
    '.bbh-btn-join:hover{border-color:#E8385A;color:#E8385A}',
    '.grade-img{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;overflow:visible!important;padding:0!important}',
    'img.grade-icon{width:100%;height:100%;object-fit:contain;display:block}',

    '.bbd-ov{position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;transition:background .3s;z-index:1000}',
    '.bbd-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.bbd{position:fixed;top:0;bottom:0;left:-100%;width:88%;max-width:340px;z-index:1001;background:#fff;overflow-y:auto;scrollbar-width:none;font-family:var(--font-sans);font-size:14px;color:var(--tp);transition:left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,.12);border-top-right-radius:16px;border-bottom-right-radius:16px}',
    '.bbd::-webkit-scrollbar{display:none}',
    '.bbd.open{left:0}',

    ':root{--grade-std:#7A828C;--grade-pre:#28705F;--grade-vip:#174F8A;--grade-prs:#E8385A}',
    '.bbd-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;border-bottom:1px solid #E0E4EB;background:#fff}',
    '.bbd-guest-card{padding:14px 16px 16px;background:#FFF8F5;border-bottom:1px solid #E0E4EB}',
    '.bbd-guest-title{font-size:16px;font-weight:700;color:var(--tp);margin-bottom:4px}',
    '.bbd-guest-copy{font-size:12px;color:#6B7280;line-height:1.45;margin-bottom:12px}',
    '.bbd-login-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.bbd-action-btn{height:36px;border-radius:5px;border:1px solid #E8385A;background:#E8385A;color:#fff;font-size:12px;font-weight:800;font-family:inherit;cursor:pointer}',
    '.bbd-action-btn.secondary{background:#fff;color:#4B5563;border-color:#E0E4EB}',
    '.bbd-close{width:32px;height:32px;border:0;border-radius:50%;background:#F5F7FA;color:var(--tp);font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-close:hover{background:#EEF1F5}',
    '.bbd-cs-card{margin:5px 10px 5px;padding:5px;background:#fcfcfd;text-align:center}',
    '.bbd-cs-tel{color:#1A3C6E;font-family:var(--font-num);font-size:26px;font-weight:700}',
    '.bbd-cs-time{margin:8px 0 16px;color:#7b8494;font-size:13px}',
    '.bbd-cs-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.bbd-cs-actions button{height:34px;border:1px solid #E0E4EB;border-radius:5px;background:#fff;color:#1f2530;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer}',
    '.bbd-cs-actions button:first-child{border-color:#E8385A;background:#E8385A;color:#fff}',

    '.user-drawer-head{position:relative;padding:25px 16px 12px;background:linear-gradient(180deg,#FFF9F9,#fff)}',
    '.bbd-head-actions{margin-left:auto;display:flex;align-items:center;gap:8px}',
    '.bbd-logout-btn{width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:#1A3C6E;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-logout-btn:hover{color:#E8385A}',
    '.user-name-line{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;height:44px;gap:6px}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{position:relative;width:56px;height:56px;flex:0 0 auto}',
    '.user-crown-ring{position:absolute;inset:0;transform:rotate(-90deg)}',
    '.user-crown img.grade-icon{position:absolute;top:10px;left:11px;width:34px;height:37px;object-fit:contain;display:block}',
    '.user-name-strong{display:block;color:var(--tp);font-size:16px;font-weight:600;line-height:14px}',
    '.user-vip-chip{display:inline-flex;margin-top:0;padding:0;border:0;border-radius:0;background:transparent;color:var(--grade-vip);font-size:16px;font-weight:500;line-height:14px}',
    '.user-vip-chip.tier-standard{color:var(--grade-std)}',
    '.user-vip-chip.tier-premium{color:var(--grade-pre)}',
    '.user-vip-chip.tier-vip{color:var(--grade-vip)}',
    '.user-vip-chip.tier-prestige{color:var(--grade-prs)}',
    '.user-stat-title{padding:5px 16px 5px;font-size:14px;font-weight:700;color:var(--tp);background:#fff}',
    '.user-asset-split{display:grid;grid-template-columns:1fr 1fr;padding:10px 0 6px;background:linear-gradient(180deg,#FFF9F9,#fff)}',
    '.user-asset-col{padding-right:14px}',
    '.user-asset-col+.user-asset-col{padding-left:14px;padding-right:0;border-left:1px solid #E0E4EB}',
    '.user-asset-col-title{display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;font-size:14px;font-weight:700;color:var(--tp)}',
    '.user-asset-col-title i{font-size:11px;color:var(--tm)}',
    '.user-asset-line{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding:6px 0}',
    '.user-asset-line span{color:var(--tm);font-size:13px;font-weight:500;white-space:nowrap}',
    '.user-asset-line strong{color:var(--tp);font-size:14px;font-weight:700;white-space:nowrap}',
    '.user-asset-divider{height:1px;background:#E0E4EB;margin:0 16px}',
    '.user-status-grid{display:flex;align-items:baseline;justify-content:space-between;background:#fff;padding:0 16px 16px;border-bottom:1px solid #E0E4EB}',
    '.user-status-item{display:flex;align-items:baseline;gap:6px}',
    '.user-status-item span{font-size:14px;font-weight:600;color:var(--tm);white-space:nowrap}',
    '.user-status-item strong{font-size:14px;font-weight:600;color:var(--tp);font-family:var(--font-num)}',
    '.user-status-item strong.rose{color:#E8385A}',
    '.user-menu-list{padding:0 0 10px;background:#fff}',
    '.user-menu-item{min-height:46px;width:100%;padding:0 18px;display:flex;align-items:center;gap:12px;color:var(--tp);font-size:14px;font-weight:600;border:0;background:#fff;text-align:left;text-decoration:none;font-family:inherit;cursor:pointer}',
    '.user-menu-item:hover{background:#F5F7FA}',
    '.user-menu-icon{width:20px;text-align:center;font-size:16px;color:var(--ts);flex:0 0 auto}',
    '.user-menu-item .chev{margin-left:auto;color:var(--tm);font-weight:500;font-size:15px;line-height:1}',
    '.user-menu-section{border-bottom:0}',
    '.user-menu-panel{display:none;padding:0 0 8px 52px}',
    '.user-menu-section.is-open .user-menu-panel{display:grid;gap:0}',
    '.user-menu-link{min-height:32px;display:flex;align-items:center;color:#666b75;font-size:13px;font-weight:500;text-decoration:none}',
    '.user-menu-link.danger{color:#8f949f}',

    /* -- 상단 스토어 채널 바 (모든 페이지 공통) -- */
    '.channel-bar{background:#fff;border-bottom:1px solid #E0E4EB;padding:14px 0}',
    '.channel-inner{max-width:var(--bb-page-w);margin:0 auto;padding:0;display:flex;align-items:center;gap:0}',
    '.channel-icons{display:grid;grid-template-columns:repeat(8,1fr);gap:16px;width:min(calc(100vw - 60px),900px);margin:0 auto}',
    '.channel-icons::-webkit-scrollbar{display:none}',
    '.ch-icon-item{display:flex;flex-direction:column;align-items:center;gap:6px;padding:4px 14px;cursor:pointer;min-width:80px;flex-shrink:0;transition:opacity .15s;text-decoration:none}',
    '.ch-icon-item:hover .ch-label{color:#E8385A}',
    '.ch-label{position:relative;font-size:16px;color:#666B75;font-weight:800;white-space:nowrap;transition:color .15s}',
    '.ch-label::after{content:\'\';position:absolute;left:50%;bottom:-8px;width:100%;height:2px;border-radius:999px;background:currentColor;transform:translateX(-50%) scaleX(0);opacity:0;transition:transform .35s ease-out,opacity .35s ease-out}',
    '.ch-icon-item:hover .ch-label::after{transform:translateX(-50%) scaleX(1);opacity:1}',
    '.ch-label.active{color:#E8385A}',
    '.ch-label.active::after{transform:translateX(-50%) scaleX(1);opacity:1}',

    /* -- 서브/카테고리/통합검색 상단 스토어 바 (채널 바와 동일 모양) -- */
    '.store-strip{background:#fff;border-bottom:1px solid #E0E4EB;padding:14px 0;width:auto;overflow:visible}',
    '.store-list{display:grid;grid-template-columns:repeat(8,1fr);gap:16px;width:min(calc(100vw - 60px),900px);margin:0 auto;padding:0;box-sizing:border-box}',
    '.store-chip{display:flex;flex-direction:column;align-items:center;gap:6px;padding:4px 14px;min-width:80px;flex-shrink:0;cursor:pointer;text-decoration:none;transition:opacity .15s}',
    '.store-chip:hover{opacity:.8}',
    '.store-chip strong{font-size:11px;font-weight:500;color:#666B75;white-space:nowrap}',
    '.store-badge{width:55px;height:55px;margin:0;border:1px solid #E0E4EB;border-radius:12px;background:#fff;box-shadow:0 2px 8px rgba(0,0,0,.07);display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none;transition:box-shadow .15s}',
    '.store-chip:hover .store-badge{border-color:#E8385A}',
    '.store-chip.active .store-badge{border-color:#E8385A;box-shadow:0 0 0 3px rgba(232,56,90,.14)}',
    '.store-chip.active strong{color:#E8385A;font-weight:700}',
    '.store-badge img{width:100%;height:100%;object-fit:contain;border-radius:0}'
  ].join('\n');

  function headerHTML() {
    if (isLoggedIn()) {
      return (
        '<div class="bbh-hdr">' +
          '<button class="bbh-menu" type="button" aria-label="메뉴 열기" onclick="openDrawer()"><span></span><span></span><span></span></button>' +
          '<a href="web_main.html" class="bbh-logo"><img src="Bidbuy logo.png" alt="Bidbuy World Auction Agency"></a>' +
          '<form class="bbh-search" role="search" action="web_totalsearch.html" method="get"><input type="search" name="q" placeholder="키워드 또는 구매신청을 원하시는 URL을 입력해주세요" aria-label="검색어 입력"><button type="submit"><i class="fas fa-search"></i> <span>AI 검색</span></button></form>' +
          '<div class="bbh-right">' +
            '<button class="bbh-ibtn" type="button" aria-label="알림"><i class="far fa-bell"></i><span class="bbh-badge">3</span></button>' +
            '<button class="bbh-ibtn" type="button" aria-label="장바구니"><i class="fas fa-shopping-cart"></i></button>' +
            '<button class="bbh-ibtn" type="button" aria-label="마이페이지" onclick="location.href=\'web_mypage.html\'"><i class="far fa-user"></i></button>' +
          '</div>' +
        '</div>'
      );
    }

    return (
      '<div class="bbh-hdr">' +
        '<button class="bbh-menu" type="button" aria-label="메뉴 열기" onclick="openDrawer()"><span></span><span></span><span></span></button>' +
        '<a href="web_main.html" class="bbh-logo"><img src="Bidbuy logo.png" alt="Bidbuy World Auction Agency"></a>' +
        '<form class="bbh-search" role="search" action="web_totalsearch.html" method="get"><input type="search" name="q" placeholder="키워드 또는 구매신청을 원하시는 URL을 입력해주세요" aria-label="검색어 입력"><button type="submit"><i class="fas fa-search"></i> <span>AI 검색</span></button></form>' +
        '<div class="bbh-right"><button class="bbh-btn-join" type="button">회원가입</button><button class="bbh-btn-login" type="button" onclick="doLogin()">로그인</button></div>' +
      '</div>'
    );
  }

  /* -- 스토어 단일 목록 --------------------------------------------
     로고 교체: storeicon/ 안의 파일만 바꾸면
     상단 채널바와 좌측 드로어에 그대로 반영된다.
     스토어 추가/삭제/순서변경도 이 배열만 수정한다.                */
  var STORE_LOGO_DIR = 'storeicon/';
  var STORES = [
    { label: '야후옥션',   barLabel: '야후 옥션',   logo: 'store_yahoo_auction.png',  href: 'web_sub_main.html',          barHref: 'web_sub_main.html' },
    { label: '메루카리',   barLabel: '메루카리',    logo: 'store_mercari.png',        href: 'web_purchase_merukari.html', barHref: 'web_sub_main.html' },
    { label: '라쿠텐',     barLabel: '라쿠텐', logo: 'store_rakuten.png',        href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '라쿠마',     barLabel: '라쿠마', logo: 'store_rakuma.png',         href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '야후쇼핑',   barLabel: '야후 쇼핑',   logo: 'store_yahoo_shopping.png', href: 'web_purchase_url.html',      barHref: 'web_sub_main.html' },
    { label: '야후프리마', barLabel: '야후 프리마', logo: 'store_yahoo_furima.png',   href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '미국이베이', barLabel: '미국 이베이', logo: 'store_ebay_us.png',        href: 'web_sub_main.html',          barHref: 'web_sub_main.html' },
    { label: '영국이베이', barLabel: '영국 이베이', logo: 'store_ebay_uk.png',        href: 'web_sub_main.html',          barHref: 'web_sub_main.html' },
  ];
  window.BB_STORES = STORES;
  window.BB_STORE_LOGO_DIR = STORE_LOGO_DIR;

  var CHANNEL_ACTIVE_KEY = 'bbChannelActiveIdx';

  function storeChannelBarHTML() {
    var activeIdx = sessionStorage.getItem(CHANNEL_ACTIVE_KEY);
    var isSubMain = (location.pathname.split('/').pop() || '').toLowerCase() === 'web_sub_main.html';
    return STORES.map(function (st, idx) {
      var active = isSubMain && String(idx) === activeIdx;
      return '<div class="ch-icon-item" style="cursor:pointer" onclick="bbSetActiveChannel(' + idx + ',' + "'" + st.barHref + "'" + ')">' +
        '<span class="ch-label' + (active ? ' active' : '') + '">' + st.barLabel + '</span>' +
      '</div>';
    }).join('');
  }

  function renderStoreChannelBar(afterEl) {
    /* 페이지에 남아있던 기존 마크업(채널바/스토어스트립)은 제거하고 표준 바로 교체 */
    /* 페이지에 남아있던 기존 스토어바 마크업 정리 */
    document.querySelectorAll('.store-strip > .store-list, .channel-bar:not(#bbChannelBar) > .channel-inner').forEach(function (el) {
      el.remove();
    });
    document.querySelectorAll('.store-strip, .channel-bar:not(#bbChannelBar)').forEach(function (el) {
      if (!el.children.length && !el.textContent.trim()) el.remove();
    });
    if (!wantsChannelBar()) return;
    var bar = document.getElementById('bbChannelBar');
    if (!bar) {
      bar = document.createElement('div');
      bar.id = 'bbChannelBar';
      bar.className = 'channel-bar';
      if (afterEl) afterEl.insertAdjacentElement('afterend', bar);
      else document.body.insertBefore(bar, document.body.firstChild);
    }
    bar.innerHTML = '<div class="channel-inner"><div class="channel-icons">' + storeChannelBarHTML() + '</div></div>';
  }

  function drawerCsCardHTML() {
    return (
      '<div class="bbd-cs-card">' +
        '<div class="bbd-cs-tel">1544-5224</div>' +
        '<p class="bbd-cs-time">평일 AM 10:00 - PM 17:00<br>(점심 PM 12:30 - 13:30)</p>' +
        '<div class="bbd-cs-actions"><button type="button" onclick="location.href=\'web_qna.html\'">1:1 문의</button><button type="button" onclick="location.href=\'https://www.bidbuy.co.kr/cs/faq\'">이용가이드</button><button type="button" onclick="location.href=\'https://www.bidbuy.co.kr/cs/notice\'">공지사항</button></div>' +
      '</div>' +
      '<div style="height:24px"></div>'
    );
  }

  function leftDrawerHTML() {
    if (!isLoggedIn()) {
      return (
        '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div>' +
        '<div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="doLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button">회원가입</button></div></div>' +
        drawerCsCardHTML()
      );
    }

    return (
      '<div class="user-drawer-head">' +
        '<div class="user-member-row">' +
          '<div class="user-crown grade-img" role="img" aria-label="Prestige까지 80% 달성">' +
            '<svg class="user-crown-ring" width="56" height="56" viewBox="0 0 56 56"><circle cx="28" cy="28" r="24" fill="none" stroke="#FBEEF0" stroke-width="4"/><circle cx="28" cy="28" r="24" fill="none" stroke="#E8385A" stroke-width="4" stroke-linecap="round" stroke-dasharray="150.8" stroke-dashoffset="30.2"/></svg>' +
            '<img class="grade-icon" src="' + GRADE_ICON_DIR + (GRADE_ICONS[USER_GRADE] || GRADE_ICONS.vip) + '" alt="' + USER_GRADE.toUpperCase() + ' 등급">' +
          '</div>' +
          '<div class="user-name-line"><span class="user-vip-chip tier-' + USER_GRADE + '">' + USER_GRADE.toUpperCase() + ' MEMBER</span><strong class="user-name-strong">홍길동님</strong></div>' +
          '<div class="bbd-head-actions">' +
            '<button class="bbd-logout-btn" type="button" aria-label="로그아웃" onclick="toggleLogin();closeDrawer()"><i class="fas fa-right-from-bracket" aria-hidden="true"></i></button>' +
          '</div>' +
        '</div>' +
        '<div class="user-asset-split">' +
          '<div class="user-asset-col">' +
            '<div class="user-asset-col-title"><span>보유 자산</span><i class="fas fa-chevron-right" aria-hidden="true"></i></div>' +
            '<div class="user-asset-line"><span>예치금</span><strong>50,000원</strong></div>' +
            '<div class="user-asset-line"><span>마일리지</span><strong>5,000원</strong></div>' +
          '</div>' +
          '<div class="user-asset-col">' +
            '<div class="user-asset-col-title"><span>보증금 관리</span><i class="fas fa-chevron-right" aria-hidden="true"></i></div>' +
            '<div class="user-asset-line"><span>야후 보증금</span><strong>30,000원</strong></div>' +
            '<div class="user-asset-line"><span>이베이 보증금</span><strong>100,000원</strong></div>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="user-asset-divider"></div>' +
      '<div class="user-stat-title">거래 현황</div>' +
      '<div class="user-status-grid">' +
        '<div class="user-status-item"><span>입찰중</span><strong>3건</strong></div>' +
        '<div class="user-status-item"><span>1차 결제 대기</span><strong class="rose">1건</strong></div>' +
        '<div class="user-status-item"><span>2차 결제 대기</span><strong>0건</strong></div>' +
      '</div>' +
      '<nav class="user-menu-list">' +
        '<a class="user-menu-item" href="web_mypage.html"><span class="user-menu-icon"><i class="fas fa-house-user" aria-hidden="true"></i></span><span>마이페이지</span></a>' +
        userMenuSection('fa-gavel', '나의 거래 현황', 'wm-menu-trade',
          userMenuLink('거래 전체 목록', 'web_mainlist.html') +
          userMenuLink('경매 입찰/유찰', 'web_mypage.html') +
          userMenuLink('구매 신청 목록', 'web_mypage.html')) +
        userMenuSection('fa-truck-fast', '배송관리', 'wm-menu-delivery',
          userMenuLink('배송신청/변경', 'web_bundle_shipping_management.html') +
          userMenuLink('배송지 관리', '#')) +
        userMenuSection('fa-heart', '관심 항목 관리', 'wm-menu-favorites',
          userMenuLink('관심 출품자', 'web_favorites.html?tab=seller') +
          userMenuLink('경매 관심물품', 'web_favorites.html?tab=auction') +
          userMenuLink('구매 관심물품', 'web_favorites.html?tab=purchase') +
          userMenuLink('관심 키워드', 'web_favorites.html?tab=keyword') +
          userMenuLink('바로가기', 'web_favorites.html?tab=shortcut')) +
        userMenuSection('fa-gift', 'MY 혜택', 'wm-menu-benefit',
          userMenuLink('마일리지 / 쿠폰', 'web_mileage.html') +
          userMenuLink('MY 등급', 'web_grade_page.html')) +
        userMenuSection('fa-user', '나의 정보관리', 'wm-menu-info',
          userMenuLink('예치금 관리', '#') +
          userMenuLink('보증금 관리', '#') +
          userMenuLink('회원정보 수정', '#') +
          userMenuLink('비밀번호 변경', '#') +
          userMenuLink('회원 탈퇴', '#', true)) +
         '<a class="user-menu-item" href="web_purchase_start.html"><span class="user-menu-icon"><i class="fas fa-link" aria-hidden="true"></i></span><span>URL로 구매신청하기</span><span class="chev"><i class="fas fa-chevron-right" aria-hidden="true"></i></span></a>' +
      '</nav>' +
      drawerCsCardHTML()
    );
  }

  function userMenuSection(icon, label, id, links) {
    return (
      '<div class="user-menu-section">' +
        '<button class="user-menu-item user-menu-trigger" type="button" aria-expanded="false" aria-controls="' + id + '">' +
          '<span class="user-menu-icon"><i class="fas ' + icon + '" aria-hidden="true"></i></span><span>' + label + '</span><span class="chev"><i class="fas fa-chevron-down" aria-hidden="true"></i></span>' +
        '</button>' +
        '<div class="user-menu-panel" id="' + id + '">' + links + '</div>' +
      '</div>'
    );
  }

  function userMenuLink(label, href, danger) {
    return '<a class="user-menu-link' + (danger ? ' danger' : '') + '" href="' + href + '">' + label + '</a>';
  }

  function bindUserMenu() {
    document.querySelectorAll('.user-menu-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var section = btn.closest('.user-menu-section');
        var isOpen = section && section.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(Boolean(isOpen)));
        if (isOpen) {
          document.querySelectorAll('.user-menu-section.is-open').forEach(function (other) {
            if (other !== section) {
              other.classList.remove('is-open');
              var otherBtn = other.querySelector('.user-menu-trigger');
              if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
            }
          });
        }
      });
    });
  }

  function render() {
    hydrateProductImages();
    removeNonMainNotice();

    if (!document.getElementById('bbCommonCss')) {
      var style = document.createElement('style');
      style.id = 'bbCommonCss';
      style.textContent = css;
      document.head.appendChild(style);
    }
    if (!document.querySelector('link[href*="font-awesome"]')) {
      var fa = document.createElement('link');
      fa.rel = 'stylesheet';
      fa.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(fa);
    }

    var header = document.getElementById('bbCommonHeader');
    if (!header) {
      document.querySelectorAll('header, .topbar').forEach(function (el) {
        if (el.id !== 'bbCommonHeader') el.remove();
      });
      header = document.createElement('header');
      header.id = 'bbCommonHeader';
      header.className = 'bbh-header';
      var notice = document.body.querySelector(':scope > .notice-bar');
      if (notice) {
        notice.insertAdjacentElement('afterend', header);
      } else {
        document.body.insertBefore(header, document.body.firstChild);
      }
    }
    header.innerHTML = headerHTML();

    renderStoreChannelBar(header);

    var leftOv = ensureNode('bbDrawerOv', 'div', 'bbd-ov');
    var left = ensureNode('bbDrawer', 'aside', 'bbd');

    leftOv.onclick = closeDrawer;
    left.innerHTML = leftDrawerHTML();
    bindUserMenu();
    hydrateProductImages();

    // 페이지별 로그인 의존 UI(입찰 패널 등)가 동기화할 수 있도록 알림
    document.dispatchEvent(new CustomEvent('bb:login', { detail: { loggedIn: isLoggedIn() } }));
  }

  function ensureNode(id, tag, className) {
    var node = document.getElementById(id);
    if (!node) {
      node = document.createElement(tag);
      node.id = id;
      document.body.appendChild(node);
    }
    node.className = className;
    return node;
  }

  window.bbIsLoggedIn = isLoggedIn;
  window.bbSetActiveChannel = function (idx, href) {
    try { sessionStorage.setItem(CHANNEL_ACTIVE_KEY, String(idx)); } catch (e) {}
    location.href = href;
  };
  window.doLogin = function () {
    localStorage.setItem(LOGIN_KEY, '1');
    render();
  };
  window.doLogout = function () {
    localStorage.removeItem(LOGIN_KEY);
    closeDrawer();
    if (isMyPage()) {
      location.href = 'web_login.html';
      return;
    }
    render();
  };
  window.toggleLogin = function () {
    if (isLoggedIn()) window.doLogout();
    else window.doLogin();
  };
  window.openDrawer = function () {
    document.getElementById('bbDrawerOv').classList.add('open');
    document.getElementById('bbDrawer').classList.add('open');
  };
  window.closeDrawer = closeDrawer;

  function closeDrawer() {
    document.getElementById('bbDrawerOv')?.classList.remove('open');
    document.getElementById('bbDrawer')?.classList.remove('open');
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
