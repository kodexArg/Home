---
id: alvs-corporate-books-4-6f175cfc
title: "ALVS Corporate Books — statutory registers, compliance, and litigation on Astro + Django — P3 — AI assistance without giving models actuator rights"
visibility: private
importance: high
source_repo: "alvs-corporate-books"
related: []
tags: ["alvs-corporate-books", "github", "private", "high", "summary"]
---

### P3 — AI assistance without giving models actuator rights - **Who hurts:** Operators who want natural-language navigation and lawyers who need drafting help; security reviewers who fear prompt injection driving mutations. - **Pain today:** Chatbots that both interpret intent and execute actions blur trust boundaries; unconstrained LLM output can suggest or trigger unauthorized operations. - **How this repo answers:** A strict two-tier AI design (docs/CHATBOT.md, ADR-17/18/25): the **router** (POST /api/router/route/) uses Bedrock Nova Micro with JSON-schema constrained enum outputs — it chooses among permission-filtered intents only, never generates user-visible prose. The **assistant** generating tier (POST /api/assistant/ask/, chat sessions) produces read-only text; page context is assembled server-side from a closed nav registry, not raw page HTML. Rate limits, cooldowns, audit rows (IntentQuery, AssistantQuery), and kill switches (ROUTER_ENABLED, ASSISTANT_ENABLED) provide operational guardrails. - **Out of scope:** Autonomous agents that POST/PATCH/DELETE domain records; all mutations remain explicit UI/API actions by authenticated humans.
