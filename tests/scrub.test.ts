import { describe, expect, it } from 'bun:test';
import {
	MAX_ANSWER_CHARS,
	MAX_PLACEHOLDER_CHARS,
	parseModelJson,
	scrubAnswerText,
	scrubPlaceholderText
} from '../src/lib/kodexbar/scrub';

describe('scrubAnswerText', () => {
	it('collapses multi-paragraph output into one line', () => {
		const out = scrubAnswerText('Primera línea.\n\nSegunda línea.\nTercera.');
		expect(out).toBe('Primera línea. Segunda línea. Tercera.');
		expect(out).not.toInclude('\n');
	});

	it('strips markdown emphasis, headings and list markers', () => {
		const out = scrubAnswerText('## Título\n\n- **Django** y _DRF_\n- `Python`');
		expect(out).toBe('Título Django y DRF Python');
		expect(out).not.toInclude('#');
		expect(out).not.toInclude('*');
		expect(out).not.toInclude('`');
	});

	it('removes fenced code blocks entirely', () => {
		const out = scrubAnswerText('Mirá esto:\n```js\nconst x = 1;\n```\nlisto.');
		expect(out).not.toInclude('const x');
		expect(out).toInclude('listo');
	});

	it('keeps a markdown link label but drops its URL', () => {
		const out = scrubAnswerText('Podés ver el [currículum](https://cv.kodexarg.com) acá.');
		expect(out).toInclude('currículum');
		expect(out).not.toInclude('cv.kodexarg.com');
		expect(out).not.toInclude('https');
	});

	it('strips bare URLs, bare domains and email addresses so links never leak into prose', () => {
		expect(scrubAnswerText('Entrá a https://github.com/kodexArg ya')).not.toInclude('github.com');
		expect(scrubAnswerText('Está en cv.kodexarg.com hoy')).not.toInclude('kodexarg.com');
		expect(scrubAnswerText('Escribile a gcavedal@gmail.com pronto')).not.toInclude('@gmail');
		expect(scrubAnswerText('Usá mailto:alguien@ejemplo.com ahora')).not.toInclude('mailto');
	});

	it('strips a URL the model invented for a domain we do not own', () => {
		const out = scrubAnswerText('Su portfolio está en https://gabriel-cavedal-fake.io/portfolio');
		expect(out).not.toInclude('gabriel-cavedal-fake');
		expect(out).not.toInclude('http');
	});

	it('truncates at a word boundary and never exceeds the cap', () => {
		const out = scrubAnswerText('palabra '.repeat(400));
		expect(out.length).toBeLessThanOrEqual(MAX_ANSWER_CHARS + 1);
		expect(out).not.toInclude('palab…');
	});

	it('returns an empty string for non-string input', () => {
		expect(scrubAnswerText(null)).toBe('');
		expect(scrubAnswerText(undefined)).toBe('');
		expect(scrubAnswerText({ text: 'hola' })).toBe('');
		expect(scrubAnswerText(42)).toBe('');
	});
});

describe('parseModelJson', () => {
	it('parses a clean JSON object', () => {
		expect(parseModelJson('{"text":"hola","linkIds":["cv"]}')).toEqual({
			text: 'hola',
			linkIds: ['cv']
		});
	});

	it('parses JSON wrapped in a markdown fence', () => {
		const out = parseModelJson('```json\n{"text":"hola","linkIds":[]}\n```');
		expect(out?.text).toBe('hola');
	});

	it('extracts the first balanced JSON object rather than trusting JSON.parse on the whole reply', () => {
		const out = parseModelJson('Claro, acá va: {"text":"hola","linkIds":["cv"]} ¡Listo!');
		expect(out).toEqual({ text: 'hola', linkIds: ['cv'] });
	});

	it('handles braces inside string values', () => {
		const out = parseModelJson('{"text":"usa {llaves} adentro","linkIds":[]}');
		expect(out?.text).toBe('usa {llaves} adentro');
	});

	it('drops non-string entries from linkIds', () => {
		const out = parseModelJson('{"text":"hola","linkIds":["cv",42,null,"email"]}');
		expect(out?.linkIds).toEqual(['cv', 'email']);
	});

	it('defaults missing fields instead of throwing', () => {
		expect(parseModelJson('{"text":"solo texto"}')).toEqual({ text: 'solo texto', linkIds: [] });
		expect(parseModelJson('{"linkIds":["cv"]}')).toEqual({ text: '', linkIds: ['cv'] });
	});

	it('returns null instead of a fallback the caller could render raw when there is no usable JSON', () => {
		expect(parseModelJson('Lo siento, no puedo ayudarte con eso.')).toBeNull();
		expect(parseModelJson('{"text": roto')).toBeNull();
		expect(parseModelJson('')).toBeNull();
		expect(parseModelJson(null)).toBeNull();
	});
});

describe('scrubPlaceholderText', () => {
	it('keeps a plain drafted request as written', () => {
		expect(scrubPlaceholderText('Mostrame el link al CV')).toBe('Mostrame el link al CV');
	});

	it('strips a URL the model slipped into the phrase', () => {
		expect(scrubPlaceholderText('Mirá cv.kodexarg.com')).toBe('Mirá');
	});

	it('unwraps the quotes a model puts around a phrase it is quoting', () => {
		expect(scrubPlaceholderText('"¿Cuáles son sus proyectos?"')).toBe('¿Cuáles son sus proyectos?');
	});

	it('rejects an over-long draft rather than truncating it into a broken question', () => {
		expect(scrubPlaceholderText('a'.repeat(MAX_PLACEHOLDER_CHARS + 1))).toBe('');
	});

	it('rejects anything that is not a string, so the caller falls back', () => {
		expect(scrubPlaceholderText(undefined)).toBe('');
		expect(scrubPlaceholderText(42)).toBe('');
	});
});

describe('parseModelJson and the drafted placeholder', () => {
	it('carries `next` through when the model supplies it', () => {
		const parsed = parseModelJson('{"text":"hola","linkIds":[],"next":"¿Y sus proyectos?"}');
		expect(parsed?.next).toBe('¿Y sus proyectos?');
	});

	it('leaves `next` undefined when the model omits it or sends the wrong type', () => {
		expect(parseModelJson('{"text":"hola","linkIds":[]}')?.next).toBeUndefined();
		expect(parseModelJson('{"text":"hola","linkIds":[],"next":7}')?.next).toBeUndefined();
	});
});
