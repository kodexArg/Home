---
id: api-python-debo-4-b5bdcd27
title: "API Python DEBO — read-only MSSQL facade for YPF station operations — P3 — Repeatable, agent-friendly delivery of internal HTTP APIs"
visibility: private
importance: high
source_repo: "api-python-debo"
related: []
tags: ["api-python-debo", "github", "private", "high", "summary"]
---

### P3 — Repeatable, agent-friendly delivery of internal HTTP APIs - **Who hurts:** Developers and LLM agents implementing endpoints without drifting from agreed behavior; ~5 LAN users needing per-person audit trails. - **Pain today:** Ad-hoc scripts would duplicate queries, diverge from DEBO UI semantics, and lack auth. No single SSOT for route names — known drift between BDD Gherkin ( ) and TDD/API ( ) flagged as blocking reconciliation. - **How this repo answers:** Specification-Driven Development (ADR 004): **BDD → documentation → TDD → BUILD**, with as endpoint SSOT (ADR 008). Static Bearer API keys per person with roles ( , , ) and SQLite audit middleware (ADR 009). Agent hooks enforce API.md sync, TDD-first prompts, and BDD close-loop review. Skills ( , , ) guide iteration closure. - **Out of scope:** External IdP/SSO, JWT login flows, Docker orchestration, public internet exposure.
