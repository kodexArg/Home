---
id: portal-tajamar-7-8e188746
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 4. Technology stack"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, project/*.py, .ebextensions/, and README.md. Lockfile is a flat pinned requirements.txt (not summarized line-by-line). | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python, Django 5.1 | requirements.txt, manage.py | | Frontend | Server templates, HTMX, custom dark CSS, Bulma vendored | core/templates/, core/static/ | | Backend / API | Django views (class-based), django-allauth | core/views.py, project/urls.py | | Data | MySQL (RDS in staging; Docker-style env vars in development) | project/development.py, project/staging.py | | Infra / deploy | AWS Elastic Beanstalk, S3, Gunicorn (declared) | .ebextensions/, README.md | | AI / agents | None in tree | — | | Tests | pytest, pytest-django (declared; minimal test stubs) | requirements.txt, core/tests.py, autogestion/tests.py |
