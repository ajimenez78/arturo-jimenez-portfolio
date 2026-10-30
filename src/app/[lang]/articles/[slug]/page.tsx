import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Locale } from '@/lib/content';
import { legacyArticles } from '@/lib/legacy-articles';
import { formatLegacyDate, legacyUi } from '@/lib/legacy-ui';

export function generateStaticParams() {
  return legacyArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string; slug: string }> }): Promise<Metadata> {
  const { lang, slug } = await params;
  const article = legacyArticles.find((candidate) => candidate.slug === slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.excerpt,
    alternates: {
      languages: {
        en: `/en/articles/${article.slug}`,
        es: `/es/articles/${article.slug}`,
      },
    },
    openGraph: { title: article.title, description: article.excerpt, type: 'article', publishedTime: article.date, locale: lang === 'es' ? 'es_ES' : 'en_GB' },
  };
}

export default async function LegacyArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (lang !== 'en' && lang !== 'es') notFound();
  const locale = lang as Locale;
  const articleIndex = legacyArticles.findIndex((candidate) => candidate.slug === slug);
  if (articleIndex === -1) notFound();

  const article = legacyArticles[articleIndex];
  const copy = legacyUi[locale];
  const category = copy.categories[article.category as keyof typeof copy.categories] || article.category;
  const newerArticle = articleIndex > 0 ? legacyArticles[articleIndex - 1] : null;
  const olderArticle = articleIndex < legacyArticles.length - 1 ? legacyArticles[articleIndex + 1] : null;

  return <main id="main" className="legacy-article-page">
    <article>
      <header className="legacy-article-hero shell">
        <Link className="article-back" href={`/${locale}/articles`}><ArrowLeft size={15}/>{copy.backArchive}</Link>
        <div className="article-kicker"><span>{category}</span><span>ARCHIVE / {article.date.slice(0, 4)}</span></div>
        <h1>{article.title}</h1>
        <p className="article-deck">{article.excerpt}</p>
        <div className="article-meta"><time dateTime={article.date}>{formatLegacyDate(article.date, locale)}</time><span>{article.readingMinutes} {copy.minute}</span>{locale === 'en' && <span>{copy.originalLanguage}</span>}</div>
      </header>

      <div className="legacy-article-rule"><span/></div>
      <div className="legacy-article-body" lang="es" dangerouslySetInnerHTML={{ __html: article.bodyHtml }}/>
    </article>

    <nav className="article-pagination shell" aria-label={locale === 'es' ? 'Navegación entre artículos' : 'Article navigation'}>
      {olderArticle ? <Link className="article-pagination-link older" href={`/${locale}/articles/${olderArticle.slug}`}><ArrowLeft size={20}/><span><small>{copy.previousArticle}</small>{olderArticle.title}</span></Link> : <span/>}
      {newerArticle ? <Link className="article-pagination-link newer" href={`/${locale}/articles/${newerArticle.slug}`}><span><small>{copy.nextArticle}</small>{newerArticle.title}</span><ArrowRight size={20}/></Link> : <span/>}
    </nav>
  </main>;
}
