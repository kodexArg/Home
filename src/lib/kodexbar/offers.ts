import type { SupportedLanguage } from '../ui/language';

export const OFFER_TTL_SECONDS = 300;

export interface PendingOffer {
	ids: string[];
	suggestion?: string;
	language: SupportedLanguage;
}

const DEFAULT_CONVERSATION_SCOPE = 'default';
const MAX_CONVERSATION_SCOPE_LENGTH = 64;

function sanitiseConversationScope(conversationId: unknown): string {
	if (typeof conversationId !== 'string') return '';
	return conversationId
		.toLowerCase()
		.replace(/[^a-z0-9-]/g, '')
		.slice(0, MAX_CONVERSATION_SCOPE_LENGTH);
}

export function offerKeyFor(clientId: string, conversationId: unknown): string {
	const scope = sanitiseConversationScope(conversationId) || DEFAULT_CONVERSATION_SCOPE;
	return `offer:${clientId}:${scope}`;
}

export async function putOffer(env: Env, key: string, offer: PendingOffer): Promise<boolean> {
	if (!env?.SESSION || offer.ids.length === 0) return false;

	try {
		await env.SESSION.put(key, JSON.stringify(offer), { expirationTtl: OFFER_TTL_SECONDS });
		return true;
	} catch (err) {
		console.error('[kodexbar] could not store link offer:', err);
		return false;
	}
}

function parseStoredOffer(stored: string): PendingOffer | null {
	const parsed = JSON.parse(stored) as Partial<PendingOffer> | null;
	const ids = Array.isArray(parsed?.ids)
		? parsed.ids.filter((v): v is string => typeof v === 'string')
		: [];
	if (ids.length === 0) return null;

	return {
		ids,
		suggestion: typeof parsed?.suggestion === 'string' ? parsed.suggestion : undefined,
		language: parsed?.language === 'en' ? 'en' : 'es'
	};
}

export async function takeOffer(env: Env, key: string): Promise<PendingOffer | null> {
	if (!env?.SESSION) return null;

	try {
		const stored = await env.SESSION.get(key);
		if (!stored) return null;

		await env.SESSION.delete(key).catch(() => {});

		return parseStoredOffer(stored);
	} catch (err) {
		console.error('[kodexbar] could not read link offer:', err);
		return null;
	}
}
