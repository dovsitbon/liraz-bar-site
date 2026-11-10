"use client";

import Image from "next/image";
import { useState } from "react";
import realisations from "@/data/realisations.json";
import sizes from "@/data/media-sizes.json";
import { useLocale } from "@/components/providers";
import { WhatsAppIcon } from "@/components/icons";
import { EVENT_TYPES, formatCount, waLink, type EventType } from "@/lib/quote";

type Filter = "all" | EventType;

/** Événements réalisés (data/realisations.json), filtrables par type, style Social Pantry : photo, type, lieu, invités. */
export function EventsGrid() {
  const { lang, d } = useLocale();
  const e = d.events;
  const [filter, setFilter] = useState<Filter>("all");
  const items = realisations.items.filter((r) => filter === "all" || r.type === filter);
  const alt = (src: string) => d.alt[src.split("/").pop()!.replace(/\.\w+$/, "") as keyof typeof d.alt] ?? "";

  return (
    <>
      <div role="group" aria-label={e.filterLabel} className="mt-12 flex flex-wrap gap-2">
        {(["all", ...EVENT_TYPES] as Filter[]).map((f) => (
          <button key={f} type="button" className="chip" aria-pressed={filter === f} onClick={() => setFilter(f)}>
            {e.filters[f]}
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-12 border border-line px-6 py-14 text-center md:py-20">
          <p className="lead mx-auto max-w-lg">{e.empty}</p>
          <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="btn-line mt-8">
            <WhatsAppIcon className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      ) : (
        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
          {items.map((r, i) => {
            const [w, h] = (sizes as Record<string, number[]>)[r.image];
            return (
              <li key={r.id} className="fade-in group" style={{ animationDelay: `${Math.min(i, 8) * 0.04}s` }}>
                <div className="shine aspect-[4/5] bg-sand">
                  <Image src={r.image} width={w} height={h} alt={alt(r.image)} sizes="(min-width: 1024px) 23vw, 46vw" className="h-full w-full object-cover" />
                </div>
                <p className="eyebrow mt-4 !text-[0.8125rem]">
                  {e.types[r.type as EventType]} · <span className="num">{r.year}</span>
                </p>
                <h3 className="display mt-2 text-[1.3rem] md:text-[1.45rem]">{r.title[lang]}</h3>
                {/* À REMPLIR : lieu (place) et nombre d'invités (guests) dans data/realisations.json */}
                {(r.place || r.guests) && (
                  <p className="mt-1 text-[0.875rem] text-muted">
                    {[r.place, r.guests ? e.guests.replace("{n}", formatCount(r.guests, lang)) : null].filter(Boolean).join(" · ")}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
