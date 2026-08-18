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
    '.bbh-user{display:flex;align-items:center;gap:8px;padding:6px 10px;border-radius:5px;cursor:pointer;border:none;background:none;font-family:inherit;transition:background .15s}',
    '.bbh-user:hover{background:#F5F7FA}',
    '.bbh-av{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:14px;font-weight:800;flex-shrink:0;box-shadow:0 4px 10px rgba(17,24,39,.12)}',
    '.bbh-av i{line-height:1}',
    '.bbh-av.standard{background:linear-gradient(135deg,#5F7EA6,#29496E)}',
    '.bbh-av.premium{background:linear-gradient(135deg,#F5A623,#E8385A)}',
    '.bbh-av.vip{background:linear-gradient(135deg,#8B5CF6,#1A3C6E)}',
    '.bbh-av.prestige{background:linear-gradient(135deg,#111827,#B58A44)}',
    '.bbh-nm{font-size:13px;font-weight:700;color:#1A1A2E;line-height:1.2;text-align:left;white-space:nowrap}',
    '.bbh-gr{display:inline-block;background:#FFF3E0;color:#F5A623;font-size:9px;font-weight:700;padding:1px 6px;border-radius:8px;margin-top:2px}',
    '.bbh-chev{margin-left:2px;font-size:11px;color:#9aa3b2;transition:transform .18s}',
    '.bbh-user.open .bbh-chev{transform:rotate(180deg)}',

    '.bbd-ov{position:fixed;inset:0;background:rgba(0,0,0,0);pointer-events:none;transition:background .3s;z-index:1000}',
    '.bbd-ov.open{background:rgba(0,0,0,.45);pointer-events:all}',
    '.bbd{position:fixed;top:0;bottom:0;left:-100%;width:88%;max-width:340px;z-index:1001;background:#fff;overflow-y:auto;scrollbar-width:none;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;font-size:14px;color:#1A1A2E;transition:left .3s cubic-bezier(.4,0,.2,1);display:flex;flex-direction:column;box-shadow:4px 0 20px rgba(0,0,0,.12)}',
    '.bbd::-webkit-scrollbar{display:none}',
    '.bbd.open{left:0}',
    '.bbu{position:fixed;top:64px;right:24px;width:320px;max-width:calc(100vw - 32px);max-height:calc(100vh - 88px);z-index:1002;background:linear-gradient(#FFF5F1 0 192px,#fff 192px 100%);overflow-y:auto;scrollbar-width:none;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;font-size:14px;color:#1A1A2E;border:1px solid #DDE3EB;border-radius:16px;box-shadow:0 18px 42px rgba(17,24,39,.16);opacity:0;visibility:hidden;transform:translateY(-8px);transition:opacity .18s ease,transform .18s ease,visibility .18s}',
    '.bbu::-webkit-scrollbar{display:none}',
    '.bbu.open{opacity:1;visibility:visible;transform:translateY(0)}',

    '.bbd-head{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;border-bottom:1px solid #ECEFF3;background:#fff}',
    '.bbd-user-mini{display:flex;align-items:center;gap:10px}',
    '.bbd-uav{width:38px;height:38px;border-radius:50%;background:#FFE7EF;color:#E8385A;display:grid;place-items:center;font-size:18px;font-weight:800}',
    '.bbd-uname{font-size:15px;font-weight:700;color:#1A1A2E}',
    '.bbd-ugrade{font-size:11px;color:#666680;margin-top:2px}',
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
    '.bbd-quick,.bbd-cat-list,.bbd-guide-list{display:flex;flex-direction:column;padding:6px 0}',
    '.bbd-quick-item,.bbd-cat-item,.bbd-guide-item{min-height:56px;display:flex;align-items:center;gap:14px;padding:8px 16px 8px 24px;color:#111827;cursor:pointer;text-decoration:none}',
    '.bbd-quick-icon,.bbd-guide-icon{width:22px;display:flex;align-items:center;justify-content:center;color:#000;font-size:16px;flex-shrink:0}',
    '.bbd-quick-text,.bbd-guide-text{display:flex;flex-direction:column;gap:2px;min-width:0;flex:1}',
    '.bbd-quick-label,.bbd-guide-label{font-size:15px;color:#111827;font-weight:700;line-height:1.2}',
    '.bbd-quick-desc,.bbd-guide-desc{font-size:11px;color:#8B94A3;font-weight:500;line-height:1.25}',
    '.bbd-cat-flag{width:20px;flex-shrink:0;color:#000;font-size:12px;font-weight:700;text-align:left}',
    '.bbd-cat-label{flex:1;color:#111827;font-size:15px;font-weight:700}',
    '.bbd-cat-arrow{font-size:12px;color:#999BAA}',
    '.bbd-cat-group{border-bottom:1px solid #F0F2F5}',
    '.bbd-cat-group:last-child{border-bottom:none}',
    'button.bbd-cat-item{width:100%;border:0;background:#fff;font-family:inherit;text-align:left}',
    '.bbd-cat-item:hover{background:#FAFBFC}',
    '.bbd-cat-group.is-open>.bbd-cat-item{background:#FFF8F5;color:#E8385A}',
    '.bbd-cat-group.is-open .bbd-cat-label{color:#E8385A}',
    '.bbd-cat-group.is-open .bbd-cat-arrow{transform:rotate(90deg);color:#E8385A}',
    '.bbd-store-cats{display:none;flex-direction:column;padding:2px 16px 14px 58px;background:#FFFDFB}',
    '.bbd-cat-group.is-open .bbd-store-cats{display:flex}',
    '.bbd-store-cat{min-height:32px;display:flex;align-items:center;color:#555E6D;font-size:13px;font-weight:600;text-decoration:none;line-height:1.3}',
    '.bbd-store-cat:hover{color:#E8385A;text-decoration:underline}',
    '.bbd-link-grid{display:grid;grid-template-columns:repeat(2,1fr);row-gap:14px;column-gap:24px;padding:14px 16px}',
    '.bbd-link-grid a{font-size:14px;color:#666680;text-decoration:none}',
    '.bbd-cs-card{margin:5px 5px 5px;padding:18px 14px;background:#fcfcfd;text-align:center}',
    '.bbd-cs-actions{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;max-width:240px;margin:0 auto}',
    '.bbd-cs-actions button{height:39px;border:1px solid #d9e0e9;border-radius:5px;background:#fff;color:#1f2530;font-size:12px;font-weight:700;font-family:inherit;cursor:pointer}',
    '.bbd-cs-actions button:first-child{border-color:#E8385A;background:#E8385A;color:#fff}',

    '.user-drawer-head{padding:18px 16px 12px;background:#fff8f5;border-bottom:1px solid #efe6e2}',
    '.user-member-row{display:flex;align-items:center;gap:12px}',
    '.user-crown{width:44px;height:44px;display:grid;place-items:center;border-radius:50%;background:#ffe6ef;font-size:22px;flex:0 0 auto;color:#E8385A}',
    '.user-name-strong{display:block;color:#111827;font-size:16px;font-weight:500}',
    '.user-vip-chip{display:inline-flex;margin-top:5px;padding:2px 12px;border-radius:999px;background:#E8385A;color:#fff;font-size:11px;font-weight:500}',
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
    '.new-n{color:#E8385A;font-family:Roboto,sans-serif;font-size:9px;font-weight:700;line-height:1;vertical-align:super;margin-left:2px}'
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
            '<button class="bbh-user" id="bbhUserTrig" type="button" aria-label="회원 메뉴" aria-haspopup="true" aria-expanded="false" onclick="toggleUserDrawer()"><span class="bbh-av premium" aria-label="PREMIUM 등급"><i class="fas fa-gem" aria-hidden="true"></i></span><span><span class="bbh-nm">홍길동님</span><br><span class="bbh-gr">PREMIUM</span></span><i class="fas fa-chevron-down bbh-chev" aria-hidden="true"></i></button>' +
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

  var CATEGORY_MAIN_PAGE = 'web_category_main.html';

  function storeCategoryHTML(flag, label, href, open) {
    var groups = STORE_CATEGORIES[label] || [];
    var linksHtml = groups.map(function (group) {
      var groupPath = group.title;
      var groupHref = CATEGORY_MAIN_PAGE + '?store=' + encodeURIComponent(label) + '&category=' + encodeURIComponent(group.title) + '&path=' + encodeURIComponent(groupPath);
      var groupLink = '<a class="bbd-store-cat" href="' + groupHref + '">' + group.title + '</a>';
      var subLinks = group.subs.map(function (cat) {
        var catPath = group.title + '>' + cat;
        var catHref = CATEGORY_MAIN_PAGE + '?store=' + encodeURIComponent(label) + '&category=' + encodeURIComponent(cat) + '&path=' + encodeURIComponent(catPath);
        return '<a class="bbd-store-cat" href="' + catHref + '">' + cat + '</a>';
      }).join('');
      return groupLink + subLinks;
    }).join('');
    return (
      '<div class="bbd-cat-group' + (open ? ' is-open' : '') + '">' +
        '<button class="bbd-cat-item" type="button" aria-expanded="' + (open ? 'true' : 'false') + '" onclick="toggleDrawerStoreCategory(this)"><span class="bbd-cat-flag">' + flag + '</span><span class="bbd-cat-label">' + label + '</span><i class="fas fa-chevron-right bbd-cat-arrow"></i></button>' +
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
      : '<div id="drGuestHd" class="bbd-head"><span></span><button class="bbd-close" type="button" aria-label="메뉴 닫기" onclick="closeDrawer()">×</button></div><div id="drGuestPanel" class="bbd-guest-card"><div class="bbd-guest-title">비드바이 로그인</div><div class="bbd-guest-copy">로그인하고 입찰 현황, 마일리지, 관심 상품을 빠르게 확인하세요.</div><div class="bbd-login-actions"><button class="bbd-action-btn" type="button" onclick="doLogin();closeDrawer()">로그인</button><button class="bbd-action-btn secondary" type="button">회원가입</button></div></div>';

    return (
      header +
      '<div class="bbd-sec"><div class="bbd-sec-title">빠른 메뉴</div><div class="bbd-quick">' +
        '<a class="bbd-quick-item" href="#"><span class="bbd-quick-icon"><i class="fas fa-calculator"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">비용 계산기</span><span class="bbd-quick-desc">예상 소요 비용 계산기</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="web_bundle_shipping_management.html"><span class="bbd-quick-icon"><i class="fas fa-box"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">입고/보관중인 물건 조회</span><span class="bbd-quick-desc">개인 입고 물품 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-quick-item" href="web_bundle_shipping_management_2.html"><span class="bbd-quick-icon"><i class="fas fa-truck-fast"></i></span><span class="bbd-quick-text"><span class="bbd-quick-label">출고 배송중</span><span class="bbd-quick-desc">센터별 출고 일정 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">카테고리</div><div class="bbd-cat-list">' +
        storeCategoryHTML('JP', '야후옥션', 'web_sub_main.html') +
        storeCategoryHTML('M', '메루카리', 'web_purchase_merukari.html') +
        storeCategoryHTML('RA', '라쿠텐', 'web_purchase_store.html') +
        storeCategoryHTML('JP', '야후쇼핑', 'web_purchase_url.html') +
        storeCategoryHTML('MA', '라쿠마', 'web_purchase_store.html') +
        storeCategoryHTML('US', '미국이베이', 'web_sub_main.html') +
        storeCategoryHTML('UK', '영국이베이', 'web_sub_main.html') +
      '</div></div>' +
      '<div class="bbd-sec"><div class="bbd-sec-title">이용가이드</div><div class="bbd-guide-list">' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-book-open"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">경매대행 이용안내</span><span class="bbd-guide-desc">서비스 이용 절차 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-shopping-bag"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">구매대행 이용안내</span><span class="bbd-guide-desc">구매대행 진행 방식 확인</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
        '<a class="bbd-guide-item" href="#"><span class="bbd-guide-icon"><i class="fas fa-coins"></i></span><span class="bbd-guide-text"><span class="bbd-guide-label">수수료 및 관부가세</span><span class="bbd-guide-desc">예상 비용과 세금 안내</span></span><i class="fas fa-chevron-right bbd-cat-arrow"></i></a>' +
      '</div></div>' +
      '<div class="bbd-sec" style="border-bottom:none"><div class="bbd-sec-title">고객센터</div><div class="bbd-link-grid"><a href="#">공지사항<sup class="new-n" aria-label="새 소식">N</sup></a><a href="#">자주하는질문</a><a href="web_qna_form.html">1:1문의<sup class="new-n" aria-label="새 답변">N</sup></a><a href="#">커뮤니티</a></div></div>' +
      '<div class="bbd-cs-card"><div class="bbd-cs-actions"><button type="button" onclick="doLogout()">로그아웃</button><button type="button" onclick="location.href=\'https://www.bidbuy.co.kr/cs\'">FAQ</button></div></div>' +
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

    var leftOv = ensureNode('bbDrawerOv', 'div', 'bbd-ov');
    var left = ensureNode('bbDrawer', 'aside', 'bbd');
    var right = ensureNode('bbUserDrawer', 'aside', 'bbu');

    leftOv.onclick = closeDrawer;
    left.innerHTML = leftDrawerHTML();
    right.innerHTML = rightDrawerHTML();
    bindUserMenu();

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
