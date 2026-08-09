---
id: pz-detective-profession-4-d9d030c9
title: "Detective Profession — Project Zomboid Build 41 character mod — P3 — Missing detective fantasy and diegetic warnings"
visibility: private
importance: normal
source_repo: "pz-detective-profession"
related: []
tags: ["pz-detective-profession", "github", "private", "normal", "summary"]
---

### P3 — Missing detective fantasy and diegetic warnings - **Who hurts:** Role-players and immersion-focused players who want the character to *react* to danger narratively. - **Pain today:** Threat awareness is mostly mechanical (sound, vision cone) without class-flavored feedback. - **How this repo answers:** Phrases.lua dynamically loads 30+ search-mode lines and 30+ zombie-alert lines from translation files (UI_phrase_*, UI_zombie_alert_*). Events.onToggleSearchMode triggers a search phrase when the player enters search mode. English and Argentine Spanish locales are provided; workshop metadata notes AR translation availability. - **Out of scope:** Voice acting, cutscenes, or persistent case files. Phrases are cosmetic RNG, not quest state.
