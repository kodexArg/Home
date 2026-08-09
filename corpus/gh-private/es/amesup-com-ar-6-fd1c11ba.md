---
id: amesup-com-ar-6-fd1c11ba
title: "AMESUP — institutional mutual landing site (Angular SPA) — 3. Product / idea (2)"
visibility: private
importance: normal
source_repo: "amesup-com-ar"
related: []
tags: ["amesup-com-ar", "github", "private", "normal", "summary"]
---

(src/app/app.routes.ts) is minimal: / → landing, /notfound → 404 page, ** → redirect to notfound. No lazy-loaded feature modules; all frontpage components are eagerly imported into LandingComponent. Business context and copy direction live in AMESUP.md (Spanish business brief extracted from 2026 brochures) and CLAUDE.md (developer/agent orientation). CHANGELOG.md records v1.0.0 initial launch and v1.1.0 GTM integration.
