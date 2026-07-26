import { describe, expect, it } from 'bun:test';
import { allChunks, getChunk, getPack, minScoreFor } from '../src/lib/kodexbar/packs';
import { SUPPORTED_LANGUAGES } from '../src/lib/ui/language';
import {
	GABRIEL_CAVEDAL_BIRTH_DAY,
	GABRIEL_CAVEDAL_BIRTH_MONTH,
	GABRIEL_CAVEDAL_BIRTH_YEAR,
	computeGabrielCavedalAgeInYears
} from '../src/lib/kodexbar/packs/identity/age';

const identityChunksInLanguage = (lang: 'es' | 'en') =>
	allChunks()
		.filter((chunk) => chunk.pack === 'identity' && chunk.lang === lang)
		.map((chunk) => chunk.id.split(':')[1])
		.sort();

describe('identity pack registration', () => {
	it('is registered alongside the cv pack', () => {
		expect(getPack('identity')).toBeDefined();
		expect(getPack('cv')).toBeDefined();
	});

	it('gates strictly above the cv pack, so collateral retrieval never surfaces personal facts', () => {
		const identityGate = minScoreFor('identity');
		const cvGate = minScoreFor('cv');
		expect(identityGate).toBeGreaterThan(cvGate);
		expect(identityGate).toBeLessThan(1);
	});

	it('carries the exact same local chunk ids in both languages', () => {
		const es = identityChunksInLanguage('es');
		const en = identityChunksInLanguage('en');
		expect(es.length).toBeGreaterThan(0);
		expect(es).toEqual(en);
	});

	it('gives the pack a non-empty system prompt fragment demanding exactness', () => {
		const pack = getPack('identity')!;
		expect(pack.systemPromptFragment.trim().length).toBeGreaterThan(0);
	});
});

describe('identity facts as authored', () => {
	it('states the exact full legal name in both languages', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			const chunk = getChunk(`identity:nombre-legal:${lang}`);
			expect(chunk).toBeDefined();
			expect(chunk!.text).toInclude('Gabriel Alejandro Cavedal Arce');
			expect(chunk!.text).toInclude('Mendoza');
			expect(chunk!.text).toInclude('Argentina');
		}
	});

	it('states the birth date and never bakes a hardcoded age number', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			const chunk = getChunk(`identity:nacimiento-edad:${lang}`);
			expect(chunk).toBeDefined();
			expect(chunk!.text).toInclude('1978');
			expect(chunk!.text).toInclude(`${computeGabrielCavedalAgeInYears()}`);
		}
	});

	it('does not leave behind the removed cv chunk that denied a published age', () => {
		for (const lang of SUPPORTED_LANGUAGES) {
			expect(getChunk(`cv:edad-gabriel:${lang}`)).toBeUndefined();
		}
	});
});

describe('computeGabrielCavedalAgeInYears', () => {
	const birthdayUTC = (year: number, dayOffset: number) =>
		new Date(Date.UTC(year, GABRIEL_CAVEDAL_BIRTH_MONTH - 1, GABRIEL_CAVEDAL_BIRTH_DAY + dayOffset));

	it('has not turned the new age yet the day before the birthday', () => {
		const referenceDate = birthdayUTC(2026, -1);
		expect(computeGabrielCavedalAgeInYears(referenceDate)).toBe(2026 - GABRIEL_CAVEDAL_BIRTH_YEAR - 1);
	});

	it('turns the new age exactly on the birthday', () => {
		const referenceDate = birthdayUTC(2026, 0);
		expect(computeGabrielCavedalAgeInYears(referenceDate)).toBe(2026 - GABRIEL_CAVEDAL_BIRTH_YEAR);
	});

	it('keeps the new age the day after the birthday', () => {
		const referenceDate = birthdayUTC(2026, 1);
		expect(computeGabrielCavedalAgeInYears(referenceDate)).toBe(2026 - GABRIEL_CAVEDAL_BIRTH_YEAR);
	});

	it('has not turned the new age yet a year that has not reached the birth month', () => {
		const referenceDate = new Date(Date.UTC(2026, GABRIEL_CAVEDAL_BIRTH_MONTH - 2, 15));
		expect(computeGabrielCavedalAgeInYears(referenceDate)).toBe(2026 - GABRIEL_CAVEDAL_BIRTH_YEAR - 1);
	});

	it('has already turned the new age in a month past the birth month', () => {
		const referenceDate = new Date(Date.UTC(2026, GABRIEL_CAVEDAL_BIRTH_MONTH, 15));
		expect(computeGabrielCavedalAgeInYears(referenceDate)).toBe(2026 - GABRIEL_CAVEDAL_BIRTH_YEAR);
	});

	it('defaults to deriving from the current date when none is given', () => {
		expect(computeGabrielCavedalAgeInYears()).toBe(computeGabrielCavedalAgeInYears(new Date()));
	});
});
