/* BidBuy search modal */
(function () {
  'use strict';

  var RECENT_KEY = 'bb_recent_searches';
  var SCOPE_KEY = 'bb_search_scopes';
  var MAX_RECENT = 20;
  var SUGGESTED = [
    '포켓몬 카드',
    '건프라',
    '다이빙 컴퓨터',
    '빈티지 시계',
    '재패니즈 위스키',
    '시마노릴',
    '이치방쿠지',
    '중고 필름카메라',
    'BE@RBRICK 1000%',
    '레고 테크닉'
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
    'https://images.unsplash.com/photo-1606813909359-0f2d6d766c13?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=140&q=80',
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=140&q=80'
  ];

  var css = [
    '.bbsm-wrap{position:relative;flex:0 0 540px;min-width:0;display:flex;align-items:center;gap:10px}',
    '.bbsm-close-btn{flex:0 0 auto;border:0;background:none;padding:0 2px;color:#4b5563;font-size:14px;font-weight:500;cursor:pointer;font-family:inherit;white-space:nowrap}',
    '.bbsm-close-btn[hidden]{display:none}',
    '.bbsm-wrap *{box-sizing:border-box}',
    '.bbsm-wrap .bbh-search{position:relative;flex:1 1 auto;min-width:0;border-color:#ff2f59;border-radius:7px;overflow:hidden;background:#f4f6f9}',
    '.bbsm-wrap .bbh-search input{background:#f4f6f9;padding-left:116px}',
    '.bbsm-panel{position:absolute;top:calc(100% + 1px);left:0;right:0;width:auto;overflow-x:hidden;background:#fff;border:1px solid #ff2f59;border-top:0;border-radius:0 0 5px 5px;box-shadow:0 4px 14px rgba(15,23,42,.18);padding:20px 20px 44px;z-index:950;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif;color:#111827}',
    '.bbsm-panel[hidden]{display:none}',
    '.bbsm-bar-chip{position:absolute;left:8px;top:50%;height:26px;transform:translateY(-50%);padding:0 10px;border-radius:6px;background:#f62f58;color:#fff;font-size:12px;font-weight:900;display:inline-flex;align-items:center;gap:4px;white-space:nowrap;max-width:40%;overflow:hidden;z-index:2;pointer-events:none;border:0;font-family:inherit}',
    '.bbsm-bar-chip[hidden]{display:none}',
    '.bbsm-bar-chip b{font-weight:900}',
    '.bbsm-section{width:100%;padding-bottom:20px}',
    '.bbsm-section+.bbsm-section{padding-top:18px;border-top:1px solid #eef1f5}',
    '.bbsm-row-head{width:100%;display:flex;align-items:center;justify-content:space-between;margin-bottom:13px}',
    '.bbsm-title{font-size:16px;font-weight:500;color:#111827}',
    '.bbsm-count{display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;margin-left:4px;border-radius:50%;background:#ffe3eb;color:#ef3158;font-size:11px;font-weight:800;vertical-align:1px}',
    '.bbsm-clearall{border:0;background:none;color:#9aa3b2;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;padding:0}',
    '.bbsm-scope-all{width:100%;height:42px;border:1px solid #dfe4ec;border-radius:7px;background:#fff;color:#6f7785;font-size:13px;display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:7px;cursor:pointer;font-family:inherit}',
    '.bbsm-scope-all.active{border-color:#ff2f59;background:#fff7f9;color:#f03259;font-weight:700}',
    '.bbsm-count[hidden],.bbsm-clearall[hidden]{display:none}',
    '.bbsm-scope-grid{width:100%;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:7px}',
    '.bbsm-scope{height:40px;padding:0 8px;border:1px solid #dfe4ec;border-radius:7px;background:#fff;color:#707783;font-size:12px;font-weight:500;display:flex;flex-direction:row;align-items:center;justify-content:center;gap:6px;cursor:pointer;font-family:inherit;white-space:nowrap}',
    '.bbsm-recent-clip{width:100%;overflow:hidden}',
    '.bbsm-recent-strip{display:flex;gap:7px;max-width:100%;overflow-x:auto;overflow-y:hidden;padding-bottom:18px;margin-bottom:-18px;scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch}',
    '.bbsm-recent-strip::-webkit-scrollbar{width:0;height:0;display:none;background:transparent}',
    '.bbsm-recent-chip{height:38px;min-width:96px;max-width:180px;padding:0 10px;border:1px solid #dfe4ec;border-radius:7px;background:#fff;color:#707783;font-size:13px;font-weight:500;display:inline-flex;align-items:center;justify-content:space-between;gap:8px;flex:0 0 auto;font-family:inherit}',
    '.bbsm-recent-label{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}',
    '.bbsm-recent-remove{width:18px;height:18px;border:0;border-radius:50%;background:#f1f3f6;color:#9aa3b2;font-size:11px;line-height:18px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer;flex:0 0 auto;padding:0}',
    '.bbsm-recent-remove:hover{background:#ffe3eb;color:#ef3158}',
    '.bbsm-scope.active{border-color:#ff2f59;background:#fff7f9;color:#f03259}',
    '.bbsm-flag{width:20px;height:14px;border-radius:2px;box-shadow:0 0 0 1px rgba(0,0,0,.08);display:inline-block;position:relative;background:#fff;overflow:hidden;flex:0 0 auto}',
    '.bbsm-flag.jp::before{content:"";position:absolute;left:50%;top:50%;width:8px;height:8px;margin:-4px 0 0 -4px;border-radius:50%;background:#c9002b}',
    '.bbsm-flag.us{background:linear-gradient(#b22234 0 14%,#fff 14% 28%,#b22234 28% 42%,#fff 42% 56%,#b22234 56% 70%,#fff 70% 84%,#b22234 84%)}',
    '.bbsm-flag.us::before{content:"";position:absolute;left:0;top:0;width:9px;height:8px;background:#24458f}',
    '.bbsm-flag.uk{background:#17468f}',
    '.bbsm-flag.uk::before{content:"";position:absolute;inset:0;background:linear-gradient(32deg,transparent 41%,#fff 41% 48%,#d71920 48% 54%,#fff 54% 61%,transparent 61%),linear-gradient(148deg,transparent 41%,#fff 41% 48%,#d71920 48% 54%,#fff 54% 61%,transparent 61%),linear-gradient(90deg,transparent 42%,#fff 42% 58%,transparent 58%),linear-gradient(0deg,transparent 35%,#fff 35% 65%,transparent 65%)}',
    '.bbsm-hint{display:block;margin-top:10px;color:#a6adba;font-size:12px}',
    '.bbsm-empty{color:#a6adba;font-size:13px}',
    '.bbsm-suggest-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));column-gap:22px;row-gap:13px;counter-reset:bbsm-count}',
    '.bbsm-suggest-list.is-collapsed li.is-extra{display:none}',
    '.bbsm-suggest-list li{display:grid;grid-template-columns:20px minmax(0,1fr);gap:0;align-items:center;font-size:14px;color:#555b66;cursor:pointer;counter-increment:bbsm-count;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bbsm-suggest-list li::before{content:counter(bbsm-count);color:#6d7280;font-size:14px;font-weight:400}',
    '.bbsm-suggest-list li:hover{color:#ef3158}',
    '.bbsm-suggest-toggle{margin-top:14px;border:0;background:none;color:#ef3158;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit;padding:0}',
    '.bbsm-viewed-strip{display:flex;gap:8px;max-width:100%;overflow-x:auto;overflow-y:hidden;padding-bottom:4px;scrollbar-width:thin;-webkit-overflow-scrolling:touch}',
    '.bbsm-viewed{width:74px;height:72px;border:1px solid #e3e7ee;border-radius:6px;overflow:hidden;background:#f5f7fa;flex:0 0 auto;padding:0;cursor:pointer}',
    '.bbsm-viewed img{width:100%;height:100%;object-fit:cover;display:block}',
    '@media (max-width:720px){.bbsm-wrap{flex:1 1 auto}.bbsm-panel{left:50%;transform:translateX(-50%);width:min(540px,calc(100vw - 24px))}.bbsm-scope-grid{gap:6px}.bbsm-scope{font-size:11px;height:38px}.bbsm-suggest-list{grid-template-columns:repeat(3,minmax(0,1fr));column-gap:10px;row-gap:10px}.bbsm-suggest-list li{grid-template-columns:16px minmax(0,1fr);font-size:12px}.bbsm-suggest-list li::before{font-size:12px}}'
  ].join('\n');

  function getRecent() {
    try {
      var raw = JSON.parse(localStorage.getItem(RECENT_KEY));
      return Array.isArray(raw) ? raw.slice(0, MAX_RECENT) : [];
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
    var search = document.querySelector('.bbh-search');
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

    var wrap = document.createElement('div');
    wrap.className = 'bbsm-wrap';
    search.parentNode.insertBefore(wrap, search);
    wrap.appendChild(search);

    // 선택한 검색 범위 요약 칩을 검색창 안쪽에 넣는다.
    var barChip = document.createElement('span');
    barChip.className = 'bbsm-bar-chip';
    barChip.hidden = true;
    search.insertBefore(barChip, input);

    var closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.className = 'bbsm-close-btn';
    closeBtn.textContent = '닫기';
    closeBtn.hidden = true;
    wrap.appendChild(closeBtn);

    var panel = document.createElement('div');
    panel.className = 'bbsm-panel';
    panel.id = 'bbSearchModal';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">검색 범위 <span class="bbsm-count" data-bbsm-count>3</span></span><button type="button" class="bbsm-clearall" data-bbsm-scope-clear>선택 해제</button></div>' +
        '<button type="button" class="bbsm-scope-all" data-bbsm-scope-all><i class="fas fa-globe" aria-hidden="true"></i> 통합검색 · 8개 사이트 전체</button>' +
        '<div class="bbsm-scope-grid" data-bbsm-scopes></div>' +
        '<span class="bbsm-hint">마지막 선택은 이 기기에 기억됩니다.</span>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">최근 검색어</span></div>' +
        '<div data-bbsm-recent></div>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">최근 본 상품</span><button type="button" class="bbsm-clearall" data-bbsm-view-clear>전체삭제</button></div>' +
        '<div class="bbsm-viewed-strip" data-bbsm-viewed></div>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">추천 검색어</span></div>' +
        '<ol class="bbsm-suggest-list is-collapsed" data-bbsm-suggest></ol>' +
        '<button type="button" class="bbsm-suggest-toggle" data-bbsm-suggest-toggle hidden>더보기</button>' +
      '</div>';
    wrap.appendChild(panel);

    var countEl = panel.querySelector('[data-bbsm-count]');
    var scopeAllEl = panel.querySelector('[data-bbsm-scope-all]');
    var scopeClearEl = panel.querySelector('[data-bbsm-scope-clear]');
    var scopesEl = panel.querySelector('[data-bbsm-scopes]');
    var recentEl = panel.querySelector('[data-bbsm-recent]');
    var suggestEl = panel.querySelector('[data-bbsm-suggest]');
    var suggestToggleEl = panel.querySelector('[data-bbsm-suggest-toggle]');
    var viewedEl = panel.querySelector('[data-bbsm-viewed]');
    var states = getScopes();
    var suggestExpanded = false;

    function suggestVisibleLimit() {
      return window.matchMedia('(max-width:720px)').matches ? 3 : 6;
    }

    function updateSuggestCollapse() {
      var limit = suggestVisibleLimit();
      var items = Array.prototype.slice.call(suggestEl.children);
      items.forEach(function (item, index) {
        item.classList.toggle('is-extra', index >= limit);
      });
      suggestEl.classList.toggle('is-collapsed', !suggestExpanded);
      suggestToggleEl.hidden = items.length <= limit;
      suggestToggleEl.textContent = suggestExpanded ? '접기' : '더보기';
    }

    function updateScopeCount() {
      var count = states.filter(Boolean).length;
      var firstIdx = states.indexOf(true);
      // 개별 선택이 없으면 통합검색 상태로 보고 검색창 칩은 숨긴다.
      countEl.textContent = String(count);
      countEl.hidden = count === 0;
      scopeClearEl.hidden = count === 0;
      scopeAllEl.classList.toggle('active', count === 0);
      if (firstIdx < 0 || panel.hidden) {
        barChip.hidden = true;
        return;
      }
      barChip.hidden = false;
      barChip.innerHTML = SCOPES[firstIdx].label +
        (count > 1 ? ' 외 <b>' + (count - 1) + '</b>' : '');
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
          button.classList.toggle('active', states[index]);
          updateScopeCount();
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
      var clip = document.createElement('div');
      clip.className = 'bbsm-recent-clip';

      var chips = document.createElement('div');
      chips.className = 'bbsm-recent-strip';
      list.forEach(function (term) {
        var chip = document.createElement('span');
        chip.className = 'bbsm-recent-chip';

        var label = document.createElement('span');
        label.className = 'bbsm-recent-label';
        label.textContent = term;
        label.addEventListener('click', function () { runSearch(term); });

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.className = 'bbsm-recent-remove';
        remove.setAttribute('aria-label', term + ' 삭제');
        remove.textContent = 'x';
        remove.addEventListener('click', function (e) {
          e.stopPropagation();
          setRecent(getRecent().filter(function (t) { return t !== term; }));
          renderRecent();
        });

        chip.appendChild(label);
        chip.appendChild(remove);
        chips.appendChild(chip);
      });
      clip.appendChild(chips);
      recentEl.appendChild(clip);
    }

    SUGGESTED.forEach(function (term) {
      var li = document.createElement('li');
      li.textContent = term;
      li.addEventListener('click', function () { runSearch(term); });
      suggestEl.appendChild(li);
    });
    updateSuggestCollapse();
    suggestToggleEl.addEventListener('click', function () {
      suggestExpanded = !suggestExpanded;
      updateSuggestCollapse();
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

    function openPanel() {
      panel.hidden = false;
      closeBtn.hidden = false;
      renderRecent();
      renderScopes();
    }

    function closePanel() {
      panel.hidden = true;
      closeBtn.hidden = true;
      barChip.hidden = true;
    }

    input.addEventListener('focus', openPanel);
    input.addEventListener('click', openPanel);

    closeBtn.addEventListener('click', closePanel);

    scopeClearEl.addEventListener('click', function () {
      states = states.map(function () { return false; });
      setScopes(states);
      renderScopes();
    });

    scopeAllEl.addEventListener('click', function () {
      states = states.map(function () { return false; });
      setScopes(states);
      renderScopes();
    });

    panel.querySelector('[data-bbsm-view-clear]').addEventListener('click', function () {
      viewedEl.innerHTML = '';
    });

    search.addEventListener('submit', function () {
      addRecent(input.value);
      closePanel();
    });

    document.addEventListener('click', function (e) {
      if (panel.hidden) return;
      // 다시 그리는 동안 DOM에서 제거된 요소 클릭은 바깥 클릭으로 보지 않는다.
      if (!document.contains(e.target)) return;
      if (!wrap.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    window.addEventListener('resize', updateSuggestCollapse);
  }

  document.addEventListener('bb:login', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();


