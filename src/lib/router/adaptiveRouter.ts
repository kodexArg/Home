import type { RouterStrategy, RouteResult } from './types';
import { RuleBasedStrategy } from './strategies/ruleBasedStrategy';
import { WindowAiStrategy } from './strategies/windowAiStrategy';
import { CloudflareVectorizeStrategy } from './strategies/cloudflareVectorizeStrategy';

const DEFAULT_STRATEGIES: RouterStrategy[] = [
	new WindowAiStrategy(),
	new CloudflareVectorizeStrategy(),
	new RuleBasedStrategy()
];

export class AdaptiveRouter {
	private strategies: RouterStrategy[];
	private supportedStrategies: RouterStrategy[] | null = null;

	constructor(strategies: RouterStrategy[] = DEFAULT_STRATEGIES) {
		this.strategies = strategies;
	}

	getStrategies(): RouterStrategy[] {
		return this.strategies;
	}

	private async resolveSupportedStrategies(): Promise<RouterStrategy[]> {
		if (this.supportedStrategies) return this.supportedStrategies;

		const supported: RouterStrategy[] = [];
		for (const strategy of this.strategies) {
			try {
				if (await strategy.isSupported()) {
					supported.push(strategy);
				}
			} catch (e) {
				console.warn(`Strategy ${strategy.name} check failed:`, e);
			}
		}

		// RuleBasedStrategy.isSupported() is always true, so as long as it is
		// part of the configured strategy list this will never be empty. If a
		// caller supplies a custom list without a guaranteed-supported
		// fallback, fall back to whatever was configured to avoid crashing.
		this.supportedStrategies = supported.length > 0 ? supported : this.strategies;
		return this.supportedStrategies;
	}

	async route(query: string, options?: import('./types').RouterOptions): Promise<RouteResult> {
		const strategies = await this.resolveSupportedStrategies();

		let lastResult: RouteResult | null = null;

		for (const strategy of strategies) {
			try {
				const result = await strategy.route(query, options);
				lastResult = result;
				if (result.outcome !== 'NO_MATCH') {
					return result;
				}
			} catch (err) {
				console.warn(`[AdaptiveRouter] Strategy ${strategy.name} failed during routing, trying next strategy:`, err);
			}
		}

		if (lastResult) return lastResult;

		// Every strategy threw; fall back to RuleBasedStrategy as a last resort.
		const fallback = new RuleBasedStrategy();
		return await fallback.route(query, options);
	}
}

export const globalAdaptiveRouter = new AdaptiveRouter();
