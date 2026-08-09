---
id: "kdx-avatar"
title: "kdx-avatar — live camera-to-avatar adapter with blank-video and service failover"
visibility: public
importance: normal
source_repo: "kdx-avatar"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "application"
status: "active"
related: []
tags: ["python", "avatar", "vrm", "snekstudio", "v4l2loopback", "virtual-camera", "failover", "linux", "wayland", "ffmpeg", "godot", "harness", "cli", "debian"]
problems_solved:
  - "VTuber and face-tracked avatar stacks exist as standalone apps, but operators need a service-shaped adapter that reads the camera, responds with avatar video, and never leaves downstream consumers with a dead or missing video device."
  - "When the puppet renderer (SnekStudio) crashes, closes, or loses tracking, video consumers (Discord, Meet, OBS) hang on a non-producing capture device unless something else keeps valid frames flowing."
  - "Operators need a stable control plane that survives puppet failure — status, restart, stop, and privacy blank mode must remain reachable without rebooting the host or manually re-plugging devices."
technologies:
  - "Python 3.12+"
  - "uv (package manager / build)"
  - "pytest"
  - "ffmpeg (blank frame producer)"
  - "v4l2loopback (virtual camera export)"
  - "SnekStudio / Godot 4 (external puppet)"
  - "VRM models"
  - "harness-default documentation vault"
  - "markdown-vault-mcp"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-avatar

> **Problem thesis (required):** kdx-avatar is a host-local **interface adapter** that turns a real webcam feed into a live digital avatar stream (VRM puppet via SnekStudio) and exposes it as a stable video interface for consumers (virtual camera, OBS). The core pain is that existing avatar apps are not **service-shaped**: they do not guarantee continuous valid video on failure, do not keep a control plane alive when the puppet dies, and do not coordinate device policy with sibling tools on the same machine. This repo solves that with a two-layer failover model — blank frames on the export path, full service operability on the control path — while treating SnekStudio as a collaboration partner rather than a fork target.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-avatar` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Live camera→avatar adapter (SnekStudio collaboration path) with blank-video and service failover. |
| Audience | Primary operator on a Linux/Wayland host (debian-sid reference); downstream video consumers (Discord, Meet, OBS); upstream SnekStudio OSS collaborators; AI agents working inside the harness-default documentation vault. |

## 2. Problems it solves

### P1 — Avatar stacks are apps, not adapters

- **Who hurts:** Operators who want a persistent avatar camera on a Linux desktop for calls, streaming, and OBS workflows.
- **Pain today:** Face-tracked avatar software (SnekStudio, VTuber tools) runs as a GUI app. If it crashes or the window closes, consumers lose the video source. There is no stable contract for start/stop, health, or device naming. Camera capture and export are not owned by a single supervised process.
- **How this repo answers:** kdx-avatar wraps SnekStudio as a **child process** supervised by a daemon that owns the export path. A CLI (`kdx-avatar start|stop|status|restart-puppet|set-mode`) provides the operator contract. The service FSM tracks modes (`avatar`, `blank`, `starting`, `stopping`, `failed`, `stopped`) and publishes atomic status JSON for tooling.
- **Out of scope:** Reimplementing the Godot/VRM renderer inside this repo; multi-tenant cloud avatar serving; Snap-style AR filters on the raw face.

### P2 — Puppet death kills the video edge

- **Who hurts:** Video consumers (browsers, Discord, Meet, OBS) and the operator who must re-select a camera or reboot when SnekStudio exits.
- **Pain today:** When tracking/render fails, the virtual camera may stop producing valid frames or disappear entirely. Consumers hang waiting for frames that never arrive.
- **How this repo answers:** **Frame-path failover (Layer 1):** an ffmpeg-based `BlankProducer` continuously emits valid black frames (yuyv422) to the export v4l2 device (`/dev/video11` on the reference host) whenever the puppet is unhealthy or `force_blank` is set. The device stays alive; consumers always receive decodable video. v0 export kind is `blank_hold` — the blank generator holds the vcam; avatar pixels into the vcam via window capture is the next slice.
- **Out of scope:** OBS-only failover without a device-level story; "black hole" export with no frames; machine reboot as recovery.

### P3 — Control plane must survive puppet failure

- **Who hurts:** Operators who need to restart SnekStudio, check health, or force privacy blank mode without killing the entire adapter or losing the export device.
- **Pain today:** If the puppet process is the whole product, its death means no status, no restart handle, and manual cleanup of orphaned processes and camera holders.
- **How this repo answers:** **Service-path failover (Layer 2):** the daemon remains running and responsive when SnekStudio dies. `status` returns defined JSON/text without hanging. `restart-puppet` sends SIGUSR1 to bounce only the puppet while the blank producer holds export. `set-mode blank` forces privacy frames via SIGUSR2. Auto-restart with exponential backoff (2–30s) attempts to recover the puppet. Explicit `stop` releases export, kills children cleanly, and clears PID/status files.
- **Out of scope:** Replacing SnekStudio with an in-process Godot embedding (rejected per architecture until an ADR reopens it).

## 3. Product / idea

kdx-avatar is a **constellation** repository: two conceptual zones (`interfaces/` and `services/`) map to a single Python package (`kdx_avatar`) that implements both the operator CLI and the orchestrator daemon. The product does **not** render VRM avatars itself — it **orchestrates** SnekStudio (Godot + VRM + face tracking) and guarantees a stable video edge.

### Logical pipeline

```
  camera ──► adapter service ──► avatar frames ──► virtual cam / OBS
                    │
                    └── on failure ──► blank frames + live status/restart
```

Inside the daemon:

1. **BlankProducer** starts first and holds the v4l2loopback device with continuous black frames.
2. **Puppet** (SnekStudio) launches as a GUI child with session environment (DISPLAY, WAYLAND_DISPLAY).
3. FSM polls every 0.5s: if puppet alive and not force_blank → mode `avatar`; else → mode `blank`.
4. On puppet death: service stays up, blank continues, auto-restart with backoff.
5. On operator stop: puppet killed, blank stopped, export released, clean exit.

SnekStudio is the default and binding puppet engine (ADR-05). Integration preference order: process + window capture/OBS first; then documented CLI/IPC hooks; then upstream PRs; time-boxed local patches only as last resort.

### 3.1 North-star use cases

1. **UC-02 — Healthy avatar path:** Operator starts adapter; export device becomes available; status reports `avatar`; consumers receive non-blank avatar frames driven by the camera via SnekStudio.
2. **UC-03 — Blank-video failover:** SnekStudio exits unexpectedly; export continues with valid blank frames; service process remains running; status reports `blank`.
3. **UC-04 — Service controllable after puppet failure:** Operator can query status and `restart-puppet` without full host reboot; on success mode returns to `avatar`.
4. **UC-05 — Clean stop:** Operator stops adapter; export released; no orphan SnekStudio or exclusive camera holders.
5. **UC-06 — Device policy:** Adapter never binds the sibling `kdx-share` loopback device (`/dev/video10`); uses `video11` labeled `kdx-avatar`.

### 3.2 Non-goals

- Replacing SnekStudio with a custom Godot puppet engine.
- Snap-style AR filters (ears belong on the VRM mesh, not on raw face).
- Multi-tenant cloud serving of avatars.
- Owning `/dev/video10` or replacing the `kdx-share` sibling product.
- Shipping the full Godot editor or VRM mesh editing tools.
- In-process Godot embedding (rejected until ADR reopens).

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python ≥3.12 | `pyproject.toml` `requires-python` |
| Package manager | uv (uv_build backend) | `pyproject.toml`, `uv.lock` |
| CLI entrypoint | `kdx-avatar` console script | `pyproject.toml` `[project.scripts]` |
| Blank frame producer | ffmpeg lavfi color filter → v4l2 | `src/kdx_avatar/blank.py` |
| Puppet engine | SnekStudio (external binary, Godot 4) | `src/kdx_avatar/puppet.py`, `docs/SNEKSTUDIO.md` |
| Virtual camera | v4l2loopback kernel module | `docs/constitution/INFRASTRUCTURE.md`, `docs/INSTALL.md` |
| Capture hardware | Logitech Brio 100 (reference host) | `docs/constitution/INFRASTRUCTURE.md` |
| Optional compose | OBS Studio Virtual Camera | `docs/constitution/INFRASTRUCTURE.md` |
| Tests | pytest | `pyproject.toml`, `tests/test_status_io.py` |
| Docs vault | harness-default + markdown-vault-mcp | `docs/constitution/HARNESS.md`, `.mcp.json` |
| Agent harness | kwf-* cast, guardians, triage-and-fix skill | `docs/agents/`, `.claude/agents/`, `docs/skills/` |
| Infra / deploy | Local host install; no cloud dependency | `docs/constitution/INFRASTRUCTURE.md` |
| AI / agents | Guardian agents (PRD, ADR), assertion-review, triage-and-fix | `docs/agents/guardian-prd.md`, `docs/skills/` |

### 4.1 Notable dependencies (curated)

- **stdlib only for runtime** — `pyproject.toml` lists zero production dependencies; the adapter uses Python stdlib plus host binaries (ffmpeg, SnekStudio).
- **pytest** — dev dependency for unit tests that avoid requiring real hardware or SnekStudio.
- **ffmpeg** — external binary required on PATH for blank frame production onto v4l2.
- **SnekStudio** — external Godot binary installed per `docs/INSTALL.md`; resolved via `KDX_AVATAR_SNEKSTUDIO` or `~/.local/bin/snekstudio`.
- **v4l2loopback** — kernel module providing dual loopback devices on the reference host.
- **markdown-vault-mcp** — MCP server configured in `.mcp.json` to serve the `docs/` vault with wikilink-aware indexing.

## 5. Repository map (abstraction)

- **Entrypoints:**
  - `src/kdx_avatar/cli.py` — operator CLI (`kdx-avatar` command).
  - `src/kdx_avatar/daemon_main.py` / `src/kdx_avatar/daemon.py` — background orchestrator (`python -m kdx_avatar.daemon`).
  - `src/kdx_avatar/__main__.py` — module entry.

- **Domain / core:**
  - `src/kdx_avatar/daemon.py` — `Daemon` class: FSM, signal handling, puppet supervision, status publishing.
  - `src/kdx_avatar/blank.py` — `BlankProducer`: ffmpeg subprocess for safe solid frames.
  - `src/kdx_avatar/puppet.py` — `Puppet`: SnekStudio process lifecycle (start/stop/restart/alive).
  - `src/kdx_avatar/status_io.py` — atomic JSON status read/write.
  - `src/kdx_avatar/paths.py` — runtime paths, env defaults, device policy constants.

- **Adapters:**
  - v4l2 export via ffmpeg → `/dev/video11` (configurable via `KDX_AVATAR_DEVICE`).
  - SnekStudio child process (external Godot binary).
  - Signal-based IPC: SIGUSR1 (restart puppet), SIGUSR2 (force blank), SIGTERM (stop).
  - Control file: `want_avatar` flag in runtime dir for `set-mode avatar`.

- **Constellation pair (conceptual, not separate code trees in v0):**
  - `interfaces/` — README points to CLI in `src/kdx_avatar/cli.py`.
  - `services/` — README points to daemon in `src/kdx_avatar/daemon.py`.

- **Docs vaults:**
  - `docs/constitution/` — PRD, REQUIREMENTS, INFRASTRUCTURE, HARNESS, CONVENTION, LOCALISATION (binding, stable).
  - `docs/` — ARCHITECTURE, API, INSTALL, SNEKSTUDIO, USE-CASES, USER-STORIES, TDD, GLOSSARY, etc. (iterating).
  - `docs/adrs/` — ADR-00 through ADR-06 (discipline, constitution, harness, guardians, issue-delivery, SnekStudio collaboration, failover).
  - `docs/assertions/` — assertion-00-discipline (no product assertions yet; healthy state).
  - `docs/agents/` — kwf-* RPG-themed agent cast + guardian agents.
  - `docs/skills/` — triage-and-fix, assertion-review skills with hooks and references.
  - No `.docs/` directory present in the repository.

- **Agent scaffolding:**
  - `.claude/agents/` — mirror of `docs/agents/` kwf-* cast and guardian agents with soul files under `souls/`.
  - `.mcp.json` — markdown-vault-mcp server config pointing at `docs/`.
  - `docs/hooks/` — pre-commit and guardian-dispatch hook scripts.

- **State / assets (gitignored at runtime):**
  - `state/` — local runtime state (gitignored except `.gitkeep`).
  - `models/` — VRM model assets (gitignored; large/local).
  - `.mvmcp/` — markdown-vault-mcp local index (gitignored).

- **Tests:**
  - `tests/test_status_io.py` — unit test for status JSON round-trip without hardware.

## 6. Configuration & contracts (no secrets)

### Environment variables

| Variable | Purpose |
|----------|---------|
| `KDX_AVATAR_DEVICE` | Export v4l2 device path (default `/dev/video11`) |
| `KDX_AVATAR_SNEKSTUDIO` | Path to SnekStudio binary (default `~/.local/bin/snekstudio`) |
| `KDX_AVATAR_WIDTH` | Blank frame width (default `1280`) |
| `KDX_AVATAR_HEIGHT` | Blank frame height (default `720`) |
| `KDX_AVATAR_FPS` | Blank frame rate (default `30`) |
| `KDX_AVATAR_STATE` | Override persistent state directory |
| `XDG_RUNTIME_DIR` | Runtime dir for PID, status JSON, control flags |
| `XDG_STATE_HOME` | Log file location (`daemon.log`) |
| `DISPLAY` / `WAYLAND_DISPLAY` | Required for SnekStudio GUI child |

No secrets, API keys, or credentials are required for the local camera→avatar path. VRM model files are assets, not credentials.

### Runtime files

| Path (under XDG_RUNTIME_DIR/kdx-avatar/) | Purpose |
|------------------------------------------|---------|
| `daemon.pid` | Daemon process ID |
| `status.json` | Atomic status snapshot (mode, PIDs, errors) |
| `want_avatar` | Control flag to clear force_blank |

| Path (under XDG_STATE_HOME/kdx-avatar/) | Purpose |
|-----------------------------------------|---------|
| `daemon.log` | Daemon log output |

### Status schema (v0, JSON)

Fields published by daemon include: `version`, `mode`, `export_device`, `export_kind`, `force_blank`, `blank_pid`, `blank_alive`, `puppet_pid`, `puppet_alive`, `auto_restart_puppet`, `last_error`, `started_at`, `updated_at`, `pid`.

### 6.1 HTTP / API endpoints (when applicable)

No stable machine HTTP or unix-socket API is published in v0. Control is **CLI-only** per `docs/API.md`. When a socket or local HTTP API lands, `docs/API.md` will document status schema, lifecycle operations, and health probes.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No HTTP surface in v0 | N/A |

### 6.2 Other interfaces

**CLI commands (`kdx-avatar`):**

| Command | Purpose |
|---------|---------|
| `start` | Detach daemon (blank export + SnekStudio); flags: `--foreground`, `--no-puppet`, `--allow-missing-device`, `--json` |
| `stop` | SIGTERM daemon; wait for clean exit; clear status |
| `status` | Read status JSON or formatted text; `--json` for machine output |
| `restart-puppet` | SIGUSR1 to daemon; bounce SnekStudio only |
| `restart` | Full stop + start cycle |
| `set-mode blank\|avatar` | Force blank (SIGUSR2) or clear force via control file |

**Signal interface (daemon):**

| Signal | Action |
|--------|--------|
| SIGTERM / SIGINT | Graceful stop |
| SIGUSR1 | Restart puppet |
| SIGUSR2 | Force blank mode |

**MCP tools:**

- `markdown-vault-harness` — serves `docs/` vault for agent RAG (configured in `.mcp.json`).

**Harness agent cast:**

- `kwf-*` agents (mage, warrior, thief, bard, etc.) for issue→PR delivery via `triage-and-fix` skill.
- `guardian-prd` and `guardian-adr` — read-only doctrine guardians dispatched on constitution/ADR changes.

## 7. Data & persistence

- **No database.** The product is a local process supervisor with file-based state.
- **Status JSON** — ephemeral runtime state at `$XDG_RUNTIME_DIR/kdx-avatar/status.json` (atomic write via temp+rename).
- **PID file** — `$XDG_RUNTIME_DIR/kdx-avatar/daemon.pid`.
- **Logs** — `$XDG_STATE_HOME/kdx-avatar/daemon.log`.
- **Repo `state/`** — reserved for future local state; gitignored at runtime.
- **VRM models** — stored under `models/` (gitignored) or SnekStudio sample models path; not versioned in repo.
- **Topology:** entirely local on the operator host (debian-sid reference). No cloud persistence, no edge workers, no vector stores. PipeWire handles camera graph; v4l2loopback provides virtual camera export.

## 8. Docs & agent memory (required scan)

### Sources read and folded in

1. **`README.md`** — product pitch, v0.1 runnable status, CLI quick reference, harness pointer, constellation pair explanation.
2. **`docs/constitution/PRD.md`** — product objective: service-shaped adapter, two-layer failover, SnekStudio collaboration, audience (operator, consumers, upstream OSS).
3. **`docs/constitution/REQUIREMENTS.md`** — FR-01 through FR-08 (capture, SnekStudio drive, export, blank failover, service failover, idempotent stop, device policy, CLI control); NFR-01 through NFR-06 (local-first, least privilege, VRAM-aware, observable, recoverable, OSS posture).
4. **`docs/constitution/INFRASTRUCTURE.md`** — reference host hardware (Brio, RTX GPU, PipeWire, v4l2loopback), device policy (video10=kdx-share, video11=kdx-avatar), SnekStudio install path.
5. **`docs/constitution/HARNESS.md`** — harness-default template: constitution tiers, ADR families, assertion discipline, vault via markdown-vault-mcp.
6. **`docs/ARCHITECTURE.md`** — constellation model, pipeline diagram, two-layer failover, component table, trust boundaries, host integration with kdx-share sibling.
7. **`docs/SNEKSTUDIO.md`** — collaboration stance (integrate, not fork), integration modes, ownership split.
8. **`docs/INTERFACES.md`** — CLI contract table, later surfaces (HTTP/tray), non-goals.
9. **`docs/SERVICES.md`** — orchestrator responsibilities, FSM sketch, packaging notes.
10. **`docs/API.md`** — explicitly TBD; CLI is v0 control surface.
11. **`docs/INSTALL.md`** — SnekStudio 0.1.6 install, dual loopback config, ffmpeg smoke test, CLI install via uv.
12. **`docs/USE-CASES.md`** — UC-02 through UC-06 Gherkin scenarios.
13. **`docs/adrs/adr-05-snekstudio-collaboration.md`** — binding puppet choice.
14. **`docs/adrs/adr-06-failover.md`** — two-layer failover assertions and forbidden behaviors.
15. **`docs/agents/guardian-prd.md`** — PRD guardian agent contract.
16. **`docs/skills/triage-and-fix/SKILL.md`** — issue→PR delivery party skill with kwf-* cast.
17. **`.claude/agents/`** — 40 agent definition files mirroring docs/agents kwf-* cast and guardians with soul personality files.
18. **`.mcp.json`** — markdown-vault-mcp configuration for docs vault serving.
19. **Source code** — `src/kdx_avatar/*.py` (cli, daemon, blank, puppet, paths, status_io).
20. **`pyproject.toml`** — Python 3.12+, zero runtime deps, pytest dev, uv build.
21. **`.gitignore`** — confirms gitignored paths: `.env*`, `state/*`, `models/**`, `.mvmcp/`, `*.vrm`, build artifacts.

### Not present

- **`.docs/`** — directory does not exist in this repository.
- **`.github/`** — no CI workflows found in the shallow clone.
- **Product assertions** — only `assertion-00-discipline` exists; no product-specific assertions yet (healthy per harness discipline).

## 9. Security & privacy notes (summary-time)

- **Visibility:** public repository; no clone URLs needed in related fields.
- **Auth model:** none for local operation; no network API in v0. Device access via Linux `video` group membership.
- **Secrets:** none required. `.env` and `.env.*` are gitignored and must never be committed or summarized. No credentials, tokens, or PEM files in the tracked tree.
- **Privacy:** `set-mode blank` provides operator-controlled privacy by forcing black frames without stopping the service.
- **Process isolation:** SnekStudio runs as a separate child process (not in-process embedding), enabling clean kill/restart without compromising the adapter.
- **Device policy:** adapter must not claim the sibling kdx-share loopback device, preventing cross-product interference.

## 10. Operational picture

### Local development

```bash
uv sync
uv run kdx-avatar start          # background daemon
uv run kdx-avatar start -f       # foreground with stderr logging
uv run kdx-avatar start --no-puppet  # blank export only
uv run kdx-avatar status
uv run kdx-avatar stop
uv run kdx-avatar restart-puppet
uv run kdx-avatar set-mode blank
uv tool install --editable .     # install CLI to ~/.local/bin
```

### Host prerequisites (reference machine)

- SnekStudio 0.1.6 installed under `~/.local/opt/snekstudio/current`.
- Dual v4l2loopback devices (`video10` for kdx-share, `video11` for kdx-avatar) via kernel module config.
- ffmpeg, v4l2-ctl, OBS (optional) on PATH.
- Operator in `video` group.
- Wayland/X11 session for SnekStudio GUI.

### Deployment

- No cloud deployment; runs on operator host only.
- Future: user systemd unit (mentioned in docs but not present in repo tree).
- Package manager: uv for install/sync; `uv_build` for packaging.
- No GitHub Actions CI found in the shallow clone.

### Hardware constraints

- Reference GPU: RTX-class ~8 GiB VRAM; coexists with Godot/SnekStudio but conflicts possible with heavy local LLMs (documented in NFR-03).
- Webcam: Logitech Brio 100 on reference host.

## 11. Open questions / unknowns

- **Avatar pixels into vcam:** v0 is `blank_hold` export + SnekStudio window; routing actual avatar render pixels into the virtual camera (OBS window capture or portal grab) is explicitly the next slice and not yet implemented.
- **HTTP/unix-socket API:** documented as future in `docs/API.md`; no implementation in current code.
- **User systemd unit:** mentioned in infrastructure docs but no unit file in the repository.
- **CI/CD:** no `.github/workflows` found; deployment automation unknown.
- **Custom AD&D VRM model:** operator-provided; not shipped with repo.
- **Auto avatar mode recovery:** `set-mode avatar` uses a control file flag; full pixel-path avatar mode depends on SnekStudio health and future capture integration.
- **Test coverage:** only `test_status_io.py` exists; failover scenarios (UC-03–UC-06) are documented in Gherkin but not yet backed by integration tests in the tree.
- **`.docs/` hidden vault:** not present; all documentation lives under `docs/`.
