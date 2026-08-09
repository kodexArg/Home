---
id: kdx-ng-template-3-f16259b9
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P2 — Frontend/backend contract drift"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---
### P2 — Frontend/backend contract drift

- **Who hurts:** Full-stack developers; frontend engineers blocked on undocumented API responses; reviewers catching serializer ↔ TypeScript mismatches late.
- **Pain today:** DRF browsable API and ad-hoc docstrings diverge from what Angular services expect. Endpoints get coded before the contract is agreed, causing rework and brittle tests.
- **How this repo answers:** at repo root is the **single source of truth** for all HTTP communication. and the skill enforce: document in first, then implement DRF views and Angular services. maps user stories to sections rather than duplicating endpoint specs. adds DRF design rules. The workflow is: branch → update → backend model/serializer/viewset/URLs/tests → frontend service/component/routes/tests.
- **Out of scope:** Auto-generated OpenAPI client codegen is not wired; contract discipline is procedural via skills and docs, not CI-gated yet.
