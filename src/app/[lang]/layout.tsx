import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { notFound } from 'next/navigation';
import { content, type Locale } from '@/lib/content';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import '../globals.css';

const manrope = localFont({
  src: [
    { path: '../../../public/fonts/manrope-regular.ttf', weight: '400', style: 'normal' },
    { path: '../../../public/fonts/manrope-bold.ttf', weight: '500 800', style: 'normal' },
  ],
  variable: '--font-manrope',
  display: 'swap',
});
const mono = localFont({ src: '../../../public/fonts/ibm-plex-mono.ttf', variable: '--font-mono', display: 'swap' });

export function generateStaticParams() { return [{ lang: 'en' }, { lang: 'es' }]; }

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const spanish = lang === 'es';
  const title = spanish ? 'Arturo Jiménez — Arquitecto de software' : 'Arturo Jiménez — Software Architect';
  const description = spanish ? 'Arquitectura de software, estrategia técnica e ingeniería de IA. Más de 25 años conectando tecnología, equipos e impacto.' : 'Software architecture, technical strategy, and AI engineering. 25+ years connecting technology, teams, and impact.';
  return { title: { default: title, template: '%s — Arturo Jiménez' }, description, applicationName: 'Arturo Jiménez', authors: [{ name: 'Arturo Jiménez de los Galanes' }], openGraph: { title, description, type: 'profile', locale: spanish ? 'es_ES' : 'en_GB', firstName: 'Arturo', lastName: 'Jiménez de los Galanes' }, robots: { index: true, follow: true } };
}

export default async function RootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'en' && lang !== 'es') notFound();
  const locale = lang as Locale;
  return <html lang={locale} className={`${manrope.variable} ${mono.variable}`}><body id="top"><a className="skip-link" href="#main">{content[locale].labels.skip}</a><Header lang={locale}/>{children}<Footer lang={locale}/></body></html>;
}
