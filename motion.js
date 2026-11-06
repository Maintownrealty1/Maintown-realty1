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
    /* hero: verification grid, scan line, glow */
    '.mt-fx{position:absolute;inset:0;pointer-events:none;overflow:hidden}',
    '.mt-fx-grid{position:absolute;inset:-48px 0 0 0;background-image:linear-gradient(rgba(168,85,247,.16) 1px,transparent 1px),linear-gradient(90deg,rgba(168,85,247,.16) 1px,transparent 1px);background-size:48px 48px;',
    '  -webkit-mask-image:radial-gradient(ellipse 75% 85% at 72% 38%,#000 0,transparent 72%);mask-image:radial-gradient(ellipse 75% 85% at 72% 38%,#000 0,transparent 72%);animation:mtGrid 18s linear infinite}',
    '.mt-fx-orb{position:absolute;width:46vw;max-width:620px;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle,rgba(124,58,237,.38),transparent 65%);filter:blur(20px);right:-8%;top:-18%;animation:mtOrb 16s ease-in-out infinite alternate}',
    '.mt-fx-orb.b{left:-14%;right:auto;top:auto;bottom:-30%;background:radial-gradient(circle,rgba(168,85,247,.22),transparent 65%);animation-duration:21s}',
    '.mt-fx-scan{position:absolute;left:0;right:0;height:140px;top:-140px;background:linear-gradient(180deg,transparent,rgba(196,181,253,.12) 70%,rgba(196,181,253,.38) 99%,transparent 100%);animation:mtScan 9s ease-in-out infinite 1.5s}',
    '@keyframes mtGrid{to{transform:translateY(48px)}}',
    '@keyframes mtOrb{from{transform:translate3d(0,0,0) scale(1)}to{transform:translate3d(-6%,8%,0) scale(1.12)}}',
    '@keyframes mtScan{0%{transform:translateY(0);opacity:0}12%{opacity:1}60%{opacity:1}100%{transform:translateY(calc(100vh + 160px));opacity:0}}',
    '.hero-slide.active{animation:mtKen 16s ease-out both}',
    '@keyframes mtKen{from{transform:scale(1)}to{transform:scale(1.07)}}',

    /* headline words */
    '.mt-w{display:inline-block;animation:mtWord .7s cubic-bezier(.2,.8,.2,1) backwards}',
    '@keyframes mtWord{from{opacity:0;transform:translateY(.5em)}}',
    '.mt-shine{background:linear-gradient(100deg,#A855F7 20%,#E9D5FF 45%,#A855F7 70%);background-size:220% 100%;-webkit-background-clip:text;background-clip:text;-webkit-text-fill-color:transparent;color:transparent!important;text-shadow:none!important;animation:mtShine 6s ease-in-out infinite}',
    '@keyframes mtShine{0%,100%{background-position:100% 0}50%{background-position:0 0}}',
    '.mt-fadeup{animation:mtFade .8s cubic-bezier(.2,.8,.2,1) backwards}',
    '@keyframes mtFade{from{opacity:0;transform:translateY(14px)}}',

    /* verification pipeline under the search box */
    '.mt-pipe{display:flex;flex-wrap:wrap;align-items:center;gap:.4rem .35rem;margin-top:.25rem;font:600 11px/1 Inter,system-ui,sans-serif;color:#E4E4E7}',
    '.mt-pipe-l{width:100%;font:600 10px/1 "JetBrains Mono",monospace;letter-spacing:.16em;text-transform:uppercase;color:#C4B5FD;margin-bottom:.15rem;text-shadow:0 1px 8px rgba(0,0,0,.7)}',
    '.mt-step{display:inline-flex;align-items:center;gap:.4rem;padding:.45rem .7rem;border-radius:999px;background:rgba(14,14,16,.55);border:1px solid rgba(255,255,255,.16);backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);animation:mtStep 8s ease-in-out infinite}',
    '.mt-step i{width:7px;height:7px;border-radius:50%;background:#71717A;animation:mtDot 8s ease-in-out infinite;animation-delay:inherit}',
    '.mt-arrow{opacity:.55;font-size:12px}',
    '@keyframes mtStep{0%,18%,100%{border-color:rgba(255,255,255,.16);background:rgba(14,14,16,.55)}6%,14%{border-color:rgba(167,139,250,.9);background:rgba(76,29,149,.55)}}',
    '@keyframes mtDot{0%,18%,100%{background:#71717A;box-shadow:none}6%,14%{background:#4ADE80;box-shadow:0 0 0 4px rgba(74,222,128,.22)}}',

    /* floating proof cards (wide screens only) */
    '.mt-cards{display:none}',
    '@media(min-width:1320px){.mt-cards{display:flex;flex-direction:column;gap:14px;position:absolute;right:5%;top:50%;transform:translateY(-46%);z-index:10;width:268px;pointer-events:none}}',
    '.mt-card{display:flex;align-items:center;gap:12px;padding:12px 14px;border-radius:16px;background:rgba(14,14,16,.62);border:1px solid rgba(255,255,255,.14);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);box-shadow:0 18px 40px rgba(0,0,0,.4);animation:mtFloat 7s ease-in-out infinite}',
    '.mt-card:nth-child(2){margin-left:34px;animation-delay:-2.3s}.mt-card:nth-child(3){animation-delay:-4.6s}',
    '.mt-card b{display:block;font:600 13px Inter,sans-serif;color:#fff}.mt-card small{display:block;font:500 11px Inter,sans-serif;color:#A1A1AA;margin-top:2px}',
    '.mt-ico{width:34px;height:34px;border-radius:10px;display:grid;place-items:center;flex:none;background:rgba(124,58,237,.28);color:#DDD6FE}',
    '.mt-ico svg{width:18px;height:18px}',
    '.mt-ok{margin-left:auto;width:20px;height:20px;border-radius:50%;background:#16A34A;display:grid;place-items:center;flex:none;animation:mtPop 7s ease-in-out infinite}',
    '.mt-card:nth-child(2) .mt-ok{animation-delay:-2.3s}.mt-card:nth-child(3) .mt-ok{animation-delay:-4.6s}',
    '.mt-ok svg{width:12px;height:12px;color:#fff}',
    '@keyframes mtFloat{0%,100%{transform:translateY(0)}50%{transform:translateY(-9px)}}',
    '@keyframes mtPop{0%,70%,100%{transform:scale(1)}78%{transform:scale(1.25)}86%{transform:scale(1)}}',

    /* scroll reveal */
    'html.mt-motion .mt-rv{opacity:0;transform:translateY(26px)}',
    'html.mt-motion .mt-rv.mt-in{opacity:1;transform:none;transition:opacity .7s cubic-bezier(.2,.8,.2,1),transform .7s cubic-bezier(.2,.8,.2,1);transition-delay:var(--d,0ms)}',
    '.mt-cardin{animation:mtCard .55s cubic-bezier(.2,.8,.2,1) backwards;animation-delay:var(--d,0ms)}',
    '@keyframes mtCard{from{opacity:0;transform:translateY(18px) scale(.985)}}',

    /* section details */
    '.mt-draw{position:absolute;left:0;top:-1px;height:2px;width:100%;background:linear-gradient(90deg,#7C3AED,#C4B5FD 60%,transparent);transform:scaleX(0);transform-origin:left;transition:transform 1.4s cubic-bezier(.2,.8,.2,1)}',
    '.mt-draw.mt-in{transform:scaleX(1)}',
    '.mt-spot{position:relative}',
    '.mt-spot::before{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;opacity:0;transition:opacity .3s;background:radial-gradient(260px circle at var(--mx,50%) var(--my,50%),rgba(139,92,246,.18),transparent 70%)}',
    '.mt-spot:hover::before{opacity:1}',
    '#mt-progress{position:fixed;left:0;top:0;height:2px;width:100%;transform:scaleX(0);transform-origin:left;background:linear-gradient(90deg,#7C3AED,#C4B5FD);z-index:70;pointer-events:none}',
    '.mt-float{will-change:transform}',

    /* reduce motion: switch every effect off */
    '@media(prefers-reduced-motion:reduce){.mt-fx,.mt-pipe .mt-arrow{display:none}.mt-w,.mt-fadeup,.mt-cardin,.mt-card,.mt-step,.mt-step i,.mt-ok,.mt-shine,.hero-slide.active{animation:none!important}.mt-shine{-webkit-text-fill-color:currentColor;color:#C084FC!important}html.mt-motion .mt-rv{opacity:1;transform:none}}'
  ].join('\n');
  var st = document.createElement('style'); st.id = 'mt-motion-css'; st.textContent = css; document.head.appendChild(st);

  function ready(fn) { if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn); else fn(); }
  ready(function () {
    var hero = document.getElementById('hero');

    /* ---------- hero ---------- */
    if (hero && !still) {
      var ss = hero.querySelector('.hero-slideshow');
      if (ss) { var fx = document.createElement('div'); fx.className = 'mt-fx'; fx.setAttribute('aria-hidden', 'true'); fx.innerHTML = '<div class="mt-fx-orb"></div><div class="mt-fx-orb b"></div><div class="mt-fx-grid"></div><div class="mt-fx-scan"></div>'; ss.appendChild(fx); }

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
        var acc = h1.querySelector('.text-brand-400'); if (acc) acc.classList.add('mt-shine');
        /* keep the shimmer span's inner words inline-block but let the gradient flow across them */
        if (acc) { var ws = acc.querySelectorAll('.mt-w'); for (var i = 0; i < ws.length; i++) { ws[i].style.background = 'inherit'; ws[i].style.webkitBackgroundClip = 'text'; ws[i].style.backgroundClip = 'text'; ws[i].style.webkitTextFillColor = 'transparent'; } }
      }
      var sub = hero.querySelector('h1 + p'); if (sub) { sub.classList.add('mt-fadeup'); sub.style.animationDelay = '650ms'; }
      var form = document.getElementById('heroSearchForm'); if (form) { form.classList.add('mt-fadeup'); form.style.animationDelay = '800ms'; }

      /* verification pipeline: what happens to every listing, lighting up in order */
      var wrap = hero.querySelector('.max-w-4xl');
      if (wrap && form) {
        var pipe = document.createElement('div'); pipe.className = 'mt-pipe mt-fadeup'; pipe.style.animationDelay = '1000ms';
        pipe.setAttribute('aria-label', 'How every listing is checked before it goes live');
        var steps = ['Title check', 'AI fraud screen', 'Lawyer review', 'Live'];
        pipe.innerHTML = '<span class="mt-pipe-l">Every listing, checked</span>' + steps.map(function (t, i) {
          return '<span class="mt-step" style="animation-delay:' + (i * 2) + 's"><i style="animation-delay:' + (i * 2) + 's"></i>' + t + '</span>' + (i < steps.length - 1 ? '<span class="mt-arrow" aria-hidden="true">›</span>' : '');
        }).join('');
        form.parentNode.insertBefore(pipe, form.nextSibling);
      }

      /* floating proof cards (wide screens) */
      var chk = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
      var cards = document.createElement('div'); cards.className = 'mt-cards'; cards.setAttribute('aria-hidden', 'true');
      cards.innerHTML = [
        ['<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>', 'Title document', 'Verified'],
        ['<path d="M12 3l8 3v6c0 4.5-3.2 7.9-8 9-4.8-1.1-8-4.5-8-9V6z"/><path d="M9 12l2 2 4-4"/>', 'Fraud screening', 'No duplicates found'],
        ['<rect x="3" y="6" width="18" height="12" rx="2.5"/><path d="M3 10h18M7 15h3"/>', 'Monthly rent', 'Auto-pay scheduled']
      ].map(function (c) { return '<div class="mt-card"><span class="mt-ico"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">' + c[0] + '</svg></span><span><b>' + c[1] + '</b><small>' + c[2] + '</small></span><span class="mt-ok">' + chk + '</span></div>'; }).join('');
      hero.appendChild(cards);

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
