# Wharton-Smith website concept

A redesign concept for [whartonsmith.com](https://whartonsmith.com), built with React, [Motion](https://motion.dev) and Vite.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## What's here

| Section | Motion |
| --- | --- |
| Preloader | Counts 1984 → today, then wipes away (once per session) |
| Hero | A water treatment plant plan draws itself in, with clarifier arms turning and flow moving through the pipes; parallax on scroll |
| Office marquee | Speeds up and changes direction with scroll velocity |
| Statement | Lights up word by word as you scroll |
| Markets | Pinned horizontal rail with an animated line drawing for each market |
| Services | Accordion of delivery methods with a rolling index number |
| Stats | Count-up numbers and ENR recognitions |
| Projects | Filterable grid with shared-layout animations |
| Footprint | Map of all 11 offices with arcs drawn out from Sanford HQ |
| Community | $1M Legacy Point / Habitat for Humanity story, with 19 homes |
| Careers / Footer | Scroll-rotating mark and a letter-by-letter wordmark |

The site respects `prefers-reduced-motion` and is fully responsive. The pinned rail becomes a vertical stack on mobile.

## Before launch

All copy and data live in `src/data/site.ts`.

- **Projects are placeholders.** Replace them with real project names, details and photos (set `image` on each project).
- **Links:** `links.contact`, `links.careers` and `links.projects` currently point to on-page anchors.
- Check the facts against company records. They were gathered from public sources: founding year, offices, HQ address, ENR rankings and the Legacy Point gift.
