---
id: truedetective-3-d1123a67
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod — P2 — B41-to-B42 profession API and mechanic migration"
visibility: public
importance: normal
source_repo: "TrueDetective"
related: ["gh-truedetective"]
tags: ["truedetective", "github", "public", "normal", "summary"]
---

### P2 — B41-to-B42 profession API and mechanic migration - **Who hurts:** Owners and contributors porting the original Build 41 Detective Profession (Workshop item 3383387174) to Build 42.20's registry model; players who subscribed to the old build and need a coherent B42 line on the same Workshop page. - **Pain today:** B41 used ProfessionFactory — forbidden on B42.20. Door Sense and Lead Sense (door/window open interruption with spoken danger phrases) were tied to B41 hooks and small-room heuristics; they were retired from main on owner decision 2026-08-08 and archived on the legacy branch. B42 mod layout requires common/ plus a version folder (42.0/ for 42.20 stable), not a flat media/ tree alone. - **How this repo answers:** Live product lives under Contents/mods/TrueDetective/ with 42.0/ as the primary load root. scripts/install-local.sh rsyncs a real directory to ~/Zomboid/mods/TrueDetective (symlinks rejected). Survey Sense (adr-10-survey-sense) replaces door/window senses as the sole special ability. Version tags follow v42.20-N.M; modversion in mod.info matches (42.20-0.3 at time of summary). B42 line updates the original Workshop item in place per owner policy. - **Out of scope:** Maintaining legacy/ as install target; reintroducing door/window interruption on main; supporting legacy41 or 42.19 betas as default product branches.
