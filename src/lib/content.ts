export type Locale = "en" | "es";

export const profile = {
  name: "Arturo Jiménez",
  fullName: "Arturo Jiménez de los Galanes Reguillos",
  email: "ajimenez78@gmail.com",
  location: "Alovera, Spain",
  linkedin: "https://www.linkedin.com/in/arturojimenezdelosgalanes",
  github: "https://github.com/ajimenez78",
} as const;

export type Experience = {
  period: string;
  role: string;
  company: string;
  location: string;
  summary: string;
  bullets: string[];
};

export type SiteContent = {
  nav: { about: string; work: string; journey: string; beyond: string; contact: string; cv: string };
  hero: { eyebrow: string; titleLine1: string; titleLine2: string; description: string; primaryAction: string; secondaryAction: string; location: string; caption: string };
  about: { eyebrow: string; title: string; paragraphs: string[] };
  stats: { value: string; label: string }[];
  expertise: { title: string; description: string; tags: string[] }[];
  experience: Experience[];
  projects: { title: string; category: string; description: string; tags: string[]; href: string; linkLabel: string }[];
  hobbies: { title: string; kicker: string; description: string }[];
  contact: { eyebrow: string; title: string; description: string; action: string };
  cv: { title: string; subtitle: string; download: string; print: string; back: string; experience: string; education: string; skills: string; languages: string; certifications: string; interests: string };
  sectionLabels: { expertise: string; work: string; workTitle: string; journey: string; journeyTitle: string; beyond: string; beyondTitle: string };
  education: { title: string; institution: string; period: string }[];
  certifications: { title: string; institution: string; period: string }[];
  labels: { readMore: string; viewRole: string; closeRole: string; viewAllProjects: string; originalCv: string; footer: string; menu: string; close: string; skip: string; language: string };
};

export const content: Record<Locale, SiteContent> = {
  en: {
    nav: { about: "About", work: "Work", journey: "Journey", beyond: "Beyond code", contact: "Let’s talk", cv: "View CV" },
    hero: {
      eyebrow: "SOFTWARE ARCHITECT · ENGINEER · EXPLORER",
      titleLine1: "Making complexity",
      titleLine2: "work for people.",
      description: "I’m Arturo. I connect architecture, engineering, and AI to build software that moves businesses forward. 25+ years of turning ambitious ideas into things that work.",
      primaryAction: "Explore my work",
      secondaryAction: "Get to know me",
      location: "BASED IN SPAIN · THINKING BEYOND BORDERS",
      caption: "Structure in the thinking. Possibility in the making.",
    },
    about: {
      eyebrow: "01 / THE PERSON BEHIND THE SYSTEMS",
      title: "A clear head for complex problems. A curious mind for what’s next.",
      paragraphs: [
        "I’m a staff-level software architect who still loves getting into the code. My work sits where system design, technical strategy, and hands-on engineering meet: helping teams make decisions that hold up beyond the next release.",
        "At Movilok, my current engagement with Moeve spans reference architectures, shared platform capabilities, and AI-enabled applications. I work across teams to turn good engineering into something repeatable, observable, and useful.",
        "I started programming on a Schneider CPC 464 when I was ten. That same curiosity still drives me: understand how things work, question the assumptions, and build something better for the people who use it.",
      ],
    },
    stats: [
      { value: "25+", label: "years building software" },
      { value: "10+", label: "initiatives using shared architecture" },
      { value: "~5", label: "engineering teams connected" },
    ],
    expertise: [
      { title: "Architecture with intent", description: "Reference architectures, distributed systems, and reusable capabilities that help teams move with confidence.", tags: ["System design", "Platform architecture", "API design", "Technical strategy"] },
      { title: "AI, put to work", description: "LLMs, conversational experiences, and agents integrated into real applications with traceability and context.", tags: ["LLM integration", "RAG", "AI agents", "GenAI architecture"] },
      { title: "Engineering that connects", description: "Hands-on development and cross-team leadership, from the first technical decision to observable production systems.", tags: ["TypeScript", "Node.js", "React", "Python", "Observability"] },
    ],
    experience: [
      {
        period: "JUN 2022 — PRESENT",
        role: "Senior Software Architect",
        company: "Movilok · Moeve",
        location: "Madrid, Spain",
        summary: "Connecting teams through shared architecture, platform capabilities, and applied AI.",
        bullets: [
          "Designed and developed an audit log analysis system with an integrated AI agent, combining structured audit data with LLM-based analysis for operational and security event investigation, contextual reasoning, traceability, observability, and maintainability.",
          "Defined reference architectures and reusable technical capabilities adopted across 10+ initiatives and approximately 5 engineering teams.",
          "Designed shared components for authentication, structured logging, observability, access control, and feature enablement.",
          "Guided internal teams and external vendors on architecture adoption, technical trade-offs, and integration decisions.",
          "Designed and contributed to reusable GenAI capabilities for mobile and web applications, including LLM integration and RAG-based conversational experiences.",
          "Improved application observability and traceability through Datadog integration libraries and dashboards across mobile and web solutions.",
          "Integrated Kiuwan and SonarQube into CI pipelines and supported application distribution workflows through Appcircle.",
          "Collaborated with Security, CI/CD, backend, and platform teams to drive consistent adoption of shared capabilities and reduce duplication.",
          "Led architecture decisions involving offline capabilities, Firebase, AWS Amplify, and custom solutions, balancing complexity, cost, and maintainability.",
        ],
      },
      {
        period: "JAN 2015 — JUN 2022",
        role: "Product Development Engineer",
        company: "Movilok",
        location: "Madrid, Spain",
        summary: "From custom projects to reusable products. Bringing interactive experiences to life.",
        bullets: [
          "Helped evolve the company from a project-based model toward reusable product capabilities and internal platforms.",
          "Led architecture and technical development of interactive digital signage solutions connecting mobile devices with large-format displays.",
          "Worked across engineering, product, business, and client-facing functions to shape features and product direction.",
          "Presented solutions internationally and contributed to commercial and technical discussions with clients and partners.",
          "Contributed to a product recognized with 2nd place at the DSE Apex Awards in Las Vegas.",
        ],
      },
      {
        period: "MAR 2006 — JAN 2015",
        role: "Mobile Solutions Engineer",
        company: "Movilok",
        location: "Madrid, Spain",
        summary: "Building mobile experiences for banking, government, and enterprise clients.",
        bullets: [
          "Designed and delivered mobile and web solutions for BBVA, Bankinter, Mutua Madrileña, the Spanish Government, and Moeve, combining hands-on engineering, technical leadership, project delivery, and stakeholder coordination.",
          "Contributed to BBVA mobile banking applications and applications for subsidiaries across multiple countries.",
          "Progressed from hands-on development into technical leadership, project ownership, and team coordination.",
          "Worked directly with clients to define requirements, technical approaches, and delivery plans.",
          "Supported hiring, onboarding, and engineering team growth as the company scaled.",
        ],
      },
      {
        period: "OCT 1999 — MAR 2006",
        role: "Software Engineer → Project Manager",
        company: "Soluziona · Unión Fenosa Group",
        location: "Ciudad Real, Spain",
        summary: "The foundations: enterprise systems, technical leadership, and growing responsibility.",
        bullets: [
          "Progressed from Junior Software Developer to Senior Software Developer, Team Leader, and Project Manager, taking on increasing technical, team, and delivery responsibilities.",
          "Led development teams and coordinated enterprise software initiatives, combining hands-on engineering with project planning and stakeholder communication.",
          "Contributed to Definete, a platform for dynamically generating personalized, device-adaptive web portals, working primarily with Java/J2EE.",
        ],
      },
    ],
    projects: [
      { title: "Oracle", category: "AI & PERSONAL KNOWLEDGE", description: "A personal oracle built around your own second brain. Exploring the connection between knowledge and AI.", tags: ["Python", "AI", "Knowledge systems"], href: "https://github.com/ajimenez78/oracle", linkLabel: "Explore repository" },
      { title: "Stoa", category: "GAME DESIGN & PRACTICAL PHILOSOPHY", description: "An interactive RPG that turns Stoic philosophy into daily practice, with guided reflection, mini-games, and a journey through the four cardinal virtues.", tags: ["Godot", "GDScript", "Game design"], href: "https://github.com/ajimenez78/stoa", linkLabel: "Explore repository" },
      { title: "Dance Tutor", category: "MOVEMENT & LEARNING", description: "A bilingual Salsa and Bachata tutor with short video lessons, guided rhythm practice, and progress tracking. Making a little daily practice feel natural.", tags: ["React", "TypeScript", "Learning"], href: "https://github.com/ajimenez78/dance_tutor", linkLabel: "Explore repository" },
    ],
    hobbies: [
      { title: "The long game.", kicker: "COMPETITIVE ATHLETICS", description: "Discipline, preparation, and the quiet satisfaction of getting a little better. Sport keeps me grounded and reminds me that progress is a practice." },
      { title: "A little wonder.", kicker: "MAGIC & PERFORMANCE", description: "As a semi-professional magician, I love creating moments that make people question what’s possible. A different kind of problem-solving, with an audience." },
      { title: "Finding the rhythm.", kicker: "MUSIC & CREATION", description: "Guitar, piano, and a little music production. A space to experiment, listen closely, and make something just for the joy of it." },
      { title: "Always a beginner.", kicker: "LIFELONG LEARNING", description: "I’m fascinated by learning itself: how we understand, remember, and connect ideas. Curiosity is the common thread in everything I do." },
    ],
    contact: { eyebrow: "LET’S BUILD WHAT’S NEXT", title: "Good things start\nwith a conversation.", description: "Architecture, AI, an ambitious idea, or a fresh perspective. I’m always interested in a thoughtful conversation.", action: "Say hello" },
    cv: { title: "Experience, in detail.", subtitle: "Staff-level Software Architect · System Design · Technical Strategy · Cross-Team Architecture · AI Engineering", download: "Download CV", print: "Print CV", back: "Back to the website", experience: "Professional experience", education: "Education", skills: "Technical expertise", languages: "Spanish (native) · English (professional working proficiency)", certifications: "Certifications", interests: "Beyond engineering" },
    sectionLabels: { expertise: "WHAT I BRING TO THE TABLE", work: "02 / SELECTED WORK", workTitle: "Ideas, made tangible.", journey: "03 / THE JOURNEY", journeyTitle: "Built over time.\nAlways moving forward.", beyond: "04 / BEYOND THE KEYBOARD", beyondTitle: "Serious about the work.\nCurious about everything." },
    education: [
      { title: "Master’s Degree in Computer Engineering", institution: "Universidad de Castilla-La Mancha · Ciudad Real, Spain", period: "SEP 1999 — JUN 2008" },
      { title: "Bachelor’s Degree in Computer Engineering", institution: "Universidad de Castilla-La Mancha · Ciudad Real, Spain", period: "SEP 1996 — SEP 1999" },
    ],
    certifications: [
      { title: "LLM Engineering", institution: "Ligency Team · Ed Donner", period: "JAN 2025 — APR 2025" },
      { title: "Competent Communicator / Competent Leader", institution: "Toastmasters International", period: "SEP 2014 — SEP 2017" },
    ],
    labels: { readMore: "Discover more", viewRole: "View experience", closeRole: "Close experience", viewAllProjects: "More on GitHub", originalCv: "CV · PDF · English", footer: "Built with intention. Fueled by curiosity.", menu: "Open menu", close: "Close menu", skip: "Skip to content", language: "Switch to Spanish" },
  },
  es: {
    nav: { about: "Sobre mí", work: "Proyectos", journey: "Trayectoria", beyond: "Más allá del código", contact: "Hablemos", cv: "Ver CV" },
    hero: {
      eyebrow: "ARQUITECTO DE SOFTWARE · INGENIERO · EXPLORADOR",
      titleLine1: "Convertir lo complejo",
      titleLine2: "en algo que importa.",
      description: "Soy Arturo. Conecto arquitectura, ingeniería e IA para crear software que hace avanzar a las empresas. Más de 25 años convirtiendo ideas ambiciosas en soluciones que funcionan.",
      primaryAction: "Explora mis proyectos",
      secondaryAction: "Conóceme mejor",
      location: "DESDE ESPAÑA · SIN FRONTERAS EN LAS IDEAS",
      caption: "Estructura para pensar. Posibilidades para crear.",
    },
    about: {
      eyebrow: "01 / LA PERSONA DETRÁS DE LOS SISTEMAS",
      title: "Claridad ante lo complejo. Curiosidad por lo que viene.",
      paragraphs: [
        "Soy arquitecto de software de nivel Staff y sigo disfrutando al escribir código. Mi trabajo conecta el diseño de sistemas, la estrategia técnica y la ingeniería: ayudar a los equipos a tomar decisiones que perduren más allá de la próxima entrega.",
        "En Movilok, mi colaboración actual con Moeve abarca arquitecturas de referencia, capacidades de plataforma compartidas y aplicaciones con IA. Trabajo entre equipos para que las buenas prácticas se conviertan en soluciones reutilizables, observables y útiles.",
        "Empecé a programar en un Schneider CPC 464 con diez años. Esa misma curiosidad me sigue moviendo: entender cómo funcionan las cosas, cuestionar las suposiciones y crear algo mejor para quienes lo utilizan.",
      ],
    },
    stats: [
      { value: "25+", label: "años creando software" },
      { value: "10+", label: "iniciativas con arquitectura compartida" },
      { value: "~5", label: "equipos de ingeniería conectados" },
    ],
    expertise: [
      { title: "Arquitectura con propósito", description: "Arquitecturas de referencia, sistemas distribuidos y capacidades reutilizables para que los equipos avancen con confianza.", tags: ["Diseño de sistemas", "Arquitectura de plataforma", "Diseño de APIs", "Estrategia técnica"] },
      { title: "IA que aporta valor", description: "LLMs, experiencias conversacionales y agentes integrados en aplicaciones reales, con trazabilidad y contexto.", tags: ["Integración de LLMs", "RAG", "Agentes de IA", "Arquitectura GenAI"] },
      { title: "Ingeniería que conecta", description: "Desarrollo y liderazgo técnico entre equipos, desde la primera decisión hasta sistemas observables en producción.", tags: ["TypeScript", "Node.js", "React", "Python", "Observabilidad"] },
    ],
    experience: [
      {
        period: "JUN 2022 — ACTUALIDAD",
        role: "Arquitecto de Software Senior",
        company: "Movilok · Moeve",
        location: "Madrid, España",
        summary: "Conectando equipos a través de la arquitectura compartida, las plataformas y la IA aplicada.",
        bullets: [
          "Diseño y desarrollo de un sistema de análisis de registros de auditoría con un agente de IA integrado, combinando datos estructurados y análisis con LLMs para investigar eventos operativos y de seguridad, con razonamiento contextual, trazabilidad, observabilidad y mantenibilidad.",
          "Definición de arquitecturas de referencia y capacidades técnicas reutilizables adoptadas en más de 10 iniciativas y aproximadamente 5 equipos de ingeniería.",
          "Diseño de componentes compartidos de autenticación, registro estructurado, observabilidad, control de acceso y activación de funcionalidades.",
          "Orientación a equipos internos y proveedores externos sobre adopción de arquitecturas, decisiones técnicas e integración.",
          "Diseño y contribución a capacidades GenAI reutilizables para aplicaciones móviles y web, incluyendo integración de LLMs y experiencias conversacionales basadas en RAG.",
          "Mejora de la observabilidad y trazabilidad mediante bibliotecas de integración y cuadros de mando con Datadog para soluciones móviles y web.",
          "Integración de Kiuwan y SonarQube en los pipelines de CI y apoyo a los flujos de distribución de aplicaciones mediante Appcircle.",
          "Colaboración con equipos de Seguridad, CI/CD, backend y plataforma para impulsar la adopción de capacidades comunes y reducir duplicidades.",
          "Liderazgo de decisiones de arquitectura sobre capacidades offline, Firebase, AWS Amplify y soluciones propias, equilibrando complejidad, coste y mantenibilidad.",
        ],
      },
      {
        period: "ENE 2015 — JUN 2022",
        role: "Ingeniero de Desarrollo de Producto",
        company: "Movilok",
        location: "Madrid, España",
        summary: "De proyectos a medida a productos reutilizables. Dando vida a experiencias interactivas.",
        bullets: [
          "Contribución a la evolución de la empresa desde un modelo basado en proyectos hacia capacidades de producto reutilizables y plataformas internas.",
          "Liderazgo de la arquitectura y el desarrollo técnico de soluciones de señalización digital interactiva que conectaban dispositivos móviles y pantallas de gran formato.",
          "Colaboración con ingeniería, producto, negocio y equipos de cliente para definir funcionalidades y la dirección del producto.",
          "Presentación de soluciones en eventos internacionales y participación en conversaciones comerciales y técnicas con clientes y socios.",
          "Contribución a un producto reconocido con el segundo puesto en los DSE Apex Awards de Las Vegas.",
        ],
      },
      {
        period: "MAR 2006 — ENE 2015",
        role: "Ingeniero de Soluciones Móviles",
        company: "Movilok",
        location: "Madrid, España",
        summary: "Experiencias móviles para banca, administración pública y grandes empresas.",
        bullets: [
          "Diseño y entrega de soluciones móviles y web para BBVA, Bankinter, Mutua Madrileña, el Gobierno de España y Moeve, combinando desarrollo, liderazgo técnico, entrega de proyectos y coordinación con las partes interesadas.",
          "Contribución a aplicaciones de banca móvil de BBVA y de sus filiales en distintos países.",
          "Evolución desde el desarrollo hacia el liderazgo técnico, la responsabilidad de proyectos y la coordinación de equipos.",
          "Trabajo directo con clientes para definir requisitos, enfoques técnicos y planes de entrega.",
          "Apoyo a la contratación, incorporación y crecimiento de los equipos de ingeniería.",
        ],
      },
      {
        period: "OCT 1999 — MAR 2006",
        role: "Ingeniero de Software → Jefe de Proyecto",
        company: "Soluziona · Grupo Unión Fenosa",
        location: "Ciudad Real, España",
        summary: "Los cimientos: sistemas empresariales, liderazgo técnico y nuevas responsabilidades.",
        bullets: [
          "Progresión desde desarrollador junior a desarrollador senior, responsable de equipo y jefe de proyecto, asumiendo responsabilidades técnicas, de equipo y de entrega.",
          "Liderazgo de equipos de desarrollo y coordinación de iniciativas de software empresarial, combinando desarrollo, planificación y comunicación con las partes interesadas.",
          "Participación en Definete, una plataforma para generar dinámicamente portales web personalizados y adaptados a diferentes dispositivos, principalmente con Java/J2EE.",
        ],
      },
    ],
    projects: [
      { title: "Oracle", category: "IA Y CONOCIMIENTO PERSONAL", description: "Un oráculo personal construido alrededor de tu propio segundo cerebro. Explorando la conexión entre conocimiento e IA.", tags: ["Python", "IA", "Sistemas de conocimiento"], href: "https://github.com/ajimenez78/oracle", linkLabel: "Explorar repositorio" },
      { title: "Stoa", category: "DISEÑO DE JUEGOS Y FILOSOFÍA PRÁCTICA", description: "Un RPG interactivo que convierte la filosofía estoica en práctica diaria, con reflexión guiada, minijuegos y un recorrido por las cuatro virtudes cardinales.", tags: ["Godot", "GDScript", "Diseño de juegos"], href: "https://github.com/ajimenez78/stoa", linkLabel: "Explorar repositorio" },
      { title: "Dance Tutor", category: "MOVIMIENTO Y APRENDIZAJE", description: "Un tutor bilingüe de salsa y bachata con lecciones breves en vídeo, práctica de ritmo guiada y seguimiento del progreso. Diseñado para practicar un poco cada día.", tags: ["React", "TypeScript", "Aprendizaje"], href: "https://github.com/ajimenez78/dance_tutor", linkLabel: "Explorar repositorio" },
    ],
    hobbies: [
      { title: "La carrera de fondo.", kicker: "DEPORTE DE COMPETICIÓN", description: "Disciplina, preparación y la satisfacción de mejorar un poco cada día. El deporte me mantiene con los pies en la tierra y me recuerda que progresar es un hábito." },
      { title: "Un poco de asombro.", kicker: "MAGIA Y ESCENARIO", description: "Como mago semiprofesional, disfruto creando momentos que hacen cuestionar lo posible. Otra forma de resolver problemas, esta vez con público." },
      { title: "Encontrar el ritmo.", kicker: "MÚSICA Y CREACIÓN", description: "Guitarra, piano y un poco de producción musical. Un espacio para experimentar, escuchar y crear por el simple placer de hacerlo." },
      { title: "Siempre aprendiendo.", kicker: "APRENDIZAJE CONTINUO", description: "Me fascina el propio aprendizaje: cómo entendemos, recordamos y conectamos ideas. La curiosidad es el hilo que une todo lo que hago." },
    ],
    contact: { eyebrow: "CONSTRUYAMOS LO QUE VIENE", title: "Las buenas ideas empiezan\ncon una conversación.", description: "Arquitectura, IA, una idea ambiciosa o una perspectiva nueva. Siempre hay espacio para una conversación interesante.", action: "Escríbeme" },
    cv: { title: "Mi experiencia, al detalle.", subtitle: "Arquitecto de Software de nivel Staff · Diseño de Sistemas · Estrategia Técnica · Arquitectura entre Equipos · Ingeniería de IA", download: "Descargar CV", print: "Imprimir CV", back: "Volver a la web", experience: "Experiencia profesional", education: "Formación", skills: "Competencias técnicas", languages: "Español (nativo) · Inglés (competencia profesional)", certifications: "Certificaciones", interests: "Más allá de la ingeniería" },
    sectionLabels: { expertise: "LO QUE APORTO", work: "02 / PROYECTOS SELECCIONADOS", workTitle: "Ideas que toman forma.", journey: "03 / LA TRAYECTORIA", journeyTitle: "Experiencia que suma.\nSiempre avanzando.", beyond: "04 / MÁS ALLÁ DEL TECLADO", beyondTitle: "Comprometido con el trabajo.\nCurioso por todo lo demás." },
    education: [
      { title: "Ingeniería Informática, titulación superior", institution: "Universidad de Castilla-La Mancha · Ciudad Real, España", period: "SEP 1999 — JUN 2008" },
      { title: "Ingeniería Técnica en Informática de Sistemas", institution: "Universidad de Castilla-La Mancha · Ciudad Real, España", period: "SEP 1996 — SEP 1999" },
    ],
    certifications: [
      { title: "Ingeniería de LLMs", institution: "Ligency Team · Ed Donner", period: "ENE 2025 — ABR 2025" },
      { title: "Comunicador Competente / Líder Competente", institution: "Toastmasters International", period: "SEP 2014 — SEP 2017" },
    ],
    labels: { readMore: "Descubre más", viewRole: "Ver experiencia", closeRole: "Cerrar experiencia", viewAllProjects: "Más en GitHub", originalCv: "CV · PDF · Inglés", footer: "Creado con intención. Impulsado por la curiosidad.", menu: "Abrir menú", close: "Cerrar menú", skip: "Saltar al contenido", language: "Cambiar a inglés" },
  },
};

export const cvSkills: Record<Locale, { title: string; items: string }[]> = {
  en: [
    { title: "Architecture", items: "System Design · Software Architecture · Platform Architecture · Distributed Systems · API Design · Technical Strategy · Architecture Governance" },
    { title: "Leadership & collaboration", items: "Technical Leadership · Cross-Team Collaboration · Stakeholder Management · Mentoring · Client Communication" },
    { title: "Cloud & platforms", items: "AWS · Google Cloud · Azure" },
    { title: "Languages & backend", items: "Node.js · TypeScript · Java · Python" },
    { title: "Frontend & mobile", items: "Vue.js · React.js · iOS · Android · Mobile/Web Application Architecture" },
    { title: "AI engineering", items: "LLMs · RAG · AI Agents · Embeddings · LLM Integration · GenAI Architecture · Open-Source Models · Fine-Tuning" },
    { title: "Observability & delivery", items: "Datadog · SonarQube · Kiuwan · CI/CD · Appcircle" },
  ],
  es: [
    { title: "Arquitectura", items: "Diseño de Sistemas · Arquitectura de Software · Arquitectura de Plataforma · Sistemas Distribuidos · Diseño de APIs · Estrategia Técnica · Gobierno de Arquitectura" },
    { title: "Liderazgo y colaboración", items: "Liderazgo Técnico · Colaboración entre Equipos · Gestión de Interlocutores · Mentoría · Comunicación con Clientes" },
    { title: "Cloud y plataformas", items: "AWS · Google Cloud · Azure" },
    { title: "Lenguajes y backend", items: "Node.js · TypeScript · Java · Python" },
    { title: "Frontend y móvil", items: "Vue.js · React.js · iOS · Android · Arquitectura de Aplicaciones Móviles y Web" },
    { title: "Ingeniería de IA", items: "LLMs · RAG · Agentes de IA · Embeddings · Integración de LLMs · Arquitectura GenAI · Modelos de Código Abierto · Fine-Tuning" },
    { title: "Observabilidad y entrega", items: "Datadog · SonarQube · Kiuwan · CI/CD · Appcircle" },
  ],
};
