---
id: alvs-feedlot-campo-6-7484e950
title: "ALVS Feedlot Campo — feedlot traceability and client accounting — 3. Product / idea"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
related: []
tags: ["alvs-feedlot-campo", "github", "private", "high", "summary"]
---

## 3. Product / idea The central idea is a **domain-growing monolith**: a shared spine (clients, ledger, assets, market, fx) plus cattle and extended campo domains (livestock, feed, feedyard, sanitary, traceability, breeding, genetics, crops, machinery, expenses, inventory, weather, notifications, metrics, advisors, assistant) composed as separate Django apps without forking the harness (docs/constitution/PRD.md). **Runtime shape:** Two containers — Django ASGI backend on port 8000 and Astro SSR frontend on port 4321 — behind a shared ALB per environment. Path rules send /api/, /accounts/, /admin/, /ws/, /static/, /media/ to backend; everything else to frontend (docs/constitution/INFRASTRUCTURE.md). Frontend SSR reaches backend via Cloud Map private DNS, never through the public ALB. **Agent/harness shape:** The repo is as much *how work is done* as *what is built*. AGENTS.md is the entry index. The ABC gate requires every change to satisfy PRD, ADRs, and API contract. Vendored kdx-* skills under .claude/skills/ and skills/ are the sanctioned implementation paths. Guardian subagents (astro-drf-aws-prd, -adr, -api) gate SSOT edits. Hooks enforce API rows, variable declarations, guardian dispatch, and live-doc backlinks.
