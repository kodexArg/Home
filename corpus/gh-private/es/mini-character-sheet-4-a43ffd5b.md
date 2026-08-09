---
id: mini-character-sheet-4-a43ffd5b
title: "mini-character-sheet — Warhammer stat overlay on miniature photos — 3. Product / idea"
visibility: private
importance: low
source_repo: "mini-character-sheet"
related: []
tags: ["mini-character-sheet", "github", "private", "low", "summary"]
---

## 3. Product / idea The central idea is **"stats on picture"** (per GitHub repo description): treat a miniature photo as a canvas, generate a small tabular stat strip in code, and alpha-composite it centered on the image. The mental model is a one-shot batch script, not a framework. Pipeline in : 1. **Load and normalize input** — open with Pillow; resize to 360×760 (portrait aspect suited to phone-style mini photos). 2. **Build overlay** — create RGBA image 340×50 with white at 128 alpha; use to grid cells and center text per cell. 3. **Font** — ; expects Times New Roman (or equivalent) installed on the host OS, not vendored in the repo. 4. **Composite** — compute centered on the resized base image; with the overlay as mask. 5. **Export** — save . Hard-coded : | WS | BS | S | T | Ini | A | D | I | WP | Fel | |----|----|---|----|-----|---|---|---|----|-----| | 51 | 42 | 32 | 41 | 24 | 23 | 45 | 24 | 15 | 24 | These are sample values for demonstration; there is no external data source.
