---
id: n8n-apprunner-2-bdcdfaca
title: "n8n-apprunner — n8n workflow automation on AWS App Runner — P1 — Run n8n on AWS without a Docker build pipeline"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
related: ["n8n-apprunner"]
tags: ["n8n-apprunner", "github", "public", "normal", "summary"]
---
### P1 — Run n8n on AWS without a Docker build pipeline

- **Who hurts:** Teams that want n8n in AWS but lack appetite for ECR image builds, ECS/Fargate task specs, or sidecar orchestration.
- **Pain today:** Official n8n Docker images are the common path; App Runner natively supports Node.js runtimes and configuration files, but n8n is not pre-packaged for that model out of the box.
- **How this repo answers:** Adds as the sole production dependency in , exposes → , and ships with ( ), ( ), and ( on port 5678). App Runner detects the config file when the service is created with *Use configuration file* and *Source type: GitHub*.
- **Out of scope:** Multi-instance n8n queue mode with dedicated workers (task runners are explicitly disabled via ); Kubernetes or Lambda-based n8n; custom n8n nodes or workflow definitions (those live in n8n itself after deploy).
