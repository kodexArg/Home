---
id: engram-2-dbf5d280
title: "engram — persistent memory for AI coding agents — P1 — Session amnesia for coding agents"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---
### P1 — Session amnesia for coding agents

- **Who hurts:** Developers pair-programming with Claude Code, Cursor, OpenCode, Codex, Gemini CLI, and other agents; anyone whose agent forgets prior architecture decisions after compaction or a new chat.
- **Pain today:** Context windows reset. The agent re-discovers the same bugs, re-debates the same tradeoffs, and cannot recall what the user already decided last Tuesday. Manual notes are static and do not capture session-specific learnings.
- **How this repo answers:** Agents call MCP tools ( , , , ) to persist structured observations and end-of-session summaries. On the next session, and progressive disclosure ( → → ) inject relevant prior work. Plugins add compaction-recovery hooks so memory discipline survives context resets.
- **Out of scope:** Replacing the agent's live working context, real-time collaborative editing of memories by humans, or cloud-hosted team knowledge bases without local SQLite as source of truth.
