/**
 * The confirmation we send someone after deleting their data at their request.
 * It is their evidence: the reference, the date, what kinds of record went and
 * when the backups catch up. It never repeats the data itself.
 */
import { escapeHtml } from "./enquiry-message";

const LABELS: Record<string, string> = {
  students: "Your learner account and profile",
  progress: "Your session progress",
  loginTokens: "Sign-in links",
  sharedRecords: "Work you shared from our tools",
  enquiries: "Enquiries you sent us",
  leads: "Mailing list sign-ups",
};

export function buildDeletionEmail(o: {
  reference: string;
  deletedAt: Date;
  counts: Record<string, number>;
  backupDays: number;
}): { subject: string; html: string; text: string } {
  const subject = `We've deleted your data (reference ${o.reference})`;
  const date = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Europe/Paris" }).format(o.deletedAt);
  const lines = Object.entries(o.counts)
    .filter(([, n]) => n > 0)
    .map(([k, n]) => `${LABELS[k] ?? k}: ${n}`);
  const what = lines.length ? lines : ["We found no records under this email address."];

  const text = [
    "Hello,",
    "",
    `As you asked, on ${date} we deleted everything we held about you under this email address.`,
    "",
    ...what.map((l) => `- ${l}`),
    "",
    `Copies can stay in our database host's backups for up to ${o.backupDays} days, and then they're gone too. We keep a note that this deletion happened, with the reference ${o.reference} and the counts above, but not your details.`,
    "",
    "Work you saved yourself, in a file or in your browser, is yours and we can't reach it. To clear a tool in your browser, open it and choose \"Clear from this browser\".",
    "",
    "Any questions, just reply.",
    "",
    "Daniel",
    "Tutto · tutto.one",
  ].join("\n");

  const html = `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:24px;background:#f6f1ea;font-family:Inter,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
<div style="max-width:560px;margin:0 auto;font-size:15px;line-height:1.6;">
${text.split("\n\n").map((p) => `<p style="margin:0 0 16px;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`).join("")}
</div></body></html>`;

  return { subject, html, text };
}
