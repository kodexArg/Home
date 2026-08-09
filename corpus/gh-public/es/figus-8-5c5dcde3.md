---
id: figus-8-5c5dcde3
title: "Figus — World Cup 2026 Panini sticker album tracker and local trade finder — 4. Technology stack"
visibility: public
importance: normal
source_repo: "figus"
related: ["figus"]
tags: ["figus", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node ≥ 22.12, TypeScript 6, ES modules | package.json, tsconfig.json | | Frontend framework | Astro 6 (file-based routing, .astro pages + client scripts) | package.json, astro.config.mjs, src/pages/ | | Styling | Tailwind CSS 4 via Vite plugin | package.json, astro.config.mjs, src/styles/global.css | | Maps | Leaflet 1.9 (dynamic import in map page) | package.json, src/pages/mapa.astro | | Data / state | Static catalog.json; localStorage keys figus.collection.v1 and figus.profile.v1 | src/data/catalog.json, src/lib/store.ts | | Catalog tooling | Python script (stdlib json, re, pathlib) | Input/build_catalog.py | | Infra / deploy | None configured | no .github/workflows, no hosting manifests | | AI / agents | Minimal VS Code launch config only | .claude/launch.json | | Tests | None evident | no test runner configs |
