/* 비용계산기 (웹/모바일 공용) — 좌측 드로어의 '비용 계산기'를 누르면 드로어 내용이 계산기로 바뀐다.
   웹: web/bb-common.js, 모바일: mobile/bb-common-mobile.js 가 이 파일을 불러온다.
   ※ RATES 중 일본 대행수수료는 실제 요율표 기준, 일본 운송료·송금수수료와 미국/영국 요율은 시안용 임시 값이다. */
(function () {
  'use strict';

  var LEVELS = [['8', 'Standard'], ['5', 'Premium'], ['4', 'VIP'], ['3', 'Prestige']];
  var DEFAULT_LEVEL = '5';

  var COUNTRIES = [
    { id: 'JP', name: '일본', flag: 'jp_circle.png', cur: 'JPY', sym: '¥', tax: 10, rate: 8.9, dec: 0, needWeight: false,
      methods: [['hubnet', '비드바이항공특송'], ['panstarship', '비드바이 선편특송'], ['ems', 'EMS']] },
    { id: 'US', name: '미국', flag: 'us_circle.png', cur: 'USD', sym: '$', tax: 7.75, rate: 1390, dec: 2, needWeight: true, lbs: true,
      methods: [['usepantos', '비드바이특송']] },
    { id: 'UK', name: '영국', flag: 'uk_circle.png', cur: 'GBP', sym: '£', tax: 19, rate: 1840, dec: 2, needWeight: true,
      methods: [['ukepantos', '비드바이특송']] }
  ];

  /* ---- 임시 요율 (현지통화) ---- */
  var RATES = {
    remit: { JP: 300, US: 0, UK: 0 },
    /* 일본 대행수수료 — 물품가(상품가격×수량, 소비세 제외) 구간별. 값이 1 이상이면 정액(¥), 1 미만이면 물품가의 비율
       등급 순서: [Standard(8), Premium(5), VIP(4), Prestige(3)] */
    JP_tiers: [5000, 15000, 50000, 150000, Infinity],
    JP_buy: [[500, 500, 500, 500], [800, 700, 600, 600], [0.09, 0.07, 0.05, 0.05], [5000, 4000, 3000, 3000], [0.05, 0.04, 0.03, 0.03]],
    JP_auction: [[800, 700, 600, 600], [900, 800, 700, 600], [0.09, 0.07, 0.05, 0.05], [5000, 4000, 3000, 3000], [0.05, 0.04, 0.03, 0.03]],
    /* 미국/영국 대행수수료 = max(최소수수료, 현지구매비용 × 비율) — 임시 값 */
    agency: {
      US: { pct: { 8: 0.10, 5: 0.08, 4: 0.07, 3: 0.06 }, min: { 8: 8, 5: 7, 4: 6, 3: 5 } },
      UK: { pct: { 8: 0.10, 5: 0.08, 4: 0.07, 3: 0.06 }, min: { 8: 6, 5: 5, 4: 4, 3: 3 } }
    },
    /* 국제운송료 = base + perUnit × 적용무게(0.5 단위 올림) — JP/UK 는 kg, US 는 lbs 기준 */
    ship: {
      hubnet: { base: 0, perUnit: 1100 }, panstarship: { base: 0, perUnit: 700 }, ems: { base: 1400, perUnit: 900 },
      usepantos: { base: 0, perUnit: 4 }, ukepantos: { base: 0, perUnit: 6 }
    }
  };

  var CSS = [
    '.bbd.is-calc>*:not(.bbc-view),.drawer.is-calc>*:not(.bbc-view){display:none!important}',
    '.bbc-view{display:none;flex-direction:column;flex:1 1 auto;min-height:0;background:#fff;color:#1f2530;font-size:14px}',
    '.is-calc>.bbc-view{display:flex}',
    '.bbc-top{display:flex;align-items:center;justify-content:space-between;min-height:58px;padding:12px 16px;flex:0 0 auto}',
    '.bbc-top h2{margin:0;font-size:18px;font-weight:700}',
    '.bbc-top button{width:32px;height:32px;border:0;background:none;font-size:20px;color:#1f2530;cursor:pointer;font-family:inherit}',
    '.bbc-body{flex:1 1 auto;overflow-y:auto;padding:0 16px 24px;scrollbar-width:thin}',
    '.bbc-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:12px}',
    '.bbc-sub{font-size:13px;color:#4B5563}',
    '.bbc-reset{height:28px;padding:0 12px;border:1px solid #E0E4EB;border-radius:14px;background:#fff;color:#4B5563;font-size:12px;font-weight:600;font-family:inherit;cursor:pointer}',
    '.bbc-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));border:1px solid #E0E4EB}',
    '.bbc-tabs button{height:44px;border:0;border-left:1px solid #E0E4EB;background:#fff;color:#555;font-family:inherit;font-size:14px;font-weight:600;display:flex;align-items:center;justify-content:center;gap:6px;cursor:pointer;border-radius:0}',
    '.bbc-tabs button:first-child{border-left:0}',
    '.bbc-tabs button.active{outline:2px solid #E8385A;outline-offset:-2px;color:#1f2530}',
    '.bbc-tabs img{width:20px;height:20px;border-radius:50%;object-fit:cover}',
    '.bbc-panel{display:none}.bbc-panel.active{display:block}',
    '.bbc-form{list-style:none;margin:0;padding:0}',
    '.bbc-form>li{display:grid;grid-template-columns:62px minmax(0,1fr);align-items:center;column-gap:8px;margin-top:14px}',
    '.bbc-form .t{font-size:13px;color:#4B5563}',
    '.bbc-wrap{display:flex;align-items:center;gap:8px;min-width:0}',
    '.bbc-wrap input[type=text],.bbc-wrap select{flex:1 1 auto;min-width:0;height:40px;border:1px solid #E0E4EB;border-radius:6px;padding:0 10px;font-size:14px;font-family:inherit;color:#1f2530;background:#fff;box-sizing:border-box}',
    '.bbc-wrap input[readonly]{background:#F1F2F4;color:#6B7280}',
    '.bbc-wrap input:focus,.bbc-wrap select:focus{outline:0;border-color:#E8385A}',
    '.bbc-wrap small{flex:0 0 34px;font-size:12px;color:#6B7280}',
    '.bbc-wrap select{flex:1 1 auto}',
    '.bbc-wrap.lbs select{flex:0 0 72px}',
    '.bbc-size{flex-wrap:wrap;row-gap:6px}',
    '.bbc-size input[type=text]{flex:1 1 0;width:0;padding:0 4px;text-align:center}',
    '.bbc-size span{font-size:12px;color:#6B7280}',
    '.bbc-size .bbc-note{flex:0 0 100%;margin:0;font-size:11px;color:#6B7280}',
    '.bbc-chk{display:flex;gap:14px;flex-wrap:wrap}',
    '.bbc-chk label{display:inline-flex;align-items:center;gap:6px;font-size:13px;cursor:pointer}',
    '.bbc-chk input{appearance:none;-webkit-appearance:none;width:18px;height:18px;margin:0;border:1.5px solid #9AA1AD;border-radius:4px;background:#fff center/12px no-repeat;cursor:pointer;flex:0 0 auto}',
    '.bbc-chk input:checked{background-color:#E8385A;border-color:#E8385A;background-image:url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 12 12\'%3E%3Cpath d=\'M2.5 6.2l2.4 2.4 4.6-5\' fill=\'none\' stroke=\'%23fff\' stroke-width=\'1.8\' stroke-linecap=\'round\' stroke-linejoin=\'round\'/%3E%3C/svg%3E")}',
    '.bbc-result{margin-top:18px;display:grid;gap:10px}',
    '.bbc-group{margin:0;padding:12px;border:1px solid #E0E4EB;border-radius:10px;background:#F8F9FB;list-style:none}',
    '.bbc-group li{display:flex;justify-content:space-between;gap:8px;padding:3px 0;font-size:13px}',
    '.bbc-group li:first-child{padding-bottom:6px;margin-bottom:4px;border-bottom:1px solid #E0E4EB;font-size:14px;font-weight:700}',
    '.bbc-group li.sum-first{margin-top:4px;padding-top:6px;border-top:1px solid #E0E4EB}',
    '.bbc-empty{margin:0;padding:18px 0;text-align:center;font-size:13px;color:#6B7280}',
    '.bbc-tariff{margin-top:16px;padding:12px;border-radius:8px;background:#F5F7FA;font-size:12px;line-height:1.55;color:#4B5563}',
    '.bbc-tariff b{display:block;margin-bottom:4px;color:#1f2530}',
    '.bbc-tariff a{display:block;margin-top:10px;height:34px;line-height:32px;text-align:center;border:1px solid #D5D9E0;border-radius:5px;background:#fff;color:#1f2530;font-weight:600;text-decoration:none}'
  ].join('\n');

  var view = null;

  function el(html) { var d = document.createElement('div'); d.innerHTML = html; return d.firstChild; }
  function num(v) { var n = parseFloat(String(v == null ? '' : v).replace(/,/g, '')); return isFinite(n) ? n : 0; }
  function fmt(n, dec) { return n.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec }); }
  function q(root, role) { return root.querySelector('[data-role="' + role + '"]'); }

  function panelHTML(c, idx) {
    var levelOpts = LEVELS.map(function (l) { return '<option value="' + l[0] + '"' + (l[0] === DEFAULT_LEVEL ? ' selected' : '') + '>' + l[1] + '</option>'; }).join('');
    var sizeUnit = c.lbs ? ['inch', 'lbs'] : ['cm', 'kg'];
    var weightCtl = c.lbs
      ? '<div class="bbc-wrap lbs"><input type="text" placeholder="00" inputmode="decimal" data-role="weight"><select data-role="weightUnit"><option value="lbs" selected>Lbs</option><option value="kg">Kg</option></select><small data-role="weightPound"></small></div>'
      : '<div class="bbc-wrap"><input type="text" placeholder="00" inputmode="decimal" data-role="weight"><small>kg</small></div>';
    return (
      '<div class="bbc-panel' + (idx === 0 ? ' active' : '') + '" data-idx="' + idx + '" data-country="' + c.id + '">' +
      '<ul class="bbc-form">' +
        (c.id === 'JP' ? '<li><span class="t">구매유형</span><div class="bbc-chk">' +
          '<label><input type="radio" name="bbc-type-JP" value="buy" data-role="jpType" checked>구매대행</label>' +
          '<label><input type="radio" name="bbc-type-JP" value="auction" data-role="jpType">경매/메루카리</label></div></li>' : '') +
        '<li><span class="t">소비세</span><div class="bbc-chk">' +
          '<label><input type="radio" name="bbc-tax-' + c.id + '" value="' + c.tax + '" data-role="tax" checked>소비세 적용(' + c.tax + '%)</label>' +
          '<label><input type="radio" name="bbc-tax-' + c.id + '" value="0" data-role="tax">미적용</label></div></li>' +
        '<li><span class="t">상품가격</span><div class="bbc-wrap"><input type="text" placeholder="00" inputmode="decimal" data-role="itemPrice" data-comma><small>' + c.cur + '</small></div></li>' +
        '<li><span class="t">주문수량</span><div class="bbc-wrap"><input type="text" value="1" inputmode="numeric" data-role="quantity"><small>개</small></div></li>' +
        '<li><span class="t">회원등급</span><div class="bbc-wrap"><select data-role="level">' + levelOpts + '</select></div></li>' +
        '<li><span class="t">현지배송료</span><div class="bbc-wrap"><input type="text" placeholder="00" inputmode="decimal" data-role="localDeliveryFee" data-comma><small>' + c.cur + '</small></div></li>' +
        '<li><span class="t">송금수수료</span><div class="bbc-wrap"><input type="text" value="-" readonly data-role="remitFee"><small>' + c.cur + '</small></div></li>' +
        '<li><span class="t">예상무게</span>' + weightCtl + '</li>' +
        '<li><span class="t">예상사이즈</span><div class="bbc-wrap bbc-size">' +
          '<input type="text" placeholder="00" inputmode="decimal" data-role="width"><span>X</span>' +
          '<input type="text" placeholder="00" inputmode="decimal" data-role="height"><span>X</span>' +
          '<input type="text" placeholder="00" inputmode="decimal" data-role="length"><span>=</span>' +
          '<input type="text" placeholder="00" readonly data-role="volumeWeight">' +
          '<p class="bbc-note">가로(' + sizeUnit[0] + ') X 세로(' + sizeUnit[0] + ') X 높이(' + sizeUnit[0] + ') = 부피(' + sizeUnit[1] + ')</p></div></li>' +
      '</ul>' +
      '<div class="bbc-result" data-role="result"></div>' +
      '<div class="bbc-tariff"><b>관세안내</b>관세·부가세는 물품가격(현지 운송료·현지 세금 포함)이 미화 150달러를 초과할 경우 발생하며, 비드바이 결제비용과 별도로 청구됩니다.<br>(한미 FTA 적용건은 낙찰가 기준 200달러까지 무관세)' +
        '<a href="https://www.customs.go.kr/kcs/ad/tax/BuyTaxCalculation.do" target="_blank" rel="noopener">예상세액조회 바로가기</a></div>' +
      '</div>'
    );
  }

  function viewHTML(backMode) {
    var tabs = COUNTRIES.map(function (c, i) {
      return '<button type="button" class="' + (i === 0 ? 'active' : '') + '" data-idx="' + i + '"><img src="flagicon/' + c.flag + '" alt="">' + c.name + '</button>';
    }).join('');
    var lead = backMode === 'back'
      ? '<button type="button" data-act="back" aria-label="뒤로"><i class="fas fa-chevron-left" aria-hidden="true"></i></button><h2>비용계산기</h2><span style="width:32px"></span>'
      : '<h2>비용계산기</h2><button type="button" data-act="close" aria-label="닫기">×</button>';
    return (
      '<div class="bbc-view">' +
        '<div class="bbc-top">' + lead + '</div>' +
        '<div class="bbc-body">' +
          '<div class="bbc-head"><span class="bbc-sub">예상 소요 비용을 계산해 보세요.</span><button type="button" class="bbc-reset" data-act="reset"><i class="fas fa-rotate-left" aria-hidden="true"></i> 초기화</button></div>' +
          '<div class="bbc-tabs" role="tablist">' + tabs + '</div>' +
          COUNTRIES.map(panelHTML).join('') +
        '</div>' +
      '</div>'
    );
  }

  var LEVEL_COL = { 8: 0, 5: 1, 4: 2, 3: 3 };

  function agencyFee(c, level, buyCost, itemTotal, kind) {
    if (c.id === 'JP') {
      var table = kind === 'auction' ? RATES.JP_auction : RATES.JP_buy;
      for (var i = 0; i < RATES.JP_tiers.length; i++) {
        if (itemTotal <= RATES.JP_tiers[i]) {
          var v = table[i][LEVEL_COL[level]];
          return v < 1 ? Math.round(itemTotal * v) : v;
        }
      }
    }
    var t = RATES.agency[c.id];
    return Math.max(t.min[level], buyCost * t.pct[level]);
  }

  function calc(panel) {
    var c = COUNTRIES.filter(function (x) { return x.id === panel.getAttribute('data-country'); })[0];
    var tax = num((panel.querySelector('[data-role="tax"]:checked') || {}).value);
    var price = num(q(panel, 'itemPrice').value);
    var qty = Math.max(1, Math.floor(num(q(panel, 'quantity').value)) || 1);
    var level = q(panel, 'level').value;
    var local = num(q(panel, 'localDeliveryFee').value);
    var remit = price > 0 ? RATES.remit[c.id] : 0;
    q(panel, 'remitFee').value = price > 0 ? fmt(remit, c.dec) : '-';

    var w = num(q(panel, 'weight').value);
    var unitSel = q(panel, 'weightUnit');
    var kgInput = unitSel && unitSel.value === 'kg';
    var wLbs = c.lbs ? (kgInput ? w * 2.20462 : w) : w;
    var pound = q(panel, 'weightPound');
    if (pound) pound.textContent = c.lbs && kgInput && w ? '= ' + fmt(wLbs, 1) + ' lbs' : '';

    var dims = ['width', 'height', 'length'].map(function (r) { return num(q(panel, r).value); });
    var vol = dims[0] * dims[1] * dims[2] / (c.lbs ? 166 : 5000);
    q(panel, 'volumeWeight').value = vol ? fmt(vol, 1) : '';
    var applied = Math.max(c.lbs ? wLbs : w, vol);
    applied = applied ? Math.ceil(applied * 2) / 2 : 0;

    var box = q(panel, 'result');
    if (c.needWeight && !(price > 0 && applied > 0)) {
      box.innerHTML = '<p class="bbc-empty">상품가격과 예상무게를 입력해 주세요.</p>';
      return;
    }
    var buyCost = price * qty * (1 + tax / 100) + local + remit;
    var unit = c.lbs ? 'lbs' : 'kg';
    var money = function (n) { return c.sym + ' ' + fmt(n, c.dec); };
    /* 일본은 구매유형 체크(구매대행 / 경매·메루카리)에 따라 대행수수료 요율표가 달라진다 */
    var typeEl = panel.querySelector('[data-role="jpType"]:checked');
    var kind = typeEl ? typeEl.value : '';
    var sub = c.id === 'JP' ? (kind === 'auction' ? ' · 경매/메루카리' : ' · 구매대행') : '';
    var fee = agencyFee(c, level, buyCost, price * qty, kind);
    box.innerHTML = c.methods.map(function (m) {
      var r = RATES.ship[m[0]];
      var ship = applied ? r.base + r.perUnit * applied : 0;
      var total = buyCost + fee + ship;
      return '<ul class="bbc-group">' +
        '<li><span>' + m[1] + '</span><span>₩ ' + fmt(Math.round(total * c.rate), 0) + '</span></li>' +
        '<li><span>(+) 현지구매비용</span><span>' + money(buyCost) + '</span></li>' +
        '<li><span>(+) 대행수수료' + sub + '</span><span>' + money(fee) + '</span></li>' +
        '<li><span>적용무게</span><span>' + fmt(applied, applied % 1 ? 1 : 0) + ' ' + unit + '</span></li>' +
        '<li><span>(+) 국제운송료</span><span>' + money(ship) + '</span></li>' +
        '<li class="sum-first"><span>현지통화 합계</span><span>' + money(total) + ' × ' + fmt(c.rate, c.rate % 1 ? 1 : 0) + '</span></li>' +
        '</ul>';
    }).join('');
  }

  function calcAll() { view.querySelectorAll('.bbc-panel').forEach(calc); }

  function resetAll() {
    view.querySelectorAll('.bbc-panel').forEach(function (p) {
      p.querySelectorAll('input[type=text]:not([readonly])').forEach(function (i) { i.value = i.getAttribute('data-role') === 'quantity' ? '1' : ''; });
      p.querySelectorAll('[data-role="tax"]').forEach(function (r, i) { r.checked = i === 0; });
      p.querySelectorAll('[data-role="jpType"]').forEach(function (r, i) { r.checked = i === 0; });
      q(p, 'level').value = DEFAULT_LEVEL;
      var u = q(p, 'weightUnit'); if (u) u.value = 'lbs';
    });
    calcAll();
  }

  function bind(backMode, drawer) {
    view.addEventListener('click', function (e) {
      var t = e.target.closest('button');
      if (!t) return;
      var act = t.getAttribute('data-act');
      if (act === 'close') { if (window.closeDrawer) window.closeDrawer(); }
      else if (act === 'back') api.reset();
      else if (act === 'reset') resetAll();
      else if (t.parentNode.classList.contains('bbc-tabs')) {
        var idx = t.getAttribute('data-idx');
        view.querySelectorAll('.bbc-tabs button').forEach(function (b) { b.classList.toggle('active', b === t); });
        view.querySelectorAll('.bbc-panel').forEach(function (p) { p.classList.toggle('active', p.getAttribute('data-idx') === idx); });
      }
    });
    view.addEventListener('input', function (e) {
      var i = e.target;
      if (i.matches('input[type=text]')) {
        var raw = i.value.replace(/[^\d.]/g, '');
        if (i.hasAttribute('data-comma')) {
          var parts = raw.split('.');
          raw = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',') + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');
        }
        i.value = raw;
      }
      calc(i.closest('.bbc-panel'));
    });
    view.addEventListener('change', function (e) { calc(e.target.closest('.bbc-panel')); });
  }

  var api = {
    open: function (drawer, backMode) {
      if (!document.getElementById('bbCalcCss')) {
        var s = document.createElement('style'); s.id = 'bbCalcCss'; s.textContent = CSS; document.head.appendChild(s);
      }
      if (view && view.parentNode) view.parentNode.removeChild(view);
      view = el(viewHTML(backMode));
      drawer.appendChild(view);
      bind(backMode, drawer);
      drawer.classList.add('is-calc');
      calcAll();
    },
    reset: function () {
      if (!view) return;
      var d = view.parentNode;
      if (d) d.classList.remove('is-calc');
      if (view.parentNode) view.parentNode.removeChild(view);
      view = null;
    }
  };

  window.bbCalc = api;
  window.bbCalcReset = api.reset;

  /* 드로어의 '비용 계산기' 링크(data-bb-calc) 클릭 → 계산기 화면으로 전환 */
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('[data-bb-calc]');
    if (!a) return;
    e.preventDefault();
    var drawer = a.closest('#bbDrawer, #drawer');
    if (drawer) api.open(drawer, drawer.id === 'drawer' ? 'back' : 'close');
  }, true);
})();
