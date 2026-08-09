---
id: "pz-detective-profession"
title: "Detective Profession — Project Zomboid Build 41 character mod"
visibility: private
importance: normal
source_repo: "pz-detective-profession"
org: "kodexArg"
default_branch: "main"
primary_language: "Lua"
repo_kind: "game"
status: "legacy"
related: []
tags: ["project-zomboid", "lua", "mod", "build-41", "steam-workshop", "detective", "foraging", "danger-detection", "character-profession", "archive-snapshot"]
problems_solved:
  - "Project Zomboid vanilla professions lack a cautious indoor specialist who rewards methodical room-by-room exploration with meaningful threat forewarning."
  - "Urban and indoor foraging has no dedicated jack-of-all-trades occupation comparable to how Park Ranger dominates outdoor foraging."
  - "Survival runs lack an immersive detective fantasy with contextual dialogue that signals hidden zombie presence behind doors without breaking game balance."
technologies:
  - "Lua (Project Zomboid mod runtime)"
  - "Project Zomboid Build 41 mod API (ProfessionFactory, forageSkills, Events)"
  - "Steam Workshop packaging (workshop.txt)"
generated_by: "github-repo-swarm"
generated_note: "Single verbose summary markdown; not a dump of every source file."
---

# Detective Profession

> **Problem thesis (required):** This repository preserves a **private Build 41 snapshot** of a Project Zomboid mod that adds a **Detective** playable profession. It exists to give cautious players a balanced urban-exploration specialist: strong indoor foraging, elevated vision, and a unique **danger-detection** loop that warns about zombies in small rooms—especially when the player toggles the game's search mode—while capping surprise so threats are never fully telegraphed. The GitHub description marks it as superseded by the **TrueDetective** rebuild for Build 42; this tree is the archived B41 lineage kept for reference and Workshop continuity.

## 1. Identity

| Field | Value |
|-------|-------|
| Org / repo | `kodexArg/pz-detective-profession` |
| Visibility | `private` |
| Default branch | `main` |
| One-line pitch | A Project Zomboid mod that registers a Detective profession with urban foraging bonuses, fedora-and-trench-coat spawn gear, and door-adjacent zombie intuition voiced through randomized phrases. |
| Audience | Project Zomboid players on Build 41, mod authors studying profession/forage hooks, and maintainers tracing the predecessor to the TrueDetective B42 rebuild. |

## 2. Problems it solves

### P1 — No cautious indoor specialist in vanilla professions

- **Who hurts:** Players who prefer slow, room-clearing survival over sprint-looting; anyone repeatedly ambushed by zombies behind interior doors.
- **Pain today:** Vanilla occupations reward combat or broad traits but none combine **small-room threat sensing** with **search-mode synergy** and urban foraging without becoming overpowered.
- **How this repo answers:** `SearchActions.lua` hooks `Events.OnPlayerMove` and, on tile changes, probabilistically scans adjacent door edges. When a connected room (≤50 tiles) contains living `IsoZombie` instances, the player speaks a random alert phrase from `Phrases.lua`. Search mode raises attempt frequency (66% roll vs 10% passive); `ZombieDetection.lua` enforces the small-room ceiling so large buildings never fully light up.
- **Out of scope:** Does not add new weapons, quests, NPC detectives, or a full investigation minigame. Does not replace the game's line-of-sight or hearing systems.

### P2 — Urban foraging lacks a versatile occupation

- **Who hurts:** Looters in towns and strip malls who want forage bonuses without picking Park Ranger (outdoor-biased) or hyper-specialized traits from other mods.
- **Pain today:** Foraging specialization is fragmented; no single class offers high **Junk/Trash** yields plus broad category bonuses indoors.
- **How this repo answers:** `DetectiveProfession.lua` registers `forageSkills["detective"]` with vision bonus 2.2 (above Veteran's 2.0 per README), 33% weather/darkness mitigation, and tuned `specialisations` table (e.g. Ammunition +50%, Trash/Junk +20%). Profession also grants XP boosts to Aiming (+1), Lightfoot (+1), and Sneak (+2).
- **Out of scope:** Does not out-specialize Park Ranger outdoors, Medic medical loot, or third-party trait mods; README explicitly positions Detective as versatile, not dominant in every category.

### P3 — Missing detective fantasy and diegetic warnings

- **Who hurts:** Role-players and immersion-focused players who want the character to *react* to danger narratively.
- **Pain today:** Threat awareness is mostly mechanical (sound, vision cone) without class-flavored feedback.
- **How this repo answers:** `Phrases.lua` dynamically loads 30+ search-mode lines and 30+ zombie-alert lines from translation files (`UI_phrase_*`, `UI_zombie_alert_*`). `Events.onToggleSearchMode` triggers a search phrase when the player enters search mode. English and Argentine Spanish locales are provided; workshop metadata notes AR translation availability.
- **Out of scope:** Voice acting, cutscenes, or persistent case files. Phrases are cosmetic RNG, not quest state.

## 3. Product / idea

The mod is a **single-occupation gameplay patch** for Project Zomboid. At game boot it registers profession `prof_detective` via `ProfessionFactory.addProfession`, attaches forage skill metadata, and on game start wires movement and search-mode listeners. The mental model is three coupled loops:

1. **Profession identity** — negative point cost (-6), detective icon textures, and `ClothingSelectionDefinitions` spawn loadout (fedora 75%, long leather jacket, practical pants/shoes).
2. **Forage loop** — vanilla search/forage UI benefits from Detective's `forageSkills` row whenever the player forages in urban contexts.
3. **Intuition loop** — each step to a new grid square may trigger door-adjacent room scans; success yields `player:Say()` with thematic warnings.

Distribution targets Steam Workshop (workshop ID in `mod.info` and `workshop.txt`) and manual install under the player's Zomboid mods folder (`DetectiveProfession`).

### 3.1 North-star use cases

1. **New game as Detective** — pick profession at character creation, spawn with iconic clothing, begin with sneak/lightfoot/aiming XP head start.
2. **Indoor clearing** — toggle vanilla search mode before opening doors; higher chance of spoken zombie warnings in small rooms.
3. **Urban loot runs** — leverage forage bonuses for ammunition, trash, and junk while navigating with +2.2 vision and weather/darkness tolerance.

### 3.2 Non-goals

- Not a total conversion or campaign mod; no new maps or factions.
- Not a Build 42 mod in this snapshot (successor repo handles B42.20 rebuild per GitHub description).
- Detection is probabilistic and room-size-limited by design—never guarantees safety or full room reveals.
- README claims MIT license but no `LICENSE` file is present in the cloned tree (license text not verified in-repo).

## 4. Technology stack

No Node, Python, or container manifests. The entire product is **Lua scripts** loaded by the Project Zomboid client mod loader plus binary assets (PNG icons/textures) and Steam Workshop descriptor text.

| Layer | Choices | Evidence (path, not URL) |
|-------|---------|--------------------------|
| Runtime / language | Lua on Project Zomboid JVM/Lua bridge | `Contents/mods/DetectiveProfession/media/lua/shared/*.lua` |
| Game platform | Project Zomboid Build 41 | `workshop.txt` tags `Build 41`; GitHub description "B41 snapshot" |
| Mod packaging | Standard PZ `Contents/mods/<ModId>/` layout | `Contents/mods/DetectiveProfession/mod.info` |
| Distribution | Steam Workshop + manual mod folder | `workshop.txt`, `mod.info` (`workshopID`) |
| Frontend | N/A (in-game UI strings only) | `media/lua/shared/Translate/*/*.txt` |
| Backend / API | N/A | — |
| Data | In-memory `player:getModData()` flags (`isSearchMode`, `lastSquare`) | `SearchActions.lua` |
| Infra / deploy | Player-local install; Workshop upload artifact | `README.md` installation section |
| AI / agents | None in-repo | `.claude/` absent |
| Tests | None evident | no test harness files |

### 4.1 Notable dependencies (curated)

- **Project Zomboid mod API** — `ProfessionFactory`, `Perks`, `Events`, `IsoZombie`, `IsoDirections`, `getCell()`, `getText` / `getTextOrNull`.
- **Vanilla forageSkills table** — extended in-place by occupation key `detective`.
- **ClothingSelectionDefinitions** — vanilla hook for profession-specific spawn outfits.

## 5. Repository map (abstraction)

- **Entrypoints:** Lua modules under `Contents/mods/DetectiveProfession/media/lua/shared/` loaded automatically by PZ mod discovery (no explicit `require` manifest; shared scripts auto-load).
- **Domain / core:**
  - `DetectiveProfession.lua` — profession registration and forage skill definition.
  - `ZombieDetection.lua` — room scan and zombie presence check (exported module).
  - `SearchActions.lua` — movement handler, door edge checks, search-mode toggle hook.
  - `Phrases.lua` — translation-backed phrase pools.
  - `ClothingSelectionDefinitions.lua` — spawn clothing tables for male/female detectives.
- **Adapters:** Event hooks only (`Events.OnGameBoot`, `Events.OnGameStart`, `Events.OnPlayerMove`, `Events.onToggleSearchMode`); no HTTP or file I/O adapters.
- **Docs vaults:** Root `README.md` only. **No** `docs/`, **`.docs/`**, ADRs, or PRDs present.
- **Agent scaffolding:** **No** `.claude/`, `.agents/`, or `SKILL.md` trees (directories confirmed absent).
- **Assets:** `media/shared/DetectiveProfessionIcon.png`, `media/textures/profession_detective.png`, `media/textures/lupa.png`, root and mod `preview.png`.
- **Workshop metadata:** `workshop.txt` (BBCode-style Steam description), `mod.info` (mod id `detectiveProfession`).
- **Generated / vendor:** None; small binary PNGs are source assets, not vendored code.

## 6. Configuration & contracts (no secrets)

This mod has **no environment variables**, secrets files, or server configuration. All behavior is hard-coded Lua constants and game API calls.

| Setting | Location | Purpose |
|---------|----------|---------|
| Profession id | `DetectiveProfession.lua` | `prof_detective` |
| Mod id | `mod.info` | `detectiveProfession` |
| Workshop id | `mod.info`, `workshop.txt` | Steam Workshop item identifier (numeric) |
| Search-mode detection roll | `SearchActions.lua` | `ZombRand(100) < 66` when search mode active |
| Passive detection roll | `SearchActions.lua` | `ZombRand(100) < 10` when search mode inactive |
| Max room size for scans | `ZombieDetection.lua` | `squareSize > 50` aborts detection |
| Forage vision bonus | `DetectiveProfession.lua` | `visionBonus = 2.2` |
| Fedora spawn chance | `ClothingSelectionDefinitions.lua` | `chance = 75` on Hat slot |

Player mod-data keys: `isSearchMode` (boolean), `lastSquare` (grid square reference for debouncing moves).

### 6.1 HTTP / API endpoints (when applicable)

**No HTTP surface.** This is a client-side game mod with no web server, REST routes, or OpenAPI spec. All interaction occurs through Project Zomboid's in-game profession selection, movement, search-mode toggle, and speech bubble UI.

### 6.2 Other interfaces

| Interface | Contract |
|-----------|----------|
| **Game events** | Subscribes to boot, game start, player move, and search-mode toggle events. |
| **Translation keys** | `UI_prof_detective`, `UI_profdesc_detective`, `UI_phrase_1..N`, `UI_zombie_alert_1..N` in locale files under `Translate/EN`, `Translate/AR`, `Translate/ES`. |
| **Steam Workshop** | `workshop.txt` declares title, tags (`Build 41`, `Balance`, `Clothing/Armor`, `Misc`, `Realistic`), visibility `public` for the Workshop item (distinct from GitHub repo visibility). |
| **CLI / MCP / systemd** | None |

## 7. Data & persistence

- **Persistence model:** None beyond vanilla Project Zomboid save games. Mod data on the player object (`getModData`) holds ephemeral session flags only (`isSearchMode`, `lastSquare`); no custom SQL, KV, or cloud stores.
- **Entities touched at runtime:** `IsoPlayer`, `IsoGridSquare`, `Room` squares collection, `IsoZombie` moving objects, door edges on cardinal directions.
- **Topology:** Fully offline, single-player / local multiplayer client mod. No edge workers or dedicated servers.

## 8. Docs & agent memory (required scan)

Sources read and folded into this summary:

1. **`README.md`** — feature list, XP boosts, foraging comparison to Veteran/Park Ranger, installation steps, Workshop ID mention, MIT license claim.
2. **`workshop.txt`** — extended Steam description with per-category forage percentages, danger-detection design notes (75% detection cap stated in prose), contribution pointer to this GitHub repo, tags and visibility.
3. **`Contents/mods/DetectiveProfession/mod.info`** — mod name, poster path, mod id, workshop id.
4. **Lua modules** (`DetectiveProfession.lua`, `SearchActions.lua`, `ZombieDetection.lua`, `Phrases.lua`, `ClothingSelectionDefinitions.lua`) — authoritative behavior vs README marketing copy.
5. **Locale files** — `Translate/EN/UI_EN.txt` (canonical English strings); `Translate/AR/UI_AR.txt` (Argentine Spanish); `Translate/ES/UI_ES.txt` (file present but table key is `UI_AR`, same content as AR file—likely mislabeled ES locale).

**Scans with no findings:**

- **`.claude/`** — not present in repository tree.
- **`.docs/`** — not present in repository tree.
- **`docs/`**, ADRs, PRDs, constitution files — not present.

## 9. Security & privacy notes (summary-time)

- **GitHub visibility is `private`:** this summary describes mechanics without publishing clone instructions as a public product link. The mod's Steam Workshop listing is separately public per `workshop.txt`.
- **No authentication, credentials, or network calls** in mod code.
- **No secrets** were found or transcribed. Repository contains no `.env`, keys, or credential JSON.
- **No `.gitignore`** file in tree; nothing was excluded from scan except standard shallow-clone omission of LFS objects (none referenced).

## 10. Operational picture

- **Local dev / play:** Copy `Contents/mods/DetectiveProfession` into the player's Project Zomboid mods directory; enable `Detective Profession` in the in-game mod list; start a new character and select the Detective profession.
- **Workshop distribution:** Upload package using `workshop.txt` metadata; mod id `detectiveProfession`, workshop id `3383387174`.
- **CI / automated deploy:** None in repository (no GitHub Actions, no build scripts).
- **Hardware:** Standard Project Zomboid client requirements; no GPU or embedded constraints.
- **Lineage:** GitHub repo description positions this tree as an **archived B41 snapshot** superseded by the **TrueDetective** Build 42.20 rebuild project in the same org.

## 11. Open questions / unknowns

- **Successor relationship:** Exact feature parity between this B41 snapshot and `TrueDetective` B42 rebuild is not documented in-tree beyond the GitHub description pointer.
- **License file:** README references MIT and a LICENSE file, but the shallow clone contains no `LICENSE` artifact—legal terms unverified from source.
- **Spanish locale:** `Translate/ES/UI_ES.txt` duplicates the `UI_AR` table from the Argentine file; whether intentional shared locale or copy error is unknown.
- **README vs code detection rates:** README states "~75% in search mode" and "10% passive"; code uses 66% and 10% thresholds—documentation drift possible.
- **Female-only phrasing in README:** README uses feminine pronouns for Detective; clothing tables support both `Female` and `Male` definitions.
- **Multiplayer sync:** Mod-data flags are local; behavior in dedicated multiplayer / server authority scenarios not documented.
