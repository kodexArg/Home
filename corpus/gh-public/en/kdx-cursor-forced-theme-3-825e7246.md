---
id: kdx-cursor-forced-theme-3-825e7246
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — P2 — Integrity checksum after HTML mutation"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

### P2 — Integrity checksum after HTML mutation - **Who hurts:** Anyone who hand-edits Cursor app files and immediately sees "installation corrupt" toasts because product.json stores a base64 SHA-256 of workbench.html bytes under key vs/code/electron-sandbox/workbench/workbench.html. - **Pain today:** Manual HTML patches break the signed integrity contract; users must discover the checksum key, recompute digest, and rewrite product.json—error-prone and undocumented in upstream Cursor docs. - **How this repo answers:** scripts/patcher.js recomputes base64(sha256(file_bytes)).rstrip('=') after every enable/disable/write, updates product.json via direct write or passwordless sudo -n cp, and exposes a standalone checksum subcommand for hand-edited HTML recovery. - **Out of scope:** Code signing, notarization, or official Cursor support for customized installs; the patch is the same unsupported tradeoff class as any workbench CSS inject.
