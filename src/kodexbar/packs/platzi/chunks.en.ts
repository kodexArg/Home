import { defineChunks, type ChunkDef } from '../defineChunks';

const DEFS: ChunkDef[] = [
	{
		id: "algebra-lineal-py",
		title: "Platzi course Linear Algebra Fundamentals with Python",
		text: `Gabriel approved the Platzi Linear Algebra Fundamentals with Python course on 28 March 2024.

It demonstrates an Anaconda and Jupyter environment; scalars, vectors, matrices and tensors; transposition, addition, broadcasting and inner product; equation systems with the inverse; linear combinations, linear dependence, norms, angles, diagonal and symmetric matrices, orthogonality, and trace and determinant aimed at data and machine learning.`,
		related: ["platzi"],
		tags: ["platzi","linear algebra","python","numpy","matrices","vectors","machine learning","jupyter"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "aws-ec2",
		title: "Platzi Practical AWS Compute with EC2 course",
		text: `Gabriel approved the Platzi Practical AWS: Compute with EC2 course on 20 April 2023.

It demonstrates EC2 fundamentals, instance types, purchase models and shared responsibility; labs for instances, security groups, SSH (including Windows and PowerShell), EC2 Instance Connect, instance roles without permanent credentials, resource cleanup and budgets.`,
		related: ["platzi"],
		tags: ["platzi","aws","ec2","compute","ssh","security groups","instances","iam roles"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "aws-fundamentos",
		title: "Platzi course Introduction to AWS Cloud Computing Fundamentals",
		text: `Gabriel approved the Platzi course Introduction to AWS: Cloud Computing Fundamentals on 12 September 2025.

It demonstrates understanding of cloud versus traditional IT infrastructure, IaaS PaaS and SaaS models, AWS history and global infrastructure, and account setup. On security and identity he covered IAM (users, groups, and roles), Secrets Manager, Directory Service, creating users and groups, and billing alerts.

In practice he deployed a static site with S3 and DNS with Route 53.`,
		related: ["platzi"],
		tags: ["platzi","aws","cloud","cloud computing","s3","iam","route 53","aws fundamentals"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "bases-datos-sql",
		title: "Platzi course Databases with SQL",
		text: `Gabriel approved the Platzi Databases with SQL course on 9 March 2025.

It demonstrates the relational model (entities, relationships, ER diagram, normalization), DDL and DML (CREATE, ALTER, INSERT, SELECT, UPDATE, DELETE), primary and foreign keys, ORDER BY and LIMIT, text functions, a PostgreSQL environment, aggregations with GROUP BY and HAVING, and INNER JOIN and LEFT JOIN on a store-style business case for reports.`,
		related: ["platzi"],
		tags: ["platzi","sql","databases","postgresql","relational model","join","queries"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "computacion-basica",
		title: "Platzi course Basic Computers and Informatics",
		text: `Gabriel approved the Platzi Basic Computers and Informatics course on 26 March 2025.

It demonstrates binary basics, hardware, ports and PC choice; Windows use (desktop, files, app install); safe browsing, email with two-step verification, office tools, creative apps and Visual Studio Code; and security (viruses, updates, antivirus, firewall, phishing and password managers).`,
		related: ["platzi"],
		tags: ["platzi","basic computing","informatics","windows","security","antivirus","phishing"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "django-basico",
		title: "Platzi Basic Django course",
		text: `Gabriel approved the Platzi Basic Django course on 14 April 2022.

It demonstrates Django install and project layout, the development server, settings, ORM and models (Question and Choice in the Premios Platzi App), the interactive shell, filters, basic Django Admin, views, templates, 404 handling, the url tag, forms (vote and results), and Generic Views.`,
		related: ["platzi"],
		tags: ["platzi","django","python","backend","orm","models","views","templates","generic views"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "django-intermedio",
		title: "Platzi Intermediate Django Testing Static Files Admin course",
		text: `Gabriel approved the Platzi Intermediate Django: Testing, Static Files, Django Admin course on 14 April 2022.

It demonstrates what tests are and how to write them (including IndexView and DetailView tests), static files (styles and background image), Django Admin improvements (Questions and Change List), and frontend polish toward a first presentable version of the saga app.`,
		related: ["platzi"],
		tags: ["platzi","django","testing","static files","django admin","python","backend","tests"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "docker",
		title: "Platzi Docker course",
		text: `Gabriel approved the Platzi Docker course on 4 May 2022.

It demonstrates virtualization versus containers, work environment, container lifecycle, interactive mode, port exposure, bind mounts and volumes, file copy, image builds and layers, Docker as a development tool, networking between containers, Docker Compose (including team override), ENTRYPOINT versus CMD, SHELL versus EXEC, build context, multi-stage build and Docker-in-Docker.`,
		related: ["platzi"],
		tags: ["platzi","docker","containers","images","compose","volumes","devops","virtualization"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-b2",
		title: "Platzi English B2 Reported Speech and Conditionals course",
		text: `Gabriel approved the Platzi Upper-Intermediate English B2: Reported Speech and Conditionals course on 28 January 2023.

It demonstrates future perfect passive, third conditional, participles, hypotheticals with as if and as though, formal and informal register, passive reported speech, cleft sentences, only if, inversion with negative adverbs, and professional speaking practice.`,
		related: ["platzi"],
		tags: ["platzi","english","b2","reported speech","conditionals","grammar"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-opiniones",
		title: "Platzi English B2 Comments and Opinions course",
		text: `Gabriel approved the Platzi Upper-Intermediate English B2: Comments and Opinions course on 5 April 2022.

It demonstrates future continuous, reporting verbs, past perfect continuous, contrast (however, on the other hand, even though), appear seem look, worth and point, past intentions, beliefs in passive voice, I hear that, should and ought to, emphasis with do does did, complex comparisons, relative clauses (who whom whose which that where), and subordinators as soon as and as much as.`,
		related: ["platzi"],
		tags: ["platzi","english","b2","opinions","comments","comparisons","relative clauses"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-pasado-perfecto",
		title: "Platzi English B2 Past Perfect Passive and Adverbial Phrases course",
		text: `Gabriel approved the Platzi Upper-Intermediate English: Past Perfect Passive and Adverbial Phrases (2021) course on 10 April 2022.

It demonstrates instructions and needs, adverbial phrases, past perfect with time adverbials, future perfect, analytical language and passive voice, passive gerunds, past perfect passive, workplace priority expressions, would rather, as if versus as though, so as to, and British shall, with professional practice.`,
		related: ["platzi"],
		tags: ["platzi","english","b2","past perfect","adverbial phrases","passive voice"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "ingles-suposiciones",
		title: "Platzi English B2 Assumptions and Instructions course",
		text: `Gabriel approved the Platzi Upper-Intermediate English B2: Assumptions and Instructions course on 4 April 2022.

It demonstrates infinitives (in order to, so as to, subject and complement), supposed to and meant to, polite requests, rules and instructions, passive infinitives, forbid and allow, reported speech with infinitives, cleft sentences with what and that, restrictive and non-restrictive clauses, whether or not, and reason, probability and contrast (while, whereas, certainly, probably) in office, hotel, restaurant and hospital contexts.`,
		related: ["platzi"],
		tags: ["platzi","english","b2","assumptions","instructions","infinitives","relative clauses"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "js-clean-code",
		title: "Platzi course Clean Code and Best Practices with JavaScript",
		text: `Gabriel approved the Platzi course Clean Code and Best Practices with JavaScript on 7 April 2025.

It demonstrates clean code, technical debt and refactoring, naming (camelCase, names by type), variable scope and hoisting, functions (declaration, expression, arrow and this), ES6 OOP, inheritance and single responsibility, useful comments, team formatting, the DRY principle, and basics of algorithms and Big O complexity in JavaScript.`,
		related: ["platzi"],
		tags: ["platzi","clean code","javascript","best practices","refactor","technical debt","dry","naming"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "linux-servidores",
		title: "Platzi Linux Server Administration course",
		text: `Gabriel approved the Platzi Linux Server Administration course on 18 January 2023.

It demonstrates (per the historical course syllabus) Linux on servers, VM and SSH (tmux, Vim), packages and repositories, the file system, partitions, swap, GRUB and LVM, systemd, processes, users and groups, cron, permissions, networking and firewall, DNS, NTP, auditing, SSH tunnels and hardening (fail2ban).`,
		related: ["platzi"],
		tags: ["platzi","linux","servers","ssh","systemd","lvm","permissions","administration"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "pensamiento-prob",
		title: "Platzi Introduction to Probabilistic Thinking course",
		text: `Gabriel approved the Platzi Introduction to Probabilistic Thinking course on 30 March 2022.

It demonstrates probabilistic versus stochastic programming, conditional probability, Bayes theorem (intuition, visualization and Python calculation), modern applications, statistical errors and lies (charts, correlation versus causation, sampling, Texas sharpshooter fallacy, percentages, regression to the mean), an introduction to machine learning (vectors, distance metrics), clustering (hierarchical and K-means) and classification (including K-Nearest Neighbors).`,
		related: ["platzi"],
		tags: ["platzi","probability","bayes","probabilistic thinking","machine learning","statistics","python","clustering"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "platzi-alcance",
		title: "Which Platzi courses Gabriel completed, approved diplomas and certifications",
		text: `Which Platzi courses did Gabriel complete? Which diplomas did he approve?

KodexBar keeps a pack for his eighteen Platzi courses approved with diploma.

## Approved courses

- Introduction to AWS Cloud Computing Fundamentals (12 Sep 2025)
- Clean Code and Best Practices with JavaScript (7 Apr 2025)
- Basic Computers and Informatics (26 Mar 2025)
- Databases with SQL (9 Mar 2025)
- Linear Algebra Fundamentals with Python (28 Mar 2024)
- Svelte (20 Aug 2023)
- Practical AWS Compute with EC2 (20 Apr 2023)
- Upper-Intermediate English B2 Reported Speech and Conditionals (28 Jan 2023)
- Linux Server Administration (18 Jan 2023)
- Scrapy (10 May 2022)
- Docker (4 May 2022)
- Intermediate Django Testing Static Files Django Admin (14 Apr 2022)
- Basic Django (14 Apr 2022)
- Web Scraping Fundamentals with Python and XPath (12 Apr 2022)
- Upper-Intermediate English Past Perfect Passive and Adverbial Phrases (10 Apr 2022)
- Upper-Intermediate English B2 Comments and Opinions (5 Apr 2022)
- Upper-Intermediate English B2 Assumptions and Instructions (4 Apr 2022)
- Introduction to Probabilistic Thinking (30 Mar 2022)

Each course has its own note on what he learned. This pack does not invent courses outside that list.`,
		related: ["platzi"],
		tags: ["platzi","courses","certifications","diplomas","training","what he studied","what he learned","continuous education","completed"],
		visibility: "public",
		importance: "high",
	},
	{
		id: "scrapy",
		title: "Platzi Scrapy course",
		text: `Gabriel approved the Platzi Scrapy course on 10 May 2022.

It demonstrates the asynchronous Scrapy framework: install, Hello World, generators and iterators, Scrapy Shell, project layout, spiders, XPath extraction, saving data, response.follow, multiple callbacks, spider arguments and useful settings.

In the Platzi Intelligence Agency project he built a CIA-style site spider, a frontend, deploy to GitHub Pages and Scrapy Cloud, plus API automation and practices to avoid legal trouble.`,
		related: ["platzi"],
		tags: ["platzi","scrapy","web scraping","python","xpath","spiders","data extraction","pipelines"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "svelte",
		title: "Platzi Svelte course",
		text: `Gabriel approved the Platzi Svelte course on 20 August 2023.

It demonstrates Svelte UIs: install, styles, components, reactivity, props, conditionals, iteration, events, binding, lifecycle and stores.

In the project he built an Instagram-style social clone (Pugstagram) with timeline, APIs, comments, likes and deploy with Netlify.`,
		related: ["platzi"],
		tags: ["platzi","svelte","frontend","components","stores","webpack","javascript","ui"],
		visibility: "public",
		importance: "normal",
	},
	{
		id: "web-scraping-xpath",
		title: "Platzi Web Scraping Fundamentals with Python and XPath course",
		text: `Gabriel approved the Platzi Web Scraping Fundamentals with Python and XPath course on 12 April 2022.

It demonstrates what web scraping is and why to use it, HTTP, HTML, robots.txt, and XPath (nodes, expressions, predicates, operators, wildcards, in-text search, axes).

In the project he built a news scraper: XPath expressions, fetching article links with Python, and saving articles to text files.`,
		related: ["platzi"],
		tags: ["platzi","web scraping","xpath","python","html","http","robots.txt","data extraction"],
		visibility: "public",
		importance: "normal",
	}
];

export const PLATZI_CHUNKS_EN = defineChunks("platzi", "en", DEFS);
