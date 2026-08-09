---
id: syv-map-6-1b8e2180
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Explore Dársena:** Run bun run dev, open the local dev port, toggle barrios (Centro, Zona Militar, Barrio de la Armada, Gremio de Pesca, Muro, etc.) and optionally reveal the Cuerpo de Hielo impact rings for geographic context. 2. **Author a new region:** Click "＋ nueva área…", draw a polygon on the map, auto-persist as area-<timestamp> with default orange styling; rename and recolor from the sidebar. 3. **Edit an existing wall or neighborhood:** Enter vertex-edit mode on a layer, drag points, save back to SQLite; or use "open at vertex" to turn a closed barrio into an open wall at a gate. 4. **Reset to seed canon:** Confirm ↺ Restaurar to wipe SQLite and re-import all public/polygons/*.geojson in index.json order—useful after experimental edits. 5. **Bulk seed via script:** With dev server in background mode, run bun run seed (scripts/seed-db.ts) to HTTP PUT all disk polygons into SQLite (Bun does file I/O; Node dev server does the native SQLite write).
