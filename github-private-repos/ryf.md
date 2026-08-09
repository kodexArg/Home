---
id: "ryf"
title: "Subordinación y Valor — TTRPG character companion web app"
visibility: private
importance: normal
source_repo: "ryf"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "experimental"
related: []
tags: ["ttrpg", "sveltekit", "django", "drf", "mysql", "docker", "spanish", "characters", "rapidoyfacil", "subordinacion-y-valor"]
problems_solved:
  - "Tabletop players and GMs need an immersive, browsable gallery for SyV (Subordinación y Valor) characters with stats, portraits, bios, and hidden secrets — not a spreadsheet or plain text dump."
  - "Generated character data must be persisted and served consistently so the SvelteKit frontend can list and drill into characters without hand-maintaining static JSON forever."
  - "The adapted RyF (Rápido y Fácil) ruleset for the SyV post-apocalyptic Argentina setting needs a readable in-app reference separate from the external rulebook PDF."
technologies:
  - "SvelteKit 1.x / Svelte 4"
  - "Vite 4"
  - "Tailwind CSS 3"
  - "Django 4.2"
  - "Django REST Framework 3.14"
  - "MySQL 8"
  - "Gunicorn"
  - "Nginx"
  - "Docker Compose"
  - "markdown-it"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Subordinación y Valor (ryf)

> **Problem thesis (required):** This repository is the companion web application for **Subordinación y Valor** (*SyV*), a Spanish-language post-apocalyptic tabletop RPG set in a walled, dictatorial Argentina circa 2178. It solves three intertwined pains: (1) presenting richly authored characters—portraits, RyF stats, public bios, and GM-only secrets—in a tactile card-deck UI rather than flat documents; (2) backing those characters with a REST API and MySQL store so the roster can grow beyond static seed data; and (3) embedding an adapted **Rápido y Fácil** (*RyF*) rules summary tailored to SyV's dark-contemporary flavor, occultism, and optional extended attributes.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/ryf` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | A SvelteKit + Django stack that showcases SyV RPG characters as an interactive card carousel and serves them via a REST API, with in-app RyF rules documentation. |
| Audience | SyV players, game masters, and internal authors generating or curating characters for the setting; not a general-purpose RPG platform. |

## 2. Problems it solves

### P1 — Immersive character discovery for a narrative TTRPG

- **Who hurts:** Players and GMs running *Subordinación y Valor* sessions who need quick, atmospheric access to pre-generated NPCs and PCs without breaking immersion.
- **Pain today:** Character sheets live as disconnected prose, JSON blobs, or AI-generated drafts with no unified visual presentation; secrets and public bios are hard to toggle cleanly at the table.
- **How this repo answers:** The SvelteKit frontend renders a horizontal **card deck** (`Deck.svelte`, `Card.svelte`) with portrait art, RyF stat bars (`SkillBar.svelte`), occupation/faction labels, and expandable biography/secret sections. Double-clicking a card stores the character in `sessionStorage` and navigates to a full detail view (`Character.svelte` at `/personajes/[slug]`). Static seed data in `static/characters.json` demonstrates the intended UX while the API path matures.
- **Out of scope:** Full character creation wizard, combat tracker, dice roller, or live multiplayer session tooling.

### P2 — Persistent character roster via API

- **Who hurts:** Authors who generate many SyV characters (see `notes/AI.md` prompt notes) and need a single source of truth beyond checked-in JSON.
- **Pain today:** Hand-editing JSON or markdown for every new character does not scale; portrait filenames, slugs, and nested stats are error-prone.
- **How this repo answers:** Django REST Framework exposes a `CharacterViewSet` with nested `Stat` serialization. Characters carry slug, names, occupations (public and secret), faction, location, biography, `background_secret`, portrait filename, and a one-to-one `Stat` model (physique, intellect, skill, perception, empathy — each validated 1–5). The `/personajes` route's `+page.server.js` fetches from the API at load time.
- **Out of scope:** User authentication for players, image upload pipeline (portraits are filename references to `static/img/c/`), or admin-only GM portals beyond Django admin.

### P3 — In-app RyF rules reference for SyV

- **Who hurts:** GMs adapting the third-party *Rápido y Fácil* system to SyV's proscribed-tech, Lovecraft-leaning, clerical-power setting.
- **Pain today:** The external RyF v3.5 manual is generic; SyV-specific attribute extensions (Magia, Voluntad, Astucia, Erudición) and sanity/corruption hooks are scattered in author notes.
- **How this repo answers:** `src/documents/sistema-ryf-syv.md` is rendered at `/sistema` through a `Markdown.svelte` component (markdown-it + dynamic raw import). The doc explains why RyF fits SyV, lists base and extended attributes, and references official RyF materials by title (links exist in source markdown but are not repeated here for RAG hygiene).
- **Out of scope:** Replacing the official RyF rulebook; full SRD parity or automated rules enforcement.

## 3. Product / idea

The mental model is a **two-tier web app**: a polished SvelteKit SPA-style frontend for players, and a containerized Django API + MySQL backend for data persistence, fronted by Nginx in production-shaped Docker Compose.

Users land on a themed shell (`+layout.svelte`) with olive/blood Tailwind palette, lazy-loaded background art, and a navbar branded **Subordinación y Valor**. Navigation popup links to home, generated characters, a placeholder "secret archives" route (still points home), and the rules page. The home route (`+page.svelte`) is currently a stub—most value lives under `/personajes` and `/sistema`.

Character flow: list page loads API data → `Deck` progressively renders cards with fly-in animation and horizontal scroll (mouse-wheel mapped to horizontal scroll) → single-click enlarges, double-click opens detail. Detail page reads from `sessionStorage` (not a second API fetch by slug), so navigation depends on prior deck interaction.

A parallel `notes/` directory holds earlier prototypes—duplicate `Card.svelte`, `SkillBar.svelte`, Django-style migrations mirroring backend schema, and character route experiments—suggesting iterative development before consolidation into `src/`.

### 3.1 North-star use cases

1. **GM at the table** — Open `/personajes`, skim the card fan, double-click an NPC, reveal biography then secret for plot hooks.
2. **Author pipeline** — POST new characters to `/api/characters/` (via DRF or Django admin), drop portrait PNG into `static/img/c/`, refresh the deck.
3. **New player onboarding** — Read `/sistema` for how SyV maps RyF attributes and optional extended sheets before session zero.

### 3.2 Non-goals

- Generic RPG platform or multi-campaign support (single-universe SyV focus).
- Production deployment automation (no GitHub Actions or wrangler; Docker Compose only).
- AI image generation integration (noted as TODO in `notes/AI.md` — Stable Diffusion model name only, not implemented).
- Public marketing site (repo is private; README is still default `create-svelte` boilerplate).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node (SvelteKit toolchain), Python 3.12 (Docker image) | `package.json`, `Dockerfile` |
| Frontend | SvelteKit 1.20, Svelte 4, Vite 4, TypeScript 5 | `package.json`, `svelte.config.js`, `vite.config.ts` |
| Styling | Tailwind CSS 3, PostCSS, custom SyV palette (primary olive, blood red) | `tailwind.config.cjs`, `src/app.postcss` |
| Backend / API | Django 4.2 + DRF 3.14, Gunicorn | `config/requirements.txt`, `backend/config/settings.py` |
| Data | MySQL 8 via `mysqlclient` | `docker-compose.yml`, `backend/config/settings.py` |
| Infra / deploy | Docker Compose (db, backend, nginx), Nginx reverse proxy | `docker-compose.yml`, `config/nginx.conf`, `Dockerfile` |
| AI / agents | Authoring prompt notes only (no runtime AI) | `notes/AI.md` |
| Tests | Django test stub present, no frontend test config evident | `backend/api/tests.py` |

### 4.1 Notable dependencies (curated)

- `@sveltejs/adapter-auto` — default SvelteKit deployment adapter (environment not pinned).
- `markdown-it` — renders `src/documents/*.md` into HTML for the rules page.
- `djangorestframework` — `ModelViewSet` + nested serializers for Character/Stat CRUD.
- `whitenoise` — compressed static file serving for Django admin/DRF assets.
- `Pillow` — listed in requirements (image handling potential; portraits currently static files).
- `shortuuid` — in requirements though slug generation uses custom 4-char alphanumeric in `api/models.py`.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - Frontend dev: `package.json` scripts (`dev`, `build`, `preview`).
  - Backend WSGI: `backend/config/wsgi.py` via Gunicorn (`config/gunicorn.config.py`).
  - Docker orchestration: `docker-compose.yml` (services `ryf-db`, `ryf-backend`, `ryf-nginx`).
- **Domain / core:**
  - `backend/api/models.py` — `Character`, `Stat` entities and slug generator.
  - `backend/api/serializers.py` — nested create/update with stat validation (values strictly between 0 and 5).
  - `static/characters.json` — rich HTML bios/secrets for demo characters in Ciudad Dársena.
- **Adapters:**
  - `backend/api/views.py` — DRF `CharacterViewSet`.
  - `backend/config/urls.py` — API router mount at `api/`.
  - `src/routes/personajes/+page.server.js` — SSR load hook fetching characters from backend.
  - `config/nginx.conf` — proxies port 80 to `ryf-backend:8080`.
- **Presentation:**
  - `src/components/` — `Deck`, `Card`, `Character`, `Navbar`, `Footer`.
  - `src/lib/` — `SkillBar`, `Markdown`, `Icon`, `SquareButton`, SVG assets.
  - `src/routes/` — `+layout.svelte`, `/personajes`, `/personajes/[slug]`, `/sistema`.
- **Docs vaults:**
  - `src/documents/sistema-ryf-syv.md` — primary rules adaptation doc.
  - `notes/INSTALL.md`, `notes/TODO.md`, `notes/AI.md` — dev notes and AI character-generation brief.
  - No `docs/`, `.docs/`, or `.claude/` directories present in tree.
- **Prototype / legacy zone:**
  - `notes/` — alternate Svelte components, animation store, crossfade helper, Django migration copies.
- **Generated / vendor:**
  - `node_modules/` (gitignored), `backend/staticfiles/` (collected Django/DRF static), `mysql_data/` (gitignored DB volume).

## 6. Configuration & contracts (no secrets)

Environment variables (names and purpose only; values never committed — `.env` is gitignored):

| Variable | Purpose |
|----------|---------|
| `SECRET` | Django `SECRET_KEY` |
| `DEBUG` | Django debug flag |
| `MYSQL_DDBB` | MySQL database name |
| `MYSQL_USER` | MySQL application user |
| `MYSQL_PASS` | MySQL application password |
| `MYSQL_ROOT_PASS` | MySQL root password (Compose service) |
| `MYSQL_HOST` | Database host (Compose service name in deployment) |
| `MYSQL_PORT` | Database port |

Django settings (`backend/config/settings.py`): MySQL backend, `ALLOWED_HOSTS = ['*']`, WhiteNoise for static files, `MEDIA_ROOT` at `mediafiles/`, DRF + `api` app installed. No custom auth backends or CORS configuration visible.

Gunicorn binds `0.0.0.0:8080` with `workers = cpu_count * 2 + 1`.

Nginx exposes host ports `8000→80` and `8443→443` (TLS volumes commented out).

### 6.1 HTTP / API endpoints

Backend (via DRF `DefaultRouter` on `characters`):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/api/characters/` | List all characters | none (open ViewSet) |
| `POST` | `/api/characters/` | Create character with nested stats | none |
| `GET` | `/api/characters/{id}/` | Retrieve single character by DB id | none |
| `PUT` | `/api/characters/{id}/` | Full update | none |
| `PATCH` | `/api/characters/{id}/` | Partial update | none |
| `DELETE` | `/api/characters/{id}/` | Delete character | none |

Django admin is installed (`admin.site.register` for Character and Stat) but no explicit `admin/` path wiring beyond default Django project layout — standard admin likely at `/admin/` when `ROOT_URLCONF` includes it (current `urls.py` only mounts API; admin may need `path('admin/', admin.site.urls)` — **not present in checked `urls.py`**, so admin UI may be unreachable without further URL config).

Frontend SvelteKit routes (SSR/CSR pages, not REST):

| Method | Path | Purpose | Auth |
|--------|------|---------|------|
| `GET` | `/` | Home stub | none |
| `GET` | `/personajes` | Character deck (fetches API server-side) | none |
| `GET` | `/personajes/[slug]` | Character detail from sessionStorage | none |
| `GET` | `/sistema` | RyF rules markdown page | none |

Static assets served from `static/` (portraits at `/img/c/{filename}`, backgrounds under `/assets/bg/`).

### 6.2 Other interfaces

- **CLI (frontend):** `bun`/`npm` scripts — `dev`, `build`, `preview`, `check`, `lint`, `format`.
- **CLI (backend):** `backend/manage.py` — standard Django management (migrations, runserver, etc.).
- **Docker Compose:** `docker compose up` brings up MySQL, Gunicorn backend, and Nginx proxy.
- No MCP tools, Telegram bots, or systemd units.

## 7. Data & persistence

**Stores:** MySQL 8 (primary persistence for API characters), browser `sessionStorage` (ephemeral selected character for detail view), static JSON (`static/characters.json`) as rich demo/legacy seed.

**Entities:**

- `Stat` — physique, intellect, skill, perception, empathy (integers 1–5 validated at serializer).
- `Character` — slug (4-char unique), title, nick_name, first_name, last_name, age, occupation, secret_occupation, faction, biography, background_secret, location, portrait_filename, FK to Stat.

**Topology:** Local/dev assumes Dockerized MySQL on port 3306, backend on 8080, Nginx on 8000. Frontend dev server (`vite dev`) calls API at hardcoded `http://localhost:8000/api/characters/` in `+page.server.js` — coupling frontend SSR to Nginx proxy port, not direct 8080.

Portrait images live as static files (`static/img/c/`) referenced by filename, not DB blobs. Only one PNG observed in clone (`6.png`); JSON references numbered JPGs — asset set may be incomplete in repo.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

- `README.md` — default SvelteKit scaffold text only; no project-specific documentation.
- `src/documents/sistema-ryf-syv.md` — SyV's RyF v3.5 adaptation, attribute lists, setting tone (2178 Argentina, forbidden tech, occult/clerical power).
- `notes/AI.md` — post-apocalyptic Argentina character-generation brief for AI authors; TODO for Stable Diffusion model testing.
- `notes/INSTALL.md` — Tailwind/postcss install snippet.
- `notes/TODO.md` — empty task bins.
- `static/characters.json` — sample Ciudad Dársena NPCs with HTML bios/secrets (factions: Trabajadores, Parias, Clero, etc.).

**`.claude/` — not present** (scanned; directory absent).

**`.docs/` — not present** (scanned; directory absent).

No ADR, PRD, or constitution files found.

## 9. Security & privacy notes (summary-time)

- Repository visibility is **private**; character bios contain fictional violence, occult themes, and political oppression motifs — treat summaries as internal creative material.
- API has **no authentication** on `CharacterViewSet`; any client that can reach the backend can CRUD characters. Suitable only for trusted local/trusted-network use.
- Django `SECRET_KEY` and DB credentials load from `.env` (gitignored); this summary contains no secret values.
- `ALLOWED_HOSTS = ['*']` and DEBUG from env — production hardening not evident.
- Character detail route trusts `sessionStorage` client data (`@html` rendering) — XSS risk if API data were attacker-controlled without sanitization.
- Nginx TLS certificate volumes are commented out; HTTPS termination not configured in tree.

## 10. Operational picture

**Local frontend dev:**

```bash
# install deps (package-lock and pnpm-lock both present; pick one toolchain)
bun install   # or npm/pnpm per author preference
bun run dev
```

**Local full stack (Docker):**

```bash
# requires .env with MySQL and Django variables (not in repo)
docker compose up
# API proxied at host port 8000, MySQL at 3306
```

**Backend migrations:**

```bash
# inside backend container or local venv
python manage.py migrate
```

**Deployment:** No CI/CD workflows (`.github/` absent). Intended shape is Docker Compose on a host with manually supplied `.env`. SvelteKit `adapter-auto` implies platform-specific deploy for the frontend build, but no adapter-specific config committed.

**Hardware constraints:** None special; standard web stack. AI image generation noted as future experimentation only.

## 11. Open questions / unknowns

- Whether Django admin is intentionally omitted from `urls.py` or an oversight.
- Production deployment target for the SvelteKit build (adapter-auto defers to hosting environment; no Cloudflare/Node server config in repo).
- Relationship between `static/characters.json` and API data — frontend `/personajes` uses API only; JSON may be legacy seed or import source not wired in current routes.
- Completeness of portrait assets (`characters.json` references `1.jpg`–`N.jpg` but clone shows limited files under `static/img/c/`).
- Whether `notes/` migrations and components are dead code or an in-progress migration path.
- CORS settings if frontend and API are ever split across origins (not configured).
- "Archivos Secretos" navbar link routes to `/` — placeholder or unfinished feature.
