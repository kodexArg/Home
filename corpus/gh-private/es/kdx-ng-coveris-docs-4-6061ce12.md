---
id: kdx-ng-coveris-docs-4-6061ce12
title: "Coveris Documentation Portal — Angular docs site and QA harness — P3 — Design system discoverability for Coveris UI"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---
### P3 — Design system discoverability for Coveris UI

- **Who hurts:** Frontend developers adopting PrimeNG Lara with Coveris-specific theme tokens (Noir primary on Zinc surface).
- **Pain today:** ADR-012 mandates PrimeNG as the sole design system, but developers need live examples of buttons, forms, data tables, overlays, and advanced patterns without spelunking production screens.
- **How this repo answers:** route tree with 14 lazy-loaded showcase pages (colors, typography, buttons, forms, data, feedback, layout, overlays, menus, widgets, advanced variants). centralizes the KDX preset (Lara + Noir + Zinc). Component naming and accessibility rules are cross-referenced in ADR-012 and ADR-013 within the docs vault.
- **Out of scope:** Not a Storybook replacement for arbitrary third-party projects; scoped to Coveris/KDX PrimeNG patterns.
