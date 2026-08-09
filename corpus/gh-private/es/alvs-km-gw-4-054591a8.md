---
id: alvs-km-gw-4-054591a8
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P3 — New ALVS apps need a harness whose railguard cannot be bypassed"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

### P3 — New ALVS apps need a harness whose railguard cannot be bypassed - **Who hurts:** Developers and AI agents adding features; maintainers who must keep docs, API contracts, and architecture rules aligned; operators running autonomous issue workflows. - **Pain today:** Undocumented routes, env vars, and ad-hoc agent behavior cause drift, security gaps, and expensive rework when multiple contributors (human and AI) touch the same codebase. - **How this repo answers:** The harness is the product's support structure (docs/HARNESS.md, adr-14-harness). Vendored skills under .claude/skills/ (mirrored to skills/) cover Astro, Django, AWS, vault editing, orchestration, and triage-and-fix workflows. Hooks enforce the ABC gate (PRD? ADRs? API?), block undeclared urls.py routes and env reads, preload SSOTs at session start, and dispatch guardian subagents (astro-drf-aws-prd, -adr, -api) on watched surfaces. ADRs in docs/adrs/ load as .claude/rules/. Development loop: idea → user-facing? → BDD → needs backend? → enter through docs/API.md only. - **Out of scope:** Machine-global skill dependencies (everything required is vendored); teammate-style agent teams (standing decision: all agents are subagents).
