---
id: dj-apprunner-template-2-d8a47895
title: "dj-apprunner-template — Django starter for AWS App Runner with Vite, HTMX, and S3 static delivery — P1 — Repeat AWS integration work for every new Django App Ru"
visibility: public
importance: normal
source_repo: "dj-apprunner-template"
related: ["dj-apprunner-template"]
tags: ["dj-apprunner-template", "github", "public", "normal", "summary"]
---
### P1 — Repeat AWS integration work for every new Django App Runner project

- **Who hurts:** Developers and operators who want Django on App Runner with managed PostgreSQL and S3-backed static files — not a toy SQLite demo.
- **Pain today:** Each greenfield project must manually stitch together build phases, Gunicorn binding on port 8080, RDS connection env vars, Secrets Manager secret references, IAM instance-role policies for S3 and , django-storages configuration, CSRF/HTTPS proxy headers for App Runner, and runtime after secrets are available.
- **How this repo answers:** Ships a working with a three-phase build (system Node install + , Python venv + pip install, runtime ), with production/local branching via , PostgreSQL from env vars, S3 backends when not local, hardened cookie/CSRF settings for HTTPS behind App Runner proxy, and README documentation of required IAM policies and secret key shapes (names only, no values).
- **Out of scope:** Multi-region HA, blue/green deploy orchestration, Terraform/CDK for provisioning AWS resources (template assumes resources already exist), Docker/ECS paths.
