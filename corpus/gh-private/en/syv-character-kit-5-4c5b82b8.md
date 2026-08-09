---
id: syv-character-kit-5-4c5b82b8
title: "SyV Character Kit — PRD, canonical sheets, and character mocks — 3. Product / idea"
visibility: private
importance: high
source_repo: "syv-character-kit"
related: []
tags: ["syv-character-kit", "github", "private", "high", "summary"]
---

## 3. Product / idea The central idea is a **documentation product** that fully specifies how SyV characters and squads exist, are created, evolve, and fight — without shipping runtime code. Cloning this repo gives a designer or implementer: 1. **Schemas** — field-by-field character sheet, tag catalog entry, and squad models with YAML templates. 2. **Contracts** — HTTP routes and persistence entities kept in strict sync. 3. **Game design** — GDDR-01 mandatory creation flow (phases 1–3 defined; phase 4 pending) and GDDR-02 squad-vs-squad battle motor (initiative subsystem substantially drafted). 4. **Data** — ~156 tag catalog notes under , 24 character mock notes under (22 core squad fighters plus NPC examples), 2 squad fixtures under , and name pools under . 5. **Tooling hints** — Python scripts for validation, name sampling, slug migration, and initiative simulation; Obsidian Bases for tabular views. Mental model: **tags are first-class**. Almost everything discrete (skills, traits, perks, equipment, health, mental state, faction, rank, squad membership) is a dot-notation tag in a multiset ( , ). Structural blocks hold identity, three base attributes ( , , ), frozen biography prose, append-only history, ally/nemesis links with prose, and metadata. Squads are first-class entities with members, history, and computed tactical aggregates; combat-volatile state attaches to squad
