---
id: kdx-pi-signage-3-ed4e54d8
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — P2 — Stale playlists when content changes on disk"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---
### P2 — Stale playlists when content changes on disk

- **Who hurts:** Operators who update signage by copying files over SSH, USB, or rsync while the device is running.
- **Pain today:** Static playlists require service restarts; many loopers only scan once at startup and miss new or deleted files until manual intervention.
- **How this repo answers:** uses **watchdog** on the configured video directory (non-recursive). reacts to create/delete/move events, debounces briefly, re-scans, and notifies , which triggers on a background thread. rebuilds the in-memory sorted by filename. Supported extensions: , , , , .
- **Out of scope:** Recursive subdirectory watching, cloud sync clients, versioned asset libraries, metadata-driven scheduling.
