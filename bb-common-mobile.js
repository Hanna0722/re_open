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
    '.bbd-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;border-bottom:1px solid #ECEFF3;background:#fff}',
    '.bbd-user-mini{display:flex;align-items:center;gap:10px}',
    '.bbd-uav{width:38px;height:38px;border-radius:50%;background:#E4E9EF;color:#1f477d;display:grid;place-items:center;font-size:18px;font-weight:700}',
    '.bbd-uname{font-size:15px;font-weight:700;color:#1A1A2E}',
    '.bbd-ugrade{font-size:11px;color:#666680;margin-top:2px}',
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
    '.bbd-quick,.bbd-cat-list,.bbd-guide-list{display:flex;flex-direction:column;padding:6px 0}',
    '.bbd-quick-item,.bbd-cat-item,.bbd-guide-item{min-height:56px;display:flex;align-items:center;gap:14px;padding:8px 16px 8px 24px;color:#111827;cursor:pointer;text-decoration:none}',
    '.bbd-quick-icon,.bbd-guide-icon{width:22px;display:flex;align-items:center;justify-content:center;color:#000;font-size:16px;flex-shrink:0}',
    '.bbd-quick-text,.bbd-guide-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}',
    '.bbd-quick-label,.bbd-guide-label{font-size:15px;color:#111827;font-weight:700;line-height:1.2}',
    '.bbd-quick-desc,.bbd-guide-desc{font-size:11px;color:#8B94A3;font-weight:500;line-height:1.25}',
    '.bbd-cat-flag{width:38px;height:38px;flex-shrink:0;display:flex;align-items:center;justify-content:center;border:1px solid #E6EAF0;border-radius:50%;background:#fff;color:#000;font-size:12px;font-weight:700;text-align:center;box-shadow:0 2px 8px rgba(17,24,39,.05)}',
    '.bbd-cat-flag img{width:24px;height:24px;border-radius:50%;object-fit:contain;display:block}',
    '.bbd-cat-label{flex:1;color:#111827;font-size:15px;font-weight:700}',
    '.bbd-cat-arrow{font-size:12px;color:#999BAA}',
    '.bbd-cat-group{border-bottom:1px solid #F0F2F5}',
    '.bbd-cat-group:last-child{border-bottom:none}',
    'button.bbd-cat-item{width:100%;border:0;background:#fff;font-family:inherit;text-align:left}',
    '.bbd-cat-item:hover{background:#FAFBFC}',
    '.bbd-cat-group.is-open>.bbd-cat-item{background:#FFF8F5;color:#E8385A}',
    '.bbd-cat-group.is-open .bbd-cat-label{color:#E8385A}',
    '.bbd-cat-group.is-open .bbd-cat-arrow{transform:rotate(90deg);color:#E8385A}',
    '.bbd-store-cats{display:none;flex-direction:column;padding:2px 16px 14px 72px;background:#FFFDFB}',
    '.bbd-cat-group.is-open .bbd-store-cats{display:flex}',
    '.bbd-store-cat{min-height:32px;display:flex;align-items:center;color:#555E6D;font-size:13px;font-weight:600;text-decoration:none;line-height:1.3}',
    '.bbd-store-cat:hover{color:#E8385A;text-decoration:underline}',
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
    '.bbu-avatar{width:50px;height:50px;flex:0 0 auto;display:grid;place-items:center;border-radius:50%;color:#fff;font-size:20px;font-weight:700;box-shadow:0 8px 18px rgba(17,24,39,.14)}',
    '.bbu-avatar i{line-height:1}',
    '.bbu-avatar.standard,.m-user-avatar.standard,.user-avatar-sm.standard{background:#D4891A}',
    '.bbu-avatar.premium,.m-user-avatar.premium,.user-avatar-sm.premium{background:#1f477d}',
    '.bbu-avatar.vip,.m-user-avatar.vip,.user-avatar-sm.vip{background:#3AAD4E}',
    '.bbu-avatar.prestige,.m-user-avatar.prestige,.user-avatar-sm.prestige{background:#E8385A}',
    '.m-user-avatar,.user-avatar-sm{width:30px;height:30px;flex:0 0 auto;border-radius:50%;display:grid;place-items:center;color:#fff;font-size:12px;font-weight:700;border:0;cursor:pointer;font-family:inherit}',
    '.m-user-avatar i,.user-avatar-sm i{line-height:1}',
    '.user-drawer-head{padding:18px 14px 12px;background:#fff8f5;border-bottom:1px solid #efe6e2}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{width:48px;height:48px;display:grid;place-items:center;border-radius:50%;background:#ffe6ef;font-size:26px;flex:0 0 auto;color:var(--rose,#E8385A)}',
    '.user-name-strong{display:block;color:#111827;font-size:18px;font-weight:500}',
    '.user-vip-chip{display:inline-flex;margin-top:5px;padding:2px 12px;border-radius:999px;background:var(--rose,#E8385A);color:#fff;font-size:11px;font-weight:500}',
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

  var STORE_CATEGORIES = {
    '야후옥션': [
      { title: '컴퓨터', subs: ['디지털카메라', '가전/AV/카메라부품', '마사지기/마사지용품', '장난감/게임'] },
      { title: '유아용품', subs: ['생활/인테리어', '뷰티/건강관리', '책/잡지', '음악'] },
      { title: '패션', subs: ['남성패션', '여성패션', '남성신발', '여성신발'] },
      { title: '앤틱/컬렉션', subs: ['피규어', '탤런트상품', '사무/점포용품', '비디오게임기'] },
      { title: '취미/문화', subs: ['코믹/애니메이션', '액세서리/시계', '영화/비디오', '스포츠/레저'] },
      { title: '타이어/휠', subs: ['자동차용품', '오토바이용품', '공구', '기타'] }
    ],
    '메루카리': [
      { title: '레이디스', subs: ['원피스', '아우터', '가방', '신발'] },
      { title: '멘즈', subs: ['상의', '하의', '시계', '신발'] },
      { title: '키즈/베이비', subs: ['유아복', '완구', '유모차', '기저귀'] },
      { title: '뷰티/코스메틱', subs: ['스킨케어', '메이크업', '헤어케어', '향수'] },
      { title: '취미/오락', subs: ['피규어', '트레이딩카드', '악기', '게임'] },
      { title: '가전/스마트기기', subs: ['카메라', '노트북', '스마트폰', '생활가전'] }
    ],
    '라쿠텐': [
      { title: '식품', subs: ['과자/스낵', '음료', '건강식품', '조미료'] },
      { title: '패션', subs: ['여성의류', '남성의류', '가방/잡화', '신발'] },
      { title: '가전', subs: ['TV/영상', '생활가전', '주방가전', '계절가전'] },
      { title: '인테리어/생활', subs: ['가구', '침구', '수납/정리', '주방용품'] },
      { title: '스포츠/아웃도어', subs: ['캠핑', '자전거', '피트니스', '낚시'] },
      { title: '취미/완구', subs: ['프라모델', '보드게임', '악기', '수집품'] }
    ],
    '야후쇼핑': [
      { title: '가전/PC', subs: ['TV/영상기기', '노트북', '주변기기', '생활가전'] },
      { title: '패션', subs: ['여성패션', '남성패션', '가방/잡화', '시계'] },
      { title: '식품/음료', subs: ['과자', '주류', '건강식품', '생수/음료'] },
      { title: '뷰티/헬스', subs: ['스킨케어', '메이크업', '헬스용품', '의료기기'] },
      { title: '스포츠/레저', subs: ['골프', '캠핑', '자전거', '낚시'] },
      { title: '유아/반려동물', subs: ['유아용품', '완구', '강아지용품', '고양이용품'] }
    ],
    '야후프리마': [
      { title: '여성 패션', subs: ['원피스', '아우터', '가방', '신발'] },
      { title: '남성 패션', subs: ['상의', '팬츠', '스니커즈', '시계'] },
      { title: '취미/컬렉션', subs: ['피규어', '트레이딩카드', '굿즈', '게임'] },
      { title: '디지털/가전', subs: ['스마트폰', '이어폰', '카메라', '게임기'] },
      { title: '뷰티/생활', subs: ['화장품', '향수', '인테리어소품', '주방용품'] },
      { title: '키즈/베이비', subs: ['아동복', '장난감', '유모차', '육아용품'] }
    ],
    '라쿠마': [
      { title: '여성패션', subs: ['원피스', '아우터', '스커트', '가방'] },
      { title: '남성패션', subs: ['상의', '하의', '아우터', '신발'] },
      { title: '뷰티', subs: ['스킨케어', '메이크업', '헤어/바디', '향수'] },
      { title: '잡화/액세서리', subs: ['가방', '지갑', '시계', '주얼리'] },
      { title: '취미/엔터', subs: ['CD/DVD', '서적', '피규어', '게임'] },
      { title: '스포츠/기타', subs: ['골프용품', '캠핑용품', '자전거', '기타'] }
    ],
    '미국이베이': [
      { title: '전자기기', subs: ['스마트폰', '노트북', '카메라', '오디오'] },
      { title: '컬렉터블/아트', subs: ['빈티지', '아트/포스터', '동전/우표', '트레이딩카드'] },
      { title: '패션', subs: ['여성의류', '남성의류', '신발', '가방'] },
      { title: '홈/가든', subs: ['가구', '주방용품', '원예', '조명'] },
      { title: '토이/하비', subs: ['액션피규어', '모형/프라모델', '보드게임', 'RC/드론'] },
      { title: '자동차용품', subs: ['자동차부품', '오토바이부품', '타이어/휠', '공구'] }
    ],
    '영국이베이': [
      { title: '전자기기', subs: ['스마트폰', '노트북', '카메라', '게임기'] },
      { title: '패션', subs: ['여성의류', '남성의류', '신발', '액세서리'] },
      { title: '컬렉터블', subs: ['빈티지', '동전/우표', '피규어', '아트'] },
      { title: '홈/가든', subs: ['가구', '침구', '원예', '조명'] },
      { title: '스포츠용품', subs: ['축구', '피트니스', '캠핑', '사이클링'] },
      { title: '자동차용품', subs: ['자동차부품', '오토바이', '타이어', '공구'] }
    ]
  };

  /* -- 스토어 단일 목록 --------------------------------------------
     로고 교체: images/icon/store/_src/ 안의 파일만 바꾸면
     좌측 드로어에 그대로 반영된다.
     스토어 추가/삭제/순서변경도 이 배열만 수정한다.                */
  var STORE_LOGO_DIR = '../images/icon/store/_src/';
  var STORES = [
    { label: '야후옥션',   logo: 'store_yahoo_auction.png',  href: 'mobile_sub_main.html' },
    { label: '메루카리',   logo: 'store_mercari.png',        href: 'mobile_purchase_merukari.html' },
    { label: '라쿠텐',     logo: 'store_rakuten.png',        href: 'mobile_purchase_store.html' },
    { label: '라쿠마',     logo: 'store_rakuma.png',         href: 'mobile_purchase_store.html' },
    { label: '야후쇼핑',   logo: 'store_yahoo_shopping.png', href: 'mobile_purchase_url.html' },
    { label: '야후프리마', logo: 'store_yahoo_furima.png',   href: 'mobile_purchase_store.html' },
    { label: '미국이베이', logo: 'store_ebay_us.png',        href: 'mobile_sub_main.html' },
    { label: '영국이베이', logo: 'store_ebay_uk.png',        href: 'mobile_sub_main.html' }
  ];
  window.BB_STORES = STORES;
  window.BB_STORE_LOGO_DIR = STORE_LOGO_DIR;

  var CATEGORY_MAIN_PAGE = 'mobile_category_main.html';

  function storeCategoryHTML(store, open) {
    var label = store.label;
    var href = store.href;
    var groups = STORE_CATEGORIES[label] || [];
    var flatCats = [];
    groups.forEach(function (g) {
      flatCats.push(g.title);
      flatCats = flatCats.concat(g.subs);
    });
    var linksHtml = flatCats.map(function (cat) {
      var catHref = CATEGORY_MAIN_PAGE + '?store=' + encodeURIComponent(label) + '&category=' + encodeURIComponent(cat);
      return '<a class="bbd-store-cat" href="' + catHref + '">' + cat + '</a>';
    }).join('');
    return (
      '<div class="bbd-cat-group' + (open ? ' is-open' : '') + '">' +
        '<button class="bbd-cat-item" type="button" aria-expanded="' + (open ? 'true' : 'false') + '" onclick="toggleDrawerStoreCategory(this)"><span class="bbd-cat-flag"><img src="' + STORE_LOGO_DIR + store.logo + '" alt=""></span><span class="bbd-cat-label">' + label + '</span><i class="fas fa-chevron-right bbd-cat-arrow"></i></button>' +
        '<div class="bbd-store-cats">' +
          '<a class="bbd-store-cat" href="' + href + '">전체보기</a>' +
          linksHtml +
        '</div>' +
      '</div>'
    );
  }

  function leftDrawerHTML() {
    var header = isLoggedIn()
      ? '<div id="drUserHd" class="bbd-head"><div class="bbd-user-mini"><div class="bbd-uav"><i class="fas fa-crown" aria-hidden="true"></i></div><div><div class="bbd-uname">홍길동님</div><div class="bbd-ugrade">PREMIUM 회원</div></div></div><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div>'
      : '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div><div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="toggleLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button" onclick="location.href=\'mobile_index.html\'">회원가입</button></div></div>';

    return (
      header +
      '<div class="bbd-sec"><div class="bbd-sec-title">빠른 메뉴</div><div class="bbd-quick">' +
        '<a class="bbd-quick-item" href="#"><span class="bbd-quick-icon"><i class="fas fa-calculator"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">비용 계산기</span><span class="bbd-quick-desc">예상 소요 비용 계산기</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="mobile_bundle_shipping_management.html"><span class="bbd-quick-icon"><i class="fas fa-box"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">입고/보관중인 물건 조회</span><span class="bbd-quick-desc">개인 입고 물품 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="mobile_bundle_shipping_management_2.html"><span class="bbd-quick-icon"><i class="fas fa-truck-fast"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">출고 배송중</span><span class="bbd-quick-desc">센터별 출고 일정 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">카테고리</div><div class="bbd-cat-list">' +
        STORES.map(function (st) { return storeCategoryHTML(st); }).join('') +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">이용가이드</div><div class="bbd-guide-list">' +
        '<a class="bbd-guide-item" href="mobile_fakenotice.html"><span class="bbd-guide-icon"><i class="fas fa-book-open"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">경매대행 이용안내</span><span class="bbd-guide-desc">서비스 이용 절차 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="mobile_fakenotice.html"><span class="bbd-guide-icon"><i class="fas fa-shopping-bag"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">구매대행 이용안내</span><span class="bbd-guide-desc">구매대행 진행 방식 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
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
          '<div class="user-crown"><i class="fas fa-crown" aria-hidden="true"></i></div>' +
          '<div><strong class="user-name-strong">홍길동님</strong><span class="user-vip-chip">PREMIUM</span></div>' +
        '</div>' +
        '<p class="user-vip-copy">일반회원까지 80% 남음</p>' +
        '<div class="user-vip-bar"><span style="width:20%"></span></div>' +
        '<div class="user-asset-box"><div><span>마일리지</span><strong>4,500원</strong></div><div><span>예치금</span><strong>29,870원</strong></div></div>' +
      '</div>' +
      '<div class="user-status-grid"><div><strong>3</strong><span>입찰 진행 중</span></div><div><strong>1</strong><span>1차 결제 대기</span></div><div><strong>0</strong><span>2차 결제 대기</span></div></div>' +
      '<nav class="user-menu-list">' +
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
          '<button class="user-avatar-sm premium" type="button" aria-label="PREMIUM 등급 회원 메뉴" onclick="openUserDrawer()"><i class="fa-solid fa-gem" aria-hidden="true"></i></button>' +
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
      el.querySelectorAll('.slide-fade-wrap').forEach(function (node) { preserved.push(node); });
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

  // 우측 상단 회원 아이콘(회원 메뉴)에 우측 드로어 오픈을 자동으로 연결한다.
  // 페이지마다 onclick이 없거나("," alert 같은 미구현 placeholder여도) 여기서
  // 무조건 실제 동작으로 덮어써서 모든 페이지에서 동일하게 열리도록 한다.
  function bindAvatarTrigger() {
    document.querySelectorAll('[aria-label="회원 메뉴"], [aria-label="PREMIUM 등급 회원 메뉴"]').forEach(function (btn) {
      if (btn.classList.contains('m-user-avatar') || btn.classList.contains('user-avatar-sm')) {
        btn.classList.add('premium');
        btn.setAttribute('aria-label', 'PREMIUM 등급 회원 메뉴');
        btn.innerHTML = '<i class="fas fa-gem" aria-hidden="true"></i>';
      }
      btn.onclick = function (e) {
        e.preventDefault();
        openUserDrawer();
      };
    });
  }

  function render() {
    removeNonMainNotice();

    if (SHELL_MODE === 'status-only') {
      injectStatusStyles();
      injectPhoneStatusBar();
      pinPhoneStatusBar();
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
  window.toggleDrawerStoreCategory = function (btn) {
    var group = btn.closest('.bbd-cat-group');
    var list = btn.closest('.bbd-cat-list');
    if (!group || !list) return;
    var willOpen = !group.classList.contains('is-open');
    list.querySelectorAll('.bbd-cat-group').forEach(function (item) {
      item.classList.remove('is-open');
      var itemBtn = item.querySelector('.bbd-cat-item');
      if (itemBtn) itemBtn.setAttribute('aria-expanded', 'false');
    });
    if (willOpen) {
      group.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
    }
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
