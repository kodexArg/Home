---
id: kdx-cursor-forced-theme-6-99a1e8ac
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — 3.1 North-star use cases"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

### 3.1 North-star use cases 1. **First-time enable:** Clone repo, run npm run enable, reload Cursor—Presentation Orange glow, icons, hairlines, and sunken prompt appear in Agents and classic workbench chrome. 2. **Design iteration:** Edit css/tokens.css (palette, --chrome-radius) or domain files (backgrounds.css, prompt-input.css), npm run build, npm run enable, reload; --chrome-radius: 10px stays aligned with Hyprland decoration.rounding. 3. **Post-upgrade restore:** After Cursor package update wipes patch, cd to repo, npm run enable, reload, npm run verify-live must print OK; optionally restore from snapshots/ baseline if repo bundle was intentionally frozen. 4. **Clean uninstall:** npm run disable strips inject markers and style block, rewrites checksum, leaves one-time workbench.html.kdxbak backup if sudo path was used.
