---
id: syv-character-kit-3-14f06c01
title: "SyV Character Kit — PRD, canonical sheets, and character mocks — P2 — Temporal character state and squad tactics without a shared lifecycle model"
visibility: private
importance: high
source_repo: "syv-character-kit"
related: []
tags: ["syv-character-kit", "github", "private", "high", "summary"]
---

### P2 — Temporal character state and squad tactics without a shared lifecycle model - **Who hurts:** Writers and systems that must track fighters who change over time (promotions, injuries, equipment capture, squad transfers) while also running squad-level combat with derived aggregates (force, cohesion, morale, movement). - **Pain today:** Flat character records cannot express append-only historial[] milestones, ephemeral vs canonized lifecycles, opaque 8-character slugs separate from display names, or volatile combat state (iniciativa) that lives on the squad mirror rather than the character sheet. - **How this repo answers:** Defines six structural blocks plus flat tags[], milestone-driven mutability, deterministic stats-by-rank at creation, seed-reproducible ephemerals, canonization freeze of historia prose, squad entity with embedded members and derived fields, and GDDR-02 initiative grid rules. Provides 22+ immutable mock characters and 2 squad fixtures as living templates. - **Out of scope:** Full battle resolution (GDDR-02 still in active design), hito reversal, arbitrary canon editing outside milestones, generating full squads in one API call.
