---
id: apprunnertest2-8-620bd034
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — 4. Technology stack"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from requirements.txt, apprunner.yaml, project/settings.py, and scripts/start.sh. Versions in requirements.txt are unpinned (package names only). | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.11 | apprunner.yaml runtime: python311 | | Web framework | Django | requirements.txt, manage.py, project/settings.py | | WSGI server | Gunicorn (bind 0.0.0.0:8080) | scripts/start.sh, requirements.txt | | Package install | uv (build) + pip | apprunner.yaml build commands | | Database | PostgreSQL via RDS | project/settings.py django.db.backends.postgresql, psycopg2-binary | | Object storage | S3 via django-storages + boto3 | project/settings.py STORAGES, requirements.txt | | CDN | CloudFront custom domain for static/media URLs | project/settings.py STATIC_URL, MEDIA_URL | | Logging | Loguru → stdout + S3 daily rotation | project/settings.py LOGURU_CONFIG | | Secrets | AWS Secrets Manager (App Runner secret refs) | apprunner.yaml secrets block | | Tests | Django DiscoverRunner + pytest deps | project/settings.py TEST_RUNNER, requirements.txt | | Deploy platform | AWS App Runner | apprunner.yaml | | CI/CD | None in repo | no .github/workflows/ tree |
