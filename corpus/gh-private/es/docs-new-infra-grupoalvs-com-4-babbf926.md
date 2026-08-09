---
id: docs-new-infra-grupoalvs-com-4-babbf926
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling — P3 — Docs must stay publishable and agent-governed as the spec evolves"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
related: []
tags: ["docs-new-infra-grupoalvs-com", "github", "private", "high", "summary"]
---
### P3 — Docs must stay publishable and agent-governed as the spec evolves

- **Who hurts:** Anyone consuming the published docs site and AI agents editing chapters.
- **Pain today:** Documentation without CI rots; agent edits without rules create inconsistent diagrams, inline comment labels, or unauthorized AWS mutations.
- **How this repo answers:** configures Material theme (Spanish UI, Mermaid, search). builds with and deploys to AWS Amplify via OIDC role . (and symlink ) define agent access rules: free edit on , read-only on , read-only on live AWS until authorized, Mermaid-only diagrams, heading-before-code-block style. records pipeline design decisions and legacy fallback via .
- **Out of scope:** Application runtime hosting for ALVS projects (that uses ECS Fargate per ); this repo's own hosting is Amplify for the docs site only.
