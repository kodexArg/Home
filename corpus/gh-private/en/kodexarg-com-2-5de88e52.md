---
id: kodexarg-com-2-5de88e52
title: "kodexarg.com — personal liminal home site — P1 — Personal home without SPA bloat"
visibility: private
importance: high
source_repo: "kodexarg.com"
related: []
tags: ["kodexarg.com", "github", "private", "high", "summary"]
---

### P1 — Personal home without SPA bloat - **Who hurts:** A solo operator who wants a distinctive personal presence on the web without shipping a heavy client bundle or maintaining a CMS. - **Pain today:** Typical personal sites either look generic (template blogs) or require large JavaScript frameworks for small interactive touches. Rebuilds also tend to accumulate legacy patterns (Svelte 4, Pages-based deploys) that agents and humans must untangle later. - **How this repo answers:** Astro 6 file-based routing keeps pages as zero-JS .astro by default. Only Aurora.svelte (generative background) and Terminal.svelte (typeable console) hydrate via explicit client:only="svelte" directives. The home is a fixed 100dvh canvas with no scroll — wordmark header, warm aurora atmosphere, bottom-left terminal with a seeded CV link and echo-only typing. ADR 0001 locks Svelte 5 runes and bans Svelte 4 patterns. - **Out of scope:** Blog engine, CMS, authentication, user accounts, server-side business logic, or a general-purpose component library (that lives in the separate design repo).
