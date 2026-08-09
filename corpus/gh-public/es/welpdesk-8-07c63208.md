---
id: welpdesk-8-07c63208
title: "Welp Desk — configurable multi-organization Django help-desk ticketing — 4. Technology stack"
visibility: public
importance: normal
source_repo: "welpdesk"
related: ["welpdesk"]
tags: ["welpdesk", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11 (Dockerfile), Django 5.1.7 | Dockerfile, requirements.txt | | Frontend | Django Templates, HTMX 1.9, Tailwind CSS 4, django-components | package.json, core/templates/, core/components/ | | Asset pipeline | Vite 6, django-vite 3.1 | vite.config.mjs, project/settings.py | | Backend | Django 5.1 monolith (core app) | project/settings.py, core/ | | Data | PostgreSQL 16 | docker-compose.yaml, requirements.txt (psycopg2-binary) | | Infra / deploy | Docker Compose (db, web, nginx), Gunicorn (3 workers, 2 threads) | docker-compose.yaml, Dockerfile | | Logging | Loguru (file rotation, 60-day retention) | core/logger.py, project/settings.py | | Seed / config | PyYAML loading of initialize-db.yaml on migrate | core/apps.py, configs/initialize-db/ | | Tests | None configured | package.json scripts, no test deps in requirements.txt |
