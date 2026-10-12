/**
 * Emails Daniel whenever a student hands us something: a saved /learn profile
 * or a "Share with Tutto" copy from one of the tools. Sending never blocks or
 * fails the student's request; a failed send is only logged.
 */
import { getResend } from "./resend";
import { escapeHtml } from "./enquiry-message";

const FROM = "Tutto <notifications@tutto.one>";
const TO = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";

const LABEL = "color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 4px;";
const VALUE = "color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;";

type Field = [label: string, value: string | null | undefined];

function page(kicker: string, title: string, fields: Field[], adminUrl: string): string {
  const blocks = fields.map(([label, value]) => {
    const given = !!value && value.trim() !== "";
    const shown = given ? escapeHtml(value!.trim()).replace(/\r?\n/g, "<br>") : "Not given";
    return `<p style="${LABEL}">${escapeHtml(label)}</p><p style="${VALUE}${given ? "" : " color: #a8a092;"}">${shown}</p>`;
  });
  return `
    <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
      <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
        <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">${escapeHtml(kicker)}</p>
        <p style="color: #f6f1ea; font-size: 20px; font-weight: 700; margin: 0;">${escapeHtml(title)}</p>
      </div>
      <div style="background: #fff; border-radius: 10px; padding: 28px;">
        ${blocks.join("")}
        <p style="margin: 8px 0 0;"><a href="${escapeHtml(adminUrl)}" style="color: #d97706;">Open in admin</a></p>
      </div>
    </div>`;
}

async function send(subject: string, html: string, attachments?: { filename: string; content: string }[]) {
  const resend = getResend();
  if (!resend) {
    console.warn(`[notify] RESEND_API_KEY not set, not sending "${subject}"`);
    return;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to: TO, subject, html, attachments });
    if (error) console.error(`[notify] failed to send "${subject}":`, error.message);
  } catch (err) {
    console.error(`[notify] failed to send "${subject}":`, err);
  }
}

export function notifyProfileSaved(opts: {
  siteUrl: string;
  cohortName: string | null;
  firstTime: boolean;
  email: string;
  profile: {
    name: string; jobTitle: string; linkedinUrl: string; background: string; currentAccounts: string;
    taskToBring: string; setupNotes: string; altContactName: string; altContactEmail: string; altContactPhone: string;
  };
}): void {
  const p = opts.profile;
  const what = opts.firstTime ? "filled in their profile" : "updated their profile";
  void send(
    `${p.name} ${what}`,
    page(opts.cohortName ? `Student profile · ${opts.cohortName}` : "Student profile", `${p.name} ${what}`, [
      ["Email", opts.email],
      ["Job title", p.jobTitle],
      ["LinkedIn", p.linkedinUrl],
      ["Background", p.background],
      ["Accounts they use now", p.currentAccounts],
      ["Task to bring", p.taskToBring],
      ["Setup notes", p.setupNotes],
      ["Other contact", [p.altContactName, p.altContactEmail, p.altContactPhone].filter(Boolean).join(" · ")],
    ], `${opts.siteUrl}/admin`),
  );
}

export function notifyShared(opts: {
  siteUrl: string;
  toolLabel: string;
  title: string;
  name: string;
  email: string;
  organisation: string | null;
  note: string | null;
  linkedToStudent: boolean;
  data: unknown;
}): void {
  const slug = opts.toolLabel.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  void send(
    `${opts.name} shared a ${opts.toolLabel.toLowerCase()}`,
    page(`Shared with Tutto · ${opts.toolLabel}`, opts.title || opts.toolLabel, [
      ["From", `${opts.name} <${opts.email}>`],
      ["Organisation", opts.organisation],
      ["Signed in to /learn", opts.linkedToStudent ? "Yes, it's under their student record" : "No"],
      ["Note", opts.note],
      ["Their work", "Attached as JSON. Admin shows it in full."],
    ], `${opts.siteUrl}/admin`),
    [{ filename: `${slug}.json`, content: Buffer.from(JSON.stringify(opts.data, null, 2)).toString("base64") }],
  );
}
