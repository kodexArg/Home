---
id: syv-docs-4-41acd915
title: "syv-docs — canonical Obsidian lore vault for Subordinación y Valor — P3 — AI prose must learn the author's voice, not overwrite it"
visibility: public
importance: high
source_repo: "syv-docs"
related: ["gh-syv-docs"]
tags: ["syv-docs", "github", "public", "high", "summary"]
---
### P3 — AI prose must learn the author's voice, not overwrite it

- **Who hurts:** The primary author (kodex) co-writing narrative in , , with Claude; future agents imitating approved house prose.
- **Pain today:** Obsidian Git auto-commits attribute both human and MCP writes to the same author identity, making it impossible to distinguish "model draft" from "author revision" by git metadata alone.
- **How this repo answers:** Two complementary pipelines: ** ** ( ) pairs ledger-recorded Claude generations with subsequent human edits via git diff after push, distilling ✅/✍️/✂️ style lessons into ; ** ** ( ) scans Highlightr spans in live prose, classifies intent by color (approve, negate, paraphrase, lyric-more, etc.), and applies literal span replacements on disk before MCP reindex. Together they form a **human-in-the-loop style canon** grounded in real edit history.
- **Out of scope:** Fully automated prose generation without human review; the agent role is marked TBD/not implemented.
