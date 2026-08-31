/* BidBuy search modal (mobile)
   web/bb-search-modal.js의 모바일 버전.
   - 검색 범위 / 최근 검색어 / 추천 검색어 / 최근 본 상품 구성과 동작은 웹과 동일하다.
   - localStorage 키(bb_recent_searches, bb_search_scopes)도 웹과 공유한다.
   - 좁은 화면에 맞춰 드롭다운 대신 헤더 아래 붙는 전체폭 시트로 표시한다. */
(function () {
  'use strict';

  var RECENT_KEY = 'bb_recent_searches';
  var SCOPE_KEY = 'bb_search_scopes';
  var MAX_RECENT = 8;
  var SUGGESTED = [
    '포켓몬 카드',
    '건프라',
    '다이빙 컴퓨터',
    '빈티지 시계',
  ];
  var SCOPES = [
    { label: '야후옥션', flag: 'jp', active: true },
    { label: '메루카리', flag: 'jp', active: true },
    { label: '라쿠텐', flag: 'jp', active: true },
    { label: '야후쇼핑', flag: 'jp', active: false },
    { label: '라쿠마', flag: 'jp', active: false },
    { label: '야후 프리마', flag: 'jp', active: false },
    { label: '미국 이베이', flag: 'us', active: false },
    { label: '영국 이베이', flag: 'uk', active: false }
  ];
  var VIEWED = [
    'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1592840496694-26d035b52b48?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1606813909359-0f2d6d766c13?auto=format&fit=crop&w=140&q=80'
  ];

  var css = [
    '.bbsm-ov{position:fixed;inset:0;background:rgba(15,23,42,.38);z-index:4000;touch-action:none}',
    '.bbsm-ov[hidden]{display:none}',
    '.bbsm-panel{position:fixed;left:0;right:0;background:#fff;border-top:2px solid #ff2f59;box-shadow:0 10px 26px rgba(15,23,42,.2);padding:16px 16px 28px;z-index:4001;overflow-y:auto;-webkit-overflow-scrolling:touch;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;color:#111827}',
    '.bbsm-panel[hidden]{display:none}',
    '.bbsm-panel *{box-sizing:border-box}',
    '.bbsm-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:14px}',
    '.bbsm-ai-chip{height:28px;padding:0 12px;border-radius:7px;background:#f62f58;color:#fff;font-size:12px;font-weight:900;display:inline-flex;align-items:center;gap:5px}',
    '.bbsm-ai-chip b{font-weight:900}',
    '.bbsm-close{width:30px;height:30px;border:0;background:none;color:#8b95a5;font-size:19px;line-height:1;cursor:pointer;font-family:inherit;padding:0}',
    '.bbsm-section{width:100%;padding-bottom:16px}',
    '.bbsm-section+.bbsm-section{padding-top:15px;border-top:1px solid #eef1f5}',
    '.bbsm-row-head{width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:11px}',
    '.bbsm-title{font-size:14px;font-weight:700;color:#111827}',
    '.bbsm-count{display:inline-flex;align-items:center;justify-content:center;min-width:17px;height:17px;margin-left:4px;border-radius:50%;background:#ffe3eb;color:#ef3158;font-size:10px;font-weight:800}',
    '.bbsm-clearall{border:0;background:none;color:#9aa3b2;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;padding:0}',
    '.bbsm-scope-all{width:100%;height:40px;border:1px solid #dfe4ec;border-radius:7px;background:#fff;color:#6f7785;font-size:12px;display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:7px;cursor:pointer;font-family:inherit}',
    '.bbsm-scope-grid{width:100%;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}',
    '.bbsm-scope{height:40px;border:1px solid #dfe4ec;border-radius:7px;background:#fff;color:#707783;font-size:12px;font-weight:500;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-family:inherit;padding:0 6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bbsm-scope.active{border-color:#ff2f59;background:#fff7f9;color:#f03259}',
    '.bbsm-flag{width:18px;height:13px;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.08);display:inline-block;position:relative;background:#fff;overflow:hidden;flex:0 0 auto}',
    '.bbsm-flag.jp::before{content:"";position:absolute;left:50%;top:50%;width:7px;height:7px;margin:-3.5px 0 0 -3.5px;border-radius:50%;background:#c9002b}',
    '.bbsm-flag.us{background:linear-gradient(#b22234 0 14%,#fff 14% 28%,#b22234 28% 42%,#fff 42% 56%,#b22234 56% 70%,#fff 70% 84%,#b22234 84%)}',
    '.bbsm-flag.us::before{content:"";position:absolute;left:0;top:0;width:8px;height:7px;background:#24458f}',
    '.bbsm-flag.uk{background:#17468f}',
    '.bbsm-flag.uk::before{content:"";position:absolute;inset:0;background:linear-gradient(32deg,transparent 41%,#fff 41% 48%,#d71920 48% 54%,#fff 54% 61%,transparent 61%),linear-gradient(148deg,transparent 41%,#fff 41% 48%,#d71920 48% 54%,#fff 54% 61%,transparent 61%),linear-gradient(90deg,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(0deg,transparent 35%,#fff 35% 65%,transparent 65%)}',
    '.bbsm-empty{color:#a6adba;font-size:12px}',
    '.bbsm-suggest-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr;row-gap:11px;counter-reset:bbsm-count}',
    '.bbsm-suggest-list li{display:grid;grid-template-columns:18px minmax(0,1fr);align-items:center;font-size:13px;color:#555b66;cursor:pointer;counter-increment:bbsm-count;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bbsm-suggest-list li::before{content:counter(bbsm-count);color:#6d7280;font-size:13px;font-weight:400}',
    '.bbsm-viewed-strip{display:flex;gap:8px;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}',
    '.bbsm-viewed-strip::-webkit-scrollbar{display:none}',
    '.bbsm-viewed{width:70px;height:68px;border:1px solid #e3e7ee;border-radius:6px;overflow:hidden;background:#f5f7fa;flex:0 0 auto;padding:0;cursor:pointer}',
    '.bbsm-viewed img{width:100%;height:100%;object-fit:cover;display:block}'
  ].join('\n');

  function getRecent() {
    try {
      var raw = JSON.parse(localStorage.getItem(RECENT_KEY));
      return Array.isArray(raw) ? raw : [];
    } catch (e) {
      return [];
    }
  }

  function setRecent(list) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  }

  function addRecent(term) {
    term = (term || '').trim();
    if (!term) return;
    var list = getRecent().filter(function (t) { return t !== term; });
    list.unshift(term);
    if (list.length > MAX_RECENT) list.length = MAX_RECENT;
    setRecent(list);
  }

  function getScopes() {
    try {
      var saved = JSON.parse(localStorage.getItem(SCOPE_KEY));
      if (!Array.isArray(saved)) return SCOPES.map(function (s) { return s.active; });
      return SCOPES.map(function (_, i) { return !!saved[i]; });
    } catch (e) {
      return SCOPES.map(function (s) { return s.active; });
    }
  }

  function setScopes(states) {
    localStorage.setItem(SCOPE_KEY, JSON.stringify(states));
  }

  function init() {
    var search = document.querySelector('.topbar-search, .app-search');
    if (!search || document.getElementById('bbSearchModal')) return;

    if (!document.getElementById('bbSearchModalCss')) {
      var style = document.createElement('style');
      style.id = 'bbSearchModalCss';
      style.textContent = css;
      document.head.appendChild(style);
    }

    var input = search.querySelector('input');
    if (!input) return;
    input.placeholder = '검색어 또는 URL을 입력해주세요.';

    var overlay = document.createElement('div');
    overlay.className = 'bbsm-ov';
    overlay.hidden = true;
    document.body.appendChild(overlay);

    var panel = document.createElement('div');
    panel.className = 'bbsm-panel';
    panel.id = 'bbSearchModal';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="bbsm-head">' +
        '<span class="bbsm-ai-chip">야후옥션 외 <b data-bbsm-active-count>2</b></span>' +
        '<button type="button" class="bbsm-close" aria-label="검색창 닫기">&times;</button>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">검색 범위 <span class="bbsm-count" data-bbsm-count>3</span></span><button type="button" class="bbsm-clearall" data-bbsm-scope-clear>선택 해제</button></div>' +
        '<button type="button" class="bbsm-scope-all" data-bbsm-scope-all><i class="fas fa-globe" aria-hidden="true"></i> 통합검색 · 8개 사이트 전체</button>' +
        '<div class="bbsm-scope-grid" data-bbsm-scopes></div>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">최근 검색어</span></div>' +
        '<div data-bbsm-recent></div>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">추천 검색어</span></div>' +
        '<ol class="bbsm-suggest-list" data-bbsm-suggest></ol>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">최근 본 상품</span><button type="button" class="bbsm-clearall" data-bbsm-view-clear>전체삭제</button></div>' +
        '<div class="bbsm-viewed-strip" data-bbsm-viewed></div>' +
      '</div>';
    document.body.appendChild(panel);

    var activeCountEl = panel.querySelector('[data-bbsm-active-count]');
    var countEl = panel.querySelector('[data-bbsm-count]');
    var scopesEl = panel.querySelector('[data-bbsm-scopes]');
    var recentEl = panel.querySelector('[data-bbsm-recent]');
    var suggestEl = panel.querySelector('[data-bbsm-suggest]');
    var viewedEl = panel.querySelector('[data-bbsm-viewed]');
    var states = getScopes();

    function updateScopeCount() {
      var count = states.filter(Boolean).length;
      countEl.textContent = String(count);
      activeCountEl.textContent = String(Math.max(count - 1, 0));
    }

    function renderScopes() {
      scopesEl.innerHTML = '';
      SCOPES.forEach(function (scope, index) {
        var button = document.createElement('button');
        button.type = 'button';
        button.className = 'bbsm-scope' + (states[index] ? ' active' : '');
        button.innerHTML = '<span class="bbsm-flag ' + scope.flag + '"></span>' + scope.label;
        button.addEventListener('click', function () {
          states[index] = !states[index];
          setScopes(states);
          renderScopes();
        });
        scopesEl.appendChild(button);
      });
      updateScopeCount();
    }

    function renderRecent() {
      recentEl.innerHTML = '';
      var list = getRecent();
      if (!list.length) {
        var empty = document.createElement('span');
        empty.className = 'bbsm-empty';
        empty.textContent = '최근 검색어가 없습니다.';
        recentEl.appendChild(empty);
        return;
      }
      var chips = document.createElement('div');
      chips.className = 'bbsm-scope-grid';
      list.slice(0, 4).forEach(function (term) {
        var chip = document.createElement('button');
        chip.type = 'button';
        chip.className = 'bbsm-scope';
        chip.textContent = term;
        chip.addEventListener('click', function () { runSearch(term); });
        chips.appendChild(chip);
      });
      recentEl.appendChild(chips);
    }

    SUGGESTED.forEach(function (term) {
      var li = document.createElement('li');
      li.textContent = term;
      li.addEventListener('click', function () { runSearch(term); });
      suggestEl.appendChild(li);
    });

    VIEWED.forEach(function (src) {
      var item = document.createElement('button');
      item.type = 'button';
      item.className = 'bbsm-viewed';
      item.innerHTML = '<img src="' + src + '" alt="최근 본 상품">';
      viewedEl.appendChild(item);
    });

    function runSearch(term) {
      input.value = term;
      addRecent(term);
      closePanel();
      search.submit();
    }

    // 검색창 바로 아래에 붙이고, 남은 화면 높이만큼만 차지하게 한다.
    function position() {
      var rect = search.getBoundingClientRect();
      var top = Math.max(rect.bottom + 6, 0);
      panel.style.top = top + 'px';
      panel.style.maxHeight = Math.max(window.innerHeight - top, 200) + 'px';
    }

    function openPanel() {
      renderRecent();
      renderScopes();
      overlay.hidden = false;
      panel.hidden = false;
      position();
    }

    function closePanel() {
      panel.hidden = true;
      overlay.hidden = true;
    }

    input.addEventListener('focus', openPanel);
    input.addEventListener('click', openPanel);

    overlay.addEventListener('click', closePanel);
    panel.querySelector('.bbsm-close').addEventListener('click', closePanel);

    panel.querySelector('[data-bbsm-scope-clear]').addEventListener('click', function () {
      states = states.map(function () { return false; });
      setScopes(states);
      renderScopes();
    });

    panel.querySelector('[data-bbsm-scope-all]').addEventListener('click', function () {
      states = states.map(function () { return true; });
      setScopes(states);
      renderScopes();
    });

    panel.querySelector('[data-bbsm-view-clear]').addEventListener('click', function () {
      viewedEl.innerHTML = '';
    });

    search.addEventListener('submit', function () {
      addRecent(input.value);
    });

    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      if (!panel.contains(e.target) && !search.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    window.addEventListener('resize', function () { if (!panel.hidden) position(); });
    window.addEventListener('scroll', function () { if (!panel.hidden) position(); }, true);
  }

  document.addEventListener('bb:mobile-login', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
