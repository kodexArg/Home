---
id: syv-game-system-4-5df19e2c
title: "syv-game-system — platform-agnostic rules vault for Subordinación y Valor — P3 — Rule consistency under combinatorial complexity"
visibility: private
importance: normal
source_repo: "syv-game-system"
related: []
tags: ["syv-game-system", "github", "private", "normal", "summary"]
---
### P3 — Rule consistency under combinatorial complexity

- **Who hurts:** Designers and AI agents extending a system with WEGO orders, tag pipelines, squad aggregation, hex movement, initiative tracks, and five lore factions.
- **Pain today:** WEGO games with individual soldiers inside squad tokens, tag-based modifiers, and simultaneous secret orders produce edge cases (collisions, desorganizado states, FAP crew requirements) that contradict across documents without a governed vault structure.
- **How this repo answers:** is the Map of Content with integrated glossary and faction synonym table. defines tags as a **non-transactional document database** with a deterministic pre-roll pipeline (flat modifiers → multipliers → health effects → context). imposes red lines: no implementation code, mechanical symmetry for Blue/Red in MVP, YAML frontmatter on every reglamento/lore note, and mandatory index updates for new notes. Mathematical probability tables in the architecture pill ground dice design ( median, favorable min, unfavorable max).
- **Out of scope:** Automated rule validation, linter, or playtest harness. Status across files is predominantly (draft).
