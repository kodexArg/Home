---
id: syv-frontend-8-65c4d8ca
title: "SyV frontend — Astro static site for the Subordinación y Valor universe — 4. Technology stack"
visibility: public
importance: normal
source_repo: "syv-frontend"
related: ["gh-syv-frontend"]
tags: ["syv-frontend", "github", "public", "normal", "summary"]
---

## 4. Technology stack Derived from manifests and source structure only; lockfile not quoted. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Node ≥ 22.12.0 (engines); Bun for install/scripts | package.json | | Frontend | Astro 6, static output | package.json, astro.config.mjs | | Edge adapter | @astrojs/cloudflare | package.json, astro.config.mjs | | Deploy CLI | Wrangler 4 | package.json, wrangler.jsonc | | Styling | Vanilla CSS custom properties, scoped page <style> blocks | src/styles/global.css, page .astro files | | Diagrams | Mermaid 11 ESM import in client <script type="module"> | src/pages/syv/index.astro | | Data | None (static) | — | | Infra / deploy | Cloudflare Workers + assets + custom domain route; KV SESSION | wrangler.jsonc | | CI | GitHub Actions (disabled) | .github/workflows/deploy.yml.disabled | | Corpus (external) | syv-docs git submodule | .gitmodules | | Tests | None evident | — |
