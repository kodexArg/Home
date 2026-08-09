---
id: kdx-cursor-forced-theme-3-825e7246
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P2 — Integrity checksum after HTML mutation"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---
### P2 — Integrity checksum after HTML mutation

- **Who hurts:** Anyone who hand-edits Cursor app files and immediately sees "installation corrupt" toasts because stores a base64 SHA-256 of bytes under key .
- **Pain today:** Manual HTML patches break the signed integrity contract; users must discover the checksum key, recompute digest, and rewrite —error-prone and undocumented in upstream Cursor docs.
- **How this repo answers:** recomputes after every enable/disable/write, updates via direct write or passwordless , and exposes a standalone subcommand for hand-edited HTML recovery.
- **Out of scope:** Code signing, notarization, or official Cursor support for customized installs; the patch is the same unsupported tradeoff class as any workbench CSS inject.
