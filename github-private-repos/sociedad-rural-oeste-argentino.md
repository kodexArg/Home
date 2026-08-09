---
id: "sociedad-rural-oeste-argentino"
title: "SROA — institutional website and moderated institutional blog"
visibility: private
importance: normal
source_repo: "sociedad-rural-oeste-argentino"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["sroa", "agriculture", "livestock", "institutional", "blog", "django", "drf", "channels", "astro", "postgresql", "aws", "fargate", "cognito", "oauth", "moderation", "mendoza", "cuyo"]
problems_solved:
  - "The Sociedad Rural del Oeste Argentino has no owned digital channel to present its identity, 30-year strategic plan, authorities, and sector positions to producers, press, and public officials."
  - "Sector news and institutional reactions need a fast publishing path with moderated public conversation, without depending solely on third-party social networks or ad-hoc press outreach."
  - "Staff and invited contributors need a governed workflow to publish posts, moderate comments, invite editors, and build a censused user base for future institutional communication."
technologies:
  - "Astro 6.3.3 SSR (@astrojs/node standalone)"
  - "Tailwind CSS 4"
  - "bejamas/ui design system (copy-and-own components)"
  - "Django 6.0.5 + Django REST Framework 3.17.1"
  - "Django Channels 4.3.2 + channels-postgres (LISTEN/NOTIFY)"
  - "django-allauth 65.16.1 (Amazon Cognito provider federating Google OAuth)"
  - "PostgreSQL 17"
  - "AWS ECS Fargate (dual-service: frontend + backend)"
  - "S3-compatible media storage (MinIO local, S3 + CloudFront in cloud)"
  - "Docker Compose unified dev stack"
  - "GitHub Actions deploy via OIDC to ALVS DEV"
  - "Daphne ASGI server"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Sociedad Rural del Oeste Argentino (SROA)

> **Problem thesis (required):** The Sociedad Rural del Oeste Argentino is a civil and business guild representing cattle producers and the meat value chain in Mendoza and the Cuyo region, yet it lacked a credible owned web presence to communicate identity, strategic plan, authorities, and sector positions. This repository delivers that presence as a dual-stack application: an Astro SSR public site plus institutional blog with Google-authenticated commenting, staff moderation, contributor publishing, and real-time comment propagation — backed by exhaustive specs, ADRs, and agent instructions so the institution can operate digitally without surrendering narrative control to third-party platforms.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/sociedad-rural-oeste-argentino` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Official institutional website and moderated blog for the Sociedad Rural del Oeste Argentino — static/SSR pages, Django API, Google OAuth, contributor workflow, and AWS-hosted deployment. |
| Audience | SROA members and allied entities, interested producers evaluating membership, journalists, public officials, general public interested in regional livestock policy, SROA staff (`Staff` role) and invited contributors (`Contributor` role), and AI agents working from `AGENTS.md` and `docs/`. |

The GitHub repository description positions the project as the institutional site plus blog for SROA. Phase 1 (specification) produced a full documentation vault under `docs/` with PRD, model, endpoints, architecture, infra, and twelve numbered ADRs. Phase 2 (implementation) is active: deliverable version **v1.1.1** per `CHANGELOG.md` (2026-05-28), including the horizontal full-viewport home wheel, SEO redirects, robots/sitemap, CI deploy hardening, and auth styling fixes. Canonical agent instructions live in `AGENTS.md`; `CLAUDE.md` is a symlink to that file. The `.claude/` directory is listed in `.gitignore` and is not present in the shallow clone — agent SSOT is `AGENTS.md` plus `skills/`.

## 2. Problems it solves

### P1 — No owned institutional digital presence

- **Who hurts:** SROA leadership, Comisión Directiva, allied member entities, and external stakeholders (press, provincial/national officials) who need authoritative institutional information.
- **Pain today:** Without a dedicated site, positioning as a technical and guild reference for western Argentine livestock depends on person-to-person outreach; the 30-year strategic plan, authorities roster, member entities, and public positions lack a stable canonical channel (`docs/PRD.md` objectives OB-01 through OB-03).
- **How this repo answers:** Public institutional sections (about, authorities, member entities, strategic plan) are modeled as `Page` entities and member cards, pre-rendered or SSR-served from Astro consuming Django catalog endpoints. Content is editable by `Staff` via Django admin for low-frequency entities (`Reaction`, `Page`, `Member`) and via the Astro admin panel for high-volume editorial work (`docs/SITEMAP.md`, `docs/MODEL.md`).
- **Out of scope:** Full observatory/open-data portal, legal/fiscal repository, interactive member directory, and producer services portal — all explicitly deferred in PRD §5.2 roadmap.

### P2 — Slow, non-owned channel for sector news and debate

- **Who hurts:** SROA communications staff, sector-facing contributors, and registered readers who want timely commentary on norms, prices, and institutional milestones.
- **Pain today:** Reactive communication through external media has short windows; there is no owned blog with governed public conversation under SROA moderation policy (`docs/PRD.md` OB-05, OB-06).
- **How this repo answers:** `Post` entities power the blog and time-bounded `Event` posts (flagged via `is_event` + `event_expires_at`). Registered Google-authenticated users comment with mandatory editorial reactions (six-emoticon set). Comments publish immediately; `Staff` and post-author `Contributor` roles can hide or delete per PRD §9. WebSocket islands push `new_comment` and `comment_hidden` events live (`docs/ENDPOINTS.md` §7, `docs/ARCHITECTURE.md` §4). Anti-spam in MVP is Google-verified accounts only (ADR-005).
- **Out of scope:** Nested comment threads, public JWT APIs, email notification of comments (in-app notifications only), and reverting hidden content without a new ADR.

### P3 — Membership recruitment and censused audience building

- **Who hurts:** Prospective members evaluating adhesion, SROA staff tracking institutional outreach, and future marketing operators who need a first-party contact base (`docs/PRD.md` OB-04, OB-07 — high priority).
- **Pain today:** Interested producers cannot self-serve information and contact flows; every Google login creates potential audience data but without a system there is no structured user census or contributor onboarding.
- **How this repo answers:** Public "Sumate" form posts to `POST /api/sumate/` (email to Comisión Directiva, no persistence). Google OAuth via Cognito creates `UserProfile` atomically on first signup (`user_signed_up` signal). `Staff` invite contributors by email; lazy token validation elevates role on first login. Profile exposes comment history including moderated items. KPIs K-01 through K-03 (comment volume, reaction distribution, visit analytics) are defined in PRD §4 for future measurement.
- **Out of scope:** Paid membership billing, CRM integration, newsletter campaigns (audience DB is foundational but campaign tooling is not in MVP).

## 3. Product / idea

The system is a **two-application product** on a **single public hostname**, split by path at the load balancer: Astro serves all non-API pages (SSR for authenticated routes; build-time limitation led to SSR-only mode per `frontend/astro.config.mjs` comments), while Django serves `/api/*`, `/admin/`, OAuth account routes, and `/ws/*` WebSockets. The mental model is **backend-first business logic** (ADR-007): Astro renders and proxies; Django owns validation, authorization, Markdown-to-HTML rendering for bodies, email triggers, and realtime fan-out.

Public visitors browse institutional content, blog posts, and active events. Registered users comment with reactions. Contributors draft/publish posts and moderate comments on their own posts. Staff moderate all content, manage invitations, and configure editorial reactions/pages in Django admin. The home page (v1.0.0+) is a horizontal "wheel" of full-viewport scenes (hero → events → blog → join CTA) with keyboard, wheel, swipe, and caret navigation — a signature UX differentiator documented in `CHANGELOG.md` and `AGENTS.md`.

Authentication never stores tokens in the frontend: session cookies issued by Django/allauth after Cognito-brokered Google OAuth. Astro middleware calls `GET /api/auth/whoami/` server-side before rendering protected routes. Mutations flow as HTML form POST → Astro SSR route → server-to-server DRF with session cookie — not browser `fetch` mutations (ADR-008 exception: WebSocket island is the only client-side JS network path).

### 3.1 North-star use cases

1. **Anonymous reader** lands on home, scrolls the wheel or navigates to institutional pages and blog posts, reads Markdown-rendered bodies injected server-side, and optionally authenticates via Google to comment.
2. **Contributor** receives email invitation, validates token on `/invitacion/`, logs in with Google, creates draft posts in `/admin/contenido/`, publishes, and sees new posts appear on blog listing via WebSocket without reload.
3. **Staff operator** moderates comments and foreign posts from `/admin/moderacion/`, invites new contributors from `/admin/invitaciones/`, and edits `Reaction`/`Page` catalog entries via linked Django `/admin/`.

### 3.2 Non-goals

- Email/password authentication (Google-only MVP per ADR-005).
- JWT or public token APIs; session cookies only.
- Paginated list endpoints in MVP (full arrays returned).
- `PATCH /api/users/me/` — profile is read-only; identity comes from Google.
- Hard-delete of users in normal operation (`UserProfile.is_active` soft delete only).
- Runtime htmx in the browser — fragment pattern is server-side fetch only (ADR-007).
- WAF, multi-region, or non-AWS portability beyond documented abstractions in `docs/INFRA.md`.

## 4. Technology stack

Derived from manifests and docs; lockfiles not quoted.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3.x (Django 6 stack), Node (Astro build/dev) | `backend/requirements.txt`, `frontend/package.json` |
| Frontend | Astro 6.3.3 SSR, `@astrojs/node` standalone, Tailwind 4 | `frontend/package.json`, `frontend/astro.config.mjs` |
| UI / design | bejamas/ui copy-and-own component library, "Tierra" visual theme (ADR-011) | `docs/DESIGN_SYSTEM.md`, `docs/ADRS/011-tema-visual-tierra.md`, `frontend/src/components/` |
| Backend / API | Django 6.0.5, DRF 3.17.1, Channels 4.3.2, django-htmx, django-allauth | `backend/requirements.txt`, `docs/REQUIREMENTS.md` |
| Realtime | Channels WebSocket consumers + PostgreSQL channel layer (`channels-postgres`) | `backend/sroa_core/consumers.py`, `docs/ADRS/008-conexion-asincrona-backend-frontend.md` |
| Data | PostgreSQL 17 (RDS in cloud; Docker `db` service locally) | `docker-compose.yml`, `docs/INFRA.md` |
| Media | django-storages + boto3; MinIO locally, S3 + CloudFront media in cloud | `backend/requirements.txt`, `docker-compose.yml`, `docs/INFRA.md` |
| Email | Django SMTP → Mailpit (dev), SES (prod) | `docker-compose.yml`, `docs/BACKEND.md` §9 |
| Auth | django-allauth `amazon_cognito` provider; Cognito federates Google | `docs/ADRS/005-auth-google-oauth.md`, `backend/config/urls.py` |
| Infra / deploy | AWS Fargate dual services, ALB path routing, ECR, GitHub Actions OIDC deploy | `docs/INFRA.md`, `.github/workflows/deploy.yml`, `docs/PROD.md` |
| AI / agents | `AGENTS.md` SSOT, `skills/ci-badge`, `skills/changelog-bump`, Claude GitHub workflows | `AGENTS.md`, `skills/`, `.github/workflows/claude.yml` |
| Tests | pytest (backend), Node built-in test runner (frontend) | `backend/pytest.ini`, `frontend/test/*.test.mjs` |

### 4.1 Notable dependencies (curated)

- `channels-postgres` — PostgreSQL LISTEN/NOTIFY channel layer replacing Redis/ElastiCache for WebSocket fan-out across Fargate tasks.
- `django-allauth` — OAuth session management with built-in Cognito social provider; no separate boto3 Cognito admin layer in MVP.
- `django-htmx` — Server-side branching for HTML fragment endpoints (`/body/`) without shipping htmx runtime to browsers.
- `Markdown` — Server-side rendering of `Post.body` and `Page.body` to HTML fragments consumed by Astro `set:html`.
- `whitenoise` — Serves Django admin and DRF browsable API static assets from the backend container.
- `daphne` — ASGI server handling HTTP and WebSockets in one process (required; WSGI forbidden per `docs/INFRA.md`).

## 5. Repository map (abstraction)

- **Entrypoints:** `docker-compose.yml` (unified local stack), `backend/manage.py`, `backend/entrypoint.sh`, `frontend/astro.config.mjs`, `.github/workflows/deploy.yml` (CI/CD to ALVS DEV).
- **Frontend zone:** `frontend/src/pages/` — Astro routes (public pages, `/admin/*` panels, `/api/*` SSR proxies, `healthz`, `sitemap.xml.ts`); `frontend/src/middleware.ts` — auth gate; `frontend/src/lib/` — API client, auth, permissions, content helpers; `frontend/src/islands/` — `PostStream`, `CommentStream` (only client JS); `frontend/src/components/` — bejamas/ui-derived UI primitives and layout.
- **Backend zone:** `backend/config/` — Django settings, root URLs, ASGI/WSGI; `backend/sroa_core/` — domain models, DRF views, serializers, Channels consumers and routing, allauth signals; `backend/dev_auth/` — dev-only mock login (`DJANGO_DEV_MODE`); `backend/seed/seed.yml` — dev seed data; `backend/templates/` — allauth and base HTML overrides.
- **Domain / core:** Business rules enforced in `backend/sroa_core/` serializers and services per ADR-007; schema SSOT in `docs/MODEL.md` (nine entities: `UserProfile`, `Post`, `Comment`, `Reaction`, `Tag`, `Member`, `Page`, `Invitation`, `Notification`).
- **Adapters:** DRF HTTP API, Channels WebSocket, django-storages S3 backend, SMTP email, PostgreSQL via `dj-database-url`.
- **Docs vault:** `docs/` — PRD, architecture, endpoints, model, infra, development, design system, sitemap, ADRs 001–012, institutional context (`what-is-sroa.md`, `sroa-actors.md`), resource PDFs and research notes under `docs/resources/`. **No `.docs/` directory** exists in the repository.
- **Agent scaffolding:** `AGENTS.md` (SSOT; `CLAUDE.md` → symlink), `skills/ci-badge/SKILL.md`, `skills/changelog-bump/SKILL.md`, `skills/README.md` (placeholder note partially superseded by the two skills). **`.claude/` is gitignored** and absent from the clone.
- **Database local:** `database/` — supplementary compose and `.env.example` for standalone DB experiments (main stack uses root `docker-compose.yml`).
- **Generated / vendor:** `frontend/node_modules/`, build `dist/`, `database/data/` (legacy, unused per `.gitignore` comment), Playwright MCP debug output (gitignored).

## 6. Configuration & contracts (no secrets)

Environment variable **names** from `.env.example` (values are dev placeholders only; never commit real `.env`):

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB` | Local PostgreSQL credentials |
| `SECRET_KEY` | Django secret (generate for dev) |
| `DEBUG`, `ALLOWED_HOSTS` | Django debug and host allowlist |
| `DATABASE_URL` | PostgreSQL DSN for Django |
| `MINIO_ROOT_USER`, `MINIO_ROOT_PASSWORD` | Local S3-compatible storage |
| `AWS_STORAGE_BUCKET_NAME`, `AWS_S3_ENDPOINT_URL`, `AWS_S3_PUBLIC_ENDPOINT_URL` | Media bucket and endpoints |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USE_TLS` | SMTP (Mailpit in dev) |
| `CONTACT_EMAIL_RECIPIENT` | Sumate form destination mailbox |
| `COGNITO_DOMAIN`, `COGNITO_CLIENT_ID`, `COGNITO_CLIENT_SECRET` | OAuth broker (dev pool placeholders) |
| `CORS_ALLOWED_ORIGINS` | Cross-origin allowlist (less critical under single-domain prod) |
| `INTERNAL_BACKEND_ORIGIN` | CSRF trusted origin for server-to-server proxied POSTs |
| `DJANGO_SUPERUSER_*` | Dev superuser bootstrap when `DJANGO_DEV_MODE=true` |
| `DEV_NO_MIGRATIONS` | Dev ephemeral DB via syncdb instead of migrations |
| `DJANGO_DEV_MODE` | Enables dev auth mock and migration-skipping entrypoint behavior |
| `BACKEND_API_URL`, `PUBLIC_SITE_URL`, `PUBLIC_BACKEND_URL`, `PUBLIC_DEV_MODE` | Frontend container env (see `docker-compose.yml`) |
| `LOG_LEVEL` | Django/allauth logging verbosity (referenced in CHANGELOG) |

Cloudflare bindings: **N/A** — this project targets AWS ALVS platform, not Cloudflare Workers.

Django settings modules: `backend/config/settings.py` — sections for installed apps (DRF, Channels, allauth, cors, storages), database, channel layers, auth backends, CSRF trusted origins (ADR-010), static/media storage, email, logging.

### 6.1 HTTP / API endpoints (when applicable)

Authoritative catalog: `docs/ENDPOINTS.md`. Summary table of implemented routes (trailing slash required):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/health/` | ALB health with DB ping | none |
| `GET` | `/healthz/` | Container liveness | none |
| `GET` | `/accounts/amazon-cognito/login/` | Start Google OAuth (via Cognito) | AllowAny |
| `GET` | `/accounts/amazon-cognito/login/callback/` | OAuth callback | AllowAny |
| `POST` | `/accounts/logout/` | End session | IsAuthenticated |
| `GET` | `/api/auth/whoami/` | Session role probe for Astro middleware | IsAuthenticated |
| `GET` | `/api/users/me/` | Read-only profile | IsAuthenticated |
| `GET` | `/api/users/me/comments/` | Own comment history incl. hidden | IsAuthenticated |
| `GET` | `/api/posts/` | Post list (`?tag=`, `?mine=1`) | IsAuthenticatedOrReadOnly |
| `GET` | `/api/posts/<slug>/` | Post metadata | IsAuthenticatedOrReadOnly |
| `GET` | `/api/posts/<slug>/body/` | Rendered HTML body fragment | IsAuthenticatedOrReadOnly |
| `GET` | `/api/posts/<slug>/source/` | Raw Markdown for editor | author or Staff |
| `POST` | `/api/posts/` | Create draft post | Contributor+ |
| `PATCH` | `/api/posts/<slug>/` | Edit own post | author only |
| `POST` | `/api/posts/<slug>/publish/` | Publish draft | author only |
| `POST` | `/api/posts/<slug>/hide/` | Moderation hide post | Staff |
| `DELETE` | `/api/posts/<slug>/` | Physical delete post | author or Staff |
| `GET` | `/api/posts/<post_id>/comments/` | Visible comments | IsAuthenticatedOrReadOnly |
| `POST` | `/api/posts/<post_id>/comments/` | Create comment + reaction | Registered+ |
| `POST` | `/api/comments/<id>/hide/` | Moderation hide comment | Staff or post-author Contributor |
| `DELETE` | `/api/comments/<id>/` | Physical delete comment | author or Staff |
| `GET` | `/api/reactions/` | Active emoticon catalog | AllowAny |
| `GET` | `/api/members/` | Member entities list | AllowAny |
| `GET` | `/api/pages/<slug>/` | Institutional page metadata | AllowAny |
| `GET` | `/api/pages/<slug>/body/` | Page HTML body fragment | AllowAny |
| `GET` | `/api/invitations/` | Staff invitation audit list | Staff |
| `POST` | `/api/invitations/` | Send contributor invitation | Staff |
| `GET` | `/api/invitations/validate/` | Public token status check | AllowAny |
| `POST` | `/api/invitations/<id>/revoke/` | Revoke pending invitation | Staff |
| `POST` | `/api/sumate/` | Membership interest form (email only) | AllowAny |
| `GET` | `/api/notifications/` | In-app notifications | IsAuthenticated |
| `POST` | `/api/notifications/<id>/read/` | Mark notification read | IsAuthenticated |
| `POST` | `/dev/auth/login/` | Dev mock login | dev-only (`DJANGO_DEV_MODE`) |
| `WSS` | `/ws/posts/<post_id>/comments/` | Live comment events | WebSocket island |
| `WSS` | `/ws/posts/` | Live new-post events on listings | WebSocket island |

Astro additionally exposes frontend routes that proxy or render: `/login`, `/logout`, `/perfil`, `/blog/*`, `/eventos/*`, `/institucional/*`, `/admin/*`, `/invitacion`, `/api/*` BFF handlers under `frontend/src/pages/api/`, `sitemap.xml.ts`, and SEO redirects declared in `frontend/astro.config.mjs`.

### 6.2 Other interfaces

- **CLI:** `python manage.py` (Django), `npm run dev|build|test` in `frontend/`, `docker compose up` at repo root.
- **Django admin:** `/admin/` for `Reaction`, `Page`, `Member` CRUD by Staff.
- **Agent skills:** `ci-badge` (maintain GitHub Actions badge in header), `changelog-bump` (version SSOT in `CHANGELOG.md` before push).
- **GitHub Actions:** `deploy.yml` (build/push ECR, ECS rolling deploy with backend-stable wait), `claude.yml`, `claude-code-review.yml`.

## 7. Data & persistence

- **Primary store:** PostgreSQL — all relational entities, Django sessions, and Channels channel layer via `LISTEN/NOTIFY` on the same database (no separate Redis).
- **Object storage:** S3-compatible bucket for `ImageField` uploads (`Post.featured_image`, `Member.logo`); public read via CloudFront in production, MinIO with public-read bucket init in dev.
- **Ephemeral dev DB:** Docker `tmpfs` for PostgreSQL data in root compose — resets on each `docker compose up` (`docs/DEVELOPMENT.md` §13); `DEV_NO_MIGRATIONS=true` uses syncdb for speed.
- **Key entities:** `UserProfile` (roles: registered/contributor/staff), `Post` (draft/published, events, visibility), `Comment` (reaction FK, soft hide), `Invitation` (pending/accepted/expired/revoked), `Notification` (in-app, comment-driven), `Reaction` (editorial emoticon set), `Member` (institutional adherents), `Page` (institutional sections), `Tag` (free-form post tags).
- **Topology:** Cloud deployment runs two Fargate services (Astro + Django) in private subnets behind ALB + CloudFront; RDS in isolated DB subnets; Cognito User Pool as identity broker; secrets in Secrets Manager. Local deployment collapses to Docker network `sroa_dev` with direct localhost ports (4321 frontend, 8000 backend, 5432 postgres, 9000/9001 minio, 8025 mailpit UI).

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

- `README.md` — project entry, stack summary, doc index (note: README still says "no production code" from early Phase 1; `AGENTS.md` and `CHANGELOG.md` supersede for current Phase 2 status).
- `AGENTS.md` — agent SSOT: project purpose, phase 2 / v1.0.1+, doc map, stack ADRs, Spanish language rule, strict no-`!important` CSS policy, repo structure, working rules (SSOT discipline, paired MODEL/ENDPOINTS updates).
- `docs/PRD.md` — business objectives, personas, MVP scope, roles, user stories, KPIs.
- `docs/ARCHITECTURE.md` — dual-app topology, auth flow, realtime path, admin dual-surface, critical business rules.
- `docs/ENDPOINTS.md` — full HTTP/WebSocket contract SSOT.
- `docs/MODEL.md` — relational schema SSOT.
- `docs/INFRA.md` — AWS topology, Fargate, RDS, CloudFront, Cognito, CI/CD patterns.
- `docs/DEVELOPMENT.md` — local Docker mapping, env conventions, dev-only deltas.
- `docs/REQUIREMENTS.md` — pinned library versions tied to ADRs.
- `docs/what-is-sroa.md` — institutional context (history, authorities, strategic plan pillars, Estancia Yaucha positioning).
- `docs/ADRS/001` through `012` — nomenclature, Astro, bejamas/ui, Django+DRF+Channels, Google OAuth, model SSOT, backend-first logic, async connection, endpoints SSOT, CSRF origins, visual theme, Service Connect (east-west).
- `skills/ci-badge/SKILL.md` — procedure to keep deploy workflow badge URLs aligned with `LayoutHeader.astro`.
- `skills/changelog-bump/SKILL.md` — `CHANGELOG.md` as version SSOT before push.
- `skills/README.md` — original placeholder; two domain skills now exist.
- **`.claude/`:** gitignored; not in repository — no content to summarize.
- **`.docs/`:** does not exist; institutional and technical docs live under `docs/` only.

## 9. Security & privacy notes (summary-time)

- Repository visibility is **private**; production site is public-facing but source and infra details stay org-internal.
- Authentication is Google OAuth brokered through Cognito User Pool; session cookies are the only browser credential; no JWT exposure to frontend.
- CSRF protection on proxied mutations via `CSRF_TRUSTED_ORIGINS` and `INTERNAL_BACKEND_ORIGIN` (ADR-010).
- Role-based authorization enforced server-side in DRF permission classes; Astro mirrors gating for UX only.
- Dev mock auth (`/dev/auth/`) is mount-conditional and must never ship with `DJANGO_DEV_MODE` in production.
- OAuth client secrets and `client_secret_*.json` patterns are gitignored; `.env` is never versioned.
- User deactivation is soft-delete only; hard user delete reserved for exceptional compliance scenarios.
- This summary contains **no** live secrets, PEM keys, or production connection strings.

## 10. Operational picture

**Local development:**

1. `cp .env.example .env` and adjust if needed.
2. `docker compose up` from repository root — starts `db`, `minio`, `minio-init`, `mailpit`, `backend`, `frontend`.
3. Frontend dev server on port 4321 with HMR; backend on 8000; Mailpit UI on 8025.
4. Optional dev login via `PUBLIC_DEV_MODE=true` and `POST /dev/auth/login/` when Cognito is inconvenient.

**Deployment:**

- GitHub Actions workflow `deploy.yml` on push to `main` (paths-ignore excludes docs-only commits).
- Builds Docker images for `backend/` and `frontend/`, pushes to ECR under project slug `sroa`, updates ECS services on cluster `alvs-dev`.
- Waits for backend service stable before frontend rolling update (v1.1.1 fix).
- Django migrations run as one-off Fargate task before service update in production (not in dev entrypoint when `DJANGO_DEV_MODE` is set).
- Frontend version badge reads `CHANGELOG.md` via `frontend/scripts/sync-version.mjs`.

**Hardware constraints:** None specific; target audience includes rural mobile users — CloudFront caches public HTML; SSR auth routes bypass cache. WebSocket ALB idle timeout gap documented in `docs/WEBSOCKETS.md` (60s vs desired 3600s target).

## 11. Open questions / unknowns

- `README.md` Phase 1 "no production code" statement is stale relative to implemented `frontend/` and `backend/` trees — agents should trust `AGENTS.md` and `CHANGELOG.md` for phase status.
- Exact production hostname and secret ARNs live in `docs/PROD.md` (not fully ingested here; infra SSOT is `docs/INFRA.md`).
- Web analytics tool for KPI K-03 (visit source tracking) — referenced in PRD but integration not evident from manifests scanned.
- Optional periodic invitation status hygiene task — marked optional in `docs/ARCHITECTURE.md` §6.
- ALB WebSocket idle timeout may still be at AWS default 60s in DEV per `docs/WEBSOCKETS.md` — operational gap vs 3600s design target.
- `.claude/` agent tree may exist on developer machines but is intentionally excluded from git; only `AGENTS.md` is versioned as agent SSOT.
