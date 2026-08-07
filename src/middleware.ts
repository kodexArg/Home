import { defineMiddleware } from 'astro:middleware';
import { redirectToCanonicalMe } from './lib/auth/identitySurface';

export const onRequest = defineMiddleware((context, next) => {
	const bounce = redirectToCanonicalMe(context.url);
	if (bounce) {
		return Response.redirect(bounce, 302);
	}
	return next();
});
