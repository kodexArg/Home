---
id: commce-8-366ef059
title: "ComMCE — internal Django portal for MCE communications, slot stats, and environmental monitoring — 4. Technology stack"
visibility: private
importance: normal
source_repo: "ComMCE"
related: []
tags: ["commce", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.6 | venv/ interpreter paths, migration timestamps | | Backend | Django 2.2.6 | venv/lib/python3.6/site-packages/Django-2.2.6.dist-info, ComMCE/settings.py header comment (2.1.7 origin) | | DB driver | mysqlclient 1.4.4 | venv/.../mysqlclient-1.4.4.dist-info | | Data | Dual MySQL databases | ComMCE/settings.py DATABASES, Temperatura/dbrouters.py | | Tables UI | django-tables2 2.1.1 | INSTALLED_APPS, Estadisticas/tables.py | | Charts (server) | django-chartjs 1.5.0 | INSTALLED_APPS | | DataFrames | django-pandas 0.6.1, pandas 0.25.1 | Temperatura/views.py read_frame | | Frontend | Bootstrap 3 CDN, per-app CSS | templates/base.html, */static/css/*.css | | Charts (client) | Chart.js static + CDN color plugin | Temperatura/templates/Temperatura/*.html | | Charts (client alt) | Google Charts loader (beneficios) | Estadisticas/templates/Estadisticas/Hojas/hoja2.html | | Auth | Django.contrib.auth sessions | ComMCE/urls.py accounts/, LOGIN_REDIRECT_URL | | Tests | Django test modules (minimal) | */tests.py files |
