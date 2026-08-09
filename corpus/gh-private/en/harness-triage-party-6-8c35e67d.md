---
id: harness-triage-party-6-8c35e67d
title: "harness-triage-party — Kimi-native triage-and-fix agent party — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. **Standard hunt:** Operator says "triage-and-fix issue #42" — forest triages, mage plans with doctrine read, three camp specialists build disjoint slices in worktrees, gates pass, bard opens one PR with honest test and deviation reporting. 2. **Stacked PR work:** Issue or plan requires unmerged PR #15 — mage sets baseRef to PR #15's head; bard opens new PR with requires:15 labels via kwf-deps requires. 3. **Defer cascade:** Prerequisite PR #15 is closed unmerged — bard or Actions runs kwf-deps cascade 15; every open PR transitively requiring #15 gets deferred and an explanatory comment; lift clears dependents when requirements merge.
