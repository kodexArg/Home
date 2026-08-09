---
id: cotton-coveris-mvp-main-document-6-db774c35
title: "Coveris MVP — interactive ADR study and architecture documentation — P3 — Weekly vs monthly backend boundary is easy to violate during integration"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp-main-documentation"
related: []
tags: ["cotton-coveris-mvp-main-documentation", "github", "private", "high", "summary"]
---

### P3 — Weekly vs monthly backend boundary is easy to violate during integration - **Who hurts:** Backend engineers porting Coveris-e's scheduling app and Assignment field extensions without breaking ADR-011. - **Pain today:** Monthly scheduling (E-029) adds ShiftInstance snapshots and AssignmentException date divergences — architecturally sound as read-time projection over weekly assignments. But Coveris-e also introduced Assignment.effective_weekly_hours = effective_hours × (_weeks_of_month / 4), reintroducing the exact "4 weeks per month" scaling artifact ADR-011 explicitly eliminated. This creates **two competing weekly-hour definitions**: the ledger uses effective_hours; coverage and capacity use the month-averaged field — they diverge for recurrent assignments. - **How this repo answers:** source/semanal-vs-mensual-backend.md is a full research report with a persistence-vs-projection table, the protected invariant ("weekly is the only hours arithmetic"), documented Coveris-e violations, and five design recommendations including "do NOT port effective_weekly_hours." Theme 4 in the interactive map marks E-029 as ACCEPT+MODS with the modification called out. ADR-011 is flagged as an invariant (isKey: true) in the ADR catalog. - **Out of scope:** Implementing scheduling app tables, payroll export source selection, or timesheet (actual_hours) dimension — all deferred with
