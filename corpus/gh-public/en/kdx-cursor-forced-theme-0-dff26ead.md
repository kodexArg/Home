---
id: kdx-cursor-forced-theme-0-dff26ead
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — kdx-cursor-forced-theme"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---
## kdx-cursor-forced-theme

> **Problem thesis (required):** Cursor and VS Code color themes operate within the theming API—they cannot reach into Glass-mode Agents UI, paint radial orange/teal glows on sidebars, override / host tokens, or shape the composer prompt as a sunken Hyprland-aligned well. This repository solves that gap by injecting a bundled CSS block directly into Cursor's installed , automatically refreshing the app's integrity checksum so the patch survives startup validation, and providing enable/disable/verify tooling so operators can restore Presentation Orange chrome after upgrades.
