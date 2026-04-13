/**
 * Lead / analytics — set window.PM_SITE_CONFIG in index.html (before this file).
 * - ga4MeasurementId: e.g. "G-XXXXXXXXXX" (loads gtag automatically)
 * PostHog: paste the snippet from the PostHog project (Web) before this script;
 * then homes.com CTA clicks will also call posthog.capture when available.
 */
;(function () {
  const cfg = window.PM_SITE_CONFIG || {}

  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      const s = document.createElement('script')
      s.src = src
      s.async = true
      s.onload = resolve
      s.onerror = reject
      document.head.appendChild(s)
    })
  }

  if (cfg.ga4MeasurementId) {
    loadScript(
      'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4MeasurementId),
    ).then(function () {
      window.dataLayer = window.dataLayer || []
      function gtag() {
        dataLayer.push(arguments)
      }
      window.gtag = gtag
      gtag('js', new Date())
      gtag('config', cfg.ga4MeasurementId)
    })
  }

  document.addEventListener('DOMContentLoaded', function () {
    const cta = document.getElementById('homes-com-cta')
    if (!cta) return
    cta.addEventListener('click', function () {
      if (window.gtag) {
        window.gtag('event', 'homes_com_outbound', {
          event_category: 'engagement',
          transport_type: 'beacon',
        })
      }
      if (typeof posthog !== 'undefined' && posthog.capture) {
        posthog.capture('homes_com_cta_click')
      }
    })
  })
})()
