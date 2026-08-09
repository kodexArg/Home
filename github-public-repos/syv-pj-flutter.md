---
id: "syv-pj-flutter"
title: "SyV PJ Flutter — universe-facing character viewer and Diseño Verde mobile client"
visibility: public
importance: normal
source_repo: "syv-pj-flutter"
org: "kodexArg"
default_branch: "main"
primary_language: "Dart"
repo_kind: "application"
status: "active"
related: ["syv-design-system", "syv-docs", "syv-pj", "syv-pj-api"]
tags: ["flutter", "dart", "mobile-first", "android", "ios", "subordinacion-y-valor", "character-sheet", "design-system", "presentation-layer", "fvm", "syv-ui", "diseño-verde"]
problems_solved:
  - "The Subordinación y Valor (SyV) universe generates rich character data through sibling repos (domain spec, HTTP motor, lore vault) but had no native mobile surface to present fichas with the correct clerical-military aesthetic — web or ad-hoc UIs would drift from canon visuals and reimplement domain logic."
  - "Cross-repo SyV work needs a presentation-only Flutter client that consumes syv-pj-api without duplicating generation, validation, or persistence — keeping domain truth in syv-pj and motor logic in syv-pj-api while agents and humans iterate on screens lore-first."
  - "Diseño Verde tokens and components must ship inside the app repo as an extractable local package (packages/syv_ui) so character sheets, stats (cuerpo·mente·alma), and navigation chrome share one generated token SSOT from syv-design-system without hardcoded colors or shadow-based elevation."
technologies:
  - "Flutter 3.44.2 (FVM-pinned)"
  - "Dart 3.12.2"
  - "FVM 4.1.1"
  - "packages/syv_ui — local Diseño Verde design system"
  - "flutter_svg ^2.0.0"
  - "integration_test (SDK)"
  - "flutter_lints ^6.0.0"
  - "Android / iOS targets (mobile-first)"
  - "OFL fonts: Nunito, DM Mono, Saira Stencil One, Bitter"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-pj-flutter

> **Problem thesis (required):** *Subordinación y Valor* is a lore-heavy Argentine dystopia with formal character mechanics (fichas, facciones, the cuerpo·mente·alma triad) defined outside any single app. Operators and players need a dedicated **universe interface** — not another backend — that shows generated character sheets with the correct *Diseño Verde* look, pulls data from the shared motor API, and never reimplements domain rules. This repository is that Flutter presentation client: it started as a Stage-1 bootstrap and has grown into a mobile-first shell with a local `syv_ui` package, a lore-aware home screen, a living design-system showcase, and a blank ficha canvas ready for real API wiring.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-pj-flutter` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Flutter mobile client for the SyV universe — pure presentation layer that will consume `syv-pj-api`, render fichas with the local *Diseño Verde* design system, and grow into the common front-end for sibling projects (character creator today, battle simulator tomorrow). |
| Audience | SyV product developers and designers, mobile players/readers of character sheets, AI coding agents (via `AGENTS.md`, `.claude/rules/`, locked Flutter skills), and sibling-repo maintainers who need a stable UI contract for `PersonajeOut` JSON. |

## 2. Problems it solves

### P1 — No authoritative mobile surface for SyV character fichas

- **Who hurts:** Anyone trying to *see* a SyV personaje after generation — writers, GMs, developers testing `syv-pj-api`, and future players of SyV-adjacent games.
- **Pain today:** Character data lives in HTTP JSON from the motor and in Markdown contracts in `syv-pj`, but without a Flutter client each surface reinvents layout, stat visualization, and faction tone. Generic mobile UI does not convey the clerical-military, neon-glow, lowercase voice of the universe.
- **How this repo answers:** Builds a **presentation-only** Flutter app organized by features (`home`, `showcase`, `ficha`) with all visual chrome coming from `packages/syv_ui` — stat tiles (`SyvStat`, `SyvStatBtn`), chips, cards, inputs, and the `SyvLogo` lockup. `FichaView` is the intentional blank canvas for the character sheet; `HomeView` already frames the universe and routes to generation and design-system inspection. Data will arrive from `syv-pj-api` via a future HTTP seam documented in `docs/ARCHITECTURE.md`.
- **Out of scope:** Generating, validating, canonizing, or persisting personajes; owning lore text (that is `syv-docs`); running a backend or database.

### P2 — Domain logic must not be duplicated in the UI repo

- **Who hurts:** Maintainers of `syv-pj` (contracts), `syv-pj-api` (motor), and agents that might otherwise copy Pydantic shapes into Dart by hand.
- **Pain today:** Flutter apps often embed business rules (tag validation, attribute derivation, procedural generation), which diverges from the Python motor and breaks reproducible seeds. SyV explicitly separates *what a personaje is* from *how it is shown*.
- **How this repo answers:** Permanent constraints in `PRD.md`, `AGENTS.md`, and `docs/REQUIREMENTS.md`: **no backend**, **read-only** toward domain (F-3), HTTP-only data from `syv-pj-api` (F-2), consult `syv-pj` before inventing fields (agent rule 2). Ecosystem summaries in `docs/ecosystem/` document the exact API routes and `PersonajeOut` JSON the UI will deserialize — the app is a client, not a second motor.
- **Out of scope:** Porting the 8-phase generation pipeline, D1/SQLite access, hito mutation logic, or catalog authoring.

### P3 — Visual consistency via an in-repo, extractable design system package

- **Who hurts:** Flutter developers and agents adding screens who might hardcode hex values, Material elevation shadows, or English domain terms (`character`, `model`).
- **Pain today:** The upstream `syv-design-system` repo holds DTCG JSON, but Flutter widgets need a local package with generated `syv_tokens.dart`, theme factory, glow background, and ten-plus `Syv*` components. Without bundling fonts at the app level, package widgets fail to resolve Nunito/DM Mono/Saira/Bitter families.
- **How this repo answers:** `packages/syv_ui` is a path dependency (`syv_ui: path: packages/syv_ui`) materializing *Diseño Verde*: DTCG-generated tokens, `syvTheme()`, `SyvGlow` screen wrapper, accent ramps, stat SVG icons, and components documented exhaustively in `docs/DESIGN-SYSTEM.md`. App-level `pubspec.yaml` declares OFL font assets. `ShowcaseView` is the living specimen; widget tests assert all eight core component types render. ADR-001 enforces Spanish domain terms in code (`personaje`, `ficha`, `faccion`) vs framework nouns.
- **Out of scope:** Editing generated token files by hand (regenerate from upstream JSON), publishing `syv_ui` to pub.dev, or maintaining the Astro/Svelte ports (those stay in `syv-design-system`).

## 3. Product / idea

The mental model is **lore → dominio → interfaz**:

```
syv-docs (universe SSOT) → syv-pj (personaje contracts) → syv-pj-api (motor) → syv-pj-flutter (this app)
                                      ↑
                         syv-design-system → packages/syv_ui (visual language)
```

The app is **the face of the universe** — steered in `PRD.md` (2026-06-27) beyond a narrow "viewer" toward the **common front-end** for all SyV tools that spin out around the SSOT (character creator now, battle simulator later). Every feature should be conceived as a *view of the universe* (a ficha, an encounter, a facción), not a generic CRUD screen.

Current runnable experience:

1. `SyvPjApp` (`lib/app/app.dart`) applies `syvTheme()` and opens `HomeView`.
2. **Home** — lore paragraph, cuerpo·mente·alma legend, bottom nav: *generar personaje* (live → empty `FichaView`), *listado de personajes* (inert), *diseño verde* (live → `ShowcaseView`).
3. **Showcase** — scrollable catalog of every `Syv*` component with interactive demos (stats, switches, inputs, cards, chips, buttons, logo variants).
4. **Ficha** — `SyvScreen` header only; body intentionally empty until API-backed sections land.

Architecture is **feature folders under `lib/features/`**, single assembly point in `app/app.dart` (future router). Presentation package is isolated under `packages/syv_ui/` for eventual extraction.

**Documentation drift note:** `README.md`, `AGENTS.md`, and `PRD.md` Etapa 1 sections still describe a **Linux desktop** target with `window_manager` (390×844 borderless window). Canonical `docs/ARCHITECTURE.md` and `docs/REQUIREMENTS.md` (F-4) state **mobile-first: Android primary, iOS secondary**, `linux/` scaffold not maintained, `window_manager` removed. Current `pubspec.yaml` and `lib/main.dart` match the mobile-first doc (simple `runApp`, no `window_manager` dependency). Treat `docs/ARCHITECTURE.md` as authoritative for platform strategy.

### 3.1 North-star use cases

1. **Generate and view a personaje** — User picks facción/rango on home, motor returns ephemeral `PersonajeOut` from `GET /generar`, ficha screen renders identidad, atributos, tags, historia, derived fields (`fatiga_max`, `filiacion`, etc.) using only `syv_ui` widgets.
2. **Browse canonized roster** — Listado navigates to persisted slugs; detail via `GET /personaje/{slug}`; historial via `GET /personaje/{slug}/historial`.
3. **Design-system QA** — Developer or agent opens *diseño verde* showcase to verify token regressions and component parity with upstream `syv-design-system` before shipping new ficha sections.
4. **Agent iteration loop (Stage 2, planned)** — Python `uv` harness seeds local motor responses or drives integration tests while AI agents modify UI under explicit user instruction (agent rules currently **forbid** silent edits to `lib/`, `pubspec.yaml`, tests).

### 3.2 Non-goals

- No embedded backend, SQLite, or offline canonization (permanent in PRD constraints).
- No reimplementation of tag catalogs, generation phases, or Pydantic validation.
- No Linux desktop maintenance unless explicitly re-requested (scaffold present, not active target).
- No web target in current requirements (CORS on motor unverified for browser clients).
- `historia` prose from motor is still stub lorem — UI must not assume final narrative quality yet (`docs/ecosystem/syv-pj-api.md`).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Dart 3.12.2, Flutter 3.44.2 stable via FVM | `.fvmrc`, `pubspec.yaml` `environment.sdk` |
| SDK manager | FVM 4.1.1 — always `fvm flutter`, never bare `flutter` | `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/REQUIREMENTS.md` NF-1 |
| Frontend | Flutter Material + custom `syv_ui` theme | `lib/app/app.dart`, `packages/syv_ui/` |
| Backend / API | None in-repo; planned HTTP client to sibling `syv-pj-api` | `docs/ecosystem/syv-pj-api.md`, `docs/ARCHITECTURE.md` costura table |
| Data | No local persistence; remote `PersonajeOut` JSON only (future) | `docs/REQUIREMENTS.md` F-2, F-3 |
| Infra / deploy | No CI workflows in tree; standard Flutter build per platform | absent `.github/`; `android/`, `ios/` scaffolds |
| AI / agents | `AGENTS.md` (SSOT), `CLAUDE.md` alias, `.claude/rules/` ADR symlinks, `skills-lock.json` (10 Flutter skills from `flutter/skills` on GitHub) | `AGENTS.md`, `.claude/rules/`, `skills-lock.json` |
| Tests | `flutter_test` widget test on showcase; `integration_test` smoke boot | `test/widget_test.dart`, `integration_test/app_test.dart` |

### 4.1 Notable dependencies (curated)

- **`syv_ui` (path)** — local Diseño Verde package: tokens, theme, glow, 13+ public components (`SyvScreen`, `SyvNavButton`, `SyvTextarea`, etc. per `packages/syv_ui/lib/syv_ui.dart`).
- **`flutter_svg` ^2.0.0** — SVG rendering for stat glyphs and logo assets inside `syv_ui`.
- **`cupertino_icons` ^1.0.8** — standard Flutter icon supplement.
- **`integration_test` (SDK dev)** — device/emulator e2e smoke.
- **`flutter_lints` ^6.0.0** — analyzer rules via `analysis_options.yaml`.
- **Bundled OFL fonts** — Nunito Variable, DM Mono, Saira Stencil One, Bitter variable (+ italic) at `assets/fonts/`, declared in app `pubspec.yaml` (required for token family names to resolve).

## 5. Repository map (abstraction)

- **Entrypoints:** `lib/main.dart` → `lib/app/app.dart` (`SyvPjApp`); platform runners `android/`, `ios/`, legacy `linux/`, `web/` scaffold.
- **Domain / core (presentation):** `lib/features/home/`, `lib/features/showcase/`, `lib/features/ficha/` — each feature owns its view; no `lib/core/` yet (reserved for HTTP client per architecture costura).
- **Design system adapter:** `packages/syv_ui/lib/` — `src/tokens/` (generated), `src/theme/`, `src/foundations/`, `src/icons/`, `src/components/`.
- **Docs vaults:** `docs/ARCHITECTURE.md`, `docs/REQUIREMENTS.md`, `docs/DESIGN-SYSTEM.md`, `docs/adrs/`, `docs/ecosystem/` (sibling-repo memory), root `PRD.md`, `CHANGELOG.md`.
- **Agent scaffolding:** `AGENTS.md` (SSOT), `CLAUDE.md` (pointer), `.claude/rules/` (symlinks to `docs/adrs/adr-000-template.md`, `adr-001-glosario.md`, `adr-002-canonical-docs.md`), `skills-lock.json`.
- **`.docs/`:** **not present** in this repository (scan attempted; no hidden docs vault).
- **Generated / vendor:** `linux/flutter/generated_*`, `pubspec.lock`, `.fvm/` cache (gitignored) — noted only, not ingested.
- **Assets:** `assets/fonts/` (typography), `web/icons/` (PWA placeholders).

## 6. Configuration & contracts (no secrets)

- **FVM pin:** `.fvmrc` → Flutter `3.44.2`.
- **Dart SDK constraint:** `^3.12.2` in root and `packages/syv_ui/pubspec.yaml`.
- **App identity:** package name `syv_pj_flutter`; PRD documents bundle id `com.kodexarg` / `com.kodexarg.syvPjFlutter`; Android Kotlin namespace `com.kodexarg.syv_pj_flutter` in `android/app/src/main/kotlin/`.
- **Environment files:** `.env` is gitignored — not read; no env-var contract documented for the Flutter app itself.
- **Agent edit guardrails:** do not modify `lib/`, `linux/`, `pubspec.yaml`, `.fvmrc`, `test/`, `integration_test/`, `.gitignore`, `skills-lock.json` without explicit user instruction (`AGENTS.md`, `docs/REQUIREMENTS.md`).
- **Future HTTP base URL:** will be configured when motor client lands; production motor host is documented only in sibling ecosystem notes — not duplicated here to avoid stale URL literals.

### 6.1 HTTP / API endpoints (when applicable)

This repo **does not expose** HTTP. It is a **planned consumer** of the sibling `syv-pj-api` motor. Endpoints the UI will call (Spanish route surface per motor ADR-004), summarized from `docs/ecosystem/syv-pj-api.md`:

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/personaje` | Generate ephemeral personaje (query: `faccion?`, `rango?`, `semilla?`, `campos?`, repeatable `tag?`) | none documented |
| `GET` | `/generar` | Same full 8-phase pipeline as `/personaje` | none documented |
| `GET` | `/personaje/{slug}` | Canonized ficha by slug; optional `campos?` pruning | none documented |
| `GET` | `/personaje/{slug}/historial` | Hito list only | none documented |
| `POST` | `/personaje/{slug}/evento` | Append hito, apply effects | none documented |
| `POST` | `/canonizar` | Persist ephemeral → assign slug (idempotent by seed+faccion+rango) | none documented |
| `GET` | `/meta/facciones` | Faction catalog with lore | none documented |
| `GET` | `/meta/rangos` | Rank catalog with `atributos_base` | none documented |
| `GET` | `/meta/tipos_hito` | Suggested hito types | none documented |
| `GET` | `/meta/encuentro/nuevo` | Opaque encounter patent | none documented |
| `GET` | `/meta/{categoria}` | Tag catalog (aspecto, habilidad, entrenamiento, equipo, rasgo, …) | none documented |
| `GET` | `/meta/{categoria}/{subcategoria}` | Filtered catalog (e.g. equipo/arma) | none documented |

**No HTTP client is wired in the Flutter tree yet** — no `http`/`dio` dependency in `pubspec.yaml`. CORS and auth on the motor were **not verified** at ecosystem doc time; mobile/desktop native calls may not need CORS.

### 6.2 Other interfaces

- **Flutter UI routes (in-app):** `MaterialPageRoute` pushes from `HomeView` to `FichaView` and `ShowcaseView`; no declarative router package yet (skill locked for future: `flutter-setup-declarative-routing`).
- **CLI (dev):** `fvm install`, `fvm flutter pub get`, `fvm flutter run` (device/emulator), `fvm flutter test`, `fvm flutter test integration_test/`, `fvm flutter analyze`.
- **Locked agent skills:** ten Flutter skills in `skills-lock.json` (widget tests, integration tests, HTTP package usage, JSON serialization, routing, localization, architecture practices, responsive layout, layout fixes, widget preview).

## 7. Data & persistence

- **In-app stores:** none. No Hive, SQLite, shared_preferences, or local JSON caches in `pubspec.yaml`.
- **Remote entities (via future API):** `PersonajeOut` with blocks `identidad`, `atributos` (cuerpo·mente·alma 2–7), `tags[]`, `historia`, `historial[]`, `metadatos`, `extras`; derived fields `es_canon`, `fatiga_max`, `moral_max`, `fza_aportada`, `filiacion`. Auxiliary models: `HitoModel`, `FaccionOut`, `RangoOut`, `EncuentroOut` — shapes documented in `docs/ecosystem/syv-pj-api.md` and `docs/ecosystem/syv-pj.md`.
- **Topology:** mobile client → HTTP → Cloudflare Python Worker motor with D1 in production / local SQLite file in dev (motor-side only). This app holds no edge or offline canon.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — quick start (FVM), stack table, lib layout (partially stale vs mobile-first docs), test commands, ecosystem pointer.
2. **`PRD.md`** — north-star steering (universe interface), three historical etapas, ecosystem table, permanent constraints (no backend, FVM-only, single target per stage).
3. **`AGENTS.md`** — repo SSOT for agents; stack table (stale Linux notes), etapas, five agent rules including protected paths.
4. **`CLAUDE.md`** — alias to `AGENTS.md`.
5. **`docs/ARCHITECTURE.md`** — canonical mobile-first target, `syv_ui` structure, future seams (HTTP, router, Python harness).
6. **`docs/REQUIREMENTS.md`** — F-1..F-5 functional, NF-1..NF-6 non-functional, agent rules.
7. **`docs/DESIGN-SYSTEM.md`** — full component catalog, token tables, Diseño Verde non-negotiables.
8. **`docs/adrs/adr-001-glosario.md`** — domain↔code glossary bridging to `syv-docs` vault paths.
9. **`docs/adrs/adr-002-canonical-docs.md`** — mandatory reading list before implementation.
10. **`docs/ecosystem/README.md`** plus `syv-docs.md`, `syv-pj.md`, `syv-pj-api.md`, `syv-design-system.md` — sibling-repo summaries from the UI perspective.
11. **`.claude/rules/`** — symlinks mirroring ADRs 000–002 for agent context loading.
12. **`CHANGELOG.md`** — grouped history: Linux bootstrap, design-system integration, living-documentation baseline.
13. **`skills-lock.json`** — pinned Flutter agent skills with content hashes.
14. **`.docs/`** — **absent**; no hidden vault at this path.

## 9. Security & privacy notes (summary-time)

- Public repo; summary contains no credentials, PEM material, or `.env` values.
- Motor API has **no documented authentication**; treat all personaje endpoints as open HTTP until sibling repo adds auth.
- App is read-only toward domain today; future canonize/evento POSTs will need explicit UX and trust boundaries.
- Android signing secrets (`key.properties`, keystores) are gitignored — not present in tree.
- Agent rules restrict unsolicited code changes, reducing accidental secret commits in protected paths.

## 10. Operational picture

- **Local dev:** install FVM → `fvm install` → `fvm flutter pub get` → `fvm flutter run` on Android emulator or iOS simulator (primary); `linux/` exists but is not the maintained target per canonical docs.
- **Quality gates:** `fvm flutter analyze` (flutter_lints), `fvm flutter test` (showcase widget test with tall viewport), `fvm flutter test integration_test/` (boot smoke expecting logo wordmark).
- **Deploy:** no GitHub Actions or Cloudflare deploy config in this repo; distribution is standard Flutter store/build pipelines (not yet documented here).
- **Stage 2 harness (planned):** Python 3.13+ with `uv` for data seeding / motor simulation (`PRD.md`, NF-6) — not present in tree yet.
- **Hardware:** mobile-first; no GPU or embedded constraints documented.

## 11. Open questions / unknowns

- **Platform SSOT conflict:** README/AGENTS/PRD Etapa 1 vs `docs/ARCHITECTURE.md` / `REQUIREMENTS.md` on Linux vs mobile-first — which doc set will be reconciled next?
- **HTTP client choice and base URL configuration:** no `http` package or env contract in app yet.
- **Listado de personajes:** nav button present but inert — no local or remote list implementation.
- **`FichaView` content:** header-only shell; no binding to `PersonajeOut` fields.
- **Motor `historia` field:** still procedural stub text; timeline for real LLM `ProseProvider` unknown from this tree.
- **CORS / Worker edge headers:** unverified for any future web build.
- **CI/CD:** no workflows found; release process unknown.
- **`.docs/` vault:** does not exist in this repo (unlike some sibling SyV projects).
