---
id: docs-new-infra-grupoalvs-com-6-3d34868d
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Developer ships to DEV** — Clone kodexArg/<project>, push to main; GHA workflow builds Docker image, pushes dev-<sha> to ECR, optionally runs Django migrations one-shot, updates ECS service on alvs-dev cluster. 2. **Admin promotes to PROD** — Trigger workflow_dispatch with promote_sha; GHA environment prod gates on reviewer; after wait, gha-deploy-prod re-tags image as prod-<sha> and updates alvs-prod ECS service; PROD migrations remain manual per ADR-A-006. 3. **Admin bootstraps new project** — Run uv run python scripts/nuevo_proyecto.py <name> --apply after base infra exists; receive credentials and URLs for a fully convention-compliant project skeleton. 4. **Architect or agent updates spec** — Edit docs/<chapter>.md, cross-check docs/archive/PROJECT-RULES.md, record as-built changes in docs/decisiones-as-built.md; merge to main triggers docs site rebuild.
