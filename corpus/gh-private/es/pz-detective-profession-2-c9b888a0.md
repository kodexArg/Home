---
id: pz-detective-profession-2-c9b888a0
title: "Detective Profession — Project Zomboid Build 41 character mod — P1 — No cautious indoor specialist in vanilla professions"
visibility: private
importance: normal
source_repo: "pz-detective-profession"
related: []
tags: ["pz-detective-profession", "github", "private", "normal", "summary"]
---

### P1 — No cautious indoor specialist in vanilla professions - **Who hurts:** Players who prefer slow, room-clearing survival over sprint-looting; anyone repeatedly ambushed by zombies behind interior doors. - **Pain today:** Vanilla occupations reward combat or broad traits but none combine **small-room threat sensing** with **search-mode synergy** and urban foraging without becoming overpowered. - **How this repo answers:** hooks and, on tile changes, probabilistically scans adjacent door edges. When a connected room (≤50 tiles) contains living instances, the player speaks a random alert phrase from . Search mode raises attempt frequency (66% roll vs 10% passive); enforces the small-room ceiling so large buildings never fully light up. - **Out of scope:** Does not add new weapons, quests, NPC detectives, or a full investigation minigame. Does not replace the game's line-of-sight or hearing systems.
