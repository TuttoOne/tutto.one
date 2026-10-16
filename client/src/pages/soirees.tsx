/**
 * The public page for a series of in-person evenings (/rieuzal), and the page
 * the cancel link in every booking email opens (/rieuzal/annuler?t=...).
 *
 * French only: the evenings are. Places and the waiting list are worked out on
 * the server (server/event-routes.ts); this page only shows them and posts the
 * form. A new series needs its two routes in App.tsx, because the server builds
 * links as /<series> and /<series>/annuler.
 */
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Header } from "@/components/layout/Layout";
import { SITE_TITLE } from "@/lib/i18n";
import { RETENTION_MONTHS } from "@shared/data-policy";

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
  slug: string; series: string; title: string; note: string | null; startsAt: string; endsAt: string;
  venue: string; address: string; capacity: number; placesLeft: number; waitlist: number; status: string;
};

/** "jeudi 5 novembre", "18h30" */
function day(d: string) {
  return new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", weekday: "long", day: "numeric", month: "long" }).format(new Date(d));
}
function time(d: string) {
  const [h, m] = new Intl.DateTimeFormat("fr-FR", { timeZone: "Europe/Paris", hour: "2-digit", minute: "2-digit" }).format(new Date(d)).split(":");
  return `${Number(h)}h${m}`;
}
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const places = (n: number) => (n === 1 ? "1 place" : `${n} places`);

async function getJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Erreur");
  return data as T;
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Une erreur s'est produite. Réessayez.");
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
      const r = await postJson<BookResult>(`/api/events/${e.slug}/book`, { ...f, seats: Number(f.seats) });
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
        ? "Vous êtes déjà inscrit(e) à cette soirée. Le mail de confirmation contient le lien pour annuler si besoin."
        : `Vous êtes déjà sur la liste d'attente, en position ${result.position}.`
      : result.status === "confirmed"
        ? "C'est réservé. Vous recevez un mail de confirmation avec le calendrier et le lien pour annuler."
        : `La soirée est complète, alors vous êtes sur la liste d'attente, en position ${result.position}. Si une place se libère, elle est à vous et vous recevez un mail.`;
    return <p role="status" style={{ ...P, margin: "16px 0 0", padding: "12px 14px", background: "#fdf6ec", border: "1px solid #f0d9b0", borderRadius: 6 }}>{text}</p>;
  }

  return (
    <form onSubmit={submit} style={{ marginTop: 16, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
        <label><span style={LABEL}>Nom</span><input id={`name-${e.slug}`} required autoComplete="name" style={FIELD} value={f.name} onChange={(x) => setF({ ...f, name: x.target.value })} /></label>
        <label><span style={LABEL}>E-mail</span><input id={`email-${e.slug}`} required type="email" autoComplete="email" style={FIELD} value={f.email} onChange={(x) => setF({ ...f, email: x.target.value })} /></label>
        <label><span style={LABEL}>Entreprise (facultatif)</span><input id={`company-${e.slug}`} autoComplete="organization" style={FIELD} value={f.company} onChange={(x) => setF({ ...f, company: x.target.value })} /></label>
        <label>
          <span style={LABEL}>Combien serez-vous ?</span>
          <select id={`seats-${e.slug}`} style={FIELD} value={f.seats} onChange={(x) => setF({ ...f, seats: x.target.value })}>
            {Array.from({ length: most }, (_, i) => i + 1).map((n) => <option key={n} value={n}>{n === 1 ? "1 personne" : `${n} personnes`}</option>)}
          </select>
        </label>
      </div>
      {error && <p role="alert" style={{ ...P, margin: 0, color: "#b42318" }}>{error}</p>}
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16 }}>
        <button type="submit" disabled={busy} style={{ ...BUTTON, opacity: busy ? 0.6 : 1 }}>
          {busy ? "Un instant..." : full ? "Rejoindre la liste d'attente" : "Réserver"}
        </button>
        <span style={{ fontSize: 13, color: MUTED }}>Gratuit. Vous recevez la confirmation par mail.</span>
      </div>
    </form>
  );
}

// ── One evening in the list ──────────────────────────────────────────────────

function EventCard({ e, maxSeats, first, onBooked }: { e: PublicEvent; maxSeats: number; first: boolean; onBooked: () => void }) {
  const [open, setOpen] = useState(false);
  const cancelled = e.status === "cancelled";
  const closed = e.status === "closed";
  const full = e.placesLeft === 0;
  const availability = cancelled ? "Annulée" : closed ? "Réservations fermées" : full ? `Complet · ${e.waitlist ? `${e.waitlist} sur la liste d'attente` : "liste d'attente ouverte"}` : `Il reste ${places(e.placesLeft)}`;

  return (
    <article style={{ background: CARD, border: `1px solid ${first ? AMBER : RULE}`, borderRadius: 8, padding: "18px 20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", gap: "8px 16px", alignItems: "baseline" }}>
        <div style={{ minWidth: 0 }}>
          <p style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, margin: 0, textDecoration: cancelled ? "line-through" : undefined }}>{cap(day(e.startsAt))} · {time(e.startsAt)}</p>
          <p style={{ margin: "4px 0 0", fontSize: 15 }}>{e.title}{e.note ? <span style={{ color: MUTED }}> · {e.note}</span> : null}</p>
        </div>
        <span style={{ ...CAPS, fontSize: 11, color: cancelled ? "#b42318" : full || closed ? MUTED : AMBER, whiteSpace: "nowrap" }}>{availability}</span>
      </div>
      {!cancelled && !closed && !open && (
        <button onClick={() => setOpen(true)} style={{ ...BUTTON, marginTop: 14, background: full ? "transparent" : INK, color: full ? INK : "#fff", border: full ? `1px solid ${INK}` : 0 }}>
          {full ? "Rejoindre la liste d'attente" : "Réserver ma place"}
        </button>
      )}
      {open && <BookingForm e={e} maxSeats={maxSeats} onDone={onBooked} />}
    </article>
  );
}

// ── The series page ──────────────────────────────────────────────────────────

export function EventSeries({ series }: { series: string }) {
  const qc = useQueryClient();
  const key = ["/api/events/series", series];
  const { data, isLoading, error } = useQuery<{ maxSeats: number; events: PublicEvent[] }>({
    queryKey: key, queryFn: () => getJson(`/api/events/series/${series}`),
  });

  useEffect(() => {
    document.title = "Soirées IA à Rieuzal | Tutto";
    return () => { document.title = SITE_TITLE; };
  }, []);

  const list = data?.events ?? [];
  const venue = list[0];

  return (
    <Shell>
      <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>Soirées Praxis · tous les 15 jours</span>
      <h1 style={{ ...ROBOTO, fontSize: 40, fontWeight: 700, lineHeight: 1.1, margin: "8px 0 16px", textWrap: "balance" } as React.CSSProperties}>
        Soirées IA à Rieuzal, avec Mistral
      </h1>
      <p style={{ ...P, fontSize: 18 }}>
        1h30 pour voir l'IA faire du vrai travail, en direct, avec Mistral Large 4, le nouveau modèle français. On vous montre comment on la met en place dans une entreprise, comment on forme vos équipes avec Praxis, comment on fait tourner vos systèmes ensemble et ce que chaque poste y gagne, de la compta à l'atelier.
      </p>
      <p style={{ ...P, color: MUTED }}>
        15 places par soirée, gratuit, sur réservation. Chaque soirée reprend la démo et accueille un invité différent. Si une soirée est complète, inscrivez-vous sur la liste d'attente : dès qu'une place se libère, elle est à vous.
      </p>

      <section style={{ margin: "32px 0", display: "grid", gap: 12 }}>
        {isLoading && <p style={{ ...P, color: MUTED }}>Chargement des dates...</p>}
        {error && <p style={{ ...P, color: "#b42318" }}>Les dates ne se chargent pas. Réessayez, ou écrivez à daniel@tutto.one.</p>}
        {!isLoading && !error && list.length === 0 && <p style={{ ...P, color: MUTED }}>Pas de soirée prévue pour l'instant. Écrivez à daniel@tutto.one pour être prévenu(e) des prochaines.</p>}
        {list.map((e, i) => (
          <EventCard key={e.slug} e={e} maxSeats={data!.maxSeats} first={i === 0} onBooked={() => qc.invalidateQueries({ queryKey: key })} />
        ))}
      </section>

      {venue && (
        <section style={{ borderTop: `1px solid ${RULE}`, paddingTop: 24 }}>
          <span style={{ ...CAPS, fontSize: 11, color: MUTED }}>Le lieu</span>
          <p style={{ ...P, margin: "6px 0 14px" }}>
            <strong>{venue.venue}</strong>, {venue.address}.{" "}
            <a style={A} href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${venue.venue}, ${venue.address}`)}`} target="_blank" rel="noopener noreferrer">Voir sur la carte</a>
          </p>
        </section>
      )}

      <p style={{ ...P, marginTop: 24, fontSize: 14, color: MUTED }}>
        Nous gardons votre nom, votre e-mail et votre entreprise pour gérer la soirée, et nous les supprimons {RETENTION_MONTHS} mois après. Détails sur <a style={A} href="/data-policy">notre politique de données</a> (en anglais). Une question : <a style={A} href="mailto:daniel@tutto.one">daniel@tutto.one</a>
      </p>
    </Shell>
  );
}

// ── The cancel link ──────────────────────────────────────────────────────────

type BookingView = { firstName: string; seats: number; status: string; position: number | null; event: PublicEvent };

export function EventCancel() {
  const token = new URLSearchParams(window.location.search).get("t") ?? "";
  const { data, error, isLoading } = useQuery<BookingView>({
    queryKey: ["/api/events/booking", token], queryFn: () => getJson(`/api/events/booking?t=${encodeURIComponent(token)}`), enabled: !!token, retry: false,
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [failed, setFailed] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Votre réservation | Tutto";
    return () => { document.title = SITE_TITLE; };
  }, []);

  async function cancel() {
    setBusy(true);
    setFailed(null);
    try {
      await postJson("/api/events/cancel", { t: token });
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

  return (
    <Shell>
      <span style={{ ...CAPS, fontSize: 11, color: AMBER }}>Votre réservation</span>
      {!token && <p style={{ ...P, marginTop: 12 }}>Ce lien est incomplet. Utilisez le lien du dernier mail reçu, ou écrivez à daniel@tutto.one.</p>}
      {isLoading && <p style={{ ...P, marginTop: 12, color: MUTED }}>Chargement...</p>}
      {error && <p style={{ ...P, marginTop: 12 }}>{(error as Error).message} Utilisez le lien du dernier mail reçu, ou écrivez à daniel@tutto.one.</p>}
      {data && e && (
        <>
          <h1 style={{ ...ROBOTO, fontSize: 32, fontWeight: 700, lineHeight: 1.15, margin: "8px 0 16px" }}>{cap(day(e.startsAt))} · {time(e.startsAt)}</h1>
          <p style={P}>{e.title} · {e.venue}, {e.address}</p>
          {done || data.status === "cancelled" ? (
            <p style={P}>
              {done && waiting ? "C'est fait, vous n'êtes plus sur la liste d'attente." : "Cette réservation est annulée."}{" "}
              <a style={A} href={`/${e.series}`}>Voir les autres dates</a>
            </p>
          ) : past ? (
            <p style={P}>Cette soirée a déjà eu lieu.</p>
          ) : (
            <>
              <p style={P}>
                Bonjour {data.firstName}, {waiting ? `vous êtes sur la liste d'attente, en position ${data.position}` : `votre place est réservée${data.seats > 1 ? ` (${places(data.seats)})` : ""}`}.
                {waiting ? "" : " Si vous ne pouvez plus venir, libérez-la : la personne suivante sur la liste reçoit un mail aussitôt."}
              </p>
              {failed && <p role="alert" style={{ ...P, color: "#b42318" }}>{failed}</p>}
              <button onClick={cancel} disabled={busy} style={{ ...BUTTON, opacity: busy ? 0.6 : 1 }}>
                {busy ? "Un instant..." : waiting ? "Quitter la liste d'attente" : "Annuler ma réservation"}
              </button>
              <p style={{ ...P, marginTop: 16 }}><a style={A} href={`/${e.series}`}>Voir toutes les dates</a></p>
            </>
          )}
        </>
      )}
    </Shell>
  );
}
