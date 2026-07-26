import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: 'kodexbar-funcion',
		title: 'Qué es KodexBar, cuál es su función y para qué sirve',
		text: `KodexBar es este asistente: la barra de consulta de la home de kodexArg, y es quien
			está respondiendo ahora. Tiene una sola función y Gabriel Cavedal lo diseñó así: acercar el
			contacto con él. Para eso sirve. Quien llega con una consulta de consultoría, una revisión de
			arquitectura o una propuesta de trabajo no tiene que buscar nada: pregunta, y KodexBar
			contesta y entrega la vía de contacto ahí mismo. El correo es el camino directo; también
			están LinkedIn, Telegram y el CV completo. Todo lo que sabe contar sobre su trayectoria, sus
			proyectos y sus habilidades está al servicio de eso: que la conversación empiece.`,
		related: ['email', 'linkedin', 'telegram', 'cv', 'contacto', 'disponibilidad'],
		tags: ['que es', 'que es esto', 'que sos', 'quien sos', 'cual es tu funcion', 'cual es su funcion', 'para que sirve', 'para que servis', 'que hace', 'funcion', 'proposito', 'kodexbar', 'este asistente', 'esta barra', 'este sitio', 'contacto']
	},
	{
		id: 'sitio-orientacion',
		title: 'Qué es este sitio, dónde estoy, en qué página estoy',
		text: `¿Qué es este sitio? ¿Dónde estoy? Estás en kodexArg, la home personal de Gabriel
			Cavedal en internet: un único cuadro de consulta que responde quién es, qué hizo, qué sabe
			hacer y dónde está el resto de su ecosistema. No es su CV ni su código ni su sistema de
			diseño — es la puerta de entrada a todo eso. El currículum interactivo completo vive en el
			sitio del CV, en español e inglés. Sus repositorios públicos, herramientas y frameworks de
			agentes están en su organización de GitHub. La documentación técnica y los ADRs del propio
			kodexArg viven en su portal de docs. El sistema de diseño que le da su estética, con la
			paleta presentation orange y la mecánica de input estilo Pip-Boy, es el SyV Design System.
			Si preguntás algo y no es sobre Gabriel, KodexBar te va a decir que no puede ayudarte con
			eso en vez de inventar una respuesta.`,
		related: ['cv', 'github', 'docs', 'syv-design-system', 'kodexbar-funcion', 'kodexarg-org'],
		tags: ['que es este sitio', 'donde estoy', 'que es esta pagina', 'que es esto', 'que es kodexarg', 'home', 'pagina de inicio', 'sitio', 'ecosistema', 'a donde me manda', 'entrada']
	},
	{
		id: 'que-le-puedo-preguntar',
		title: 'Qué le puedo preguntar, qué puedo preguntarte, sobre qué me podés ayudar',
		text: `¿Qué le puedo preguntar a KodexBar? ¿Qué puedo preguntar acá? ¿Sobre qué me podés
			ayudar? Se puede preguntar por Gabriel Cavedal en cualquier ángulo: su perfil y quién es,
			cómo contactarlo y si está disponible para trabajar, su trayectoria laboral completa —Grupo
			ALVS, el Casino de Mendoza, Casino Buenos Aires—, sus habilidades técnicas por tecnología
			(Python, Django, AWS, Cloudflare, Linux, redes, IA y agentes, frontend, liderazgo), sus
			proyectos publicados y privados, su formación y certificaciones, los idiomas que habla, y
			qué es kodexArg como organización. También se puede preguntar por KodexBar mismo: qué es,
			para qué sirve y quién lo hizo. Todo lo que no está en ese temario, KodexBar lo declina en
			vez de inventarlo.`,
		related: ['perfil', 'contacto', 'disponibilidad', 'exp-alvs', 'skill-backend', 'skill-cloud-devops', 'skill-ia-agentes', 'proj-home-kodexbar', 'educacion', 'idiomas', 'kodexarg-org', 'kodexbar-funcion'],
		tags: ['que puedo preguntar', 'que le puedo preguntar', 'que te puedo preguntar', 'sobre que me puede ayudar', 'que sabes', 'que sabes responder', 'de que hablas', 'ayuda', 'help', 'temario', 'que preguntas hace']
	},
	{
		id: 'quien-esta-detras-del-sitio',
		title: 'Quién está detrás de este sitio, quién lo hizo, quién es kodexArg',
		text: `¿Quién está detrás de este sitio? ¿Quién lo hizo? ¿Quién es kodexArg? Gabriel Cavedal
			es quien diseñó, construyó y opera kodexArg entero, incluido este mismo asistente. Es
			arquitecto de infraestructura y software y lo publica bajo su marca personal kodexArg, que
			agrupa su dominio, sus subdominios y su organización de GitHub. No hay un equipo detrás: es
			su proyecto personal, construido con el mismo método spec-driven y las mismas flotas de
			agentes de IA que usa en su trabajo de consultoría.`,
		related: ['perfil', 'kodexarg-org', 'cv', 'github'],
		tags: ['quien esta detras', 'quien hizo esto', 'quien lo hizo', 'quien lo construyo', 'quien esta atras de esto', 'quien creo esto', 'de quien es esto', 'autor', 'creador']
	},
	{
		id: 'perfil',
		title: 'Perfil profesional',
		text: `Gabriel Cavedal es arquitecto de infraestructura y software, y líder técnico
			multi-empresa desde hace más de 20 años. Diseña sistemas de punta a punta, desde la capa
			física y las redes hasta la arquitectura cloud y el producto, y dirige los equipos que los
			operan. Su práctica actual es el desarrollo spec-driven con flotas de agentes de IA bajo
			disciplina BDD/TDD. Es experto en Django y Django REST Framework, y mantiene plataformas en
			producción sobre AWS y Cloudflare. Se presenta profesionalmente como AI Solutions Architect
			y Fractional CTO. Vive en Mendoza, Argentina.`,
		related: ['cv', 'linkedin', 'edad-gabriel'],
		tags: ['perfil', 'quien es', 'bio', 'gabriel cavedal', 'kodexarg', 'arquitecto', 'fractional cto', 'ai solutions architect', 'presentacion']
	},
	{
		id: 'edad-gabriel',
		title: 'Cuántos años tiene Gabriel Cavedal, qué edad tiene, cuándo nació',
		text: `¿Cuántos años tiene Gabriel? ¿Qué edad tiene? ¿Cuándo nació? Su CV público no publica
			fecha de nacimiento ni edad, así que KodexBar no tiene ese dato exacto para dar. Lo que sí
			se puede confirmar: su primer rol técnico documentado fue en 2002, en Casino Buenos Aires, y
			desde entonces lleva más de dos décadas de trayectoria continua como profesional de IT.`,
		related: ['perfil', 'exp-casino-bsas'],
		tags: ['edad', 'cuantos años tiene', 'que edad tiene', 'cuando nacio', 'fecha de nacimiento', 'nacimiento', 'edad de gabriel', 'age', 'how old', 'birth date']
	},
	{
		id: 'contacto',
		title: 'Cómo contactarlo',
		text: `El correo electrónico es la vía preferida para contactar a Gabriel Cavedal: sirve
			para consultas de consultoría, revisiones de arquitectura y trabajo freelance. También está
			en LinkedIn, en Telegram como @KodexArg y en GitHub como kodexArg. Vive y trabaja desde
			Mendoza, Argentina, de forma remota. La dirección exacta viaja en el link de contacto.`,
		related: ['email', 'linkedin', 'telegram', 'github'],
		tags: ['contacto', 'mail', 'correo', 'email', 'linkedin', 'telegram', 'como contactarlo', 'escribirle', 'donde vive', 'mendoza', 'argentina', 'ubicacion']
	},
	{
		id: 'disponibilidad',
		title: 'Disponibilidad y consultoría',
		text: `Gabriel está disponible para consultoría remota. Los trabajos que le interesan son
			revisiones de arquitectura y de proyectos de terceros, scouting de adopción de IA en
			organizaciones, y quick wins de automatización. Trabaja remote-first. La forma de iniciar
			una conversación es escribirle por correo.`,
		related: ['email', 'cv'],
		tags: ['disponible', 'disponibilidad', 'freelance', 'consultoria', 'contratar', 'contratarlo', 'trabajo', 'remoto', 'quick wins', 'asesoria']
	},
	{
		id: 'idiomas',
		title: 'Idiomas',
		text: `Gabriel Cavedal habla español como lengua nativa. En inglés tiene nivel profesional:
			lectura excelente y conversación B2.`,
		tags: ['idiomas', 'ingles', 'espanol', 'languages', 'nivel de ingles', 'bilingue']
	},
	{
		id: 'educacion',
		title: 'Educación y certificaciones',
		text: `Gabriel cursó educación técnica en la escuela ENET N°1 «Ing. Pablo Nogués» de Mendoza.
			Comenzó Ingeniería Electromecánica en la UNSL de San Luis y Diseño Gráfico en Villa Mercedes,
			ambas inconclusas. Mantiene certificación continua en Platzi, cubriendo IA y ciencia de datos
			(complejidad algorítmica, estadística computacional, álgebra lineal y pensamiento
			probabilístico con Python), backend (Django, Python, SQL, Scrapy), DevOps y cloud (AWS, EC2,
			Docker, Git y GitHub) y frontend (Svelte, clean code con JavaScript). Su formación técnica
			es mayormente autodidacta y sostenida en la práctica.`,
		related: ['platzi'],
		tags: ['educacion', 'estudios', 'titulo', 'universidad', 'formacion', 'certificaciones', 'platzi', 'cursos', 'donde estudio', 'autodidacta']
	},
	{
		id: 'exp-alvs',
		title: 'Technical Lead en Grupo ALVS (2016 — presente)',
		text: `Desde 2016 Gabriel es Technical Lead de IT e Infraestructura en Grupo ALVS, en Mendoza,
			Argentina. Lidera el equipo de IT del grupo en todas sus unidades de negocio. Diseñó y opera
			la plataforma cloud del grupo en AWS: VPCs de desarrollo y producción, ECS Fargate, RDS
			PostgreSQL, Cognito y Secrets Manager, todo definido con CloudFormation y desplegado vía
			GitHub Actions con OIDC. Esa plataforma corre el helpdesk en producción, workflows de pagos,
			sitios institucionales y telemetría IoT sobre un backbone VPN multi-sitio. También impulsa
			la adopción de IA en todo el grupo: orquestación multi-agente con servidores MCP, workflows
			automatizados y capacitación hands-on al personal.`,
		related: ['cv', 'skill-cloud-devops', 'proj-alvs-cloud'],
		tags: ['experiencia', 'trabajo actual', 'empleo', 'alvs', 'grupo alvs', 'technical lead', 'lider tecnico', 'donde trabaja', 'aws', 'infraestructura']
	},
	{
		id: 'exp-casino-mendoza',
		title: 'Jefe de Organización y Sistemas, Casino de Mendoza (2005 — 2016)',
		text: `Entre 2005 y 2016 Gabriel fue Jefe de Organización y Sistemas en Mendoza Central
			Entretenimiento, el Casino de Mendoza. Diseñó de punta a punta las redes y el floorplan del
			casino, y construyó los clusters de servidores RHEL que sostuvieron toda la operación:
			sistemas de juego con 700 tragamonedas en red, dashboards de BI y analítica con machine
			learning. Fueron once años de operación continua sin downtime.`,
		related: ['cv', 'skill-linux', 'proj-casino-mendoza', 'proj-ml-tragamonedas'],
		tags: ['experiencia', 'casino', 'casino de mendoza', 'jefe de sistemas', 'rhel', 'linux', 'clusters', 'tragamonedas', 'slots', 'historia laboral']
	},
	{
		id: 'exp-casino-bsas',
		title: 'Técnico de sistemas de tragamonedas, Casino Buenos Aires (2002 — 2005)',
		text: `Entre 2002 y 2005 Gabriel trabajó como técnico de sistemas de tragamonedas en Casino
			Buenos Aires, ocupándose de hardware de juego, redes y soporte de sistemas. Es su primer rol
			técnico documentado y el punto de partida de su carrera.`,
		related: ['cv'],
		tags: ['experiencia', 'casino buenos aires', 'tecnico', 'primer trabajo', 'inicio de carrera', 'historia laboral']
	},
	{
		id: 'skill-backend',
		title: 'Backend: Python, Django, DRF, PostgreSQL',
		text: `El backend es la especialidad más fuerte de Gabriel. Trabaja con Python, Django 5,
			Django REST Framework, FastAPI y PostgreSQL. Construye aplicaciones completas con Django:
			helpdesk, workflows de pago y portales B2B. Usa Django REST Framework para SaaS y telemetría
			IoT, colas y tareas asíncronas con Redis y Celery, y FastAPI o Flask para automatizaciones y
			webhooks. En PostgreSQL hace modelado, tuning y backup/recovery. Se define como experto en
			Django y DRF.`,
		related: ['welpdesk', 'dj-indoor-monitor', 'astro-drf-aws', 'dj-apprunner-template', 'proj-welp', 'proj-coveris-aws'],
		tags: ['backend', 'python', 'django', 'drf', 'django rest framework', 'fastapi', 'flask', 'postgresql', 'postgres', 'celery', 'redis', 'sql', 'base de datos', 'api']
	},
	{
		id: 'skill-cloud-devops',
		title: 'Cloud y DevOps: AWS, Cloudflare, IaC, CI/CD',
		text: `Gabriel diseña y opera infraestructura cloud en producción. En AWS trabaja con ECS
			Fargate, Amplify, App Runner, Lambda, RDS, S3 y CloudFront, y Cognito. Define infraestructura
			como código con CloudFormation. Arma CI/CD con GitHub Actions y OIDC, sin credenciales
			estáticas. En Cloudflare usa Pages, Workers, D1 y R2. También gestiona costos con Cost
			Explorer, budgets y optimización. AWS es su plataforma principal y la que sostiene la
			operación de Grupo ALVS.`,
		related: ['dj-apprunner-template', 'astro-drf-aws', 'n8n-apprunner', 'lambda-update-route53', 'cf-ng-eurotrip2026', 'proj-alvs-cloud', 'proj-coveris-aws', 'exp-alvs'],
		tags: ['aws', 'cloud', 'devops', 'cloudflare', 'fargate', 'ecs', 'lambda', 'rds', 's3', 'cloudfront', 'cognito', 'apprunner', 'amplify', 'cloudformation', 'iac', 'infraestructura como codigo', 'ci/cd', 'github actions', 'oidc', 'docker', 'workers', 'd1', 'r2', 'costos']
	},
	{
		id: 'skill-infra-iot',
		title: 'Infraestructura, redes e IoT',
		text: `Gabriel viene de la capa física y la conserva. Trabaja con MikroTik RouterOS, FortiGate
			y UniFi; VPN site-to-site IPsec y acceso remoto L2TP; VLANs, DHCP, DNS y monitoreo SNMP.
			Opera flotas de Raspberry Pi y ESP32 con telemetría en producción. También hace
			videovigilancia con detección por IA y telefonía SIP/PBX. Es la base sobre la que monta todo
			lo demás: pocas personas que diseñan arquitectura cloud también saben cablear la red.`,
		related: ['dj-indoor-monitor', 'rpi-door-access-rfid', 'kdx-pi-signage', 'kdx-pi-cam', 'camera-alert-to-telegram', 'raspberry-pi-temperature-to-telegram', 'proj-kcbd', 'proj-enlace-vpn'],
		tags: ['redes', 'networking', 'infraestructura', 'iot', 'vpn', 'ipsec', 'mikrotik', 'fortigate', 'unifi', 'vlan', 'dns', 'dhcp', 'snmp', 'raspberry pi', 'esp32', 'sensores', 'telemetria', 'videovigilancia', 'camaras', 'sip', 'pbx', 'telefonia']
	},
	{
		id: 'skill-linux',
		title: 'Linux y SysAdmin',
		text: `Gabriel administra Linux desde hace dos décadas, en Debian y RHEL. Corrió clusters RHEL
			en producción durante una década con cero downtime. Trabaja con Nginx, SSL/TLS y reverse
			proxy; monitoreo con Grafana, Zabbix y PRTG; virtualización con Docker, Oracle VM y VMware.
			Actualmente corre sistemas agénticos self-hosted sobre su propia infraestructura.`,
		related: ['blocky', 'exp-casino-mendoza', 'proj-casino-mendoza'],
		tags: ['linux', 'sysadmin', 'debian', 'rhel', 'red hat', 'servidores', 'cluster', 'alta disponibilidad', 'nginx', 'ssl', 'tls', 'proxy', 'grafana', 'zabbix', 'prtg', 'monitoreo', 'docker', 'vmware', 'virtualizacion', 'self-hosted']
	},
	{
		id: 'skill-fullstack',
		title: 'Full Stack y frontend',
		text: `En frontend Gabriel trabaja con Angular 21 usando signals y PrimeNG, Astro con SSR e
			islas Svelte 5 sobre Tailwind v4, y HTMX sobre templates de Django. Diseña APIs REST
			contract-first. Despliega en AWS Amplify, Fargate y Cloudflare Pages. No es un especialista
			de frontend puro: llega al frontend desde la arquitectura, y elige el stack por lo que el
			sistema necesita.`,
		related: ['template-angular-21-csr-primeng', 'astro-drf-aws', 'cf-ng-eurotrip2026', 'astro-cv', 'syv-design-system', 'proj-sroa'],
		tags: ['frontend', 'full stack', 'angular', 'primeng', 'astro', 'svelte', 'htmx', 'tailwind', 'ssr', 'signals', 'rest', 'api', 'contract-first', 'ui']
	},
	{
		id: 'skill-ia-agentes',
		title: 'IA, agentes y MCP',
		text: `Es el foco actual de Gabriel. Construye servidores y clientes MCP (Model Context
			Protocol), varios de ellos públicos en GitHub. Trabaja con Claude Code, Antigravity SDK y
			Pydantic AI. Desarrolla agentes autónomos de triage y corrección de issues, y jerarquías de
			subagentes organizadas por nivel de esfuerzo (Opus, Sonnet, Haiku). También usa n8n, RAG y
			prompt engineering, y genera imágenes con ComfyUI, Stable Diffusion y Flux. Lidera la
			adopción de IA en Grupo ALVS, incluyendo capacitación al personal.`,
		related: ['engram', 'openclaw', 'odysseus', 'python-telegram-bot-mcp', 'comfyui-1', 'proj-mcp-tools', 'proj-coveris-metodo'],
		tags: ['ia', 'ai', 'inteligencia artificial', 'agentes', 'agentic', 'mcp', 'model context protocol', 'claude', 'claude code', 'llm', 'rag', 'multi-agente', 'orquestacion', 'n8n', 'prompt engineering', 'pydantic ai', 'comfyui', 'stable diffusion', 'flux', 'generacion de imagenes']
	},
	{
		id: 'skill-qa-metodo',
		title: 'QA, método y desarrollo spec-driven',
		text: `Gabriel profundizó fuertemente en aseguramiento de calidad aplicado al desarrollo
			asistido por IA. Su argumento es que cuando los agentes escriben la mayor parte del código,
			la calidad se juega en las especificaciones, los contratos y la revisión. Su método:
			especificaciones y ADRs como fuente única de verdad, APIs contract-first con cobertura
			verificada por tests, BDD/TDD, y pipelines multi-agente de auditoría con modelos en jerarquía
			Opus/Sonnet/Haiku que revisan código, specs y documentación de forma cruzada. Aplica el mismo
			proceso como revisor externo de proyectos de terceros: auditoría de arquitectura, code review
			y evaluación de deuda técnica. Documenta con docs-as-code, usando mkdocs Material como
			documentación viva.`,
		related: ['qa-reports', 'docs', 'proj-coveris-metodo'],
		tags: ['qa', 'calidad', 'testing', 'tests', 'tdd', 'bdd', 'spec-driven', 'especificaciones', 'adr', 'contract-first', 'code review', 'auditoria', 'revision', 'deuda tecnica', 'metodo', 'metodologia', 'docs-as-code', 'mkdocs', 'documentacion']
	},
	{
		id: 'skill-liderazgo',
		title: 'Liderazgo y negocio',
		text: `Gabriel dirige equipos de IT multidisciplinarios y multi-empresa. Trabaja habitualmente
			con expertos de dominio no técnicos: médicos, gerencias y operaciones, traduciendo sus reglas
			de negocio a sistemas. Se ocupa de automatización de procesos de negocio, gestión de
			proveedores y presupuesto, y de BI y analítica para toma de decisiones, incluyendo Power BI y
			dashboards. Se ofrece como arquitecto de soluciones y Fractional CTO.`,
		related: ['exp-alvs', 'proj-coveris-dominio'],
		tags: ['liderazgo', 'equipos', 'gestion', 'management', 'negocio', 'arquitectura de soluciones', 'fractional cto', 'procesos', 'automatizacion', 'proveedores', 'presupuesto', 'bi', 'power bi', 'analitica', 'toma de decisiones']
	},
	{
		id: 'proj-coveris-aws',
		title: 'Coveris — arquitectura AWS',
		text: `Coveris es un SaaS de planificación de capacidad hospitalaria y es el proyecto donde
			Gabriel demuestra más profundidad en AWS. El MVP corre sobre AWS Amplify para el frontend,
			ECS Fargate para los servicios y RDS PostgreSQL, con Cognito para autenticación. El stack de
			aplicación es Angular 21 con PrimeNG sobre Django 5.2 y DRF. El diseño arquitectónico es
			enteramente suyo. El repositorio es privado, así que no hay link público disponible.`,
		related: ['skill-cloud-devops', 'skill-backend', 'proj-coveris-metodo', 'proj-coveris-dominio'],
		tags: ['coveris', 'aws', 'saas', 'salud', 'hospitalario', 'capacidad hospitalaria', 'fargate', 'amplify', 'rds', 'cognito', 'angular', 'django', 'proyecto privado']
	},
	{
		id: 'proj-coveris-metodo',
		title: 'Coveris — método, ADRs y QA multi-agente',
		text: `Coveris es el caso más completo del método de Gabriel. El proyecto tiene más de 25 ADRs,
			una API contract-first con cobertura verificada por tests, y un pipeline multi-agente de IA en
			jerarquía Opus/Sonnet/Haiku que audita las propias especificaciones además del código. Es la
			demostración práctica de su tesis sobre calidad en desarrollo asistido por IA: si los agentes
			escriben el código, el control de calidad tiene que mudarse a las specs y los contratos.`,
		related: ['skill-qa-metodo', 'skill-ia-agentes', 'proj-coveris-aws', 'proj-coveris-dominio'],
		tags: ['coveris', 'adr', 'specs', 'spec-driven', 'qa', 'tests', 'contract-first', 'multi-agente', 'opus', 'sonnet', 'haiku', 'auditoria', 'metodo']
	},
	{
		id: 'proj-coveris-dominio',
		title: 'Coveris — trabajo con expertos de dominio clínico',
		text: `En Coveris la lógica de negocio se la proveyeron médicos, no Gabriel. Trabajó
			directamente con profesionales clínicos traduciendo sus reglas de dominio a especificaciones
			verificables y trazables, con QA automatizado validando cada contrato contra esas reglas.
			Él lo describe como el patrón que le interesa repetir: dominio experto ajeno, arquitectura y
			calidad propias. Es el diferenciador de su perfil frente a un arquitecto puramente técnico.`,
		related: ['skill-liderazgo', 'skill-qa-metodo', 'proj-coveris-aws'],
		tags: ['coveris', 'dominio', 'medicos', 'clinico', 'salud', 'reglas de negocio', 'expertos', 'traduccion de dominio', 'diferenciador']
	},
	{
		id: 'proj-alvs-cloud',
		title: 'Plataforma Cloud de Grupo ALVS',
		text: `Gabriel diseñó y opera la infraestructura AWS unificada de Grupo ALVS: VPCs de
			desarrollo y producción, ECS Fargate, RDS PostgreSQL, ALB, Cognito y Secrets Manager, todo
			definido con CloudFormation y con CI/CD por GitHub Actions con OIDC. La documentación viva en
			mkdocs Material es la fuente única de verdad de la plataforma. Los repositorios son privados.`,
		related: ['skill-cloud-devops', 'exp-alvs'],
		tags: ['alvs', 'grupo alvs', 'aws', 'plataforma', 'infraestructura', 'cloudformation', 'vpc', 'fargate', 'rds', 'alb', 'cognito', 'secrets manager', 'oidc', 'mkdocs', 'privado']
	},
	{
		id: 'proj-mcp-tools',
		title: 'Herramientas MCP y agentes autónomos',
		text: `Gabriel mantiene servidores MCP públicos y privados: terminal persistente, Telegram Bot
			API y un pipeline de validación de contenido. Construyó agentes autónomos de triage y
			corrección de issues, y un plano de control privado de orquestación multi-agente con
			jerarquía de subagentes por nivel de esfuerzo. Trabaja con Python, Pydantic AI, el SDK de
			Anthropic, Antigravity SDK, Claude Code y n8n. Parte del código es público en la organización
			kodexArg de GitHub; el plano de control de orquestación es privado.`,
		related: ['python-telegram-bot-mcp', 'engram', 'openclaw', 'github', 'skill-ia-agentes'],
		tags: ['mcp', 'agentes', 'agentic', 'servidores mcp', 'telegram', 'triage', 'issues', 'orquestacion', 'multi-agente', 'pydantic ai', 'anthropic', 'claude code', 'n8n', 'automatizacion']
	},
	{
		id: 'proj-welp',
		title: 'Welp — helpdesk y workflows de pago',
		text: `Welp es un sistema de tickets y workflows purchase-to-payment construido con Django 5,
			HTMX y despliegue en AWS App Runner, con PostgreSQL. Está en producción en Grupo ALVS.
			Maneja ciclo de vida de tickets, gestión de SLA y aislamiento multi-organización. El código
			fuente es público en el repositorio welpdesk; la instancia en producción es interna del grupo
			y no es accesible públicamente.`,
		related: ['welpdesk', 'skill-backend', 'exp-alvs'],
		tags: ['welp', 'welpdesk', 'helpdesk', 'tickets', 'ticketing', 'soporte', 'mesa de ayuda', 'sla', 'pagos', 'purchase to payment', 'django', 'htmx', 'app runner', 'multi-tenant']
	},
	{
		id: 'proj-kcbd',
		title: 'KCBD — laboratorio de cultivo e IoT',
		text: `Gabriel co-construyó la red de sensores del laboratorio de cultivo indoor KCBD. Nodos
			Raspberry Pi miden temperatura, humedad, humedad de sustrato, luz y CO2, y envían telemetría
			a una API Django REST Framework respaldada por TimescaleDB, con frontend Angular. La
			telemetría corre en producción sobre AWS. El código está publicado como dj-indoor-monitor.`,
		related: ['dj-indoor-monitor', 'skill-infra-iot', 'skill-backend'],
		tags: ['kcbd', 'indoor', 'cultivo', 'laboratorio', 'iot', 'sensores', 'raspberry pi', 'timescaledb', 'telemetria', 'temperatura', 'humedad', 'co2', 'django', 'drf', 'angular']
	},
	{
		id: 'proj-sroa',
		title: 'SROA — Sociedad Rural del Oeste Argentino',
		text: `Sitio institucional y blog de la Sociedad Rural del Oeste Argentino. Es un build
			full-stack spec-driven con Astro SSR, islas Svelte 5 y backend Django asíncrono, desplegado
			en ECS Fargate sobre la plataforma AWS de Grupo ALVS, con RDS, Cognito, SEO y GitHub Actions
			con OIDC. Está en producción. El repositorio es privado.`,
		related: ['skill-fullstack', 'skill-cloud-devops'],
		tags: ['sroa', 'sociedad rural', 'sitio institucional', 'blog', 'astro', 'ssr', 'svelte', 'django', 'fargate', 'seo', 'privado']
	},
	{
		id: 'proj-casino-mendoza',
		title: 'Casino de Mendoza — clusters RHEL y 700 tragamonedas',
		text: `Durante una década Gabriel construyó y operó clusters Linux RHEL hechos a medida
			detrás de 700 tragamonedas en red en el Casino de Mendoza, con Oracle VM para virtualización,
			sin caídas. Diseñó además las redes y el floorplan del casino, y los dashboards de BI y
			analítica con machine learning que corrían sobre esa infraestructura. Es su credencial más
			fuerte en infraestructura de misión crítica.`,
		related: ['skill-linux', 'exp-casino-mendoza'],
		tags: ['casino', 'casino de mendoza', 'rhel', 'linux', 'cluster', 'alta disponibilidad', 'zero downtime', 'tragamonedas', 'slots', 'oracle vm', 'bi', 'machine learning', 'mision critica']
	},
	{
		id: 'proj-eurotrip',
		title: 'Eurotrip 2026 — app de viaje sobre Cloudflare',
		text: `Eurotrip 2026 es un planificador de viaje personal construido con Angular 21 y corriendo
			enteramente sobre Cloudflare: Pages, D1 y R2. Incluye mapas interactivos, cálculo de
			presupuesto y gestión de itinerario. Está publicado y es accesible, y el código es abierto.
			Es su proyecto de referencia para trabajo full-Cloudflare.`,
		related: ['eurotrip-live', 'cf-ng-eurotrip2026', 'skill-cloud-devops', 'skill-fullstack'],
		tags: ['eurotrip', 'viaje', 'travel', 'planificador', 'itinerario', 'presupuesto', 'angular', 'cloudflare', 'pages', 'd1', 'r2', 'mapas']
	},
	{
		id: 'proj-engram',
		title: 'Engram — memoria persistente para agentes',
		text: `Engram es un sistema de memoria persistente agnóstico del agente, pensado para agentes
			de programación con IA. Está escrito en Go como un binario de alto rendimiento, usa SQLite con
			búsqueda full-text FTS5, y expone servidor MCP, API HTTP, CLI y una TUI interactiva. Resuelve
			el problema de la ventana de contexto: memoria de largo plazo fuera del modelo.`,
		related: ['engram', 'skill-ia-agentes'],
		tags: ['engram', 'memoria', 'memory', 'agentes', 'go', 'golang', 'sqlite', 'fts5', 'mcp', 'tui', 'cli', 'contexto', 'ventana de contexto', 'largo plazo']
	},
	{
		id: 'proj-openclaw',
		title: 'OpenClaw — asistente personal de IA',
		text: `OpenClaw es un framework de asistente personal de IA multiplataforma, diseñado para
			correr localmente o self-hosted en cualquier sistema operativo. Tiene canales de plugins
			modulares, invocación de herramientas locales y ejecución autónoma de tareas.`,
		related: ['openclaw', 'skill-ia-agentes'],
		tags: ['openclaw', 'asistente', 'assistant', 'ia personal', 'self-hosted', 'local', 'plugins', 'autonomo', 'agente local']
	},
	{
		id: 'proj-odysseus',
		title: 'Odysseus — workspace de IA self-hosted',
		text: `Odysseus es un entorno de workspace de IA self-hosted para orquestar colaboración
			multi-agente, automatización de workflows con LLMs, procesamiento de documentos y gestión de
			modelos de IA locales.`,
		related: ['odysseus', 'skill-ia-agentes'],
		tags: ['odysseus', 'workspace', 'self-hosted', 'multi-agente', 'llm', 'workflows', 'documentos', 'modelos locales']
	},
	{
		id: 'proj-home-kodexbar',
		title: 'kodexArg Home y KodexBar',
		text: `La home de kodexArg es la puerta de entrada al ecosistema, y KodexBar es el
			asistente que la atiende: recuperación vectorial sobre Cloudflare Vectorize con embeddings y
			generación en Cloudflare Workers AI, construido con Astro 7 e islas Svelte 5. Responde
			preguntas sobre Gabriel Cavedal y entrega links a los proyectos públicos. Es este mismo
			sistema.`,
		related: ['syv-design-system', 'skill-ia-agentes', 'skill-fullstack', 'kodexbar-funcion'],
		tags: ['home', 'kodexbar', 'kodexarg', 'este sitio', 'esta pagina', 'quien sos', 'que sos', 'vectorize', 'workers ai', 'rag', 'astro', 'svelte', 'cloudflare']
	},
	{
		id: 'proj-cv-site',
		title: 'Sitio del CV',
		text: `El currículum interactivo de Gabriel Cavedal es el lugar para ver su CV completo: una
			versión de una página en español e inglés y una versión extendida con más detalle. Está
			construido con Astro y Svelte, y aparte del sitio existe el repositorio con su código fuente.`,
		related: ['cv', 'astro-cv', 'skill-fullstack'],
		tags: ['cv', 'curriculum', 'resume', 'hoja de vida', 'sitio del cv', 'astro', 'svelte']
	},
	{
		id: 'proj-design-system',
		title: 'SyV Design System',
		text: `El SyV Design System (Subordinación y Valor) es el sistema de diseño oficial de las
			plataformas kodexArg. Define tokens de diseño, la paleta presentation orange, estética de
			consola oscura, mecánica de input estilo Pip-Boy y reglas de componentes accesibles. Es lo
			que le da su aspecto a este sitio.`,
		related: ['syv-design-system', 'skill-fullstack'],
		tags: ['syv', 'design system', 'diseno', 'sistema de diseno', 'paleta', 'colores', 'presentation orange', 'tokens', 'pipboy', 'componentes', 'accesibilidad', 'subordinacion y valor']
	},
	{
		id: 'proj-enlace-vpn',
		title: 'Cuádruple enlace VPN entre sitios y nube',
		text: `Gabriel diseñó la arquitectura de enlace entre tres sitios on-premise y la nube —
			primero Azure, después AWS— con acceso remoto L2TP para usuarios, usando MikroTik e IPsec.
			Es un proyecto histórico de infraestructura de redes, previo a su etapa cloud-first actual.
			No tiene repositorio público asociado.`,
		related: ['skill-infra-iot', 'exp-casino-mendoza'],
		tags: ['vpn', 'enlace vpn', 'mikrotik', 'ipsec', 'l2tp', 'azure', 'aws', 'multi-sitio', 'redes', 'historico']
	},
	{
		id: 'proj-cartelera-legacy',
		title: 'Sistema de cartelería digital y mapa térmico (Casino de Mendoza)',
		text: `Gabriel construyó un sistema IoT de publicidades en TV sobre una flota de Raspberry Pi
			con repositorio central de contenido, para el Casino de Mendoza. Después reaprovechó esa
			misma infraestructura para armar un mapa térmico en tiempo real de las salas del casino, con
			sensores DHT11 y DHT22, backend Django y visualización con ChartJS. Estuvo operativo durante
			años. El repositorio de este proyecto es privado.`,
		related: ['skill-infra-iot', 'exp-casino-mendoza', 'proj-casino-mendoza'],
		tags: ['cartelera digital', 'signage', 'raspberry pi', 'mapa termico', 'dht11', 'dht22', 'django', 'chartjs', 'casino de mendoza', 'sensores', 'proyecto historico']
	},
	{
		id: 'proj-trading-bot',
		title: 'Bot de trading algorítmico',
		text: `Gabriel construyó un puente entre indicadores de TradingView y órdenes long/short
			ejecutadas en Binance, usando Flask, python-binance, pandas, Pine Script y webhooks. Es un
			proyecto personal de trading algorítmico; el repositorio es privado.`,
		related: ['skill-backend', 'skill-ia-agentes'],
		tags: ['trading', 'trading bot', 'tradingview', 'binance', 'algoritmico', 'flask', 'pandas', 'pine script', 'webhooks', 'bot de trading']
	},
	{
		id: 'proj-ml-tragamonedas',
		title: 'Machine learning sobre datos de tragamonedas',
		text: `Sobre la base de datos de juego del Casino de Mendoza, Gabriel construyó modelos de
			clasificación y analítica predictiva con Python, pandas, TensorFlow, matplotlib y PostgreSQL.
			Es parte del mismo trabajo que sostuvo los dashboards de BI de esa etapa.`,
		related: ['skill-linux', 'exp-casino-mendoza', 'proj-casino-mendoza'],
		tags: ['machine learning', 'ml', 'tragamonedas', 'slots', 'tensorflow', 'pandas', 'matplotlib', 'analitica predictiva', 'clasificacion', 'casino de mendoza']
	},
	{
		id: 'kodexarg-org',
		title: 'Qué es kodexArg',
		text: `kodexArg es la marca personal y la organización de Gabriel Cavedal. Agrupa su dominio
			propio y sus subdominios, y la organización de GitHub del mismo nombre, donde publica
			repositorios open source: herramientas para desarrolladores, frameworks de agentes de IA,
			scripts de automatización IoT, plantillas de infraestructura cloud y código de aplicaciones.`,
		related: ['cv', 'github'],
		tags: ['kodexarg', 'organizacion', 'marca', 'github', 'open source', 'repositorios', 'que es kodexarg', 'ecosistema']
	},
	{
		id: 'repos-templates',
		title: 'Plantillas de infraestructura cloud',
		text: `Gabriel publica plantillas de despliegue listas para usar: Astro 7 con Django 6 DRF
			sobre AWS ECS Fargate, Django sobre AWS App Runner, n8n self-hosted sobre App Runner, una
			función Lambda que actualiza registros DNS de Route53 según eventos de EC2, y un starter de
			Angular 21 con PrimeNG, Tailwind v4 y Vitest. Son el destilado reutilizable de la
			infraestructura que opera en producción.`,
		related: ['astro-drf-aws', 'dj-apprunner-template', 'n8n-apprunner', 'lambda-update-route53', 'template-angular-21-csr-primeng', 'skill-cloud-devops'],
		tags: ['templates', 'plantillas', 'boilerplate', 'starter', 'infraestructura', 'aws', 'fargate', 'apprunner', 'lambda', 'route53', 'n8n', 'angular', 'astro', 'django']
	},
	{
		id: 'repos-iot',
		title: 'Repositorios de IoT y Raspberry Pi',
		text: `La familia IoT de kodexArg incluye dj-indoor-monitor para telemetría de cultivo indoor,
			kdx-pi-signage y su versión 2 para cartelería digital autónoma sobre Raspberry Pi, un sistema
			de control de acceso con lector RFID RC522, un daemon de sensores DHT22/DHT11 que envía
			alertas de temperatura y humedad a Telegram, un pipeline de detección de movimiento en
			cámaras con alertas a Telegram, y kdx-pi-cam para streaming MJPEG. Todos son públicos.`,
		related: ['dj-indoor-monitor', 'kdx-pi-signage', 'kdx-pi-signage-2', 'rpi-door-access-rfid', 'raspberry-pi-temperature-to-telegram', 'camera-alert-to-telegram', 'kdx-pi-cam', 'skill-infra-iot'],
		tags: ['iot', 'raspberry pi', 'rpi', 'sensores', 'signage', 'cartelera', 'rfid', 'control de acceso', 'camaras', 'telegram', 'alertas', 'streaming', 'mjpeg', 'esp32']
	},
	{
		id: 'repos-tools',
		title: 'Herramientas y proyectos varios',
		text: `Entre los repositorios públicos de kodexArg hay también un ad-blocker DNS de red local
			escrito en Go, un renderizador cowsay determinista empaquetado como skill de agente, un tema
			de cursores para Linux con el coral de Claude, un portal de reportes de auditoría QA, una app
			de álbum de figuritas, un handbook de ingeniería de datos, una GUI de difusión ComfyUI y un
			deck de capacitación en IA construido con Astro.`,
		related: ['blocky', 'cowsay', 'klaude-cursors', 'qa-reports', 'figus', 'data-engineer-handbook', 'comfyui-1', 'alvs-capacitacion', 'github'],
		tags: ['herramientas', 'tools', 'dns', 'adblocker', 'blocky', 'cowsay', 'cursores', 'linux', 'qa', 'reportes', 'figuritas', 'data engineering', 'comfyui', 'capacitacion', 'varios']
	}
];

export const CV_CHUNKS_ES = defineChunks('cv', 'es', DEFS);
