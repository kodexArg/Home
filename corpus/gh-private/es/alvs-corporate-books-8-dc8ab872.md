---
id: alvs-corporate-books-8-dc8ab872
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — 4. Technology stack"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.14 (backend), Bun (frontend) | backend/pyproject.toml, frontend/package.json | | Frontend | Astro 7.0.7, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI | frontend/package.json, frontend/astro.config.mjs | | Backend / API | Django 6.0.7, DRF 3.17.1, drf-spectacular, uvicorn ASGI | backend/pyproject.toml, backend/config/urls.py | | Data | PostgreSQL 17 (RDS prod, Compose locally) | compose.yaml, docs/BD.md | | Auth | Cognito OIDC + Django session; MSAL for Graph app-only | docs/AUTH.md, backend/apps/users/ | | AI | Bedrock Nova Micro (router), Nova Lite (assistant) | docs/CHATBOT.md, docs/VARIABLES.md | | Infra / deploy | ECS Fargate (2 services), ALB, ECR, Secrets Manager, S3 media, Cloud Map, Bedrock VPC endpoint | docs/constitution/INFRASTRUCTURE.md, .github/workflows/deploy-prod.yml | | AI / agents | .claude/ hooks, kskill-* skills, kbot-* guardians, kwf-* delivery cast | docs/constitution/HARNESS.md, .claude/settings.json | | Tests | pytest + pytest-django (backend), Bun test + happy-dom (frontend), harness tests at repo root | backend/pyproject.toml, frontend/package.json, tests/ |
