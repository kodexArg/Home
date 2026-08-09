---
id: pihome-8-41f102f9
title: "PiHome — Django multimedia hub for Raspberry Pi — 4. Technology stack"
visibility: private
importance: normal
source_repo: "PiHome"
related: []
tags: ["pihome", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from PiHome/settings.py, manage.py, committed virtualenvironment/pyvenv.cfg, and package metadata under virtualenvironment/lib/python3.6/site-packages/ (vendor tree noted but not ingested line-by-line). | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.6.8 | virtualenvironment/pyvenv.cfg | | Web framework | Django 2.2.4 | virtualenvironment/.../Django-2.2.4.dist-info/METADATA; PiHome/settings.py header | | Frontend | Django templates + Bootstrap 4 via django-bootstrap4 | PiMedia/templates/PiMedia/base.html; INSTALLED_APPS in PiHome/settings.py | | Forms UI | django-crispy-forms with bootstrap4 pack (declared) | PiHome/settings.py (crispy_forms, CRISPY_TEMPLATE_PACK) | | Backend / API | Django function and class views (HTML, not REST) | PiMedia/views.py, PiMedia/urls.py | | Data | MySQL via django.db.backends.mysql and mysqlclient 1.4.4 | PiHome/settings.py; virtualenvironment/.../mysqlclient-1.4.4-py3.6.egg-info | | Media storage | Local filesystem (MEDIA_ROOT, FileSystemStorage) | PiHome/settings.py; PiMedia/views.py | | Infra / deploy | Shell scripts + committed venv (non-standard) | run.sh, src.sh, virtualenvironment/ | | AI / agents | None | No .claude/, .agents/, or skill trees present | | Tests | Django TestCase scaffold only (no cases) | PiMedia/tests.py |
