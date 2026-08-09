---
id: alvs-finanzas-8-b1d477b9
title: "alvs-finanzas — ALVS internal finanzas web app on the astro-drf-aws harness — 4. Technology stack"
visibility: private
importance: high
source_repo: "alvs-finanzas"
related: []
tags: ["alvs-finanzas", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.14 (backend), bun (frontend JS runtime) | backend/pyproject.toml, backend/.python-version, frontend/package.json, docs/REQUIREMENTS.md | | Frontend | Astro 7.0.7 SSR, Svelte 5.56.4, Tailwind 4.3.2, shadcn-svelte (vendored components), HTMX 2.0.10 | frontend/package.json, frontend/astro.config.mjs, frontend/src/lib/components/ui/ | | Backend / API | Django 6.0.7, DRF 3.17.1, uvicorn 0.51.0 ASGI, drf-spectacular, django-cors-headers, PyJWT, MSAL, httpx | backend/pyproject.toml, backend/config/settings.py, backend/config/urls.py | | Data | PostgreSQL 17.9 (RDS prod + Compose local), Django migrations only | compose.yaml, docs/BD.md, docs/REQUIREMENTS.md | | Cache | Django DatabaseCache (Postgres table via createcachetable), no Redis | docs/CACHE.md, backend/config/settings.py | | Auth | AWS Cognito OIDC (confidential client) + Django sessions + custom User(sub) model | docs/AUTH.md, backend/apps/users/ | | M365 | MSAL client_credentials app-only Graph reads | backend/apps/m365/graph.py, backend/apps/m365/views.py, adr-13-m365-graph | | Infra / deploy | AWS ECS Fargate (256 CPU / 512 MB), shared ALB, Cloud Map service discovery, Secrets Manager, GitHub Actions OIDC | docs/INFRASTRUCTURE.md, .github/workflows/deploy-prod.yml,
