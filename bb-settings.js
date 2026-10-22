/* ============================================================
   BidBuy 관리자 설정 로더
   - 서버(/api/settings)에서 설정을 동기로 읽어 window.BB_SETTINGS 에 담는다.
   - 서버가 없으면(파일로 직접 열기 등) 마지막 캐시를 쓰고, 그것도 없으면
     null → 각 페이지에 적힌 기본값이 그대로 쓰인다.
   - 등급 혜택 카드(.benefit-grid)는 설정 값으로 다시 그린다.
   ============================================================ */
(function () {
  'use strict';
  var CACHE_KEY = 'bb_settings_cache';
  var settings = null;

  try {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/api/settings', false);
    xhr.send();
    if (xhr.status === 200) {
      settings = JSON.parse(xhr.responseText);
      try { localStorage.setItem(CACHE_KEY, xhr.responseText); } catch (e) {}
    }
  } catch (e) {}
  if (!settings) {
    try { settings = JSON.parse(localStorage.getItem(CACHE_KEY)); } catch (e) {}
  }
  window.BB_SETTINGS = settings || null;
  /* bbSetting('fees.exchangeRate', 9.1) : 설정값이 있으면 그 값, 없으면 fallback */
  window.bbSetting = function (path, fallback) {
    var v = path.split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, settings);
    return v == null ? fallback : v;
  };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function row(label, val, sub, muted) {
    return '<div class="benefit-row"><p class="br-label">' + label + '</p>' +
      (val !== null ? '<p class="br-val' + (muted ? ' muted' : '') + '">' + val + '</p>' : '') +
      (sub ? '<p class="br-sub">' + esc(sub) + '</p>' : '') + '</div>';
  }
  function divider(t) { return '<div class="benefit-section-divider">' + t + '</div>'; }

  function renderGrades() {
    if (!settings) return;
    settings.grades.forEach(function (g) {
      var col = document.querySelector('.benefit-col-' + g.key);
      if (!col) return;
      var sub = col.querySelector('.bc-sub');
      if (sub) sub.textContent = g.condition;
      var rows = col.querySelector('.benefit-rows');
      if (!rows) return;
      var html =
        divider('마일리지 혜택') +
        row('월간 마일리지', esc(g.monthlyMileage)) +
        row('구매수수료 적립률', esc(g.accrualRate)) +
        divider('배송 혜택') +
        row('무료 보관', esc(g.freeStorage)) +
        row('묶음 배송 비용', esc(g.bundleFee)) +
        (g.shippingDiscount
          ? row('국제운임 할인율', esc(g.shippingDiscount), g.shippingNote)
          : row('국제운임 할인율', '-', g.shippingNote, true)) +
        divider('생일 혜택') +
        row('비드바이항공특송 국제운임 쿠폰', esc(g.birthdayCoupon));
      if (g.extras && g.extras.length) {
        html += divider(esc(g.name) + ' 전용');
        g.extras.forEach(function (x) {
          html += x.value
            ? row(esc(x.label), esc(x.value), x.sub)
            : row('<i class="fas fa-gift" aria-hidden="true"></i> ' + esc(x.label), null, x.sub);
        });
      }
      rows.innerHTML = html;
    });
  }

  /* 모바일 등급 카드(#bp-std 등) */
  var M_CARD = { std: 'standard', pre: 'premium', vip: 'vip', prs: 'prestige' };
  function mrow(label, val, sub, muted) {
    return '<div class="bc-row"><span class="bc-label">' + label + '</span>' +
      (val !== null ? '<span class="bc-val' + (muted ? ' muted' : '') + '"' + (!muted && String(val).length > 12 ? ' style="font-size:13px"' : '') + '>' + val +
        (sub ? '<small class="bc-subnote">' + esc(sub) + '</small>' : '') + '</span>' : '') + '</div>';
  }
  function renderMobileGrades() {
    if (!settings) return;
    Object.keys(M_CARD).forEach(function (id) {
      var card = document.getElementById('bp-' + id);
      var g = card && settings.grades.filter(function (x) { return x.key === M_CARD[id]; })[0];
      if (!g) return;
      var cond = card.querySelector('.bc-cond');
      if (cond) cond.textContent = g.condition;
      var body = card.querySelector('.bc-body');
      if (!body) return;
      var d = function (t) { return '<div class="bc-divider">' + t + '</div>'; };
      var html = d('마일리지 혜택') + mrow('월간 마일리지', esc(g.monthlyMileage)) + mrow('구매수수료 적립률', esc(g.accrualRate)) +
        d('배송 혜택') + mrow('무료 보관', esc(g.freeStorage)) + mrow('묶음 배송 비용', esc(g.bundleFee)) +
        (g.shippingDiscount ? mrow('국제운임 할인율', esc(g.shippingDiscount), g.shippingNote) : mrow('국제운임 할인율', '-', g.shippingNote, true)) +
        d('생일 혜택') + mrow('비드바이항공특송 국제운임 쿠폰', esc(g.birthdayCoupon));
      if (g.extras && g.extras.length) {
        html += d(esc(g.name) + ' 전용');
        g.extras.forEach(function (x) {
          html += x.value ? mrow(esc(x.label), esc(x.value), x.sub) : mrow('<i class="fas fa-gift" aria-hidden="true"></i> ' + esc(x.label), null);
        });
      }
      body.innerHTML = html;
    });
  }

  /* 모바일 메인에 박힌 말풍선 문구 */
  function applyTexts() {
    var t = settings && settings.texts && settings.texts.bellTip;
    if (!t) return;
    document.querySelectorAll('#couponTip').forEach(function (el) { el.textContent = t; });
  }

  /* ── 고객 청구 금액: data-charge="id" 를 가진 요소의 숫자를 설정값으로 교체 ── */
  function fmt(n) { return Number(n).toLocaleString('ko-KR'); }
  function applyCharges(root) {
    var c = settings && settings.charges;
    if (!c) return;
    (root || document).querySelectorAll('[data-charge]').forEach(function (el) {
      var v = c[el.getAttribute('data-charge')];
      if (v != null) el.textContent = fmt(v);
    });
    (root || document).querySelectorAll('[data-charge-yen]').forEach(function (el) {
      var v = c[el.getAttribute('data-charge-yen')];
      if (v != null) el.setAttribute('data-paid-option-yen', v);
    });
  }
  window.bbApplyCharges = applyCharges;

  /* ── 메뉴명/문구: 화면 글자가 정확히 일치하면 관리자가 지정한 이름으로 교체 ── */
  function applyLabels() {
    var map = settings && settings.labels;
    if (!map || !document.body) return;
    var walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null);
    var node;
    while ((node = walker.nextNode())) {
      var p = node.parentNode;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.nodeName)) continue;
      var key = node.nodeValue.trim();
      if (key && map[key] && map[key] !== key) node.nodeValue = node.nodeValue.replace(key, map[key]);
    }
  }
  window.bbApplyLabels = applyLabels;

  function applyAll() { renderGrades(); renderMobileGrades(); applyTexts(); applyCharges(); applyLabels(); }
  window.addEventListener('load', applyAll);
  /* 스크립트가 동적으로 만드는 안내문 속 금액도 즉시 교체 */
  if (settings && settings.charges && window.MutationObserver) {
    new MutationObserver(function (list) {
      list.forEach(function (m) {
        m.addedNodes.forEach(function (n) { if (n.nodeType === 1) applyCharges(n); });
      });
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', applyAll);
  else applyAll();
})();
