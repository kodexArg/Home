---
id: engram-5-24a1222a
title: "engram — persistent memory for AI coding agents — 3. Product / idea"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---

## 3. Product / idea Engram is the **memory engine**; agents and thin plugins are **clients**. The mental model: After significant work, the **agent** (not a background compressor) calls with structured What/Why/Where/Learned content. Sessions are registered ( / ) and summarized at closure. Retrieval is search-first, then timeline, then full observation — never a full DB dump. Six user-facing surfaces share one package: 1. **CLI** — , , , , , etc. 2. **HTTP API** — JSON REST on loopback port 7437 for plugins (OpenCode session tracking). 3. **MCP server** — stdio transport; 15 tools for agent tool calls. 4. **TUI** — Bubbletea browser (Catppuccin Mocha, vim keys). 5. **Setup/installer** — embeds and patches plugin configs. 6. **Git sync** — exports gzipped JSONL chunks into for commit-based multi-machine sync without merge conflicts on one giant file. Beta **Obsidian Brain** ( side-by-side binary) exports observations as linked Markdown notes for graph visualization in Obsidian — same DB, separate binary name so stable installs stay untouched.
