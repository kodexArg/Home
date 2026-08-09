---
id: kdx-ng-coveris-docs-8-c73deffa
title: "Coveris Documentation Portal — Angular docs site and QA harness — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - **Not the Coveris MVP codebase** — Implementation is referenced as cotton-coveris-mvp (Angular 21 + Django 5.2 clean-room build inheriting SDGD v2 business logic and Coveris v4 architecture). - **No SSR/SSG** — CSR only; documented and enforced in stack ADRs. - **No alternative stacks** — AI agents are explicitly forbidden from suggesting React, FastAPI, NgRx, etc. (ai-context.md immutable stack table). - **Cloud auth and advanced scheduling** — Documented as designed-but-not-built in PRD out-of-scope; tag-based requirements (ADR-019) moved some certification tracking in-scope. - **Tracked QA reports and cloned sandboxes** — reports/ and github-repositories/ are gitignored; outputs live outside this repo.
