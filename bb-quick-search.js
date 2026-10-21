/* ============================================================
   메인 빠른검색 (quick_search_v2) — PC
   - 칸 구성은 아래 QS2_ITEMS 한 곳에서만 바꾼다 (주 단위 교체: 포켓몬카드 칸 등)
   - QS2_ENABLED=false 로 두면 구 모듈(quick_search_v1)이 다시 보인다 (롤백)
   - 시안: 기본은 시안 A(스토어 / 카테고리 / 브랜드 3분할). 주소에 ?qs=b 를 붙이면 시안 B(스토어 1~10위 버튼형)
     좌우 화살표로 세 시안을 번갈아 볼 수 있다(QS2_SWITCHER). 시안 C = 스토어명을 빼고 카테고리 + 순위만 남긴 버전(?qs=c, 측정 모듈 quick_search_v2c). 처음 보이는 시안은 QS2_VARIANT. 시안 B 의 측정 모듈명은 quick_search_v2b
   - 측정: 클릭 quick_search_click / 노출 quick_search_impression
     모듈명 quick_search_v2 · 유형 store|category|brand · 라벨 · 위치(1부터)
   ============================================================ */
(function () {
  var QS2_ENABLED = true;
  var QS2_MODULE = 'quick_search_v2';

  var BRAND_SEARCH = 'https://www.alpha.bidbuy.co.kr/search?q='; /* 기존 브랜드 버튼과 동일 방식 */

  /* 기획전 카드는 현재 미운영. 다시 열 때 type: 'planned' 항목을 여기에 추가 */
  var QS2_ITEMS = [
    { type: 'store',   label: 'yahoo_best_store', tag: '스토어', title: '2025 Yahoo 베스트 스토어', url: 'web_best_store.html' }
  ];
  /* 인기 카테고리: 클릭 시 해당 옥션 카테고리 대항목으로 이동 (category = 카테고리 페이지의 대분류명) */
  var CATEGORY_PAGE = 'web_category_main.html';
  function catUrl(category) {
    return CATEGORY_PAGE + '?store=' + encodeURIComponent('야후 옥션') +
      '&category=' + encodeURIComponent(category) + '&path=' + encodeURIComponent(category);
  }
  var QS2_CATEGORIES = [
    { label: 'best_category_watch',   name: '시계',     url: catUrl('액세서리, 시계') },
    { label: 'best_category_audio',   name: '음향기기', url: catUrl('가전, AV, 카메라') },
    { label: 'best_category_fishing', name: '낚시용품', url: catUrl('스포츠, 레저') },
    { label: 'best_category_figure',  name: '피규어',   url: catUrl('장난감, 게임') }
  ];
  var QS2_BRANDS = [
    { label: 'brand_chanel', name: '샤넬',    url: BRAND_SEARCH + 'Chanel' },
    { label: 'brand_hermes', name: '에르메스', url: BRAND_SEARCH + 'Hermes' },
    { label: 'brand_polo',   name: '폴로',    url: BRAND_SEARCH + 'Polo' },
    { label: 'brand_nike',   name: '나이키',   url: BRAND_SEARCH + 'Nike' }
  ];

  /* ---- 시안 B: 스토어 1~10위 버튼형 (클릭 -> 스토어 상품 목록, 우측 상단 "수상 스토어 전체 보기" -> 입구 페이지) ---- */
  var QS2_VARIANT = 'a';
  var QS2_SWITCHER = true; /* 시안 비교용(좌우 화살표). 시안이 확정되면 false (또는 코드 삭제) */
  /* 스토어 상품 목록 이동 대상: 임시로 야후 옥션 상품 목록 페이지. TODO: 스토어별 상품 목록 URL(출품자 고유ID 기반)로 교체 */
  var STORE_LIST_URL = 'web_category_main.html?store=' + encodeURIComponent('야후 옥션');
  var QS2B_TILES = [
    { label: 'store_rere', catKey: 'camera',          name: 'ReRe',               cat: '카메라',       rank: '종합 1위' },
    { label: 'store_playmart', catKey: 'audio',      name: 'PLAYMART',           cat: '음향기기',     rank: '종합 2위' },
    { label: 'store_bookoff', catKey: 'tradingcard',       name: 'ブックオフ',          cat: '트레이딩카드', rank: '종합 3위' },
    { label: 'store_toyking', catKey: 'figure',       name: 'トイズキング',        cat: '피규어',       rank: '종합 4위' },
    { label: 'store_secondstreet', catKey: 'shoes',  name: 'セカンドストリート',  cat: '슈즈·의류',    rank: '종합 5위' },
    { label: 'store_wave', catKey: 'fishing',          name: 'ウェイブ',            cat: '낚시용품',     rank: '부문 1위' },
    { label: 'store_golfpartner', catKey: 'golf',   name: 'ゴルフパートナー',    cat: '골프',         rank: '부문 1위' },
    { label: 'store_motobox', catKey: 'motoparts',       name: 'MOTO BOX',           cat: '오토바이부품', rank: '부문 1위' },
    { label: 'store_ecoplan', catKey: 'watch',       name: 'ecoプラン',           cat: '시계',         rank: '부문 1위' },
    { label: 'store_chuya', catKey: 'instrument',         name: 'chuya-online',       cat: '악기',         rank: '부문 2위' }
  ];

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function attrs(type, label, pos) {
    return ' data-qs-type="' + type + '" data-qs-label="' + label + '" data-qs-pos="' + pos + '"';
  }

  function group(label, type, list, state) {
    var h = '<div class="qs2-group"><span class="qs2-glabel">' + label + '</span><span class="qs2-pills">';
    list.forEach(function (c) {
      state.pos++;
      h += '<a href="' + esc(c.url) + '"' + attrs(type, c.label, state.pos) + '>' + esc(c.name) + '</a>';
    });
    return h + '</span></div>';
  }

  function buildA() {
    var state = { pos: 0 };
    var html = '<div class="qs2-bar">';
    QS2_ITEMS.forEach(function (it) {
      state.pos++;
      html += '<a class="qs2-store" href="' + esc(it.url) + '"' + attrs(it.type, it.label, state.pos) + '>' +
        '<img class="qs2-badge" src="best-store-awards-2025.png" alt="" width="40" height="40">' +
        '<span class="qs2-title">' + esc(it.title) + '</span><svg class="qs2-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a>';
    });
    html += group('인기 카테고리', 'category', QS2_CATEGORIES, state);
    html += group('인기 브랜드', 'brand', QS2_BRANDS, state);
    return html + '</div>';
  }

  function buildB() {
    var html = '<div class="qs2b"><div class="qs2b-hd"><span class="qs2b-title">' +
      '<img class="qs2b-badge" src="best-store-awards-2025.png" alt="" width="32" height="32">' + esc(QS2_ITEMS[0].title) + '</span>' +
      '<a class="qs2b-all" href="' + esc(QS2_ITEMS[0].url) + '"' + attrs('all', 'award_store_all', QS2B_TILES.length + 1) + '>수상 스토어 전체 보기 <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a></div>' +
      '<div class="qs2b-grid">';
    QS2B_TILES.forEach(function (t, i) {
      html += '<a class="qs2b-tile" href="' + esc(STORE_LIST_URL) + '"' + attrs('store', t.label, i + 1) + '>' +
        '<span class="qs2b-name">' + esc(t.name) + '</span>' +
        '<span class="qs2b-cat">' + esc(t.cat) + '</span>' +
        '<span class="qs2b-rank' + (i === 0 ? ' is-first' : '') + '">' + esc(t.rank) + '</span></a>';
    });
    return html + '</div></div>';
  }

  /* 시안 C: 스토어명을 빼고 카테고리 + 순위만 남긴 버전 (클릭 -> 스토어 상품 목록) */
  function buildC() {
    var html = '<div class="qs2b"><div class="qs2b-hd"><span class="qs2b-title">' +
      '<img class="qs2b-badge" src="best-store-awards-2025.png" alt="" width="32" height="32">' + esc(QS2_ITEMS[0].title) + '</span>' +
      '<a class="qs2b-all" href="' + esc(QS2_ITEMS[0].url) + '"' + attrs('all', 'award_store_all', QS2B_TILES.length + 1) + '>수상 스토어 전체 보기 <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></a></div>' +
      '<div class="qs2b-grid">';
    QS2B_TILES.forEach(function (t, i) {
      html += '<a class="qs2b-tile qs2c-tile" href="' + esc(STORE_LIST_URL) + '"' + attrs('store', 'cat_' + t.catKey, i + 1) + '>' +
        '<span class="qs2c-cat">' + esc(t.cat) + '</span>' +
        '<span class="qs2b-rank' + (i === 0 ? ' is-first' : '') + '">' + esc(t.rank) + '</span></a>';
    });
    return html + '</div></div>';
  }

  function currentSlide(root) { return root.querySelector('.qs2-slide:not([hidden])'); }

  var impressed = {};
  function impress(slide) {
    var v = slide.getAttribute('data-v');
    if (impressed[v]) return;
    impressed[v] = true;
    window.bbTrack('quick_search_impression', { module: slide.getAttribute('data-module'), item_count: slide.querySelectorAll('[data-qs-label]').length });
  }

  function wireTracking(root) {
    root.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-qs-label]') : null;
      if (a && root.contains(a)) {
        if (a.getAttribute('href') === '#') e.preventDefault();
        var slide = a.closest('.qs2-slide');
        window.bbTrack('quick_search_click', {
          module: slide ? slide.getAttribute('data-module') : QS2_MODULE, type: a.getAttribute('data-qs-type'),
          label: a.getAttribute('data-qs-label'), position: Number(a.getAttribute('data-qs-pos'))
        });
      }
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          io.disconnect();
          var cur = currentSlide(root);
          if (cur) impress(cur);
        }
      }, { threshold: 0.5 });
      io.observe(root);
    }
  }

  /* 시안 비교용 좌우 화살표: 시안 A -> B -> C 순환 (확정 후 QS2_SWITCHER = false) */
  var ORDER = ['a', 'b', 'c'];
  function wireSwitcher(root) {
    var slides = root.querySelectorAll('.qs2-slide');
    var dots = root.querySelectorAll('.qs2-dots span');
    function show(v) {
      slides.forEach(function (s) { s.hidden = s.getAttribute('data-v') !== v; });
      dots.forEach(function (d, n) { d.classList.toggle('is-on', ORDER[n] === v); });
      var cur = currentSlide(root);
      if (cur) impress(cur);
    }
    function step(dir) {
      var cur = currentSlide(root);
      var i = ORDER.indexOf(cur ? cur.getAttribute('data-v') : 'a');
      show(ORDER[(i + dir + ORDER.length) % ORDER.length]);
    }
    root.querySelector('.qs2-prev').addEventListener('click', function () { step(-1); });
    root.querySelector('.qs2-next').addEventListener('click', function () { step(1); });
  }

  function init() {
    var root = document.getElementById('qs2Root');
    var legacy = document.getElementById('qs1Legacy');
    if (!root) return;
    if (!QS2_ENABLED) { if (legacy) legacy.hidden = false; root.hidden = true; return; }
    var start = (new URLSearchParams(location.search).get('qs') || QS2_VARIANT).toLowerCase();
    if (ORDER.indexOf(start) < 0) start = 'a';
    function slide(v, build) {
      return '<div class="qs2-slide" data-v="' + v + '" data-module="quick_search_v2' + (v === 'a' ? '' : v) + '"' + (start === v ? '' : ' hidden') + '>' + build() + '</div>';
    }
    root.innerHTML = '<div class="qs2-slides">' + slide('a', buildA) + slide('b', buildB) + slide('c', buildC) + '</div>' +
      (QS2_SWITCHER
        ? '<button type="button" class="qs2-nav qs2-prev" aria-label="이전 시안"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button>' +
          '<button type="button" class="qs2-nav qs2-next" aria-label="다음 시안"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg></button>' +
          '<div class="qs2-dots" aria-hidden="true">' + ORDER.map(function (v) { return '<span' + (v === start ? ' class="is-on"' : '') + '></span>'; }).join('') + '</div>'
        : '');
    wireTracking(root);
    if (QS2_SWITCHER) wireSwitcher(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
