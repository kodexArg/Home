---
id: syv-docs-3-57e56bc2
title: "syv-docs — canonical Obsidian lore vault for Subordinación y Valor — P2 — AI agents need the same SSOT as humans, not raw filesystem grep"
visibility: public
importance: high
source_repo: "syv-docs"
related: ["gh-syv-docs"]
tags: ["syv-docs", "github", "public", "high", "summary"]
---

### P2 — AI agents need the same SSOT as humans, not raw filesystem grep - **Who hurts:** Agent sessions editing lore through Claude/Cursor harnesses; operators relying on semantic search across hundreds of notes. - **Pain today:** Direct filesystem reads miss graph context (backlinks, orphan detection, broken links); blind writes desync search indexes from disk; concurrent Obsidian auto-commits cause etag races on MCP edits. - **How this repo answers:** AGENTS.md / CLAUDE.md charter mandates **markdown-vault-syv MCP as primary SSOT** — hybrid keyword+vector search, optimistic-concurrency writes, backlink/orphan hygiene, and immediate index updates. A **blocking preflight gate** halts all corpus work if the MCP is down. Secondary obsidian-syv MCP covers live Obsidian UI/graph cascade across the wider ~/SyV/ vault horizon. Agent roles are **folder-scoped** (syv-canon owns 1_trasfondo+2_atlas, syv-personajes owns 3_personajes, etc.) with syv-juez-de-codigo as mandatory closing reviewer. - **Out of scope:** The MCP server implementation itself (consumed externally; referenced throughout harness docs).
