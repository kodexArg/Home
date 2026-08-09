---
id: djangomce-8-2b0feb48
title: "DjangoMCE — internal Mendoza Central operations portal — 4. Technology stack"
visibility: private
importance: normal
source_repo: "DjangoMCE"
related: []
tags: ["djangomce", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.7 (inferred from __pycache__), Django 3.0.3 | mce/__pycache__/*.cpython-37.pyc, requeriments.txt | | Frontend | Bootstrap 4, jQuery 3.4, Highcharts, SCSS via compressor | mce/settings.py, templates/base.html, package-lock.json, BOWER_INSTALLED_APPS | | Backend / API | Django 3 + DRF 3.11, rest-pandas | requeriments.txt, apps/apis/ | | Data | PostgreSQL (default + tragamonedas), MySQL (db_temp) | mce/settings.py DATABASES | | Infra / deploy | No CI/CD or Docker manifests at repo root; PyCharm/VS Code IDE configs present | tree scan (no .github/), .idea/, .vscode/ | | AI / agents | None present | no .claude/ or .agents/ | | Tests | Django tests.py stubs per app (minimal) | apps/*/tests.py |
