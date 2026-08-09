---
id: coveris-4-42cd1248
title: "Coveris — healthcare capacity planning for Argentine private clinics — P3 — Productivity data stuck in spreadsheets"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---
### P3 — Productivity data stuck in spreadsheets

- **Who hurts:** Auditors and managers reconciling anesthesia productivity for pre-liquidation and payroll prep.
- **Pain today:** Google Form responses land in Sheets; manual processes are needed to get clean codes and IDs into any downstream system.
- **How this repo answers:** exposes import endpoints (token-authenticated machine import and server-side Google Sheets pull). A documented Apps Script pushes the calculated **Registro** tab hourly via . Local dev runs a sidecar that respects UI-driven sync cadence. Production Cloudflare Worker cron triggers the same sync path. Preliq ( ), cost ( ), and performance ( ) build on this data layer.
- **Out of scope:** Building or hosting the Google Form/Sheet itself; NIVO HSI integration is specified but awaiting external endpoint delivery.
