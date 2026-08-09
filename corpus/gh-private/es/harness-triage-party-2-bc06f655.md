---
id: harness-triage-party-2-bc06f655
title: "harness-triage-party — Kimi-native triage-and-fix agent party — P1 — No deterministic Workflow runtime on Kimi"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---

### P1 — No deterministic Workflow runtime on Kimi - **Who hurts:** Teams that already run on Claude Code and want the same end-to-end issue-to-PR pipeline on Kimi Code CLI. - **Pain today:** Claude's Workflow runtime enforces phase order, branching, and structured outputs. Kimi exposes dispatch and resume but no schema-enforced subagent output — orchestration would otherwise drift into prose improvisation. - **How this repo answers:** The skill is the script: the main agent follows fixed phases (forest → tavern → camp → stalking → plaza) with explicit quick exits. Each node declares a closed YAML output contract as its final message; the main agent parses typed fields and branches. Tool grants in frontmatter ( means zero tools) enforce what nodes can and cannot do — "a grant is a claim; a prompt is a wish." is the node spec SSOT. - **Out of scope:** A hosted workflow engine, Kimi product changes, or automatic tier enforcement beyond dispatch-time pins and optional in config.
