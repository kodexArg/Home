---
id: apprunnertest2-4-b3ae1f76
title: "AppRunner Test 2 — Django on AWS App Runner integration harness — P3 — Fail-fast deployment gate via ordered startup tests"
visibility: private
importance: normal
source_repo: "apprunnertest2"
related: []
tags: ["apprunnertest2", "github", "private", "normal", "summary"]
---
### P3 — Fail-fast deployment gate via ordered startup tests

- **Who hurts:** Operators who want App Runner instances to **never serve traffic** if AWS integrations are broken.
- **Pain today:** Default App Runner behavior starts the process immediately; application-level health checks may pass while DB or S3 is misconfigured.
- **How this repo answers:** runs a strict pipeline before : drop stale test DB, + , , conditional , then four ordered test phases ( , , , , ) — any failure exits non-zero and aborts deployment.
- **Out of scope:** Does not run tests in a separate CI stage; tests execute on every cold start/redeploy. No canary or staged rollout.
