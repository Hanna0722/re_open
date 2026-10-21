/* ============================================================
   메인 "지금 많이 찾는 곳" (quick_search_v2) — 모바일
   - 칸 구성은 아래 QS2_ITEMS 한 곳에서만 바꾼다 (주 단위 교체: 포켓몬카드 칸 등)
   - QS2_ENABLED=false 로 두면 구 모듈(quick_search_v1)이 다시 보인다 (롤백)
   - 측정: 클릭 quick_search_click / 노출 quick_search_impression
     모듈명 quick_search_v2 · 유형 store|category|planned|brand · 라벨 · 위치(1부터)
   ============================================================ */
(function () {
  var QS2_ENABLED = true;
  var QS2_MODULE = 'quick_search_v2';

  var BRAND_SEARCH = 'https://www.alpha.bidbuy.co.kr/search?q='; /* 기존 브랜드 버튼과 동일 방식 */

  /* url: 기획전 URL 미정 → '#' (TODO: 저장된 검색 결과 링크 또는 기획전 페이지로 교체) */
  var QS2_ITEMS = [
    { type: 'store',   label: 'yahoo_best_store', tag: '스토어', title: '2026 Yahoo 베스트 스토어', sub: 'TOP10 보러가기', url: 'mobile_best_store.html' },
    { type: 'planned', label: 'pokemon_card',     tag: '기획전', title: '포켓몬카드',       sub: '이번 주 기획',       url: '#' /* TODO: 주간 교체 */ },
    { type: 'planned', label: 'car_bike_parts',   tag: '기획전', title: '카·바이크 파츠',   sub: 'GR86 · 투라텍',      url: '#' /* TODO */ }
  ];
  /* 베스트 카테고리: 클릭 시 해당 옥션 카테고리 대항목으로 이동 (category = 카테고리 페이지의 대분류명) */
  var CATEGORY_PAGE = 'mobile_category_main.html';
  function catUrl(category) {
    return CATEGORY_PAGE + '?store=' + encodeURIComponent('야후 옥션') +
      '&category=' + encodeURIComponent(category) + '&path=' + encodeURIComponent(category);
  }
  var QS2_CATEGORIES = [
    { label: 'best_category_camera', name: '카메라', url: catUrl('가전, AV, 카메라') },
    { label: 'best_category_watch',  name: '시계',   url: catUrl('액세서리, 시계') },
    { label: 'best_category_figure', name: '피규어', url: catUrl('장난감, 게임') }
  ];
  var QS2_BRANDS = [
    { label: 'brand_chanel', name: '샤넬',    url: BRAND_SEARCH + 'Chanel' },
    { label: 'brand_hermes', name: '에르메스', url: BRAND_SEARCH + 'Hermes' },
    { label: 'brand_polo',   name: '폴로',    url: BRAND_SEARCH + 'Polo' }
  ];
  var QS2_MORE_URL = '#'; /* TODO: 전체 기획전 페이지 */

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function attrs(type, label, pos) {
    return ' data-qs-type="' + type + '" data-qs-label="' + label + '" data-qs-pos="' + pos + '"';
  }

  var ARROW = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 5l7 7-7 7"/></svg>';

  function render(root) {
    var pos = 0;
    var html = '<div class="sec-hd"><span class="sec-title">지금 많이 찾는 곳</span>' +
      '<a class="qs2-more" href="' + QS2_MORE_URL + '">전체 기획전 보기</a></div>';
    var planned = '';
    QS2_ITEMS.forEach(function (it) {
      pos++;
      if (it.type === 'store') {
        html += '<a class="qs2-store" href="' + esc(it.url) + '"' + attrs(it.type, it.label, pos) + '>' +
          '<span class="qs2-store-txt"><span class="qs2-tag">' + esc(it.tag) + '</span>' +
          '<span class="qs2-title">' + esc(it.title) + '</span>' +
          '<span class="qs2-sub">' + esc(it.sub) + '</span></span>' + ARROW + '</a>';
      } else {
        planned += '<a class="qs2-card" href="' + esc(it.url) + '"' + attrs(it.type, it.label, pos) + '>' +
          '<span class="qs2-tag">' + esc(it.tag) + '</span>' +
          '<span class="qs2-title">' + esc(it.title) + '</span>' +
          '<span class="qs2-sub">' + esc(it.sub) + '</span></a>';
      }
    });
    html += '<div class="qs2-grid">' + planned + '</div>';
    html += '<div class="qs2-brand-row"><span class="qs2-tag">베스트 카테고리</span><span class="qs2-pills">';
    QS2_CATEGORIES.forEach(function (c) {
      pos++;
      html += '<a href="' + esc(c.url) + '"' + attrs('category', c.label, pos) + '>' + esc(c.name) + '</a>';
    });
    html += '</span></div>';
    html += '<div class="qs2-brand-row"><span class="qs2-tag">인기 브랜드</span><span class="qs2-pills">';
    QS2_BRANDS.forEach(function (b) {
      pos++;
      html += '<a href="' + esc(b.url) + '"' + attrs('brand', b.label, pos) + '>' + esc(b.name) + '</a>';
    });
    html += '</span></div>';
    root.innerHTML = html;
  }

  function wireTracking(root) {
    root.addEventListener('click', function (e) {
      var a = e.target.closest ? e.target.closest('a[data-qs-label]') : null;
      if (a && root.contains(a)) {
        if (a.getAttribute('href') === '#') e.preventDefault();
        window.bbTrack('quick_search_click', {
          module: QS2_MODULE, type: a.getAttribute('data-qs-type'),
          label: a.getAttribute('data-qs-label'), position: Number(a.getAttribute('data-qs-pos'))
        });
      } else if (e.target.closest && e.target.closest('.qs2-more') && e.target.closest('.qs2-more').getAttribute('href') === '#') {
        e.preventDefault();
      }
    });
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        if (entries.some(function (en) { return en.isIntersecting; })) {
          io.disconnect();
          window.bbTrack('quick_search_impression', { module: QS2_MODULE, item_count: QS2_ITEMS.length + QS2_CATEGORIES.length + QS2_BRANDS.length });
        }
      }, { threshold: 0.5 });
      io.observe(root);
    }
  }

  function init() {
    var root = document.getElementById('qs2Root');
    var legacy = document.getElementById('qs1Legacy');
    if (!root) return;
    if (!QS2_ENABLED) { if (legacy) legacy.hidden = false; root.hidden = true; return; }
    render(root);
    wireTracking(root);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
