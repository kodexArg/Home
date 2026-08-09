---
id: home-hyprland-8-2dc77af9
title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session — 4. Technology stack"
visibility: private
importance: normal
source_repo: "home-hyprland"
related: []
tags: ["home-hyprland", "github", "private", "normal", "summary"]
---

## 4. Technology stack Derived from manifests, README, and config files. No lockfile dumps. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Lua (Hyprland 0.55 config), TypeScript/JSX (AGS), Bash, Python 3 | hypr/hyprland.lua, ags/tsconfig.json, bin/*, bin/kdx-share | | Compositor | Hyprland 0.55.4, Lua API (hl.*) | hypr/hyprland.lua, skill/.../references/this-machine.md | | Status bar | AGS 3.1.0, Astal GTK4, gnim, SCSS | ags/package.json, ags/app.ts, ags/style.scss | | Terminal | Kitty (CaskaydiaCove Nerd Font, custom tab bar Python) | kitty/kitty.conf, kitty/tab_bar.py, kitty/grok.conf | | Wallpaper | hyprpaper | hypr/hyprpaper.conf | | Idle / power | hypridle (minimal — no DPMS rules) | hypr/hypridle.conf | | Audio | PipeWire / WirePlumber via AstalWp | ags/widget/Bar.tsx | | GPU | NVIDIA + amdgpu dual-GPU env tuning | hypr/hyprland.lua | | Process supervision | systemd user unit for AGS | systemd/user/ags-hyprland.service | | Capture / record | grim, slurp, wf-recorder, wl-mirror (kdx-share) | bin/hypr-screenshot, bin/hypr-record, bin/kdx-share | | Launchers | hyprlauncher, anyrun | hypr/hyprland.lua | | AI / agents | kdx-hypr-control skill + references | skill/kdx-hypr-control/SKILL.md | | Tests | None in repo | tree scan |
