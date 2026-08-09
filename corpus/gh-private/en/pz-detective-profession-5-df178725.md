---
id: pz-detective-profession-5-df178725
title: "Detective Profession — Project Zomboid Build 41 character mod — 3. Product / idea"
visibility: private
importance: normal
source_repo: "pz-detective-profession"
related: []
tags: ["pz-detective-profession", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The mod is a **single-occupation gameplay patch** for Project Zomboid. At game boot it registers profession via , attaches forage skill metadata, and on game start wires movement and search-mode listeners. The mental model is three coupled loops: 1. **Profession identity** — negative point cost (-6), detective icon textures, and spawn loadout (fedora 75%, long leather jacket, practical pants/shoes). 2. **Forage loop** — vanilla search/forage UI benefits from Detective's row whenever the player forages in urban contexts. 3. **Intuition loop** — each step to a new grid square may trigger door-adjacent room scans; success yields with thematic warnings. Distribution targets Steam Workshop (workshop ID in and ) and manual install under the player's Zomboid mods folder ( ).
