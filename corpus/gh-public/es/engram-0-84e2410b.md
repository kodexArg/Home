---
id: engram-0-84e2410b
title: "engram — persistent memory for AI coding agents — engram"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---

# engram > **Problem thesis (required):** kodexArg/engram gives AI coding agents a **persistent, local-first memory layer** that survives session boundaries, compaction, and machine changes. A single Go binary stores agent-curated observations (decisions, bugfixes, patterns) in SQLite with FTS5 full-text search, exposed through MCP stdio, a REST HTTP API, CLI, and Bubbletea TUI. The design is deliberately **agent-agnostic** — Claude Code, OpenCode, Gemini CLI, Codex, VS Code, Cursor, Windsurf, and any MCP-capable runtime can share the same ~/.engram/engram.db without Node, Python, ChromaDB, or a dedicated worker fleet.
