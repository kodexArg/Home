import type { CorpusChunk } from './types';
import type { SupportedLanguage } from '../ui/language';

export const OPENING_SUGGESTION: Record<SupportedLanguage, string> = {
	es: '¿Quién es kodexArg?',
	en: "Who's kodexArg?"
};

export interface Suggestion {
	id: string;
	lang: SupportedLanguage;
	text: string;
	after: string[];
}

export const MAX_CANDIDATES = 4;

const ES: Omit<Suggestion, 'lang'>[] = [
	{
		id: 'contacto',
		text: '¿Cómo puedo contactarlo?',
		after: [
			'perfil', 'disponibilidad', 'exp-alvs', 'skill-backend', 'skill-cloud-devops',
			'skill-ia-agentes', 'skill-liderazgo', 'proj-coveris-aws', 'kodexarg-org'
		]
	},
	{
		id: 'disponible',
		text: '¿Está disponible para trabajar?',
		after: ['perfil', 'contacto', 'exp-alvs', 'skill-liderazgo', 'kodexbar-funcion']
	},
	{
		id: 'stack',
		text: '¿En qué tecnologías trabaja?',
		after: ['perfil', 'contacto', 'kodexbar-funcion', 'kodexarg-org', 'educacion']
	},
	{
		id: 'aws',
		text: '¿Qué experiencia tiene en AWS?',
		after: ['perfil', 'skill-backend', 'skill-linux', 'skill-infra-iot', 'exp-alvs', 'proj-alvs-cloud']
	},
	{
		id: 'ia',
		text: '¿Qué hace con IA y agentes?',
		after: ['perfil', 'skill-qa-metodo', 'skill-fullstack', 'kodexbar-funcion', 'proj-home-kodexbar']
	},
	{
		id: 'proyectos',
		text: '¿Qué proyectos tiene publicados?',
		after: ['perfil', 'kodexarg-org', 'skill-ia-agentes', 'skill-cloud-devops', 'repos-tools']
	},
	{
		id: 'trayectoria',
		text: '¿Dónde trabajó antes?',
		after: ['perfil', 'exp-alvs', 'contacto', 'skill-liderazgo']
	},
	{
		id: 'calidad',
		text: '¿Cómo asegura la calidad del código?',
		after: ['skill-ia-agentes', 'skill-backend', 'skill-fullstack', 'proj-coveris-metodo']
	},
	{
		id: 'formacion',
		text: '¿Qué formación tiene?',
		after: ['perfil', 'exp-casino-mendoza', 'skill-linux', 'idiomas']
	},
	{
		id: 'coveris',
		text: '¿Qué es Coveris?',
		after: ['skill-qa-metodo', 'skill-cloud-devops', 'skill-liderazgo', 'skill-backend']
	},
	{
		id: 'kodexbar',
		text: '¿Para qué sirve KodexBar?',
		after: ['kodexarg-org', 'proj-home-kodexbar', 'proj-design-system']
	},
	{
		id: 'orientacion',
		text: '¿Qué es este sitio y dónde estoy?',
		after: ['kodexbar-funcion', 'sitio-orientacion', 'proj-home-kodexbar', 'kodexarg-org']
	},
	{
		id: 'ayuda',
		text: '¿Qué le puedo preguntar?',
		after: ['kodexbar-funcion', 'que-le-puedo-preguntar', 'sitio-orientacion']
	},
	{
		id: 'origen',
		text: '¿Quién está detrás de este sitio?',
		after: ['perfil', 'kodexarg-org', 'quien-esta-detras-del-sitio', 'sitio-orientacion']
	},
	{
		id: 'edad',
		text: '¿Cuántos años tiene Gabriel?',
		after: ['perfil', 'nombre-legal', 'nacimiento-edad']
	}
];

const EN: Omit<Suggestion, 'lang'>[] = [
	{ id: 'contacto', text: 'How can I reach him?', after: ES[0].after },
	{ id: 'disponible', text: 'Is he available for work?', after: ES[1].after },
	{ id: 'stack', text: 'What technologies does he work with?', after: ES[2].after },
	{ id: 'aws', text: 'What is his AWS experience?', after: ES[3].after },
	{ id: 'ia', text: 'What does he do with AI and agents?', after: ES[4].after },
	{ id: 'proyectos', text: 'What projects has he published?', after: ES[5].after },
	{ id: 'trayectoria', text: 'Where did he work before?', after: ES[6].after },
	{ id: 'calidad', text: 'How does he keep code quality up?', after: ES[7].after },
	{ id: 'formacion', text: 'What is his background?', after: ES[8].after },
	{ id: 'coveris', text: 'What is Coveris?', after: ES[9].after },
	{ id: 'kodexbar', text: 'What is KodexBar for?', after: ES[10].after },
	{ id: 'orientacion', text: 'What is this site and where am I?', after: ES[11].after },
	{ id: 'ayuda', text: 'What can I ask you?', after: ES[12].after },
	{ id: 'origen', text: 'Who is behind this site?', after: ES[13].after },
	{ id: 'edad', text: 'How old is Gabriel?', after: ES[14].after }
];

export const SUGGESTIONS: readonly Suggestion[] = [
	...ES.map((s) => ({ ...s, lang: 'es' as const })),
	...EN.map((s) => ({ ...s, lang: 'en' as const }))
];

function localIdOf(chunkId: string): string {
	return chunkId.split(':')[1] ?? '';
}

export function candidatesFor(
	chunks: readonly CorpusChunk[],
	lang: SupportedLanguage
): Suggestion[] {
	const present = new Set(chunks.map((c) => localIdOf(c.id)));
	if (present.size === 0) return [];

	return SUGGESTIONS.filter((s) => s.lang === lang)
		.map((s) => ({ suggestion: s, weight: s.after.filter((id) => present.has(id)).length }))
		.filter((entry) => entry.weight > 0)
		.filter((entry) => !present.has(entry.suggestion.id))
		.sort((a, b) => b.weight - a.weight)
		.slice(0, MAX_CANDIDATES)
		.map((entry) => entry.suggestion);
}

export function resolveSuggestion(
	id: unknown,
	candidates: readonly Suggestion[]
): string | undefined {
	if (candidates.length === 0) return undefined;
	if (typeof id === 'string') {
		const picked = candidates.find((c) => c.id === id.trim());
		if (picked) return picked.text;
	}
	return candidates[0].text;
}
