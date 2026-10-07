# Wharton-Smith website concept — Editorial (saved)

An editorial, cinematic redesign concept for [whartonsmith.com](https://whartonsmith.com), built with React, [Motion](https://motion.dev), Three.js ([React Three Fiber](https://r3f.docs.pmnd.rs)) and Vite.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build in dist/
```

## The idea

Construction is a visual business, but stock photos of cranes look like every other contractor. This concept presents Wharton-Smith's work the way architects present theirs: as **white study models in warm evening light**.

- **Hero:** a live 3D model of a water reclamation facility. Headworks, aeration basins, clarifiers, filters and storage rise out of the ground on load, the clarifier bridges turn slowly, and the camera drifts with the pointer and moves in as you scroll. On phones, or with reduced motion, a pre-rendered still is shown instead.
- **Every other image** is a still rendered from the same 3D scenes (`src/three`): the water plant, a high school campus, a justice campus with a parking garage, and a sports venue.
- **Typography:** Instrument Serif for display and Inter Tight for text, on a limestone paper color that matches the render sky so images bleed into the page.
- **Motion:** headlines rise line by line from behind a mask, the statement lights up word by word, one image opens to full-bleed as you scroll, the selected work scrolls sideways, and the expertise list floats a model image beside the cursor.

## Re-rendering the stills

The stills in `public/renders` come from `render.html?view=<name>` (views are listed in `src/three/Stage.tsx`). With the dev server running, open that URL and save the canvas, or script it with Playwright.

## Before launch

All copy and data live in `src/data/site.ts`.

- **Facts:** gathered from public sources. Verify the project figures, office list, employee count and safety copy with Wharton-Smith.
- **Photography:** when real project photography is available, set `image` on any project or expertise entry to replace a study-model render.
- **Links:** `links.*` point to on-page anchors. Point them at the real Contact, Careers and Bid pages.
