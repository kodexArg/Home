/**
 * Server-side rate limiting (adr-09 §7).
 *
 * The client cooldown in chatSession is a UX affordance and is trivially
 * bypassed by calling the endpoint directly; this is the actual control. It is
 * backed by the KV `SESSION` binding.
 *
 * KV is eventually consistent, so this is a coarse bound, not a precise
 * counter: a burst arriving simultaneously at several edge locations can
 * overshoot. That is acceptable — the goal is bounding denial-of-wallet
 * exposure, not exact accounting.
 */

export const WINDOW_SECONDS = 60;
export const MAX_REQUESTS_PER_WINDOW = 15;

export interface RateLimitResult {
	allowed: boolean;
	/** Seconds until the current window expires. Sent as Retry-After. */
	retryAfter: number;
}

const ALLOWED: RateLimitResult = { allowed: true, retryAfter: 0 };

/**
 * Consume one unit of quota for this client.
 *
 * **Fails open** when the binding is missing or KV errors: a rate limiter that
 * takes the site down when KV hiccups is worse than one that briefly stops
 * limiting. The retrieval gate still bounds cost in that window, since
 * off-topic traffic never reaches the generation model.
 */
export async function checkRateLimit(env: Env, clientId: string): Promise<RateLimitResult> {
	if (!env?.SESSION || !clientId) return ALLOWED;

	const window = Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
	const key = `rl:${clientId}:${window}`;

	try {
		const current = Number((await env.SESSION.get(key)) ?? '0');

		if (current >= MAX_REQUESTS_PER_WINDOW) {
			const elapsed = Math.floor(Date.now() / 1000) % WINDOW_SECONDS;
			return { allowed: false, retryAfter: WINDOW_SECONDS - elapsed };
		}

		// TTL is two windows so the key outlives its own window without piling up.
		await env.SESSION.put(key, String(current + 1), { expirationTtl: WINDOW_SECONDS * 2 });
		return ALLOWED;
	} catch (err) {
		console.error('[kodexbar] rate limit check failed, allowing request:', err);
		return ALLOWED;
	}
}

/**
 * Identify the caller.
 *
 * `CF-Connecting-IP` is set by Cloudflare's edge and cannot be spoofed by the
 * client on a request that actually reached the Worker. The fallbacks exist for
 * local development only.
 */
export function clientIdFrom(request: Request): string {
	return (
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
		'local'
	);
}
