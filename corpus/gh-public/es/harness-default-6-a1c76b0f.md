---
id: harness-default-6-a1c76b0f
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery — 3. Product / idea"
visibility: public
importance: high
source_repo: "harness-default"
related: ["gh-harness-default"]
tags: ["harness-default", "github", "public", "high", "summary"]
---

## 3. Product / idea The harness is **scaffolding with opinion**, not a runnable app. Clone it, pick one code-root pair, fill constitution brackets, grow docs with code, and optionally wire issue delivery. The mental model splits knowledge from implementation: Two layers of familiar governance sit on the scaffold: **PRD** at the top of authority, **ADRs** as binding rules (presence in docs/adrs/ makes a rule in force). The **novel layer** is assertions—owner-reserved laws that are the only sanctioned entry path for important solutions, always arriving as proving tests then code. Agent artifacts are prefixed by kind (kskill-* skills, khook-* hooks, kbot-* agents, kwf-* delivery cast) per ADR-02 rule 8. Ported stack skills wear a banner warning that origin ADR citations and cloud/path specifics are not in force until remapped. The docs/ tree is served as an Obsidian-style wikilink vault via markdown-vault-mcp (config in .mcp.json and .cursor/mcp.json), excluding skills/, hooks/, and agents/ from the index to avoid SKILL.md basename collisions.
