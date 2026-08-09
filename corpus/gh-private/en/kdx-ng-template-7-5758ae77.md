---
id: kdx-ng-template-7-5758ae77
title: "kdx-ng-template — Angular 21 CSR + Django 5.2 DRF SaaS blueprint — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "kdx-ng-template"
related: []
tags: ["kdx-ng-template", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Bootstrap a new SaaS repo** — Clone template, copy .env.example to .env, docker-compose up, cd frontend && bun install && bun start, verify health/login/dashboard within minutes (docs/VALIDATION.md). 2. **Add a new domain feature with AI** — Invoke kdx-api-first to document endpoints in API.md, generate DRF + Angular scaffolding, implement with kdx-angular-* skills enforcing signals, PrimeNG, and lazy routing. 3. **Extend UI with design-system consistency** — Start with kdx-design-system-use skill mapping needs to PrimeNG components; reference /showcase routes for live examples; use kdx-tailwind-design-system only as PrimeNG's utility layer. 4. **Prepare for AWS deployment** — Build Angular to static dist/, deploy CSR to Amplify with SPA rewrites and /api/* proxy to App Runner; run backend Docker image on App Runner against RDS; switch auth to Cognito in production settings.
