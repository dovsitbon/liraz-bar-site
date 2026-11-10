import Link from "next/link";
import site from "@/data/site.json";
import infos from "@/data/infos.json";
import { FacebookIcon, InstagramIcon, PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { LogoFull } from "@/components/Logo";
import { type Dict, type Locale } from "@/lib/i18n";
import { telHref, waLink } from "@/lib/quote";

export function Footer({ lang, d }: { lang: Locale; d: Dict }) {
  const year = new Date().getFullYear();
  const home = `/${lang}`;
  const nav = [
    { href: `${home}#weddings`, label: d.nav.weddings },
    { href: `${home}#mitzvah`, label: d.nav.mitzvah },
    { href: `${home}#private`, label: d.nav.private },
    { href: `${home}#evenements`, label: d.nav.events },
    { href: `${home}#about`, label: d.nav.about },
    { href: `${home}#contact`, label: d.nav.check },
  ];
  return (
    <footer className="bg-ink text-ivory">
      <div className="mx-auto grid max-w-[1400px] items-start gap-14 px-5 pt-20 pb-12 md:grid-cols-3 md:px-10 md:pt-24">
        <div className="order-first md:order-none md:col-start-2">
          <LogoFull />
          <p className="mx-auto mt-8 max-w-xs text-center text-[0.9375rem] leading-relaxed text-ivory/80">{d.footer.tagline}</p>
        </div>
        <div className="md:col-start-1 md:row-start-1">
          <p className="eyebrow !text-gold">{d.footer.contact}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem]">
            <li>
              <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            </li>
            <li>
              <a href={telHref} className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <PhoneIcon className="h-4 w-4" />
                <span dir="ltr">{site.phone}</span>
              </a>
            </li>
            <li>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <InstagramIcon className="h-4 w-4" />
                <span dir="ltr">{site.instagramHandle}</span>
              </a>
            </li>
            <li>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-3 hover:text-gold">
                <FacebookIcon className="h-4 w-4" />
                Facebook
              </a>
            </li>
          </ul>
          <p className="eyebrow mt-10 !text-gold">{d.footer.regions}</p>
          {/* À CONFIRMER : régions couvertes (data/infos.json) */}
          <p className="mt-4 max-w-xs text-[0.9375rem] leading-relaxed text-ivory/85">{infos.regionsLabel[lang]}</p>
        </div>
        <div className="md:text-end">
          <p className="eyebrow !text-gold">{d.footer.explore}</p>
          <ul className="mt-5 space-y-3 text-[0.9375rem] text-ivory/90">
            {nav.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-8 items-center hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mx-auto flex max-w-[1400px] flex-col gap-2 border-t border-ivory/15 px-5 py-6 pb-24 text-[0.8125rem] text-ivory/75 sm:pb-6 md:flex-row md:justify-between md:px-10">
        <p>
          © {year} <span translate="no">{lang === "he" ? site.nameHe : `Liraz Bar – ${site.nameHe}`}</span> · {d.footer.rights}
        </p>
        <p className="flex flex-wrap gap-x-4">
          <span>{d.footer.photos}</span>
          <Link href={`${home}/legal`} className="underline-offset-4 hover:text-gold hover:underline">
            {d.footer.legal}
          </Link>
        </p>
      </div>
    </footer>
  );
}
