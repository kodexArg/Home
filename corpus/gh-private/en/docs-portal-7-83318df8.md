---
id: docs-portal-7-83318df8
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Add a vault** — Create vaults/my-project/ with markdown only, run ./deploy_vault.sh my-project, confirm Google-gated site at the matching docs subdomain; portal index picks it up on next deploy.sh build. 2. **Edit in Obsidian** — Open the vault folder locally, edit wikilinks and callouts, re-run compile + deploy; no framework files touched. 3. **Stand up another gated static site** — Follow CLOUDFLARE.md recipe with project/host variables; reuse Google IdP id and zone constants documented there. 4. **Agent edits SyV character kit docs** — Read vault AGENTS.md, apply rolling-release PRD rules, keep docs/ schema files consistent; web copy is generated output, not source of truth.
