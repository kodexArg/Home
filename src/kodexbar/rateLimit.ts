export const WINDOW_SECONDS = 60;
export const MAX_REQUESTS_PER_WINDOW = 15;
const RATE_LIMIT_KEY_TTL_SECONDS = WINDOW_SECONDS * 2;

export interface RateLimitResult {
	allowed: boolean;
	retryAfter: number;
}

const ALLOWED_NO_RETRY: RateLimitResult = { allowed: true, retryAfter: 0 };

function currentWindowId(): number {
	return Math.floor(Date.now() / (WINDOW_SECONDS * 1000));
}

function secondsElapsedInCurrentWindow(): number {
	return Math.floor(Date.now() / 1000) % WINDOW_SECONDS;
}

function rateLimitKeyFor(clientId: string): string {
	return `rl:${clientId}:${currentWindowId()}`;
}

export async function checkRateLimit(env: Env, clientId: string): Promise<RateLimitResult> {
	if (!env?.SESSION || !clientId) return ALLOWED_NO_RETRY;

	const key = rateLimitKeyFor(clientId);

	try {
		const requestsSoFar = Number((await env.SESSION.get(key)) ?? '0');

		if (requestsSoFar >= MAX_REQUESTS_PER_WINDOW) {
			return { allowed: false, retryAfter: WINDOW_SECONDS - secondsElapsedInCurrentWindow() };
		}

		await env.SESSION.put(key, String(requestsSoFar + 1), {
			expirationTtl: RATE_LIMIT_KEY_TTL_SECONDS
		});
		return ALLOWED_NO_RETRY;
	} catch (err) {
		console.error('[kodexbar] rate limit check failed, allowing request:', err);
		return ALLOWED_NO_RETRY;
	}
}

export function clientIdFrom(request: Request): string {
	return (
		request.headers.get('CF-Connecting-IP') ||
		request.headers.get('X-Forwarded-For')?.split(',')[0]?.trim() ||
		'local'
	);
}
