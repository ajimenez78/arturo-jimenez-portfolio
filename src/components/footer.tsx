import Link from 'next/link';
import { ArrowUpRight, Github, Linkedin } from 'lucide-react';
import { content, profile, type Locale } from '@/lib/content';

export function Footer({ lang }: { lang: Locale }) {
  const c = content[lang];
  return <footer className="footer shell">
    <Link className="footer-brand" href={`/${lang}`}>Arturo Jiménez<span className="orange">.</span></Link>
    <p>© {new Date().getFullYear()} · {c.labels.footer}</p>
    <div className="footer-links">
      <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub"><Github size={17}/></a>
      <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin size={17}/></a>
      <Link href={`/${lang}/cv`}>{c.nav.cv}<ArrowUpRight size={14}/></Link>
      <a href="#top" aria-label={lang === 'en' ? 'Back to top' : 'Volver arriba'}>↑</a>
    </div>
  </footer>;
}
