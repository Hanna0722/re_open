/* ============================================================
   BidBuy Renewal - 상품 간편 보기(Quick View) 모달
   서브메인 / 카테고리메인 / 통합검색 상품카드 돋보기 아이콘에서 공용으로 사용
   ============================================================ */
(function () {
  'use strict';

  var css = [
    '.qv-overlay{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(15,23,42,.55);font-family:Pretendard,"Apple SD Gothic Neo","Helvetica Neue","Malgun Gothic",sans-serif}',
    '.qv-overlay.is-open{display:flex}',
    '.qv-modal{width:min(640px,100%);max-height:90vh;display:flex;flex-direction:column;background:#fff;border-radius:10px;overflow:hidden;box-shadow:0 18px 60px rgba(15,23,42,.24)}',
    '.qv-head{flex:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:16px 20px;background:#1A3C6E;color:#fff}',
    '.qv-title{margin:0;font-size:16px;font-weight:900;color:#fff}',
    '.qv-close{width:30px;height:30px;border:0;border-radius:5px;background:transparent;color:#fff;font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center}',
    '.qv-close:hover{background:rgba(255,255,255,.16)}',
    '.qv-scroll{overflow-y:auto}',
    '.qv-table{width:100%;border-collapse:collapse;font-size:13px;table-layout:fixed}',
    '.qv-table th{width:96px;padding:10px 14px;background:#F5F7FA;color:#666680;font-weight:700;text-align:left;border-bottom:1px solid #E0E4EB;border-right:1px solid #E0E4EB;white-space:nowrap}',
    '.qv-table td{padding:10px 14px;color:#1A1A2E;font-weight:600;border-bottom:1px solid #E0E4EB;word-break:break-all}',
    '.qv-table .qv-name{font-weight:800}',
    '.qv-table .qv-price{color:#E8385A;font-weight:900;font-size:15px}',
    '.qv-body{display:flex;gap:12px;padding:18px 20px}',
    '.qv-main-image{flex:1 1 auto;min-width:0;aspect-ratio:1/1;border:1px solid #E0E4EB;border-radius:8px;overflow:hidden;background:#FAFAFC;display:flex;align-items:center;justify-content:center}',
    '.qv-main-image img{width:100%;height:100%;object-fit:contain}',
    '.qv-thumb-col{flex:0 0 64px;display:flex;flex-direction:column;align-items:center;gap:6px}',
    '.qv-thumb-nav{width:100%;height:22px;border:1px solid #E0E4EB;border-radius:5px;background:#F5F7FA;color:#666680;font-size:11px;cursor:pointer;display:flex;align-items:center;justify-content:center;flex:0 0 auto}',
    '.qv-thumb-nav:hover{background:#EDEFF3}',
    '.qv-thumbs{display:flex;flex-direction:column;gap:6px;overflow-y:auto;scrollbar-width:thin;max-height:220px}',
    '.qv-thumbs::-webkit-scrollbar{width:4px}',
    '.qv-thumb{flex:0 0 auto;width:60px;height:60px;padding:0;border:1px solid #E0E4EB;border-radius:6px;overflow:hidden;background:none;cursor:pointer}',
    '.qv-thumb img{width:100%;height:100%;object-fit:cover}',
    '.qv-thumb.active{border-color:#E8385A;box-shadow:0 0 0 1px #E8385A}',
    '.qv-actions{flex:0 0 auto;display:flex;gap:8px;padding:16px 20px;border-top:1px solid #E0E4EB}',
    '.qv-btn{flex:1;height:44px;border-radius:6px;border:1px solid #1A3C6E;background:#fff;color:#1A3C6E;font:inherit;font-size:14px;font-weight:800;cursor:pointer}',
    '.qv-btn:hover{background:#F5F7FA}',
    '.qv-btn.active{background:#1A3C6E;color:#fff}',
    '.qv-btn.primary{border-color:#E8385A;background:#E8385A;color:#fff}',
    '.qv-btn.primary:hover{background:#C42F4C;border-color:#C42F4C}'
  ].join('\n');

  var modalHTML =
    '<div class="qv-overlay" id="bbQuickView" aria-hidden="true">' +
      '<div class="qv-modal" role="dialog" aria-modal="true" aria-labelledby="bbQuickViewTitle">' +
        '<div class="qv-head"><h2 class="qv-title" id="bbQuickViewTitle">상품 간편 보기</h2><button class="qv-close" type="button" aria-label="닫기" data-qv-close>&times;</button></div>' +
        '<div class="qv-scroll">' +
          '<table class="qv-table">' +
            '<tbody>' +
              '<tr><th scope="row">상품명</th><td class="qv-name" colspan="3" data-qv-name></td></tr>' +
              '<tr><th scope="row">현재가</th><td class="qv-price" data-qv-price></td><th scope="row">판매자</th><td data-qv-seller></td></tr>' +
              '<tr><th scope="row">종료일자</th><td data-qv-end></td><th scope="row">남은시간</th><td data-qv-remain></td></tr>' +
            '</tbody>' +
          '</table>' +
          '<div class="qv-body">' +
            '<div class="qv-main-image"><img data-qv-image alt="상품 이미지"></div>' +
            '<div class="qv-thumb-col">' +
              '<button class="qv-thumb-nav" type="button" aria-label="이전 이미지" data-qv-thumb-up><i class="fa-solid fa-chevron-up" aria-hidden="true"></i></button>' +
              '<div class="qv-thumbs" data-qv-thumbs></div>' +
              '<button class="qv-thumb-nav" type="button" aria-label="다음 이미지" data-qv-thumb-down><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<div class="qv-actions">' +
          '<button class="qv-btn" type="button" data-qv-wish>관심물품 등록</button>' +
          '<button class="qv-btn primary" type="button" data-qv-detail>경매 상세보기</button>' +
        '</div>' +
      '</div>' +
    '</div>';

  var modalNode = null;
  var sourceHeart = null;

  function ensureModal() {
    if (!document.getElementById('bbQuickViewCss')) {
      var style = document.createElement('style');
      style.id = 'bbQuickViewCss';
      style.textContent = css;
      document.head.appendChild(style);
    }
    if (modalNode) return modalNode;

    var wrap = document.createElement('div');
    wrap.innerHTML = modalHTML;
    modalNode = wrap.firstElementChild;
    document.body.appendChild(modalNode);

    modalNode.addEventListener('click', function (event) {
      if (event.target === modalNode) closeQuickView();
    });
    modalNode.querySelector('[data-qv-close]').addEventListener('click', closeQuickView);
    modalNode.querySelector('[data-qv-detail]').addEventListener('click', function () {
      window.location.href = modalNode.dataset.href || 'web_auction.html';
    });
    modalNode.querySelector('[data-qv-wish]').addEventListener('click', function (event) {
      var btn = event.currentTarget;
      var active = btn.classList.toggle('active');
      btn.textContent = active ? '관심물품 등록됨' : '관심물품 등록';
      if (sourceHeart) {
        sourceHeart.classList.toggle('active', active);
        sourceHeart.setAttribute('aria-pressed', String(active));
        sourceHeart.innerHTML = '<i class="' + (active ? 'fa-solid' : 'fa-regular') + ' fa-heart" aria-hidden="true"></i>';
      }
    });

    var thumbsEl = modalNode.querySelector('[data-qv-thumbs]');
    modalNode.querySelector('[data-qv-thumb-up]').addEventListener('click', function () {
      thumbsEl.scrollBy({ top: -68, behavior: 'smooth' });
    });
    modalNode.querySelector('[data-qv-thumb-down]').addEventListener('click', function () {
      thumbsEl.scrollBy({ top: 68, behavior: 'smooth' });
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modalNode.classList.contains('is-open')) closeQuickView();
    });

    return modalNode;
  }

  function closeQuickView() {
    if (!modalNode) return;
    modalNode.classList.remove('is-open');
    modalNode.setAttribute('aria-hidden', 'true');
    sourceHeart = null;
  }

  function deriveGalleryImages(baseSrc) {
    if (!baseSrc) return [];
    var lockMatch = baseSrc.match(/lock=(\d+)/);
    if (lockMatch) {
      var base = Number(lockMatch[1]);
      return [0, 1, 2, 3].map(function (i) {
        return baseSrc.replace(/lock=\d+/, 'lock=' + (base * 100 + i * 23 + 7));
      });
    }
    // 상품별 다중 이미지 데이터가 없는 경우, 같은 이미지를 썸네일로 반복 노출
    return [baseSrc, baseSrc, baseSrc, baseSrc];
  }

  function randomSellerId(seed) {
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var hash = 0;
    seed = String(seed || Math.random());
    for (var i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
    var out = '';
    for (var j = 0; j < 26; j++) {
      hash = (hash * 1103515245 + 12345) >>> 0;
      out += chars[hash % chars.length];
    }
    return out;
  }

  function splitCloseTime(text) {
    var match = String(text || '').match(/^(.*)\s\(([^)]*)\)\s*$/);
    if (match) return { endDate: match[1].trim(), remaining: match[2].trim() };
    return { endDate: text || '', remaining: '' };
  }

  window.collectQuickViewDataFromCard = function (card) {
    if (!card) return {};
    var nameEl = card.querySelector('.product-name');
    var priceEl = card.querySelector('.price');
    var imgEl = card.querySelector('.product-thumb img');
    var metaEl = card.querySelector('.auction-meta > span:first-child');
    var split = splitCloseTime(metaEl ? metaEl.textContent : '');
    var name = nameEl ? nameEl.textContent.trim() : '';
    var image = imgEl ? imgEl.src : '';

    return {
      name: name,
      price: priceEl ? priceEl.textContent.trim() : '',
      seller: randomSellerId(name + image),
      endDate: split.endDate || '-',
      remaining: split.remaining || '-',
      image: image,
      images: deriveGalleryImages(image),
      href: 'web_auction.html',
      heart: card.querySelector('.heart')
    };
  };

  window.openQuickView = function (data) {
    data = data || {};
    var node = ensureModal();

    node.querySelector('[data-qv-name]').textContent = data.name || '';
    node.querySelector('[data-qv-price]').textContent = data.price || '';
    node.querySelector('[data-qv-seller]').textContent = data.seller || '';
    node.querySelector('[data-qv-end]').textContent = data.endDate || '-';
    node.querySelector('[data-qv-remain]').textContent = data.remaining || '-';

    var images = (data.images && data.images.length) ? data.images : [data.image].filter(Boolean);
    var mainImg = node.querySelector('[data-qv-image]');
    mainImg.src = images[0] || '';

    var thumbsEl = node.querySelector('[data-qv-thumbs]');
    thumbsEl.innerHTML = '';
    images.forEach(function (src, index) {
      var thumb = document.createElement('button');
      thumb.type = 'button';
      thumb.className = 'qv-thumb' + (index === 0 ? ' active' : '');
      thumb.innerHTML = '<img src="' + src + '" alt="상품 이미지 ' + (index + 1) + '">';
      thumb.addEventListener('click', function () {
        mainImg.src = src;
        thumbsEl.querySelectorAll('.qv-thumb').forEach(function (el) { el.classList.remove('active'); });
        thumb.classList.add('active');
      });
      thumbsEl.append(thumb);
    });

    var wishBtn = node.querySelector('[data-qv-wish]');
    sourceHeart = data.heart || null;
    var wished = !!(sourceHeart && sourceHeart.classList.contains('active'));
    wishBtn.classList.toggle('active', wished);
    wishBtn.textContent = wished ? '관심물품 등록됨' : '관심물품 등록';

    node.dataset.href = data.href || 'web_auction.html';
    node.classList.add('is-open');
    node.setAttribute('aria-hidden', 'false');
  };

  window.closeQuickView = closeQuickView;
})();
