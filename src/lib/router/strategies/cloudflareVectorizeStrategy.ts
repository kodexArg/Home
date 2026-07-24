import type { RouterStrategy, RouteResult, RouterOptions } from '../types';

export class CloudflareVectorizeStrategy implements RouterStrategy {
	name = 'Cloudflare Edge Vectorize DB (Workers AI)';

	async isSupported(): Promise<boolean> {
		return typeof window !== 'undefined';
	}

	async route(query: string, options?: RouterOptions): Promise<RouteResult> {
		try {
			const res = await fetch('/api/vector-route', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ query, language: options?.language || 'es' })
			});

			if (res.ok) {
				const data = await res.json();
				if (data.destination || data.outcome) {
					return data;
				}
			}
		} catch (e) {
			console.warn('[CloudflareVectorizeStrategy] Edge vector API call failed:', e);
		}

		throw new Error('Cloudflare Vectorize edge API unreachable');
	}
}
