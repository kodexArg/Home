---
id: astro-drf-aws-2-4e54ccca
title: "astro-drf-aws — Astro SSR + Django DRF template on AWS Fargate — P1 — Repeatable full-stack AWS template without reinventing conventions"
visibility: public
importance: high
source_repo: "astro-drf-aws"
related: ["astro-drf-aws"]
tags: ["astro-drf-aws", "github", "public", "high", "summary"]
---
### P1 — Repeatable full-stack AWS template without reinventing conventions

- **Who hurts:** Teams spinning up new internal web apps that need SSR frontend, REST API, Postgres, OIDC login, and Fargate deploy — but lack a single repo that encodes ALVS account conventions (shared ALB, Cloud Map service discovery, no NAT gateway cost trade-off, ECR tagging, Secrets Manager naming).
- **Pain today:** Each greenfield project re-decides folder layout, env var inventory, CI gates, Docker profiles, and deploy workflow — producing drift, secret mishandling, and routes that exist in code but not in documentation.
- **How this repo answers:** Ships canonical and trees, root with / / / profiles, mirroring the SROA production precedent, (PR) and (push to ), and SSOT files + enforced by PostToolUse hooks. Clone → configure env names → deploy.
- **Out of scope:** Multi-tenant SaaS boilerplate; staging environments (dev + prod only); managed Kubernetes; serverless-only architectures.
