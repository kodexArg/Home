---
id: truedetective-3-d1123a67
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod — P2 — B41-to-B42 profession API and mechanic migration"
visibility: public
importance: normal
source_repo: "TrueDetective"
related: ["gh-truedetective"]
tags: ["truedetective", "github", "public", "normal", "summary"]
---
### P2 — B41-to-B42 profession API and mechanic migration

- **Who hurts:** Owners and contributors porting the original Build 41 Detective Profession (Workshop item ) to Build 42.20's registry model; players who subscribed to the old build and need a coherent B42 line on the same Workshop page.
- **Pain today:** B41 used — forbidden on B42.20. Door Sense and Lead Sense (door/window open interruption with spoken danger phrases) were tied to B41 hooks and small-room heuristics; they were retired from on owner decision 2026-08-08 and archived on the branch. B42 mod layout requires plus a version folder ( for 42.20 stable), not a flat tree alone.
- **How this repo answers:** Live product lives under with as the primary load root. rsyncs a real directory to (symlinks rejected). Survey Sense ( ) replaces door/window senses as the sole special ability. Version tags follow ; in matches ( at time of summary). B42 line updates the original Workshop item in place per owner policy.
- **Out of scope:** Maintaining as install target; reintroducing door/window interruption on ; supporting or betas as default product branches.
