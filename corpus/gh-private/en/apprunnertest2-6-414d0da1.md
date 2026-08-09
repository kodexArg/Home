---
id: apprunnertest2-6-414d0da1
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Deploy smoke test** — Push to prod, App Runner builds and runs start.sh; all integration tests green; /core/health/ returns JSON status: ok. 2. **RDS verification** — /core/health/db/ executes SELECT 1 and returns success/failure JSON; mirrored by test_database_connectivity in integration suite. 3. **S3 write path** — Integration test saves a temp file via S3Boto3Storage, reads it back, deletes it — proving django-storages and IAM role permissions. 4. **Operator inspection** — Django admin available after auto-created superuser (credentials from Secrets Manager, not in repo).
