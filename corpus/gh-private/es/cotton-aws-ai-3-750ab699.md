---
id: cotton-aws-ai-3-750ab699
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P2 — Open LLM provider decision blocking implementation"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

### P2 — Open LLM provider decision blocking implementation - **Who hurts:** Architects and implementers who need a single recorded decision before writing invocation code, billing estimates, or compliance reviews. - **Pain today:** Bedrock (native IAM, no egress), Anthropic direct API (latest models, simpler SDK), OpenAI (broad ecosystem), and self-hosted Ollama/vLLM each have trade-offs; no ADR has been written yet. - **How this repo answers:** § LLM Provider Evaluation maintains a comparison table with status per provider. Phase 0 explicitly includes “Select LLM provider / runtime”; the intended artifact is (directory not yet populated). - **Out of scope:** Not a multi-cloud abstraction layer; OpenAI is marked “not preferred — proprietary focus”; self-hosted is low priority.
