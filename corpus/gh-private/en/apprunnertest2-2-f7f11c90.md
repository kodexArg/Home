---
id: apprunnertest2-2-f7f11c90
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P1 — Django on App Runner without container orchestration"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

### P1 — Django on App Runner without container orchestration - **Who hurts:** Engineers evaluating AWS App Runner as a simpler alternative to ECS/Fargate/Docker for small Django services. - **Pain today:** Most Django-on-AWS guides assume Docker images or Elastic Beanstalk. App Runner's **source-based Python runtime** is under-documented for Django-specific concerns: WSGI binding, for App Runner domains, proxy SSL headers, and build-time dependency installation. - **How this repo answers:** Ships with Python 3.11 runtime, for fast venv creation during build, port bound via env, and as the run command. configures , for App Runner/AWS host patterns, and Gunicorn as the production WSGI server. - **Out of scope:** Does not compare App Runner vs ECS cost/scale. No multi-service mesh, no blue/green deploy automation, no GitHub Actions CI in this repo.
