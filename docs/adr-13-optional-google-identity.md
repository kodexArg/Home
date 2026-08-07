# ADR 13: Optional Google Identity — `me.kodexarg.com` and `/me`

* **Status:** Accepted
* **Date:** 2026-08-07
* **Author:** kodexArg
* **Amends:** PRD §2 Non-goals (account login), ADR 01 (glossary), ADR 08 (secrets for Access)
* **Precedent:** Eurotrip (`cf-ng-eurotrip2026`) Access + Google IdP; Coveris Access-as-OIDC for branded entry

---

## Context & Problem Statement

The homepage at `kodexarg.com` must stay **public**: KodexBar, the wordmark, and anonymous asking are the product. A later “system 2” will unlock features for people who choose to identify themselves. That identity is Google, via the same Cloudflare Zero Trust team already live for Eurotrip (`kodexarg.cloudflareaccess.com`).

Two wrong defaults were available:

1. **Eurotrip’s full-host Access gate** — every visitor hits Google before any byte. Correct for a private trip app; fatal for a public home.
2. **Apex-only button with no fixed URL** — login starts from an opaque Worker route, cookies and Access apps drift, and there is no shareable “this is where you sign in.”

We need a **named identity surface** that is optional, bookmarkable, and safe to put behind Access/Google, without locking the rest of the site.

## Decision Drivers

* Apex (`/`, `/api/ask`, static chrome) stays reachable with no login.
* Identity is enough for v1: who they are + avatar. No profiles product, no RBAC UI.
* Reuse the existing Zero Trust team and Google IdP — do not invent a parallel Google Web OAuth client unless Access cannot supply `picture`.
* One cookie domain for apex features: the Worker serving `kodexarg.com` must be able to see the authenticated visitor after login.
* Both a short host and a path on the brand domain are first-class entry URLs.

## Considered Options

* **A — Full-host Access on `kodexarg.com`.** Rejected: mandatory gate; contradicts the public homepage.
* **B — Only `me.kodexarg.com` behind Access.** Rejected as sole surface: `CF_Authorization` would live on the `me` host; apex feature routes would not see the assertion without a second session mechanism.
* **C — Only `kodexarg.com/me` behind Access.** Works for apex cookies, but loses the short host people will type and expect.
* **D — Both URLs, `/me` canonical for cookies; `me.` redirects.** Chosen.

## Decision Outcome

Chosen option: **D**.

### 1. Dual entry is the standing rule

These two URLs are the **standard identity surface** for kodexArg Home. Both MUST work as entry points to the same Google login flow:

| URL | Role |
| :--- | :--- |
| `https://me.kodexarg.com` | Short host. Always **302** to the canonical path (preserve query string). |
| `https://kodexarg.com/me` | **Canonical** identity path on the apex Worker. Cloudflare Access (Google IdP) may protect this path. |

Aliases that already hit the same Worker (`www.kodexarg.com`, `home.kodexarg.com`) MUST redirect `/me` to `https://kodexarg.com/me` so there is a single cookie host.

No other path (`/auth`, `/login`, `/account`, …) is introduced as a public login URL without amending this ADR.

### 2. Apex stays ungated

Cloudflare Access MUST NOT require login for `/`, for KodexBar APIs used by anonymous visitors (`/api/ask` and related public routes), or for static assets. Access applies to the identity surface (`/me` and the `me` host), not to the homepage composition.

Anonymous visitors keep today’s threat model ([ADR 09](adr-09-kodexbar-security.md)). Registered identity unlocks features later; it does not change what an anonymous ask may do.

### 3. What identity means (v1)

After Google login, the system needs only:

* Stable subject (email / Access `sub`)
* Display name (for the orb caption)
* Avatar image URL when the IdP provides `picture` (else initials in the orb)

No multi-user profiles, no client-writable corpus, no “account settings” product in this ADR’s scope. Feature unlocks (“system 2”) consume this identity server-side in a later change.

### 4. UI contract (orb)

A single Svelte component on the homepage (top-right, wordmark height) is the chrome for this identity:

* Circular control, ~wordmark height, **2px (`0.125rem`) ocre ring** (`--orange-500` / `--orange-300`)
* Interior: login affordance when anonymous; avatar (or initials) when signed in
* Caption under the circle: `LOG IN` or a truncated display name (stable short width)
* Clicking the anonymous orb starts Google login via the identity surface above

The orb does not own feature logic. It only starts login and reflects `whoami`.

### 5. Platform wiring

* Zero Trust team: `kodexarg.cloudflareaccess.com` (same as Eurotrip).
* Access application(s) scoped to `me.kodexarg.com` and `kodexarg.com/me` (and redirects from aliases) — **not** the whole apex.
* Worker verifies `Cf-Access-Jwt-Assertion` when present (Eurotrip `access.ts` pattern: JWKS, `aud`, `exp`), exposed to the UI via something like `GET /api/auth/whoami`.
* Secrets `CF_ACCESS_TEAM_DOMAIN` and `CF_ACCESS_AUD` follow [ADR 08](adr-08-environment-variables.md): never committed; injected at deploy. Until both are set, identity is dormant: orb stays anonymous, public site unchanged.
* Logout uses Access’s `/cdn-cgi/access/logout` (or equivalent) once Access is active.

### 6. PRD amendment

PRD §2 Non-goals no longer lists “Account login / multi-user profiles” as a blanket ban. Replaced by: **no multi-user profiles product**; **optional Google identity** for feature unlock is in scope per this ADR.

## Positive Consequences

* Shareable, typed, and bookmarked login URLs without gating the brand homepage.
* Apex feature routes can read Access identity when the visitor signed in on `/me` (same host cookie).
* Aligns with Eurotrip’s Google IdP and verification code without copying its full-host gate.
* Clear place to put Access policies and to hang the minimal orb.

## Negative Consequences / Trade-offs

* Two public URLs require redirect discipline so cookies and Access apps do not fork.
* Access’s hosted Google step is briefly off-site (same as Eurotrip); the orb and `/me` remain ours.
* Avatar depends on IdP claims; may need UserInfo/`picture` or an initials fallback.
* `me.kodexarg.com` needs DNS + Worker route (or Pages/Workers custom domain) in addition to the path.

## Compliance & Validation

* `me.kodexarg.com` → 302 → `https://kodexarg.com/me`
* `www` / `home` `/me` → 302 → `https://kodexarg.com/me`
* Unauthenticated `GET /` and `POST /api/ask` succeed without Access
* Authenticated session after `/me` is visible to apex `whoami` when Access is configured
* No Google client secrets in git; only `CF_ACCESS_*` (and related) via secrets
* Orb is one Svelte component; no second login chrome without amending this ADR
