---
id: harness-default-2-d846eefd
title: "harness-default — Fullstack project template with constitution, ADRs, assertions, and agent delivery — P1 — Scattered project knowledge and agent lawlessness"
visibility: public
importance: high
source_repo: "harness-default"
related: ["gh-harness-default"]
tags: ["harness-default", "github", "public", "high", "summary"]
---

### P1 — Scattered project knowledge and agent lawlessness - **Who hurts:** Teams starting greenfield fullstack work; operators running LLM agents on a codebase without a single authority order; anyone whose PRD, requirements, and architecture docs diverge from what agents "remember" in session context. - **Pain today:** Constitution and decisions live in wikis, Slack, or ad-hoc README sections. Agents improvise policy. Code and docs disagree with no binding arbiter. Every new repo reinvents folder layout, naming, and doc tiers. - **How this repo answers:** Everything the project *knows* lives under docs/ with a strict tier model (docs/constitution/ for stable binding material, loose docs/ files for iterating knowledge, docs/adrs/ for numbered binding decisions, docs/assertions/ for optional owner laws). ADR-01 defines authority order: PRD → constitution → ADRs → other docs; where ADR and code disagree, the ADR wins. Agent tooling (kskill-*, khook-*, kbot-*, kwf-*) lives beside the law under docs/ and is wired into runtimes via symlinks (.claude/agents, .claude/skills, .claude/hooks). Hooks inject PRD and API at session start, enforce API-doc-before-route rules, and nudge guardian dispatch after edits. - **Out of scope:** Running application code (code roots ship empty with .gitkeep only); choosing cloud provider or stack for the adoptee (INFRASTRUCTURE and stack skills are
