ok cód, ahora sí está funcionando bien# ADR 09: KodexBar — Grounded Prose Contract & Security Sensitivity

* **Status:** Accepted (Critical Security Control)
* **Date:** 2026-07-26
* **Author:** kodexArg
* **Supersedes:** ADR 09 "ChatUI Router Architecture & Security Sensitivity" (2026-07-24)

---

## Context & Problem Statement

The bottom chat input box is the primary interactive surface of `kodexArg/Home`. Because it is exposed directly to public website visitors and automated bots, it remains a high-sensitivity target for prompt injection, open redirects, query reflection, and denial-of-wallet probes. That premise has not changed and this ADR still governs it.

What changed is the product. The surface is no longer an intent router; it is **KodexBar**, an assistant that answers questions about Gabriel Cavedal and hands out links to public kodexArg destinations. See [ADR 10](adr-10-kodexbar-architecture.md) for the runtime architecture.

## The reversal, stated plainly

The superseded ADR 09 §1 mandated a **Closed-Action Contract (No Free Assistant Prose)**: "Freeform generated prose from untrusted model outputs is explicitly forbidden in this component to prevent prompt injection and hallucinated redirection URLs."

**KodexBar emits free prose from a model. That prohibition is hereby lifted.**

It is lifted deliberately, not by drift. The prohibition was a blunt instrument that bought two specific protections, and both are re-established below by narrower controls that do not require banning prose:

| Protection bought by the old prose ban | Replacement control in KodexBar |
|---|---|
| A model cannot hallucinate a redirection URL | §1 — the model is structurally incapable of emitting a URL |
| A model cannot be talked into arbitrary output | §2 — retrieval gate; §3 — grounding; §4 — server-enforced output shape |

A reviewer who finds free prose in this component is **not** looking at a regression. A reviewer who finds a model-authored URL, an ungated model call, or unstripped model formatting **is**.

---

## Security Directives

### 1. The model never emits a URL (structural, not instructed)

This is the load-bearing control of the entire design.

The LLM is required to return `RawModelAnswer` ([types.ts](file:///srv/dev/kodexArg/Home/src/lib/kodexbar/types.ts)):

```ts
interface RawModelAnswer { text: string; linkIds: string[] }
```

* `linkIds` are **ids**, not URLs. They are resolved server-side by `resolveLinkIds()` against `DESTINATIONS` ([destinations.ts](file:///srv/dev/kodexArg/Home/src/lib/kodexbar/destinations.ts)).
* An id absent from the allowlist is **dropped silently**. There is no fallback, no fuzzy match, no pass-through.
* `text` MUST be scrubbed of anything URL-shaped before render (§4). A model that writes a link into its prose has it removed, not rendered.

The consequence, which is the point: a rendered `href` can only ever originate from a `LinkDestination.url` literal committed to this repository. Hallucinating a link is not *unlikely* — it is *unrepresentable*. This holds regardless of what the model was persuaded to say.

MUST NOT, without an ADR amendment:
- add a URL, href, or domain field to `RawModelAnswer`;
- resolve `linkIds` anywhere other than against `DESTINATIONS`;
- render `KodexAnswer.text` as HTML or Markdown.

### 2. Retrieval gate — the model is not always called

Scope is enforced **before** inference, deterministically:

1. Embed the query.
2. Query Vectorize.
3. If the top score is below the owning pack's `minScore`, return the fixed out-of-scope reply with `matched: false` and **do not call the LLM**.

This is a security control first and a cost control second. An off-topic or adversarial query that retrieves nothing never reaches a model, so there is no inference to inject into. It also caps denial-of-wallet exposure: junk traffic costs one embedding, not one embedding plus one completion.

The gate MUST remain server-side and MUST NOT be bypassable by any request parameter.

### 3. Grounding — closed, versioned corpus

The model answers **only** from chunks retrieved from the corpus. The corpus is a set of `KnowledgePack`s committed to this repository and indexed into Vectorize by an explicit script; it is not user-writable and not model-writable.

* Chunk text is **trusted** content (authored by kodexArg, reviewed in diff). The visitor's query is **untrusted** and is never written into a chunk, a destination, or the index.
* Adding a pack is an ordinary change. Adding a pack whose content is not authored by kodexArg — third-party documents, scraped material, user submissions — is an architectural change requiring an ADR amendment, because it breaks the "chunk text is trusted" premise this section rests on.
* Private repositories and third-party production systems MUST NOT appear in `DESTINATIONS`. They may be described in corpus prose. KodexBar can talk about work it cannot link to; this is intended.

### 4. Output shape is enforced in code, not requested in the prompt

`KodexAnswer.text` is one plain paragraph. The system prompt asks for it; the server **guarantees** it:

* collapse all newlines to spaces;
* strip Markdown emphasis, headings, list markers, code fences, and backticks;
* strip anything URL-shaped or `mailto:`-shaped (links travel in `links[]`, never in prose);
* truncate at a fixed maximum length.

A prompt is a request. Post-processing is a control. Formatting rules MUST NOT rely on the prompt alone.

### 5. Allowlist-only target validation

* Redirection targets MUST map to validated entries of `DESTINATIONS`.
* Membership rule: **public and live**. Entries MUST be verified reachable before being added. Three entries (`payflow`, `welpdesk`→`helpdesk.kodexarg.com`, `kcbd-monitor`) were served for weeks pointing at domains that do not resolve; that is the failure this rule exists to prevent.
* The UI MUST NEVER reflect user-supplied strings into `window.location` or an `href`.

### 6. Link element separation

Unchanged from the superseded ADR and still binding:

```svelte
<span class="link-container">
  <span class="link-icon" aria-hidden="true">...</span>
  <a class="who" href={destination.url} target="_blank" rel="noopener noreferrer">…</a>
</span>
```

The icon sits outside the `<a>` with `pointer-events: none` to prevent click-jacking and accidental touch triggers. Link text stays inside the `<a>`, user-selectable.

### 7. Abuse and cost controls

* The 3-second client cooldown is a UX affordance, **not** a security control — it is trivially bypassed by calling the endpoint directly.
* `/api/ask` MUST enforce server-side rate limiting (KV `SESSION` binding) independently of the client.
* The endpoint MUST reject non-string, empty, and over-length queries before embedding.

---

## Mandatory Review for Changes

Any PR touching `src/lib/kodexbar/`, `src/pages/api/ask.ts`, `src/lib/chat/`, or the KodexBar component MUST be audited for:

- [ ] The model still cannot emit a URL: `RawModelAnswer` carries `linkIds` only (§1).
- [ ] `linkIds` are still resolved exclusively via `resolveLinkIds()` against `DESTINATIONS`; unknown ids still dropped (§1).
- [ ] `KodexAnswer.text` is still rendered as plain text, never as HTML or Markdown (§1).
- [ ] The retrieval gate still short-circuits below `minScore` without calling the LLM (§2).
- [ ] The gate is still server-side and not overridable by request parameters (§2).
- [ ] No untrusted input reaches the corpus or the index (§3).
- [ ] Every new `DESTINATIONS` entry was verified reachable, public and live (§5).
- [ ] Output post-processing still strips formatting and URL-shaped text (§4).
- [ ] Server-side rate limiting still present and independent of the client cooldown (§7).
- [ ] `SyvInput` (`¿Sí?`) design tokens and keyboard accessibility preserved.

## Notes on the superseded ADR

The superseded document's §1.1–§1.5 (the `RouteResult.outcome` / `RouterAction.kind` enumerations, per-tier outcome obligations, score comparability, and the cascade rule) described `AdaptiveRouter` and its three strategies. Those modules no longer exist; the rules have no referent and are retired rather than amended. Their history is in git.
