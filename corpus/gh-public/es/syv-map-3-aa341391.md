---
id: syv-map-3-aa341391
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — P2 — Domain-specific region mechanics (walls vs. areas)"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---

### P2 — Domain-specific region mechanics (walls vs. areas) - **Who hurts:** Worldbuilders who must express SyV's **Región** primitive where a wall is geometrically a line but semantically still a region (it divides territory rather than connecting places). - **Pain today:** Standard map tools treat lines as routes/paths; converting a closed neighborhood polygon into an open wall at a chosen gate requires manual coordinate surgery in GeoJSON. - **How this repo answers:** The flow in and the "Abrir en un vértice → muro" UI mode in let the author click a vertex on a closed polygon; the ring is cut there and the feature becomes a with , rendering as border-only (no interior fill). / helpers distinguish fillable polygons from open-line regions at render time. - **Out of scope:** Full implementation of **Lugar** (point) and **Ruta** (path) primitives described in —those remain planned, not shipped.
