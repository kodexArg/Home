---
id: "home-hyprland"
title: "home-hyprland — Hyprland desktop bundle for debian-sid dual-session"
visibility: private
importance: normal
source_repo: "home-hyprland"
org: "kodexArg"
default_branch: "main"
primary_language: "Lua"
repo_kind: "infrastructure"
status: "active"
related: []
tags: ["hyprland", "ags", "wayland", "debian-sid", "nvidia", "dual-gpu", "desktop", "lua", "typescript", "gtk4", "systemd", "kitty", "agent-skill"]
problems_solved:
  - "GNOME remains the daily driver but a second Wayland compositor session (Hyprland via GDM) is needed without forking a one-off rice that drifts from a reproducible source of truth."
  - "Dual-GPU Hyprland on NVIDIA primary + amdgpu portrait scanout is fragile: blanking, sleep, DRM page-flip races, stuck cursors, and layer-shell clients desync after monitor geometry changes."
  - "A tiling-session status bar must replace GNOME shell affordances (idle inhibit, volume routing, local LLM control, capture helpers) using AGS on a single portrait monitor without shell scripts for core UI logic."
technologies:
  - "Hyprland 0.55 (Lua config API)"
  - "AGS 3.1 (Aylur's GTK Shell / Astal GTK4)"
  - "TypeScript + JSX (AGS widgets)"
  - "Bash helpers (grim, slurp, wf-recorder, hyprctl)"
  - "Python 3 (kdx-share transmit picker)"
  - "systemd user units (ags-hyprland, hypridle, local-llm integration)"
  - "WirePlumber / PipeWire (AstalWp volume routing)"
  - "Kitty terminal"
  - "hyprpaper, hypridle, hyprlauncher, anyrun"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# home-hyprland

> **Problem thesis (required):** This private repository is the version-controlled source of truth for a **Hyprland 0.55** desktop experiment on **debian-sid**, running alongside GNOME as a GDM-selectable dual session. It solves the gap between “I want a custom tiling Wayland session” and “I need it to survive real hardware”: dual NVIDIA + amdgpu outputs, portrait + landscape layout, supervised AGS bar widgets, capture/recording helpers, monitor-heal after sleep, and an agent skill so AI assistants edit live config safely. GNOME stays the daily driver; this bundle is the reproducible, syncable artifact for the Hyprland path only.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/home-hyprland` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | Hyprland config for debian-sid (GNOME dual-session experiment) — Lua compositor config, AGS 3.1 bar, helper scripts, wallpapers, Kitty profile, and agent skill snapshot. |
| Audience | Primary operator (kodex) on the target workstation; AI agents via `skill/kdx-hypr-control/`; anyone syncing Hyprland session files to `~/.config/hypr`, `~/.config/ags`, and `~/.local/bin`. |

## 2. Problems it solves

### P1 — Reproducible Hyprland session without abandoning GNOME

- **Who hurts:** A single-user workstation that wants Hyprland for experimentation (tiling, custom bar, GPU-heavy local LLM UI) but relies on GNOME for the primary daily workflow.
- **Pain today:** Dotfiles scattered across `~/.config`, ad-hoc copies, no git history, and risk of forcing `XDG_CURRENT_DESKTOP` globally or breaking GDM session selection.
- **How this repo answers:** Bundles `hypr/`, `ags/`, `bin/`, `kitty/`, `wallpapers/`, and `skill/kdx-hypr-control/` with documented sync commands (`cp`, `rsync`, optional symlink). Hyprland starts only when chosen at GDM; autostart chain is explicit in `hypr/hyprland.lua` (`hyprpaper`, `hypridle`, `ags-hyprland.service`, Kitty, anyrun daemon). Agent skill encodes stance: never force desktop env globally, prefer Lua over legacy hyprlang, reload vs full restart rules.
- **Out of scope:** Replacing GNOME, removing GNOME packages, installing unaudited third-party rices, or making Hyprland the only session.

### P2 — Dual-GPU + dual-monitor Hyprland stability

- **Who hurts:** Operators on NVIDIA (card0) + amdgpu (card1) with landscape primary on one GPU and portrait on another — a layout prone to EGL import failures, phantom cursors, blanked panels after idle, and broken CRTC after DPMS.
- **Pain today:** Default Hyprland/NVIDIA env vars insufficient; automatic DPMS blanks both panels; batching two `hl.monitor()` calls races DRM page-flip; layer-shell clients (hyprpaper, AGS bar) keep stale geometry after scale changes; AGS dies after monitor storms unless supervised.
- **How this repo answers:** `hypr/hyprland.lua` sets `AQ_DRM_DEVICES`, `AQ_FORCE_LINEAR_BLIT`, NVIDIA VA-GLX env, cursor policy (hardware cursors + CPU buffer, default monitor on portrait). `hypr/hypridle.conf` disables automatic DPMS listeners; wake runs `hypr-monitor-heal after-sleep`. `bin/hypr-monitor-heal` implements hard rules (never DPMS portrait, sequential modesets, soft-hotplug). `bin/hypr-zoom-toggle` toggles portrait scale 1.0 ↔ 1.5 with settle delay and layer resync. `systemd/user/ags-hyprland.service` restarts AGS with `GSK_RENDERER=gl`. Super+Shift+O binds manual heal.
- **Out of scope:** General NVIDIA driver support for all distros; single-GPU simplified layouts; automatic DPMS on portrait without ADR-level review.

### P3 — Desktop affordances on an AGS bar (no GNOME session)

- **Who hurts:** Hyprland session users who lose GNOME’s idle inhibit, volume UI, and quick access to host services (local LLM API) when the bar is custom.
- **Pain today:** `Gtk.Application.inhibit` is a no-op without gnome-session; stock GTK scales break on layer-shell + GSK GL; audio topology on this host maps HDMI to headphones and motherboard jack to speakers — not discoverable from generic widgets.
- **How this repo answers:** AGS bar on portrait `HDMI-A-2` only (`ags/app.ts`, `ags/widget/Bar.tsx`). **Caffeine** (`ags/widget/caffeine.ts`): FSM driving `systemd-inhibit` for idle/sleep block. **Local LLM** (`ags/widget/LocalLlm.tsx`): scans host GGUF dir, writes selection file, manages `local-llm.service`, readiness via OpenAI-compatible `/v1/models` probe, VRAM header via `nvidia-smi`, 90s load timeout for 8 GB GPU. **Volume**: custom gesture track (not `Gtk.Scale`) + WirePlumber endpoint classification for speakers/mute/headphones cycle. **Bar mode**: always → temp → hidden with edge peek and Super+B / `ags request` IPC. Helper scripts cover screenshots (`grim`+`slurp`), recording (`wf-recorder`), reveal-all windows, screen share (`kdx-share`).
- **Out of scope:** Packaging local-llm itself (lives under host `~/Services/local-llm/`); voice stack (dictation/live binds commented paused in `hyprland.lua`); capture toggle panel in bar (commented since 2026-07-17 — Print keybinds handle capture).

## 3. Product / idea

The repository is a **desktop configuration bundle**, not an application server. Mental model: clone or sync → copy zones to live XDG paths → start Hyprland from GDM → compositor loads Lua config → autostart chain brings wallpaper, idle daemon, supervised AGS, terminal, launcher daemon → bar exposes host-integrated controls → shell scripts extend OS-level actions (capture, record, heal, zoom, share).

Architecture narrative:

```
GDM session pick (GNOME | Hyprland)
        │
        ▼
hyprland.lua ──► monitors, input, binds, window rules, NVIDIA env
        │
        ├── hyprpaper (wallpaper AVIF, cover)
        ├── hypridle (suspend hook → hypr-monitor-heal; no DPMS auto-blank)
        ├── ags-hyprland.service → AGS 3.1 bar (portrait HDMI-A-2 only)
        ├── kitty (default terminal)
        └── anyrun daemon (GSK_RENDERER=gl)

AGS app.ts
        ├── requestHandler IPC (bar-cycle, caffeine, bar-peek, …)
        └── Bar.tsx → Volume | LocalLlm | Clock/Caffeine | (parked capture)

bin/hypr-* + kdx-share → grim/slurp/wf-recorder/hyprctl/systemd/user integration
```

Hyprland uses **dwindle** layout, **SUPER** mod, orange kdx border theme, gaps 5, blur/shadow decorations, custom animation curves, special workspace `magic`, and extensive media key binds via `wpctl` / `brightnessctl` / `playerctl`.

### 3.1 North-star use cases

1. **Operator selects Hyprland at login** — dual-monitor layout loads (portrait left, landscape right), wallpaper appears, bar spawns on portrait, Kitty opens, daily tiling workflow with Super+T/X/E/R/Space binds.
2. **Operator toggles bar density or visibility** — Super+B cycles bar modes; Super+Ctrl+Z toggles portrait scale with wallpaper/AGS resync; caffeine and volume from bar without suspending during long tasks.
3. **Agent edits config safely** — sync `skill/kdx-hypr-control/` to agent skills dir, read live `hyprland.lua` + AGS widgets, apply minimal change, `hyprctl reload` or `ags quit` + restart per skill rules, register ADRs on host vault for standing decisions.

### 3.2 Non-goals

- Not a general-purpose Hyprland rice for arbitrary hardware (paths, monitor names, and audio topology are host-specific).
- Not the SSOT for GNOME settings or global shell profile.
- Not committing AGS `node_modules/` or `@girs/` (regenerated on host per `ags/.gitignore`).
- Not providing in-repo HTTP API or backend service — bar talks to host systemd units and local services outside this repo.
- Voice dictation/live stacks explicitly paused in config (binds commented 2026-07-28).

## 4. Technology stack

Derived from manifests, README, and config files. No lockfile dumps.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Lua (Hyprland 0.55 config), TypeScript/JSX (AGS), Bash, Python 3 | `hypr/hyprland.lua`, `ags/tsconfig.json`, `bin/*`, `bin/kdx-share` |
| Compositor | Hyprland 0.55.4, Lua API (`hl.*`) | `hypr/hyprland.lua`, `skill/.../references/this-machine.md` |
| Status bar | AGS 3.1.0, Astal GTK4, gnim, SCSS | `ags/package.json`, `ags/app.ts`, `ags/style.scss` |
| Terminal | Kitty (CaskaydiaCove Nerd Font, custom tab bar Python) | `kitty/kitty.conf`, `kitty/tab_bar.py`, `kitty/grok.conf` |
| Wallpaper | hyprpaper | `hypr/hyprpaper.conf` |
| Idle / power | hypridle (minimal — no DPMS rules) | `hypr/hypridle.conf` |
| Audio | PipeWire / WirePlumber via AstalWp | `ags/widget/Bar.tsx` |
| GPU | NVIDIA + amdgpu dual-GPU env tuning | `hypr/hyprland.lua` |
| Process supervision | systemd user unit for AGS | `systemd/user/ags-hyprland.service` |
| Capture / record | grim, slurp, wf-recorder, wl-mirror (kdx-share) | `bin/hypr-screenshot`, `bin/hypr-record`, `bin/kdx-share` |
| Launchers | hyprlauncher, anyrun | `hypr/hyprland.lua` |
| AI / agents | kdx-hypr-control skill + references | `skill/kdx-hypr-control/SKILL.md` |
| Tests | None in repo | tree scan |

### 4.1 Notable dependencies (curated)

- `ags` — Aylur's GTK Shell runtime; bar entrypoint and IPC (`ags/package.json`).
- `gnim` — companion lib for AGS widget patterns (`ags/package.json`).
- `gi://AstalWp` — WirePlumber audio endpoints for volume/output switching (`ags/widget/Bar.tsx`).
- `gi://GLib`, `gi://Gio` — subprocess, timers, file IO for caffeine FSM and LLM service control.
- External host binaries (not vendored): `hyprland`, `hyprctl`, `hyprpaper`, `grim`, `slurp`, `wf-recorder`, `wpctl`, `nvidia-smi`, `systemd-inhibit`, `ags` @ `/usr/local/bin/ags`.

## 5. Repository map (abstraction)

Zones by purpose:

- **`hypr/`** — Compositor core: `hyprland.lua` (monitors, env, decorations, animations, binds, autostart, window rules), `hyprpaper.conf` (wallpaper path), `hypridle.conf` (suspend hook only). Live target: `~/.config/hypr/`.
- **`ags/`** — Status bar application: `app.ts` (spawn bar on `HDMI-A-2`, IPC request handler), `widget/Bar.tsx` (volume, clock, caffeine, indicators), `widget/LocalLlm.tsx` (GGUF menu + service FSM), `widget/caffeine.ts` (idle inhibit FSM), `widget/bar-mode.ts` (visibility modes + edge poll), `style.scss`, `icons/*.svg`, `tsconfig.json`. Live target: `~/.config/ags/`. Generated: `node_modules/`, `@girs/` (gitignored).
- **`bin/`** — Host helper executables installed to `~/.local/bin/`: `hypr-screenshot`, `hypr-record`, `hypr-reveal-all`, `hypr-monitor-heal`, `hypr-zoom-toggle`, `kdx-share` (Python transmit picker for OBS/virtual cam).
- **`kitty/`** — Terminal config and Grok CLI profile (`grok.conf`), custom `tab_bar.py`. Live target: `~/.config/kitty/`.
- **`wallpapers/`** — Static media referenced by hyprpaper (AVIF + PNG assets).
- **`systemd/user/`** — `ags-hyprland.service` supervised bar unit (Hyprland-gated, `GSK_RENDERER=gl`, restart on failure).
- **`skill/kdx-hypr-control/`** — Agent instruction tree (SKILL.md + `references/` for keybinds, host commands, AGS docs, Hyprland Lua API notes, machine snapshot). Live target: `~/.claude/skills/kdx-hypr-control/` (also noted for other agent dirs on host).
- **No `.claude/` or `.docs/` at repo root** — agent scaffolding lives under `skill/`; extended ADRs and narrative docs referenced as external host vault paths in README and skill (not in this git tree).

## 6. Configuration & contracts (no secrets)

### Hyprland environment (names + purpose)

| Variable / setting | Purpose |
|--------------------|---------|
| `AQ_DRM_DEVICES` | Primary NVIDIA + secondary amdgpu render/scanout order |
| `AQ_FORCE_LINEAR_BLIT` | Fix dmabuf import on secondary portrait CRTC |
| `LIBVA_DRIVER_NAME`, `__GLX_VENDOR_LIBRARY_NAME`, `NVD_BACKEND` | NVIDIA media/GL path |
| `GSK_RENDERER=gl` | Required for AGS/anyrun on this NVIDIA stack |
| `XCURSOR_SIZE`, `HYPRCURSOR_SIZE` | Cursor sizing |
| Cursor `no_hardware_cursors`, `use_cpu_buffer`, `default_monitor` | Dual-GPU cursor plane policy |

### AGS IPC (`ags request …`)

Commands handled in `ags/app.ts`: `bar-cycle`, `bar-peek`, `bar-mode`, `bar-set <always|temp|hidden>`, `caffeine` / `caffeine-status` / `caffeine-on` / `caffeine-off`, `capture-toggle` (panel parked; no-op success). Bound from Hyprland: Super+B → bar-cycle; Super_L/R → bar-peek (non-consuming).

### Host paths referenced by widgets (not in repo)

| Path | Purpose |
|------|---------|
| `~/Services/local-llm/models/gguf` | GGUF scan for LocalLlm menu |
| `~/.config/local-llm/selected-model` | Persisted model choice |
| `local-llm.service` (user systemd) | LLM inference unit controlled by bar |
| `~/Pictures/Screenshots/`, `~/Videos/Screencasts/` | Capture output dirs |
| `~/home-hyprland/` | Git checkout location on host (sync source) |

### kdx-share environment (shapes only)

`KDX_SHARE_V4L2`, `KDX_SHARE_FPS`, `KDX_SHARE_FPS_BOTH`, `KDX_SHARE_BOTH_SCALE` — virtual camera and frame rate tuning (`bin/kdx-share` header).

### hypr-screenshot / hypr-record agent modes

`HYPR_SHOT_AGENT=1` or `--agent` — foreground capture, print absolute PNG path on stdout for agents. `HYPR_REC_AGENT=1` — same pattern for recording scripts.

### 6.1 HTTP / API endpoints (when applicable)

This repository **does not expose HTTP servers**. The AGS LocalLlm widget integrates with a **host-local** OpenAI-compatible inference API (documented in README and `LocalLlm.tsx`):

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| `GET` | `/v1/models` on loopback port 28000 | Readiness probe for loaded GGUF model | none (local only) |

That API is served by `local-llm.service` on the workstation, not defined in this repo. No other HTTP surface in tree.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| Hyprland keybinds | Extensive Super+* map in `hypr/hyprland.lua`; tabulated in `skill/kdx-hypr-control/references/keybinds.md` |
| `hyprctl` | Reload config, dispatch, monitors JSON, layers, hyprpaper wallpaper updates |
| `ags request` | Bar and caffeine IPC (see §6) |
| CLI: `hypr-screenshot` | `window`, `region`, `full`, `monitor`, `panel`, `inventory` |
| CLI: `hypr-record` | `window`, `region`, `toggle`, `stop`, `status`, audio options |
| CLI: `hypr-monitor-heal` | `manual`, `after-sleep`, `idle-resume` |
| CLI: `hypr-zoom-toggle` | Toggle portrait scale 1.0 ↔ 1.5 |
| CLI: `kdx-share` | `vertical`, `horizontal`, `both`, `stop`, `status`, `inventory`, `menu` |
| systemd user | `ags-hyprland.service`, `hypridle.service`, host `local-llm.service` |
| Agent skill | `/kdx-hypr-control` — workflow and reload cheatsheet in `skill/kdx-hypr-control/SKILL.md` |

## 7. Data & persistence

- **In-repo persistence:** Static config files, SVG icons, wallpaper binaries, skill markdown. No database, no migrations.
- **Runtime state on host (not committed):** `XDG_RUNTIME_DIR` logs and PID files for screenshot/record/heal/zoom scripts; AGS caffeine inhibitor PIDs; `hypr-zoom.phase` state file; `~/.config/local-llm/selected-model` for LLM choice.
- **Capture outputs:** PNG screenshots and MP4 screencasts written to XDG Pictures/Videos paths by helper scripts.
- **Topology:** Fully local workstation — edge/cloud N/A. Bar polls `nvidia-smi` and loopback HTTP for LLM readiness; no remote sync in repo.

## 8. Docs & agent memory (required scan)

Sources read and folded in:

1. **`README.md`** — Primary human doc: bar features (caffeine, LLM, volume, bar modes), layout table, install/sync commands, AGS notes, host monitor summary, external vault pointers.
2. **`skill/kdx-hypr-control/SKILL.md`** — Agent stance, paths, workflow, quick facts, reload cheatsheet, out-of-scope rules.
3. **`skill/kdx-hypr-control/references/this-machine.md`** — Versions, monitor geometry, zoom FSM, autostart, idle policy, drift warning vs live `~/.config/ags/`.
4. **`skill/kdx-hypr-control/references/keybinds.md`** — Full bind table aligned to `hyprland.lua`.
5. **`skill/kdx-hypr-control/references/host-commands.md`** — Referenced by skill (caffeine, LLM, kdx-share command families; not fully ingested line-by-line).
6. **`skill/kdx-hypr-control/references/ags.md`**, **`references/hyprland-docs.md`** — Upstream and bar-specific reference stubs for agents.
7. **`hypr/hyprland.lua`**, **`hypr/hypridle.conf`**, **`hypr/hyprpaper.conf`** — Live config semantics.
8. **`ags/app.ts`**, **`ags/widget/*.tsx`**, **`ags/widget/caffeine.ts`**, **`ags/widget/bar-mode.ts`** — Bar behavior and FSMs.
9. **`systemd/user/ags-hyprland.service`** — Supervision contract.
10. **`bin/*` headers** — CLI usage and keybind mapping for helpers.
11. **`kitty/kitty.conf`** — Terminal defaults.
12. **`.claude/`** — **not present** in repository.
13. **`.docs/`** — **not present** in repository.
14. **External host vault (referenced, not in repo):** `~/Documents/System/Desktop.md`, ADRs under `~/Documents/System/ADRs/` (hyprland, ags, audio, zoom, monitor-heal, kdx-share series).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Private repository — describes a personal workstation layout; summary avoids clone URLs as product links; `related: []` per private-repo rule.
- **Auth model:** None at repo level. Hyprland session is local graphical login. LLM API probe is loopback-only on the host.
- **Secrets:** No `.env`, credentials, or keys in tree. Config references absolute home paths (`/home/kodex/...`) which are host-specific but not cryptographic secrets. This summary contains no tokens, passwords, or PEM material.
- **gitignore respected:** `ags/node_modules/`, `ags/@girs/` not read. Logs and local noise patterns ignored per root `.gitignore`.
- **Agent skill warns:** Do not install unaudited third-party rices; do not force `XDG_CURRENT_DESKTOP` globally.

## 10. Operational picture

### Local sync (from README)

```bash
cp -a hypr/* ~/.config/hypr/
hyprctl reload                    # if already in Hyprland session

mkdir -p ~/.config/ags
rsync -a --exclude node_modules --exclude @girs ags/ ~/.config/ags/
ags quit
env PATH=$HOME/.local/bin:/usr/local/bin:/usr/bin GSK_RENDERER=gl \
  /usr/local/bin/ags run ~/.config/ags

install -m 755 bin/hypr-* ~/.local/bin/
cp -a kitty/* ~/.config/kitty/
rsync -a skill/kdx-hypr-control/ ~/.claude/skills/kdx-hypr-control/
```

Optional: symlink `~/home-hyprland/hypr` → `~/.config/hypr` for edit-in-place workflow.

### Runtime reload rules

- **Hyprland config:** `hyprctl reload` for most `hyprland.lua` edits; full session restart needed for permission/monitor structural changes.
- **AGS:** No hot reload — `ags quit` then restart, or restart `ags-hyprland.service`. Zoom toggle and monitor-heal scripts restart AGS after geometry changes.
- **CI / deploy:** None in repo — manual sync on target debian-sid workstation. Deployment target is the operator machine, not Cloudflare or cloud infra.

### Hardware constraints

- Dual HDMI: AOC landscape (NVIDIA) + ASUS portrait (amdgpu), transforms and scales documented in README and skill references.
- RTX 2060 SUPER 8 GB VRAM — LocalLlm widget enforces one model at a time, 90s load kill, hybrid MoE flagged.
- NVIDIA requires `GSK_RENDERER=gl` for GTK4 layer-shell clients.

### Autostart sequence (Hyprland session)

`hyprpaper` → `hypridle.service` → import-environment + `ags-hyprland.service` → Kitty → `anyrun daemon` (from `hyprland.lua` `hyprland.start` handler).

## 11. Open questions / unknowns

- **Live vs repo drift:** Skill reference `this-machine.md` notes pending drift — live `~/.config/ags/widget/` may ahead of repo (e.g. `DictationIndicator.tsx`, `LiveIndicator.tsx` mentioned as missing from repo snapshot). Repo may not be SSOT for latest bar until re-synced.
- **Voice stack:** Super+D / Super+L voice binds commented paused 2026-07-28; future state unknown from tree alone.
- **Capture bar panel:** `CaptureToggle` commented in bar since 2026-07-17; `ags request capture-toggle` remains IPC stub.
- **Exact AGS build provenance:** Binary at `/usr/local/bin/ags` 3.1.0 referenced in docs; build recipe not in this repo.
- **kdx-share / OBS integration:** Large Python script in `bin/`; full Fase 1/2 behavior summarized from header only — edge cases not exhaustively verified in this pass.
- **CI/CD:** No GitHub Actions or wrangler in tree — operational deploy is manual copy/rsync on host.
