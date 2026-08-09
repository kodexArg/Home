---
id: cotton-aws-ai-6-3d3443b1
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — 3.1 North-star use cases"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

### 3.1 North-star use cases 1. **Phase 0 operator** — Define scope, pick Bedrock vs direct API, draft IAM least-privilege baseline, choose orchestration pattern; record outcomes in docs/adr/. 2. **Phase 1 developer** — Run a minimal agent loop with tool-use and memory hooks, backed by one AWS data source, with CloudWatch structured logs and a test harness. 3. **Phase 2 feature builder** — Register tools dynamically, persist semantic memory (OpenSearch Serverless or pgvector on RDS), optionally coordinate multiple agents, stream tokens through API Gateway + Lambda. 4. **Phase 3 operator** — Deploy via GitHub Actions → CodePipeline (or direct deploy), enforce AWS Budgets and token budgets, pass security review (VPC, secrets rotation).
