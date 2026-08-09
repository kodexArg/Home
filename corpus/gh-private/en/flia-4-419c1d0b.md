---
id: flia-4-419c1d0b
title: "Flia — family household expense tracker (Django admin) — P3 — Multiple payment amounts per item over time"
visibility: private
importance: low
source_repo: "Flia"
related: []
tags: ["flia", "github", "private", "low", "summary"]
---

### P3 — Multiple payment amounts per item over time - **Who hurts:** Operators tracking utilities or installment-style spending where one logical “item” receives several dated payments. - **Pain today:** Early schema tied a single Importes row directly to Articulos; that does not scale when history matters. - **How this repo answers:** Migration 0005 refactored the relationship so Importes holds item_id → Articulos with importe (decimal) and fecha, enabling one-to-many amount history per article. Admin registers both Articulos and Importes. - **Out of scope:** No amortization math, currency conversion, or tax reporting.
