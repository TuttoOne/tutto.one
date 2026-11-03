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
import type { ModuleIcon as IconName } from "@shared/learn-programmes";
import { ModuleIcon } from "@/components/learn/ModuleIcon";

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
  eyebrow: { fr: "Ateliers IA · novembre à mars", en: "AI ateliers · November to March" },
  title: { fr: "Apprenez une méthode claire pour toutes les IA", en: "Learn one clear method for every AI" },
  lead: {
    fr: "Six ateliers pratiques de 1h30 au Manoir de Rieuzal, avec Mistral. On fait faire de vraies tâches à Mistral devant vous, et on en parle ensemble. Ce qu'on vous apprend marche aussi avec Claude et ChatGPT, alors vous passez de l'une à l'autre quand vous voulez, sur l'infrastructure de votre choix et dans la région de votre choix.",
    en: "Six hands-on 90-minute ateliers at the Manoir de Rieuzal, with Mistral. We put Mistral to work on real tasks in front of you, then talk it through together. What you learn works with Claude and ChatGPT too, so you can switch between them whenever you like, on the infrastructure and in the region you choose.",
  },
  themes: {
    fr: "Chaque atelier a son thème. Venez à un atelier ou à tous : ils sont tous différents.",
    en: "Each atelier has its own theme. Come to one or come to all of them: no two are the same.",
  },
  places: {
    fr: "15 places par atelier, gratuit, sur réservation. Si un atelier est complet, inscrivez-vous sur la liste d'attente : dès qu'une place se libère, elle est à vous.",
    en: "15 places per atelier, free, booking required. If one is full, join the waiting list: as soon as a place comes free, it's yours.",
  },
  /** Only shown in English. */
  french: {
    fr: "",
    en: "The ateliers themselves are run in French.",
  },
  loading: { fr: "Chargement des dates...", en: "Loading the dates..." },
  loadFailed: { fr: "Les dates ne se chargent pas. Réessayez, ou écrivez à daniel@tutto.one.", en: "The dates won't load. Try again, or write to daniel@tutto.one." },
  none: { fr: "Pas d'atelier prévu pour l'instant. Écrivez à daniel@tutto.one pour être prévenu(e) des prochains.", en: "No ateliers planned for now. Write to daniel@tutto.one to hear about the next ones." },
  venue: { fr: "Le lieu", en: "The venue" },
  map: { fr: "Voir sur la carte", en: "See it on the map" },
  privacyA: { fr: "Nous gardons votre nom, votre e-mail et votre entreprise pour gérer l'atelier, et nous les supprimons", en: "We keep your name, email and company to run the atelier, and delete them" },
  privacyB: { fr: "mois après. Détails sur", en: "months after. The details are in" },
  privacyLink: { fr: "notre politique de données", en: "our data policy" },
  privacyC: { fr: "(en anglais). Une question :", en: ". Any questions:" },
  pageTitle: { fr: "Ateliers IA à Rieuzal | Tutto", en: "AI ateliers at Rieuzal | Tutto" },

  // Status and buttons
  cancelled: { fr: "Annulé", en: "Cancelled" },
  closed: { fr: "Réservations fermées", en: "Booking closed" },
  full: { fr: "Complet", en: "Full" },
  onWaitlist: { fr: "sur la liste d'attente", en: "on the waiting list" },
  waitlistOpen: { fr: "liste d'attente ouverte", en: "waiting list open" },
  book: { fr: "Réserver ma place", en: "Book my place" },
  joinWaitlist: { fr: "Rejoindre la liste d'attente", en: "Join the waiting list" },

  // Form
  name: { fr: "Nom", en: "Name" },
  email: { fr: "E-mail", en: "Email" },
  company: { fr: "Entreprise (facultatif)", en: "Company (optional)" },
  howMany: { fr: "Combien serez-vous ?", en: "How many of you?" },
  submit: { fr: "Réserver", en: "Book" },
  wait: { fr: "Un instant...", en: "One moment..." },
  free: { fr: "Gratuit. Vous recevez la confirmation par mail.", en: "Free. Your confirmation comes by email (in French)." },
  alreadyBooked: { fr: "Vous êtes déjà inscrit(e) à cet atelier. Le mail de confirmation contient le lien pour annuler si besoin.", en: "You're already booked for this atelier. The confirmation email has the link to cancel if you need to." },
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
  past: { fr: "Cet atelier a déjà eu lieu.", en: "This atelier has already taken place." },
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
    title: (e: PublicEvent) => (en && e.titleEn ? e.titleEn : e.title),
    note: (e: PublicEvent) => (en && e.titleEn ? e.noteEn : e.note),
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
          ? `This atelier is full, so you're on the waiting list, at number ${result.position}. If a place comes free, it's yours and you get an email.`
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

// ── One evening in the list ──────────────────────────────────────────────────

/** Drawings for the groundwork sit on amber, the ones about building and running things on slate, as on /learn. */
const GROUNDWORK = new Set<IconName>(["terminal", "rules", "scorecard", "signpost", "question"]);

function EventCard({ e, maxSeats, first, onBooked }: { e: PublicEvent; maxSeats: number; first: boolean; onBooked: () => void }) {
  const w = useWords();
  const [open, setOpen] = useState(false);
  const cancelled = e.status === "cancelled";
  const closed = e.status === "closed";
  const full = e.placesLeft === 0;
  const availability = cancelled
    ? w.t("cancelled")
    : closed
      ? w.t("closed")
      : full
        ? `${w.t("full")} · ${e.waitlist ? `${e.waitlist} ${w.t("onWaitlist")}` : w.t("waitlistOpen")}`
        : w.en ? `${w.places(e.placesLeft)} left` : `Il reste ${w.places(e.placesLeft)}`;
  const note = w.note(e);

  return (
    <article style={{ background: CARD, border: `1px solid ${first ? AMBER : RULE}`, borderRadius: 8, padding: "18px 20px" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      {e.icon && <ModuleIcon name={e.icon} size={56} tone={GROUNDWORK.has(e.icon) ? "foundations" : "building"} />}
      <div style={{ flex: 1, minWidth: 0, display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 16px", alignItems: "baseline" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, margin: 0, textDecoration: cancelled ? "line-through" : undefined }}>{w.day(e.startsAt)} · {w.time(e.startsAt)}</p>
          <p style={{ margin: "4px 0 0", fontSize: 15 }}>{w.title(e)}{note ? <span style={{ color: MUTED }}> · {note}</span> : null}</p>
        </div>
        <span style={{ ...CAPS, fontSize: 11, color: cancelled ? "#b42318" : full || closed ? MUTED : AMBER, whiteSpace: "nowrap" }}>{availability}</span>
      </div>
      </div>
      {!cancelled && !closed && !open && (
        <button onClick={() => setOpen(true)} style={{ ...BUTTON, marginTop: 14, background: full ? "transparent" : INK, color: full ? INK : "#fff", border: full ? `1px solid ${INK}` : 0 }}>
          {full ? w.t("joinWaitlist") : w.t("book")}
        </button>
      )}
      {open && <BookingForm e={e} maxSeats={maxSeats} onDone={onBooked} />}
    </article>
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

  const list = data?.events ?? [];
  const venue = list[0];

  return (
    <Shell>
      <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>{w.t("eyebrow")}</span>
      <h1 style={{ ...ROBOTO, fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: "8px 0 16px", textWrap: "balance" } as React.CSSProperties}>
        {w.t("title")}
      </h1>
      <p style={{ ...P, fontSize: 18 }}>{w.t("lead")}</p>
      <p style={{ ...P, color: MUTED }}>{w.t("themes")}</p>
      <p style={{ ...P, color: MUTED }}>{w.t("places")}</p>
      {w.en && <p style={{ ...P, color: MUTED }}>{w.t("french")}</p>}

      <section style={{ margin: "32px 0", display: "grid", gap: 12 }}>
        {isLoading && <p style={{ ...P, color: MUTED }}>{w.t("loading")}</p>}
        {error && <p style={{ ...P, color: "#b42318" }}>{w.t("loadFailed")}</p>}
        {!isLoading && !error && list.length === 0 && <p style={{ ...P, color: MUTED }}>{w.t("none")}</p>}
        {list.map((e, i) => (
          <EventCard key={e.slug} e={e} maxSeats={data!.maxSeats} first={i === 0} onBooked={() => qc.invalidateQueries({ queryKey: key })} />
        ))}
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
          <p style={P}>{w.title(e)} · {e.venue}, {e.address}</p>
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
