---
id: cotton-aws-ai-2-10bd7ea0
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — P1 — No AWS-native agentic reference architecture in the org"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

### P1 — No AWS-native agentic reference architecture in the org - **Who hurts:** Engineers and agents tasked with building LLM-powered automation on AWS who lack a kodexArg-owned blueprint for tool-use loops, data connections, and deploy targets. - **Pain today:** Other repos in the org skew toward Cloudflare Workers, Obsidian vaults, or general kdx-* skills. Starting an AWS agent project ad hoc risks inconsistent IAM, secret handling, and observability choices. - **How this repo answers:** defines a four-phase roadmap (Foundation → Core Agent Loop → Agentic Features → Production Hardening) with explicit checklists: IAM baseline, minimal agent loop, AWS data source wiring, tool registry, vector memory, streaming via API Gateway + Lambda, cost guardrails, and CI/CD. Conventions lock language (Python 3.13+ primary), IaC (CDK Python), and secrets (AWS Secrets Manager only). - **Out of scope:** Does not replace or document existing Cloudflare or non-AWS agent stacks; agents are instructed not to load non-AWS skills unless explicitly told.
