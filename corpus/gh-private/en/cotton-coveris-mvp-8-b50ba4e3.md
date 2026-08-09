---
id: cotton-coveris-mvp-8-b50ba4e3
title: "Coveris — Healthcare Capacity Planning SaaS — 4. Technology stack"
visibility: private
importance: high
source_repo: "cotton-coveris-mvp"
related: []
tags: ["cotton-coveris-mvp", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.13, Node 22+, Bun 1.3 | backend/pyproject.toml, frontend/package.json | | Frontend | Angular 21.2, PrimeNG 21, Tailwind 4, TypeScript 5.9 | frontend/package.json, docs/stack/frontend.md | | Backend / API | Django 5.2, DRF 3.15, django-fsm-2, Uvicorn ASGI | backend/pyproject.toml, backend/config/urls.py | | Data | PostgreSQL 16 (local compose) / 17 (CI/RDS) | docker-compose.yml, docs/prod/aws.md | | Infra / deploy | Docker Compose (dev), AWS Amplify (SPA), ECS Fargate + ECR + ALB, RDS, Secrets Manager | amplify.yml, .github/workflows/deploy-backend.yml, docs/prod/aws.md | | AI / agents | .claude/ agents/skills/rules, Obsidian vault MCP, cotton live-docs/backlog pipeline | .claude/, AGENTS.md, .mcp.json | | Tests | pytest + pytest-django, Vitest 4 | backend/pyproject.toml, frontend/vitest.config.ts, docs/dev/testing.md |
