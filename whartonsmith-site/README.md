# Wharton-Smith website concept

A redesign concept for [whartonsmith.com](https://whartonsmith.com), built with React, [Motion](https://motion.dev) and Vite.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## Page structure

1. **Header**: utility bar (Bid Opportunities, Subcontractor Prequalification), main nav and Contact CTA
2. **Hero**: headline, delivery methods, CTAs and a KPI strip (founded, offices, employees, craftsmen, ENR)
3. **Recognition**: ENR, DBIA and Top Workplaces
4. **About**
5. **Markets**: six markets, with Water & Wastewater as the core market
6. **Water & Wastewater**: an animated treatment-process diagram (headworks → reuse)
7. **Services**: CMAR, Design-Build, Progressive DB / EPC, GC, Preconstruction
8. **Self-Perform**: 120+ craftsmen and the trades they cover
9. **Featured Projects**: real projects with spec sheets, filterable by market
10. **Safety**
11. **Locations**: regions and an office map
12. **News & Community**
13. **Careers**, contact band and footer

Motion is deliberately restrained: fade-ups, count-ups, line drawings that draw themselves in, and the process flow. It respects `prefers-reduced-motion`.

## Before launch

All copy and data live in `src/data/site.ts`.

- **Photography.** Put real Wharton-Smith photos in `public/images/`, then set `photos.hero`, `photos.selfPerform`, `photos.careers` and `image` on each project. Until then, technical-drawing panels fill those spots.
- **Logo.** `Logo` in `src/components/ui.tsx` is a stand-in mark. Replace it with the official logo SVG.
- **Links.** `links.*` point at on-page anchors. Point them at the real Contact, Careers, Projects, Bid and Prequalification pages.
- **Facts.** Verify project figures, office list, employee count and the safety copy (marked PLACEHOLDER) with Wharton-Smith.
