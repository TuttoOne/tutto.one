/**
 * The data policy, in code (see /data-policy and shared/data-policy.ts).
 *
 * - The tools keep work in the user's browser. "Share with Tutto" is the only
 *   way it reaches us: POST /api/shares stores one copy, with who sent it and
 *   which policy version they agreed to.
 * - Admin can find everything held about one email address, export it, and
 *   delete it. Every deletion writes a deletion_log entry (a reference, the
 *   counts, a hash of the email, never the data) and can email the person a
 *   confirmation.
 * - A daily job deletes what the policy says we no longer keep.
 */
import type { Express } from "express";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { and, desc, eq, inArray, isNull, lt, or, sql } from "drizzle-orm";
import { db } from "./db";
import { requireAdmin } from "./admin-routes";
import { getResend } from "./email/resend";
import { buildDeletionEmail } from "./email/privacy-emails";
import { studentFromRequest } from "./learn-routes";
import {
  cohorts, cohortSessions, students, studentProgress, loginTokens, sharedRecords, deletionLog,
  contactSubmissions, emailLeads,
} from "@shared/schema";
import { POLICY_VERSION, RETENTION_MONTHS, BACKUP_DAYS, SHARE_TOOLS } from "@shared/data-policy";

const FROM = "Tutto <notifications@tutto.one>";
const REPLY_TO = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";

const norm = (email: string) => email.trim().toLowerCase();
const emailHash = (email: string) => createHash("sha256").update(norm(email)).digest("hex");

// ── What a shared copy is called in lists ────────────────────────────────────

/** Each tool keeps its work differently, so the title comes from wherever that tool keeps a name. */
function shareTitle(tool: string, data: Record<string, any>): string {
  const S = data?.S ?? {};
  const first = (...xs: unknown[]) => xs.map((x) => String(x ?? "").trim()).find(Boolean) ?? "";
  let t = "";
  if (tool === "use-case-card") {
    const listed = Array.isArray(S.week) ? S.week.find((w: any) => String(w?.task ?? "").trim())?.task : "";
    t = first(S.task?.sentence, S.card?.need, S.week?.[S.pick]?.task, listed);
  } else if (tool === "handover-list") t = first(S.job?.name);
  else if (tool === "agent-scorecard") t = first(S.meta?.name, S.meta?.agent, S.objective?.statement);
  else if (tool === "ai-charter") t = first(data?.meta?.title, data?.org?.name, data?.me?.title, data?.me?.name);
  return t.slice(0, 200);
}

// ── Deleting, with evidence ──────────────────────────────────────────────────

type Counts = Record<string, number>;

/** Everything held about one student record. Used by admin removal, erasure and retention. */
async function eraseStudentRecords(studentId: number): Promise<Counts> {
  const progress = await db.delete(studentProgress).where(eq(studentProgress.studentId, studentId)).returning({ id: studentProgress.id });
  const tokens = await db.delete(loginTokens).where(eq(loginTokens.studentId, studentId)).returning({ id: loginTokens.id });
  const shared = await db.delete(sharedRecords).where(eq(sharedRecords.studentId, studentId)).returning({ id: sharedRecords.id });
  const people = await db.delete(students).where(eq(students.id, studentId)).returning({ id: students.id });
  return { students: people.length, progress: progress.length, loginTokens: tokens.length, sharedRecords: shared.length };
}

function add(a: Counts, b: Counts): Counts {
  const out = { ...a };
  for (const [k, n] of Object.entries(b)) out[k] = (out[k] ?? 0) + n;
  return out;
}

async function logDeletion(o: { email?: string | null; reason: "request" | "retention"; counts: Counts; note?: string }) {
  const day = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const reference = `DEL-${day}-${randomBytes(3).toString("hex").toUpperCase()}`;
  const [entry] = await db.insert(deletionLog).values({
    reference,
    subjectHash: o.email ? emailHash(o.email) : null,
    reason: o.reason,
    counts: o.counts,
    note: o.note ?? null,
  }).returning();
  return entry;
}

/** One student removed from a cohort in admin. Their other cohorts, if any, stay. */
export async function eraseStudent(studentId: number, note: string) {
  const [student] = await db.select().from(students).where(eq(students.id, studentId));
  if (!student) return null;
  const counts = await eraseStudentRecords(studentId);
  return logDeletion({ email: student.email, reason: "request", counts, note });
}

/** "Forget me": everything under an email address, in every table that holds one. */
export async function eraseByEmail(email: string, reason: "request" | "retention", note?: string) {
  const e = norm(email);
  let counts: Counts = {};
  const people = await db.select({ id: students.id }).from(students).where(sql`lower(${students.email}) = ${e}`);
  for (const p of people) counts = add(counts, await eraseStudentRecords(p.id));
  const shared = await db.delete(sharedRecords).where(sql`lower(${sharedRecords.email}) = ${e}`).returning({ id: sharedRecords.id });
  const enquiries = await db.delete(contactSubmissions).where(sql`lower(${contactSubmissions.email}) = ${e}`).returning({ id: contactSubmissions.id });
  const leads = await db.delete(emailLeads).where(sql`lower(${emailLeads.email}) = ${e}`).returning({ id: emailLeads.id });
  counts = add(counts, { sharedRecords: shared.length, enquiries: enquiries.length, leads: leads.length });
  return logDeletion({ email: e, reason, counts, note });
}

// ── Retention ────────────────────────────────────────────────────────────────

function monthsAfter(d: Date, months: number) {
  const out = new Date(d);
  out.setMonth(out.getMonth() + months);
  return out;
}

/**
 * Deletes what the policy says we no longer keep:
 * - a cohort's students, progress and shared work, RETENTION_MONTHS after its last
 *   session (or after it was set up, if it never had one), unless retainUntil says otherwise
 * - shared copies from people who aren't students, RETENTION_MONTHS after they were sent
 * - sign-in links once they're a day past use or expiry
 * The cohort itself (a name, a programme, dates) stays, with nobody in it.
 */
export async function runRetention(now = new Date()) {
  let erased = 0;
  for (const c of await db.select().from(cohorts)) {
    const [last] = await db.select({ end: sql<Date>`max(${cohortSessions.endsAt})` }).from(cohortSessions).where(eq(cohortSessions.cohortId, c.id));
    const lastEnd = last?.end ? new Date(last.end) : c.createdAt;
    const until = c.retainUntil ?? monthsAfter(lastEnd, RETENTION_MONTHS);
    if (until > now) continue;
    const people = await db.select().from(students).where(eq(students.cohortId, c.id));
    for (const p of people) {
      const counts = await eraseStudentRecords(p.id);
      await logDeletion({ email: p.email, reason: "retention", counts, note: `Cohort ${c.slug}` });
      erased++;
    }
    if (people.length && c.status !== "done") await db.update(cohorts).set({ status: "done" }).where(eq(cohorts.id, c.id));
  }

  const cutoff = monthsAfter(now, -RETENTION_MONTHS);
  const old = await db.select({ id: sharedRecords.id, email: sharedRecords.email }).from(sharedRecords)
    .where(and(isNull(sharedRecords.studentId), lt(sharedRecords.createdAt, cutoff)));
  for (const r of old) {
    await db.delete(sharedRecords).where(eq(sharedRecords.id, r.id));
    await logDeletion({ email: r.email, reason: "retention", counts: { sharedRecords: 1 } });
    erased++;
  }

  const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  await db.delete(loginTokens).where(or(lt(loginTokens.expiresAt, dayAgo), lt(loginTokens.usedAt, dayAgo)));
  if (erased) console.log(`[data] retention deleted records for ${erased} people or shares`);
}

export function scheduleRetention() {
  const run = () => runRetention().catch((e) => console.error("[data] retention failed:", e));
  setTimeout(run, 60 * 1000);
  setInterval(run, 24 * 60 * 60 * 1000);
}

// ── Routes ───────────────────────────────────────────────────────────────────

/** A few shares per address per hour is plenty. In memory, so it resets on restart. */
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 20;
}

const shareInput = z.object({
  tool: z.enum(Object.keys(SHARE_TOOLS) as [keyof typeof SHARE_TOOLS, ...(keyof typeof SHARE_TOOLS)[]]),
  data: z.record(z.string(), z.unknown()).refine((d) => JSON.stringify(d).length < 500_000, "That's too large to share."),
  name: z.string().trim().min(1, "Please give your name").max(200),
  email: z.string().trim().email("Please give a valid email address").max(320),
  organisation: z.string().trim().max(200).optional().nullable(),
  note: z.string().trim().max(2000).optional().nullable(),
  policyVersion: z.literal(POLICY_VERSION, { errorMap: () => ({ message: "Please agree to the current data policy." }) }),
});

function fail(res: any, error: unknown, what: string) {
  if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0]?.message ?? "Invalid input" });
  console.error(`[data] failed to ${what}:`, error);
  return res.status(500).json({ error: `Failed to ${what}` });
}

export function registerDataRoutes(app: Express) {
  // Open to everyone: the tools are public. Linked to a student when they're signed in to /learn.
  app.post("/api/shares", async (req, res) => {
    try {
      if (tooMany(req.ip ?? "?")) return res.status(429).json({ error: "Too many shares from here. Try again in an hour." });
      const input = shareInput.parse(req.body);
      const student = await studentFromRequest(req);
      const [row] = await db.insert(sharedRecords).values({
        tool: input.tool,
        title: shareTitle(input.tool, input.data),
        data: input.data,
        name: input.name,
        email: norm(input.email),
        organisation: input.organisation || null,
        note: input.note || null,
        studentId: student?.id ?? null,
        policyVersion: input.policyVersion,
      }).returning({ id: sharedRecords.id, createdAt: sharedRecords.createdAt });
      res.json({ ok: true, id: row.id, linkedToAccount: !!student });
    } catch (error) {
      fail(res, error, "share your work");
    }
  });

  // ── Admin ──

  app.get("/api/admin/shares", requireAdmin, async (_req, res) => {
    try {
      const rows = await db.select({
        id: sharedRecords.id, tool: sharedRecords.tool, title: sharedRecords.title, name: sharedRecords.name,
        email: sharedRecords.email, organisation: sharedRecords.organisation, note: sharedRecords.note,
        studentId: sharedRecords.studentId, policyVersion: sharedRecords.policyVersion, createdAt: sharedRecords.createdAt,
      }).from(sharedRecords).orderBy(desc(sharedRecords.createdAt));
      res.json(rows);
    } catch (error) {
      fail(res, error, "list shared work");
    }
  });

  app.get("/api/admin/shares/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const [row] = await db.select().from(sharedRecords).where(eq(sharedRecords.id, id));
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (error) {
      fail(res, error, "load shared work");
    }
  });

  app.delete("/api/admin/shares/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const [row] = await db.delete(sharedRecords).where(eq(sharedRecords.id, id)).returning({ email: sharedRecords.email });
      if (!row) return res.status(404).json({ error: "Not found" });
      const entry = await logDeletion({ email: row.email, reason: "request", counts: { sharedRecords: 1 }, note: "One shared copy deleted in admin" });
      res.json({ ok: true, reference: entry.reference });
    } catch (error) {
      fail(res, error, "delete shared work");
    }
  });

  /** Everything held about one person. Used to answer "what do you have on me?" and before deleting. */
  async function subject(email: string) {
    const e = norm(email);
    const people = await db.select().from(students).where(sql`lower(${students.email}) = ${e}`);
    const ids = people.map((p) => p.id);
    const cohortRows = people.length ? await db.select().from(cohorts).where(inArray(cohorts.id, people.map((p) => p.cohortId))) : [];
    const progress = ids.length ? await db.select().from(studentProgress).where(inArray(studentProgress.studentId, ids)) : [];
    const shared = await db.select().from(sharedRecords).where(or(
      sql`lower(${sharedRecords.email}) = ${e}`,
      ids.length ? inArray(sharedRecords.studentId, ids) : sql`false`,
    ));
    const enquiries = await db.select().from(contactSubmissions).where(sql`lower(${contactSubmissions.email}) = ${e}`);
    const leads = await db.select().from(emailLeads).where(sql`lower(${emailLeads.email}) = ${e}`);
    const deletions = await db.select().from(deletionLog).where(eq(deletionLog.subjectHash, emailHash(e))).orderBy(desc(deletionLog.createdAt));
    return {
      email: e,
      students: people.map((p) => ({ ...p, cohort: cohortRows.find((c) => c.id === p.cohortId)?.name ?? null })),
      progress, sharedRecords: shared, enquiries, leads, deletions,
    };
  }

  app.get("/api/admin/privacy/subject", requireAdmin, async (req, res) => {
    try {
      const email = z.string().email().parse(req.query.email);
      res.json(await subject(email));
    } catch (error) {
      fail(res, error, "look up that person");
    }
  });

  app.get("/api/admin/privacy/subject/export", requireAdmin, async (req, res) => {
    try {
      const email = z.string().email().parse(req.query.email);
      const data = await subject(email);
      res.setHeader("Content-Disposition", `attachment; filename="tutto-data-${norm(email).replace(/[^a-z0-9]+/g, "-")}.json"`);
      res.json({ exportedAt: new Date().toISOString(), policyVersion: POLICY_VERSION, ...data });
    } catch (error) {
      fail(res, error, "export that person's data");
    }
  });

  app.post("/api/admin/privacy/subject/erase", requireAdmin, async (req, res) => {
    try {
      const { email, note, notify } = z.object({
        email: z.string().email(),
        note: z.string().trim().max(500).optional(),
        notify: z.boolean().default(true),
      }).parse(req.body);
      const entry = await eraseByEmail(email, "request", note || "Deletion requested");
      let emailed = false;
      if (notify) {
        const resend = getResend();
        const mail = buildDeletionEmail({ reference: entry.reference, deletedAt: entry.createdAt, counts: entry.counts as Counts, backupDays: BACKUP_DAYS });
        if (resend) {
          const { error } = await resend.emails.send({ from: FROM, to: norm(email), replyTo: REPLY_TO, ...mail });
          if (error) console.error("[data] deletion confirmation failed:", error.message);
          else emailed = true;
        } else {
          console.warn(`[data] RESEND_API_KEY not set, not sending the deletion confirmation ${entry.reference}`);
        }
      }
      res.json({ ok: true, reference: entry.reference, counts: entry.counts, emailed });
    } catch (error) {
      fail(res, error, "delete that person's data");
    }
  });

  app.get("/api/admin/privacy/log", requireAdmin, async (_req, res) => {
    try {
      res.json(await db.select().from(deletionLog).orderBy(desc(deletionLog.createdAt)).limit(200));
    } catch (error) {
      fail(res, error, "load the deletion log");
    }
  });
}
