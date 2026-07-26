# ADR 11: The Obsidian Vault Is Part of the Repository

* **Status:** Accepted
* **Date:** 2026-07-26
* **Author:** kodexArg

---

## Context & Problem Statement

`docs/` is not a folder of loose markdown files. It is an **Obsidian vault**, and it is how the ADRs and the PRD are actually read, navigated and written — through the graph view, backlinks, and the Presentation Orange styling, not through a plain text editor.

That makes `.obsidian/` part of the documentation's presentation layer, in the same sense that `src/styles/syv.tokens.css` is part of the site's. A vault opened without it renders the same words in a different, unintended way: light mode, default theme, no snippet, a graph tuned differently, a different set of core plugins enabled.

The practice already existed but was recorded nowhere. Commit `02ccaae` ("chore(obsidian): add Presentation Orange vault styling") committed `.obsidian/appearance.json` and `.obsidian/snippets/presentation-orange.css`, while `app.json`, `core-plugins.json`, `graph.json` and `workspace.json` were left untracked — not by decision, by omission. The result was a vault that was half-versioned: `appearance.json` enabled the `presentation-orange` snippet, but `app.json` (which sets dark mode, the thing the snippet is designed against) travelled with nobody.

The default instinct — and the one this ADR exists to overrule — is to treat editor configuration as machine-local noise and `.gitignore` it. For this repository that instinct is wrong.

## Decision Drivers

* The vault **is** the reading experience of the documentation, not an accessory to it.
* Half-versioned configuration is worse than either extreme: it drifts silently and produces a look nobody chose.
* The repository is the unit that travels between machines. Anything needed to read it correctly must travel with it.

## Considered Options

* **Option 1: Ignore `.obsidian/` entirely.** Conventional. Costs the styling, the graph tuning and the plugin set on every new clone, and orphans the snippet already committed.
* **Option 2: Track only "shared" config, ignore `workspace.json`.** Tracks `app.json`, `appearance.json`, `core-plugins.json`, `graph.json` and `snippets/`, while leaving per-machine UI state out. Avoids churn; loses the open-tab layout.
* **Option 3: Track the whole `.obsidian/` directory.** Everything travels, including which notes are open and in what arrangement.

## Decision Outcome

Chosen option: **Option 3 — the entire `.obsidian/` directory is versioned.**

The vault is treated as a first-class part of the repository, not as editor preference. A clone of `kodexArg/Home` opens in Obsidian looking and behaving exactly as intended, down to the working layout.

`workspace.json` is included deliberately, with its trade-off understood and accepted below.

### Positive Consequences

* A fresh clone reads the documentation as designed: dark mode, `presentation-orange` snippet, the tuned graph view, the same enabled core plugins.
* The already-committed snippet stops being an orphan whose activating configuration lives outside the repo.
* The vault layout — which ADRs are open, in what arrangement — is part of the handoff. Picking the work back up on another machine restores the working context, not just the files.

### Negative Consequences / Trade-offs

* **`workspace.json` churns.** It records open tabs, pane geometry and `lastOpenFiles`, and it changes merely by reading a note. It will appear in `git status` constantly and is a likely source of merge conflicts on a shared branch.
* **`workspace.json` can reference files that no longer exist.** It currently points at `docs/adr-09-chatui-router.md` and `docs/adr-10-llm-connection.md`, both deleted in the KodexBar refactor. This is harmless — Obsidian skips missing entries — but it means the file is not a reliable record of anything, only a snapshot of one machine's last session.
* Vault state is coupled to repository history. A noisy `workspace.json` diff sits alongside substantive changes in the same commit unless separated by hand.

These are accepted. If the churn becomes a real obstacle rather than a nuisance, the correct amendment is to fall back to Option 2 — drop `workspace.json`, keep everything else — not to ignore the vault wholesale.

## Compliance & Validation

* `.gitignore` MUST NOT gain a `.obsidian/` entry. It carries an explicit comment recording this so the omission cannot be reintroduced as a "cleanup".
* New vault configuration files created by Obsidian (plugin settings, hotkeys, templates) are tracked by default. Ignoring one is a decision that belongs in an amendment here, not in a silent `.gitignore` line.
* Verify with `git ls-files .obsidian` — it must list the whole directory, not a subset. A partial listing is the exact failure state this ADR was written to end.
