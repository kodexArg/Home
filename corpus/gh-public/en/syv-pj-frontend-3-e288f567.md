---
id: syv-pj-frontend-3-e288f567
title: "SyV Character Creator — Astro + Svelte web UI on Cloudflare — P2 — Backend has no CORS; browser must not call the API cross-origin"
visibility: public
importance: normal
source_repo: "syv-pj-frontend"
related: ["gh-syv-pj-frontend"]
tags: ["syv-pj-frontend", "github", "public", "normal", "summary"]
---

### P2 — Backend has no CORS; browser must not call the API cross-origin - **Who hurts:** Frontend developers who would naively the backend Worker URL from the browser; operators who need dev and prod topologies that both work without CORS headers on the API. - **Pain today:** is designed without CORS. Direct browser calls to the backend origin fail or require unsafe workarounds. Local development typically runs the API on a separate port from the Astro dev server. - **How this repo answers:** Two complementary patterns, both documented in and : - **Development:** Astro Vite dev server proxies to (default loopback port 8010), stripping the prefix so becomes . The browser only ever talks same-origin to the Astro dev server. - **Production:** declares a Cloudflare **service binding** → . The Astro Cloudflare adapter can invoke the backend Worker in-account without cross-origin HTTP from the browser. - **Out of scope:** Adding CORS to the backend; this frontend explicitly forbids cross-origin API calls.
