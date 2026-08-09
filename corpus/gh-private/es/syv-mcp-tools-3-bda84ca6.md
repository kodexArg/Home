---
id: syv-mcp-tools-3-bda84ca6
title: "SyV MCP Tools — Markdown metadata validation server for Subordinación y Valor — P2 — Machine-readable metadata extraction for agents"
visibility: private
importance: normal
source_repo: "syv-mcp-tools"
related: []
tags: ["syv-mcp-tools", "github", "private", "normal", "summary"]
---

### P2 — Machine-readable metadata extraction for agents - **Who hurts:** AI agents that need to read SyV document metadata (title, folder, tags, region, character factions) to make routing or summarization decisions without parsing YAML themselves. - **Pain today:** Each agent session would need to re-implement frontmatter parsing, list handling, and validation logic — error-prone and wasteful of context tokens. - **How this repo answers:** The MCP tool validates first, then parses frontmatter into a JSON dictionary with properly typed list fields. Agents call one tool and receive structured metadata or a clear error. - **Out of scope:** Does not query a database or search index; operates on a single file path at a time. No batch operations via MCP (though CLI supports single-file mode).
