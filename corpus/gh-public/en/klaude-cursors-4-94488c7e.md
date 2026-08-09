---
id: klaude-cursors-4-94488c7e
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — P3 — Visual cohesion for Claude-inspired desktop stacks"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---
### P3 — Visual cohesion for Claude-inspired desktop stacks

- **Who hurts:** kodexArg operators running coral-accented tooling (Agents UI theming, Presentation Orange chrome, Hyprland/AGS shells) whose default Adwaita or vendor cursors clash with the warm palette.
- **Pain today:** Application-level theming (CSS injects, color themes) does not change the OS pointer; users stare at a cool-gray or high-contrast default arrow while the rest of the stack reads warm coral.
- **How this repo answers:** Klaude applies the same #D97757 accent across default pointer, hand, text, resize, DnD, zoom, and animated wait states—everyday desktop affordances pick up the brand tone at the compositor level, complementing sibling repos that style IDE chrome rather than OS cursors.
- **Out of scope:** Cursor application window theming; terminal font/color schemes; wallpaper or GTK theme packs.
