---
id: kodexarg-com-8-b3f8dc9f
title: "kodexarg.com — personal liminal home site — 4. Technology stack"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node >= 22.12 (toolchain), Bun (package manager/scripts) | package.json engines; ADR 0003 | | Frontend framework | Astro ^6.4.6, file-based .astro pages | package.json, astro.config.mjs | | Interactive islands | Svelte ^5.56.3 via @astrojs/svelte ^8.1.2, runes only | package.json, ADR 0001, docs/svelte.md | | Edge adapter | @astrojs/cloudflare ^13.7.0 | package.json, astro.config.mjs, ADR 0002 | | Data | KV SESSION binding (reserved, not used in current pages) | wrangler.jsonc | | Infra / deploy | Cloudflare Workers Builds on push to main; wrangler 4 | AGENTS.md, wrangler.jsonc, package.json devDependency | | AI / agents | AGENTS.md, CLAUDE.md (symlink), .claude/skills/svelte-core-bestpractices/ | repo root, .claude/ | | Tests / checks | astro check + svelte-check via bun run check | package.json scripts |
