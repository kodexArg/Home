---
id: alvs-script-conciliar-xls-0-b91580bd
title: "alvs-script-conciliar-xls — Desktop Excel conciliation tool for Mercado Pago vs ALVS cobranzas — alvs-script-conciliar-xls"
visibility: private
importance: normal
source_repo: "alvs-script-conciliar-xls"
related: []
tags: ["alvs-script-conciliar-xls", "github", "private", "normal", "summary"]
---

# alvs-script-conciliar-xls > **Problem thesis (required):** This private repository is a **local desktop utility** for ALVS internal accounting: it ingests four Excel exports — Mercado Pago activity, Planilla 1 (Transferencias sheet), and two Cobranzas Electrónicas files (KM1151 and Las Bóvedas) — and produces a reconciled Mercado Pago ledger annotated with match status, amount/time deltas, and source labels, plus two residue workbooks for unmatched cobranza rows. The tool replaces repetitive manual VLOOKUP-style work with a guided tkinter GUI and a deterministic three-pass matching pipeline implemented in logic.py.
