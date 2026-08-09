---
id: kdx-pi-signage-2-5-b0a77b6f
title: "KDX Pi Signage 2 — headless Raspberry Pi digital signage from Google Drive — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-pi-signage-2"
related: ["kdx-pi-signage-2"]
tags: ["kdx-pi-signage-2", "github", "public", "normal", "summary"]
---
## 3. Product / idea

KDX Pi Signage 2 is a long-running Python process structured as a simplified hexagonal (ports-and-adapters) application. The **domain** ( ) models entities (id, name, path, size, modified time, checksum, optional ) and a with sequential or shuffle . The **application layer** ( ) exposes , which owns cache directory initialization, playlist loading, a periodic sync loop, and a playback loop that delegates to the port. The **infrastructure layer** ( ) supplies and concrete adapters behind interfaces in . At runtime the mental model is: **one folder in the cloud is the source of truth → a local mirror plus sidecar JSON → VLC renders fullscreen on the attached display → logs under record every sync and play event.** The entrypoint performs dependency injection: read env config, choose Drive vs local repository, construct , start threads, and block the main thread ( on Unix, sleep loop on Windows). Documentation in (Spanish prose) expands the intended production behavior: checksum-based delta sync, thread-safe queues, exponential backoff, and a future humble HTTP API for -driven operator commands — explicitly marked as not yet implemented.
