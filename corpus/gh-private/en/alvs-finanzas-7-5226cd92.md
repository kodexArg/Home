---
id: alvs-finanzas-7-5226cd92
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - No CDN in front of the ALB (permanent decision, issue #33 / adr-02). - No npm/Node runtime — **bun only** for JavaScript (adr-04-frontend-and-design-system). - No Cognito RBAC, no second IdP, no passwords in production. - No Redis, ElastiCache, or dedicated cache servers. - Smoke tests in prod deploy workflow are **suspended** by owner directive (2026-07-13); bun run build still gates deploy. - Staging environment does not exist in the ALVS AWS account. - .docs/ hidden vault is **not present** in this repo (only docs/).
