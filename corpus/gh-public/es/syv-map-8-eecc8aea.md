---
id: syv-map-8-eecc8aea
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — 4. Technology stack"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node ≥ 22.12 (engines), TypeScript 6, Bun for install/scripts | package.json | | Frontend framework | Astro 7 + Svelte 5 (runes, $state, $effect) | package.json, astro.config.mjs, src/lib/mapStore.svelte.ts | | Map rendering | MapLibre GL JS 5, inline raster style (Carto light no-labels) | package.json, src/components/MapView.svelte | | Map editing | Terra Draw 1.31 + MapLibre adapter (polygon, linestring, select modes) | package.json, MapView.svelte | | Styling | Tailwind CSS 4 via @tailwindcss/vite | package.json, src/styles/global.css | | Backend / API | Astro server routes (prerender = false), no separate server process | src/pages/api/polygons/ | | Data | SQLite via better-sqlite3; committed db/syv-map.db; seed GeoJSON in public/polygons/ | src/lib/db.ts, db/, public/polygons/ | | Infra / deploy | None configured—local dev only | no .github/workflows, no wrangler.jsonc | | AI / agents | MapLibre agent skills lockfile; minimal AGENTS.md | skills-lock.json, AGENTS.md | | Tests | None evident | no test configs in tree |
