---
id: alvs-km-gw-3-fd180a23
title: "ALVS km-gw — SharePoint-to-web gateway with AI-safe ChatUI router — P2 — A growing web site needs a safe conversational router, not an open chatbot"
visibility: private
importance: high
source_repo: "alvs-km-gw"
related: []
tags: ["alvs-km-gw", "github", "private", "high", "summary"]
---

### P2 — A growing web site needs a safe conversational router, not an open chatbot - **Who hurts:** End users navigating a site that keeps gaining pages and actions; security reviewers worried about prompt injection and uncontrolled LLM output; operators in the admins or ai_operators Django groups who use the ChatUI. - **Pain today:** A conventional chatbot that generates free text reintroduces ambiguity, injection risk, and un-auditable behavior. Users still want a chat-like box to express intent and be routed to the right place. - **How this repo answers:** The ChatUI (frontend/src/pages/chatui.astro, documented in docs/CHATBOT.md) is a **router**, not a chatbot. POST /api/router/route/ takes an utterance, builds a permission-filtered closed menu server-side, calls Amazon Nova Micro on Bedrock with JSON-schema-constrained decoding at temperature 0, and returns exactly one of four outcomes (Action, Answer, Escalate, NO_MATCH) — never free prose. The choosing tier never generates; a future generating tier (stage 2, not built) would be filtered through structured slot-filled templates. Every decision persists an IntentQuery audit row. Rate limits (CooldownThrottle, silent abuse block via DatabaseCache) return indistinguishable 429 responses. RBAC requires membership in admins or ai_operators. - **Out of scope:** Open-ended conversational AI; local model servers; Redis-backed
