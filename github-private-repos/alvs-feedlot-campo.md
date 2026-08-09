---
id: "alvs-feedlot-campo"
title: "ALVS Feedlot Campo — feedlot traceability and client accounting"
visibility: private
importance: high
source_repo: "alvs-feedlot-campo"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["feedlot", "livestock", "django", "drf", "astro", "svelte", "aws", "fargate", "postgresql", "cognito", "htmx", "agents", "harness", "traceability", "ledger", "alvsgroup"]
problems_solved:
  - "Feedlot operators cannot attribute every ration dose and service charge to the correct animal and paying client when own cattle and boarding cattle share the same pens."
  - "Month-end reconciliation between yard operations and client current accounts is manual, lossy, and disconnected from the events that actually happened in the field."
  - "Operational data (feeding, health, weighings, exits) is recorded without a trustworthy path from cost input to production outcome (gain, conversion, mortality, sale settlement)."
  - "Multi-role feedlot staff and external lot owners need strictly scoped visibility — clients must see only their own herd and ledger, never a neighbor's."
technologies:
  - "Django 6 + Django REST Framework 3.17"
  - "Python 3.14 (uv toolchain)"
  - "Astro 7 SSR + Svelte 5 + Tailwind CSS 4"
  - "HTMX 2 (Django-rendered fragments)"
  - "PostgreSQL 17 (dedicated RDS in prod)"
  - "AWS ECS Fargate (dual-service: backend + frontend)"
  - "Amazon Cognito OIDC (shared org pool) + Django session RBAC"
  - "ElastiCache Valkey (cloud cache layer)"
  - "AWS Bedrock (router tier + generative assistant/advisors)"
  - "GitHub Actions CI + prod deploy via OIDC"
  - "Docker Compose (local dev profiles)"
  - "Agent harness: vendored kdx-* skills, Claude hooks, guardian subagents"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Feedlot Campo

> **Problem thesis (required):** A commercial feedlot that boards client cattle alongside its own cannot run on spreadsheets and memory. Every kilo of ration, vaccine dose, labor charge, and machine hour must land on the correct animal and the correct client's immutable current account at the price of the day — then be readable back as gain, conversion, mortality, and sale settlement without manual reconstruction. This repository is the production application and agent harness for that problem: a Django API plus Astro SSR frontend on AWS, with documentation, ADRs, and automation rigid enough that agents and humans extend the domain without breaking attribution, RBAC, or the API contract.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-feedlot-campo` |
| Visibility | `private` |
| Default branch | `main` (integration); `prod` is production deploy target |
| One-line pitch | End-to-end feedlot operations platform: trace every input to animal and owner, bill through an immutable ledger, derive metrics, and expose role-scoped portals including AI advisors — built on the `astro-drf-aws` template stack. |
| Audience | ALVS field staff (feed operators, field managers, workshop), feedlot owners/administrators, boarding clients (`lot_owners`), and AI coding agents working through the vendored harness. |

The project was spawned from the `kodexArg/astro-drf-aws` template. Ownership moved to `kodexArg` on 2026-08-02 (fork of the prior `jereezquerro92` repo, which remains `upstream`). Deploy identity, OIDC trust, and GitHub Actions variables are per-repository configuration (`docs/GH.md`, `docs/adrs/adr-48-derived-project-deploy-identity.md`). Runtime project slug is `feedlot-campo`; the public production hostname is configured separately as `PROJECT_HOST` (not derived from slug — see `docs/VARIABLES.md`).

## 2. Problems it solves

### P1 — Attribution in mixed-ownership yards

- **Who hurts:** Feedlot operators, field managers, and cattle owners (boarding clients) sharing pens.
- **Pain today:** When the feedlot's own herd and client cattle occupy the same physical yard, a ration or sanitary event without both answers — *which animal* and *whose account pays* — is a silent financial loss or dispute waiting for month-end.
- **How this repo answers:** Domain models and services across `livestock`, `feed`, `feedyard`, `sanitary`, and `ledger` record operational events as immutable facts. Each charge posts to a client's current account through ledger entries (`docs/constitution/PRD.md`, `docs/adrs/adr-25-account-ledger.md`). Catalog rows are editable; operational events are create-only — corrections are new facts, not mutations (`docs/adrs/adr-24-feedlot-domain.md`).
- **Out of scope:** General ERP outside campo operations; payroll; external accounting package sync (ledger is the in-app settlement book).

### P2 — Operations and billing as one trail

- **Who hurts:** Field administration and feedlot owners reconciling yard activity against client balances.
- **Pain today:** Feeding, treatments, machinery, and labor are often logged in one place and invoiced in another, forcing manual reconciliation and hiding the price-of-the-day context.
- **How this repo answers:** The ledger is not bolted on — it is the settlement side of events the operation already writes (`docs/constitution/PRD.md`). Payments post credits; operational services post debits; `clients/{id}/account` and `clients/{id}/ledger` expose the same trail from the client portal (`docs/API.md`).
- **Out of scope:** Double-entry corporate accounting standards beyond the designed current-account model; tax filing.

### P3 — Cost-to-outcome visibility

- **Who hurts:** Owners and advisors evaluating pen performance, conversion, and sale readiness.
- **Pain today:** Inputs are recorded, but asking "what did this cost buy in gain and conversion?" requires rebuilding metrics by hand across weighings, feedings, and exits.
- **How this repo answers:** Read-only `metrics` app derives summary, daily cost, growth, conversion, mortality, and account evolution per client with explicit null contracts when data is insufficient (`docs/adrs/adr-29-metrics-derivation.md`). Market price connectors (`market` app) supply reference hacienda prices for context, not ledger currency.
- **Out of scope:** Predictive ML beyond the designed Bedrock-based advisors and page-context assistant; commodity trading.

### P4 — Role-safe multi-tenant visibility

- **Who hurts:** Boarding clients (`lot_owners`) who must never see another client's animals or balance; staff who need full-yard read access.
- **Pain today:** Screen-level hiding is fragile; a single API leak exposes competitor data.
- **How this repo answers:** Cognito authenticates; Django Groups authorize (`docs/adrs/adr-10-auth.md`). Six operational roles in `backend/apps/users/roles.py` map to per-area DRF permission classes. `lot_owners` are confined to their bound `Client` via `ClientScopedReadPermission` and `AssistantAccess` — mismatches return 403, fail-closed (`docs/API.md`, `docs/adrs/adr-44-field-operational-roles.md`, `docs/adrs/adr-45-lot-owner-assistant-access.md`).
- **Out of scope:** Cognito-group-based RBAC; per-establishment object ACLs beyond current client binding (noted as open design in `docs/feedlot/README.md`).

## 3. Product / idea

The central idea is a **domain-growing monolith**: a shared spine (`clients`, `ledger`, `assets`, `market`, `fx`) plus cattle and extended campo domains (`livestock`, `feed`, `feedyard`, `sanitary`, `traceability`, `breeding`, `genetics`, `crops`, `machinery`, `expenses`, `inventory`, `weather`, `notifications`, `metrics`, `advisors`, `assistant`) composed as separate Django apps without forking the harness (`docs/constitution/PRD.md`).

**Runtime shape:** Two containers — Django ASGI backend on port 8000 and Astro SSR frontend on port 4321 — behind a shared ALB per environment. Path rules send `/api/`, `/accounts/`, `/admin/`, `/ws/`, `/static/`, `/media/` to backend; everything else to frontend (`docs/constitution/INFRASTRUCTURE.md`). Frontend SSR reaches backend via Cloud Map private DNS, never through the public ALB.

**Agent/harness shape:** The repo is as much *how work is done* as *what is built*. `AGENTS.md` is the entry index. The ABC gate requires every change to satisfy PRD, ADRs, and API contract. Vendored `kdx-*` skills under `.claude/skills/` and `skills/` are the sanctioned implementation paths. Guardian subagents (`astro-drf-aws-prd`, `-adr`, `-api`) gate SSOT edits. Hooks enforce API rows, variable declarations, guardian dispatch, and live-doc backlinks.

### 3.1 North-star use cases

1. **Daily pen loop:** Feed operator records feedings and bunk scores; field manager records intakes, weighings, sanitary events; system posts priced ledger debits automatically.
2. **Client portal:** Lot owner logs in, sees only their animals, metrics, account balance, and may use the read-only conversational assistant on their data.
3. **Owner dashboard:** Feedlot owner reviews cross-client metrics, market prices, advisor reports, and ledger outstanding.
4. **Agent-driven delivery:** Developer or agent follows `docs/DEVELOPMENT-LOOP.md` — declare endpoint in `docs/API.md`, write TDD in `docs/tdds/`, implement backend, then frontend via `kdx-astro-7` / HTMX-first ladder.
5. **Production deploy:** Merge to `prod` triggers `deploy-prod.yml` — preflight GitHub vars, build/push ECR images, migrate, roll Fargate services (when images exist).

### 3.2 Non-goals

- Staging environment tier (only dev and prod in ALVS account — `docs/constitution/INFRASTRUCTURE.md`).
- npm/Node runtime (bun mandatory for JS — `docs/adrs/adr-50-initial-stack.md`).
- Mutating or deleting immutable operational facts via API update/destroy.
- Storing secrets in git (AWS Secrets Manager only — `docs/VARIABLES.md`).
- Company-specific identifiers hardcoded in code or docs (deployment-specific values arrive via data or `VARIABLES`).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.14 (`uv`), Bun for JS | `backend/pyproject.toml`, `frontend/package.json` |
| Frontend | Astro 7.0.7, Svelte 5.56, Tailwind 4.3, HTMX 2, Melt UI | `frontend/package.json`, `docs/FRONTEND.md`, `docs/MELT-UI.md` |
| Backend / API | Django 6.0.7, DRF 3.17.1, Uvicorn ASGI, drf-spectacular | `backend/pyproject.toml`, `backend/config/` |
| Data | PostgreSQL 17.9; dedicated RDS `alvs-prod-feedlot-campo-pg` in prod | `compose.yaml`, `docs/adrs/adr-49-feedlot-campo-dedicated-rds.md`, `docs/INVENTORY.md` |
| Cache | ElastiCache Valkey (`cache.t4g.micro`) cloud; `DatabaseCache` local | `docs/CACHE.md`, `docs/adrs/adr-06-cache.md` |
| Auth | Cognito OIDC → Django session; Groups-based RBAC | `docs/AUTH.md`, `backend/apps/users/` |
| AI | Bedrock router (closed enum), page-context assistant, generative advisors | `backend/apps/router/`, `backend/apps/assistant/`, `backend/apps/advisors/`, `docs/CHATBOT.md` |
| Infra / deploy | AWS ECS Fargate us-east-1, ALB, ECR, Secrets Manager, Route 53, Cloud Map | `docs/constitution/INFRASTRUCTURE.md`, `.github/workflows/deploy-prod.yml` |
| Local orchestration | Docker Compose profiles `db`, `backend`, `frontend`, `full` | `compose.yaml`, `docs/DOCKER.md` |
| Tests | pytest + pytest-django (backend); bun test + happy-dom (frontend); root harness tests | `backend/pyproject.toml`, `frontend/package.json`, `tests/` |
| AI / agents | Vendored skills, Claude hooks, triage-and-fix workflow, markdown-vault MCP | `.claude/`, `skills/`, `docs/SKILL-INVENTORY.md`, `.mcp.json` |

### 4.1 Notable dependencies (curated)

- `django` + `djangorestframework` — core API and ORM for all domain apps.
- `psycopg[binary]` — PostgreSQL driver for RDS and local Compose DB.
- `pyjwt[crypto]` + custom OIDC views — Cognito token verification and session establishment.
- `msal` + `httpx` — optional Microsoft Graph app-only reads (`backend/apps/m365/`).
- `boto3` (dev group) — Bedrock inference and AWS integration tests.
- `astro` + `@astrojs/svelte` + `@astrojs/node` — SSR frontend with island architecture.
- `htmx.org` — progressive enhancement; Django serves HTML fragments per `docs/HTMX.md`.
- `melt` — headless UI primitives feeding shadcn-svelte components (`docs/DESIGN-SYSTEM.md`).

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `backend/manage.py` — Django management (migrate, seeds, router menu, price ingest).
  - `frontend/` — Astro SSR app (`src/pages/`, `src/layouts/`, design-system components).
  - `compose.yaml` — local multi-service orchestration with seeded demo data on DEBUG boots.
- **Domain / core (`backend/apps/`):** Twenty-six Django apps covering spine, cattle, herd, crops, machinery, cross-cutting metrics/notifications, auth (`users`), AI surfaces (`router`, `assistant`, `advisors`), and integrations (`m365`, `market` connectors).
- **Adapters:** `backend/config/settings.py` (env + secrets shape), `backend/apps/users/oidc.py`, `market/connectors/` (Cañuelas, IPCVA parsers), `notifications/senders.py`.
- **Docs vaults:** `docs/` — Obsidian-flavored SSOT (constitution, API, VARIABLES, feedlot business design under `docs/feedlot/`, 50+ ADRs in `docs/adrs/`, TDD specs in `docs/tdds/`, agent definitions in `docs/agents/`). No `.docs/` hidden vault present in tree.
- **Agent scaffolding:**
  - `.claude/rules/` — ADR copies loaded as agent rules.
  - `.claude/hooks/` — API/variable guards, guardian dispatch, graph-first, SSOT preload, live-doc enforcement (symlinked as `hooks/`).
  - `.claude/agents/` + `docs/agents/` — guardian and orchestrator/kwf workflow agent prompts.
  - `.claude/workflows/triage-and-fix.js` — unattended issue triage workflow.
  - `skills/` — mirror of vendored `.claude/skills/` (kdx-django-6-drf, kdx-astro-7, kdx-aws-*, kdx-orchestrator, kdx-triage, obsidian-markdown, triage-and-fix, etc.).
  - `.agents/`, `.cursor/` — additional agent IDE configuration.
- **CI/CD:** `.github/workflows/ci.yml` (backend pytest, harness tests, frontend check); `deploy-prod.yml` (prod-only, variable-driven, OIDC to AWS).
- **Harness tests:** `tests/test_*.py` at repo root — docker compose layout, API hook, guardian identity, CI branch coverage, project slug hardcode guard, live-doc linkage.
- **Generated / vendor:** `node_modules/`, `.venv/`, `backend/staticfiles/`, `.mvmcp/` (gitignored) — noted only, not ingested.

## 6. Configuration & contracts (no secrets)

Configuration is declared in `docs/VARIABLES.md` and seeded locally via `.env.example`. Secrets in cloud use path shape `alvs/<env>/<project>/<component>` in AWS Secrets Manager. Frontend receives only `PUBLIC_*` env vars — no secrets on the frontend task.

**Representative env vars (names + purpose only):**

| Name | Purpose |
|------|---------|
| `PROJECT_SLUG` | AWS resource naming (`feedlot-campo` in production) |
| `BASE_DOMAIN` | Base domain for host construction context |
| `PROJECT_HOST` | GitHub Actions var — actual public hostname (differs from slug) |
| `DB_*` | PostgreSQL connection quintet |
| `SECRET_KEY`, `DEBUG`, `ALLOWED_HOSTS` | Django core |
| `COGNITO_*` | OIDC pool, client, domain, region |
| `LOGIN_REDIRECT_URL`, `LOGOUT_REDIRECT_URL` | Post-auth redirects (split ports locally) |
| `AUTH_DEV_MODE`, `AUTH_BOOTSTRAP_ALLOWLIST` | Local dev login path |
| `MSGRAPH_*` | Optional Entra app-only Graph (not wired for this project's prod deploy) |
| `CACHE_URL` | Valkey URL in cloud (absent locally) |
| `PUBLIC_SITE_URL`, `PUBLIC_BACKEND_URL`, `BACKEND_API_URL` | Frontend/build-time service discovery |
| `THROTTLE_COOLDOWN_SECONDS`, `ROUTER_RATE_*` | Router abuse controls |

Bindings: no Cloudflare wrangler in this repo — AWS ECS task definitions pull secret ARNs from GitHub-configured variables at deploy time (`deploy-prod.yml`).

### 6.1 HTTP / API endpoints (when applicable)

The system exposes a large REST + HTML-fragment surface declared exclusively in `docs/API.md` (~259 table rows). Backend prefixes: `/api/`, `/accounts/`, `/admin/`, `/ws/`. Highlights by area:

| Method | Path (pattern) | Purpose | Auth (if known) |
|--------|----------------|---------|-----------------|
| `GET` | `/api/health/` | ALB liveness | none |
| `GET` | `/accounts/login/` | Start Cognito OIDC redirect | none |
| `GET` | `/accounts/callback/` | OIDC callback, open session | none |
| `POST` | `/accounts/logout/` | Session flush + Cognito logout | session |
| `GET` | `/accounts/dev-login/` | DEBUG-only dev login | none |
| `GET` | `/api/me/` | Current user + groups | session |
| `PATCH` | `/api/me/` | Profile/theme preferences | session |
| `GET` | `/api/restricted/` | RBAC probe (`admins`) | session |
| `POST` | `/api/router/route/` | Chatbot router tier (closed enum) | session; `CanUseRouter` |
| `POST` | `/api/assistant/ask/` | Page-context generative assistant | session; `CanUseAssistant` |
| `GET/POST` | `/api/clients/` | Client roster CRUD | `ClientDirectoryAccess` |
| `GET` | `/api/clients/{id}/metrics/*` | Derived client metrics | `ClientScopedReadPermission` |
| `GET/POST` | `/api/animals/`, `/api/lots/`, `/api/intakes/`, … | Livestock lifecycle | `LivestockAccess` |
| `GET/POST` | `/api/feedings/`, `/api/feed-deliveries/`, … | Feed execution + catalog | `Feed*Access` |
| `GET/POST` | `/api/pens/`, `/api/rations/`, … | Feedyard pen loop | `FeedyardAccess` |
| `GET/POST` | `/api/health-events/`, `/api/sanitary-plans/`, … | Sanitary domain | `SanitaryAccess` |
| `GET/POST` | `/api/payments/` | Client payments (ledger credits) | `LedgerWriteAccess` |
| `GET` | `/api/ledger-entries/` | Immutable ledger read | `LedgerReadAccess` |
| `GET/POST` | `/api/market-prices/`, `/api/fx-rates/` | Reference prices and FX | `MarketAccess` / `FxAccess` |
| `GET/POST` | `/api/advisors/`, `/api/conversations/` | Generative advisors + assistant threads | `AdvisorAccess` / `AssistantAccess` |
| `GET` | `/admin/` | Django admin mount | staff session |

Full route list, serializers, and contracts: `docs/API.md`. Undeclared `urls.py` routes are blocked by `hooks/check_api.py`.

### 6.2 Other interfaces

- **CLI / management commands:** `seed_demo_operator`, `seed_router_menu`, `ingest_prices`, `bootstrap_admin`, `purge_router_audit`, `send_weekly_digests`, `check_bedrock_connectivity`, etc. under `backend/apps/*/management/commands/`.
- **MCP:** `markdown-vault-docs` for `docs/` traversal (configured in `.mcp.json`); `codebase-memory-mcp` for code graph (referenced in `AGENTS.md`).
- **WebSocket:** `/ws/` prefix reserved in ALB rules; surface documented in API when present.
- **Skills:** Invoked by agents per `docs/SKILL-INVENTORY.md` — not HTTP, but contractual agent interfaces.
- **triage-and-fix workflow:** `.claude/workflows/triage-and-fix.js` — multi-agent issue pipeline producing PRs against `main`.

## 7. Data & persistence

- **Primary store:** PostgreSQL 17.9. Local: Compose `db` service with volume `pgdata`. Production: dedicated RDS instance `alvs-prod-feedlot-campo-pg` (owner-directed divergence from shared-instance default — `docs/adrs/adr-49-feedlot-campo-dedicated-rds.md`), isolated subnets, not publicly reachable.
- **Cache:** Valkey in cloud for Django shared cache; local dev uses database cache table.
- **Object storage:** S3 bucket for media (presigned URLs — `AWS_STORAGE_BUCKET_NAME` in secrets).
- **Important entities (by app):** `Client`, `Account`, `LedgerEntry`, `Payment`; `Animal`, `Lot`, `Intake`, `Weighing`, `Death`, `Exit`; `FeedType`, `Feeding`, `Pen`, `Ration`; `HealthProduct`, `HealthEvent`, `SanitaryPlan`; `MarketSource`, `MarketPrice`; `User` keyed on Cognito `sub` with `AccessRequest` binding for `lot_owners`; router menu/intent models; advisor conversation threads.
- **Topology:** Cloud = Fargate tasks (public subnets, no NAT — accepted risk) + isolated RDS/Valkey + Bedrock VPC endpoint. Local = split-port Compose stack with hot-reload bind mounts. SSR frontend → backend via Cloud Map hostname inside VPC.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — stack summary, branch model, Docker profiles, project completion status.
2. **`ONBOARDING.md`** — ABC gate, development loop, skill harness, doctrine surprises (Valkey, Cognito vs Django RBAC, bun-only JS).
3. **`AGENTS.md`** — agent entry index, vault MCP first, guardian protocol, smoke-test constraints.
4. **`docs/constitution/PRD.md`** — five product objectives and domain table (spine, cattle, herd, other domains, cross-cutting).
5. **`docs/feedlot/README.md`** — Spanish master business documentation index (vision through sale settlement); design-phase notes and open decisions.
6. **`docs/API.md`** — full endpoint SSOT and RBAC matrix.
7. **`docs/constitution/INFRASTRUCTURE.md`** — two-Fargate AWS layout, ALB rules, secrets naming, accepted public-IP risk.
8. **`docs/INVENTORY.md`** — provisioned AWS resources for `feedlot-campo` (ECR, RDS, ECS services, Cognito app client in shared pool, deploy variables resolved).
9. **`docs/VARIABLES.md`** — env var SSOT including slug vs host divergence.
10. **`docs/constitution/HARNESS.md`** — doctrine tiers (constitution vs loose docs vs ADR/assertion families).
11. **`docs/GH.md`** — owning org `kodexArg`, OIDC subject for prod deploys, fork/upstream relationship.
12. **`.claude/rules/`** — 50+ ADR rule files mirrored from `docs/adrs/` (including feedlot-specific adr-24, adr-49, adr-33–adr-55).
13. **`.claude/hooks/`** — enforcement scripts (API, variables, guardians, SSOT preload, live-doc).
14. **`skills/` / `.claude/skills/`** — vendored kdx skill tree inventory.
15. **`DANGER-README-FIRST.md`** — autonomous agent run register (triage-and-fix decisions, PR merges, harness flakes) — operational history, not product spec.

**`.docs/`:** not present in repository (scanned — directory absent).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg`. Summary contains no clone URLs as product links; `related: []` in frontmatter.
- **Auth model:** Cognito OIDC for identity (shared `alvs-org-pool` with per-project app client in prod); Django session cookie; authorization exclusively via Django Groups → DRF permission classes. Bootstrap superuser is the only password-based admin login (`docs/adrs/adr-10-auth.md`).
- **Tenant isolation:** `lot_owners` fail-closed to bound client; staff roles are internal, not tenants.
- **Secrets:** Never in git. `.env` gitignored; `.env.example` has dev placeholders only. Bot token file exists under `skills/kdx-send-to-telegram/` — not quoted here.
- **Network:** Fargate tasks use public IPs by cost trade-off; security group is primary isolation (`docs/constitution/INFRASTRUCTURE.md`).
- **This summary:** Contains no passwords, tokens, PEM material, or live connection strings.

## 10. Operational picture

**Local development:**

```bash
cp .env.example .env   # configure names per docs/VARIABLES.md
docker compose --profile db up -d
docker compose --profile backend up -d
docker compose --profile full up -d    # when frontend profile is active
python3 tests/test_docker_compose.py
```

Backend: `uv run` inside `backend/`. Frontend: `bun run dev` in `frontend/`. Skill `start-dev-server` automates port freeing and health waits.

**CI (`ci.yml`):** On PRs to `main` and `prod` — backend pytest (Postgres service), harness test discovery (excluding live-AWS `test_aws_infra.py`), frontend `astro check` + `bun test` when frontend exists.

**Deploy (`deploy-prod.yml`):** Push to `prod` only. Preflight validates all required GitHub repository variables. OIDC assumes `gha-deploy-prod` role. Builds and pushes tagged images to project ECR repos, runs migrations, updates ECS services. As of inventory snapshot, ECS services existed but `runningCount=0` pending first image push.

**Production host:** Configured via `PROJECT_HOST` repository variable (public feedlot hostname on ALVS shared prod ALB). Database endpoint recorded in `docs/INVENTORY.md` (not repeated here).

**Agent operations:** Smoke/browser tests restricted to interactive `kodex` user per `AGENTS.md`. Autonomous triage documented in `DANGER-README-FIRST.md` with cost/deploy guardrails.

## 11. Open questions / unknowns

- Whether first production image deploy has completed since inventory noted `prod-pending-first-build` placeholders and `runningCount=0` (inventory dated 2026-07-31; repo CHANGELOG may be ahead — not fully replayed here).
- Several business decisions marked **[DECISIÓN]** in `docs/feedlot/` (own-feed pricing margin vs cost, general cost proration, optional kg-equivalent reporting).
- Frontend test gate historical flakes (`bun test`, `bun run check` interactive hang) referenced in `DANGER-README-FIRST.md` — current green/red status on `main` not re-verified in this scan.
- `MSGRAPH_*` integration provisioned in template but deliberately unset for this project's prod deploy (no M365 routes in active use).
- Exact enabled domain subset per deployment (PRD allows agnostic domain enablement) — code contains apps beyond Phase 1–5 feedlot core; not all may be exposed in UI yet.
- Ephemeral template reference-run resources in lower sections of `docs/INVENTORY.md` are inherited documentation only — not this project's deploy target (`docs/adrs/adr-48-derived-project-deploy-identity.md`).
