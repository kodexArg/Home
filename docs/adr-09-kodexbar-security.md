# ADR 09: KodexBar — Grounded Prose Contract & Security Sensitivity

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
interface RawModelAnswer { text: string; linkIds: string[]; nextId?: string }
```

`nextId` is the same pattern applied to the follow-up placeholder — see §9. It is not a URL and does not widen this contract.

* `linkIds` are **ids**, not URLs. They are resolved server-side by `resolveLinkIds()` against `DESTINATIONS` ([destinations.ts](file:///srv/dev/kodexArg/Home/src/lib/kodexbar/destinations.ts)).
* An id absent from the allowlist is **dropped silently**. There is no fallback, no fuzzy match, no pass-through.
* `text` MUST be scrubbed of anything URL-shaped before render (§4). A model that writes a link into its prose has it removed, not rendered.

The allowlist check is applied twice, independently, before a link ever reaches the model's own answer: `allowedLinksFor()` first narrows the *offer* to ids reachable from the chunks actually placed in that turn's prompt (so a model answering about Raspberry Pi is never even shown the CV's ids), and `answerQuery` then intersects the model's emitted `linkIds` against that same offered set, dropping both invented ids and real-but-unoffered ones. A third re-resolution happens in `/api/ask` when a parked offer (§8) is revealed — never trusted raw out of KV.

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

`retrieve()` fails **closed**: a missing `AI`/`VECTOR_INDEX` binding, a transport error, or an empty match set all resolve to `passed: false`, the same outcome as a query that legitimately scored below threshold. There is no fallback keyword matcher to catch what Vectorize misses — that mechanism belonged to the multi-tier router and was removed with it (ADR 04, ADR 10).

The gate MUST remain server-side and MUST NOT be bypassable by any request parameter.

### 3. Grounding — closed, versioned corpus

The model answers **only** from chunks retrieved from the corpus. The corpus is a set of `KnowledgePack`s committed to this repository and indexed into Vectorize by an explicit script; it is not user-writable and not model-writable.

* Chunk text is **trusted** content (authored by kodexArg, reviewed in diff). The visitor's query is **untrusted** and is never written into a chunk, a destination, or the index. It is also never written into the system prompt: `buildSystemPrompt()` composes only pack fragments, grounding rules, format rules and retrieved chunks; the query is the sole content of `buildUserPrompt()`, kept on the user turn. This system/user split is the entire mechanism that keeps the visitor's words a request the model can be asked to weigh, never an instruction the system prompt itself carries.
* Adding a pack is an ordinary change. Adding a pack whose content is not authored by kodexArg — third-party documents, scraped material, user submissions — is an architectural change requiring an ADR amendment, because it breaks the "chunk text is trusted" premise this section rests on.
* Private repositories and third-party production systems MUST NOT appear in `DESTINATIONS`. They may be described in corpus prose. KodexBar can talk about work it cannot link to; this is intended.

### 3b. Personal identity is its own pack, behind its own gate

Facts about Gabriel Cavedal as a person — full legal name, birth date, place of origin — live in the `identity` pack, not in `cv`. They are published deliberately, by their own subject, and that consent is the only thing that makes them publishable at all.

The separation is a control, not filing. A single pack means a single `minScore`, and the `cv` gate sits at 0.45 because career questions arrive phrased a hundred ways. Identity facts do not need that latitude: they are asked directly or not at all. `identity` therefore gates at **0.62**, which is what keeps a birth date from riding along as collateral context for a question about Django. Retrieval expansion cannot smuggle them in either — `related` edges are followed within the retrieved set, and nothing in `cv` points into `identity`.

Consequences that bind:

* The pack's prompt fragment requires these values be repeated **exactly**, never approximated, rounded or inferred past what the chunk carries. A wrong birth date asserted confidently is worse than no answer.
* Age is **derived from the birth date at request time**, never written into chunk text as a number. A literal age is a fact with an expiry date, and the site would go on asserting it with full confidence after it stopped being true.
* Widening this pack's scope — adding a document number, an address, anything a third party could use to impersonate him — is not an ordinary corpus edit. It is an amendment to this section.
* Lowering `identity`'s `minScore` towards `cv`'s is likewise an amendment. The number is the control.

**Measured 2026-07-26, and 0.62 is currently unreachable.** Probed live against the real index, the pack's own questions score below its gate: "¿Cuántos años tiene?" tops out at 0.499 and "¿Cuál es su nombre completo?" at 0.385, so both fall to the out-of-scope refusal. Nothing leaks — the failure is closed, not open — but the pack answers nothing it was built to answer. The number was argued, never measured; this is the measurement. Making it reachable means an amendment to this section under the bullet above, and the amendment has to carry its own leak measurement, not an argument.

### 4. Output shape is enforced in code, not requested in the prompt

`KodexAnswer.text` is one plain paragraph. The system prompt asks for it; the server **guarantees** it:

* collapse all newlines to spaces;
* strip Markdown emphasis, headings, list markers, code fences, and backticks;
* strip anything URL-shaped or `mailto:`-shaped (links travel in `links[]`, never in prose);
* truncate at a fixed maximum length.

A prompt is a request. Post-processing is a control. Formatting rules MUST NOT rely on the prompt alone.

`scrubAnswerText`'s processing order is load-bearing, not incidental: fenced/inline code is stripped before anything else so code-fence markers can't hide other patterns from later steps; Markdown links are unwrapped to their label (`[CV](https://…)` → `CV`) *before* URL-stripping runs, so a linked mention degrades to plain text instead of vanishing entirely; URL-stripping runs last precisely so it also catches whatever unwrapping just exposed. Changing this order is a behavioural change to the control, not a refactor.

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

* The 3-second client cooldown in `chatSession` is a UX affordance, **not** a security control — it is trivially bypassed by calling the endpoint directly. The server-side check below is the real control.
* `/api/ask` MUST enforce server-side rate limiting (KV `SESSION` binding) independently of the client, via `checkRateLimit()`.
* `checkRateLimit()` **fails open**: a missing `SESSION` binding or a KV error is treated as `allowed`, deliberately — a limiter that takes the whole site down on a KV hiccup is a worse outcome than one that briefly stops limiting. KV is also eventually consistent, so this is a coarse bound, not an exact one. The retrieval gate (§2) is the actual backstop on cost, since off-topic traffic never reaches the generation model regardless of rate limit state.
* The endpoint MUST reject non-string, empty, and over-length queries before embedding.

### 8. Links are offered, not given

**The rule is [ADR 12 §1](adr-12-kodexbar-link-consent.md): a response never carries both an answer and a link.** That ADR owns the decision and its cost; this section records the enforcement.

When `answerQuery` resolves one or more destinations, `/api/ask` withholds them: the ids are parked in KV under `offer:<client-id>:<conversation-scope>` with a 5-minute TTL, and the response carries `links: []` and `offer: true` — a flag with no addresses in it, so the destinations are absent from the wire rather than merely unrendered. The next turn is read for consent; on a yes the parked ids are re-resolved through `resolveLinkIds()` and sent.

`clientId` is Cloudflare's `CF-Connecting-IP` (falling back to `X-Forwarded-For`, then a fixed local value) — set at the edge, not client-supplied, and unspoofable by the request itself. The conversation scope is a UUID the browser generates and sends; it is sanitised and truncated server-side and can only *narrow* the key. It cannot fabricate an offer — a read returns only what this server wrote — and it stops two visitors behind one NAT from answering each other's "Show links?".

Consent classification is two layers, in order: a bilingual lexicon of exact yes/no replies (`sí`, `dale`, `yes`, `go ahead`, …), matched on the **whole normalised string, never as a substring or prefix** — so "yes but what about AWS?" is not consent, it is a new question that must reach the pipeline — resolved with zero network calls; then, only for replies the lexicon does not recognise, the generation model.

This is a UX decision with security-relevant consequences, all of which MUST be preserved:

1. **The offer is server state, not a request parameter.** The consent classifier is reachable only because *this server* wrote an offer on a previous turn. No field in the request body can unlock inference, so §2 holds exactly as before: a first-contact query still reaches a model only by passing the retrieval gate.
2. **The classifier's output is an enum, never prose.** `classifyConsent()` returns `yes | no | other` and every failure path — no binding, transport error, unparseable reply — returns `other`, which falls through to the ordinary pipeline. A prompt-injected classification can therefore only cause a question to be answered; no classifier text can reach the page. The reply text on a resolved offer is fixed copy from `CONSENT_REPLY`.
3. **Reveal re-validates.** KV content is treated as untrusted on read: non-string ids are dropped, and the surviving ids go through the same allowlist as any other link. A rendered `href` still originates only from a `LinkDestination.url` declared in this repository (§1).
4. **Offers are consumed unconditionally on read**, regardless of what the next turn turns out to mean. `takeOffer()` deletes the KV entry the moment it reads it, so a stale "yes" three questions after the fact — once the offer has already been taken or expired — cannot reveal a forgotten answer's links; it just falls through to answering whatever was actually asked.

Failure direction: if KV is unavailable the offer cannot be recorded, and the endpoint sends the links with the answer as it did before this handshake existed. Withholding links that nothing can later reveal would silently lose content; there is nothing to protect here, since every destination is public by §5.

### 9. The placeholder is model-drafted, and bounded in code

The input's placeholder proposes what the visitor would most likely send next, and TAB types it into the field. It used to be an id resolved against a committed registry, on the reasoning that TAB puts the text one keystroke from being submitted as the visitor's own query, so the model must never write it.

**That guarantee was traded away deliberately.** A closed registry cannot chain: it proposes a question adjacent to the answer, not one that follows from it, and it cannot ask for the specific link the model just chose. The model now drafts the phrase — the request for its links when it cited any, the next question when it did not — and the registry becomes the floor rather than the mechanism.

What bounds it, none of which is a prompt instruction:

* The draft passes through `scrubPlaceholderText()`, which runs the §4 prose pipeline: no URL, domain, mailto or email address survives it, and markdown is flattened.
* It is capped at `MAX_PLACEHOLDER_CHARS`. Over-long drafts are **rejected, not truncated** — a cut-off question reads as broken, and the fallback is better than a fragment.
* Every rejection falls back deterministically: to a request composed from the offered destination's registry name when links are pending, otherwise to `resolveSuggestion(nextId, …)` against the authored candidates, and finally to the opening question. The placeholder is never empty and never a fragment.
* What is typed is a query like any other. It re-enters through `/api/ask` with the retrieval gate (§2), the rate limiter (§7) and every other control intact. The residual risk is a poorly phrased question, not an unsafe one.

The gate closing (§2) means no model ran, so there is no draft: that path proposes the opening question. That is deliberate — a visitor whose question fell out of scope is exactly the one who needs pointing back at the front door.

### 10. The model never refers to this page

The visitor asking is already on `kodexarg.com`, `www.kodexarg.com` or `home.kodexarg.com`, so KodexBar must never send them there or dwell on the fact. This is enforced at three independent layers, of decreasing strength:

1. **As a link — structurally impossible.** There is no `home` (or equivalent) entry in `DESTINATIONS`; it was deliberately deleted, and `destinations.test.ts` fails if one is reintroduced. §1 already makes a link to anywhere not in `DESTINATIONS` unrepresentable — this is that same guarantee applied to the site's own hostnames.
2. **As a domain in prose — enforced in code.** `scrubAnswerText`'s `BARE_DOMAIN` pattern strips anything domain-shaped from `text` regardless of which domain it is (§4), which incidentally but reliably also catches the three self-hostnames if the model writes them out.
3. **As words, with no domain shape ("andá a la home") — prompt-only, best-effort.** There is no code-level way to strip a phrase like that without risking damage to legitimate prose, so this layer is a system-prompt instruction and nothing more. A reviewer who finds KodexBar directing a visitor back to the page they are already on, in words rather than a domain, is looking at layer 3 doing its best rather than a hard guarantee — it is still worth treating as a defect to fix in the prompt or the corpus, not as acceptable behaviour.

Other kodexArg subdomains (the CV, docs, design system, project sites) are unaffected by any of the three layers and remain normal citations.

---

## Mandatory Review for Changes

Any PR touching `src/lib/kodexbar/`, `src/pages/api/ask.ts`, `src/lib/chat/`, or the KodexBar component MUST be audited for:

- [ ] The model still cannot emit a URL: `RawModelAnswer` carries `linkIds` only (§1).
- [ ] `linkIds` are still resolved exclusively via `resolveLinkIds()` against `DESTINATIONS`; unknown ids still dropped (§1).
- [ ] `KodexAnswer.text` is still rendered as plain text, never as HTML or Markdown (§1).
- [ ] The retrieval gate still short-circuits below `minScore` without calling the LLM (§2).
- [ ] The gate is still server-side and not overridable by request parameters (§2).
- [ ] No untrusted input reaches the corpus or the index (§3).
- [ ] The `identity` pack still gates strictly above `cv`, still derives age rather than stating it, and gained no new class of personal data without an amendment (§3b).
- [ ] Every new `DESTINATIONS` entry was verified reachable, public and live (§5).
- [ ] Output post-processing still strips formatting and URL-shaped text (§4).
- [ ] Server-side rate limiting still present and independent of the client cooldown (§7).
- [ ] A pending link offer still comes from KV, never from the request body, and consuming it is unconditional (§8).
- [ ] `classifyConsent()` still returns only `yes | no | other`, still fails to `other`, and its output is still never rendered (§8).
- [ ] Revealed links still pass through `resolveLinkIds()` rather than being trusted from KV (§8).
- [ ] A model-drafted placeholder still passes `scrubPlaceholderText()`, is still rejected rather than truncated when over-length, and every rejection still lands on a deterministic fallback (§9).
- [ ] All three self-reference layers hold: no `home`-equivalent entry in `DESTINATIONS`, `BARE_DOMAIN` in `scrubAnswerText` still strips the site's own hostnames, and the system prompt still instructs against naming them in words (§10).
- [ ] `SyvInput` (`¿Sí?`) design tokens and keyboard accessibility preserved.

## Notes on the superseded ADR

The superseded document's §1.1–§1.5 (the `RouteResult.outcome` / `RouterAction.kind` enumerations, per-tier outcome obligations, score comparability, and the cascade rule) described `AdaptiveRouter` and its three strategies. Those modules no longer exist; the rules have no referent and are retired rather than amended. Their history is in git.
