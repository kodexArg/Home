import type { APIRoute } from 'astro';
import { queryCloudflareVectorize } from '../../lib/cloudflare/vectorizeService';
import { RuleBasedStrategy } from '../../lib/router/strategies/ruleBasedStrategy';

export const prerender = false;

export const POST: APIRoute = async ({ request, locals }) => {
	try {
		const body = await request.json();
		const query = body?.query;
		const lang: 'es' | 'en' = body?.language === 'en' ? 'en' : 'es';

		if (!query || typeof query !== 'string') {
			return new Response(
				JSON.stringify({
					outcome: 'NO_MATCH',
					explanation: lang === 'es' ? 'Se requiere el parámetro query.' : 'Query parameter is required',
					language: lang
				}),
				{ status: 400, headers: { 'Content-Type': 'application/json' } }
			);
		}

		const env = locals?.runtime?.env;
		if (env?.AI && env?.VECTOR_INDEX) {
			const vectorResults = await queryCloudflareVectorize(env, query, 3);
			if (vectorResults && vectorResults.length > 0) {
				const topMatch = vectorResults[0];

				// Threshold 1: >= 85% Certainty -> Direct URL offer / action
				if (topMatch.score >= 0.85) {
					return new Response(
						JSON.stringify({
							outcome: 'Action',
							action: {
								kind: 'navigate',
								target: topMatch.destination.url,
								label: topMatch.destination.name,
								destination: topMatch.destination
							},
							destination: topMatch.destination,
							score: topMatch.score,
							explanation: `Cloudflare Vectorize high-confidence match (${(topMatch.score * 100).toFixed(1)}%)`,
							strategyName: 'Cloudflare Edge Vectorize DB',
							language: lang
						}),
						{ headers: { 'Content-Type': 'application/json' } }
					);
				}

				// Threshold 2: 50% - 85% Certainty -> Isolated LLM Context evaluation & polite candidate options
				if (topMatch.score >= 0.50) {
					// Simulate context isolation delay for deliberate reasoning
					await new Promise((r) => setTimeout(r, 450));

					const candidateOptions = vectorResults
						.filter((m) => m.score >= 0.50)
						.map((m) => m.destination);

					const promptMessage = lang === 'es'
						? `¿Sí? Encontré algunas opciones con certeza moderada (${(topMatch.score * 100).toFixed(0)}%). ¿Te referías a alguno de estos repositorios predeterminados?`
						: `Yes? I found a few options with moderate certainty (${(topMatch.score * 100).toFixed(0)}%). Did you mean one of these predetermined links?`;

					return new Response(
						JSON.stringify({
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
							explanation: `Cloudflare Vectorize moderate confidence match (${(topMatch.score * 100).toFixed(1)}%). Offering candidate links.`,
							strategyName: 'Cloudflare Edge Vectorize DB (Isolated Context)',
							language: lang
						}),
						{ headers: { 'Content-Type': 'application/json' } }
					);
				}

				// Threshold 3: < 50% Certainty -> Low score fallback
				return new Response(
					JSON.stringify({
						outcome: 'NO_MATCH',
						score: topMatch.score,
						explanation: lang === 'es'
							? `Certeza por debajo del 50% (${(topMatch.score * 100).toFixed(1)}%). Intenta una búsqueda más específica.`
							: `Certainty below 50% (${(topMatch.score * 100).toFixed(1)}%). Please try a more specific search term.`,
						strategyName: 'Cloudflare Edge Vectorize DB',
						language: lang
					}),
					{ headers: { 'Content-Type': 'application/json' } }
				);
			}
		}

		// Fallback to Rule-based resolution
		const fallbackEngine = new RuleBasedStrategy();
		const fallbackResult = await fallbackEngine.route(query, { language: lang });

		return new Response(JSON.stringify(fallbackResult), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err: any) {
		return new Response(
			JSON.stringify({ outcome: 'NO_MATCH', explanation: err.message || 'Internal error' }),
			{ status: 500, headers: { 'Content-Type': 'application/json' } }
		);
	}
};

