"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { RIBBON_PATH } from "@/components/Logo";

const KEY = "liraz-intro";
const TOTAL = 1.5;

// Quelques confettis dorés, très discrets : position horizontale (%), départ, taille, rotation, dérive
const CONFETTI = [
  [12, 0.62, 5, 30, -6], [24, 0.7, 4, -20, 8], [37, 0.66, 6, 45, -4], [49, 0.76, 4, 10, 6],
  [61, 0.64, 5, -35, -8], [73, 0.72, 4, 60, 5], [85, 0.68, 6, -15, -5], [30, 0.8, 3, 25, 4], [67, 0.82, 3, -50, -3],
] as const;

const markSeen = () => {
  try {
    sessionStorage.setItem(KEY, "1");
  } catch {}
  document.documentElement.classList.add("intro-seen");
};

/**
 * Ouverture (1,5 s, une fois par session, aucun son) : fond blanc cassé → un fin ruban doré se déroule au trait →
 * « לירז בר » en fondu, puis « LIRAZ BAR · EVENTS » → quelques confettis dorés tombent → fondu sur le hero.
 * Masquée d'office si l'utilisateur réduit les animations (script dans le layout + globals.css).
 */
export function Intro({ skipLabel }: { skipLabel: string }) {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      markSeen();
      setGone(true);
    }, TOTAL * 1000);
    return () => clearTimeout(t);
  }, []);

  if (gone) return null;

  return (
    <motion.div
      className="intro-curtain flex items-center justify-center text-ink"
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ delay: 1.18, duration: 0.32, ease: "easeOut" }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {CONFETTI.map(([x, delay, size, rot, drift], i) => (
          <motion.span
            key={i}
            className="absolute top-0 block bg-gold"
            style={{ left: `${x}%`, width: size, height: size * 1.6, borderRadius: 1 }}
            initial={{ y: "-5vh", opacity: 0, rotate: 0 }}
            animate={{ y: "62vh", x: drift * 4, opacity: [0, 0.75, 0.75, 0], rotate: rot * 4 }}
            transition={{ delay, duration: 0.85, ease: "easeIn" }}
          />
        ))}
      </div>

      <div className="relative flex w-[min(80vw,360px)] flex-col items-center">
        <svg viewBox="0 0 120 40" className="w-[70%]" aria-hidden="true" fill="none" stroke="var(--color-gold)" strokeWidth="0.9" strokeLinecap="round">
          <motion.path d={RIBBON_PATH} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6, ease: "easeInOut" }} />
        </svg>
        <motion.p
          lang="he"
          dir="rtl"
          translate="no"
          className="mt-5 font-[family-name:var(--font-frank)] text-[3rem] leading-none md:text-[3.4rem]"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.35, ease: "easeOut" }}
        >
          לירז בר
        </motion.p>
        <motion.p
          dir="ltr"
          translate="no"
          className="mt-4 ps-[0.42em] font-[family-name:var(--font-cormorant)] text-[0.875rem] tracking-[0.42em] text-gold-ink"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.3 }}
        >
          LIRAZ BAR · EVENTS
        </motion.p>
      </div>

      <button
        type="button"
        onClick={() => {
          markSeen();
          setGone(true);
        }}
        className="nav-link absolute end-4 bottom-4 z-10 min-h-11 px-4 text-muted transition-colors hover:text-ink"
      >
        {skipLabel}
      </button>
    </motion.div>
  );
}
