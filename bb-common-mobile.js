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

  function gradeIconHTML(className, grade) {
    var key = (grade || USER_GRADE || 'premium').toLowerCase();
    var label = key.toUpperCase();
    var file = GRADE_ICONS[key] || GRADE_ICONS.premium;
    return '<span class="' + className + ' ' + key + ' grade-img" aria-label="' + label + ' 등급"><img class="grade-icon" src="' + GRADE_ICON_DIR + file + '" alt="' + label + '"></span>';
  }

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
    var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + (width || 520) + '" height="' + (height || width || 520) + '" viewBox="0 0 520 520"><rect width="520" height="520" fill="#f5f7fa"/><rect x="54" y="54" width="412" height="412" rx="24" fill="#fff" stroke="#e0e4eb" stroke-width="2"/><text x="260" y="252" text-anchor="middle" font-family="Arial,sans-serif" font-size="34" font-weight="700" fill="#1a1a2e">' + label + '</text><text x="260" y="298" text-anchor="middle" font-family="Arial,sans-serif" font-size="16" fill="#999baa">BidBuy product image</text></svg>';
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
    '.phone-status-bar{display:flex;align-items:center;justify-content:space-between;height:25px;padding:0 24px;background:#fff;color:#0A0A0A;font-family:-apple-system,BlinkMacSystemFont,Pretendard,sans-serif;font-size:15px;font-weight:700;letter-spacing:-.2px}',
    '.psb-time{font-variant-numeric:tabular-nums}',
    '.psb-icons{display:flex;align-items:center;gap:6px;font-size:14px;color:#0A0A0A}',
    '.psb-icons i{line-height:1}',
    '.psb-battery{display:flex;align-items:center;gap:2px}',
    '.psb-battery-body{width:22px;height:11px;border:1.3px solid #0A0A0A;border-radius:3px;padding:1.5px;position:relative}',
    '.psb-battery-body::after{content:"";position:absolute;right:-3.5px;top:50%;transform:translateY(-50%);width:2px;height:4px;background:#0A0A0A;border-radius:0 1px 1px 0}',
    '.psb-battery-fill{display:block;width:80%;height:100%;background:#0A0A0A;border-radius:1px}',
    // 스크롤해도 시간/네트워크/배터리 바는 항상 최상단에 붙어 있는다.
    '.phone-status-bar.is-pinned{position:sticky;top:0;z-index:1000}'
  ].join('\n');

  var DRAWER_CSS = [
    '.drawer-ov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:5000;pointer-events:none;transition:background .3s}',
    '.drawer-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.drawer{position:fixed;top:0;left:0;bottom:0;width:88%;max-width:340px;background:#fff;z-index:5001;overflow-y:auto;scrollbar-width:none;transform:translateX(-100%);visibility:hidden;pointer-events:none;transition:transform .3s cubic-bezier(.4,0,.2,1), visibility 0s linear .3s;display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,.12);border-top-right-radius:16px;border-bottom-right-radius:16px}',
    '.drawer::-webkit-scrollbar{display:none}',
    '.drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto;transition:transform .3s cubic-bezier(.4,0,.2,1)}',
    ':root{--grade-std:#D4891A;--grade-pre:#1f477d;--grade-vip:#0C5F33;--grade-prs:#E8385A}',
    '.grade-img{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;overflow:visible!important;padding:0!important}',
    'img.grade-icon{width:100%!important;height:100%!important;object-fit:contain!important;display:block;border-radius:0!important;transform:none!important}',
    '.bbd-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;border-bottom:1px solid #ECEFF3;background:#fff}',
    '#drUserHd.bbd-head{padding-top:32px;padding-bottom:32px}',
    '.bbd-user-mini{display:flex;align-items:center;gap:10px}',
    '.bbd-uav{width:38px;height:38px;border-radius:50%;background:#FFE7EF;color:#E8385A;display:grid;place-items:center;font-size:18px;font-weight:800}',
    '.bbd-uname{font-size:15px;font-weight:700;color:#1A1A2E}',
    '.bbd-ugrade{font-size:11px;color:var(--grade-vip);font-weight:700;margin-top:2px}',
    '.bbd-guest-card{padding:14px 16px 16px;background:#FFF8F5;border-bottom:1px solid #E5E7EB}',
    '.bbd-guest-title{font-size:16px;font-weight:700;color:#111827;margin-bottom:4px}',
    '.bbd-guest-copy{font-size:12px;color:#6B7280;line-height:1.45;margin-bottom:12px}',
    '.bbd-login-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}',
    '.bbd-action-btn{height:36px;border-radius:5px;border:1px solid #E8385A;background:#E8385A;color:#fff;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer}',
    '.bbd-action-btn.secondary{background:#fff;color:#4B5563;border-color:#D9E0E9}',
    '.bbd-close{width:32px;height:32px;border:0;border-radius:50%;background:#F7F8FA;color:#111827;font-size:18px;font-weight:700;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-close:hover{background:#EEF1F5}',
    '.bbd-sec{padding:0;border-bottom:1px solid #ECEFF3;background:#fff}',
    '.bbd-sec:last-child{border-bottom:none}',
    '.bbd-sec-title{height:38px;padding:0 16px;display:flex;align-items:center;background:#F5F6F8;color:#7D8796;font-size:12px;font-weight:700}',
    '.bbd-quick,.bbd-guide-list{display:flex;flex-direction:column;padding:6px 0}',
    '.bbd-quick-item,.bbd-guide-item{min-height:56px;display:flex;align-items:center;gap:14px;padding:8px 16px 8px 24px;color:#111827;cursor:pointer;text-decoration:none}',
    '.bbd-quick-icon,.bbd-guide-icon{width:22px;display:flex;align-items:center;justify-content:center;color:#000;font-size:16px;flex-shrink:0}',
    '.bbd-quick-text,.bbd-guide-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}',
    '.bbd-quick-label,.bbd-guide-label{font-size:15px;color:#111827;font-weight:700;line-height:1.2}',
    '.bbd-quick-desc,.bbd-guide-desc{font-size:11px;color:#8B94A3;font-weight:500;line-height:1.25}',
    '.bbd-cat-arrow{font-size:12px;color:#999BAA}',
    '.bbd-link-grid{display:grid;grid-template-columns:repeat(2,1fr);row-gap:14px;column-gap:24px;padding:14px 16px}',
    '.bbd-link-grid a{font-size:14px;color:#666680;text-decoration:none}',
    '.bbd-cs-card{margin:22px 26px 34px;padding:18px 14px;background:#fcfcfd;text-align:center}',
    '.bbd-cs-tel{color:#1A3C6E;font-family:Roboto,sans-serif;font-size:26px;font-weight:700}',
    '.bbd-cs-time{margin:8px 0 16px;color:#7b8494;font-size:11px}',
    '.bbd-cs-actions{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}',
    '.bbd-cs-actions button{height:34px;border:1px solid #d9e0e9;border-radius:5px;background:#fff;color:#1f2530;font-size:12px;font-weight:700;font-family:inherit}',
    '.bbd-cs-actions button:first-child{border-color:#E8385A;background:#E8385A;color:#fff}',
    '.user-drawer-ov{position:fixed;inset:0;background:rgba(0,0,0,0);z-index:5002;pointer-events:none;transition:background .3s}',
    '.user-drawer-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.user-drawer{position:fixed;top:0;right:0;bottom:0;width:84%;max-width:300px;background:#fff;z-index:5003;overflow-y:auto;scrollbar-width:none;transform:translateX(100%);visibility:hidden;pointer-events:none;transition:transform .28s cubic-bezier(.4,0,.2,1), visibility 0s linear .28s}',
    '.user-drawer::-webkit-scrollbar{display:none}',
    '.user-drawer.open{transform:translateX(0);visibility:visible;pointer-events:auto;transition:transform .28s cubic-bezier(.4,0,.2,1)}',
    '.bbu-avatar{width:50px;height:50px;flex:0 0 auto;display:grid;place-items:center;border-radius:50%;background:#fff;overflow:hidden;box-shadow:0 8px 18px rgba(17,24,39,.14)}',
    '.m-user-avatar,.user-avatar-sm{width:30px;height:30px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;background:#fff;overflow:hidden;border:0;cursor:pointer;font-family:inherit;box-shadow:0 4px 10px rgba(17,24,39,.12);padding:0}',
    '.bbu-avatar img,.m-user-avatar img,.user-avatar-sm img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;transform:scale(1.65)}',
    '.user-avatar-icon{width:100%;height:100%;display:block;border-radius:50%;overflow:hidden}',
    '.user-avatar-sm.plain-user,.m-user-avatar.plain-user{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;color:#687385!important;display:grid;place-items:center;padding:0!important}',
    '.user-avatar-sm.plain-user i,.m-user-avatar.plain-user i{font-size:19px;line-height:1}',
    '.user-drawer-head{padding:38px 14px 12px;background:#fff8f5;border-bottom:1px solid #efe6e2}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#fff;overflow:hidden;flex:0 0 auto;box-shadow:0 6px 14px rgba(17,24,39,.12)}',
    '.user-crown img{width:100%;height:100%;object-fit:cover;display:block;border-radius:50%;transform:scale(1.65)}',
    '.user-name-strong{display:block;color:#111827;font-size:18px;font-weight:500}',
    '.user-vip-chip{display:inline-flex;margin-top:5px;padding:2px 12px;border-radius:999px;background:var(--grade-vip);color:#fff;font-size:11px;font-weight:500}',
    '.user-vip-copy{margin:13px 0 4px;color:var(--rose,#E8385A);font-size:11px;font-weight:500}',
    '.user-vip-bar{height:5px;border-radius:999px;background:#eee2de;overflow:hidden}',
    '.user-vip-bar span{display:block;height:100%;background:var(--rose,#E8385A)}',
    '.user-asset-box{display:grid;grid-template-columns:1fr 1fr;margin-top:12px;border:1px solid #d9e0e9;border-radius:8px;background:#fff;overflow:hidden}',
    '.user-asset-box div{padding:8px 12px}',
    '.user-asset-box div+div{border-left:1px solid #d9e0e9}',
    '.user-asset-box span{display:block;color:#a4acb8;font-size:10px;font-weight:500}',
    '.user-asset-box strong{display:block;color:#151b29;font-size:16px;font-weight:500}',
    '.user-status-grid{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #e5e7eb;background:#fff}',
    '.user-status-grid div{min-height:70px;display:grid;place-items:center;align-content:center;gap:4px;text-align:center}',
    '.user-status-grid div+div{border-left:1px solid #e5e7eb}',
    '.user-status-grid strong{color:#151b29;font-family:Roboto,sans-serif;font-size:26px;line-height:1;font-weight:500}',
    '.user-status-grid div:nth-child(2) strong{color:var(--rose,#E8385A)}',
    '.user-status-grid span{color:#9aa3b2;font-size:10px;font-weight:500}',
    '.user-menu-list{padding:0 0 12px}',
    '.user-menu-item{min-height:45px;padding:0 18px 0 14px;display:flex;align-items:center;gap:12px;color:#111827;font-size:14px;font-weight:500;border-bottom:0}',
    'button.user-menu-item{width:100%;border-top:0;border-right:0;border-left:0;background:#fff;text-align:left;font-family:inherit;cursor:pointer}',
    '.user-menu-item .user-menu-icon{width:22px;text-align:center;font-size:17px;flex:0 0 auto}',
    '.user-menu-item .chev{margin-left:auto;color:#a8b0bd;font-weight:500;font-size:17px;line-height:1}',
    '.user-menu-panel{display:none;padding:0 0 8px 56px}',
    '.user-menu-section.is-open .user-menu-panel{display:grid;gap:0}',
    '.user-menu-link{min-height:33px;display:flex;align-items:center;color:#666b75;font-size:14px;font-weight:500;text-decoration:none}',
    '.user-menu-link.danger{color:#8f949f}',
    '.user-menu-item.logout{margin-top:6px;border-top:1px solid #e5e7eb;color:#9aa3b2;font-weight:500}'
  ].join('\n');

  // 상단 헤더(햄버거+로고+검색창+알림/장바구니/회원 아이콘). web의 bb-common.js와
  // 동일하게, 각 페이지가 직접 작성해둔 헤더 마크업(.topbar/.app-header/.m-header/
  // <header> 등 제각각인 구버전 구조)을 런타임에 지우고 이 공통 마크업으로 교체한다.
  // 기존 페이지들이 fixed 헤더용으로 잡아둔 body padding-top은 sticky 헤더로
  // 통일되면서 더 이상 필요 없으므로 함께 초기화한다.
  var HEADER_CSS = [
    'body{padding-top:0 !important}',
    'header.topbar{display:block;background:#fff;border-bottom:1px solid #D9E0E9;padding:10px 16px 12px;position:sticky;top:0;left:auto;right:auto;bottom:auto;transform:none;width:auto;max-width:none;z-index:900;box-shadow:0 1px 0 rgba(32,36,43,.04)}',
    'header.topbar .topbar-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:34px;margin-bottom:10px}',
    'header.topbar .brand-area{display:flex;align-items:center;gap:10px;min-width:0}',
    'header.topbar .menu-button{width:34px;height:34px;border-radius:5px;border:0;background:transparent;padding:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;flex-shrink:0}',
    'header.topbar .menu-button span{display:block;width:18px;height:2px;background:#242836;border-radius:999px}',
    'header.topbar .logo-link{display:inline-flex;align-items:center;width:76px;line-height:0;flex-shrink:0}',
    'header.topbar .logo-link img{display:block;width:100%;height:auto}',
    'header.topbar .topbar-actions{display:flex;align-items:center;justify-content:flex-end;gap:4px;flex-shrink:0}',
    'header.topbar .login-btn-sm{min-width:66px;height:32px;background:#E8385A;color:#fff;border:none;padding:0 14px;border-radius:5px;font-size:11px;font-weight:700;cursor:pointer;font-family:inherit}',
    'header.topbar .icon-btn{width:34px;height:34px;border-radius:5px;background:none;border:none;cursor:pointer;color:#333;display:flex;align-items:center;justify-content:center;position:relative;padding:0}',
    'header.topbar .icon-btn i{font-size:19px;line-height:19px}',
    'header.topbar .i-badge{position:absolute;top:3px;right:2px;background:#E8385A;color:#fff;font-size:7px;font-weight:700;min-width:13px;height:13px;border-radius:7px;display:flex;align-items:center;justify-content:center;padding:0 2px}',
    'header.topbar .topbar-search{display:flex;align-items:center;height:40px;background:#F4EEEA;border:1px solid #E6DDDA;border-radius:10px;overflow:hidden}',
    'header.topbar .topbar-search input{flex:1;min-width:0;height:100%;border:0;outline:0;background:transparent;padding:0 12px;font-size:13px;font-family:inherit;color:#333}',
    'header.topbar .topbar-search input::placeholder{color:#99A2B0}',
    'header.topbar .topbar-search button{width:42px;height:100%;border:0;background:#E8385A;color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer;flex-shrink:0}',
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

  function leftDrawerHTML() {
    var header = isLoggedIn()
      ? '<div id="drUserHd" class="bbd-head"><div class="bbd-user-mini">' + gradeIconHTML('bbd-uav', USER_GRADE) + '<div><div class="bbd-uname">홍길동님</div><div class="bbd-ugrade">VIP 회원</div></div></div><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div>'
      : '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div><div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="toggleLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button" onclick="location.href=\'mobile_index.html\'">회원가입</button></div></div>';

    return (
      header +
      '<div class="bbd-sec"><div class="bbd-sec-title">빠른 메뉴</div><div class="bbd-quick">' +
        '<a class="bbd-quick-item" href="#"><span class="bbd-quick-icon"><i class="fas fa-calculator"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">비용 계산기</span><span class="bbd-quick-desc">예상 소요 비용 계산기</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="mobile_bundle_shipping_management.html"><span class="bbd-quick-icon"><i class="fas fa-box"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">입고/보관중인 물건 조회</span><span class="bbd-quick-desc">개인 입고 물품 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="mobile_bundle_shipping_management_2.html"><span class="bbd-quick-icon"><i class="fas fa-truck-fast"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">출고 배송중</span><span class="bbd-quick-desc">센터별 출고 일정 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">이용가이드</div><div class="bbd-guide-list">' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-book-open"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">경매대행 이용안내</span><span class="bbd-guide-desc">서비스 이용 절차 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-shopping-bag"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">구매대행 이용안내</span><span class="bbd-guide-desc">구매대행 진행 방식 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="mobile_cs_refund.html"><span class="bbd-guide-icon"><i class="fas fa-coins"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">수수료 및 관부가세</span><span class="bbd-guide-desc">예상 비용과 세금 안내</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec" style="border-bottom:none"><div class="bbd-sec-title">고객센터</div><div class="bbd-link-grid">' +
        '<a href="mobile_fakenotice.html">공지사항</a><a href="mobile_qna.html">자주하는질문</a><a href="mobile_qna_form.html">1:1문의</a><a href="mobile_qna.html">커뮤니티</a>' +
      '</div></div>' +
      '<div class="bbd-cs-card">' +
        '<div class="bbd-cs-tel">1544-5224</div>' +
        '<p class="bbd-cs-time">평일 AM 10:00 - PM 17:00 (점심 PM 12:30 - 13:30)</p>' +
        '<div class="bbd-cs-actions"><button type="button" onclick="location.href=\'mobile_qna_form.html\'">1:1 문의</button><button type="button" onclick="location.href=\'mobile_qna.html\'">FAQ</button><button type="button" onclick="location.href=\'mobile_fakenotice.html\'">공지사항</button></div>' +
      '</div>' +
      '<div style="height:24px"></div>'
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

  function rightDrawerHTML() {
    return (
      '<div class="user-drawer-head">' +
        '<div class="user-member-row">' +
          gradeIconHTML('user-crown', USER_GRADE) +
          '<div><strong class="user-name-strong">홍길동님</strong><span class="user-vip-chip">VIP</span></div>' +
        '</div>' +
        '<p class="user-vip-copy">Prestige까지 80% 남음</p>' +
        '<div class="user-vip-bar"><span style="width:20%"></span></div>' +
        '<div class="user-asset-box"><div><span>마일리지</span><strong>4,500원</strong></div><div><span>예치금</span><strong>29,870원</strong></div></div>' +
      '</div>' +
      '<div class="user-status-grid"><div><strong>3</strong><span>입찰 진행 중</span></div><div><strong>1</strong><span>1차 결제 대기</span></div><div><strong>0</strong><span>2차 결제 대기</span></div></div>' +
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
        '<button class="user-menu-item logout" type="button" onclick="toggleLogin();closeUserDrawer()"><span class="emoji">🔒</span><span>로그아웃</span></button>' +
      '</nav>'
    );
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
          '<button class="icon-btn user-avatar-sm plain-user" type="button" aria-label="회원 메뉴" onclick="openUserDrawer()"><i class="fa-regular fa-user" aria-hidden="true"></i></button>' +
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

  // 우측 상단 회원 아이콘을 사람 아이콘으로 통일하고 우측 회원 드로어에 연결한다.
  // 페이지마다 onclick이 없거나("," alert 같은 미구현 placeholder여도) 여기서
  // 무조건 실제 동작으로 덮어써서 모든 페이지에서 동일하게 동작하도록 한다.
  function bindAvatarTrigger() {
    document.querySelectorAll('[aria-label="회원 메뉴"], [aria-label="PREMIUM 등급 회원 메뉴"]').forEach(function (btn) {
      if (btn.classList.contains('m-user-avatar') || btn.classList.contains('user-avatar-sm')) {
        btn.classList.remove('grade-img', 'standard', 'premium', 'vip', 'prestige',
          'tier-premium', 'tier-standard', 'tier-vip', 'tier-prestige', 'member-tier-icon');
        btn.classList.add('plain-user');
        btn.setAttribute('aria-label', '회원 메뉴');
        btn.innerHTML = '<i class="fa-regular fa-user" aria-hidden="true"></i>';
      }
      btn.onclick = function (e) {
        e.preventDefault();
        openUserDrawer();
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
    var userDrawerOv = ensureNode('userDrawerOv', 'div', 'user-drawer-ov');
    var userDrawer = ensureNode('userDrawer', 'div', 'user-drawer');

    drawerOv.onclick = closeDrawer;
    userDrawerOv.onclick = closeUserDrawer;
    drawer.innerHTML = leftDrawerHTML();
    userDrawer.innerHTML = rightDrawerHTML();
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

  function closeUserDrawer() {
    document.getElementById('userDrawer')?.classList.remove('open');
    document.getElementById('userDrawerOv')?.classList.remove('open');
  }

  window.bbIsLoggedIn = isLoggedIn;
  window.toggleLogin = function () {
    if (isLoggedIn()) localStorage.removeItem(LOGIN_KEY);
    else localStorage.setItem(LOGIN_KEY, '1');
    closeDrawer();
    closeUserDrawer();
    render();
  };
  window.openDrawer = function () {
    closeUserDrawer();
    document.getElementById('drawer')?.classList.add('open');
    document.getElementById('drawerOv')?.classList.add('open');
    document.querySelector('.hb')?.setAttribute('aria-expanded', 'true');
  };
  window.closeDrawer = closeDrawer;
  window.openUserDrawer = function () {
    closeDrawer();
    document.getElementById('userDrawer')?.classList.add('open');
    document.getElementById('userDrawerOv')?.classList.add('open');
  };
  window.closeUserDrawer = closeUserDrawer;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
