---
id: "kdx-cursor-forced-theme"
title: "kdx-cursor-forced-theme — Forced Presentation Orange chrome for Cursor"
visibility: public
importance: normal
source_repo: "kdx-cursor-forced-theme"
org: "kodexArg"
default_branch: "main"
primary_language: "CSS"
repo_kind: "other"
status: "active"
related: []
tags: ["cursor", "css", "theme", "presentation-orange", "workbench", "node", "kodex-design-system", "hyprland", "glass-mode"]
problems_solved:
  - "Standard VS Code / Cursor color themes cannot paint radial glow backgrounds, remap Glass-mode CSS variables, or style the Agents composer chrome (sunken prompt, message cards, hairlines) to match the kodexArg Presentation Orange design system."
  - "Patching Cursor's workbench.html triggers an integrity checksum mismatch in product.json, causing a persistent 'installation corrupt' toast unless the SHA-256 digest is recomputed and written back."
  - "Cursor package upgrades and apt updates silently wipe manual workbench patches, leaving no reproducible baseline or drift-detection workflow for operators who depend on a frozen visual look."
technologies:
  - "CSS (Presentation Orange tokens, Glass + classic selectors)"
  - "Node.js ≥ 18 (build + patcher CLI, zero npm runtime deps)"
  - "Cursor / VS Code Electron workbench.html inject"
  - "SHA-256 base64 integrity checksum (product.json contract)"
  - "kdx-design-system palette alignment"
  - "Hyprland decoration.rounding = 10px chrome contract"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# kdx-cursor-forced-theme

> **Problem thesis (required):** Cursor and VS Code color themes operate within the theming API—they cannot reach into Glass-mode Agents UI, paint radial orange/teal glows on sidebars, override `--cursor-chrome` / `--cursor-sidebar` host tokens, or shape the composer prompt as a sunken Hyprland-aligned well. This repository solves that gap by injecting a bundled CSS `<style>` block directly into Cursor's installed `workbench.html`, automatically refreshing the app's integrity checksum so the patch survives startup validation, and providing enable/disable/verify tooling so operators can restore Presentation Orange chrome after upgrades.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/kdx-cursor-forced-theme` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | Forced Presentation Orange chrome for Cursor (Glass + classic IDE): backgrounds, icon colors, hairlines, sunken prompt—delivered via workbench HTML inject plus checksum repair. |
| Audience | kodexArg operators running Cursor from the official `.deb` / apt package on Linux; designers maintaining visual parity with kdx-design-system and Hyprland window chrome; anyone who wants Codium-grade glow styling inside Cursor Agents. |

## 2. Problems it solves

### P1 — Theme API limits vs. forced chrome styling

- **Who hurts:** Developers using Cursor Agents / Glass mode who want Presentation Orange (ink/cream/orange/teal) instead of Cursor's default cool grays and sky-blue accents; teams aligning desktop Hyprland + AGS chrome with IDE appearance.
- **Pain today:** VS Code `workbench.colorCustomizations` and extension color themes cannot set radial `.po-glow` backgrounds, remap Glass CSS variables on `:root` / `.ui-1lzgia1`, transparent auxiliary bars, or composer-specific surfaces (human message cards vs. sunken prompt input). Cursor's Agents Window hard-codes cool grays that hide intended glow recipes.
- **How this repo answers:** Split source CSS under `css/` defines tokens, backgrounds, icons, hairlines, and prompt-input rules targeting both `data-cursor-glass-mode=true` and classic `.monaco-workbench` selectors. `scripts/build-css.js` concatenates parts into `css/forced-theme.css`; `scripts/patcher.js` injects that bundle as `<style id="kodexarg-gradient">` between HTML comment markers in the live `workbench.html` `<head>`.
- **Out of scope:** Editor syntax highlighting themes (handled separately by `kodex.syv-theme` / `workbench.colorTheme`); Codium-only glow (see companion repo `kodexarg-theme-gradient-addon`); AppImage installs where app files are read-only.

### P2 — Integrity checksum after HTML mutation

- **Who hurts:** Anyone who hand-edits Cursor app files and immediately sees "installation corrupt" toasts because `product.json` stores a base64 SHA-256 of `workbench.html` bytes under key `vs/code/electron-sandbox/workbench/workbench.html`.
- **Pain today:** Manual HTML patches break the signed integrity contract; users must discover the checksum key, recompute digest, and rewrite `product.json`—error-prone and undocumented in upstream Cursor docs.
- **How this repo answers:** `scripts/patcher.js` recomputes `base64(sha256(file_bytes)).rstrip('=')` after every enable/disable/write, updates `product.json` via direct write or passwordless `sudo -n cp`, and exposes a standalone `checksum` subcommand for hand-edited HTML recovery.
- **Out of scope:** Code signing, notarization, or official Cursor support for customized installs; the patch is the same unsupported tradeoff class as any workbench CSS inject.

### P3 — Upgrade drift and lost baselines

- **Who hurts:** Operators who `apt upgrade cursor` or release-hop and lose injected CSS with no diff against the last known-good look.
- **Pain today:** Package updates replace `workbench.html`; there is no built-in Cursor mechanism to reapply kodexArg chrome; visual regressions (clipped message bubble corners, auxiliary bar opacity) go unnoticed until manual inspection.
- **How this repo answers:** `npm run enable` rebuilds and re-injects in one step; `npm run verify-live` byte-compares live inject vs. committed `css/forced-theme.css` (exit 1 on drift); `snapshots/baseline-2026-08-08-cursor-3.14.7.css` freezes exact inject bytes for Cursor `3.14.7-1785396290`; `docs/BASELINE.md` documents restore steps and companion theme extension. README recommends `sudo apt-mark hold cursor` to defer silent wipes.
- **Out of scope:** Automated CI against live installs; cross-platform macOS/Windows Cursor paths (candidates are Linux `.deb` layout only).

## 3. Product / idea

The central idea is **out-of-band chrome injection**: treat Cursor's shipped Electron shell as a mutable host, not a theming surface. Presentation Orange is expressed as layered CSS that (1) remaps host tokens to ink/cream/orange/teal, (2) paints radial glow curtains on dark (orange-deep) and light (teal) hosts, (3) keeps scrollbars gray while hairlines go orangish, (4) styles icons/avatars/plan chips, and (5) distinguishes composer human messages (soft raised cards, 10px Hypr radius, top scroll padding against clip) from the prompt input (sunken inset well, same radius).

The mental model: **edit split CSS → build bundle → patcher writes HTML + checksum → reload window**. Optional markdown preview CSS lives under `markdown/` and is contributed separately via extension `markdown.previewStyles`—the workbench inject deliberately does not style preview panes.

Glass mode requires aggressive `!important` overrides on `--cursor-chrome`, `--cursor-sidebar`, `--glass-chat-surface-background`, and related variables because Agents Window sets cool grays that would otherwise occlude glow. Classic mode selectors run in parallel so non-Glass layouts still receive orange chrome.

### 3.1 North-star use cases

1. **First-time enable:** Clone repo, run `npm run enable`, reload Cursor—Presentation Orange glow, icons, hairlines, and sunken prompt appear in Agents and classic workbench chrome.
2. **Design iteration:** Edit `css/tokens.css` (palette, `--chrome-radius`) or domain files (`backgrounds.css`, `prompt-input.css`), `npm run build`, `npm run enable`, reload; `--chrome-radius: 10px` stays aligned with Hyprland `decoration.rounding`.
3. **Post-upgrade restore:** After Cursor package update wipes patch, `cd` to repo, `npm run enable`, reload, `npm run verify-live` must print OK; optionally restore from `snapshots/` baseline if repo bundle was intentionally frozen.
4. **Clean uninstall:** `npm run disable` strips inject markers and style block, rewrites checksum, leaves one-time `workbench.html.kdxbak` backup if sudo path was used.

### 3.2 Non-goals

- Does not ship or commit live `workbench.html`, `product.json`, backups, credentials, or private screenshots (explicit in README safety section).
- Does not patch AppImage installs (immutable mount).
- Does not replace the `kodexArg` color theme extension for editor token colors—companion `kodex.syv-theme` handles syntax/workbench theme JSON.
- Does not provide macOS/Windows install path discovery (Linux `.deb` paths only in patcher candidates).
- No npm package dependencies—zero-dependency Node scripts only.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Node.js ≥ 18; CSS3 with VS Code/Cursor DOM selectors | `package.json` engines; `css/*.css` |
| Frontend | N/A (not a web app)—injected CSS targets Electron workbench DOM | `css/forced-theme.css` |
| Backend / API | N/A | — |
| Data | N/A (stateless patch; no database) | — |
| Infra / deploy | Local `.deb` Cursor under `/usr/share/cursor/`; optional `sudo -n` for system paths | `scripts/patcher.js` WORKBENCH_CANDIDATES; `docs/PATHS.md` |
| AI / agents | Styles Cursor Agents / Glass composer UI only | `css/prompt-input.css`, `css/backgrounds.css` Glass selectors |
| Tests | Manual `verify-live` byte diff; no automated test runner | `scripts/verify-live.js`; `package.json` scripts |

### 4.1 Notable dependencies (curated)

- **Node.js `crypto` / `fs` / `child_process`** — checksum computation, file I/O, passwordless sudo copy fallback in patcher.
- **Zero npm dependencies** — entire toolchain is three plain Node scripts; no lockfile in tree.
- **kdx-design-system tokens (conceptual)** — ink-1000, cream-milk, orange-deep, teal-500 palette names and values in `css/tokens.css`.
- **Hyprland rounding contract** — `--chrome-radius: 10px` documented alongside `hyprland.lua decoration.rounding = 10`.

## 5. Repository map (abstraction)

- **Entrypoints:** `npm run enable|disable|status|verify-live|build`; CLI bin `kdx-cursor-forced-theme` → `scripts/patcher.js`.
- **Domain / core:** `css/tokens.css`, `css/backgrounds.css`, `css/icons.css`, `css/hairlines.css`, `css/prompt-input.css` — editable source of truth for Presentation Orange chrome rules.
- **Build output:** `css/forced-theme.css` — concatenated bundle committed for offline enable; regenerated by `scripts/build-css.js`.
- **Adapters:** `scripts/patcher.js` — resolves Linux Cursor install paths, injects/strips HTML markers, updates `product.json` checksum; `scripts/verify-live.js` — reads live workbench and diffs against repo bundle.
- **Docs vaults:** `docs/PATHS.md` (touched files + markers), `docs/EDITING.md` (edit workflow + glow recipe + Glass token rationale), `docs/BASELINE.md` (frozen Cursor 3.14.7 baseline + restore); root `README.md`, `CHANGELOG.md`.
- **Agent scaffolding:** **Not present** — no `.claude/`, `.agents/`, or `.docs/` directories in repository tree.
- **Snapshots / baselines:** `snapshots/baseline-2026-08-08-cursor-3.14.7.css` — byte-exact inject freeze tagged `baseline-2026-08-08`.
- **Optional markdown styling:** `markdown/preview.css`, `markdown/mermaid.css`, `markdown/README.md` — separate from workbench inject; extension-contributed preview styles.
- **Generated / vendor:** `node_modules/` gitignored and absent; no CI artifacts.

## 6. Configuration & contracts (no secrets)

- **No environment variables** — patcher discovers Cursor paths from fixed candidate lists; no `.env` usage.
- **HTML inject markers:** `<!-- kodexarg-gradient:start -->` … `<!-- kodexarg-gradient:end -->` wrapping `<style id="kodexarg-gradient">`.
- **Checksum key:** `vs/code/electron-sandbox/workbench/workbench.html` in `product.json` (fallback: `vs/code/electron-browser/workbench/workbench.html`).
- **Checksum algorithm:** SHA-256 of raw file bytes, base64-encoded, trailing `=` padding stripped.
- **Backup convention:** one-time `workbench.html.kdxbak` beside target if sudo copy succeeds and backup absent.
- **Sudo contract:** `sudo -n cp` for EACCES/EPERM on system paths; requires NOPASSWD or root.
- **Gitignore excludes from repo:** `node_modules/`, `*.kdxbak`, `workbench.html`, `product.json`, `.env*`, credentials, `.cursor/`, `.vscode/`.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server, REST API, or network surface**. It is a local filesystem patch tool plus static CSS assets.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| — | — | **N/A — no HTTP endpoints** | — |

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| `npm run enable` | Build CSS, inject into `workbench.html`, update checksum, print paths and digest |
| `npm run disable` | Strip inject block, rewrite checksum, report `removed` or `absent` |
| `npm run status` | Print `enabled` or `disabled` plus resolved workbench path |
| `npm run verify-live` | Compare live injected CSS bytes to `css/forced-theme.css`; exit 0 OK / 1 drift |
| `node scripts/patcher.js checksum` | Recompute and write checksum only (manual HTML edit recovery) |
| `node scripts/build-css.js` | Regenerate `css/forced-theme.css` from ordered PARTS list |
| Optional markdown extension | `contributes.markdown.previewStyles` pointing at `markdown/preview.css` and `markdown/mermaid.css` |

## 7. Data & persistence

No databases, KV stores, or cloud persistence. All state lives on the local filesystem:

- **Inject target:** Cursor installation `workbench.html` (mutated in place).
- **Integrity store:** Cursor installation `product.json` (single checksum field updated).
- **Repo artifacts:** committed CSS bundle, snapshot baselines, documentation—version-controlled only.
- **Ephemeral:** temp files under OS tmpdir during sudo copy (`kdx-cursor-*` prefix).

Topology is strictly **local single-machine**: operator runs scripts on the host where Cursor `.deb` is installed; no edge or multi-tenant sync.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **Root README** (`README.md`) — product pitch, quick start, integrity note, markdown preview optional path, safety/public-repo rules, file role table.
2. **CHANGELOG** (`CHANGELOG.md`) — version history 1.0.0–1.0.4: initial release, Hypr radius alignment, auxiliary bar transparency/veil, baseline freeze + verify-live.
3. **Paths reference** (`docs/PATHS.md`) — workbench/product.json candidate paths, inject markers, backup naming, explicit non-patched surfaces.
4. **Editing guide** (`docs/EDITING.md`) — source-of-truth file table, glow CSS recipe, Glass token override rationale, checksum manual recovery.
5. **Baseline doc** (`docs/BASELINE.md`) — Cursor 3.14.7-1785396290 freeze, snapshot SHA-256, companion theme extension note, apt hold, restore checklist.
6. **Markdown optional docs** (`markdown/README.md`) — preview/mermaid CSS contribution pattern via extension manifest.
7. **Manifests** (`package.json`) — scripts, engines, bin entry, keywords.
8. **Patcher implementation** (`scripts/patcher.js`) — enable/disable/status/checksum behavior, sudo fallback, exported module API.
9. **Build script** (`scripts/build-css.js`) — PARTS order and bundle header contract.
10. **Verify script** (`scripts/verify-live.js`) — live extract/deindent/diff logic.

**Agent directories:** `.claude/` and `.docs/` were **not present** in the cloned tree (confirmed absent at repository root).

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public repository; CSS and Node scripts only—no credentials, tokens, or machine-specific paths committed (though `docs/BASELINE.md` mentions example host paths from author's machine; operators should treat local install paths as environment-specific).
- **Auth model:** None for the repo itself; patcher may require elevated filesystem permissions (`sudo -n`) to write under `/usr/share/cursor/`.
- **Integrity tradeoff:** Modifying shipped Cursor binaries/HTML may mark the install as customized/unsupported relative to vendor expectations.
- **Secrets hygiene:** `.gitignore` blocks `.env*`, `*.pem`, `credentials*`, live `workbench.html`/`product.json`; this summary contains no secrets, keys, or connection strings.
- **Backup files:** `*.kdxbak` excluded from git; may contain pre-patch HTML on operator disk.

## 10. Operational picture

**Local development / apply:**

```bash
npm run build          # regenerate css/forced-theme.css
npm run enable         # build + inject + checksum
npm run status         # enabled | disabled
npm run verify-live    # drift check vs repo bundle
npm run disable        # remove inject + checksum
```

**Requirements:** Cursor from official `.deb` / apt (writable under standard Linux paths); Node ≥ 18; write access to app files (often passwordless sudo for `cp`).

**Deployment:** No CI/CD workflows in repository; operators run scripts manually on each machine. Recommended `apt-mark hold cursor` to reduce silent patch loss; after held upgrade, re-run `enable` and `verify-live`.

**Hardware constraints:** Linux desktop focus; visual radius tied to Hyprland 10px rounding on kodexArg workstations. AppImage Cursor installs typically cannot be patched (read-only app bundle).

**Companion stack (documented in baseline, not patched here):** `workbench.colorTheme: kodexArg` via `kodex.syv-theme` extension for editor colors; markdown preview CSS optional via separate extension contribution.

## 11. Open questions / unknowns

- **macOS / Windows support:** Patcher candidate paths are Linux-only; unknown whether equivalent paths exist or would need separate discovery logic.
- **Cursor version matrix:** Baseline verified only for `3.14.7-1785396290`; DOM class names like `.ui-1lzgia1`, `.ui-prompt-input__container` may break on future Agents UI refactors—no automated compatibility test suite.
- **Electron-browser vs sandbox key:** Patcher tries alternate checksum key if sandbox key missing; full matrix of Cursor build flavors not documented.
- **CI / release automation:** No GitHub Actions or release workflow in tree; publishing is manual git tags (tag `baseline-2026-08-08` exists).
- **npm lockfile:** None present; reproducibility is script + committed CSS bundle, not pinned Node tooling beyond engines field.
- **`.claude/` / `.docs/`:** Confirmed absent; no agent instruction vault in this repo.
