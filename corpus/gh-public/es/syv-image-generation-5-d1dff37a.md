---
id: syv-image-generation-5-d1dff37a
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — 3. Product / idea"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

## 3. Product / idea The mental model is a **closed calibration loop factory**: After cloning, an operator or agent: 1. Starts ComfyUI via the external skill ( , port 8188). 2. Reads a character from sibling and current . 3. Loads a versioned workflow from (UI or API twin). 4. Generates with Z-Image Turbo recipe (8 steps, CFG 1, no negative, / , AuraFlow shift 3). 5. Exports bulk to via , then packages a curated folder in . 6. User ranks; agent promotes combos to whitelist for the next run. The repo is explicitly a **playground** inside the broader SyV ecosystem — inspiration (places, factions, palette) flows from ; subjects flow from ; delivery flows to character tooling and Flutter visualizer downstream.
