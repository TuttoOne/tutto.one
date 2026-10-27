/**
 * Pocket Praxis accounts (/pocket-praxis, the course decks as a phone game).
 *
 * Ported from the FastAPI service that ran on Hetzner (TuttoOne/plato-mobile,
 * api/app.py), with the same behaviour under /api/pocket instead of /api.
 *
 * - Sign-in is optional. The game keeps progress in the browser and works with
 *   no account, no network and no server; this only lets progress follow
 *   someone to a second device. Nothing here may become required.
 * - No passwords. A six-digit code by email, stored as an HMAC so a leaked
 *   table is useless without the secret (a million codes is nothing to try
 *   offline). Session tokens are stored as a hash, never in the clear.
 * - Totals only: no route lists people or shows one person's progress to anyone
 *   else. Each person can export everything held about them and delete it.
 */
import type { Express, Request, Response } from "express";
import { createHash, createHmac, randomBytes, randomInt, timingSafeEqual } from "crypto";
import { z } from "zod";
import { pool } from "./db";
import { getResend } from "./email/resend";

const COOKIE = "pocket_session";
const COOKIE_PATH = "/api/pocket";
const CODE_MINUTES = 10;
const SESSION_DAYS = 90;
const MAX_ATTEMPTS = 5;
const FROM = process.env.POCKET_FROM_EMAIL ?? "Pocket Praxis <praxis@tutto.one>";

// The same secret /learn requires in production, so there is no new one to set.
const SECRET = (() => {
  const secret = process.env.STUDENT_JWT_SECRET || process.env.ADMIN_JWT_SECRET;
  if (secret) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error("FATAL: STUDENT_JWT_SECRET (or ADMIN_JWT_SECRET) is required in production.");
    process.exit(1);
  }
  return randomBytes(32).toString("hex");
})();

const norm = (email: string) => email.trim().toLowerCase();
const hmacCode = (email: string, code: string) =>
  createHmac("sha256", `pocket:${SECRET}`).update(`${norm(email)}:${code}`).digest();
const hashToken = (token: string) => createHash("sha256").update(token).digest();

// ── Throttles ────────────────────────────────────────────────────────────────
// In memory: one instance, and a restart clearing the counters is acceptable.

function throttle(limit: number) {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const now = Date.now();
    const seen = (hits.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000);
    if (seen.length >= limit) {
      hits.set(key, seen);
      return false;
    }
    seen.push(now);
    hits.set(key, seen);
    return true;
  };
}
const byEmail = throttle(5);
const byIp = throttle(20);

// ── Sending ──────────────────────────────────────────────────────────────────

async function sendCode(email: string, code: string) {
  const resend = getResend();
  if (!resend) {
    // Never print the code in production: that would be a way in.
    if (process.env.NODE_ENV !== "production") console.log(`[pocket] dev code for ${email}: ${code}`);
    else console.warn("[pocket] RESEND_API_KEY not set, no code was sent");
    return;
  }
  const { error } = await resend.emails.send({
    from: FROM,
    to: email,
    subject: "Your Pocket Praxis sign-in code",
    text:
      `Your Pocket Praxis sign-in code is ${code}\n\n` +
      "It works for ten minutes. If you did not ask for it, nothing has\n" +
      "happened to your account and you can ignore this.\n",
  });
  if (error) console.error("[pocket] could not send code:", error.message);
}

// ── Sessions and progress ────────────────────────────────────────────────────

type User = { id: number; email: string; name: string | null };

async function currentUser(req: Request): Promise<User | null> {
  const token = req.cookies?.[COOKIE];
  if (typeof token !== "string" || !token) return null;
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.name FROM pocket_sessions s
       JOIN pocket_users u ON u.id = s.user_id
      WHERE s.token_hash = $1 AND s.expires_at > now()`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
}

type Progress = {
  courses?: Record<string, { done?: Record<string, { points?: number }> }>;
  points?: number;
  streak?: number;
  lastPlayed?: string | null;
};

/**
 * Two devices' progress, without losing either. Steps are a union; points are
 * recomputed from the merged steps rather than taking the larger total, so the
 * total can never drift from what was actually done.
 */
function mergeProgress(a: Progress | null, b: Progress | null) {
  const courses: Record<string, { done: Record<string, { points: number }> }> = {};
  for (const src of [a ?? {}, b ?? {}]) {
    for (const [cid, c] of Object.entries(src.courses ?? {})) {
      const keep = (courses[cid] ??= { done: {} });
      for (const [sid, s] of Object.entries(c?.done ?? {})) {
        const pts = Number(s?.points) || 0;
        if (pts > (keep.done[sid]?.points ?? -1)) keep.done[sid] = { points: pts };
      }
    }
  }
  const points = Object.values(courses).reduce(
    (n, c) => n + Object.values(c.done).reduce((m, s) => m + s.points, 0), 0);
  const streak = Math.max(Number(a?.streak) || 0, Number(b?.streak) || 0);
  const last = [a?.lastPlayed, b?.lastPlayed].filter((x): x is string => typeof x === "string" && !!x).sort();
  return { courses, points, streak, lastPlayed: last.at(-1) ?? null };
}

function setCookie(res: Response, token: string) {
  res.cookie(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: COOKIE_PATH,
    maxAge: SESSION_DAYS * 24 * 60 * 60 * 1000,
  });
}

// ── Routes ───────────────────────────────────────────────────────────────────

const requestInput = z.object({ email: z.string().trim().email().max(320) });
const verifyInput = z.object({
  email: z.string().trim().email().max(320),
  code: z.string().regex(/^\d{6}$/),
  name: z.string().trim().max(80).nullish(),
});
const progressInput = z.object({
  data: z.record(z.string(), z.unknown()).refine((d) => JSON.stringify(d).length < 200_000),
});

export function registerPocketRoutes(app: Express) {
  app.post("/api/pocket/auth/request", async (req, res) => {
    const parsed = requestInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "Please give a valid email address." });
    const email = norm(parsed.data.email);
    // The same answer whether the address is known, new or throttled, so this
    // can't be used to test who has signed up.
    if (byEmail(email) && byIp(req.ip ?? "?")) {
      try {
        const code = String(randomInt(1_000_000)).padStart(6, "0");
        await pool.query(`DELETE FROM pocket_login_codes WHERE email = $1`, [email]);
        await pool.query(
          `INSERT INTO pocket_login_codes (email, code_hmac, expires_at)
           VALUES ($1, $2, now() + make_interval(mins => $3))`,
          [email, hmacCode(email, code), CODE_MINUTES],
        );
        await sendCode(email, code);
      } catch (err) {
        console.error("[pocket] could not issue a code:", err);
      }
    }
    res.json({ sent: true });
  });

  app.post("/api/pocket/auth/verify", async (req, res) => {
    const bad = () => res.status(400).json({ error: "That code is wrong or has expired." });
    const parsed = verifyInput.safeParse(req.body);
    if (!parsed.success) return bad();
    const email = norm(parsed.data.email);
    try {
      const { rows } = await pool.query(
        `SELECT id, code_hmac, attempts FROM pocket_login_codes
          WHERE email = $1 AND expires_at > now()
          ORDER BY created_at DESC LIMIT 1`,
        [email],
      );
      const row = rows[0];
      if (!row) return bad();
      if (row.attempts >= MAX_ATTEMPTS) {
        await pool.query(`DELETE FROM pocket_login_codes WHERE id = $1`, [row.id]);
        return bad();
      }
      const want = hmacCode(email, parsed.data.code);
      if (!timingSafeEqual(Buffer.from(row.code_hmac), want)) {
        await pool.query(`UPDATE pocket_login_codes SET attempts = attempts + 1 WHERE id = $1`, [row.id]);
        return bad();
      }
      await pool.query(`DELETE FROM pocket_login_codes WHERE id = $1`, [row.id]);
      const { rows: users } = await pool.query(
        `INSERT INTO pocket_users (email, name) VALUES ($1, $2)
         ON CONFLICT (email) DO UPDATE
           SET last_seen_at = now(), name = COALESCE(EXCLUDED.name, pocket_users.name)
         RETURNING id, email, name`,
        [email, parsed.data.name || null],
      );
      const token = randomBytes(32).toString("base64url");
      await pool.query(
        `INSERT INTO pocket_sessions (token_hash, user_id, expires_at)
         VALUES ($1, $2, now() + make_interval(days => $3))`,
        [hashToken(token), users[0].id, SESSION_DAYS],
      );
      setCookie(res, token);
      res.json({ email: users[0].email, name: users[0].name });
    } catch (err) {
      console.error("[pocket] verify failed:", err);
      res.status(500).json({ error: "Something went wrong. Please try again." });
    }
  });

  app.post("/api/pocket/auth/logout", async (req, res) => {
    const token = req.cookies?.[COOKIE];
    if (typeof token === "string" && token) {
      await pool.query(`DELETE FROM pocket_sessions WHERE token_hash = $1`, [hashToken(token)]).catch(() => {});
    }
    res.clearCookie(COOKIE, { path: COOKIE_PATH });
    res.status(204).end();
  });

  app.get("/api/pocket/me", async (req, res) => {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: "not signed in" });
    res.json({ email: user.email, name: user.name });
  });

  app.get("/api/pocket/progress", async (req, res) => {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: "not signed in" });
    const { rows } = await pool.query(`SELECT data FROM pocket_progress WHERE user_id = $1`, [user.id]);
    res.json({ data: rows[0]?.data ?? null });
  });

  app.put("/api/pocket/progress", async (req, res) => {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: "not signed in" });
    const parsed = progressInput.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: "bad progress" });
    const { rows } = await pool.query(`SELECT data FROM pocket_progress WHERE user_id = $1`, [user.id]);
    const merged = mergeProgress(rows[0]?.data ?? null, parsed.data.data as Progress);
    await pool.query(
      `INSERT INTO pocket_progress (user_id, data) VALUES ($1, $2)
       ON CONFLICT (user_id) DO UPDATE SET data = EXCLUDED.data, updated_at = now()`,
      [user.id, JSON.stringify(merged)],
    );
    await pool.query(`UPDATE pocket_users SET last_seen_at = now() WHERE id = $1`, [user.id]);
    res.json({ data: merged });
  });

  // Everything held about them, in one response.
  app.get("/api/pocket/account/export", async (req, res) => {
    const user = await currentUser(req);
    if (!user) return res.status(401).json({ error: "not signed in" });
    const { rows: u } = await pool.query(
      `SELECT email, name, created_at, last_seen_at FROM pocket_users WHERE id = $1`, [user.id]);
    const { rows: p } = await pool.query(
      `SELECT data, updated_at FROM pocket_progress WHERE user_id = $1`, [user.id]);
    res.json({
      email: u[0].email,
      name: u[0].name,
      created_at: u[0].created_at,
      last_seen_at: u[0].last_seen_at,
      progress: p[0]?.data ?? null,
      progress_updated_at: p[0]?.updated_at ?? null,
      note: "This is everything stored about you.",
    });
  });

  // Erasure, at once and without asking. Sessions and progress go with the row.
  app.delete("/api/pocket/account", async (req, res) => {
    const user = await currentUser(req);
    if (!user) return res.status(401).end();
    await pool.query(`DELETE FROM pocket_login_codes WHERE email = $1`, [user.email]);
    await pool.query(`DELETE FROM pocket_users WHERE id = $1`, [user.id]);
    res.clearCookie(COOKIE, { path: COOKIE_PATH });
    res.status(204).end();
  });
}
