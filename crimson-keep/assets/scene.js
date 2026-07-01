/* Lone-Hero Pixelscape — TRUE pixel-art scene renderer.
   Studies the inspo directly: massive masonry-textured gothic castle on a crag,
   overcast slate-band sky with flat stepped clouds, a huge crimson tree bleeding
   off the top corner, red vines/bushes/petals scattered through the whole scene,
   a waterfall thread, pale stone path, and a small red-caped wanderer with a staff.

   Renders once to a low-res offscreen canvas (art pixels), upscaled by CSS
   image-rendering:pixelated. A light per-frame pass animates petals, birds,
   star sparkles, waterfall shimmer, one lit window, and the hero's cape. */
(function (global) {
  'use strict';

  // deterministic hash → 0..255 (stable texture, no flicker between rebuilds)
  function h2(x, y) {
    var n = (x * 374761393 + y * 668265263) ^ (x << 5) ^ (y << 7);
    n = (n ^ (n >>> 13)) * 1274126177;
    return ((n ^ (n >>> 16)) >>> 0) & 255;
  }
  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  var P = {
    sky: ['#1c2b3c', '#23374c', '#2a425c', '#32506c', '#3a5d7c'], // overcast slate, top -> horizon
    cloud: ['#446686', '#4d7093'],
    mtnFar: '#41587147', mtnFarS: '#415871', mtnNear: '#324860',
    stBase: '#252f3c', stLite: '#2e3a49', stDark: '#1b2530', stEdge: '#405062', stBlack: '#0d151f',
    bkBase: '#1d2733', bkDark: '#141d28',                       // back (far) masonry, darker
    rkBase: '#1b242f', rkLite: '#242f3c', rkDark: '#121a24',
    gdBase: '#182634', gdDash: '#111d29', gdLite: '#1f2f3f',
    pth: '#8298ad', pthD: '#5f7488', pthG: '#0f1b27',
    redHi: '#e02525', redMid: '#a81414', redDeep: '#6b0a0d', petal: '#c41317',
    amber: '#e8a030', amberDim: '#7a5524',
    water: '#8fa9c2', waterD: '#6d87a1',
    star: '#c9dcef', fgRock: '#0a121b',
    cape: '#c11018', capeD: '#8c0b10', body: '#0a1017', trunk: '#170d11'
  };

  function initScene(canvas, opts) {
    opts = opts || {};
    var mode = opts.mode === 'mobile' ? 'mobile' : 'desktop';
    var ctx = canvas.getContext('2d');
    var off = document.createElement('canvas'), o = off.getContext('2d');
    var W = 0, H = 0, t = 0, raf = 0;
    var petals = [], birds = [], sparkles = [], litWin = null, fallX = 0, fallY0 = 0, fallY1 = 0;
    var hero = { x: 0, y: 0 };

    function px(g, x, y, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, 1, 1); }
    function rec(g, x, y, w, hh, c) { g.fillStyle = c; g.fillRect(x | 0, y | 0, w | 0, hh | 0); }

    /* ---------- sky: discrete bands + 2-row checker dither at each seam ---------- */
    function sky(g, horizon) {
      var n = P.sky.length, bh = horizon / n;
      for (var i = 0; i < n; i++) {
        rec(g, 0, i * bh, W, bh + 1, P.sky[i]);
        if (i > 0) { // dither seam
          var yy = Math.round(i * bh);
          for (var x = 0; x < W; x++) {
            if ((x + yy) & 1) px(g, x, yy, P.sky[i - 1]);
            if ((x + yy + 1) & 1) px(g, x, yy + 1, P.sky[i]);
          }
        }
      }
      // sparse stars up high + plus-sparkles (animated later)
      sparkles = [];
      for (var s = 0; s < (mode === 'mobile' ? 26 : 40); s++) {
        var sx = h2(s, 77) / 255 * W, sy = h2(s, 191) / 255 * horizon * 0.55;
        if (h2(s, 3) > 210) { sparkles.push({ x: sx | 0, y: sy | 0, p: h2(s, 9) / 40 }); }
        else { g.globalAlpha = 0.35 + (h2(s, 5) / 255) * 0.4; px(g, sx, sy, P.star); g.globalAlpha = 1; }
      }
      // red flecks swirling (heavier toward the tree corner, upper right)
      var nF = mode === 'mobile' ? 26 : 44;
      for (var f = 0; f < nF; f++) {
        var fx = W * (0.3 + (h2(f, 21) / 255) * 0.7), fy = horizon * (h2(f, 33) / 255) * 0.9;
        var bias = fx / W; // denser to the right
        if (h2(f, 41) / 255 < bias) {
          g.globalAlpha = 0.5 + (h2(f, 55) / 255) * 0.5;
          rec(g, fx, fy, h2(f, 61) > 190 ? 2 : 1, 1, P.petal); g.globalAlpha = 1;
        }
      }
    }

    /* ---------- flat, chunky stepped clouds (camping-inspo style) ---------- */
    function clouds(g, horizon) {
      var r = mulberry32(mode === 'mobile' ? 61 : 17);
      var n = mode === 'mobile' ? 4 : 6;
      for (var i = 0; i < n; i++) {
        var cw = 26 + r() * 54, cx = r() * (W - cw), cy = horizon * (0.18 + r() * 0.68);
        var band = Math.min(P.sky.length - 1, Math.floor(cy / (horizon / P.sky.length)));
        var tone = i % 3 === 0 ? P.cloud[1] : P.cloud[0];
        g.globalAlpha = 0.5 + r() * 0.3;
        rec(g, cx, cy, cw, 2, tone);                                   // main slab
        rec(g, cx + 5 + r() * 6, cy - 2, cw * (0.35 + r() * 0.3), 2, tone); // top bump
        rec(g, cx + cw * 0.55, cy - 1, cw * 0.2, 1, tone);
        rec(g, cx + 3, cy + 2, cw * (0.5 + r() * 0.3), 1, tone);       // bottom step
        g.globalAlpha = 1;
      }
    }

    /* ---------- hazy mountain ridges ---------- */
    function mountains(g, horizon) {
      var seeds = [[P.mtnFarS, 0.86, 14, 0.045], [P.mtnNear, 0.97, 18, 0.06]];
      for (var L = 0; L < 2; L++) {
        var c = seeds[L][0], baseF = seeds[L][1], amp = seeds[L][2], fr = seeds[L][3];
        g.globalAlpha = L === 0 ? 0.75 : 1;
        for (var x = 0; x < W; x++) {
          var n = Math.sin(x * fr + L * 9) * 0.6 + Math.sin(x * fr * 2.7 + L * 4) * 0.4;
          var y = Math.round(horizon * baseF - amp * (0.5 + 0.5 * n));
          g.fillStyle = c; g.fillRect(x, y, 1, Math.ceil(horizon + 4 - y));
        }
        g.globalAlpha = 1;
      }
    }

    /* ---------- ground moor + texture ---------- */
    function ground(g, horizon) {
      rec(g, 0, horizon, W, H - horizon, P.gdBase);
      for (var y = horizon; y < H; y++) {
        for (var x = 0; x < W; x++) {
          var v = h2(x, y);
          if (v > 244) px(g, x, y, P.gdLite);
          else if (v < 14) px(g, x, y, P.gdDash);
          else if (v > 230 && (x & 1)) rec(g, x, y, 2, 1, P.gdDash); // grass dashes
        }
      }
    }

    /* ---------- masonry fill: the texture that makes stone read as stone ---------- */
    function masonry(g, x0, y0, w, hh, back) {
      var base = back ? P.bkBase : P.stBase, dark = back ? P.bkDark : P.stDark;
      for (var y = y0; y < y0 + hh; y++) {
        for (var x = x0; x < x0 + w; x++) {
          var v = h2(x, y), c = base;
          if ((y % 3) === 0 && v < 70) c = dark;                    // mortar course rows
          else if (!back && v > 236) c = P.stLite;                  // stone glints
          else if (v < 12) c = dark;
          px(g, x, y, c);
        }
      }
      if (!back) {
        for (var yy = y0; yy < y0 + hh; yy++) {                     // lit left edge, shadow right
          px(g, x0, yy, P.stEdge);
          px(g, x0 + w - 1, yy, P.stDark);
          if ((yy & 1)) px(g, x0 + w - 2, yy, P.stDark);            // dithered shadow inset
        }
      }
    }
    function battlements(g, x0, y, w, back) {
      for (var x = x0; x < x0 + w - 1; x += 4) {
        rec(g, x, y - 2, 2, 2, back ? P.bkBase : P.stBase);
        if (!back) px(g, x, y - 2, P.stEdge);
      }
    }
    function pinnacle(g, x, yTop, back) { // little corner spike
      rec(g, x, yTop - 4, 2, 4, back ? P.bkBase : P.stBase);
      px(g, x, yTop - 5, back ? P.bkBase : P.stEdge);
    }
    function slitWin(g, x, y) { rec(g, x, y, 2, 4, P.stBlack); px(g, x, y - 1, P.stBlack); } // pointed slit
    function gate(g, cx, yBot, gw, gh) {
      rec(g, cx - gw / 2, yBot - gh + 2, gw, gh - 2, P.stBlack);
      rec(g, cx - gw / 2 + 1, yBot - gh + 1, gw - 2, 1, P.stBlack);
      rec(g, cx - 1, yBot - gh, 2, 1, P.stBlack);                    // pointed apex
    }
    function vines(g, x0, y0, w) { // red flowering vines cascading off a wall top
      for (var x = x0 + 1; x < x0 + w - 1; x++) {
        var v = h2(x, y0);
        if (v > 205) {
          var len = 2 + (v % 7);
          for (var k = 0; k < len; k++) {
            if (h2(x, y0 + k) > 60) px(g, x, y0 + k, k < 2 ? P.redMid : P.redDeep);
          }
          if (v > 240) px(g, x, y0, P.redHi);
        }
      }
    }
    function bush(g, cx, cy, r) {
      for (var y = -r; y <= r; y++) for (var x = -r - 1; x <= r + 1; x++) {
        if (x * x * 0.6 + y * y * 1.6 <= r * r && h2(cx + x, cy + y) > 40) {
          px(g, cx + x, cy + y, y < 0 ? (h2(cx + x, cy - y) > 170 ? P.redHi : P.redMid) : P.redDeep);
        }
      }
    }

    /* ---------- the castle: cathedral massing on a rocky crag ---------- */
    function castle(g, cX, horizon) {
      var cragTop = Math.round(H * (mode === 'mobile' ? 0.66 : 0.70));
      var baseY = Math.round(H * (mode === 'mobile' ? 0.86 : 0.90));

      // rocky crag (drawn first; castle sits on it)
      var cragW = mode === 'mobile' ? 78 : 104;
      for (var y = cragTop; y < baseY + 6 && y < H; y++) {
        var prog = (y - cragTop) / (baseY - cragTop + 6);
        var wHere = cragW * (0.5 + 0.5 * prog);
        var x0 = Math.round(cX - wHere / 2 + Math.sin(y * 1.7) * 2), x1 = Math.round(cX + wHere / 2 + Math.sin(y * 2.3) * 2);
        for (var x = x0; x <= x1; x++) {
          var v = h2(x, y), c = P.rkBase;
          if (v < 34) c = P.rkDark; else if (v > 238) c = P.rkLite;
          if (x < x0 + 2 || x > x1 - 2) c = P.rkDark;
          px(g, x, y, c);
        }
      }
      // red tufts at the crag base + on ledges
      bush(g, cX - cragW * 0.34, baseY - 2, 3);
      bush(g, cX + cragW * 0.3, baseY - 4, 2);
      bush(g, cX - cragW * 0.1, cragTop + 4, 2);

      // ---- back (far) elements: darker, no edge light ----
      var bt = { w: 16, h: 44 }; // back-left tower
      var btx = Math.round(cX - 34), bty = cragTop - 26 - bt.h;
      masonry(g, btx, bty, bt.w, bt.h + 30, true);
      battlements(g, btx, bty, bt.w, true);
      pinnacle(g, btx, bty, true); pinnacle(g, btx + bt.w - 2, bty, true);
      var bt2x = Math.round(cX + 22), bt2y = cragTop - 12 - 34;
      masonry(g, bt2x, bt2y, 14, 34 + 18, true);
      battlements(g, bt2x, bt2y, 14, true);

      // ---- mid keep: broad body with vines + gate ----
      var kw = mode === 'mobile' ? 52 : 62, kh = 34;
      var kx = Math.round(cX - kw / 2), ky = cragTop - kh + 6;
      masonry(g, kx, ky, kw, kh);
      battlements(g, kx, ky, kw);
      vines(g, kx, ky + 1, kw);
      slitWin(g, kx + 8, ky + 10); slitWin(g, kx + 18, ky + 10); slitWin(g, kx + kw - 12, ky + 10);
      slitWin(g, kx + 13, ky + 20); slitWin(g, kx + kw - 20, ky + 20);
      gate(g, cX, ky + kh, 6, 9);

      // ---- main tower: tall, corner pinnacles, the lone lit window ----
      var tw = mode === 'mobile' ? 20 : 24, th = mode === 'mobile' ? 52 : 62;
      var tx = Math.round(cX - tw / 2 + (mode === 'mobile' ? 0 : 6)), ty = ky - th + 6;
      masonry(g, tx, ty, tw, th + 10);
      battlements(g, tx, ty, tw);
      pinnacle(g, tx, ty); pinnacle(g, tx + tw - 2, ty);
      pinnacle(g, tx + Math.round(tw / 2) - 1, ty - 1);
      for (var wy = ty + 8; wy < ky - 4; wy += 9) {
        slitWin(g, tx + 5, wy); slitWin(g, tx + tw - 7, wy);
      }
      litWin = { x: tx + 5, y: ty + 8 };                      // pulses amber in the anim pass
      vines(g, tx, ty + th * 0.45, tw);                        // vines on the tower flank too

      // ---- waterfall thread off the crag (inspo detail) ----
      fallX = Math.round(cX - cragW * 0.18); fallY0 = cragTop + 8; fallY1 = baseY + 2;
      for (var fy = fallY0; fy < fallY1; fy++) px(g, fallX + (h2(3, fy) & 1), fy, P.waterD);
      rec(g, fallX - 1, fallY1, 4, 2, P.waterD);
    }

    /* ---------- the crimson tree: huge canopy bleeding off the top-right ---------- */
    function tree(g) {
      var cx = Math.round(W * (mode === 'mobile' ? 0.92 : 0.90));
      var cy = Math.round(H * (mode === 'mobile' ? 0.10 : 0.13));
      var R = Math.round(W * (mode === 'mobile' ? 0.30 : 0.17));
      // trunk + limbs first (dark, gnarled), so canopy overlays; roots reach the ground
      var gy = Math.round(H * (mode === 'mobile' ? 0.62 : 0.70));
      for (var yy = cy; yy < gy; yy++) {
        var wob = Math.round(Math.sin(yy * 0.14) * 2 + (yy - cy) * 0.22);
        rec(g, cx + 6 + wob, yy, yy > cy + R * 0.8 ? 3 : 4, 1, P.trunk);
      }
      rec(g, cx + 6 + Math.round(Math.sin(gy * 0.14) * 2 + (gy - cy) * 0.22) - 2, gy - 1, 8, 2, P.trunk); // root flare
      rec(g, cx - R * 0.5, cy + R * 0.35, R * 0.55, 2, P.trunk);      // limb reaching left
      rec(g, cx - R * 0.2, cy + R * 0.05, 2, R * 0.35, P.trunk);
      // canopy: overlapping ragged blobs, top-lit
      var blobs = [
        [cx, cy, R], [cx - R * 0.8, cy + R * 0.30, R * 0.62], [cx + R * 0.55, cy + R * 0.28, R * 0.7],
        [cx - R * 0.35, cy - R * 0.28, R * 0.55], [cx + R * 0.2, cy + R * 0.6, R * 0.5],
        [cx - R * 1.25, cy + R * 0.52, R * 0.36]
      ];
      for (var b = 0; b < blobs.length; b++) {
        var bx = blobs[b][0], by = blobs[b][1], br = blobs[b][2];
        for (var y = -br; y <= br; y++) for (var x = -br; x <= br; x++) {
          var d = (x * x + y * y) / (br * br);
          if (d > 1) continue;
          var gx2 = Math.round(bx + x), gy2 = Math.round(by + y);
          if (gx2 < 0 || gx2 >= W || gy2 < 0) continue;
          var v = h2(gx2, gy2);
          if (d > 0.86 && v < 120) continue;                          // ragged leafy edge
          var c = P.redMid;
          if (y < -br * 0.25 && v > 105) c = P.redHi;                 // top-lit crown
          else if (d > 0.55 && y > 0) c = P.redDeep;                  // under-shadow
          else if (v < 26) c = P.redDeep;
          if (v > 247) c = P.redHi;
          px(g, gx2, gy2, c);
        }
      }
      // fallen petals pooled beneath (on the ground plane)
      for (var f = 0; f < 70; f++) {
        var fx = cx - R * 1.4 + (h2(f, 7) / 255) * R * 2.4, fy2 = gy - 1 + (h2(f, 13) / 255) * (H - gy) * 0.6;
        if (fy2 < H && fx < W) px(g, fx, fy2, h2(f, 19) > 128 ? P.redDeep : P.petal);
      }
    }

    /* ---------- pale stone path (the hero stands on it) ---------- */
    function path(g) {
      var y0 = Math.round(H * (mode === 'mobile' ? 0.90 : 0.925));
      var xa = Math.round(W * (mode === 'mobile' ? 0.10 : 0.30));
      var xb = Math.round(W * (mode === 'mobile' ? 0.92 : 0.86));
      var i = 0;
      for (var x = xa; x < xb; x += 7 + (h2(x, 1) % 4)) {
        var y = y0 + Math.round(Math.sin(x * 0.05) * 1.6) + (i % 2);
        var sw = 4 + (h2(x, 2) % 4);
        rec(g, x, y, sw, 2, P.pth);
        px(g, x, y, P.pthD); px(g, x + sw - 1, y + 1, P.pthD);
        rec(g, x - 1, y + 2, sw, 1, P.pthG);
        i++;
      }
    }

    /* ---------- foreground rock silhouettes framing the bottom corners ---------- */
    function fgRocks(g) {
      for (var x = 0; x < W; x++) {
        var lh = Math.max(0, 8 - x * 0.12 + Math.sin(x * 0.5) * 2);           // left mound
        var rh = Math.max(0, 8 - (W - x) * 0.10 + Math.sin(x * 0.4) * 2);     // right mound
        var hh = Math.max(lh, rh);
        if (hh > 0) rec(g, x, H - hh, 1, hh, P.fgRock);
      }
    }

    /* ---------- static scene assembly ---------- */
    function build() {
      var horizon = Math.round(H * (mode === 'mobile' ? 0.58 : 0.64));
      sky(o, horizon);
      clouds(o, horizon);
      mountains(o, horizon);
      ground(o, horizon);
      castle(o, Math.round(W * (mode === 'mobile' ? 0.42 : 0.60)), horizon);
      tree(o);
      path(o);
      fgRocks(o);
      hero.x = Math.round(W * (mode === 'mobile' ? 0.55 : 0.74));
      hero.y = Math.round(H * (mode === 'mobile' ? 0.905 : 0.93));
      // drifting petals seeded near the canopy
      petals = [];
      var r = mulberry32(5), nP = mode === 'mobile' ? 16 : 26;
      for (var i = 0; i < nP; i++) {
        petals.push({
          x: W * (0.55 + r() * 0.45), y: H * r() * 0.5,
          vx: -(0.08 + r() * 0.2), vy: 0.05 + r() * 0.14, ph: r() * 6.28, s: r() < 0.25 ? 2 : 1
        });
      }
      birds = [];
      for (var b = 0; b < 3; b++) birds.push({ x: W * (0.2 + r() * 0.5), y: H * (0.12 + r() * 0.2), v: 0.06 + r() * 0.08 });
    }

    /* ---------- the hero sprite: red hooded cape + staff, 2-frame flutter ---------- */
    function drawHero(g, f) {
      var x = hero.x, y = hero.y; // y = feet
      var C = P.cape, D = P.capeD, B = P.body;
      // staff
      rec(g, x + 5, y - 11, 1, 11, B); px(g, x + 4, y - 11, P.redMid);
      // hood
      rec(g, x + 1, y - 10, 2, 1, C);
      rec(g, x, y - 9, 4, 2, C);
      px(g, x + 2, y - 8, B);                       // shadowed face
      // cloak body (flutter widens the back edge)
      rec(g, x - (f ? 1 : 0), y - 7, 4 + (f ? 1 : 0), 4, C);
      px(g, x - (f ? 1 : 0), y - 4, D);
      rec(g, x, y - 3, 4, 2, D);
      // feet
      px(g, x + 1, y - 1, B); px(g, x + 3, y - 1, B);
      // ground shadow
      g.globalAlpha = 0.45; rec(g, x - 1, y, 7, 1, '#000'); g.globalAlpha = 1;
    }

    /* ---------- per-frame animated pass over the static art ---------- */
    function frame() {
      ctx.clearRect(0, 0, W, H);
      ctx.drawImage(off, 0, 0);
      var tick = t / 10;
      // plus-sparkle stars
      for (var s = 0; s < sparkles.length; s++) {
        var sp = sparkles[s], a = 0.5 + 0.5 * Math.sin(tick * 0.9 + sp.p * 7);
        ctx.globalAlpha = 0.35 + a * 0.6;
        px(ctx, sp.x, sp.y, P.star);
        if (a > 0.45) { px(ctx, sp.x - 1, sp.y, P.star); px(ctx, sp.x + 1, sp.y, P.star); px(ctx, sp.x, sp.y - 1, P.star); px(ctx, sp.x, sp.y + 1, P.star); }
        ctx.globalAlpha = 1;
      }
      // lit window pulse
      if (litWin) {
        ctx.globalAlpha = 0.7 + 0.3 * Math.sin(tick * 0.5);
        rec(ctx, litWin.x, litWin.y, 2, 4, P.amber);
        ctx.globalAlpha = 0.18 + 0.1 * Math.sin(tick * 0.5);
        rec(ctx, litWin.x - 1, litWin.y - 1, 4, 6, P.amber);
        ctx.globalAlpha = 1;
      }
      // waterfall shimmer
      for (var fy = fallY0; fy < fallY1; fy += 1) {
        if (((fy + (t >> 2)) % 5) === 0) px(ctx, fallX + (h2(3, fy) & 1), fy, P.water);
      }
      // birds: tiny 2-frame 'v' flecks circling the castle sky
      for (var b = 0; b < birds.length; b++) {
        var bd = birds[b];
        bd.x += bd.v; if (bd.x > W + 4) { bd.x = -4; }
        var by = bd.y + Math.sin(tick * 0.6 + b * 2) * 2;
        var fl = ((t >> 4) + b) & 1;
        px(ctx, bd.x, by, P.stBlack); px(ctx, bd.x - 1, by + (fl ? -1 : 0), P.stBlack); px(ctx, bd.x + 1, by + (fl ? -1 : 0), P.stBlack);
      }
      // drifting petals
      for (var i = 0; i < petals.length; i++) {
        var p = petals[i];
        p.x += p.vx; p.y += p.vy + Math.sin(tick + p.ph) * 0.04;
        if (p.y > H * 0.94 || p.x < -2) { p.x = W * (0.68 + Math.random() * 0.34); p.y = H * (0.02 + Math.random() * 0.25); }
        ctx.globalAlpha = 0.75;
        rec(ctx, p.x, p.y, p.s, 1, P.petal);
        ctx.globalAlpha = 1;
      }
      drawHero(ctx, (t >> 5) & 1);
      t++;
      raf = requestAnimationFrame(frame);
    }

    function resize() {
      var r = canvas.getBoundingClientRect();
      var scale = mode === 'mobile' ? 3 : 4.5;
      W = Math.max(80, Math.round(r.width / scale));
      H = Math.max(80, Math.round(r.height / scale));
      canvas.width = W; canvas.height = H;
      off.width = W; off.height = H;
      ctx.imageSmoothingEnabled = false;
      build();
      if (reduce) { ctx.drawImage(off, 0, 0); drawHero(ctx, 0); }
    }

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    resize();
    if (!reduce) raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resize);
    return {
      destroy: function () {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', resize);
      }
    };
  }

  global.initScene = initScene;
})(window);
