---
id: kdx-cursor-forced-theme-4-31bdf698
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P3 — Upgrade drift and lost baselines"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---
### P3 — Upgrade drift and lost baselines

- **Who hurts:** Operators who or release-hop and lose injected CSS with no diff against the last known-good look.
- **Pain today:** Package updates replace ; there is no built-in Cursor mechanism to reapply kodexArg chrome; visual regressions (clipped message bubble corners, auxiliary bar opacity) go unnoticed until manual inspection.
- **How this repo answers:** rebuilds and re-injects in one step; byte-compares live inject vs. committed (exit 1 on drift); freezes exact inject bytes for Cursor ; documents restore steps and companion theme extension. README recommends to defer silent wipes.
- **Out of scope:** Automated CI against live installs; cross-platform macOS/Windows Cursor paths (candidates are Linux layout only).
