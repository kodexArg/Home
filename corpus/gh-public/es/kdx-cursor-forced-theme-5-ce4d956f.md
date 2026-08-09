---
id: kdx-cursor-forced-theme-5-ce4d956f
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — 3. Product / idea"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---
## 3. Product / idea

The central idea is **out-of-band chrome injection**: treat Cursor's shipped Electron shell as a mutable host, not a theming surface. Presentation Orange is expressed as layered CSS that (1) remaps host tokens to ink/cream/orange/teal, (2) paints radial glow curtains on dark (orange-deep) and light (teal) hosts, (3) keeps scrollbars gray while hairlines go orangish, (4) styles icons/avatars/plan chips, and (5) distinguishes composer human messages (soft raised cards, 10px Hypr radius, top scroll padding against clip) from the prompt input (sunken inset well, same radius). The mental model: **edit split CSS → build bundle → patcher writes HTML + checksum → reload window**. Optional markdown preview CSS lives under and is contributed separately via extension —the workbench inject deliberately does not style preview panes. Glass mode requires aggressive overrides on , , , and related variables because Agents Window sets cool grays that would otherwise occlude glow. Classic mode selectors run in parallel so non-Glass layouts still receive orange chrome.
