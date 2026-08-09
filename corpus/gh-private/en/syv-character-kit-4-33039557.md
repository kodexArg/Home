---
id: syv-character-kit-4-33039557
title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P3 — Curated canon and agent-safe editorial workflow"
visibility: private
importance: high
source_repo: "syv-character-kit"
related: []
tags: ["syv-character-kit", "github", "private", "high", "summary"]
---

### P3 — Curated canon and agent-safe editorial workflow - **Who hurts:** AI agents and human editors maintaining tags, mocks, and lore fidelity without corrupting irreplacable narrative prose or inventing non-canonical terminology. - **Pain today:** Schema changes orphan fixtures; Obsidian graph needs conflict with portable YAML; agents duplicate changelog/version noise into living contracts; lore leaks from non-canonical sibling repos. - **How this repo answers:** AGENTS.md enforces rolling-release docs (no version stamps in PRD), strict API↔MODEL sync, mock migration scripts on schema change, lore read-only pointer to the main SyV universe docs vault, Obsidian-specific skills (skills/kdx-obsidian-bases, skills/kdx-backlog, skills/manejo_tags_proyecto), and kit_tags frontmatter convention to avoid Obsidian's reserved tags field. - **Out of scope:** Writing or modifying the external SyV universe lore repo; validating tags at schema level (custom tags are accepted by design).
