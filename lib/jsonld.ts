import site from "@/data/site.json";
import infos from "@/data/infos.json";
import avis from "@/data/avis.json";
import { getDict, type Locale } from "@/lib/i18n";

const SERVICE_TYPES: Record<string, string> = {
  wedding: "Wedding planning and production",
  bar: "Bar mitzvah production",
  bat: "Bat mitzvah production",
  private: "Private event production",
};

/** Données structurées : EventPlanner (LocalBusiness), une Service par type d'événement, avis réels, FAQ. */
export function homeJsonLd(lang: Locale) {
  const d = getDict(lang);
  const he = lang === "he";
  const areaServed = infos.regions ?? [{ "@type": "Country", name: "Israel" }];
  const reviews = avis.items as { nameLatin: string; date: string; text: { he: string } }[];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["EventPlanner", "LocalBusiness"],
        "@id": `${site.url}/#business`,
        name: he ? site.nameHe : `Liraz Bar – ${site.nameHe}`,
        alternateName: ["לירז בר הפקות אירועים", "Liraz Bar Events", "זוג הפקות אירועים"],
        slogan: d.hero.title,
        description: d.meta.description,
        url: `${site.url}/${lang}`,
        image: `${site.url}/og.jpg`,
        logo: `${site.url}/icon.svg`,
        telephone: site.phoneIntl.replace(/[\s-]/g, ""),
        address: { "@type": "PostalAddress", addressCountry: "IL" },
        areaServed,
        knowsLanguage: ["he", "en"],
        sameAs: [site.instagram, site.facebook],
        ...(reviews.length
          ? {
              review: reviews.map((r) => ({
                "@type": "Review",
                author: { "@type": "Person", name: r.nameLatin },
                datePublished: r.date,
                reviewBody: r.text.he,
                inLanguage: "he",
              })),
            }
          : {}),
      },
      ...d.types.items.map((x) => ({
        "@type": "Service",
        name: x.name,
        description: x.text,
        serviceType: SERVICE_TYPES[x.id],
        provider: { "@id": `${site.url}/#business` },
        areaServed,
      })),
      ...d.services.items.map((x) => ({
        "@type": "Service",
        name: x.name,
        description: x.text,
        provider: { "@id": `${site.url}/#business` },
        areaServed,
      })),
      {
        "@type": "FAQPage",
        mainEntity: d.faq.items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };
}
