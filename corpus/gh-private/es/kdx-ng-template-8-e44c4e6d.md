---
id: kdx-ng-template-8-e44c4e6d
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - **SSR / SSG** — CSR only; Amplify hosts static files with SPA fallback rules (docs/04-routing.md). - **Alternative state/form/UI libraries** — No NgRx, TanStack Query, Reactive Forms, Angular Material, Taiga UI (explicit rejection table in README.md). - **Production migration auto-approval** — Dangerous migrations require human gates not yet implemented. - **BDD layer** — Planned on top of pytest/Vitest; not implemented yet (README.md roadmap). - **Public redistribution** — README states private template, not for redistribution. - **Signup endpoint** — PRD.md example lists signup as not yet in API.md; current template ships login, profile, GDPR, not registration.
