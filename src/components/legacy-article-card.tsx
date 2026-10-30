import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { Locale } from '@/lib/content';
import type { LegacyArticle } from '@/lib/legacy-articles';
import { formatLegacyDate, legacyUi } from '@/lib/legacy-ui';

export function LegacyArticleCard({ article, locale, index, compact = false }: { article: LegacyArticle; locale: Locale; index: number; compact?: boolean }) {
  const copy = legacyUi[locale];
  const category = copy.categories[article.category as keyof typeof copy.categories] || article.category;

  return <Link className={`legacy-card ${compact ? 'is-compact' : ''}`} href={`/${locale}/articles/${article.slug}`}>
    <article>
      <div className="legacy-card-top"><span className="legacy-card-index">{String(index + 1).padStart(2, '0')}</span><span>{category}</span><ArrowUpRight size={17}/></div>
      <h3>{article.title}</h3>
      {!compact && <p>{article.excerpt}</p>}
      <div className="legacy-card-meta"><time dateTime={article.date}>{formatLegacyDate(article.date, locale, true)}</time><span>{article.readingMinutes} {copy.minute}</span></div>
      <span className="legacy-card-action">{copy.readArticle}<ArrowUpRight size={13}/></span>
    </article>
  </Link>;
}
