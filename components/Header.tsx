"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import site from "@/data/site.json";
import annonce from "@/data/annonces.json";
import { Ribbon, Wordmark } from "@/components/Logo";
import { LangSwitch } from "@/components/LangSwitch";
import { CloseIcon, InstagramIcon, MenuIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";

const ANNOUNCE_KEY = `liraz-annonce-${annonce.id}`;

export function Header() {
  const { lang, d } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  // Bandeau d'infos (data/annonces.json) : visible tant qu'il n'a pas été fermé
  const [notice, setNotice] = useState(false);

  useEffect(() => {
    let closed = false;
    try {
      closed = localStorage.getItem(ANNOUNCE_KEY) === "1";
    } catch {}
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lu une fois au montage (localStorage)
    setNotice(annonce.active && !closed);
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (menu) lenis?.stop();
    else lenis?.start();
    document.body.style.overflow = menu ? "hidden" : "";
    if (!menu) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menu]);

  const home = `/${lang}`;
  const links = [
    { href: `${home}#weddings`, label: d.nav.weddings },
    { href: `${home}#mitzvah`, label: d.nav.mitzvah },
    { href: `${home}#private`, label: d.nav.private },
    { href: `${home}#design`, label: d.nav.design },
    { href: `${home}#evenements`, label: d.nav.events },
    { href: `${home}#about`, label: d.nav.about },
    { href: `${home}#contact`, label: d.nav.contact },
  ];

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 bg-ivory/95 backdrop-blur-sm transition-[border-color] duration-700 ${scrolled ? "border-b border-line" : "border-b border-transparent"}`}>
        <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:z-10 focus:bg-ink focus:px-4 focus:py-2 focus:text-ivory">
          {d.nav.skip}
        </a>
        {notice && (
          <div className="relative flex items-center justify-center bg-champagne px-12 py-2 text-center text-[0.75rem] leading-snug text-ink md:text-[0.8125rem] rtl:md:text-[0.875rem]" role="region" aria-label={d.announce.close}>
            <p>{annonce.text[lang]}</p>
            <button
              type="button"
              onClick={() => {
                setNotice(false);
                try {
                  localStorage.setItem(ANNOUNCE_KEY, "1");
                } catch {}
              }}
              className="absolute end-2 flex h-9 w-9 items-center justify-center opacity-80 hover:opacity-100"
              aria-label={d.announce.close}
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </div>
        )}
        <div className="flex h-16 items-center justify-between gap-4 px-4 md:h-20 md:px-8 xl:px-12">
          <Link href={home} className="flex shrink-0 items-center" aria-label={d.nav.home}>
            <Wordmark />
          </Link>

          <nav className="hidden items-center gap-6 min-[1280px]:flex 2xl:gap-8" aria-label={d.nav.menu}>
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link whitespace-nowrap transition-colors duration-500 hover:text-gold-ink">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3 md:gap-5">
            <LangSwitch lang={lang} label={d.nav.language} className="hidden lg:flex" />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="-m-2 hidden h-11 w-11 items-center justify-center transition-colors hover:text-gold-ink lg:flex" aria-label="Instagram">
              <InstagramIcon />
            </a>
            <Link href={`${home}#contact`} className="btn-solid hidden !min-h-11 !px-6 !py-2 whitespace-nowrap sm:inline-flex">
              {d.nav.check}
            </Link>
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center min-[1280px]:hidden" onClick={() => setMenu(true)} aria-label={d.nav.menu} aria-expanded={menu}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </header>

      {menu && (
        <div className="fade-in fixed inset-0 z-[60] flex flex-col overscroll-contain bg-ivory text-ink" role="dialog" aria-modal="true" aria-label={d.nav.menu}>
          <div className="flex h-16 items-center justify-between px-4 md:h-20 md:px-8">
            <Wordmark />
            <button type="button" className="-m-2 flex h-11 w-11 items-center justify-center" onClick={() => setMenu(false)} aria-label={d.nav.close}>
              <CloseIcon />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-center justify-center gap-5" aria-label={d.nav.menu}>
            {links.map((l, i) => (
              <div key={l.href} className="fade-up" style={{ animationDelay: `${0.05 * i + 0.08}s` }}>
                <Link href={l.href} onClick={() => setMenu(false)} className="display text-[2.1rem]">
                  {l.label}
                </Link>
              </div>
            ))}
            <div className="fade-in mt-6" style={{ animationDelay: "0.45s" }}>
              <Link href={`${home}#contact`} onClick={() => setMenu(false)} className="btn-solid">
                {d.nav.check}
              </Link>
            </div>
            <Ribbon className="mt-8 h-8 w-auto text-gold" />
          </nav>
          <div className="flex items-center justify-between border-t border-line px-6 py-4">
            <LangSwitch lang={lang} label={d.nav.language} />
            <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center gap-2 text-sm" aria-label="Instagram">
              <InstagramIcon className="h-5 w-5" />
              <span dir="ltr">{site.instagramHandle}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
