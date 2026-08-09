---
id: apprunnertest2-3-7cff83be
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P2 — End-to-end AWS service integration proof for Django"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

### P2 — End-to-end AWS service integration proof for Django - **Who hurts:** Teams wiring Django to RDS, S3, and Secrets Manager who need a **working reference** before copying patterns into larger apps. - **Pain today:** Configuration errors in STORAGES, database DSNs, or secret injection often surface only at runtime in production. Scattered tutorials rarely combine all three with App Runner's secret-reference syntax. - **How this repo answers:** apprunner.yaml declares plain env vars for non-secret config (DB host/port/name, S3 bucket, region, CloudFront custom domain) and secrets blocks referencing Secrets Manager ARNs for SECRET_KEY, DB credentials, Django superuser fields, and a PING secret (connectivity smoke). project/settings.py reads all values from environment, configures django-storages S3 backends for default and staticfiles, and routes Loguru logs to both stdout and an S3 log prefix. tests/test_integration.py performs live S3 list, DB SELECT 1, and S3 save/read/delete for static storage. - **Out of scope:** No IAM policy definitions in-repo (assumed provisioned externally). No Terraform/CDK. No local S3 emulation (listed as TODO in README).
