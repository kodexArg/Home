---
id: n8n-apprunner-4-89b3b093
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — P3 — App Runner health checks vs n8n authentication"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---

### P3 — App Runner health checks vs n8n authentication - **Who hurts:** Anyone configuring App Runner liveness probes against an n8n instance that has Basic Auth enabled globally. - **Pain today:** Default n8n routes may require auth; misconfigured health checks cause deploy failures or flapping services. - **How this repo answers:** Sets QUEUE_HEALTH_CHECK_ACTIVE=true in apprunner.yaml so n8n exposes /healthz without authentication. README explicitly states health check protocol/path must be configured in the **App Runner console** (HTTP, path /healthz) — not in apprunner.yaml, which App Runner does not use for health check definition. - **Out of scope:** Deep application-level workflow health; synthetic monitoring of individual automations.
