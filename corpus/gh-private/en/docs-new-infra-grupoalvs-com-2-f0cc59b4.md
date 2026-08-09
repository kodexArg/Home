---
id: docs-new-infra-grupoalvs-com-2-f0cc59b4
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P1 — Fragmented infrastructure knowledge blocks safe greenfield delivery"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---

### P1 — Fragmented infrastructure knowledge blocks safe greenfield delivery - **Who hurts:** Platform admins, architects, and developers onboarding to ALVS's new AWS footprint. - **Pain today:** Before v3, infrastructure intent lived in ad-hoc audits, pre-v3 plans, frozen ADRs, and console state that diverged from written specs. Teams could not tell whether a design choice was aspirational, superseded, or actually deployed. Greenfield work risked overlapping CIDRs with legacy VPCs or re-litigating rejected options (NAT Gateway, WAF, API Gateway backends). - **How this repo answers:** docs/ is the human-facing chapter-by-chapter spec (networking, security, Cognito, databases, compute, frontend, CI/CD, bootstrap). docs/archive/PROJECT-RULES.md holds the dense SSOT v3.2 for agents. docs/decisiones-as-built.md ratifies verified drift between original SPEC and real AWS inventory so the canon stays honest. docs/index.md provides topology diagrams, naming conventions, and current phase status. - **Out of scope:** It does not manage legacy infrastructure (docs/legacy.md is read-only inventory). It does not replace per-application business logic repos.
