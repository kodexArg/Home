---
id: dj-apprunner-template-8-853c4d74
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — 4. Technology stack"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11 | apprunner.yaml runtime: python311 | | Web framework | Django 5 (unpinned in requirements) | README.md, requirements.txt (django) | | WSGI server | Gunicorn | requirements.txt, scripts/start.sh | | Database | PostgreSQL via RDS | project/settings.py DATABASES, apprunner.yaml env DB_* | | Object storage / CDN | S3 + CloudFront via django-storages | project/settings.py STORAGES, apprunner.yaml AWS env vars | | Secrets | AWS Secrets Manager (runtime injection) | apprunner.yaml run.secrets block | | AWS SDK | boto3 | requirements.txt, tests/test_integration.py | | Frontend build | Vite 5, Tailwind v4 (@tailwindcss/vite) | package.json, vite.config.mjs, tailwind.config.js | | Frontend runtime | HTMX 2, django-htmx, django-vite, django-components | package.json, project/settings.py INSTALLED_APPS, frontend/main.js | | Logging | Loguru (stdout + optional S3 daily rotation) | project/settings.py LOGURU_CONFIG | | Package tooling | uv for venv/pip in CI; pip in requirements | apprunner.yaml build commands, README.md | | Node (build only) | Node 20.13.1 downloaded in pre-build | apprunner.yaml build.env NODE_* vars | | Tests | pytest, pytest-django, Django DiscoverRunner | requirements.txt, tests/, core/tests/ | | IDE agent rules |
