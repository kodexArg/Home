---
id: harness-default-4-895ed4b9
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery — P3 — Issue delivery without doctrine, guardians, or asser"
visibility: public
importance: high
source_repo: "harness-default"
related: ["gh-harness-default"]
tags: ["harness-default", "github", "public", "high", "summary"]
---
### P3 — Issue delivery without doctrine, guardians, or assertion gates

- **Who hurts:** Operators running GitHub issues through multi-agent PR workflows; maintainers who need PRD/ADR review before merge; teams where important features should enter as assertion laws, not silent code.
- **Pain today:** Ad-hoc agent loops skip planning against written law. Guardian review is manual or absent. Post-PR batches close without ADR/PRD checks. No standard cast for scout → plan → parallel implement → review → publish.
- **How this repo answers:** ADR-04 binds in-tree issue delivery: skill , 18 cast agents under , and for PR requirement/defer cascades. Phases: forest (hunter, falcon, hound) → tavern (routing) → camp (parallel specialists in git worktrees) → stalking → plaza (bard publishes) → post-bard guardian dispatch with payload and when assertions were touched. ADR-03 defines and guardians with watchlist globs and verdict contracts. and form the safety net. Runtime spawn maps live in .
- **Out of scope:** Hosting the delivery party outside this tree (explicitly rejected by ADR-04); guaranteeing any specific LLM runtime has native registry support (Cursor/Grok injects agent files as prompts instead).
