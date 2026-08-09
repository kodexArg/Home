---
id: alvs-script-conciliar-xls-3-b8fe82a1
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P2 — Surfacing amount and timestamp discrepancies"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---
### P2 — Surfacing amount and timestamp discrepancies

- **Who hurts:** Reviewers who must distinguish clean matches from near-matches that need human follow-up.
- **Pain today:** A transaction ID match with a peso difference or a payment timestamp skewed by several minutes can look "matched" in a naive join but still indicate data or timing issues.
- **How this repo answers:** computes (Mercado Pago import minus cobranza ) and (payment date minus cobranza ). Thresholds flag when absolute amount delta exceeds 1 unit, and when minute delta exceeds 10 (default tolerance). Planilla 1 matching uses a separate amount tolerance of 15 units before flagging .
- **Out of scope:** Automatic correction of discrepancies; dispute resolution workflows; audit trail beyond the generated Excel columns.
