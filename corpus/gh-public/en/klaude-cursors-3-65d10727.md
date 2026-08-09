---
id: klaude-cursors-3-65d10727
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — P2 — Cursor theme build complexity vs. install-and-go UX"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---

### P2 — Cursor theme build complexity vs. install-and-go UX - **Who hurts:** End users who only want a working pointer theme without installing clickgen, understanding x.build.toml hotspot tables, or managing X11 symlink alias hashes. - **Pain today:** Bibata's authoritative build uses ctgen against x.build.toml, specifying per-cursor PNG names, hotspot coordinates, size ladders (16–96 px), animation frame globs (wait-*.png, left_ptr_watch-*.png), and dozens of legacy x11_symlinks entries that map hash-named cursors to canonical roles. Reproducing this from scratch requires toolchain fluency most desktop users lack. - **How this repo answers:** Pre-compiled cursors/ artifacts (145 top-level entries, many symlinks) plus index.theme / cursor.theme metadata are ready to copy. install.sh automates placement into ~/.local/share/icons/Klaude/. README documents manual copy steps and GNOME gsettings activation (cursor-theme = Klaude, recommended size 28). Rebuild instructions reference ctgen x.build.toml -p x11 -d bitmaps/Klaude -n Klaude for maintainers only. - **Out of scope:** Package-manager distribution (deb/rpm/flatpak); automatic theme switching on login; HiDPI fractional scaling beyond the included size ladder.
