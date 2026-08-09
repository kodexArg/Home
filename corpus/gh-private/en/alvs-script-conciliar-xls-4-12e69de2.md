---
id: alvs-script-conciliar-xls-4-12e69de2
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P3 — Orphan cobranza residue extraction"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---

### P3 — Orphan cobranza residue extraction - **Who hurts:** Operators who must also identify cobranza rows that were never tied to any Mercado Pago operation in the export window. - **Pain today:** Focusing only on Mercado Pago leaves "extra" cobranza entries invisible unless a second manual pass is done. - **How this repo answers:** After matching, pulls rows from each cobranza DataFrame where remained false, producing and alongside the main . - **Out of scope:** Reverse-matching Planilla 1 orphans; merging residue files across periods; alerting or ticketing.
