---
id: dj-west-4-f99a0ab3
title: "dj-west — Django inventory and point-of-sale for Argentine retail — P3 — Fiscal and digital-payment readiness for Argentine compliance"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---
### P3 — Fiscal and digital-payment readiness for Argentine compliance

- **Who hurts:** Operators who must eventually issue AFIP/ARCA electronic invoices and tie Mercado Pago transactions to sales records without data model rework.
- **Pain today:** Retrofitting CAE, punto de venta, QR data, and MP transaction IDs onto a naive table breaks historical integrity if IVA rates change on products later.
- **How this repo answers:** Migrations through added **IVA alícuotas** on , **frozen ** on , and fiscal/payment fields on ( , , , , ). Agent docs and specify the target integration path, homologation certificates, and BDD validation scenarios. Fields exist; WSFE/MP API wiring is planned, not yet in dependencies.
- **Out of scope:** Completed AFIP WSAA/WSFE integration, PDF ticket generation, and live Mercado Pago webhook handling (documented as future work).
