---
id: alvs-financial-gateway-4-008bc1d0
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — P3 — Agents and humans need a governed development harness, not ad-hoc edits"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

### P3 — Agents and humans need a governed development harness, not ad-hoc edits - **Who hurts:** kodexArg maintainers and AI agents implementing features under strict API, ADR, and documentation discipline. - **Pain today:** Full-stack treasury apps with AI surfaces, M365 integration, and AWS deploys are easy to break with undeclared routes, secret leaks, or docs drift. - **How this repo answers:** A vendored harness (docs/skills/, .claude/, hooks, guardians) enforces the ABC gate (PRD → ADRs → API), requires API rows before code, blocks undeclared env vars, dispatches guardian agents on SSOT changes, and mandates vault-first doc reads via markdown-vault-docs MCP. Development follows BDD → API → TDD for backend and BDD-first for user-facing frontend work. - **Out of scope:** Being a reusable open-source framework — it is a permanent ALVS production app born from the astro-drf-aws template but no longer governed as a template.
