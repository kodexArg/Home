---
id: "truedetective"
title: "True Detective — Project Zomboid B42.20 urban investigator profession mod"
visibility: public
importance: normal
source_repo: "TrueDetective"
org: "kodexArg"
default_branch: "main"
primary_language: "Lua"
repo_kind: "game"
status: "active"
related: []
tags: ["project-zomboid", "lua", "b42", "profession-mod", "steam-workshop", "survey-sense", "foraging", "detective", "harness", "character-profession"]
problems_solved:
  - "Project Zomboid Build 42.20 has no built-in urban investigator occupation with magnifying-glass zombie reconnaissance and junk/trash/ammo forage affinity — players who want a hard-boiled city detective fantasy must rely on generic professions or weaker third-party packs."
  - "The original Build 41 Detective Profession mod used deprecated ProfessionFactory APIs and door/window interruption mechanics that do not port cleanly to B42's CharacterProfession registry model — owners need a Workshop-shaped B42 tree with explicit ADR-governed mechanics."
  - "Mod authors maintaining a single cohesive profession package need harness-grade law (ADRs, use cases, install scripts, agent skills) so balance numbers and detection rules never land in Lua without documented authority."
technologies:
  - "Project Zomboid Build 42.20"
  - "Lua (client/shared mod scripting)"
  - "CharacterProfession.register API"
  - "forageSystem.addSkillDef"
  - "Bash (install-local.sh rsync deploy)"
  - "kodexArg harness (ADRs, constitution, triage-and-fix cast)"
  - "markdown-vault-mcp (docs vault indexing)"
  - "GitHub Actions (pr-minimal path gate)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# True Detective

> **Problem thesis (required):** True Detective is a Project Zomboid Build 42.20 profession mod that adds one fully integrated playable occupation — the **Detective** — for survivors who want an urban, stealth-leaning investigator fantasy instead of a soldier or ranger. It solves the gap between generic combat professions and third-party detective packs by shipping B42-native registration, urban forage bonuses (junk, trash, ammunition, medical), noir starting gear, and **Survey Sense**: stand still five seconds with a magnifying glass and the Detective whispers where the nearest zombies are — by room indoors, by compass direction outdoors, silently and deterministically. The repository also carries a kodexArg harness so mechanics, install paths, and agent delivery rules stay law-bound rather than drifting in Lua.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/TrueDetective` |
| Visibility | `public` |
| Default branch | `main` |
| One-line pitch | B42.20 profession mod: the Detective walks into Knox County with a fedora, loaded revolver, magnifying glass, urban forage vision, and Survey Sense — silent zombie intel after five still seconds. |
| Audience | Solo and co-op Project Zomboid players on Build 42.20; server hosts enabling the mod for shared profession definitions; mod author (kodexArg) shipping and balancing one Workshop-shaped package; AI agents working the harness for issue-to-PR delivery. |

## 2. Problems it solves

### P1 — Missing urban investigator fantasy on B42

- **Who hurts:** Survivors creating characters who want a meticulous city detective — not a soldier, not a forager of berries — with identity expressed through gear, forage affinity, and reconnaissance mechanics.
- **Pain today:** Base game professions skew combat, farming, or generic trades. Third-party detective occupations (for example SOTO's simpler detective pack) lack this mod's magnifier-based Survey Sense and the specific junk/trash/ammo forage profile. House rules are fragile in multiplayer.
- **How this repo answers:** Registers `truedetective:truedetective` via `CharacterProfession.register` plus a `character_profession_definition` script (`Cost = -8`, `XPBoosts = Aiming=2`). Spawns fedora, leather long coat, trousers, loaded revolver, spare .357 rounds, guaranteed magnifying glass, and optional noir extras (pipe, cigarettes, lighter, whiskey at 75% each). Applies `forageSystem.addSkillDef` with vision bonus 1.75, darkness effect 15, and +10 specialisations on Trash, Junk, JunkWeapons, Ammunition, and Medical categories.
- **Out of scope:** New weapons, new zombie types, map edits, plant foraging bonuses, or a full quest narrative line.

### P2 — B41-to-B42 profession API and mechanic migration

- **Who hurts:** Owners and contributors porting the original Build 41 Detective Profession (Workshop item `3383387174`) to Build 42.20's registry model; players who subscribed to the old build and need a coherent B42 line on the same Workshop page.
- **Pain today:** B41 used `ProfessionFactory` — forbidden on B42.20. Door Sense and Lead Sense (door/window open interruption with spoken danger phrases) were tied to B41 hooks and small-room heuristics; they were retired from `main` on owner decision 2026-08-08 and archived on the `legacy` branch. B42 mod layout requires `common/` plus a version folder (`42.0/` for 42.20 stable), not a flat `media/` tree alone.
- **How this repo answers:** Live product lives under `Contents/mods/TrueDetective/` with `42.0/` as the primary load root. `scripts/install-local.sh` rsyncs a real directory to `~/Zomboid/mods/TrueDetective` (symlinks rejected). Survey Sense (`adr-10-survey-sense`) replaces door/window senses as the sole special ability. Version tags follow `v42.20-N.M`; `modversion` in `mod.info` matches (`42.20-0.3` at time of summary). B42 line updates the original Workshop item in place per owner policy.
- **Out of scope:** Maintaining `legacy/` as install target; reintroducing door/window interruption on `main`; supporting `legacy41` or `42.19` betas as default product branches.

### P3 — Undocumented balance and agent chaos in mod repos

- **Who hurts:** Mod authors and AI agents changing Lua without a proving path; contributors who cannot tell whether a number in code is intentional or drift.
- **Pain today:** Game mods often ship logic with no ADR, no use-case traceability, and no install contract — leading to silent balance changes and broken Workshop trees.
- **How this repo answers:** Cloned from `kodexArg/harness-default`: constitution (`docs/constitution/`), eleven ADRs (`adr-00` through `adr-10`), Gherkin use cases (`docs/USE-CASES.md`), user stories, requirements table, assertion discipline (optional laws with proving tests), triage-and-fix delivery cast (`docs/agents/kwf-*`), and skills under `docs/skills/kskill-*`. Rule: where code and ADR disagree, **ADR wins**. Survey Sense numbers (300 still ticks, 15-square radius, 5 zombie cap, group minimum 3) are binding in `docs/adrs/adr-10-survey-sense.md`.
- **Out of scope:** Web-stack skills (Astro, Django, AWS) from the harness template — not shipped here. Cloud deploy pipelines — there is no cloud app; deploy is merge, tag, local install, optional owner Workshop upload.

## 3. Product / idea

The central idea is **one profession, one ability, one tree**. After enabling the mod and picking **Detective** at character creation, the player receives urban forage advantages and noir loadout, then uses the magnifying glass as a deliberate reconnaissance tool: equip it in the primary hand, stand still on the same square for roughly five real seconds, and receive silent halo-note whispers naming up to five closest living unmarked zombies within fifteen squares — grouped by named room indoors or eight-way compass direction outdoors. Each zombie is marked once (`tdSurvey` in modData) and never reported again. Movement or losing the glass resets the stillness counter. The mechanic is fully deterministic — no random rolls in scan, grouping, or wording.

The mod does not run a separate server process or HTTP layer. All behavior executes inside the Project Zomboid client via Lua event hooks (`Events.OnTick` for Survey Sense, `Events.OnGameBoot` for forage registration, `Events.OnNewGame` for starting gear). Shared Lua holds forage and clothing definitions; client Lua holds Survey Sense and gear grant logic. English UI strings live in `42.0/media/lua/shared/Translate/EN/UI.json` (B42 JSON format — the older `UI_EN.txt` table format is ignored by the engine).

Naming law from `AGENTS.md`: **True Detective** is the mod name; the playable profession display name is **Detective** (`UI_prof_truedetective`). Resource id is `truedetective:truedetective`; `getName()` returns `truedetective`.

### 3.1 North-star use cases

1. **Character creation:** Enable mod → new game → select Detective → spawn with fedora, coat, trousers, loaded revolver, magnifying glass, urban forage profile active.
2. **Quiet clearing:** Enter a building → equip magnifying glass → stand still five seconds → read whispered lines ("A zombie in the kitchen", "A group of 4 zombies in the living room") → plan entry without audible `Say` that could attract zombies or alert MP neighbors.
3. **Urban looting:** Search trash piles, junk piles, and ammunition spawns with occupation bonuses tuned for city interiors; darkness penalty reduced relative to generic professions.
4. **Local dev loop:** Clone repo → `./scripts/install-local.sh` → restart game → verify `42.0/media` loads and profession appears without `ProfessionFactory`.
5. **Harnessed change:** Open GitHub issue → triage-and-fix party or thin PR → amend ADR before changing Survey Sense numbers → merge to locked `main` → tag `v42.20-N.M`.

### 3.2 Non-goals

- Door Sense / Lead Sense on `main` (archived on `legacy` branch only).
- Audible zombie reports (`player:Say`) — `setHaloNote` is the only feedback channel.
- Reporting the same zombie twice or alerting on dead zombies.
- Chance rolls anywhere in Survey Sense trigger, scan, grouping, or phrasing.
- Dual-loading the same Mod ID from local `~/Zomboid/mods` and a subscribed Workshop copy during development.
- Agent-initiated Steam Workshop upload without explicit owner command.
- Treating `legacy/` or `references/` as live product roots.

## 4. Technology stack

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Project Zomboid Build 42.20 client; Lua 5.x (game-embedded) | `mod.info` `versionMin=42.20`; `docs/constitution/INFRASTRUCTURE.md` |
| Game APIs | `CharacterProfession.register`, `forageSystem.addSkillDef`, `Events.OnTick`, `Events.OnNewGame`, `Events.OnGameBoot`, `ClothingSelectionDefinitions`, `setHaloNote` | `42.0/media/registries.lua`, `ForageSkills.lua`, `SurveySense.lua`, `StartingGear.lua`, `Outfit.lua` |
| Mod packaging | B42 Workshop shape: `common/` + version folder `42.0/` | `docs/adrs/adr-05-project-zomboid-mod-structure.md`, `Contents/mods/TrueDetective/` |
| Script definitions | `character_profession_definition` in scripts folder | `42.0/media/scripts/characters/TrueDetective_professions.txt` |
| Host install | Bash rsync to `~/Zomboid/mods/TrueDetective`; `default.txt` modlist | `scripts/install-local.sh` |
| Docs / agents | Markdown vault, wikilinks, ADRs, kwf-* cast, kskill-* skills | `docs/`, `AGENTS.md`, `.mcp.json` |
| CI | Minimal GitHub Actions path gate on PRs to `main` | `.github/workflows/pr-minimal.yml` |
| Workshop metadata | `workshop.txt` keys (owner publish only) | `workshop.txt` |
| Tests | Python dep checker for triage skill; assertion review skill | `docs/skills/kskill-triage-and-fix/tests/test-deps.py` |

### 4.1 Notable dependencies (curated)

- **Project Zomboid 42.20** — target game branch; Steam AppID 108600 for client.
- **Base.MagnifyingGlass** — primary-hand gate for Survey Sense; guaranteed starting gear.
- **Base.Revolver / Base.Bullets357Box** — noir combat starter; revolver spawns loaded (6/6).
- **forageSystem** — engine forage API; occupation skill def keyed `truedetective`.
- **CharacterProfession** — B42 profession registration; replaces B41 `ProfessionFactory`.
- **markdown-vault-mcp** — indexes `docs/` for wikilink-aware agent queries (`.mcp.json`).
- **gh / git** — issue-to-PR workflow per `adr-09-gh-deploy-and-versioning`.

## 5. Repository map (abstraction)

- **Entrypoints (game):** `Contents/mods/TrueDetective/mod.info` (Mod ID `TrueDetective`); `42.0/media/registries.lua` (profession registration); client Lua under `42.0/media/lua/client/TrueDetective/` (`SurveySense.lua`, `StartingGear.lua`); shared Lua under `42.0/media/lua/shared/TrueDetective/` (`ForageSkills.lua`, `Outfit.lua`).
- **Domain / core:** Survey Sense scan/group/report logic (`SurveySense.lua`); forage occupation bonuses (`ForageSkills.lua`); profession script stats (`TrueDetective_professions.txt`); clothing spawn table (`Outfit.lua`).
- **Adapters:** Project Zomboid event system (`OnTick`, `OnNewGame`, `OnGameBoot`); Translate JSON for UI strings (`Translate/EN/UI.json`); `mod.info` and `workshop.txt` for Steam/Workshop identity.
- **Docs vaults:** `docs/constitution/` (PRD, harness, infrastructure, requirements); `docs/adrs/` (binding rules adr-00–adr-10); `docs/resources/pz-mod-structure/` and `docs/resources/steam-configurations/` (fact packs); `docs/USE-CASES.md`, `docs/USER-STORIES.md`, `docs/MOD-API.md`, `docs/ARCHITECTURE.md`.
- **Agent scaffolding:** `AGENTS.md` (read-first law); `docs/skills/` (`kskill-triage-and-fix`, `kskill-assertion-review`, `kskill-orchestrator`, `kskill-live-doc`, `kskill-report`, vault skills, workflow triage variant); `docs/agents/kwf-*` (delivery party cast) and `docs/agents/souls/`; `docs/hooks/` (`pre-commit`, `guardian-dispatch`). No `.claude/` directory present in this tree.
- **Host helpers:** `scripts/install-local.sh`; `workshop.txt`; `state/` and `log/` (gitignored contents except `.gitkeep`).
- **Archive:** `legacy/` — pre-reset trees, original B41 reference mod under `legacy/references/original-mod/`, retired door-sense code and docs — **not** install target.
- **Generated / vendor:** `.mvmcp/` local vault index (gitignored); `preview.png`, `icon.png`, `poster.png` art assets.

## 6. Configuration & contracts (no secrets)

- **Mod ID:** `TrueDetective` in all active `mod.info` files — never confused with Workshop ID `3383387174`.
- **Profession resource:** `truedetective:truedetective`; internal name `truedetective`.
- **Survey Sense constants (ADR-bound):** `STILL_TICKS = 300` (~5s), `CHECK_INTERVAL_TICKS = 10`, `RADIUS = 15`, `MAX_ZOMBIES = 5`, `GROUP_MIN = 3` — change only via `adr-10` amend.
- **Forage def:** `visionBonus = 1.75`, `darknessEffect = 15`, `weatherEffect = 0`; specialisations Trash/Junk/JunkWeapons/Ammunition/Medical at 10.
- **Starting gear:** Guaranteed revolver (loaded), bullets box, magnifying glass; optional noir items at `OPTIONAL_CHANCE = 75`.
- **Install paths:** Source `Contents/mods/TrueDetective/` → destination `~/Zomboid/mods/TrueDetective` (real directory); enable via `~/Zomboid/mods/default.txt` entry `mod = TrueDetective`.
- **Versioning:** Git tags `v42.20-N.M`; `modversion=42.20-0.3` in `mod.info` at time of summary.
- **MCP vault:** `.mcp.json` configures `markdown-vault-mcp` with `MARKDOWN_VAULT_MCP_SOURCE_DIR=docs`, local index under `.mvmcp/` (gitignored). No credentials in repo per `adr-06` and N1 requirement.
- **Logging:** Failures may write `log/YYYYMMDD-NNN.log` per `adr-08-logging-strategy`.

### 6.1 HTTP / API endpoints (when applicable)

This repository exposes **no HTTP server, REST API, or network surface**. It is a client-side game mod loaded by Project Zomboid.

| Method | Path | Purpose | Auth (if known) |
|--------|------|---------|-----------------|
| N/A | N/A | No HTTP endpoints — behavior is in-game Lua event hooks only | N/A |

### 6.2 Other interfaces

- **In-game Survey Sense:** Primary-hand `MagnifyingGlass` + 5s immobility → `setHaloNote` whisper lines (`UI_td_survey_*`, `UI_td_room_*`, `UI_td_dir_*` keys).
- **Profession registration:** `CharacterProfession.register("truedetective:truedetective")` + script definition file.
- **Forage hook:** `forageSystem.addSkillDef({ name = "truedetective", type = "occupation", ... })` on game boot.
- **CLI — local install:** `./scripts/install-local.sh` (bash, rsync, modlist write).
- **CLI — harness delivery:** `docs/skills/kskill-triage-and-fix/bin/kwf-deps` for PR dependency cascade; `docs/hooks/guardian-dispatch` for post-PR guardian bundle.
- **MCP — docs vault:** `markdown-vault-mcp serve` via `.mcp.json` for agent documentation queries.
- **Steam Workshop:** `workshop.txt` metadata for owner manual publish; not automated from CI.
- **GitHub:** Issue → branch → PR → merge workflow; `pr-minimal` workflow validates required paths on pull requests.

## 7. Data & persistence

- **No external databases, KV stores, or cloud persistence.** All state is local to the game session and save file.
- **Per-zombie modData:** `tdSurvey = true` marks zombies already reported by Survey Sense; persists for the life of that zombie instance in the save.
- **Player inventory:** Starting gear granted once on `OnNewGame` for Detective profession characters.
- **Save topology:** Single-player or multiplayer — mod logic runs on each client; profession definition must be consistent across server and clients when hosting. No edge workers or dedicated mod server process beyond Project Zomboid's own dedicated server AppID 380870 if used.
- **Repo-local scratch:** `state/` (gitignored) for harness iteration; `log/` for failure logs; `.mvmcp/` for vault index — none shipped to players.

## 8. Docs & agent memory (required scan)

Agents and summarizers should treat `docs/` as the authoritative knowledge vault (wikilink-aware via markdown-vault-mcp).

1. **Root README** — player-facing pitch, Survey Sense description, install steps, legacy branch pointer. Evidence: `README.md`.
2. **AGENTS.md** — naming law, read-first ADR list, harness skills index, Survey Sense as sole ability, legacy door senses forbidden on `main`. Evidence: `AGENTS.md`.
3. **Constitution** — PRD (product horizon, who it serves), REQUIREMENTS (functional F1–F8, non-functional N1–N6), HARNESS (tiers, families, code root, triage-and-fix, vault rules), INFRASTRUCTURE (host paths, install). Evidence: `docs/constitution/PRD.md`, `REQUIREMENTS.md`, `HARNESS.md`, `INFRASTRUCTURE.md`.
4. **ADRs** — `adr-00` discipline through `adr-10` survey sense; structural law (`adr-05`), Steam config (`adr-06`), clean code (`adr-07`), logging (`adr-08`), GitHub versioning (`adr-09`). Evidence: `docs/adrs/`.
5. **Behavior specs** — Gherkin use cases UC-01–UC-14 (legacy UC-03–08 closed); user stories US-01–US-04. Evidence: `docs/USE-CASES.md`, `docs/USER-STORIES.md`.
6. **Living architecture** — mod tree summary, systems table, MOD-API current surface. Evidence: `docs/ARCHITECTURE.md`, `docs/MOD-API.md`, `docs/GLOSSARY.md`.
7. **Resource packs** — PZ mod tree/load order/mod.info examples; Steam paths, workshop keys, language policy. Evidence: `docs/resources/pz-mod-structure/`, `docs/resources/steam-configurations/`.
8. **Agent skills** — triage-and-fix party (`kskill-triage-and-fix`), assertion review, orchestrator, live-doc, report skills, vault markdown skills. Evidence: `docs/skills/*/SKILL.md`.
9. **Delivery cast** — kwf-* party members and guardian agents under `docs/agents/`. Evidence: `docs/agents/kwf-*.md`, `docs/agents/souls/`.
10. **Changelog** — version history from harness baseline through Survey Sense release. Evidence: `CHANGELOG.md`.
11. **`.claude/` / `.docs/`** — not present in this repository; no scan results.
12. **`legacy/` docs** — historical ADRs, agents, and B41 reference mod preserved for archaeology only; not law for `main`.

## 9. Security & privacy notes (summary-time)

- **Visibility:** Public GitHub repository; mod distributed via Steam Workshop (public item). No private clone URLs required for understanding the product.
- **Auth model:** None at repository level. In-game, Survey Sense is profession-gated (`truedetective` only); no account or token system in the mod.
- **Secrets policy:** Repository and harness explicitly forbid committing Steam tokens, session cookies, passwords, or `.env` files (`adr-06` rule 9, REQUIREMENTS N1). CI includes optional secret-pattern scan intent per `adr-09`. This summary contains no credentials, PEM keys, or connection strings.
- **Multiplayer privacy:** Survey feedback uses silent `setHaloNote` — not audible `Say` — reducing information leakage to nearby players compared to spoken warnings.
- **Agent safety:** Locked `main`, PR-only product changes, no automated Workshop upload, guardian dispatch after significant PRs per harness doctrine.

## 10. Operational picture

- **Local dev:** Clone repo → `./scripts/install-local.sh` → fully restart Project Zomboid → Mods menu → enable True Detective → Apply → new game → pick Detective. Target branch: Build 42.20 public (verify `version=` in game console after launch).
- **Game launch:** Prefer Steam client for AppID 108600 so Workshop overlay works; direct `projectzomboid.sh` allowed on Linux native client path documented in `docs/constitution/INFRASTRUCTURE.md`.
- **Deploy / release:** Merge PR to `main` → optional git tag `v42.20-N.M` → bump `modversion` in `mod.info` → owner may upload to Workshop using `workshop.txt` (manual, owner-only). No cloud deploy pipeline.
- **CI:** `pr-minimal` workflow on pull requests verifies `Contents/mods/TrueDetective/mod.info`, `42.0/media`, key ADR files, and `id=TrueDetective`.
- **Hardware constraints:** Standard Project Zomboid client requirements; mod adds lightweight per-tick Lua scan (throttled every 10 ticks) within 15-square radius — no GPU or special peripheral requirements beyond the base game.
- **Host skill:** External `steam-project-zomboid` skill referenced in `AGENTS.md` for B42.20 game facts when agents work mod tasks.

## 11. Open questions / unknowns

- **Workshop B42 publish status:** `workshop.txt` and CHANGELOG describe in-place update policy for item `3383387174`; whether the B42 build is live on Workshop at summary time is not verifiable from the git tree alone — owner action required.
- **Non-English UI:** EN strings ship in `UI.json`; AR/ES translation files exist under `legacy/` trees but current `42.0/` load root summary shows EN only — localization expansion beyond EN is unknown on `main`.
- **Multiplayer edge cases:** ADR and use cases specify silent halo notes; full MP soak testing coverage is not evident from docs alone.
- **Assertion files:** `docs/assertions/` discipline exists; no binding assertion laws were enumerated as active beyond discipline doc — healthy empty state per harness design.
- **Dedicated server:** Mod is client Lua; behavior on dedicated server 380870 with mod enabled is assumed standard PZ mod sync but not deeply documented in scanned files.
- **`.claude/` agent tree:** Absent — agents rely on `AGENTS.md` and `docs/skills/` instead.
