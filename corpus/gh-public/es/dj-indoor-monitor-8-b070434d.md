---
id: dj-indoor-monitor-8-b070434d
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — 4. Technology stack"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.12 (Dockerfile), Django 5.1.3 | Dockerfile, requirements.txt | | Frontend | Django Templates, HTMX, Skeleton CSS, Plotly.js | core/templates/, core/static/, docs/frontend.md | | Backend / API | Django 5.1 + DRF 3.15, django-filter, django-cors-headers | core/api.py, project/settings.py | | Data | PostgreSQL 14 + TimescaleDB 2.11 (timescale/timescaledb image) | docker-compose.yml, core/models.py | | Infra / deploy | Docker Compose, Nginx reverse proxy, Gunicorn (3 workers), GitHub Actions self-hosted CD | docker-compose.yml, nginx/nginx.conf, .github/workflows/deploy.yml | | Edge / IoT | Python asyncio sensor service, YAML config, adafruit_dht / gpiozero on ARM | scripts/rpi_services/ | | AI / agents | .claude/skills/django-expert/ (SKILL + reference docs); AGENTS.md as SSOT for agents | .claude/, AGENTS.md | | Tests | pytest, pytest-django, pytest-cov, coverage | requirements.txt, core/tests.py |
