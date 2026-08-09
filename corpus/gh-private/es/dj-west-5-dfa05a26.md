---
id: dj-west-5-dfa05a26
title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3. Product / idea"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

## 3. Product / idea follows a **semimonolithic Django pattern**: one app holds domain models, forms, views, and context processors; holds settings and root URLconf; holds page shells and Cotton component library; holds Tailwind input CSS, compiled output, fonts, and HTMX bundle. The user mental model is **back-office + front counter**: 1. **Dashboard** ( ) — KPI cards: product/category/supplier counts, today's sales and revenue, low-stock count, recent sales, top sellers. 2. **Catalog** — Singular English URL paths ( , , , ) with HTMX partial rendering for in-place navigation via in . 3. **Stock movements** ( ) — Manual entrada/ajuste entries with observaciones. 4. **POS** ( ) — Session cart, HTMX mutations, footer totals bar, finalize with server-side validation. 5. **Admin** ( ) — Standard Django admin for power users. 6. **Dev sandbox** ( ) — Staff-only component playground. Frontend architecture is **component-driven, zero custom JS**: Cotton enforces reusable tags; HTMX handles interactivity; Tailwind 4 ( / design tokens per ) styles everything. Navigation is injected globally via (aside items for Ventas, Productos, Movimientos, Configuraciones dropdown). Production runs as a **single Python process**: Waitress serves WSGI; WhiteNoise serves compressed static files from after . No Nginx sidecar. App Runner build compiles Tailwind and collects statics before run.
