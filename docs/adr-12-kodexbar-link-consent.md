# ADR 12: KodexBar — Link Consent Gate

* **Status:** Accepted
* **Date:** 2026-07-26
* **Author:** kodexArg
* **Amends:** ADR 10 (answer contract), ADR 09 (§8 records the enforcement)

---

## Context & Problem Statement

Every answer that resolved a destination used to render its links immediately, beneath the paragraph. Two things were wrong with that.

**The links did the talking.** Because the visitor always got chips, the paragraph could stay thin and still feel complete. The answer was sized to be a caption for the links rather than an answer to the question.

**Consent was assumed.** A visitor who asked "¿qué sabe de AWS?" did not ask to be handed five repositories. Offering first, and linking only on a clear yes, makes the exchange a conversation instead of a dispatch.

## Decision

### 1. A response never carries both an answer and a link

This is the binding rule, and everything else in this ADR serves it.

KodexBar may **only ask** whether the visitor wants links. The links themselves can appear no earlier than the **following** response — or never. There is no turn in which prose and a link are delivered together.

It is enforced structurally rather than by prompt or by convention, because a rule about what a *response may contain* cannot be delegated to the thing producing the response.

`KodexAnswer.links` means "render these", and it is empty on every answering path. The resolved destination ids do not travel to the browser at all: they are parked server-side and the response carries only `offer: true`, a flag with no addresses in it. So "answer plus link in one response" is not a case that is avoided — it is a case that cannot be represented. A model that floods `linkIds`, a prompt regression, a careless future edit to the component: none of them can produce it, because the payload the renderer would need does not exist on that turn.

Two rules follow and are worth stating because they are easy to lose:

* The model's `linkIds` selects which destinations are *offered*. It can no longer cause anything to render, in any turn.
* The answer text must stand complete with no link present. The prose must also not mention links at all, since none are coming this turn.

### 2. The gate lives on the server, not in `ChatSession`

The original proposal put the pending offer in `ChatSession`, on the reasoning that a consent turn would then cost no retrieval, no generation and no rate-limit budget, and that the server could stay stateless.

**That is not what was built, and the change is deliberate.** Holding the offer in the client requires shipping the resolved destinations to the browser and asking the renderer not to read them. That is a discipline, not a guarantee — anything delivered to a page is readable in the page. Holding it on the server means the links are not merely unrendered, they are *absent* until consent exists.

The offer is parked in the KV `SESSION` namespace under `offer:<client-ip>:<conversation-id>`, with a five-minute TTL. The conversation id is generated per browser tab and can only *narrow* the key; it cannot fabricate an offer, because a read returns only what this server wrote.

What this costs, stated plainly: a consent turn is a real request. It consumes a rate-limit slot and, for a reply the lexicon does not recognise, one small model call. Both are bounded by the same limiter that already bounds every other turn.

What it does not cost: the retrieval gate of ADR 09 §2 is untouched. The consent classifier is reachable only because the server itself wrote an offer on a previous turn — no request parameter unlocks inference.

Failure direction: if KV is unavailable the offer cannot be recorded, and the links ship with the answer as they did before this gate existed. Withholding links that nothing can later reveal would silently lose content, and every destination is public by ADR 09 §5.

### 3. Consent classification — lexicon first, model second

The original proposal required the decision to be **near-deterministic**, with no model call, on the grounds that an ambiguous reply must never count as consent.

**That constraint was lifted by a later decision, and the reason matters.** A closed vocabulary answers "sí", "dale", "yes" and "go ahead", and fails everything else — including "me encantaría verlos" and "por qué no", which are unmistakable to any reader. Routing those to a fresh retrieval, where they score below the gate and earn the fixed refusal, reads as the assistant not listening.

So classification runs in two layers, in order:

1. **The proposed phrase.** The parked offer records the exact request the interface put in front of the visitor. A reply matching it is consent by comparison — no lexicon, no model, no ambiguity.
2. **A bilingual lexicon of whole replies.** Matched on the entire normalised string, never a substring: substring matching is what would let "no sé" read as a yes and "sí pero no" read as consent. Accents are folded, apostrophes are joined rather than split, and both languages are accepted regardless of interface language.
3. **The generation model**, for anything the first two do not recognise. It returns one of three words and nothing else.

`classifyConsent` returns `yes | no | other`, and **every** failure path — no binding, transport error, unparseable reply — returns `other`. `other` falls through to the ordinary answering pipeline, so the residual risk is not a false consent: it is a question getting answered. No classifier output is ever rendered.

### 4. One pending slot, never more

A pending offer holds **exactly one** set of destinations, and it is consumed on read — whatever the next turn turns out to mean.

This makes consent unambiguous by construction: a yes can only ever refer to the offer made in the immediately preceding turn. There is no history to search and no "¿sí a qué?" case to handle. It also closes the stale-consent case: a yes three questions later cannot reveal the links of a forgotten answer, because the offer is already gone.

### 5. The reveal copy is fixed; the request is not

The line acknowledging a reveal and the line acknowledging a decline are fixed per-language strings, alongside `OUT_OF_SCOPE` and `FAILURE`. Per ADR 09 §4 the model does not write the chrome of the conversation.

The *request* is the exception, and it is a deliberate one. Asking for links used to be a fixed line rendered under the answer; it is now a short phrase the model drafts naming the destination it chose, offered as the input's placeholder. What bounds it: it passes through `scrubAnswerText`, so no URL, domain or email survives it; it is capped to a placeholder-sized length; and an unusable draft falls back to a phrase composed deterministically from the destination's registry name. See ADR 09 §9.

## Resolved — the gate applies to contact links too

An earlier draft left this open: KodexBar exists to make reaching Gabriel easy, so gating the email link works against its stated purpose, and exempting `kind: 'contact'` was a one-line predicate.

§1 closes it. An exemption would mean a turn in which prose and a link ship together, which the invariant forbids — and an invariant with a carve-out is not an invariant, it is a default. The uniform rule wins on the strength of the guarantee, and the cost is accepted: **asking for an email takes two turns.** "¿Cuál es su mail?" answers "podés escribirle por correo" and offers; the link follows a yes.

If that friction proves wrong, the fix is not an exemption — it is reconsidering §1.

## Not implemented — the talkier answer

The proposal's §6 raised `MAX_ANSWER_CHARS` from 600 to 900, `MAX_OUTPUT_TOKENS` from 320 to 500, and relaxed `FORMAT_RULES` from "un solo párrafo, breve" to two-to-four sentences, on the reasoning that with links no longer carrying the payload the prose has to.

**None of it was built, and it should not be until there is an eval set.** The proposal named the risk itself: an 8B model given a larger token budget over thin retrieved context is precisely the condition under which a small model starts inventing, and "more verbose" and "only about what it knows" pull against each other. The gate and the matcher are verifiable by unit test; verbosity is not. The prerequisite is a fixture of real questions checked for claims absent from the retrieved chunks.

Recorded here as a decision deferred, not a decision dropped.

## Consequences

**Good**

* "Answer and link in the same response" is unrepresentable, not merely avoided. The guarantee survives a prompt regression, a chatty model, and a future edit to the component.
* The destinations are absent from the wire until consent exists, not merely unrendered.
* Failure direction is safe everywhere: an unrecognised reply becomes a normal query, an unavailable classifier becomes a normal query, an unavailable KV becomes the old behaviour.

**Costs**

* Every link is now two turns away, contact links included. Accepted deliberately, see the resolved question above.
* A consent turn is a real request: one rate-limit slot, and one small model call when the lexicon does not recognise the reply.
* The lexicon is hand-curated and Argentine-Spanish-flavoured. It will need additions from real traffic; each is a one-line diff plus a test case.
* `KodexAnswer` carries an `offer` flag, and `links` changed meaning: it is now "render these", not "these are relevant".

**Explicitly unchanged**

* The retrieval gate, `minScore`, and the rule that the model is not called below threshold.
* `resolveLinkIds()` as the only path from an id to a URL — applied again when a parked offer is revealed, so KV content is never trusted.
* `scrubAnswerText()` and the no-URLs-in-prose guarantee.
