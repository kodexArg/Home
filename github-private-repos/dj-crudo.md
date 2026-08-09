---
id: "dj-crudo"
title: "dj-crudo — Django WiFi captive portal and survey CRUD"
visibility: private
importance: normal
source_repo: "dj-crudo"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "experimental"
related: []
tags: ["django", "python", "postgresql", "docker", "gunicorn", "django-allauth", "google-oauth", "wifi-portal", "captive-portal", "survey", "crud", "iptables", "named-pipe", "bootstrap", "spanish", "portuguese", "devcontainer"]
problems_solved:
  - "Operators who need a self-hosted alternative to Google Forms for collecting visitor or customer intake data (name, contact, nationality, document) without depending on external SaaS."
  - "WiFi hotspot operators who need a simple captive-portal login page (Google OAuth) that gates Internet access behind authentication, with trilingual welcome messaging."
  - "Edge deployments where a containerized Django app must trigger host-level firewall (iptables) rules via a named-pipe bridge — acknowledged by the author as intentionally risky and minimal."
technologies:
  - "Django 4.0.4"
  - "Python 3.10 (Docker base image)"
  - "PostgreSQL (Docker Compose service)"
  - "Gunicorn 20.1.0"
  - "django-allauth 0.50.0 (Google social login)"
  - "django-bootstrap5 21.3"
  - "django-fontawesome-5 1.0.18"
  - "django-extensions 3.1.5"
  - "psycopg2-binary 2.9.3"
  - "Docker + Docker Compose"
  - "VS Code Dev Containers (.devcontainer/)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dj-crudo

> **Problem thesis (required):** `dj-crudo` is a private, minimal **Django CRUD application** born from the desire to replace a Google Form with something self-hosted ("because I'm a simple man with simple needs"). In practice it serves two overlapping purposes: a **WiFi captive portal** branded "KM1107 - WiFi Portal" where visitors authenticate via Google OAuth before seeing a connected message, and a **survey intake system** that stores personal data (name, email, phone, birth date, nationality, document, comment) in PostgreSQL. A distinctive — and deliberately dangerous — **host pipe bridge** lets the container send shell commands to the host through a FIFO at `/pipe`, with the stated goal of managing **iptables** on the host from inside Docker. The repo is small, Spanish/Portuguese/English-facing, Docker-first, and carries 2022-era dependencies with hardcoded dev credentials and no CI pipeline.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dj-crudo` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Self-hosted Django survey CRUD plus Google OAuth WiFi portal, with an experimental named-pipe bridge for host iptables control. |
| Audience | Internal operators running a WiFi hotspot or visitor intake kiosk; developers maintaining a minimal Django stack in Docker; not intended as a production-hardened SaaS replacement without significant security work. |

## 2. Problems it solves

### P1 — Google Form dependency for simple visitor intake

- **Who hurts:** Operators collecting new-customer or visitor information (personal data, nationality, document number, free-text comment) who do not want to rely on Google Forms or external form builders.
- **Pain today:** Google Forms ties data to a Google account, offers limited branding, and may not fit captive-portal or on-premise network contexts. Export and schema control are indirect.
- **How this repo answers:** A single `Survey` Django model (`app/survey/models.py`) captures `first_name`, `last_name`, `email`, `telephone`, `birth_date`, `nationality` (South American country choices), `document`, `comment`, and `survey_update` timestamp. Class-based `ListView` and `CreateView` under `/survey/` provide list and create flows with Bootstrap-styled templates (`survey_list.html`, `survey_form.html`). Django admin registers the model for back-office review.
- **Out of scope:** Multi-question dynamic forms, branching logic, file uploads, analytics dashboards, GDPR export tooling, and API-first mobile clients.

### P2 — WiFi captive portal with social login

- **Who hurts:** WiFi hotspot operators who need visitors to authenticate before granting Internet access, with a lightweight branded landing page.
- **Pain today:** Commercial captive-portal appliances are expensive; rolling OAuth from scratch is tedious; trilingual messaging (Spanish, Portuguese, English) is often bolted on late.
- **How this repo answers:** The root route (`/`) renders `home.html` inside a Bootstrap base template titled "KM1107 - WiFi Portal". Authenticated users see welcome/connected messages in three languages; unauthenticated users are prompted to log in. **django-allauth** provides `/accounts/` routes with **Google** as the configured social provider. `LOGIN_REDIRECT_URL` and `LOGOUT_REDIRECT_URL` point to `home`. Email is required for account authentication (`ACCOUNT_EMAIL_REQUIRED=True`, `ACCOUNT_AUTHENTICATION_METHOD='email'`). A stub function `dame_wifi()` in `survey/views.py` hints at future WiFi-grant logic that is not implemented.
- **Out of scope:** RADIUS integration, MAC-address bypass lists, bandwidth shaping, session timeout enforcement, and automated iptables ACCEPT rules wired to successful login (the pipe hook exists but is commented out).

### P3 — Container-to-host command execution for firewall control

- **Who hurts:** Developers deploying Django in Docker on a host that also runs the network edge (e.g., a Raspberry Pi or gateway box) who want the app to influence host `iptables` without SSH sidecars.
- **Pain today:** Containers cannot normally modify host firewall rules. SSH or a privileged sidecar adds operational complexity.
- **How this repo answers:** `config/pipe.py` defines `run_on_pipe(cmd)` which writes a command string into `/hostpipe` (bind-mounted from host `/pipe`). On the host, `pipe_line.sh` loops forever executing `eval "$(cat /pipe)"`. Docker Compose mounts `/pipe:/hostpipe` on the `web` service. `settings.py` imports `run_on_pipe` and includes a commented example `# run_on_pipe("iptables -L")`. The README explicitly warns about the security implications ("what can possible go wrong with it").
- **Out of scope:** Command allowlisting, audit logging, privilege separation, seccomp profiles, and any production-grade remote execution framework. This is a proof-of-concept bridge, not a hardened control plane.

## 3. Product / idea

The mental model is a **two-layer Django monolith in Docker**:

1. **Portal layer** — Google OAuth login at `/` and `/accounts/`, trilingual connected/disconnected messaging.
2. **Survey layer** — CRUD intake at `/survey/` and `/survey/new/`, backed by PostgreSQL.
3. **Host bridge layer (optional)** — Named FIFO pipe from container to host for shell command execution, intended for `iptables` management.

```
[Visitor browser]
      |
      v
[Docker web: Gunicorn or runserver]
      |-- PostgreSQL (db service)
      |-- /hostpipe --> [host /pipe FIFO] --> pipe_line.sh --> eval on host
```

The Django project lives under `app/` with settings module `config.settings`. The root `manage.py` at repo root is empty (zero bytes); the real entrypoint is `app/manage.py`. Production-oriented `docker-compose.yml` runs **Gunicorn** on port 8000; `docker-compose.override.yml` overrides for dev: runs migrations, seeds a superuser via Django shell, and starts `runserver`.

### 3.1 North-star use cases

1. **Visitor connects to WiFi** → redirected to portal home → logs in with Google → sees "You're connected to the Internet" in ES/PT/EN.
2. **Staff opens survey list** → navigates to `/survey/` → clicks "Nuevo" → submits intake form → record stored in `Survey` table.
3. **Operator on host** → creates FIFO `/pipe`, runs `pipe_line.sh` (optionally with sudo) → Django calls `run_on_pipe("iptables ...")` → command executes on host with `pipe_line.sh`'s privileges.

### 3.2 Non-goals

- Production security hardening (secrets are committed in settings; `DEBUG` defaults on; `ALLOWED_HOSTS` empty).
- Automated WiFi access grant on login (`dame_wifi` is a no-op stub).
- REST/JSON API for surveys.
- Multi-tenant or multi-survey form builder (single `Survey` model; comment in model says it "could became the father class" for future polls).
- Cloud deployment manifests or CI/CD (none present).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.10 (slim-bullseye image) | `Dockerfile` |
| Web framework | Django 4.0.4 | `requirements.txt`, `app/config/settings.py` |
| WSGI server | Gunicorn 20.1.0 | `requirements.txt`, `docker-compose.yml` command |
| Database | PostgreSQL (Compose `db` service) | `docker-compose.yml`, `settings.py` DATABASES |
| Auth | django-allauth + Google provider | `requirements.txt`, `INSTALLED_APPS`, `SOCIALACCOUNT_PROVIDERS` |
| UI | django-bootstrap5, fontawesome_5, server-rendered templates | `requirements.txt`, `app/templates/` |
| Containerization | Docker, Docker Compose 3.9 | `Dockerfile`, `docker-compose.yml`, `docker-compose.override.yml` |
| Dev environment | VS Code Dev Containers | `.devcontainer/devcontainer.json`, `.devcontainer/docker-compose.yml` |
| Host bridge | Named pipe + bash eval loop | `app/config/pipe.py`, `pipe_line.sh` |
| Tests | None evident | no `tests.py`, no pytest config |

### 4.1 Notable dependencies (curated)

- `django-allauth` — Google OAuth social login and account management under `/accounts/`.
- `django-bootstrap5` — Bootstrap 5 CSS/JS and form rendering in templates.
- `django-extensions` — installed but no evident usage in scanned source (common dev utility).
- `psycopg2-binary` — PostgreSQL adapter for Django ORM.
- `gunicorn` — production WSGI server in default Compose command.
- `PyJWT`, `oauthlib`, `requests-oauthlib` — transitive/supporting libs for allauth OAuth flow.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `app/manage.py` — Django CLI (migrations, runserver, shell).
  - `Dockerfile` — builds Python 3.10 image, copies `requirements.txt` and `app/`.
  - `docker-compose.yml` / `docker-compose.override.yml` — orchestrate `web` + `db`.
  - `pipe_line.sh` — host-side FIFO reader (must run on host, not in container).
  - `dcall.txt` — one-liner helper script invoking docker-compose down/build/up/logs.

- **Domain / core:**
  - `app/survey/models.py` — `Survey` model (visitor intake fields).
  - `app/survey/views.py` — `SurveyListView`, `SurveyCreateView`, stub `dame_wifi()`.
  - `app/survey/urls.py` — survey route namespace `survey:`.
  - `app/survey/admin.py` — registers `Survey` in admin.

- **Project config:**
  - `app/config/settings.py` — Django settings, allauth, database, pipe import.
  - `app/config/urls.py` — root URLconf: admin, accounts, home, survey include.
  - `app/config/pipe.py` — `run_on_pipe()` host command bridge.
  - `app/config/wsgi.py`, `app/config/asgi.py` — standard Django entry modules.

- **Presentation:**
  - `app/templates/base.html` — Bootstrap base, "KM1107 - WiFi Portal" title.
  - `app/templates/home.html` — portal landing (auth-gated messages).
  - `app/templates/survey/` — list and form templates.
  - `app/static/base.css` — empty placeholder.

- **Migrations:**
  - `app/survey/migrations/0001_initial.py` — creates `Survey` table.
  - `app/survey/migrations/0002_alter_survey_telephone.py` — fixes telephone verbose name.

- **Dev scaffolding:**
  - `.devcontainer/` — VS Code remote container config extending root Compose.
  - `remote-vscode/` — vendored VS Code server binaries and extensions (Python, Django, Jupyter). Large vendor tree; not application logic. Present for remote dev convenience.

- **Generated / vendor / ignored:**
  - `data/` — PostgreSQL data volume mount; listed in `.gitignore` (not scanned).
  - `remote-vscode/` — third-party editor server payload (existence noted; contents not summarized).
  - `.env` — referenced by Compose `env_file`; gitignored (not read).

- **Docs vaults / agent scaffolding:**
  - `.claude/` — **not present** (scan attempted).
  - `.docs/` — **not present** (scan attempted).
  - `docs/` — **not present**.
  - Root `README.md` — brief project description and pipe warning.

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose)

| Variable | Purpose |
|----------|---------|
| `DEBUG` | Django debug flag; defaults to `1` (on) if unset (`settings.py`). |
| `POSTGRES_NAME` | Database name for Compose web service (mirrors `postgres` default). |
| `POSTGRES_USER` | Database user for Compose web service. |
| `POSTGRES_PASSWORD` | Database password for Compose web service. |
| Compose `db` service env | `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — seed Postgres container. |

`.env` is referenced in `docker-compose.yml` via `env_file` but is gitignored; values were not read.

### Django settings highlights (shapes only)

- `SECRET_KEY` — hardcoded insecure dev key in `settings.py` (must be rotated for any real deployment; not reproduced here).
- `DATABASES['default']` — PostgreSQL engine pointing at host `db`, port 5432, static dev credentials matching Compose.
- `SOCIALACCOUNT_PROVIDERS['google']['APP']` — contains `client_id` and `secret` inline (credential leak risk; values not reproduced here).
- `SOCIALACCOUNT_LOGIN_ON_GET=True` — marked "risky fish" in source comment; enables login without POST confirmation.
- `ALLOWED_HOSTS = []` — empty; incompatible with production host headers without change.

### Docker volumes

- `./app/:/app` — live-mount application code into web container.
- `/pipe:/hostpipe` — host FIFO bind mount for pipe bridge.
- `./data/db:/var/lib/postgresql/data/` — Postgres persistence (host path; gitignored).
- `./remote-vscode:/root/.vscode-server` — dev override only (`docker-compose.override.yml`).

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | WiFi portal home; shows login prompt or connected message | session (optional) |
| `GET`/`POST` | `/admin/` | Django admin for `Survey` and users | staff session |
| `GET`/`POST` | `/accounts/login/` | allauth login | none / redirects |
| `GET` | `/accounts/logout/` | allauth logout (`ACCOUNT_LOGOUT_ON_GET=True`) | session |
| `GET` | `/accounts/google/login/` | Google OAuth initiation (`SOCIALACCOUNT_LOGIN_ON_GET=True`) | none |
| `GET` | `/accounts/google/login/callback/` | Google OAuth callback | none → session |
| `GET` | `/survey/` | List all survey records (`SurveyListView`) | unknown — no login required in view |
| `GET`/`POST` | `/survey/new/` | Create survey record (`SurveyCreateView`) | unknown — no login required in view |

No REST API, OpenAPI spec, or DRF routers exist. Survey views inherit plain `View`/`ListView`/`CreateView` without `LoginRequiredMixin`.

### 6.2 Other interfaces

- **Host pipe CLI:** Write shell command string to `/hostpipe` (container) → read from `/pipe` (host) → `eval` in `pipe_line.sh` loop.
- **Django management CLI:** Standard `manage.py` commands via `app/manage.py` inside container.
- **Docker Compose:** `web` service on port 8000, `db` service internal only.
- **Dev helper:** `dcall.txt` documents a rebuild cycle: `dc down`, remove `data`, `dc build`, `dc up -d`, `dc logs -f web`.

## 7. Data & persistence

- **Store:** PostgreSQL  (Compose service `db`, database name `postgres`).
- **Primary entity:** `Survey` — visitor intake record with personal fields and `survey_update` auto timestamp.
- **Auth entities:** Django built-in `User` plus allauth social account tables (standard allauth schema; not custom-modeled).
- **Topology:** Single-host Docker Compose. Web container talks to `db` container over Compose network. Host pipe is a bind mount outside the database layer. No edge KV, object storage, or vector index.

Migrations are dated May 2022; schema is stable and minimal (two migration files).

## 8. Docs & agent memory (required scan)

| Source | Result |
|--------|--------|
| `README.md` | Present — states Google Form replacement goal and pipe/iptables warning. |
| `docs/**` | Not present. |
| `.docs/**` | **Not present** — scan attempted, directory does not exist. |
| `.claude/**` | **Not present** — scan attempted, directory does not exist. |
| ADR / PRD / constitution | Not found. |
| `LICENSE` | MIT License (Copyright 2022 kodexArg). |

Evidence paths used: `README.md`, `app/survey/models.py` (inline model docstring about future poll generalization), `app/config/pipe.py` (docstring for pipe setup), `docker-compose.override.yml` (dev bootstrap comments).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository; this summary describes architecture without offering clone URLs as product links.
- **Auth model:** Session cookies via Django auth + allauth; Google OAuth for social login. Survey CRUD endpoints appear **unauthenticated** — anyone who can reach `/survey/new/` can submit data.
- **Credential hygiene:** `settings.py` contains a hardcoded `SECRET_KEY` and inline Google OAuth `client_id`/`secret`. `docker-compose.override.yml` seeds a superuser with fixed username/password via Django shell on container start. These are severe production risks and are **not** reproduced in this summary.
- **Pipe bridge:** `pipe_line.sh` uses unfiltered `eval` on FIFO input. Any process that can write to `/hostpipe` can execute arbitrary host commands with the script's privileges. The README and `pipe.py` docstring acknowledge this.
- **Ignored paths:** `.env`, `data/`, `db.sqlite3`, virtualenvs — not read per `.gitignore` rules.
- **This summary contains no secrets, private keys, connection strings with passwords, or scraped `.env` contents.**

## 10. Operational picture

### Local development

1. Create host FIFO: `mkfifo /pipe` with appropriate ownership and `chmod 600`.
2. Run `pipe_line.sh` on host (README implies sudo for iptables scenarios).
3. Provide `.env` if needed (gitignored).
4. `docker compose up` — override file runs migrations, creates superuser, starts `runserver` on `0.0.0.0:8000`.
5. Alternatively use `.devcontainer/` for VS Code remote development with extended Compose.

### Production-style run

Default `docker-compose.yml` (without override) uses Gunicorn: `gunicorn --bind :8000 config.wsgi:application`. Requires manual migration step (not in default command). Port 8000 published to host.

### Deployment / CI

- No `.github/workflows/`, no cloud IaC, no `wrangler.jsonc`, no Kubernetes manifests.
- Deployment model is **manual Docker Compose on a host** — consistent with WiFi gateway / edge use case.
- `remote-vscode/` suggests the author developed on a remote VS Code server attached to the container.

### Hardware / edge context

- Portal branding "KM1107" and iptables pipe bridge suggest deployment on a **network gateway appliance** (possibly Raspberry Pi class hardware, though not explicitly stated in manifests).
- Trilingual ES/PT/EN copy fits Mercosur border-region WiFi hotspots.

## 11. Open questions / unknowns

- Whether `dame_wifi()` was planned to call `run_on_pipe()` with iptables ACCEPT rules on successful OAuth login — stub is empty; pipe call in settings is commented out.
- Whether `/survey/` endpoints are intentionally public or missing `LoginRequiredMixin` is an oversight.
- Production deployment target and whether `docker-compose.override.yml` is used outside dev (it auto-creates a known superuser).
- Relationship to other `kodexArg` WiFi/gateway repos (e.g., KM-series naming) — not documented in-tree.
- Why root `manage.py` is empty while `app/manage.py` is the real entrypoint — possible packaging oversight.
- Whether Google OAuth credentials in settings are still valid or were rotated after commit.
- No test suite; regression safety for survey form and auth flows is unknown.
