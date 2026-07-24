import type { RouterStrategy, RouteResult, RouterOptions, RouteDestination } from '../types';
import { KODEX_DESTINATIONS } from '../destinations';

export class RuleBasedStrategy implements RouterStrategy {
	name = 'Deterministic Heuristic Router (Fast Local)';

	async isSupported(): Promise<boolean> {
		return true;
	}

	async route(query: string, options?: RouterOptions): Promise<RouteResult> {
		const lang = options?.language || 'es';
		const cleanQuery = query.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

		// Calculate score for each destination
		const scoredDestinations: Array<{ destination: RouteDestination; score: number }> = [];

		for (const dest of KODEX_DESTINATIONS) {
			const cleanName = dest.name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
			const cleanId = dest.id.toLowerCase();
			let matchCount = 0;
			let isExact = false;

			// Exact match on ID or Name
			if (cleanQuery === cleanId || cleanQuery === cleanName) {
				isExact = true;
			}

			// Keyword match
			for (const kw of dest.keywords) {
				const cleanKw = kw.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
				if (cleanQuery.includes(cleanKw)) {
					matchCount += 1;
				}
			}

			let score = 0;
			if (isExact) {
				score = 0.98;
			} else if (matchCount >= 2 || cleanQuery.includes(cleanId)) {
				score = 0.88;
			} else if (matchCount === 1) {
				score = 0.65;
			} else {
				score = 0.15;
			}

			scoredDestinations.push({ destination: dest, score });
		}

		// Sort by score descending
		scoredDestinations.sort((a, b) => b.score - a.score);
		const topMatch = scoredDestinations[0];

		if (!topMatch) {
			return {
				outcome: 'NO_MATCH',
				explanation: lang === 'es' ? 'No se encontraron repositorios.' : 'No matching repositories found.',
				strategyName: this.name,
				language: lang
			};
		}

		// Threshold 1: >= 85% Certainty -> High confidence direct navigation
		if (topMatch.score >= 0.85) {
			return {
				outcome: 'Action',
				action: {
					kind: 'navigate',
					target: topMatch.destination.url,
					label: topMatch.destination.name,
					destination: topMatch.destination
				},
				destination: topMatch.destination,
				score: topMatch.score,
				explanation: `Match high confidence (${(topMatch.score * 100).toFixed(0)}%) for ${topMatch.destination.name}`,
				strategyName: this.name,
				language: lang
			};
		}

		// Threshold 2: 50% - 85% Certainty -> Moderate confidence polite options response
		if (topMatch.score >= 0.50) {
			const candidateOptions = scoredDestinations
				.filter((d) => d.score >= 0.50)
				.slice(0, 3)
				.map((d) => d.destination);

			const promptMessage = lang === 'es'
				? `¿Sí? Encontré algunas opciones con certeza moderada (${(topMatch.score * 100).toFixed(0)}%). ¿Te referías a alguno de estos repositorios?`
				: `Yes? I found a few options with moderate certainty (${(topMatch.score * 100).toFixed(0)}%). Did you mean one of these repositories?`;

			return {
				outcome: 'Confirm',
				action: {
					kind: 'confirm',
					destination: topMatch.destination,
					options: candidateOptions,
					promptMessage
				},
				destination: topMatch.destination,
				options: candidateOptions,
				score: topMatch.score,
				explanation: `Moderate confidence (${(topMatch.score * 100).toFixed(0)}%) match. Offering options.`,
				strategyName: this.name,
				language: lang
			};
		}

		// Threshold 3: < 50% Certainty -> NO_MATCH
		return {
			outcome: 'NO_MATCH',
			score: topMatch.score,
			explanation: lang === 'es'
				? `Certeza por debajo del 50% (${(topMatch.score * 100).toFixed(0)}%). Especifica mejor la palabra clave.`
				: `Certainty below 50% (${(topMatch.score * 100).toFixed(0)}%). Please specify a clearer keyword.`,
			strategyName: this.name,
			language: lang
		};
	}
}

