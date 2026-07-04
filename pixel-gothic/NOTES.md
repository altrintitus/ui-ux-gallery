---
title: Crimson Keep — Lone-Hero Pixelscape
slug: pixel-gothic
category: landing
tags: [pixel-art, dark, gothic, gaming, crimson, game-ui]
source: local inspo (gitignored) — "lone hero dwarfed by a vast pixelscape" mood board (Pinterest-sourced pixel art)
created: 2026-06-29
---

## The idea
A gaming-cafe / lounge landing ("Crimson Keep") in the lone-hero pixelscape genre — a tiny
red-caped figure dwarfed by a massive gothic world. **Vibe-inspired, not a clone.** Third
iteration: true pixel-art renderer + full game-UI page system (the first two attempts —
procedural rects, then SVG silhouettes — both failed the "reads as pixel art" bar).

## What to steal

### The scene recipe (what finally made it work)
- **Masonry texture** — stone reads as stone only with texture: mortar-course rows every
  3rd px + hash glints + lit left edge / dithered right shadow. Flat fills read as blobs.
- **Stepped band sky** — 5 slate bands with 2-row checker-dither seams. Overcast slate
  (`#1c2b3c → #3a5d7c`), NOT black — the inspo sky is light; dark UI panels sit on top.
- **Flat chunky clouds** — horizontal slabs with stepped bumps, one tone lighter than the band.
- **Red distributed everywhere** — canopy + vines cascading off walls + bushes on the crag +
  petals swirling in the sky + fallen petals pooled under the tree. One red blob = dead scene.
- **Detail beats = life**: waterfall thread off the crag, birds circling, one pulsing amber
  window, plus-shaped sparkle stars, pale stone path slabs leading to the hero.
- **Hero**: 8×12 px, red hood + cape (SAME red as the tree), staff, 2-frame cape flutter.

### Palette
- slate world: sky `#1c2b3c→#3a5d7c` · stone `#252f3c/#2e3a49/#1b2530` · ground `#182634`
- crimson signal `#e02525/#a81414/#6b0a0d` — the only saturated hue
- one amber window `#E8A030` · desaturated waterfall `#8fa9c2`

### The game-UI page system
- Fonts: **Press Start 2P** (labels/nav/buttons, 8–11px) + **Pixelify Sans** (display) +
  **VT323** (body at 19–22px). No neutral sans anywhere.
- `.panel` — hard 4px offset shadow, 2px border, zero radius; hover = translate(-2,-2).
- `.btn` — chunky bezel (inset highlight/shadow), press = translate into its own shadow.
- `.dither` — 8px checkerboard strips as section dividers (conic-gradient).
- 12×12 pixel-art SVG icons (monitor/gamepad/wheel/VR) with `image-rendering:pixelated`.
- Flavor: `// EYEBROW` tags, `>` list prefixes, `★ MOST RAIDED`, blinking `► INSERT COIN`.

## How the scene is made
`assets/scene.js`: renders once into a low-res offscreen canvas (art px; desktop ÷4.5,
mobile ÷3), upscaled via `image-rendering:pixelated`. Deterministic hash `h2(x,y)` drives all
texture (no flicker). Per-frame pass redraws only dynamics: drifting petals, birds, sparkle
stars, waterfall shimmer, window pulse, hero cape. Respects `prefers-reduced-motion`.

## Reuse
Lift the scene renderer + swap `castle()`/`tree()` builders for any pixel world. The masonry /
dither / band-sky helpers are generic. The game-UI CSS system (`panel/btn/dither/tag`) drops
into any retro-game page unchanged.
