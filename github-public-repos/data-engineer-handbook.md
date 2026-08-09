---
id: "data-engineer-handbook"
title: "Data Engineering Handbook — curated learning hub and bootcamp labs"
visibility: public
importance: normal
source_repo: "data-engineer-handbook"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags: ["data-engineering", "education", "curated-links", "bootcamp", "postgresql", "docker", "sql", "dimensional-modeling", "scd", "interview-prep", "community"]
problems_solved:
  - "Aspiring and practicing data engineers face a fragmented landscape of books, courses, communities, interview guides, and tooling vendors with no single curated entry point."
  - "Self-learners need a structured, week-by-week bootcamp path with hands-on SQL and dimensional modeling exercises, not only reading lists."
  - "Interview candidates lack a consolidated map of DSA, SQL, data modeling, and architecture prep resources aligned to data engineering roles."
technologies:
  - "Markdown (primary deliverable format)"
  - "PostgreSQL 14"
  - "Docker / Docker Compose"
  - "GNU Make"
  - "Bash (init scripts)"
  - "SQL (DDL, analytics, SCD type 2)"
  - "Python 3.11+ (learner workstation prerequisite)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Data Engineering Handbook

> **Problem thesis (required):** The Data Engineering Handbook is a **public, markdown-first knowledge hub** that aggregates everything a person needs to learn, practice, and interview for data engineering roles. It solves the pain of hunting across scattered blogs, vendor pages, Discord servers, book lists, and YouTube curricula by placing curated indexes at the repo root and pairing them with a **six-week bootcamp outline** plus **hands-on Week 1 lab materials** (Postgres, dimensional modeling, slowly changing dimensions). It is not a deployable application; it is a living handbook and lab starter kit maintained for learners and community contributors.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/data-engineer-handbook` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Curated links to books, communities, courses, and interview prep, plus a YouTube-aligned data engineering bootcamp with Postgres lab materials. |
| Audience | Aspiring data engineers, career switchers, bootcamp participants, interview candidates, and practitioners seeking reference lists of tools, glossaries, podcasts, and design-pattern repos. |

## 2. Problems it solves

### P1 — Fragmented learning landscape

- **Who hurts:** Beginners and mid-level practitioners trying to break into or level up in data engineering without a mentor or internal curriculum.
- **Pain today:** High-quality resources are spread across vendor blogs, Substack newsletters, Discord servers, certification pages, and one-off GitHub tutorials. Search results favor SEO content over durable references. Newcomers waste time duplicating discovery work.
- **How this repo answers:** Root `README.md` and sibling index files (`books.md`, `communities.md`, `newsletters.md`, `interviews.md`, `projects.md`) organize resources by category — books, communities, newsletters, interview tracks, free projects, company tooling lists, glossaries, podcasts, courses, certifications, and design-pattern repositories. Each file is a maintained checklist the reader can work through sequentially or by interest area.
- **Out of scope:** Hosting course video, grading homework, issuing certificates, or operating a learning management system. External platforms deliver lectures and paid courses; this repo points to them and supplies local lab scaffolding.

### P2 — Lack of structured hands-on practice for core DE skills

- **Who hurts:** Learners who consume videos and reading lists but lack a reproducible local environment for dimensional modeling, SCD patterns, and analytical SQL.
- **Pain today:** Tutorials often assume ad-hoc database setup; students struggle with Docker, Postgres restore, and homework DDL without a shared baseline. Week 1 concepts (actor dimensions, quality classes, type-2 SCD) need sample data and query templates.
- **How this repo answers:** `bootcamp/introduction.md` outlines a six-week curriculum (dimensional modeling, fact modeling, data quality, pipelines, Spark, Flink/Kafka, KPIs). `bootcamp/materials/1-dimensional-data-modeling/` ships Docker Compose for Postgres 14, a `data.dump` seed, `Makefile` targets (`up`, `down`, `restart`, `logs`, `inspect`, `ip`), lecture-lab SQL under `lecture-lab/`, seed DDL under `sql/`, and `homework/homework.md` with concrete assignment tasks on the `actor_films` dataset.
- **Out of scope:** Complete materials for weeks 2–6 (fact modeling homework marked "to be added" in introduction). No orchestration platform (Airflow/Dagster) lab in the current tree — only Week 1 dimensional modeling is fully present.

### P3 — Interview preparation scattered across formats

- **Who hurts:** Job seekers facing DSA, SQL, data modeling, and data architecture interview rounds specific to data engineering.
- **Pain today:** Advice lives in separate videos, blog posts, and question banks with no single index tying each interview type to study paths.
- **How this repo answers:** `interviews.md` groups resources by interview type (DSA, SQL, data modeling, data architecture) with pointers to external course lessons and blog posts. `README.md` also lists SQL question banks and modeling interview content in the broader resource index.
- **Out of scope:** Mock interviews, automated grading, or proprietary question content — the repo curates links and study directions only.

## 3. Product / idea

The repository behaves as a **two-layer product**:

1. **Handbook layer (root):** Markdown indexes that function as a community-maintained bibliography and directory. The root `README.md` is the master document — thousands of lines covering books, communities, orchestration and warehouse vendors, analytics tools, LLM libraries, real-time stacks, engineering blogs, whitepapers, social creators, podcasts, newsletters, glossaries, design patterns, courses, and cloud certifications. Smaller topical files split out books, communities, newsletters, interviews, and projects for focused reading.

2. **Bootcamp layer (`bootcamp/`):** A syllabus (`introduction.md`) aligned to a free six-week YouTube data engineering bootcamp, plus `software.md` listing learner prerequisites (Docker, Python 3.11+, SQL IDE). The only shipped lab module in the shallow clone is **Week 1 — Dimensional Data Modeling**, which teaches Postgres-backed modeling with NBA-style player/game datasets and actor/film homework scenarios.

Mental model for the lab: clone → copy env template → `make up` or `docker compose up` → connect with DataGrip/DBeaver/psql → run lecture SQL and complete homework DDL/queries. The `init-db.sh` entrypoint restores `data.dump` via `pg_restore` and optionally runs homework SQL from a mounted homework directory.

The `kodexArg` org copy tracks `upstream` pointing at the original `DataExpert-io` handbook; content is overwhelmingly curated markdown and SQL didactics rather than application source code.

### 3.1 North-star use cases

1. **Newcomer roadmap:** Reader opens `README.md`, follows the "breaking into data engineering" roadmap reference, then explores `books.md` and `communities.md` to build a study plan.
2. **Bootcamp participant:** Reader follows `bootcamp/introduction.md` week list, installs stack per `bootcamp/software.md`, clones lab path under `bootcamp/materials/1-dimensional-data-modeling/`, starts Postgres via Make/Docker, completes `homework/homework.md` tasks (actors table, cumulative generation, SCD type 2 backfill and incremental queries).
3. **Interview prep:** Reader uses `interviews.md` to drill SQL, modeling, and architecture rounds with linked external lessons.
4. **Practitioner bookmark:** Experienced engineer keeps the repo as a vendor/community/podcast index and contributes new links via pull request (per README contribution guidance).
5. **Instructor fork:** Organization mirrors the handbook (as `kodexArg` does) to pin a known-good curriculum snapshot for internal cohorts.

### 3.2 Non-goals

- Not a runnable data platform, API, or orchestration product.
- Not a complete six-week lab archive yet — later weeks are syllabus-only placeholders.
- Not an agent skills pack — no `.claude/`, `.agents/`, or `SKILL.md` trees present.
- Not a secrets or credentials store — local `.env` is learner-generated from `example.env` and gitignored.
- Does not replace paid courses (DataExpert.io and others are referenced as external learning products).

## 4. Technology stack

Derived from bootcamp lab manifests and documentation; the handbook body is plain Markdown with embedded link tables.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Markdown; Bash; SQL; Python 3.11+ (learner prerequisite) | `bootcamp/software.md`; `scripts/init-db.sh` |
| Frontend | N/A | — |
| Backend / API | N/A | No HTTP server or application entrypoint |
| Data | PostgreSQL 14 (Dockerized); `data.dump` binary seed; sample tables (`actor_films`, `games`, `game_details`, `player_seasons`, SCD tables) | `docker-compose.yml`; `sql/*.sql`; `lecture-lab/*.sql` |
| Infra / deploy | Docker Compose; GNU Make wrappers | `docker-compose.yml`; `Makefile` |
| AI / agents | N/A in tree | `.claude/` absent (scanned) |
| Tests | N/A | No test harness in repo |

### 4.1 Notable dependencies (curated)

- **postgres:14** — Bootcamp database engine; exposed via host port mapping from env vars (`docker-compose.yml`).
- **Docker Compose** — Local stack orchestration for learners on Mac/Windows/Linux (`README.md` in lab module).
- **GNU Make** — Convenience targets wrapping compose lifecycle (`Makefile`).
- **pg_restore / psql** — Database initialization and optional homework SQL execution (`scripts/init-db.sh`).
- **External DE ecosystem (indexed, not vendored)** — References in root `README.md` span orchestration (Airflow, Dagster, Prefect, Mage), warehouses (Snowflake, Databricks), quality (dbt, Great Expectations), streaming (Flink, Kafka, RisingWave), and LLM tooling (LangChain, LlamaIndex, AdalFlow) as learning pointers only.

## 5. Repository map (abstraction)

- **Handbook indexes (root):** `README.md` (master resource hub), `books.md`, `communities.md`, `newsletters.md`, `interviews.md`, `projects.md` — topical markdown link farms.
- **Bootcamp syllabus:** `bootcamp/introduction.md` (six-week outline), `bootcamp/software.md` (learner tooling prerequisites).
- **Week 1 lab module:** `bootcamp/materials/1-dimensional-data-modeling/` — the only fully populated materials folder in the shallow clone.
  - **Entrypoints / ops:** `Makefile` (`up`, `down`, `restart`, `logs`, `inspect`, `ip`); `docker-compose.yml`; `scripts/init-db.sh`.
  - **Configuration templates:** `example.env` (copied to gitignored `.env`); env keys referenced in compose: `DOCKER_CONTAINER`, `POSTGRES_SCHEMA`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `HOST_PORT`.
  - **Seed data:** `data.dump` (Postgres custom-format dump, mounted into container init path).
  - **Domain SQL — seed DDL:** `sql/actor_films.sql`, `sql/games.sql`, `sql/game_details.sql`, `sql/player_seasons.sql`, `sql/load_players_table_day2.sql`.
  - **Domain SQL — lecture labs:** `lecture-lab/players.sql`, `players_scd_table.sql`, `scd_generation_query.sql`, `incremental_scd_query.sql`, `analytical_query.sql`, `pipeline_query.sql`, `graph_ddls.sql`, `team_vertices.sql`, `player_game_edges.sql`, `player_player_edges.sql`, `unnest_query.sql`.
  - **Learner assignments:** `homework/homework.md`; `homework/.gitkeep` (submissions gitignored via `homework/your_username` pattern).
  - **Visual aids:** `visual notes/*.png` (dimensional modeling and idempotency/SCD diagrams).
  - **Lab README:** `bootcamp/materials/1-dimensional-data-modeling/README.md` (clone, Docker vs local Postgres, troubleshooting table load).
- **Docs vaults:** No `docs/` or `.docs/` directory present (scanned — see §8).
- **Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` present (scanned — see §8).
- **Generated / vendor / ignored:** `postgres-data/` (Docker volume dir), `.env`, Python caches, IDE folders — per `bootcamp/materials/1-dimensional-data-modeling/.gitignore` and root `.gitignore` (`.idea/`, `.DS_Store`). `data.dump` is committed binary seed data, not ingested as text.

## 6. Configuration & contracts (no secrets)

### Environment variables (bootcamp lab)

Names and purpose only — values come from `example.env` copied to local `.env` (gitignored; not quoted here):

| Variable | Purpose |
|----------|---------|
| `DOCKER_CONTAINER` | Docker container name for Postgres service |
| `POSTGRES_SCHEMA` / `POSTGRES_DB` | Database name (compose maps schema env to `POSTGRES_DB`) |
| `POSTGRES_USER` | Database superuser for restore and psql |
| `POSTGRES_PASSWORD` | Database password (learner-local default in docs) |
| `HOST_PORT` | Host port mapped to container `5432` |

Makefile `include example.env` supplies defaults for compose variable substitution. Learners on Mac use `make up`; Windows users run `docker compose up -d` directly per lab README.

### Docker Compose contract

Single-service stack: `postgres` image `postgres:14`, restart `on-failure`, env files `.env` and `example.env`, volumes for repo mount (`./:/bootcamp/`), `data.dump`, `init-db.sh`, and named volume `postgres-data`.

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface.** This repository does not expose REST, GraphQL, Workers routes, or any network API. It is a static markdown and SQL lab collection consumed via Git clone and local Docker.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| **Make CLI** | `make up` / `down` / `restart` / `logs` / `inspect` / `ip` — Postgres lifecycle in lab module |
| **Docker Compose CLI** | `docker compose up -d` / `down -v` — Windows path documented in lab README |
| **psql / pg_restore** | Manual restore and REPL commands documented for troubleshooting failed table loads |
| **SQL files** | Executable DDL/DML for lecture and homework; no packaged CLI beyond database clients |
| **Markdown indexes** | Human-readable navigation; no MCP tools or agent commands defined in-repo |

## 7. Data & persistence

- **Local Postgres 14** is the sole persistence layer in shipped lab materials. Schema centers on dimensional modeling exercises:
  - **Actor/film domain:** `actor_films` table (homework primary key `actor_id`, `film_id`); derived `actors` table with nested `films` struct array, `quality_class` enum-like categorization, `is_active` flag.
  - **Sports analytics domain:** `games`, `game_details`, `player_seasons`, player SCD tables (`players_scd_table`), graph-style edge tables (`player_game_edges`, `player_player_edges`, `team_vertices`).
- **Seed mechanism:** `data.dump` restored at container init via `init-db.sh` using `pg_restore --no-owner --no-privileges`.
- **Topology:** Fully offline/local — learner machine runs Docker; no cloud bindings, KV, or vector stores in this repo. Handbook content references cloud warehouses and lakehouses as external learning topics only.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

| Source | Role |
|--------|------|
| `README.md` | Master handbook: roadmap pointer, bootcamp links, books/communities/companies/blogs/whitepapers/creators/podcasts/newsletters/glossaries/design patterns/courses/certs |
| `books.md` | 30+ curated data engineering and adjacent titles |
| `communities.md` | Discord, Slack, Reddit, dbt and vendor communities |
| `newsletters.md` | 20+ Substack and blog newsletters |
| `interviews.md` | DSA, SQL, modeling, architecture interview resource groupings |
| `projects.md` | Free end-to-end project ideas (BigQuery, LLM pipelines, Azure, Spark/Delta/Dagster examples) |
| `bootcamp/introduction.md` | Six-week syllabus with external lesson links per day |
| `bootcamp/software.md` | Docker, Python 3.11+, SQL IDE prerequisites |
| `bootcamp/materials/1-dimensional-data-modeling/README.md` | Lab setup, Docker vs local Postgres, connection defaults, troubleshooting |
| `bootcamp/materials/1-dimensional-data-modeling/homework/homework.md` | Week 1 assignment spec (actors DDL, cumulative load, SCD type 2) |
| `bootcamp/materials/1-dimensional-data-modeling/docker-compose.yml` | Service and volume contract |
| `bootcamp/materials/1-dimensional-data-modeling/Makefile` | Make target behavior |
| `bootcamp/materials/1-dimensional-data-modeling/scripts/init-db.sh` | Init and homework SQL runner |
| `sql/actor_films.sql`, `lecture-lab/players_scd_table.sql` | Representative schema shapes |

### `.claude/` scan

**Not present.** `ls` on repo root confirms no `.claude/` directory. No agent instruction trees, skills, or harness files to summarize.

### `.docs/` scan

**Not present.** No hidden `.docs/` vault. No `docs/` folder at root either. All documentation is top-level markdown and under `bootcamp/`.

### Other doc patterns

- No `ADR*`, PRD, or constitution files found.
- Visual lecture notes exist as PNGs under `bootcamp/materials/1-dimensional-data-modeling/visual notes/` (not text-ingested).
- Contribution workflow described in `README.md` (open PRs for books, communities, newsletters, podcasts, design patterns).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository — handbook content is intended for open distribution. No private clone URLs needed for summary consumers.
- **Auth model:** None at repo level. External courses and communities referenced in markdown may require their own accounts; not enforced by this tree.
- **Secrets:** Local `.env` is gitignored in the lab module; `example.env` holds placeholder variable names only. This summary contains no passwords, tokens, PEM material, or connection strings with credentials.
- **Binary data:** `data.dump` is committed seed data for Postgres restore — treated as opaque binary, not quoted.
- **Upstream relationship:** `kodexArg` fork tracks `DataExpert-io` upstream; no additional private overlays detected in shallow clone.

## 10. Operational picture

### Local development (bootcamp lab)

1. Navigate to `bootcamp/materials/1-dimensional-data-modeling/`.
2. Copy `example.env` → `.env` and adjust ports/credentials if needed.
3. Run `make up` (Mac) or `docker compose up -d` (Windows).
4. Connect with DataGrip, DBeaver, psql, or VS Code SQL extension using documented defaults (`postgres` user/db, host `localhost`, port from `HOST_PORT`).
5. Execute lecture SQL from `lecture-lab/` and `sql/`; complete `homework/homework.md` tasks.
6. Tear down with `make down` or `docker compose down -v`.

Handbook indexes require no build step — read markdown in any editor or render on Git hosting.

### Deployment

No CI workflows, Wrangler, Terraform, or container publish pipeline found in shallow clone. Distribution is **Git hosting + learner-local Docker**. Original project promotes GitHub as the canonical host; `kodexArg` mirror follows the same model.

### Hardware constraints

- Docker Desktop or compatible engine required for lab path.
- `data.dump` restore needs reasonable disk for Postgres volume (`postgres-data` gitignored).
- No GPU or Raspberry Pi constraints — standard developer laptop suffices per `bootcamp/software.md`.

## 11. Open questions / unknowns

- **Weeks 2–6 lab materials:** `bootcamp/introduction.md` lists fact modeling, data quality, visualization, pipeline maintenance, Flink/Kafka, Spark, and KPI weeks, but only `1-dimensional-data-modeling/` exists in the shallow `main` branch — later homework marked "to be added."
- **Fork divergence:** Whether `kodexArg/data-engineer-handbook` intentionally diverges from `DataExpert-io/data-engineer-handbook` beyond mirror metadata is unknown without full history compare; shallow clone shows upstream remote configured.
- **`data.dump` contents:** Binary dump not inspected; table list inferred from SQL filenames and homework spec.
- **CI / automation:** No `.github/workflows` in shallow tree — release and link-check automation unknown.
- **Localization:** All content observed in English; no localized README variants found.
