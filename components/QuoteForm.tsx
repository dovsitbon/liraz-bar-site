"use client";

import { useEffect, useId, useState, type FormEvent, type ReactNode } from "react";
import { WhatsAppIcon } from "@/components/icons";
import { useLocale } from "@/components/providers";
import { EVENT_TYPES, isoDay, isPhone, NEEDS, PREFILL_EVENT, requestMessage, takenDates, waLink, type EventType, type Need, type Prefill } from "@/lib/quote";

type Errors = Partial<Record<"name" | "phone", string>>;

function Field({ label, hint, error, children, id }: { label: ReactNode; hint?: string; error?: string; children: ReactNode; id: string }) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      {children}
      {hint && <p className="mt-2 text-[0.875rem] leading-relaxed text-gold-ink">{hint}</p>}
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-2 text-[0.875rem] text-[#b3261e]">
          {error}
        </p>
      )}
    </div>
  );
}

function Legend({ n, children }: { n: string; children: ReactNode }) {
  return (
    <legend className="mb-8 flex items-baseline gap-4">
      <span className="num text-[0.8125rem] text-gold-ink">{n}</span>
      <span className="display text-[1.8rem]">{children}</span>
    </legend>
  );
}

/**
 * Demande de devis : type d'événement, date, lieu, ville, invités, besoins (plusieurs choix), budget, coordonnées.
 * Le récapitulatif part sur WhatsApp (972524378733) dans la langue du visiteur. Rien n'est stocké ;
 * l'acompte en ligne est prévu dans lib/payment.ts mais désactivé.
 */
export function QuoteForm() {
  const { lang, d } = useLocale();
  const f = d.book.fields;
  const uid = useId();
  const id = (k: string) => `${uid}-${k}`;

  const [type, setType] = useState<EventType | "">("");
  const [date, setDate] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [guests, setGuests] = useState("");
  const [needs, setNeeds] = useState<Need[]>([]);
  const [budget, setBudget] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState<string | null>(null);
  const [today, setToday] = useState("");

  // eslint-disable-next-line react-hooks/set-state-in-effect -- date du jour lue une fois au montage
  useEffect(() => setToday(isoDay(new Date())), []);

  useEffect(() => {
    const onPrefill = (e: Event) => {
      const p = (e as CustomEvent<Prefill>).detail;
      if (p.type) setType(p.type);
      if (p.need) setNeeds((n) => (n.includes(p.need!) ? n : [...n, p.need!]));
      setSent(null);
    };
    window.addEventListener(PREFILL_EVENT, onPrefill);
    return () => window.removeEventListener(PREFILL_EVENT, onPrefill);
  }, []);

  const validDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
  const dateHint = validDate ? (takenDates.has(date) ? f.dateTaken : takenDates.size > 0 ? f.dateFree : undefined) : undefined;
  const toggleNeed = (n: Need) => setNeeds((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]));

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    const e: Errors = {};
    if (!name.trim()) e.name = d.book.required;
    if (!phone.trim()) e.phone = d.book.required;
    else if (!isPhone(phone)) e.phone = d.book.invalidPhone;
    setErrors(e);
    const first = (["name", "phone"] as const).find((k) => e[k]);
    if (first) {
      document.getElementById(id(first))?.focus();
      return;
    }
    const text = requestMessage(
      {
        type,
        date: validDate ? date : "",
        venue: venue.trim(),
        city: city.trim(),
        guests: guests.trim(),
        needs: NEEDS.filter((n) => needs.includes(n)),
        budget: budget.trim(),
        name: name.trim(),
        phone: phone.trim(),
        message: message.trim(),
      },
      lang,
      d,
    );
    const url = waLink(text);
    window.open(url, "_blank", "noopener");
    setSent(url);
  };

  const err = (k: keyof Errors) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `${id(k)}-err` } : {});
  const optional = <span className="normal-case tracking-normal opacity-80">({f.optional})</span>;

  if (sent)
    return (
      <div className="fade-in py-6 text-center md:py-10" role="status">
        <p className="display text-[3rem] leading-none text-gold-ink">{d.book.success.thanks}</p>
        <h3 className="display mt-5 text-[1.8rem]">{d.book.success.title}</h3>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-muted">{d.book.success.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a href={sent} target="_blank" rel="noopener noreferrer" className="btn-solid">
            <WhatsAppIcon className="h-4 w-4" />
            {d.book.success.again}
          </a>
          <button type="button" onClick={() => setSent(null)} className="link-line nav-link">
            {d.book.success.reset}
          </button>
        </div>
      </div>
    );

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-14">
      <fieldset className="space-y-8">
        <Legend n="01">{d.book.steps.event}</Legend>
        <div>
          <p className="label" id={id("type")}>
            {f.type}
          </p>
          <div role="radiogroup" aria-labelledby={id("type")} className="mt-3 flex flex-wrap gap-2">
            {EVENT_TYPES.map((t) => (
              <label key={t} className="chip">
                <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} className="sr-only" />
                {f.types[t]}
              </label>
            ))}
          </div>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("date")} label={f.date} hint={dateHint}>
            <input id={id("date")} name="date" type="date" min={today || undefined} value={date} onChange={(e) => setDate(e.target.value)} className="field" />
          </Field>
          <Field id={id("guests")} label={f.guests}>
            <input id={id("guests")} name="guests" type="number" inputMode="numeric" min={1} max={3000} value={guests} onChange={(e) => setGuests(e.target.value)} className="field" />
          </Field>
        </div>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("venue")} label={f.venue}>
            <input id={id("venue")} name="venue" type="text" placeholder={f.venuePlaceholder} value={venue} onChange={(e) => setVenue(e.target.value)} className="field" maxLength={120} />
          </Field>
          <Field id={id("city")} label={f.city}>
            <input id={id("city")} name="city" type="text" autoComplete="address-level2" placeholder={f.cityPlaceholder} value={city} onChange={(e) => setCity(e.target.value)} className="field" maxLength={80} />
          </Field>
        </div>
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="02">{d.book.steps.needs}</Legend>
        <div>
          <p className="label" id={id("needs")}>
            {f.needs}
          </p>
          <div role="group" aria-labelledby={id("needs")} className="mt-3 flex flex-wrap gap-2">
            {NEEDS.map((n) => (
              <label key={n} className="chip">
                <input type="checkbox" name="needs" value={n} checked={needs.includes(n)} onChange={() => toggleNeed(n)} className="sr-only" />
                {f.needsList[n]}
              </label>
            ))}
          </div>
        </div>
        <Field id={id("budget")} label={<>{f.budget} {optional}</>}>
          <input id={id("budget")} name="budget" type="text" placeholder={f.budgetPlaceholder} value={budget} onChange={(e) => setBudget(e.target.value)} className="field" maxLength={60} />
        </Field>
      </fieldset>

      <fieldset className="space-y-8">
        <Legend n="03">{d.book.steps.contact}</Legend>
        <div className="grid gap-8 sm:grid-cols-2">
          <Field id={id("name")} label={`${f.name} *`} error={errors.name}>
            <input id={id("name")} name="name" type="text" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} className="field" maxLength={120} {...err("name")} />
          </Field>
          <Field id={id("phone")} label={`${f.phone} *`} error={errors.phone}>
            <input id={id("phone")} name="phone" type="tel" autoComplete="tel" inputMode="tel" required dir="ltr" value={phone} onChange={(e) => setPhone(e.target.value)} className="field rtl:text-end" maxLength={30} {...err("phone")} />
          </Field>
        </div>
        <Field id={id("message")} label={<>{f.message} {optional}</>}>
          <textarea id={id("message")} name="message" rows={3} placeholder={f.messagePlaceholder} value={message} onChange={(e) => setMessage(e.target.value)} className="field resize-y" maxLength={1500} />
        </Field>
      </fieldset>

      <div>
        <button type="submit" className="btn-solid w-full sm:w-auto">
          <WhatsAppIcon className="h-4 w-4" />
          {d.book.submit}
        </button>
        <p className="mt-4 text-[0.875rem] leading-relaxed text-muted">{d.book.hint}</p>
      </div>
    </form>
  );
}
