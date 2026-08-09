---
id: alvs-financial-gateway-6-a444767f
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Morning position review** — A treasury_viewers member opens Posición del Día for CONSOLIDADO or a single company, sees disponible vs compromisos cuadro with honest source_dates and conversion-error flags, drills into bank/cash rows. 2. **Payment circuit** — A treasury_operator registers manual movements, transitions held checks, builds a payment order from payable items; a separate treasury_confirmer confirms orders under segregation-of-duties rules. 3. **Operator/agent development** — A developer or agent follows docs/DEVELOPMENT-LOOP.md: BDD spec → API row → TDD tests → implementation → PR to main, with guardian review on SSOT touches.
