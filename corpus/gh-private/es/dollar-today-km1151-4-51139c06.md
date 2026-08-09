---
id: dollar-today-km1151-4-51139c06
title: "dollar-today-km1151 — Marquee currency-rate display (Python image overlay) — 3. Product / idea"
visibility: private
importance: low
source_repo: "dollar-today-km1151"
related: []
tags: ["dollar-today-km1151", "github", "private", "low", "summary"]
---
## 3. Product / idea

The central idea is **image-first marquee publishing**: one canonical background artwork, daily numbers injected programmatically, output as PNG for downstream use (digital signage, print, or a simple local fullscreen preview). The mental model is not a web app or API service but a **two-script workstation**: 1. **Compositor ( )** — interactive CLI: enter today's number, get a centered overlay on the background, save static asset. 2. **Display prototype ( )** — OpenCV window for fullscreen background preview; JSON reader for structured multi-rate data (official dollar, blue dollar, Chilean peso, euro in the sample file). Pieces relate as: → (planned) display pipeline; → shared visual template; → ad-hoc single-value export path. A committed in the repo illustrates a generated result. The GitHub description labels the effort **"Marquesina - onwork project"**, consistent with an early prototype rather than a finished product.
