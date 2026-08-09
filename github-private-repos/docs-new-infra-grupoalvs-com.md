---
id: "docs-new-infra-grupoalvs-com"
title: "ALVS New-Infra AWS Platform — living MkDocs specification and tooling"
visibility: private
importance: high
source_repo: "docs-new-infra-grupoalvs-com"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags:
  - "alvs"
  - "aws"
  - "mkdocs"
  - "cloudformation"
  - "ecs-fargate"
  - "cognito"
  - "github-actions"
  - "oidc"
  - "django"
  - "infrastructure-as-code"
  - "greenfield"
  - "spanish"
problems_solved:
  - "ALVS needed a single canonical, human-readable specification for a new greenfield AWS platform (DEV+PROD) without touching legacy infrastructure in the same account."
  - "Operators lacked a repeatable, convention-enforcing way to bootstrap new per-project repos, AWS resources, and CI/CD pipelines from one command."
  - "Architecture decisions, as-built drift, and operational runbooks were scattered across audits, frozen ADRs, and tribal knowledge — agents and humans could not trust one source of truth."
technologies:
  - "MkDocs Material 9.5+"
  - "Python 3.13"
  - "boto3 / Typer / Rich"
  - "CloudFormation YAML (no CDK, no Terraform)"
  - "AWS ECS Fargate + ECR + ALB"
  - "AWS RDS PostgreSQL"
  - "AWS Cognito + Google IdP"
  - "AWS Amplify (docs hosting)"
  - "GitHub Actions OIDC"
  - "Django on Fargate (documented stack)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS New-Infra AWS Platform Docs

> **Problem thesis (required):** This repository is the living specification and publication pipeline for ALVS's greenfield AWS platform — a deliberately simple, cost-conscious, convention-driven stack for grupoalvs.com workloads. It exists so architects, operators, and AI agents share one evolving truth about networking, security, compute, databases, Cognito identity, CI/CD, and per-project bootstrap — while the actual infrastructure is provisioned separately and legacy systems remain untouched.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/docs-new-infra-grupoalvs-com` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Canonical MkDocs site plus Python tooling that documents and orchestrates ALVS v3 AWS infrastructure (DEV+PROD VPCs, ECS, RDS, Cognito, OIDC CI/CD) for grupoalvs.com projects. |
| Audience | ALVS admins and architects (infra ownership), project developers (CI/CD and Django conventions), and AI agents editing or consuming the spec (`AGENTS.md`, `.agents/docs/`). |

## 2. Problems it solves

### P1 — Fragmented infrastructure knowledge blocks safe greenfield delivery

- **Who hurts:** Platform admins, architects, and developers onboarding to ALVS's new AWS footprint.
- **Pain today:** Before v3, infrastructure intent lived in ad-hoc audits, pre-v3 plans, frozen ADRs, and console state that diverged from written specs. Teams could not tell whether a design choice was aspirational, superseded, or actually deployed. Greenfield work risked overlapping CIDRs with legacy VPCs or re-litigating rejected options (NAT Gateway, WAF, API Gateway backends).
- **How this repo answers:** `docs/` is the human-facing chapter-by-chapter spec (networking, security, Cognito, databases, compute, frontend, CI/CD, bootstrap). `docs/archive/PROJECT-RULES.md` holds the dense SSOT v3.2 for agents. `docs/decisiones-as-built.md` ratifies verified drift between original SPEC and real AWS inventory so the canon stays honest. `docs/index.md` provides topology diagrams, naming conventions, and current phase status.
- **Out of scope:** It does not manage legacy infrastructure (`docs/legacy.md` is read-only inventory). It does not replace per-application business logic repos.

### P2 — Per-project onboarding is error-prone without enforced conventions

- **Who hurts:** Admins spinning up new ALVS applications (e.g. pilot project `sroa`).
- **Pain today:** Manual console work produces inconsistent resource names, missing ECR lifecycle rules, wrong DNS patterns, forgotten Cognito app clients, and misaligned Secrets Manager paths. Partial failures leave half-provisioned environments.
- **How this repo answers:** `docs/bootstrap.md` defines the `/nuevo-proyecto <name>` contract. `scripts/nuevo_proyecto.py` idempotently orchestrates GitHub repo creation, branch protection, GHA `prod` environment, RDS databases/users, Secrets Manager entries, ECR, ECS services, S3+CloudFront, Route 53 records, and Cognito clients/groups — with dry-run as default. `templates/service-cicd/` supplies a reusable DEV deploy workflow (runtime-state model). `templates/service-cicd/README.md` documents adoption prerequisites.
- **Out of scope:** Shared base infra (VPCs, ALBs, clusters, org Cognito pool, hosted zone) is provisioned once via `scripts/deploy_infra.py`, not per project.

### P3 — Docs must stay publishable and agent-governed as the spec evolves

- **Who hurts:** Anyone consuming the published docs site and AI agents editing chapters.
- **Pain today:** Documentation without CI rots; agent edits without rules create inconsistent diagrams, inline comment labels, or unauthorized AWS mutations.
- **How this repo answers:** `mkdocs.yml` configures Material theme (Spanish UI, Mermaid, search). `.github/workflows/deploy-docs.yml` builds with `mkdocs build --strict` and deploys to AWS Amplify via OIDC role `gha-deploy-docs`. `AGENTS.md` (and symlink `CLAUDE.md`) define agent access rules: free edit on `docs/`, read-only on `docs/archive/`, read-only on live AWS until authorized, Mermaid-only diagrams, heading-before-code-block style. `DOCS-PIPELINE.md` records pipeline design decisions and legacy fallback via `scripts/redeploy.sh`.
- **Out of scope:** Application runtime hosting for ALVS projects (that uses ECS Fargate per `docs/cicd.md`); this repo's own hosting is Amplify for the docs site only.

## 3. Product / idea

The repository is two coupled products in one tree:

1. **A published documentation site** — Spanish-language MkDocs Material chapters explaining ALVS v3 architecture end-to-end, from VPC design through Cognito groups to Django deployment conventions.
2. **Infrastructure orchestration tooling** — Python CLI scripts under `scripts/` that apply CloudFormation templates in phase order and bootstrap per-project resources, always defaulting to dry-run for safety.

The mental model is **"spec is truth, infra is volatile."** AWS resources can be recreated; the documentation and templates define naming, security boundaries, and operational flows. Two isolated VPCs (`alvs-dev` at `10.10.0.0/16`, `alvs-prod` at `10.20.0.0/16`) host shared ALBs and ECS clusters. Applications land as ECS Fargate services behind host-based routing, with per-project S3+CloudFront for static/media assets. A single org-wide Cognito User Pool (`alvs-org-pool`) federates Google OAuth. GitHub Actions assumes IAM roles via OIDC — DEV deploys automatically on push to `main`; PROD promotion requires admin approval, wait timer, and ECR image re-tag (no rebuild).

Philosophy (from `docs/index.md`): simplicity over scale, cost over redundancy (no NAT GW, no WAF, RDS single-AZ by choice), greenfield coexistence with legacy, minimal AWS tags (`App`, `Role` only).

### 3.1 North-star use cases

1. **Developer ships to DEV** — Clone `kodexArg/<project>`, push to `main`; GHA workflow builds Docker image, pushes `dev-<sha>` to ECR, optionally runs Django migrations one-shot, updates ECS service on `alvs-dev` cluster.
2. **Admin promotes to PROD** — Trigger `workflow_dispatch` with `promote_sha`; GHA environment `prod` gates on reviewer; after wait, `gha-deploy-prod` re-tags image as `prod-<sha>` and updates `alvs-prod` ECS service; PROD migrations remain manual per ADR-A-006.
3. **Admin bootstraps new project** — Run `uv run python scripts/nuevo_proyecto.py <name> --apply` after base infra exists; receive credentials and URLs for a fully convention-compliant project skeleton.
4. **Architect or agent updates spec** — Edit `docs/<chapter>.md`, cross-check `docs/archive/PROJECT-RULES.md`, record as-built changes in `docs/decisiones-as-built.md`; merge to `main` triggers docs site rebuild.

### 3.2 Non-goals

- Touching or migrating legacy AWS resources (`docs/legacy.md`, `docs/decisiones-descartadas.md`).
- Using CDK or Terraform for ALVS v3 (CloudFormation YAML only per `AGENTS.md`).
- NAT Gateway, WAF, API Gateway as default backend, Lambda backends — explicitly rejected.
- Auto-running PROD Django migrations from CI (manual admin responsibility per ADR-A-006).
- Multi-cloud or non-AWS deployment targets.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.13 (tooling); Markdown (content) | `scripts/pyproject.toml`, `requirements-docs.txt` |
| Docs engine | MkDocs Material ≥9.5, pymdown-extensions (Mermaid, tabs, admonitions) | `mkdocs.yml`, `requirements-docs.txt` |
| AWS IaC | CloudFormation YAML templates (8 base stacks + per-project) | `scripts/templates/*.yaml`, `docs/*/md` snippets |
| AWS compute | ECS Fargate, ECR, ALB, optional EC2 monitor boxes | `docs/compute.md`, `scripts/templates/50-cluster-*.yaml` |
| AWS data | RDS PostgreSQL (single-AZ, encryption at rest via CMK per ADR-A-010) | `scripts/templates/30-db-*.yaml`, `docs/databases.md` |
| AWS identity | Cognito User Pool + Google IdP, Secrets Manager | `scripts/templates/40-cognito-org.yaml`, `docs/cognito.md` |
| AWS networking | Dual-AZ VPCs, IGW, no NAT, EICE for admin DB access | `scripts/templates/10-network-*.yaml`, `docs/networking.md` |
| AWS frontend CDN | S3 private buckets + CloudFront OAC per project | `docs/frontend.md`, `scripts/templates/per-project.yaml` |
| CI/CD | GitHub Actions + OIDC (`gha-deploy-dev`, `gha-deploy-prod`, `gha-deploy-docs`) | `docs/cicd.md`, `scripts/templates/20-ci-oidc.yaml`, `.github/workflows/deploy-docs.yml` |
| App stack (documented) | Django on Fargate; static frontends via S3+CloudFront; optional Channels/WebSockets guides | `docs/django-en-alvs.md`, `docs/websockets.md`, `docs/ecs-service-connect.md` |
| Tooling libs | boto3, Typer, Rich, PyYAML, cfn-lint | `scripts/pyproject.toml` |
| Package manager (tooling) | uv | `scripts/pyproject.toml`, `scripts/uv.lock`, `scripts/README.md` |
| Docs hosting | AWS Amplify zip-deploy (app id in workflow env) | `.github/workflows/deploy-docs.yml`, `DOCS-PIPELINE.md` |
| AI / agents | `AGENTS.md`, `CLAUDE.md` → `AGENTS.md`, `.agents/docs/aws-skills-reference.md` | repo root, `.agents/docs/` |

### 4.1 Notable dependencies (curated)

- `mkdocs-material` — documentation theme with Spanish localization, instant navigation, Mermaid fences.
- `boto3` — AWS SDK for stack deploy and per-project bootstrap orchestration.
- `typer` — CLI framework for `deploy_infra.py` and `nuevo_proyecto.py` with `--apply` safety gate.
- `cfn-lint` — CloudFormation template validation in tooling toolchain.
- `pymdown-extensions` — Mermaid, superfences, tabbed content, task lists in docs.

## 5. Repository map (abstraction)

- **Entrypoints (docs publication):** `mkdocs.yml` (site config), `docs/index.md` (landing), `.github/workflows/deploy-docs.yml` (CI deploy), `scripts/redeploy.sh` (manual Amplify fallback).
- **Entrypoints (infra tooling):** `scripts/deploy_infra.py` (8 base CFN stacks), `scripts/nuevo_proyecto.py` (per-project bootstrap), `scripts/alvs/common.py` and `scripts/alvs/cfn.py` (shared dry-run/mutation helpers).
- **Domain / core (spec content):** `docs/*.md` chapters — networking, seguridad, cognito, databases, compute, frontend, cicd, bootstrap, decisiones-as-built, decisiones-descartadas, legacy, guides (Django, WebSockets, ECS Service Connect), requerimientos, ejecucion.
- **SSOT / archive (read-only for agents):** `docs/archive/PROJECT-RULES.md` (v3.2 dense rules), `docs/archive/ALVS-AWS-INFRA.md` (pre-v3 audit), `docs/archive/decisions/ADR-001` through `ADR-004`, `docs/archive/PLAN.md`, `docs/archive/TASKS.md`, runbooks under `docs/archive/runbooks/`.
- **CloudFormation templates:** `scripts/templates/10-network-{dev,prod}.yaml`, `20-ci-oidc.yaml`, `30-db-{dev,prod}.yaml`, `40-cognito-org.yaml`, `50-cluster-{dev,prod}.yaml`, `per-project.yaml`.
- **Reusable CI/CD templates:** `templates/service-cicd/.github/workflows/deploy.yml` + README; archived self-contained variant in `templates/.archive/service-cicd-self-contained/`.
- **Agent scaffolding:** `AGENTS.md`, `CLAUDE.md` (symlink), `.agents/docs/aws-skills-reference.md` — no `.claude/` directory present; no `.docs/` hidden vault present.
- **Meta / pipeline docs:** `DOCS-PIPELINE.md` (Amplify deploy findings), `CHANGELOG.md` (grouped change log with ADR references).
- **Generated / vendor (do not ingest):** `site/` (mkdocs output, gitignored), `scripts/.venv/`, `scripts/uv.lock` (lock signal only), `*.zip` deploy artifacts.

## 6. Configuration & contracts (no secrets)

### Environment and workflow variables (names + purpose)

| Name | Purpose |
|------|---------|
| `AWS_REGION` | Fixed `us-east-1` in docs deploy workflow |
| `AMPLIFY_APP_ID` | Target Amplify application for docs zip deploy |
| `AMPLIFY_BRANCH` | Branch name for Amplify deployment slot |
| `vars.AWS_ACCOUNT_ID` | GitHub repository variable for IAM role ARN construction in GHA |
| `APP_ID`, `BRANCH`, `REGION` | Overrides in `scripts/redeploy.sh` manual fallback |
| `AWS_PROFILE` | Expected admin profile name in redeploy script header comment |

### Secrets Manager path conventions (documented shapes, no values)

- RDS master: `rds!db-…` (auto-managed by RDS, no fixed path)
- Per-project: `alvs/<env>/<name>/{db,django,s3}`
- Org-wide Google OAuth: `alvs/shared/google-oauth`

### Cognito conventions

- User Pool: `alvs-org-pool`
- Hosted domain prefix: `alvs-auth`
- Per-project client: `<name>-client`; groups `app-<name>-users`, `app-<name>-admins`
- Canonical django-allauth callback path documented in `docs/cognito.md`

### DNS naming

- PROD: `<name>.grupoalvs.com`
- DEV: `<name>.dev.grupoalvs.com`
- Anti-pattern documented: never `<env>.<name>.grupoalvs.com`

### Deploy tooling safety contract

- `Ctx(apply=False)` default in `scripts/alvs/common.py` — all mutations funnel through `Ctx.mutate()` / `run_gh()` which no-op without `--apply`.
- `deploy_infra.py` supports `--only <stack>`, `--env dev|prod|both`.

### 6.1 HTTP / API endpoints (when applicable)

This repository is **not** an application API server. It publishes static documentation and contains CLI tooling. No REST/GraphQL surface is exposed by this repo itself.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No HTTP API in this repo | N/A |

**Published docs site (external hosting):** The built MkDocs site is served via AWS Amplify with HTTP Basic Auth protection (realm documented in `DOCS-PIPELINE.md` and `AGENTS.md` as `<BASIC_AUTH_PASSWORD>` placeholder — credential not stored in repo). That is a read-only documentation UI, not an API.

**Documented ALB routing (for deployed apps, not this repo):** Host-based routing on shared ALBs (`alvs-dev-alb`, `alvs-prod-alb`) to per-project ECS services; Django apps expose `/health/` per `docs/django-en-alvs.md`.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| `uv run python deploy_infra.py [--apply] [--only STACK] [--env dev\|prod\|both]` | Deploy 8 base CloudFormation stacks in phase order |
| `uv run python nuevo_proyecto.py <name> [--apply]` | Bootstrap GitHub + AWS DEV+PROD per-project resources |
| `scripts/redeploy.sh` | Manual mkdocs build + Amplify zip upload (legacy fallback) |
| `mkdocs build --clean [--strict]` | Local or CI docs build |
| `gh` CLI | Used by `nuevo_proyecto.py` for repo creation, branch protection, workflow seeding |
| GHA workflow `Deploy docs to Amplify` | Triggers on `docs/**`, `mkdocs.yml`, `requirements-docs.txt`, workflow file changes |
| Per-project `deploy.yml` template | DEV-only `build-and-deploy-dev` job; PROD promotion pattern documented in `docs/cicd.md` but not in current template |

## 7. Data & persistence

This repo stores **no application database**. Persistence relevant to the platform it describes:

| Store | Role |
|-------|------|
| RDS PostgreSQL (`alvs-dev-pg`, `alvs-prod-pg`) | Shared instances; per-project databases `app_<name>` and users `app_<name>_user` |
| Secrets Manager | Credentials for RDS, Django settings, S3, Google OAuth |
| S3 (`alvs-<name>-media-<env>`) | Private media/static per project per environment |
| ECR (`alvs/<project>-backend`, `alvs/<project>-frontend`) | Container images; tags `dev-<sha>` / `prod-<sha>` |
| CloudTrail (`alvs-trail`) | API audit logging (ADR-A-005) |

Topology: all resources in single AWS account, region `us-east-1`, split across two VPCs for environment isolation. Docs content lives in git; built HTML is ephemeral on Amplify until next deploy.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root agent instructions** — `AGENTS.md` (SSOT for agents; `CLAUDE.md` is a symlink). Defines project purpose, path map, naming conventions, agent access rules (docs writable, archive read-only, AWS read-only until authorized), diagram and code-block style, AWS skill references, SPEC version history (v3.0–v3.2).
2. **Agent reference doc** — `.agents/docs/aws-skills-reference.md` lists slash-command AWS skills (CloudFormation, IAM, Containers, Amplify, etc.) and reminds agents that AWS account is read-only mode by default.
3. **`.claude/`** — **Not present** in repository tree. Agent guidance consolidated in `AGENTS.md` / `CLAUDE.md` instead.
4. **`.docs/`** — **Not present**. All documentation lives under `docs/` (public nav) and `docs/archive/` (intentionally excluded from `mkdocs.yml` nav but reachable by direct path).
4. **Landing / topology** — `docs/index.md` (mermaid topology, philosophy, chapter index, current phase status, pilot `sroa` state).
5. **Bootstrap contract** — `docs/bootstrap.md` (nuevo-proyecto checklist, conventions table, mermaid flow).
6. **CI/CD model** — `docs/cicd.md` (OIDC flows, role scopes, DEV auto vs PROD gated promotion, re-tag semantics).
7. **Execution checklist** — `docs/ejecucion.md` (phased implementation order with verification gates).
8. **External prerequisites** — `docs/requerimientos.md` (admin actions in Google Cloud Console, Route 53, GitHub environments).
9. **As-built canon** — `docs/decisiones-as-built.md` (ADR-A-001 through ADR-A-010: dual-AZ subnets, per-env DB subnet groups, secrets schema, S3 naming, CloudTrail, migrations policy, Cognito domain, sroa desired counts, RDS encryption).
10. **Networking design** — `docs/networking.md` (VPC layout, IGW-without-NAT, EICE, security group matrix).
11. **Pipeline meta** — `DOCS-PIPELINE.md` (Amplify hosting state, GHA OIDC deploy design, legacy vs v3 pipeline distinction).
12. **Tooling README** — `scripts/README.md` (uv setup, stack phase table, dry-run default).
13. **Service CI/CD template** — `templates/service-cicd/README.md` (runtime-state model, adoption steps, repository variables).
14. **MkDocs config** — `mkdocs.yml` (nav structure, Material features, archive exclusion note).
15. **Changelog** — `CHANGELOG.md` (recent ADR and infra sync groups).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private GitHub repo under `kodexArg`. Summary contains no clone URLs or live credentials. Published docs site uses Basic Auth (password referenced only as placeholder in `AGENTS.md`).
- **Auth model (platform being documented):** Cognito User Pool with Google IdP for end-user apps; GitHub OIDC for CI/CD (no long-lived AWS keys in repos); IAM admin user `kodex` with MFA for human operations; EICE for break-glass DB access without public bastion.
- **Agent safety:** Phase-0 default is read-only AWS and dry-run tooling. `docs/archive/` is immutable for agents. `.gitignore` blocks `.env*`, `*.pem`, `credentials.json`, `client_secret*.json`, `secrets/`.
- **Explicit:** This summary contains no secrets, private keys, connection strings with passwords, or scraped environment files.

## 10. Operational picture

### Local development (docs)

```bash
pip install -r requirements-docs.txt   # or: pip install mkdocs-material
mkdocs serve                            # local preview
mkdocs build --clean --strict           # same as CI
```

### Local development (infra tooling)

```bash
cd scripts
uv venv && uv sync
uv run python deploy_infra.py           # dry-run all base stacks
uv run python nuevo_proyecto.py <name>  # dry-run bootstrap plan
```

### Deployment (this repo's docs site)

- **CI:** `.github/workflows/deploy-docs.yml` on push to `main` (path-filtered) or `workflow_dispatch`.
- **Flow:** checkout → Python 3.13 → `pip install -r requirements-docs.txt` → `mkdocs build --clean --strict` → zip `site/` → OIDC assume `gha-deploy-docs` → Amplify `create-deployment` / upload / `start-deployment` → poll job status.
- **Fallback:** `scripts/redeploy.sh` from workstation with AWS admin profile (marked LEGACY in script header; v3 app deploys use ECS per PROJECT-RULES).

### Deployment (ALVS applications — documented, not this repo)

- Per-project repos copy `templates/service-cicd/.github/workflows/deploy.yml`.
- DEV: automatic on `main` push via `gha-deploy-dev`.
- PROD: manual `workflow_dispatch` + GHA environment approval + 5-minute wait + `gha-deploy-prod`.

### Current platform state (from docs)

- Phase 1 in progress: base v3 infra provisioned DEV+PROD; pilot `sroa` deployed (DEV always-on per ADR-A-009, PROD dormant until go-live); CloudTrail active; Cognito domain and Google OAuth secret provisioned.

## 11. Open questions / unknowns

- Whether Basic Auth on the published docs site will be replaced (Cognito, signed cookies, or removal) — flagged as pending decision in `DOCS-PIPELINE.md` §5.
- Full PROD promotion workflow in `templates/service-cicd/` — template is DEV-only; PROD job pattern documented in `docs/cicd.md` but not yet shipped in the template folder.
- Exact GitHub repository variable values (`AWS_ACCOUNT_ID`, per-project `PROJECT`, network config vars) — shapes documented, values live in GitHub/AWS consoles not in repo.
- Whether Amplify docs hosting will migrate to S3+CloudFront or ECS to align with v3 app pattern — `DOCS-PIPELINE.md` notes Amplify as current host with possible future migration.
- `nuevo_proyecto.py` workflow template push uses placeholder base64 content in one code path (`ensure_workflow_template`) — may require manual copy from `templates/service-cicd/` in practice; verify against latest script behavior.
- Legacy infrastructure decommission timeline — documented as coexistence, not in scope of this repo's automation.
