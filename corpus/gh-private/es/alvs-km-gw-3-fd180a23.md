---
id: alvs-km-gw-3-fd180a23
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P2 — A growing web site needs a safe conversational router, not an open chatbot"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---
### P2 — A growing web site needs a safe conversational router, not an open chatbot

- **Who hurts:** End users navigating a site that keeps gaining pages and actions; security reviewers worried about prompt injection and uncontrolled LLM output; operators in the or Django groups who use the ChatUI.
- **Pain today:** A conventional chatbot that generates free text reintroduces ambiguity, injection risk, and un-auditable behavior. Users still want a chat-like box to express intent and be routed to the right place.
- **How this repo answers:** The ChatUI ( , documented in ) is a **router**, not a chatbot. takes an utterance, builds a permission-filtered closed menu server-side, calls Amazon Nova Micro on Bedrock with JSON-schema-constrained decoding at temperature 0, and returns exactly one of four outcomes ( , , , ) — never free prose. The choosing tier never generates; a future generating tier (stage 2, not built) would be filtered through structured slot-filled templates. Every decision persists an audit row. Rate limits ( , silent abuse block via ) return indistinguishable responses. RBAC requires membership in or .
- **Out of scope:** Open-ended conversational AI; local model servers; Redis-backed rate limiting (Redis is prohibited per ).
