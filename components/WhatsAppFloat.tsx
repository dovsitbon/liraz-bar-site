"use client";

import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { waLink } from "@/lib/quote";

/**
 * Mobile : barre fixée en bas de l'écran (« לבדיקת תאריך » + WhatsApp), toujours visible.
 * Ordinateur : pastille WhatsApp discrète (le bouton « לבדיקת תאריך » est déjà dans l'en-tête).
 */
export function WhatsAppFloat() {
  const { lang, d } = useLocale();
  const wa = waLink(d.whatsapp.hello);
  return (
    <>
      <div className="fixed inset-x-0 bottom-0 z-40 flex border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm sm:hidden">
        <a href={`/${lang}#contact`} className="nav-link flex min-h-14 flex-[1.6] items-center justify-center bg-ink text-ivory">
          {d.mobile.check}
        </a>
        <a href={wa} target="_blank" rel="noopener noreferrer" className="nav-link flex min-h-14 flex-1 items-center justify-center gap-2 text-ink">
          <WhatsAppIcon className="h-4 w-4" />
          {d.mobile.whatsapp}
        </a>
      </div>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={d.whatsapp.float}
        className="fixed end-6 bottom-6 z-40 hidden h-14 w-14 items-center justify-center rounded-full bg-ink text-ivory ring-1 ring-gold/60 transition-colors duration-500 hover:bg-gold-ink sm:flex"
      >
        <WhatsAppIcon />
      </a>
    </>
  );
}
