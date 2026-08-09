---
id: "cotton-aws-ai"
title: "cotton-aws-ai — AWS-native agentic AI (Phase 0 planning)"
visibility: private
importance: normal
source_repo: "cotton-aws-ai"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags:
  - "aws"
  - "agentic-ai"
  - "bedrock"
  - "llm"
  - "greenfield"
  - "planning"
  - "cdk"
  - "python"
  - "coveris-aws-toolkit"
problems_solved:
  - "No established AWS-native pattern yet for kodexArg agentic workloads — this repo is the designated greenfield to explore LLM integration anchored on AWS services rather than edge or multi-cloud stacks."
  - "LLM provider choice (Bedrock vs direct API vs self-hosted) is unresolved across the org; cotton-aws-ai centralizes evaluation and will record the decision in ADRs before implementation begins."
  - "Agent tooling from other kodexArg projects (Cloudflare, Obsidian, kdx-*) would pollute an AWS-focused build — the repo enforces a scoped skill set (coveris-aws-toolkit only) so agents stay on-mission."
technologies:
  - "Python 3.13+ (planned primary)"
  - "TypeScript (planned secondary — CDK/frontend)"
  - "uv (planned Python package manager)"
  - "bun (planned JS/TS package manager)"
  - "AWS CDK Python (planned IaC)"
  - "Amazon Bedrock (candidate LLM runtime)"
  - "AWS Lambda + API Gateway (planned Phase 2 streaming)"
  - "OpenSearch Serverless or pgvector on RDS (planned vector memory)"
  - "coveris-aws-toolkit agent skills"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# cotton-aws-ai

> **Problem thesis (required):** `cotton-aws-ai` exists to design and eventually implement an **AWS-native agentic AI layer** — tool-using LLM agents with memory, observability, and production guardrails — without committing prematurely to a single LLM vendor. Today the repository is **Phase 0 (under construction)**: no application code, manifests, or infrastructure; only agent instructions, a phased roadmap, and scoped AWS skills. The concrete pain is organizational and architectural: kodexArg needs a deliberate place to evaluate Bedrock vs direct Anthropic/OpenAI APIs, define IAM and orchestration patterns, and build toward streaming agent APIs on Lambda — separate from Cloudflare-centric or general-purpose agent stacks elsewhere in the org.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton-aws-ai` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Greenfield AWS agentic AI project — LLM provider and orchestration pattern under evaluation, with a phased plan from foundation through production hardening. |
| Audience | Internal kodexArg engineers and coding agents working on AWS-native LLM/agent integration; not a published library or end-user product yet. |

## 2. Problems it solves

### P1 — No AWS-native agentic reference architecture in the org

- **Who hurts:** Engineers and agents tasked with building LLM-powered automation on AWS who lack a kodexArg-owned blueprint for tool-use loops, data connections, and deploy targets.
- **Pain today:** Other repos in the org skew toward Cloudflare Workers, Obsidian vaults, or general kdx-* skills. Starting an AWS agent project ad hoc risks inconsistent IAM, secret handling, and observability choices.
- **How this repo answers:** `AGENTS.md` defines a four-phase roadmap (Foundation → Core Agent Loop → Agentic Features → Production Hardening) with explicit checklists: IAM baseline, minimal agent loop, AWS data source wiring, tool registry, vector memory, streaming via API Gateway + Lambda, cost guardrails, and CI/CD. Conventions lock language (Python 3.13+ primary), IaC (CDK Python), and secrets (AWS Secrets Manager only).
- **Out of scope:** Does not replace or document existing Cloudflare or non-AWS agent stacks; agents are instructed not to load non-AWS skills unless explicitly told.

### P2 — Open LLM provider decision blocking implementation

- **Who hurts:** Architects and implementers who need a single recorded decision before writing invocation code, billing estimates, or compliance reviews.
- **Pain today:** Bedrock (native IAM, no egress), Anthropic direct API (latest models, simpler SDK), OpenAI (broad ecosystem), and self-hosted Ollama/vLLM each have trade-offs; no ADR has been written yet.
- **How this repo answers:** `AGENTS.md` § LLM Provider Evaluation maintains a comparison table with status per provider. Phase 0 explicitly includes “Select LLM provider / runtime”; the intended artifact is `docs/adr/0001-llm-provider.md` (directory not yet populated).
- **Out of scope:** Not a multi-cloud abstraction layer; OpenAI is marked “not preferred — proprietary focus”; self-hosted is low priority.

### P3 — Agent skill pollution across project boundaries

- **Who hurts:** Coding agents that default to loading many skills and may apply Cloudflare or vault tooling to an AWS build.
- **Pain today:** Without path-scoped skill configuration, agents might invoke wrong IaC patterns, wrong deployment targets, or wrong observability stacks.
- **How this repo answers:** `CLAUDE.md` and `.claude/settings.json` restrict active skills to the `coveris-aws-toolkit` community set (Bedrock agents, data lake, CDK, IAM, serverless, observability, SDK usage, etc.). `CLAUDE.md` explicitly forbids loading Cloudflare, Obsidian, kdx-*, or other non-AWS skills unless instructed for a specific task.
- **Out of scope:** Does not vendor or mirror the skill files inside the repo; skills are referenced from a host path (`~/skills-and-agent-teams/community-skills/coveris-aws-toolkit/`).

## 3. Product / idea

The **central idea** is an AWS-hosted agent platform: LLM-driven agents that call tools, retain memory (eventually vector-backed), connect to AWS data planes (S3, DynamoDB, RDS), and expose responses through API Gateway with structured logging and X-Ray-style observability. The mental model is **phased delivery** — first close architectural decisions (scope, LLM anchor, IAM, single- vs multi-agent orchestration), then ship a minimal loop with tests, then add dynamic tools and streaming, then harden for security, cost, and load.

At present the “product” is **documentation and agent harness only**: cloning yields planning docs, not a runnable service.

### 3.1 North-star use cases

1. **Phase 0 operator** — Define scope, pick Bedrock vs direct API, draft IAM least-privilege baseline, choose orchestration pattern; record outcomes in `docs/adr/`.
2. **Phase 1 developer** — Run a minimal agent loop with tool-use and memory hooks, backed by one AWS data source, with CloudWatch structured logs and a test harness.
3. **Phase 2 feature builder** — Register tools dynamically, persist semantic memory (OpenSearch Serverless or pgvector on RDS), optionally coordinate multiple agents, stream tokens through API Gateway + Lambda.
4. **Phase 3 operator** — Deploy via GitHub Actions → CodePipeline (or direct deploy), enforce AWS Budgets and token budgets, pass security review (VPC, secrets rotation).

### 3.2 Non-goals

- No production code or deployable artifacts yet (explicit in `AGENTS.md`: “no production code exists yet”).
- No raw CloudFormation — IaC convention is AWS CDK (Python) only.
- No secrets in env files or committed code — AWS Secrets Manager only.
- No inline design docs — decisions belong in `docs/adr/`, reference material in `docs/`.
- OpenAI is deprioritized relative to Bedrock and Anthropic direct API.
- Self-hosted LLM inference (Ollama/vLLM) is low priority due to infra overhead.

## 4. Technology stack

No `package.json`, `pyproject.toml`, `requirements.txt`, `Cargo.toml`, or CDK app exists in the tree yet. Stack below is **planned** per `AGENTS.md` § Project Conventions and the phased roadmap.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.13+ (primary); TypeScript (secondary for CDK/frontend) | `AGENTS.md` § Project Conventions |
| Frontend | Not defined; `aws-amplify` skill listed for potential fullstack | `AGENTS.md` § AWS Skills |
| Backend / API | Lambda + API Gateway (Phase 2 streaming); Bedrock agents (skills) | `AGENTS.md` Phase 2, AWS Skills |
| Data | S3, DynamoDB, or RDS (Phase 1); OpenSearch Serverless or pgvector on RDS (Phase 2 memory) | `AGENTS.md` Phases 1–2 |
| Infra / deploy | AWS CDK (Python); GitHub Actions → CodePipeline or direct deploy (Phase 3) | `AGENTS.md` § Project Conventions, Phase 3 |
| AI / agents | LLM TBD (Bedrock vs Anthropic API evaluating); coveris-aws-toolkit skills | `CLAUDE.md`, `AGENTS.md`, `.claude/settings.json` |
| Tests | Unit + integration harness planned (Phase 1) | `AGENTS.md` Phase 1 |
| Package managers | `uv` (Python), `bun` (JS/TS) — planned | `AGENTS.md` § Project Conventions |
| Observability | CloudWatch + structured logging; aws-observability skill | `AGENTS.md` Phase 1, AWS Skills |

### 4.1 Notable dependencies (curated)

- **coveris-aws-toolkit skills** — Entire active skill surface for agents in this repo (Bedrock, agents lifecycle, data lake, CDK, IAM, serverless, observability, SDKs). Configured in `.claude/settings.json`.
- **Amazon Bedrock** — Leading candidate for native AWS integration and IAM-bound model access (`AGENTS.md` LLM table).
- **AWS CDK (Python)** — Mandated IaC approach; no raw CloudFormation per conventions.
- **boto3 / AWS SDK v3** — Implied by `aws-sdk-python-usage` and `aws-sdk-js-v3-usage` skills for implementation phase.

## 5. Repository map (abstraction)

The tree is intentionally minimal — a **scaffold**, not an application monorepo.

- **Entrypoints:** None yet (no `main.py`, `app.py`, CDK `app` stack, or CLI).
- **Domain / core:** Not present; future agent loop, tool registry, and memory modules are described only in `AGENTS.md` phase checklists.
- **Adapters:** Planned connections to S3, DynamoDB, RDS, API Gateway, Lambda, Bedrock — not implemented.
- **Docs vaults:**
  - `docs/` — exists with `.gitkeep` only; intended for reference docs.
  - `docs/adr/` — referenced for ADRs (e.g. `0001-llm-provider.md`) but not created in tree yet.
  - No `.docs/` hidden vault in this clone.
- **Agent scaffolding:**
  - `AGENTS.md` — SSOT for project context, phased plan, LLM evaluation, AWS skills catalog, conventions.
  - `CLAUDE.md` — Short pointer to `AGENTS.md`; Phase 0 status; skill restriction rules.
  - `.claude/settings.json` — Skill path override to `coveris-aws-toolkit` only.
- **Generated / vendor:** None.

## 6. Configuration & contracts (no secrets)

No `.env`, `wrangler.jsonc`, `settings.py`, or CDK context files exist. Conventions and future contracts are documented in prose only.

- **Secrets policy:** AWS Secrets Manager only — never env files or committed secrets (`AGENTS.md` § Project Conventions).
- **Git workflow:** `kodexArg` account, signed commits, PRs for all changes (`AGENTS.md`).
- **Agent skill path:** `.claude/settings.json` sets `skills.paths` to the host `coveris-aws-toolkit` directory (not vendored in repo).
- **Planned env/config shapes:** Unknown until Phase 1 — expect Bedrock model IDs, IAM role ARNs, data source endpoints, and Secrets Manager secret names; none defined in tree.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface exists.** The repository contains no route definitions, OpenAPI specs, `urls.py`, FastAPI routers, or API Gateway configs. Phase 2 plans “Streaming responses via API Gateway + Lambda” — endpoints are future work.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | N/A — no HTTP/API implementation in repository | — |

### 6.2 Other interfaces

- **Agent Skill tool:** Primary intended interface for humans/agents working in this repo today — invoke named skills from `coveris-aws-toolkit` (e.g. `agents-get-started`, `amazon-bedrock`, `aws-cdk`). Listed exhaustively in `AGENTS.md` § AWS Skills.
- **CLI / MCP / library API:** None present; no `SKILL.md` or MCP server in repo root.

## 7. Data & persistence

**No data layer implemented.** Planned topology from roadmap:

- **Phase 1:** At least one AWS data source among S3, DynamoDB, or RDS for agent context or tool I/O.
- **Phase 2:** Persistent memory via OpenSearch Serverless **or** pgvector on RDS for semantic retrieval.
- **Data lake skills:** Toolkit includes Glue catalog, Athena query, ingestion, and vector storage skills — suggests optional analytics/lake integration but not committed in repo docs beyond skill listing.

Offline vs cloud: entirely cloud-targeted (AWS); no edge or local-first persistence design in current docs.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`AGENTS.md`** — Full project charter: status, phased agentic plan (Phases 0–3), LLM provider evaluation table, complete AWS skills inventory, project conventions (language, package managers, IaC, secrets, docs layout, git).
2. **`CLAUDE.md`** — Phase 0 quick reference; skill restriction policy; pointer to `AGENTS.md`.
3. **`.claude/settings.json`** — Skill path configuration for coveris-aws-toolkit.
4. **`docs/.gitkeep`** — Placeholder only; no reference content yet.

**Not found in clone:**

- Root `README*` (agent docs substitute via `AGENTS.md` / `CLAUDE.md`).
- **`.docs/`** directory — absent.
- **`docs/adr/`** — referenced in `AGENTS.md` but not present (ADR `0001-llm-provider.md` not written).
- ADR / PRD / constitution files beyond agent markdown.
- Application `docs/**` content beyond empty `docs/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — internal kodexArg planning; this summary contains no clone URLs, tokens, or connection strings.
- **Auth model (planned):** IAM-integrated access (Bedrock candidate emphasizes IAM); Phase 3 includes security review for IAM roles, secrets rotation, VPC isolation. No runtime auth implemented.
- **Agent boundaries:** Explicit skill scoping reduces risk of agents applying wrong-cloud patterns or leaking conventions from other projects.
- **Secrets:** Policy forbids committed secrets and env-file secrets; summary contains no `.env`, PEM, or credential material.

## 10. Operational picture

- **Local dev:** No documented dev commands — no `Makefile`, `package.json` scripts, or `pyproject.toml` yet. Conventions name `uv` and `bun` for future package management.
- **Deploy:** Not applicable. Phase 3 mentions GitHub Actions → CodePipeline or direct deploy — no workflow files in tree.
- **Hardware:** Cloud-only (AWS); self-hosted GPU inference explicitly low priority.

## 11. Open questions / unknowns

- **Domain and scope:** Phase 0 checklist item “Define project scope and domain” remains unchecked — no business domain (e.g. support bot, data analyst, ops automation) is named in docs.
- **LLM provider:** Bedrock vs Anthropic direct API still “Evaluating”; ADR file not created.
- **Orchestration pattern:** Single-agent vs multi-agent vs hybrid — undecided.
- **Language split:** TypeScript “secondary for CDK/frontend” — no frontend structure or CDK app layout exists.
- **Vector store choice:** OpenSearch Serverless vs pgvector on RDS — listed as alternatives, not decided.
- **CI/CD target:** CodePipeline vs direct deploy — mentioned in Phase 3 only.
- **Skill portability:** Skills live on host path outside repo; reproducibility for other machines/agents unknown.
- **Relationship to “cotton” naming:** No explanation of codename or upstream product tie-in in available docs.
- **Last tree activity:** GitHub metadata shows creation and last update on the same day (2026-06-24); repo may be dormant since scaffold commit.
