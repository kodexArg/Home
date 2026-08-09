---
id: "python-telegram-bot-mcp"
title: "python-telegram-bot-mcp — MCP bridge for Telegram Bot API via python-telegram-bot"
visibility: public
importance: normal
source_repo: "python-telegram-bot-mcp"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "library"
status: "experimental"
related: []
tags: ["python", "mcp", "telegram", "bot-api", "python-telegram-bot", "stdio", "agents", "claude-code", "planning", "mit"]
problems_solved:
  - "Existing Telegram MCP servers use MTProto via Telethon as user clients, requiring phone authentication, persistent sessions, and exposing the operator's personal Telegram account instead of a scoped bot identity."
  - "AI agents that need to send Telegram messages lack a standard MCP tool surface mapped 1:1 to the mature python-telegram-bot library, forcing ad-hoc HTTP calls or non-Python stacks."
  - "Enabling every Telegram Bot API method as an MCP tool in one release creates an untested, oversized attack surface; operators need phased, category-based rollout with clear naming conventions."
technologies:
  - "Python >=3.10 (planned)"
  - "python-telegram-bot >=22.6 (planned)"
  - "mcp[cli] >=1.0 or FastMCP (decision pending)"
  - "MCP stdio transport"
  - "Telegram Bot API (HTTPS, not MTProto)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# python-telegram-bot-mcp

> **Problem thesis (required):** kodexArg/python-telegram-bot-mcp exists to give AI agents a **bot-first, token-authenticated** path to the Telegram Bot API through the Model Context Protocol. Unlike MTProto-based Telegram MCP servers that impersonate a human user account, this project will wrap `telegram.Bot` from **python-telegram-bot** so each library method becomes an MCP tool with the same snake_case name and parameters. The repository is currently in **planning phase** — architecture and phased implementation are captured in `ADR.md` and `PDR.md`; no Python source, `pyproject.toml`, or runnable MCP server exists on `main` yet.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/python-telegram-bot-mcp` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | MCP server (planned) that maps every `telegram.Bot` method to an equivalent MCP tool for AI-driven Telegram bot operations. |
| Audience | AI agent operators (Claude Code, Cursor, other MCP clients), Python developers building Telegram bots, and internal ALVS workflows that need scoped bot messaging without personal-account MTProto access. |

## 2. Problems it solves

### P1 — Telegram MCP servers that hijack user accounts instead of bots

- **Who hurts:** Operators who want agents to post to Telegram channels or reply in bot-managed groups without handing a personal phone-authenticated session to an LLM toolchain.
- **Pain today:** Community MCP servers such as sparfenyuk/mcp-telegram and chigwell/telegram-mcp route through **Telethon / MTProto**, acting as a **user client**. That requires phone number login, persistent session files, and grants the agent capabilities tied to a human account — far broader than Bot API scope and harder to revoke cleanly.
- **How this repo answers:** ADR-001 commits to **Bot API only** via `python-telegram-bot`, authenticated with a **bot token** from BotFather (`TELEGRAM_BOT_TOKEN`). The agent's blast radius stays within what the bot is allowed to do (send to chats it knows, manage its own commands, etc.).
- **Out of scope:** Reading arbitrary private chats the bot was never added to, impersonating users, or MTProto features absent from the Bot API.

### P2 — No 1:1 MCP mapping to the dominant Python Telegram library

- **Who hurts:** Python-first teams and agent harness authors who already document bots with python-telegram-bot and want MCP tools that mirror official method names and parameters.
- **Pain today:** Agents either call raw HTTPS Bot API endpoints (reimplementing serialization and error handling) or use non-Python MCP stacks (telegraf, grammY). Documentation for MCP tools does not align with the library's method reference.
- **How this repo answers:** ADR-002 defines **strict naming**: `telegram.Bot.send_message()` → MCP tool `send_message` with the same primitive parameters; complex types like `InlineKeyboardMarkup` pass as JSON strings deserialized server-side. Operators can use python-telegram-bot docs as the tool reference.
- **Out of scope:** Replacing python-telegram-bot's `Application` handler model for long-running polling bots inside this MCP server — planned design uses `telegram.Bot` directly for **outbound, stateless API calls**.

### P3 — Unsafe "enable everything" MCP surface for ~80+ Bot methods

- **Who hurts:** Security-conscious deployers and testers who must validate each tool before exposing it to an autonomous agent.
- **Pain today:** Dumping all `telegram.Bot` methods into MCP at once yields a huge callable surface without incremental test coverage; file-upload semantics (URL vs file_id vs local path) and verbose API responses add operational risk.
- **How this repo answers:** `PDR.md` phases delivery from scaffolding (Fase 0) through messaging, media, chat management, inline/callback, webhooks/files, and payments/forums (Fases 1–6). Each phase has explicit success criteria and defers risky choices (e.g. local filesystem paths for media) until URL and `file_id` paths are proven.
- **Out of scope:** Receiving inbound updates (polling/webhooks as a consumer) in initial phases — send-only first; inbound update handling is explicitly marked as future work in `PDR.md`.

## 3. Product / idea

The **central idea** is a thin **stdio MCP server** that sits between an MCP client (e.g. Claude Code) and Telegram's cloud Bot API:

```
┌─────────────┐     stdio / JSON-RPC      ┌──────────────────┐     HTTPS      ┌──────────────┐
│ MCP Client  │ ◄──────────────────────► │  MCP Server      │ ◄────────────► │ Telegram API │
│ (agent IDE) │                          │  (python-tg-bot) │                │ (Bot API)    │
└─────────────┘                          └──────────────────┘                └──────────────┘
```

After implementation, an operator will configure the MCP server in their client (e.g. `~/.claude.json`), set `TELEGRAM_BOT_TOKEN`, and invoke tools like `send_message` or `get_me` from the agent. Each tool call translates to a single `telegram.Bot` method invocation; responses return structured JSON (full API response vs summarized — decision pending in `PDR.md`). The server is **stateless**: no message store, no disk persistence for media, no `Application` handlers.

**Planned module layout** (from `PDR.md` Fase 0 — not yet in tree):

| Path | Role |
|------|------|
| `src/telegram_mcp/__main__.py` | CLI entry: `python -m telegram_mcp` |
| `src/telegram_mcp/server.py` | MCP server bootstrap (FastMCP or official `mcp` SDK) |
| `src/telegram_mcp/bot.py` | Lazy singleton `telegram.Bot` |
| `src/telegram_mcp/config.py` | Env-based config (`TELEGRAM_BOT_TOKEN`, `LOG_LEVEL`) |
| `src/telegram_mcp/tools/` | Category modules: `info`, `messaging`, `media`, `interactive`, etc. |

### 3.1 North-star use cases

1. **Agent sends a text message:** Claude Code calls MCP tool `send_message` with `chat_id` and `text`; server returns `message_id` confirmation from Telegram.
2. **Operator smoke-test:** Run `mcp dev` or connect Claude Code after Fase 0; `initialize` succeeds and capabilities list grows per phase.
3. **Rich outbound content (Fase 2+):** Agent sends photo (URL or `file_id`), poll, location, or sticker through dedicated tools without custom HTTP glue.
4. **Chat administration (Fase 3+):** Agent queries `get_chat`, moderates with `ban_chat_member`, or pins messages via mapped tools — within bot permissions.

### 3.2 Non-goals

- **Not a user-client MCP** — no Telethon, no phone auth, no personal account sessions (`ADR.md` alternatives table).
- **Not inbound update processing** in early phases — no polling loop or webhook receiver for agent-side "read my Telegram" (`PDR.md` decision table).
- **Not persistent state** — no database, no message archive on disk (`PDR.md` conventions).
- **Not `Application` / handler framework usage** — direct `telegram.Bot` calls only (`PDR.md` conventions).
- **Not enabling all ~80+ methods at launch** — phased categories per `ADR-002`.

## 4. Technology stack

Current `main` contains **documentation only** (no manifests in tree). Stack below is **planned** per `ADR.md`, `PDR.md`, and `README.md`.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python >=3.10 | `ADR.md` dependencies table |
| Telegram client | python-telegram-bot >=22.6 | `README.md`, `ADR.md`, `PDR.md` |
| MCP SDK | `mcp[cli] >=1.0` **or** FastMCP (pending) | `PDR.md` Fase 0, decision table |
| Transport | MCP stdio | `ADR.md` architecture diagram |
| Remote API | Telegram Bot API (HTTPS) | `ADR.md`, `README.md` |
| Auth | Bot token via env var | `ADR.md` security, planned `.env.example` in `PDR.md` |
| Logging | Python `logging`, level from `LOG_LEVEL` | `PDR.md` conventions |
| Data | None (stateless) | `PDR.md` conventions |
| Infra / deploy | Local stdio MCP; no CI or container files yet | tree scan — absent |
| AI / agents | MCP tool surface for agent clients | `ADR.md`, `PDR.md` Fase 1 Claude config note |
| Tests | Manual agent tests per phase; no test harness in tree | `PDR.md` success criteria |

### 4.1 Notable dependencies (curated, planned)

- `python-telegram-bot` — mature LGPL-3.0 wrapper for Bot API; upstream v22.6 cited in `README.md`; this MCP layer is MIT and does not modify the library.
- `mcp` (Anthropic official SDK) — candidate for stdio MCP server and `mcp dev` workflow (`PDR.md` Fase 0).
- FastMCP — alternative under evaluation for API ergonomics (`PDR.md` pending decisions).

## 5. Repository map (abstraction)

**Current tree (planning snapshot):**

| Zone | Paths | Notes |
|------|-------|-------|
| Product docs | `README.md` | Goal, status, license pointer |
| Architecture | `ADR.md` | ADR-001 (stack choice), ADR-002 (tool mapping phases) |
| Implementation plan | `PDR.md` | Fases 0–6, scaffolding layout, conventions |
| Legal | `LICENSE` | MIT (copyright 2026 kodex) |

**Planned zones (not yet present):**

- **Entrypoints:** `src/telegram_mcp/__main__.py` — `python -m telegram_mcp`
- **Domain / core:** `bot.py` singleton, `tools/*.py` per API category
- **Adapters:** `server.py` (MCP), implicit HTTPS via python-telegram-bot
- **Config:** `config.py`, `.env.example` (token placeholder only)
- **Docs vaults:** No `docs/`, `.docs/`, or ADR folder beyond root `ADR.md`
- **Agent scaffolding:** No `.claude/`, `.agents/`, or `SKILL.md` in tree
- **Generated / vendor:** None; no `node_modules`, `venv`, or lockfiles yet

## 6. Configuration & contracts (no secrets)

**Planned environment variables** (from `ADR.md`, `PDR.md` — no `.env.example` file in tree yet):

| Variable | Purpose |
|----------|---------|
| `TELEGRAM_BOT_TOKEN` | BotFather-issued token; sole authentication credential; never committed |
| `LOG_LEVEL` | Python logging verbosity (`PDR.md` conventions) |

**Planned config files:**

- `.env.example` — documents `TELEGRAM_BOT_TOKEN=` placeholder (`PDR.md` Fase 0)
- `.gitignore` — Python artifacts + `.env` (`PDR.md` Fase 0)
- `pyproject.toml` — declares `python-telegram-bot` and `mcp` dependencies (`PDR.md` Fase 0)

**Error contract (planned):** Catch `telegram.error.TelegramError` and surface descriptive MCP errors (`PDR.md` conventions).

**Response contract (pending):** Full JSON API response vs summarized payload (`PDR.md` decision table).

### 6.1 HTTP / API endpoints (when applicable)

This repository does **not** expose an HTTP server for operators or agents. The **only planned network egress** is the MCP server's outbound HTTPS calls to the **Telegram Bot API** via python-telegram-bot.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No inbound HTTP surface in this repo | N/A |

Telegram Bot API routes are invoked indirectly through `telegram.Bot` methods, not documented here as HTTP paths (RAG hygiene; see python-telegram-bot and Telegram Bot API references externally).

### 6.2 Other interfaces

**MCP stdio transport** — primary interface. Client sends JSON-RPC over stdin/stdout; server registers tools per phase.

**Planned MCP tools by category** (`ADR-002`):

| Category | Representative tools | Phase |
|----------|---------------------|-------|
| info | `get_me` | 1 |
| messaging | `send_message`, `edit_message_text`, `delete_message`, `forward_message`, `copy_message` | 1 |
| media | `send_photo`, `send_document`, `send_audio`, `send_video`, `send_voice`, `send_animation`, `send_media_group` | 2 |
| interactive | `send_poll`, `send_dice`, `send_location`, `send_venue`, `send_contact`, `send_sticker` | 2 |
| chat_management | `get_chat`, `get_chat_member`, `get_chat_administrators`, `ban_chat_member`, `unban_chat_member`, `set_chat_title`, `set_chat_description`, `set_chat_photo` | 3 |
| chat_actions | `send_chat_action`, `pin_chat_message`, `unpin_chat_message`, `leave_chat` | 3 |
| inline | `answer_inline_query`, `answer_callback_query` | 4 |
| commands | `set_my_commands`, `get_my_commands`, `delete_my_commands` | 4 |
| webhooks | `set_webhook`, `delete_webhook`, `get_webhook_info` | 5 |
| files | `get_file` | 5 |
| payments | `send_invoice`, `answer_shipping_query`, `answer_pre_checkout_query` | 6 |
| forum | `create_forum_topic`, `edit_forum_topic`, `delete_forum_topic` | 6 |

**CLI entry (planned):** `python -m telegram_mcp` starts stdio MCP server (`PDR.md`).

**Client registration (planned):** MCP server entry in Claude Code config (`~/.claude.json`) after Fase 1 (`PDR.md`).

## 7. Data & persistence

- **Stores:** None. Explicit convention: server does not persist messages or media to disk (`ADR.md` security, `PDR.md` conventions).
- **Entities:** No local schema; Telegram-side chats, messages, and files exist only in Telegram's cloud; tool responses may echo API object fields transiently in MCP return payloads.
- **Topology:** Single-process MCP server on operator machine or agent host; stateless per tool call; outbound-only HTTPS to Telegram; no edge database or vector index.

## 8. Docs & agent memory (required scan)

| Source | Present | Summary |
|--------|---------|---------|
| `README.md` | yes | States dependency on python-telegram-bot v22.6, MCP 1:1 mapping goal, planning status, MIT license |
| `ADR.md` | yes | ADR-001: Bot API vs MTProto; stdio MCP; component map. ADR-002: phased tool categories and naming |
| `PDR.md` | yes | Fases 0–6 implementation checklist, directory scaffold, pending technical decisions, conventions |
| `docs/**` | no | Not in tree |
| `.docs/**` | no | Not in tree |
| `.claude/**` | no | Not in tree |
| ADR / PRD / harness elsewhere | partial | Only root `ADR.md` and `PDR.md`; no constitution or harness files |

**Evidence bullets:**

- `README.md` — product pitch and planning status
- `ADR.md` — architecture, security, phased tool matrix
- `PDR.md` — implementation phases, env vars, module layout, success criteria
- `LICENSE` — MIT

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repo; documentation only — no clone URLs needed in body for RAG hygiene.
- **Auth model:** Bot token via `TELEGRAM_BOT_TOKEN` environment variable only; no OIDC or session cookies (`ADR.md`).
- **Scope limitation:** Bot API cannot access arbitrary user private chats; narrower than MTProto user clients (`ADR.md` consequences).
- **Token handling:** Treat bot token as secret; never embed in code or commits (`ADR.md` risks).
- **Validation:** Mandatory `chat_id` on tools that require it (`ADR.md`).
- **Rate limiting:** Delegated to Telegram Bot API (`ADR.md`).
- **Media / filesystem:** Local path uploads deferred; URL and `file_id` preferred to avoid host filesystem exposure (`PDR.md` Fase 2 decision).
- **This summary:** Contains no secrets, tokens, `.env` values, or credential files.

## 10. Operational picture

**Current state:** Repository cannot be run — no `pyproject.toml`, `src/`, or installable package on `main`.

**Planned local dev** (`PDR.md` Fase 0):

1. Install dependencies from future `pyproject.toml`
2. Set `TELEGRAM_BOT_TOKEN` (from `.env` or shell)
3. Run `python -m telegram_mcp` or `mcp dev`
4. Connect MCP client; verify `initialize` and capabilities

**Planned verification** (`PDR.md`):

- Fase 0: MCP client connects and receives capabilities (no tools yet)
- Fase 1: Manual test — agent sends message to known `chat_id`, receives `message_id`
- Fase 2: Manual test — photo and poll delivery

**Deployment:** No GitHub Actions, Docker, or Cloudflare Workers config in tree. Expected deployment model is **local stdio MCP** alongside the agent IDE, not a hosted HTTP service.

**Hardware:** No special constraints; standard Python 3.10+ host with outbound HTTPS.

## 11. Open questions / unknowns

- **MCP SDK choice:** `mcp` official vs FastMCP — unresolved at planning time (`PDR.md` decision table).
- **Tool response shape:** Full Telegram API JSON vs abbreviated summary — unresolved (`PDR.md`).
- **Media input contract:** URL vs `file_id` vs local path priority — URL/`file_id` first; local path TBD (`PDR.md` Fase 2).
- **Inbound updates:** Whether a future phase adds polling/webhook **reception** for agents — explicitly deferred (`PDR.md`).
- **Complex parameter encoding:** JSON strings for markup types — stated convention but implementation untested (`ADR-002`).
- **Actual code, tests, CI, `.gitignore`, `pyproject.toml`:** Not present on `main` as of shallow clone — all scaffolding is specification-only.
- **`.claude/` and `.docs/`:** Absent; no agent skill or hidden docs vault to ingest.
- **Primary language on GitHub:** API reports `null` (no code files indexed); human-assigned **Python** from plans.
