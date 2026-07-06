/* AquaOS — page behaviors: iridescent bubble spawner + taskbar clock.
   No fade-in reveals: 2007 sites didn't fade, everything is just THERE. */
(function () {
  'use strict';
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- iridescent bubbles (data-bubbles="N", data-max, data-giants) ----
  function spawnBubbles(container, n) {
    if (!container || reduce) return;
    var giants = +container.dataset.giants || 0; // dome-sized signature bubbles
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

  // ---- live clock in menubar + taskbar tray ----
  function tick() {
    var d = new Date();
    var t = ('0' + d.getHours()).slice(-2) + ':' + ('0' + d.getMinutes()).slice(-2);
    ['clock', 'clock2'].forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = t;
    });
  }
  tick();
  setInterval(tick, 60000);
})();
