---
id: rpi-temp-8-ddafc171
title: "Raspberry Pi Temperature Monitor — Flask chart API over MySQL — 4. Technology stack"
visibility: private
importance: normal
source_repo: "rpi-temp"
related: []
tags: ["rpi-temp", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from manifests and top-level source only; flask/env38/ virtualenv is gitignored and not summarized. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.8 | flask/Dockerfile, flask/requirements.txt | | Web framework | Flask 1.1.2 | flask/requirements.txt, flask/app/__init__.py | | WSGI server | uWSGI 2.0.19 | flask/requirements.txt, flask/app.ini, flask/Dockerfile CMD | | Reverse proxy | nginx (official image) | nginx/Dockerfile, nginx/nginx.conf | | Data access | Flask-MySQL 1.5.1, PyMySQL 0.10.1 | flask/requirements.txt, flask/app/db.py | | Data shaping | pandas 1.1.3, numpy 1.19.2 | flask/requirements.txt, flask/app/views.py | | Database | MySQL (db_temperatura, table tb_temperatura) | flask/app/db.py, SQL in flask/app/views.py | | Frontend | Jinja2 templates, Chart.js 2.9.3, jQuery 3.5.1, Bootstrap 4.5.2 | flask/app/templates/ | | Container orchestration | Docker Compose v3 | docker-compose.yml | | Infra / deploy | Local Docker only; DB host points to external managed MySQL | flask/app/db.py, docker-compose.yml | | AI / agents | None | — | | Tests | None evident | — |
