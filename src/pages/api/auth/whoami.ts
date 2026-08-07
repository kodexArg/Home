import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { accessConfigured, verifyAccessJwt } from '../../../lib/access';
import { truncateDisplayName } from '../../../lib/auth/identitySurface';

export const prerender = false;

export interface WhoAmI {
	accessActive: boolean;
	authenticated: boolean;
	email: string | null;
	name: string | null;
	displayName: string | null;
	picture: string | null;
}

function json(body: WhoAmI, init?: ResponseInit): Response {
	return new Response(JSON.stringify(body), {
		...init,
		headers: {
			'Content-Type': 'application/json',
			'Cache-Control': 'no-store',
			...(init?.headers ?? {})
		}
	});
}

const anonymous = (accessActive: boolean): WhoAmI => ({
	accessActive,
	authenticated: false,
	email: null,
	name: null,
	displayName: null,
	picture: null
});

export const GET: APIRoute = async ({ request }) => {
	const team = env.CF_ACCESS_TEAM_DOMAIN;
	const aud = env.CF_ACCESS_AUD;

	if (!accessConfigured({ CF_ACCESS_TEAM_DOMAIN: team, CF_ACCESS_AUD: aud })) {
		return json(anonymous(false));
	}

	const assertion = request.headers.get('Cf-Access-Jwt-Assertion');
	if (!assertion) {
		return json(anonymous(true));
	}

	const identity = await verifyAccessJwt(assertion, team!, aud!);
	if (!identity) {
		return json(anonymous(true), { status: 401 });
	}

	const name = identity.name;
	return json({
		accessActive: true,
		authenticated: true,
		email: identity.email,
		name,
		displayName: name ? truncateDisplayName(name) : truncateDisplayName(identity.email.split('@')[0] ?? 'user'),
		picture: identity.picture
	});
};
