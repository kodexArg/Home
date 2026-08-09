---
id: fsk-showers-7-1b5e8a7c
title: "FSK Showers — Flask CRUD for roadside shower registrations — 4. Technology stack"
visibility: private
importance: normal
source_repo: "fsk-showers"
related: []
tags: ["fsk-showers", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, docker-compose.yml, app/config.py, and application imports. Lockfile versions used only for major-signal deps; full pin list not reproduced. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (implicit; no .python-version in tree) | requirements.txt, run.py | | Web framework | Flask 2.2.2 | requirements.txt, app/__init__.py | | ORM / migrations | SQLAlchemy 1.4, Flask-SQLAlchemy, Alembic / Flask-Migrate | requirements.txt, app/db.py, app/__init__.py | | Forms / CSRF | Flask-WTF 1.0, WTForms 3.0 | requirements.txt, app/forms.py | | Database driver | PyMySQL 1.0 | requirements.txt, app/config.py URI scheme | | Database server | MySQL 8.0 (containerized) | docker-compose.yml | | Frontend | Jinja2 templates, Bootstrap 3 via Flask-Bootstrap, custom CSS | app/templates/, app/static/css/base.css | | Dev tooling | djlint, cssbeautifier, html-tag-names | requirements.txt | | Infra / deploy | Docker Compose for local MySQL only | docker-compose.yml | | AI / agents | None observed | — | | Tests | None observed | — |
