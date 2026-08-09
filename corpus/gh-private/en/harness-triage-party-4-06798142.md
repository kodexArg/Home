---
id: harness-triage-party-4-06798142
title: "harness-triage-party — Kimi-native triage-and-fix agent party — P3 — Parallel, role-aware builds with governance gates"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---
### P3 — Parallel, role-aware builds with governance gates

- **Who hurts:** Issues that touch backend, frontend, infra, and cosmetic surfaces in one hunt — a single generic builder cannot split work cleanly or enforce path-disjoint parallel slices.
- **Pain today:** A two-way backend/frontend split is too coarse; unreviewed plans reach builders; secrets can slip into diffs; code review conflates intent with legibility.
- **How this repo answers:** The mage (or sorcerer for ) emits with path-disjoint file sets, each assigned to a camp specialist ( , , , , , ). Builders create their own git worktrees and branches from . The inquisitor reviews the plan against PRD and ADRs before camp (up to two resume loops). The priest scans the combined diff for secrets with zero tools. The shadow performs a blind legibility review with zero tools. The bard merges slice branches into one PR.
- **Out of scope:** Post-bard hooks (guardian, verifier, smoke-test pause), shadow-to-builder retry loops, and priest appeal paths — noted as open in .
