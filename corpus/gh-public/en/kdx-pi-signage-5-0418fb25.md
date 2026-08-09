---
id: kdx-pi-signage-5-0418fb25
title: "kdx-pi-signage — autonomous Raspberry Pi 3 A+ digital-signage video looper — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-pi-signage"
related: ["kdx-pi-signage"]
tags: ["kdx-pi-signage", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The mental model is a **single-process kiosk controller** on bare Raspberry Pi OS Lite: no web server, no database, no window manager. Content lives as files on local disk; the app is the only "business logic." (Facade) wires four collaborators at init: 1. **VideoScanner** (Observer) — validates and watches . 2. **PlaylistManager** (Strategy) — loads records, advances sequentially (shuffle available but not default). 3. **VideoPlayer** (Adapter) — wraps VLC instance with Pi-tuned args from . 4. **Logger** (Singleton) — centralized loguru setup. The main thread runs : if playlist empty, wait and retry; else play current video, block until VLC reports stopped, advance via , loop forever when (default true). Signal handlers ( , ) call for clean VLC release. Design patterns are explicit in code and docs (Facade, Adapter, Strategy, Observer, Singleton) — the architecture doc in mirrors the implementation.
