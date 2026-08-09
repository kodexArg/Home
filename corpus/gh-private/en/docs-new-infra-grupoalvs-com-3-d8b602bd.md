---
id: docs-new-infra-grupoalvs-com-3-d8b602bd
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P2 — Per-project onboarding is error-prone without enforced conventions"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---
### P2 — Per-project onboarding is error-prone without enforced conventions

- **Who hurts:** Admins spinning up new ALVS applications (e.g. pilot project ).
- **Pain today:** Manual console work produces inconsistent resource names, missing ECR lifecycle rules, wrong DNS patterns, forgotten Cognito app clients, and misaligned Secrets Manager paths. Partial failures leave half-provisioned environments.
- **How this repo answers:** defines the contract. idempotently orchestrates GitHub repo creation, branch protection, GHA environment, RDS databases/users, Secrets Manager entries, ECR, ECS services, S3+CloudFront, Route 53 records, and Cognito clients/groups — with dry-run as default. supplies a reusable DEV deploy workflow (runtime-state model). documents adoption prerequisites.
- **Out of scope:** Shared base infra (VPCs, ALBs, clusters, org Cognito pool, hosted zone) is provisioned once via , not per project.
