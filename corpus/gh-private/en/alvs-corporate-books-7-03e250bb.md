---
id: alvs-corporate-books-7-03e250bb
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — 3.2 Non-goals"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

### 3.2 Non-goals - No staging environment tier in the AWS account (dev and prod only). - No NAT gateways by design (cost trade-off; tasks use public IPs with security-group isolation). - No npm/Node for frontend tooling — Bun is mandatory. - No undeclared API routes (enforced by hooks); no env vars used in code without docs/VARIABLES.md rows. - Router-mediated "smart generation behind the router" is architecturally reserved but not built; only the direct assistant generating tier ships.
