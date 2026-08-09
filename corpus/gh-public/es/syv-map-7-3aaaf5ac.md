---
id: syv-map-7-3aaaf5ac
title: "syv-map — Living cartographic editor for the SyV universe (Ciudad Dársena) — 3.2 Non-goals"
visibility: public
importance: normal
source_repo: "syv-map"
related: ["gh-syv-map"]
tags: ["syv-map", "github", "public", "normal", "summary"]
---

### 3.2 Non-goals From PRD.md and README (partially stale but directionally aligned): - Backend service, authentication, multi-user, live collaborative editing. - Paid or self-hosted raster/vector tile stacks (uses free CartoDB Positron no-labels raster tiles). - Publishing/deploying the editor to production (editor is local-first; a read-only viewer may be published separately later). - Automatic write-back to syv-docs SSOT—the relationship is explicitly undecided and must not be changed unilaterally. - Full shadcn-svelte design system (sidebar is hand-built Tailwind using token classes; CLI init was skipped due to interactive prompt friction).
