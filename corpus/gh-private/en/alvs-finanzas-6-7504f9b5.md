---
id: alvs-finanzas-6-7504f9b5
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Operator login:** Unauthenticated visitor hits Astro home → Login link → /accounts/login/ → Cognito → callback → session → home shows avatar, nickname, logout, and SharePoint cell badges. 2. **SharePoint connectivity check:** Home page SSR reads /api/m365/hello/ and /api/m365/world/; UI confirms Excel cells match expected literals or surfaces Graph error codes (graph_auth_failed, graph_forbidden, graph_throttled). 3. **RBAC verification:** Authenticated user calls /api/me/ for identity + Django groups; admins pass /api/restricted/ (IsInAdminsGroup), others receive 403. 4. **Agent-driven feature:** New backend capability starts with a row in docs/API.md, a TDD spec in docs/tdds/, implementation under backend/apps/<domain>/, guardian review, and pytest green in CI. 5. **Local full stack:** docker compose --profile full up brings Postgres, Django (migrate + createcachetable + uvicorn), and Astro; python3 tests/test_docker_compose.py validates layout.
