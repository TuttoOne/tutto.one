/**
 * The two emails a student gets from /learn: the welcome when we enrol them,
 * and the sign-in link whenever they ask for one.
 *
 * Pure functions, like webinar-followup.ts: they take what they need and hand
 * back subject, HTML and text, so the admin can preview a welcome without
 * sending it. Tables and inline CSS for mail clients, in the site's palette.
 */
import { escapeHtml } from "./enquiry-message";

const BG = "#f6f1ea";
const INK = "#1a1a1a";
const AMBER = "#d97706";
const MUTED = "#6b645a";
const RULE = "#d8d0c5";
const FONT = "Inter, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";

export type WelcomeSession = { number: number | null; title: string; startsAt: Date; isSpare: boolean };

export type WelcomeEmailOptions = {
  firstName: string;
  programmeName: string;
  /** Team cohorts get the "which accounts" line and the organiser note; solo ones don't. */
  isTeam: boolean;
  timezone: string;
  sessionMinutes: number;
  meetUrl?: string | null;
  sessions: WelcomeSession[];
  signInUrl: string;
};

function when(d: Date, timezone: string): string {
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone, weekday: "short", day: "numeric", month: "long",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone, hour: "2-digit", minute: "2-digit",
  }).format(d);
  return `${day}, ${time}`;
}

/** "Milan time" from "Europe/Rome" reads oddly, so name the city people say. */
function zoneLabel(timezone: string): string {
  const city: Record<string, string> = {
    "Europe/Rome": "Milan",
    "Europe/Paris": "Paris",
    "Europe/London": "UK",
    "Africa/Johannesburg": "South African",
  };
  return `${city[timezone] ?? timezone} time`;
}

function shell(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:${BG};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BG};">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;font-family:${FONT};color:${INK};">
<tr><td style="padding:0 0 24px;font-size:20px;font-weight:700;letter-spacing:-0.01em;">Tutto<span style="color:${AMBER};">.</span></td></tr>
${body}
<tr><td style="padding:32px 0 0;border-top:1px solid ${RULE};font-size:12px;color:${MUTED};">Tutto · tutto.one</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const P = `margin:0 0 16px;font-size:15px;line-height:1.6;`;

function button(href: string, label: string): string {
  return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 24px;"><tr>
<td style="background:${AMBER};border-radius:6px;">
<a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 24px;font-size:14px;font-weight:700;color:#ffffff;text-decoration:none;">${escapeHtml(label)}</a>
</td></tr></table>`;
}

export function buildWelcomeEmail(o: WelcomeEmailOptions): { subject: string; html: string; text: string } {
  const subject = `Your ${o.programmeName}: the dates and your first step`;
  const zone = zoneLabel(o.timezone);

  const before = [
    "Fill in your profile, so we know a bit about you and your work before we meet. It takes about 5 minutes.",
    ...(o.isTeam
      ? ["Tell us which AI accounts you have (Claude or ChatGPT, paid or free). There's a space for it in the profile."]
      : []),
    "Think of one real task from your week that you'd like AI to help with. That's what we work on.",
  ];

  const rows = o.sessions
    .map((s) => {
      const label = s.isSpare ? "Spare date" : `${s.number}. ${s.title}`;
      return `<tr>
<td style="padding:8px 12px 8px 0;border-bottom:1px solid ${RULE};font-size:14px;white-space:nowrap;vertical-align:top;">${escapeHtml(when(s.startsAt, o.timezone))}</td>
<td style="padding:8px 0;border-bottom:1px solid ${RULE};font-size:14px;color:${s.isSpare ? MUTED : INK};">${escapeHtml(label)}</td>
</tr>`;
    })
    .join("");

  const body = `
<tr><td>
<p style="${P}">Hi ${escapeHtml(o.firstName)},</p>
<p style="${P}">Welcome to your ${escapeHtml(o.programmeName)}. We work on your own tasks from the first session, so everything you need is in one place: your dates, the reading for each session and a short practice task in between.</p>
<p style="${P}"><strong>Before we start:</strong></p>
<ol style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.6;">${before.map((b) => `<li style="margin:0 0 6px;">${escapeHtml(b)}</li>`).join("")}</ol>
${button(o.signInUrl, "Open your dashboard")}
<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">The button signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.</p>
</td></tr>
<tr><td style="padding:16px 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Your sessions (${escapeHtml(zone)}, ${o.sessionMinutes} minutes each)</td></tr>
<tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table></td></tr>
<tr><td style="padding:20px 0 0;">
${o.meetUrl ? `<p style="${P}">Every session is on the same call: <a href="${escapeHtml(o.meetUrl)}" style="color:${AMBER};">${escapeHtml(o.meetUrl)}</a></p>` : ""}
<p style="${P}">The tools we use keep your work in your browser, so save it to a file after each session. How we handle your data is at <a href="https://tutto.one/data-policy" style="color:${AMBER};">tutto.one/data-policy</a>.</p>
<p style="${P}">Any questions, just reply to this email.</p>
<p style="${P}">Daniel</p>
</td></tr>`;

  const text = [
    `Hi ${o.firstName},`,
    "",
    `Welcome to your ${o.programmeName}. We work on your own tasks from the first session, so everything you need is in one place: your dates, the reading for each session and a short practice task in between.`,
    "",
    "Before we start:",
    ...before.map((b, i) => `${i + 1}. ${b}`),
    "",
    `Open your dashboard: ${o.signInUrl}`,
    "(The link signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.)",
    "",
    `Your sessions (${zone}, ${o.sessionMinutes} minutes each):`,
    ...o.sessions.map((s) => `${when(s.startsAt, o.timezone)}  ${s.isSpare ? "Spare date" : `${s.number}. ${s.title}`}`),
    "",
    ...(o.meetUrl ? [`Every session is on the same call: ${o.meetUrl}`, ""] : []),
    "The tools we use keep your work in your browser, so save it to a file after each session. How we handle your data: https://tutto.one/data-policy",
    "",
    "Any questions, just reply to this email.",
    "",
    "Daniel",
  ].join("\n");

  return { subject, html: shell(subject, body), text };
}

export function buildSignInEmail(o: { firstName: string; signInUrl: string }): { subject: string; html: string; text: string } {
  const subject = "Your sign-in link for Tutto";
  const body = `
<tr><td>
<p style="${P}">Hi ${escapeHtml(o.firstName)},</p>
<p style="${P}">Here's your link to sign in to your dashboard.</p>
${button(o.signInUrl, "Sign in")}
<p style="margin:0 0 8px;font-size:13px;color:${MUTED};">It works once and lasts 30 minutes. If you didn't ask for it, you can ignore this email.</p>
</td></tr>`;
  const text = [
    `Hi ${o.firstName},`,
    "",
    "Here's your link to sign in to your dashboard:",
    o.signInUrl,
    "",
    "It works once and lasts 30 minutes. If you didn't ask for it, you can ignore this email.",
  ].join("\n");
  return { subject, html: shell(subject, body), text };
}
