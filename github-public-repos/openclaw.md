---
id: "openclaw"
title: "OpenClaw — personal multi-channel AI assistant"
visibility: public
importance: high
source_repo: "openclaw"
org: "kodexArg"
default_branch: "main"
primary_language: "TypeScript"
repo_kind: "application"
status: "active"
related: []
tags: ["typescript", "nodejs", "ai-assistant", "gateway", "multi-channel", "whatsapp", "telegram", "slack", "discord", "signal", "imessage", "mcp", "pi-mono", "cli", "macos", "ios", "android", "plugins", "skills", "local-first", "websocket", "mit"]
problems_solved:
  - "Cloud-hosted AI assistants trap users in one chat UI and leak context to third parties — users want a personal assistant on their own hardware that answers on the messaging apps they already use."
  - "Building a multi-channel AI bot requires stitching together a dozen messaging SDKs, session stores, model auth, media pipelines, and security policies — OpenClaw unifies these behind one Gateway control plane and onboarding wizard."
  - "Inbound DMs on real messaging surfaces are untrusted input; naive bots process spam and prompt-injection from strangers — OpenClaw defaults to DM pairing, allowlists, and per-peer session isolation."
technologies:
  - "TypeScript (ESM) on Node ≥22"
  - "Gateway WebSocket control plane + HTTP multiplex (port 18789 default)"
  - "Pi-mono agent runtime (@mariozechner/pi-agent-core, pi-ai, pi-coding-agent)"
  - "Vite + Lit Control UI"
  - "Swift companion apps (macOS menu bar, iOS, Android nodes)"
  - "Express 5 HTTP server"
  - "Vitest test suite + GitHub Actions CI"
  - "Docker / Podman / Fly.io / Nix deployment paths"
  - "Plugin SDK (jiti-loaded TypeScript extensions)"
  - "AgentSkills-compatible skills + ClawHub registry"
  - "MCP via mcporter bridge (not in-core runtime)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# OpenClaw

> **Problem thesis (required):** kodexArg/openclaw is a **public fork** of the upstream OpenClaw project — a personal, local-first AI assistant you run on your own devices. The Gateway is the control plane; the product is the assistant. It answers on WhatsApp, Telegram, Slack, Discord, Google Chat, Signal, iMessage (BlueBubbles), Microsoft Teams, Matrix, Zalo, WebChat, and more, with voice (macOS/iOS/Android), a live agent-driven Canvas (A2UI), browser control, cron/webhooks, and companion native apps. The repo solves the fragmentation of "one chatbot per channel" and "cloud-only AI" by shipping a single TypeScript monorepo with wizard-driven onboarding, secure DM defaults, multi-agent routing, and an extensible plugin/skills platform.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/openclaw` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Your own personal AI assistant — any OS, any platform, multi-channel inbox, local Gateway control plane. |
| Audience | Individual operators who want a always-on personal assistant; developers extending channels/plugins/skills; maintainers of the upstream OpenClaw ecosystem. |

**Fork relationship:** `kodexArg/openclaw` is a public fork of `openclaw/openclaw` with both `origin` (kodexArg) and `upstream` (openclaw) remotes configured. Content tracks the upstream personal-assistant codebase; the kodexArg copy includes a `.agent/workflows/update_clawdbot.md` workflow for syncing from upstream when branches diverge.

## 2. Problems it solves

### P1 — AI assistants locked to one UI and one cloud

- **Who hurts:** Power users who live in WhatsApp, Telegram, Slack, and iMessage but want one coherent AI helper; privacy-conscious operators who refuse to route all conversations through a SaaS dashboard.
- **Pain today:** ChatGPT/Claude web UIs are siloed. Per-channel DIY bots require separate auth, session logic, and model wiring. Cloud assistants retain conversation data on vendor infrastructure.
- **How this repo answers:** OpenClaw runs a **local Gateway** (default loopback port 18789) that multiplexes WebSocket RPC, HTTP APIs, Control UI, and channel adapters. Users talk to the assistant on existing messaging surfaces; transcripts and config live under `~/.openclaw/`. Model auth supports OAuth subscriptions (Anthropic, OpenAI) and API keys with failover profiles.
- **Out of scope:** Multi-tenant hosted assistant SaaS, team-wide shared knowledge bases without local operator control, or replacing enterprise IT helpdesk products.

### P2 — Multi-channel bot integration is engineering-heavy

- **Who hurts:** Solo developers and enthusiasts who want "text my bot on Telegram and WhatsApp" without maintaining six different SDK integrations, media pipelines, and routing rules.
- **Pain today:** Each channel (Baileys/WhatsApp, grammY/Telegram, Bolt/Slack, discord.js, signal-cli, BlueBubbles/iMessage, etc.) has different auth flows, webhook models, media limits, and group-mention semantics. Session continuity across channels is non-trivial.
- **How this repo answers:** Core channels live in `src/` (telegram, discord, slack, signal, imessage, web/WhatsApp, etc.); extension channels live in `extensions/*` (msteams, matrix, zalo, nostr, voice-call, …). The Gateway normalizes inbound messages, applies routing/allowlist/pairing policies, runs the Pi agent runtime, and delivers replies back. `openclaw onboard` wizard walks through gateway, workspace, channels, and skills setup. Multi-agent routing maps channels/accounts/peers to isolated agent workspaces.
- **Out of scope:** Building yet another generic chat SDK; wrapper channels around already-supported ones without a clear capability gap (per `VISION.md` guardrails).

### P3 — Messaging surfaces are untrusted; insecure defaults leak context

- **Who hurts:** Anyone who connects a bot to real phone numbers or public Discord/Telegram bots; multi-user DM inboxes where session sharing would leak private context between senders.
- **Pain today:** Open DMs invite prompt injection and spam. Default shared sessions mean Alice's medical question context can surface when Bob asks "what were we talking about?"
- **How this repo answers:** Default **DM pairing** (`dmPolicy="pairing"`) sends unknown senders a code; operator approves via `openclaw pairing approve`. `openclaw doctor` surfaces risky configs. `session.dmScope` supports `per-channel-peer` isolation for multi-user setups. Exec tool runs can require approval (`exec.approval.*` RPC). Plugins are in-process trusted code with explicit `plugins.allow` pinning recommended.
- **Out of scope:** Defeating prompt injection in model weights; securing intentionally public-internet-exposed gateways without operator-chosen auth (documented as out-of-scope in `SECURITY.md`).

## 3. Product / idea

OpenClaw's mental model is **Gateway-centric orchestration**:

```
Messaging channels (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, …)
        │
        ▼
┌───────────────────────────────────────┐
│  Gateway (control plane, port 18789)  │
│  WS RPC · HTTP APIs · Control UI      │
│  Sessions · Channels · Cron · Hooks   │
└──────────────┬────────────────────────┘
               │
       ┌───────┼───────┬──────────┬────────────┐
       ▼       ▼       ▼          ▼            ▼
   Pi agent   CLI   WebChat   macOS app   iOS/Android nodes
   (tools)  openclaw  (Lit UI)  (menu bar)  (canvas/camera/voice)
```

After `openclaw onboard --install-daemon`, the Gateway runs as a user service (launchd/systemd). The embedded **Pi agent** (derived from pi-mono) executes tools (read/exec/edit/browser/canvas/cron/sessions) inside a configurable workspace (`agents.defaults.workspace`, default `~/.openclaw/workspace`). Bootstrap files (`AGENTS.md`, `SOUL.md`, `TOOLS.md`, `USER.md`, `IDENTITY.md`) inject persona and operating instructions on new sessions.

**Skills** (AgentSkills-compatible `SKILL.md` folders) teach tool usage; **plugins** extend Gateway RPC, HTTP routes, CLI commands, and tools. **Nodes** (iOS/Android/macOS) expose camera, screen recording, location, notifications, and Canvas to the agent. **Voice Wake** and **Talk Mode** add always-on speech via ElevenLabs on supported platforms.

### 3.1 North-star use cases

1. **Personal inbox assistant** — User completes onboarding wizard, links WhatsApp + Telegram, messages the bot from either channel, gets consistent assistant behavior with `main` session continuity.
2. **Automation via hooks/cron** — External systems POST to `/hooks/agent` or schedule `cron` jobs; agent runs isolated turns and summarizes into the main session.
3. **Multi-agent household/work** — Route work Slack to `work` agent workspace and personal iMessage to `home` agent via channel/account/peer routing rules.
4. **Mobile node + Canvas** — iOS/Android node pairs over Bonjour; agent pushes A2UI to live Canvas while operator uses Voice Wake on macOS.

### 3.2 Non-goals

From `VISION.md` and project guardrails:

- New core skills when they can live on ClawHub (skills registry) instead.
- First-class MCP runtime in core (use `mcporter` bridge).
- Agent-hierarchy frameworks (manager-of-managers) as default architecture.
- Full-doc human translation sets for all locales (AI-generated translations planned).
- Commercial service integrations outside model-provider category without clear fit.
- Wrapper channels duplicating existing integrations without capability/security gap.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node ≥22.12, TypeScript ESM | `package.json` engines, `tsconfig.json` |
| Package manager | pnpm 10 (bun supported for dev) | `package.json` packageManager, `pnpm-workspace.yaml` |
| Agent runtime | pi-mono stack (pi-agent-core, pi-ai, pi-coding-agent, pi-tui) | `package.json` dependencies |
| Gateway transport | WebSocket RPC + Express 5 HTTP | `src/gateway/`, `src/gateway/server-http.ts` |
| Control UI | Vite + Lit | `ui/package.json`, `ui/vite.config.ts` |
| Native apps | Swift (macOS, iOS), Kotlin/Android Gradle | `apps/macos/`, `apps/ios/`, `apps/android/` |
| Channel SDKs | grammY, Baileys, Bolt, discord.js, signal-cli wrappers, etc. | `package.json`, `src/telegram`, `src/discord`, `extensions/*` |
| Browser automation | playwright-core | `package.json`, `src/browser/` |
| Media / images | sharp, pdfjs-dist, file-type | `package.json`, `src/media/` |
| Config | JSON5 file at `~/.openclaw/openclaw.json` | `docs/gateway/configuration.md` |
| Persistence | JSONL session transcripts, SQLite (memory plugins), local credential stores | `docs/concepts/agent.md`, `extensions/memory-*` |
| Infra / deploy | Docker Compose, Fly.io toml, Render.yaml, Nix (sibling repo), GitHub Actions | `docker-compose.yml`, `fly.toml`, `.github/workflows/` |
| AI / agents | Skills, plugins, ACP SDK, mcporter for MCP | `skills/`, `extensions/`, `VISION.md` |
| Tests | Vitest (unit, e2e, live, gateway, extensions configs) | `vitest.*.config.ts`, `test/` |

### 4.1 Notable dependencies (curated)

- `@mariozechner/pi-agent-core` / `pi-ai` / `pi-coding-agent` — embedded agent runtime, model calls, coding-agent tools.
- `@whiskeysockets/baileys` — WhatsApp Web protocol adapter.
- `grammy` + `@grammyjs/runner` — Telegram bot framework.
- `@slack/bolt` — Slack events and interactions.
- `@buape/carbon` — Discord API layer.
- `playwright-core` — headless browser control tool surface.
- `ws` — Gateway WebSocket server and client protocol.
- `@agentclientprotocol/sdk` — Agent Client Protocol integration.
- `sqlite-vec` — vector storage option for memory plugins.
- `zod` + `@sinclair/typebox` — schema validation (config, OpenResponses).
- `commander` + `@clack/prompts` — CLI and interactive wizard prompts.

## 5. Repository map (abstraction)

- **Entrypoints**
  - `openclaw.mjs` — published npm binary entry.
  - `src/entry.ts` — CLI process bootstrap (respawn for Node warning suppression).
  - `src/index.ts` / `dist/index.js` — programmatic exports.
  - `src/gateway/server.impl.ts` — Gateway server composition.

- **CLI & commands**
  - `src/cli/` — Commander-based CLI wiring.
  - `src/commands/` — `gateway`, `agent`, `onboard`, `doctor`, `message send`, `config`, etc.
  - `src/wizard/` — onboarding wizard (clack prompters).

- **Gateway (control plane)**
  - `src/gateway/` — HTTP/WS server, auth, hooks, OpenAI-compatible endpoints, Control UI static serving, canvas host.
  - `src/gateway/server-methods/` — WS RPC handlers (agent, sessions, channels, nodes, config, cron, skills, browser, …).
  - `src/gateway/protocol/` — schema/codegen for Gateway protocol (Swift models generated for apps).

- **Channels & routing**
  - `src/telegram`, `src/discord`, `src/slack`, `src/signal`, `src/imessage`, `src/web` (WhatsApp), `src/line`, `src/channels`, `src/routing`, `src/pairing`.
  - `extensions/*` — workspace packages for Teams, Matrix, Zalo, Nostr, Voice Call, memory backends, OAuth provider helpers, etc.

- **Agent & tools**
  - `src/agents/` — Pi runtime wiring, tool policies, CLI backends, sandbox, skills loading.
  - `src/browser/`, `src/canvas-host/`, `src/cron/`, `src/hooks/`, `src/memory/`.
  - `src/auto-reply/` — inbound message dispatch to agent.

- **Native companion apps**
  - `apps/macos/` — menu bar app, Voice Wake, Talk Mode, WebChat, remote gateway control.
  - `apps/ios/`, `apps/android/` — nodes (Canvas, camera, screen record, voice).
  - `apps/shared/OpenClawKit/` — shared Swift kit.

- **UI**
  - `ui/` — Vite-built Control UI (Lit components) served from Gateway `dist/control-ui`.

- **Skills & plugins**
  - `skills/` — 52 bundled AgentSkills folders (1password, canvas, discord, gemini, …).
  - `extensions/` — 37 extension packages with `openclaw.plugin.json` manifests.
  - `src/plugins/` — plugin loader, SDK surface (`openclaw/plugin-sdk` export).

- **Docs vault**
  - `docs/` — Mintlify-hosted documentation tree (gateway, channels, tools, platforms, providers).
  - `README.md`, `VISION.md`, `SECURITY.md`, `CONTRIBUTING.md`, `CHANGELOG.md`.
  - No `.docs/` hidden vault present in tree.

- **Agent scaffolding**
  - `AGENTS.md` — canonical agent/maintainer instructions (symlinked as `CLAUDE.md`).
  - `.agents/skills/` — maintainer skills (review-pr, prepare-pr, merge-pr, mintlify, PR_WORKFLOW).
  - `.agent/workflows/update_clawdbot.md` — upstream sync workflow for fork operators.

- **Generated / vendor (existence only)**
  - `dist/` (build output), `vendor/a2ui/` (Canvas A2UI spec; build artifacts gitignored), `node_modules/`, Android `.gradle` build dirs.

## 6. Configuration & contracts (no secrets)

**Config file:** `~/.openclaw/openclaw.json` (JSON5). Strict schema validation — invalid config prevents Gateway boot; `openclaw doctor --fix` repairs common issues.

**Env precedence (highest first):** process env → `./.env` → `~/.openclaw/.env` → `openclaw.json` `env` block. See `.env.example` for shapes.

| Variable / key | Purpose |
|----------------|---------|
| `OPENCLAW_GATEWAY_TOKEN` | Gateway auth token (recommended when not loopback-only) |
| `OPENCLAW_GATEWAY_PASSWORD` | Alternative password auth mode |
| `OPENCLAW_STATE_DIR` | Override `~/.openclaw` state root |
| `OPENCLAW_CONFIG_PATH` | Override config file path |
| `OPENCLAW_GATEWAY_PORT` | Gateway listen port (default 18789) |
| `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `GEMINI_API_KEY`, … | Model provider credentials |
| `TELEGRAM_BOT_TOKEN`, `DISCORD_BOT_TOKEN`, `SLACK_BOT_TOKEN`, … | Channel credentials when not in config file |
| `gateway.auth.*` | Token/password auth configuration |
| `gateway.bind` | `loopback` (default), `lan`, `tailnet`, etc. |
| `channels.<provider>.allowFrom` / `dmPolicy` | DM allowlists and pairing policy |
| `agents.defaults.workspace` | Agent workspace directory |
| `hooks.enabled`, `hooks.token` | Webhook ingress |
| `plugins.slots.memory` | Active memory plugin id |

**Credential storage:** channel OAuth/session material under `~/.openclaw/credentials/`; never commit `.env` or real tokens.

### 6.1 HTTP / API endpoints (when applicable)

Gateway multiplexes HTTP on the same port as WebSocket (default 18789).

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/` (and Control UI paths) | Browser Control UI + static assets | Gateway token/password when configured |
| `GET` | `/ui/*` | Control UI alternate path | Same as above |
| `WS` | `/` (upgrade) | Gateway WebSocket RPC protocol | `connect` handshake with token/password |
| `POST` | `/v1/chat/completions` | OpenAI-compatible chat completions | Gateway auth (Bearer) |
| `POST` | `/v1/responses` | OpenResponses API | Gateway auth (Bearer) |
| `POST` | `/tools/invoke` | Direct tool invocation HTTP surface | Gateway auth (Bearer) |
| `POST` | `/hooks/wake` | Enqueue system event / heartbeat | Hook token (`Authorization: Bearer` or `x-openclaw-token`) |
| `POST` | `/hooks/agent` | Run isolated agent turn from external trigger | Hook token |
| `POST` | `/hooks/<mapped-path>` | Custom hook route mappings | Hook token |
| `*` | `/api/channels/*` | Plugin channel HTTP endpoints | Gateway auth required |
| `*` | Canvas / A2UI paths | Agent-driven Canvas host + A2UI push | Canvas capability + gateway auth |
| `*` | Plugin HTTP routes | Extension-defined handlers | Plugin-owned (channel routes gateway-protected) |

Slack HTTP events may be handled via dedicated middleware (`handleSlackHttpRequest`).

### 6.2 Other interfaces

**CLI (primary operator surface):**

- `openclaw onboard` / `configure` — setup wizards.
- `openclaw gateway` — start/status/install/restart/stop daemon.
- `openclaw agent --message "..."` — run agent turn (optional delivery to channel).
- `openclaw message send --to ... --message ...` — outbound message.
- `openclaw channels status --probe` — channel health.
- `openclaw pairing approve <channel> <code>` — DM pairing.
- `openclaw doctor` — config/security diagnostics.
- `openclaw plugins list|install` — extension management.
- `openclaw config get|set|unset` — config manipulation.
- `openclaw logs --follow` — log tail.
- `openclaw tui` — terminal UI for gateway chat.

**Gateway WebSocket RPC (representative methods):**

- Core: `connect`, `health`, `status`, `agent`, `chat.*`, `send`, `poll`.
- Sessions: `sessions.*` (list, reset, patch).
- Agents: `agents.*`, `agent.identity.get`.
- Channels: `channels.*` (status, logout, probe).
- Nodes: `node.pair.*`, `node.list`, `node.invoke`, `node.event`.
- Config/system: `config.*`, `models.*`, `skills.*`, `cron.*`, `logs.tail`.
- Tools/safety: `browser.*`, `exec.approval.*`, `wizard.*`, `update.*`, `usage.*`.
- Voice/push: `voicewake.*`, `talk.*`, `tts.*`, `push.test`.

**MCP:** supported externally via `mcporter` bridge (not embedded core runtime per `VISION.md`).

**Native node protocol:** iOS/Android/macOS nodes pair via Gateway `node.pair.*` RPC; expose camera, canvas, location, notifications.

## 7. Data & persistence

- **Session transcripts:** JSONL files at `~/.openclaw/agents/<agentId>/sessions/<sessionId>.jsonl` (Gateway-owned; UI clients query Gateway, not local files directly).
- **Session keys:** Direct chats collapse to `agent:<agentId>:<mainKey>`; groups/channels get distinct keys; `session.dmScope` controls DM isolation granularity.
- **Workspace files:** Operator-edited `AGENTS.md`, `SOUL.md`, `TOOLS.md`, `USER.md`, `IDENTITY.md`, `BOOTSTRAP.md` in agent workspace.
- **Memory plugins:** `memory-core` (bundled default slot) or `memory-lancedb` (vector long-term memory); only one active memory plugin at a time.
- **Pairing allowlists:** local stores for approved DM senders per channel.
- **Cron job state:** managed by Gateway cron subsystem (`src/cron/`).
- **Topology:** local-first by default (loopback Gateway). Remote access via SSH tunnel or Tailscale Serve/Funnel. Docker/Podman mounts `~/.openclaw` config + workspace volumes. Fly.io/render.yaml support optional cloud deployment of Gateway container.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. `README.md` — product overview, install, channels, architecture diagram, security defaults.
2. `VISION.md` — roadmap priorities, plugin/MCP/skills policy, non-goals.
3. `AGENTS.md` (symlink `CLAUDE.md`) — maintainer structure, build/test commands, channel refactor rules, docs linking policy, security tips.
4. `SECURITY.md` — threat model, plugin trust boundary, DM/web exposure guidance.
5. `docs/gateway/index.md`, `docs/gateway/configuration.md` — Gateway ops, ports, hot reload, auth.
6. `docs/web/index.md` — Control UI, Tailscale access patterns.
7. `docs/automation/webhook.md` — `/hooks/wake` and `/hooks/agent` contracts.
8. `docs/concepts/agent.md`, `docs/concepts/session.md` — workspace bootstrap, session model, DM scope security.
9. `docs/tools/plugin.md`, `docs/tools/skills.md` — extension and skills architecture.
10. `.agents/skills/PR_WORKFLOW.md` — maintainer PR pipeline (review-pr → prepare-pr → merge-pr).
11. `.agent/workflows/update_clawdbot.md` — fork upstream sync workflow.
12. `.env.example` — env var shapes (no values copied).
13. `package.json`, `docker-compose.yml` — stack and deploy evidence.

**No `.docs/` directory** was present. **`.claude/`** is not a separate tree; agent instructions live in `AGENTS.md` / `CLAUDE.md` symlink and `.agents/skills/`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** public fork of a widely deployed open-source assistant; treat repo as reference implementation, not a hosted service.
- **Auth model:** Gateway requires token/password by default (`gateway.auth` or env vars). Hook endpoints use separate `hooks.token` (must not equal gateway token). Tailscale identity headers supported for Serve mode.
- **DM policy:** default pairing mode; public open DMs require explicit `dmPolicy="open"` plus `"*"` in allowlist.
- **Plugin trust:** plugins run in-process with Gateway OS privileges — install only trusted plugins; use `plugins.allow` pinning.
- **Web exposure:** Control UI and HTTP APIs intended for local/trusted network use; loopback bind recommended.
- **Prompt injection:** acknowledged out-of-scope for security reports; operators must treat inbound messages as untrusted.
- **This summary contains no secrets, tokens, PEMs, or `.env` values.**

## 10. Operational picture

**Local dev:**

```bash
pnpm install
pnpm ui:build   # first-time Control UI assets
pnpm build
pnpm openclaw onboard --install-daemon
pnpm gateway:watch   # dev loop with TS reload
```

**Production-like:**

```bash
npm install -g openclaw@latest
openclaw onboard --install-daemon
openclaw gateway --port 18789
```

**Deploy paths:**

- **Daemon:** launchd (macOS) / systemd user unit via `openclaw gateway install`.
- **Docker/Podman:** `docker-compose.yml` + `docker-setup.sh` / `setup-podman.sh`.
- **Fly.io:** `fly.toml`, `fly.private.toml`.
- **Render:** `render.yaml`.
- **Nix:** sibling `nix-openclaw` repo (declarative config).
- **CI:** `.github/workflows/ci.yml` — lint (oxlint/oxfmt), TypeScript (tsgo), Vitest unit/e2e/live, macOS/iOS/Android builds on scope detection; `docker-release.yml` for container publishing.

**Hardware:** runs on macOS, Linux, Windows (WSL2 recommended). Companion apps target Apple Silicon/Intel Macs, iOS simulators/devices, Android. Optional GPU not required; local LLM via `node-llama-cpp` is peer dependency for some paths.

## 11. Open questions / unknowns

- Exact divergence between `kodexArg/openclaw` `main` and upstream `openclaw/openclaw` `main` at any given moment (fork tracks upstream; local-only commits may exist — operator should `git fetch upstream` before assuming parity).
- Which memory plugin will become the single recommended default (VISION.md notes convergence planned among current options).
- Windows native app timeline (vision lists Windows/Linux companion apps as future; CLI works via WSL2 today).
- Full enumeration of all plugin-defined HTTP routes without runtime inspection (plugin-owned routes vary by enabled extensions).
- Whether kodexArg operates a custom deployment of OpenClaw or uses the fork purely as mirror/reference (not stated in repo tree).
