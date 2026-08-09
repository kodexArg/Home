---
id: django-kmportal-8-ff4f0523
title: "KM 1151 Enterprise Portal — B2B fuel-station ordering and pump-operator intranet — 4. Technology stack"
visibility: private
importance: normal
source_repo: "django-kmportal"
related: []
tags: ["django-kmportal", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, portal/portal/settings.py, portal/theme/static_src/package.json, and README. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python; Django 4.2.6 | requirements.txt, portal/manage.py | | Frontend styling | Tailwind CSS 3.3, Flowbite 1.6, django-tailwind theme app | portal/theme/static_src/package.json, settings.py INSTALLED_APPS | | Backend / API | Django 4.2 + class-based views; DRF present but unused | portal/portal/urls.py, portal/api/views.py | | Auth | django-allauth (Google, Facebook providers); Django session auth for staff | settings.py, app/adapters.py | | Data | MySQL (django.db.backends.mysql) | settings.py DATABASES, extras/ddbb/docker-compose.yaml | | Object storage | AWS S3 bucket portal-km1151 for documents/static experiments | settings.py AWS_* keys, portal/portal/custom_storage.py | | Static assets | WhiteNoise + django-compressor; Tailwind build to portal/static/css/dist/ | settings.py, portal/guvicorn_app.py | | Infra / deploy | EC2 + Gunicorn + Nginx (per README/TODO); GitHub Actions pull-ec2.yml referenced | README.md, portal/runserver.sh, extras/scripts/new-ec2-required.sh | | i18n | Django i18n + custom JSON translation sync | portal/locale/, portal/translations.json, portal/translations.py | | Tests | pytest in requirements; sparse
