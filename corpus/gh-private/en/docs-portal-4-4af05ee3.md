---
id: docs-portal-4-4af05ee3
title: "docs-portal — secure Obsidian-to-web documentation hub on Cloudflare Pages — P3 — Cloudflare Access only works on proxied zones (DNS gotcha)"
visibility: private
importance: high
source_repo: "docs-portal"
related: []
tags: ["docs-portal", "github", "private", "high", "summary"]
---
### P3 — Cloudflare Access only works on proxied zones (DNS gotcha)

- **Who hurts:** Anyone attempting free Gmail-gated sites on delegated subzones (notably the dev subtree routed to AWS Route 53).
- **Pain today:** A Pages custom domain CNAME in a non-Cloudflare zone can serve TLS and content but **does not enforce Access**—the site stays public. This failure mode was documented after a real incident in .
- **How this repo answers:** and codify the rule: secure documentation lives on the docs subtree or apex zone under Cloudflare proxy, never on the dev subtree unless a dedicated Cloudflare zone is sub-delegated (requires zone-create capability). and only create proxied CNAMEs in the main zone. The playbook in is reusable for future Pages + Access sites.
- **Out of scope:** Enterprise Cloudflare for SaaS custom hostnames; Workers-based hosting (account tokens documented as Pages+Access only, not Workers).
