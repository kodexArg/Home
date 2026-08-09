---
id: harness-default-7-f4295b5d
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery — 3.1 North-star use cases"
visibility: public
importance: high
source_repo: "harness-default"
related: ["gh-harness-default"]
tags: ["harness-default", "github", "public", "high", "summary"]
---

### 3.1 North-star use cases 1. **Clone and bootstrap:** Operator clones the template, deletes one code-root pair (frontend+backend *or* interfaces+services), links khook-pre-commit, installs markdown-vault-mcp, fills PRD brackets, and writes the first product ADR when a decision lands. 2. **Elevate a feature to law:** Owner writes docs/assertions/assertion-NN-slug.md, runs kskill-assertion-review, which demands failing tests under ### Tests, then implementation until green; verified date stamps success. 3. **Deliver a GitHub issue to PR:** Operator invokes kskill-triage-and-fix with the kwf-* cast; forest scouts, inquisitor gates doctrine-first planning, camp specialists work in parallel worktrees, bard publishes; owner runs khook-guardian-dispatch --bundle, dispatches kbot-prd/kbot-adr on cheap tier, and runs assertion review if laws were touched. 4. **Reference without cloning:** Point an LLM at kodexArg/harness-default and instruct it to reproduce the harness structure (constitution tiers, ADR families, assertion discipline, agent naming) in a new project.
