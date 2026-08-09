---
id: djangoconda-5-a4f24675
title: "DjangoConda — frozen Conda prefix with Python 3.7, Django 3, psycopg2, and Django ecosystem packages — 3. Product / idea"
visibility: private
importance: normal
source_repo: "DjangoConda"
related: []
tags: ["djangoconda", "github", "private", "normal", "summary"]
---

## 3. Product / idea The central idea is **environment-as-repository**: treat a Conda prefix like source code. There is no Django manage.py, no settings.py, and no urls.py in this tree — only the **runtime** that other repos (e.g. DjangoMCE-family projects) consume. Mental model: An operator points PATH or conda activation at this prefix, then runs a separate application repo's Django project against the bundled packages. WSGI deployment is **implicit** (Django is WSGI-capable; asgiref includes WSGI-to-ASGI adapters) but this repo does **not** ship Gunicorn, uWSGI, or mod_wsgi binaries — an external WSGI server or platform layer is assumed. INSTALACION.md documents an older creation recipe (conda create -p ./cda python=3.6 django psycopg2 plus pip extras), which diverges from the actual frozen state (Python 3.7.5, Django 3.0.3). Treat INSTALACION.md as historical hint, not SSOT for the checked-in prefix.
