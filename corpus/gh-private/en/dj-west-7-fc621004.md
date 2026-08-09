---
id: dj-west-7-fc621004
title: "dj-west — Django inventory and point-of-sale for Argentine retail — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Daily counter sale:** Staff opens /sale/, searches or picks favorites, adjusts quantities/discounts, selects payment method (including mixed), confirms — stock decrements, movement logged, redirect to sale detail. 2. **Restock after delivery:** Staff records an **ENTRADA** movement or edits product stock; dashboard low-stock count updates. 3. **Catalog maintenance:** Manager creates/edits products with SKU, ARS integer prices (no decimals), IVA rate, supplier, and category; toggles favorites for POS quick access. 4. **Agent-assisted development:** Read .agent/docs/ and .agent/rules/ (symlinked as .claude/) for Cotton, HTMX, modal, and styling conventions; run uv run manage.py tailwind runserver per STARTUP_RULES.md.
