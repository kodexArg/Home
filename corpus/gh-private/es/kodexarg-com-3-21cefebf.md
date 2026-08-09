---
id: kodexarg-com-3-21cefebf
title: "kodexarg.com — personal liminal home site — P2 — Deliberate Cloudflare Workers deploy model"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---

### P2 — Deliberate Cloudflare Workers deploy model - **Who hurts:** Operators deploying static sites to Cloudflare who need a forward-looking platform choice and a CI-owned pipeline. - **Pain today:** Cloudflare Pages is in maintenance mode relative to Workers-first static asset serving. Hand-maintained wrangler main entries drift from what the Astro Cloudflare adapter generates at build time. - **How this repo answers:** ADR 0002 commits to Workers with static assets via @astrojs/cloudflare. Root wrangler.jsonc stays minimal (no main) per ADR 0004; the adapter emits dist/client/wrangler.json and a deploy redirect. Push to main triggers Cloudflare Workers Builds CI, which auto-deploys worker kodexarg-com with custom-domain routes configured in wrangler.jsonc. A SESSION KV namespace binding is provisioned for future session support. - **Out of scope:** Multi-environment staging matrices, D1/R2 data layers, or on-demand SSR (possible later but not current architecture).
