# ADR 16: Platzi corpus pack (`platzi`)

* **Status:** Accepted
* **Date:** 2026-08-09
* **Author:** kodexArg
* **Related:** [ADR 02](adr-02-harness.md), [ADR 09](adr-09-kodexbar-security.md), [ADR 13](adr-13-repo-layout.md), [ADR 15](adr-15-interests-pack.md)

---

## Context & Problem Statement

The `cv` education chunk summarizes Platzi at a high level and points the visitor to the `platzi` destination (public student profile). Visitors who ask *what he learned in each course* need per-diploma detail without bloating `cv` or inventing courses.

## Decision Outcome

### Pack

| Field | Value |
|-------|--------|
| Id | `platzi` |
| Default visibility | `public` |
| `minScore` | **0.48** |
| Authoring | `corpus/platzi/{es,en}/*.md` |
| Links | `related: ["platzi"]` → existing contact destination (student profile) |

### Why 0.48

* Above `cv` (0.45) enough that a specific “qué vio en el curso de Svelte / AWS / SQL” should prefer this pack’s denser notes over the short education blurb.
* Aligned with `gh-*` (0.48): structured catalog facts, not civil identity.
* Below `identity` (0.62) and `interests` (0.52): course questions are factual training claims, not hobbies or legal identity.
* Changing this number is a harness amendment ([ADR 02](adr-02-harness.md)).

### Authoring model — one note per diploma (+ scope)

* `platzi-alcance` lists the diploma set and points readers at per-course notes.
* One markdown file = one chunk per completed diploma (same `id` in `es/` and `en/`).
* **Source of truth for membership:** the owner-approved completed-diploma list (eighteen courses as of 2026-08-09), cross-checked against the public student profile (`gcavedal`) when visible. Do not invent courses outside that list.
* **Syllabus enrichment:** prefer the public Platzi course page. If the live catalog slug is gone, use Wayback / historical Platzi materials for that title (e.g. Scrapy, Linux). If nothing public exists, keep title-level inference and do not invent modules.
* Bodies: no URL / domain / email literals (corpus integrity). Use `related: ["platzi"]` for the profile link.
* Frontmatter: `id`, `title`, `related`, `tags`, optional `importance`. No `source_repo`.
* Template: `templates/platzi-course.TEMPLATE.md`.

### Separation from other packs

| Pack | Role |
|------|------|
| `cv` | Short education narrative; may keep a high-level Platzi sentence |
| `platzi` | Per-course “what he learned” detail from completed diplomas |
| `interests` | Hobbies / tastes — not training catalog |
| `identity` | Civil identity — never here |

`cv` may keep `related: ["platzi"]` (destination). Cross-pack chunk expansion is out of scope; retrieval selects packs by score.

### System prompt fragment

Authorized Platzi diploma notes only; third person; stay inside retrieved context; do not invent courses or topics.

## Consequences

* Worker bundle and Vectorize grow with each diploma note — keep notes to one short factual paragraph.
* Reindex after every compile that changes chunks: `bun run corpus:compile` → `bun run index:corpus`.
* If the public profile gains or drops diplomas, update `platzi-alcance` and the matching course note in the same change.
* Broader claims in `cv` education that are not backed by a diploma in this pack should be tightened in a follow-up (out of scope for the first scaffold).
