---
id: portal-tajamar-8-8071b13d
title: "Portal Tajamar TV — Django company portal scaffold with AWS EB, S3, and email auth — 4.1 Notable dependencies (curated)"
visibility: private
importance: normal
source_repo: "portal-tajamar"
related: []
tags: ["portal-tajamar", "github", "private", "normal", "summary"]
---

### 4.1 Notable dependencies (curated) - Django==5.1 — core web framework and ORM. - django-allauth==64.2.1 — email authentication, signup, verification flows under /accounts/. - django-storages==1.14.4 + boto3 — S3-backed default and static file storage in non-debug modes. - mysqlclient==2.2.4 — MySQL database driver for RDS. - gunicorn==23.0.0 — production WSGI server (typical EB Python stack). - environs==11.0.0 + python-dotenv — typed environment variable loading from .env. - loguru==0.7.2 — structured logging in views and settings modules. - awsebcli==3.20.10 — Elastic Beanstalk CLI for eb deploy. - django-debug-toolbar==4.4.6 — dev-only toolbar appended in development.py. - django-extensions==3.2.3 — common Django dev utilities (not heavily used in visible code).
