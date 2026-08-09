---
id: amesup-com-ar-4-31a9ef4a
title: "AMESUP — institutional mutual landing site (Angular SPA) — P3 — Repeatable deployable frontend asset pipeline"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
related: []
tags: ["amesup-com-ar", "github", "private", "normal", "summary"]
---

### P3 — Repeatable deployable frontend asset pipeline - **Who hurts:** Developers and operators who must ship UI changes safely without manual server administration. - **Pain today:** Marketing updates require coordinated rebuilds; without CI/CD, regressions in build or tests could reach production unnoticed. - **How this repo answers:** amplify.yml defines an AWS Amplify build (npm ci, ng build --configuration production, artifact dist/amesup/browser). GitHub Actions (ci.yml) runs on push/PR to main: Node 22, npm ci, npm test, npm run build:prod. Static SPA output with long-cache headers for JS/CSS. Version tracked in src/app/version.ts (currently 1.1.0 per changelog). - **Out of scope:** Infrastructure-as-code for AWS beyond Amplify's native config; multi-environment wrangler/workers patterns (this is pure static hosting).
