import type { Locale } from '@/lib/content';

export const legacyUi = {
  en: {
    nav: 'Articles',
    eyebrow: '05 / LEGACY ARTICLES',
    title: 'Ideas with a longer half-life.',
    intro: 'A living archive of 45 essays on software architecture, artificial intelligence, engineering, learning, and the systems around them.',
    archiveMeta: '45 ARTICLES · 2022—2025',
    originalLanguage: 'The original articles are preserved in Spanish.',
    readArticle: 'Read article',
    viewAll: 'Explore the complete archive',
    archiveEyebrow: 'THE COMPLETE ARCHIVE',
    archiveTitle: 'Thinking, documented.',
    archiveIntro: 'Every article from the original blog, now preserved here as part of the portfolio.',
    backHome: 'Back to the portfolio',
    backArchive: 'All legacy articles',
    nextArticle: 'Next article',
    previousArticle: 'Previous article',
    minute: 'min read',
    categories: {
      aprendizaje: 'Learning',
      'desarrollo-de-software': 'Software development',
      'inteligencia-artificial': 'Artificial intelligence',
      productividad: 'Productivity',
      'sin-categoria': 'Ideas',
      tecnologia: 'Technology',
    },
  },
  es: {
    nav: 'Artículos',
    eyebrow: '05 / ARTÍCULOS LEGACY',
    title: 'Ideas que siguen resonando.',
    intro: 'Un archivo vivo con 45 artículos sobre arquitectura de software, inteligencia artificial, ingeniería, aprendizaje y los sistemas que los conectan.',
    archiveMeta: '45 ARTÍCULOS · 2022—2025',
    originalLanguage: 'Los artículos se conservan en su versión original.',
    readArticle: 'Leer artículo',
    viewAll: 'Explorar el archivo completo',
    archiveEyebrow: 'EL ARCHIVO COMPLETO',
    archiveTitle: 'Pensamiento, documentado.',
    archiveIntro: 'Todos los artículos del blog original, ahora conservados aquí como parte del portfolio.',
    backHome: 'Volver al portfolio',
    backArchive: 'Todos los artículos legacy',
    nextArticle: 'Artículo siguiente',
    previousArticle: 'Artículo anterior',
    minute: 'min de lectura',
    categories: {
      aprendizaje: 'Aprendizaje',
      'desarrollo-de-software': 'Desarrollo de software',
      'inteligencia-artificial': 'Inteligencia artificial',
      productividad: 'Productividad',
      'sin-categoria': 'Ideas',
      tecnologia: 'Tecnología',
    },
  },
} as const satisfies Record<Locale, {
  nav: string;
  eyebrow: string;
  title: string;
  intro: string;
  archiveMeta: string;
  originalLanguage: string;
  readArticle: string;
  viewAll: string;
  archiveEyebrow: string;
  archiveTitle: string;
  archiveIntro: string;
  backHome: string;
  backArchive: string;
  nextArticle: string;
  previousArticle: string;
  minute: string;
  categories: Record<string, string>;
}>;

export function formatLegacyDate(date: string, locale: Locale, compact = false) {
  return new Intl.DateTimeFormat(locale === 'es' ? 'es-ES' : 'en-GB', {
    day: '2-digit',
    month: compact ? 'short' : 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(`${date}T12:00:00Z`));
}
