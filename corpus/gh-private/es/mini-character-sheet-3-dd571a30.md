---
id: mini-character-sheet-3-dd571a30
title: "mini-character-sheet — Warhammer stat overlay on miniature photos — P2 — Reproducible before/after artifact for a fixed layout"
visibility: private
importance: low
source_repo: "mini-character-sheet"
related: []
tags: ["mini-character-sheet", "github", "private", "low", "summary"]
---
### P2 — Reproducible before/after artifact for a fixed layout

- **Who hurts:** Anyone iterating on overlay size, font, or placement who needs a committed reference image pair.
- **Pain today:** Ad-hoc scripts without sample inputs/outputs make it hard to see what changed between runs.
- **How this repo answers:** The tree includes (source portrait, 640×1280 JPEG), (360×760 composite result), and (220×30 RGBA PNG — likely an earlier or alternate table render reference). Running the script reproduces the compositing pipeline deterministically for the hard-coded stat array.
- **Out of scope:** Automated visual regression tests, CI, or versioned layout presets.
