---
id: docs-portal-6-ef8f768a
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — 3. Product / idea"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---

## 3. Product / idea The mental model is **three layers**: 1. **Authoring layer** — Obsidian vault directories under vaults/<name>/ with wikilinks, YAML frontmatter, callouts, and attachments. Obsidian workspace metadata lives under .obsidian/ (plugin config tracked; runtime UI state gitignored). 2. **Compile layer** — compile_vault.mjs (root) transforms each .md note into a directory of index.html files preserving slug paths. A shared HTML template injects Tone-derived CSS tokens, mobile hamburger sidebar, broken-link styling, and vault branding. The root package.json depends only on marked. 3. **Publish layer** — Bash scripts source operator credentials from ~/.cloudflare.env (not in repo), invoke wrangler pages deploy, manage DNS CNAMEs via Cloudflare API, and attach Access apps/policies. Portal index follows a parallel path: npm run build inside dev/docs-portal (Astro + pagefind), then deploy.sh. The portal dashboard is customized beyond stock Tone: typography scaled up 10–15% in dev/docs-portal/src/styles/tokens.css, Spanish hero copy, vault card grid with gradient slots, and dynamic note counts. Theme source of truth also exists at themes/tone/ (upstream Tone clone); dev/docs-portal/ is the deployed portal instance.
