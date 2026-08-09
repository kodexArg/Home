---
id: kdx-avatar-3-eed8a451
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — P2 — Puppet death kills the video edge"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---

### P2 — Puppet death kills the video edge - **Who hurts:** Video consumers (browsers, Discord, Meet, OBS) and the operator who must re-select a camera or reboot when SnekStudio exits. - **Pain today:** When tracking/render fails, the virtual camera may stop producing valid frames or disappear entirely. Consumers hang waiting for frames that never arrive. - **How this repo answers:** **Frame-path failover (Layer 1):** an ffmpeg-based continuously emits valid black frames (yuyv422) to the export v4l2 device ( on the reference host) whenever the puppet is unhealthy or is set. The device stays alive; consumers always receive decodable video. v0 export kind is — the blank generator holds the vcam; avatar pixels into the vcam via window capture is the next slice. - **Out of scope:** OBS-only failover without a device-level story; "black hole" export with no frames; machine reboot as recovery.
