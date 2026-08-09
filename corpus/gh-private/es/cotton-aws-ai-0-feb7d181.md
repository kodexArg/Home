---
id: cotton-aws-ai-0-feb7d181
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — cotton-aws-ai"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

# cotton-aws-ai > **Problem thesis (required):** exists to design and eventually implement an **AWS-native agentic AI layer** — tool-using LLM agents with memory, observability, and production guardrails — without committing prematurely to a single LLM vendor. Today the repository is **Phase 0 (under construction)**: no application code, manifests, or infrastructure; only agent instructions, a phased roadmap, and scoped AWS skills. The concrete pain is organizational and architectural: kodexArg needs a deliberate place to evaluate Bedrock vs direct Anthropic/OpenAI APIs, define IAM and orchestration patterns, and build toward streaming agent APIs on Lambda — separate from Cloudflare-centric or general-purpose agent stacks elsewhere in the org.
