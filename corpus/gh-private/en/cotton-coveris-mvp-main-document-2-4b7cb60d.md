---
id: cotton-coveris-mvp-main-document-2-4b7cb60d
title: "Coveris MVP — interactive ADR study and architecture documentation — P1 — Incoming ADRs collide with accepted project ADRs"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp-main-documentation"
related: []
tags: ["cotton-coveris-mvp-main-documentation", "github", "private", "high", "summary"]
---

### P1 — Incoming ADRs collide with accepted project ADRs - **Who hurts:** Engineers on (target) merging code from Coveris-e ( , source branch) without a conflict map. - **Pain today:** Coveris-e shipped ten accepted ADRs (E-025–E-034, skipping E-033) that reshape OrgUnit taxonomy, assignment hour semantics, weekly design boards, and monthly scheduling. The target branch already has 37 ADRs including ADR-011 (weekly-only hours), ADR-018 (Positions only on UNIT leaves), ADR-024 ( bar semantics), and ADR-001-c (five-color hour vocabulary). Adopting Coveris-e code without reconciling these produces incompatible models on the same API surface — e.g., (3-value enum, 3-band bar) vs (boolean, blue-only extras). - **How this repo answers:** catalogs all 37 "here" ADRs and 9 "incoming" ADRs with side badges, status, verdicts ( , , , , ), conflict flags, searchable sidebar, filter chips (side/status/verdict/conflict), and three view tabs (ADRs, Themes by priority, Conflicts table). expands the eight priority themes with reconciliation tables mapping each conflict to a required decision. Full ADR texts for key incoming and conflicting "here" ADRs are embedded inline in the HTML for offline reading. - **Out of scope:** Implementing any of the studied changes, maintaining live sync with the main repo's tree, or replacing the main project's ADR workflow. This is study material, not the SSOT
