import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowDown, ArrowDownRight, ArrowUpRight, AudioLines, Blocks, Braces, Check, Cpu, Download, Github, Linkedin, MapPin, Plus, Sparkles } from 'lucide-react';
import { content, profile, type Locale } from '@/lib/content';

function SectionLabel({ number, children, light = false }: { number: string; children: React.ReactNode; light?: boolean }) {
  return <p className={`section-label ${light ? 'on-dark' : ''}`}><span>{number}</span>{typeof children === 'string' ? children.replace(/^\d+ \/ /, '') : children}</p>;
}

function ProjectArt({ index, es }: { index: number; es: boolean }) {
  if (index === 0) return <div className="project-art art-oracle" aria-hidden="true"><div className="oracle-grid"/><div className="oracle-doc doc-left"><span/><span/><span/><span/></div><div className="oracle-core"><Sparkles size={37} strokeWidth={1.3}/></div><div className="oracle-doc doc-right"><span/><span/><span/></div><span className="art-caption">{es ? 'CONTEXTO → CONOCIMIENTO → IDEAS' : 'CONTEXT → KNOWLEDGE → INSIGHT'}</span></div>;
  if (index === 1) return <div className="project-art art-stoa" aria-hidden="true">
    <svg className="project-illustration" viewBox="0 0 340 210" fill="none">
      <circle cx="252" cy="43" r="22" fill="#ed4b2f"/>
      <path d="M23 174H316M40 184H300M61 194H279" stroke="#b7bead"/>
      <path d="M72 155H270V168H72Z" fill="#b2baaa" stroke="#7f8976"/>
      <path d="M84 145H258V157H84Z" fill="#f1f2e9" stroke="#7f8976"/>
      <path d="M95 65 171 25 247 65Z" fill="#f4f4ec" stroke="#68735d"/>
      <path d="M112 60 171 30 230 60Z" fill="#ced5c3" stroke="#87917c"/>
      <path d="M90 65H252V78H90Z" fill="#252724"/>
      {[106, 149, 192, 235].map(x => <g key={x}><path d={`M${x - 7} 80H${x + 7}V141H${x - 7}Z`} fill="#f7f7f2" stroke="#87917c"/><path d={`M${x + 2} 82V139M${x - 10} 81H${x + 10}M${x - 10} 140H${x + 10}`} stroke="#a6af9a"/></g>)}
      <path d="M159 168H184L198 196H145Z" fill="#ed4b2f"/>
      <path d="M171 93V119M158 106H184" stroke="#ed4b2f"/>
      <path d="M44 68V83M37 76H52M287 116V131M280 124H295" stroke="#939d86"/>
    </svg>
    <span className="art-caption">{es ? 'REFLEXIÓN → PRÁCTICA → VIRTUD' : 'REFLECTION → PRACTICE → VIRTUE'}</span>
  </div>;
  return <div className="project-art art-dance" aria-hidden="true">
    <svg className="project-illustration" viewBox="0 0 340 210" fill="none">
      <circle cx="170" cy="104" r="80" stroke="#c18e73" strokeDasharray="2 7"/>
      <circle cx="170" cy="104" r="60" stroke="#d49d80"/>
      <path d="M92 153C131 155 113 104 160 106S195 49 239 49" stroke="#895f49" strokeDasharray="4 5"/>
      <g transform="translate(105 142) rotate(-28)"><rect x="-9" y="-17" width="18" height="30" rx="9" fill="#252724"/><rect x="-7" y="17" width="14" height="9" rx="3" fill="#252724"/></g>
      <g transform="translate(153 101) rotate(18)"><rect x="-9" y="-17" width="18" height="30" rx="9" fill="#f7f7f2" stroke="#ae7e65"/><rect x="-7" y="17" width="14" height="9" rx="3" fill="#f7f7f2" stroke="#ae7e65"/></g>
      <g transform="translate(208 64) rotate(-28)"><rect x="-9" y="-17" width="18" height="30" rx="9" fill="#ed4b2f"/><rect x="-7" y="17" width="14" height="9" rx="3" fill="#ed4b2f"/></g>
      <path d="M249 106V136M249 106 271 101V130" stroke="#252724" strokeWidth="2"/>
      <ellipse cx="243" cy="136" rx="7" ry="5" fill="#252724"/>
      <ellipse cx="265" cy="130" rx="7" ry="5" fill="#252724"/>
      {[0, 1, 2, 3, 4, 5, 6, 7].map(i => <circle key={i} cx={121 + i * 14} cy="189" r="3" fill={i === 0 || i === 4 ? '#ed4b2f' : '#a7785d'}/>)}
      <path d="M65 51V65M58 58H72M285 42V53M280 48H291" stroke="#a57153"/>
    </svg>
    <span className="art-caption">{es ? 'RITMO → MOVIMIENTO → PROGRESO' : 'RHYTHM → MOVEMENT → PROGRESS'}</span>
  </div>;
}

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'es') notFound();
  const locale = lang as Locale;
  const c = content[locale];
  const es = locale === 'es';
  return <main id="main">
    <section className="hero shell" aria-labelledby="hero-heading">
      <div className="hero-copy">
        <p className="eyebrow"><span className="status-dot"/>{c.hero.eyebrow}</p>
        <h1 id="hero-heading">{c.hero.titleLine1}<br/><span>{c.hero.titleLine2}</span></h1>
        <p className="hero-description">{c.hero.description}</p>
        <div className="hero-actions"><a className="button button-dark" href="#work">{c.hero.primaryAction}<ArrowDownRight size={18}/></a><a className="text-link" href="#about">{c.hero.secondaryAction}<ArrowUpRight size={16}/></a></div>
        <p className="hero-location"><MapPin size={13}/>{c.hero.location}<span className="location-divider"/><span>{es ? 'Perspectiva global.' : 'Global perspective.'}</span></p>
      </div>
      <div className="hero-visual">
        <div className="visual-topline"><span>FIG. 01 — {es ? 'PENSAR EN SISTEMAS' : 'THINK IN SYSTEMS'}</span><span className="tiny-cross">+</span></div>
        <Image className="architecture-image" src="/images/architecture.svg" alt={es ? 'Escultura isométrica de módulos conectados: arquitectura, plataformas e inteligencia artificial.' : 'Isometric sculpture of connected modules: architecture, platforms, and artificial intelligence.'} width={620} height={610} priority/>
        <div className="visual-foot"><span><span className="orange-square"/>{es ? 'DE LA COMPLEJIDAD A LA CLARIDAD' : 'FROM COMPLEXITY TO CLARITY'}</span><ArrowDownRight size={22}/></div>
      </div>
      <a href="#about" className="hero-scroll" aria-label={es ? 'Descubrir más sobre mí' : 'Discover more about me'}><ArrowDown size={14}/><span>{es ? 'SIGUE EXPLORANDO' : 'KEEP EXPLORING'}</span></a>
    </section>

    <div className="experience-strip"><div className="shell experience-strip-inner"><p>{es ? 'EXPERIENCIA EN PROYECTOS PARA' : 'EXPERIENCE DELIVERING FOR'}</p><div className="client-names"><span className="client-moeve">moeve<span>✳</span></span><span className="client-bbva">BBVA</span><span className="client-bankinter">bankinter<span>›</span></span><span className="client-mutua">Mutua Madrileña</span></div></div></div>

    <section className="about-section shell section-space" id="about">
      <SectionLabel number="01">{c.about.eyebrow}</SectionLabel>
      <div className="about-grid"><div className="portrait-wrap"><Image src="/images/arturo.jpeg" alt="Arturo Jiménez de los Galanes" width={748} height={561} className="portrait"/><div className="portrait-caption"><span>ARTURO JIMÉNEZ</span><span>MADRID, ES ↗</span></div><div className="portrait-mark" aria-hidden="true">aj.</div></div>
      <div className="about-copy"><h2>{c.about.title}</h2>{c.about.paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}<div className="about-socials"><a className="text-link" href={profile.linkedin} target="_blank" rel="noopener noreferrer"><Linkedin size={15}/>LinkedIn<ArrowUpRight size={13}/></a><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer"><Github size={15}/>GitHub<ArrowUpRight size={13}/></a></div></div></div>
      <div className="stats-grid">{c.stats.map(stat => <div className="stat" key={stat.label}><span className="stat-value">{stat.value}</span><span className="stat-label">{stat.label}</span></div>)}</div>
    </section>

    <section className="expertise-section"><div className="shell"><div className="expertise-heading"><SectionLabel number="02" light>{c.sectionLabels.expertise}</SectionLabel><span className="mono expertise-aside">{es ? 'BUEN CRITERIO. IMPACTO REAL.' : 'SOUND JUDGMENT. REAL IMPACT.'}</span></div><div className="expertise-grid">{c.expertise.map((item, index) => { const Icon = [Blocks, Cpu, Braces][index % 3]; return <article className="expertise-item" key={item.title}><Icon className="expertise-icon" size={29} strokeWidth={1.3}/><span className="expertise-index">0{index + 1}</span><h3>{item.title}</h3><p>{item.description}</p><div className="expertise-tags">{item.tags.map(tag => <span key={tag}>{tag}</span>)}</div></article>; })}</div></div></section>

    <section className="work-section shell section-space" id="work"><SectionLabel number="03">{c.sectionLabels.work}</SectionLabel><div className="section-heading"><h2>{c.sectionLabels.workTitle}</h2><a className="text-link" href={profile.github} target="_blank" rel="noopener noreferrer">{c.labels.viewAllProjects}<ArrowUpRight size={16}/></a></div><div className="project-grid">{c.projects.slice(0, 3).map((project, index) => <a href={project.href} className="project-card" target="_blank" rel="noopener noreferrer" key={project.title}><ProjectArt index={index} es={es}/><div className="project-info"><p className="project-category">0{index + 1} / {project.category}</p><div className="project-title"><h3>{project.title}</h3><span className="project-arrow"><ArrowUpRight size={20}/></span></div><p className="project-description">{project.description}</p><div className="project-tags">{project.tags.map(tag => <span key={tag}>{tag}</span>)}</div><span className="project-link-label">{project.linkLabel}<ArrowUpRight size={13}/></span></div></a>)}</div><div className="writing-link"><span><Braces size={17}/>{es ? 'Ideas, decisiones y aprendizajes integrados en cada proyecto.' : 'Ideas, decisions, and lessons built into every project.'}</span></div></section>

    <section className="journey-section section-space" id="journey"><div className="shell journey-grid"><div className="journey-intro"><SectionLabel number="04">{c.sectionLabels.journey}</SectionLabel><h2>{c.sectionLabels.journeyTitle}</h2><p>{es ? 'Del primer código a la estrategia técnica. La misma curiosidad, retos cada vez mayores.' : 'From the first lines of code to technical strategy. The same curiosity. Bigger challenges.'}</p><Link className="text-link" href={`/${locale}/cv`}>{c.nav.cv}<ArrowUpRight size={16}/></Link><span className="journey-decoration" aria-hidden="true">↳</span></div><div className="timeline">{c.experience.map((role, index) => <details className="career-role" key={role.role} open={index === 0}><summary><div className="role-period"><span className={`timeline-dot ${index === 0 ? 'current' : ''}`}/>{role.period}</div><div className="role-heading"><div><h3>{role.role}</h3><p>{role.company}</p></div><Plus className="role-toggle" size={20}/></div><p className="role-summary">{role.summary}</p><span className="role-disclosure">{c.labels.viewRole}<ArrowDown size={12}/></span></summary><div className="role-details"><p className="role-location"><MapPin size={12}/>{role.location}</p><ul>{role.bullets.map(bullet => <li key={bullet}><Check size={13}/><span>{bullet}</span></li>)}</ul></div></details>)}</div></div></section>

    <section className="cv-banner shell"><div><span className="mono">{es ? 'LA HISTORIA COMPLETA' : 'THE COMPLETE PICTURE'}</span><h2>{es ? 'Experiencia, en detalle.' : 'Experience, in detail.'}</h2></div><div className="cv-banner-actions"><Link className="button button-dark" href={`/${locale}/cv`}>{es ? 'Explorar mi CV' : 'Explore my CV'}<ArrowUpRight size={17}/></Link><a className="text-link" href={es ? '/documents/Arturo-Jimenez-CV-ES.pdf' : '/documents/Arturo-Jimenez-CV.pdf'} download>{c.cv.download}<Download size={16}/></a></div></section>

    <section className="beyond-section shell section-space" id="beyond"><SectionLabel number="05">{c.sectionLabels.beyond}</SectionLabel><div className="section-heading"><h2>{c.sectionLabels.beyondTitle}</h2><span className="beyond-note">{es ? 'Curiosidad, también fuera de la pantalla.' : 'Curiosity doesn’t stop at the screen.'}</span></div><div className="hobbies-grid">{c.hobbies.slice(0, 2).map((hobby, index) => <article key={hobby.title} className={`hobby-feature hobby-${index}`}><div className="hobby-image"><Image src={index === 0 ? '/images/athletics.png' : '/images/magic.webp'} alt={es ? index === 0 ? 'Arturo practicando ciclismo junto a un embalse' : 'Arturo actuando como mago en un escenario' : index === 0 ? 'Arturo cycling beside a reservoir' : 'Arturo performing a card illusion on stage'} width={1024} height={index === 0 ? 769 : 683}/></div><p className="project-category">{hobby.kicker}</p><h3>{hobby.title}</h3><p className="hobby-description">{hobby.description}</p></article>)}</div><div className="hobbies-secondary">{c.hobbies.slice(2).map((hobby, index) => <article key={hobby.title} className="hobby-small"><span className="hobby-icon">{index === 0 ? <AudioLines size={26} strokeWidth={1.3}/> : <Sparkles size={26} strokeWidth={1.3}/>}</span><div><h3>{hobby.title}</h3><p>{hobby.description}</p></div></article>)}</div></section>

    <section className="contact-section" id="contact"><div className="shell"><SectionLabel number="06">{c.contact.eyebrow}</SectionLabel><div className="contact-content"><div><h2>{c.contact.title}</h2><p>{c.contact.description}</p></div><a href={`mailto:${profile.email}`} className="contact-arrow" aria-label={c.contact.action}><ArrowUpRight size={58} strokeWidth={1.3}/></a></div><div className="contact-bottom"><a className="contact-email" href={`mailto:${profile.email}`}>{profile.email}<ArrowUpRight size={18}/></a><div><a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn<ArrowUpRight size={15}/></a><a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub<ArrowUpRight size={15}/></a></div></div></div></section>
  </main>;
}
