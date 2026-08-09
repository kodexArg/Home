---
id: klaude-cursors-3-65d10727
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — P2 — Cursor theme build complexity vs. install-and-go UX"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---
### P2 — Cursor theme build complexity vs. install-and-go UX

- **Who hurts:** End users who only want a working pointer theme without installing clickgen, understanding x.build.toml hotspot tables, or managing X11 symlink alias hashes.
- **Pain today:** Bibata's authoritative build uses against , specifying per-cursor PNG names, hotspot coordinates, size ladders (16–96 px), animation frame globs ( , ), and dozens of legacy entries that map hash-named cursors to canonical roles. Reproducing this from scratch requires toolchain fluency most desktop users lack.
- **How this repo answers:** Pre-compiled artifacts (145 top-level entries, many symlinks) plus / metadata are ready to copy. automates placement into . README documents manual copy steps and GNOME activation ( = Klaude, recommended size 28). Rebuild instructions reference for maintainers only.
- **Out of scope:** Package-manager distribution (deb/rpm/flatpak); automatic theme switching on login; HiDPI fractional scaling beyond the included size ladder.
