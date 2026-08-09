---
id: syv-image-generation-6-639bfdd8
title: "SyV Image Generation — ComfyUI portrait factory for Subordinación y Valor — 3. Product / idea"
visibility: public
importance: high
source_repo: "syv-image-generation"
related: ["gh-syv-image-generation"]
tags: ["syv-image-generation", "github", "public", "high", "summary"]
---

## 3. Product / idea The mental model is a **closed calibration loop factory**: After cloning, an operator or agent: 1. Starts ComfyUI via the external comfyui skill (comfyctl start, port 8188). 2. Reads a character from sibling syv-pj and current prompts/whitelist.md. 3. Loads a versioned workflow from workflows/ (UI .json or API _api.json twin). 4. Generates with Z-Image Turbo recipe (8 steps, CFG 1, no negative, res_multistep/simple, AuraFlow shift 3). 5. Exports bulk to images/raw/ via scripts/export.py, then packages a curated folder in prompts/inbox/. 6. User ranks; agent promotes combos to whitelist for the next run. The repo is explicitly a **playground** inside the broader SyV ecosystem — inspiration (places, factions, palette) flows from syv-docs; subjects flow from syv-pj; delivery flows to character tooling and Flutter visualizer downstream.
