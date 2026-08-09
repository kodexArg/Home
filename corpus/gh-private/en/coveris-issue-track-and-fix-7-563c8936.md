---
id: coveris-issue-track-and-fix-7-563c8936
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — 3.1 North-star use cases"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---

### 3.1 North-star use cases 1. Operator runs router.py 101 → Tracker analyzes GitHub issue #101 in cotton-coveris-mvp → Router assigns Fixer → Fixer opens a PR with the patch. 2. Tracker classifies a stale/duplicate-style issue → Router defers or Fixer calls comment_and_mark_issue_complex when confidence is low. 3. Maintainer invokes agy-implement-waypoint skill at a milestone (new triage/fix strategy or core Python change) → commit, pytest, gate before continuing.
