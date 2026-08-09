---
id: kdx-ng-template-2-0768f980
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P1 — Repeated full-stack architectural indecision"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---
### P1 — Repeated full-stack architectural indecision

- **Who hurts:** Teams starting new SaaS products; tech leads who must keep multiple apps consistent; AI agents that otherwise invent incompatible patterns per session.
- **Pain today:** Angular ecosystems tempt teams toward NgRx, TanStack Query, Reactive Forms, Material, or SSR — each choice multiplies learning cost and fragments codebases. Django backends sprawl without a documented API contract. Every greenfield project spends weeks on auth, CORS, cookie strategy, and folder layout before shipping domain features.
- **How this repo answers:** Every major decision is pre-made and documented. The README explicitly rejects NgRx, NGXS, TanStack Query, Reactive Forms, Angular Material, SSR, and NgModules. Angular 21 native primitives ( , , Signal Forms, / ) are the only approved patterns. forbids proposing alternatives. Ten canonical skills in (symlinked from ) encode component, signal, form, HTTP, routing, API-first, and design-system rules. – provide human-readable guides mirroring the same constraints.
- **Out of scope:** Being a finished product — it is a scaffold. Multi-tenancy, real-time collaboration, OAuth social login, 2FA, email notifications, and RBAC beyond are explicitly deferred in examples.
