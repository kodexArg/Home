---
id: truedetective-2-30769cfd
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod — P1 — Missing urban investigator fantasy on B42"
visibility: public
importance: normal
source_repo: "TrueDetective"
related: ["gh-truedetective"]
tags: ["truedetective", "github", "public", "normal", "summary"]
---

### P1 — Missing urban investigator fantasy on B42 - **Who hurts:** Survivors creating characters who want a meticulous city detective — not a soldier, not a forager of berries — with identity expressed through gear, forage affinity, and reconnaissance mechanics. - **Pain today:** Base game professions skew combat, farming, or generic trades. Third-party detective occupations (for example SOTO's simpler detective pack) lack this mod's magnifier-based Survey Sense and the specific junk/trash/ammo forage profile. House rules are fragile in multiplayer. - **How this repo answers:** Registers truedetective:truedetective via CharacterProfession.register plus a character_profession_definition script (Cost = -8, XPBoosts = Aiming=2). Spawns fedora, leather long coat, trousers, loaded revolver, spare .357 rounds, guaranteed magnifying glass, and optional noir extras (pipe, cigarettes, lighter, whiskey at 75% each). Applies forageSystem.addSkillDef with vision bonus 1.75, darkness effect 15, and +10 specialisations on Trash, Junk, JunkWeapons, Ammunition, and Medical categories. - **Out of scope:** New weapons, new zombie types, map edits, plant foraging bonuses, or a full quest narrative line.
