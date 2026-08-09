---
id: "design.kodexarg.com"
title: "design.kodexarg.com — kodexArg design system SSOT"
visibility: private
importance: high
source_repo: "design.kodexarg.com"
org: "kodexArg"
default_branch: "main"
primary_language: "CSS"
repo_kind: "application"
status: "active"
related: []
tags: ["design-system", "astro", "svelte", "cloudflare-workers", "bun", "static-site", "tokens", "report-html", "mermaid", "presentation-orange", "liminal"]
problems_solved:
  - "Centralizes kodexArg visual identity (warm dark liminal canvas, rationed orange, monospace brand voice) as a single token SSOT consumed by every sibling property."
  - "Provides a live, browsable styleguide and reusable Svelte components so agents and humans do not reinvent branding per repo."
  - "Distills the Presentation Orange aesthetic into a self-contained mobile-first HTML report lineage for WhatsApp-shareable artifacts with validated mermaid diagrams."
technologies:
  - "Astro 6"
  - "Svelte 5 (runes)"
  - "Cloudflare Workers (static assets)"
  - "Bun"
  - "Wrangler 4"
  - "Python 3 (mermaid validator tool)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# design.kodexarg.com

> **Problem thesis (required):** This repository is kodexArg's design system — the single source of truth for visual tokens, brand components, and a related HTML-report lineage. It solves fragmented branding across multiple sibling web properties by publishing `tokens.css` as the canonical palette and typography contract, ships a live dark-first styleguide that demonstrates the aesthetic ("warm black expanse where components float as small lights"), and packages an opinionated mobile-first report system (CSS, HTML templates, mermaid kit, validator) for agents and humans who need polished one-file summaries shareable on phones.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/design.kodexarg.com` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Dark-first kodexArg design system: token SSOT, live styleguide, Svelte 5 candle components, and a WhatsApp-oriented HTML report lineage on Cloudflare Workers static assets. |
| Audience | kodexArg (owner), coding agents maintaining sibling `*.kodexarg.com` sites, designers referencing tokens, and the `kdx-reporte-html` agent skill consuming report templates and mermaid rules. |

## 2. Problems it solves

### P1 — Fragmented branding across sibling properties

- **Who hurts:** An operator running multiple related static sites (home, CV, design, future properties) and agents that copy-paste styles between repos.
- **Pain today:** Each site risks drifting palettes, typography, and component behavior. Orange accent usage becomes inconsistent; the `kodexArg` wordmark casing and monospace voice get reimplemented ad hoc.
- **How this repo answers:** `src/styles/tokens.css` is declared the SSOT for every `*.kodexarg.com` property — warm charcoal inks, rationed orange accent, cream text, mate/pullover document lineage, teal/sage secondary voices, semantic aliases (`--bg`, `--fg`, `--accent`, etc.), and opt-in light mode via `[data-theme="light"]`. README states sibling repos import this file directly. The live styleguide on `src/pages/index.astro` documents every scale with hex chips and narrative notes.
- **Out of scope:** Runtime theme switching infrastructure, npm package publishing, or a full component library for arbitrary apps — only `CandleLink` and `Wordmark` ship here; other sites vendor copies with bidirectional sync instructions (see sibling `kodexarg.com` summary).

### P2 — No live reference for agents and humans

- **Who hurts:** Developers and coding agents who need to see components in context before copying or syncing them.
- **Pain today:** Token files alone do not show motion, hover warmth, reduced-motion behavior, or constellation layout patterns. Agents hallucinate drift-prone CSS.
- **How this repo answers:** A fully static Astro site renders brand, components, color scales, and type specimens. `Wordmark.svelte` demonstrates the prompt mark (monospace voice, block cursor blink, warm hairline underline, exact `kodexArg` casing). `CandleLink.svelte` demonstrates drifting links that "warm up like a candle" on hover with orange glow and `--ease-candle` timing. Islands hydrate only where interactivity matters (`client:visible`).
- **Out of scope:** Storybook, Figma sync, automated visual regression, or interactive token editors.

### P3 — Polished one-file HTML reports for mobile sharing

- **Who hurts:** An operator who wants to turn markdown summaries into dark, branded HTML artifacts sent over WhatsApp and opened on phones — without a separate design pass each time.
- **Pain today:** Generic HTML exports look off-brand; mermaid diagrams break on `{{ }}` placeholder collisions; CDN-dependent assets fail in offline in-app webviews; light lavender mermaid theme variables render ugly on dark backgrounds.
- **How this repo answers:** The `docs/report-lineage/` vault distills Presentation Orange into `src/styles/report.css` (self-contained `:root`, Nunito + DM Mono type, mobile-first 480px column, progressive desktop enhancement). Five complete HTML templates (`status-report`, `concept-explainer`, `comparison`, `stat-highlight`, `decision-summary`) serve as copy-paste specimens. `mermaid-guide.md` defines the canonical `%%{init}%%` block and classDef component kit (`hero`, `cool`, `ok`, `bad`, `step`). `icons.md` documents Lucide inline SVG conventions for offline WhatsApp webviews. `tools/validate_mermaid.py` provides Tier-1 static lint (brace collision, bad state ids) and Tier-2 `mmdc` parse when available. `EXTRACTED-DESIGN-SYSTEM.md` preserves the original Presentation Orange spec without re-fetching auth-walled sources.
- **Out of scope:** A markdown-to-HTML generator CLI in this repo (generation is expected via the `kdx-reporte-html` skill elsewhere), email MIME packaging, or server-side report hosting.

## 3. Product / idea

The mental model is **token SSOT + static styleguide + report artifact kit**. After clone and `bun install`, `bun run dev` serves the styleguide locally. `bun run build` prerenders to `dist/`; deploy pushes static assets to a Cloudflare Worker named `kodexarg-design` with a custom-domain route (configured in `wrangler.jsonc`). No Astro adapter — the site is fully static; Svelte 5 islands hydrate selectively.

Two lineages unify in `tokens.css` (documented in file header):

1. **CV / document lineage** — mate and pullover scales, Oswald display + Source Sans 3 body, sober document feel, light theme opt-in.
2. **Presentation Orange** — warm charcoal dark canvas, one rationed orange accent, liminal emptiness, components as small lights.

The **report lineage** is a deliberate sub-lineage: same ink/cream/orange values but Nunito + DM Mono typography (rounded humanist vs document type), lead orange `#ff8c42` (relaxing terminal tone) with deeper `#FF6A1A` reserved for glow/halo — documented in `docs/report-lineage/README.md`.

### 3.1 North-star use cases

1. **Agent or developer needs brand colors** — opens or imports `src/styles/tokens.css`, uses semantic aliases in product CSS, optionally toggles `[data-theme="light"]` for document pages.
2. **Visitor browses the live styleguide** — scrolls brand, CandleLink constellation, color chips, and type specimens on the deployed Worker static site.
3. **Agent builds a WhatsApp report** — copies a `docs/report-lineage/templates/*.html` specimen, inlines or links `report.css`, follows `mermaid-guide.md` classDef kit, embeds Lucide SVG per `icons.md`, runs `validate_mermaid.py` before shipping.
4. **Sibling site syncs Wordmark** — copies or vendors `src/components/Wordmark.svelte` (and optionally `CandleLink.svelte`) with bidirectional change propagation per sibling repo agent rules.

### 3.2 Non-goals

- Server-side rendering, API routes, or databases.
- npm/npx (toolchain is Bun-only per README scripts).
- Exhaustive component library (only two interactive components ship).
- Elevation drop shadows — design rules forbid them; only orange glow/halo is permitted.
- Re-fetching the original auth-walled Presentation Orange artifact URL — `EXTRACTED-DESIGN-SYSTEM.md` is the frozen reference.
- Publishing tokens as an npm package (import by path/copy).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Bun (scripts), Node module type | `package.json` |
| Frontend framework | Astro ^6.4.6, fully static (no adapter) | `package.json`, `astro.config.mjs` |
| Interactive islands | Svelte ^5.56.3 via `@astrojs/svelte` ^8.1.2, runes (`$props`, snippets) | `package.json`, `src/components/*.svelte` |
| Styling | CSS custom properties SSOT + page-scoped Astro styles | `src/styles/tokens.css`, `src/styles/report.css`, `index.astro` `<style>` |
| Infra / deploy | Cloudflare Workers static assets, wrangler 4, custom domain route | `wrangler.jsonc`, `package.json` deploy script |
| Tooling | Python 3 stdlib + optional `bunx @mermaid-js/mermaid-cli` for validator | `docs/report-lineage/tools/validate_mermaid.py` |
| Fonts (styleguide) | Oswald, Source Sans 3 via Google Fonts link in `index.astro` | `src/pages/index.astro` |
| Fonts (report lineage) | Nunito, DM Mono via template `<link>` tags | `docs/report-lineage/templates/*.html` |
| AI / agents | No `.claude/` or `.docs/` in repo; consumed by external `kdx-reporte-html` skill | tree scan (absent) |

### 4.1 Notable dependencies (curated)

- `astro` — static site generator; prerendered styleguide with file-based routing (`src/pages/index.astro` only).
- `@astrojs/svelte` — mounts `Wordmark` and `CandleLink` with `client:visible` hydration.
- `svelte` — Svelte 5 runes components; `CandleLink` uses candle-eased hover transitions; `Wordmark` uses blink cursor with `prefers-reduced-motion` fallback.
- `wrangler` — deploys `dist/` as Worker static assets; observability enabled in config.
- `@mermaid-js/mermaid-cli` (optional, via bunx in validator Tier-2) — authoritative mermaid parse in `validate_mermaid.py`.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `src/pages/index.astro` — sole routed page; full styleguide (brand, components, color, type sections).
- **Components (`src/components/`):**
  - `Wordmark.svelte` — brand prompt mark; optional `href`, `size`, `tint`, `static` (navbar mode without cursor).
  - `CandleLink.svelte` — monospace link with candle hover glow; `external` sets `target`/`rel`.
- **Token SSOT:**
  - `src/styles/tokens.css` — color scales, typography stacks, Fibonacci layout vars, motion tokens, semantic aliases, light theme block.
- **Report lineage stylesheet:**
  - `src/styles/report.css` — self-contained report look; aligns with token values; mobile-first layout rules.
- **Docs vault (`docs/report-lineage/`):**
  - `README.md` — lineage overview, relationship to tokens SSOT, design rules, consumption steps.
  - `EXTRACTED-DESIGN-SYSTEM.md` — frozen Presentation Orange source spec.
  - `mermaid-guide.md` — init block, classDef kit, five valid examples, brace-collision rule.
  - `icons.md` — Lucide inline SVG + Simple Icons brand logos for offline artifacts.
  - `templates/*.html` — five complete HTML specimens with inlined CSS blocks.
  - `templates/assets/` — sample images for `.figure` component (local-use only).
  - `tools/validate_mermaid.py` — mermaid validation harness with `--selftest`.
- **Config:**
  - `astro.config.mjs` — Svelte integration; `site` set for canonical metadata.
  - `svelte.config.js` — Vite preprocess only.
  - `wrangler.jsonc` — Worker name, assets directory, custom domain route, observability.
- **Agent scaffolding:** `.claude/` — **not present**. `.docs/` — **not present**.
- **Generated / vendor (gitignored, do not ingest):** `dist/`, `node_modules/`, `.astro/`, `.wrangler/`.

## 6. Configuration & contracts (no secrets)

- **Build output:** `dist/` — Astro static prerender target; wrangler serves this directory as Worker assets.
- **Wrangler bindings:** Static assets only — no KV, D1, R2, or secrets in `wrangler.jsonc`.
- **Worker identity:** `name: kodexarg-design` in `wrangler.jsonc`.
- **Custom domain route:** pattern `design.kodexarg.com` with `custom_domain: true` in `wrangler.jsonc` routes array.
- **Observability:** `enabled: true` in `wrangler.jsonc`.
- **Compatibility date:** `2026-06-12` in `wrangler.jsonc`.
- **No `.env` files** in tracked tree; no credential manifests observed.

### 6.1 HTTP / API endpoints (when applicable)

This repo exposes **no API**. It is a fully static site with a single HTML page.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` (prerendered `index.html`) | Live design-system styleguide | none |

No health check route, no JSON API, no SSR handlers. Deploy surface is Worker static asset serving only.

### 6.2 Other interfaces

- **CLI — dev:** `bun run dev` → `astro dev` (local styleguide).
- **CLI — build:** `bun run build` → `astro build` → `dist/`.
- **CLI — preview:** `bun run preview` → `astro preview`.
- **CLI — deploy:** `bun run deploy` → `astro build && wrangler deploy`.
- **CLI — mermaid validator:** `python3 docs/report-lineage/tools/validate_mermaid.py <artifact.html>` (or `--selftest`); exit 0 = pass.
- **CSS import contract:** sibling repos import `src/styles/tokens.css` by relative path or vendored copy.
- **HTML report contract:** inline or link `src/styles/report.css`; follow template structure and mermaid classDef kit from docs.

## 7. Data & persistence

- **No databases, KV, or object storage bindings** in wrangler config.
- **No server-side sessions or user data.**
- **Persistence model:** Git is the SSOT for tokens and templates; `dist/` is ephemeral build output; deployed static assets live on Cloudflare Workers edge.
- **Report images:** template `.figure` references use relative `assets/` paths — images do not travel when only HTML is shared; base64 embed is opt-in per report-lineage design rules.

## 8. Docs & agent memory (required scan)

Scanned sources and how they were used:

1. **Root `README.md`** — repo purpose, bun commands, report-lineage pointer, tokens SSOT declaration.
2. **`docs/report-lineage/README.md`** — report lineage architecture, token relationship, mobile-first rules, consumption workflow.
3. **`docs/report-lineage/EXTRACTED-DESIGN-SYSTEM.md`** — Presentation Orange frozen spec, orange reconciliation (`#ff8c42` lead vs `#FF6A1A` halo), typography and layout philosophy.
4. **`docs/report-lineage/mermaid-guide.md`** — brace-collision rule, canonical init + classDef kit, diagram styling strategy.
5. **`docs/report-lineage/icons.md`** — Lucide inline SVG conventions for offline WhatsApp webviews.
6. **`src/styles/tokens.css`** — full token scales, semantic aliases, light theme, lineage commentary in header.
7. **`src/styles/report.css`** — report-specific tokens, component classes, responsive breakpoints (partial read; structure confirmed).
8. **`src/pages/index.astro`** — styleguide sections, color chip data, component demos, page layout CSS.
9. **`src/components/Wordmark.svelte`** and **`src/components/CandleLink.svelte`** — component props and interaction design.
10. **`docs/report-lineage/tools/validate_mermaid.py`** — two-tier validation harness purpose and usage.
11. **`docs/report-lineage/templates/status-report.html`** — specimen structure (inlined tokens, placeholder `{{TASK_NAME}}` in title only — not inside mermaid).
12. **`.claude/`** — **not present** in repository tree.
13. **`.docs/`** — **not present** in repository tree.

External agent consumption: README and `EXTRACTED-DESIGN-SYSTEM.md` reference the `kdx-reporte-html` skill as a consumer of this report lineage (skill lives outside this repo).

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` GitHub repo; summary describes mechanics without treating the repo as a public product link target.
- **Auth model:** None on the deployed static site — public read of styleguide assets once deployed to the custom domain (deployment access is operator-controlled via Cloudflare).
- **Secrets:** This summary contains no API keys, tokens, `.env` values, PEM material, or account IDs. Wrangler config exposes only Worker name, assets path, route pattern, and observability flag.
- **Offline report security:** Report templates encourage inline SVG and local assets because WhatsApp in-app webviews may block external CDN requests — a privacy/resilience choice, not encryption.
- **Auth-walled source:** Original Presentation Orange artifact URL is documented as do-not-re-fetch; extracted spec is the safe reference.

## 10. Operational picture

- **Local dev:** `bun install` then `bun run dev` (Astro dev server).
- **Build:** `bun run build` produces static `dist/`.
- **Manual deploy:** `bun run deploy` (build + `wrangler deploy`).
- **CI / auto-deploy:** README states push to `main` runs build and `bunx wrangler deploy` — likely Cloudflare Workers Builds connected to the GitHub repo (no `.github/workflows/` in tracked tree; deploy wiring may live entirely in Cloudflare dashboard).
- **GitHub metadata:** Primary language reported as CSS; repo created 2026-06-12, updated 2026-06-14; no GitHub description or topics set.
- **Hardware constraints:** None — edge static assets only.

## 11. Open questions / unknowns

- Exact CI workflow definition not in repo tree — whether Workers Builds or a missing `.github/workflows/` file drives deploy is unknown from clone alone; README asserts auto-deploy on `main` push.
- Whether `CandleLink` `drift` prop was removed or never implemented — `index.astro` passes `drift={…}` but current `CandleLink.svelte` does not declare a `drift` prop (may be ignored or planned).
- Full `report.css` component catalog not exhaustively inventoried — file is substantial; summary reflects header tokens and README-level component list.
- Relationship versioning between this SSOT and vendored copies in `kodexarg.com` — sync process is documented in sibling repo, not formalized here.
- No ADR directory — design decisions live in markdown docs and CSS comments only.
