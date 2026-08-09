---
id: engram-4-96a7c956
title: "engram — persistent memory for AI coding agents — P3 — Memory hygiene, deduplication, and token-efficient recall"
visibility: public
importance: normal
source_repo: "engram"
related: ["engram"]
tags: ["engram", "github", "public", "normal", "summary"]
---
### P3 — Memory hygiene, deduplication, and token-efficient recall

- **Who hurts:** Power users with hundreds of observations across projects; agents that would otherwise dump entire memory dumps into prompts.
- **Pain today:** Duplicate saves clutter the store; evolving topics (e.g. auth architecture) spawn many near-duplicate rows; naive recall blows the context budget.
- **How this repo answers:** upserts merge evolving topics ( increments). Exact dedupe via normalized hash + project + scope + type + title within a rolling window. Soft-delete by default ( ). Progressive disclosure: compact search hits (~100 tokens each), timeline drill-in, then full observation fetch. supports vs partitioning.
- **Out of scope:** Automatic merging of semantically similar but differently keyed memories; human-facing wiki editing inside the TUI beyond browse/search.
