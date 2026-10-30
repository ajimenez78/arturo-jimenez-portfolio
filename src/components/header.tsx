'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { content, type Locale } from '@/lib/content';

export function Header({ lang }: { lang: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const toggle = useRef<HTMLButtonElement>(null);
  const c = content[lang];
  const links = [['about', c.nav.about], ['work', c.nav.work], ['journey', c.nav.journey], ['beyond', c.nav.beyond]];

  useEffect(() => {
    if (!open) return;
    document.querySelector<HTMLAnchorElement>('#main-navigation a')?.focus();
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { setOpen(false); toggle.current?.focus(); }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const languagePath = (locale: Locale) => pathname.replace(/^\/(en|es)(?=\/|$)/, `/${locale}`);
  return (
    <header className="site-header">
      <div className="header-inner shell">
        <Link href={`/${lang}`} className="wordmark" aria-label={lang === 'en' ? 'Arturo Jiménez — home' : 'Arturo Jiménez — inicio'}>
          <span className="monogram">aj<span>.</span></span>
          <span className="wordmark-name">Arturo Jiménez<span className="wordmark-title">{lang === 'en' ? 'SOFTWARE ARCHITECT' : 'ARQUITECTO DE SOFTWARE'}</span></span>
        </Link>
        <nav id="main-navigation" className={`main-nav ${open ? 'is-open' : ''}`} aria-label={lang === 'en' ? 'Main navigation' : 'Navegación principal'}>
          {links.map(([id, label]) => <Link key={id} href={`/${lang}#${id}`} onClick={() => setOpen(false)}>{label}</Link>)}
          <Link className="mobile-cv" href={`/${lang}/cv`} onClick={() => setOpen(false)}>{c.nav.cv} <ArrowUpRight size={14}/></Link>
        </nav>
        <div className="header-actions">
          <div className="language-switch" aria-label={c.labels.language}>
            {(['en', 'es'] as const).map(locale => <a key={locale} lang={locale} hrefLang={locale} href={languagePath(locale)} aria-current={locale === lang ? 'page' : undefined} onClick={event => { event.currentTarget.href = languagePath(locale) + window.location.hash; }}>{locale.toUpperCase()}</a>)}
          </div>
          <Link href={`/${lang}/cv`} className="header-cv">{c.nav.cv}<ArrowUpRight size={15}/></Link>
          <button ref={toggle} className="menu-toggle" aria-label={open ? c.labels.close : c.labels.menu} aria-expanded={open} aria-controls="main-navigation" onClick={() => setOpen(!open)}>{open ? <X size={23}/> : <Menu size={23}/>}</button>
        </div>
      </div>
    </header>
  );
}
