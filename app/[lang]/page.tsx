import Image from "next/image";
import site from "@/data/site.json";
import stats from "@/data/stats.json";
import prestations from "@/data/prestations.json";
import avis from "@/data/avis.json";
import { Reveal } from "@/components/Reveal";
import { QuoteForm } from "@/components/QuoteForm";
import { EventsGrid } from "@/components/EventsGrid";
import { PrefillLink } from "@/components/PrefillLink";
import { Ribbon } from "@/components/Logo";
import { ArrowIcon, InstagramIcon, PhoneIcon, PlusIcon, WhatsAppIcon } from "@/components/icons";
import { altOf, fill, getDict, intlLocale, type Dict, type Locale } from "@/lib/i18n";
import { homeJsonLd } from "@/lib/jsonld";
import { img } from "@/lib/media";
import { formatCount, shekels, telHref, waLink, type EventType, type Need } from "@/lib/quote";

const monthYear = (ym: string, lang: Locale) => {
  const [y, m] = ym.split("-").map(Number);
  return new Intl.DateTimeFormat(intlLocale[lang], { month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(Date.UTC(y, m - 1, 1)));
};

function Photo({ src, d, sizes, className = "", imgClass = "", priority = false }: { src: string; d: Dict; sizes: string; className?: string; imgClass?: string; priority?: boolean }) {
  const p = img(src);
  return (
    <div className={`bg-sand ${className}`}>
      <Image src={p.src} width={p.width} height={p.height} alt={altOf(d, p.src)} sizes={sizes} priority={priority} className={`h-full w-full object-cover ${imgClass}`} />
    </div>
  );
}

function SectionHead({ eyebrow, title, text, center = false, id }: { eyebrow: string; title: string; text?: string; center?: boolean; id?: string }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="display mt-5 text-[2.4rem] md:text-[3.4rem]">
        {title}
      </h2>
      {text && <p className={`lead mt-6 ${center ? "mx-auto max-w-xl" : "max-w-xl"}`}>{text}</p>}
    </Reveal>
  );
}

// Cartes portrait par type d'événement (style Begnis) ; l'id sert d'ancre au menu
const TYPE_CARDS: Record<EventType, { image: string; anchor?: string; pos?: string }> = {
  wedding: { image: "/media/mariages/mur-sequins-or.jpg", anchor: "weddings", pos: "object-[50%_40%]" },
  bar: { image: "/media/bar-bat-mitsva/arches-bar-mitzvah.jpg", anchor: "mitzvah" },
  bat: { image: "/media/bar-bat-mitsva/bat-mitzvah-bar-rose.jpg" },
  private: { image: "/media/prives/welcome-baby-girl.jpg", anchor: "private", pos: "object-[70%_50%]" },
};

const BLOCK_IMAGES: Record<string, string> = {
  production: "/media/bar-bat-mitsva/bat-mitzvah-carrosse.jpg",
  dayof: "/media/decoration/spheres-miroir.jpg",
  design: "/media/bar-bat-mitsva/bar-mitzvah-eliav.jpg",
};
const BLOCK_LINKS: Record<string, string> = { production: "#contact", dayof: "#process", design: "#evenements" };

export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang: l } = await params;
  const lang = l as Locale;
  const d = getDict(lang);
  const followers = formatCount(stats.instagramFollowers, lang);
  const proof = fill(d.hero.proof, { n: followers, year: stats.sinceYear });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homeJsonLd(lang)).replace(/</g, "\\u003c") }} />

      {/* ——— Hero : son moment le plus fort, 2 boutons ——— */}
      <section aria-labelledby="hero-title" className="mx-auto grid max-w-[1400px] items-center gap-12 px-5 pt-32 pb-16 md:grid-cols-[1fr_1fr] md:gap-16 md:px-10 md:pt-40 md:pb-24 lg:gap-24">
        <div className="md:order-2">
          <Photo src="/media/hero/slow-etincelles.jpg" d={d} priority sizes="(min-width: 768px) 46vw, 92vw" className="rise aspect-[5/4] md:aspect-[5/6]" imgClass="object-[48%_50%]" />
        </div>
        <div className="text-center md:text-start">
          <p className="eyebrow rise">{d.hero.eyebrow}</p>
          <h1 id="hero-title" className="display rise mt-6 text-[3rem] md:text-[4.2rem] lg:text-[5.2rem]" style={{ animationDelay: "0.1s" }}>
            {d.hero.title}
          </h1>
          <Ribbon className="rise mx-auto mt-8 h-6 w-auto text-gold md:mx-0 rtl:-scale-x-100" />
          <p className="lead rise mx-auto mt-7 max-w-md md:mx-0" style={{ animationDelay: "0.2s" }}>
            {d.hero.text}
          </p>
          <div className="rise mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center md:justify-start" style={{ animationDelay: "0.3s" }}>
            <a href="#contact" className="btn-solid w-full sm:w-auto">
              {d.hero.cta}
            </a>
            <a href="#evenements" className="btn-line w-full sm:w-auto">
              {d.hero.secondary}
            </a>
          </div>
          <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="rise mt-8 inline-flex items-center gap-2 text-[0.9375rem] text-muted transition-colors hover:text-gold-ink" style={{ animationDelay: "0.4s" }}>
            <InstagramIcon className="h-4 w-4" />
            <span>{proof}</span>
          </a>
        </div>
      </section>

      {/* ——— Cartes portrait par type d'événement (style Begnis) ——— */}
      <section id="types" aria-labelledby="types-title" className="py-20 md:py-28">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead id="types-title" eyebrow={d.types.eyebrow} title={d.types.title} center />
          <ul className="mt-14 grid grid-cols-2 gap-x-4 gap-y-12 md:gap-x-6 lg:grid-cols-4">
            {d.types.items.map((t, i) => {
              const c = TYPE_CARDS[t.id as EventType];
              return (
                <Reveal as="li" key={t.id} delay={i * 0.08} className="group">
                  <div id={c.anchor} className="scroll-mt-28">
                    <PrefillLink prefill={{ type: t.id as EventType }} className="block">
                      <Photo src={c.image} d={d} sizes="(min-width: 1024px) 23vw, 46vw" className="shine aspect-[3/4]" imgClass={c.pos} />
                      <h3 className="display mt-5 text-[1.6rem] md:text-[1.9rem]">{t.name}</h3>
                      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted">{t.text}</p>
                      <span className="nav-link mt-4 inline-flex min-h-11 items-center gap-2 text-gold-ink">
                        {d.types.cta}
                        <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
                      </span>
                    </PrefillLink>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Prestations ——— */}
      <section id="services" aria-labelledby="services-title" className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead id="services-title" eyebrow={d.services.eyebrow} title={d.services.title} text={d.services.text} />
          <ul className="mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
            {prestations.items.map((p, i) => {
              const t = d.services.items[i];
              return (
                <Reveal as="li" key={p.id} delay={i * 0.06} className="flex flex-col">
                  <Photo src={p.image} d={d} sizes="(min-width: 1024px) 23vw, (min-width: 640px) 46vw, 92vw" className="aspect-[4/5]" />
                  <span className="num mt-6 text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                  <h3 className="display mt-2 text-[1.75rem]">{t.name}</h3>
                  <p className="mt-3 flex-1 leading-relaxed text-muted">{t.text}</p>
                  {/* À REMPLIR : prix « à partir de » dans data/prestations.json (priceFrom) */}
                  <p className="mt-5 text-[0.9375rem] text-ink">{p.priceFrom ? fill(d.services.from, { price: shekels(p.priceFrom, lang) }) : d.services.onRequest}</p>
                  <PrefillLink prefill={{ need: p.id as Need }} className="nav-link mt-4 inline-flex min-h-11 items-center gap-2 text-gold-ink">
                    {d.services.cta}
                    <ArrowIcon className="h-3.5 w-3.5 rtl:-scale-x-100" />
                  </PrefillLink>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ——— Trois blocs alternés photo + texte court + un bouton ——— */}
      <section aria-label={d.blocks[0].eyebrow} className="py-24 md:py-32">
        <div className="mx-auto max-w-[1200px] space-y-24 px-5 md:space-y-32 md:px-10">
          {d.blocks.map((b, i) => (
            <article key={b.id} id={b.id} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-2 md:gap-20">
              <Reveal className={i % 2 ? "md:order-2" : ""}>
                <Photo src={BLOCK_IMAGES[b.id]} d={d} sizes="(min-width: 768px) 45vw, 92vw" className="aspect-[4/5]" />
              </Reveal>
              <Reveal delay={0.1}>
                <p className="eyebrow">{b.eyebrow}</p>
                <h2 className="display mt-5 text-[2.2rem] md:text-[3rem]">{b.title}</h2>
                <span className="rule mt-7" aria-hidden="true" />
                <p className="lead mt-7 max-w-md">{b.text}</p>
                <a href={BLOCK_LINKS[b.id]} className={`${i === 0 ? "btn-solid" : "btn-line"} mt-9`}>
                  {b.cta}
                </a>
              </Reveal>
            </article>
          ))}
        </div>
      </section>

      {/* ——— Événements réalisés : grille filtrable (style Social Pantry) ——— */}
      <section id="evenements" aria-labelledby="events-title" className="border-t border-line py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHead id="events-title" eyebrow={d.events.eyebrow} title={d.events.title} text={d.events.text} />
            <Reveal>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="link-line nav-link inline-flex items-center gap-2 whitespace-nowrap">
                <InstagramIcon className="h-4 w-4" />
                {d.events.more}
              </a>
            </Reveal>
          </div>
          <EventsGrid />
        </div>
      </section>

      {/* ——— À propos : portrait + histoire + un seul bouton (style Mindy Weiss) ——— */}
      <section id="about" aria-labelledby="about-title" className="bg-blush-soft py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] items-center gap-14 px-5 md:grid-cols-[0.85fr_1fr] md:gap-24 md:px-10">
          <Reveal>
            <figure>
              {/* À REMPLACER par un vrai portrait de Liraz (assets/a-recevoir/photos) */}
              <Photo src="/media/portrait/liraz-bar-sucre.jpg" d={d} sizes="(min-width: 768px) 40vw, 92vw" className="aspect-[4/5]" imgClass="object-[60%_50%]" />
              <figcaption className="mt-4 text-[0.875rem] text-muted">{d.about.caption}</figcaption>
            </figure>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow">{d.about.eyebrow}</p>
            <h2 id="about-title" className="display mt-5 text-[2.4rem] md:text-[3.3rem]">
              {d.about.title}
            </h2>
            {/* À COMPLÉTER : son histoire et son parcours */}
            <p className="lead mt-7">{d.about.p1}</p>
            <p className="lead mt-5">{d.about.p2}</p>
            <dl className="mt-10 grid max-w-md grid-cols-2 gap-6 border-t border-line pt-8">
              <div className="flex flex-col-reverse">
                <dt className="text-[0.875rem] text-muted">{d.stats.since}</dt>
                <dd className="num text-[2rem] text-ink">{stats.sinceYear}</dd>
              </div>
              {stats.events ? (
                <div className="flex flex-col-reverse">
                  <dt className="text-[0.875rem] text-muted">{d.stats.events}</dt>
                  <dd className="num text-[2rem] text-ink">{stats.events}</dd>
                </div>
              ) : (
                <div className="flex flex-col-reverse">
                  <dt className="text-[0.875rem] text-muted">{d.stats.followers}</dt>
                  <dd className="num text-[2rem] text-ink">{followers}</dd>
                </div>
              )}
            </dl>
            <a href="#contact" className="btn-solid mt-10">
              {d.about.cta}
            </a>
          </Reveal>
        </div>
      </section>

      {/* ——— Comment ça marche ——— */}
      <section id="process" aria-labelledby="process-title" className="scroll-mt-20 py-24 md:py-32">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10">
          <SectionHead id="process-title" eyebrow={d.process.eyebrow} title={d.process.title} center />
          <ol className="mt-16 grid gap-10 border-t border-line pt-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8">
            {d.process.steps.map((s, i) => (
              <Reveal as="li" key={s.title} delay={i * 0.06}>
                <span className="num text-[0.8125rem] text-gold-ink">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="display mt-3 text-[1.6rem]">{s.title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{s.text}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ——— Avis : uniquement de vrais avis (data/avis.json) ——— */}
      <section id="avis" aria-labelledby="reviews-title" className="bg-sand py-24 md:py-32">
        <div className="mx-auto max-w-3xl px-5 text-center md:px-10">
          <Reveal>
            <Ribbon className="mx-auto h-6 w-auto text-gold" />
            <p className="eyebrow mt-8">{d.reviews.eyebrow}</p>
            <h2 id="reviews-title" className="display mt-5 text-[2.4rem] md:text-[3.4rem]">
              {d.reviews.title}
            </h2>
          </Reveal>
          {/* À REMPLIR avec de vrais avis clients (data/avis.json) – n'en inventer aucun */}
          {avis.items.length === 0 ? (
            <Reveal delay={0.1}>
              <p className="lead mx-auto mt-8 max-w-xl">{d.reviews.emptyText}</p>
              <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="btn-line mt-9">
                <InstagramIcon className="h-4 w-4" />
                {d.reviews.emptyCta}
              </a>
            </Reveal>
          ) : (
            (avis.items as { id: string; name: string; nameLatin: string; source: string; url: string; date: string; text: Record<Locale, string> }[]).map((r) => (
              <Reveal key={r.id} delay={0.1}>
                <figure className="mt-12">
                  <blockquote className="text-[1.25rem] leading-[1.8] md:text-[1.4rem]">{r.text[lang]}</blockquote>
                  <figcaption className="mt-6 text-[0.9375rem] text-muted">
                    <span className="text-ink">{lang === "he" ? r.name : r.nameLatin}</span> ·{" "}
                    <a href={r.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-gold-ink">
                      {fill(d.reviews.source, { source: r.source, date: monthYear(r.date, lang) })}
                    </a>
                    {d.reviews.translated && <span className="block text-[0.8125rem]">{d.reviews.translated}</span>}
                  </figcaption>
                </figure>
              </Reveal>
            ))
          )}
        </div>
      </section>

      {/* ——— FAQ ——— */}
      <section id="faq" aria-labelledby="faq-title" className="py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-12 px-5 md:grid-cols-[1fr_1.6fr] md:gap-20 md:px-10">
          <SectionHead id="faq-title" eyebrow={d.faq.eyebrow} title={d.faq.title} />
          <Reveal>
            <div className="border-t border-line">
              {d.faq.items.map((f) => (
                <details key={f.q} className="group border-b border-line">
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.125rem] [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <PlusIcon className="h-4 w-4 shrink-0 text-gold-ink transition-transform duration-500 group-open:rotate-45" />
                  </summary>
                  <p className="pb-6 leading-relaxed text-muted">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ——— Demande de devis ——— */}
      <section id="contact" aria-labelledby="contact-title" className="bg-sand py-24 md:py-32">
        <div className="mx-auto grid max-w-[1200px] gap-14 px-5 md:grid-cols-[0.8fr_1.2fr] md:gap-20 md:px-10">
          <Reveal>
            <p className="eyebrow">{d.book.eyebrow}</p>
            <h2 id="contact-title" className="display mt-5 text-[2.4rem] md:text-[3.3rem]">
              {d.book.title}
            </h2>
            <p className="lead mt-6">{d.book.text}</p>
            <ul className="mt-10 space-y-4 text-[1rem]">
              <li>
                <a href={waLink(d.whatsapp.hello)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-gold-ink">
                  <WhatsAppIcon className="h-5 w-5 text-gold-ink" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={telHref} className="inline-flex min-h-11 items-center gap-3 hover:text-gold-ink">
                  <PhoneIcon className="h-5 w-5 text-gold-ink" />
                  <span dir="ltr">{site.phone}</span>
                </a>
              </li>
              <li>
                <a href={site.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-3 hover:text-gold-ink">
                  <InstagramIcon className="h-5 w-5 text-gold-ink" />
                  <span dir="ltr">{site.instagramHandle}</span>
                </a>
              </li>
            </ul>
            <p className="mt-8 border-t border-line pt-6 text-[0.9375rem] text-muted">{proof}</p>
          </Reveal>
          <Reveal delay={0.1} className="bg-ivory p-6 md:p-12">
            <QuoteForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
