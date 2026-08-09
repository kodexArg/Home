---
id: harness-triage-party-3-94841b6b
title: "harness-triage-party — Kimi-native triage-and-fix agent party — P2 — PR dependency and defer propagation on GitHub"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---
### P2 — PR dependency and defer propagation on GitHub

- **Who hurts:** Anyone stacking PRs where later work assumes an unmerged prerequisite, or issues that declare in the body.
- **Pain today:** GitHub has no first-class merge ordering. When a prerequisite PR is labeled or closed unmerged, dependent PRs can remain open and look mergeable while their ground is gone.
- **How this repo answers:** Labels-only contract: on a PR means "must not merge before PR #N"; means the hunt is off. implements , , , , and using and Python stdlib. The hunter checks issue-side at intake; the mage sets and in the plan; the bard declares labels at publish and runs cascade on deferral. vendors an Actions trigger for human-side defers.
- **Out of scope:** Branch protection rules, merge queues, or parsing requirement declarations from PR comment text (the label is the machine contract).
