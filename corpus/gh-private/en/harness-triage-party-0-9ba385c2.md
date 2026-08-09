---
id: harness-triage-party-0-9ba385c2
title: "harness-triage-party — Kimi-native triage-and-fix agent party — harness-triage-party"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---
## harness-triage-party

> **Problem thesis (required):** This repository is the single source of truth for **kdx-kimi-triage-and-fix** — a Kimi-native port of the Claude Code triage-and-fix workflow. It solves three intertwined pains: (1) Kimi has no Workflow runtime, so reliability must come from a deterministic skill playbook, closed YAML contracts, and tool-grant enforcement in agent definitions; (2) GitHub cannot express PR merge ordering, so work that builds on unmerged PRs needs a labels-only REQUIREMENT system with transitive defer cascade; (3) real issues often span disjoint file sets that should be built in parallel by role-specialized agents (backend, frontend, devops, design) with doctrine review before any code is written.
