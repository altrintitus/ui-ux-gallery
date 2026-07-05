---
title: OASYS — Frutiger Aero Water Brand
slug: frutiger-aero
category: landing
tags: [frutiger-aero, y2k, aqua, gloss, eco, animated]
source: local inspo (gitignored) — FA mood board: Y2K aqua collages + crystal-city utopias
created: 2026-07-05
---

## The idea
A landing page for OASYS, a fictional pure-water brand, built as **full-maximal Frutiger
Aero** — the mid-2000s tech-optimism aesthetic (Vista/aqua era): glossy glass, electric
saturation, sky→crystal-city→meadow→caustic-water panorama, iridescent bubbles, goldfish.
"Drink the future. / Welcome to a better tomorrow."

## What to steal

### The 3 laws that make it FA (not cheap glassmorphism)
1. **Gloss is PAINTED, not blurred** — every button/card carries a hard white top highlight
   band (`::before`, opaque→transparent at 48–50%) + inner glow + bottom caustic sliver.
   Blur alone = frosted shower glass = wrong era.
2. **Saturation stays electric** — sky `#5AC8F5`, aqua `#22D4C8`, grass `#4DBF5A`.
   Desaturating "for taste" collapses the whole vibe into 2016 minimalism.
3. **Shadows are pools of light** — every shadow is aqua-tinted (`rgba(0,180,220,.35)`).
   One grey/black shadow reads as the wrong decade.

### Palette
- sky `#5AC8F5→#1A8FCA` · water `#22D4C8` / deep `#0A5A8A` · grass `#4DBF5A`
- glass: `rgba(255,255,255,.18)` fill + `.55` white border, always tinted by what's behind
- **goldfish orange `#FF7D30` = the only warm accent** (stats, fish, one CTA variant)
- iridescent bubble films: `#C5A0E8` / `#7FE5E2` / `#A8F0A0`
- type: **Nunito 800/900** display + **Nunito Sans** body (closest free Frutiger-era humanist)

### Components worth lifting
- `.btn-aqua` — the 7-layer era button (gradient, painted band, inner glow, caustic, border,
  aqua glow, pill shape)
- `.glass` / `.glass-solid` — frosted cards that still get the painted band
- `.orb` — 3D aqua sphere icon container
- `.bubble b1/b2/b3` + JS spawner — iridescent bubbles incl. **dome-sized giants**
  (`data-giants`) drifting on 20s+ loops; the FA signature scale
- `.caustics` — pure-CSS drifting light caustics (layered radial-gradients, soft-light)
- `.signage` — dark-glass environmental signage plate ("SECTOR 04 · a better tomorrow")
- Crystal-city inline SVG with **living foliage on the towers** — the flora-on-glass trinity
  (green growing on crystal under blue) is THE FA compositional signature

## Watch-outs learned in review
- White text on bright sky fails contrast — fix with strong blue text-shadows
  (`rgba(0,60,120,.75)`), not by darkening the sky.
- `.reveal`-style scroll animations leave fullpage screenshots empty — scroll the page
  through before capturing.
- Towers with no vegetation read as generic "glass city"; add planted terraces + base bushes.

## Reuse
The gloss system (`styles.css`) drops into any Y2K/aero project unchanged. Swap the palette
tokens and the same recipe does "dark aero" (Vista Ultimate) or "candy aqua" (early iMac).
