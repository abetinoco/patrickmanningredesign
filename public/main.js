/* ============================================
   PATRICK MANNING REALTOR — MAIN JS
   ============================================ */

/** FAQ: category tabs + accordion (used from inline onclick in #faq) */
window.faqCat = function (cat, btn) {
  document.querySelectorAll('.faq-cat').forEach((b) => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.faq-group').forEach((g) => g.classList.remove('active'));
  document.getElementById('faq-' + cat)?.classList.add('active');
};

window.faqToggle = function (btn) {
  const item = btn.closest('.faq-item');
  if (!item) return;
  const wasOpen = item.classList.contains('open');
  const group = item.closest('.faq-group');
  if (!wasOpen && group) {
    group.querySelectorAll('.faq-item.open').forEach((other) => {
      if (other !== item) {
        other.classList.remove('open');
        other.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
      }
    });
  }
  item.classList.toggle('open', !wasOpen);
  btn.setAttribute('aria-expanded', !wasOpen ? 'true' : 'false');
};

document.addEventListener('DOMContentLoaded', () => {

  const CALENDLY_INLINE_URL =
    'https://calendly.com/pmanningtnrealtor/realestateconsultation?hide_event_type_details=1&hide_gdpr_banner=1&primary_color=d4703a';
  const CALENDLY_WIDGET_SRC = 'https://assets.calendly.com/assets/external/widget.js';

  /** Resolve when window.Calendly is available (defer tag in HTML, or dynamic inject). */
  const ensureCalendlyScript = () =>
    new Promise((resolve, reject) => {
      const ready = () =>
        window.Calendly && typeof window.Calendly.initInlineWidget === 'function';
      if (ready()) {
        resolve();
        return;
      }
      let settled = false;
      let pollId = 0;
      const clearPoll = () => {
        if (pollId) window.clearInterval(pollId);
        pollId = 0;
      };
      const finishOk = () => {
        if (settled) return;
        if (!ready()) return;
        settled = true;
        clearPoll();
        resolve();
      };
      const finishErr = (msg) => {
        if (settled) return;
        settled = true;
        clearPoll();
        reject(new Error(msg));
      };

      const existing = Array.from(document.scripts).find(
        (s) => s.src && s.src.indexOf('assets.calendly.com/assets/external/widget.js') !== -1,
      );
      if (existing) {
        existing.addEventListener('load', () => (ready() ? finishOk() : finishErr('Calendly script failed')), {
          once: true,
        });
        existing.addEventListener('error', () => finishErr('Calendly script failed'), { once: true });
      } else {
        const s = document.createElement('script');
        s.src = CALENDLY_WIDGET_SRC;
        s.async = true;
        s.dataset.calendlyWidget = '1';
        s.onload = () => (ready() ? finishOk() : finishErr('Calendly script failed'));
        s.onerror = () => finishErr('Calendly script failed');
        document.head.appendChild(s);
      }

      const start = performance.now();
      pollId = window.setInterval(() => {
        if (ready()) finishOk();
        else if (performance.now() - start > 20000) finishErr('Calendly load timeout');
      }, 50);
    });

  /* ---- Responsive <details>: open on wide viewports (summary hidden in CSS) ---- */
  const syncDetailsRwdOpen = () => {
    const wide = window.matchMedia('(min-width: 769px)').matches;
    document.querySelectorAll('.details-rwd').forEach((el) => {
      el.open = wide;
    });
  };
  syncDetailsRwdOpen();
  window.addEventListener('resize', syncDetailsRwdOpen);

  /* ---- Services (#services): exclusive <details> accordion — mobile only (≤768px) ---- */
  const svcAccMq = window.matchMedia('(max-width: 768px)');
  const getSvcAccordionRows = () =>
    document.querySelectorAll('.svc-rows > details[data-svc-accordion]');

  const openAllSvcRows = () => {
    getSvcAccordionRows().forEach((d) => {
      d.open = true;
    });
  };

  const syncSvcAccordion = () => {
    const rows = [...getSvcAccordionRows()];
    if (!rows.length) return;
    if (!svcAccMq.matches) {
      openAllSvcRows();
      return;
    }
    const opened = rows.filter((d) => d.open);
    if (opened.length === 0) {
      rows[0].open = true;
    } else if (opened.length > 1) {
      const keep = opened[0];
      rows.forEach((d) => {
        d.open = d === keep;
      });
    }
  };

  document.querySelector('.svc-rows')?.addEventListener(
    'toggle',
    (e) => {
      if (!svcAccMq.matches) return;
      const d = e.target;
      if (!(d instanceof HTMLDetailsElement) || !d.matches('details[data-svc-accordion]')) return;
      if (d.open) {
        getSvcAccordionRows().forEach((o) => {
          if (o !== d) o.open = false;
        });
      } else {
        const any = [...getSvcAccordionRows()].some((x) => x.open);
        if (!any) {
          const r = [...getSvcAccordionRows()];
          if (r[0]) r[0].open = true;
        }
      }
    },
    true
  );

  svcAccMq.addEventListener('change', syncSvcAccordion);
  syncSvcAccordion();

  /* ---- Scheduling modal (mobile: saves vertical space vs inline Calendly) ---- */
  const scheduleModal = document.getElementById('contact-schedule-modal');
  const modalCalendlyRoot = document.getElementById('modal-calendly-root');
  const modalCalendlyFallback = document.getElementById('modal-calendly-fallback');
  let calendlyModalInited = false;

  const setModalCalendlyFallback = (visible) => {
    if (modalCalendlyFallback) modalCalendlyFallback.hidden = !visible;
    if (modalCalendlyRoot) modalCalendlyRoot.style.display = visible ? 'none' : '';
  };

  const tryInitModalCalendly = () => {
    if (calendlyModalInited || !modalCalendlyRoot || !window.Calendly) return false;
    try {
      modalCalendlyRoot.innerHTML = '';
      modalCalendlyRoot.style.height = '';
      window.Calendly.initInlineWidget({
        url: CALENDLY_INLINE_URL,
        parentElement: modalCalendlyRoot,
        resize: true,
      });
      calendlyModalInited = true;
      setModalCalendlyFallback(false);
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 350);
      window.setTimeout(() => window.dispatchEvent(new Event('resize')), 900);
      return true;
    } catch (e) {
      console.warn('Calendly initInlineWidget failed', e);
      return false;
    }
  };

  const openScheduleModal = () => {
    if (!scheduleModal) return;
    setModalCalendlyFallback(false);
    if (modalCalendlyRoot) modalCalendlyRoot.style.display = '';
    scheduleModal.hidden = false;
    scheduleModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    const kick = async () => {
      try {
        await ensureCalendlyScript();
      } catch {
        setModalCalendlyFallback(true);
        return;
      }
      if (tryInitModalCalendly()) return;
      let n = 0;
      const t = window.setInterval(() => {
        n += 1;
        if (tryInitModalCalendly() || n > 200) {
          window.clearInterval(t);
          if (!calendlyModalInited) setModalCalendlyFallback(true);
        }
      }, 100);
    };
    requestAnimationFrame(() => requestAnimationFrame(() => void kick()));
  };

  const closeScheduleModal = () => {
    if (!scheduleModal) return;
    scheduleModal.hidden = true;
    scheduleModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setModalCalendlyFallback(false);
    if (modalCalendlyRoot) modalCalendlyRoot.style.display = '';
  };

  document.getElementById('contact-open-scheduler')?.addEventListener('click', openScheduleModal);
  scheduleModal?.querySelectorAll('[data-modal-close]').forEach((el) => {
    el.addEventListener('click', closeScheduleModal);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (scheduleModal && !scheduleModal.hidden) {
      closeScheduleModal();
    }
  });

  /* ---- NAVIGATION: Scroll — beige bar + section-aware active link ---- */
  const header = document.getElementById('site-header');
  const navLinkEls = document.querySelectorAll('#nav-links .nav-link');

  /** Section id → nav hash target (for blocks between main nav anchors) */
  const SECTION_NAV_TARGETS = [
    ['trust', 'services'],
    ['services', 'services'],
    ['featured', 'services'],
    ['tools', 'services'],
    ['home-value', 'home-value'],
    ['about', 'about'],
    ['coverage', 'coverage'],
    ['social', 'social'],
    ['reviews', 'reviews'],
    ['faq', 'contact'],
    ['browse', 'contact'],
    ['contact', 'contact'],
  ];

  const getDocTop = (el) => {
    const r = el.getBoundingClientRect();
    return r.top + window.scrollY;
  };

  const setActiveNavTarget = (navId) => {
    navLinkEls.forEach((link) => {
      const href = link.getAttribute('href');
      const isCta = link.classList.contains('nav-cta-pill');
      let active = false;
      if (navId === null) {
        active = false;
      } else if (isCta) {
        active = navId === 'contact' && href === '#contact';
      } else if (href && href.startsWith('#')) {
        active = href === `#${navId}`;
      }
      link.classList.toggle('nav-link-active', active);
      if (active) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  };

  const updateHeaderAndNav = () => {
    if (!header) return;
    if (window.scrollY > 60) header.classList.add('scrolled');
    else header.classList.remove('scrolled');

    const headerH = header.offsetHeight;
    const probe = window.scrollY + headerH + 32;
    const trustEl = document.getElementById('trust');
    if (!trustEl || probe < getDocTop(trustEl)) {
      setActiveNavTarget(null);
      return;
    }

    let active = 'services';
    for (const [sectionId, navTarget] of SECTION_NAV_TARGETS) {
      const el = document.getElementById(sectionId);
      if (el && getDocTop(el) <= probe) active = navTarget;
    }
    setActiveNavTarget(active);
  };

  window.addEventListener('scroll', updateHeaderAndNav, { passive: true });
  updateHeaderAndNav();

  /* ---- NAVIGATION: Mobile full-screen menu (≤900px) ---- */
  const mobNav = document.getElementById('mobNav');
  const mobNavCloseBtn = document.getElementById('mob-nav-close');
  const hamburger = document.getElementById('nav-hamburger');

  function mobNavClose() {
    if (!mobNav) return;
    mobNav.classList.remove('open');
    mobNav.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('mob-nav-open');
    document.body.style.overflow = '';
    hamburger?.setAttribute('aria-expanded', 'false');
  }

  function mobNavOpen() {
    if (!mobNav) return;
    mobNav.classList.add('open');
    mobNav.setAttribute('aria-hidden', 'false');
    document.body.classList.add('mob-nav-open');
    document.body.style.overflow = 'hidden';
    hamburger?.setAttribute('aria-expanded', 'true');
  }

  hamburger?.addEventListener('click', mobNavOpen);
  mobNavCloseBtn?.addEventListener('click', mobNavClose);

  mobNav?.querySelectorAll('a[href^="http"], a[href^="tel:"]').forEach((a) => {
    a.addEventListener('click', mobNavClose);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') mobNavClose();
  });

  /* ---- NAVIGATION: Smooth anchor scroll ---- */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerH = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerH;
        window.scrollTo({ top, behavior: 'smooth' });
        mobNavClose();
      }
    });
  });

  /* ---- SCROLL REVEAL ---- */
  const reveals = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('revealed');
        revealObserver.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(el => revealObserver.observe(el));

  /* ---- Add data-reveal to sections automatically ---- */
  const autoRevealSelectors = [
    '.trust-card',
    '.svc-row',
    '.fl-info-col',
    '.mc-inner',
    '.cc-inner',
    '.rvb-inner',
    '.hv-left',
    '.hv-card',
    '.about-inner',
    '.coverage-state-card',
    '.social-platform-card',
    '.rv-featured',
    '.faq-item',
    '.homes-funnel-inner',
    '.ct-inner',
  ];
  autoRevealSelectors.forEach((sel, si) => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', '');
      el.setAttribute('data-reveal-delay', String(Math.min(i + 1, 5)));
      revealObserver.observe(el);
    });
  });

  /* ---- TESTIMONIALS SLIDER ---- */
  const track     = document.getElementById('testimonials-track');
  const dotsWrap  = document.getElementById('slider-dots');
  const prevBtn   = document.getElementById('prev-btn');
  const nextBtn   = document.getElementById('next-btn');

  if (track && window.innerWidth > 768) {
    const cards = Array.from(track.children);
    let currentSlide = 0;
    const visibleCount = () => window.innerWidth > 1024 ? 3 : window.innerWidth > 640 ? 2 : 1;
    const maxSlide = () => Math.max(0, cards.length - visibleCount());

    // Build dots
    const buildDots = () => {
      dotsWrap.innerHTML = '';
      const max = maxSlide();
      for (let i = 0; i <= max; i++) {
        const dot = document.createElement('div');
        dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
        dot.addEventListener('click', () => goTo(i));
        dotsWrap.appendChild(dot);
      }
    };

    const updateDots = () => {
      dotsWrap.querySelectorAll('.slider-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
      });
    };

    const goTo = (idx) => {
      currentSlide = Math.max(0, Math.min(idx, maxSlide()));
      const cardW = cards[0].offsetWidth + 24; // 24 = gap
      track.style.transform = `translateX(-${currentSlide * cardW}px)`;
      updateDots();
    };

    prevBtn?.addEventListener('click', () => goTo(currentSlide - 1));
    nextBtn?.addEventListener('click', () => goTo(currentSlide + 1));

    buildDots();

    // Auto-advance
    let autoInterval = setInterval(() => goTo((currentSlide + 1) % (maxSlide() + 1)), 5000);
    [prevBtn, nextBtn].forEach(btn => {
      btn?.addEventListener('click', () => {
        clearInterval(autoInterval);
        autoInterval = setInterval(() => goTo((currentSlide + 1) % (maxSlide() + 1)), 5000);
      });
    });

    window.addEventListener('resize', () => {
      goTo(0);
      buildDots();
    });
  }

  /* ---- CONTACT FORM ---- */
  const contactForm = document.getElementById('contact-form');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = contactForm.querySelector('[type="submit"]');
    if (btn) {
      btn.textContent = '✓ Message Sent!';
      btn.style.background = '#5A7A5E';
      btn.disabled = true;
    }
    setTimeout(() => {
      if (btn) {
        btn.textContent = 'Send Message →';
        btn.style.background = '';
        btn.disabled = false;
        contactForm.reset();
      }
    }, 4000);
  });

  window.hvGoStep = (id) => {
    document.querySelectorAll('#home-value .hv-step').forEach((s) => {
      s.classList.remove('active');
    });
    const stepEl = document.getElementById(`step-${id}`);
    if (stepEl) stepEl.classList.add('active');
  };

  document.querySelectorAll('#home-value .hv-choice').forEach((el) => {
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        el.click();
      }
    });
  });

  const HOMES_PROFILE = 'https://www.homes.com/real-estate-agents/patrick-manning/jr2sjd4/';
  const HOMES_FOR_SALE = 'https://www.homes.com/for-sale/';

  const US_STATE_ABBR = {
    Alabama: 'AL', Alaska: 'AK', Arizona: 'AZ', Arkansas: 'AR', California: 'CA', Colorado: 'CO',
    Connecticut: 'CT', Delaware: 'DE', Florida: 'FL', Georgia: 'GA', Hawaii: 'HI', Idaho: 'ID',
    Illinois: 'IL', Indiana: 'IN', Iowa: 'IA', Kansas: 'KS', Kentucky: 'KY', Louisiana: 'LA',
    Maine: 'ME', Maryland: 'MD', Massachusetts: 'MA', Michigan: 'MI', Minnesota: 'MN',
    Mississippi: 'MS', Missouri: 'MO', Montana: 'MT', Nebraska: 'NE', Nevada: 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', Ohio: 'OH', Oklahoma: 'OK', Oregon: 'OR',
    Pennsylvania: 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC', 'South Dakota': 'SD',
    Tennessee: 'TN', Texas: 'TX', Utah: 'UT', Vermont: 'VT', Virginia: 'VA', Washington: 'WA',
    'West Virginia': 'WV', Wisconsin: 'WI', Wyoming: 'WY', 'District of Columbia': 'DC',
  };

  const slugifyHomesLocation = (name) => {
    if (!name) return '';
    return name
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/['']/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
  };

  const extractZip5 = (query) => {
    const m = String(query).match(/\b(\d{5})(?:-\d{4})?\b/);
    return m ? m[1] : null;
  };

  const homesListingUrlFromGeocode = (hit, rawQuery) => {
    const abbr = US_STATE_ABBR[hit.admin1];
    if (!abbr) return null;
    const citySlug = slugifyHomesLocation(hit.name);
    if (!citySlug) return null;
    const area = `${citySlug}-${abbr.toLowerCase()}`;
    const zip5 = extractZip5(rawQuery);
    if (zip5) return `https://www.homes.com/${area}/${zip5}/`;
    return `https://www.homes.com/${area}/`;
  };

  const runHomesSearch = async () => {
    const input = document.getElementById('homes-search');
    const q = (input?.value || '').trim();
    if (!q) {
      window.open(HOMES_PROFILE, '_blank', 'noopener,noreferrer');
      return;
    }
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&countryCode=US`;
    try {
      const res = await fetch(geoUrl);
      const data = await res.json();
      const hits = data.results;
      if (hits && hits.length > 0) {
        const listingUrl = homesListingUrlFromGeocode(hits[0], q);
        if (listingUrl) {
          window.open(listingUrl, '_blank', 'noopener,noreferrer');
          return;
        }
      }
    } catch {
      /* fall through */
    }
    window.open(HOMES_FOR_SALE, '_blank', 'noopener,noreferrer');
  };

  window.doHomesSearch = runHomesSearch;
  document.getElementById('homes-search-btn')?.addEventListener('click', () => {
    void runHomesSearch();
  });
  document.getElementById('homes-search')?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      void runHomesSearch();
    }
  });

  /* ---- SUBTLE HERO PARALLAX (full-bleed <img>) ---- */
  const hero = document.querySelector('.hero');
  const heroImg = document.querySelector('.hero-img img');
  if (hero && heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight * 1.2) {
        heroImg.style.transform = `translate3d(0, ${scrolled * 0.35}px, 0)`;
      }
    }, { passive: true });
  }

  if (document.getElementById('mc-price')) {
    mcUpdate();
    mcUpdateAfford();
  }
  if (document.getElementById('cc-price')) {
    ccUpdate();
  }
  if (document.getElementById('rvb-price')) {
    rvbUpdate();
  }

  ['rv-feat-quote', 'rv-feat-name', 'rv-feat-date'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
  });

});

/* ---- Mortgage, closing costs, rent vs buy (global handlers for inline oninput/onclick) ---- */
function mcFmt(n) {
  return '$' + Math.round(n).toLocaleString();
}
function mcFmtMo(n) {
  return mcFmt(n) + '/mo';
}

function mcUpdate() {
  var price = +document.getElementById('mc-price').value;
  var downPct = +document.getElementById('mc-down').value;
  var rate = +document.getElementById('mc-rate').value;
  var term = +document.getElementById('mc-term').value;
  var taxOn = document.getElementById('mc-tax-toggle').checked;
  var insOn = document.getElementById('mc-ins-toggle').checked;
  var pmiOn = document.getElementById('mc-pmi-toggle').checked;

  var down = price * downPct / 100;
  var loan = price - down;
  var mo = rate / 100 / 12;
  var n = term * 12;
  var pi = mo === 0 ? loan / n : (loan * mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);
  var tax = (price * 0.0046) / 12;
  var ins = (price * 0.005) / 12;
  var pmiAmt = downPct < 20 ? (loan * 0.008) / 12 : 0;

  document.getElementById('mc-price-val').textContent = mcFmt(price);
  document.getElementById('mc-down-val').textContent = downPct + '% (' + mcFmt(down) + ')';
  document.getElementById('mc-rate-val').textContent = rate.toFixed(1) + '%';
  document.getElementById('mc-tax-val').textContent = mcFmtMo(tax);
  document.getElementById('mc-ins-val').textContent = mcFmtMo(ins);
  document.getElementById('mc-pmi-val').textContent = mcFmtMo(pmiAmt);

  var isPmiRequired = downPct < 20;
  document.getElementById('mc-pmi-label').textContent = isPmiRequired
    ? 'PMI (required — down < 20%)'
    : 'PMI (not required — down ≥ 20%)';
  document.getElementById('mc-pmi-warning').className = 'mc-pmi-warning' + (isPmiRequired ? ' show' : '');
  if (isPmiRequired) {
    document.getElementById('mc-pmi-toggle').checked = true;
    pmiOn = true;
  }

  var total = pi + (taxOn ? tax : 0) + (insOn ? ins : 0) + (pmiOn ? pmiAmt : 0);
  var extras = (taxOn ? 1 : 0) + (insOn ? 1 : 0) + (pmiOn && pmiAmt > 0 ? 1 : 0);

  document.getElementById('mc-result-num').textContent = mcFmt(total);
  document.getElementById('mc-result-sub').textContent =
    extras === 0 ? 'Principal & interest only' : 'Total estimated monthly';

  var parts = [pi, taxOn ? tax : 0, insOn ? ins : 0, pmiOn ? pmiAmt : 0];
  ['pi', 'tax', 'ins', 'pmi'].forEach(function (k, i) {
    var w = total > 0 ? (parts[i] / total) * 100 : 0;
    document.getElementById('mc-bar-' + k).style.width = w.toFixed(1) + '%';
  });

  document.getElementById('mc-bd-pi').textContent = mcFmt(pi);
  document.getElementById('mc-bd-tax').textContent = mcFmt(tax);
  document.getElementById('mc-bd-ins').textContent = mcFmt(ins);
  document.getElementById('mc-bd-pmi').textContent = mcFmt(pmiAmt);
  document.getElementById('mc-bd-tax-row').style.display = taxOn ? '' : 'none';
  document.getElementById('mc-bd-ins-row').style.display = insOn ? '' : 'none';
  document.getElementById('mc-bd-pmi-row').style.display = pmiOn && pmiAmt > 0 ? '' : 'none';

  document.getElementById('mc-meta-loan').textContent = mcFmt(loan);
  document.getElementById('mc-meta-interest').textContent = mcFmt(pi * n - loan);
}

function mcUpdateAfford() {
  var budget = +document.getElementById('mc-budget').value;
  var saved = +document.getElementById('mc-saved').value;
  var rate = +document.getElementById('mc-afford-rate').value;
  var term = +document.getElementById('mc-afford-term').value;

  document.getElementById('mc-budget-val').textContent = mcFmtMo(budget);
  document.getElementById('mc-saved-val').textContent = mcFmt(saved);
  document.getElementById('mc-afford-rate-val').textContent = rate.toFixed(1) + '%';

  var mo = rate / 100 / 12;
  var n = term * 12;
  var maxLoan =
    mo === 0 ? budget * n : (budget * (Math.pow(1 + mo, n) - 1)) / (mo * Math.pow(1 + mo, n));
  var maxPrice = maxLoan + saved;
  var pct = ((saved / maxPrice) * 100).toFixed(1);

  document.getElementById('mc-afford-num').textContent = mcFmt(maxPrice);
  document.getElementById('mc-afford-sub').textContent =
    'with ' + mcFmt(saved) + ' down · ' + rate.toFixed(1) + '% · ' + term + 'yr';
  document.getElementById('mc-afford-loan').textContent = mcFmt(maxLoan);
  document.getElementById('mc-afford-pct').textContent = pct + '%';
}

function mcSetMode(m) {
  document.getElementById('mc-payment-mode').style.display = m === 'payment' ? '' : 'none';
  document.getElementById('mc-afford-mode').style.display = m === 'afford' ? '' : 'none';
  document.getElementById('btn-payment').className = 'mc-mode-btn' + (m === 'payment' ? ' active' : '');
  document.getElementById('btn-afford').className = 'mc-mode-btn' + (m === 'afford' ? ' active' : '');
}

var ccMode = 'buyer';

function ccSetMode(m) {
  if (!document.getElementById('cc-buyer-inputs')) return;
  ccMode = m;
  document.getElementById('cc-buyer-inputs').style.display = m === 'buyer' ? '' : 'none';
  document.getElementById('cc-seller-inputs').style.display = m === 'seller' ? '' : 'none';
  document.getElementById('cc-cash-needed').style.display = m === 'buyer' ? '' : 'none';
  document.getElementById('cc-price-label').textContent = m === 'buyer' ? 'Purchase price' : 'Sale price';
  document.getElementById('cc-btn-buyer').className = 'cc-mode-btn' + (m === 'buyer' ? ' active' : '');
  document.getElementById('cc-btn-seller').className = 'cc-mode-btn' + (m === 'seller' ? ' active' : '');
  ccUpdate();
}

function ccFmt(n) {
  return '$' + Math.round(n).toLocaleString();
}
function ccFmtRange(lo, hi) {
  return ccFmt(lo) + ' – ' + ccFmt(hi);
}

function ccUpdate() {
  var priceEl = document.getElementById('cc-price');
  if (!priceEl) return;
  var price = +priceEl.value;
  document.getElementById('cc-price-val').textContent = ccFmt(price);

  if (ccMode === 'buyer') {
    var downPct = +document.getElementById('cc-down').value;
    var loanType = document.getElementById('cc-loan-type').value;
    var down = (price * downPct) / 100;
    var loan = price - down;
    document.getElementById('cc-down-val').textContent = downPct + '%';

    var isCash = loanType === 'cash';
    var origLo = isCash ? 0 : loan * 0.005;
    var origHi = isCash ? 0 : loan * 0.01;
    var origMid = (origLo + origHi) / 2;

    var appraisalLo = isCash ? 0 : 400;
    var appraisalHi = isCash ? 0 : 900;
    var appraisalMid = isCash ? 0 : 650;
    var inspectionMid = 375;
    var inspectionLo = 300;
    var inspectionHi = 500;
    var pestMid = 150;
    var pestLo = 50;
    var pestHi = 250;
    var titleSearchMid = 500;
    var titleSearchLo = 300;
    var titleSearchHi = 800;
    var lenderTitleMid = isCash ? 0 : loan * 0.004;
    var ownerTitleMid = price * 0.005;
    var transferTax = price * 0.0037;
    var recordingMid = 150;
    var recordingLo = 100;
    var recordingHi = 250;
    var prepaidTax = ((price * 0.0046) / 12) * 3;
    var prepaidIns = price * 0.005;
    var prepaidInterest = isCash ? 0 : (loan * (6.5 / 100 / 12)) * 15;
    var fhaUpfront = loanType === 'fha' ? loan * 0.0175 : 0;
    var vaFunding = loanType === 'va' ? loan * 0.023 : 0;

    var items = [
      { name: 'Loan origination fee', note: '0.5–1% of loan amount', lo: origLo, hi: origHi, mid: origMid, neg: true, hide: isCash },
      {
        name: 'Appraisal',
        note: 'Lender-required home valuation',
        lo: appraisalLo,
        hi: appraisalHi,
        mid: appraisalMid,
        hide: isCash,
      },
      { name: 'Credit report', note: 'Lender fee', lo: 25, hi: 50, mid: 37, hide: isCash },
      {
        name: 'Home inspection',
        note: 'Highly recommended',
        lo: inspectionLo,
        hi: inspectionHi,
        mid: inspectionMid,
      },
      { name: 'Pest/termite inspection', note: 'Common in TN climate', lo: pestLo, hi: pestHi, mid: pestMid },
      {
        name: 'Title search & settlement',
        note: 'Title company fee',
        lo: titleSearchLo,
        hi: titleSearchHi,
        mid: titleSearchMid,
      },
      {
        name: "Lender's title insurance",
        note: 'Required by lender',
        lo: lenderTitleMid * 0.8,
        hi: lenderTitleMid * 1.2,
        mid: lenderTitleMid,
        hide: isCash,
      },
      {
        name: "Owner's title insurance",
        note: 'Optional but recommended',
        lo: ownerTitleMid * 0.8,
        hi: ownerTitleMid * 1.2,
        mid: ownerTitleMid,
        neg: true,
      },
      {
        name: 'Transfer tax (TN: $0.37/$100)',
        note: 'State/county required',
        lo: transferTax,
        hi: transferTax,
        mid: transferTax,
      },
      { name: 'Recording fees', note: 'County government charge', lo: recordingLo, hi: recordingHi, mid: recordingMid },
      {
        name: 'Prepaid property tax (3 mo)',
        note: 'TN avg 0.46%/yr into escrow',
        lo: prepaidTax * 0.8,
        hi: prepaidTax * 1.2,
        mid: prepaidTax,
      },
      {
        name: 'Prepaid homeowners insurance',
        note: 'First year paid upfront',
        lo: prepaidIns * 0.8,
        hi: prepaidIns * 1.2,
        mid: prepaidIns,
      },
      {
        name: 'Prepaid interest',
        note: 'Days remaining in closing month',
        lo: prepaidInterest * 0.5,
        hi: prepaidInterest * 1.5,
        mid: prepaidInterest,
        hide: isCash,
      },
      {
        name: 'FHA upfront MIP (1.75%)',
        note: 'FHA loans only',
        lo: fhaUpfront,
        hi: fhaUpfront,
        mid: fhaUpfront,
        hide: loanType !== 'fha',
      },
      {
        name: 'VA funding fee (2.3%)',
        note: 'VA loans only (may be waived)',
        lo: vaFunding,
        hi: vaFunding,
        mid: vaFunding,
        hide: loanType !== 'va',
        neg: true,
      },
    ].filter(function (i) {
      return !i.hide && i.mid > 0;
    });

    var total = items.reduce(function (s, i) {
      return s + i.mid;
    }, 0);
    var loTotal = items.reduce(function (s, i) {
      return s + i.lo;
    }, 0);
    var hiTotal = items.reduce(function (s, i) {
      return s + i.hi;
    }, 0);

    document.getElementById('cc-result-label').textContent = 'Estimated buyer closing costs';
    document.getElementById('cc-result-num').textContent = ccFmt(total);
    document.getElementById('cc-result-range').textContent =
      'Typical range: ' + ccFmt(loTotal) + ' – ' + ccFmt(hiTotal);
    document.getElementById('cc-total-val').textContent = ccFmt(total);

    var cashNum = total + down;
    document.getElementById('cc-cash-num').textContent = ccFmt(cashNum);
    document.getElementById('cc-cash-sub').textContent =
      'Down payment ' + ccFmt(down) + ' + closing costs ' + ccFmt(total);

    var html = items
      .map(function (item) {
        return (
          '<div class="cc-item">' +
          '<div class="cc-item-left">' +
          '<span class="cc-item-name">' +
          item.name +
          '</span>' +
          '<span class="cc-item-note">' +
          item.note +
          '</span>' +
          '</div>' +
          '<span class="cc-item-range' +
          (item.neg ? ' negotiable' : '') +
          '">' +
          (item.lo === item.hi ? ccFmt(item.mid) : ccFmtRange(item.lo, item.hi)) +
          '</span></div>'
        );
      })
      .join('');
    document.getElementById('cc-items').innerHTML = html;
  } else {
    var balance = +document.getElementById('cc-balance').value;
    var inclCommission = document.getElementById('cc-commission-toggle').checked;
    document.getElementById('cc-balance-val').textContent = ccFmt(balance);

    var listingComm = price * 0.0295;
    var buyerComm = price * 0.031;
    var transferTaxS = price * 0.0037;
    var titleExam = 350;
    var escrowFee = price * 0.005;
    var recordingS = 150;
    var prorateTax = ((price * 0.0046) / 12) * 6;
    var mortgagePayoff = balance * 1.001;

    var sellerItems = [
      {
        name: 'Listing agent commission',
        note: 'Avg 2.95% in TN (negotiable)',
        lo: price * 0.02,
        hi: price * 0.04,
        mid: listingComm,
        neg: true,
      },
      inclCommission
        ? {
            name: "Buyer's agent commission",
            note: 'Avg 3.1% in TN — now negotiable post-NAR settlement',
            lo: price * 0.02,
            hi: price * 0.035,
            mid: buyerComm,
            neg: true,
          }
        : null,
      {
        name: 'Transfer tax ($0.37/$100)',
        note: 'TN state/county required',
        lo: transferTaxS,
        hi: transferTaxS,
        mid: transferTaxS,
      },
      {
        name: 'Title exam fee',
        note: 'Verification of ownership',
        lo: 150,
        hi: 500,
        mid: titleExam,
      },
      {
        name: 'Escrow/settlement fee',
        note: 'Split with buyer (~0.5% each)',
        lo: escrowFee * 0.7,
        hi: escrowFee * 1.3,
        mid: escrowFee,
      },
      { name: 'Recording fees', note: 'County government', lo: 100, hi: 200, mid: recordingS },
      {
        name: 'Prorated property taxes',
        note: 'Approx. 6 months (TN 0.46%)',
        lo: prorateTax * 0.5,
        hi: prorateTax * 1.5,
        mid: prorateTax,
      },
      balance > 0
        ? {
            name: 'Mortgage payoff',
            note: 'Remaining balance + per diem interest',
            lo: mortgagePayoff,
            hi: mortgagePayoff,
            mid: mortgagePayoff,
          }
        : null,
    ].filter(Boolean);

    var total = sellerItems.reduce(function (s, i) {
      return s + i.mid;
    }, 0);
    var loTotal = sellerItems.reduce(function (s, i) {
      return s + i.lo;
    }, 0);
    var hiTotal = sellerItems.reduce(function (s, i) {
      return s + i.hi;
    }, 0);
    var netProceeds = price - total;

    document.getElementById('cc-result-label').textContent = 'Estimated seller closing costs';
    document.getElementById('cc-result-num').textContent = ccFmt(total);
    document.getElementById('cc-result-range').textContent = 'Net proceeds: ~' + ccFmt(netProceeds);
    document.getElementById('cc-total-val').textContent = ccFmt(total);

    var html = sellerItems
      .map(function (item) {
        return (
          '<div class="cc-item">' +
          '<div class="cc-item-left">' +
          '<span class="cc-item-name">' +
          item.name +
          '</span>' +
          '<span class="cc-item-note">' +
          item.note +
          '</span>' +
          '</div>' +
          '<span class="cc-item-range' +
          (item.neg ? ' negotiable' : '') +
          '">' +
          (item.lo === item.hi ? ccFmt(item.mid) : ccFmtRange(item.lo, item.hi)) +
          '</span></div>'
        );
      })
      .join('');
    document.getElementById('cc-items').innerHTML = html;
  }
}

function rvbFmt(n) {
  return '$' + Math.round(Math.abs(n)).toLocaleString();
}

function rvbUpdate() {
  if (!document.getElementById('rvb-price')) return;
  var price = +document.getElementById('rvb-price').value;
  var downPct = +document.getElementById('rvb-down').value;
  var rate = +document.getElementById('rvb-rate').value;
  var rent = +document.getElementById('rvb-rent').value;
  var appr = +document.getElementById('rvb-appr').value / 100;
  var rentInc = +document.getElementById('rvb-rentinc').value / 100;
  var investReturn = +document.getElementById('rvb-invest').value / 100;
  var years = +document.getElementById('rvb-years').value;

  document.getElementById('rvb-price-val').textContent = rvbFmt(price);
  document.getElementById('rvb-down-val').textContent =
    downPct + '% (' + rvbFmt((price * downPct) / 100) + ')';
  document.getElementById('rvb-rate-val').textContent = rate.toFixed(1) + '%';
  document.getElementById('rvb-rent-val').textContent = rvbFmt(rent) + '/mo';
  document.getElementById('rvb-appr-val').textContent = appr * 100 + '%/yr';
  document.getElementById('rvb-rentinc-val').textContent = (rentInc * 100).toFixed(1) + '%/yr';
  document.getElementById('rvb-invest-val').textContent = (investReturn * 100).toFixed(1) + '%/yr';
  document.getElementById('rvb-years-val').textContent = years + ' year' + (years !== 1 ? 's' : '');

  var down = (price * downPct) / 100;
  var loan = price - down;
  var mo = rate / 100 / 12;
  var n = 30 * 12;
  var pi =
    mo === 0 ? loan / n : (loan * mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1);

  var buyData = [];
  var rentData = [];
  var breakevenYear = null;

  var remainingLoan = loan;
  var homeValue = price;
  var totalBuyCost = down + price * 0.03;
  var totalRentCost = 0;
  var investedAmount = down + price * 0.03;
  var curRent = rent;
  var homeValueAtHorizon = price;
  var loanAtHorizon = loan;

  for (var yr = 1; yr <= 30; yr++) {
    homeValue = homeValue * (1 + appr);

    var yearlyInterest = 0;
    var yearlyPrincipal = 0;
    for (var m = 0; m < 12; m++) {
      var intPmt = remainingLoan * mo;
      var prinPmt = pi - intPmt;
      yearlyInterest += intPmt;
      yearlyPrincipal += prinPmt;
      remainingLoan = Math.max(0, remainingLoan - prinPmt);
    }

    var yearlyTax = homeValue * 0.0046;
    var yearlyIns = homeValue * 0.005;
    var yearlyMaint = homeValue * 0.01;
    var yearlyBuyOutflow = pi * 12 + yearlyTax + yearlyIns + yearlyMaint;

    totalBuyCost += yearlyBuyOutflow;
    var saleNetProceeds = homeValue * (1 - 0.06) - remainingLoan;
    var netBuyCost = totalBuyCost - saleNetProceeds;

    var yearlyRent = 0;
    for (var rm = 0; rm < 12; rm++) {
      yearlyRent += curRent;
      curRent *= 1 + rentInc / 12;
    }
    investedAmount = investedAmount * (1 + investReturn) + yearlyRent;
    totalRentCost += yearlyRent;
    var netRentCost = totalRentCost - (investedAmount - (down + price * 0.03));

    if (yr <= years) {
      buyData.push(Math.round(netBuyCost));
      rentData.push(Math.round(netRentCost));
    }

    if (yr === years) {
      homeValueAtHorizon = homeValue;
      loanAtHorizon = remainingLoan;
    }

    if (breakevenYear === null && netBuyCost < netRentCost) {
      breakevenYear = yr;
    }
  }

  var finalBuy = buyData[buyData.length - 1] || 0;
  var finalRent = rentData[rentData.length - 1] || 0;
  var diff = finalRent - finalBuy;

  document.getElementById('rvb-buy-total').textContent = (finalBuy < 0 ? '+' : '') + rvbFmt(finalBuy);
  document.getElementById('rvb-rent-total').textContent = rvbFmt(finalRent);

  if (breakevenYear === null) {
    document.getElementById('rvb-verdict-headline').textContent = 'Renting wins over ' + years + ' years';
    document.getElementById('rvb-verdict-sub').textContent =
      'Buying would cost ~' + rvbFmt(Math.abs(diff)) + ' more over this period';
    document.getElementById('rvb-verdict-icon').textContent = '🏠';
  } else if (breakevenYear > years) {
    document.getElementById('rvb-verdict-headline').textContent = 'Break-even at year ' + breakevenYear;
    document.getElementById('rvb-verdict-sub').textContent =
      'Buying wins after year ' + breakevenYear + ' — consider staying longer';
    document.getElementById('rvb-verdict-icon').textContent = '⚖️';
  } else {
    document.getElementById('rvb-verdict-headline').textContent =
      'Buying wins — break-even was year ' + breakevenYear;
    document.getElementById('rvb-verdict-sub').textContent =
      'Over ' + years + ' years, buying saves ~' + rvbFmt(diff);
    document.getElementById('rvb-verdict-icon').textContent = '🏡';
  }

  var finalHomeValue = price * Math.pow(1 + appr, years);
  var brkHtml =
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Est. home value at exit</div><div class="rvb-breakdown-item-val">' +
    rvbFmt(finalHomeValue) +
    '</div></div>' +
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Selling costs (6%)</div><div class="rvb-breakdown-item-val">–' +
    rvbFmt(finalHomeValue * 0.06) +
    '</div></div>' +
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Upfront costs (3%)</div><div class="rvb-breakdown-item-val">–' +
    rvbFmt(price * 0.03) +
    '</div></div>' +
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Property tax (' +
    years +
    ' yrs)</div><div class="rvb-breakdown-item-val">–' +
    rvbFmt(price * 0.0046 * years) +
    '</div></div>' +
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Maintenance (' +
    years +
    ' yrs)</div><div class="rvb-breakdown-item-val">–' +
    rvbFmt(price * 0.01 * years) +
    '</div></div>' +
    '<div class="rvb-breakdown-item"><div class="rvb-breakdown-item-label">Equity built (est.)</div><div class="rvb-breakdown-item-val">+' +
    rvbFmt(homeValueAtHorizon - loanAtHorizon) +
    '</div></div>';
  document.getElementById('rvb-buy-breakdown').innerHTML = brkHtml;

  var canvas = document.getElementById('rvb-chart');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var cw = canvas.offsetWidth || 500;
  canvas.width = cw;
  canvas.height = 180;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var allVals = buyData.concat(rentData);
  var minV = Math.min.apply(null, allVals);
  var maxV = Math.max.apply(null, allVals);
  var range = maxV - minV || 1;
  var pad = { t: 10, r: 10, b: 30, l: 60 };
  var w = canvas.width - pad.l - pad.r;
  var h = canvas.height - pad.t - pad.b;
  var xDenom = Math.max(buyData.length - 1, 1);

  function xPos(i) {
    return pad.l + (i / xDenom) * w;
  }
  function yPos(v) {
    return pad.t + h - ((v - minV) / range) * h;
  }

  if (minV < 0 && maxV > 0) {
    var zeroY = yPos(0);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(pad.l, zeroY);
    ctx.lineTo(pad.l + w, zeroY);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  if (breakevenYear && breakevenYear <= years) {
    var bx = xPos(breakevenYear - 1);
    ctx.strokeStyle = 'rgba(196,114,58,0.4)';
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(bx, pad.t);
    ctx.lineTo(bx, pad.t + h);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#c4723a';
    ctx.font = '10px sans-serif';
    ctx.fillText('break-even yr ' + breakevenYear, bx + 4, pad.t + 14);
  }

  function drawLine(data, color) {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach(function (v, i) {
      var x = xPos(i);
      var y = yPos(v);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();
  }

  drawLine(buyData, '#c4723a');
  drawLine(rentData, 'rgba(245,240,232,0.6)');

  ctx.fillStyle = 'rgba(245,240,232,0.35)';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'right';
  [0, 0.5, 1].forEach(function (frac) {
    var v = minV + range * frac;
    var y = yPos(v);
    ctx.fillText((v < 0 ? '-$' : '$') + Math.round(Math.abs(v) / 1000) + 'k', pad.l - 4, y + 3);
  });

  ctx.textAlign = 'center';
  [1, Math.floor(years / 2), years].forEach(function (yr) {
    if (yr <= buyData.length && yr >= 1) {
      ctx.fillText('yr ' + yr, xPos(yr - 1), pad.t + h + 18);
    }
  });
}

window.addEventListener('resize', function () {
  if (document.getElementById('rvb-chart')) rvbUpdate();
});

var rvReviews = [
  {
    quote:
      'Pat is exceptional and one of the best in the business. He walked alongside my wife and I during the whole process and really made us feel like family. Super responsive and knowledgeable. Highly recommend!',
    name: 'Brandon Korthuis',
    date: 'September 2022',
  },
  {
    quote:
      "Patrick was absolutely the easiest agent I've ever worked with. He is straight with you, knows his stuff, and is willing to go to the builder if there was anything that needed to be addressed during or after the construction process.",
    name: 'David Gatheridge',
    date: 'September 2022',
  },
  {
    quote:
      'Working with Patrick on our new home. He is amazing. I would highly recommend giving him a call. You are going to love working with him.',
    name: 'William Dade',
    date: 'September 2022',
  },
  {
    quote:
      'Patrick was our agent through the purchase of our home with John Maler Builders in the Brixworth Seven Development. Throughout the construction process he was thorough and professional at every turn.',
    name: 'George Burt',
    date: 'September 2022',
  },
];

function rvSelect(idx) {
  var r = rvReviews[idx];
  if (!r) return;
  var feat = document.getElementById('rv-feat-quote');
  var nameEl = document.getElementById('rv-feat-name');
  var dateEl = document.getElementById('rv-feat-date');
  if (!feat || !nameEl || !dateEl) return;

  feat.style.opacity = '0';
  feat.style.transform = 'translateY(8px)';
  nameEl.style.opacity = '0';
  dateEl.style.opacity = '0';

  window.setTimeout(function () {
    feat.textContent = r.quote;
    nameEl.textContent = r.name;
    dateEl.textContent = r.date;
    feat.style.opacity = '1';
    feat.style.transform = 'translateY(0)';
    nameEl.style.opacity = '1';
    dateEl.style.opacity = '1';
  }, 200);

  document.querySelectorAll('.rv-mini').forEach(function (el, i) {
    el.classList.toggle('active', i === idx);
  });
}
