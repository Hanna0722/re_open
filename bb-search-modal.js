/* ============================================================
   BidBuy search modal
   - Opens under the shared .bbh-search box (from bb-common.js)
     when the search input is focused/clicked
   - Tracks recent searches in localStorage, shows recommended
     keywords and promo banners
   ============================================================ */
(function () {
  'use strict';

  var RECENT_KEY = 'bb_recent_searches';
  var MAX_RECENT = 8;
  var DEFAULT_RECENT = ['나이키', '일본 위스키', '다이마루', '트랜스포머', 'DARTH VADER'];
  var SUGGESTED = ['다이빙 컴퓨터', '영국 봉주르 와인', 'Babysense', 'Binaural Hemi-Sync 명상음악'];
  var PROMOS = [
    '야후일본 경매 초가성비 Top10 보기',
    '2026년 여름시즌 비드바이코리아 특별 할인',
    '포인트 1+1 혜택 아이템 이벤트'
  ];

  var css = [
    '.bbsm-wrap{position:relative;flex:0 0 520px;min-width:0}',
    '.bbsm-wrap .bbh-search{flex:none;width:100%}',
    '.bbsm-panel{position:absolute;top:calc(100% + 8px);left:0;width:100%;background:#fff;border:1px solid #E0E4EB;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,.14);padding:20px;z-index:950;font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif}',
    '.bbsm-panel[hidden]{display:none}',
    '.bbsm-section+.bbsm-section{margin-top:18px;padding-top:18px;border-top:1px solid #eee}',
    '.bbsm-row-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.bbsm-title{font-size:14px;font-weight:800;color:#1A1A2E}',
    '.bbsm-clearall{border:0;background:none;color:#9aa3b2;font-size:12px;font-weight:600;display:flex;align-items:center;gap:4px;cursor:pointer;font-family:inherit;padding:0}',
    '.bbsm-clearall i{font-size:10px}',
    '.bbsm-chips{display:flex;flex-wrap:wrap;gap:8px}',
    '.bbsm-chip{display:inline-flex;align-items:center;gap:8px;padding:7px 12px;border-radius:999px;background:#F5F7FA;color:#1A1A2E;font-size:13px;font-weight:600}',
    '.bbsm-chip span{cursor:pointer}',
    '.bbsm-chip button{border:0;background:none;color:#9aa3b2;font-size:11px;padding:0;cursor:pointer;display:flex;align-items:center}',
    '.bbsm-empty{color:#9aa3b2;font-size:12px}',
    '.bbsm-suggest-list{list-style:none;margin:0;padding:0;display:grid;gap:10px;counter-reset:bbsm-count}',
    '.bbsm-suggest-list li{display:flex;align-items:center;gap:10px;font-size:13px;color:#333;cursor:pointer;counter-increment:bbsm-count;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}',
    '.bbsm-suggest-list li::before{content:counter(bbsm-count);flex:0 0 auto;color:#9aa3b2;font-size:12px;font-weight:700}',
    '.bbsm-suggest-list li:hover{color:#E8385A}',
    '.bbsm-promos{display:grid;gap:10px}',
    '.bbsm-promo{display:flex;align-items:center;justify-content:space-between;padding:14px 16px;border-radius:10px;background:#FCEAED;color:#C42F4C;font-size:13px;font-weight:800;text-decoration:none}',
    '.bbsm-promo i{font-size:11px}'
  ].join('\n');

  function getRecent() {
    try {
      var raw = JSON.parse(localStorage.getItem(RECENT_KEY));
      return Array.isArray(raw) ? raw : DEFAULT_RECENT.slice();
    } catch (e) {
      return DEFAULT_RECENT.slice();
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

    var wrap = document.createElement('div');
    wrap.className = 'bbsm-wrap';
    search.parentNode.insertBefore(wrap, search);
    wrap.appendChild(search);

    var panel = document.createElement('div');
    panel.className = 'bbsm-panel';
    panel.id = 'bbSearchModal';
    panel.hidden = true;
    panel.innerHTML =
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">최근 검색어</span>' +
          '<button type="button" class="bbsm-clearall" data-bbsm-clear>전체삭제 <i class="fas fa-times" aria-hidden="true"></i></button>' +
        '</div>' +
        '<div class="bbsm-chips" data-bbsm-recent></div>' +
      '</div>' +
      '<div class="bbsm-section">' +
        '<div class="bbsm-row-head"><span class="bbsm-title">추천 검색어</span></div>' +
        '<ol class="bbsm-suggest-list" data-bbsm-suggest></ol>' +
      '</div>' +
      '<div class="bbsm-section bbsm-promos" data-bbsm-promos></div>';
    wrap.appendChild(panel);

    var recentEl = panel.querySelector('[data-bbsm-recent]');
    var suggestEl = panel.querySelector('[data-bbsm-suggest]');
    var promoEl = panel.querySelector('[data-bbsm-promos]');

    SUGGESTED.forEach(function (term) {
      var li = document.createElement('li');
      li.textContent = term;
      li.addEventListener('click', function () { runSearch(term); });
      suggestEl.appendChild(li);
    });

    PROMOS.forEach(function (text) {
      var a = document.createElement('a');
      a.href = '#';
      a.className = 'bbsm-promo';
      a.innerHTML = '<span>' + text + '</span><i class="fas fa-chevron-right" aria-hidden="true"></i>';
      a.addEventListener('click', function (e) { e.preventDefault(); });
      promoEl.appendChild(a);
    });

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
      list.forEach(function (term) {
        var chip = document.createElement('span');
        chip.className = 'bbsm-chip';

        var label = document.createElement('span');
        label.textContent = term;
        label.addEventListener('click', function () { runSearch(term); });

        var remove = document.createElement('button');
        remove.type = 'button';
        remove.setAttribute('aria-label', term + ' 삭제');
        remove.innerHTML = '<i class="fas fa-times" aria-hidden="true"></i>';
        remove.addEventListener('click', function (e) {
          e.stopPropagation();
          setRecent(getRecent().filter(function (t) { return t !== term; }));
          renderRecent();
        });

        chip.appendChild(label);
        chip.appendChild(remove);
        recentEl.appendChild(chip);
      });
    }

    function runSearch(term) {
      input.value = term;
      addRecent(term);
      closePanel();
      search.submit();
    }

    function openPanel() {
      renderRecent();
      panel.hidden = false;
    }

    function closePanel() {
      panel.hidden = true;
    }

    input.addEventListener('focus', openPanel);
    input.addEventListener('click', openPanel);

    panel.querySelector('[data-bbsm-clear]').addEventListener('click', function () {
      setRecent([]);
      renderRecent();
    });

    search.addEventListener('submit', function () {
      addRecent(input.value);
    });

    document.addEventListener('click', function (e) {
      if (!wrap.contains(e.target)) closePanel();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });
  }

  document.addEventListener('bb:login', init);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
