---
id: cotton-5-ea94af56
title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base — P4 — Fragmented specification before implementation (meta-problem this repo directly solv"
visibility: private
importance: high
source_repo: "cotton"
related: []
tags: ["cotton", "github", "private", "high", "summary"]
---

### P4 — Fragmented specification before implementation (meta-problem this repo directly solves) - **Who hurts:** Developers, AI agents, and project stakeholders who need one SSOT for requirements, stack decisions, and regulatory context. - **Pain today:** Without a consolidated vault, implementation would start from scattered notes, risking drift from Mendoza-specific rules and inconsistent data model assumptions. - **How this repo answers:** MkDocs Material site with navigable PRD, five annexes, three research informes, and ten legislation markdown files — buildable via uv run mkdocs build and deployable per wrangler.toml Cloudflare Pages config. - **Out of scope:** CI/CD for the future Django app (described in annex IV but not present in tree); application source code.
