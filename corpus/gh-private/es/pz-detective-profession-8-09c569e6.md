---
id: pz-detective-profession-8-09c569e6
title: "Detective Profession — Project Zomboid Build 41 character mod — 4. Technology stack"
visibility: private
importance: normal
source_repo: "pz-detective-profession"
related: []
tags: ["pz-detective-profession", "github", "private", "normal", "summary"]
---

## 4. Technology stack No Node, Python, or container manifests. The entire product is **Lua scripts** loaded by the Project Zomboid client mod loader plus binary assets (PNG icons/textures) and Steam Workshop descriptor text. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Lua on Project Zomboid JVM/Lua bridge | Contents/mods/DetectiveProfession/media/lua/shared/*.lua | | Game platform | Project Zomboid Build 41 | workshop.txt tags Build 41; GitHub description "B41 snapshot" | | Mod packaging | Standard PZ Contents/mods/<ModId>/ layout | Contents/mods/DetectiveProfession/mod.info | | Distribution | Steam Workshop + manual mod folder | workshop.txt, mod.info (workshopID) | | Frontend | N/A (in-game UI strings only) | media/lua/shared/Translate/*/*.txt | | Backend / API | N/A | — | | Data | In-memory player:getModData() flags (isSearchMode, lastSquare) | SearchActions.lua | | Infra / deploy | Player-local install; Workshop upload artifact | README.md installation section | | AI / agents | None in-repo | .claude/ absent | | Tests | None evident | no test harness files |
