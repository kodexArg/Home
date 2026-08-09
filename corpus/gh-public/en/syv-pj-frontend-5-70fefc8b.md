---
id: syv-pj-frontend-5-70fefc8b
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

## 3. Product / idea The mental model is **SSR Astro shell + Svelte 5 interactive islands + backend motor over a proxy/binding** — not a monolithic SPA or a separate BFF service. The UI targets a dark, gold-accented aesthetic aligned with SyV branding: near-black backgrounds (#0d0f12), muted card surfaces, and a primary gold tone (#c4a35a) defined as CSS custom properties and mapped into Tailwind v4 @theme tokens. shadcn-svelte is configured (components.json) with neutral base color and $lib path aliases, ready for additional UI primitives under src/lib/components/ui/ (not yet populated). The application is **Spanish-first**: page title, headings, loading/error copy, and faction descriptions are in Spanish. The backend contract (faction slugs and names) is consumed as returned by the API.
