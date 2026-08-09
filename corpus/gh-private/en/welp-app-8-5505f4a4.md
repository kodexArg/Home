---
id: welp-app-8-5505f4a4
title: "Welp App — internal purchase and payment workflow — 4. Technology stack"
visibility: private
importance: normal
source_repo: "welp-app"
related: []
tags: ["welp-app", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11+ | pyproject.toml (requires-python) | | Backend | Django 5.2, Gunicorn, django-htmx, django-components, django-vite | pyproject.toml, project/settings.py | | API layer | Django REST Framework installed; no routed API views found | project/settings.py (rest_framework in INSTALLED_APPS only) | | Frontend | HTMX 2, Tailwind CSS 4 (@tailwindcss/vite), Alpine.js 3, Mermaid 11 | package.json, vite.config.mjs | | Build | Vite 5 → static/dist/ + manifest; bun 1.3.x | package.json, vite.config.mjs | | Database | PostgreSQL 17 (dev/prod); SQLite in-memory under pytest | project/settings.py, docs/architecture/architecture.md | | Storage | Filesystem locally; core.storage.CustomS3Storage in production | project/settings.py, core/storage.py | | Infra / deploy | Target: AWS ECS Fargate, ECR alvs/welp-backend, ALB, CloudFront, Secrets Manager | docs/architecture/cloud-architecture.md | | CI | GitHub Actions Ruff format/lint on main PRs | .github/workflows/lint.yml | | AI / agents | AGENTS.md, docs/, .claude/skills/, .agents/skills/ | tree scan | | Tests | pytest, pytest-django, pytest-bdd, pytest-ruff, djlint | pyproject.toml, features/ |
