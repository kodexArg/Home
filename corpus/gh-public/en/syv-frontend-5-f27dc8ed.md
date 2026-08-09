---
id: syv-frontend-5-f27dc8ed
title: "SyV frontend — Astro static site for the Subordinación y Valor universe — 3. Product / idea"
visibility: public
importance: normal
source_repo: "syv-frontend"
related: ["gh-syv-frontend"]
tags: ["syv-frontend", "github", "public", "normal", "summary"]
---
## 3. Product / idea

SyV frontend is a **static Astro 6 site** with a shared layout, global Presentation Orange CSS ( ), and page-level scoped styles. The mental model is **build-time HTML + edge asset delivery** — no server routes, no islands framework beyond inline client scripts. The site speaks Spanish in user-facing copy (titles, 404 text, canon report prose). Typography uses Nunito (sans) and DM Mono (kickers, chips, nav links) loaded from Google Fonts. The visual language — dark ink backgrounds ( through ), cream text, orange accent ( ), sage/teal semantic chips — matches the broader kodexArg Presentation Orange / SyV aesthetic used on Home. The git submodule ( ) points at and is checked out recursively in the (disabled) deploy workflow, signaling intent to co-locate or eventually build from the corpus. In a shallow clone without submodule init, is an empty directory — the live site content today is entirely in .
