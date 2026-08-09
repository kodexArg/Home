---
id: apprunnertest2-2-f7f11c90
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P1 — Django on App Runner without container orchestration"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

### P1 — Django on App Runner without container orchestration - **Who hurts:** Engineers evaluating AWS App Runner as a simpler alternative to ECS/Fargate/Docker for small Django services. - **Pain today:** Most Django-on-AWS guides assume Docker images or Elastic Beanstalk. App Runner's **source-based Python runtime** is under-documented for Django-specific concerns: WSGI binding, ALLOWED_HOSTS for App Runner domains, proxy SSL headers, and build-time dependency installation. - **How this repo answers:** Ships apprunner.yaml with Python 3.11 runtime, uv for fast venv creation during build, port 8080 bound via PORT env, and scripts/start.sh as the run command. project/settings.py configures SECURE_PROXY_SSL_HEADER, CSRF_TRUSTED_ORIGINS for App Runner/AWS host patterns, and Gunicorn as the production WSGI server. - **Out of scope:** Does not compare App Runner vs ECS cost/scale. No multi-service mesh, no blue/green deploy automation, no GitHub Actions CI in this repo.
