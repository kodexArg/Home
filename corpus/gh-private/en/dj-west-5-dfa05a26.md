---
id: dj-west-5-dfa05a26
title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3. Product / idea"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

## 3. Product / idea dj-west follows a **semimonolithic Django pattern**: one core app holds domain models, forms, views, and context processors; project/ holds settings and root URLconf; templates/ holds page shells and Cotton component library; static/ holds Tailwind input CSS, compiled output, fonts, and HTMX bundle. The user mental model is **back-office + front counter**: 1. **Dashboard** (/) — KPI cards: product/category/supplier counts, today's sales and revenue, low-stock count, recent sales, top sellers. 2. **Catalog** — Singular English URL paths (/product/, /category/, /supplier/, /client/) with HTMX partial rendering for in-place navigation via #main-content in base.html. 3. **Stock movements** (/movement/) — Manual entrada/ajuste entries with observaciones. 4. **POS** (/sale/) — Session cart, HTMX mutations, footer totals bar, finalize with server-side validation. 5. **Admin** (/admin/) — Standard Django admin for power users. 6. **Dev sandbox** (/dev/) — Staff-only component playground. Frontend architecture is **component-driven, zero custom JS**: Cotton enforces reusable <c-*> tags; HTMX handles interactivity; Tailwind 4 (west / westwood design tokens per DESIGN_SYSTEM.md) styles everything. Navigation is injected globally via core.context_processors.navigation (aside items for Ventas, Productos, Movimientos, Configuraciones dropdown). Production runs as a
