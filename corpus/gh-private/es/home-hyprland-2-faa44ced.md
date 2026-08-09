---
id: home-hyprland-2-faa44ced
title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — P1 — Reproducible Hyprland session without abandoning GNOME"
visibility: private
importance: normal
source_repo: "home-hyprland"
related: []
tags: ["home-hyprland", "github", "private", "normal", "summary"]
---
### P1 — Reproducible Hyprland session without abandoning GNOME

- **Who hurts:** A single-user workstation that wants Hyprland for experimentation (tiling, custom bar, GPU-heavy local LLM UI) but relies on GNOME for the primary daily workflow.
- **Pain today:** Dotfiles scattered across , ad-hoc copies, no git history, and risk of forcing globally or breaking GDM session selection.
- **How this repo answers:** Bundles , , , , , and with documented sync commands ( , , optional symlink). Hyprland starts only when chosen at GDM; autostart chain is explicit in ( , , , Kitty, anyrun daemon). Agent skill encodes stance: never force desktop env globally, prefer Lua over legacy hyprlang, reload vs full restart rules.
- **Out of scope:** Replacing GNOME, removing GNOME packages, installing unaudited third-party rices, or making Hyprland the only session.
