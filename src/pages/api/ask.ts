import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { handleAsk } from '../../kodexbar/askHandler';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => handleAsk(request, env);
