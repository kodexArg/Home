---
id: klaude-cursors-7-d6188cd8
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "klaude-cursors"
related: ["klaude-cursors"]
tags: ["klaude-cursors", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Quick install (GNOME):** Clone repo, run install.sh or manual cp of cursors/, index.theme, and cursor.theme into ~/.local/share/icons/Klaude/, set org.gnome.desktop.interface cursor-theme to Klaude and cursor-size to 28, log out/in on Wayland for full reload. 2. **KDE / other desktops:** Copy the Klaude folder to ~/.local/share/icons/ or ~/.icons/; select Klaude in system settings cursor theme picker. 3. **Maintainer rebuild:** Adjust coral threshold or target RGB in recolor.py, regenerate bitmaps from Bibata Ice masters (author-local paths in script), run ctgen against configs/normal/x.build.toml with -d bitmaps/Klaude, replace cursors/ output, commit. 4. **Stack cohesion:** Pair with kdx-cursor-forced-theme so IDE chrome and OS pointer both express Presentation Orange / Claude coral tones.
