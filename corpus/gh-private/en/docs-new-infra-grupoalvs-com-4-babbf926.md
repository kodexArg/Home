---
id: docs-new-infra-grupoalvs-com-4-babbf926
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P3 — Docs must stay publishable and agent-governed as the spec evolves"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---

### P3 — Docs must stay publishable and agent-governed as the spec evolves - **Who hurts:** Anyone consuming the published docs site and AI agents editing chapters. - **Pain today:** Documentation without CI rots; agent edits without rules create inconsistent diagrams, inline comment labels, or unauthorized AWS mutations. - **How this repo answers:** mkdocs.yml configures Material theme (Spanish UI, Mermaid, search). .github/workflows/deploy-docs.yml builds with mkdocs build --strict and deploys to AWS Amplify via OIDC role gha-deploy-docs. AGENTS.md (and symlink CLAUDE.md) define agent access rules: free edit on docs/, read-only on docs/archive/, read-only on live AWS until authorized, Mermaid-only diagrams, heading-before-code-block style. DOCS-PIPELINE.md records pipeline design decisions and legacy fallback via scripts/redeploy.sh. - **Out of scope:** Application runtime hosting for ALVS projects (that uses ECS Fargate per docs/cicd.md); this repo's own hosting is Amplify for the docs site only.
