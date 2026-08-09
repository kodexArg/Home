---
id: engram-5-24a1222a
title: "engram — persistent memory for AI coding agents — 3. Product / idea"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---

## 3. Product / idea Engram is the **memory engine**; agents and thin plugins are **clients**. The mental model: After significant work, the **agent** (not a background compressor) calls mem_save with structured What/Why/Where/Learned content. Sessions are registered (mem_session_start / mem_session_end) and summarized at closure. Retrieval is search-first, then timeline, then full observation — never a full DB dump. Six user-facing surfaces share one internal/store package: 1. **CLI** — engram search, save, context, sync, projects, etc. 2. **HTTP API** — JSON REST on loopback port 7437 for plugins (OpenCode session tracking). 3. **MCP server** — stdio transport; 15 tools for agent tool calls. 4. **TUI** — engram tui Bubbletea browser (Catppuccin Mocha, vim keys). 5. **Setup/installer** — engram setup [agent] embeds and patches plugin configs. 6. **Git sync** — exports gzipped JSONL chunks into .engram/ for commit-based multi-machine sync without merge conflicts on one giant file. Beta **Obsidian Brain** (engram-beta side-by-side binary) exports observations as linked Markdown notes for graph visualization in Obsidian — same DB, separate binary name so stable installs stay untouched.
