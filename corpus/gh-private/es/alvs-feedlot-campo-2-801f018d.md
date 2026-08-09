---
id: alvs-feedlot-campo-2-801f018d
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — P1 — Attribution in mixed-ownership yards"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---
### P1 — Attribution in mixed-ownership yards

- **Who hurts:** Feedlot operators, field managers, and cattle owners (boarding clients) sharing pens.
- **Pain today:** When the feedlot's own herd and client cattle occupy the same physical yard, a ration or sanitary event without both answers — *which animal* and *whose account pays* — is a silent financial loss or dispute waiting for month-end.
- **How this repo answers:** Domain models and services across , , , , and record operational events as immutable facts. Each charge posts to a client's current account through ledger entries ( , ). Catalog rows are editable; operational events are create-only — corrections are new facts, not mutations ( ).
- **Out of scope:** General ERP outside campo operations; payroll; external accounting package sync (ledger is the in-app settlement book).
