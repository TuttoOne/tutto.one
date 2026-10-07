/**
 * /learn: the students' side of a programme, and the admin side of cohorts.
 *
 * Students sign in with a link we email them, never a password. The link
 * carries a random token; only its sha256 is stored, it works once, and the
 * page at /learn/auth trades it for a cookie with a POST, so a mail scanner
 * that follows the link with a GET can't use it up.
 */
import type { Express, Request, Response, NextFunction } from "express";
import { createHash, randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { and, asc, eq, gt, inArray, isNull } from "drizzle-orm";
import { db } from "./db";
import { requireAdmin } from "./admin-routes";
import { getResend } from "./email/resend";
import { buildSignInEmail, buildWelcomeEmail } from "./email/learn-emails";
import {
  cohorts, cohortSessions, students, studentProgress, loginTokens,
  studentProfileSchema,
  type Cohort, type CohortSession, type Student,
} from "@shared/schema";
import { getProgramme, type Module } from "@shared/learn-programmes";

const COOKIE_NAME = "student_token";
const COOKIE_DAYS = 30;
const SIGN_IN_MINUTES = 30;
const WELCOME_LINK_DAYS = 14;

const JWT_SECRET = (() => {
  const secret = process.env.STUDENT_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: STUDENT_JWT_SECRET (or ADMIN_JWT_SECRET) is required in production.");
    process.exit(1);
  }
  console.warn("[learn] no STUDENT_JWT_SECRET set, using an ephemeral dev secret");
  return randomBytes(32).toString("hex");
})();

// The welcome comes from Daniel so replies reach him. tutto.one is verified in
// Resend, so any address on it can send.
const FROM_PERSON = process.env.LEARN_FROM_EMAIL ?? "Daniel Forsthofer <daniel@tutto.one>";
const FROM_SYSTEM = "Tutto <notifications@tutto.one>";
const REPLY_TO = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";

function siteUrl(req: Request): string {
  if (process.env.PUBLIC_SITE_URL) return process.env.PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.NODE_ENV === "production") return "https://tutto.one";
  return `${req.protocol}://${req.get("host")}`;
}

const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

async function issueToken(studentId: number, minutes: number): Promise<string> {
  const token = randomBytes(32).toString("base64url");
  await db.insert(loginTokens).values({
    studentId,
    tokenHash: hash(token),
    expiresAt: new Date(Date.now() + minutes * 60 * 1000),
  });
  return token;
}

async function sendMail(opts: { from: string; to: string; subject: string; html: string; text: string }) {
  const resend = getResend();
  if (!resend) {
    // Local verification: the link is the only thing anyone needs from the mail.
    const link = opts.text.match(/https?:\/\/\S+\/learn\/auth\?token=\S+/)?.[0];
    console.warn(`[learn] RESEND_API_KEY not set, not sending "${opts.subject}" to ${opts.to}. Link: ${link ?? "(none)"}`);
    return;
  }
  const { error } = await resend.emails.send({ ...opts, replyTo: REPLY_TO });
  if (error) throw new Error(error.message);
}

// ── Loading a student's world ────────────────────────────────────────────────

type ModuleView = Module & {
  session: { startsAt: string; endsAt: string; status: string } | null;
  progress: { status: string; practiceNote: string | null };
};

async function loadDashboard(student: Student) {
  const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, student.cohortId));
  if (!cohort) return null;
  const sessions = await db.select().from(cohortSessions)
    .where(eq(cohortSessions.cohortId, cohort.id))
    .orderBy(asc(cohortSessions.startsAt));
  const progress = await db.select().from(studentProgress).where(eq(studentProgress.studentId, student.id));
  const programme = getProgramme(cohort.programmeKey);

  const modules: ModuleView[] = (programme?.modules ?? []).map((m) => {
    const s = sessions.find((x) => x.moduleNumber === m.number && !x.isSpare);
    const p = progress.find((x) => x.moduleNumber === m.number);
    return {
      ...m,
      title: s?.titleOverride || m.title,
      session: s ? { startsAt: s.startsAt.toISOString(), endsAt: s.endsAt.toISOString(), status: s.status } : null,
      progress: { status: p?.status ?? "not_started", practiceNote: p?.practiceNote ?? null },
    };
  });

  return {
    student: publicStudent(student),
    cohort: {
      name: cohort.name,
      organisation: cohort.organisation,
      programmeName: programme?.name ?? cohort.name,
      timezone: cohort.timezone,
      sessionMinutes: cohort.sessionMinutes,
      meetUrl: cohort.meetUrl,
    },
    spares: sessions.filter((s) => s.isSpare).map((s) => ({ startsAt: s.startsAt.toISOString(), endsAt: s.endsAt.toISOString() })),
    modules,
  };
}

/** What the student sees of their own record. The blurb is ours. */
function publicStudent(s: Student) {
  const { aboutBlurb: _blurb, ...rest } = s;
  return rest;
}

// ── Middleware ───────────────────────────────────────────────────────────────

declare global {
  namespace Express {
    interface Request {
      student?: Student;
    }
  }
}

async function requireStudent(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const { sid } = jwt.verify(token, JWT_SECRET) as { sid: number };
    const [student] = await db.select().from(students).where(eq(students.id, sid));
    if (!student) return res.status(401).json({ error: "Unauthorized" });
    req.student = student;
    next();
  } catch {
    return res.status(401).json({ error: "Unauthorized" });
  }
}

// ── Welcome email (shared by preview and send) ──────────────────────────────

async function welcomeFor(student: Student, cohort: Cohort, signInUrl: string) {
  const programme = getProgramme(cohort.programmeKey);
  const sessions = await db.select().from(cohortSessions)
    .where(eq(cohortSessions.cohortId, cohort.id))
    .orderBy(asc(cohortSessions.startsAt));
  const title = (s: CohortSession) =>
    s.titleOverride || programme?.modules.find((m) => m.number === s.moduleNumber)?.title || "Session";
  const teamSize = (await db.select({ id: students.id }).from(students).where(eq(students.cohortId, cohort.id))).length;
  return buildWelcomeEmail({
    firstName: firstName(student.name),
    programmeName: programme?.name ?? cohort.name,
    isTeam: teamSize > 1,
    timezone: cohort.timezone,
    sessionMinutes: cohort.sessionMinutes,
    meetUrl: cohort.meetUrl,
    sessions: sessions.map((s) => ({ number: s.moduleNumber, title: title(s), startsAt: s.startsAt, isSpare: s.isSpare })),
    signInUrl,
  });
}

// ── Routes ───────────────────────────────────────────────────────────────────

const cohortInput = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  organisation: z.string().nullable().optional(),
  programmeKey: z.string().refine((k) => !!getProgramme(k), "Unknown programme"),
  timezone: z.string().min(1),
  sessionMinutes: z.number().int().positive(),
  meetUrl: z.string().nullable().optional(),
  language: z.string().optional(),
  status: z.enum(["draft", "active", "done"]),
});

const sessionInput = z.object({
  moduleNumber: z.number().int().positive().nullable(),
  startsAt: z.coerce.date(),
  endsAt: z.coerce.date(),
  titleOverride: z.string().nullable().optional(),
  status: z.enum(["scheduled", "done", "moved"]).optional(),
  isSpare: z.boolean().optional(),
});

function fail(res: Response, error: unknown, what: string) {
  if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid input", details: error.errors });
  console.error(`[learn] ${what}:`, error);
  return res.status(500).json({ error: `Failed to ${what}` });
}

export function registerLearnRoutes(app: Express) {
  // ── Sign-in ──

  // Always answers the same way, so the form can't be used to find out who's enrolled.
  app.post("/api/learn/login", async (req, res) => {
    try {
      const { email } = z.object({ email: z.string().email() }).parse(req.body);
      const matches = await db.select().from(students).where(eq(students.email, email.trim().toLowerCase()));
      // Someone in two cohorts gets the most recent one.
      const student = matches.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      if (student) {
        const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, student.cohortId));
        if (cohort && cohort.status !== "draft") {
          const token = await issueToken(student.id, SIGN_IN_MINUTES);
          const mail = buildSignInEmail({
            firstName: firstName(student.name),
            signInUrl: `${siteUrl(req)}/learn/auth?token=${token}`,
          });
          await sendMail({ from: FROM_SYSTEM, to: student.email, ...mail });
        }
      }
      res.json({ ok: true });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Please enter a valid email address" });
      fail(res, error, "send the sign-in link");
    }
  });

  app.post("/api/learn/auth", async (req, res) => {
    try {
      const { token } = z.object({ token: z.string().min(10) }).parse(req.body);
      const [row] = await db.select().from(loginTokens).where(and(
        eq(loginTokens.tokenHash, hash(token)),
        isNull(loginTokens.usedAt),
        gt(loginTokens.expiresAt, new Date()),
      ));
      if (!row) return res.status(401).json({ error: "This link has expired or has already been used." });
      await db.update(loginTokens).set({ usedAt: new Date() }).where(eq(loginTokens.id, row.id));
      await db.update(students).set({ lastLoginAt: new Date() }).where(eq(students.id, row.studentId));

      const session = jwt.sign({ sid: row.studentId }, JWT_SECRET, { expiresIn: `${COOKIE_DAYS}d` });
      res.cookie(COOKIE_NAME, session, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: COOKIE_DAYS * 24 * 60 * 60 * 1000,
      });
      res.json({ ok: true });
    } catch (error) {
      fail(res, error, "sign in");
    }
  });

  app.post("/api/learn/logout", (_req, res) => {
    res.clearCookie(COOKIE_NAME);
    res.json({ ok: true });
  });

  // ── The student's own data ──

  app.get("/api/learn/me", requireStudent, async (req, res) => {
    try {
      const data = await loadDashboard(req.student!);
      if (!data) return res.status(404).json({ error: "Not found" });
      res.json(data);
    } catch (error) {
      fail(res, error, "load the dashboard");
    }
  });

  app.put("/api/learn/profile", requireStudent, async (req, res) => {
    try {
      const profile = studentProfileSchema.parse(req.body);
      const [updated] = await db.update(students)
        .set({ ...profile, profileCompletedAt: req.student!.profileCompletedAt ?? new Date() })
        .where(eq(students.id, req.student!.id))
        .returning();
      res.json({ student: publicStudent(updated) });
    } catch (error) {
      fail(res, error, "save the profile");
    }
  });

  app.put("/api/learn/progress/:module", requireStudent, async (req, res) => {
    try {
      const moduleNumber = z.coerce.number().int().positive().parse(req.params.module);
      const { status, practiceNote } = z.object({
        status: z.enum(["not_started", "in_progress", "done"]),
        practiceNote: z.string().max(5000).nullable().optional(),
      }).parse(req.body);
      const set = { status, updatedAt: new Date(), ...(practiceNote !== undefined ? { practiceNote } : {}) };
      await db.insert(studentProgress)
        .values({ studentId: req.student!.id, moduleNumber, ...set })
        .onConflictDoUpdate({ target: [studentProgress.studentId, studentProgress.moduleNumber], set });
      res.json({ ok: true });
    } catch (error) {
      fail(res, error, "save progress");
    }
  });

  // ── Admin ──

  app.get("/api/admin/learn/cohorts", requireAdmin, async (_req, res) => {
    try {
      const all = await db.select().from(cohorts).orderBy(asc(cohorts.createdAt));
      const ids = all.map((c) => c.id);
      const sessions = ids.length
        ? await db.select().from(cohortSessions).where(inArray(cohortSessions.cohortId, ids)).orderBy(asc(cohortSessions.startsAt))
        : [];
      const people = ids.length
        ? await db.select().from(students).where(inArray(students.cohortId, ids)).orderBy(asc(students.createdAt))
        : [];
      const pids = people.map((p) => p.id);
      const progress = pids.length
        ? await db.select().from(studentProgress).where(inArray(studentProgress.studentId, pids))
        : [];
      res.json(all.map((c) => ({
        ...c,
        programme: getProgramme(c.programmeKey) ?? null,
        sessions: sessions.filter((s) => s.cohortId === c.id),
        students: people.filter((p) => p.cohortId === c.id).map((p) => ({
          ...p,
          progress: progress.filter((x) => x.studentId === p.id),
        })),
      })));
    } catch (error) {
      fail(res, error, "list cohorts");
    }
  });

  app.post("/api/admin/learn/cohorts", requireAdmin, async (req, res) => {
    try {
      const data = cohortInput.parse(req.body);
      const [cohort] = await db.insert(cohorts).values(data).returning();
      res.json(cohort);
    } catch (error) {
      fail(res, error, "create the cohort");
    }
  });

  app.patch("/api/admin/learn/cohorts/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const data = cohortInput.partial().parse(req.body);
      const [cohort] = await db.update(cohorts).set(data).where(eq(cohorts.id, id)).returning();
      res.json(cohort);
    } catch (error) {
      fail(res, error, "update the cohort");
    }
  });

  app.post("/api/admin/learn/cohorts/:id/sessions", requireAdmin, async (req, res) => {
    try {
      const cohortId = z.coerce.number().int().parse(req.params.id);
      const data = sessionInput.parse(req.body);
      const [session] = await db.insert(cohortSessions).values({ ...data, cohortId }).returning();
      res.json(session);
    } catch (error) {
      fail(res, error, "add the session");
    }
  });

  app.patch("/api/admin/learn/sessions/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const data = sessionInput.partial().parse(req.body);
      const [session] = await db.update(cohortSessions).set(data).where(eq(cohortSessions.id, id)).returning();
      res.json(session);
    } catch (error) {
      fail(res, error, "update the session");
    }
  });

  app.delete("/api/admin/learn/sessions/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      await db.delete(cohortSessions).where(eq(cohortSessions.id, id));
      res.json({ ok: true });
    } catch (error) {
      fail(res, error, "delete the session");
    }
  });

  // One person per line: "Name, email" or "Name <email>".
  app.post("/api/admin/learn/cohorts/:id/students", requireAdmin, async (req, res) => {
    try {
      const cohortId = z.coerce.number().int().parse(req.params.id);
      const { lines } = z.object({ lines: z.string() }).parse(req.body);
      const parsed: { name: string; email: string }[] = [];
      const skipped: string[] = [];
      for (const raw of lines.split("\n").map((l) => l.trim()).filter(Boolean)) {
        const email = raw.match(/[^\s<>,;]+@[^\s<>,;]+\.[^\s<>,;]+/)?.[0];
        const name = email ? raw.replace(email, "").replace(/[<>,;]/g, " ").replace(/\s+/g, " ").trim() : "";
        if (!email || !name) skipped.push(raw);
        else parsed.push({ name, email: email.toLowerCase() });
      }
      const added = parsed.length
        ? await db.insert(students).values(parsed.map((p) => ({ ...p, cohortId })))
            .onConflictDoNothing({ target: [students.cohortId, students.email] })
            .returning()
        : [];
      res.json({ added: added.length, skipped });
    } catch (error) {
      fail(res, error, "add the students");
    }
  });

  app.patch("/api/admin/learn/students/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const data = studentProfileSchema.partial().extend({
        email: z.string().email().transform((e) => e.toLowerCase()).optional(),
        aboutBlurb: z.string().max(5000).nullable().optional(),
      }).parse(req.body);
      const [student] = await db.update(students).set(data).where(eq(students.id, id)).returning();
      res.json(student);
    } catch (error) {
      fail(res, error, "update the student");
    }
  });

  app.delete("/api/admin/learn/students/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      await db.delete(studentProgress).where(eq(studentProgress.studentId, id));
      await db.delete(loginTokens).where(eq(loginTokens.studentId, id));
      await db.delete(students).where(eq(students.id, id));
      res.json({ ok: true });
    } catch (error) {
      fail(res, error, "remove the student");
    }
  });

  async function studentAndCohort(id: number) {
    const [student] = await db.select().from(students).where(eq(students.id, id));
    if (!student) return null;
    const [cohort] = await db.select().from(cohorts).where(eq(cohorts.id, student.cohortId));
    return cohort ? { student, cohort } : null;
  }

  // The welcome exactly as it would go, with a placeholder where the link goes.
  app.get("/api/admin/learn/students/:id/welcome-preview", requireAdmin, async (req, res) => {
    try {
      const found = await studentAndCohort(z.coerce.number().int().parse(req.params.id));
      if (!found) return res.status(404).send("Not found");
      const mail = await welcomeFor(found.student, found.cohort, `${siteUrl(req)}/learn/auth?token=PREVIEW`);
      res.type("html").send(mail.html);
    } catch (error) {
      fail(res, error, "preview the welcome");
    }
  });

  app.post("/api/admin/learn/students/:id/invite", requireAdmin, async (req, res) => {
    try {
      const found = await studentAndCohort(z.coerce.number().int().parse(req.params.id));
      if (!found) return res.status(404).json({ error: "Not found" });
      // A draft cohort hasn't signed yet. Nothing goes out until it's set to active.
      if (found.cohort.status === "draft") {
        return res.status(409).json({ error: "This cohort is still a draft. Set it to active before inviting anyone." });
      }
      const token = await issueToken(found.student.id, WELCOME_LINK_DAYS * 24 * 60);
      const mail = await welcomeFor(found.student, found.cohort, `${siteUrl(req)}/learn/auth?token=${token}`);
      await sendMail({ from: FROM_PERSON, to: found.student.email, ...mail });
      const [student] = await db.update(students).set({ invitedAt: new Date() })
        .where(eq(students.id, found.student.id)).returning();
      res.json(student);
    } catch (error) {
      fail(res, error, "send the invite");
    }
  });
}
