/**
 * Sends the « Aborde ta rentrée IA avec Claude » follow-up email via Resend.
 *
 *   npx tsx script/send-webinar-email.ts             dry run: writes webinar-email-preview.html, lists recipients
 *   npx tsx script/send-webinar-email.ts --test      sends one copy to TEST_EMAIL (default daniel@tutto.one)
 *   npx tsx script/send-webinar-email.ts --send      sends to everyone in attendees.csv
 *
 * attendees.csv (not committed): one attendee per line, "email,first name".
 * A header line is fine, the name is optional. Each attendee gets their own
 * email, so nobody sees anyone else's address.
 *
 * Env: RESEND_API_KEY (for --test / --send), BLOG_URL, REPLAY_URL (optional;
 * the replay button is hidden while it's empty), ATTENDEES (csv path),
 * TEST_EMAIL.
 */
import fs from "fs";
import { Resend } from "resend";
import { buildWebinarEmail } from "../server/email/webinar-followup";
import { WEBINAR_SLUG } from "@shared/webinar-rentree-ia";

const FROM_EMAIL = "Tutto x Altiplane <notifications@tutto.one>";
const REPLY_TO = "daniel@tutto.one";
const BLOG_URL = process.env.BLOG_URL ?? `https://tutto.one/blog/${WEBINAR_SLUG}`;
const REPLAY_URL = process.env.REPLAY_URL ?? "";
const ATTENDEES = process.env.ATTENDEES ?? "attendees.csv";
const TEST_EMAIL = process.env.TEST_EMAIL ?? "daniel@tutto.one";
const PREVIEW = "webinar-email-preview.html";
const BATCH_SIZE = 100; // Resend's batch limit

type Recipient = { email: string; firstName?: string };

function readAttendees(path: string): Recipient[] {
  if (!fs.existsSync(path)) return [];
  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const raw of fs.readFileSync(path, "utf8").split(/\r?\n/)) {
    const [emailCell, nameCell] = raw.split(",").map((c) => c?.trim().replace(/^"|"$/g, ""));
    const email = emailCell?.toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue; // header or blank
    if (seen.has(email)) continue;
    seen.add(email);
    out.push({ email, firstName: nameCell?.split(/\s+/)[0] || undefined });
  }
  return out;
}

async function main() {
  const mode = process.argv.includes("--send") ? "send" : process.argv.includes("--test") ? "test" : "dry";
  const recipients = mode === "test" ? [{ email: TEST_EMAIL, firstName: "Daniel" }] : readAttendees(ATTENDEES);

  const preview = buildWebinarEmail({ blogUrl: BLOG_URL, replayUrl: REPLAY_URL });
  console.log(`Subject:  ${preview.subject}`);
  console.log(`Blog:     ${BLOG_URL}`);
  console.log(`Replay:   ${REPLAY_URL || "(none yet, button hidden)"}`);
  console.log(`HTML:     ${(Buffer.byteLength(preview.html) / 1024).toFixed(1)} KB (Gmail clips above ~102 KB)`);
  console.log(`To:       ${recipients.length} recipient(s)`);

  if (mode === "dry") {
    fs.writeFileSync(PREVIEW, preview.html);
    console.log(`\nPreview written to ${PREVIEW}.`);
    for (const r of recipients) console.log(`  ${r.email}${r.firstName ? ` (${r.firstName})` : ""}`);
    if (recipients.length === 0) console.log(`  No attendees found in ${ATTENDEES}.`);
    console.log("\nNothing sent. Use --test, then --send.");
    return;
  }

  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set.");
  if (recipients.length === 0) throw new Error(`No recipients found in ${ATTENDEES}.`);
  const resend = new Resend(process.env.RESEND_API_KEY);

  for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
    const chunk = recipients.slice(i, i + BATCH_SIZE);
    const payload = chunk.map((r) => {
      const email = buildWebinarEmail({ blogUrl: BLOG_URL, replayUrl: REPLAY_URL, firstName: r.firstName });
      return { from: FROM_EMAIL, to: r.email, replyTo: REPLY_TO, subject: email.subject, html: email.html, text: email.text };
    });
    // The idempotency key stops an accidental second --send (within 24h) from
    // mailing everyone twice. Test sends are left unkeyed so they can repeat.
    const { data, error } = await resend.batch.send(
      payload,
      mode === "send" ? { idempotencyKey: `${WEBINAR_SLUG}-${i / BATCH_SIZE}` } : undefined,
    );
    if (error) throw new Error(`Batch ${i / BATCH_SIZE + 1} failed: ${error.message}`);
    console.log(`Sent ${chunk.length} (batch ${i / BATCH_SIZE + 1}): ${data?.data.map((d) => d.id).join(", ")}`);
  }
}

main().catch((err) => {
  console.error(err instanceof Error ? err.message : err);
  process.exit(1);
});
