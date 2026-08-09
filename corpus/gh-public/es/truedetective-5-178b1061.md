---
id: truedetective-5-178b1061
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod — 3. Product / idea"
visibility: public
importance: normal
source_repo: "TrueDetective"
related: ["gh-truedetective"]
tags: ["truedetective", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The central idea is **one profession, one ability, one tree**. After enabling the mod and picking **Detective** at character creation, the player receives urban forage advantages and noir loadout, then uses the magnifying glass as a deliberate reconnaissance tool: equip it in the primary hand, stand still on the same square for roughly five real seconds, and receive silent halo-note whispers naming up to five closest living unmarked zombies within fifteen squares — grouped by named room indoors or eight-way compass direction outdoors. Each zombie is marked once ( in modData) and never reported again. Movement or losing the glass resets the stillness counter. The mechanic is fully deterministic — no random rolls in scan, grouping, or wording. The mod does not run a separate server process or HTTP layer. All behavior executes inside the Project Zomboid client via Lua event hooks ( for Survey Sense, for forage registration, for starting gear). Shared Lua holds forage and clothing definitions; client Lua holds Survey Sense and gear grant logic. English UI strings live in (B42 JSON format — the older table format is ignored by the engine). Naming law from : **True Detective** is the mod name; the playable profession display name is **Detective** ( ). Resource id is ; returns .
