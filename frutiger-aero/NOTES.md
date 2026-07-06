---
title: AquaOS 7 — Frutiger Aero Desktop
slug: frutiger-aero
category: landing
tags: [frutiger-aero, y2k, aqua, cluttered, fake-os, web-shrine]
source: local inspo (gitignored) + assets from frutigeraeroarchive.org (foregrounds, wallpapers, userbars)
created: 2026-07-05
---

## The idea
"AquaOS 7" — a product site for a fictional 2007 operating system, built as a **deliberately
cluttered Frutiger Aero fake-OS**: the page IS the desktop. Menu bar with dropdowns, Aero-glass
windows as sections, glossy taskbar nav, and **real era imagery stitched everywhere** —
polaroids over windows, fish, bubbles, grass strips growing over the footer, userbars, badges,
marquee, hit counter. Web-shrine energy on purpose.

## Real assets (assets/img/, sourced from the Frutiger Aero Archive)
- `wall-bliss.jpg` — green-hills/sky stock: THE desktop wallpaper behind everything
- `scene-underwater-fish.jpg` — tropical fish shallows: AeroSync window interior
- `scene-eco-globe.jpg`, `scene-petal-dew.jpg`, `scene-leaf-ripple.jpg`, `poster-pentium.jpg`
  — polaroid clutter overlapping windows
- `scene-meadow-city/lotus-sky/split-earth/house-pond/ocean-ripple.jpg` — wallpaper-gallery grid
- `scene-leaf-screen.jpg` — "LiveMeadow screensaver" banner
- `fx-flare.jpg` — real lens-flare photo, `mix-blend-mode:screen` over the sky
- `fg-flowers.png`, `fg-mountain.png` — transparent landscape strips layered over the footer
- `ub-*.png/jpg` — six real 350×19 userbars

## What to steal
- **The fake-OS frame:** `.menubar` (dropdown menus, live clock) + `.window`/`.titlebar`
  (painted gloss band, min/max/close, status bar) + `.taskbar` (start orb, pinned buttons,
  tray). Sections-as-windows works for any nostalgia OS concept.
- **Collage recipe:** `.polaroid` (white frame + caption + rotation) overlapping window
  corners; transparent `.fg-strip` PNGs bridging sections; `mix-blend-mode:screen` to
  composite flare photos onto any sky.
- **Gloss laws** (unchanged): painted top highlight band, electric saturation, aqua shadows.
- **Shrine kit:** marquee ticker, 88×31 badge wall, odometer counter, webring links, userbar
  stack, "© 2007" footer voice.

## Watch-outs
- `position:fixed` backdrops paint only the first fold in fullPage screenshots — give `body`
  a matching gradient so captures/overscroll stay in-world.
- Blur-only glass reads 2010s; the painted band is what makes it 2007.
- Archive images are community-curated era graphics — fine for a reference gallery, credit
  the archive, don't ship commercially.
