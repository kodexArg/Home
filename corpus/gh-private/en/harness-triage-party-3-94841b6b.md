---
id: harness-triage-party-3-94841b6b
title: "harness-triage-party — Kimi-native triage-and-fix agent party — P2 — PR dependency and defer propagation on GitHub"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---

### P2 — PR dependency and defer propagation on GitHub - **Who hurts:** Anyone stacking PRs where later work assumes an unmerged prerequisite, or issues that declare Requires PR: #N in the body. - **Pain today:** GitHub has no first-class merge ordering. When a prerequisite PR is labeled deferred or closed unmerged, dependent PRs can remain open and look mergeable while their ground is gone. - **How this repo answers:** Labels-only contract: requires:<N> on a PR means "must not merge before PR #N"; deferred means the hunt is off. bin/kwf-deps implements requires, check, cascade, lift, and status using gh and Python stdlib. The hunter checks issue-side Requires PR: #N at intake; the mage sets baseRef and prRequirements in the plan; the bard declares labels at publish and runs cascade on deferral. extras/gha-kwf-deps.yml vendors an Actions trigger for human-side defers. - **Out of scope:** Branch protection rules, merge queues, or parsing requirement declarations from PR comment text (the label is the machine contract).
