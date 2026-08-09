---
id: kdx-ng-template-4-2795c62f
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — P3 — Slow time-to-first-feature on a new SaaS stack"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---
### P3 — Slow time-to-first-feature on a new SaaS stack

- **Who hurts:** Developers who need to build UI against real API responses on day one; QA needing login flows and test users immediately.
- **Pain today:** Backend and frontend teams wait on each other; empty databases block realistic development; local setup spans Node, Python, Postgres, and env files with unclear defaults.
- **How this repo answers:** brings up PostgreSQL 16 and the Django API with hot-reload Uvicorn. auto-runs migrations, creates a superuser from env vars, and seeds mock users via . Frontend proxies to the backend. Shipped features include login, dashboard (protected), auth guard/interceptor/service (signal-based), 404 page, lazy routes, cookie consent, legal pages, pricing showcase, and a full PrimeNG design-system showcase at . Developers log in against seeded data and extend as the reference DRF pattern.
- **Out of scope:** Production migration governance — README admits unreviewed migrations hitting production RDS is **not solved** and requires a future CI/CD gate with senior DevOps/backend review.
