---
id: multimedia-handler-for-rpi-2-a091e674
title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — P1 — Fleet video staging without per-device SSH"
visibility: private
importance: normal
source_repo: "multimedia-handler-for-rpi"
related: []
tags: ["multimedia-handler-for-rpi", "github", "private", "normal", "summary"]
---

### P1 — Fleet video staging without per-device SSH - **Who hurts:** Operators managing multiple Raspberry Pi multimedia players, each with its own local SSD and folder naming convention. - **Pain today:** Without a central staging tool, distributing or rearranging clips means logging into individual devices or manually copying files into opaque folder trees; mistakes in naming or resolution break playback on signage players. - **How this repo answers:** The app treats static/videos/<device_folder>/ as the canonical staging area — one subdirectory per logical player. The **Converter** flow uploads an image, runs ffmpeg to produce an MP4 at a chosen resolution and duration, then shutil.copy distributes the output into every device folder selected via checkboxes. The **Videos** page scans those folders and renders a card grid per device so operators can see what is staged before players sync. - **Out of scope:** Real-time push to devices; player-side sync implementation; authentication or multi-user audit trails; cloud hosting.
