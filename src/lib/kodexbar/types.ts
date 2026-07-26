import type { SupportedLanguage } from '../ui/language';

export type DestinationKind = 'site' | 'repo' | 'contact';

export interface LinkDestination {
	id: string;
	kind: DestinationKind;
	name: string;
	url: string;
	description: string;
	keywords: string[];
}

export interface CorpusChunk {
	id: string;
	pack: string;
	lang: SupportedLanguage;
	title: string;
	text: string;
	related: string[];
	tags: string[];
}

export interface KnowledgePack {
	id: string;
	description: string;
	systemPromptFragment: string;
	minScore: number;
	chunks: CorpusChunk[];
}

export interface RawModelAnswer {
	text: string;
	linkIds: string[];
	nextId?: string;
}

export interface KodexAnswer {
	text: string;
	links: LinkDestination[];
	language: SupportedLanguage;
	matched: boolean;
	score?: number;
	suggestion?: string;
	offer?: boolean;
}
