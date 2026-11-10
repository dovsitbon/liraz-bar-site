import type { Metadata } from "next";
import Link from "next/link";
import { getDict, isLocale, locales, type Locale } from "@/lib/i18n";

export async function generateMetadata({ params }: PageProps<"/[lang]/legal">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};
  const d = getDict(lang);
  return {
    title: `${d.legal.title} | Liraz Bar – לירז בר`,
    robots: { index: false },
    alternates: { canonical: `/${lang}/legal`, languages: Object.fromEntries(locales.map((l) => [l, `/${l}/legal`])) },
  };
}

export default async function Legal({ params }: PageProps<"/[lang]/legal">) {
  const { lang } = await params;
  const d = getDict(lang as Locale);
  return (
    <section className="mx-auto max-w-2xl px-5 pt-40 pb-28 md:pt-48">
      <h1 className="display text-[2.8rem] md:text-[3.6rem]">{d.legal.title}</h1>
      <dl className="mt-12 space-y-8">
        {d.legal.items.map((x) => (
          <div key={x.h} className="border-t border-line pt-6">
            <dt className="eyebrow">{x.h}</dt>
            <dd className="mt-3 leading-relaxed text-muted">{x.p}</dd>
          </div>
        ))}
      </dl>
      <Link href={`/${lang}`} className="btn-line mt-14">
        {d.legal.back}
      </Link>
    </section>
  );
}
