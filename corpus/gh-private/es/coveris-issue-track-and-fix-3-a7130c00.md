---
id: coveris-issue-track-and-fix-3-a7130c00
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P2 — High friction from bug report to pull request"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---

### P2 — High friction from bug report to pull request - **Who hurts:** Developers fixing routine frontend/backend bugs in the Coveris MVP stack. - **Pain today:** Even after triage, engineers must branch, patch, commit, and open PRs manually; agent tooling without GitHub write adapters cannot close the loop. - **How this repo answers:** The Fixer agent (agy_coveris_issue_fixer/agent.py) operates read-only on disk (filesystem write tools disabled) but registers four GitHub REST tools from agy_coveris_issue_tracker/github_api.py: create_github_branch, commit_file_to_github, create_github_pull_request, and comment_and_mark_issue_complex. It follows an SOP embedded in its prompt: create fix/issue-{id} branch, commit via API, open PR, or escalate on failure/timeout (300s cap with automatic complex labeling). - **Out of scope:** Local file mutation; direct shell execution (RUN_COMMAND disabled on Fixer); multi-repo orchestration beyond the configured target.
