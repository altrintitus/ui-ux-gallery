/* OASYS — Frutiger Aero page behaviors: bubble spawner, hero parallax,
   scroll reveals, nav glass deepening. All decorative, reduced-motion safe. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- iridescent bubbles ----
  function spawnBubbles(container, n) {
    if (!container || reduce) return;
    var giants = +container.dataset.giants || 0; // dome-sized hero bubbles (the FA signature)
    for (var i = 0; i < n + giants; i++) {
      var b = document.createElement('div');
      var giant = i < giants;
      var size = giant ? 240 + Math.random() * 160
                       : 22 + Math.random() * (container.dataset.max ? +container.dataset.max : 110);
      b.className = 'bubble b' + (1 + (i % 3));
      b.style.width = b.style.height = size.toFixed(0) + 'px';
      b.style.left = (Math.random() * 100).toFixed(1) + '%';
      b.style.bottom = (-14 - Math.random() * 30).toFixed(0) + 'vh';
      b.style.setProperty('--dur', giant ? (20 + Math.random() * 6).toFixed(1) + 's'
                                         : (9 + Math.random() * 10).toFixed(1) + 's');
      b.style.setProperty('--delay', (-Math.random() * (giant ? 24 : 18)).toFixed(1) + 's');
      b.style.setProperty('--sx', ((Math.random() < .5 ? -1 : 1) * (14 + Math.random() * 26)).toFixed(0) + 'px');
      b.style.opacity = giant ? (0.4 + Math.random() * 0.2).toFixed(2) : (0.55 + Math.random() * 0.35).toFixed(2);
      container.appendChild(b);
    }
  }
  document.querySelectorAll('[data-bubbles]').forEach(function (el) {
    spawnBubbles(el, +el.dataset.bubbles || 8);
  });

  // ---- hero parallax (sky far/fast … water near/slow) ----
  var layers = [].slice.call(document.querySelectorAll('[data-p]'));
  if (layers.length && !reduce) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return; ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        layers.forEach(function (l) { l.style.transform = 'translateY(' + (y * +l.dataset.p).toFixed(1) + 'px)'; });
        ticking = false;
      });
    }, { passive: true });
  }

  // ---- reveal on scroll ----
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  // ---- nav deepens on scroll ----
  var nav = document.querySelector('.nav-glass');
  if (nav) {
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ---- mobile menu (if present) ----
  var btn = document.getElementById('menuBtn'), menu = document.getElementById('menu');
  if (btn && menu) {
    var setOpen = function (open) {
      menu.classList.toggle('hidden', !open);
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    btn.addEventListener('click', function () { setOpen(menu.classList.contains('hidden')); });
    menu.addEventListener('click', function (e) { if (e.target.tagName === 'A') setOpen(false); });
  }
})();
