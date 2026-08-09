---
id: "klaude-cursors"
title: "Klaude Cursors — Bibata-based rounded cursor theme with Claude coral accent"
visibility: public
importance: normal
source_repo: "klaude-cursors"
org: "kodexArg"
default_branch: "main"
primary_language: "Python"
repo_kind: "other"
status: "active"
related: ["kdx-cursor-forced-theme"]
tags: ["cursor-theme", "xcursor", "bibata", "linux-desktop", "gnome", "wayland", "kde", "hyprland", "python", "pillow", "clickgen", "desktop-personalization", "claude-aesthetic"]
problems_solved:
  - "Linux desktop users who want a modern, rounded pointer theme aligned with the warm Claude coral accent (#D97757) have no upstream Bibata variant in that palette—stock Bibata ships Ice/Modern/Amber colorways, not this specific brand tone."
  - "Building a full Xcursor theme from PNG bitmaps requires clickgen/ctgen, hotspot metadata, symlink alias tables, and multi-size raster exports—too heavy for end users who only want to install and switch themes."
  - "Operators running kodexArg's Claude-inspired desktop stack need OS-level pointer chrome that visually harmonizes with coral-accented IDE and shell theming without patching application internals."
technologies:
  - "Xcursor 1.0 (pre-built binary cursor files)"
  - "Freedesktop Icon Theme metadata (index.theme, cursor.theme)"
  - "Bibata cursor design + clickgen x.build.toml build contract"
  - "PNG source bitmaps (bitmaps/Klaude/)"
  - "Python 3 + Pillow (recolor.py maintenance script)"
  - "Bash (install.sh one-shot installer)"
  - "GNOME gsettings / KDE icon paths (desktop integration)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Klaude Cursors

> **Problem thesis (required):** Desktop environments on Linux expose pointer appearance through Xcursor icon themes, but no stock Bibata colorway matches the distinctive Claude coral accent (#D97757). This repository ships a complete, install-ready Klaude cursor theme—145 cursor entries covering defaults, resize handles, drag-and-drop states, animated wait/progress/watch variants, and legacy hash-name symlinks—derived from Bibata's modern rounded shapes with a warm coral recolor. Users copy pre-built artifacts into `~/.local/share/icons/` and activate via desktop settings; maintainers retain PNG sources, Bibata's clickgen config, and a Pillow recolor script to regenerate bitmaps from Bibata Ice masters.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/klaude-cursors` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Modern rounded Xcursor theme based on Bibata, recolored with the Claude coral accent #D97757—pre-built for GNOME, KDE, and other X11/Wayland desktops. |
| Audience | Linux desktop users (GNOME/Wayland, KDE, Hyprland and general Xcursor-capable sessions) who want cohesive coral-toned pointer chrome; kodexArg operators aligning OS cursor appearance with Claude-inspired IDE/shell theming; maintainers extending or rebuilding Bibata-derived cursor variants. |

## 2. Problems it solves

### P1 — Missing coral-accent Bibata color variant

- **Who hurts:** Linux users who prefer Bibata's compact, material-rounded cursor shapes but want the warm Claude coral (#D97757, RGB 217/119/87) instead of Bibata's Ice, Amber, or other official palettes.
- **Pain today:** Upstream Bibata ships multiple colorways and a full clickgen build pipeline, but none targets this specific coral tone. Manually recoloring hundreds of PNG frames (including 54-frame animated wait/watch cursors) is tedious and error-prone; hue shifts can break anti-aliased edges and brightness gradients baked into the Ice master set.
- **How this repo answers:** The `bitmaps/Klaude/` tree holds 164 recolored PNG sources. `recolor.py` implements a deterministic white-pixel replacement algorithm: pixels with all RGB channels ≥ 185 are mapped to coral while preserving per-pixel brightness via averaged scaling, leaving non-whiteish pixels untouched for shadow and outline fidelity. The shipped `cursors/` directory contains finished Xcursor 1.0 binaries so consumers never run the recolor step.
- **Out of scope:** Windows `.cur` / macOS `.car` cursor packs; non-Bibata cursor geometries; dynamic per-app cursor injection (contrast with IDE-level chrome repos like `kdx-cursor-forced-theme`).

### P2 — Cursor theme build complexity vs. install-and-go UX

- **Who hurts:** End users who only want a working pointer theme without installing clickgen, understanding x.build.toml hotspot tables, or managing X11 symlink alias hashes.
- **Pain today:** Bibata's authoritative build uses `ctgen` against `x.build.toml`, specifying per-cursor PNG names, hotspot coordinates, size ladders (16–96 px), animation frame globs (`wait-*.png`, `left_ptr_watch-*.png`), and dozens of legacy `x11_symlinks` entries that map hash-named cursors to canonical roles. Reproducing this from scratch requires toolchain fluency most desktop users lack.
- **How this repo answers:** Pre-compiled `cursors/` artifacts (145 top-level entries, many symlinks) plus `index.theme` / `cursor.theme` metadata are ready to copy. `install.sh` automates placement into `~/.local/share/icons/Klaude/`. README documents manual copy steps and GNOME `gsettings` activation (`cursor-theme` = Klaude, recommended size 28). Rebuild instructions reference `ctgen x.build.toml -p x11 -d bitmaps/Klaude -n Klaude` for maintainers only.
- **Out of scope:** Package-manager distribution (deb/rpm/flatpak); automatic theme switching on login; HiDPI fractional scaling beyond the included size ladder.

### P3 — Visual cohesion for Claude-inspired desktop stacks

- **Who hurts:** kodexArg operators running coral-accented tooling (Agents UI theming, Presentation Orange chrome, Hyprland/AGS shells) whose default Adwaita or vendor cursors clash with the warm palette.
- **Pain today:** Application-level theming (CSS injects, color themes) does not change the OS pointer; users stare at a cool-gray or high-contrast default arrow while the rest of the stack reads warm coral.
- **How this repo answers:** Klaude applies the same #D97757 accent across default pointer, hand, text, resize, DnD, zoom, and animated wait states—everyday desktop affordances pick up the brand tone at the compositor level, complementing sibling repos that style IDE chrome rather than OS cursors.
- **Out of scope:** Cursor application window theming; terminal font/color schemes; wallpaper or GTK theme packs.

## 3. Product / idea

The central idea is a **derivative Bibata color fork packaged as a Freedesktop icon theme**. Intellectual property for shapes, hotspot layout, symlink alias graph, and build metadata traces to Abdulkaiz Khatri's Bibata project; kodexArg's contribution is the coral recolor, rebuilt Xcursor binaries, installer, and maintenance script.

The mental model has three layers:

1. **Source bitmaps** (`bitmaps/Klaude/`) — PNG masters per cursor role, including multi-frame animations for `wait` (54 frames) and `left_ptr_watch` (54 frames).
2. **Build contract** (`configs/normal/x.build.toml`) — Bibata's clickgen configuration defining cursor names, PNG mappings, hotspot overrides, supported X11 sizes, and extensive `x11_symlinks` for legacy compatibility (e.g., `default` → `left_ptr`, hash-named GTK/Qt aliases).
3. **Shipped theme** (`cursors/`, `index.theme`, `cursor.theme`) — installable Klaude theme directory consumable by any Xcursor-aware desktop.

`index.theme` declares `Name=Klaude`, describes the Bibata lineage and coral accent in the comment field, and sets `Inherits=hicolor` per Freedesktop icon theme conventions. `cursor.theme` is a minimal companion declaring `Inherits=Klaude` for cursor-specific theme resolution paths.

Cursor entries are Xcursor 1.0 binaries (verified on `left_ptr`, `wait`). Many names are symbolic links to canonical cursors—`default` symlinks to `left_ptr`; resize corners map to `nw-resize`, `se-resize`, etc.; DnD states alias `grabbing`, `dnd-move`, and hash identifiers. This symlink graph is inherited wholesale from Bibata's compatibility strategy so GTK, Qt, Electron, and legacy X apps resolve familiar cursor names.

### 3.1 North-star use cases

1. **Quick install (GNOME):** Clone repo, run `install.sh` or manual `cp` of `cursors/`, `index.theme`, and `cursor.theme` into `~/.local/share/icons/Klaude/`, set `org.gnome.desktop.interface cursor-theme` to Klaude and cursor-size to 28, log out/in on Wayland for full reload.
2. **KDE / other desktops:** Copy the Klaude folder to `~/.local/share/icons/` or `~/.icons/`; select Klaude in system settings cursor theme picker.
3. **Maintainer rebuild:** Adjust coral threshold or target RGB in `recolor.py`, regenerate bitmaps from Bibata Ice masters (author-local paths in script), run `ctgen` against `configs/normal/x.build.toml` with `-d bitmaps/Klaude`, replace `cursors/` output, commit.
4. **Stack cohesion:** Pair with `kdx-cursor-forced-theme` so IDE chrome and OS pointer both express Presentation Orange / Claude coral tones.

### 3.2 Non-goals

- Not a general cursor authoring framework—build config is Bibata-specific; no new cursor shapes.
- Not a cross-platform cursor exporter (Linux Xcursor only in shipped artifacts).
- `recolor.py` embeds author-local absolute paths (`/home/kodex/bibata-build/...`) for one-off regeneration; distributed users rely on committed PNGs and pre-built `cursors/`.
- README references a `preview.png` showcase image that is not present in the shallow-cloned tree (optional asset may be missing or untracked).
- No CI, releases workflow, or package manifests—tag `v1.0.0` exists in git refs only.

## 4. Technology stack

Derived from tree inspection and high-level manifests only. No `package.json`, `pyproject.toml`, or CI configs present.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Python 3 (recolor script); Bash (installer) | `recolor.py`, `install.sh` |
| Cursor format | Xcursor 1.0 binaries | `file` magic on `cursors/left_ptr`, `cursors/wait` |
| Raster sources | PNG bitmaps, 164 files | `bitmaps/Klaude/*.png` |
| Build toolchain | clickgen `ctgen` + TOML cursor manifest (Bibata heritage) | `configs/normal/x.build.toml`, README build section |
| Desktop integration | Freedesktop Icon Theme + XDG icon paths | `index.theme`, `cursor.theme`, README install paths |
| Image processing | Pillow (`PIL.Image`) for batch recolor | `recolor.py` imports |
| Infra / deploy | Manual git clone + shell copy; no CI | absence of `.github/`, `install.sh` only |
| AI / agents | None in repo | no `.claude/`, `.agents/`, or skill trees |
| Tests | None observed | no test configs |

### 4.1 Notable dependencies (curated)

- **Bibata Cursor (upstream)** — shape design, hotspot table, symlink alias graph, and `x.build.toml` schema; Klaude is explicitly credited as a derivative color variant.
- **clickgen / `ctgen`** — compiles PNG directories into multi-size Xcursor outputs per `x.build.toml` platforms and size ladder.
- **Pillow** — sole third-party library used by `recolor.py` for per-pixel RGBA manipulation when regenerating bitmaps from Ice masters.
- **Freedesktop icon theme spec** — `index.theme` / `cursor.theme` INI-style metadata consumed by GNOME, KDE, and other portals.

## 5. Repository map (abstraction)

Zones of the repository:

- **Shipped theme artifacts (`cursors/`, `index.theme`, `cursor.theme`):** The product users install. `cursors/` holds 145 entries—canonical Xcursor files plus symlinks mapping legacy/hash names (e.g., GTK internal IDs) to modern role names like `pointer`, `grab`, `ns-resize`.
- **Source bitmaps (`bitmaps/Klaude/`):** PNG masters for every cursor role, including animated frame sequences (`wait-01.png` … `wait-54.png`, `left_ptr_watch-*.png`). These are inputs to `ctgen`, not consumed directly at runtime after install.
- **Build configuration (`configs/normal/x.build.toml`):** Bibata-origin TOML defining theme metadata, global hotspot defaults (`x_hotspot`/`y_hotspot` = 128), X11 size array `[16, 20, 22, 24, 28, 32, 40, 48, 56, 64, 72, 80, 88, 96]`, per-cursor PNG bindings, optional per-cursor hotspot overrides, and `x11_symlinks` arrays spanning 60+ cursor definitions.
- **Maintenance tooling (`recolor.py`, `install.sh`):** `recolor.py` batch-recolors Bibata Ice PNGs to coral using a brightness-preserving map; hardcoded `SOURCE_DIR` / `TARGET_DIR` point to author build workspace, not repo-relative paths. `install.sh` copies theme artifacts to `~/.local/share/icons/Klaude` and prints GNOME activation hints.
- **Legal (`LICENSE`):** MIT License with 2026 kodex copyright for color variant and 2024 Abdulkaiz Khatri copyright for Bibata original; README states derivative-work attribution.
- **Documentation (`README.md`):** Install instructions, color spec, upstream credits, rebuild one-liner.
- **Agent scaffolding:** Not present—no `.claude/`, `.docs/`, `docs/`, ADRs, or harness files scanned.
- **Generated / vendor:** `cursors/` Xcursor binaries and `bitmaps/` PNGs are generated assets checked into git; `.gitignore` excludes only `.DS_Store`, `*.tar.xz`, `*.zip`.

## 6. Configuration & contracts (no secrets)

No environment variables, API keys, Cloudflare bindings, or credential files exist in this repository. Configuration is limited to:

| Setting | Purpose |
|---------|---------|
| `THEME_NAME` in `install.sh` | Install folder name (`Klaude`) under `~/.local/share/icons/` |
| `CLAUDE_PINK` / `THRESHOLD` in `recolor.py` | Target RGB (217, 119, 87) and white-pixel detection cutoff (≥ 185 per channel) for bitmap regeneration |
| `SOURCE_DIR` / `TARGET_DIR` in `recolor.py` | Author-local Bibata Ice input and coral output paths (not portable; maintenance-only) |
| `index.theme` `[Icon Theme]` | Freedesktop theme name, comment, inherits `hicolor` |
| `cursor.theme` `[Icon Theme]` | Cursor-specific inherit chain pointing at Klaude |
| `x.build.toml` `[cursors.fallback_settings]` | Default hotspots, animation delay (40 ms), X11 size ladder |
| GNOME `gsettings` keys (documented in README) | `org.gnome.desktop.interface cursor-theme` and `cursor-size` (recommended 28) |

No `.env`, secrets, tokens, or cloud account identifiers appear in tracked files.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server, REST API, RPC surface, or network listener**. It is a static desktop asset pack (binary cursors + PNG sources + shell installer). There is no OpenAPI spec, no Workers routes, and no backend process.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| **Shell installer** | `install.sh` — copies `cursors/`, `index.theme`, `cursor.theme` to `~/.local/share/icons/Klaude/` |
| **Manual install** | README documents `cp -a` equivalent and desktop-specific icon search paths |
| **GNOME activation** | `gsettings set org.gnome.desktop.interface cursor-theme 'Klaude'` and `cursor-size 28` |
| **KDE / generic** | Place theme under `~/.local/share/icons/` or `~/.icons/`; select in system settings |
| **Maintainer rebuild CLI** | `ctgen x.build.toml -p x11 -d bitmaps/Klaude -n Klaude -c "Klaude cursors"` (requires clickgen installed) |
| **Recolor CLI** | `python3 recolor.py` — batch processes Ice PNGs when author-local `SOURCE_DIR` exists |

## 7. Data & persistence

No databases, KV stores, object storage, or application state. Persistence is entirely filesystem-based at install time:

- **Install target:** `~/.local/share/icons/Klaude/` (or `~/.icons/` on some desktops) receives copied `cursors/` directory and theme metadata files.
- **Runtime resolution:** Desktop compositor / Xcursor library loads binary cursor files by theme name and cursor role; animated cursors cycle through embedded frames (e.g., 54-frame `wait`).
- **Repo storage:** Git LFS not used; PNG and Xcursor binaries live directly in the repository (~164 bitmaps, 145 cursor entries).

Topology is **offline local desktop only**—no edge, cloud, or sync layer.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — product description, #D97757 color spec, Bibata attribution, GNOME/KDE install steps, `ctgen` rebuild command, MIT license pointer.
2. **`LICENSE`** — MIT terms, dual copyright (kodex 2026 color variant, Abdulkaiz Khatri 2024 Bibata original).
3. **`install.sh`** — automated install path and post-install gsettings hints.
4. **`recolor.py`** — recolor algorithm, threshold, target RGB, author-local source/target directories.
5. **`index.theme`** / **`cursor.theme`** — Freedesktop theme metadata.
6. **`configs/normal/x.build.toml`** — full Bibata build manifest (cursor definitions, hotspots, symlinks, size ladder).
7. **`.gitignore`** — ignores `.DS_Store`, `*.tar.xz`, `*.zip` only.

**Scans with no content found:**

- **`.claude/`** — directory does not exist in repository.
- **`.docs/`** — directory does not exist in repository.
- **`docs/`** — directory does not exist in repository.
- **ADRs / PRDs / constitution / harness** — none found.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; cursor assets contain no user data, telemetry, or network calls.
- **Auth model:** None—static files installed locally.
- **Secrets:** This summary contains no secrets, private keys, connection strings, or `.env` contents. `recolor.py` references a local home-directory build path but no credentials.
- **Supply chain:** Users trust pre-built `cursors/` binaries when installing; maintainers rebuilding from source should verify PNG inputs and clickgen output. No signed packages or checksum manifests in repo.
- **Derivative licensing:** MIT license applies; upstream Bibata IP remains with original authors per README and LICENSE.

## 10. Operational picture

**Local install (end user):**

```bash
./install.sh
# or manual copy per README
gsettings set org.gnome.desktop.interface cursor-theme 'Klaude'
gsettings set org.gnome.desktop.interface cursor-size 28
# log out/in recommended on Wayland
```

**Maintainer rebuild (optional):**

1. Obtain Bibata Ice PNG masters (external to this repo).
2. Run `recolor.py` after adjusting `SOURCE_DIR` / `TARGET_DIR` paths, or edit committed `bitmaps/Klaude/` directly.
3. Run `ctgen` with `configs/normal/x.build.toml` and `-d bitmaps/Klaude`.
4. Replace `cursors/` output and test across target desktops.

**Deployment:** No GitHub Actions, Cloudflare Workers, or container images. Distribution is git clone or copy of theme directory. Git tag `v1.0.0` present; no automated release artifacts observed.

**Hardware constraints:** Standard Linux desktop; no GPU or embedded targets. Cursor size ladder tops out at 96 px for X11 HiDPI scenarios.

## 11. Open questions / unknowns

- **`preview.png`** referenced in README markup is absent from the shallow-cloned `main` tree—may be untracked, removed, or hosted externally; visual preview not verifiable from repo files alone.
- **clickgen version pin** not documented; rebuild reproducibility depends on whichever `ctgen` the maintainer has installed.
- **`recolor.py` path portability** — `SOURCE_DIR` and `TARGET_DIR` are hardcoded to `/home/kodex/bibata-build/...`; unclear whether repo maintainers expect contributors to override these or rely solely on committed `bitmaps/Klaude/`.
- **Primary GitHub language classification** unknown (no `gh` language stats retrieved); tree is predominantly binary PNG/Xcursor with small Python/Bash tooling.
- **Wayland vs. X11 edge cases** — README recommends logout on Wayland; specific compositor quirks (Hyprland, Sway, mutter versions) not documented.
- **Windows/macOS cursor packs** — not planned or present; Linux Xcursor only.

---
