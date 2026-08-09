---
id: kdx-ng-coveris-docs-2-175c091f
title: "Coveris Documentation Portal — Angular docs site and QA harness — P1 — Fragmented Coveris product knowledge"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

### P1 — Fragmented Coveris product knowledge - **Who hurts:** Engineers, product owners, and AI agents implementing or reviewing Coveris ( and related repos) need a single authoritative narrative for capacity planning domain logic, API contracts, and architectural decisions. - **Pain today:** Knowledge lived across predecessor projects (SDGD v2, Coveris v4 spec), markdown files, and mental models. ADRs, PRD sections, and API.md could drift from implementation. Agents lacked a structured, sectioned docs tree with stable doc IDs. - **How this repo answers:** Ships a curated markdown corpus (~44 files per locale) under , registered in with seven navigation sections (Overview, API Contract, ADRs, Tech Stack, Development, Production, AI & Tooling). An Angular 21 SPA loads markdown via HTTP, strips YAML frontmatter, renders with , and exposes EN/ES language toggle. is explicitly the SSOT for HTTP between Angular frontend and Django backend. Nineteen ADRs document conventions, stacks, auth, FSM rules, design system, and business logic. - **Out of scope:** This repo does **not** implement the Coveris backend, database, or production deployment of the SaaS app itself. It documents and showcases; implementation lives in sibling application repos.
