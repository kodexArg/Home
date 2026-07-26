import { defineChunks, type ChunkDef } from '../defineChunks';
import { computeGabrielCavedalAgeInYears } from './age';

const DEFS: ChunkDef[] = [
	{
		id: 'nombre-legal',
		title: 'Nombre completo y legal de Gabriel Cavedal, de dónde es',
		text: `¿Cuál es el nombre completo de Gabriel? ¿Cuál es su nombre legal? ¿De dónde es Gabriel
			Cavedal? Su nombre completo y legal es Gabriel Alejandro Cavedal Arce. Es de Mendoza,
			Argentina.`,
		related: ['nacimiento-edad'],
		tags: ['nombre completo', 'nombre legal', 'apellido', 'de donde es', 'origen', 'nacionalidad', 'mendoza', 'argentina', 'identidad']
	},
	{
		id: 'nacimiento-edad',
		title: 'Cuándo nació Gabriel Cavedal, qué edad tiene, cuántos años tiene',
		text: `¿Cuándo nació Gabriel? ¿Qué edad tiene? ¿Cuántos años tiene? Nació el 4 de abril de
			1978 en Mendoza, Argentina. Hoy tiene ${computeGabrielCavedalAgeInYears()} años.`,
		related: ['nombre-legal'],
		tags: ['edad', 'cuantos años tiene', 'que edad tiene', 'cuando nacio', 'fecha de nacimiento', 'nacimiento', 'cumpleanos', 'identidad']
	}
];

export const IDENTITY_CHUNKS_ES = defineChunks('identity', 'es', DEFS);
