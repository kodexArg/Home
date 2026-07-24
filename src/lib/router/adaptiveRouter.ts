import type { RouterStrategy, RouteResult } from './types';
import { RuleBasedStrategy } from './strategies/ruleBasedStrategy';
import { WindowAiStrategy } from './strategies/windowAiStrategy';
import { WebLlmStrategy } from './strategies/webLlmStrategy';
import { CloudflareVectorizeStrategy } from './strategies/cloudflareVectorizeStrategy';

export class AdaptiveRouter {
	private strategies: RouterStrategy[];
	private activeStrategy: RouterStrategy | null = null;

	constructor() {
		this.strategies = [
			new WindowAiStrategy(),
			new WebLlmStrategy(),
			new CloudflareVectorizeStrategy(),
			new RuleBasedStrategy()
		];
	}

	async resolveActiveStrategy(): Promise<RouterStrategy> {
		if (this.activeStrategy) return this.activeStrategy;

		for (const strategy of this.strategies) {
			try {
				if (await strategy.isSupported()) {
					this.activeStrategy = strategy;
					return strategy;
				}
			} catch (e) {
				console.warn(`Strategy ${strategy.name} check failed:`, e);
			}
		}

		// Fallback to RuleBasedStrategy
		this.activeStrategy = new RuleBasedStrategy();
		return this.activeStrategy;
	}

	async route(query: string, options?: import('./types').RouterOptions): Promise<RouteResult> {
		const strategy = await this.resolveActiveStrategy();
		try {
			return await strategy.route(query, options);
		} catch (err) {
			console.warn(`[AdaptiveRouter] Strategy ${strategy.name} failed during routing, trying fallback strategy:`, err);
			const fallback = new RuleBasedStrategy();
			return await fallback.route(query, options);
		}
	}
}

export const globalAdaptiveRouter = new AdaptiveRouter();
