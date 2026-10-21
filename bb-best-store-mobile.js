/* ============================================================
   2025 Yahoo 베스트 스토어 입구 페이지 — 모바일
   - 데이터는 아래 STORES(스토어 정보) / TOP / GROUPS(부문별 1~3위) 에서만 교체한다.
   - 출처: Yahoo!オークション ベストストアアワード2025 (https://auctions.yahoo.co.jp/topic/promo/beststore/)
     구조는 원문과 같다: 그룹(패션 등) > 부문(여성패션 등) > 1~3위
   - 설명(desc)은 한국어 요약. 설명이 없는 스토어는 플레이스홀더.
   - company: 운영사(원문 표기). 있는 스토어만 표시.
   - 출품자 평가 수치(평가수, 긍정 비율)는 화면에 표시하지 않는다.
   - 스토어 상품(출품자의 다른 상품): 평가 줄 아래에 6개. 화면에 보일 때 불러온다(지연 로딩).
     개발 연동: window.BB_STORE_PRODUCTS = function (sellerId, count) { return Promise<[{ title, price, buyNow, remain, bids, image, url }]> }
     (정의돼 있지 않으면 화면 확인용 샘플 상품을 만든다. 샘플은 오픈 전 반드시 연동으로 교체)
   - 스토어 이미지(썸네일)는 저작권/사용 문제로 사용하지 않는다. 스토어명 텍스트로만 표시.
   - url: STORE_LIST_PAGE 로 임시 연결 (스토어 상품 목록 페이지가 생기면 교체)
   - 측정: best_store_click (module=best_store_page, type=store|category_best, label, position)
     label 은 top1~top5, <부문id>_<순위> 고정 문자열
   ============================================================ */
(function () {
  var MODULE = 'best_store_page';
  var SOURCE_URL = 'https://auctions.yahoo.co.jp/topic/promo/beststore/';
  var DESC_TBD = '[대표 상품군 한 줄 설명]';
  /* 스토어명 클릭 이동 대상. 임시로 야후 옥션 상품 목록 페이지(카테고리 목록 화면)로 연결한다.
     TODO: 실제 스토어 상품 목록 URL(출품자 고유ID 기반)로 교체 */
  var STORE_LIST_PAGE = 'mobile_category_main.html';
  var PRODUCT_PAGE = 'mobile_auction.html'; /* 상품 상세(임시). 연동 시 상품 url 사용 */
  var PRODUCT_COUNT = 6;
  var MOBILE_VISIBLE_CATS = 2; /* 모바일에서 그룹별로 먼저 보이는 부문 수 (나머지는 더보기) */


  function s(name, desc, stats) {
    stats = stats || {};
    return { name: name, desc: desc, sellerId: stats.sellerId, company: stats.company, url: STORE_LIST_PAGE + '?store=' + encodeURIComponent('야후 옥션') };
  }

  /* 스토어 정보 (여러 부문에 나오는 스토어는 한 번만 적는다) */
  var STORES = {
    rere: s('ReRe', 'PC·철도모형·악기·가구 중고 종합 리유스', { company: '株式会社マーケットエンタープライズ', sellerId: '8GwLRLXmNdYJGMv671M4xRrPGf8nu' }),
    playmart: s('PLAYMART', '중고 오디오 앰프·스피커, 관악기·전자악기 전문', { company: 'UNI SOUND株式会社' }),
    bookoff: s('ブックオフ', '중고 책·만화·DVD, 프라모델 등 북오프 출품', { company: 'ブックオフコーポレーション株式会社' }),
    toyking: s('トイズキング', '건담 메탈빌드·건프라, 피규어 1엔 출품', { company: '有限会社ヤマト' }),
    secondst: s('セカンドストリート', '세컨스트리트 중고 의류, 스니커즈·아우터', { company: '株式会社セカンドストリート' }),
    vector: s('ベクトル', '레이디스 중심 중고 브랜드 의류·잡화'),
    brandear: s('ブランディア', '페라가모·로에베 등 중고 명품 가방·의류'),
    realclo: s('リアクロ', '발렌시아가·조던 등 스트리트 명품과 지포'),
    pleasure: s('pleasure', '지방시 빈티지 액세서리, 명품 가방 1엔 출품'),
    empower: s('エンパワー', '구찌·디올 중고 지갑, 액세서리·라이터'),
    komehyo: s('KOMEHYO', '코메효 중고 주얼리, 명품 의류·카메라 렌즈', { company: '株式会社コメ兵' }),
    heiwaya: s('平和屋', DESC_TBD),
    wayukan: s('和遊館', DESC_TBD),
    byset: s('バイセル', DESC_TBD),
    otakaraya: s('おたからや', '기념주화·프리미엄 지폐, 주얼리 묶음 매입품'),
    jewelrykiwami: s('ジュエリー極', '천연 보석 반지와 쉘 카메오 1엔 출품'),
    ecoplan: s('ecoプラン', '롤렉스·오메가 등 중고 시계 1엔 스타트'),
    closer: s('CLOSER', '오메가·IWC 등 중고 기계식 시계 전문'),
    quickdo: s('クイックドウ', '맥북·철도모형·명품 등 위탁 대행 종합 출품'),
    west: s('ウエスト', '아큐페이즈·B&W 등 하이엔드 중고 오디오'),
    fukuchan: s('福ちゃん', '매입 전문업체 후쿠짱 야후옥션점'),
    murakame: s('むらかめ', '니콘·캐논 중고 카메라, 렌즈·액세서리 전문', { company: '株式会社FiVELL' }),
    yokogawa: s('横河レンタ・リース', '렌탈 반환 법인용 중고 노트북 1엔 시작'),
    netoff: s('ネットオフ', 'OS 미탑재 중고 노트북·데스크톱 PC'),
    joshin: s('Joshin中古', '아이폰·픽셀 등 중고 스마트폰 1엔 시작'),
    keitai: s('携帯販売Link', 'SIM프리 아이폰8, 맥북 에어 중고 단말'),
    wave: s('ウェイブ', '시마노·다이와 중고 릴·낚싯대 전문'),
    valley: s('ValleyWorks', '로드바이크 중고 프레임, 시마노 부품'),
    cycleparadise: s('サイクルパラダイス', '자전거 부품에 캠핑·의류까지 중고 종합'),
    golfpartner: s('ゴルフパートナー', '중고 골프 전문 체인 골프파트너 야후옥션점'),
    gdo: s('GDOゴルフ', '핑·타이틀리스트 등 중고 골프클럽·샤프트'),
    golfconcept: s('ゴルフ コンセプト', '최신 신품 골프클럽, 웨지·퍼터 판매'),
    tirevalue: s('タイヤバリュー', '최신 연식 신품 수입 타이어 세트'),
    tread: s('トレッド', '브리지스톤 신품·중고 타이어와 휠 세트'),
    autoway: s('AUTOWAY', '미네르바·난캉 등 신품 수입 타이어 특가'),
    gekiyasu: s('激安魔王', '토요타 순정·튜닝 중고 자동차 부품'),
    upj: s('UPJ.Parts', '알파드 등 해체차 중고 순정 부품'),
    nrs: s('NRS セレクト', '블리츠·HKS 등 애프터마켓 튜닝 파츠', { company: '有限会社エヌアールエス' }),
    motobox: s('MOTO BOX', '바이크 중고 순정 부품, 정비 특수공구', { company: '株式会社モトボックス' }),
    raoh: s('ガレージラオウ', '가와사키·스즈키 중고 바이크 해체 부품', { company: '株式会社ラオウモータース' }),
    toyo: s('東洋オークション', 'Z1·CB750 등 구형 바이크 당시 순정 파츠', { company: '株式会社東洋モーターインターナショナル' }),
    iris: s('アイリスフローリスタ', '파키푸스·그라킬리스 등 괴근식물 생체'),
    cherrys: s('チェリーズマーケット', '카시나·심몬스 등 전시품 가구·조명'),
    classdesign: s('CLASS DESIGN INF.', '아르플렉스·몰테니 등 디자이너 가구·조명'),
    tooloff: s('TOOL OFF', '마키타 전동공구·수공구, 산업기기 미사용품'),
    link: s('リンク WEB SHOP', '트랙터·관리기, 농기구 중고 부품'),
    acttool: s('アクトツール', '마키타·보쉬 전동공구 1,000엔 스타트'),
    denno: s('電脳遊幻組', '무선기·레트로 게임기, 아케이드 기판·RC'),
    chuya: s('chuya-online', '기타·드럼 액세서리, 중고 이펙터·심벌'),
    ella: s('ELLA RECORDS', '재즈·록 중고 레코드·CD 전문'),
    goodsmate: s('グッズメイト', '애니·버튜버 굿즈, 피규어 묶음 판매'),
    wish: s('WISH', '일본 거장 판화·유화, 공예품 미술품'),
    yumekobo: s('夢工房', '철병·은병·전차도구 등 골동 다도구'),
    sakepeople: s('SAKE People', '쥬욘다이·위스키, 부르고뉴 와인 전문 주류'),
    joylab: s('JOYLAB', '고급 와인·위스키, 브랜디 1엔 출품'),
    daikokuya: s('大黒屋', '고급 위스키·브랜디, 아이폰·의류 매입품'),
    ecoren: s('エコレン', '파나소닉·후지쯔·HP 등 리퍼 노트북·태블릿', { company: '株式会社オッジPFT' }),
    arrows: s('Arrows', '게임기·컨트롤러·철도모형 등 1엔 스타트 상품', { company: '株式会社GlobalArrows' }),
    bring: s('BRING', DESC_TBD, { company: '株式会社STAYGOLD' })
  };

  Object.keys(STORES).forEach(function (k) { STORES[k].key = k; });

  /* 종합 TOP5 */
  var TOP = [
    { store: 'rere' },
    { store: 'playmart' },
    { store: 'bookoff' },
    { store: 'toyking' },
    { store: 'secondst' }
  ];

  /* 부문별 1~3위 (원문 구조: 그룹 > 부문 > 1~3위). cats[].ranks 는 1위, 2위, 3위 순서의 STORES 키 */
  var GROUPS = [
    { id: 'fashion', title: '패션', cats: [
      { id: 'women', title: '여성패션', ranks: ['secondst', 'vector', 'brandear'] },
      { id: 'men', title: '남성패션', ranks: ['secondst', 'bookoff', 'realclo'] },
      { id: 'brand', title: '브랜드', ranks: ['pleasure', 'empower', 'brandear'] },
      { id: 'kimono', title: '일본옷, 기모노', ranks: ['heiwaya', 'wayukan', 'byset'] },
      { id: 'accessory', title: '액세서리', ranks: ['bookoff', 'otakaraya', 'jewelrykiwami'] },
      { id: 'watch', title: '시계', ranks: ['ecoplan', 'closer', 'quickdo'] }
    ] },
    { id: 'kaden', title: '가전/스포츠/자동차', cats: [
      { id: 'av', title: '가전, AV', ranks: ['playmart', 'west', 'rere'] },
      { id: 'camera', title: '카메라', ranks: ['rere', 'fukuchan', 'quickdo'] },
      { id: 'pc', title: 'PC', ranks: ['rere', 'yokogawa', 'netoff'] },
      { id: 'phone', title: '스마트폰', ranks: ['joshin', 'netoff', 'keitai'] },
      { id: 'sports', title: '스포츠, 레저', ranks: ['wave', 'valley', 'cycleparadise'] },
      { id: 'golf', title: '골프', ranks: ['golfpartner', 'gdo', 'golfconcept'] },
      { id: 'tire', title: '자동차 타이어, 휠', ranks: ['tirevalue', 'tread', 'autoway'] },
      { id: 'autoparts', title: '자동차 부품', ranks: ['gekiyasu', 'upj', 'nrs'] },
      { id: 'moto', title: '오토바이', ranks: ['motobox', 'raoh', 'toyo'] }
    ] },
    { id: 'home', title: '주거/취미/식품', cats: [
      { id: 'interior', title: '거주지, 인테리어', ranks: ['iris', 'cherrys', 'classdesign'] },
      { id: 'diy', title: 'DIY, 농업 기계', ranks: ['tooloff', 'link', 'acttool'] },
      { id: 'hobby', title: '장난감, 게임, 취미', ranks: ['toyking', 'bookoff', 'denno'] },
      { id: 'instrument', title: '악기, 장비', ranks: ['playmart', 'chuya', 'rere'] },
      { id: 'entertainment', title: '엔터테인먼트', ranks: ['ella', 'bookoff', 'goodsmate'] },
      { id: 'antique', title: '골동품, 컬렉션', ranks: ['wish', 'yumekobo', 'otakaraya'] },
      { id: 'food', title: '음식, 음료', ranks: ['sakepeople', 'joylab', 'daikokuya'] }
    ] },
    { id: 'special', title: '특별상', cats: [
      { id: 'special_new', title: '신인상', desc: '2025년부터 출품을 시작해 눈부신 활약을 한 스토어에 수여되는 상입니다.', ranks: ['murakame'] },
      { id: 'special_rising', title: '급상승 스토어상', desc: '2025년에 급성장한 스토어에 수여되는 상입니다.', ranks: ['komehyo'] },
      { id: 'special_coupon', title: '스토어 쿠폰상', desc: '각종 스토어 쿠폰을 활용해 ‘이득’에 크게 기여한 스토어에 수여되는 상입니다.', ranks: ['ecoren'] },
      { id: 'special_yen', title: '1엔 출품 추진상', desc: '명물 ‘1엔 스타트’ 상품을 적극적으로 전개해 경매의 열기에 기여한 스토어에 수여되는 상입니다.', ranks: ['arrows'] },
      { id: 'special_price', title: '고단가 상품 추진상', desc: '수요가 높아지는 고단가 상품을 적극적으로 전개해 경매의 ‘가치 향상’에 기여한 스토어에 수여되는 상입니다.', ranks: ['bring'] }
    ] }
  ];

  function esc(v) {
    return String(v).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function num(n) { return Number(n).toLocaleString('ko-KR'); }
  /* 스토어명 = 스토어 상품 목록으로 가는 링크 */
  function nameLink(st, type, label, pos) {
    return '<a class="bs-name" href="' + esc(st.url) + '" data-bs-type="' + type + '" data-bs-label="' + esc(label) + '" data-bs-pos="' + pos + '">' + esc(st.name) +
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a>';
  }
  function row(st, rank, rankCls, type, label, pos) {
    return '<div class="bs-row">' + (rank === '' ? '' : '<span class="bs-rank' + rankCls + '">' + rank + '</span>') +
      '<div class="bs-info">' + nameLink(st, type, label, pos) + (st.company ? '<span class="bs-company">' + esc(st.company) + '</span>' : '') + '<span class="bs-desc">' + esc(st.desc) + '</span>' + '</div>' +
      '<div class="bs-prods" data-store="' + st.key + '"></div></div>';
  }

  /* ---- 스토어 상품 ---- */
  function seeded(seedText) {
    var h = 2166136261;
    for (var i = 0; i < seedText.length; i++) { h ^= seedText.charCodeAt(i); h = Math.imul(h, 16777619); }
    return function () { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return ((h >>> 0) % 100000) / 100000; };
  }
  function mockProducts(st) { /* 화면 확인용 샘플 */
    var rnd = seeded(st.key), base = st.desc.split(/[,·]/)[0].trim(), list = [];
    for (var i = 1; i <= PRODUCT_COUNT; i++) {
      var price = Math.round((500 + rnd() * 90000) / 10) * 10;
      list.push({
        title: base + ' 샘플 ' + i,
        price: price,
        buyNow: Math.round(price * (1.2 + rnd() * 1.3) / 10) * 10,
        remain: ['7시간', '1일', '2일', '3일'][Math.floor(rnd() * 4)],
        bids: Math.floor(rnd() * 33),
        image: 'https://picsum.photos/seed/' + st.key + '-' + i + '/300',
        url: PRODUCT_PAGE,
        sample: true
      });
    }
    return list;
  }
  function loadProducts(st) {
    if (typeof window.BB_STORE_PRODUCTS === 'function') {
      return Promise.resolve(window.BB_STORE_PRODUCTS(st.sellerId || st.key, PRODUCT_COUNT));
    }
    return Promise.resolve(mockProducts(st));
  }
  function productHtml(st, p, n) {
    return '<a class="bs-prod" href="' + esc(p.url || PRODUCT_PAGE) + '" data-bs-type="product" data-bs-label="' + esc(st.key + '_p' + n) + '" data-bs-pos="' + n + '">' +
      '<span class="bs-prod-img"><img loading="lazy" src="' + esc(p.image) + '" alt=""></span>' +
      '<span class="bs-prod-title">' + esc(p.title) + '</span>' +
      '<span class="bs-prod-price"><span class="bs-prod-cur">현재</span> <b>' + num(p.price) + '엔</b></span>' +
      (p.buyNow ? '<span class="bs-prod-buy">즉시낙찰 ' + num(p.buyNow) + '엔</span>' : '') +
      '<span class="bs-prod-meta">' + esc(p.remain) + ' · ' + num(p.bids) + '입찰</span></a>';
  }
  function fillProducts(el) {
    if (el.getAttribute('data-loaded')) return;
    el.setAttribute('data-loaded', '1');
    var st = STORES[el.getAttribute('data-store')];
    loadProducts(st).then(function (items) {
      el.innerHTML = (items || []).slice(0, PRODUCT_COUNT).map(function (p, i) { return productHtml(st, p, i + 1); }).join('');
    });
  }
  function lazyProducts(root) {
    var strips = root.querySelectorAll('.bs-prods');
    if (!('IntersectionObserver' in window)) { strips.forEach(fillProducts); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { io.unobserve(en.target); fillProducts(en.target); }
      });
    }, { rootMargin: '300px' });
    strips.forEach(function (el) { io.observe(el); });
  }

  var INTRO_TOP = '종합상은 고객 평가·매출 등 종합적인 지표를 바탕으로 결정하며, 전체 스토어의 정점에 선 상위 5개 스토어에 수여되는 상입니다.';

  function render(root) {
    var st = { pos: 0 };
    var catGroups = GROUPS.filter(function (g) { return g.id !== 'special'; });
    var special = GROUPS.filter(function (g) { return g.id === 'special'; })[0];

    function cat(c, g, ci, withRest) {
      var isSp = g.id === 'special';
      var h = '<div class="bs-cat' + (withRest && ci >= MOBILE_VISIBLE_CATS ? ' bs-rest' : '') + '" id="bs-' + c.id + '"><h3 class="bs-h3">' + esc(c.title) + '</h3>' +
        (c.desc ? '<p class="bs-cat-desc">' + esc(c.desc) + '</p>' : '') + (isSp ? '' : '<div class="bs-cards">');
      c.ranks.forEach(function (key, ri) {
        st.pos++;
        h += row(STORES[key], isSp ? '' : (ri + 1) + '위', ri === 0 ? ' bs-rank-1' : '', 'category_best', c.id + '_' + (ri + 1), st.pos);
      });
      return h + (isSp ? '' : '</div>') + '</div>';
    }

    var mains = [['top', '종합상'], ['category', '부문상'], ['special', '특별상']];
    var html = '<div class="bs-main-tabs" role="tablist">' + mains.map(function (m, i) {
      return '<button type="button" class="bs-main-tab' + (i === 0 ? ' active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-panel="' + m[0] + '">' + m[1] + '</button>';
    }).join('') + '</div>';

    /* 종합상 */
    html += '<div class="bs-panel" data-panel="top"><p class="bs-intro">' + esc(INTRO_TOP) + '</p><div class="bs-top">';
    TOP.forEach(function (t, i) {
      st.pos++;
      html += row(STORES[t.store], (i + 1) + '위', i === 0 ? ' bs-rank-1' : '', 'store', 'top' + (i + 1), st.pos);
    });
    html += '</div></div>';

    /* 부문상: 그룹 탭 > 하위 부문 바로가기 > 부문별 1~3위 */
    html += '<div class="bs-panel" data-panel="category" hidden><nav class="bs-nav" aria-label="부문 바로가기"><div class="bs-tabs" role="tablist">' + catGroups.map(function (g, i) {
      return '<button type="button" class="bs-tab' + (i === 0 ? ' active' : '') + '" role="tab" aria-selected="' + (i === 0) + '" data-group="' + g.id + '">' + esc(g.title) + '</button>';
    }).join('') + '</div>' + catGroups.map(function (g, i) {
      return '<div class="bs-subnav" data-group="' + g.id + '"' + (i === 0 ? '' : ' hidden') + '>' + g.cats.map(function (c) {
        return '<a class="bs-nav-link" href="#bs-' + c.id + '">' + esc(c.title) + '</a>';
      }).join('') + '</div>';
    }).join('') + '</nav>';
    catGroups.forEach(function (g, gi) {
      var hidden = g.cats.length - MOBILE_VISIBLE_CATS;
      html += '<section class="bs-sec" id="bs-' + g.id + '" data-group="' + g.id + '"' + (gi === 0 ? '' : ' hidden') + '><h2 class="bs-h2">' + esc(g.title) + '</h2>';
      g.cats.forEach(function (c, ci) { html += cat(c, g, ci, true); });
      if (hidden > 0) html += '<button type="button" class="bs-more" aria-expanded="false">부문 더보기 ' + hidden + '</button>';
      html += '</section>';
    });
    html += '</div>';

    /* 특별상 */
    html += '<div class="bs-panel" data-panel="special" hidden><div class="bs-sp">';
    special.cats.forEach(function (c, ci) { html += cat(c, special, ci, false); });
    html += '</div></div>';

    html += '<p class="bs-src">출처 · <a href="' + SOURCE_URL + '" target="_blank" rel="noopener">Yahoo!オークション ベストストアアワード2025</a>' + '</p>';
    root.innerHTML = html;
  }

  function init() {
    var root = document.getElementById('bsRoot');
    if (!root) return;
    render(root);
    lazyProducts(root);

    /* 모바일: 고정(sticky) 헤더 아래에 탭이 붙도록 헤더 높이를 CSS 변수로 전달 */
    function stickyOffset() {
      var h = document.getElementById('bbmHeader');
      if (!h) return 0;
      var cs = getComputedStyle(h);
      if (cs.position !== 'sticky' && cs.position !== 'fixed') return 0;
      var top = (parseFloat(cs.top) || 0) + h.offsetHeight;
      root.style.setProperty('--bs-sticky-top', top + 'px');
      return top;
    }
    stickyOffset();
    window.addEventListener('resize', stickyOffset);
    /* 탭을 바꾸면 새 내용의 맨 위가 보이도록, 깊이 내려와 있을 때만 위로 올린다 */
    function scrollToPanelTop() {
      var top = root.getBoundingClientRect().top + window.pageYOffset - stickyOffset() - 8;
      if (window.pageYOffset > top) window.scrollTo(0, Math.max(0, top));
    }
    root.addEventListener('click', function (e) {
      var t = e.target;
      if (!t || !t.closest) return;
      var mainTab = t.closest('.bs-main-tab');
      if (mainTab) { /* 종합상 / 부문상 / 특별상 */
        root.querySelectorAll('.bs-main-tab').forEach(function (b) {
          b.classList.toggle('active', b === mainTab);
          b.setAttribute('aria-selected', String(b === mainTab));
        });
        root.querySelectorAll('.bs-panel').forEach(function (p) {
          p.hidden = p.getAttribute('data-panel') !== mainTab.getAttribute('data-panel');
        });
        scrollToPanelTop();
        return;
      }
      var tab = t.closest('.bs-tab');
      if (tab) { /* 그룹 탭: 해당 그룹의 부문 목록과 바로가기를 보여준다 */
        var gid = tab.getAttribute('data-group');
        root.querySelectorAll('.bs-tab').forEach(function (b) {
          b.classList.toggle('active', b === tab);
          b.setAttribute('aria-selected', String(b === tab));
        });
        root.querySelectorAll('.bs-subnav, .bs-sec[data-group]').forEach(function (p) {
          p.hidden = p.getAttribute('data-group') !== gid;
        });
        scrollToPanelTop();
        return;
      }
      var nav = t.closest('.bs-nav-link');
      if (nav) { /* 접혀 있는 부문으로 이동할 때는 해당 그룹을 먼저 펼친다 */
        var target = document.getElementById(nav.getAttribute('href').slice(1));
        var sec = target && target.closest('.bs-sec');
        if (sec && !sec.classList.contains('open')) {
          sec.classList.add('open');
          var btnMore = sec.querySelector('.bs-more');
          if (btnMore) btnMore.setAttribute('aria-expanded', 'true');
        }
        return;
      }
      var more = t.closest('.bs-more');
      if (more) {
        more.closest('.bs-sec').classList.add('open');
        more.setAttribute('aria-expanded', 'true');
        return;
      }
      var a = t.closest('a[data-bs-label]');
      if (!a) return;
      if (a.getAttribute('href') === '#') e.preventDefault();
      window.bbTrack('best_store_click', {
        module: MODULE, type: a.getAttribute('data-bs-type'),
        label: a.getAttribute('data-bs-label'), position: Number(a.getAttribute('data-bs-pos'))
      });
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
