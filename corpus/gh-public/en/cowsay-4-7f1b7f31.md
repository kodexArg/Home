---
id: cowsay-4-7f1b7f31
title: "cowsay — deterministic ASCII cow renderer for AI agents — P3 — Cow switching and persistent preferences without coupling layers"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---
### P3 — Cow switching and persistent preferences without coupling layers

- **Who hurts:** Users who want , moose art, or custom files; maintainers adding new animals.
- **Pain today:** Monolithic cowsay clones mix balloon geometry with cow ASCII; changing art risks breaking wrap or box width calculations.
- **How this repo answers:** Strict layer separation: knows nothing about paths; knows nothing about balloon glyphs. Cowfiles use , , placeholders. Active cow resolves via → → → . persists choice; adds external directories with symlink-escape guards.
- **Out of scope:** A GUI cow picker, cloud-synced preferences, or a cowfile editor — stems come from only.
