---
id: cotton-coveris-3-5781b67c
title: "cotton-coveris — reserved empty namespace for Coveris (cotton family) — P2 — Separation of naming families (cotton vs bare product name)"
visibility: private
importance: low
source_repo: "cotton-coveris"
related: []
tags: ["cotton-coveris", "github", "private", "low", "summary"]
---

### P2 — Separation of naming families (cotton vs bare product name) - **Who hurts:** Developers and RAG agents trying to map "which repo is Coveris?" across coveris, cotton-coveris, and cotton-coveris-mvp. - **Pain today:** The org uses both bare product names (coveris) and cotton-* prefixed names for related workstreams. Without an explicit inventory entry for cotton-coveris, agents may assume the name implies an active codebase and waste cycles cloning an empty tree. - **How this repo answers:** This summary records the **empty state explicitly** so downstream RAG and swarm agents treat cotton-coveris as a placeholder, not a missing clone failure. Operators should prefer coveris (active full product) or cotton-coveris-mvp (MVP stack) for implementation context. - **Out of scope:** Does not document the Coveris domain model, API, or deployment — those belong to populated sibling repositories.
