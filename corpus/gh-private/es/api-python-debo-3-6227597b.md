---
id: api-python-debo-3-6227597b
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P2 — Correct business semantics for fuel sales and account balances"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### P2 — Correct business semantics for fuel sales and account balances - **Who hurts:** Commercial analysts comparing shift performance; collections staff reconciling client debt; anyone who mis-reads DEBO's midnight turn boundaries or naïve balance sums. - **Pain today:** Fuel liters live in planilla tables ( / ) with operational-day rules when night shifts cross midnight. Client balances are **calculated** ( ), not stored in (that field is credit limit). Naïve historical sums diverge wildly from DEBO screens (verified: client 27 full-history sum +2,500.93 vs real −122,242.07). Names are non-unique (~28k clients, ~27k distinct names). - **How this repo answers:** Extensive live documentation in with verified SQL, operational-day CASE rules, MTN→turn mapping, debt-cycle anchor ("last point without debt"), and open-item logic for aging. User stories US-001–US-004 encode acceptance criteria, Gherkin scenarios, and TDD test maps. Hexagonal architecture keeps domain rules pure and testable without the database. - **Out of scope:** Real-time intraday dispatch union ( ∪ ) for US-001 (planilla-closed liters only); full historical balance without anchor strategy.
