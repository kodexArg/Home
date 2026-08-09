---
id: "n8n-apprunner"
title: "n8n-apprunner — n8n workflow automation on AWS App Runner"
visibility: public
importance: normal
source_repo: "n8n-apprunner"
org: "kodexArg"
default_branch: "main"
primary_language: "JavaScript"
repo_kind: "infrastructure"
status: "active"
related: []
tags:
  - "n8n"
  - "workflow-automation"
  - "aws"
  - "apprunner"
  - "nodejs"
  - "postgresql"
  - "secrets-manager"
  - "basic-auth"
  - "no-docker"
problems_solved:
  - "Operators need a managed, container-free path to run n8n on AWS without maintaining Docker images, ECS task definitions, or custom orchestration — App Runner reads apprunner.yaml and deploys directly from GitHub."
  - "Production n8n deployments require encryption keys, database credentials, and Basic Auth passwords to live outside the repo; this wrapper wires AWS Secrets Manager into n8n env vars so sensitive values never ship in source control."
  - "App Runner health checks must hit an unauthenticated liveness endpoint while the n8n UI stays behind Basic Auth — README documents QUEUE_HEALTH_CHECK_ACTIVE and console-side HTTP /healthz configuration separate from apprunner.yaml."
technologies:
  - "n8n ^1.101"
  - "Node.js 20–24 (engines) / App Runner nodejs22 runtime"
  - "AWS App Runner"
  - "AWS Secrets Manager"
  - "Amazon RDS PostgreSQL"
  - "dotenv-cli (local dev)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# n8n-apprunner

> **Problem thesis (required):** This repository is a **minimal deployment wrapper** around upstream n8n — not a fork of n8n itself. It exists so kodexArg can run workflow automation on **AWS App Runner** without Docker: connect the GitHub repo, let App Runner consume `apprunner.yaml`, and get a production n8n instance backed by **RDS Postgres** with secrets pulled from **Secrets Manager**. The pain it attacks is operational friction (no custom container pipeline) plus the security gap of baking credentials into config files.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/n8n-apprunner` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Self-contained n8n service packaged for AWS App Runner — `npm start` runs upstream n8n with production env, Postgres persistence, Basic Auth, and Secrets Manager bindings declared in `apprunner.yaml`. |
| Audience | kodexArg operators deploying internal workflow automation; anyone cloning the pattern for App Runner + n8n without maintaining a Dockerfile. |

## 2. Problems it solves

### P1 — Run n8n on AWS without a Docker build pipeline

- **Who hurts:** Teams that want n8n in AWS but lack appetite for ECR image builds, ECS/Fargate task specs, or sidecar orchestration.
- **Pain today:** Official n8n Docker images are the common path; App Runner natively supports Node.js runtimes and configuration files, but n8n is not pre-packaged for that model out of the box.
- **How this repo answers:** Adds `n8n` as the sole production dependency in `package.json`, exposes `npm start` → `n8n start`, and ships `apprunner.yaml` with `pre-build` (`npm ci --omit=dev`), `build` (`npm prune --production`), and `run` (`npm start` on port 5678). App Runner detects the config file when the service is created with *Use configuration file* and *Source type: GitHub*.
- **Out of scope:** Multi-instance n8n queue mode with dedicated workers (task runners are explicitly disabled via `N8N_RUNNERS_ENABLED=false`); Kubernetes or Lambda-based n8n; custom n8n nodes or workflow definitions (those live in n8n itself after deploy).

### P2 — Keep secrets out of the repository while satisfying n8n's env contract

- **Who hurts:** Operators who must satisfy n8n's requirement for `N8N_ENCRYPTION_KEY`, database credentials, and Basic Auth password without committing them to git.
- **Pain today:** Example configs often inline passwords or leave placeholder env files that drift into commits; RDS master credentials and n8n encryption keys are high-impact leak targets.
- **How this repo answers:** `apprunner.yaml` `run.secrets` maps four Secrets Manager ARNs to env vars: `N8N_ENCRYPTION_KEY`, `N8N_BASIC_AUTH_PASSWORD`, `DB_POSTGRESDB_USER`, `DB_POSTGRESDB_PASSWORD`. README documents three named secrets (`kdx-n8n-encryption-key`, `kdx-generic-password`, optional RDS-managed `rds!db-…` JSON) and a minimal IAM instance role granting `secretsmanager:GetSecretValue` on those resources. Plain-text non-secret tuning (timezone, log format, SSL flags) stays in `run.env`.
- **Out of scope:** Rotating secrets automatically; cross-account secret access; HashiCorp Vault or Parameter Store alternatives.

### P3 — App Runner health checks vs n8n authentication

- **Who hurts:** Anyone configuring App Runner liveness probes against an n8n instance that has Basic Auth enabled globally.
- **Pain today:** Default n8n routes may require auth; misconfigured health checks cause deploy failures or flapping services.
- **How this repo answers:** Sets `QUEUE_HEALTH_CHECK_ACTIVE=true` in `apprunner.yaml` so n8n exposes `/healthz` without authentication. README explicitly states health check protocol/path must be configured in the **App Runner console** (HTTP, path `/healthz`) — not in `apprunner.yaml`, which App Runner does not use for health check definition.
- **Out of scope:** Deep application-level workflow health; synthetic monitoring of individual automations.

## 3. Product / idea

The repository contains **no application source code** beyond Node/npm manifests and AWS App Runner configuration. The mental model is: **GitHub repo → App Runner build → long-running n8n process on port 5678 → RDS Postgres for workflow state → Secrets Manager for credentials**.

After deploy, operators use the standard n8n web UI and REST API (provided by the `n8n` package) to author workflows, webhooks, and integrations. This repo only bootstraps the runtime environment — host binding (`N8N_HOST=0.0.0.0`, `N8N_PORT=5678`), production hardening flags (`N8N_BLOCK_ENV_ACCESS_IN_NODE`, `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES`, secure cookies), regional timezone (`GENERIC_TIMEZONE=America/Argentina/Mendoza`), JSON console logging, and Postgres `DB_TYPE=postgresdb` with SSL enabled.

Local development mirrors production loosely: `npm install`, then `npm run dev` which runs `dotenv -- n8n start` so a local `.env` (gitignored) can supply secrets without touching `apprunner.yaml`.

### 3.1 North-star use cases

1. **First deploy:** Create Secrets Manager entries and optional RDS Postgres → attach IAM role to App Runner service → connect GitHub repo `kodexArg/n8n-apprunner`, branch `main`, runtime *Use configuration file* → configure console health check HTTP `/healthz` → service becomes reachable on the App Runner-assigned hostname.
2. **Local workflow authoring:** Clone repo, `npm install`, add `.env` with required n8n variables, `npm run dev`, open n8n on local port 5678 (per README).
3. **Config iteration:** Adjust non-secret env in `apprunner.yaml` (log level, timezone, security toggles), push to `main`, let App Runner redeploy — rotate secrets in Secrets Manager without code changes.

### 3.2 Non-goals

- Shipping custom n8n nodes, community packages, or workflow JSON exports in this repo.
- Defining CI/CD beyond App Runner's native GitHub integration (no `.github/workflows` present).
- Container-based deployment (no `Dockerfile`).
- Enabling n8n task runners / queue workers in this configuration (`N8N_RUNNERS_ENABLED=false`).
- Telemetry (`N8N_DIAGNOSTICS_ENABLED=false`).

## 4. Technology stack

Derived from `package.json`, `apprunner.yaml`, and `README.md` only. Lockfile present (`package-lock.json`) but not ingested — versions taken from manifests.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node.js `>=20.19 <25` (engines); App Runner `nodejs22` runtime | `package.json` engines; `apprunner.yaml` runtime |
| Application | n8n `^1.101.0` (workflow automation platform) | `package.json` dependencies |
| Data | PostgreSQL via `DB_TYPE=postgresdb` + RDS host env vars | `apprunner.yaml` run.env |
| Infra / deploy | AWS App Runner (config-file mode), GitHub source | `apprunner.yaml`, `README.md` |
| Secrets | AWS Secrets Manager bindings | `apprunner.yaml` run.secrets; `README.md` |
| Local dev | dotenv-cli wrapping `n8n start` | `package.json` scripts / devDependencies |
| Tests | Placeholder (`echo "No tests"`) | `package.json` scripts.test |

### 4.1 Notable dependencies (curated)

- `n8n` — entire product surface; this repo is a thin launcher around the published npm package.
- `dotenv-cli` — dev-only helper to load `.env` for local `npm run dev`; omitted from production install via `npm ci --omit=dev`.

## 5. Repository map (abstraction)

Very small tree — five tracked artifacts at repo root (excluding git metadata):

- **Entrypoints:** `package.json` scripts (`start`, `dev`) invoke upstream `n8n` CLI; no `src/` or custom server code.
- **Deploy contract:** `apprunner.yaml` — single source of truth for App Runner build/run/secrets/env.
- **Documentation:** `README.md` — bilingual (ES primary, EN quick-setup section) covering local dev, App Runner deploy steps, Secrets Manager names, IAM policy sketch, health check console instructions.
- **Ignore rules:** `.gitignore` excludes `node_modules`, `.env*`, `.n8n/` local data, build outputs, IDE folders; `.npmignore` additionally excludes markdown and git metadata from npm pack (largely moot since this is not published as a library).
- **Agent scaffolding:** **Not present** — no `.claude/`, `.agents/`, or `SKILL.md` in tree (verified at clone time).
- **Hidden docs vault:** **Not present** — no `.docs/` directory.
- **Generated / vendor:** `node_modules/` and `.n8n/` are gitignored; production `node_modules` built on App Runner during `npm ci`.

## 6. Configuration & contracts (no secrets)

### Environment variables (non-secret, from `apprunner.yaml` `run.env`)

| Name | Purpose |
|------|---------|
| `N8N_BASIC_AUTH_ACTIVE` | Enables HTTP Basic Auth on n8n UI (`true`) |
| `N8N_BASIC_AUTH_USER` | Basic Auth username (`admin`) |
| `N8N_HOST` / `N8N_PORT` / `N8N_PROTOCOL` | Bind address and port (`0.0.0.0`, `5678`, `http`) |
| `WEBHOOK_URL` | Public base URL n8n uses when registering webhooks (production App Runner hostname — value in manifest, not repeated here) |
| `NODE_ENV` | `production` |
| `N8N_BLOCK_ENV_ACCESS_IN_NODE` | Prevents workflow Code nodes from reading process env |
| `N8N_BLOCK_FILE_ACCESS_TO_N8N_FILES` | Restricts file access from nodes |
| `N8N_SECURE_COOKIE` / `N8N_SAMESITE_COOKIE` | Cookie hardening (`strict` spelling as committed: `stric`) |
| `GENERIC_TIMEZONE` | Scheduler timezone (`America/Argentina/Mendoza`) |
| `QUEUE_HEALTH_CHECK_ACTIVE` | Exposes unauthenticated `/healthz` |
| `N8N_RUNNERS_ENABLED` | Task runners off (`false`) |
| `N8N_DIAGNOSTICS_ENABLED` | Diagnostics off (`false`) |
| `DB_TYPE` | `postgresdb` |
| `DB_POSTGRESDB_*` | Database name, host, port, SSL flags (host is RDS endpoint in manifest) |
| `N8N_LOG_LEVEL` / `N8N_LOG_OUTPUT` / `N8N_LOG_FORMAT` | JSON logs to console at `info` |
| `DB_LOGGING_ENABLED` | ORM SQL logging off |

### Secrets (names only — values from Secrets Manager at runtime)

| Env var | Secret name (per README) |
|---------|--------------------------|
| `N8N_ENCRYPTION_KEY` | `kdx-n8n-encryption-key` |
| `N8N_BASIC_AUTH_PASSWORD` | `kdx-generic-password` |
| `DB_POSTGRESDB_USER` / `DB_POSTGRESDB_PASSWORD` | RDS-managed secret `rds!db-…` (JSON username/password fields) |

IAM: App Runner instance role needs `secretsmanager:GetSecretValue` on the above secret ARNs (README includes example policy JSON with account-specific ARNs — not reproduced here).

Local dev: `.env` / `.env.*` are gitignored; use `npm run dev` with dotenv-cli.

### 6.1 HTTP / API endpoints (when applicable)

This repo does not define custom HTTP routes. The running **n8n** process exposes the standard n8n surface on port **5678**:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/healthz` | App Runner liveness (when `QUEUE_HEALTH_CHECK_ACTIVE=true`) | none |
| `GET` / `POST` | `/` and n8n UI paths | Workflow editor web application | Basic Auth (`N8N_BASIC_AUTH_*`) |
| `*` | `/webhook/*` | Workflow webhook triggers (path varies per workflow) | Per-workflow / n8n defaults |
| `*` | `/api/v1/*` (and related) | n8n REST API | Basic Auth / n8n API key patterns (upstream n8n behavior) |

Exact API route catalog is owned by the `n8n` package version installed — not duplicated in this repo. No OpenAPI or custom router modules present in tree.

### 6.2 Other interfaces

- **CLI:** `n8n start` (production via `npm start`); local `dotenv -- n8n start` (dev).
- **No MCP, Telegram, systemd, or custom CLIs** in this repository.

## 7. Data & persistence

- **Primary store:** Amazon RDS PostgreSQL (`DB_TYPE=postgresdb`), SSL enabled with `DB_POSTGRESDB_SSL_REJECT_UNAUTHORIZED=false` (allows RDS certs without custom CA bundle in this config).
- **Entities:** All workflow, credential, execution, and user data are n8n's standard Postgres schema — managed by n8n migrations on startup; no custom SQL or models in this repo.
- **Ephemeral / local:** `.n8n/` directory for local SQLite/default data is gitignored — production path uses RDS only.
- **Topology:** Single App Runner service instance running n8n monolith mode (runners disabled) talking to external RDS in the same AWS region pattern implied by manifest (us-east-1 ARNs in secrets section). No edge/worker split documented.

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| `README.md` | **Present** — local dev (`npm install`, `npm run dev`, port 5678), App Runner deploy flow, health check console instructions, bilingual AWS quick-setup with Secrets Manager secret names and IAM policy template. |
| `docs/**` | **Absent** — no `docs/` directory. |
| `.docs/**` | **Absent** — directory does not exist in clone. |
| `.claude/**` | **Absent** — no agent instruction tree. |
| ADR / PRD / constitution | **Absent** — no harness or architecture decision records. |
| `.github/workflows` | **Absent** — deploy relies on App Runner GitHub integration only. |

Evidence paths used: `README.md`, `package.json`, `apprunner.yaml`, `.gitignore`, `.npmignore`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo — configuration patterns and non-secret env values are visible; actual secret **values** must only exist in Secrets Manager, not in git history.
- **Auth model:** HTTP Basic Auth on the n8n UI (`N8N_BASIC_AUTH_ACTIVE=true`, user `admin`, password from Secrets Manager). Health endpoint `/healthz` intentionally unauthenticated when queue health check is active.
- **Hardening flags:** Blocks env and file access from workflow nodes; secure/same-site cookies enabled for production.
- **This summary contains no** secret values, passwords, encryption keys, PEM material, or full Secrets Manager ARNs — only secret **names** and env var **names** documented in README/manifest.
- **Caveat for operators:** `apprunner.yaml` in the public repo includes a concrete `WEBHOOK_URL` and RDS hostname — these are infrastructure identifiers, not credentials, but they reveal deployment topology; consider whether future iterations should move hostnames to secrets or SSM.

## 10. Operational picture

- **Local dev:** `npm install` → `npm run dev` (requires local `.env` with n8n-required variables) → listens on port 5678.
- **Production deploy:** Push to `main` on GitHub; App Runner service configured with *Use configuration file* rebuilds using `apprunner.yaml` pre-build/build steps; `npm start` runs at runtime.
- **Health check:** Configure in AWS App Runner console — Protocol HTTP, Path `/healthz` (per README; not in yaml).
- **CI:** No GitHub Actions in repo; App Runner provides deploy-on-push when connected.
- **Hardware:** Managed App Runner capacity — no GPU, RPi, or VRAM constraints.

## 11. Open questions / unknowns

- Whether `WEBHOOK_URL` in `apprunner.yaml` is still the live App Runner hostname or stale after service recreation (commented alternative suggests a Secrets Manager-backed URL was considered).
- Runtime alignment: `package.json` engines allow Node 20–24 while `apprunner.yaml` selects `nodejs22` — likely intentional but undocumented.
- No automated tests or smoke checks in repo; production validation is manual.
- n8n minor version pinned only as `^1.101.0` — exact resolved version depends on lockfile at build time (not summarized here).
- Single-instance monolith with runners disabled — scalability and queue-mode upgrade path not documented.
- Typo in committed config: `N8N_SAMESITE_COOKIE` value `stric` (may or may not affect browser cookie behavior depending on n8n validation).
