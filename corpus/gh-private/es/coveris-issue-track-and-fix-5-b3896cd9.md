---
id: coveris-issue-track-and-fix-5-b3896cd9
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — 3. Product / idea"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---
## 3. Product / idea

The repository implements a **sequential multi-agent pipeline** orchestrated by , not a long-running HTTP service. Execution is CLI-driven: (default issue ) or via wrapper. **Mental model:** 1. **Tracker phase** — Gemini-powered agent with YAML prompts ( ), Obsidian MCP (mandatory health-check; aborts if unreachable), one custom tool for GitHub issue fetch, structured JSON output schema ( ), and read-only workspace over the Coveris MVP checkout. 2. **Router phase** — Pure Python decision matrix: effort + severity → defer (no Fixer); all other combinations route to Fixer with or (model stays ). 3. **Fixer phase** — Second agent with augmented prompt identity per effort level, GitHub write tools, disabled local write/run tools, skills loaded from , same Obsidian MCP requirement, 300-second timeout with graceful escalation. Parallel to the live pipeline, defines **strategy-pattern contracts** ( , ) and Pydantic DTOs ( , , , enums , ) intended for OCP-extensible rule engines. README and describe registering new strategies in workflow modules; those workflow/mock_db files are **referenced in docs but absent from the current tree** — the running system has evolved toward full LLM agents rather than deterministic strategy classes. A secondary **local issue queue** ( markdown table + ) supports human/agent task assignment independent of GitHub issue numbers.
