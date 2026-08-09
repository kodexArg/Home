---
id: "syv-design-system"
title: "SyV Design System — Diseño Verde cross-platform token and component library"
visibility: public
importance: normal
source_repo: "syv-design-system"
org: "kodexArg"
default_branch: "main"
primary_language: "JSON"
repo_kind: "library"
status: "active"
related: []
tags: ["design-system", "dtcg", "tokens", "flutter", "astro", "svelte", "css", "subordinacion-y-valor", "mobile-first", "typography", "brand"]
problems_solved:
  - "SyV products spanning Flutter mobile and Astro/Svelte web need one authoritative visual language — military olive-drab palette, institutional celeste, neon glow depth motif — without each app hardcoding divergent colors, spacing, and typography."
  - "Game and lore interfaces need a deliberate split between interface voice (Nunito for headings, labels, controls) and reading voice (Bitter slab serif on parchment for long-form paragraphs) so character sheets and dossiers feel like documents, not dialog boxes."
  - "Brand mark geometry (cross + chevrons wordmark) must stay consistent across Dart CustomPaint, Astro, Svelte, and standalone SVG without each port inventing its own coordinates."
technologies:
  - "Design Tokens Community Group (DTCG) JSON SSOT"
  - "Flutter / Dart (syv_tokens.dart, syvTheme)"
  - "Astro components"
  - "Svelte 5 (runes, $bindable)"
  - "CSS custom properties (--syv-*)"
  - "Nunito · Bitter · DM Mono · Saira Stencil One"
  - "Bun (preview dev server only, gitignored _preview-astro)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# syv-design-system

> **Problem thesis (required):** Subordinación y Valor (SyV) spans multiple surfaces — a Flutter game client, Astro/Svelte web apps, and agent-assisted design workflows — yet must read as one coherent clerical-military Argentine dystopia. Without a single source of truth, colors drift, typography collapses into one undifferentiated voice, and the brand mark renders inconsistently across frameworks. This repository is the **Diseño Verde** design system: one DTCG token file fans out to Dart and CSS targets, plus a mirrored `syv-*` component library in Astro and Svelte 5, with canonical logo geometry and exhaustive agent-facing documentation so humans and AI assistants implement the same visual contract everywhere.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/syv-design-system` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Platform-agnostic design system for Subordinación y Valor — one JSON token SSOT, generated Dart/CSS outputs, and dual-framework web components under strict military-green aesthetic rules. |
| Audience | SyV product developers (Flutter and web), designers syncing to Claude Design artifacts, AI coding agents (via `INDEX.md` and `CLAUDE.md`), and any kodexArg repo consuming the SyV visual language. |

## 2. Problems it solves

### P1 — Cross-platform visual drift without a token SSOT

- **Who hurts:** Teams shipping SyV on Flutter (`syv-pj-flutter`) and web (Astro/Svelte apps such as the kodexArg Home site), plus any future target that needs the same palette.
- **Pain today:** Hardcoded hex values in each framework diverge silently; the original *Diseño Naranja* (orange-led) and its *Diseño Verde* evolution (olive-drab-led) multiply if every app maintains its own palette. Elevation shadows and neon misuse creep in when there is no written rule.
- **How this repo answers:** `tokens/syv.tokens.json` is the sole authority in DTCG format. Generated outputs `flutter/syv_tokens.dart` (classes `SyvColors`, `SyvType`, `SyvSpace`, `SyvRadius`, `SyvBorders`, `SyvMotion`, `SyvGlow`, `syvTheme()`) and `astro+svelte/syv.tokens.css` (`--syv-*` custom properties) must be regenerated from the JSON — never hand-edited for values. `INDEX.md` documents the strict hierarchy and full token tables so agents need not grep.
- **Out of scope:** Automated regeneration CLI (not documented; manual regen with `GENERATED from` header), npm package publishing, runtime theme switching API, or managing Flutter widget implementations (those live in the external `syv-pj-flutter` repo).

### P2 — One typeface cannot serve both UI chrome and long-form lore

- **Who hurts:** Players and readers of SyV lore — character backstories, field reports, confession transcripts — rendered in the same rounded sans as button labels.
- **Pain today:** Nunito alone reads as interface text even in paragraphs; extended reading causes fatigue and breaks the "official document" register the universe demands.
- **How this repo answers:** `TYPOGRAPHY.md` documents the deliberate **UI ↔ reading split**: Nunito for display/headline/title/body (interface voice), Bitter slab serif for the `prose` role on `cream.200` parchment (reading voice), DM Mono for code/terminal/kicker, Saira Stencil One exclusively for the logo wordmark. Token `font.role.prose` binds to `<p>` in `base.css` and `SyvType.prose` in Dart. Lowercase everywhere except the kicker eyebrow (sole uppercase element).
- **Out of scope:** i18n typography, dynamic font loading beyond documented Google Fonts import or self-hosted TTF paths in the Flutter asset tree, or web font subsetting pipelines.

### P3 — Brand mark geometry inconsistency across framework ports

- **Who hurts:** Anyone placing the SyV logo in apps, marketing, or design-sync workflows; prior Svelte port had a documented 5px cross drift.
- **Pain today:** Each framework reimplemented cross + double-chevron geometry from memory; sizes diverged (~10% between Dart and web), and neon chevron opacity varied.
- **How this repo answers:** `assets/logo/syv-mark.svg` is the canonical 96×96 framework-agnostic mark. `LOGO.md` holds geometry tables, variant recolor rules (`militar`, `argentina`, `clerical`), size scale, lockup rules, and a known-drift matrix. `SyvLogo` ports in Astro and Svelte derive from this spec; changelog records the Svelte cross `translateY` fix.
- **Out of scope:** Vectorizing the wordmark into SVG paths (wordmark stays live Saira Stencil One text), light-background logo variants, or favicon/ICO generation pipelines.

## 3. Product / idea

The central idea is **one SSOT, many targets, framework-agnostic design entities**. Tokens are born platform-neutral in JSON; frameworks are the final *how*, not parallel sources of truth. The aesthetic is **Diseño Verde** — matte military olive-drab 1978 as lead accent, warm near-black ink surfaces, institutional celeste and moss, amber and petróleo as second voices — evolved from the original *Diseño Naranja* (preserved as an ignored local sub-git snapshot, not tracked).

Depth is never elevation shadow: it is **one off-center neon-green radial glow per surface** (`glow.color` at 0.16 opacity), 1.5px hairline borders in `ink.600`, and small austere radii (sm 4 · md 6 · lg 12). Controls are squared and military; mobile-first breakpoints at 0 / 768 / 1024 logical px.

The web layer ships eight mirrored components (`SyvButton`, `SyvCard`, `SyvChip`, `SyvInput`, `SyvKicker`, `SyvLogo`, `SyvSwitch`, `SyvStat`) in both `astro+svelte/astro/` and `astro+svelte/svelte/`, consuming `--syv-*` variables. Flutter parity is documented in `INDEX.md` but widget source lives externally; Flutter-only extras include `SyvStatBtn`, `SyvSection`, `SyvTextarea`.

`SyvStat` is domain-specific: a character-sheet attribute control for cuerpo / mente / alma on scale 2–7, with per-stat icons and palette voices (amber, petróleo/amethyst, celeste), editable pips, and keyboard arrows — tying the design system directly to the SyV tabletop RPG data model.

### 3.1 North-star use cases

1. **Token change propagation** — Designer or agent edits `tokens/syv.tokens.json`, regenerates `syv_tokens.dart` and `syv.tokens.css`, and all SyV apps pick up the same olive, celeste, spacing, and motion values.
2. **Web app integration** — An Astro or Svelte 5 app imports three CSS layers (`syv.tokens.css`, `fonts.css`, `base.css`) plus copies or links `Syv*.astro` / `Syv*.svelte` components for instant SyV chrome.
3. **Agent onboarding** — An AI assistant reads `INDEX.md` first for SSOT flow, token tables, component parity matrix, and regeneration notes; `CLAUDE.md` adds design rules and ecosystem inheritance from the parent SyV workspace.
4. **Design sync** — Tokens and components serve as the durable deliverable for pushing to Claude Design artifacts; `showcase.html` provides a volatile static specimen (explicitly not trusted as SSOT).

### 3.2 Non-goals

- Not a publishable npm/Dart package with semver releases in this repo (it is a consultation/library repo).
- Not a complete Flutter UI kit here — only the Dart token file; widgets are in `syv-pj-flutter`.
- No documented automated build/regeneration script (manual process described in `INDEX.md` §6).
- No CI/CD, no HTTP API, no database — pure static assets and documentation.
- Original *Diseño Naranja* and external reference bundles are gitignored and out of tree.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | JSON (DTCG tokens), Dart, HTML/CSS, TypeScript (Svelte props) | `tokens/syv.tokens.json`, `flutter/syv_tokens.dart`, `astro+svelte/svelte/*.svelte` |
| Frontend | Astro components, Svelte 5 (runes, `$bindable`, Snippet children) | `astro+svelte/astro/`, `astro+svelte/svelte/` |
| Mobile | Flutter token classes + external `syv_ui` package | `flutter/syv_tokens.dart`, cross-refs in `INDEX.md` |
| Styling | CSS custom properties, scoped component `<style>` blocks | `astro+svelte/syv.tokens.css`, `base.css`, `fonts.css` |
| Data | None — static design tokens only | — |
| Infra / deploy | None in-repo; optional Bun dev preview (gitignored `_preview-astro/`) | `.gitignore`, `INDEX.md` §3 |
| AI / agents | `CLAUDE.md`, `INDEX.md` as agent front door | `CLAUDE.md`, `INDEX.md` |
| Tests | None evident | — |

### 4.1 Notable dependencies (curated)

- **DTCG token schema** — `tokens/syv.tokens.json` declares `$schema` for Design Tokens Community Group format; enables tool-agnostic token exchange.
- **Nunito Variable** — interface and display typeface; weights 400/500/800.
- **Bitter** — slab serif for `prose` role only; variable font for on-screen reading.
- **DM Mono** — code, terminal, and kicker eyebrow (uppercase, wide tracking).
- **Saira Stencil One** — brand wordmark in `SyvLogo` only; never headings or body.
- **Svelte 5 runes** — `$props`, `$derived`, `$bindable` in web components (e.g. `SyvStat`, `SyvButton`).
- **Google Fonts CDN** — loaded via `@import` in `fonts.css` (self-host alternative documented pointing at Flutter asset TTF paths).

## 5. Repository map (abstraction)

- **Entrypoints / front door:** `INDEX.md` (agent and developer index), `README.md` (overview and principles).
- **SSOT / domain core:** `tokens/syv.tokens.json` — colors, typography roles, spacing, radius, border, glow, motion, breakpoints.
- **Generated targets:** `flutter/syv_tokens.dart`, `astro+svelte/syv.tokens.css` — must carry `GENERATED from tokens/syv.tokens.json` header.
- **Manual web styling:** `astro+svelte/fonts.css` (font-face / CDN import), `astro+svelte/base.css` (element defaults, `.syv-glow`, heading/prose/kicker rules).
- **Component library (web):** `astro+svelte/astro/Syv*.astro` and `astro+svelte/svelte/Syv*.svelte` — eight components with matching contracts.
- **Brand assets:** `assets/logo/syv-mark.svg` + `LOGO.md` spec.
- **Docs vaults:** Root markdown (`TYPOGRAPHY.md`, `CHANGELOG.md`, `astro+svelte/README.md`); no `docs/` or `.docs/` directory present.
- **Agent scaffolding:** `CLAUDE.md` (Claude Code exclusive context, design rules, workflow, artifact references); no `.claude/` directory tree.
- **Preview / volatile:** `astro+svelte/showcase.html` (static specimen), `_preview-astro/` (gitignored Astro dev preview).
- **Ignored reference material:** `_original-naranja-claude-code/`, `subordinacion-y-valor-claude-design-system/`, `.design-verde-dump.json`, `.astro-svelte-cheatsheet.md` — not in clone tree.

## 6. Configuration & contracts (no secrets)

This repository has **no environment variables, no secrets, no runtime configuration files**. All contracts are static:

- **Token naming:** DTCG dot paths in JSON map to `--syv-*` CSS variables and `SyvColors.*` / `SyvSpace.*` Dart constants.
- **Component props:** Documented in `astro+svelte/README.md` — e.g. `SyvButton` accepts `variant` (primary|secondary|ghost), `color` (olive|celeste|amber|teal|neon|white|bad), `size`, `mono`, `href`; `SyvStat` accepts `stat` (cuerpo|mente|alma), `value` 2–7, `editable`, `name`.
- **CSS load order:** `syv.tokens.css` → `fonts.css` → `base.css`.
- **Glow rule:** `green.neon` (`#34E867`) permitted only as background radial glow at 0.16 opacity — never fill, text, or border.
- **Regeneration contract:** Edit JSON → regenerate Dart and CSS → keep GENERATED header; no automated command documented.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server, API routes, or network surface**. It is a static design-token and component source library consumed by other applications.

There is no OpenAPI spec, no Workers routes, no Django `urls.py`, and no README API section. Integration is via file copy, git submodule, or manual import of CSS and components into consuming apps.

### 6.2 Other interfaces

- **Library import (web):** Link three CSS files; import `Syv*.astro` or `Syv*.svelte` into app pages.
- **Library import (Flutter):** Copy or depend on `syv_tokens.dart`; use external `syv_ui` widgets from `syv-pj-flutter`.
- **Static preview:** Open `astro+svelte/showcase.html` in a browser for component specimens.
- **Dev preview (optional, gitignored):** `cd _preview-astro && bun install && bun run dev` per `INDEX.md` — Astro dev server, not versioned.
- **Design sync (planned):** `CLAUDE.md` references `/design-sync` to Claude Design when a compilable component repo exists; durable deliverable today is tokens + Dart.
- **Custom events:** `SyvStat` emits `syv:change` (Astro) or uses `bind:value` (Svelte) when editable.

## 7. Data & persistence

No databases, KV stores, vector indexes, or persistent runtime state. The only "data" is the token JSON schema and static SVG logo geometry. All artifacts are file-based and intended for version control. Offline-first by nature — no cloud topology, no edge bindings, no migrations.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — Diseño Verde principles, SSOT→targets structure, component list, provenance from Diseño Naranja evolution and Claude Design artifacts.
2. **`INDEX.md`** — Authoritative front door: SSOT flow diagram, full color/typography/spacing/radius/motion/glow/breakpoint tables, component parity matrix (web vs Flutter), logo summary, font file locations, regeneration notes, file map.
3. **`CLAUDE.md`** — Agent-exclusive rules: framework agnosticism, palette lead (olive), neon exception, typography split, no elevation shadows, mobile-first, workflow steps, artifact and Figma references (auth-walled, not re-fetched).
4. **`TYPOGRAPHY.md`** — Rationale for Nunito vs Bitter split, all six type roles, parchment `cream.200` for prose, kicker uppercase rule, logo font isolation.
5. **`LOGO.md`** — Canonical SVG spec, geometry table, variants, sizes, lockup rules, port file map, known drift (Svelte cross fix, size scale Dart vs web).
6. **`CHANGELOG.md`** — Recent groups: prose-reading-role (Bitter + cream.200), index-front-door, logo-canonical-asset.
7. **`astro+svelte/README.md`** — Component props table, SyvStat domain mapping (cuerpo/mente/alma), usage snippets for Astro and Svelte.
8. **`tokens/syv.tokens.json`** — DTCG SSOT with color, font, typography, space, radius, border, glow, motion, breakpoint groups.
9. **`.claude/`** — **Not present** in repository tree (scanned; directory does not exist).
10. **`.docs/`** — **Not present** in repository tree (scanned; directory does not exist).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; safe to reference by repo name and path. No clone URLs needed in related frontmatter.
- **Auth model:** None — static files only.
- **Secrets:** No `.env`, credentials, API keys, or connection strings in the tracked tree. `fonts.css` references a public Google Fonts CDN import (external dependency, not a secret).
- **Ignored paths:** `.gitignore` excludes `node_modules/`, `_preview-astro/`, original Naranja sub-git, design dump JSON, and reference bundles — not read during this scan.
- **This summary contains no secrets, private keys, or scraped environment files.**

## 10. Operational picture

- **Local development:** Optional Astro preview via Bun in gitignored `_preview-astro/` (`bun install`, `bun run dev`). Static specimen via `astro+svelte/showcase.html` (open directly).
- **Token workflow:** Manually edit `tokens/syv.tokens.json` → regenerate `flutter/syv_tokens.dart` and `astro+svelte/syv.tokens.css` (no documented script) → update components if contracts change.
- **Deployment:** None from this repo itself. Consuming apps (e.g. kodexArg Home, syv-pj-flutter) deploy independently and import these assets.
- **CI/CD:** No `.github/` workflows present in the shallow clone.
- **Hardware constraints:** None — design tokens and CSS/Dart files are lightweight static artifacts.

## 11. Open questions / unknowns

- **Regeneration automation:** No build script or `package.json` task documents how to regenerate Dart/CSS from JSON; process is described as manual.
- **`_preview-astro/` contents:** Gitignored; dev preview structure and Astro version unknown without checking out ignored path locally.
- **Flutter widget parity:** Full component implementations referenced at `syv-pj-flutter/packages/syv_ui/` but that external repo was not cloned for this summary.
- **Font self-hosting for web:** `fonts.css` defaults to CDN import; self-hosted `@font-face` paths point at Flutter asset tree — web production hosting strategy per app is unknown.
- **npm/Dart package publishing:** Whether consumers should submodule, copy-paste, or eventually publish `syv-design-system` as a package is undocumented.
- **Primary language signal:** GitHub reports `HTML` (likely from `showcase.html`); actual authoring spans JSON, Dart, CSS, Svelte, and Astro.
