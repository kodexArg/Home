---
id: alvs-finanzas-3-709b59f6
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — P2 — Agent-safe development with binding contracts"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---
### P2 — Agent-safe development with binding contracts

- **Who hurts:** Developers and autonomous agents editing a complex full-stack repo where undeclared API routes and mystery env vars silently ship to production.
- **Pain today:** LLM edits add endpoints, variables, or features that contradict product scope; review burden explodes because truth is scattered across code.
- **How this repo answers:** The **ABC gate** in : every change must follow , comply with ADRs in (mirrored to ), and respect if touching HTTP surface. Hooks in enforce this at edit time: blocks undeclared routes; blocks undeclared env reads; injects PRD+API at session start; routes SSOT edits to guardian agents. Development loop: . Backend code is born through entries, not ad-hoc patches.
- **Out of scope:** Replacing human product judgment; the guardians triage and block defects but do not define business requirements.
