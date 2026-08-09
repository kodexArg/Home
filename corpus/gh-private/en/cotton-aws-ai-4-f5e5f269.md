---
id: cotton-aws-ai-4-f5e5f269
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P3 — Agent skill pollution across project boundaries"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

### P3 — Agent skill pollution across project boundaries - **Who hurts:** Coding agents that default to loading many skills and may apply Cloudflare or vault tooling to an AWS build. - **Pain today:** Without path-scoped skill configuration, agents might invoke wrong IaC patterns, wrong deployment targets, or wrong observability stacks. - **How this repo answers:** and restrict active skills to the community set (Bedrock agents, data lake, CDK, IAM, serverless, observability, SDK usage, etc.). explicitly forbids loading Cloudflare, Obsidian, kdx-*, or other non-AWS skills unless instructed for a specific task. - **Out of scope:** Does not vendor or mirror the skill files inside the repo; skills are referenced from a host path ( ).
