---
id: cotton-coveris-mvp-2-3f94a204
title: "Coveris — Healthcare Capacity Planning SaaS — P1 — Fragmented staffing truth"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
related: []
tags: ["cotton-coveris-mvp", "github", "private", "high", "summary"]
---

### P1 — Fragmented staffing truth - **Who hurts:** HR managers, service heads, and clinic operators responsible for shift coverage. - **Pain today:** Answering “who can cover this guard?” requires multiple spreadsheets, certification folders, and ad-hoc calls. Data is edited without notification; answers are hours old before they are acted on. - **How this repo answers:** A PostgreSQL-backed domain model with org units, positions (demand), employees (supply), tag-based hour pools, and assignment FSMs. Django computes business rules; Angular renders organigram, roster, structure, coverage, and hours views fed by a documented REST contract ( ). Coverage rolls up from leaf units to clinic root. - **Out of scope:** Full payroll execution, union contract negotiation engines, or institution-specific legal advice baked into code (rules are configurable via tags and ADRs, not hard-coded convenio logic).
