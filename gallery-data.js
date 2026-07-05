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
    slug: "crimson-keep",
    title: "Crimson Keep — Lone-Hero Pixelscape",
    category: "landing",
    tags: ["pixel-art", "dark", "gothic", "gaming", "crimson", "game-ui"],
    desktop: "crimson-keep/preview/desktop.png",
    mobile: "crimson-keep/preview/mobile.png",
    source: "local inspo — lone-hero pixelscape mood board"
  }
];
