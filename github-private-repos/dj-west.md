---
id: "dj-west"
title: "dj-west — Django inventory and point-of-sale for Argentine retail"
visibility: private
importance: normal
source_repo: "dj-west"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["django", "python", "inventory", "pos", "tailwind", "htmx", "django-cotton", "sqlite", "postgresql", "aws-apprunner", "docker", "argentina", "afip", "arca", "retail", "whitenoise", "waitress", "uv"]
problems_solved:
  - "Small retail operators track products, stock, suppliers, and sales across spreadsheets or ad-hoc tools, with no unified audit trail when stock changes or a sale completes."
  - "Counter staff need a fast mobile-friendly POS with real-time search, favorites, mixed payments, and automatic stock deduction — without building a heavy JavaScript SPA."
  - "Argentine retail must eventually emit compliant electronic invoices (ARCA/AFIP) and reconcile digital payments (Mercado Pago), but bolt-on fiscal fields on a simple inventory app are hard to retrofit without a deliberate data model."
technologies:
  - "Django 6"
  - "Python 3.13"
  - "uv (package manager)"
  - "Tailwind CSS 4 (django-tailwind-cli)"
  - "django-cotton 2.1"
  - "django-htmx"
  - "heroicons (Django integration)"
  - "Waitress WSGI"
  - "WhiteNoise static files"
  - "SQLite (dev) / PostgreSQL via psycopg (prod)"
  - "Docker + Docker Compose"
  - "AWS App Runner (apprunner.yaml)"
  - "AWS Secrets Manager (production secrets mapping)"
  - "sentry-sdk[django] (declared, not wired in settings)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# dj-west

> **Problem thesis (required):** `dj-west` is a private, Spanish-facing **inventory management and point-of-sale (POS)** web application for Argentine retail operations. It replaces fragmented spreadsheet workflows with a single Django monolith: CRUD for products, categories, suppliers, and clients; stock movement auditing; a session-based HTMX POS with favorites and mixed-payment validation; and a dashboard of sales KPIs. The codebase is actively preparing for **ARCA/AFIP electronic invoicing** and **Mercado Pago** reconciliation via fiscal fields on `Venta`/`ItemVenta`/`Producto`, with agent-maintained docs describing the planned `django-afip` integration. Deployment targets **AWS App Runner** with PostgreSQL, Waitress, and WhiteNoise — no separate reverse proxy.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/dj-west` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Server-rendered Django inventory + POS with Cotton components, HTMX interactivity, and AWS App Runner deployment. |
| Audience | Internal operators and counter staff at a retail location; developers and AI agents maintaining the stack; deployers configuring App Runner and RDS secrets. |

## 2. Problems it solves

### P1 — Fragmented inventory and sales tracking

- **Who hurts:** Small retail operators (owner, stock clerk, counter staff) managing SKU catalogs, supplier relationships, and daily sales without a single system of record.
- **Pain today:** Product costs, sale prices, and on-hand stock live in disconnected spreadsheets or memory. When a sale happens, stock is not decremented automatically; movement history is incomplete; low-stock situations are discovered too late.
- **How this repo answers:** A single `core` Django app models **Categoria**, **Proveedor**, **Cliente**, **Producto**, **Venta**, **ItemVenta**, and **MovimientoStock**. CRUD views cover catalog entities. Completing a sale creates `Venta` + `ItemVenta` rows, decrements `Producto.stock`, and logs a `MovimientoStock` of type `VENTA`. Manual **ENTRADA** and **AJUSTE** movements provide an audit trail. `LOW_STOCK_THRESHOLD` (default 5) drives dashboard and UI alerts via `Producto.stock_bajo`.
- **Out of scope:** Multi-store franchise management, purchase-order workflows, barcode hardware integration, and full accounting/ledger beyond sales totals.

### P2 — Slow, SPA-heavy POS alternatives for counter use

- **Who hurts:** Counter staff who need sub-second product lookup, quantity edits, discounts, and checkout on mobile or tablet form factors.
- **Pain today:** Building a React/Vue POS means duplicating validation on client and server, managing cart state, and shipping large JS bundles. Simple form posts feel sluggish without partial updates.
- **How this repo answers:** The sale module (`/sale/`) is an **HTMX-first POS**: session-backed cart, real-time product search (`sale/htmx/product-search/`), inline quantity/discount updates with **out-of-band (OOB)** total refreshes, mixed-payment validation (`sale/htmx/validate-payment/`), and `HX-Redirect` to sale detail on success. UI is composed exclusively from **django-cotton** components under `templates/cotton/` (domain components in `west/`, primitives in `ui/`, `forms/`, `layout/`). Favorites (`Producto.favorito`) surface quick picks when search is empty. Stock is locked with `select_for_update()` at checkout to prevent overselling.
- **Out of scope:** Offline-first POS, receipt printer drivers, and native mobile apps. Customer and payment UI sections are documented as partially informational with room for future hardening per `SALES_FLOW.md`.

### P3 — Fiscal and digital-payment readiness for Argentine compliance

- **Who hurts:** Operators who must eventually issue AFIP/ARCA electronic invoices and tie Mercado Pago transactions to sales records without data model rework.
- **Pain today:** Retrofitting CAE, punto de venta, QR data, and MP transaction IDs onto a naive `Venta` table breaks historical integrity if IVA rates change on products later.
- **How this repo answers:** Migrations through `0010` added **IVA alícuotas** on `Producto`, **frozen `iva_aplicado`** on `ItemVenta`, and fiscal/payment fields on `Venta` (`cliente_doc_tipo`, `cliente_doc_nro`, `afip_*`, `mp_id`, `mp_status`). Agent docs `ADECUACION_ARCA.md` and `REQUERIMIENTOS_ARCA.md` specify the target `django-afip` integration path, homologation certificates, and BDD validation scenarios. Fields exist; WSFE/MP API wiring is planned, not yet in `pyproject.toml` dependencies.
- **Out of scope:** Completed AFIP WSAA/WSFE integration, PDF ticket generation, and live Mercado Pago webhook handling (documented as future work).

## 3. Product / idea

`dj-west` follows a **semimonolithic Django pattern**: one `core` app holds domain models, forms, views, and context processors; `project/` holds settings and root URLconf; `templates/` holds page shells and Cotton component library; `static/` holds Tailwind input CSS, compiled output, fonts, and HTMX bundle.

The user mental model is **back-office + front counter**:

1. **Dashboard** (`/`) — KPI cards: product/category/supplier counts, today's sales and revenue, low-stock count, recent sales, top sellers.
2. **Catalog** — Singular English URL paths (`/product/`, `/category/`, `/supplier/`, `/client/`) with HTMX partial rendering for in-place navigation via `#main-content` in `base.html`.
3. **Stock movements** (`/movement/`) — Manual entrada/ajuste entries with observaciones.
4. **POS** (`/sale/`) — Session cart, HTMX mutations, footer totals bar, finalize with server-side validation.
5. **Admin** (`/admin/`) — Standard Django admin for power users.
6. **Dev sandbox** (`/dev/`) — Staff-only component playground.

Frontend architecture is **component-driven, zero custom JS**: Cotton enforces reusable `<c-*>` tags; HTMX handles interactivity; Tailwind 4 (`west` / `westwood` design tokens per `DESIGN_SYSTEM.md`) styles everything. Navigation is injected globally via `core.context_processors.navigation` (aside items for Ventas, Productos, Movimientos, Configuraciones dropdown).

Production runs as a **single Python process**: Waitress serves WSGI; WhiteNoise serves compressed static files from `staticfiles/` after `collectstatic`. No Nginx sidecar. App Runner build compiles Tailwind and collects statics before run.

### 3.1 North-star use cases

1. **Daily counter sale:** Staff opens `/sale/`, searches or picks favorites, adjusts quantities/discounts, selects payment method (including mixed), confirms — stock decrements, movement logged, redirect to sale detail.
2. **Restock after delivery:** Staff records an **ENTRADA** movement or edits product stock; dashboard low-stock count updates.
3. **Catalog maintenance:** Manager creates/edits products with SKU, ARS integer prices (no decimals), IVA rate, supplier, and category; toggles favorites for POS quick access.
4. **Agent-assisted development:** Read `.agent/docs/` and `.agent/rules/` (symlinked as `.claude/`) for Cotton, HTMX, modal, and styling conventions; run `uv run manage.py tailwind runserver` per `STARTUP_RULES.md`.

### 3.2 Non-goals

- Not a public API product — one legacy JSON price endpoint exists; primary surface is server-rendered HTML.
- Not multi-tenant SaaS — single-deployment inventory for one business context.
- `django-afip` and live MP integration are specified in agent docs but not shipped in current dependencies.
- No GitHub Actions CI in tree — deployment is App Runner + optional ECR push script.
- Sentry SDK is declared in `pyproject.toml` but not initialized in `project/settings.py`.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.13 | `pyproject.toml` `requires-python` |
| Package manager | uv | `pyproject.toml`, `apprunner.yaml` build, `Dockerfile` |
| Backend | Django 6.0 | `pyproject.toml`, `project/settings.py` |
| Frontend styling | Tailwind CSS 4.1.15 via django-tailwind-cli | `project/settings.py` `TAILWIND_CLI_*`, `static/css/input.css` |
| UI components | django-cotton 2.1+ | `INSTALLED_APPS`, `templates/cotton/` |
| Interactivity | django-htmx + bundled `htmx.min.js` | `INSTALLED_APPS`, `static/js/htmx.min.js`, `core/urls.py` HTMX routes |
| Icons | heroicons[django] | `pyproject.toml`, templates |
| Dev reload | django-browser-reload (DEBUG only) | `project/settings.py` |
| WSGI server | Waitress 3.x | `pyproject.toml`, `scripts/start.sh`, `Dockerfile` CMD |
| Static files | WhiteNoise CompressedManifestStaticFilesStorage | `project/settings.py` `STORAGES` |
| Data (dev) | SQLite when `DEBUG=True` | `project/settings.py` `DATABASES` |
| Data (prod) | PostgreSQL via psycopg[binary], SSL required | `project/settings.py`, `scripts/wait_for_db.py` |
| Containerization | Docker (python 3.11-slim image) + Compose dev/prod | `Dockerfile`, `docker-compose.dev.yaml`, `docker-compose.prod.yaml` |
| Cloud deploy | AWS App Runner (`apprunner.yaml`) | `apprunner.yaml`, `scripts/start.sh` |
| Observability | sentry-sdk declared; Django CSP middleware (report-only in DEBUG) | `pyproject.toml`, `project/settings.py` |
| Tests | Django `TestCase` | `core/tests.py` |
| Locale | `es-ar`, `America/Argentina/Buenos_Aires` | `project/settings.py` |

### 4.1 Notable dependencies (curated)

- `django-cotton` — Component-based templates (`<c-ui.btn>`, `<c-west.sale.item_row>`, etc.); loader prepended in `TEMPLATES`.
- `django-htmx` — `HtmxMiddleware`, `HX-Request` partial rendering, `HX-Redirect` post-sale.
- `django-tailwind-cli` — Tailwind 4 build/watch integrated with `manage.py tailwind`.
- `whitenoise` — Serves static assets from the app process; eliminates separate static host.
- `waitress` — Cross-platform production WSGI; standardized over gunicorn per README.
- `psycopg[binary]` — Production Postgres driver with SSL in `wait_for_db.py`.
- `sentry-sdk[django]` — Listed for future error tracking; not configured in settings yet.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `manage.py` — Django CLI.
  - `project/wsgi.py` / `project/asgi.py` — WSGI/ASGI apps.
  - `scripts/start.sh` — App Runner production boot (wait DB → migrate → collectstatic → superuser → waitress).
  - `entrypoint.sh` — Docker entry (wait Postgres → migrate → superuser → collectstatic → exec CMD).
- **Domain / core:**
  - `core/models.py` — All business entities (catalog, sales, stock movements, fiscal fields).
  - `core/views.py` — Dashboard, CRUD, POS HTMX handlers (~1.2k lines).
  - `core/forms.py` — Django forms for entities and sale flow.
  - `core/context_processors.py` — Aside navigation structure.
  - `core/templatetags/` — `currency_ars`, math filters for Cotton templates.
- **HTTP routing:**
  - `project/urls.py` — Admin + core include; browser-reload in DEBUG.
  - `core/urls.py` — Full route table (CRUD, sale, HTMX, legacy API).
- **Templates / UI:**
  - `templates/base.html` — Shell with `#main-content` HTMX target.
  - `templates/core/` — Page templates per domain (dashboard, sale, product, etc.).
  - `templates/cotton/` — Component library (`west/`, `ui/`, `forms/`, `layout/`, `primitives/`, `composite/`, `popover/`, `containers/`).
- **Static assets:**
  - `static/css/` — Tailwind input/output, CSS variables.
  - `static/js/htmx.min.js` — HTMX runtime.
  - `static/font/` — Custom display font (Demohirosin).
  - `static/svg/cannabis-leaf.svg` — Branding asset (suggests cannabis retail context).
- **Docs vaults:**
  - `.agent/docs/` — Architecture, business logic, schema, sales flow SSOT, ARCA requirements, design system, deployment (primary technical documentation).
  - `.agent/rules/` — Agent coding rules (Cotton, HTMX, modals, colors, commits, startup).
  - `.agent/skills/` — Task skills (cotton_component, htmx_interactivity, implement_modal, tailwind_patterns, etc.).
  - `.claude/` — Symlink to `.agent/` (gitignored at `.claude/` path; content lives in `.agent/`).
  - No `.docs/` hidden vault present in tree.
  - Root `README.md` — Spanish overview, Waitress/WhiteNoise decisions, App Runner notes.
- **Deploy / ops:**
  - `apprunner.yaml` — Build (uv, tailwind build, collectstatic) and run (`scripts/start.sh`), env + secrets mapping.
  - `build_push_ecr.sh` — Placeholder ECR push workflow (account ID placeholder).
  - `docker-compose.dev.yaml` — Local Postgres + web with volume mount.
  - `docker-compose.prod.yaml` — ECR image reference for prod-like runs.
- **Scripts:**
  - `scripts/wait_for_db.py` — Postgres readiness probe for App Runner.
  - `scripts/ensure_superuser.py` — Idempotent superuser creation from env vars.
- **Generated / vendor / ignored:**
  - `db.sqlite3`, `uv.lock` — Present in clone but gitignored; do not ingest contents.
  - `static/css/output.css` — Generated Tailwind output (gitignored).
  - `staticfiles/` — collectstatic target (created at build/runtime).

## 6. Configuration & contracts (no secrets)

### Environment variables (names + purpose)

| Variable | Purpose |
|----------|---------|
| `DEBUG` | `True` → SQLite + dev middleware; `False` → Postgres + security headers |
| `SECRET_KEY` | Django signing key (required when `DEBUG=False`; from Secrets Manager in prod) |
| `ALLOWED_HOSTS` | Comma-separated hostnames appended to localhost defaults |
| `DB_NAME` | PostgreSQL database name |
| `DB_USERNAME` / `DB_PASSWORD` | Postgres credentials (prod via Secrets Manager) |
| `DB_HOST` / `DB_PORT` | Postgres endpoint (env-configured RDS in production) |
| `DJANGO_SUPERUSER_USERNAME` | Bootstrap admin username |
| `DJANGO_SUPERUSER_PASSWORD` | Bootstrap admin password |
| `DJANGO_SUPERUSER_EMAIL` | Bootstrap admin email |
| `PORT` | Waitress listen port (default 8080 on App Runner) |

### Django settings highlights

- `LOW_STOCK_THRESHOLD = 5` — Business rule for low-stock alerts.
- `LANGUAGE_CODE = "es-ar"`, `TIME_ZONE = "America/Argentina/Buenos_Aires"`.
- CSP: report-only in DEBUG; enforced `SECURE_CONTENT_SECURITY_POLICY` in production.
- CSRF: `CSRF_COOKIE_HTTPONLY = False` to support HTMX token reads; trusted origins derived from `ALLOWED_HOSTS`.
- Static: WhiteNoise with manifest storage; Tailwind CLI paths under `static/css/`.

### Cloud bindings (App Runner)

- Secrets mapped from AWS Secrets Manager to env vars for DB credentials, `SECRET_KEY`, and superuser bootstrap (ARN references in `apprunner.yaml` — not reproduced here).
- Build uses dummy `SECRET_KEY` and `DEBUG=True` only for static collection phase.

### 6.1 HTTP / API endpoints

Primary surface is **server-rendered HTML** with HTMX partials. No REST API layer or OpenAPI spec.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Dashboard KPIs | none (open views) |
| `GET` | `/admin/` | Django admin | Django staff session |
| `GET` | `/dev/` | Component dev page | staff (`@staff_member_required`) |
| `GET` | `/profiles/` | Profiles placeholder | none |
| `GET`/`POST` | `/category/`, `/category/create/`, `/category/<pk>/edit/`, `/category/<pk>/delete/` | Category CRUD | none |
| `GET`/`POST` | `/supplier/`, `/supplier/create/`, … | Supplier CRUD | none |
| `GET`/`POST` | `/client/`, `/client/create/`, … | Client CRUD | none |
| `GET`/`POST` | `/product/`, `/product/create/`, … | Product CRUD + modals | none |
| `GET`/`POST` | `/sale/` | POS page / finalize sale | none |
| `GET` | `/sale/<pk>/` | Sale detail | none |
| `POST` | `/sale/item/<pk>/delete/` | Remove sale line item | none |
| `GET`/`POST` | `/movement/`, `/movement/create/` | Stock movement list/create | none |
| `GET` | `/sale/htmx/product-search/` | POS product search results | none |
| `POST` | `/sale/htmx/add-item/<product_id>/` | Add to session cart | CSRF |
| `POST` | `/sale/htmx/update-item/` | Update cart line qty/discount | CSRF |
| `POST` | `/sale/htmx/remove-item/<index>/` | Remove cart line | CSRF |
| `GET` | `/sale/htmx/customer-fields/` | Customer form partial | none |
| `GET` | `/sale/htmx/payment-fields/` | Payment method fields partial | none |
| `GET` | `/sale/htmx/calculate-change/` | Cash change calculation | none |
| `POST` | `/sale/htmx/validate-payment/` | Mixed payment validation | CSRF |
| `POST` | `/sale/htmx/save-draft/` | Save cart draft | CSRF |
| `GET` | `/product/<id>/detail-partial/` | Product detail HTMX partial | none |
| `POST` | `/product/<id>/favorite/toggle/` | Toggle favorite flag | CSRF |
| `GET`/`POST` | `/product/<id>/edit/modal/`, `/price/edit/`, `/delete/confirm/` | Modal workflows | none |
| `GET` | `/modal/close/` | Close modal helper | none |
| `GET` | `/background/` | Background partial | none |
| `GET` | `/api/product/<id>/price/` | Legacy JSON product price | none |
| `GET` | `/__reload__/` | django-browser-reload (DEBUG only) | none |

**Auth note:** Aside from `/admin/` and `/dev/`, application views do **not** enforce `login_required`. The POS and catalog are effectively open if deployed without network-level protection — a significant operational/security consideration.

### 6.2 Other interfaces

- **Django management commands:** `migrate`, `createsuperuser`, `collectstatic`, `tailwind` (install/build/watch/runserver).
- **Docker entrypoint:** Shell script chain before Waitress exec.
- **No CLI, MCP, Telegram, or Workers routes** in this repository.

## 7. Data & persistence

### Stores

| Environment | Engine | Location |
|-------------|--------|----------|
| Development (`DEBUG=True`) | SQLite | `db.sqlite3` at repo root (gitignored) |
| Production (`DEBUG=False`) | PostgreSQL (SSL) | Env-configured host, default port 5432 |
| Local Docker dev | PostgreSQL  | `docker-compose.dev.yaml` service `dj-west-db` |

### Entity model (by name)

- **Categoria** — Product taxonomy (`nombre` unique).
- **Proveedor** — Supplier contact info.
- **Cliente** — Registered customer for sale history.
- **Producto** — SKU, ARS integer `costo_unitario` / `precio_venta`, `stock`, `favorito`, `iva` alícuota, FK to categoria/proveedor; computed `margen_ganancia`, `stock_bajo`.
- **Venta** — Sale header: `metodo_pago` (efectivo, mp, tarjetas, transferencia, mixto), `total`, client type (walk_in/new), optional `Cliente` FK or inline name/phone, notes, AFIP fields (`afip_cae`, `afip_vto_cae`, `afip_pto_vta`, `afip_cbte_tipo`, `afip_cbte_nro`, `afip_qr_data`), MP fields (`mp_id` unique nullable, `mp_status`).
- **ItemVenta** — Line items with frozen `precio_unitario_venta`, `descuento_aplicado`, `iva_aplicado`.
- **MovimientoStock** — Audit log: `ENTRADA`, `VENTA`, `AJUSTE` with signed `cantidad`.

### Topology

Single-region cloud deployment: App Runner container → RDS PostgreSQL. Session cart lives in Django sessions (server-side). No Redis, KV, vector index, or object storage for domain data. Static assets served from container filesystem via WhiteNoise after build-time `collectstatic`.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root README** (`README.md`) — Spanish feature list, Waitress/WhiteNoise standardization, dev vs prod commands, App Runner superuser env vars.
2. **Agent docs vault** (`.agent/docs/`, accessible via `.claude` symlink):
   - `ARCHITECTURE.md` — Stack overview, monolith structure, DX suggestions (Postgres in dev, runserver vs waitress).
   - `BUSINESS_LOGIC.md` — Inventory rules, POS discount formula, mixed payment validation, dashboard KPIs.
   - `SCHEMA.md` — Table/field reference aligned with models.
   - `SALES_FLOW.md` — SSOT for HTMX sale flow, OOB totals, URL table, concurrency locks.
   - `REQUIREMENTS.md` — Python 3.13, uv, dependency list.
   - `DESIGN_SYSTEM.md` — `west` / `westwood` palettes, typography (Roboto, Raleway, Roboto Mono).
   - `COTTON_UI_AND_COMPONENTS.md` — Component directory policy, `<c-ui.btn>` API, placement rules.
   - `DEPLOYMENT.md`, `SCRIPTS_AND_DEPLOYMENT.md` — App Runner, `start.sh` responsibilities.
   - `ADECUACION_ARCA.md`, `REQUERIMIENTOS_ARCA.md` — AFIP field requirements, planned `django-afip` integration.
   - `MODALS_GUIDE.md`, `NAMING_CONVENTION.md`, `TECHNICAL_AUDIT_LOG.md` — UI patterns and conventions (referenced in tree).
3. **Agent rules** (`.agent/rules/`):
   - `COTTON_RULES.md` — Component-only UI, no external margins, HTMX-first (no inline JS).
   - `HTMX_RULES.md`, `MODAL_RULES.md`, `STYLING_RULES.md`, `COLOR_RULES.md`, `SHADCN_RULES.md`, `ICONS_RULES.md`, `NAMING_CONVENTION_RULES.md`, `COMMIT_RULES.md`, `CHAT_RULES.md` — Styling and workflow guardrails.
   - `STARTUP_RULES.md` — Mandates `uv run manage.py tailwind runserver` on port 8000.
4. **Agent skills** (`.agent/skills/`): `cotton_component`, `htmx_interactivity`, `implement_modal`, `tailwind_patterns`, `create_antigravity_rule`, `create_antigravity_skill`.
5. **Manifests:** `pyproject.toml`, `project/settings.py`, `core/urls.py`, `core/models.py`, `apprunner.yaml`, Docker/Compose files.

### `.docs/` scan

No `.docs/` directory exists in this repository. Technical documentation is concentrated in `.agent/docs/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — summary describes architecture without clone URLs as product links; `related: []` per private-repo policy.
- **Application auth:** Django auth stack is installed, but **most views lack authentication decorators**. Only `/admin/` (Django admin login) and `/dev/` (`@staff_member_required`) enforce access. Production deployments should rely on network controls (VPN, App Runner ingress rules, Cloudflare Access) or add view-level auth before exposing publicly.
- **CSRF:** Enforced on POST mutations; HTMX reads CSRF token from cookie.
- **Production hardening:** When `DEBUG=False`: SSL redirect, HSTS, secure session/CSRF cookies, enforced CSP.
- **Secrets handling:** Production credentials flow through AWS Secrets Manager → App Runner env injection. Local `docker-compose.dev.yaml` uses placeholder dev credentials (not reproduced here). This summary contains **no** secret values, PEM material, connection strings with passwords, or `.env` contents.
- **Gitignored paths:** `.claude/` entry in `.gitignore` (content served via `.agent/`); `db.sqlite3`, `uv.lock`, `output.css`, `.env*` excluded from documentation ingestion.

## 10. Operational picture

### Local development

```bash
uv sync
uv run manage.py migrate          # separate terminal per agent rules
uv run manage.py tailwind runserver   # port 8000 per STARTUP_RULES.md
```

Alternative documented in README: `uv run manage.py tailwind runserver` compiles Tailwind; `django-browser-reload` auto-refreshes browser in DEBUG.

Docker dev stack: `docker compose -f docker-compose.dev.yaml up` — Postgres + web on port 8080.

### Production deployment

1. **AWS App Runner** — Primary path via `apprunner.yaml`: build installs uv + deps, runs `tailwind build` + `collectstatic`, run invokes `scripts/start.sh` (DB wait → migrate → collectstatic → superuser → Waitress on `$PORT`).
2. **Docker / ECR** — `Dockerfile` (Python 3.11-slim) + `build_push_ecr.sh` for manual image push (placeholder account ID).
3. **No GitHub Actions** workflow files present in repository.

### Hardware constraints

None documented — standard x86_64 Linux container (`linux/amd64` in prod compose). No GPU, RPi, or edge-device targets.

## 11. Open questions / unknowns

- **AFIP/ARCA integration status:** Fiscal columns exist on models; `django-afip` is documented but not in `pyproject.toml` — emission of CAE/QR is not implemented in application code yet.
- **Mercado Pago integration status:** `mp_id` / `mp_status` fields exist; no webhook handlers or MP SDK found in dependencies.
- **Sentry:** Dependency declared; no `sentry_sdk.init()` in settings — error reporting not active.
- **Authentication strategy:** Intentional open POS vs oversight — no middleware or global login gate documented.
- **Production hostname:** `ALLOWED_HOSTS` is env-driven; actual public hostname not stated in non-secret docs reviewed.
- **Test coverage breadth:** `core/tests.py` covers models and some view behavior; full POS HTMX flow coverage unknown without running suite.
- **Python version mismatch:** `pyproject.toml` requires 3.13; `Dockerfile` uses `python:3.11-slim` — potential container drift.
- **DB env var naming:** `docker-compose.dev.yaml` uses `DB_USER` while `settings.py` and `wait_for_db.py` expect `DB_USERNAME` — local Docker DB connection may need alignment (unverified at runtime).
