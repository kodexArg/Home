---
id: sociedad-rural-oeste-argentino-8-4381a070
title: "SROA — institutional website and moderated institutional blog — 3.2 Non-goals"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
related: []
tags: ["sociedad-rural-oeste-argentino", "github", "private", "normal", "summary"]
---

### 3.2 Non-goals - Email/password authentication (Google-only MVP per ADR-005). - JWT or public token APIs; session cookies only. - Paginated list endpoints in MVP (full arrays returned). - PATCH /api/users/me/ — profile is read-only; identity comes from Google. - Hard-delete of users in normal operation (UserProfile.is_active soft delete only). - Runtime htmx in the browser — fragment pattern is server-side fetch only (ADR-007). - WAF, multi-region, or non-AWS portability beyond documented abstractions in docs/INFRA.md.
