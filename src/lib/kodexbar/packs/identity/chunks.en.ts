import { defineChunks, type ChunkDef } from '../defineChunks';
import { computeGabrielCavedalAgeInYears } from './age';

const DEFS: ChunkDef[] = [
	{
		id: 'nombre-legal',
		title: "Gabriel Cavedal's full legal name, where he is from",
		text: `What is Gabriel's full name? What is his legal name? Where is Gabriel Cavedal from?
			His full legal name is Gabriel Alejandro Cavedal Arce. He is from Mendoza, Argentina.`,
		related: ['nacimiento-edad'],
		tags: ['full name', 'legal name', 'last name', 'where is he from', 'origin', 'nationality', 'mendoza', 'argentina', 'identity']
	},
	{
		id: 'nacimiento-edad',
		title: 'When was Gabriel Cavedal born, how old is he, his age',
		text: `When was Gabriel born? How old is he? What is his age? He was born on April 4, 1978,
			in Mendoza, Argentina. He is currently ${computeGabrielCavedalAgeInYears()} years old.`,
		related: ['nombre-legal'],
		tags: ['age', 'how old is he', 'how old', 'birth date', 'when was he born', 'birthday', 'identity']
	}
];

export const IDENTITY_CHUNKS_EN = defineChunks('identity', 'en', DEFS);
