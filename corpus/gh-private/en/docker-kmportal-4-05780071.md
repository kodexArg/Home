---
id: docker-kmportal-4-05780071
title: "KM 1151 Enterprise Portal — Dockerized Django fuel-station B2B portal — P3 — Reproducible containerized deployment"
visibility: private
importance: normal
source_repo: "docker-kmportal"
related: []
tags: ["docker-kmportal", "github", "private", "normal", "summary"]
---
### P3 — Reproducible containerized deployment

- **Who hurts:** Developers and operators who need the portal running consistently across local machines and EC2 production hosts.
- **Pain today:** A bare Django project on a developer laptop does not match production topology (MySQL, reverse proxy, WSGI server, env-driven secrets). Manual EC2 setup is fragile and hard to onboard.
- **How this repo answers:** Root (Python 3.12 slim), (MySQL 8, web/Gunicorn, Nginx 1.25), , , and define a three-service stack. Environment variables drive database credentials and Django settings. README documents EC2 deployment via GitHub Actions SSH pull workflow (referenced in docs; workflow file not present in current shallow clone). Extras include EC2 bootstrap script and a standalone MySQL compose stub.
- **Out of scope:** Kubernetes orchestration, Terraform/IaC, and fully automated initial EC2 provisioning (README states EC2 must be pre-configured).
