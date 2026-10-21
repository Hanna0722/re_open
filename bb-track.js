/* ============================================================
   BidBuy 클릭/노출 측정 헬퍼 (GA4 gtag 또는 GTM dataLayer)
   - bbTrack(이벤트명, 파라미터)
   - gtag가 있으면 gtag('event'), 없고 dataLayer가 있으면 dataLayer.push
   - 둘 다 없으면 아무것도 보내지 않음 (localhost에서는 콘솔 출력)
   - 값이 비어 있으면 '(not set)'을 막기 위해 보내지 않고 콘솔 경고
   ============================================================ */
(function () {
  if (window.bbTrack) return;
  window.bbTrack = function (name, params) {
    params = params || {};
    for (var k in params) {
      if (params[k] === undefined || params[k] === null || params[k] === '') {
        if (window.console) console.warn('[bbTrack] 빈 값 때문에 전송 중단:', name, k);
        return;
      }
    }
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', name, params);
      } else if (window.dataLayer && typeof window.dataLayer.push === 'function') {
        var payload = { event: name };
        for (var p in params) payload[p] = params[p];
        window.dataLayer.push(payload);
      }
      if (/^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) && window.console) {
        console.debug('[bbTrack]', name, params);
      }
    } catch (e) {}
  };
})();
