# ADR 15: Interests pack (`interests`)

* **Status:** Accepted
* **Date:** 2026-08-09
* **Author:** kodexArg
* **Related:** [ADR 02](adr-02-harness.md), [ADR 09](adr-09-kodexbar-security.md), [ADR 13](adr-13-repo-layout.md), [ADR 14](adr-14-github-corpus.md)

---

## Context & Problem Statement

KodexBar already answers career (`cv`), authorized civil identity (`identity`), and GitHub repo summaries (`gh-public` / `gh-private`). Personal **interests** — hobbies, tastes, soft context that is not a CV bullet and not a legal identity fact — need a home that can grow as loose notes without contaminating those packs.

## Decision Outcome

### Pack

| Field | Value |
|-------|--------|
| Id | `interests` |
| Default visibility | `public` |
| `minScore` | **0.52** |
| Authoring | `corpus/interests/{es,en}/*.md` |
| Links | Usually none; `related` may cite contact/site destinations only when a note truly warrants it |

### Why 0.52

* Above `cv` (0.45) and `gh-*` (0.48) enough that “qué hace profesionalmente” / “qué es figus” should not routinely pull hobby notes.
* Below `identity` (0.62): interest questions are conversational, not exact-match civil facts.
* Changing this number is a harness amendment ([ADR 02](adr-02-harness.md)), not a casual tweak.

### Authoring model — loose notes

* One markdown file = one chunk (both `es/` and `en/` when the note is bilingual; same `id` across languages).
* Notes are **additive**: new files land under `corpus/interests/`, then `bun run corpus:compile` and `bun run index:corpus`. No engine change.
* Bodies: no URL / domain / email literals (corpus integrity).
* Frontmatter: `id`, `title`, `related`, `tags` (same core as `cv`). Optional `importance`. No `source_repo`.
* Prefer short, factual notes. Titles and `tags` should mirror how visitors ask (“hobbies”, “qué le gusta”, “intereses”, “fuera del laburo”).
* Do **not** put career claims or birth/legal identity here — those stay in `cv` / `identity`.

### System prompt fragment

The pack fragment tells the model these are authorized personal-interest notes, speak in third person, stay inside retrieved context, and not invent tastes. It does not classify intent; retrieval still selects the pack.

### Separation from other packs

| Pack | Role |
|------|------|
| `cv` | Professional profile and project *narrative* |
| `identity` | Legal name, birth, origin — strict gate |
| `gh-*` | Repo summaries |
| `interests` | Personal tastes / hobbies / loose life context |

`related` from `cv` MUST NOT point into `interests` unless a future ADR opens that edge (same hygiene as identity smuggling in [ADR 09 §3b](adr-09-kodexbar-security.md)).

## Consequences

* Scaffold ships with a scope seed note so the pack is discoverable; real notes are added over time.
* Worker bundle and Vectorize grow with each note — keep notes short.
* Reindex after every compile that changes chunks.
