/**
 * Sends the « Aborde ta rentrée IA avec Claude » follow-up email via Resend.
 *
 *   npx tsx script/send-webinar-email.ts             dry run: writes webinar-email-preview.html, lists recipients
 *   npx tsx script/send-webinar-email.ts --test      sends one copy to TEST_EMAIL (default daniel@tutto.one)
 *   npx tsx script/send-webinar-email.ts --send      sends to everyone in attendees.csv
 *
 * Options: --lang=en or --lang=fr sends one language only (default: French
 * then English); --to=someone@example.com overrides TEST_EMAIL for --test;
 * --name=Franz sets the greeting on a --test send; --joined=yes or --joined=no
 * filters a Luma export on has_joined_event.
 *
 * attendees.csv (not committed): either "email,first name" per line, or an
 * export with a header row such as Luma's guest list (email, first_name,
 * has_joined_event...). Each attendee gets their own email, so nobody sees
 * anyone else's address.
 *
 * Env: RESEND_API_KEY (for --test / --send), BLOG_URL, REPLAY_URL (defaults to the
 * YouTube replay; set it empty to hide the button), ATTENDEES (csv path),
 * TEST_EMAIL.
 */
import fs from "fs";
import { Resend } from "resend";
import { buildWebinarEmail, type EmailLanguage } from "../server/email/webinar-followup";
import { WEBINAR_SLUG } from "@shared/webinar-rentree-ia";

const FROM_EMAIL = "Tutto x Altiplane <notifications@tutto.one>";
const REPLY_TO = "daniel@tutto.one";
const BLOG_URL = process.env.BLOG_URL ?? `https://tutto.one/blog/${WEBINAR_SLUG}`;
const REPLAY_URL = process.env.REPLAY_URL ?? "https://youtu.be/cM5tb5CBfUA";
const ATTENDEES = process.env.ATTENDEES ?? "attendees.csv";
const TEST_EMAIL = process.env.TEST_EMAIL ?? "daniel@tutto.one";
const PREVIEW = "webinar-email-preview.html";
const BATCH_SIZE = 100; // Resend's batch limit

type Recipient = { email: string; firstName?: string };

/** Splits CSV text into rows, honouring quoted fields ("Dupont, Jean"). */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); rows.push(row); row = []; field = "";
    } else field += c;
  }
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.some((cell) => cell.trim() !== ""));
}

/**
 * Reads either a plain "email,first name" file or an export with a header row
 * (Luma: email, first_name, has_joined_event, ...). `joined` filters on Luma's
 * has_joined_event column: "yes" keeps people who came, "no" those who didn't.
 */
function readAttendees(path: string, joined: "yes" | "no" | "all"): Recipient[] {
  if (!fs.existsSync(path)) return [];
  const rows = parseCsv(fs.readFileSync(path, "utf8").replace(/^\uFEFF/, ""));
  const header = rows[0]?.map((h) => h.trim().toLowerCase()) ?? [];
  const hasHeader = header.includes("email");
  const col = (name: string) => header.indexOf(name);
  const emailCol = hasHeader ? col("email") : 0;
  const nameCol = hasHeader ? (col("first_name") >= 0 ? col("first_name") : col("name")) : 1;
  const joinedCol = hasHeader ? col("has_joined_event") : -1;
  if (joined !== "all" && joinedCol < 0) throw new Error("--joined needs a has_joined_event column in the CSV.");

  const seen = new Set<string>();
  const out: Recipient[] = [];
  for (const row of hasHeader ? rows.slice(1) : rows) {
    const email = row[emailCol]?.trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) continue; // blank or not an address
    if (joined !== "all" && row[joinedCol]?.trim().toLowerCase() !== joined) continue;
    if (seen.has(email)) continue;
    seen.add(email);
    out.push({ email, firstName: row[nameCol]?.trim().split(/\s+/)[0] || undefined });
  }
  return out;
}

function flag(name: string): string | undefined {
  return process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=")[1];
}

async function main() {
  const mode = process.argv.includes("--send") ? "send" : process.argv.includes("--test") ? "test" : "dry";
  const lang = (flag("lang") ?? "both") as EmailLanguage;
  if (!["both", "fr", "en"].includes(lang)) throw new Error(`--lang must be fr, en or both (got "${lang}").`);
  const joined = (flag("joined") ?? "all") as "yes" | "no" | "all";
  if (!["yes", "no", "all"].includes(joined)) throw new Error(`--joined must be yes, no or all (got "${joined}").`);
  const testTo = flag("to") ?? TEST_EMAIL;
  const recipients = mode === "test" ? [{ email: testTo, firstName: flag("name") ?? "Daniel" }] : readAttendees(ATTENDEES, joined);

  const preview = buildWebinarEmail({ blogUrl: BLOG_URL, replayUrl: REPLAY_URL, lang });
  console.log(`Subject:  ${preview.subject}`);
  console.log(`Blog:     ${BLOG_URL}`);
  console.log(`Replay:   ${REPLAY_URL || "(none yet, button hidden)"}`);
  console.log(`Language: ${lang}`);
  if (mode !== "test") console.log(`List:     ${ATTENDEES}${joined !== "all" ? ` (has_joined_event = ${joined})` : ""}`);
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
      const email = buildWebinarEmail({ blogUrl: BLOG_URL, replayUrl: REPLAY_URL, firstName: r.firstName, lang });
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
