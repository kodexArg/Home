---
id: docs-portal-3-53b48964
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P2 — Many doc sites, one front door and one auth policy"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---

### P2 — Many doc sites, one front door and one auth policy - **Who hurts:** The operator managing Coveris, ALVS, SyV character-kit, and future internal docs who does not want to configure Cloudflare Access separately for every new site. - **Pain today:** Each static site on Pages is public by default. Gating requires per-project Access apps, DNS records, and policy maintenance. Without a catalog, readers forget which subdomain hosts which body of knowledge. - **How this repo answers:** is an Astro 6 site using the **Tone** theme. At build time scans , counts markdown notes recursively, and renders a dashboard of vault cards linking to each vault's docs subdomain. builds the portal, deploys to Pages project , wires the primary docs hostname, and creates a wildcard Access application covering the portal and subdomains under the same Google IdP. compiles one vault and deploys to with hostname . - **Out of scope:** Multi-tenant auth beyond the email allowlist in deploy scripts; CMS or dynamic vault registration without redeploying the portal.
