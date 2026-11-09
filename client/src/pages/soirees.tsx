/**
 * The public page for a series of in-person evenings (/rieuzal), and the page
 * the cancel link in every booking email opens (/rieuzal/annuler?t=...).
 *
 * In French or English, following the site's language toggle. The ateliers
 * themselves are run in French. Places and the waiting list are worked out on
 * the server (server/event-routes.ts); this page only shows them and posts the
 * form. A new series needs its two routes in App.tsx, because the server builds
 * links as /<series> and /<series>/annuler.
 */
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Layout";
import { SITE_TITLE, useLocale } from "@/lib/i18n";
import type { Locale } from "@/lib/preferences";
import { RETENTION_MONTHS } from "@shared/data-policy";
import { ArrowRight, BookOpen, Calculator, Camera, ClipboardCheck, FolderOpen, LayoutGrid, MessageSquare, Settings, Wrench, type LucideIcon } from "lucide-react";
import type { ModuleIcon as IconName } from "@shared/learn-programmes";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };
const BG = "#f6f1ea";
const INK = "#1a1a1a";
const AMBER = "#d97706";
const MUTED = "#6b645a";
const RULE = "#d8d0c5";
const CARD = "#fffdf9";

const P: React.CSSProperties = { margin: "0 0 14px", fontSize: 16, lineHeight: 1.65 };
const A: React.CSSProperties = { color: AMBER };
const FIELD: React.CSSProperties = { width: "100%", padding: "10px 12px", fontSize: 15, border: `1px solid ${RULE}`, borderRadius: 6, background: "#fff", color: INK, ...INTER };
const LABEL: React.CSSProperties = { ...CAPS, fontSize: 11, color: MUTED, display: "block", marginBottom: 6 };
const BUTTON: React.CSSProperties = { ...INTER, background: INK, color: "#fff", border: 0, borderRadius: 6, padding: "11px 20px", fontSize: 15, fontWeight: 600, cursor: "pointer" };

type PublicEvent = {
  slug: string; series: string; title: string; note: string | null; titleEn: string | null; noteEn: string | null; icon: IconName | null; startsAt: string; endsAt: string;
  venue: string; address: string; capacity: number; placesLeft: number; waitlist: number; status: string;
};

/** Every string on these two pages, in both languages. Dates come from Intl. */
const COPY = {
  eyebrow: { fr: "Ateliers IA · novembre à mars", en: "AI workshops · November to March" },
  title: { fr: "Apprenez une méthode claire pour toutes les IA", en: "Learn one clear method for every AI" },
  lead: {
    fr: "Des ateliers pratiques de 1h30 au Manoir de Rieuzal. Un peu de théorie, puis de vraies tâches devant vous, quel que soit votre parcours. On travaille avec Mistral, et la méthode marche aussi avec Claude et ChatGPT.",
    en: "Hands-on 90-minute workshops at the Manoir de Rieuzal. A little theory, then real tasks in front of you, whatever your background. We use Mistral, and the method works with Claude and ChatGPT too.",
  },
  /** The section for people coming for themselves (#pour-vous), linked from
   *  the home page's "For yourself" button. The same ateliers, not a product. */
  forYouTitle: { fr: "Venez aussi pour vous", en: "Come for yourself too" },
  forYouWho: {
    fr: "Pas besoin d'avoir une entreprise : indépendants, artisans, commerçants, propriétaires de gîtes ou simples curieux, tout le monde est bienvenu.",
    en: "You don't need a company: freelancers, tradespeople, shopkeepers, gîte owners or anyone curious, everyone's welcome.",
  },
  /** The running example (9 November 2026). Say "préparer", never "déclarer à votre place". */
  exampleTitle: { fr: "L'exemple : vos papiers", en: "The example: your paperwork" },
  exampleNote: {
    fr: "Un sujet sensible que tout le monde comprend. C'est toujours vous, ou votre comptable, qui déclarez.",
    en: "Something sensitive everyone understands. You, or your accountant, still file the return.",
  },
  everyTitle: { fr: "Dans chaque atelier", en: "In every workshop" },
  /** Above the calendar: every date is the same method, so pick any. */
  calendarTitle: { fr: "Choisissez une date", en: "Pick a date" },
  calendarNote: {
    fr: "Chaque atelier suit la même méthode : venez à un seul, ou revenez quand ça vous arrange.",
    en: "Every workshop follows the same method: come to one, or come back when it suits you.",
  },
  cardLine: { fr: "Atelier pratique de 1h30, avec Mistral", en: "Hands-on 90-minute workshop, with Mistral" },
  waitlistNote: {
    fr: "Complet ? Inscrivez-vous sur la liste d'attente : dès qu'une place se libère, elle est à vous.",
    en: "Full? Join the waiting list: as soon as a place comes free, it's yours.",
  },
  loading: { fr: "Chargement des dates...", en: "Loading the dates..." },
  loadFailed: { fr: "Les dates ne se chargent pas. Réessayez, ou écrivez à daniel@tutto.one.", en: "The dates won't load. Try again, or write to daniel@tutto.one." },
  none: { fr: "Pas d'atelier prévu pour l'instant. Écrivez à daniel@tutto.one pour être prévenu(e) des prochains.", en: "No workshops planned for now. Write to daniel@tutto.one to hear about the next ones." },
  venue: { fr: "Le lieu", en: "The venue" },
  map: { fr: "Voir sur la carte", en: "See it on the map" },
  privacyA: { fr: "Nous gardons votre nom, votre e-mail et votre entreprise pour gérer l'atelier, et nous les supprimons", en: "We keep your name, email and company to run the workshop, and delete them" },
  privacyB: { fr: "mois après. Détails sur", en: "months after. The details are in" },
  privacyLink: { fr: "notre politique de données", en: "our data policy" },
  privacyC: { fr: "(en anglais). Une question :", en: ". Any questions:" },
  pageTitle: { fr: "Ateliers IA à Rieuzal | Tutto", en: "AI workshops at Rieuzal | Tutto" },

  // Status and buttons
  cancelled: { fr: "Annulé", en: "Cancelled" },
  closed: { fr: "Réservations fermées", en: "Booking closed" },
  full: { fr: "Complet", en: "Full" },
  onWaitlist: { fr: "sur la liste d'attente", en: "on the waiting list" },
  waitlistOpen: { fr: "liste d'attente ouverte", en: "waiting list open" },
  book: { fr: "Réserver ma place", en: "Book my place" },
  joinWaitlist: { fr: "Rejoindre la liste d'attente", en: "Join the waiting list" },
  /** Beside the booking button: the principles behind every workshop, on the training page. */
  moreInfo: { fr: "Plus d'infos", en: "More info" },

  // Form
  name: { fr: "Nom", en: "Name" },
  email: { fr: "E-mail", en: "Email" },
  company: { fr: "Entreprise (facultatif)", en: "Company (optional)" },
  howMany: { fr: "Combien serez-vous ?", en: "How many of you?" },
  submit: { fr: "Réserver", en: "Book" },
  wait: { fr: "Un instant...", en: "One moment..." },
  free: { fr: "Gratuit. Vous recevez la confirmation par mail.", en: "Free. Your confirmation comes by email (in French)." },
  alreadyBooked: { fr: "Vous êtes déjà inscrit(e) à cet atelier. Le mail de confirmation contient le lien pour annuler si besoin.", en: "You're already booked for this workshop. The confirmation email has the link to cancel if you need to." },
  booked: { fr: "C'est réservé. Vous recevez un mail de confirmation avec le calendrier et le lien pour annuler.", en: "You're booked. A confirmation email is on its way with the calendar invite and the link to cancel." },

  // Cancel page
  yourBooking: { fr: "Votre réservation", en: "Your booking" },
  incomplete: { fr: "Ce lien est incomplet. Utilisez le lien du dernier mail reçu, ou écrivez à daniel@tutto.one.", en: "This link is incomplete. Use the link in the latest email you got, or write to daniel@tutto.one." },
  useLatest: { fr: "Utilisez le lien du dernier mail reçu, ou écrivez à daniel@tutto.one.", en: "Use the link in the latest email you got, or write to daniel@tutto.one." },
  loadingShort: { fr: "Chargement...", en: "Loading..." },
  leftWaitlist: { fr: "C'est fait, vous n'êtes plus sur la liste d'attente.", en: "Done, you're off the waiting list." },
  isCancelled: { fr: "Cette réservation est annulée.", en: "This booking is cancelled." },
  otherDates: { fr: "Voir les autres dates", en: "See the other dates" },
  allDates: { fr: "Voir toutes les dates", en: "See all the dates" },
  past: { fr: "Cet atelier a déjà eu lieu.", en: "This workshop has already taken place." },
  freeIt: { fr: " Si vous ne pouvez plus venir, libérez-la : la personne suivante sur la liste reçoit un mail aussitôt.", en: " If you can't come any more, free it up: the next person on the list gets an email straight away." },
  leaveWaitlist: { fr: "Quitter la liste d'attente", en: "Leave the waiting list" },
  cancelBooking: { fr: "Annuler ma réservation", en: "Cancel my booking" },
} satisfies Record<string, { fr: string; en: string }>;

type Key = keyof typeof COPY;

/** The page's strings, its dates and its counts in the active language. */
function useWords() {
  const locale = useLocale();
  const en = locale === "en";
  const tag = en ? "en-GB" : "fr-FR";
  return {
    locale,
    en,
    t: (k: Key) => COPY[k][locale],
    /** "jeudi 5 novembre" / "Thursday 5 November" */
    day: (d: string) => cap(new Intl.DateTimeFormat(tag, { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" }).format(new Date(d))),
    /** "18h30" / "6.30pm" */
    time: (d: string) => {
      const [h, m] = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(new Date(d)).split(":");
      if (!en) return `${Number(h)}h${m}`;
      const hour = Number(h);
      return `${hour % 12 || 12}${m === "00" ? "" : `.${m}`}${hour < 12 ? "am" : "pm"}`;
    },
    places: (n: number) => (n === 1 ? "1 place" : `${n} places`),
    people: (n: number) => (en ? (n === 1 ? "1 person" : `${n} people`) : n === 1 ? "1 personne" : `${n} personnes`),
    position: (n: number | null) => (en ? `You're already on the waiting list, at number ${n}.` : `Vous êtes déjà sur la liste d'attente, en position ${n}.`),
  };
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** The server answers in English when the page says so. */
const headers = (locale: Locale): Record<string, string> => ({ "X-Locale": locale });

async function getJson<T>(url: string, locale: Locale): Promise<T> {
  const res = await fetch(url, { headers: headers(locale) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (locale === "en" ? "Error" : "Erreur"));
  return data as T;
}

async function postJson<T>(url: string, body: unknown, locale: Locale): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json", ...headers(locale) }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || (locale === "en" ? "Something went wrong. Try again." : "Une erreur s'est produite. Réessayez."));
  return data as T;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: "100vh", background: BG, color: INK, ...INTER }}>
      <Header />
      <main style={{ maxWidth: 760, margin: "0 auto", padding: "112px 16px 96px" }}>{children}</main>
    </div>
  );
}

// ── Booking form ─────────────────────────────────────────────────────────────

type BookResult = { status: "confirmed" | "waitlist"; already: boolean; position: number | null };

function BookingForm({ e, maxSeats, onDone }: { e: PublicEvent; maxSeats: number; onDone: () => void }) {
  const w = useWords();
  const full = e.placesLeft === 0;
  const [f, setF] = useState({ name: "", email: "", company: "", seats: "1" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<BookResult | null>(null);
  const most = Math.min(maxSeats, full ? maxSeats : Math.max(1, e.placesLeft));

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await postJson<BookResult>(`/api/events/${e.slug}/book`, { ...f, seats: Number(f.seats) }, w.locale);
      setResult(r);
      onDone();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (result) {
    const text = result.already
      ? result.status === "confirmed"
        ? w.t("alreadyBooked")
        : w.position(result.position)
      : result.status === "confirmed"
        ? w.t("booked")
        : w.en
          ? `This workshop is full, so you're on the waiting list, at number ${result.position}. If a place comes free, it's yours and you get an email.`
          : `L'atelier est complet, alors vous êtes sur la liste d'attente, en position ${result.position}. Si une place se libère, elle est à vous et vous recevez un mail.`;
    return <p role="status" style={{ ...P, margin: "16px 0 0", padding: "12px 14px", background: "#fdf6ec", border: "1px solid #f0d9b0", borderRadius: 6 }}>{text}</p>;
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <label><span style={LABEL}>{w.t("name")}</span><input id={`name-${e.slug}`} required autoComplete="name" style={FIELD} value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} /></label>
        <label><span style={LABEL}>{w.t("email")}</span><input id={`email-${e.slug}`} required type="email" autoComplete="email" style={FIELD} value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} /></label>
        <label><span style={LABEL}>{w.t("company")}</span><input id={`company-${e.slug}`} autoComplete="organization" style={FIELD} value={f.company} onChange={(x) => setF({ ...f, company: x.target.value })} /></label>
        <label>
          <span style={LABEL}>{w.t("howMany")}</span>
          <select id={`seats-${e.slug}`} style={FIELD} value={f.seats} onChange={(x) => setF({ ...f, seats: x.target.value })}>
            {Array.from({ length: most }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{w.people(n)}</option>)}
          </select>
        </label>
      </div>
      {error && <p role="alert" style={{ ...P, margin: 0, color: "#b42318" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
        <button type="submit" disabled={busy} style={{ ...BUTTON, opacity: busy ? 0.6 : 1 }}>
          {busy ? w.t("wait") : full ? w.t("joinWaitlist") : w.t("submit")}
        </button>
        <span style={{ fontSize: 13, color: MUTED }}>{w.t("free")}</span>
      </div>
    </form>
  );
}

/** The practical details, as small chips under the icons. */
const FACTS: Record<Locale, string[]> = {
  fr: ["Gratuit", "15 places", "1h30", "Apportez votre ordinateur", "Venez seul ou à plusieurs"],
  en: ["Free", "15 places", "90 minutes", "Run in French", "Bring your laptop", "Come alone or with others"],
};

// ── What people do, as icons ─────────────────────────────────────────────────

type Step = { icon: LucideIcon; fr: string; en: string };

/** The running example, left to right. */
const EXAMPLE: Step[] = [
  { icon: Camera, fr: "Prendre vos tickets en photo", en: "Snap your receipts" },
  { icon: BookOpen, fr: "Tenir votre comptabilité à jour", en: "Keep your bookkeeping up to date" },
  { icon: Calculator, fr: "Préparer vos chiffres d'impôts", en: "Prepare your tax figures" },
  { icon: LayoutGrid, fr: "Construire votre propre système", en: "Build your own system" },
];

/** What every workshop covers, whatever the date. */
const EVERY: Step[] = [
  { icon: Settings, fr: "Installer l'IA", en: "Set up the AI" },
  { icon: MessageSquare, fr: "Lui donner des consignes", en: "Prompt it" },
  { icon: FolderOpen, fr: "Travailler sur vos fichiers", en: "Use your files" },
  { icon: ClipboardCheck, fr: "Vérifier son travail", en: "Check its work" },
  { icon: Wrench, fr: "Tous ses outils", en: "Use all its tools" },
];

function IconRow({ title, steps, arrows }: { title: string; steps: Step[]; arrows?: boolean }) {
  const w = useWords();
  return (
    <div>
      <span style={{ ...CAPS, fontSize: 11, color: MUTED }}>{title}</span>
      <ol className="rz-icons" style={{ listStyle: "none", padding: 0, margin: "10px 0 0", display: "grid", gap: 10, gridTemplateColumns: `repeat(auto-fit, minmax(${steps.length > 4 ? 110 : 130}px, 1fr))` }}>
        {steps.map(({ icon: Icon, ...s }, i) => (
          <li key={s.en} style={{ position: "relative", background: CARD, border: `1px solid ${RULE}`, borderRadius: 8, padding: "14px 10px 12px", textAlign: "center" }}>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 36, height: 36, borderRadius: 18, background: "#fdf6ec", color: AMBER }}>
              <Icon size={18} strokeWidth={1.8} aria-hidden="true" />
            </span>
            <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.35 }}>{s[w.locale]}</p>
            {arrows && i < steps.length - 1 && <ArrowRight className="rz-arrow" size={14} color={MUTED} aria-hidden="true" style={{ position: "absolute", right: -12, top: 25 }} />}
          </li>
        ))}
      </ol>
    </div>
  );
}

// ── The dates, as a calendar ─────────────────────────────────────────────────

function availability(w: ReturnType<typeof useWords>, e: PublicEvent) {
  if (e.status === "cancelled") return w.t("cancelled");
  if (e.status === "closed") return w.t("closed");
  if (e.placesLeft === 0) return w.t("full");
  return w.places(e.placesLeft);
}

/** One date, drawn like a page off a wall calendar. */
function DateTile({ e, selected, onSelect }: { e: PublicEvent; selected: boolean; onSelect: () => void }) {
  const w = useWords();
  const off = e.status === "cancelled" || e.status === "closed";
  const full = e.placesLeft === 0;
  const parts = (o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat(w.en ? "en-GB" : "fr-FR", { timeZone: "Europe/Paris", ...o }).format(new Date(e.startsAt));
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={off}
      aria-pressed={selected}
      aria-label={`${w.day(e.startsAt)} · ${w.time(e.startsAt)} · ${availability(w, e)}`}
      style={{ ...INTER, padding: 0, overflow: "hidden", textAlign: "center", cursor: off ? "default" : "pointer", background: CARD, color: INK, borderRadius: 8, border: `${selected ? 2 : 1}px solid ${selected ? AMBER : RULE}`, opacity: off ? 0.5 : 1 }}
    >
      <span style={{ ...CAPS, display: "block", fontSize: 11, fontWeight: 600, padding: "5px 0", background: selected ? AMBER : INK, color: "#fff" }}>{parts({ month: "short" }).replace(".", "")}</span>
      <span style={{ ...ROBOTO, display: "block", fontSize: 34, fontWeight: 700, lineHeight: 1, padding: "10px 0 4px", textDecoration: e.status === "cancelled" ? "line-through" : undefined }}>{parts({ day: "numeric" })}</span>
      <span style={{ display: "block", fontSize: 12, color: MUTED }}>{cap(parts({ weekday: "short" }).replace(".", ""))} · {w.time(e.startsAt)}</span>
      <span style={{ ...CAPS, display: "block", fontSize: 10, padding: "6px 0 9px", color: off || full ? MUTED : AMBER }}>{availability(w, e)}</span>
    </button>
  );
}

/** Under the calendar: the chosen date and the one booking form. */
function BookingPanel({ e, maxSeats, onBooked }: { e: PublicEvent; maxSeats: number; onBooked: () => void }) {
  const w = useWords();
  const full = e.placesLeft === 0;
  return (
    <div style={{ marginTop: 14, background: CARD, border: `1px solid ${RULE}`, borderRadius: 8, padding: "16px 18px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "baseline", gap: "4px 16px" }}>
        <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 700, margin: 0 }}>{w.day(e.startsAt)} · {w.time(e.startsAt)}</p>
        <a href="/praxis-programme" style={{ ...A, fontSize: 14 }}>{w.t("moreInfo")}</a>
      </div>
      <p style={{ margin: "4px 0 0", fontSize: 14, color: MUTED }}>
        {w.t("cardLine")}
        {full ? ` · ${e.waitlist ? `${e.waitlist} ${w.t("onWaitlist")}` : w.t("waitlistOpen")}` : ""}
      </p>
      {/* Keyed on the date so switching dates starts a fresh form. */}
      <BookingForm key={e.slug} e={e} maxSeats={maxSeats} onDone={onBooked} />
    </div>
  );
}

// ── The series page ──────────────────────────────────────────────────────────

export function EventSeries({ series }: { series: string }) {
  const w = useWords();
  const qc = useQueryClient();
  // The language isn't in the key: the list is the same data either way, and the
  // server render reads it under this key.
  const key = ["/api/events/series", series];
  const { data, isLoading, error } = useQuery<{ maxSeats: number; events: PublicEvent[] }>({
    queryKey: key, queryFn: () => getJson(`/api/events/series/${series}`, w.locale),
  });

  useEffect(() => {
    document.title = w.t("pageTitle");
    return () => { document.title = SITE_TITLE; };
  }, [w.locale]);

  // The home page links to /rieuzal#pour-vous. ScrollToTop leaves a link with
  // a hash alone, so the section is scrolled to here.
  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView();
  }, []);

  const list = data?.events ?? [];
  const venue = list[0];
  // The date the visitor picked, or else the first one still open.
  const [picked, setPicked] = useState<string | null>(null);
  const bookable = (e: PublicEvent) => e.status !== "cancelled" && e.status !== "closed";
  const chosen = list.find((e) => e.slug === picked && bookable(e)) ?? list.find(bookable);

  return (
    <Shell>
      <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>{w.t("eyebrow")}</span>
      <h1 style={{ ...ROBOTO, fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: "8px 0 16px", textWrap: "balance" } as React.CSSProperties}>
        {w.t("title")}
      </h1>
      <p style={{ ...P, fontSize: 18 }}>{w.t("lead")}</p>

      <p id="pour-vous" style={{ ...P, scrollMarginTop: 96, padding: "12px 14px", background: "#fdf6ec", border: "1px solid #f0d9b0", borderRadius: 6 }}>
        <strong>{w.t("forYouTitle")}.</strong> {w.t("forYouWho")}
      </p>

      {/* The arrows only make sense while the example sits on one line. */}
      <style>{`@media (max-width: 620px) { .rz-arrow { display: none; } }`}</style>
      <section style={{ margin: "28px 0 0", display: "grid", gap: 22 }}>
        <IconRow title={w.t("exampleTitle")} steps={EXAMPLE} arrows />
        <p style={{ margin: "-12px 0 0", fontSize: 13, color: MUTED }}>{w.t("exampleNote")}</p>
        <IconRow title={w.t("everyTitle")} steps={EVERY} />
      </section>

      <ul style={{ listStyle: "none", padding: 0, margin: "22px 0 0", display: "flex", flexWrap: "wrap", gap: 8 }}>
        {FACTS[w.locale].map((f) => (
          <li key={f} style={{ fontSize: 13, padding: "5px 11px", borderRadius: 999, border: `1px solid ${RULE}`, background: CARD }}>{f}</li>
        ))}
      </ul>

      <section style={{ margin: "36px 0 32px" }}>
        <h2 style={{ ...ROBOTO, fontSize: 26, fontWeight: 700, lineHeight: 1.2, margin: "0 0 6px" }}>{w.t("calendarTitle")}</h2>
        <p style={{ ...P, color: MUTED, fontSize: 15 }}>{w.t("calendarNote")}</p>
        {isLoading && <p style={{ ...P, color: MUTED }}>{w.t("loading")}</p>}
        {error && <p style={{ ...P, color: "#b42318" }}>{w.t("loadFailed")}</p>}
        {!isLoading && !error && list.length === 0 && <p style={{ ...P, color: MUTED }}>{w.t("none")}</p>}
        {list.length > 0 && (
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fill, minmax(96px, 1fr))" }}>
            {list.map((e) => (
              <DateTile key={e.slug} e={e} selected={e.slug === chosen?.slug} onSelect={() => setPicked(e.slug)} />
            ))}
          </div>
        )}
        {chosen && <BookingPanel e={chosen} maxSeats={data!.maxSeats} onBooked={() => qc.invalidateQueries({ queryKey: key })} />}
        {list.length > 0 && <p style={{ margin: "10px 0 0", fontSize: 13, color: MUTED }}>{w.t("waitlistNote")}</p>}
      </section>

      {venue && (
        <section style={{ borderTop: `1px solid ${RULE}`, paddingTop: 24 }}>
          <span style={{ ...CAPS, fontSize: 11, color: MUTED }}>{w.t("venue")}</span>
          <p style={{ ...P, margin: "6px 0 14px" }}>
            <strong>{venue.venue}</strong>, {venue.address}.{" "}
            <a style={A} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.venue}, ${venue.address}`)}`} target="_blank" rel="noopener noreferrer">{w.t("map")}</a>
          </p>
        </section>
      )}

      <p style={{ ...P, marginTop: 24, fontSize: 14, color: MUTED }}>
        {w.t("privacyA")} {RETENTION_MONTHS} {w.t("privacyB")} <a style={A} href="/data-policy">{w.t("privacyLink")}</a>{w.en ? "" : " "}{w.t("privacyC")} <a style={A} href="mailto:daniel@tutto.one">daniel@tutto.one</a>
      </p>
    </Shell>
  );
}

// ── The cancel link ──────────────────────────────────────────────────────────

type BookingView = { firstName: string; seats: number; status: string; position: number | null; event: PublicEvent };

export function EventCancel() {
  const w = useWords();
  const token = new URLSearchParams(window.location.search).get("t") ?? "";
  const { data, error, isLoading } = useQuery<BookingView>({
    queryKey: ["/api/events/booking", token, w.locale],
    queryFn: () => getJson(`/api/events/booking?t=${encodeURIComponent(token)}`, w.locale),
    enabled: !!token, retry: false,
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    document.title = `${w.t("yourBooking")} | Tutto`;
    return () => { document.title = SITE_TITLE; };
  }, [w.locale]);

  async function cancel() {
    setBusy(true);
    setFailed(null);
    try {
      await postJson("/api/events/cancel", { t: token }, w.locale);
      setDone(true);
    } catch (err) {
      setFailed((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const e = data?.event;
  const past = e ? new Date(e.startsAt) <= new Date() : false;
  const waiting = data?.status === "waitlist";

  const status = !data
    ? ""
    : w.en
      ? `Hello ${data.firstName}, ${waiting ? `you're on the waiting list, at number ${data.position}` : `your place is booked${data.seats > 1 ? ` (${w.places(data.seats)})` : ""}`}.`
      : `Bonjour ${data.firstName}, ${waiting ? `vous êtes sur la liste d'attente, en position ${data.position}` : `votre place est réservée${data.seats > 1 ? ` (${w.places(data.seats)})` : ""}`}.`;

  return (
    <Shell>
      <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>{w.t("yourBooking")}</span>
      {!token && <p style={{ ...P, marginTop: 12 }}>{w.t("incomplete")}</p>}
      {isLoading && <p style={{ ...P, marginTop: 12, color: MUTED }}>{w.t("loadingShort")}</p>}
      {error && <p style={{ ...P, marginTop: 12 }}>{(error as Error).message} {w.t("useLatest")}</p>}
      {data && e && (
        <>
          <h1 style={{ ...ROBOTO, fontSize: 32, fontWeight: 700, lineHeight: 1.15, margin: "8px 0 16px" }}>{w.day(e.startsAt)} · {w.time(e.startsAt)}</h1>
          <p style={P}>{w.t("cardLine")} · {e.venue}, {e.address}</p>
          {done || data.status === "cancelled" ? (
            <p style={P}>
              {done && waiting ? w.t("leftWaitlist") : w.t("isCancelled")}{" "}
              <a style={A} href={`/${e.series}`}>{w.t("otherDates")}</a>
            </p>
          ) : past ? (
            <p style={P}>{w.t("past")}</p>
          ) : (
            <>
              <p style={P}>
                {status}
                {waiting ? "" : w.t("freeIt")}
              </p>
              {failed && <p role="alert" style={{ ...P, color: "#b42318" }}>{failed}</p>}
              <button onClick={cancel} disabled={busy} style={{ ...BUTTON, opacity: busy ? 0.6 : 1 }}>
                {busy ? w.t("wait") : waiting ? w.t("leaveWaitlist") : w.t("cancelBooking")}
              </button>
              <p style={{ ...P, marginTop: 16 }}><a style={A} href={`/${e.series}`}>{w.t("allDates")}</a></p>
            </>
          )}
        </>
      )}
    </Shell>
  );
}
