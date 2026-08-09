---
id: "home"
title: "Home — kodexArg public front door with KodexBar RAG assistant"
visibility: public
importance: high
source_repo: "Home"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["astro", "svelte", "cloudflare-workers", "rag", "vectorize", "workers-ai", "kodexbar", "bun", "personal-site", "edge"]
problems_solved:
  - "Visitors need one calm public entry point to learn who Gabriel Cavedal is, what he has done, and where related kodexArg resources live — without a portfolio dump, CMS, or open chatbot."
  - "A minimal homepage must answer natural-language questions in Spanish or English from a grounded, versioned corpus — not hallucinate links or leak off-topic model calls to bots."
  - "Personal-site RAG must stay structurally safe at the edge: model emits destination ids only, links require consent, retrieval gates block inference for off-corpus queries, and secrets never live in the codebase."
technologies:
  - "Astro 7"
  - "Svelte 5"
  - "Cloudflare Workers (@astrojs/cloudflare)"
  - "Cloudflare Workers AI (@cf/baai/bge-m3, @cf/zai-org/glm-4.7-flash)"
  - "Cloudflare Vectorize (kodexbar-corpus)"
  - "Cloudflare KV (SESSION)"
  - "Cloudflare Access (optional Google identity)"
  - "Bun"
  - "Wrangler 4"
  - "SyV / Presentation Orange design system"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Home

> **Problem thesis (required):** kodexArg needs a single, calm public front door — not a portfolio dump, CMS, or open chatbot. Visitors land on a minimal surface (wordmark + console) and can either reach a known destination or ask a question about Gabriel Cavedal and get a real, grounded answer. The assistant behind the box is **KodexBar**: a single-tier retrieval-augmented generator running entirely inside a Cloudflare Worker, with structural controls so the model can write prose but cannot hallucinate URLs, and off-topic traffic never reaches generation.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/Home` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Public homepage for kodexArg with KodexBar — a grounded edge RAG assistant that answers who Gabriel Cavedal is, what he has done, and points visitors to verified public destinations. |
| Audience | Public web visitors (Spanish/English), kodexArg operators maintaining corpus and destinations, agents and developers deploying via CI, future signed-in users via optional Google identity. |

## 2. Problems it solves

### P1 — No calm front door for a personal brand org

- **Who hurts:** Visitors who want to understand Gabriel Cavedal and kodexArg; Gabriel as operator of a multi-repo org who needs one canonical entry rather than scattered links.
- **Pain today:** Portfolio sites become card grids or CMS bloat; v1.0 Home was a closed-action intent router that could only map queries to ~33 links and explicitly forbade assistant prose — it could serve "where is the CV?" but not "does he know AWS?"
- **How this repo answers:** v2.0 replaces the router with **KodexBar**, a single-tier RAG assistant on a minimal UI (wordmark, identity orb, bottom-anchored console). Visitors type in Spanish or English; the system embeds the query, retrieves from a committed corpus in Vectorize, gates below per-pack thresholds, and generates one plain paragraph from trusted chunks. Links are offered via destination ids resolved server-side against an allowlist.
- **Out of scope:** General-purpose chatbot, conversational memory across turns, SEO marketing pages, dynamic repo discovery, multi-user profiles.

### P2 — Unsafe or expensive public LLM surface on a homepage

- **Who hurts:** Site operator (denial-of-wallet, prompt injection, open redirects); visitors who might receive hallucinated links or scraped corpus content.
- **Pain today:** Public chat inputs are high-sensitivity: bots hammer endpoints, models can be steered, and naive RAG can emit arbitrary URLs or answer off-corpus questions at full generation cost.
- **How this repo answers:** Layered controls documented in ADR 09: model returns `linkIds` (ids only), never URLs; `resolveLinkIds()` drops unknown ids; retrieval gate declines off-corpus queries before LLM (`matched: false`); server-side scrub enforces one plain paragraph; link consent gate (ADR 12) parks links in KV and withholds them until explicit yes/no; KV rate limiting; corpus is closed, versioned, authored markdown — visitor queries never enter chunks or the index.
- **Out of scope:** Proof-of-human (Turnstile), bot fingerprinting — harness ADR 02 is open for future extensions.

### P3 — Growing knowledge domains without rewriting the engine

- **Who hurts:** Operator adding CV detail, identity facts, future packs (e.g. Subordinación y Valor).
- **Pain today:** Monolithic codebases mix UI, RAG logic, and content; adding a domain often touches retrieval code, API routes, and UI together.
- **How this repo answers:** Three in-repo zones (ADR 13): `corpus/` markdown SSOT → `bun run corpus:compile` → `src/kodexbar/packs/` → `bun run index:corpus` → Vectorize. Engine knows `KnowledgePack` and `CorpusChunk` only; domain vocabulary lives in chunk text, `tags`, and `related` graph edges. New pack = author markdown, compile, reindex — no engine change.
- **Out of scope:** Third-party or scraped corpus without ADR amendment (breaks trusted-chunk premise).

## 3. Product / idea

Home is the apex deployment of kodexArg's public identity: a dark Presentation Orange / SyV aesthetic, Aurora background, no nav chrome. The mental model is **SSR site + thin API adapters on one Cloudflare Worker** — not separate frontend and backend services.

**KodexBar** is the interactive core: a Pip-Boy-style console (`SyvInput` with placeholder `¿Sí?`) at the bottom. User queries POST to `/api/ask`. The pipeline: rate limit → pending-offer consent check → embed (`bge-m3`) → Vectorize topK 5 with language filter → per-pack `minScore` gate → expand `related` chunks → generate (`glm-4.7-flash`) → resolve link ids and scrub text → optionally park links and set `offer: true` for consent on the next turn.

The site surface does no inference. Chrome Built-in AI / client-side RAG was explicitly removed (ADR 10) because it would ship retrieved chunks to the browser and reintroduce browser-dependent behavior.

Optional **Google identity** (ADR 13) lives on `/me` and `me.` host behind Cloudflare Access — apex and `/api/ask` stay public. The identity orb reflects `whoami` but does not gate KodexBar.

### 3.1 North-star use cases

1. Visitor asks "¿sabe AWS?" — retrieval pulls skill and project chunks, model writes one grounded paragraph; links withheld until consent if destinations apply.
2. Visitor asks "quiero ver el cv" — high destination relevance yields link offer after short prose; consent turn reveals CV chip.
3. Operator edits `corpus/cv/es/proj-*.md`, runs `corpus:compile` and `index:corpus`, deploys via push to `main` — no engine code change.
4. Visitor toggles ES|EN; corpus filter and UI language follow; placeholder may propose next question via TAB.

### 3.2 Non-goals

- General-purpose chatbot or off-topic answers (fixed decline, no LLM).
- Conversational memory across turns (each query independent).
- Multi-user profiles or account-settings product (optional identity only unlocks future features).
- Dynamic discovery of repositories (destinations are explicit allowlist, public and live).
- SEO-heavy marketing or blog.
- Client-side inference or corpus enumeration via browser models.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | TypeScript (ES modules), Node compat via `nodejs_compat` | `package.json`, `wrangler.jsonc` |
| Package manager / tooling | Bun only (no npm/npx/yarn) | `package.json`, `AGENTS.md`, `README.md` |
| Frontend shell | Astro 7 (`^7.1.3`), hybrid static + SSR API routes | `package.json`, `astro.config.mjs` |
| UI islands | Svelte 5 (`^5.56.7`, runes mode) | `package.json`, `src/components/*.svelte` |
| Edge adapter | `@astrojs/cloudflare` `^14.1.4` | `package.json`, `astro.config.mjs` |
| Embeddings | `@cf/baai/bge-m3` (multilingual) | `docs/adr-10-kodexbar-architecture.md`, `src/kodexbar/retrieval.ts` |
| Generation | `@cf/zai-org/glm-4.7-flash` | `docs/adr-10-kodexbar-architecture.md` |
| Vector store | Cloudflare Vectorize index `kodexbar-corpus`, cosine, lang metadata filter | `wrangler.jsonc`, `docs/adr-04-database.md` |
| Session / limits | Cloudflare KV binding `SESSION` | `wrangler.jsonc`, `src/kodexbar/rateLimit.ts`, `offers.ts` |
| AI bindings | `env.AI`, `env.VECTOR_INDEX` with `remote: true` | `wrangler.jsonc`, `docs/adr-08-environment-variables.md` |
| Identity | Cloudflare Access JWT (`CF_ACCESS_TEAM_DOMAIN`, `CF_ACCESS_AUD`) | `src/lib/access.ts`, `docs/adr-13-optional-google-identity.md` |
| Design | SyV / Presentation Orange tokens | `src/styles/global.css`, `src/styles/syv.tokens.css`, `docs/adr-06-design-system.md` |
| Tests | Bun test runner | `package.json`, `tests/*.test.ts` |
| Deploy | GitHub Actions → `bunx wrangler deploy` | `.github/workflows/deploy.yml` |

### 4.1 Notable dependencies (curated)

- `astro` + `@astrojs/cloudflare` — hybrid Astro site deployed as a single Worker with file-based API routes.
- `@astrojs/svelte` — Svelte 5 islands for KodexBar, SyvInput, Typewriter, IdentityOrb, Aurora.
- `wrangler` — Cloudflare CLI for local dev bindings and deploy (via `bunx wrangler`).
- No separate OpenAI/Anthropic SDK — all inference via native Workers AI binding.

## 5. Repository map (abstraction)

- **Entrypoints (site):** `src/pages/index.astro` (homepage), `src/pages/me/index.astro` (identity surface), `src/layouts/Base.astro`, `src/middleware.ts` (canonical `/me` redirects).
- **Entrypoints (API adapters):** `src/pages/api/ask.ts`, `src/pages/api/auth/whoami.ts`, `src/pages/api/admin/index-corpus.ts`, `src/pages/api/admin/retrieve.ts` — thin HTTP layers only.
- **Domain / core (KodexBar engine):** `src/kodexbar/` — `answer.ts`, `retrieval.ts`, `askHandler.ts`, `destinations.ts`, `scrub.ts`, `consent.ts`, `offers.ts`, `rateLimit.ts`, `suggestions.ts`, `systemPrompt.ts`, `types.ts`.
- **Compiled corpus runtime:** `src/kodexbar/packs/` — generated from `corpus/` via `scripts/corpus-compile.ts`; includes `cv` and `identity` packs with ES/EN chunks.
- **Corpus authoring SSOT:** `corpus/` — `corpus/cv/`, `corpus/identity/`, per-pack `_pack.md`, per-lang markdown chunks with frontmatter (`id`, `title`, `related`, `tags`).
- **Site helpers (no RAG):** `src/lib/chat/chatSession.ts`, `src/lib/ui/` (language, typewriter), `src/lib/auth/identitySurface.ts`, `src/lib/access.ts`.
- **UI components:** `src/components/` — KodexBar, SyvInput, Wordmark, IdentityOrb, LanguageToggle, Typewriter, Aurora, HelloWorld.
- **Scripts:** `scripts/corpus-compile.ts`, `scripts/index-corpus.ts`, `scripts/corpus-export.ts`, `scripts/grounding-eval/` (eval harness).
- **Docs vault (Obsidian, not RAG):** `docs/` — `PRD.md`, ADRs 00–13, `.obsidian/` config committed per ADR 11.
- **Tests:** `tests/` — ask, answer, retrieval, destinations, consent, packs, rate limit, identity, scrub, suggestions, typewriter, language, access-identity.
- **Agent scaffolding:** `AGENTS.md` at root (bun, Cloudflare deploy via GHA, codebase-memory path). No `.claude/` or `.docs/` present in the public tree (`.claude/` is gitignored).
- **Generated / vendor:** `dist/`, `node_modules/`, `.astro/`, `.wrangler/` — gitignored; not ingested.

## 6. Configuration & contracts (no secrets)

### Cloudflare bindings (`wrangler.jsonc`)

| Binding | Type | Purpose |
|---------|------|---------|
| `AI` | Workers AI | Embeddings and text generation (`remote: true`) |
| `VECTOR_INDEX` | Vectorize | Index `kodexbar-corpus` for corpus vectors (`remote: true`) |
| `SESSION` | KV namespace | Rate limiting keys and parked link offers |

Custom domains routed to the Worker: apex brand host, `www` alias, `home` alias, and `me` identity host (see `wrangler.jsonc` routes).

### Optional secrets (not in repo)

| Env var | Purpose |
|---------|---------|
| `CF_ACCESS_TEAM_DOMAIN` | Cloudflare Access team hostname for JWT verification on `/me` |
| `CF_ACCESS_AUD` | Access application AUD for identity surface |
| `CLOUDFLARE_API_TOKEN` | CI deploy only (GitHub Actions secret) |
| `CLOUDFLARE_ACCOUNT_ID` | CI deploy only (GitHub Actions secret) |

Workers AI and Vectorize use zero-secret native bindings — no API tokens in codebase for inference or indexing during dev (`remote: true` + dev-only admin endpoint).

### POST `/api/ask` body (conceptual)

- `query` — string, trimmed, max 500 chars, required.
- `language` — `es` | `en` (default `es`).
- `conversation` — optional UUID scope for link-offer KV key narrowing.

Response: `KodexAnswer` — `{ text, links[], language, matched, score?, suggestion?, offer? }`. Links empty when `offer: true` (ids parked server-side).

### 6.1 HTTP / API endpoints

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` | Homepage (wordmark, KodexBar, identity orb) | none |
| `GET` | `/me` | Optional Google identity surface | Cloudflare Access when configured |
| `POST` | `/api/ask` | KodexBar query — embed, retrieve, gate, generate, link offer | none; rate-limited by IP (KV) |
| `GET` | `/api/auth/whoami` | Returns Access identity state for orb UI | reads `Cf-Access-Jwt-Assertion` when present |
| `POST` | `/api/admin/index-corpus` | Upsert all compiled chunks to Vectorize | dev-only (`import.meta.env.DEV` → 404 in prod) |
| `POST` | `/api/admin/retrieve` | Debug retrieval scores and chunks | dev-only |

Production has no public admin API surface; indexing is driven locally via `scripts/index-corpus.ts` POSTing to the dev server.

### 6.2 Other interfaces

- **CLI scripts:** `bun run corpus:compile`, `bun run index:corpus`, `bun run corpus:export`, `bun run eval:grounding`.
- **Browser UI:** KodexBar console — Enter submits query; TAB accepts placeholder suggestion; ES|EN toggle; link consent yes/no on follow-up turn.
- **Identity orb:** click → identity surface; displays `LOG IN` or truncated name from `whoami`.
- **Logout:** Access-hosted logout path when identity active (`/cdn-cgi/access/logout`).

## 7. Data & persistence

- **Vectorize (`kodexbar-corpus`):** Stores `bge-m3` embeddings of corpus chunks. Metadata includes `pack` and `lang` for filtered queries. Chunk ids stable (`${pack}:${localId}:${lang}`). Upsert via admin endpoint; no automatic deletion of removed chunks (recreate index if pack shrinks materially).
- **KV (`SESSION`):** Rate-limit counters per client id (`CF-Connecting-IP` fallback chain); parked link offers under `offer:<client-id>:<conversation-scope>` with 5-minute TTL.
- **No D1, Postgres, or Hyperdrive** — relational state is out of scope (ADR 04).
- **Corpus entities (packs):** `cv` (profile, experience, skills, projects, education, contact, QA — ES richer than EN), `identity` (personal facts with stricter `minScore` gate at 0.62 vs cv 0.45). Planned: `syv` (Subordinación y Valor).
- **Destinations allowlist:** ~36 entries in `src/kodexbar/destinations.ts` — kinds `contact` (4), `site` (5), `repo` (27). No `home` entry (visitor already on apex). Private work described in corpus without destination links.
- **Topology:** Single Worker at the edge; browser is presentation-only; all RAG and link resolution server-side. Dev uses remote Vectorize and AI (no offline emulation).

## 8. Docs & agent memory (required scan)

1. **Root `README.md`** — stack summary, three-zone layout, local dev commands, corpus workflow, deployment via GHA.
2. **`docs/PRD.md`** — v2.0 product spec: KodexBar pipeline, contracts, UX requirements, security table, non-goals.
3. **`docs/adr-01-glossary.md`** through **`docs/adr-13-repo-layout.md`** — architecture decisions: harness, backend, Vectorize/KV, frontend, design system, componentization, KodexBar security and architecture, link consent, Obsidian vault policy, optional Google identity, repo layout.
4. **`docs/adr-13-optional-google-identity.md`** — dual entry `me.` host and `/me` path, apex ungated.
5. **`corpus/README.md`** — corpus authoring rules, `{{AGE_YEARS}}` placeholder for identity age derivation.
6. **`AGENTS.md`** — agent directives: bun only, deploy via GHA not manual wrangler, codebase-memory path for exploration.
7. **`.obsidian/`** — Obsidian vault config for `docs/` (committed per ADR 11).
8. **`.claude/`** — not present in clone (gitignored in `.gitignore`).
9. **`.docs/`** — not present in repository.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo and public site; corpus includes deliberately published personal identity facts in `identity` pack (legal name, birth date) behind a stricter retrieval gate; widening identity scope requires ADR amendment.
- **Auth model:** Anonymous KodexBar fully available. Optional Google via Cloudflare Access on identity surface only; JWT verified server-side for `whoami`; until `CF_ACCESS_*` secrets set, identity dormant.
- **Link safety:** Structural — model cannot emit URLs; ids resolved twice (offer narrowing + response); scrub strips URL-shaped prose; consent re-validates from KV through allowlist.
- **Cost controls:** Retrieval gate for off-topic (embedding-only); KV rate limit fails open on KV errors; client 3s cooldown is UX only.
- **This summary contains no secrets, tokens, PEM keys, or `.env` contents.** KV namespace id in `wrangler.jsonc` is a public binding identifier, not a credential.

## 10. Operational picture

- **Local dev:** `bun install` then `bun run dev` — Astro dev server on localhost port 4321; `remote: true` bindings hit real Workers AI and Vectorize (no offline fallback).
- **Build:** `bun run build` — Worker + static assets to `dist/`.
- **Test:** `bun test` — full test suite in `tests/`.
- **Corpus publish:** edit `corpus/**/*.md` → `bun run corpus:compile` → `bun run dev` → `bun run index:corpus`.
- **Deploy:** Push to `main` triggers `.github/workflows/deploy.yml` — frozen lockfile install, test, build with Cloudflare secrets, `bunx wrangler deploy`. No manual production wrangler path per project policy.
- **Hardware:** Edge-only; no GPU/RPi constraints.

## 11. Open questions / unknowns

- **`identity` pack gate:** ADR 09 §3b notes live probing showed identity questions scoring below `minScore` 0.62 — pack may decline all identity queries until threshold amended with measured leak testing.
- **Cloudflare Access production state:** `whoami` and `/me` page indicate identity may be dormant until `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` are injected at deploy.
- **English corpus parity:** PRD and ADR 10 note Spanish CV long-form is richer; English answers thinner — content gap, not architectural.
- **`syv` pack:** Listed as planned in PRD; not yet in compiled packs at scan time.
- **Future harness extensions:** Turnstile, bot signals mentioned as open in ADR 02 but not implemented.
