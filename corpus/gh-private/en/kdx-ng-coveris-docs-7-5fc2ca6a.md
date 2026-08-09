---
id: kdx-ng-coveris-docs-7-5fc2ca6a
title: "Coveris Documentation Portal — Angular docs site and QA harness — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "kdx-ng-coveris-docs"
related: []
tags: ["kdx-ng-coveris-docs", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Developer onboarding** — Clone related Coveris app repos, open this docs portal locally (ng serve), read dev-setup.md, stack-overview.md, and ADR index before writing code. 2. **Contract-first API work** — Edit 02-api.md first, then implement Django serializers/views and Angular httpResource() consumers; API.md wins on conflict. 3. **Agent-assisted documentation** — Invoke coveris-adr-editor or coveris-prd-editor (per ai-registry.md) while viewing rendered ADRs/PRD in the portal. 4. **Pre-release QA** — Run the AGENTS.md workflow against a staging or production Coveris frontend; collect categorized markdown findings and optional HTML report. 5. **Design system QA** — Browse /showcase routes to validate PrimeNG Lara token usage before shipping UI in the main app.
