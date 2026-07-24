import type { RouterStrategy, RouteResult, RouterOptions } from '../types';
import { KODEX_DESTINATIONS } from '../destinations';

declare global {
	interface Window {
		ai?: {
			languageModel?: {
				capabilities(): Promise<{ available: 'readily' | 'after-download' | 'no' }>;
				create(options?: Record<string, unknown>): Promise<{
					prompt(input: string): Promise<string>;
					destroy(): void;
				}>;
			};
		};
	}
}

export class WindowAiStrategy implements RouterStrategy {
	name = 'Chrome Built-in AI (window.ai / Gemini Nano)';

	async isSupported(): Promise<boolean> {
		if (typeof window === 'undefined') return false;
		if (!window.ai?.languageModel) return false;
		try {
			const caps = await window.ai.languageModel.capabilities();
			return caps.available === 'readily' || caps.available === 'after-download';
		} catch {
			return false;
		}
	}

	async route(query: string, _options?: RouterOptions): Promise<RouteResult> {
		if (!window.ai?.languageModel) {
			throw new Error('window.ai is not available in this browser environment');
		}

		const session = await window.ai.languageModel.create({
			systemPrompt: `You are a strict action router for kodexArg public repositories.
Available destinations:
${KODEX_DESTINATIONS.map((d) => `- ${d.id}: ${d.name} (${d.url}) - ${d.description}`).join('\n')}

Output ONLY JSON: {"outcome": "Action", "destinationId": "<id>"} or {"outcome": "NO_MATCH"}. No prose.`
		});

		try {
			const prompt = `User prompt: "${query}"`;
			const rawResponse = await session.prompt(prompt);
			session.destroy();

			const cleanJson = rawResponse.replace(/```json|```/g, '').trim();
			const parsed = JSON.parse(cleanJson);

			if (parsed.outcome === 'Action' && parsed.destinationId) {
				const dest = KODEX_DESTINATIONS.find((d) => d.id === parsed.destinationId);
				if (dest) {
					return {
						outcome: 'Action',
						action: {
							kind: 'navigate',
							target: dest.url,
							label: dest.name,
							destination: dest
						},
						destination: dest,
						explanation: `Gemini Nano matched destination '${dest.id}'`,
						strategyName: this.name
					};
				}
			}
		} catch (err) {
			session.destroy();
			console.warn('[WindowAiStrategy] Execution failed or returned non-JSON:', err);
		}

		return {
			outcome: 'NO_MATCH',
			explanation: 'Built-in AI did not identify a matching destination',
			strategyName: this.name
		};
	}
}
