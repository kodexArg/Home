---
id: astro-drf-aws-8-cd39607f
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — 4. Technology stack"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---

## 4. Technology stack Derived from backend/pyproject.toml, frontend/package.json, docs/constitution/REQUIREMENTS.md, compose.yaml, and constitution docs. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.14.6, bun (latest stable) | backend/.python-version, backend/pyproject.toml, docs/constitution/REQUIREMENTS.md | | Frontend | Astro 7.0.7 SSR, Svelte 5.56.4, Tailwind 4.3.2, HTMX 2.0.10, Melt ^0.44 | frontend/package.json, frontend/astro.config.mjs | | Backend / API | Django 6.0.7, DRF 3.17.1, uvicorn 0.51.0 ASGI, drf-spectacular | backend/pyproject.toml, backend/config/urls.py | | Data | PostgreSQL 17.9 (RDS + local Compose) | compose.yaml, docs/BD.md | | Auth | AWS Cognito OIDC + Django sessions; PyJWT for token verify | docs/AUTH.md, backend/apps/users/ | | AI | Amazon Bedrock Nova Micro (us.amazon.nova-micro-v1:0 inference profile) | docs/CHATBOT.md, backend/apps/router/, backend/apps/assistant/ | | M365 | MSAL + httpx app-only Graph | backend/apps/m365/, adr-16-m365-graph | | Infra / deploy | ECS Fargate, ECR, ALB, Cloud Map, Secrets Manager, Bedrock VPC endpoint | docs/constitution/INFRASTRUCTURE.md, .github/workflows/deploy-prod.yml | | AI / agents | Vendored skills, guardian subagents, markdown-vault MCP, codebase-memory MCP (local) | docs/constitution/HARNESS.md, .claude/settings.json,
