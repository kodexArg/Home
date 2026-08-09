---
id: docs-portal-2-ff7d88b4
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P1 — Obsidian notes need web publishing without contaminating the vault"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---

### P1 — Obsidian notes need web publishing without contaminating the vault - **Who hurts:** A solo operator maintaining technical documentation in Obsidian who wants browser access from any device without running Obsidian Sync or exposing raw folders. - **Pain today:** Typical SSG workflows require markdown inside the framework repo, mixed with components and config. That breaks the Obsidian mental model: wikilinks, callouts, and attachments expect a pure note tree. Copying notes into an Astro project duplicates content and drifts from the canonical vault. - **How this repo answers:** vaults/ holds **only** markdown and attachments—no JS, no Astro, no HTML. compile_vault.mjs reads a vault by name, resolves wikilinks to shortest-path URLs, renders Obsidian callouts and ![[image]] embeds, wraps output in a Tone-styled layout with responsive sidebar navigation, and writes static HTML under dist-<vault-name>/. Vault folders remain openable directly in Obsidian. - **Out of scope:** Real-time collaboration, bidirectional sync, search indexing inside compiled vaults (portal index has pagefind; per-vault search is sidebar navigation only), and WYSIWYG editing in the browser.
