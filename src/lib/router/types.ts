export interface RouteDestination {
	id: string;
	name: string;
	url: string;
	description: string;
	keywords: string[];
}

export type RouterActionKind = 'navigate' | 'confirm' | 'status';

export interface RouterAction {
	kind: RouterActionKind;
	target?: string;
	label?: string;
	destination?: RouteDestination;
	options?: RouteDestination[];
	promptMessage?: string;
}

export interface RouteResult {
	outcome: 'Action' | 'Confirm' | 'NO_MATCH' | 'Escalate';
	action?: RouterAction;
	destination?: RouteDestination;
	options?: RouteDestination[];
	/**
	 * Score is strategy-local and NOT comparable across strategies:
	 * RuleBasedStrategy uses hand-tuned constants (0.98/0.88/0.65/0.15),
	 * while CloudflareVectorizeStrategy emits raw cosine similarity
	 * (observed range ~0.55-0.72). Do not write `if (a.score > b.score)`
	 * to compare results from different strategies.
	 */
	score?: number;
	explanation: string;
	strategyName: string;
	language?: 'es' | 'en';
}

export interface RouterOptions {
	language?: 'es' | 'en';
}

export interface RouterStrategy {
	name: string;
	isSupported(): Promise<boolean>;
	route(query: string, options?: RouterOptions): Promise<RouteResult>;
}

