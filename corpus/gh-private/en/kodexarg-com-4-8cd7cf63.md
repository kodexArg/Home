---
id: kodexarg-com-4-8cd7cf63
title: "kodexarg.com — personal liminal home site — P3 — Design-system sync and RPG doc hosting"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---
### P3 — Design-system sync and RPG doc hosting

- **Who hurts:** An operator running multiple related web properties who must keep branding consistent and publish internal game-design specs alongside the public face.
- **Pain today:** Copy-pasting components between repos causes drift; RPG design docs scattered in notes are hard for agents and collaborators to reference.
- **How this repo answers:** is vendored from the repo (SSOT) with explicit agent instructions to propagate changes bidirectionally. Global CSS tokens in note lineage from the design system. Two scrollable static doc pages under publish SyV character-creation phases (GDDR-01) and API user stories — design specifications for a separate character-kit service, not live API code in this repo.
- **Out of scope:** Implementing the SyV Character Kit API, battle engine, or lore CMS — those are documented consumers/endpoints only.
