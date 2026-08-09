---
id: dj-indoor-monitor-4-3eba04cb
title: "dj-indoor-monitor — Django IoT dashboard for indoor crop sensor monitoring — P3 — On-premise Docker deployment with sensor-compatible networking"
visibility: public
importance: normal
source_repo: "dj-indoor-monitor"
related: ["dj-indoor-monitor"]
tags: ["dj-indoor-monitor", "github", "public", "normal", "summary"]
---

### P3 — On-premise Docker deployment with sensor-compatible networking - **Who hurts:** Teams deploying on a private LAN (e.g. static host on 192.168.x.x) where sensors were already configured to POST to port 8000, and where inbound SSH from the public internet is undesirable for CI/CD. - **Pain today:** Cloud-first deploy guides do not match LAN topology; opening SSH for GitHub Actions is a security risk; nginx/Django port mapping mismatches break existing sensor configs. - **How this repo answers:** docker-compose.yml runs webapp (Gunicorn), db (TimescaleDB), nginx, and redis. Nginx maps host ports 80 and 8000 → container port 80, so sensors targeting :8000/api/data-point/ keep working (DEPLOY.md). GitHub Actions workflow .github/workflows/deploy.yml uses a **self-hosted runner** on push to on-premise, running docker-compose up -d --build without exposing inbound ports (CICD_SETUP.md). - **Out of scope:** Cloudflare Workers deploy (this repo is on-prem Docker, not edge Workers); managed Kubernetes; automatic TLS/Let's Encrypt (docs assume optional HTTP on LAN).
