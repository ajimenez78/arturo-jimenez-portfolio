import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Download } from 'lucide-react';
import { PrintButton } from '@/components/print-button';
import { content, cvSkills, profile, type Locale } from '@/lib/content';

type PageProps = { params: Promise<{ lang: string }> };

function getLocale(lang: string): Locale {
  if (lang !== 'en' && lang !== 'es') notFound();
  return lang;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const locale = getLocale((await params).lang);
  return {
    title: locale === 'es' ? 'Currículum' : 'Curriculum Vitae',
    description: locale === 'es'
      ? 'Currículum de Arturo Jiménez: más de 25 años de experiencia en arquitectura de software, estrategia técnica e ingeniería de IA. Consulta la trayectoria completa o descarga el CV.'
      : 'Arturo Jiménez’s CV: 25+ years in software architecture, technical strategy, and AI engineering. Read the complete experience or download the CV.',
  };
}

export default async function CvPage({ params }: PageProps) {
  const locale = getLocale((await params).lang);
  const c = content[locale];
  const spanish = locale === 'es';
  const downloadUrl = spanish
    ? '/documents/Arturo-Jimenez-CV-ES.pdf'
    : '/documents/Arturo-Jimenez-CV.pdf';
  const summary = spanish
    ? 'Arquitecto de Software de nivel Staff con más de 25 años de experiencia en diseño de sistemas, arquitectura y liderazgo técnico. Especializado en definir arquitecturas de referencia, capacidades de plataforma reutilizables y estándares de ingeniería adoptados por múltiples equipos y aplicaciones. Actualmente centrado en arquitectura de plataformas, ingeniería de IA, integración de LLMs, sistemas basados en RAG y agentes de IA.'
    : 'Staff-level Software Architect with 25+ years of experience in system design, architecture, and technical leadership. Experienced in defining reference architectures, reusable platform capabilities, and engineering standards adopted across multiple teams and applications. Current focus includes Platform Architecture, AI Engineering, LLM integration, RAG-based systems, and AI agents.';

  return (
    <main id="main" className="cv-page">
      <div className="shell">
        <div className="cv-toolbar">
          <Link href={`/${locale}`} className="text-link"><ArrowLeft size={16} aria-hidden="true" />{c.cv.back}</Link>
          <div className="cv-toolbar-actions">
            <PrintButton label={c.cv.print} />
            <a href={downloadUrl} download className="button button-dark"><Download size={16} aria-hidden="true" />{c.cv.download}</a>
          </div>
        </div>

        <article className="cv-document" aria-labelledby="cv-name">
          <header className="cv-document-header">
            <p className="eyebrow">{spanish ? 'CURRÍCULUM VITAE' : 'CURRICULUM VITAE'}</p>
            <h1 id="cv-name">{profile.fullName}</h1>
            <p className="cv-subtitle">{c.cv.subtitle}</p>
            <div className="cv-contact">
              <a href={`mailto:${profile.email}`}>{profile.email}</a>
              <span>{spanish ? 'Alovera, España' : profile.location}</span>
              <a href="tel:+34656609780">+34 656 609 780</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
            <p className="cv-summary">{summary}</p>
          </header>

          <section className="cv-section" aria-labelledby="cv-experience">
            <h2 id="cv-experience">{c.cv.experience}</h2>
            {c.experience.map((role) => (
              <section className="cv-role" key={role.period} aria-label={`${role.role}, ${role.company}`}>
                <div className="cv-role-header">
                  <div><h3>{role.role}</h3><p>{role.company} <span aria-hidden="true">·</span> {role.location}</p></div>
                  <p className="cv-period">{role.period}</p>
                </div>
                <ul>{role.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
              </section>
            ))}
          </section>

          <section className="cv-section" aria-labelledby="cv-education">
            <h2 id="cv-education">{c.cv.education}</h2>
            {c.education.map((item) => (
              <div className="cv-education-item" key={item.title}>
                <div><h3>{item.title}</h3><p>{item.institution}</p></div>
                <p className="cv-period">{item.period}</p>
              </div>
            ))}
          </section>

          <section className="cv-section" aria-labelledby="cv-certifications">
            <h2 id="cv-certifications">{c.cv.certifications}</h2>
            {c.certifications.map((item) => (
              <div className="cv-education-item" key={item.title}>
                <div><h3>{item.title}</h3><p>{item.institution}</p></div>
                <p className="cv-period">{item.period}</p>
              </div>
            ))}
          </section>

          <section className="cv-section" aria-labelledby="cv-skills">
            <h2 id="cv-skills">{c.cv.skills}</h2>
            <div className="cv-skills-grid">
              {cvSkills[locale].map((skill) => <div key={skill.title}><h3>{skill.title}</h3><p>{skill.items}</p></div>)}
            </div>
          </section>

          <section className="cv-section" aria-labelledby="cv-languages">
            <h2 id="cv-languages">{spanish ? 'Idiomas' : 'Languages'}</h2>
            <p>{c.cv.languages}</p>
          </section>

          <section className="cv-section" aria-labelledby="cv-interests">
            <h2 id="cv-interests">{c.cv.interests}</h2>
            <div className="cv-skills-grid">
              {c.hobbies.map((hobby) => <div key={hobby.kicker}><h3>{hobby.kicker}</h3><p>{hobby.description}</p></div>)}
            </div>
          </section>
        </article>

        {spanish && <p className="cv-original"><a href="/documents/Arturo-Jimenez-CV.pdf" download>{c.labels.originalCv}<Download size={14} aria-hidden="true" /></a></p>}
      </div>
    </main>
  );
}
