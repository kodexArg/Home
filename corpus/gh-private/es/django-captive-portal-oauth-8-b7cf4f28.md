---
id: django-captive-portal-oauth-8-b7cf4f28
title: "Django Captive Portal OAuth — WiFi guest authentication via social login — 4. Technology stack"
visibility: private
importance: normal
source_repo: "django-captive-portal-oauth"
related: []
tags: ["django-captive-portal-oauth", "github", "private", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (implicit), Django 4.0.4 | requirements/base.txt, requirements/django-unifi-portal.txt | | Web framework | Django 4.0.4 | requirements/base.txt | | Auth / social | django-allauth (account + socialaccount + Google provider) | portal/config/settings.py INSTALLED_APPS, AUTHENTICATION_BACKENDS | | UI | django-bootstrap5, minimal custom CSS | portal/config/settings.py, portal/templates/base.html, portal/static/base.css | | Data | SQLite (file db.sqlite3, gitignored) | portal/config/settings.py DATABASES | | Captive hardware (planned) | django-unifi-portal 0.0.2 | requirements/django-unifi-portal.txt (not in INSTALLED_APPS) | | Unused / aspirational deps | django-oauth-toolkit, django-rest-framework-social-oauth2, social-auth-app-django, djangorestframework, django-material, django-braces | requirements/django-unifi-portal.txt only | | Tests | None evident | — | | Infra / deploy | None evident (no CI, Dockerfile, compose) | — |
