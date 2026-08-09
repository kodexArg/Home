---
id: astro-drf-aws-3-ffe74068
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — P2 — Secure SharePoint-to-web bridge with Django RBAC"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

### P2 — Secure SharePoint-to-web bridge with Django RBAC - **Who hurts:** Organizations whose authoritative data lives in Microsoft 365 / SharePoint and need dashboards or tools on the public web without bypassing identity or mixing authorization into the IdP. - **Pain today:** Direct SharePoint embeds, anonymous links, or Cognito custom claims used as roles create audit gaps and permission bugs; federated IdP attributes (e.g. avatar ) are inconsistently available on ID tokens. - **How this repo answers:** Cognito authenticates via OIDC authorization code (Google federated through the pool); Django owns all RBAC via Groups + DRF permission classes — Cognito groups and claim-as-role are explicitly banned ( , ). M365 access uses app-only Graph ( , vars). The PRD horizon: new apps flourish on the same harness, each moving SharePoint-sourced information to the web under RBAC. - **Out of scope:** Replacing SharePoint as system of record; user-delegated Graph flows (template standard is app-only for the demo endpoints); per-tenant white-labeling in code.
