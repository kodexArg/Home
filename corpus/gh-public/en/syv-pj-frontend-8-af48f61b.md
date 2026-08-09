---
id: syv-pj-frontend-8-af48f61b
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — 4. Technology stack"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Bun (package manager + scripts); TypeScript strict | package.json, tsconfig.json | | Frontend framework | Astro 7 SSR + Svelte 5 islands | package.json, astro.config.mjs, svelte.config.js | | Styling | Tailwind CSS v4 via Vite plugin; shadcn-svelte tokens | src/styles/global.css, components.json | | UI primitives | bits-ui, @lucide/svelte, tailwind-variants, mode-watcher | package.json dependencies | | Edge deploy | @astrojs/cloudflare adapter; Wrangler | astro.config.mjs, wrangler.jsonc | | Backend coupling | Service binding BACKEND → syv-pj-api; dev Vite proxy | wrangler.jsonc, astro.config.mjs | | AI / agents | Agent directives only (AGENTS.md, CLAUDE.md symlink) | AGENTS.md | | Tests | None configured | no test runner in package.json |
