---
id: kdx-cursor-forced-theme-8-8f194b71
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor — 4. Technology stack"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
related: ["gh-kdx-cursor-forced-theme"]
tags: ["kdx-cursor-forced-theme", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node.js ≥ 18; CSS3 with VS Code/Cursor DOM selectors | package.json engines; css/*.css | | Frontend | N/A (not a web app)—injected CSS targets Electron workbench DOM | css/forced-theme.css | | Backend / API | N/A | — | | Data | N/A (stateless patch; no database) | — | | Infra / deploy | Local .deb Cursor under /usr/share/cursor/; optional sudo -n for system paths | scripts/patcher.js WORKBENCH_CANDIDATES; docs/PATHS.md | | AI / agents | Styles Cursor Agents / Glass composer UI only | css/prompt-input.css, css/backgrounds.css Glass selectors | | Tests | Manual verify-live byte diff; no automated test runner | scripts/verify-live.js; package.json scripts |
