/* ============================================================
   BidBuy Renewal common shell
   - Standard header for index preview pages
   - Left / right drawers matched to mobile_main.html structure
   - Login state shared through localStorage
   ============================================================ */
(function () {
  'use strict';

  var LOGIN_KEY = 'bb_logged_in';

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

  var css = [
    'body{min-width:1280px !important}',

    '.bbh-header{background:#fff;border-bottom:1px solid #E0E4EB;position:sticky;top:0;z-index:900;box-shadow:0 1px 4px rgba(0,0,0,.06);font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;font-size:14px;color:#1A1A2E}',
    '.bbh-hdr{max-width:1440px;margin:0 auto;padding:0 24px;height:56px;display:flex;align-items:center;gap:16px}',
    '.bbh-menu{display:flex;flex-direction:column;gap:4.5px;padding:8px;border-radius:5px;cursor:pointer;background:none;border:none;margin-right:12px;transition:background .15s;flex-shrink:0}',
    '.bbh-menu:hover{background:#F5F7FA}',
    '.bbh-menu span{display:block;width:17px;height:2px;background:#1A1A2E;border-radius:1px}',
    '.bbh-logo{display:flex;align-items:center;flex-shrink:0;flex:1;text-decoration:none}',
    '.bbh-logo img{display:block;width:100px;height:auto}',
    '.bbh-search{flex:0 0 520px;display:flex;border:1.5px solid #E0E4EB;border-radius:8px;overflow:hidden;transition:border-color .2s}',
    '.bbh-search:focus-within{border-color:#E8385A}',
    '.bbh-search input{flex:1;border:none;background:#F5F7FA;padding:10px 14px;font-size:14px;font-family:inherit;outline:none;min-width:0}',
    '.bbh-search button{background:#E8385A;color:#fff;border:none;padding:0 20px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;display:flex;align-items:center;gap:6px}',
    '.bbh-search button:hover{background:#C42F4C}',
    '.bbh-right{flex:1;display:flex;align-items:center;justify-content:flex-end;gap:4px}',
    '.bbh-ibtn{display:flex;flex-direction:column;align-items:center;gap:2px;padding:7px 10px;border-radius:5px;cursor:pointer;color:#666680;font-size:10px;border:none;background:none;font-family:inherit;position:relative}',
    '.bbh-ibtn:hover{background:#F5F7FA}',
    '.bbh-ibtn i{font-size:17px}',
    '.bbh-badge{position:absolute;top:4px;right:4px;background:#E8385A;color:#fff;font-size:8px;font-weight:700;min-width:14px;height:14px;border-radius:7px;display:flex;align-items:center;justify-content:center;padding:0 2px}',
    '.bbh-btn-login{background:#E8385A;color:#fff;border:none;padding:8px 18px;border-radius:5px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;transition:background .15s;white-space:nowrap}',
    '.bbh-btn-login:hover{background:#C42F4C}',
    '.bbh-btn-join{background:#fff;color:#666680;border:1.5px solid #E0E4EB;padding:8px 16px;border-radius:5px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;transition:all .15s;white-space:nowrap;margin-right:6px}',
    '.bbh-btn-join:hover{border-color:#E8385A;color:#E8385A}',
    '.grade-img{background:none!important;box-shadow:none!important;border:0!important;border-radius:0!important;overflow:visible!important;padding:0!important}',
    'img.grade-icon{width:100%;height:100%;object-fit:contain;display:block}',

    '.bbd-ov{position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;transition:background .3s;z-index:1000}',
    '.bbd-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.bbd{position:fixed;top:0;bottom:0;left:-100%;width:88%;max-width:340px;z-index:1001;background:#fff;overflow-y:auto;scrollbar-width:none;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;font-size:14px;color:#1A1A2E;transition:left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,.12)}',
    '.bbd::-webkit-scrollbar{display:none}',
    '.bbd.open{left:0}',
    '.bbu{position:fixed;top:64px;right:24px;width:320px;max-width:calc(100vw - 32px);max-height:calc(100vh - 88px);z-index:1002;background:linear-gradient(#FFF5F1 0 192px,#fff 192px 100%);overflow-y:auto;scrollbar-width:none;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;font-size:14px;color:#1A1A2E;border:1px solid #DDE3EB;border-radius:16px;box-shadow:0 18px 42px rgba(17,24,39,.16);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .18s ease,transform .18s ease,visibility .18s}',
    '.bbu::-webkit-scrollbar{display:none}',
    '.bbu.open{opacity:1;visibility:visible;transform:translateY(0)}',

    ':root{--grade-std:#D4891A;--grade-pre:#1f477d;--grade-vip:#0C5F33;--grade-prs:#E8385A}',
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
    '.bbd-action-btn{height:36px;border-radius:5px;border:1px solid #E8385A;background:#E8385A;color:#fff;font-size:12px;font-weight:800;font-family:inherit;cursor:pointer}',
    '.bbd-action-btn.secondary{background:#fff;color:#4B5563;border-color:#D9E0E9}',
    '.bbd-close{width:32px;height:32px;border:0;border-radius:50%;background:#F7F8FA;color:#111827;font-size:18px;font-weight:900;display:flex;align-items:center;justify-content:center;cursor:pointer;font-family:inherit}',
    '.bbd-close:hover{background:#EEF1F5}',
    '.bbd-sec{padding:0;border-bottom:1px solid #ECEFF3;background:#fff}',
    '.bbd-sec:last-child{border-bottom:none}',
    '.bbd-sec-title{height:38px;padding:0 16px;display:flex;align-items:center;background:#F5F6F8;color:#7D8796;font-size:12px;font-weight:800}',
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
    '.bbd-cs-actions button{height:34px;border:1px solid #d9e0e9;border-radius:5px;background:#fff;color:#1f2530;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer}',
    '.bbd-cs-actions button:first-child{border-color:#E8385A;background:#E8385A;color:#fff}',

    '.user-drawer-head{padding:38px 16px 12px;background:#fff8f5;border-bottom:1px solid #efe6e2}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{width:44px;height:44px;display:grid;place-items:center;flex:0 0 auto}',
    '.user-name-strong{display:block;color:#111827;font-size:16px;font-weight:500}',
    '.user-vip-chip{display:inline-flex;margin-top:5px;padding:2px 12px;border-radius:999px;background:var(--grade-vip);color:#fff;font-size:11px;font-weight:500}',
    '.user-vip-copy{margin:13px 0 4px;color:#E8385A;font-size:11px;font-weight:500}',
    '.user-vip-bar{height:5px;border-radius:999px;background:#eee2de;overflow:hidden}',
    '.user-vip-bar span{display:block;height:100%;background:#E8385A}',
    '.user-asset-box{display:grid;grid-template-columns:1fr 1fr;margin-top:12px;border:1px solid #D9E0E9;border-radius:8px;background:#fff;overflow:hidden}',
    '.user-asset-box div{padding:8px 12px;text-align:center}',
    '.user-asset-box div+div{border-left:1px solid #d9e0e9}',
    '.user-asset-box span{display:block;color:#a4acb8;font-size:10px;font-weight:500}',
    '.user-asset-box strong{display:block;color:#151b29;font-size:15px;font-weight:500}',
    '.user-status-grid{display:grid;grid-template-columns:repeat(3,1fr);border-bottom:1px solid #e5e7eb;background:#fff}',
    '.user-status-grid div{min-height:64px;display:grid;place-items:center;align-content:center;gap:4px;text-align:center}',
    '.user-status-grid div+div{border-left:1px solid #e5e7eb}',
    '.user-status-grid strong{color:#151b29;font-family:Roboto,sans-serif;font-size:22px;line-height:1;font-weight:500}',
    '.user-status-grid div:nth-child(2) strong{color:#E8385A}',
    '.user-status-grid span{color:#9aa3b2;font-size:10px;font-weight:500}',
    '.user-menu-list{padding:0 0 10px;background:#fff}',
    '.user-menu-item{min-height:46px;width:100%;padding:0 18px;display:flex;align-items:center;gap:12px;color:#1A1A2E;font-size:14px;font-weight:500;border:0;background:#fff;text-align:left;text-decoration:none;font-family:inherit;cursor:pointer}',
    '.user-menu-item:hover{background:#F9FAFB}',
    '.user-menu-icon,.bbu-emoji{width:20px;text-align:center;font-size:16px;color:#666680;flex:0 0 auto}',
    '.user-menu-item .chev{margin-left:auto;color:#a8b0bd;font-weight:500;font-size:15px;line-height:1}',
    '.user-menu-section{border-bottom:0}',
    '.user-menu-panel{display:none;padding:0 0 8px 52px}',
    '.user-menu-section.is-open .user-menu-panel{display:grid;gap:0}',
    '.user-menu-link{min-height:32px;display:flex;align-items:center;color:#666b75;font-size:13px;font-weight:500;text-decoration:none}',
    '.user-menu-link.danger{color:#8f949f}',
    '.user-menu-item.logout{margin-top:4px;border-top:1px solid #eee;color:#9aa3b2;font-weight:500}',
    '.new-n{color:#E8385A;font-family:Roboto,sans-serif;font-size:9px;font-weight:700;line-height:1;vertical-align:super;margin-left:2px}',

    /* -- 상단 스토어 채널 바 (모든 페이지 공통) -- */
    '.channel-bar{background:#fff;border-bottom:1px solid #E0E4EB;padding:14px 0}',
    '.channel-inner{max-width:1060px;margin:0 auto;padding:0;display:flex;align-items:center;gap:0}',
    '.channel-icons{display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:0;width:100%;min-width:0;flex:1 1 auto;margin:0;padding:0;border:1px solid #E0E4EB;border-radius:8px;overflow:hidden}',
    '.channel-icons::-webkit-scrollbar{display:none}',
    '.ch-icon-item{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:8px;padding:10px 5px;cursor:pointer;min-width:0;transition:background .15s;border-left:1px solid #E0E4EB;text-decoration:none}',
    '.ch-icon-item:first-child{border-left:0}',
    '.ch-icon-item:hover{background:#F5F7FA}',
    '.ch-circle{width:30px;height:30px;background:transparent;border:0;box-shadow:none;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}',
    '.ch-icon-item:hover .ch-circle{box-shadow:none}',
    '.ch-circle img{width:100%;height:100%;object-fit:contain}',
    '.ch-circle img.ch-logo{width:30px;height:30px;object-fit:contain;border-radius:0}',
    '.ch-label{font-size:13px;color:#1A1A2E;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
    '.ch-icon-item.active{background:#FFF5F7}',
    '.ch-circle.active{border:0;box-shadow:none}',
    '.ch-label.active{color:#E8385A;font-weight:700}',

    /* -- 서브/카테고리/통합검색 상단 스토어 바 (채널 바와 동일 모양) -- */
    '.store-strip{background:#fff;border-bottom:1px solid #E0E4EB;padding:14px 0;width:auto;overflow:visible}',
    '.store-list{max-width:1060px;width:100%;margin:0 auto;padding:0;box-sizing:border-box;display:grid;grid-template-columns:repeat(8,minmax(0,1fr));gap:0;border:1px solid #E0E4EB;border-radius:8px;overflow:hidden}',
    '.store-chip{display:flex;flex-direction:row;align-items:center;justify-content:center;gap:8px;padding:10px 5px;min-width:0;cursor:pointer;text-decoration:none;transition:background .15s;border-left:1px solid #E0E4EB}',
    '.store-chip:first-child{border-left:0}',
    '.store-chip:hover{opacity:1;background:#F5F7FA}',
    '.store-chip strong{font-size:13px;font-weight:700;color:#1A1A2E;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0}',
    '.store-badge{width:30px;height:30px;margin:0;border:0;background:transparent;box-shadow:none;display:flex;align-items:center;justify-content:center;overflow:hidden;flex:none}',
    '.store-chip:hover .store-badge,.store-chip.active .store-badge{border:0;box-shadow:none;transform:none}',
    '.store-badge img{width:30px;height:30px;object-fit:contain;border-radius:0}'
  ].join('\n');

  function headerHTML() {
    if (isLoggedIn()) {
      return (
        '<div class="bbh-hdr">' +
          '<button class="bbh-menu" type="button" aria-label="메뉴 열기" onclick="openDrawer()"><span></span><span></span><span></span></button>' +
          '<a href="web_main.html" class="bbh-logo"><img src="Bidbuy logo.png" alt="Bidbuy World Auction Agency"></a>' +
          '<form class="bbh-search" role="search" action="web_totalsearch.html" method="get"><input type="search" name="q" placeholder="키워드 또는 구매신청을 원하시는 URL을 입력해주세요" aria-label="검색어 입력"><button type="submit"><i class="fas fa-search"></i> <span>AI 검색</span></button></form>' +
          '<div class="bbh-right">' +
            '<button class="bbh-ibtn" type="button" aria-label="알림"><i class="far fa-bell"></i><span class="bbh-badge">3</span><span>알림</span></button>' +
            '<button class="bbh-ibtn" type="button" aria-label="장바구니"><i class="fas fa-shopping-cart"></i><span>장바구니</span></button>' +
            '<button class="bbh-ibtn" id="bbhUserTrig" type="button" aria-label="회원 메뉴" aria-haspopup="true" aria-expanded="false" onclick="toggleUserDrawer()"><i class="far fa-user"></i><span>마이페이지</span></button>' +
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
    { label: '라쿠텐',     barLabel: '일본 라쿠텐', logo: 'store_rakuten.png',        href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '라쿠마',     barLabel: '일본 라쿠마', logo: 'store_rakuma.png',         href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '야후쇼핑',   barLabel: '야후 쇼핑',   logo: 'store_yahoo_shopping.png', href: 'web_purchase_url.html',      barHref: 'web_sub_main.html' },
    { label: '야후프리마', barLabel: '야후 프리마', logo: 'store_yahoo_furima.png',   href: 'web_purchase_store.html',    barHref: 'web_sub_main.html' },
    { label: '미국이베이', barLabel: '미국 이베이', logo: 'store_ebay_us.png',        href: 'web_sub_main.html',          barHref: 'web_sub_main.html' },
    { label: '영국이베이', barLabel: '영국 이베이', logo: 'store_ebay_uk.png',        href: 'web_sub_main.html',          barHref: 'web_sub_main.html' }
  ];
  window.BB_STORES = STORES;
  window.BB_STORE_LOGO_DIR = STORE_LOGO_DIR;

  function storeChannelBarHTML() {
    return STORES.map(function (st) {
      return '<div class="ch-icon-item" style="cursor:pointer" onclick="location.href=' + "'" + st.barHref + "'" + '">' +
        '<div class="ch-circle"><img class="ch-logo" src="' + STORE_LOGO_DIR + st.logo + '" alt="' + st.barLabel + '"></div>' +
        '<span class="ch-label">' + st.barLabel + '</span>' +
      '</div>';
    }).join('');
  }

  function renderStoreChannelBar() {
    var host = document.querySelector('.channel-icons');
    if (host) host.innerHTML = storeChannelBarHTML();
  }

  function leftDrawerHTML() {
    var header = isLoggedIn()
      ? '<div id="drUserHd" class="bbd-head"><div class="bbd-user-mini"><div class="bbd-uav grade-img"><img class="grade-icon" src="gradeicon/grade_vip.png" alt="VIP 등급"></div><div><div class="bbd-uname">홍길동님</div><div class="bbd-ugrade">VIP 회원</div></div></div><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div>'
      : '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div><div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="doLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button">회원가입</button></div></div>';

    return (
      header +
      '<div class="bbd-sec"><div class="bbd-sec-title">빠른 메뉴</div><div class="bbd-quick">' +
        '<a class="bbd-quick-item" href="#"><span class="bbd-quick-icon"><i class="fas fa-calculator"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">비용 계산기</span><span class="bbd-quick-desc">예상 소요 비용 계산기</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="web_bundle_shipping_management.html"><span class="bbd-quick-icon"><i class="fas fa-box"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">입고/보관중인 물건 조회</span><span class="bbd-quick-desc">개인 입고 물품 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="web_bundle_shipping_management_2.html"><span class="bbd-quick-icon"><i class="fas fa-truck-fast"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">출고 배송중</span><span class="bbd-quick-desc">센터별 출고 일정 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">이용가이드</div><div class="bbd-guide-list">' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-book-open"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">경매대행 이용안내</span><span class="bbd-guide-desc">서비스 이용 절차 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-shopping-bag"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">구매대행 이용안내</span><span class="bbd-guide-desc">구매대행 진행 방식 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="web_cs_refund.html"><span class="bbd-guide-icon"><i class="fas fa-coins"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">수수료 및 관부가세</span><span class="bbd-guide-desc">예상 비용과 세금 안내</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec" style="border-bottom:none"><div class="bbd-sec-title">고객센터</div><div class="bbd-link-grid">' +
        '<a href="web_fakenotice.html">공지사항<sup class="new-n" aria-label="새 소식">N</sup></a><a href="web_qna.html">자주하는질문</a><a href="web_qna_form.html">1:1문의<sup class="new-n" aria-label="새 답변">N</sup></a><a href="web_qna.html">커뮤니티</a>' +
      '</div></div>' +
      '<div class="bbd-cs-card">' +
        '<div class="bbd-cs-tel">1544-5224</div>' +
        '<p class="bbd-cs-time">평일 AM 10:00 - PM 17:00 (점심 PM 12:30 - 13:30)</p>' +
        '<div class="bbd-cs-actions"><button type="button" onclick="location.href=\'web_qna.html\'">1:1 문의</button><button type="button" onclick="location.href=\'https://www.bidbuy.co.kr/cs/faq\'">FAQ</button><button type="button" onclick="location.href=\'https://www.bidbuy.co.kr/cs/notice\'">공지사항</button></div>' +
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
          '<div class="user-crown grade-img"><img class="grade-icon" src="gradeicon/grade_vip.png" alt="VIP 등급"></div>' +
          '<div><strong class="user-name-strong">홍길동님</strong><span class="user-vip-chip">VIP</span></div>' +
        '</div>' +
        '<p class="user-vip-copy">Prestige까지 80% 남음</p>' +
        '<div class="user-vip-bar"><span style="width:20%"></span></div>' +
        '<div class="user-asset-box"><div><span>마일리지</span><strong>4,500원</strong></div><div><span>예치금</span><strong>29,870원</strong></div></div>' +
      '</div>' +
      '<div class="user-status-grid"><div><strong>3</strong><span>입찰 진행 중</span></div><div><strong>1</strong><span>1차 결제 대기</span></div><div><strong>0</strong><span>2차 결제 대기</span></div></div>' +
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
        '<button class="user-menu-item logout" type="button" onclick="toggleLogin();closeUserDrawer()"><span class="user-menu-icon"><i class="fas fa-right-from-bracket" aria-hidden="true"></i></span><span>로그아웃</span></button>' +
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

  function render() {
    hydrateProductImages();
    removeNonMainNotice();
    renderStoreChannelBar();

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

    var leftOv = ensureNode('bbDrawerOv', 'div', 'bbd-ov');
    var left = ensureNode('bbDrawer', 'aside', 'bbd');
    var right = ensureNode('bbUserDrawer', 'aside', 'bbu');

    leftOv.onclick = closeDrawer;
    left.innerHTML = leftDrawerHTML();
    right.innerHTML = rightDrawerHTML();
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
  window.doLogin = function () {
    localStorage.setItem(LOGIN_KEY, '1');
    render();
  };
  window.doLogout = function () {
    localStorage.removeItem(LOGIN_KEY);
    closeUserDrawer();
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
    closeUserDrawer();
    document.getElementById('bbDrawerOv').classList.add('open');
    document.getElementById('bbDrawer').classList.add('open');
  };
  window.closeDrawer = closeDrawer;
  window.openUserDrawer = function () {
    if (!isLoggedIn()) return;
    closeDrawer();
    document.getElementById('bbUserDrawer').classList.add('open');
    var trig = document.getElementById('bbhUserTrig');
    if (trig) { trig.classList.add('open'); trig.setAttribute('aria-expanded', 'true'); }
  };
  window.closeUserDrawer = closeUserDrawer;
  window.toggleUserDrawer = function () {
    var right = document.getElementById('bbUserDrawer');
    if (right && right.classList.contains('open')) closeUserDrawer();
    else window.openUserDrawer();
  };

  function closeDrawer() {
    document.getElementById('bbDrawerOv')?.classList.remove('open');
    document.getElementById('bbDrawer')?.classList.remove('open');
  }

  function closeUserDrawer() {
    document.getElementById('bbUserDrawer')?.classList.remove('open');
    var trig = document.getElementById('bbhUserTrig');
    if (trig) { trig.classList.remove('open'); trig.setAttribute('aria-expanded', 'false'); }
  }

  document.addEventListener('click', function (e) {
    var right = document.getElementById('bbUserDrawer');
    var trig = document.getElementById('bbhUserTrig');
    if (!right || !right.classList.contains('open')) return;
    if (right.contains(e.target) || (trig && trig.contains(e.target))) return;
    closeUserDrawer();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeUserDrawer();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', render);
  } else {
    render();
  }
})();
