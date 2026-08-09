import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "intereses-alcance",
		title: "Qué intereses personales se pueden preguntar, hobbies, gustos, qué le gusta fuera del laburo",
		text: `¿Qué intereses personales tiene Gabriel? ¿Cuáles son sus hobbies? ¿Qué le gusta fuera del laburo? KodexBar lleva un pack de notas sueltas sobre intereses personales, autorizado por él para publicación. Las notas se agregan de a una: gustos, aficiones y contexto de vida que no son trayectoria profesional ni datos civiles (nombre legal, nacimiento). Si todavía no hay una nota concreta para lo que preguntás, se puede decir con naturalidad que ese detalle aún no está en el corpus y ofrecer lo que sí esté recuperado.`,
		related: [],
		tags: ["intereses","hobbies","gustos","aficiones","que le gusta","fuera del laburo","vida personal","notas sueltas","tiempo libre"],
		visibility: "public",
		importance: "high",
	}
];

export const INTERESTS_CHUNKS_ES = defineChunks("interests", "es", DEFS);
