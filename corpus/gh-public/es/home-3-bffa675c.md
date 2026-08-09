---
id: home-3-bffa675c
title: "Home — kodexArg public front door with KodexBar RAG assistant — P2 — Unsafe or expensive public LLM surface on a homepage"
visibility: public
importance: high
source_repo: "Home"
related: ["gh-home"]
tags: ["home", "github", "public", "high", "summary"]
---

### P2 — Unsafe or expensive public LLM surface on a homepage - **Who hurts:** Site operator (denial-of-wallet, prompt injection, open redirects); visitors who might receive hallucinated links or scraped corpus content. - **Pain today:** Public chat inputs are high-sensitivity: bots hammer endpoints, models can be steered, and naive RAG can emit arbitrary URLs or answer off-corpus questions at full generation cost. - **How this repo answers:** Layered controls documented in ADR 09: model returns linkIds (ids only), never URLs; resolveLinkIds() drops unknown ids; retrieval gate declines off-corpus queries before LLM (matched: false); server-side scrub enforces one plain paragraph; link consent gate (ADR 12) parks links in KV and withholds them until explicit yes/no; KV rate limiting; corpus is closed, versioned, authored markdown — visitor queries never enter chunks or the index. - **Out of scope:** Proof-of-human (Turnstile), bot fingerprinting — harness ADR 02 is open for future extensions.
