---
id: alvs-financial-gateway-8-13fe8386
title: "ALVS Financial Gateway — treasury web application for Grupo ALVS — 4. Technology stack"
visibility: private
importance: high
source_repo: "alvs-financial-gateway"
related: []
tags: ["alvs-financial-gateway", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.14 (backend), Bun (frontend) | backend/pyproject.toml, frontend/package.json, frontend/bunfig.toml | | Frontend | Astro 7.0.7 SSR, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI, Lucide icons | frontend/package.json, frontend/astro.config.mjs | | Backend / API | Django 6.0.7 + DRF 3.17.1, Uvicorn ASGI, drf-spectacular, django-cors-headers | backend/pyproject.toml, backend/config/settings.py | | Data | PostgreSQL 17.9 (RDS prod, Compose local), Django DatabaseCache | compose.yaml, docs/BD.md, backend/config/settings.py | | Infra / deploy | AWS ECS Fargate (two services), shared ALB, Cloud Map service discovery, ECR, Secrets Manager, Bedrock VPC endpoint | docs/INFRASTRUCTURE.md, .github/workflows/deploy-prod.yml | | Identity | AWS Cognito OIDC + Google IdP, Django session auth | docs/AUTH.md, backend/apps/users/ | | M365 / ingestion | MSAL client_credentials, httpx, nine workbook sources | backend/pyproject.toml, docs/adr-13-m365-graph.md | | AI / agents | AWS Bedrock Nova Micro (router + assistant), vendored kskill-* harness, markdown-vault-docs MCP | docs/CHATBOT.md, docs/HARNESS.md, .claude/ | | Tests | pytest + pytest-django (backend), Bun test + happy-dom (frontend), harness tests in tests/ | backend/pyproject.toml,
