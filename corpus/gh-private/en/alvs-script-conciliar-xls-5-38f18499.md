---
id: alvs-script-conciliar-xls-5-38f18499
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — 3. Product / idea"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---

## 3. Product / idea The mental model is a **single-session desktop ETL + reconciliation pipeline**: 1. Operator launches , which opens a tkinter window titled "Conciliación de Cobranzas". 2. Four file-picker fields collect paths to: Mercado Pago export, Planilla 1 workbook, Cobranzas KM1151, Cobranzas Las Bóvedas (all ). 3. "Ejecutar Proceso" imports and normalizes each source into pandas DataFrames ( import helpers), then delegates to in . 4. On success, three Excel files are written to the process working directory: main conciliation result and two cobranza residue files. A success dialog and scrollable log panel provide operator feedback. The reconciliation engine is intentionally **sequential and priority-ordered**: cobranza channels are tried before Planilla 1, and KM1151 before Las Bóvedas. A Mercado Pago row already matched in an earlier pass is not reconsidered in later passes (Planilla matching only runs when is still empty).
