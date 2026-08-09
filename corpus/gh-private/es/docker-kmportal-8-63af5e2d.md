---
id: docker-kmportal-8-63af5e2d
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — 4. Technology stack"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.12 | Dockerfile base image | | Web framework | Django 4.2.6 | requirements.txt, config/requirements.txt | | Database | MySQL 8 (docker) / RDS (production per README) | docker-compose.yml, portal/portal/settings.py | | WSGI / reverse proxy | Gunicorn 21 + Nginx 1.25 | config/gunicorn.config.py, config/nginx.conf, docker-compose.yml | | Auth | django-allauth 0.57 (Google, Facebook provider registered) | portal/portal/settings.py, portal/app/adapters.py | | API (scaffold) | Django REST Framework 3.14 | requirements.txt; portal/api/views.py empty | | Frontend styling | django-tailwind 3.6, Flowbite 1.6, Tailwind CSS 3.3 | portal/theme/static_src/package.json, portal/portal/settings.py | | Static assets | WhiteNoise, django-compressor | portal/portal/settings.py | | Object storage | django-storages + boto3 → S3 bucket portal-km1151 | portal/portal/settings.py, portal/portal/custom_storage.py | | i18n | Django locale (en, es, pt) + translations.json | portal/locale/, portal/translations.json, portal/translations.py | | QR | qrcode 7.4 | requirements.txt, portal/app/views/helpers.py | | Logging / debug | loguru, icecream | requirements.txt, used in models/views | | Tests | pytest 7.4 | requirements.txt; test modules in app/, staff/, api/
