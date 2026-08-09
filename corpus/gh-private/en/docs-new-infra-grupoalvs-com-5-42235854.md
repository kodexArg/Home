---
id: docs-new-infra-grupoalvs-com-5-42235854
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — 3. Product / idea"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---
## 3. Product / idea

The repository is two coupled products in one tree: 1. **A published documentation site** — Spanish-language MkDocs Material chapters explaining ALVS v3 architecture end-to-end, from VPC design through Cognito groups to Django deployment conventions. 2. **Infrastructure orchestration tooling** — Python CLI scripts under that apply CloudFormation templates in phase order and bootstrap per-project resources, always defaulting to dry-run for safety. The mental model is **"spec is truth, infra is volatile."** AWS resources can be recreated; the documentation and templates define naming, security boundaries, and operational flows. Two isolated VPCs ( at , at ) host shared ALBs and ECS clusters. Applications land as ECS Fargate services behind host-based routing, with per-project S3+CloudFront for static/media assets. A single org-wide Cognito User Pool ( ) federates Google OAuth. GitHub Actions assumes IAM roles via OIDC — DEV deploys automatically on push to ; PROD promotion requires admin approval, wait timer, and ECR image re-tag (no rebuild). Philosophy (from ): simplicity over scale, cost over redundancy (no NAT GW, no WAF, RDS single-AZ by choice), greenfield coexistence with legacy, minimal AWS tags ( , only).
