---
id: "cotton"
title: "Cotton — Cotton-West PRD, regulatory docs, and MkDocs knowledge base"
visibility: private
importance: high
source_repo: "cotton"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "documentation"
status: "active"
related: []
tags:
  - "cotton-west"
  - "cannabis-medicinal"
  - "reprocann"
  - "mkdocs"
  - "prd"
  - "compliance"
  - "django-planned"
  - "mendoza"
  - "traceability"
  - "saas-spec"
  - "cloudflare-pages"
problems_solved:
  - "Medicinal cannabis clubs in Argentina lack a single auditable system to separate regulated dispensations from public retail, validate REPROCANN certifications, and maintain batch-to-member traceability required by national and Mendoza provincial law."
  - "Club operators face legal and operational risk from manual spreadsheets, lost traceability, mishandled health data under Ley 25.326, and inability to produce mandatory semiannual Ministry of Health reports."
  - "Engineering and compliance stakeholders need a centralized, versioned specification vault (PRD, annexes, legislation, risk matrix, data model) before the Cotton-West application codebase is implemented."
technologies:
  - "MkDocs 1.6"
  - "MkDocs Material 9.5"
  - "Python 3.11+"
  - "uv (dependency management)"
  - "Cloudflare Pages (wrangler.toml)"
  - "Django 5.1+ (planned application stack)"
  - "PostgreSQL 15 (planned)"
  - "Tailwind CSS 4 / django-cotton / HTMX (planned)"
  - "Mercado Pago (planned integration)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Cotton (Cotton-West)

> **Problem thesis (required):** The `cotton` repository is the **private documentation and product-specification vault** for **Cotton-West** — a planned SaaS web application for Argentine medicinal cannabis cultivation clubs. The repo does **not** yet contain the Django application itself; it holds the authoritative PRD, technical annexes, regulatory research, legislation transcriptions, risk analysis, and a published MkDocs Material static site. The product it specifies solves the club operator's core pain: operating legally under REPROCANN, Ley 27.350, Resolución 1780/2025, Ley 25.326, and Mendoza Ley 9617 by unifying POS dispensations, public e-commerce for non-regulated goods, member self-service, and immutable cultivation-to-dispensation traceability in one auditable system.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/cotton` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Private MkDocs-backed specification hub for Cotton-West — an integrated club-management SaaS covering POS, member portal, public store, REPROCANN compliance, and full product traceability for Argentina (Mendoza focus). |
| Audience | Internal kodexArg engineers and agents implementing Cotton-West; club administrators and operators (future end users); compliance officers; auditors and health inspectors (future report consumers). |

**Naming note:** README and `mkdocs.yml` still reference a public sibling name `cotton-west` and a GitHub Pages destination under the kodexArg org. The swarm assignment targets the **private** repo slug `cotton`. Treat `cotton` as the canonical private spec vault; the public docs mirror may live under a differently named repository.

## 2. Problems it solves

### P1 — Regulatory non-compliance and traceability gaps at cannabis clubs

- **Who hurts:** Club directors, POS operators, and compliance officers at REPROCANN-registered cultivation clubs in Argentina (especially Mendoza under Ley 9617 double-registration rules).
- **Pain today:** Manual processes lose batch-to-member traceability; expired REPROCANN certificates go undetected at the counter; semiannual Ministry reports are assembled ad hoc; exceeding authorized plant counts or dispensing without valid documentation exposes clubs to fines (50–500 JUS under Mendoza) or license revocation.
- **How this repo answers:** The PRD and annexes define a system that validates REPROCANN at point of dispensación, enforces monthly quotas, records immutable lot movements from harvest through delivery, generates regulatory reports, and maintains cartas de porte documentation. This repository captures those requirements in `docs/PRD.md`, `docs/anexos/PRD-ANEXO-I-marco-normativo.md`, `docs/anexos/PRD-ANEXO-III-modelo-datos.md`, and supporting legislation files under `docs/legislacion/`.
- **Out of scope:** The repo does not run dispensations or connect to government APIs today — it specifies behavior for a future application. External shipping logistics and club infrastructure are explicitly excluded from Cotton-West scope per PRD §9.

### P2 — Operational confusion between regulated and non-regulated commerce

- **Who hurts:** Front-desk operators who must sell CBD/parafernalia to the general public while separately dispensing medicinal cannabis only to authorized members with valid certifications.
- **Pain today:** A single manual workflow mixes retail sales and therapeutic handoffs, causing inventory errors, financial reconciliation gaps, and accidental dispensations to unqualified persons.
- **How this repo answers:** The PRD defines three differentiated surfaces — Terminal POS (sales vs dispensaciones), Tienda Pública (unauthenticated catalog for non-regulated products), and Portal de Socios (authenticated self-service for members) — with 50+ enumerated use cases in `docs/PRD.md` §6 and detailed domain separation in `docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md` (`apps/pos/`, `apps/members/`, `apps/public/`, `apps/core/`).
- **Out of scope:** Payment processor internals (Mercado Pago is an integration boundary, not owned code); third-party delivery carriers.

### P3 — Sensitive health data exposure and member rights under Ley 25.326

- **Who hurts:** Club members (patients) whose DNI, address, medical indication, and REPROCANN documents must be protected; club staff who access medical records.
- **Pain today:** Paper files and unstructured spreadsheets lack encryption, access logging, and self-service rectification/suppression workflows required by Argentina's personal data protection law.
- **How this repo answers:** The data model annex specifies field-level encryption for DNI and addresses (`Socio` entity), audit logging, member portal rights (UC-PS-04 rectification), and `ReprocannCertification` document storage requirements. Research report `docs/informes/datos-obligatorios-socios.md` maps mandatory vs important fields per REPROCANN and Resolución 1780/2025.
- **Out of scope:** Legal advice; the repo documents compliance intent, not certified legal opinions.

### P4 — Fragmented specification before implementation (meta-problem this repo directly solves)

- **Who hurts:** Developers, AI agents, and project stakeholders who need one SSOT for requirements, stack decisions, and regulatory context.
- **Pain today:** Without a consolidated vault, implementation would start from scattered notes, risking drift from Mendoza-specific rules and inconsistent data model assumptions.
- **How this repo answers:** MkDocs Material site with navigable PRD, five annexes, three research informes, and ten legislation markdown files — buildable via `uv run mkdocs build` and deployable per `wrangler.toml` Cloudflare Pages config.
- **Out of scope:** CI/CD for the future Django app (described in annex IV but not present in tree); application source code.

## 3. Product / idea

**Cotton-West** (codename; final branding TBD per club) is conceived as a **browser-based SaaS monolith** serving three presentation layers over shared business logic:

```
                    ┌─────────────────────────────────────┐
                    │     Cotton-West Monolith (planned)   │
                    │  Django SSR + HTMX + django-cotton   │
                    └─────────────────────────────────────┘
           ┌────────────────┬────────────────┬──────────────────┐
           ▼                ▼                ▼                  ▼
    Terminal POS      Portal Socios    Tienda Pública    Trazabilidad /
    (operators)       (REPROCANN         (public CBD &      Reportes
                       members)           parafernalia)      cumplimiento
           │                │                │                  │
           └────────────────┴────────────────┴──────────────────┘
                                    │
                           PostgreSQL + encrypted
                           fields + audit logs
                                    │
                           Mercado Pago / S3 storage
```

The **current repository** implements only the **documentation layer** of this vision: Markdown sources in `docs/`, static HTML output in `site/`, and Python tooling to build and serve the docs. `main.py` is a placeholder stub (`Hello from cotton-west!`) with no application logic.

**Project status per PRD:** Version 2.0, November 2025, **Aprobado para Desarrollo**, estimated 8–10 weeks across four milestones (foundation → POS → portals → production hardening).

### 3.1 North-star use cases

1. **Operator dispensación:** POS clerk scans member REPROCANN, verifies monthly quota, records lot-linked handoff, updates inventory, prints differentiated receipt (UC-POS-02, UC-POS-07).
2. **Member self-service:** Authorized socio consults dispensación history, downloads certificate, requests data rectification under Ley 25.326 (UC-PS-02, UC-PS-04, UC-PS-07).
3. **Public retail:** Visitor purchases CBD oil online without seeing medicinal catalog; educational content explains REPROCANN enrollment (UC-TP-01, UC-TP-05).
4. **Compliance audit:** Inspector traces a dispensed lot from harvest through processing to final member; administrator exports semiannual Ministry report (UC-TC-02, UC-GA-01).
5. **Documentation consumer (this repo today):** Engineer or agent reads PRD + annexes + legislation to implement models, views, and compliance checks without guessing regulatory requirements.

### 3.2 Non-goals

- Own logistics/shipping carrier integration (explicit PRD §9 exclusion).
- Multi-tenant expansion to other clubs is post-launch roadmap only (ANEXO-V §6 Phase Post-Lanzamiento).
- Microservices architecture — explicitly rejected for small team; monolith chosen (ANEXO-V §7).
- Infrastructure self-documentation inside the product (PRD §9: Cotton-West does not expose its own infra details to end users).

## 4. Technology stack

### 4.0 What exists in this repository today

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.11 | `pyproject.toml` `requires-python` |
| Documentation site | MkDocs 1.6 + Material 9.5 | `pyproject.toml`, `requirements.txt`, `mkdocs.yml` |
| Doc plugins | search, git-revision-date-localized, git-authors, minify | `mkdocs.yml` `plugins` |
| Markdown extensions | pymdownx (tabs, superfences, emoji), admonition, TOC | `mkdocs.yml` `markdown_extensions` |
| Dependency manager | uv (preferred); pip fallback | `README.md`, `pyproject.toml`; `uv.lock` gitignored |
| Static site output | Pre-built HTML in `site/` | `site/index.html`, `wrangler.toml` `build_output_dir` |
| Deploy target (docs) | Cloudflare Pages | `wrangler.toml` `[pages]` |
| Application code | **None** — placeholder only | `main.py` |

### 4.1 Planned application stack (specified, not implemented in this repo)

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Backend | Django 5.1+ monolith | `docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md`, `docs/anexos/PRD-ANEXO-V.md` |
| API (future) | Django REST Framework 3.14+, drf-spectacular OpenAPI | `docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md` §8 |
| ORM / history | django-model-utils, django-simple-history, django-auditlog | ANEXO-IV §2–7, ANEXO-V §4.1 |
| Auth | django-allauth (email verification, OAuth, MFA) | ANEXO-IV §6, ANEXO-V §5.2 |
| Frontend | django-cotton 1.0+, Tailwind CSS 4 via django-tailwind-cli, django-shadcn, HTMX | ANEXO-IV §4 |
| Database | PostgreSQL 15 | ANEXO-IV §9.2 Docker Compose spec |
| Cache / sessions | Redis | ANEXO-IV §9.2 |
| Payments | Mercado Pago webhooks | `docs/PRD.md` §5, ANEXO-IV §2.3 |
| Encryption | django-cryptography (field-level AES-256) | `docs/anexos/PRD-ANEXO-III-modelo-datos.md` §2.1 |
| Infra (planned) | AWS ECS + RDS, Docker multi-stage, S3 object storage | ANEXO-IV §9–10, ANEXO-V §4.3 |
| CI/CD (planned) | GitHub Actions (test → build → deploy staging/prod) | ANEXO-IV §10 |
| Observability (planned) | Sentry, structured logging, optional Prometheus/Grafana | ANEXO-V §4.5 |
| Tests (planned) | pytest-django, factory-boy, black, ruff, pre-commit | ANEXO-IV §5.2 |

### 4.2 Notable dependencies (curated — docs repo only)

- `mkdocs-material` — Material Design theme with Spanish UI, tabbed navigation, search highlighting (`mkdocs.yml`).
- `mkdocs-git-revision-date-localized-plugin` — per-page last-updated timestamps with timeago display.
- `mkdocs-minify-plugin` — HTML minification for production `site/` output.
- `pymdown-extensions` — Mermaid diagram support, tabbed content, syntax highlighting for annex diagrams (`docs/anexos/PRD-ANEXO-III-diagramas-mermaid.md`).

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `main.py` — placeholder Python entry (no app server).
  - `mkdocs.yml` — documentation site configuration and navigation tree.
  - `wrangler.toml` — Cloudflare Pages build/deploy contract for static docs.

- **Domain / core (documentation):**
  - `docs/PRD.md` — master product requirements (13 sections, 50+ use cases, 4 milestones).
  - `docs/anexos/` — five PRD annexes: regulatory framework (I), risk matrix R001–R016 (II), data model entities (III), stack/use-case architecture (IV), technology decisions (V), plus Mermaid ER diagrams.
  - `docs/informes/` — three research reports on REPROCANN clubs, regulatory landscape, and mandatory member data fields.
  - `docs/legislacion/` — ten markdown transcriptions/summaries of Argentine national and Mendoza provincial cannabis and data-protection laws.

- **Adapters:**
  - None for application I/O. Docs build adapter: MkDocs reads `docs/`, emits `site/`.

- **Docs vaults:**
  - `docs/` — primary authoring tree (in scope, fully scanned).
  - `.docs/` — **not present** in clone.
  - `site/` — committed static build artifact (HTML, CSS, JS, search index); treat as generated output, not source of truth.

- **Agent scaffolding:**
  - `.claude/` — listed in `.gitignore`; **not present** in shallow clone (respect gitignore; cannot summarize contents).
  - No `AGENTS.md`, `SKILL.md`, or `.agents/` tree found.

- **Generated / vendor:**
  - `site/` — full MkDocs Material build including lunr search workers and minified assets.
  - `uv.lock` — gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

### Docs build environment

- **MkDocs site name:** Cotton West (`mkdocs.yml` `site_name`).
- **Docs source dir:** `docs/` (`mkdocs.yml` `docs_dir`).
- **Theme language:** Spanish (`mkdocs.yml` `theme.language: es`).
- **Cloudflare Pages build:** `pip install -r requirements.txt && mkdocs build` → output `site/` (`wrangler.toml`).
- **Compatibility date:** 2025-11-07 (`wrangler.toml`).

### Planned application configuration (from annexes — not wired in this repo)

- **Environment management:** `django-environ` reading `.env` in development (ANNEXO-IV §9.2 mentions `.env`; no `.env` files present or read).
- **Docker Compose services (planned):** `web`, `db` (PostgreSQL 15), `redis` (ANNEXO-IV §9.2).
- **Roles (planned):** Admin, Operador POS, Consultor, Socio, Cliente Casual (ANNEXO-IV §6.2).
- **Feature flags / spec-kit (planned):** `.trae/spec-kit/` regulatory templates mentioned in ANEXO-IV §11.3 — **not present** in current tree.

### 6.1 HTTP / API endpoints

**Application API:** Not implemented. ANNEXO-IV §8 describes future DRF endpoints for PowerBI analytics and member portal consumption, with OpenAPI via drf-spectacular — no route modules exist in this repository.

**Documentation site:** Static HTML only after `mkdocs build`. No server-side routes in repo. Local dev serves via `uv run mkdocs serve` (default MkDocs dev server on port 8000 per MkDocs convention — not hardcoded in tree).

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| N/A | N/A | No application HTTP surface in this repository | N/A |

**Static site paths (representative, post-build):** `/`, `/PRD/`, `/legislacion/*`, `/informes/*`, `/anexos/*` — mirrored under `site/` directory structure.

### 6.2 Other interfaces

- **CLI (docs):** `uv run mkdocs serve`, `uv run mkdocs build`, `uv run mkdocs gh-deploy` (`README.md`).
- **CLI (placeholder):** `python main.py` prints greeting only.
- **Planned CLI/scripts:** `dev-setup.sh` for Docker onboarding (ANNEXO-IV §9.3) — not in tree.
- **Planned webhooks:** Mercado Pago payment confirmation (PRD §5.1, ANEXO-V §4.4).
- **Planned QR/RFID:** Lot scanning at POS (PRD §5.4, UC-TC-06).

## 7. Data & persistence

**In this repository:** No database. Content is Markdown files versioned in Git. Search index is static JSON (`site/search/search_index.json`).

**Planned application data model** (from `docs/anexos/PRD-ANEXO-III-modelo-datos.md`):

- **Identity:** `User`, `UserProfile`, `Role`, `Permission` (extends Django auth).
- **Members / REPROCANN:** `Socio` (encrypted PII, membership status machine: CANDIDATE → PENDING_REPROCANN → ACTIVE → SUSPENDED → INACTIVE), `ReprocannCertification` (monthly gram quota, document files, validation status).
- **Products / inventory:** Product catalog split by type (parafernalia, CBD, medicinal cannabis), `Lote` (batch codes), real-time stock with alerts.
- **Operations:** Differentiated transactions for ventas vs dispensaciones, payment methods, daily cash reconciliation.
- **Traceability:** Immutable movement logs, cultivation records, cartas de porte, hash-protected audit trail.
- **Storage topology (planned):** PostgreSQL primary store on AWS RDS; S3-compatible object storage for certificates, informed consent PDFs, and static media; Redis for cache/sessions.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **Root README** — project overview, directory map, MkDocs dev commands, links to all major doc sections (`README.md`).
2. **Docs home** — navigation guide, feature summary, project status v2.0 (`docs/index.md`).
3. **Master PRD** — full product definition: three surfaces, 50+ use cases, milestones, risks summary, scope boundaries (`docs/PRD.md`).
4. **ANEXO I** — Argentine/Mendoza regulatory mapping to software features (`docs/anexos/PRD-ANEXO-I-marco-normativo.md`).
5. **ANEXO II** — risk matrix R001–R016 with criticality ratings (`docs/anexos/PRD-ANEXO-II-riesgos-mitigacion.md`).
6. **ANEXO III** — entity-level data model with encryption and audit patterns (`docs/anexos/PRD-ANEXO-III-modelo-datos.md`).
7. **ANEXO IV** — Django monolith architecture, domain apps, Docker/CI/CD, spec-kit AI workflow (`docs/anexos/PRD-ANEXO-IV-stack-tecnologico.md`).
8. **ANEXO V** — technology decision rationale, security, evolution phases (`docs/anexos/PRD-ANEXO-V.md`).
9. **Member data report** — mandatory vs important fields per REPROCANN (`docs/informes/datos-obligatorios-socios.md`).
10. **Legislation corpus** — ten files under `docs/legislacion/` covering Ley 27.350, Decreto 883/2020, Resolución 1780/2025, Ley 25.326, Ley 9617 Mendoza, and related decrees/resolutions.
11. **MkDocs config** — full navigation tree and plugin stack (`mkdocs.yml`).
12. **Python manifests** — `pyproject.toml`, `requirements.txt`.
13. **Deploy config** — `wrangler.toml`.

### Agent directories scan result

- **`.claude/`:** Listed in `.gitignore`; directory absent from clone. Cannot summarize agent instructions — likely local-only or not yet committed.
- **`.docs/`:** Not present.
- **No `AGENTS.md` or harness files** found at repository root.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — specification contains sensitive domain knowledge (cannabis regulatory compliance, member data model). This summary contains no secrets, credentials, or `.env` values.
- **Auth model (planned app):** django-allauth with email verification, optional OAuth providers, MFA for critical operations, role-based access per surface (POS vs portal vs public).
- **Data protection (planned):** AES-256 field encryption for DNI, addresses, medical fields; immutable audit logs; member self-service for Ley 25.326 rights.
- **Docs repo risk:** README references public GitHub Pages deployment for documentation — PRD content is regulatory/operational, not member PII, but operators should review what is published externally vs kept private.
- **Gitignore hygiene:** `.claude/` and `uv.lock` excluded from tracking per `.gitignore`.

## 10. Operational picture

### Local development (documentation)

```bash
uv sync                              # install doc dependencies
uv run mkdocs serve                  # local preview
uv run mkdocs build                  # emit site/
```

Alternative: `pip install -r requirements.txt` per `wrangler.toml` Cloudflare build path.

### Deployment (documentation)

- **Cloudflare Pages:** `wrangler.toml` defines `build_command` and `build_output_dir: site`.
- **GitHub Pages (documented alternative):** `uv run mkdocs gh-deploy` per README.
- **Pre-built `site/`** is committed — deploy may use checked-in artifacts without rebuild.

### Planned application operations (not in this repo)

- Docker Compose local stack (web + PostgreSQL + Redis).
- GitHub Actions CI: lint (ruff/black) → pytest → Docker build → deploy staging from develop, manual production from main.
- AWS ECS + RDS production target per ANEXO-IV.
- Backups: weekly export (UC-CR-07), S3 backups per ANEXO-V.

### Hardware constraints

None for docs site. Planned app is standard cloud web — no edge/RPi/GPU requirements documented.

## 11. Open questions / unknowns

- **Relationship `cotton` vs `cotton-west`:** README and `mkdocs.yml` reference `kodexArg/cotton-west` as repo name and public Pages target; swarm assignment is `kodexArg/cotton` (private). Unclear whether these are renamed forks, mirrors, or diverged repos — only `cotton` was cloned for this summary.
- **Application codebase location:** No Django project, Docker files, or GitHub Actions workflows exist in `cotton`. Implementation may live in another repository not yet linked in frontmatter `related`.
- **`.claude/` contents:** Gitignored and absent — agent conventions for this project unknown.
- **`.trae/spec-kit/` regulatory automation:** Described in ANEXO-IV §11 but not present in tree.
- **Government API integration:** PRD mentions validating REPROCANN documentation with fallback when government systems unavailable (ANEXO-I) — integration contract unspecified.
- **Committed `site/` vs source builds:** Static HTML is checked in; unclear if CI rebuilds on every merge or relies on manual `mkdocs build` commits.
- **Primary language discrepancy:** GitHub API reports HTML as dominant language due to committed `site/` artifacts; source authoring is Markdown + Python tooling.
