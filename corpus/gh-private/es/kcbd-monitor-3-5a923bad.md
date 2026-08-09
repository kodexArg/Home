---
id: kcbd-monitor-3-5a923bad
title: "kcbd-monitor — IoT indoor environment time-series monitoring (Astro + Django DRF) — P2 — Legacy monolith security and coupling"
visibility: private
importance: high
source_repo: "kcbd-monitor"
related: []
tags: ["kcbd-monitor", "github", "private", "high", "summary"]
---

### P2 — Legacy monolith security and coupling - **Who hurts:** The organization running the legacy dj-indoor-monitor system and anyone depending on trustworthy sensor data. - **Pain today:** The legacy stack coupled Django templates, HTMX, and server-side Plotly chart rendering in one deployable unit. It carried documented risks: unauthenticated ingestion, database ports exposed broadly, secrets in server env files, and manual EC2 deploys without reproducible CI/CD. - **How this repo answers:** Strict separation — static Astro site on Amplify Hosting talks cross-origin to a headless DRF API on ECS Fargate behind an ALB. Ingestion requires a static Bearer token; operator reads use per-user DRF Token auth with Django Groups ( / ). Only and health probes are anonymously reachable, enforced at both DRF permission layer and ALB path rules (ADR-009). Credentials live in AWS Secrets Manager, never in the repo. - **Out of scope:** Decommissioning or modifying the legacy EC2 deployment (explicitly left untouched in sa-east-1).
