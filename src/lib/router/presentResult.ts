import type { RouteResult, RouteDestination } from './types';

/**
 * Presentation-layer formatter for RouteResult.
 *
 * adr-09: only allowlisted destinations may ever be rendered as a link, and
 * the UI must never reflect user input into an href. This formatter is a
 * FIXED TEMPLATE over static RouteDestination data (name/url/description) —
 * it never generates or rewrites prose, and never derives a URL from
 * anything other than `RouteDestination.url`. There is no LLM/system-prompt
 * step in this path.
 */

export type PresentedOutcome = 'action' | 'confirm' | 'no_match';

export interface PresentedResult {
	outcome: PresentedOutcome;
	/** Cordial opening phrase. Always fixed copy, never generated. */
	opener: string;
	/** Verbatim RouteDestination.name, when a destination is present. */
	name?: string;
	/** Verbatim RouteDestination.url, when a destination is present. Never derived from user input. */
	url?: string;
	/** Verbatim RouteDestination.description, when a destination is present. */
	description?: string;
	/** Optional trailing tentative question, only used for 'confirm'. */
	closer?: string;
}

const COPY = {
	es: {
		actionOpener: 'Sí, claro,',
		confirmOpener: 'Creo que buscás',
		confirmCloser: '¿Es esto lo que buscabas?',
		noMatchOpener: 'No estoy seguro a qué te referís, ¿podrías darme más detalles?'
	},
	en: {
		actionOpener: 'Sure, here you go,',
		confirmOpener: "I think you're looking for",
		confirmCloser: 'Is this what you meant?',
		noMatchOpener: "I'm not sure what you mean, could you give me more details?"
	}
} as const;

function bestCandidate(result: RouteResult): RouteDestination | undefined {
	return result.destination ?? result.options?.[0];
}

export function presentResult(result: RouteResult): PresentedResult {
	const lang = result.language === 'en' ? 'en' : 'es';
	const copy = COPY[lang];

	if (result.outcome === 'Action') {
		const destination = result.destination;
		if (destination) {
			return {
				outcome: 'action',
				opener: copy.actionOpener,
				name: destination.name,
				url: destination.url,
				description: destination.description
			};
		}
	}

	if (result.outcome === 'Confirm') {
		const destination = bestCandidate(result);
		if (destination) {
			return {
				outcome: 'confirm',
				opener: copy.confirmOpener,
				name: destination.name,
				url: destination.url,
				description: destination.description,
				closer: copy.confirmCloser
			};
		}
	}

	return {
		outcome: 'no_match',
		opener: copy.noMatchOpener
	};
}
