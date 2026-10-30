import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

const argumentsMap = Object.fromEntries(process.argv.slice(2).map((argument) => {
  const [key, ...value] = argument.replace(/^--/, '').split('=');
  return [key, value.join('=')];
}));

const postsPath = resolve(argumentsMap.posts || '/tmp/legacy-posts.json');
const categoriesPath = resolve(argumentsMap.categories || '/tmp/legacy-categories.json');
const outputPath = resolve(argumentsMap.output || 'src/lib/legacy-articles.ts');

const posts = JSON.parse(readFileSync(postsPath, 'utf8'));
const categories = JSON.parse(readFileSync(categoriesPath, 'utf8'));
const categoryById = new Map(categories.map((category) => [category.id, category.slug]));
const articleSlugs = new Set(posts.map((post) => post.slug));

const entities = {
  amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ',
  ndash: '–', mdash: '—', hellip: '…', laquo: '«', raquo: '»',
};

function decodeEntities(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const hexadecimal = code[1]?.toLowerCase() === 'x';
      return String.fromCodePoint(Number.parseInt(code.slice(hexadecimal ? 2 : 1), hexadecimal ? 16 : 10));
    }
    return entities[code.toLowerCase()] ?? entity;
  });
}

function escapeAttribute(value) {
  return decodeEntities(value).replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

function textFromHtml(html) {
  return decodeEntities(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim());
}

function localImagePath(source) {
  const match = source.match(/\/wp-content\/uploads\/(.+)$/i);
  if (!match) return null;
  return `/images/legacy/${match[1].replace(/\.[a-z0-9]+$/i, '.webp')}`;
}

function sanitizeAnchor(match, attributes, innerHtml) {
  const hrefMatch = attributes.match(/href=(?:"([^"]*)"|'([^']*)')/i);
  if (!hrefMatch) return innerHtml;
  const rawHref = decodeEntities(hrefMatch[1] || hrefMatch[2] || '').trim();

  if (/^https?:\/\/(?:www\.)?arturo-jimenez\.es/i.test(rawHref)) {
    const path = new URL(rawHref).pathname.replace(/^\/+|\/+$/g, '');
    if (articleSlugs.has(path)) return `<a href="${escapeAttribute(path)}">${innerHtml}</a>`;
    return innerHtml;
  }

  if (rawHref.startsWith('#')) return `<a href="${escapeAttribute(rawHref)}">${innerHtml}</a>`;
  if (/^https?:\/\//i.test(rawHref)) return `<a href="${escapeAttribute(rawHref)}" target="_blank" rel="noopener noreferrer">${innerHtml}</a>`;
  return innerHtml;
}

function sanitizeBody(html) {
  let body = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<iframe\b([^>]*)>[\s\S]*?<\/iframe>/gi, (match, attributes) => {
      const source = attributes.match(/src=(?:"([^"]*)"|'([^']*)')/i);
      if (!source) return '';
      const href = (source[1] || source[2] || '').replace(/^\/\//, 'https://');
      return `<a href="${escapeAttribute(href)}" target="_blank" rel="noopener noreferrer">Abrir el ejemplo interactivo</a>`;
    })
    .replace(/<img\b([^>]*)\/?\s*>/gi, (match, attributes) => {
      const source = attributes.match(/src=(?:"([^"]*)"|'([^']*)')/i);
      if (!source) return '';
      const path = localImagePath(source[1] || source[2] || '');
      if (!path) return '';
      const alternative = attributes.match(/alt=(?:"([^"]*)"|'([^']*)')/i);
      const alt = alternative ? alternative[1] || alternative[2] || '' : '';
      return `<img src="${escapeAttribute(path)}" alt="${escapeAttribute(alt)}" loading="lazy" />`;
    })
    .replace(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi, sanitizeAnchor)
    .replace(/https?:\/\/(?:www\.)?arturo-jimenez\.es\/?/gi, 'esta web')
    .replace(/<small>\s*powered by Advanced iFrame\s*<\/small>/gi, '')
    .replace(/<\/?(?:div|span)\b[^>]*>/gi, '')
    .replace(/\s(?:class|id|style|width|height|decoding|fetchpriority|data-[\w-]+)=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\son[\w-]+=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/<p>\s*(?:&nbsp;)?\s*<\/p>/gi, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  const allowedTags = new Set(['p', 'strong', 'em', 'a', 'figure', 'img', 'pre', 'code', 'ol', 'ul', 'li', 'h2', 'h3', 'h4', 'h5', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'br', 'hr', 'small', 'blockquote', 'cite', 'figcaption', 'sup', 'sub']);
  body = body.replace(/<\/?([a-z0-9-]+)\b[^>]*>/gi, (tag, name) => allowedTags.has(name.toLowerCase()) ? tag : '');
  return body;
}

const articles = posts.map((post) => {
  const bodyHtml = sanitizeBody(post.content.rendered);
  const plainText = textFromHtml(bodyHtml);
  const excerpt = textFromHtml(post.excerpt.rendered).replace(/\s*Leer más\s*$/i, '').trim();
  const firstImage = bodyHtml.match(/<img src="([^"]+)"/i)?.[1] ?? null;
  const category = post.categories.map((id) => categoryById.get(id)).find(Boolean) || 'sin-categoria';
  return {
    slug: post.slug,
    title: textFromHtml(post.title.rendered),
    date: post.date.slice(0, 10),
    category,
    excerpt: excerpt || `${plainText.slice(0, 230).trim()}…`,
    readingMinutes: Math.max(1, Math.ceil(plainText.split(/\s+/).filter(Boolean).length / 220)),
    image: firstImage,
    bodyHtml,
  };
});

const output = `// Generated by scripts/import-legacy-articles.mjs from Arturo's original WordPress export.\n// The HTML is sanitized at import time and all archive images are served locally.\n\nexport type LegacyArticle = {\n  slug: string;\n  title: string;\n  date: string;\n  category: string;\n  excerpt: string;\n  readingMinutes: number;\n  image: string | null;\n  bodyHtml: string;\n};\n\nexport const legacyArticles = ${JSON.stringify(articles, null, 2)} as const satisfies readonly LegacyArticle[];\n`;

writeFileSync(outputPath, output);
console.log(`Imported ${articles.length} articles into ${outputPath}`);
