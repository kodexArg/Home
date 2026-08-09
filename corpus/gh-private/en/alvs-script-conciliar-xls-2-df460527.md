---
id: alvs-script-conciliar-xls-2-df460527
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — P1 — Multi-source payment reconciliation for Mercado Pago"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---

### P1 — Multi-source payment reconciliation for Mercado Pago - **Who hurts:** ALVS operators responsible for verifying that Mercado Pago settlements align with internal Cobranzas Electrónicas records from two distinct collection channels (KM1151 and Las Bóvedas). - **Pain today:** Each source uses a different Excel layout (cobranza files skip six header rows; Planilla 1 uses a named sheet with currency-formatted amounts). Manually comparing Operación Relacionada in Mercado Pago against Transacción in cobranza exports is slow and error-prone across hundreds of rows. - **How this repo answers:** logic.py filters Mercado Pago to relevant operation types (Cobro, Ingreso de dinero, Dinero recibido), then runs sequential matching: first KM1151 cobranzas, then Las Bóvedas cobranzas (by transaction ID), then Planilla 1 (for still-unmatched rows). Each match annotates the result row with conciliation label, counterpart amount/date, and computed deltas. Unmatched Mercado Pago rows are marked No Conciliado. - **Out of scope:** Live API integration with Mercado Pago or cobranza backends; automated scheduling; multi-user server deployment; currency conversion beyond what the source spreadsheets already encode.
