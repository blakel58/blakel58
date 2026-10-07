# Wharton-Smith website concept (construction)

A construction-forward redesign concept for [whartonsmith.com](https://whartonsmith.com), built with React, [Motion](https://motion.dev), Three.js ([React Three Fiber](https://r3f.docs.pmnd.rs)) and Vite. The earlier editorial concept is saved in `../concepts/editorial` and on the `claude/whartonsmith-editorial-concept` branch.

```bash
npm install
npm run dev                                  # local dev server
npm run build                                # production build (real branding)
VITE_DEMO=1 npx vite build --base ./         # shareable preview, placeholder branding
```

## Pages

The site is split into pages with a small hash router (`src/router.tsx`, `src/pages.tsx`): Home, Water, Commercial, Projects, Technology, Our Process, About, Careers and Contact. Routes are plain tokens such as `#water` and `#projects`.

## Sections

| Section | What it shows |
| --- | --- |
| Hero | Image/video area, headline, CTAs, key numbers |
| Divisions | Water and Commercial side by side; hover widens one |
| STA 1+00 · Water | Capabilities, feature image, water projects |
| STA 2+00 · Commercial | Market tiles (municipal, education, venues, community), projects |
| STA 3+00 · Technology | A 4D model you drag to build a plant, plus VDC, drones, prefab and field tools |
| STA 4+00 · Our Process | Traditional vs. collaborative schedule (illustrative) and five steps |
| STA 5+00 · Self-Perform & Safety | 120+ craft, trades, image area, safety statement |
| STA 6+00 · Locations | Office list and map |
| STA 7+00 · Careers | Image area, roles |

## Image areas

Every image slot is an `Img` in `src/data/site.ts`: `{ src, shot, real }`. Today each slot shows a study-model render plus a yellow tag naming the photo that belongs there, which doubles as a shot list for the photographer. Drop a photo into `public/images/`, point `src` at it and set `real: true`, and the tag disappears. The hero also accepts a muted drone `video`.

## Before launch

- Content lives in `src/data/site.ts`. `site.demo.ts` is its placeholder twin for previews, so keep the two files' exports in sync.
- Confirm the facts, the technology list (marked CONFIRM) and the safety copy.
- Point `links.*` at the real Contact, Careers and Bid pages.
- The contact form is a placeholder: wire it to a real form handler.
- Colors are placeholders. Swap the tokens at the top of `src/styles.css` (marked BRAND) for the company's real palette.
