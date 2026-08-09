---
id: syv-mcp-tools-4-f7f311d1
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P3 — Corpus maintenance utilities alongside the MCP server"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---
### P3 — Corpus maintenance utilities alongside the MCP server

- **Who hurts:** SyV maintainers performing structural housekeeping — rebuilding the vault index, removing deprecated frontmatter keys.
- **Pain today:** These one-shot tasks don't belong in the main lore repo but need to live somewhere versioned and discoverable.
- **How this repo answers:** Ships (walks SyV zone directories and writes ), (strips deprecated lines from all Markdown files), and (prepends timestamped lines to for debugging MCP traffic).
- **Out of scope:** Not integrated into MCP tool surface; run manually from CLI. expects to run from within the parent SyV repo tree (uses two levels up from script location).
