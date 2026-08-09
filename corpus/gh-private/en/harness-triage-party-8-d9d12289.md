---
id: harness-triage-party-8-d9d12289
title: "harness-triage-party — Kimi-native triage-and-fix agent party — 4. Technology stack"
visibility: private
importance: high
source_repo: "harness-triage-party"
related: []
tags: ["harness-triage-party", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3 (CLI), Markdown (agents + skill) | skills/kdx-kimi-triage-and-fix/bin/kwf-deps, agents/kwf-*.md | | Agent platform | Kimi Code CLI — Agent tool, subagent_type, resume | skills/kdx-kimi-triage-and-fix/SKILL.md, references/cast.md | | VCS integration | Git worktrees, branches; gh for issues/PRs/labels | agent builder contracts, bin/kwf-deps | | CI / deploy | Optional GitHub Actions workflow (vendor copy) | skills/kdx-kimi-triage-and-fix/extras/gha-kwf-deps.yml | | AI / agents | 18 custom subagents (kwf-*), 1 skill (kdx-kimi-triage-and-fix) | agents/, skills/kdx-kimi-triage-and-fix/SKILL.md | | Tests | Python stdlib test harness with stubbed gh | skills/kdx-kimi-triage-and-fix/tests/test-deps.py |
