---
id: cowsay-4-7f1b7f31
title: "cowsay — deterministic ASCII cow renderer for AI agents — P3 — Cow switching and persistent preferences without coupling layers"
visibility: public
importance: normal
source_repo: "cowsay"
related: ["cowsay"]
tags: ["cowsay", "github", "public", "normal", "summary"]
---

### P3 — Cow switching and persistent preferences without coupling layers - **Who hurts:** Users who want /cowsay tux, moose art, or custom .cow files; maintainers adding new animals. - **Pain today:** Monolithic cowsay clones mix balloon geometry with cow ASCII; changing art risks breaking wrap or box width calculations. - **How this repo answers:** Strict layer separation: dialog.py knows nothing about .cow paths; art.py knows nothing about balloon glyphs. Cowfiles use $thoughts, $eyes, $tongue placeholders. Active cow resolves via -f → COWSAY_COW → .active-cow → default. --set-cow persists choice; COWPATH adds external directories with symlink-escape guards. - **Out of scope:** A GUI cow picker, cloud-synced preferences, or a cowfile editor — stems come from cowsay -l only.
