---
id: kdx-cursor-forced-theme-4-31bdf698
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P3 — Upgrade drift and lost baselines"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

### P3 — Upgrade drift and lost baselines - **Who hurts:** Operators who apt upgrade cursor or release-hop and lose injected CSS with no diff against the last known-good look. - **Pain today:** Package updates replace workbench.html; there is no built-in Cursor mechanism to reapply kodexArg chrome; visual regressions (clipped message bubble corners, auxiliary bar opacity) go unnoticed until manual inspection. - **How this repo answers:** npm run enable rebuilds and re-injects in one step; npm run verify-live byte-compares live inject vs. committed css/forced-theme.css (exit 1 on drift); snapshots/baseline-2026-08-08-cursor-3.14.7.css freezes exact inject bytes for Cursor 3.14.7-1785396290; docs/BASELINE.md documents restore steps and companion theme extension. README recommends sudo apt-mark hold cursor to defer silent wipes. - **Out of scope:** Automated CI against live installs; cross-platform macOS/Windows Cursor paths (candidates are Linux .deb layout only).
