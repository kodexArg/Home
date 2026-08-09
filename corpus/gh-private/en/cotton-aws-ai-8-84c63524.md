---
id: cotton-aws-ai-8-84c63524
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning) — 4. Technology stack"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
related: []
tags: ["cotton-aws-ai", "github", "private", "normal", "summary"]
---

## 4. Technology stack No package.json, pyproject.toml, requirements.txt, Cargo.toml, or CDK app exists in the tree yet. Stack below is **planned** per AGENTS.md § Project Conventions and the phased roadmap. | Layer | Choices | Evidence (path, not URL) | |-------|---------|--------------------------| | Runtime / language | Python 3.13+ (primary); TypeScript (secondary for CDK/frontend) | AGENTS.md § Project Conventions | | Frontend | Not defined; aws-amplify skill listed for potential fullstack | AGENTS.md § AWS Skills | | Backend / API | Lambda + API Gateway (Phase 2 streaming); Bedrock agents (skills) | AGENTS.md Phase 2, AWS Skills | | Data | S3, DynamoDB, or RDS (Phase 1); OpenSearch Serverless or pgvector on RDS (Phase 2 memory) | AGENTS.md Phases 1–2 | | Infra / deploy | AWS CDK (Python); GitHub Actions → CodePipeline or direct deploy (Phase 3) | AGENTS.md § Project Conventions, Phase 3 | | AI / agents | LLM TBD (Bedrock vs Anthropic API evaluating); coveris-aws-toolkit skills | CLAUDE.md, AGENTS.md, .claude/settings.json | | Tests | Unit + integration harness planned (Phase 1) | AGENTS.md Phase 1 | | Package managers | uv (Python), bun (JS/TS) — planned | AGENTS.md § Project Conventions | | Observability | CloudWatch + structured logging; aws-observability skill | AGENTS.md Phase 1, AWS Skills |
