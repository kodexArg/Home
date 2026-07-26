# PRD — kodexArg Home (KodexBar)

| | |
|---|---|
| **Product** | Personal home page for **kodexArg**, fronted by **KodexBar** |
| **URL (target)** | `https://home.kodexarg.com` |
| **Repo** | `kodexArg/Home` (this tree) |
| **Status** | Active — v2.0 (supersedes v1.0 "personal router") |
| **Owner** | kodexArg / Gabriel Cavedal |
| **Stack** | Astro + Svelte 5 islands on Cloudflare (Workers/Pages), **Bun** package manager |
| **Design** | Presentation Orange / SyV tokens (`SyvInput`, monospaced console) |
| **Cloudflare Native** | Cloudflare Workers AI + Cloudflare Vectorize (zero-secret bindings) |

---

## 0. What changed from v1.0

v1.0 specified a **closed-action intent router**: a three-tier strategy cascade that mapped a query to one of ~33 links and was explicitly forbidden from producing assistant prose.

v2.0 replaces it with **KodexBar**: a single-tier assistant that answers questions about Gabriel Cavedal *and* hands out links. It generates prose, from a model, deliberately.

The v1.0 prohibition on prose existed to prevent hallucinated URLs. That protection is retained by a narrower and stronger mechanism — the model cannot emit a URL at all, only allowlisted ids — so the prohibition itself is no longer needed. See [ADR 09](adr-09-kodexbar-security.md) for the reversal and its compensating controls, and [ADR 10](adr-10-kodexbar-architecture.md) for the architecture.

## 1. Problem

kodexArg needs a single, calm front door: not a portfolio dump, not a CMS, not an open chatbot. Visitors land on a minimal surface — **logo + console** — and can either reach a known destination or ask a question about Gabriel Cavedal and get a real answer.

The second half is the point of v2.0. "Where is the CV?" and "does he know AWS?" are both legitimate, and v1.0 could only serve the first.

Bots and scrapers must not be able to drive the endpoint by hammering it. Humans interact through the designed UI; the backend accepts only traffic that looks like that interaction, with hard server-side rate limits.

## 2. Goals

1. **Minimal home**: wordmark + chat-like console. No nav chrome, no card grids.
2. **Grounded answers**: KodexBar answers only from a committed, versioned corpus. Off-corpus questions are declined by a deterministic gate before any model runs.
3. **Structurally safe links**: the model returns destination **ids**; the server resolves them against an allowlist. A hallucinated link is unrepresentable, not merely unlikely.
4. **One paragraph, no formatting**: replies read like chat. Plain prose, links rendered as chips beneath — never Markdown, never headings, never lists.
5. **Open/closed corpus**: adding a knowledge domain (Subordinación y Valor, and others to follow) is a new pack plus a reindex — never an engine change.
6. **Cloudflare-native**: zero-secret bindings to Workers AI (`env.AI`) and Vectorize (`env.VECTOR_INDEX`).
7. **Tooling**: strictly **Bun** (`bun install`, `bun.lock`, `bun run build`, `bunx wrangler`).

### Non-goals

- A general-purpose chatbot. KodexBar answers about Gabriel Cavedal, kodexArg projects and how to reach him. Everything else is declined.
- Conversational memory across turns. Each query is answered independently.
- Account login / multi-user profiles.
- Dynamic discovery of repositories. Destinations are an **explicit allowlist**, and membership requires the target be public and live.
- SEO-heavy marketing pages or blog.

## 3. Product surface

### 3.1 Layout

| Element | Role |
|---------|------|
| **Wordmark** | `kodexArg`. Top-left, static. |
| **KodexBar** | Bottom-anchored console: scrollback stack + `SyvInput` (`¿Sí?`). |
| **Atmosphere** | Aurora / dark Presentation Orange background only — no extra widgets. |

Mobile-first width; max content ~720px for the console.

### 3.2 Interaction model

1. Visitor focuses the Pip-Boy input (`¿Sí?`) and types a query in Spanish or English.
2. On commit (Enter), the client shows a short thinking phase and POSTs to `/api/ask`.
3. The server embeds, retrieves, gates, and — if the gate opens — generates.
4. The reply renders as **one paragraph of plain text**, optionally followed by link chips.
5. Link rendering: icon is non-clickable (`pointer-events: none`), link text is selectable and hyperlinked.

There is no "did you mean?" step. v1.0's `Confirm` outcome with its candidate grid is removed: a model that can write a sentence can disambiguate in that sentence.

### 3.3 Visible protocol

A link request:

```
› quiero ver el cv de gabriel
Acá está su currículum.
[link-icon] Currículum / CV - Gabriel Cavedal (cv.kodexarg.com)
```

A question:

```
› ¿sabe AWS?
Sí, es su terreno principal: diseñó y opera la plataforma AWS de Grupo ALVS
(ECS Fargate, RDS, Cognito, todo con CloudFormation) y montó el MVP de
Coveris sobre Amplify y Fargate.
```

An out-of-scope query:

```
› cuál es la capital de Francia
No tengo información sobre eso. Puedo contarte sobre Gabriel Cavedal,
sus proyectos y cómo contactarlo.
```

The third case never reaches a model.

## 4. KodexBar — single-tier RAG

### 4.1 Pipeline

```
Query → rate limit → embed (bge-m3) → Vectorize (topK 5, filter lang)
      → gate: score < minScore ? fixed decline (no LLM)
      → expand related chunks
      → generate (llama-3.1-8b-instruct-fp8) → { text, linkIds[] }
      → resolve ids vs allowlist + scrub formatting
      → KodexAnswer { text, links[], language, matched }
```

Retrieval is deterministic — cosine similarity and a fixed threshold. The model writes the paragraph; it does not decide where the answer comes from.

### 4.2 Contracts

```ts
interface RawModelAnswer { text: string; linkIds: string[] }   // from the model

interface KodexAnswer {
  text: string                  // one plain paragraph, scrubbed server-side
  links: LinkDestination[]      // resolved from linkIds; unknown ids dropped
  language: 'es' | 'en'
  matched: boolean              // false = gate closed, model not called
}
```

`linkIds` carries **ids, never URLs**. This is the load-bearing safety property — see [ADR 09 §1](adr-09-kodexbar-security.md).

### 4.3 Knowledge packs

A `KnowledgePack` bundles chunks, a system-prompt fragment and a retrieval threshold. The engine knows packs and chunks; it does not know what a "skill" or a "project" is. Domain vocabulary lives in chunk text, `tags` and `related`.

| Pack | Content | Status |
|---|---|---|
| `cv` | Profile, experience, skills, projects, education, contact, QA/method — extracted from `cv.kodexarg.com` (ES + EN) | v2.0 |
| `syv` | Subordinación y Valor | Planned |

`related` is the graph: a skill chunk names the projects that evidence it, so one query retrieves the claim, its proof, and the links.

### 4.4 Destinations

Configured in `src/lib/kodexbar/destinations.ts`. **Membership rule: public and live, verified before adding.**

| Kind | Count | Examples |
|---|---|---|
| `contact` | 4 | `email` (`mailto:gcavedal@gmail.com`), `linkedin`, `telegram`, `platzi` |
| `site` | 6 | `home`, `cv`, `docs`, `syv-design-system`, `eurotrip-live`, `github` |
| `repo` | 27 | `engram`, `welpdesk`, `dj-indoor-monitor`, `openclaw`, … |

Private work (Coveris, `syv-mcp-tools`, SROA, the Grupo ALVS production platforms) lives in the corpus with **no destination**. KodexBar describes it and offers no link — intended, not a gap.

> Three v1.0 entries (`payflow`, `welpdesk`→`helpdesk.kodexarg.com`, `kcbd-monitor`) pointed at domains that do not resolve and were served as live links. Removed 2026-07-26; the verification rule above exists to prevent a repeat.

## 5. Security & Cloudflare native bindings

### 5.1 Zero-secrets architecture

`env.AI` and `env.VECTOR_INDEX` communicate over internal zero-trust Cloudflare Workers IPC; no API tokens exist in the codebase. Bindings are declared in `wrangler.jsonc` with `remote: true` — Vectorize has no local emulation, so development must exercise the real index.

### 5.2 Threat model & controls

| Threat | Mitigation |
|--------|------------|
| Hallucinated / open redirect | Model emits ids only; `resolveLinkIds()` drops anything not in the allowlist (ADR 09 §1) |
| Prompt injection steering the answer | Retrieval gate declines off-corpus queries before inference; the model only sees trusted, committed chunks (ADR 09 §2–§3) |
| Model emitting Markdown, links or multi-paragraph output | Server-side scrub and truncate; the prompt asks, the code enforces (ADR 09 §4) |
| Denial-of-wallet | Gate keeps off-topic traffic to embedding-only cost; KV-backed server-side rate limiting bounds the rest (ADR 09 §7) |
| Bots POSTing the endpoint | Origin check + server-side rate limit; the client cooldown is UX, not a control |
| Arbitrary JS injection | Reply rendered as text through Svelte templates, never as HTML |

## 6. Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Svelte island)                                    │
│  Wordmark + KodexBar + SyvInput ("¿Sí?")                    │
│  presentation only — no inference, no corpus                │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/ask
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Cloudflare Worker / Pages Function                         │
│  env.AI            @cf/baai/bge-m3            (embeddings)  │
│                    @cf/meta/llama-3.1-8b-instruct-fp8       │
│  env.VECTOR_INDEX  Cloudflare Vectorize (corpus)            │
│  env.SESSION       KV (rate limiting)                       │
└─────────────────────────────────────────────────────────────┘
```

No client-side inference. Chrome Built-in AI / Gemini Nano is removed — the corpus is server-side, and shipping chunks to the browser would make it enumerable.

### 6.1 Tooling standard

- **Package manager**: `bun` (`bun install`, `bun.lock`).
- **CLI runner**: `bunx wrangler` for Cloudflare tasks.
- **Build & test**: `bun run build`, `bun test`.
- **Corpus indexing**: `bun run index:corpus` — explicit, versioned, re-run on corpus change.

## 7. UX requirements

| ID | Requirement |
|----|-------------|
| UX-1 | Input placeholder is simply `¿Sí?`. |
| UX-2 | User prompt prefixed with `› `. |
| UX-3 | Links render as non-clickable icon + selectable hyperlinked text. |
| UX-4 | Replies are **one paragraph, plain text**. No Markdown, headings, lists or code blocks — ever. |
| UX-5 | Out-of-scope queries get a fixed, polite decline naming what KodexBar *can* answer. |
| UX-6 | Keyboard-only usable; caret and focus rings in SyV candle-orange tokens. |
| UX-7 | Language follows the ES|EN toggle; the corpus is filtered to that language. |

---

*PRD v2.0 — Active. KodexBar: single-tier grounded assistant over Cloudflare Workers AI + Vectorize, Bun-managed.*
