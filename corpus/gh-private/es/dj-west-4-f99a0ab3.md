---
id: dj-west-4-f99a0ab3
title: "dj-west — Django inventory and point-of-sale for Argentine retail — P3 — Fiscal and digital-payment readiness for Argentine compliance"
visibility: private
importance: normal
source_repo: "dj-west"
related: []
tags: ["dj-west", "github", "private", "normal", "summary"]
---

### P3 — Fiscal and digital-payment readiness for Argentine compliance - **Who hurts:** Operators who must eventually issue AFIP/ARCA electronic invoices and tie Mercado Pago transactions to sales records without data model rework. - **Pain today:** Retrofitting CAE, punto de venta, QR data, and MP transaction IDs onto a naive Venta table breaks historical integrity if IVA rates change on products later. - **How this repo answers:** Migrations through 0010 added **IVA alícuotas** on Producto, **frozen iva_aplicado** on ItemVenta, and fiscal/payment fields on Venta (cliente_doc_tipo, cliente_doc_nro, afip_*, mp_id, mp_status). Agent docs ADECUACION_ARCA.md and REQUERIMIENTOS_ARCA.md specify the target django-afip integration path, homologation certificates, and BDD validation scenarios. Fields exist; WSFE/MP API wiring is planned, not yet in pyproject.toml dependencies. - **Out of scope:** Completed AFIP WSAA/WSFE integration, PDF ticket generation, and live Mercado Pago webhook handling (documented as future work).
