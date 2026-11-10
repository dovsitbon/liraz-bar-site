// Logo de Liraz Bar : elle n'a pas de logo (sa photo de profil est un portrait), donc logo typographique.
// « לירז בר » en Frank Ruhl Libre, « LIRAZ BAR » en capitales fines espacées, « EVENTS » en petit,
// et un fin ruban doré au trait (une boucle). Facile à remplacer : tout est ici, et app/icon.svg pour le favicon.

/** Ruban au trait, une seule boucle, dans un cadre 120 × 40 (aussi utilisé par l'ouverture). */
export const RIBBON_PATH = "M2 30C18 30 30 22 44 14C56 7 68 6 70 14C72 22 60 28 54 22C48 16 60 6 76 8C92 10 104 26 118 24";

/** Petite boucle de ruban seule (favicon, ornements). */
export const LOOP_PATH = "M4 34C12 18 24 8 32 12C40 16 34 30 26 28C18 26 22 12 34 9C40 7.5 44 9 46 11";

export function Ribbon({ className = "h-4 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <path d={RIBBON_PATH} />
    </svg>
  );
}

export function Emblem({ className = "h-10 w-auto" }: { className?: string }) {
  return (
    <svg viewBox="0 0 50 40" className={className} aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d={LOOP_PATH} />
    </svg>
  );
}

/** En-tête : « לירז בר » + « LIRAZ BAR · EVENTS ». */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`flex items-center gap-3 ${className}`} translate="no">
      <span className="flex flex-col items-center leading-none">
        <span className="font-[family-name:var(--font-frank)] text-[1.55rem] text-ink md:text-[1.7rem]" lang="he" dir="rtl">
          לירז בר
        </span>
        <span className="mt-1.5 flex items-center gap-2 font-[family-name:var(--font-cormorant)] text-[0.625rem] tracking-[0.42em] ps-[0.42em] text-gold-ink" dir="ltr">
          LIRAZ BAR <span className="opacity-60">·</span> EVENTS
        </span>
      </span>
    </span>
  );
}

/** Pied de page : logo complet centré. */
export function LogoFull({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center text-center ${className}`} translate="no">
      <Ribbon className="h-7 w-auto text-gold" />
      <span className="mt-4 font-[family-name:var(--font-frank)] text-[2.4rem] leading-none" lang="he" dir="rtl">
        לירז בר
      </span>
      <span className="mt-3 font-[family-name:var(--font-cormorant)] text-[1.15rem] tracking-[0.38em] ps-[0.38em]" dir="ltr">
        LIRAZ BAR
      </span>
      <span className="mt-2 font-[family-name:var(--font-jost)] text-[0.625rem] tracking-[0.5em] ps-[0.5em] opacity-75" dir="ltr">
        EVENTS
      </span>
    </span>
  );
}
