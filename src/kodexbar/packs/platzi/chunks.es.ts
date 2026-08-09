import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "algebra-lineal-py",
		title: "Curso Platzi Fundamentos de Álgebra Lineal con Python",
		text: `Gabriel aprobó en Platzi el Curso de Fundamentos de Álgebra Lineal con Python el 28 de marzo de 2024.

Demuestra entorno Anaconda y Jupyter; escalares, vectores, matrices y tensores; transposición, suma, broadcasting y producto interno; sistemas de ecuaciones con inversa; combinaciones lineales, dependencia lineal, normas, ángulos, matrices diagonales y simétricas, ortogonalidad, y traza y determinante orientados a datos y machine learning.`,
		related: ["platzi"],
		tags: ["platzi","algebra lineal","python","numpy","matrices","vectores","machine learning","jupyter"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "aws-ec2",
		title: "Curso Platzi Práctico de AWS Cómputo con EC2",
		text: `Gabriel aprobó en Platzi el Curso Práctico de AWS: Cómputo con EC2 el 20 de abril de 2023.

Demuestra fundamentos de EC2, tipos de instancia, modelos de compra y responsabilidad compartida.

Labs de instancias, grupos de seguridad, SSH (incluido Windows y PowerShell), EC2 Instance Connect, roles de instancia sin credenciales permanentes, limpieza de recursos y presupuestos.`,
		related: ["platzi"],
		tags: ["platzi","aws","ec2","computo","ssh","security groups","instancias","iam roles"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "aws-fundamentos",
		title: "Curso Platzi Introducción a AWS Fundamentos de Cloud Computing",
		text: `Gabriel aprobó en Platzi el Curso de Introducción a AWS: Fundamentos de Cloud Computing el 12 de septiembre de 2025.

Demuestra comprensión de cloud frente a infraestructura IT tradicional, modelos IaaS PaaS y SaaS, historia e infraestructura global de AWS, y alta de cuenta. En seguridad e identidad cubrió IAM (usuarios, grupos y roles), Secrets Manager, Directory Service, creación de usuarios y grupos, y alertas de facturación.

En la práctica desplegó una web estática con S3 y DNS con Route 53.`,
		related: ["platzi"],
		tags: ["platzi","aws","cloud","cloud computing","s3","iam","route 53","fundamentos aws"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "bases-datos-sql",
		title: "Curso Platzi Bases de Datos con SQL",
		text: `Gabriel aprobó en Platzi el Curso de Bases de Datos con SQL el 9 de marzo de 2025.

Demuestra modelo relacional (entidades, relaciones, diagrama ER, normalización), DDL y DML (CREATE, ALTER, INSERT, SELECT, UPDATE, DELETE), claves primarias y foráneas, ORDER BY y LIMIT, funciones de texto, entorno PostgreSQL, agregaciones con GROUP BY y HAVING, e INNER JOIN y LEFT JOIN en un caso de negocio tipo tienda para reportes.`,
		related: ["platzi"],
		tags: ["platzi","sql","bases de datos","postgresql","modelo relacional","join","consultas"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "computacion-basica",
		title: "Curso Platzi Básico de Computadores e Informática",
		text: `Gabriel aprobó en Platzi el Curso Básico de Computadores e Informática el 26 de marzo de 2025.

Demuestra fundamentos de binario, hardware, puertos y elección de PC; uso de Windows (escritorio, archivos, instalación de apps); navegación segura, correo con verificación en dos pasos, ofimática, herramientas creativas y Visual Studio Code; y seguridad (virus, actualizaciones, antivirus, firewall, phishing y gestores de contraseñas).`,
		related: ["platzi"],
		tags: ["platzi","computacion basica","informatica","windows","seguridad","antivirus","phishing"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "django-basico",
		title: "Curso Platzi Básico de Django",
		text: `Gabriel aprobó en Platzi el Curso Básico de Django el 14 de abril de 2022.

Demuestra instalación y estructura de un proyecto Django, servidor de desarrollo, settings, ORM y modelos (Question y Choice en Premios Platzi App), shell interactivo, filtros, Django Admin básico, views, templates, error 404, etiqueta url, formularios (vote y results), y Generic Views.`,
		related: ["platzi"],
		tags: ["platzi","django","python","backend","orm","modelos","vistas","templates","generic views"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "django-intermedio",
		title: "Curso Platzi Django Intermedio Testing Static Files Admin",
		text: `Gabriel aprobó en Platzi el Curso de Django Intermedio: Testing, Static Files, Django Admin el 14 de abril de 2022.

Demuestra qué son los tests y cómo escribirlos (incluido testing de views IndexView y DetailView), static files (estilos e imagen de fondo), mejoras del Django Admin (Questions y Change List), y ajustes de frontend hacia una primera versión presentable de la app de la saga.`,
		related: ["platzi"],
		tags: ["platzi","django","testing","static files","django admin","python","backend","tests"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "docker",
		title: "Curso Platzi de Docker",
		text: `Gabriel aprobó en Platzi el Curso de Docker el 4 de mayo de 2022.

Demuestra virtualización frente a contenedores, entorno de trabajo, ciclo de vida de contenedores, modo interactivo, exposición de puertos, bind mounts y volúmenes, copia de archivos, construcción de imágenes y capas, Docker como herramienta de desarrollo, networking entre contenedores.

Docker Compose (incluido override en equipo), ENTRYPOINT frente a CMD, SHELL frente a EXEC, contexto de build, multi-stage build y Docker-in-Docker.`,
		related: ["platzi"],
		tags: ["platzi","docker","contenedores","imagenes","compose","volumes","devops","virtualizacion"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-b2",
		title: "Curso Platzi Inglés B2 Discurso Indirecto y Condicionales",
		text: `Gabriel aprobó en Platzi el Curso de Inglés Intermedio Alto B2: Discurso Indirecto y Condicionales el 28 de enero de 2023.

Demuestra futuro perfecto pasivo, tercer condicional, participios, hipotéticos con as if y as though, registro formal e informal, reported speech en voz pasiva, cleft sentences, only if, inversión con adverbios negativos, y práctica oral profesional.`,
		related: ["platzi"],
		tags: ["platzi","ingles","english","b2","discurso indirecto","condicionales","reported speech"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-opiniones",
		title: "Curso Platzi Inglés B2 Comentarios y Opiniones",
		text: `Gabriel aprobó en Platzi el Curso de Inglés Intermedio Alto B2: Comentarios y Opiniones el 5 de abril de 2022.

Demuestra futuro continuo, verbos de reporte, pasado perfecto continuo, contrastes (however, on the other hand, even though), appear seem look, worth y point, intenciones pasadas, creencias en voz pasiva, I hear that, should y ought to, énfasis con do does did, comparaciones complejas, relative clauses (who whom whose which that where), y subordinadas con as soon as y as much as.`,
		related: ["platzi"],
		tags: ["platzi","ingles","english","b2","opiniones","comentarios","comparaciones","relative clauses"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-pasado-perfecto",
		title: "Curso Platzi Inglés B2 Pasado Perfecto Pasivo y Frases Adverbiales",
		text: `Gabriel aprobó en Platzi el Curso de Inglés Intermedio Alto: Pasado Perfecto Pasivo y Frases Adverbiales (2021) el 10 de abril de 2022.

Demuestra instrucciones y necesidades, frases adverbiales, pasado perfecto con adverbiales de tiempo, futuro perfecto, lenguaje analítico y voz pasiva, gerundios pasivos, past perfect passive, expresiones de prioridades laborales, would rather, as if frente a as though, so as to, y shall en inglés británico, con práctica profesional.`,
		related: ["platzi"],
		tags: ["platzi","ingles","english","b2","pasado perfecto","frases adverbiales","voz pasiva"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-suposiciones",
		title: "Curso Platzi Inglés B2 Suposiciones e Instrucciones",
		text: `Gabriel aprobó en Platzi el Curso de Inglés Intermedio Alto B2: Suposiciones e Instrucciones el 4 de abril de 2022.

Demuestra infinitivos (in order to, so as to, sujeto y complemento), supposed to y meant to, pedidos corteses, reglas e instrucciones, infinitivos pasivos, forbid y allow, discurso indirecto con infinitivos, cleft sentences con what y that, cláusulas restrictivas y no restrictivas, whether or not, y expresión de razón, probabilidad y contraste (while, whereas, certainly, probably) en contextos de oficina, hotel, restaurante y hospital.`,
		related: ["platzi"],
		tags: ["platzi","ingles","english","b2","suposiciones","instrucciones","infinitivos","oraciones relativas"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "js-clean-code",
		title: "Curso Platzi Clean Code y Buenas Prácticas con JavaScript",
		text: `Gabriel aprobó en Platzi el Curso de Clean Code y Buenas Prácticas con JavaScript el 7 de abril de 2025.

Demuestra código limpio, deuda técnica y refactorización, nomenclatura (camelCase, nombres por tipo), ámbito de variables y hoisting, funciones (declaración, expresión, arrow y this), POO con ES6, herencia y responsabilidad única, comentarios útiles, formato en equipo, principio DRY, y nociones de algoritmos y complejidad Big O en JavaScript.`,
		related: ["platzi"],
		tags: ["platzi","clean code","javascript","buenas practicas","refactor","deuda tecnica","dry","nomenclatura"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "linux-servidores",
		title: "Curso Platzi Administración de Servidores Linux",
		text: `Gabriel aprobó en Platzi el Curso de Administración de Servidores Linux el 18 de enero de 2023.

Demuestra (según temario histórico del curso) Linux en servidores, VM y SSH (tmux, Vim), paquetes y repositorios, sistema de archivos, particiones, swap, GRUB y LVM, systemd, procesos, usuarios y grupos, cron, permisos, red y firewall, DNS, NTP, auditoría, túneles SSH y endurecimiento (fail2ban).`,
		related: ["platzi"],
		tags: ["platzi","linux","servidores","ssh","systemd","lvm","permisos","administracion"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "pensamiento-prob",
		title: "Curso Platzi Introducción al Pensamiento Probabilístico",
		text: `Gabriel aprobó en Platzi el Curso de Introducción al Pensamiento Probabilístico el 30 de marzo de 2022.

Demuestra programación probabilística frente a estocástica, probabilidad condicional, Teorema de Bayes (intuición, visualización y cálculo en Python), aplicaciones modernas, errores y mentiras estadísticas (gráficas, correlación frente a causalidad, muestreo, falacia del francotirador, porcentajes, regresión a la media), introducción a machine learning (vectores, métricas de distancia), agrupamiento (jerárquico y K-means) y clasificación (incluido K-Nearest Neighbors).`,
		related: ["platzi"],
		tags: ["platzi","probabilidad","bayes","pensamiento probabilistico","machine learning","estadistica","python","clustering"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "platzi-alcance",
		title: "Qué cursos de Platzi completó Gabriel, diplomas aprobados y certificaciones",
		text: `¿Qué cursos de Platzi completó Gabriel? ¿Qué diplomas tiene aprobados?

KodexBar lleva un pack con sus dieciocho cursos de Platzi aprobados con diploma.

## Cursos aprobados

- Introducción a AWS Fundamentos de Cloud Computing (12 sep 2025)
- Clean Code y Buenas Prácticas con JavaScript (7 abr 2025)
- Básico de Computadores e Informática (26 mar 2025)
- Bases de Datos con SQL (9 mar 2025)
- Fundamentos de Álgebra Lineal con Python (28 mar 2024)
- Svelte (20 ago 2023)
- Práctico de AWS Cómputo con EC2 (20 abr 2023)
- Inglés Intermedio Alto B2 Discurso Indirecto y Condicionales (28 ene 2023)
- Administración de Servidores Linux (18 ene 2023)
- Scrapy (10 may 2022)
- Docker (4 may 2022)
- Django Intermedio Testing Static Files Django Admin (14 abr 2022)
- Básico de Django (14 abr 2022)
- Fundamentos de Web Scraping con Python y Xpath (12 abr 2022)
- Inglés Intermedio Alto Pasado Perfecto Pasivo y Frases Adverbiales (10 abr 2022)
- Inglés Intermedio Alto B2 Comentarios y Opiniones (5 abr 2022)
- Inglés Intermedio Alto B2 Suposiciones e Instrucciones (4 abr 2022)
- Introducción al Pensamiento Probabilístico (30 mar 2022)

Cada curso tiene su nota de qué aprendió. Este pack no inventa cursos fuera de esa lista.`,
		related: ["platzi"],
		tags: ["platzi","cursos","certificaciones","diplomas","formacion","que estudio","que aprendio","educacion continua","aprobados"],
		visibility: "public",
		importance: "high",
	},
	{
		id: "scrapy",
		title: "Curso Platzi de Scrapy",
		text: `Gabriel aprobó en Platzi el Curso de Scrapy el 10 de mayo de 2022.

Demuestra el framework asíncrono Scrapy: instalación, Hello World, generadores e iteradores, Scrapy Shell, estructura de proyecto, spiders, extracción con XPath, guardado de datos, response.follow, múltiples callbacks, argumentos al spider y settings útiles.

En el proyecto Platzi Intelligence Agency armó un spider sobre un sitio tipo CIA, frontend, deploy a GitHub Pages y Scrapy Cloud, más automatización con la API y prácticas para evitar problemas legales.`,
		related: ["platzi"],
		tags: ["platzi","scrapy","web scraping","python","xpath","spiders","data extraction","pipelines"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "svelte",
		title: "Curso Platzi de Svelte",
		text: `Gabriel aprobó en Platzi el Curso de Svelte el 20 de agosto de 2023.

Demuestra interfaces con Svelte: instalación, estilos, componentes, reactividad, props, condicionales, iteración, eventos, binding, ciclo de vida y stores.

En el proyecto armó un clon de red social estilo Instagram (Pugstagram) con timeline, APIs, comentarios, likes y despliegue con Netlify.`,
		related: ["platzi"],
		tags: ["platzi","svelte","frontend","componentes","stores","webpack","javascript","ui"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "web-scraping-xpath",
		title: "Curso Platzi Fundamentos de Web Scraping con Python y Xpath",
		text: `Gabriel aprobó en Platzi el Curso de Fundamentos de Web Scraping con Python y Xpath el 12 de abril de 2022.

Demuestra qué es web scraping y por qué usarlo, HTTP, HTML, robots.txt, y XPath (nodos, expresiones, predicados, operadores, wildcards, búsqueda en texto, axes).

En el proyecto construyó un scraper de noticias: expresiones XPath, obtención de links con Python y guardado de artículos en archivos de texto.`,
		related: ["platzi"],
		tags: ["platzi","web scraping","xpath","python","html","http","robots.txt","extraccion de datos"],
		visibility: "public",
		importance: "normal",
	}
];

export const PLATZI_CHUNKS_ES = defineChunks("platzi", "es", DEFS);
