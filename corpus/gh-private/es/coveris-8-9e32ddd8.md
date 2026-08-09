---
id: coveris-8-9e32ddd8
title: "Coveris — healthcare capacity planning for Argentine private clinics — 4. Technology stack"
visibility: private
importance: high
source_repo: "coveris"
related: []
tags: ["coveris", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node ≥22 / Bun 1.3.5 (frontend); Python ≥3.13 (backend) | frontend/package.json, backend/pyproject.toml | | Frontend | Angular 21.2, PrimeNG 21, Tailwind 4, Chart.js, Vitest | frontend/package.json, frontend/angular.json | | Backend / API | Django 5.2, DRF 3.15, uvicorn ASGI, django-fsm-2, SimpleJWT | backend/pyproject.toml, docs/stack/backend.md | | Data | PostgreSQL 17 (local Compose); Supabase Postgres 17 (prod target) | docker-compose.yml, docs/migration-plan/README.md | | Infra / deploy | Cloudflare Worker + Container (prod target); legacy AWS ECS/RDS/Amplify docs; GitHub Actions deploy | wrangler.jsonc, worker/index.ts, .github/workflows/deploy-worker.yml, docs/prod/aws.md | | AI / agents | Extensive .claude/ rules (ADR symlinks), .agents/ Cloudflare skills, Obsidian vault MCP, cotton agent pipeline | AGENTS.md, .claude/rules/, docs/README.md | | Tests | pytest + pytest-django (backend); Vitest + Angular test runner (frontend) | backend/pyproject.toml, frontend/vitest.config.ts |
