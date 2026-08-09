---
id: "cotton-west"
title: "Cotton-West — cannabis club operations SaaS (spec & docs vault)"
visibility: private
importance: normal
source_repo: "cotton-west"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags:
  - "cannabis"
  - "reprocann"
  - "mendoza"
  - "compliance"
  - "traceability"
  - "django"
  - "saas"
  - "mkdocs"
  - "prd"
  - "healthcare"
  - "pos"
problems_solved:
  - "Argentine cannabis medicinal clubs must operate under dense national and Mendoza provincial regulation (REPROCANN, Resolución 1780/2025, Ley 25.326) while running both regulated dispensations and non-regulated retail — manual processes risk traceability gaps, data breaches, and license loss."
  - "Club operators lack a single authoritative, versioned specification tying legal requirements to product surfaces (POS, member portal, public store), data models, and launch milestones before implementation begins."
  - "Regulatory research, legislation excerpts, and operational reports are scattered across PDFs and informal notes — this repo centralizes them as browsable MkDocs documentation for builders, auditors, and agents."
technologies:
  - "MkDocs Material"
  - "Python 3.11+"
  - "uv"
  - "Cloudflare Pages (wrangler.toml)"
  - "Django 5.1+ (planned application)"
  - "PostgreSQL (planned)"
  - "Tailwind CSS 4 (planned)"
  - "django-htmx / django-cotton (planned)"
  - "Mercado Pago (planned)"
  - "AWS ECS/RDS/S3 (planned production target)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Cotton-West

> **Problem thesis (required):** Cotton-West addresses the operational and legal fragility of **Clubes de Cultivo de Cannabis Medicinal** in Argentina — organizations that must simultaneously sell non-regulated goods (CBD, parafernalia), dispense regulated medicinal cannabis only to REPROCANN-certified members, maintain immutable traceability from cultivation to patient, and satisfy Ley 25.326 data-protection obligations. Without integrated digital tooling, clubs face regulatory sanctions (including Mendoza Ley 9617 fines of 50–500 JUS), REPROCANN license revocation, inventory errors, and exposure of sensitive health data. **This repository** is the **specification and documentation vault** for that future SaaS product: a MkDocs Material site hosting the PRD, technical annexes, risk matrix, data model, legislation library, and sector research — status **Aprobado para Desarrollo** (approved for development), version 2.0, with an estimated 8–10 week implementation roadmap. The runnable Django application described in the PRD is **not yet present** in this tree; `main.py` is a stub and `pyproject.toml` dependencies are documentation-only.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton-west` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Private documentation monorepo for a planned SaaS platform that will let Argentine cannabis clubs run POS dispensations, a public CBD store, a REPROCANN member portal, and compliance traceability under national and Mendoza law. |
| Audience | Internal product/engineering team building Cotton-West; club operators and administrators (future end users); compliance auditors; AI agents consuming PRD and legal context for implementation. |

## 2. Problems it solves

### P1 — Regulatory non-compliance and traceability failure at cannabis clubs

- **Who hurts:** Club administrators, operators at the counter, REPROCANN-authorized members (socios), and provincial/national health inspectors.
- **Pain today:** Clubs must prove batch-level traceability from cultivation through processing, storage, transport, and final dispensación to a named socio. Manual spreadsheets and paper logs break under Resolución 1780/2025 and Mendoza Ley 9617 requirements. Dispensing to members with expired REPROCANN certificates, exceeding monthly gram quotas, or missing cartas de porte creates immediate legal exposure. Semestral reports to the Ministerio de Salud are error-prone when assembled manually.
- **How this repo answers:** The PRD (`docs/PRD.md`) and annexes define four functional surfaces — POS terminal, public store, member portal, and traceability/compliance module — with explicit use cases (UC-POS-*, UC-PS-*, UC-TP-*, UC-TC-*, UC-GA-*) and acceptance criteria per launch milestone. The data model annex (`docs/anexos/PRD-ANEXO-III-modelo-datos.md`) specifies entities (`Socio`, `ReprocannCertification`, `ProductBatch`, `Dispensation`, `TraceabilityRecord`, `ComplianceReport`) with encryption, immutability, and audit patterns. Legislation pages under `docs/legislacion/` ground each requirement in primary legal text.
- **Out of scope:** This repo does not execute dispensations, validate live REPROCANN APIs, or host production data. External shipping logistics and government API integrations are explicitly deferred (PRD §9).

### P2 — Splitting regulated vs non-regulated commerce in one club operation

- **Who hurts:** POS operators who must sell parafernalia and CBD to the general public while separately dispensing medicinal cannabis only to verified socios; finance staff reconciling mixed cash/card flows.
- **Pain today:** A single physical counter handles two legally distinct transaction types — commercial **ventas** (non-regulated) and therapeutic **dispensaciones** (regulated). Mixing them in one undifferentiated ledger complicates inventory, receipt types, and audit defense. Member discounts on non-regulated goods add pricing rules layered on top of quota enforcement for regulated goods.
- **How this repo answers:** PRD §5.1–5.3 and annex IV (`docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md`) prescribe domain-separated Django apps (`apps/pos/`, `apps/members/`, `apps/public/`, `apps/core/`) with shared core models but distinct presentation layers. Transaction model distinguishes `Transaction` types; `Dispensation` links 1:1 to regulated transactions. Use cases cover mixed payment (UC-POS-06), REPROCANN expiry rejection (UC-POS-03), and societal discounts (UC-POS-08).
- **Out of scope:** Multi-club multi-tenancy is post-launch evolution (ANEXO-V §6); MVP targets a single club instance.

### P3 — Fragmented specification before code exists

- **Who hurts:** Developers, spec-driven AI agents, and project stakeholders who need one SSOT before sprinting.
- **Pain today:** Legal research, risk analysis, stack decisions, and entity diagrams historically live in separate documents. Starting implementation without aligned specs risks rework when Mendoza provincial rules or Resolución 1780/2025 constraints surface late.
- **How this repo answers:** MkDocs Material site (`mkdocs.yml`) publishes navigable docs with Spanish UI, search, git revision dates, and minification. README and `docs/index.md` provide entry paths for product, technical, compliance, and research audiences. Annex V (`docs/anexos/PRD-ANEXO-V.md`) locks stack choices (Django monolith, PostgreSQL, Tailwind, HTMX, Mercado Pago, AWS). Risk matrix R001–R016 in `docs/anexos/PRD-ANEXO-II-riesgos-mitigacion.md` maps threats to mitigations. Informes capture sector research (`docs/informes/`).
- **Out of scope:** CI/CD pipelines, Docker compose files, and Django project scaffolding are specified in annex IV but not committed in this documentation-phase repository.

## 3. Product / idea

Cotton-West (code name; final branding chosen by the club) is conceived as a **browser-only SaaS web application** — no local install — integrating three user-facing surfaces plus a compliance backbone:

```
                    ┌─────────────────────────────────────┐
                    │         Cotton-West Monolith        │
                    │         (Django SSR — planned)      │
                    └─────────────────────────────────────┘
           ┌──────────────┬──────────────┬──────────────────┐
           ▼              ▼              ▼                  ▼
    Terminal POS    Portal Socios   Tienda Pública   Trazabilidad
    (operators)     (REPROCANN      (public CBD /     (batch → socio,
                     members)         parafernalia)      reports, audit)
           │              │              │                  │
           └──────────────┴──────────────┴──────────────────┘
                              │
                    PostgreSQL + encrypted fields
                    Mercado Pago + S3 object storage
```

**Current repository state:** The tree is a **documentation product**, not the application. Source lives in `docs/`; built static HTML is pre-generated in `site/` (MkDocs output). `wrangler.toml` configures Cloudflare Pages to build via `pip install -r requirements.txt && mkdocs build` and publish `site/`. The planned application architecture is monolithic Django with modular apps, server-side components (django-cotton), HTMX interactivity, and dual logging (immutable files + database queries) for ANMAT-grade auditability.

### 3.1 North-star use cases

1. **Operator dispensación:** Staff scans a socio's REPROCANN status at POS, verifies monthly gram quota, records batch-linked dispensación, prints differentiated receipt, and auto-decrements inventory (UC-POS-02, UC-POS-07).
2. **Member self-service:** Authorized socio logs into portal, views cupo restante, downloads certificate, requests data rectification under Ley 25.326, schedules next pickup (UC-PS-04, UC-PS-06, UC-PS-08).
3. **Public e-commerce:** Visitor buys CBD oil online with Mercado Pago checkout; no access to medicinal catalog (UC-TP-01).
4. **Compliance officer / inspector:** Administrator generates semestral Ministerio de Salud report; inspector traces a dispensed batch back to cultivation records and carta de porte (UC-GA-01, UC-TC-02).
5. **Agent / builder (this repo today):** Engineer or AI agent reads PRD + annexes + legislation vault to implement Milestone 1 foundation without guessing regulatory constraints.

### 3.2 Non-goals

- External shipping logistics and third-party courier integration (PRD §9).
- Self-describing infrastructure documentation inside the product scope (PRD §9).
- Microservices architecture at MVP — monolith chosen for small team and ACID traceability (ANEXO-V §7).
- Live government API integration at launch — validation may use uploaded certificate documents with future API hook (marco normativo §1, Decreto 883/2020 fallback note).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language (this repo) | Python ≥3.11 | `pyproject.toml` `requires-python` |
| Runtime / language (planned app) | Python 3.12, Django 5.1+ | `docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md` §2.1 |
| Documentation site | MkDocs 1.6, Material theme 9.5, pymdown-extensions | `pyproject.toml`, `requirements.txt`, `mkdocs.yml` |
| Package manager | uv (lockfile gitignored) | `README.md`, `uv.lock` present but ignored per `.gitignore` |
| Frontend (planned app) | Tailwind CSS 4, django-tailwind-cli, django-shadcn, django-htmx, django-cotton | `docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md` §4 |
| Backend / API (planned) | Django monolith, DRF for future REST, django-allauth | `docs/anexos/PRD-ANEXO-V.md` §4.1, ANEXO-IV §8 |
| Data (planned) | PostgreSQL 15, Redis (cache/sessions), S3-compatible object storage | ANEXO-IV §9.2, ANEXO-V §4.3 |
| Payments (planned) | Mercado Pago webhooks | PRD §5, ANEXO-IV §2.3 |
| Infra / deploy (docs) | Cloudflare Pages via `wrangler.toml` | `wrangler.toml` |
| Infra / deploy (planned app) | Docker multi-stage, Docker Compose dev, AWS ECS + RDS, GitHub Actions CI/CD | ANEXO-IV §9–10, ANEXO-V §4.3 |
| AI / agents | Spec-kit regulatory templates referenced in ANEXO-IV §11; no `.claude/` committed | ANEXO-IV §11.3 |
| Tests (planned) | pytest-django, factory-boy, pre-commit, black, ruff | ANEXO-IV §5.2 |
| Observability (planned) | loguru, Sentry, optional Prometheus/Grafana | ANEXO-IV §7.3, ANEXO-V §4.5 |

### 4.1 Notable dependencies (curated)

- `mkdocs-material` — Spanish-localized documentation theme with search, tabs, and dark mode (`mkdocs.yml`).
- `mkdocs-git-revision-date-localized-plugin` — timeago revision stamps on doc pages.
- `mkdocs-minify-plugin` — HTML minification for published site.
- `pymdown-extensions` — Mermaid diagrams, tabbed content, admonitions in PRD annexes.
- `django-simple-history` (planned) — automatic model change history for audit models.
- `django-cryptography` (planned) — field-level encryption for DNI, address, medical fields per ANEXO-III.
- `django-auditlog` / custom `AuditLog` entities (planned) — access logging for sensitive records.

## 5. Repository map (abstraction)

- **Entrypoints:** `main.py` — stub hello-world only; not the application entry. Real doc entry: `docs/index.md`. Build entry: `mkdocs.yml`. Deploy config: `wrangler.toml`.
- **Domain / core (planned, documented only):** Business rules and shared models described in `docs/anexos/PRD-ANEXO-III-modelo-datos.md` and PRD §8 — not implemented as Python modules yet. Planned layout `apps/core/` per ANEXO-IV §3.
- **Adapters (planned):** Mercado Pago payment adapter, SMTP/SMS notifications, S3 file storage for certificates and informed-consent PDFs — specified in ANEXO-V §4.4.
- **Docs vaults:**
  - `docs/PRD.md` — master product requirements (489+ lines).
  - `docs/anexos/` — PRD annexes I–V (normative framework, risks, data model, use cases/stack, technology stack).
  - `docs/informes/` — sector research and mandatory socio data specification.
  - `docs/legislacion/` — full-text legislation markdown for nine national and provincial acts/decrees/resolutions.
  - `site/` — pre-built MkDocs static output (HTML, assets, search index).
- **Agent scaffolding:** `.claude/` listed in `.gitignore` and **not present** in clone. No `.docs/`, `.agents/`, or `SKILL.md`. Spec-kit structure referenced in ANEXO-IV §11.3 as future `.trae/spec-kit/` — not in tree.
- **Generated / vendor:** `site/` is MkDocs build output; `uv.lock` gitignored. Lunr search workers and minified JS/CSS under `site/assets/` — do not ingest for RAG content.

## 6. Configuration & contracts (no secrets)

### Documentation build

- `mkdocs.yml` — site name, Spanish Material theme, nav tree, plugins (search, git dates, authors, minify), markdown extensions.
- `wrangler.toml` — Cloudflare Pages: `build_command` runs pip + mkdocs build; `build_output_dir` = `site`; `compatibility_date` set.
- `pyproject.toml` — project metadata, MkDocs dependency set only (no Django deps in this repo).

### Planned application environment (from annexes — not wired in repo)

- `DATABASE_URL` — PostgreSQL connection (django-environ).
- Redis URL — sessions/cache (Docker Compose dev per ANEXO-IV §9.2).
- Mercado Pago API keys — payment processing (names only; never committed).
- AWS/S3 credentials — static files, certificate PDFs, DB backups.
- SMTP settings — transactional email via django-allauth.
- `DJANGO_SECRET_KEY`, `ALLOWED_HOSTS`, `DEBUG` — standard Django env pattern referenced in ANEXO-IV Docker Compose section.

### 6.1 HTTP / API endpoints (when applicable)

**This repository:** No HTTP server or API. MkDocs `serve` exposes a local dev preview only (`uv run mkdocs serve`). Published static site has no backend routes.

**Planned Cotton-West application (documented, not implemented):**

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | POS routes under `apps/pos/` | Sales and dispensación UI (SSR) | Operator role |
| N/A | Member routes under `apps/members/` | Portal autogestión | Socio session |
| N/A | Public routes under `apps/public/` | Store catalog and checkout | Public / optional member |
| `GET` | Future DRF analytics endpoints | PowerBI anonymized exports (ANEXO-IV §8.2) | Admin / API token |
| `GET` | Future member API | Personal consumption history, quota | Socio token |
| N/A | Django Admin | Internal operations | Staff |

No OpenAPI spec or `urls.py` exists in this repo. DRF + drf-spectacular planned for post-MVP API (ANEXO-IV §8.1).

### 6.2 Other interfaces

- **MkDocs CLI:** `uv run mkdocs serve`, `uv run mkdocs build`, `uv run mkdocs gh-deploy` (`README.md`).
- **Cloudflare Pages:** static deploy from `site/` after build (`wrangler.toml`).
- **Future Mercado Pago webhooks:** payment confirmation for e-commerce and membership fees.
- **Future QR/RFID scanning at POS:** batch verification (UC-TC-06) — hardware interface unspecified.

## 7. Data & persistence

**In this repo:** No database. Content is Markdown in `docs/`. Search index JSON in `site/search/search_index.json` (generated).

**Planned application (from ANEXO-III):**

- **Primary store:** PostgreSQL with 3NF schema, JSON fields where needed, full-text search on product catalog.
- **Cache/session:** Redis (dev compose).
- **Object storage:** S3-compatible for `document_file` on `ReprocannCertification`, informed consent PDFs, product images.
- **Key entities:** `User`, `UserProfile`, `Role`, `Socio`, `ReprocannCertification`, `MembershipAgreement`, `Product`, `CannabisProductDetails`, `ProductPrice`, `ProductBatch`, `Inventory`, `Transaction`, `TransactionItem`, `Payment`, `Dispensation`, `TraceabilityRecord`, `CultivationRecord`, `TransportRecord`, `ComplianceReport`, `AuditLog`, `DataAccessLog`, `SystemEventLog`.
- **Encryption:** Field-level AES for DNI, addresses, medical indication, doctor names (`django-cryptography` pattern).
- **Immutability:** Hash-chained or signed traceability records; `django-simple-history` on critical models.
- **Topology:** Cloud-hosted monolith (AWS target) with edge-static docs on Cloudflare Pages for this specification repo; production app expects RDS PostgreSQL in-region for data residency sensitivity.

## 8. Docs & agent memory (required scan)

1. **Root README** (`README.md`) — project overview, doc structure map, MkDocs dev commands, quick navigation by audience. Evidence: `README.md`.
2. **Docs index** (`docs/index.md`) — product pitch, three surfaces, compliance laws listed, project status v2.0 approved for development. Evidence: `docs/index.md`.
3. **Master PRD** (`docs/PRD.md`) — executive summary, problem space, users, features, use cases, data architecture summary, scope limits, launch milestones, risk summary. Evidence: `docs/PRD.md`.
4. **Annex I — Marco normativo** (`docs/anexos/PRD-ANEXO-I-marco-normativo.md`) — maps Ley 27.350, Decreto 883/2020, Res. 1780/2025, Ley 25.326, Ley 9617 Mendoza to software obligations. Evidence: path above.
5. **Annex II — Riesgos** (`docs/anexos/PRD-ANEXO-II-riesgos-mitigacion.md`) — R001–R016 risk IDs with mitigation strategies. Evidence: path above.
6. **Annex III — Modelo de datos** (`docs/anexos/PRD-ANEXO-III-modelo-datos.md`) — full entity specs with fields, encryption notes, relationships. Evidence: path above.
7. **Annex III diagrams** (`docs/anexos/PRD-ANEXO-III-diagramas-mermaid.md`) — Mermaid ER diagrams. Evidence: path above.
8. **Annex IV — Stack / use cases** (`docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md`) — Django app layout, docker, CI/CD, spec-kit, DRF future API. Evidence: path above.
9. **Annex V — Stack tecnológico** (`docs/anexos/PRD-ANEXO-V.md`) — architecture layers, security, evolution phases. Evidence: path above.
10. **Informes** (`docs/informes/`) — REPROCANN club report, Argentina regulatory guide, mandatory socio data fields. Evidence: `docs/informes/datos-obligatorios-socios.md` and siblings.
11. **Legislación** (`docs/legislacion/`) — nine markdown statutes for RAG grounding. Evidence: `docs/legislacion/ley-27350-cannabis-medicinal.md` et al.
12. **`.claude/`** — **not present** (gitignored in `.gitignore`; directory absent in shallow clone).
13. **`.docs/`** — **not present**.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — specification for a regulated health-adjacent product; no public clone promotion in related frontmatter (`related: []`).
- **Auth model (planned app):** django-allauth with email verification, optional social OAuth (Google/Facebook), MFA for critical ops, granular roles (Admin, Operador POS, Consultor, Socio, Cliente Casual). Session-based SSR with CSRF protection.
- **Data protection:** Ley 25.326 drives encryption, consent tracking, member self-service rectification/suppression, and `DataAccessLog` for medical record views.
- **This summary:** Contains no secrets, tokens, `.env` values, or certificate contents. Legislation excerpts are public legal text. No scraped credentials.
- **Repo hygiene:** `.gitignore` excludes `.claude/` and `uv.lock`; build artifacts in `site/` are tracked (not ignored) — treat as generated mirror of `docs/`.

## 10. Operational picture

### Local development (documentation)

```bash
uv sync
uv run mkdocs serve    # local preview
uv run mkdocs build    # output to site/
```

Alternative: `pip install -r requirements.txt` per `wrangler.toml` build path.

### Deployment (documentation site)

- Cloudflare Pages build per `wrangler.toml` — installs requirements, runs `mkdocs build`, publishes `site/`.
- README also documents `uv run mkdocs gh-deploy` for GitHub Pages path (historical/alternate).
- No `.github/workflows/` in clone — CI for the planned Django app specified in ANEXO-IV §10 but not committed.

### Planned application operations (from specs)

- Docker Compose dev: web + PostgreSQL 15 + Redis (`dev-setup.sh` referenced in ANEXO-IV).
- Staging auto-deploy from develop branch; production manual approval from main (GitHub Actions pipeline described).
- Backups: weekly export UC-CR-07; S3 DB backups; 99.9% availability target.
- Hardware: browser-only clients; POS may use QR scanners — no GPU or RPi constraints.

## 11. Open questions / unknowns

- **Application code location:** No Django project, `apps/`, `Dockerfile`, or `docker-compose.yml` in this repo — unclear whether implementation will live in the same repository or a future sibling (e.g. `cotton-west-app`). Milestone 1 deliverable lists "repositorio configurado con CI/CD" but not yet present here.
- **REPROCANN API integration:** Marco normativo mentions live validation vs document upload fallback; no API contract or endpoint list in tree.
- **Mendoza provincial registry sync:** Double registration (national + provincial) required per Ley 9617 — integration mechanism unspecified beyond "sincroniza" in PRD.
- **`.claude/` / spec-kit:** ANEXO-IV references `.trae/spec-kit/` regulatory automation — directory not in clone; agent harness may live locally gitignored.
- **Default branch hosting target:** `mkdocs.yml` `site_url` points to GitHub Pages pattern while `wrangler.toml` targets Cloudflare Pages — which is canonical production for docs is ambiguous.
- **Multi-tenancy timeline:** Post-launch only per ANEXO-V — MVP single-club assumption may limit reuse for other clubs without fork-per-client.
- **Test coverage:** pytest stack named in annex IV but zero test files in repository.
- **GitHub description:** Empty at assignment time — no additional GitHub metadata beyond repo name.
