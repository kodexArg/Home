---
id: amesup-com-ar-4-31a9ef4a
title: "AMESUP — institutional mutual landing site (Angular SPA) — P3 — Repeatable deployable frontend asset pipeline"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
related: []
tags: ["amesup-com-ar", "github", "private", "normal", "summary"]
---
### P3 — Repeatable deployable frontend asset pipeline

- **Who hurts:** Developers and operators who must ship UI changes safely without manual server administration.
- **Pain today:** Marketing updates require coordinated rebuilds; without CI/CD, regressions in build or tests could reach production unnoticed.
- **How this repo answers:** defines an AWS Amplify build ( , , artifact ). GitHub Actions ( ) runs on push/PR to : Node 22, , , . Static SPA output with long-cache headers for JS/CSS. Version tracked in (currently per changelog).
- **Out of scope:** Infrastructure-as-code for AWS beyond Amplify's native config; multi-environment wrangler/workers patterns (this is pure static hosting).
