---
id: kdx-avatar-5-c2911a52
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-avatar"
related: ["gh-kdx-avatar"]
tags: ["kdx-avatar", "github", "public", "normal", "summary"]
---

## 3. Product / idea kdx-avatar is a **constellation** repository: two conceptual zones (interfaces/ and services/) map to a single Python package (kdx_avatar) that implements both the operator CLI and the orchestrator daemon. The product does **not** render VRM avatars itself — it **orchestrates** SnekStudio (Godot + VRM + face tracking) and guarantees a stable video edge.
