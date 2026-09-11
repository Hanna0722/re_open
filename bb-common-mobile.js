/* ============================================================
   BidBuy Renewal mobile shared shell — phase 1
   - Left category drawer + right user-menu drawer, shared across
     mobile_*.html so drawer markup lives in one place instead of
     being copy-pasted per page.
   - Relies on each page's own <style> for .drawer/.user-drawer/etc
     (unchanged), this script only supplies markup + open/close +
     login-state wiring.
   - Header/search/notice bar stay page-specific for now (phase 2).
   ============================================================ */
(function () {
  'use strict';

  var LOGIN_KEY = 'bb_logged_in';
  var SHELL_MODE = document.currentScript?.getAttribute('data-bb-mobile-shell') || 'full';
  var USER_GRADE = (window.bbUserGrade || 'vip').toLowerCase();
  var GRADE_ICON_DIR = 'gradeicon/';
  var GRADE_ICONS = {
    standard: 'grade_standard.png',
    premium: 'grade_premium.png',
    vip: 'grade_vip.png',
    prestige: 'grade_prestige.png'
  };

  function isLoggedIn() {
    return localStorage.getItem(LOGIN_KEY) === '1';
  }

  function isMainPage() {
    var file = (location.pathname.split('/').pop() || '').toLowerCase();
    return file === 'mobile_main.html';
  }

  function removeNonMainNotice() {
    if (isMainPage()) return;
    document.querySelectorAll('.app-notice-bar').forEach(function (el) {
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

  // 좌/우 드로어 공통 CSS. 각 페이지가 .drawer/.user-drawer 등을 직접
  // 정의하지 않아도 <script src="bb-common-mobile.js">만 포함하면 동작하도록
  // mobile_main.html의 드로어 스타일을 그대로 주입한다. (색상 변수는
  // 페이지별 :root 정의 여부와 무관하게 동작하도록 fallback 값을 둔다.)
  var STATUS_CSS = [
    '.phone-status-bar{display:flex;align-items:center;justify-content:space-between;height:25px;padding:0 24px;background:#fff;color:var(--tp);font-family:var(--font-sans);font-size:15px;font-weight:700;letter-spacing:-.2px}',
    '.psb-time{font-variant-numeric:tabular-nums;font-family:var(--font-num)}',
    '.psb-icons{display:flex;align-items:center;gap:6px;font-size:14px;color:var(--tp)}',
    '.psb-icons i{line-height:1}',
    '.psb-battery{display:flex;align-items:center;gap:2px}',
    '.psb-battery-body{width:22px;height:11px;border:1.3px solid #1A1A2E;border-radius:5px;padding:1.5px;position:relative}',
    '.psb-battery-body::after{content:"";position:absolute;right:-3.5px;top:50%;transform:translateY(-50%);width:2px;height:4px;background:#1A1A2E;border-radius:0 1px 1px 0}',
    '.psb-battery-fill{display:block;width:80%;height:100%;background:#1A1A2E;border-radius:1px}',
    // 스크롤해도 시간/네트워크/배터리 바는 항상 최상단에 붙어 있는다.
    '.phone-status-bar.is-pinned{position:sticky;top:0;z-index:1000}'
  ].join('\n');

  var DRAWER_CSS = [
    '.drawer-ov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:5000;pointer-events:none;transition:background .3s}',
    '.drawer-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.drawer{position:fixed;top:0;left:0;bottom:0;width:88%;max-width:340px;background:#fff;z-index:5001;overflow-y:auto;scrollbar-width:none;transform:translateX(-100%);visibility:hidden;pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1), visibility 0s linear .3s;display:flex;flex-direction:column;box-shadow:0 20px 60px rgba(0,0,0,.18);border-top-right-radius:16px;border-bottom-right-radius:16px}',
    '.drawer::-webkit-scrollbar{display:none}',
    '.drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto;transition:transform .3s cubic-bezier(.4,0,.2,1)}',
    ':root{--grade-std:#7A828C;--grade-pre:#28705F;--grade-vip:#174F8A;--grade-prs:#E8385A}',
    /* 전 페이지 공통 디자인 토큰 (계열별로 갈렸던 브랜드색 별칭·곡률 통일) */
    ':root{' +
      '--rose:#E8385A;--rose-h:#C42F4C;' +
      '--brand:#E8385A;--brand-dark:#C42F4C;' +
      '--red:#E8385A;--red-h:#C42F4C;' +
      '--blue:#E8385A;--blue-dark:#C42F4C;' +
      '--navy:#1A3C6E;--amber:#F5A623;--green:#3AAD4E;--border:#E0E4EB;--line:#E0E4EB;--line-soft:#E0E4EB;--bg:#F5F7FA;' +
      '--r-thumb:2px;--r-sm:5px;--r-md:8px;--r-card:10px;--r-lg:12px;--r-btn:12px;--r-pill:999px;' +
      '--btn-h-sm:36px;--btn-h-md:44px;--btn-h-lg:48px;' +
    '}',
    /* 공통 폰트 토큰 (DESIGN.md 기준) — 페이지 인라인 :root의 백업 */
    ":root{--font-sans:'Pretendard','Malgun Gothic','돋움','Dotum','Hiragino Sans','Yu Gothic UI','Meiryo','Noto Sans CJK JP',Arial,sans-serif;--font-num:Roboto,var(--font-sans);--tp:#1A1A2E;--ts:#666680;--tm:#999BAA}",
    'body{font-family:var(--font-sans);color:#333}',
    '.req{color:var(--rose);font-weight:700;margin-left:2px}',
    '.required-note{color:var(--ts);font-size:12px}',
    '.grade-img{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;overflow:visible!important;padding:0!important}',
    'img.grade-icon{width:100%!important;height:100%!important;object-fit:contain!important;display:block;border-radius:0!important;transform:none!important}',
    '.bbd-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;border-bottom:1px solid var(--border);background:#fff}',
    '.bbd-guest-card{padding:14px 16px 16px;background:#F5F7FA;border-bottom:1px solid var(--border)}',
    '.bbd-guest-title{font-size:16px;font-weight:700;color:var(--tp);margin-bottom:4px}',
    '.bbd-guest-copy{font-size:12px;color:var(--ts);line-height:1.45;margin-bottom:12px}',
    '.bbd-login-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.bbd-action-btn{height:36px;border-radius:var(--r-btn,12px);border:1px solid #E8385A;background:#E8385A;color:#fff;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer}',
    '.bbd-action-btn.secondary{background:#fff;color:var(--tp);border-color:var(--border)}',
    '.bbd-close{width:32px;height:32px;border:0;border-radius:50%;background:#F5F7FA;color:var(--tp);font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-close:hover{background:#EEF1F5}',
    '.bbd-cs-card{margin:22px 26px 34px;padding:18px 14px;background:#F5F7FA;text-align:center}',
    '.bbd-cs-tel{color:#1A3C6E;font-family:var(--font-num);font-size:26px;font-weight:700}',
    '.bbd-cs-time{margin:8px 0 16px;color:var(--ts);font-size:11px;letter-spacing:-0.28px}',
    '.bbd-cs-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.bbd-cs-actions button{height:36px;border:1px solid var(--border);border-radius:var(--r-btn,12px);background:#fff;color:var(--tp);font-size:12px;font-weight:700;font-family:inherit}',
    '.bbd-cs-actions button:first-child{border-color:#E8385A;background:#E8385A;color:#fff;border-radius:var(--r-btn,12px);min-height:36px}',
    '.m-user-avatar,.user-avatar-sm{width:30px;height:30px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;background:#fff;overflow:hidden;border:0;cursor:pointer;font-family:inherit;box-shadow:none;padding:0}',
    '.m-user-avatar img,.user-avatar-sm img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;transform:scale(1.65)}',
    '.user-avatar-sm.plain-user,.m-user-avatar.plain-user{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;color:var(--ts)!important;display:grid;place-items:center;padding:0!important}',
    '.user-avatar-sm.plain-user i,.m-user-avatar.plain-user i{font-size:19px;line-height:1}',
    '.user-drawer-head{position:relative;padding:25px 16px 12px;background:linear-gradient(180deg,#FFF9F9,#fff)}',
    '.bbd-head-actions{margin-left:auto;display:flex;align-items:center;gap:8px}',
    '.bbd-logout-btn{width:32px;height:32px;border:0;border-radius:50%;background:transparent;color:#1A3C6E;font-size:15px;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-logout-btn:hover{color:#E8385A}',
    '.user-name-line{display:flex;flex-direction:column;align-items:flex-start;justify-content:center;height:44px;gap:6px}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{position:relative;width:56px;height:56px;flex:0 0 auto}',
    '.user-crown-ring{position:absolute;inset:0;transform:rotate(-90deg)}',
    '.user-crown img.grade-icon{position:absolute!important;top:10px!important;left:11px!important;width:34px!important;height:37px!important;object-fit:contain!important;display:block}',
    '.user-name-strong{display:block;color:var(--tp);font-size:16px;font-weight:600;line-height:14px}',
    '.user-vip-chip{display:inline-flex;margin-top:0;padding:0;border:0;border-radius:0;background:transparent;color:var(--grade-vip);font-size:16px;font-weight:500;line-height:14px}',
    '.user-vip-chip.tier-standard{color:var(--grade-std)}',
    '.user-vip-chip.tier-premium{color:var(--grade-pre)}',
    '.user-vip-chip.tier-vip{color:var(--grade-vip)}',
    '.user-vip-chip.tier-prestige{color:var(--grade-prs)}',
    '.user-stat-title{padding:5px 16px 5px;font-size:14px;font-weight:700;color:var(--tp);background:#fff}',
    '.user-asset-split{display:grid;grid-template-columns:1fr 1fr;padding:10px 0 6px;background:linear-gradient(180deg,#FFF9F9,#fff)}',
    '.user-asset-col{padding-right:14px}',
    '.user-asset-col+.user-asset-col{padding-left:14px;padding-right:0;border-left:1px solid var(--border)}',
    '.user-asset-col-title{display:flex;align-items:center;justify-content:space-between;padding-bottom:8px;font-size:14px;font-weight:700;color:var(--tp)}',
    '.user-asset-col-title i{font-size:11px;color:var(--tm)}',
    '.user-asset-line{display:flex;align-items:baseline;justify-content:space-between;gap:6px;padding:6px 0}',
    '.user-asset-line span{color:var(--tm);font-size:13px;font-weight:500;white-space:nowrap}',
    '.user-asset-line strong{color:var(--tp);font-size:14px;font-weight:700;white-space:nowrap}',
    '.user-asset-divider{height:1px;background:var(--border);margin:0 16px}',
    '.user-status-grid{display:flex;align-items:baseline;justify-content:space-between;background:#fff;padding:0 16px 16px;border-bottom:1px solid var(--border)}',
    '.user-status-item{display:flex;align-items:baseline;gap:6px}',
    '.user-status-item span{font-size:14px;font-weight:600;color:var(--tm);white-space:nowrap}',
    '.user-status-item strong{font-size:14px;font-weight:600;color:var(--tp);font-family:var(--font-num)}',
    '.user-status-item strong.rose{color:#E8385A}',
    '.user-menu-list{padding:0 0 12px}',
    '.user-menu-item{min-height:45px;padding:0 18px 0 14px;display:flex;align-items:center;gap:12px;color:var(--tp);font-size:14px;font-weight:600;border-bottom:0}',
    'button.user-menu-item{width:100%;border-top:0;border-right:0;border-left:0;background:#fff;text-align:left;font-family:inherit;cursor:pointer;border-radius:var(--r-btn,12px);min-height:36px}',
    '.user-menu-item .user-menu-icon{width:22px;text-align:center;font-size:17px;flex:0 0 auto}',
    '.user-menu-item .chev{margin-left:auto;color:var(--tm);font-weight:600;font-size:17px;line-height:1}',
    '.user-menu-panel{display:none;padding:0 0 8px 56px}',
    '.user-menu-section.is-open .user-menu-panel{display:grid;gap:0}',
    '.user-menu-link{min-height:33px;display:flex;align-items:center;color:var(--ts);font-size:14px;font-weight:500;text-decoration:none}',
    '.user-menu-link.danger{color:var(--tm)}'
  ].join('\n');

  // 상단 헤더(햄버거+로고+검색창+알림/장바구니/회원 아이콘). web의 bb-common.js와
  // 동일하게, 각 페이지가 직접 작성해둔 헤더 마크업(.topbar/.app-header/.m-header/
  // <header> 등 제각각인 구버전 구조)을 런타임에 지우고 이 공통 마크업으로 교체한다.
  // 기존 페이지들이 fixed 헤더용으로 잡아둔 body padding-top은 sticky 헤더로
  // 통일되면서 더 이상 필요 없으므로 함께 초기화한다.
  var HEADER_CSS = [
    'body{padding-top:0 !important}',
    'header.topbar{display:block;background:#fff;border-bottom:1px solid var(--border);padding:10px 16px 12px;position:sticky;top:0;left:auto;right:auto;bottom:auto;transform:none;width:auto;max-width:none;z-index:900;box-shadow:0 1px 0 rgba(32,36,43,.04)}',
    'header.topbar .topbar-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:34px;margin-bottom:10px}',
    'header.topbar .brand-area{display:flex;align-items:center;gap:10px;min-width:0}',
    'header.topbar .menu-button{width:34px;height:34px;border-radius:5px;border:0;background:transparent;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;flex-shrink:0}',
    'header.topbar .menu-button span{display:block;width:18px;height:2px;background:#1A1A2E;border-radius:999px}',
    'header.topbar .logo-link{display:inline-flex;align-items:center;width:76px;line-height:0;flex-shrink:0}',
    'header.topbar .logo-link img{display:block;width:100%;height:auto}',
    'header.topbar .topbar-actions{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex-shrink:0}',
    'header.topbar .login-btn-sm{min-width:66px;height:36px;background:#E8385A;color:#fff;border:none;padding:0 14px;border-radius:var(--r-btn,12px);font-size:11px;font-weight:700;cursor:pointer;font-family:inherit;letter-spacing:-0.28px}',
    'header.topbar .icon-btn{width:34px;height:34px;border-radius:5px;background:none;border:none;cursor:pointer;color:var(--tp);display:flex;align-items:center;justify-content:center;position:relative;padding:0}',
    'header.topbar .icon-btn i{font-size:19px;line-height:19px}',
    'header.topbar .i-badge{position:absolute;top:3px;right:2px;background:#E8385A;color:#fff;font-size:7px;font-weight:700;min-width:13px;height:13px;border-radius:8px;display:flex;align-items:center;justify-content:center;padding:0 2px}',
    'header.topbar .topbar-search{display:flex;align-items:center;height:44px;background:#F5F7FA;border:1px solid var(--border);border-radius:8px;overflow:hidden}',
    'header.topbar .topbar-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;padding:0 12px;font-size:13px;font-family:inherit;color:var(--tp)}',
    'header.topbar .topbar-search input::placeholder{color:var(--tm)}',
    'header.topbar .topbar-search button{width:42px;height:100%;border:0;background:#E8385A;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0;border-radius:var(--r-btn,12px)}',
    'header.topbar .topbar-search button i{font-size:14px}'
  ].join('\n');

  function injectStatusStyles() {
    if (document.getElementById('bb-mobile-status-style')) return;
    var style = document.createElement('style');
    style.id = 'bb-mobile-status-style';
    style.textContent = STATUS_CSS;
    document.head.appendChild(style);
  }

  function injectHeaderStyles() {
    if (document.getElementById('bb-mobile-header-style')) return;
    var style = document.createElement('style');
    style.id = 'bb-mobile-header-style';
    style.textContent = HEADER_CSS;
    document.head.appendChild(style);
  }

  function injectStyles() {
    injectStatusStyles();
    injectHeaderStyles();
    if (document.getElementById('bb-mobile-drawer-style')) return;
    var style = document.createElement('style');
    style.id = 'bb-mobile-drawer-style';
    style.textContent = DRAWER_CSS;
    document.head.appendChild(style);
  }

  function phoneStatusHTML() {
    return (
      '<div class="phone-status-bar" aria-hidden="true">' +
        '<span class="psb-time">9:41</span>' +
        '<div class="psb-icons">' +
          '<i class="fas fa-signal"></i>' +
          '<i class="fas fa-wifi"></i>' +
          '<span class="psb-battery"><span class="psb-battery-body"><span class="psb-battery-fill"></span></span></span>' +
        '</div>' +
      '</div>'
    );
  }

  function injectPhoneStatusBar() {
    if (document.querySelector('.phone-status-bar')) return;

    var header = document.querySelector('.app-header, .header, .topbar, .m-header');
    if (header) {
      header.insertAdjacentHTML('beforebegin', phoneStatusHTML());
      return;
    }

    var shell = document.querySelector('.phone, .mobile-shell, .page-shell, .app-shell, .page, .mobile-page');
    if (shell) {
      shell.insertAdjacentHTML('afterbegin', phoneStatusHTML());
      return;
    }

    document.body.insertAdjacentHTML('afterbegin', phoneStatusHTML());
  }

  // fixed/absolute 조상이 있으면 별도 스크롤 문맥이라 상태바 높이를 더할 필요가 없다.
  function hasPositionedAncestor(el) {
    for (var p = el.parentElement; p && p !== document.body; p = p.parentElement) {
      var pos = getComputedStyle(p).position;
      if (pos === 'fixed' || pos === 'absolute') return true;
    }
    return false;
  }

  // 상태바를 최상단에 고정하고, 그만큼 기존 sticky 헤더/탭의 top 을 밀어준다.
  function pinPhoneStatusBar() {
    var bar = document.querySelector('.phone-status-bar');
    if (!bar || bar.classList.contains('is-pinned')) return;

    // 이미 fixed 헤더(.app-header) 안에 들어 있는 페이지는 그대로 고정 상태다.
    if (hasPositionedAncestor(bar)) return;

    bar.classList.add('is-pinned');
    var offset = Math.round(bar.getBoundingClientRect().height) || 25;

    Array.prototype.forEach.call(document.body.querySelectorAll('*'), function (el) {
      if (el === bar || bar.contains(el)) return;
      var cs = getComputedStyle(el);
      if (cs.position !== 'sticky' || cs.top === 'auto') return;
      if (hasPositionedAncestor(el)) return;
      el.style.top = (parseFloat(cs.top) || 0) + offset + 'px';
    });
  }

  /* -- 스토어 단일 목록 --------------------------------------------
     로고 교체: storeicon/ 안의 파일만 바꾸면
     좌측 드로어에 그대로 반영된다.
     스토어 추가/삭제/순서변경도 이 배열만 수정한다.                */
  var STORE_LOGO_DIR = 'storeicon/';
  var STORES = [
    { label: '야후 옥션',   logo: 'store_yahoo_auction.png',  href: 'mobile_sub_main.html' },
    { label: '메루카리',   logo: 'store_mercari.png',        href: 'mobile_purchase_merukari.html' },
    { label: '일본 라쿠텐',     logo: 'store_rakuten.png',        href: 'mobile_purchase_store.html' },
    { label: '일본 라쿠마',     logo: 'store_rakuma.png',         href: 'mobile_purchase_store.html' },
    { label: '야후 쇼핑',   logo: 'store_yahoo_shopping.png', href: 'mobile_purchase_url.html' },
    { label: '야후 프리마', logo: 'store_yahoo_furima.png',   href: 'mobile_purchase_store.html' },
    { label: '미국 이베이', logo: 'store_ebay_us.png',        href: 'mobile_sub_main.html' },
    { label: '영국 이베이', logo: 'store_ebay_uk.png',        href: 'mobile_sub_main.html' }
  ];
  window.BB_STORES = STORES;
  window.BB_STORE_LOGO_DIR = STORE_LOGO_DIR;

  function drawerCsCardHTML() {
    return (
      '<div class="bbd-cs-card">' +
        '<div class="bbd-cs-tel">1544-5224</div>' +
        '<p class="bbd-cs-time">평일 AM 10:00 - PM 17:00 (점심 PM 12:30 - 13:30)</p>' +
        '<div class="bbd-cs-actions"><button type="button" onclick="location.href=\'mobile_qna_form.html\'">1:1 문의</button><button type="button" onclick="location.href=\'mobile_qna.html\'">이용가이드</button><button type="button">공지사항</button></div>' +
      '</div>' +
      '<div style="height:24px"></div>'
    );
  }

  function leftDrawerHTML() {
    if (!isLoggedIn()) {
      return (
        '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div>' +
        '<div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="toggleLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button" onclick="location.href=\'mobile_index.html\'">회원가입</button></div></div>' +
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
        '<a class="user-menu-item" href="mobile_mypage.html"><span class="user-menu-icon"><i class="fas fa-house-user" aria-hidden="true"></i></span><span>마이페이지</span></a>' +
        userMenuSection('fa-gavel', '나의 거래 현황', 'mm-menu-trade',
          userMenuLink('거래 전체 목록', 'mobile_mainlist.html') +
          userMenuLink('경매 입찰/유찰', 'mobile_mypage.html') +
          userMenuLink('구매 신청 목록', 'mobile_mypage.html')) +
        userMenuSection('fa-truck-fast', '배송관리', 'mm-menu-delivery',
          userMenuLink('배송신청/변경', 'mobile_bundle_shipping_management.html') +
          userMenuLink('배송지 관리', '#')) +
        userMenuSection('fa-heart', '관심 항목 관리', 'mm-menu-favorites',
          userMenuLink('관심 출품자', 'mobile_favorites.html?tab=seller') +
          userMenuLink('경매 관심물품', 'mobile_favorites.html?tab=auction') +
          userMenuLink('구매 관심물품', 'mobile_favorites.html?tab=purchase') +
          userMenuLink('관심 키워드', 'mobile_favorites.html?tab=keyword') +
          userMenuLink('바로가기', 'mobile_favorites.html?tab=shortcut')) +
        userMenuSection('fa-gift', 'MY 혜택', 'mm-menu-benefit',
          userMenuLink('마일리지 / 쿠폰', 'mobile_mileage.html') +
          userMenuLink('MY 등급', 'mobile_grade_page.html')) +
        userMenuSection('fa-user', '나의 정보관리', 'mm-menu-info',
          userMenuLink('예치금 관리', '#') +
          userMenuLink('보증금 관리', '#') +
          userMenuLink('회원정보 수정', '#') +
          userMenuLink('비밀번호 변경', '#') +
          userMenuLink('회원 탈퇴', '#', true)) +
        '<a class="user-menu-item" href="mobile_purchase_start.html"><span class="user-menu-icon"><i class="fas fa-link" aria-hidden="true"></i></span><span>URL로 구매신청하기</span><span class="chev"><i class="fas fa-chevron-right" aria-hidden="true"></i></span></a>' +
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

  function headerHTML() {
    var actions = isLoggedIn()
      ? '<div class="topbar-actions" id="userArea">' +
          '<button class="icon-btn" type="button" aria-label="알림"><i class="fa-regular fa-bell" aria-hidden="true"></i><span class="i-badge">3</span></button>' +
          '<button class="icon-btn" type="button" aria-label="장바구니"><i class="fa-solid fa-cart-shopping" aria-hidden="true"></i></button>' +
          '<button class="icon-btn user-avatar-sm plain-user" type="button" aria-label="마이페이지" onclick="location.href=\'mobile_mypage.html\'"><i class="fa-regular fa-user" aria-hidden="true"></i></button>' +
        '</div>'
      : '<div class="topbar-actions" id="guestArea">' +
          '<button class="login-btn-sm" type="button" onclick="toggleLogin()">로그인</button>' +
        '</div>';

    return (
      '<div class="topbar-row">' +
        '<div class="brand-area">' +
          '<button class="menu-button" type="button" aria-label="메뉴 열기" aria-expanded="false" onclick="openDrawer()"><span></span><span></span><span></span></button>' +
          '<a class="logo-link" href="mobile_main.html" aria-label="Bidbuy 홈"><img src="Bidbuy logo.png" alt="Bidbuy World Auction Agency"></a>' +
        '</div>' +
        actions +
      '</div>' +
      '<form class="topbar-search" role="search" action="mobile_totalsearch.html" method="get">' +
        '<input type="search" name="q" placeholder="키워드 또는 구매신청을 원하시는 URL을 입력해주세요" aria-label="검색어 입력">' +
        '<button type="submit" aria-label="검색"><i class="fas fa-search" aria-hidden="true"></i></button>' +
      '</form>'
    );
  }

  // 페이지마다 제각각인 구버전 헤더(.topbar/.app-header/.m-header/<header class="header">
  // 등)를 지우고 공통 헤더로 교체한다. mobile_main.html처럼 헤더 안에 채널탭 같은
  // 페이지 고유 콘텐츠가 중첩된 경우 그 부분만 떼어내 새 헤더 뒤로 옮겨 보존한다.
  function injectHeader() {
    var oldHeaders = Array.prototype.slice
      .call(document.querySelectorAll('header, .topbar, .app-header, .m-header'))
      .filter(function (el) { return el.id !== 'bbmHeader'; });

    var preserved = [];
    oldHeaders.forEach(function (el) {
      el.querySelectorAll('.slide-fade-wrap, .channel-tabs').forEach(function (node) { preserved.push(node); });
    });

    var header = document.getElementById('bbmHeader');
    if (!header) {
      header = document.createElement('header');
      header.id = 'bbmHeader';
    }
    header.className = 'topbar';

    var anchor = oldHeaders[0] || null;
    if (anchor) {
      anchor.parentNode.insertBefore(header, anchor);
    } else if (!header.parentNode) {
      var shell = document.querySelector('.phone, .mobile-shell, .page-shell, .app-shell, .page, .mobile-page') || document.body;
      shell.insertBefore(header, shell.firstChild);
    }

    var insertAfter = header;
    preserved.forEach(function (node) {
      header.parentNode.insertBefore(node, insertAfter.nextSibling);
      insertAfter = node;
    });

    oldHeaders.forEach(function (el) { if (el !== header) el.remove(); });

    header.innerHTML = headerHTML();
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

  // 우측 상단 회원 아이콘을 사람 아이콘으로 통일하고 마이페이지 홈으로 연결한다.
  // 페이지마다 onclick이 없거나("," alert 같은 미구현 placeholder여도) 여기서
  // 무조건 실제 동작으로 덮어써서 모든 페이지에서 동일하게 동작하도록 한다.
  function bindAvatarTrigger() {
    document.querySelectorAll('[aria-label="회원 메뉴"], [aria-label="마이페이지"], [aria-label="PREMIUM 등급 회원 메뉴"]').forEach(function (btn) {
      if (btn.classList.contains('m-user-avatar') || btn.classList.contains('user-avatar-sm')) {
        btn.classList.remove('grade-img', 'standard', 'premium', 'vip', 'prestige',
          'tier-premium', 'tier-standard', 'tier-vip', 'tier-prestige', 'member-tier-icon');
        btn.classList.add('plain-user');
        btn.setAttribute('aria-label', '마이페이지');
        btn.innerHTML = '<i class="fa-regular fa-user" aria-hidden="true"></i>';
      }
      btn.onclick = function (e) {
        e.preventDefault();
        location.href = 'mobile_mypage.html';
      };
    });
  }

  function render() {
    hydrateProductImages();
    removeNonMainNotice();

    if (SHELL_MODE === 'status-only') {
      injectStatusStyles();
      injectPhoneStatusBar();
      pinPhoneStatusBar();
      hydrateProductImages();
      return;
    }

    injectStyles();
    injectHeader();
    injectPhoneStatusBar();
    pinPhoneStatusBar();

    var drawerOv = ensureNode('drawerOv', 'div', 'drawer-ov');
    var drawer = ensureNode('drawer', 'div', 'drawer');

    drawerOv.onclick = closeDrawer;
    drawer.innerHTML = leftDrawerHTML();
    bindAvatarTrigger();
    bindUserMenu();
    hydrateProductImages();

    document.dispatchEvent(new CustomEvent('bb:mobile-login', { detail: { loggedIn: isLoggedIn() } }));
  }

  function closeDrawer() {
    document.getElementById('drawer')?.classList.remove('open');
    document.getElementById('drawerOv')?.classList.remove('open');
    document.querySelector('.hb')?.setAttribute('aria-expanded', 'false');
  }

  window.bbIsLoggedIn = isLoggedIn;
  window.toggleLogin = function () {
    if (isLoggedIn()) localStorage.removeItem(LOGIN_KEY);
    else localStorage.setItem(LOGIN_KEY, '1');
    closeDrawer();
    render();
  };
  window.openDrawer = function () {
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawerOv')?.classList.add('open');
    document.querySelector('.hb')?.setAttribute('aria-expanded', 'true');
  };
  window.closeDrawer = closeDrawer;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
