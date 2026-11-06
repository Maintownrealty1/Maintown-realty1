/* MainTown Realty: landing-page motion (index.html only).
   Purpose: make the page feel like a product, not a brochure, without getting in the way.
   - Motion only ever reveals or reinforces content; nothing needs to be understood from motion alone.
   - Respects "reduce motion"; if this file fails to load the page is unchanged.
   - Transform/opacity only (cheap), one passive scroll listener, no libraries. */
(function () {
  'use strict';
  var still = false;
  try { still = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
  var root = document.documentElement;
  if (still) { root.classList.add('mt-still'); }

  /* ---------- styles ---------- */
  var css = [
    '.hero-slide.active{animation:mtKen 16s ease-out both}',
    '@keyframes mtKen{from{transform:scale(1)}to{transform:scale(1.07)}}',

    /* headline words */
    '.mt-w{display:inline-block;animation:mtWord .7s cubic-bezier(.2,.8,.2,1) backwards}',
    '@keyframes mtWord{from{opacity:0;transform:translateY(.5em)}}',
    '.mt-fadeup{animation:mtFade .8s cubic-bezier(.2,.8,.2,1) backwards}',
    '@keyframes mtFade{from{opacity:0;transform:translateY(14px)}}',

    /* scroll reveal */
    'html.mt-motion .mt-rv{opacity:0;transform:translateY(26px)}',
    'html.mt-motion .mt-rv.mt-in{opacity:1;transform:none;transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0ms)}',
    '.mt-cardin{animation:mtCard .55s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:var(--d,0ms)}',
    '@keyframes mtCard{from{opacity:0;transform:translateY(18px) scale(.985)}}',

    /* section details */
    '.mt-draw{position:absolute;left:0;top:-1px;height:2px;width:100%;background:#7C3AED;transform:scaleX(0);transform-origin:left;transition:transform 1.4s cubic-bezier(.2,.8,.2,1)}',
    '.mt-draw.mt-in{transform:scaleX(1)}',
    '.mt-spot{position:relative}',
    '.mt-spot::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(139,92,246,.18),transparent 70%)}',
    '.mt-spot:hover::before{opacity:1}',
    '#mt-progress{position:fixed;left:0;top:0;height:2px;width:100%;transform:scaleX(0);transform-origin:left;background:#7C3AED;z-index:70;pointer-events:none}',
    '.mt-float{will-change:transform}',

    /* reduce motion: switch every effect off */
    '@media(prefers-reduced-motion:reduce){.x{display:none}.mt-w,.mt-fadeup,.mt-cardin,.hero-slide.active{animation:none!important}html.mt-motion .mt-rv{opacity:1;transform:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'mt-motion-css'; st.textContent = css; document.head.appendChild(st);

  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    var hero = document.getElementById('hero');

    /* ---------- hero ---------- */
    if (hero && !still) {
      /* headline: words rise in one after another; "Smart Living." shimmers */
      var h1 = hero.querySelector('h1');
      if (h1 && !h1.getAttribute('data-mt')) {
        h1.setAttribute('data-mt', '1');
        var n = 0;
        (function walk(node) {
          Array.prototype.slice.call(node.childNodes).forEach(function (c) {
            if (c.nodeType === 3) {
              var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
              parts.forEach(function (p) {
                if (!p) return;
                if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(' ')); return; }
                var s = document.createElement('span'); s.className = 'mt-w'; s.style.animationDelay = (120 + n++ * 85) + 'ms'; s.textContent = p; frag.appendChild(s);
              });
              c.parentNode.replaceChild(frag, c);
            } else if (c.nodeType === 1) walk(c);
          });
        })(h1);
      }
      var sub = hero.querySelector('h1 + p'); if (sub) { sub.classList.add('mt-fadeup'); sub.style.animationDelay = '650ms'; }
      var form = document.getElementById('heroSearchForm'); if (form) { form.classList.add('mt-fadeup'); form.style.animationDelay = '800ms'; }

      /* the search box hints at what you can ask for */
      var inp = document.getElementById('heroSearchInput');
      if (inp) {
        var base = inp.getAttribute('placeholder') || '', ex = ['2-bedroom flat in Lekki', 'Studio in Yaba under ₦800,000', 'Land in Ibeju-Lekki', 'Short let in Victoria Island'], ei = 0, ci = 0, dir = 1, timer;
        var busy = function () { return document.activeElement === inp || inp.value; };
        (function tick() {
          if (busy()) { inp.setAttribute('placeholder', base); ci = 0; dir = 1; timer = setTimeout(tick, 1500); return; }
          var w = ex[ei];
          ci += dir; inp.setAttribute('placeholder', w.slice(0, ci) || ' ');
          if (dir === 1 && ci >= w.length) { dir = -1; timer = setTimeout(tick, 1700); return; }
          if (dir === -1 && ci <= 0) { dir = 1; ei = (ei + 1) % ex.length; timer = setTimeout(tick, 450); return; }
          timer = setTimeout(tick, dir === 1 ? 55 : 28);
        })();
        inp.addEventListener('blur', function () { if (!inp.value) inp.setAttribute('placeholder', base); });
      }
    }

    if (still) return;

    /* ---------- scroll progress ---------- */
    var bar = document.createElement('div'); bar.id = 'mt-progress'; bar.setAttribute('aria-hidden', 'true'); document.body.appendChild(bar);

    /* ---------- reveal on scroll ---------- */
    root.classList.add('mt-motion');
    var io = null, vh = window.innerHeight;
    function reveal(el, d) {
      if (el.__mt) return; el.__mt = 1;
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) return;          /* already on screen: leave it alone */
      el.classList.add('mt-rv'); if (d) el.style.setProperty('--d', d + 'ms'); io.observe(el);
    }
    if ('IntersectionObserver' in window) {
      io = new IntersectionObserver(function (es) {
        es.forEach(function (e) {
          if (!e.isIntersecting) return;
          var el = e.target; el.classList.add('mt-in'); io.unobserve(el);
          setTimeout(function () { el.classList.remove('mt-rv', 'mt-in'); el.style.removeProperty('--d'); }, 1400);   /* hand transforms back to the element */
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
      var groups = [
        ['#listings .max-w-7xl > div:first-child', 0], ['#categorySwitcher', 80],
        ['#trust .max-w-2xl > *', 90], ['#trust .grid > div', 110], ['#trust .max-w-6xl > p, #trust .max-w-6xl > a', 60],
        ['#onboarding .text-center > *', 90],
        ['section:not(#hero):not(#listings):not(#trust):not(#onboarding) .text-center > *', 90]
      ];
      groups.forEach(function (g) { var els = document.querySelectorAll(g[0]); for (var i = 0; i < els.length; i++) reveal(els[i], i * g[1]); });
      /* safety net: never leave anything hidden */
      setTimeout(function () { var h = document.querySelectorAll('.mt-rv:not(.mt-in)'); for (var i = 0; i < h.length; i++) { var r = h[i].getBoundingClientRect(); if (r.top < vh) h[i].classList.add('mt-in'); } }, 4000);
    }

    /* line that draws across the trust grid */
    var tg = document.querySelector('#trust .grid');
    if (tg && io) { tg.style.position = 'relative'; var dr = document.createElement('span'); dr.className = 'mt-draw'; dr.setAttribute('aria-hidden', 'true'); tg.insertBefore(dr, tg.firstChild); io.observe(dr); }

    /* listing / story cards glide in each time the grid is (re)drawn */
    ['listingsGrid', 'onboardingGrid'].forEach(function (id) {
      var g = document.getElementById(id); if (!g || !window.MutationObserver) return;
      new MutationObserver(function (ms) {
        ms.forEach(function (m) { m.addedNodes.forEach(function (n, i) { if (n.nodeType === 1 && !n.classList.contains('mt-cardin')) { n.classList.add('mt-cardin'); n.style.setProperty('--d', (Math.min(i, 8) * 70) + 'ms'); setTimeout(function () { n.classList.remove('mt-cardin'); }, 1200); } }); });
      }).observe(g, { childList: true });
    });

    /* pointer glow on cards (mouse only) */
    var spots = [document.querySelector('section[aria-label="Join MainTown"] > div')].concat([].slice.call(document.querySelectorAll('#trust .grid > div')));
    spots.forEach(function (s) { if (s) s.classList.add('mt-spot'); });
    document.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      var t = e.target.closest ? e.target.closest('.mt-spot') : null; if (!t) return;
      var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    }, { passive: true });

    /* phones drift at slightly different speeds as you scroll (desktop) */
    var phones = [];
    var heads = document.querySelectorAll('h2'), sec = null;
    for (var k = 0; k < heads.length; k++) if (/One App, Three Journeys/i.test(heads[k].textContent)) sec = heads[k].closest('section');
    if (sec) { var pg = sec.querySelector('.grid'); if (pg) phones = [].slice.call(pg.children); phones.forEach(function (p, i) { p.classList.add('mt-float'); p.__sp = [0.07, -0.04, 0.09][i % 3]; }); }

    var tick = false;
    function onScroll() {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        tick = false;
        var max = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
        if (window.innerWidth >= 768) phones.forEach(function (p) {
          var r = p.getBoundingClientRect(); if (r.bottom < -100 || r.top > window.innerHeight + 100) return;
          var off = (r.top + r.height / 2 - window.innerHeight / 2);
          p.style.transform = 'translate3d(0,' + (off * p.__sp).toFixed(1) + 'px,0)';
        });
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', function () { vh = window.innerHeight; onScroll(); });
    onScroll();
  });
})();
