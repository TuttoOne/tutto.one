/**
 * The emails someone gets after booking an evening (/rieuzal): a confirmed
 * place, a place on the waiting list, a place that came free, a cancellation
 * and the reminder the day before. All in French, because the evenings are.
 *
 * Pure functions, like learn-emails.ts: they take what they need and hand back
 * subject, HTML and text. A confirmed place also carries a calendar file.
 */
import { escapeHtml } from "./enquiry-message";

const BG = "#f6f1ea";
const INK = "#1a1a1a";
const AMBER = "#d97706";
const MUTED = "#6b645a";
const RULE = "#d8d0c5";
const FONT = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const P = `margin:0 0 16px;font-size:15px;line-height:1.6;`;
const TZ = "Europe/Paris";

export type EventInfo = {
  slug: string;
  title: string;
  note: string | null;
  startsAt: Date;
  endsAt: Date;
  venue: string;
  address: string;
};

export type BookingMail = {
  firstName: string;
  seats: number;
  event: EventInfo;
  /** The public page, e.g. https://tutto.one/rieuzal */
  pageUrl: string;
  /** The link that lets them cancel (or leave the waiting list). */
  cancelUrl: string;
};

export type Mail = { subject: string; html: string; text: string; attachments?: { filename: string; content: string }[] };

/** "jeudi 5 novembre à 18h30" */
export function frWhen(d: Date): string {
  const day = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" }).format(d);
  const [h, m] = new Intl.DateTimeFormat("fr-FR", { timeZone: TZ, hour: "2-digit", minute: "2-digit" }).format(d).split(":");
  return `${day} à ${Number(h)}h${m}`;
}

const places = (n: number) => (n === 1 ? "1 place" : `${n} places`);

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BG};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT};color:${INK};">
<tr><td style="padding:0 0 24px;font-size:20px;font-weight:700;letter-spacing:-0.01em;">Tutto<span style="color:${AMBER};">.</span></td></tr>
${body}
<tr><td style="padding:32px 0 0;border-top:1px solid ${RULE};font-size:12px;color:${MUTED};">Tutto · tutto.one · <a href="https://tutto.one/data-policy" style="color:${MUTED};">Vos données</a></td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

function details(e: EventInfo, seats: number): string {
  const row = (label: string, value: string) =>
    `<tr><td style="padding:6px 16px 6px 0;font-size:12px;letter-spacing:0.1em;text-transform:uppercase;color:${MUTED};vertical-align:top;white-space:nowrap;">${label}</td><td style="padding:6px 0;font-size:15px;">${escapeHtml(value)}</td></tr>`;
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px;border-top:1px solid ${RULE};border-bottom:1px solid ${RULE};width:100%;">
${row("Atelier", e.title)}
${row("Quand", `${frWhen(e.startsAt)}, 1h30`)}
${row("Où", `${e.venue}, ${e.address}`)}
${row("Pour", places(seats))}
</table>`;
}

function link(href: string, label: string): string {
  return `<a href="${escapeHtml(href)}" style="color:${AMBER};">${escapeHtml(label)}</a>`;
}

function textDetails(e: EventInfo, seats: number): string[] {
  return [`Atelier : ${e.title}`, `Quand : ${frWhen(e.startsAt)}, 1h30`, `Où : ${e.venue}, ${e.address}`, `Pour : ${places(seats)}`];
}

const sign = ["À bientôt,", "Daniel"];

// ── Calendar file ────────────────────────────────────────────────────────────

const icsDate = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
const icsText = (s: string) => s.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

export function buildIcs(e: EventInfo, pageUrl: string): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Tutto//Soirees//FR",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${e.slug}@tutto.one`,
    `DTSTAMP:${icsDate(new Date())}`,
    `DTSTART:${icsDate(e.startsAt)}`,
    `DTEND:${icsDate(e.endsAt)}`,
    `SUMMARY:${icsText(e.title)}`,
    `LOCATION:${icsText(`${e.venue}, ${e.address}`)}`,
    `DESCRIPTION:${icsText(`Atelier Tutto. Pour annuler ou voir les autres dates : ${pageUrl}`)}`,
    `URL:${pageUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
    "",
  ].join("\r\n");
}

function calendar(m: BookingMail) {
  return [{ filename: "soiree-tutto.ics", content: Buffer.from(buildIcs(m.event, m.pageUrl)).toString("base64") }];
}

// ── The five emails ──────────────────────────────────────────────────────────

export function buildConfirmedEmail(m: BookingMail): Mail {
  const subject = `C'est réservé : ${m.event.title}, ${frWhen(m.event.startsAt)}`;
  const intro = `${m.seats > 1 ? `Vos ${m.seats} places sont réservées` : "Votre place est réservée"}. Le calendrier en pièce jointe l'ajoute à votre agenda.`;
  const cancel = "Si vous ne pouvez plus venir, libérez votre place : quelqu'un attend peut-être sur la liste.";
  const html = `<tr><td>
<p style="${P}">Bonjour ${escapeHtml(m.firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
${details(m.event, m.seats)}
<p style="${P}">${escapeHtml(cancel)} ${link(m.cancelUrl, "Annuler ma réservation")}</p>
<p style="${P}">Une question ? Répondez simplement à ce mail.</p>
<p style="${P}">${sign.join("<br>")}</p>
</td></tr>`;
  const text = [`Bonjour ${m.firstName},`, "", intro, "", ...textDetails(m.event, m.seats), "", cancel, m.cancelUrl, "", "Une question ? Répondez simplement à ce mail.", "", ...sign].join("\n");
  return { subject, html: shell(subject, html), text, attachments: calendar(m) };
}

export function buildWaitlistEmail(m: BookingMail & { position: number }): Mail {
  const subject = `Liste d'attente : ${m.event.title}, ${frWhen(m.event.startsAt)}`;
  const intro = `L'atelier est complet, alors vous êtes sur la liste d'attente, en position ${m.position}. Dès qu'une place se libère, elle est à vous et je vous écris aussitôt.`;
  const other = "Une autre date vous irait peut-être :";
  const leave = "Si vous ne souhaitez plus attendre :";
  const html = `<tr><td>
<p style="${P}">Bonjour ${escapeHtml(m.firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
${details(m.event, m.seats)}
<p style="${P}">${escapeHtml(other)} ${link(m.pageUrl, "voir les dates")}</p>
<p style="${P}">${escapeHtml(leave)} ${link(m.cancelUrl, "quitter la liste d'attente")}</p>
<p style="${P}">${sign.join("<br>")}</p>
</td></tr>`;
  const text = [`Bonjour ${m.firstName},`, "", intro, "", ...textDetails(m.event, m.seats), "", other, m.pageUrl, "", leave, m.cancelUrl, "", ...sign].join("\n");
  return { subject, html: shell(subject, html), text };
}

export function buildPromotedEmail(m: BookingMail): Mail {
  const subject = `Une place s'est libérée : ${m.event.title}, ${frWhen(m.event.startsAt)}`;
  const intro = `Bonne nouvelle : ${m.seats > 1 ? `${m.seats} places se sont libérées et elles sont à vous` : "une place s'est libérée et elle est à vous"}. Vous n'avez rien à faire, votre réservation est confirmée.`;
  const cancel = "Si vous ne pouvez plus venir, libérez la place pour la personne suivante :";
  const html = `<tr><td>
<p style="${P}">Bonjour ${escapeHtml(m.firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
${details(m.event, m.seats)}
<p style="${P}">${escapeHtml(cancel)} ${link(m.cancelUrl, "annuler ma réservation")}</p>
<p style="${P}">${sign.join("<br>")}</p>
</td></tr>`;
  const text = [`Bonjour ${m.firstName},`, "", intro, "", ...textDetails(m.event, m.seats), "", cancel, m.cancelUrl, "", ...sign].join("\n");
  return { subject, html: shell(subject, html), text, attachments: calendar(m) };
}

export function buildCancelledEmail(m: BookingMail & { wasWaitlist: boolean }): Mail {
  const subject = m.wasWaitlist ? `Vous avez quitté la liste d'attente : ${m.event.title}` : `Réservation annulée : ${m.event.title}`;
  const intro = m.wasWaitlist
    ? `C'est fait, vous n'êtes plus sur la liste d'attente pour l'atelier du ${frWhen(m.event.startsAt)}.`
    : `C'est fait, votre réservation pour l'atelier du ${frWhen(m.event.startsAt)} est annulée. Merci d'avoir libéré la place.`;
  const other = "Les autres dates :";
  const html = `<tr><td>
<p style="${P}">Bonjour ${escapeHtml(m.firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
<p style="${P}">${escapeHtml(other)} ${link(m.pageUrl, "voir les autres dates")}</p>
<p style="${P}">${sign.join("<br>")}</p>
</td></tr>`;
  const text = [`Bonjour ${m.firstName},`, "", intro, "", other, m.pageUrl, "", ...sign].join("\n");
  return { subject, html: shell(subject, html), text };
}

export function buildReminderEmail(m: BookingMail): Mail {
  const subject = `C'est demain : ${m.event.title}, ${frWhen(m.event.startsAt)}`;
  const intro = `Petit rappel : on se retrouve demain${m.seats > 1 ? ` (${places(m.seats)} à votre nom)` : ""}.`;
  const cancel = "Un empêchement ? Libérez votre place pour la personne suivante sur la liste :";
  const html = `<tr><td>
<p style="${P}">Bonjour ${escapeHtml(m.firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
${details(m.event, m.seats)}
<p style="${P}">${escapeHtml(cancel)} ${link(m.cancelUrl, "annuler ma réservation")}</p>
<p style="${P}">À demain,<br>Daniel</p>
</td></tr>`;
  const text = [`Bonjour ${m.firstName},`, "", intro, "", ...textDetails(m.event, m.seats), "", cancel, m.cancelUrl, "", "À demain,", "Daniel"].join("\n");
  return { subject, html: shell(subject, html), text };
}
