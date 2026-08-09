---
id: flia-8-d9b0cbcf
title: "Flia — family household expense tracker (Django admin) — 4. Technology stack"
visibility: private
importance: low
source_repo: "Flia"
related: []
tags: ["flia", "github", "private", "low", "summary"]
---

## 4. Technology stack Derived from vaneconomic/vaneconomic/settings.py, envs/conda-meta/history, and package metadata under envs/lib/python3.7/site-packages/ (names/versions only). | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.7.4 | envs/conda-meta/python-3.7.4-h265db76_1.json | | Web framework | Django 2.2.5 | settings.py header; envs/conda-meta/django-2.2.5-py37_1.json | | Admin UI styling | django-bootstrap4 1.0.1 | settings.py INSTALLED_APPS; envs/lib/python3.7/site-packages/django_bootstrap4-1.0.1.dist-info/ | | Data | SQLite (active); MySQL client bundled unused | settings.py DATABASES; envs/conda-meta/mysqlclient-1.4.4-py37he6710b0_0.json | | Env packaging | Conda prefix committed in-repo | envs/conda-meta/history | | Frontend | None (admin only) | empty views.py; no templates/ tree | | Infra / deploy | None evident | no .github/, no Dockerfile, no wrangler.jsonc | | AI / agents | None | .claude/ absent (scanned) | | Tests | Django TestCase stub only | vaneconomic/App/tests.py |
