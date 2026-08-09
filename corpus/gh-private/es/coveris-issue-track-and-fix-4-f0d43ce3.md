---
id: coveris-issue-track-and-fix-4-f0d43ce3
title: "Coveris Issue Track and Fix — autonomous GitHub issue triage and repair agents — P3 — Missing agent harness, skills, and safety documentation for Coveris workfl"
visibility: private
importance: high
source_repo: "coveris-issue-track-and-fix"
related: []
tags: ["coveris-issue-track-and-fix", "github", "private", "high", "summary"]
---

### P3 — Missing agent harness, skills, and safety documentation for Coveris workflows - **Who hurts:** Teams building and operating Antigravity-based agents that must interact with MCP, skills, and policy-gated tools. - **Pain today:** SDK knowledge, Coveris-specific Angular/Django conventions, and checkpoint discipline are tribal; agents lack a curated skill library and Obsidian-backed operational docs. - **How this repo answers:** Ships .agents/skills/ with agy-* skills (Angular signals/forms/routing/http/component, agy-implement-waypoint milestone gates, django-expert, docker-compose, google-antigravity-sdk) plus docs/ Obsidian vault covering architecture, MCP, tools, safety policies, configuration, and data contracts. skills-lock.json pins the upstream google-antigravity-sdk skill hash. AGENTS.md documents skill registration via LocalAgentConfig.skills_paths. - **Out of scope:** General-purpose skill marketplace; skills are Coveris- and AGY-oriented, not product end-user documentation.
