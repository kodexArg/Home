---
id: multimedia-handler-for-rpi-3-9ef2802e
title: "multimedia-handler-for-rpi — Flask web console for Raspberry Pi multimedia signage video fleet — P2 — Still images are not signage-ready video loops"
visibility: private
importance: normal
source_repo: "multimedia-handler-for-rpi"
related: []
tags: ["multimedia-handler-for-rpi", "github", "private", "normal", "summary"]
---

### P2 — Still images are not signage-ready video loops - **Who hurts:** Content authors who supply JPG/PNG posters but whose players only loop MP4 files. - **Pain today:** Manually invoking ffmpeg with correct , duration ( ), and scale ( ) flags for each asset is error-prone and slow at fleet scale. - **How this repo answers:** The WTForms form captures image file, optional output name, duration in seconds (0–180, default 15 in template), orientation preset ( , , , ), and target device folders. shells out a fixed ffmpeg recipe: loop input image, set duration and resolution, H.264 ( ), scale filter, overwrite output. Processed source and output move to a subfolder under the converter staging path. - **Out of scope:** Non-image sources (existing video transcoding pipelines); advanced ffmpeg filters beyond the default scale; batch CLI automation outside the web UI.
