---
id: mini-character-sheet-2-c38648bb
title: "mini-character-sheet — Warhammer stat overlay on miniature photos — P1 — Manual stat overlay on miniature photos is slow"
visibility: private
importance: low
source_repo: "mini-character-sheet"
related: []
tags: ["mini-character-sheet", "github", "private", "low", "summary"]
---
### P1 — Manual stat overlay on miniature photos is slow

- **Who hurts:** Wargame players who photograph painted models and want the character's numeric profile visible in the same image when posting to groups, campaign logs, or personal archives.
- **Pain today:** Adding a stat block in GIMP, Photoshop, or Canva for every miniature is repetitive: resize canvas, type headers, align cells, export. Spreadsheets and paper rosters are separate from the visual.
- **How this repo answers:** loads , resizes it to 360×760 pixels, programmatically draws a two-row table (header row + values) on a semi-transparent white RGBA layer (340×50, 50% opacity), centers that layer on the portrait, and writes . Stat abbreviations match classic Warhammer Fantasy profile lines: WS (Weapon Skill), BS (Ballistic Skill), S (Strength), T (Toughness), Ini (Initiative), A (Attacks), D (Damage — here labeled as a single column), I (Intelligence), WP (Wounds Profile or similar house usage), Fel (Fellowship).
- **Out of scope:** Interactive UI, CLI arguments, batch processing multiple minis, reading stats from JSON/CSV, game-system validation, or integration with army-builder tools.
