/* ============================================================
   2026 Yahoo 베스트 스토어 입구 페이지 — 모바일
   - 스토어명/설명/썸네일/링크는 아래 QS_BEST_STORES 한 곳에서만 교체한다.
   - 지금은 모두 플레이스홀더. 실제 스토어명/URL을 채우기 전까지 링크는 '#'.
   - 측정: best_store_click (module=best_store_page, type=store|category_best, label, position)
   ============================================================ */
(function () {
  var MODULE = 'best_store_page';
  var PLACEHOLDER_NAME = '[스토어명]';
  var PLACEHOLDER_DESC = '[대표 상품군 한 줄 설명]';

  /* image: 썸네일 URL ('' 이면 회색 박스). url: TODO Yahoo 옥션 셀러 페이지를 비드바이로 연결하는 링크 */
  var QS_BEST_STORES = {
    top: [1, 2, 3, 4, 5].map(function (n) {
      return { rank: n, label: 'top' + n, name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ };
    }),
    /* 카테고리 BEST: 아래 배열 순서대로 1~10번 표시 */
    category: [
      { category: '캐쥬얼 패션', label: 'category_casual', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '브랜드', label: 'category_brand', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '액세서리', label: 'category_accessory', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '시계', label: 'category_watch', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '가전/스포츠/자동차', label: 'category_electronics_sports_auto', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '장난감, 게임, 취미', label: 'category_hobby', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '악기, 장비', label: 'category_instrument', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '엔터테인먼트', label: 'category_entertainment', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '골동품, 컬렉션', label: 'category_collection', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ },
      { category: '음식, 음료', label: 'category_food', name: PLACEHOLDER_NAME, desc: PLACEHOLDER_DESC, image: '', url: '#' /* TODO */ }
    ]
  };

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function thumb(img) {
    return '<div class="bs-thumb">' + (img ? '<img src="' + esc(img) + '" alt="">' : '') + '</div>';
  }
  function btn(it, type, pos) {
    return '<a class="bs-btn" href="' + esc(it.url) + '" data-bs-type="' + type + '" data-bs-label="' + esc(it.label) + '" data-bs-pos="' + pos + '">스토어 상품 보기</a>';
  }

  function render(root) {
    var pos = 0;
    var html = '<section class="bs-sec"><h2 class="bs-h2">종합 TOP5</h2>';
    QS_BEST_STORES.top.forEach(function (it) {
      pos++;
      html += '<div class="bs-row"><span class="bs-rank' + (it.rank === 1 ? ' bs-rank-1' : '') + '">' + it.rank + '</span>' + thumb(it.image) +
        '<div class="bs-info"><span class="bs-name">' + esc(it.name) + '</span><span class="bs-desc">' + esc(it.desc) + '</span></div>' +
        btn(it, 'store', pos) + '</div>';
    });
    html += '</section><section class="bs-sec"><h2 class="bs-h2">카테고리 BEST</h2>';
    QS_BEST_STORES.category.forEach(function (it, index) {
      pos++;
      html += '<div class="bs-row"><span class="bs-rank">' + (index + 1) + '</span>' + thumb(it.image) +
        '<div class="bs-info"><span class="bs-tag">' + esc(it.category) + ' BEST</span><span class="bs-name">' + esc(it.name) + '</span><span class="bs-desc">' + esc(it.desc) + '</span></div>' +
        btn(it, 'category_best', pos) + '</div>';
    });
    html += '</section>';
    root.innerHTML = html;
  }

  function init() {
    var root = document.getElementById('bsRoot');
    if (!root) return;
    render(root);
    root.addEventListener('click', function (e) {
      var a = e.target.closest && e.target.closest('a[data-bs-label]');
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
