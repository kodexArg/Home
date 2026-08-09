---
id: engram-3-acb034f8
title: "engram — persistent memory for AI coding agents — P2 — Agent lock-in and infrastructure bloat in memory tools"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---

### P2 — Agent lock-in and infrastructure bloat in memory tools - **Who hurts:** Multi-agent users, contributors who want MIT licensing, and operators who refuse to run Node + Python + vector DB sidecars for memory. - **Pain today:** Tools like claude-mem target Claude Code hooks, require multiple runtimes, run worker services and ChromaDB, and auto-capture raw tool calls that need a separate compression pipeline (extra API cost and latency). - **How this repo answers:** Engram is a **single CGO-free Go binary** ( or release tarball). Search uses built-in SQLite FTS5 — no vector database process. Memory is **agent-curated** at save time (the agent already has the LLM context). MCP stdio works with any compatible agent; thin adapter plugins exist for OpenCode and Claude Code only. - **Out of scope:** Semantic embedding search, automatic capture of every tool invocation, or AGPL-licensed hosted memory SaaS.
