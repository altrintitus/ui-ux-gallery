// Auto-maintained index of the gallery. Loaded by gallery.html (no build step).
// One object per design. The recreate-design skill appends an entry per build.
//
// Entry shape:
//   {
//     slug:     "aurora-saas-landing",          // folder name
//     title:    "Aurora SaaS Landing",          // human title
//     category: "landing",                       // primary type (landing/dashboard/ecommerce/portfolio/app/blog/…)
//     tags:     ["dark", "glassmorphism"],      // mood/style tags
//     desktop:  "aurora-saas-landing/preview/desktop.png",
//     mobile:   "aurora-saas-landing/preview/mobile.png",
//     source:   "https://…"                      // optional reference link
//   }
window.GALLERY = [
  // entries appended below, newest last
  {
    slug: "pixel-gothic",
    title: "Crimson Keep — Lone-Hero Pixelscape",
    category: "landing",
    tags: ["pixel-art", "dark", "gothic", "gaming", "crimson", "game-ui"],
    desktop: "pixel-gothic/preview/desktop.png",
    mobile: "pixel-gothic/preview/mobile.png",
    source: "local inspo — lone-hero pixelscape mood board"
  },
  {
    slug: "frutiger-aero",
    title: "OASYS — Frutiger Aero Water Brand",
    category: "landing",
    tags: ["frutiger-aero", "y2k", "aqua", "gloss", "eco", "animated"],
    desktop: "frutiger-aero/preview/desktop.png",
    mobile: "frutiger-aero/preview/mobile.png",
    source: "local inspo — Frutiger Aero mood board"
  }
];
