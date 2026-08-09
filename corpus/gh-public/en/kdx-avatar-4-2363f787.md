---
id: kdx-avatar-4-2363f787
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — P3 — Control plane must survive puppet failure"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---
### P3 — Control plane must survive puppet failure

- **Who hurts:** Operators who need to restart SnekStudio, check health, or force privacy blank mode without killing the entire adapter or losing the export device.
- **Pain today:** If the puppet process is the whole product, its death means no status, no restart handle, and manual cleanup of orphaned processes and camera holders.
- **How this repo answers:** **Service-path failover (Layer 2):** the daemon remains running and responsive when SnekStudio dies. returns defined JSON/text without hanging. sends SIGUSR1 to bounce only the puppet while the blank producer holds export. forces privacy frames via SIGUSR2. Auto-restart with exponential backoff (2–30s) attempts to recover the puppet. Explicit releases export, kills children cleanly, and clears PID/status files.
- **Out of scope:** Replacing SnekStudio with an in-process Godot embedding (rejected per architecture until an ADR reopens it).
