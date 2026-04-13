/* Coverage state maps (D3 + topojson) + floating CTA */
(function () {
  const STROKE = '#c4723a';
  const FILL = 'rgba(196, 114, 58, 0.13)';

  async function renderMaps() {
    if (typeof d3 === 'undefined' || typeof topojson === 'undefined') return;
    try {
      const us = await d3.json('https://cdn.jsdelivr.net/npm/us-atlas@3/states-albers-10m.json');
      const states = topojson.feature(us, us.objects.states).features;

      function renderState(feature, svgId, vw, vh) {
        const svg = d3.select('#' + svgId);
        if (svg.empty() || !feature) return;
        svg.selectAll('*').remove();
        svg.attr('viewBox', '0 0 ' + vw + ' ' + vh);
        const projection = d3.geoIdentity().reflectY(false).fitExtent([[16, 12], [vw - 16, vh - 12]], feature);
        const path = d3.geoPath().projection(projection);
        svg.append('path')
          .datum(feature)
          .attr('d', path)
          .attr('fill', FILL)
          .attr('stroke', STROKE)
          .attr('stroke-width', 2)
          .attr('stroke-linejoin', 'round');
      }

      const tn = states.find((s) => String(s.id) === '47');
      const ky = states.find((s) => String(s.id) === '21');
      if (tn) renderState(tn, 'tn-map', 400, 110);
      if (ky) renderState(ky, 'ky-map', 400, 150);
    } catch (e) {
      console.warn('Coverage maps failed to load', e);
    }
  }

  function initFloatingCta() {
    const backToTop = document.getElementById('back-to-top');
    const floatingCta = document.getElementById('floating-cta');

    backToTop?.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    if (!floatingCta) return;

    const SHOW_AFTER = 400;
    const DELTA = 10;
    let lastY = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;

      if (y < SHOW_AFTER) {
        floatingCta.classList.remove('floating-cta--visible');
        return;
      }

      if (Math.abs(dy) < DELTA) return;

      if (dy > 0) floatingCta.classList.remove('floating-cta--visible');
      else floatingCta.classList.add('floating-cta--visible');
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      renderMaps();
      initFloatingCta();
    });
  } else {
    renderMaps();
    initFloatingCta();
  }
})();
