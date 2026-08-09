---
id: alvs-km-gw-8-4c4703b7
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — 4. Technology stack"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

## 4. Technology stack Derived from manifests and docs; lockfiles not quoted. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.14, Bun (no Node/npm) | backend/.python-version, backend/pyproject.toml, frontend/package.json, adr-02-initial-stack | | Frontend | Astro 7.0.7 SSR, Svelte 5.56, Tailwind 4.3, HTMX 2.0, Melt UI | frontend/package.json, frontend/astro.config.mjs, docs/FRONTEND.md | | Backend / API | Django 6.0.7, DRF 3.17.1, async-first ASGI views, uvicorn 0.51 | backend/pyproject.toml, docs/BACKEND.md, adr-16-async-mandatory | | Data | PostgreSQL 17 (RDS prod/dev, Compose locally) | compose.yaml, docs/BD.md | | Infra / deploy | AWS ECS Fargate, ALB, ECR, Secrets Manager, Cloud Map, Bedrock VPC endpoint | docs/INFRASTRUCTURE.md, .github/workflows/deploy-prod.yml | | AI / agents | Bedrock Nova Micro router; vendored .claude/skills/, hooks, guardians, kdx-orchestrator, kdx-wf-triage-and-fix | docs/CHATBOT.md, docs/HARNESS.md, .claude/ | | Auth | Cognito OIDC + Django session + PyJWT verification | docs/AUTH.md, adr-10-auth | | M365 | MSAL + httpx for Graph app-only reads | backend/pyproject.toml, adr-13-m365-graph | | Tests | pytest + pytest-django (backend); bun test (frontend); harness tests in tests/ | backend/pyproject.toml, frontend/package.json, .github/workflows/ci.yml |
