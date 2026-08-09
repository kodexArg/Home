---
id: klaude-cursors-5-7e02c4c8
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — 3. Product / idea"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---

## 3. Product / idea The central idea is a **derivative Bibata color fork packaged as a Freedesktop icon theme**. Intellectual property for shapes, hotspot layout, symlink alias graph, and build metadata traces to Abdulkaiz Khatri's Bibata project; kodexArg's contribution is the coral recolor, rebuilt Xcursor binaries, installer, and maintenance script. The mental model has three layers: 1. **Source bitmaps** ( ) — PNG masters per cursor role, including multi-frame animations for (54 frames) and (54 frames). 2. **Build contract** ( ) — Bibata's clickgen configuration defining cursor names, PNG mappings, hotspot overrides, supported X11 sizes, and extensive for legacy compatibility (e.g., → , hash-named GTK/Qt aliases). 3. **Shipped theme** ( , , ) — installable Klaude theme directory consumable by any Xcursor-aware desktop. declares , describes the Bibata lineage and coral accent in the comment field, and sets per Freedesktop icon theme conventions. is a minimal companion declaring for cursor-specific theme resolution paths. Cursor entries are Xcursor 1.0 binaries (verified on , ). Many names are symbolic links to canonical cursors— symlinks to ; resize corners map to , , etc.; DnD states alias , , and hash identifiers. This symlink graph is inherited wholesale from Bibata's compatibility strategy so GTK, Qt, Electron, and legacy X apps resolve familiar cursor names.
