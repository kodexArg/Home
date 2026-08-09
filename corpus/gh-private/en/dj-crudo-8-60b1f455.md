---
id: dj-crudo-8-60b1f455
title: "dj-crudo — Django WiFi captive portal and survey CRUD — 4. Technology stack"
visibility: private
importance: normal
source_repo: "dj-crudo"
related: []
tags: ["dj-crudo", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.10 (slim-bullseye image) | Dockerfile | | Web framework | Django 4.0.4 | requirements.txt, app/config/settings.py | | WSGI server | Gunicorn 20.1.0 | requirements.txt, docker-compose.yml command | | Database | PostgreSQL (Compose db service) | docker-compose.yml, settings.py DATABASES | | Auth | django-allauth + Google provider | requirements.txt, INSTALLED_APPS, SOCIALACCOUNT_PROVIDERS | | UI | django-bootstrap5, fontawesome_5, server-rendered templates | requirements.txt, app/templates/ | | Containerization | Docker, Docker Compose 3.9 | Dockerfile, docker-compose.yml, docker-compose.override.yml | | Dev environment | VS Code Dev Containers | .devcontainer/devcontainer.json, .devcontainer/docker-compose.yml | | Host bridge | Named pipe + bash eval loop | app/config/pipe.py, pipe_line.sh | | Tests | None evident | no tests.py, no pytest config |
