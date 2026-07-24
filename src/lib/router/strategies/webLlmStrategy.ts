import type { RouterStrategy, RouteResult, RouterOptions } from '../types';
import { KODEX_DESTINATIONS } from '../destinations';

export class WebLlmStrategy implements RouterStrategy {
	name = 'WebLLM / WebGPU SLM (Client-Side In-Browser)';

	async isSupported(): Promise<boolean> {
		if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
		return 'gpu' in navigator && !!navigator.gpu;
	}

	async route(query: string, options?: RouterOptions): Promise<RouteResult> {
		const lang = options?.language || 'es';
		const cleanQuery = query.toLowerCase();

		const matchedDest = KODEX_DESTINATIONS.find((d) =>
			d.keywords.some((kw) => cleanQuery.includes(kw))
		);

		if (matchedDest) {
			return {
				outcome: 'Action',
				action: {
					kind: 'navigate',
					target: matchedDest.url,
					label: matchedDest.name,
					destination: matchedDest
				},
				destination: matchedDest,
				score: 0.90,
				explanation: `WebGPU client router resolved target: ${matchedDest.name}`,
				strategyName: this.name,
				language: lang
			};
		}

		return {
			outcome: 'NO_MATCH',
			score: 0.20,
			explanation: 'WebGPU router found no matching target',
			strategyName: this.name,
			language: lang
		};
	}
}

