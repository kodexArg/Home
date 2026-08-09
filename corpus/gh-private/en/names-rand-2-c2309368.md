---
id: names-rand-2-c2309368
title: "Names.rand — fantasy and real-name desktop generator — P1 — Fantasy-race name generation with lore-appropriate structure"
visibility: private
importance: normal
source_repo: "names.rand"
related: []
tags: ["names.rand", "github", "private", "normal", "summary"]
---

### P1 — Fantasy-race name generation with lore-appropriate structure - **Who hurts:** Dungeon masters, fantasy authors, and game designers populating worlds with drow, elves, dwarves, demons, dragons, orcs, gnomes, and halflings. - **Pain today:** Inventing names that *feel* right for each race is tedious. Copy-pasting from fan wikis is inconsistent and copyright-adjacent. Generic random-string generators produce nonsense. - **How this repo answers:** generator.py implements race-specific composition algorithms. Drow and elf names combine syllable pools with dice-roll-driven patterns (apostrophe inserts, doubled syllables, last-name assembly). Dwarven names stitch prefix, sex-specific suffix, and suffix pools. Demons concatenate two syllable lists. Dragons, gnomes, and halflings use multi-segment name assembly with optional "earned" epithets from a shared gnome_hafling_earned corpus. Orc names draw from a flat word list. Each race's data lives under names/fantasy/ as JSON or TXT. - **Out of scope:** Does not generate place names, ship names, or full character backstories. Does not validate names against official D&D trademark lists. Sex selection is disabled for races that do not use it (demons, dragons, orcs).
