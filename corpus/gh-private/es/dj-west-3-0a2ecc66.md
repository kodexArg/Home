---
id: dj-west-3-0a2ecc66
title: "dj-west — Django inventory and point-of-sale for Argentine retail — P2 — Slow, SPA-heavy POS alternatives for counter use"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

### P2 — Slow, SPA-heavy POS alternatives for counter use - **Who hurts:** Counter staff who need sub-second product lookup, quantity edits, discounts, and checkout on mobile or tablet form factors. - **Pain today:** Building a React/Vue POS means duplicating validation on client and server, managing cart state, and shipping large JS bundles. Simple form posts feel sluggish without partial updates. - **How this repo answers:** The sale module (/sale/) is an **HTMX-first POS**: session-backed cart, real-time product search (sale/htmx/product-search/), inline quantity/discount updates with **out-of-band (OOB)** total refreshes, mixed-payment validation (sale/htmx/validate-payment/), and HX-Redirect to sale detail on success. UI is composed exclusively from **django-cotton** components under templates/cotton/ (domain components in west/, primitives in ui/, forms/, layout/). Favorites (Producto.favorito) surface quick picks when search is empty. Stock is locked with select_for_update() at checkout to prevent overselling. - **Out of scope:** Offline-first POS, receipt printer drivers, and native mobile apps. Customer and payment UI sections are documented as partially informational with room for future hardening per SALES_FLOW.md.
