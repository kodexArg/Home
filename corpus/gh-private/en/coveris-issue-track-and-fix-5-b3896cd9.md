---
id: coveris-issue-track-and-fix-5-b3896cd9
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — 3. Product / idea"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---

## 3. Product / idea The repository implements a **sequential multi-agent pipeline** orchestrated by router.py, not a long-running HTTP service. Execution is CLI-driven: python router.py [issue_number] (default issue 94) or via run_mock_pipeline.py wrapper. **Mental model:** 1. **Tracker phase** — Gemini-powered agent with YAML prompts (agy_coveris_issue_tracker/prompts.yml), Obsidian MCP (mandatory health-check; aborts if unreachable), one custom tool for GitHub issue fetch, structured JSON output schema (TrackerPayload), and read-only workspace over the Coveris MVP checkout. 2. **Router phase** — Pure Python decision matrix: HIGH effort + HIGH severity → defer (no Fixer); all other combinations route to Fixer with effort_level HIGH or LOW (model stays gemini-3.5-flash). 3. **Fixer phase** — Second agent with augmented prompt identity per effort level, GitHub write tools, disabled local write/run tools, skills loaded from .agents/skills/, same Obsidian MCP requirement, 300-second timeout with graceful escalation. Parallel to the live pipeline, coveris_core/ defines **strategy-pattern contracts** (TriageStrategy, FixStrategy) and Pydantic DTOs (Issue, TriageResult, PullRequest, enums IssueStatus, TriageDecision) intended for OCP-extensible rule engines. README and docs/AGY.md describe registering new strategies in workflow modules; those workflow/mock_db files are **referenced
