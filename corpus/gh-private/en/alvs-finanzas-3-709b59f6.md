---
id: alvs-finanzas-3-709b59f6
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P2 — Agent-safe development with binding contracts"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

### P2 — Agent-safe development with binding contracts - **Who hurts:** Developers and autonomous agents editing a complex full-stack repo where undeclared API routes and mystery env vars silently ship to production. - **Pain today:** LLM edits add endpoints, variables, or features that contradict product scope; review burden explodes because truth is scattered across code. - **How this repo answers:** The **ABC gate** in AGENTS.md: every change must follow docs/PRD.md, comply with ADRs in docs/adrs/ (mirrored to .claude/rules/), and respect docs/API.md if touching HTTP surface. Hooks in .claude/hooks/ enforce this at edit time: check_api.py blocks undeclared urls.py routes; check_variables.py blocks undeclared env reads; load_ssot.py injects PRD+API at session start; dispatch_guardians.py routes SSOT edits to guardian agents. Development loop: idea → user-facing? → BDD → needs backend? → enter through API → TDD. Backend code is born through docs/TDD.md entries, not ad-hoc patches. - **Out of scope:** Replacing human product judgment; the guardians triage and block defects but do not define business requirements.
