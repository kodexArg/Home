---
id: camera-alert-to-telegram-4-6fd0843d
title: "Camera Alert to Telegram — IP camera motion detection with Telegram alerts — P3 — Edge-friendly deployment"
visibility: public
importance: normal
source_repo: "camera-alert-to-telegram"
related: ["camera-alert-to-telegram"]
tags: ["camera-alert-to-telegram", "github", "public", "normal", "summary"]
---

### P3 — Edge-friendly deployment - **Who hurts:** Users deploying on Raspberry Pi or similar SBCs with limited CPU. - **Pain today:** Heavy ML pipelines or high-FPS processing overwhelm small boards. - **How this repo answers:** Configurable fps throttles processing rate; sensitivity and mask tune false positives; slow_motion stretches playback without re-encoding at higher frame rates; old clips are pruned when max_video_files is exceeded. - **Out of scope:** GPU acceleration, distributed processing, or container orchestration manifests (none present in tree).
