---
id: home-4-af29a984
title: "Home — kodexArg public front door with KodexBar RAG assistant — P3 — Growing knowledge domains without rewriting the engine"
visibility: public
importance: high
source_repo: "Home"
related: ["gh-home"]
tags: ["home", "github", "public", "high", "summary"]
---

### P3 — Growing knowledge domains without rewriting the engine - **Who hurts:** Operator adding CV detail, identity facts, future packs (e.g. Subordinación y Valor). - **Pain today:** Monolithic codebases mix UI, RAG logic, and content; adding a domain often touches retrieval code, API routes, and UI together. - **How this repo answers:** Three in-repo zones (ADR 13): markdown SSOT → → → → Vectorize. Engine knows and only; domain vocabulary lives in chunk text, , and graph edges. New pack = author markdown, compile, reindex — no engine change. - **Out of scope:** Third-party or scraped corpus without ADR amendment (breaks trusted-chunk premise).
