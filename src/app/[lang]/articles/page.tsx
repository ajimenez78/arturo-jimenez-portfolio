import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowDown } from 'lucide-react';
import { notFound } from 'next/navigation';
import { LegacyArticleCard } from '@/components/legacy-article-card';
import type { Locale } from '@/lib/content';
import { legacyArticles } from '@/lib/legacy-articles';
import { legacyUi } from '@/lib/legacy-ui';

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const spanish = lang === 'es';
  return {
    title: spanish ? 'Artículos legacy' : 'Legacy articles',
    description: spanish
      ? 'Archivo de artículos de Arturo Jiménez sobre arquitectura de software, inteligencia artificial, tecnología, productividad y aprendizaje.'
      : 'Arturo Jiménez’s archive of writing on software architecture, artificial intelligence, technology, productivity, and learning.',
  };
}

export default async function ArticlesArchive({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'es') notFound();
  const locale = lang as Locale;
  const copy = legacyUi[locale];
  const years = [...new Set(legacyArticles.map((article) => article.date.slice(0, 4)))];

  return <main id="main" className="legacy-archive-page">
    <section className="legacy-archive-hero shell">
      <Link className="article-back" href={`/${locale}#legacy`}><ArrowLeft size={15}/>{copy.backHome}</Link>
      <div className="legacy-archive-title"><div><p className="eyebrow"><span className="status-dot"/>{copy.archiveEyebrow}</p><h1>{copy.archiveTitle}</h1></div><div><p>{copy.archiveIntro}</p><span>{copy.archiveMeta}</span><small>{copy.originalLanguage}</small></div></div>
      <a className="archive-scroll" href="#archive-list"><ArrowDown size={14}/>{locale === 'es' ? 'EXPLORAR EL ARCHIVO' : 'EXPLORE THE ARCHIVE'}</a>
    </section>

    <section className="legacy-archive-list shell" id="archive-list" aria-label={copy.archiveEyebrow}>
      {years.map((year) => {
        const yearArticles = legacyArticles.filter((article) => article.date.startsWith(year));
        const startIndex = legacyArticles.findIndex((article) => article.date.startsWith(year));
        return <div className="archive-year" key={year}>
          <div className="archive-year-heading"><h2>{year}</h2><span>{yearArticles.length} {locale === 'es' ? 'artículos' : 'articles'}</span></div>
          <div className="archive-year-grid">{yearArticles.map((article, index) => <LegacyArticleCard article={article} locale={locale} index={startIndex + index} compact key={article.slug}/>)}</div>
        </div>;
      })}
    </section>
  </main>;
}
