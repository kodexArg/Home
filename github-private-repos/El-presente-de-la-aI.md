---
id: "el-presente-de-la-ai"
title: "El Presente de la AI — ALVS talk deck SSOT and agent-operated slide factory"
visibility: private
importance: normal
source_repo: "El-presente-de-la-aI"
org: "kodexArg"
default_branch: "main"
primary_language: "Markdown"
repo_kind: "documentation"
status: "active"
related: []
tags: ["alvs", "presentation", "google-slides", "ai-education", "capacitacion", "agents", "design-system", "infographics", "lucide", "python", "gws", "private"]
problems_solved:
  - "ALVS audiences need a grounded, Spanish-language introduction to present-day AI (LLMs, tokens, agents, market tools) without hype or opaque jargon — delivered as a live talk with legible 54-inch slides."
  - "Building twenty-six visually consistent slides by hand is slow and error-prone; the repo separates locked content decisions from repeatable agent operations on a Google Slides deck."
  - "AI-generated infographics and diagrams drift in palette and icon style unless generation is bound to a closed design system, local Lucide assets, and typed image pipelines."
technologies:
  - "Google Slides (live deck via Drive MCP / gws CLI)"
  - "Markdown slide specs (YAML frontmatter + sections)"
  - "Python 3 (PIL / Pillow, cairosvg, uv)"
  - "Lucide SVG icon set (lucide-static v1.17)"
  - "Nunito typography (design target for Slides)"
  - "PNG / SVG raster pipeline for infographics"
  - "Agent skills (.agents/skills, gws-slides, google-slides)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# El Presente de la AI

> **Problem thesis (required):** This private repository is the **single source of truth** for Gabriel Cavedal's ALVS talk **"El Presente de la AI"** — a six-chapter, twenty-six-slide Spanish presentation that demystifies modern AI for a non-specialist room. It is not a web app or API service; it is a **content + design + operations factory**: every slide is specified as a markdown file (`slides/CC/XX-titulo.md`), visual rules live in `docs/design-rules.md` and `docs/design-system.md`, generated infographics land in `assets/`, and coding agents apply those specs to a live Google Slides deck through Drive MCP or the `gws` CLI. Content is **decided and locked**; agents execute aesthetics and structure one slide at a time.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/El-presente-de-la-aI` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Agent-operated SSOT for an ALVS capacitación deck that explains what AI is today — LLMs, tokens, automations vs agents, and market tools — with a warm orange-on-black design system and pre-generated infographic assets. |
| Audience | ALVS internal training attendees (Spanish, live room with large display); Gabriel Cavedal as author and presenter; AI coding agents tasked with slide generation and deck maintenance. |

## 2. Problems it solves

### P1 — Accessible AI literacy for a business audience

- **Who hurts:** ALVS operators, managers, and cross-functional staff who hear "AI" daily but lack a coherent mental model separating chatbots, LLMs, datacenters, tokens, automations, and agents.
- **Pain today:** Vendor marketing and news cycles produce fear, hype, or magical thinking; generic slide decks reuse stock imagery and fail at five-meter readability on a 54-inch monitor in a lit room.
- **How this repo answers:** Six narrative chapters (`slides/INDEX.md`): (1) AI today, (2) what an intelligence artificial is and how it works, (3) automations vs agents, (4) market tools, (5) optional "magic" demos, (6) closing. Chapter two builds the **orbital system diagram** (LLM at center, tool satellites, dotted border = "the AI system") that reappears as the talk's map. Chapter two also uses a token hook ("El perro ladra y el gato ___" → audience completes → "maúlla") so "token" becomes tangible. Take-away slides use high-contrast orange (`#F2660D`) with black/white type per `docs/design-rules.md`.
- **Out of scope:** Training engineers to fine-tune models, legal/compliance deep dives, hands-on coding workshops, or certifying tool expertise — the talk orients and names concepts; live demos (NotebookLM, nocode builders) are optional chapter-five extras.

### P2 — Repeatable agent operations without content drift

- **Who hurts:** Presenters and agents who would otherwise edit Google Slides directly, losing version history, design consistency, and the link between spoken narrative and on-screen text.
- **Pain today:** Blind overwrites in Slides, invented slide copy, restated typography rules per slide, and no checklist of which deck slides actually exist versus which are still spec-only.
- **How this repo answers:** `AGENTS.md` declares agents **operational only** — content is fixed in per-slide markdown. Workflow invariants: read current deck state before edit; one slide per iteration unless batched; confirm completion; record new design decisions in `docs/design-rules.md` before proceeding. `slides/INDEX.md` tracks `[ ]` pending vs `[x]` created in the live deck (all twenty-six entries currently pending in the index snapshot). `slides/template.md` enforces frontmatter (`chapter`, `slide`, `title`, `subtitle`, `layout`) plus sections: Tipo, Intención, Contenido, Estáticos (optional), Instrucciones (deviations only — never restate layout defaults). Skills in `.agents/skills/` (`google-slides`, `gws-slides`, `gws-drive`, `gws-shared`) document Drive MCP auth and `gws slides` API usage; `.claude/skills/` symlinks into `.agents/` as authoritative.
- **Out of scope:** Autonomous content rewriting, speculative slide additions, or browser/curl shortcuts for Drive — `AGENTS.md` and `CLAUDE.md` mandate Google Drive MCP for deck operations.

### P3 — Visual consistency for generated infographics

- **Who hurts:** Anyone generating diagram PNGs for slides — manual designers, scripts, or image models — without a shared palette, icon stroke, or layout contract.
- **Pain today:** Each diagram picks random blues, mixed icon families, tiny labels, and busy backgrounds that collapse on a projector; infographics compete with the speaker instead of supporting one focal idea per slide.
- **How this repo answers:** Closed three-background system in `docs/design-system.md`: real black `#000000`, warm cream `#F6EADC`, takeaway orange `#F2660D`, plus pure white `#FFFFFF` only for infographic canvases. Single font family Nunito (rounded sans); minimum 32 pt on screen; max five legible components per slide. `docs/image-generation.md` splits outputs into Type A (infographics on white), Type B (atmospheric full-bleed), Type C (recortable illustrations) with strict role separation: slide prompt supplies **what**; design docs supply **how**. `contexto/iconos/` holds twenty-seven canonical Lucide SVGs; generators must read disk icons, not invent strokes (`docs/image-generation.md` pipeline). `assets/` already contains chapter-two through chapter-four infographics (flow, orbital system, tokens, market map, pricing columns, non-chat tools grid) plus iteration variants (`-v1`, `-v2`). Python helpers in `scripts/` (`generate_flow_image.py`, `generate_orbital_family.py`, `generate_tokens_image.py`, `gen_02_05_difusion.py`, `generate_04_03_image.py`) implement early raster experiments; canonical path is SVG compose + `cairosvg` via `uv` per design docs.
- **Out of scope:** A general-purpose design system product, automated Slides API layout engine, or brand kit for non-ALVS decks — rules inherit typography/color inspiration from sibling repo `alvs-capacitacion` but content is unique to this talk.

## 3. Product / idea

The mental model is **markdown-first slide factory → Google Slides deck**:

```
Author (Gabriel) ── locks content in slides/*.md
        │
        ├─ docs/design-rules.md  ── layouts, palette, composition law
        ├─ docs/design-system.md ── develops rules (Nunito, Lucide catalog)
        ├─ docs/image-generation.md ── binds all PNG/SVG generation
        │
        ▼
Agent reads spec + design law ──► Drive MCP / gws slides API
        │                              │
        ├─ uploads assets/*.png          ▼
        └─ updates slides/INDEX.md     Live Google Slides presentation
                                       (ID recorded in AGENTS.md)
```

Each slide declares a `layout` from the catalog in `docs/design-rules.md` — `capitulo`, `take-away`, `enumeracion`, `full-bleed`, `frase-impacto`, `full-bleed-subtitulo`, `captura`, `split`, `split-asimetrico`, `enmarcada`, `frase-visual`, `circulo`, `grilla`. Layout **implies background** (no separate background field): e.g. `capitulo` → black; `take-away` → orange; content layouts → cream; infographics → white canvas inside `enmarcada` / `frase-visual`.

**Heritage material** lives in `contexto/`: `contexto/diapos-alvs/` — nineteen SVG exports from the prior Marpit/HTML deck (content and composition reference only, not aesthetic copy); `contexto/iconos/` — downloaded Lucide set aligned to `docs/design-system.md` §4 concept→icon table. `content/` holds a reference PPTX (`IA_anestesiologia_charla-1.pptx`) and meme static (`meme-futuro-ia.jpeg`) for optional `enmarcada` / `full-bleed-subtitulo` layouts.

**Audio collateral:** `assets/resumen-presentacion.mp3` plus `assets/resumen-audio-guion.txt` — a spoken walkthrough of every slide (Spanish), useful for rehearsal or accessibility; not displayed on slides.

### 3.1 North-star use cases

1. **Live ALVS talk:** Presenter follows chapters 01–04 core path; chapter 01 take-away enumerates chapters 2–4 titles on orange slide; chapter 03 deliberately short — concepts named, then jump to market tools.
2. **Agent builds slide 02-01:** Read `slides/02/01-software-que-predice-texto.md` → confirm `frase-visual` layout → place `assets/02-01-flujo-prediccion.png` under headline "Una IA es software que predice texto." → mark `02-01` `[x]` in `slides/INDEX.md`.
3. **Generate new infographic:** User or agent specifies objective in slide Estáticos section → follow Type A rules in `docs/image-generation.md` → compose SVG using `contexto/iconos/` → rasterize to `assets/CC-SS-name.png` → reference in slide Instrucciones.
4. **NotebookLM demo (chapter 05):** Slide `05-01` is black anchor only; demo runs live (upload docs, cited answers, Audio Overview); backup full-bleed captures listed in Estáticos if demo fails.
5. **Deck sync via gws:** Authenticated operator runs `gws slides presentations get` / `batchUpdate` per `.agents/skills/gws-slides/SKILL.md` when MCP unavailable.

### 3.2 Non-goals

- Not a deployable web application, RAG product, or training LMS.
- Agents must not suggest new talk content unless explicitly asked (`CLAUDE.md`, `AGENTS.md`).
- Chapter 05 ("Un poco de Magia") marked optional — author may skip entire chapter in delivery (`slides/INDEX.md` notes).
- Chapter 06 closing slide content still pending definition (`assets/resumen-audio-guion.txt` states cierre pendiente).
- No Obsidian vault sync in repo — `.gitignore` ignores `.obsidian/` only; slide Tipo tags use Obsidian-style `#portada` etc. as metadata hints.
- `.docs/` hidden vault **not present** — only `docs/` at repo root.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Content format | Markdown + YAML frontmatter per slide | `slides/template.md`, `slides/**/*.md` |
| Presentation target | Google Slides (single deck) | `AGENTS.md`, `README.md`, `.agents/skills/google-slides/SKILL.md` |
| Deck automation | Google Drive MCP; `gws` CLI (`gws slides`, `gws drive`) | `AGENTS.md`, `.agents/skills/gws-slides/SKILL.md`, `skills-lock.json` |
| Image generation | Python scripts; PIL; cairosvg + uv (specified) | `scripts/*.py`, `docs/image-generation.md` |
| Iconography | Lucide SVG (local copies) | `contexto/iconos/`, `contexto/iconos/README.md` |
| Typography / color | Nunito; palette `#F2660D`, `#000000`, `#F6EADC`, `#2B1410`, `#FFFFFF` | `docs/design-rules.md`, `docs/design-system.md` |
| Legacy reference | Marpit SVG slide exports (19 files) | `contexto/diapos-alvs/README.md` |
| Agent scaffolding | `.agents/skills/`, `.claude/skills/` symlinks | `AGENTS.md`, `.agents/skills/` |
| Package manifests | None (no `package.json`, `pyproject.toml`, or `wrangler.jsonc`) | repo root tree |
| CI / deploy | None observed | no `.github/workflows/` |

### 4.1 Notable dependencies (curated)

- **Google Drive MCP** — mandated path for read/edit deck operations; authenticate via MCP before any Drive call (`AGENTS.md`).
- **`gws` CLI** — alternative Slides API surface documented in `gws-slides` and `gws-shared` skills; requires binary on PATH and OAuth or service-account env (`GOOGLE_APPLICATION_CREDENTIALS` name only in skill).
- **Lucide (lucide-static v1.17)** — single icon family; SVGs on disk are SSOT for infographics (`contexto/iconos/README.md`).
- **Pillow (PIL)** — used in `scripts/generate_flow_image.py` for early flow diagram rasterization.
- **cairosvg + uv** — prescribed rasterization path for SVG infographics (`docs/image-generation.md`).
- **Nunito** — target slide font; DM Mono allowed only for on-screen code/prompt moments (`docs/design-system.md`).

## 5. Repository map (abstraction)

- **Slide specs (core):** `slides/` — six chapter folders (`01`–`06`), `INDEX.md` master checklist, `template.md` schema, `author-notes.html` (author-facing notes export).
- **Design law:** `docs/design-rules.md` (layouts catalog, palette, composition, alvs-capacitacion heritage notes), `docs/design-system.md` (develops rules, icon concept table, asset naming), `docs/image-generation.md` (Type A/B/C generation contract).
- **Generated / static assets:** `assets/` — infographic PNGs and SVG sources, audio summary; naming `CC-SS-descripcion.png`.
- **Reference context:** `contexto/iconos/` (SVG library), `contexto/diapos-alvs/` (legacy deck SVGs), `content/` (reference PPTX and meme JPEG).
- **Image tooling:** `scripts/` — five Python generators for specific slides (flow, orbital family, tokens, diffusion sequence, pricing graphic).
- **Agent skills:** `.agents/skills/google-slides`, `gws-slides`, `gws-drive`, `gws-shared` (local); symlinks to `chrome-devtools` and `use-my-browser` in user home (broken in shallow clone environment — targets absent on clone machine).
- **Agent mirror:** `.claude/skills/` — symlinks to `.agents/skills/` (`AGENTS.md` states `.agents/` authoritative).
- **Top-level agent SSOT:** `AGENTS.md`, `CLAUDE.md`, `README.md`.
- **Lock metadata:** `skills-lock.json` records `gws-slides` skill hash from `googleworkspace/cli` GitHub source.

## 6. Configuration & contracts (no secrets)

- **Presentation identity:** Google Slides presentation ID and owner metadata recorded in `AGENTS.md` and `CLAUDE.md` — agents use ID for Drive MCP `read_file_content` and gws `presentations.get`. Do not paste IDs into generated summaries as live links.
- **Env vars (gws path):** `GOOGLE_APPLICATION_CREDENTIALS` — path to service account JSON for non-interactive auth (name only, per `gws-shared/SKILL.md`); interactive `gws auth login` for OAuth.
- **Drive MCP auth:** `mcp__claude_ai_Google_Drive__authenticate` and completion helper when MCP session unauthenticated (`google-slides/SKILL.md`).
- **Slide file contract:** frontmatter keys `chapter`, `slide`, `title`, `subtitle`, `layout`; body sections per `slides/template.md`; `{}` placeholders resolved by generating agent, never shown literally (`AGENTS.md`).
- **Asset naming:** `assets/CC-SS-nombre.png` canonical; discarded iterations keep `-vN` suffix (`docs/image-generation.md`).
- **Gitignore:** `.obsidian/` only (`/.gitignore`) — Obsidian local config excluded; all slide and docs content tracked.

### 6.1 HTTP / API endpoints (when applicable)

This repository does **not** expose HTTP services. The external API surface is the **Google Slides API** accessed indirectly:

| Method | Path / resource | Purpose | Auth (if known) |
|--------|-----------------|---------|-----------------|
| API | `presentations.get` | Read deck structure and slide content | OAuth / service account via gws or Drive MCP |
| API | `presentations.batchUpdate` | Apply slide element updates | same |
| API | `presentations.create` | Create blank deck (skill docs) | same |
| MCP | Drive `read_file_content` | Read presentation by file ID | Google Drive MCP session |

No REST routes, Workers, or Django `urls.py` exist in this repo.

### 6.2 Other interfaces

- **CLI:** `gws slides <resource> <method>` — inspect via `gws schema slides.<resource>.<method>` (`.agents/skills/gws-slides/SKILL.md`).
- **MCP tools:** `mcp__claude_ai_Google_Drive__*` family for deck read/write (`AGENTS.md` access rules).
- **Python CLIs:** `scripts/generate_*.py` — run locally to regenerate specific `assets/` PNGs; not packaged as installable module.
- **Slide markdown schema:** human and agent authors edit `slides/**/*.md`; INDEX checkbox sync is manual/agent-updated.

## 7. Data & persistence

- **No application database.** Persistence is Git (markdown specs, SVG/PNG assets, docs) plus the live Google Slides deck in Google Drive (external).
- **Important entities (by name):** slide frontmatter fields; chapter numbers `01`–`06`; layout enum from design-rules catalog; asset filenames `CC-SS-*`; presentation ID in agent docs.
- **Topology:** local clone for authoring → optional image generation on workstation → push to GitHub → agents/operators sync visuals into cloud-hosted Slides deck. Audio summary is offline collateral in `assets/`.

## 8. Docs & agent memory (required scan)

1. **Root README** — deck title, chapter table, pointers to `slides/INDEX.md`, `docs/design-rules.md`, `AGENTS.md`. Evidence: `README.md`.
2. **`docs/`** — full design and generation trilogy; no `.docs/` directory found. Evidence: `docs/design-rules.md`, `docs/design-system.md`, `docs/image-generation.md`.
3. **ADR / PRD / constitution** — none; design-rules acts as living aesthetic constitution with dated heritage note (2026-06-11 alvs-capacitacion investigation).
4. **`.claude/`** — `skills/` symlinks mirroring `.agents/skills/`; no standalone `CLAUDE.md` rules tree beyond repo-root `CLAUDE.md`. Evidence: `.claude/skills/`, `CLAUDE.md`.
5. **`.agents/skills/`** — `google-slides` (project-specific Drive MCP workflow), `gws-slides`, `gws-drive`, `gws-shared` (CLI reference), plus external symlinks for browser preview skills. Evidence: `.agents/skills/google-slides/SKILL.md`, `.agents/skills/gws-shared/SKILL.md`.
6. **`AGENTS.md`** — authoritative agent SSOT: project table, workflow invariants, slide structure, layout property rules, Instrucciones hygiene, placeholder policy. Evidence: `AGENTS.md`.
7. **`slides/INDEX.md`** — complete ordered inventory of twenty-six slides with chapter tree and completion checkboxes. Evidence: `slides/INDEX.md`.
8. **`contexto/iconos/README.md`** — Lucide adoption decision and download recipe. Evidence: `contexto/iconos/README.md`.
9. **`contexto/diapos-alvs/README.md`** — maps nineteen legacy SVG slides to titles. Evidence: `contexto/diapos-alvs/README.md`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** `private` GitHub repo — summary describes deck and workflows without treating the clone as a public product link. `related: []` in frontmatter per private-repo policy.
- **Auth model:** Google OAuth or service account for Slides/Drive API; MCP session for agent operations. No app-level user sessions in this repo.
- **Secrets hygiene:** No `.env`, PEM, or credential JSON in tracked tree. Presentation ID and owner email appear in agent docs for operational use — not reproduced here. `GOOGLE_APPLICATION_CREDENTIALS` referenced by name only in gws skill.
- **Content sensitivity:** `content/IA_anestesiologia_charla-1.pptx` suggests medical/anesthesia talk reference material — treat as internal ALVS context, not for redistribution.
- **This summary contains no secrets, keys, or connection strings.**

## 10. Operational picture

- **Local authoring:** Edit `slides/*.md` and `docs/*.md` in any markdown editor; optional Obsidian with local `.obsidian/` (gitignored).
- **Image regeneration:** Run Python scripts in `scripts/` or follow SVG→`cairosvg` pipeline in `docs/image-generation.md`; output to `assets/`.
- **Deck sync:** Authenticate Drive MCP or `gws auth login` → read deck → apply `batchUpdate` per slide spec → update `slides/INDEX.md` checkboxes.
- **Agent loop:** Read `AGENTS.md` + target slide + `docs/design-rules.md` → execute one slide → confirm → record any new global design decision in design-rules before next slide.
- **Deploy / CI:** None — delivery is the Google Slides deck and live presentation; GitHub stores specs and assets only.
- **Hardware context for design:** Slides authored for **54-inch display read at five meters** in a **lit room** — drives high contrast, large type, and anti-muted-color rules (`docs/design-rules.md`).

## 11. Open questions / unknowns

- All twenty-six `slides/INDEX.md` entries marked `[ ]` — unclear whether live deck is empty or index lagging behind manual Slides edits.
- Chapter 06 closing slide content undefined (`slides/06/00-cierre.md` exists but narrative in audio guion says cierre pendiente).
- Chapter 05 may never be presented — scope intentionally optional.
- Symlinks `chrome-devtools` and `use-my-browser` under `.agents/skills/` point outside repo; broken on machines without those user-level skills installed.
- `skills-lock.json` only locks `gws-slides`; other skills may drift from upstream `googleworkspace/cli`.
- No `package.json` or `pyproject.toml` — Python script dependencies (Pillow, cairosvg) not centrally pinned in repo manifests.
- Whether `content/estado-del-arte.jpeg` referenced in `docs/design-system.md` §5 is missing from clone or never committed — only `meme-futuro-ia.jpeg` and PPTX observed in `content/`.
- No CI validation that assets match slide Estáticos references or that INDEX checkboxes reflect deck state.
