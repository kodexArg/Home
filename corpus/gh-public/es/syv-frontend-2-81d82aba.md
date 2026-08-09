---
id: syv-frontend-2-81d82aba
title: "SyV frontend — Astro static site for the Subordinación y Valor universe — P1 — No dedicated public surface for the SyV universe"
visibility: public
importance: normal
source_repo: "syv-frontend"
related: ["gh-syv-frontend"]
tags: ["syv-frontend", "github", "public", "normal", "summary"]
---
### P1 — No dedicated public surface for the SyV universe

- **Who hurts:** Operators of the SyV project who maintain lore in but need a **web identity** distinct from the kodexArg Home apex site; visitors who should discover SyV as its own branded universe rather than a subsection of a personal homepage.
- **Pain today:** A markdown corpus alone is not a public entry point. Without a small frontend, canon work stays invisible to anyone who does not clone repositories or read raw files. A full wiki (Obsidian Publish, MkDocs, etc.) adds moving parts SyV does not yet need.
- **How this repo answers:** Provides a minimal three-page static site: a hero landing ( ) with lowercase typographic branding and a single nav link to the canon report; a themed 404 ( ) wired through Cloudflare ; and a long-form report page at ( ) that presents agent-team canon corrections in card-based sections with status chips and a client-rendered Mermaid flowchart.
- **Out of scope:** Full corpus browsing, search, wikilink resolution, interactive maps, game client, user accounts, or RAG/chat (those live elsewhere in kodexArg, e.g. Home's KodexBar for cross-org questions).
