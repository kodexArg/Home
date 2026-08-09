---
id: syv-map-5-e310d525
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---
## 3. Product / idea

SyV Map is conceived as a **living map** for a speculative-fiction Argentina: cities like Dársena, Córdoba, Mendoza, San Luis, confederal trade corridors, agricultural belts, and the fixed "Cuerpo de Hielo" meteor impact overlay (2039) that situates Dársena near the edge of the blast zones. The mental model is **authoring surface → in-memory Svelte store → HTTP API → SQLite file**, with disk GeoJSON as bootstrap canon. The UI is a single Astro page ( ) hosting one Svelte island ( , ). MapLibre renders each layer as paired fill + line MapLibre sources; stack order in the sidebar maps to z-order on the map. Terra Draw handles create-mode polygon drawing and select-mode vertex dragging. A separate fixed overlay (not in the store) renders concentric impact zones from hardcoded coordinates transcribed from an external HTML impact map—toggleable but never editable. Styling inherits Presentation Orange / warm-ink tokens from via (Nunito + DM Mono, cream-on-ink palette, orange accent)—ported as CSS variables and Tailwind v4 mappings, not as copied component CSS.
