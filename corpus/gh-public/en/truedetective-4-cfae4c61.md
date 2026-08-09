---
id: truedetective-4-cfae4c61
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod — P3 — Undocumented balance and agent chaos in mod repos"
visibility: public
importance: normal
source_repo: "TrueDetective"
related: ["gh-truedetective"]
tags: ["truedetective", "github", "public", "normal", "summary"]
---
### P3 — Undocumented balance and agent chaos in mod repos

- **Who hurts:** Mod authors and AI agents changing Lua without a proving path; contributors who cannot tell whether a number in code is intentional or drift.
- **Pain today:** Game mods often ship logic with no ADR, no use-case traceability, and no install contract — leading to silent balance changes and broken Workshop trees.
- **How this repo answers:** Cloned from : constitution ( ), eleven ADRs ( through ), Gherkin use cases ( ), user stories, requirements table, assertion discipline (optional laws with proving tests), triage-and-fix delivery cast ( ), and skills under . Rule: where code and ADR disagree, **ADR wins**. Survey Sense numbers (300 still ticks, 15-square radius, 5 zombie cap, group minimum 3) are binding in .
- **Out of scope:** Web-stack skills (Astro, Django, AWS) from the harness template — not shipped here. Cloud deploy pipelines — there is no cloud app; deploy is merge, tag, local install, optional owner Workshop upload.
