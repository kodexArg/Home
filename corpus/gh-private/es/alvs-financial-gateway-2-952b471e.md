---
id: alvs-financial-gateway-2-952b471e
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P1 — Legacy treasury tooling cannot serve a multi-company holding"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---
### P1 — Legacy treasury tooling cannot serve a multi-company holding

- **Who hurts:** Treasury staff, finance controllers, and executives across Grupo ALVS's sixteen-company holding who relied on GestiónFinanciera and scattered Excel workflows.
- **Pain today:** Cash positions, payment circuits, third-party checks, and intercompany balances were fragmented across a legacy desktop system and SharePoint workbooks. There was no single authenticated web surface with role-based access, audit trails, or server-side computation that every view could trust.
- **How this repo answers:** Eleven treasury views (holding funnel, daily position, bank position, projection, payments, check portfolio, movements, intercompany, reports, confirmation, control panel) are implemented as Astro SSR pages backed by Django REST endpoints. All figures are computed once in Python services ( and related treasury computation layer) and consumed identically by every screen. Operational writes — manual movements, check transitions, payment orders and confirmations — land immutable audit rows with segregation-of-duties guards.
- **Out of scope:** General ledger, ERP replacement, or non-treasury corporate functions. The external reverse-engineering reference is consulted out-of-tree and never vendored.
