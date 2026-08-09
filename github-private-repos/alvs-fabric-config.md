---
id: "alvs-fabric-config"
title: "ALVS Fabric Config — SharePoint-to-Lakehouse CLI configuration"
visibility: private
importance: normal
source_repo: "alvs-fabric-config"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "infrastructure"
status: "active"
related: []
tags: ["alvs", "microsoft-fabric", "sharepoint", "azure", "lakehouse", "medallion", "graph-api", "cli", "mcp", "onelake", "data-engineering"]
problems_solved:
  - "ALVS needs a repeatable, code-driven path to stand up a Microsoft Fabric Data Lakehouse fed by SharePoint Online document libraries — without portal click-ops."
  - "Operators and agents lack a single, auditable CLI workflow to authenticate across Entra ID, Azure control plane, and Microsoft Graph for SharePoint file discovery and future Bronze-layer ingest."
  - "SharePoint-to-OneLake integration requires least-privilege Entra auth and tooling verification before pipelines can be scaffolded — this repo provides the bootstrap scripts and architectural decisions."
technologies:
  - "Python 3 (stdlib scripts)"
  - "Bash shell glue"
  - "Azure CLI (az)"
  - "Microsoft 365 CLI (m365) / Microsoft Graph"
  - "Azure MCP (@azure/mcp)"
  - "Microsoft Fabric / OneLake"
  - "Membrane CLI (optional SharePoint broker)"
  - "uv (Python tooling, per AGENTS.md)"
  - "Grok project MCP config"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# ALVS Fabric Config

> **Problem thesis (required):** ALVS (an internal organization) must configure a Microsoft Fabric Data Lakehouse with SharePoint Online as the primary file source. Portal-based configuration does not scale, and ad-hoc scripts scatter auth and discovery logic. This repository centralizes the **CLI-first integration path** — Entra ID authentication, SharePoint file discovery via Microsoft Graph, Azure control-plane operations via Azure CLI and Azure MCP, and the architectural decision to land raw files in Fabric OneLake Bronze as the first medallion layer.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/alvs-fabric-config` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | CLI-first configuration for the ALVS Data Lakehouse on Microsoft Fabric, with SharePoint Online as the file source. |
| Audience | ALVS data engineers, operators, and AI agents working on Fabric lakehouse setup; kodexArg maintainers with access to the private repo. |

## 2. Problems it solves

### P1 — SharePoint-to-Fabric lakehouse bootstrap without portal click-ops

- **Who hurts:** ALVS data platform engineers and operators tasked with standing up a Fabric lakehouse fed by SharePoint document libraries.
- **Pain today:** Microsoft Fabric and SharePoint configuration is typically done through web portals — slow, non-reproducible, and hard to audit. There is no single repo that documents the chosen integration path, provides auth scripts, and verifies tooling before pipeline work begins.
- **How this repo answers:** Documents the **medallion architecture decision** (SharePoint → Graph → Bronze in OneLake), ships shell scripts for `az login` and `m365 login`, a Python probe that lists SharePoint sites and drives via Graph, and a tooling checker that validates all required CLIs and agent skills are installed.
- **Out of scope:** Does not yet implement the actual Graph-download-to-OneLake pipeline, Fabric workspace provisioning, or unattended app-registration ingest. Those are documented as next steps in `docs/CHOSEN-PATH.md`.

### P2 — Unified auth and tooling verification across Azure and M365 planes

- **Who hurts:** Agents and humans who need to work across Entra ID, Azure subscriptions, SharePoint/Graph, and Fabric — each with different CLI tools and auth caches.
- **Pain today:** Without a checklist, it is unclear whether `az`, `m365`, `azmcp`, `membrane`, `uv`, and required agent skills are installed and authenticated. Failures surface late during pipeline development.
- **How this repo answers:** `scripts/check_tooling.py` probes every required binary, checks `az account show` and `m365 status`, and verifies seven agent skills under `~/.agents/skills/`. Login scripts (`login_azure.sh`, `login_m365.sh`) standardize device-code and browser auth flows, printing tenant/subscription IDs for `.env` population.
- **Out of scope:** Key Vault integration for secrets (planned per AGENTS.md rules). No automated CI/CD for auth rotation.

### P3 — Agent-ready project context for Fabric/SharePoint work

- **Who hurts:** AI coding agents dispatched to configure ALVS infrastructure without domain context.
- **Pain today:** Agents lack a concise mission statement, integration path, skill list, and MCP configuration to operate effectively on Azure/Fabric/SharePoint tasks.
- **How this repo answers:** `AGENTS.md` provides agent context (goal, chosen path, skills, rules). `.grok/config.toml` wires Azure MCP into the Grok session. README lists installed skills (`fabric-lakehouse`, `e2e-medallion-architecture`, `microsoft-sharepoint`, Azure deploy/storage/prepare/diagnostics).
- **Out of scope:** No `.claude/` or `.docs/` vault present in the tree (scanned; not found). Agent skills themselves live outside the repo under `~/.agents/skills/`.

## 3. Product / idea

The central idea is a **CLI-first, two-plane integration** for ALVS data lakehouse setup:

```
SharePoint Online  ──Graph (m365 / REST)──►  Bronze (Fabric Lakehouse / OneLake)
Azure / Fabric     ──az + Azure MCP────────►  workspaces, capacity, lakehouse, RBAC
Entra ID           ──az login / m365 login─►  auth for both planes
```

After cloning and running the quick-start sequence, an operator can verify tooling, authenticate to both Azure and M365, and probe SharePoint site/drive access — establishing the foundation for a future pipeline that downloads files from Graph into OneLake Bronze.

The mental model is **medallion architecture on Fabric**: SharePoint document libraries are the raw file source; Microsoft Graph is the read API; Fabric Lakehouse / OneLake is the landing zone. Azure CLI + Azure MCP handle the control plane (workspaces, capacity, RBAC). Entra ID provides unified identity for both planes.

Membrane CLI is acknowledged as an optional third-party SharePoint skill broker, but the chosen path prefers **direct Entra + Graph** for least privilege and auditability.

### 3.1 North-star use cases

1. **Operator bootstrap:** Clone repo → `python3 scripts/check_tooling.py` → `./scripts/login_azure.sh --device` → `./scripts/login_m365.sh` → copy `.env.example` to `.env` → `python3 scripts/probe_sharepoint.py` to confirm site/drive access.
2. **Agent-assisted Fabric setup:** Agent reads `AGENTS.md` and `docs/CHOSEN-PATH.md`, uses Azure MCP (via `.grok/config.toml`) and installed skills to scaffold Fabric workspace + lakehouse once auth is confirmed.
3. **SharePoint inventory:** After m365 login, `probe_sharepoint.py` lists root site, searches sites, and enumerates document library drives — producing the inventory needed to plan Bronze ingest.

### 3.2 Non-goals

- Portal click-ops for Fabric or SharePoint configuration.
- Membrane-only auth path (Membrane is optional; direct Graph is preferred).
- Committing secrets to git (`.env` is gitignored; Key Vault planned for later).
- Touching other `~/Dev/*` projects unless explicitly asked (per AGENTS.md rules).
- Unattended/service-principal ingest (planned later with `Sites.Selected` app registration; interactive delegated auth is the current phase).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (stdlib only in scripts), Bash | `scripts/*.py`, `scripts/*.sh`, `.gitignore` (`.python-version` ignored) |
| CLI tooling | Azure CLI (`az`), Microsoft 365 CLI (`m365`), Azure MCP (`azmcp`), Membrane CLI, GitHub CLI (`gh`), `uv` | `scripts/check_tooling.py` tool list |
| Cloud platform | Microsoft Azure, Microsoft Fabric, SharePoint Online, Entra ID | `README.md`, `docs/CHOSEN-PATH.md` |
| API surface | Microsoft Graph REST (via `m365 graph get`) | `scripts/probe_sharepoint.py` |
| Agent / MCP | Azure MCP (`@azure/mcp`), Grok project MCP config | `.grok/config.toml` |
| Agent skills (external) | azure-deploy, azure-storage, azure-prepare, azure-diagnostics, fabric-lakehouse, e2e-medallion-architecture, microsoft-sharepoint | `AGENTS.md`, `scripts/check_tooling.py` |
| Package manager | `uv` (per AGENTS.md; no `pyproject.toml` in repo yet) | `AGENTS.md` rules section |
| Tests | None in repo | tree scan |
| CI/CD | None evident | tree scan |

### 4.1 Notable dependencies (curated)

- **Azure CLI (`az`)** — Azure subscription management, Entra context, account discovery; required by Azure MCP DefaultAzureCredential.
- **Microsoft 365 CLI (`m365`)** — SharePoint/Graph delegated access, site/drive listing, Graph REST proxy (`m365 graph get`).
- **Azure MCP (`@azure/mcp`)** — MCP server for agent-driven Azure control-plane operations; started via `npx @azure/mcp@latest server start`.
- **Membrane CLI** — Optional third-party SharePoint skill broker; checked but not required.
- **uv** — Preferred Python package manager for future script dependencies (per AGENTS.md).
- **GitHub CLI (`gh`)** — Auth status check in tooling script; repo management.

No `package.json`, `pyproject.toml`, `requirements.txt`, or lockfiles exist in the repo — scripts use Python stdlib only.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `scripts/check_tooling.py` — verify all CLIs, auth status, skills, MCP config.
  - `scripts/probe_sharepoint.py` — Graph probe for SharePoint sites and drives.
  - `scripts/login_azure.sh` — interactive/device-code Azure login.
  - `scripts/login_m365.sh` — device-code M365/SharePoint login.
  - `scripts/env.sh` — sourceable env loader (PATH, `.env`, project root).

- **Domain / core:**
  - `docs/CHOSEN-PATH.md` — architectural decision record: why Graph → Fabric, stack layers, SharePoint host hypothesis, next steps.
  - `AGENTS.md` — agent mission context, integration path, skills, rules.

- **Adapters:**
  - `scripts/probe_sharepoint.py` — shells out to `m365 graph get` (reuses m365 auth cache, no local token storage).
  - `.grok/config.toml` — MCP server adapter for Azure MCP.

- **Docs vaults:**
  - `docs/` — contains `CHOSEN-PATH.md` (integration decision).
  - `.docs/` — **not present** (scanned; directory does not exist).

- **Agent scaffolding:**
  - `AGENTS.md` — project rules and context for agents.
  - `.grok/config.toml` — Grok MCP project config.
  - `.claude/` — **not present** (scanned; directory does not exist).
  - Agent skills referenced but installed externally at `~/.agents/skills/`.

- **Configuration:**
  - `.env.example` — template for tenant, subscription, SharePoint host, Fabric workspace/lakehouse/capacity IDs.
  - `config/` — mentioned in README layout but **not yet created** in the tree.

- **Generated / vendor:** None. `.gitignore` excludes `.env`, `.env.*`, `.secrets/`, `*.pem`, `*.pfx`, `__pycache__/`, `.venv/`, `.azure/`, `.m365/`, `node_modules/`, `*.log`.

## 6. Configuration & contracts (no secrets)

### Environment variables (from `.env.example`)

| Variable | Purpose |
|----------|---------|
| `AZURE_TENANT_ID` | Entra ID tenant identifier (populated after `az login`) |
| `AZURE_SUBSCRIPTION_ID` | Azure subscription identifier (populated after `az login`) |
| `AZURE_DEFAULT_LOCATION` | Default Azure region (default: `eastus`) |
| `SHAREPOINT_HOST` | SharePoint Online hostname (hypothesis: tenant-based host) |
| `SHAREPOINT_SITE_PATH` | Relative site path (e.g. `sites/SiteName`) |
| `SHAREPOINT_SITE_URL` | Optional full site URL |
| `FABRIC_WORKSPACE_ID` | Microsoft Fabric workspace ID (fill after discovery) |
| `FABRIC_LAKEHOUSE_ID` | Fabric lakehouse ID (fill after discovery) |
| `FABRIC_CAPACITY_ID` | Fabric capacity ID (fill after discovery) |

Real values go in `.env` (gitignored). `login_azure.sh` prints tenant and subscription IDs after login for manual `.env` population.

### MCP configuration

`.grok/config.toml` defines one MCP server:

| Server | Command | Purpose |
|--------|---------|---------|
| `azure` | `npx -y @azure/mcp@latest server start` | Azure control-plane MCP for agent sessions |

Requires prior `az login`. Grok session must be restarted in the project folder to load MCP.

### 6.1 HTTP / API endpoints (when applicable)

This repository does **not** expose its own HTTP server or API. It is a CLI/configuration project. However, it **calls** Microsoft Graph REST endpoints via `m365 graph get`:

| Method | Path (Graph) | Purpose | Auth |
|--------|--------------|---------|------|
| `GET` | `/v1.0/me` | Current user identity | m365 delegated token |
| `GET` | `/v1.0/sites/{host}:/` | Root SharePoint site metadata | m365 delegated token |
| `GET` | `/v1.0/sites/{host}:/{site-path}` | Specific site metadata | m365 delegated token |
| `GET` | `/v1.0/sites/{site-id}/drives` | Document library drives for a site | m365 delegated token |
| `GET` | `/v1.0/sites?search=*` | Site search (discovery) | m365 delegated token |

These are external Microsoft Graph endpoints, not served by this repo. Future Fabric REST endpoints for workspace/lakehouse provisioning are planned but not yet scripted.

### 6.2 Other interfaces

| Interface | Commands / entry points | Purpose |
|-----------|------------------------|---------|
| CLI — tooling check | `python3 scripts/check_tooling.py` | Verify all required binaries, auth, skills |
| CLI — SharePoint probe | `python3 scripts/probe_sharepoint.py` | Discover sites and drives via Graph |
| CLI — Azure login | `./scripts/login_azure.sh [--device]` | Entra/Azure interactive or device-code auth |
| CLI — M365 login | `./scripts/login_m365.sh` | SharePoint/Graph device-code auth |
| Shell — env loader | `source scripts/env.sh` | Set PATH, load `.env`, cd to project root |
| MCP — Azure | `@azure/mcp` via `.grok/config.toml` | Agent-driven Azure operations |
| Agent skills (external) | `fabric-lakehouse`, `e2e-medallion-architecture`, `microsoft-sharepoint`, Azure skills | Domain knowledge for agents |

## 7. Data & persistence

- **No local database or persistent store** in this repo. It is a configuration and bootstrap toolkit.
- **SharePoint Online** is the upstream file source (document libraries accessed via Graph).
- **Microsoft Fabric / OneLake** is the intended downstream landing zone (Bronze layer in medallion architecture).
- **Auth caches** live in CLI tool stores (`.azure/` and `.m365/` directories, both gitignored) — not managed by this repo.
- **Topology:** Files originate in SharePoint Online (cloud). Future pipeline will download via Graph API and land in Fabric OneLake Bronze (cloud). Azure control plane manages workspace, capacity, and RBAC. All components are cloud-hosted; local machine is the operator/agent workstation running CLIs.

### Planned entities (not yet implemented)

- Fabric workspace, lakehouse, capacity (IDs captured in `.env.example` placeholders).
- SharePoint sites and document library drives (discovered by `probe_sharepoint.py`).
- Future: app registration with `Sites.Selected` permission for unattended ingest.

## 8. Docs & agent memory (required scan)

### Sources read and summarized

1. **`README.md`** — project pitch, chosen integration path diagram, quick-start steps, skills list, MCP setup, directory layout.
2. **`AGENTS.md`** — agent goal, integration path (5 steps), installed skills, repo visibility, rules (no secrets in git, Graph least privilege, Python + uv, scope boundaries).
3. **`docs/CHOSEN-PATH.md`** — architectural decision: CLI-first Graph → Fabric Lakehouse; rationale against Membrane-only and portal; stack layers; SharePoint host hypothesis; four next steps after auth.
4. **`.grok/config.toml`** — Azure MCP server configuration.
5. **`.env.example`** — environment variable names and purposes (no real values).
6. **`scripts/check_tooling.py`** — tooling verification logic, skill paths, MCP check.
7. **`scripts/probe_sharepoint.py`** — Graph probe implementation, env loading, site/drive enumeration.
8. **`scripts/login_azure.sh`** — Azure login flow with tenant/subscription output.
9. **`scripts/login_m365.sh`** — M365 device-code login with quick Graph validation.
10. **`scripts/env.sh`** — environment setup helper.

### Directories scanned but not present

- **`.claude/`** — does not exist in the repository tree.
- **`.docs/`** — does not exist in the repository tree.
- **`config/`** — referenced in README layout but not yet created.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository under `kodexArg` org. Summary contains no clone URLs or live credentials.
- **Auth model:** Interactive delegated auth via Entra ID — `az login` (browser or device code) for Azure plane, `m365 login --authType deviceCode` for SharePoint/Graph plane. Future unattended ingest planned with app registration and `Sites.Selected` least-privilege scope.
- **Secrets handling:** `.env` is gitignored. `.env.example` provides name-only templates. `.secrets/` directory is gitignored. PEM/PFX files are gitignored. AGENTS.md explicitly forbids secrets in git; Key Vault planned for later.
- **Least privilege:** AGENTS.md mandates Graph `Sites.Selected` for automation apps. Current phase uses interactive delegated permissions for discovery only.
- **This summary contains no secrets, private keys, connection strings with passwords, or scraped `.env` contents.**

## 10. Operational picture

### Local development

```bash
# 1) Verify tooling
python3 scripts/check_tooling.py

# 2) Login (org account)
./scripts/login_azure.sh --device
./scripts/login_m365.sh

# 3) Configure environment
cp -n .env.example .env   # fill SHAREPOINT_HOST / SITE after discovery

# 4) Probe SharePoint access
python3 scripts/probe_sharepoint.py

# Optional: source project environment
source scripts/env.sh
```

Requires Node.js v20.20.2 (nvm path hardcoded in scripts for `m365`, `azmcp`, `membrane` binaries). Python 3 stdlib sufficient for current scripts. `uv` recommended for future dependency management.

### Agent session setup

1. Open Grok session in project folder (loads `.grok/config.toml` → Azure MCP).
2. Ensure `az login` completed before MCP starts.
3. Agent reads `AGENTS.md` for mission context and skill list.
4. Useful session-level MCPs beyond project config: github, engram (per README).

### Deployment

No CI/CD pipelines, GitHub Actions, or infrastructure-as-code files present in the repository. This is an early-stage bootstrap/config repo operated locally. Fabric workspace and lakehouse provisioning is a documented next step, not yet automated.

### Hardware constraints

None. Runs on any workstation with Azure CLI, M365 CLI, and Python 3. Device-code auth flow supports remote/SSH sessions without browser.

## 11. Open questions / unknowns

- **`config/` directory** referenced in README layout but not present in the tree — may be planned for non-secret config snippets.
- **No `pyproject.toml` or `requirements.txt`** — Python scripts use stdlib only today; `uv` adoption for dependencies is stated in AGENTS.md but not yet manifest.
- **Fabric workspace/lakehouse provisioning scripts** are documented as next steps in `docs/CHOSEN-PATH.md` but not yet implemented.
- **Graph-download-to-OneLake Bronze pipeline** is the ultimate goal but not yet coded.
- **App registration with `Sites.Selected`** for unattended ingest is planned but not implemented.
- **Key Vault integration** for secrets management is mentioned in AGENTS.md rules but not present.
- **No CI/CD** — unknown whether GitHub Actions or other automation will be added.
- **SharePoint host hypothesis** (`grupoalvs.sharepoint.com`) is documented but marked "confirm after first successful m365 login."
- **`.claude/` and `.docs/`** directories do not exist — no agent instruction trees or hidden docs vaults to summarize.
