---
id: docs-new-infra-grupoalvs-com-8-2ac51913
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — 4. Technology stack"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.13 (tooling); Markdown (content) | scripts/pyproject.toml, requirements-docs.txt | | Docs engine | MkDocs Material ≥9.5, pymdown-extensions (Mermaid, tabs, admonitions) | mkdocs.yml, requirements-docs.txt | | AWS IaC | CloudFormation YAML templates (8 base stacks + per-project) | scripts/templates/*.yaml, docs/*/md snippets | | AWS compute | ECS Fargate, ECR, ALB, optional EC2 monitor boxes | docs/compute.md, scripts/templates/50-cluster-*.yaml | | AWS data | RDS PostgreSQL (single-AZ, encryption at rest via CMK per ADR-A-010) | scripts/templates/30-db-*.yaml, docs/databases.md | | AWS identity | Cognito User Pool + Google IdP, Secrets Manager | scripts/templates/40-cognito-org.yaml, docs/cognito.md | | AWS networking | Dual-AZ VPCs, IGW, no NAT, EICE for admin DB access | scripts/templates/10-network-*.yaml, docs/networking.md | | AWS frontend CDN | S3 private buckets + CloudFront OAC per project | docs/frontend.md, scripts/templates/per-project.yaml | | CI/CD | GitHub Actions + OIDC (gha-deploy-dev, gha-deploy-prod, gha-deploy-docs) | docs/cicd.md, scripts/templates/20-ci-oidc.yaml, .github/workflows/deploy-docs.yml | | App stack (documented) | Django on Fargate; static frontends via S3+CloudFront; optional Channels/WebSockets
