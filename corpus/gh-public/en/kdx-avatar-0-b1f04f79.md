---
id: kdx-avatar-0-b1f04f79
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — kdx-avatar"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---

# kdx-avatar > **Problem thesis (required):** kdx-avatar is a host-local **interface adapter** that turns a real webcam feed into a live digital avatar stream (VRM puppet via SnekStudio) and exposes it as a stable video interface for consumers (virtual camera, OBS). The core pain is that existing avatar apps are not **service-shaped**: they do not guarantee continuous valid video on failure, do not keep a control plane alive when the puppet dies, and do not coordinate device policy with sibling tools on the same machine. This repo solves that with a two-layer failover model — blank frames on the export path, full service operability on the control path — while treating SnekStudio as a collaboration partner rather than a fork target.
