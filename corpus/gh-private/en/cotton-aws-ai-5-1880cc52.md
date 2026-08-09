---
id: cotton-aws-ai-5-1880cc52
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — 3. Product / idea"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---
## 3. Product / idea

The **central idea** is an AWS-hosted agent platform: LLM-driven agents that call tools, retain memory (eventually vector-backed), connect to AWS data planes (S3, DynamoDB, RDS), and expose responses through API Gateway with structured logging and X-Ray-style observability. The mental model is **phased delivery** — first close architectural decisions (scope, LLM anchor, IAM, single- vs multi-agent orchestration), then ship a minimal loop with tests, then add dynamic tools and streaming, then harden for security, cost, and load. At present the “product” is **documentation and agent harness only**: cloning yields planning docs, not a runnable service.
