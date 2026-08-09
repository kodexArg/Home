---
id: design-kodexarg-com-8-b5f8aa10
title: "design.kodexarg.com — kodexArg design system SSOT — 4. Technology stack"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
related: []
tags: ["design.kodexarg.com", "github", "private", "high", "summary"]
---

## 4. Technology stack | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Bun (scripts), Node module type | package.json | | Frontend framework | Astro ^6.4.6, fully static (no adapter) | package.json, astro.config.mjs | | Interactive islands | Svelte ^5.56.3 via @astrojs/svelte ^8.1.2, runes ($props, snippets) | package.json, src/components/*.svelte | | Styling | CSS custom properties SSOT + page-scoped Astro styles | src/styles/tokens.css, src/styles/report.css, index.astro <style> | | Infra / deploy | Cloudflare Workers static assets, wrangler 4, custom domain route | wrangler.jsonc, package.json deploy script | | Tooling | Python 3 stdlib + optional bunx @mermaid-js/mermaid-cli for validator | docs/report-lineage/tools/validate_mermaid.py | | Fonts (styleguide) | Oswald, Source Sans 3 via Google Fonts link in index.astro | src/pages/index.astro | | Fonts (report lineage) | Nunito, DM Mono via template <link> tags | docs/report-lineage/templates/*.html | | AI / agents | No .claude/ or .docs/ in repo; consumed by external kdx-reporte-html skill | tree scan (absent) |
