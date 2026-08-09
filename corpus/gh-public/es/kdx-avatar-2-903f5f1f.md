---
id: kdx-avatar-2-903f5f1f
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — P1 — Avatar stacks are apps, not adapters"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---

### P1 — Avatar stacks are apps, not adapters - **Who hurts:** Operators who want a persistent avatar camera on a Linux desktop for calls, streaming, and OBS workflows. - **Pain today:** Face-tracked avatar software (SnekStudio, VTuber tools) runs as a GUI app. If it crashes or the window closes, consumers lose the video source. There is no stable contract for start/stop, health, or device naming. Camera capture and export are not owned by a single supervised process. - **How this repo answers:** kdx-avatar wraps SnekStudio as a **child process** supervised by a daemon that owns the export path. A CLI (kdx-avatar start|stop|status|restart-puppet|set-mode) provides the operator contract. The service FSM tracks modes (avatar, blank, starting, stopping, failed, stopped) and publishes atomic status JSON for tooling. - **Out of scope:** Reimplementing the Godot/VRM renderer inside this repo; multi-tenant cloud avatar serving; Snap-style AR filters on the raw face.
