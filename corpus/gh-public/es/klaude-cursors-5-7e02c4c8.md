---
id: klaude-cursors-5-7e02c4c8
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — 3. Product / idea"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---

## 3. Product / idea The central idea is a **derivative Bibata color fork packaged as a Freedesktop icon theme**. Intellectual property for shapes, hotspot layout, symlink alias graph, and build metadata traces to Abdulkaiz Khatri's Bibata project; kodexArg's contribution is the coral recolor, rebuilt Xcursor binaries, installer, and maintenance script. The mental model has three layers: 1. **Source bitmaps** (bitmaps/Klaude/) — PNG masters per cursor role, including multi-frame animations for wait (54 frames) and left_ptr_watch (54 frames). 2. **Build contract** (configs/normal/x.build.toml) — Bibata's clickgen configuration defining cursor names, PNG mappings, hotspot overrides, supported X11 sizes, and extensive x11_symlinks for legacy compatibility (e.g., default → left_ptr, hash-named GTK/Qt aliases). 3. **Shipped theme** (cursors/, index.theme, cursor.theme) — installable Klaude theme directory consumable by any Xcursor-aware desktop. index.theme declares Name=Klaude, describes the Bibata lineage and coral accent in the comment field, and sets Inherits=hicolor per Freedesktop icon theme conventions. cursor.theme is a minimal companion declaring Inherits=Klaude for cursor-specific theme resolution paths. Cursor entries are Xcursor 1.0 binaries (verified on left_ptr, wait). Many names are symbolic links to canonical cursors—default symlinks to left_ptr; resize corners map
