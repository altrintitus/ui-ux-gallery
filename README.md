# UI/UX Design Gallery

A personal reference library of UI/UX web designs. Each design is a **self-contained,
responsive, zero-build page** — open the HTML and it runs. Browse for a style, then lift the
markup, palette, or a component straight into a real project.

## Browse

Open **[`gallery.html`](gallery.html)** in a browser — a grid of every design with tag filters
and search. Or open a folder directly:

- `<design>/desktop.html` — desktop layout
- `<design>/mobile.html` — mobile layout
- `<design>/NOTES.md` — palette, fonts, and what's worth reusing

## Designs

- **[pixel-gothic](pixel-gothic/)** — Crimson Keep, a pixel-art gothic gaming-lounge landing
  (a lone-hero pixelscape). Hand-rendered pixel scene, game-UI panels, desktop + mobile.
- **[frutiger-aero](frutiger-aero/)** — AquaOS 7, a cluttered Frutiger Aero fake-OS product
  site: Aero-glass windows, taskbar, real era imagery, fish, bubbles, badges, marquee.

## Structure

```
<design>/
├── desktop.html      # desktop layout
├── mobile.html       # mobile layout
├── styles.css
├── assets/           # scripts, art
├── NOTES.md          # palette / fonts / what to reuse
└── preview/          # desktop.png + mobile.png
gallery.html          # the browse surface
gallery-data.js       # gallery index
```

## Conventions

- Plain **HTML + Tailwind (CDN) + vanilla JS** — no build step, no dependencies to install.
- Each design is **self-contained** — it copies out as a single folder.
- Every design ships **both layouts**, a `NOTES.md`, and **preview images**.
