# PRD — kodexArg Home (personal router)

| | |
|---|---|
| **Product** | Personal home page for **kodexArg** |
| **URL (target)** | `https://home.kodexarg.com` |
| **Repo** | `kodexArg/Home` (this tree) |
| **Status** | Active — v1.0 |
| **Owner** | kodexArg / Gabriel Cavedal |
| **Stack** | Astro + Svelte 5 islands on Cloudflare (Workers/Pages), **Bun** package manager |
| **Design** | Presentation Orange / SyV tokens (`SyvInput`, monospaced console) |
| **Cloudflare Native** | Cloudflare Workers AI + Cloudflare Vectorize (Zero-secret bindings) |

---

## 1. Problem

kodexArg needs a single, calm front door: not a portfolio dump, not a CMS, not an open chatbot. Visitors (and kodex himself) should land on a minimal surface — **logo + console** — and reach known destinations (GitHub projects, public pages) without hunting bookmarks or exposing an open LLM endpoint.

Bots and scrapers must not be able to drive the router by hammering an API. Humans interact through the designed UI; the backend only accepts traffic that looks like that interaction, with hard rate limits.

## 2. Goals

1. **Minimal home**: logo (wordmark) + chat-like console. No nav chrome, no card grids.
2. **Two-Tier Closed Router**: the console is a **closed-action intent router** (aligned with `kodexArg/alvs-financial-gateway` architecture). Known routes produce structured `Action` outcomes; non-matching queries produce `NO_MATCH` / status lines. No arbitrary generated assistant prose.
3. **Adaptive Strategy Pattern**: client/edge multi-strategy engine (`window.ai` Gemini Nano → Cloudflare Vectorize Edge DB → RuleBased).
4. **Cloudflare Edge Vector Search**: native zero-secret integration with **Cloudflare Workers AI** (`env.AI`) and **Cloudflare Vectorize** (`env.VECTOR_INDEX`).
5. **Tooling & Engine**: strictly managed via **Bun** (`bun install`, `bun.lock`, `bun run build`, `bunx wrangler`).
6. **Safe cooldown & zero-trust**: server-enforced delay between queries and origin checks.

### Non-goals

- Open-ended freeform chat or unguided RAG.
- Account login / multi-user profiles.
- Dynamic discovery of private GitHub repos (only **explicit allowlist** destinations).
- SEO-heavy marketing pages or blog.

## 3. Product surface

### 3.1 Layout

| Element | Role |
|---------|------|
| **Wordmark** | `kodexArg` (link optional: CV or self). Top-left, static. |
| **Chat UI** | Bottom-anchored console: scrollback stack + `SyvInput` (`¿Sí?`). |
| **Atmosphere** | Aurora / dark Presentation Orange background only — no extra widgets. |

Mobile-first width; max content ~720px for the console.

### 3.2 Interaction model

1. Human focuses the pip-boy input (`¿Sí?`) and types a query or alias.
2. On commit (Enter), client shows a short **routing** phase (`routing query via strategy…`).
3. Strategy engine resolves query to a typed `RouteResult`:
   - **`Action` (`kind: "navigate"`)** → prefix copy + link container (`[icon]` + `<a class="who">href</a>`).
   - **`NO_MATCH`** → closed status line; no navigation.
4. Link rendering: icon is non-clickable (`pointer-events: none`), link text is selectable (`user-select: text`) and hyperlinked.

### 3.3 Visible protocol & UI link rendering

```
› Dónde puedo ver su currículum?
Puedes ver su currículum aquí: [link-icon] cv.kodexarg.com
```

No fake “primary LLM cluster” copy. All responses map directly to typed router outcomes.

## 4. Router — Strategy pattern

### 4.1 Principle

```
Input → AdaptiveRouter → Strategy Chain → RouteResult { outcome: 'Action' | 'NO_MATCH' }
```

- **Closed world**: only registered strategies and registered destination keys exist.
- **No fuzzy “best guess”** that invents URLs.
- **Default fallback**: `RuleBasedStrategy` (instant 0ms local matcher).

### 4.2 Strategy Chain & Interface

```ts
export type RouterActionKind = 'navigate' | 'confirm' | 'status';

export interface RouterAction {
  kind: RouterActionKind;
  target?: string;
  label?: string;
  destination?: RouteDestination;
}

export interface RouteResult {
  outcome: 'Action' | 'NO_MATCH' | 'Escalate';
  action?: RouterAction;
  destination?: RouteDestination;
  explanation: string;
  strategyName: string;
}

export interface RouterStrategy {
  name: string;
  isSupported(): Promise<boolean>;
  route(query: string): Promise<RouteResult>;
}
```

#### Active Strategy Chain:

1. **`WindowAiStrategy`**: Chrome Built-in AI (`window.ai.languageModel` / Gemini Nano on-device).
2. **`CloudflareVectorizeStrategy`**: Edge vector search via `/api/vector-route` using **Cloudflare Workers AI** (`env.AI`) and **Cloudflare Vectorize** (`env.VECTOR_INDEX`).
3. **`RuleBasedStrategy`**: Instant zero-overhead keyword and pattern matcher.

### 4.3 Allowlist Destinations

Configured in `src/lib/router/destinations.ts`:

| Destination ID | Name | Target URL | Matched Intent Keywords |
|---|---|---|---|
| `cv` | **Currículum / CV** | `https://cv.kodexarg.com` | `curriculum`, `cv`, `resume`, `hoja de vida`, `experiencia` |
| `github` | **GitHub Repositories** | `https://github.com/kodexarg` | `github`, `repo`, `repositorio`, `código`, `proyectos` |
| `docs` | **Documentation** | `https://docs.kodexarg.com` | `docs`, `documentación`, `guía`, `manual`, `api`, `wiki` |
| `syv-design-system` | **SyV Design System** | `https://github.com/kodexarg/syv-design-system` | `syv`, `design system`, `diseño`, `paleta`, `componentes` |

## 5. Security & Cloudflare Native Bindings

### 5.1 Zero Secrets Architecture

Cloudflare integration uses **native Environment Bindings** configured in `wrangler.jsonc`:

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "homepage",
  "compatibility_date": "2026-07-24",
  "compatibility_flags": ["nodejs_compat"],
  "ai": {
    "binding": "AI"
  },
  "vectorize": [
    {
      "binding": "VECTOR_INDEX",
      "index_name": "kodex-vector-index"
    }
  ]
}
```

- **Zero hardcoded secret keys**: `env.AI` and `env.VECTOR_INDEX` communicate over internal zero-trust Cloudflare Workers IPC.

### 5.2 Threat Model & Controls

| Threat | Mitigation |
|--------|------------|
| Bots POSTing route API | Cooldown + origin check + closed outcome validation |
| Open redirect | Allowlist `href` targets only from `destinations.ts` |
| LLM cost abuse | Cloudflare Workers AI + Vectorize free tier bounds (5M dimensions/month free) |
| Arbitrary JS injection | Sanitized link rendering via Svelte templates |

## 6. Architecture & Tooling

```
┌─────────────────────────────────────────────────────────────┐
│  Browser (Svelte island)                                    │
│  Wordmark + LlmRouterChat + SyvInput ("¿Sí?")               │
│  - AdaptiveRouter (WindowAi -> Vectorize -> Rule)           │
└──────────────────────────────┬──────────────────────────────┘
                               │ POST /api/vector-route
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Cloudflare Worker / Pages Function                         │
│  Bindings: env.AI (@cf/baai/bge-small-en-v1.5)             │
│            env.VECTOR_INDEX (Cloudflare Vectorize DB)       │
└─────────────────────────────────────────────────────────────┘
```

### 6.1 Tooling & Execution Standard

- **Package Manager**: `bun` (`bun install`, `bun.lock`).
- **CLI Runner**: `bunx wrangler` for Cloudflare tasks.
- **Build & Test**: `bun run build`.

## 7. UX Requirements

| ID | Requirement |
|----|-------------|
| UX-1 | Input field placeholder is simply `¿Sí?`. |
| UX-2 | User prompt prefixed with `› `. |
| UX-3 | Navigate results expose non-clickable icon + selectable hyperlinked URL. |
| UX-4 | Closed-action router: no arbitrary generated LLM prose. |
| UX-5 | Keyboard-only usable; caret and focus rings in SyV candle-orange tokens. |

---

*PRD v1.0 — Active. Two-tier closed-action router, Cloudflare Vectorize + Workers AI attached, Bun-managed.*
