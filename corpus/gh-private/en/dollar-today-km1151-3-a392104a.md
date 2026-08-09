---
id: dollar-today-km1151-3-a392104a
title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — P2 — Fullscreen preview on a display PC"
visibility: private
importance: low
source_repo: "dollar-today-km1151"
related: []
tags: ["dollar-today-km1151", "github", "private", "low", "summary"]
---

### P2 — Fullscreen preview on a display PC - **Who hurts:** Whoever mounts a monitor or TV as the marquee and needs to verify background scaling before going live. - **Pain today:** Without a dedicated player, operators resize windows manually or rely on slideshow software unrelated to the price data. - **How this repo answers:** bg.py sketches an OpenCV fullscreen window (1280×720, WND_PROP_FULLSCREEN) that loads and displays background/background.jpg. The read_json_file helper prepares pricing records for future overlay logic. - **Out of scope:** Completed integration between JSON prices and on-screen text (current create_background body does not draw prices yet; the function definition appears incomplete in the tree).
