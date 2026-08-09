---
id: kcbd-monitor-8-a19d2aea
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — 4. Technology stack"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (Django backend), Node ≥22.12 (Astro build), Bun (frontend package manager) | backend/requirements.txt, frontend/package.json engines | | Frontend | Astro 7.0.2, Svelte 5.56.4, Tailwind 4.3.1, shadcn-svelte (vendored), echarts 6.1.0 | frontend/package.json, frontend/src/lib/components/ui/, docs/REQUIREMENTS.md | | Backend / API | Django 6.0.6 + DRF 3.17.1, gunicorn, whitenoise, django-cors-headers | backend/requirements.txt, backend/kcbd_core/api.py | | Data | PostgreSQL 17 on RDS (logical DB kcbd); local Postgres 17 via Docker Compose | docs/MODEL.md, docker-compose.yml, infra/kcbd-backend-infra.yaml | | Infra / deploy | AWS Amplify (frontend), ECS Fargate + ALB (backend), ECR, Secrets Manager, Route53, CloudWatch; GitHub Actions on dev/prod branches | amplify.yml, .github/workflows/deploy.yml, docs/INFRA.md | | AI / agents | .claude/rules/ (ADR symlinks), .agents/skills/kcbd-logs/, AGENTS.md SSOT | .claude/, AGENTS.md | | Tests | Vitest 4 + Testing Library Svelte (frontend, 442 tests); pytest stack adopted but backend test surface lighter | frontend/vitest.config.ts, docs/REQUIREMENTS.md |
