import type { Express, Request } from "express";
import { createHmac, randomBytes, timingSafeEqual } from "crypto";

/**
 * Bot screening for the public forms (enquiries, leads, workshop bookings).
 * Nothing here is visible to a visitor. Each submission gets one of three verdicts:
 *
 * - drop: the hidden honeypot field was filled in, or the form was sent faster
 *   than a person can type. We answer as if it worked, save nothing, mail nothing.
 * - flag: it got through but looks like spam (no form token, a link to someone
 *   else's site, a throwaway domain, a generated address). It is kept and mailed,
 *   with "[Likely spam]" in the subject, so a false positive costs nothing.
 * - ok: everything else.
 */

const SECRET =
  process.env.FORM_TOKEN_SECRET ||
  process.env.ADMIN_JWT_SECRET ||
  randomBytes(32).toString("hex");

/** The real client waits out this gap itself, so only scripts trip it. */
const MIN_AGE_MS = 3000;
/** Older tokens are flagged, never dropped: someone may leave a tab open for days. */
const MAX_AGE_MS = 48 * 60 * 60 * 1000;

function sign(ts: string) {
  return createHmac("sha256", SECRET).update(`form:${ts}`).digest("base64url");
}

export function issueFormToken() {
  const ts = Date.now().toString(36);
  return `${ts}.${sign(ts)}`;
}

/** Age of a token in ms, or null if it is missing or forged. */
function tokenAge(token: unknown): number | null {
  if (typeof token !== "string" || token.length > 100) return null;
  const [ts, sig] = token.split(".");
  if (!ts || !sig) return null;
  const want = Buffer.from(sign(ts));
  const got = Buffer.from(sig);
  if (want.length !== got.length || !timingSafeEqual(want, got)) return null;
  const issued = parseInt(ts, 36);
  return Number.isFinite(issued) ? Date.now() - issued : null;
}

/**
 * The visitor's address. The app does not set "trust proxy", so behind Replit's
 * proxy req.ip is the proxy and every visitor would share one bucket. The first
 * X-Forwarded-For entry can be faked, which only lets a bot dodge the rate
 * limit; the other checks still apply, and real visitors never collide.
 */
export function clientIp(req: Request) {
  const xff = req.headers["x-forwarded-for"];
  const first = (Array.isArray(xff) ? xff[0] : xff)?.split(",")[0]?.trim();
  return first || req.ip || "?";
}

const hits = new Map<string, number[]>();
/** True once this address has gone over `max` in the last hour. In memory, so it resets on restart. */
export function overLimit(req: Request, bucket: string, max: number) {
  const key = `${bucket}:${clientIp(req)}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 10_000) {
    hits.forEach((v, k) => {
      if (!v.some((t) => now - t < 60 * 60 * 1000)) hits.delete(k);
    });
  }
  return recent.length > max;
}

// Throwaway mail services and the cheap domains bots register in bulk.
const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com", "temp-mail.org",
  "yopmail.com", "trashmail.com", "sharklasers.com", "getnada.com", "dispostable.com",
  "maildrop.cc", "throwawaymail.com", "fakeinbox.com", "mailnesia.com", "mintemail.com",
]);
const CHEAP_SUFFIXES = [".my.id", ".biz.id", ".web.id", ".xyz", ".top", ".icu", ".click", ".buzz", ".rest", ".cfd", ".sbs"];

function registrable(host: string) {
  return host.toLowerCase().replace(/^www\./, "");
}

/** Plain-language reasons this content looks like spam. Two or more means flag. */
function contentSignals(email: string, message: string): string[] {
  const reasons: string[] = [];
  const [local = "", domainRaw = ""] = email.toLowerCase().split("@");
  const domain = registrable(domainRaw);

  if (DISPOSABLE.has(domain)) reasons.push("throwaway email service");
  else if (CHEAP_SUFFIXES.some((s) => domain.endsWith(s))) reasons.push(`email on a bulk-registered domain (${domain})`);

  // firstname.lastname7608: what generated identities look like.
  if (/^[a-z]+[._][a-z]+\d{3,}$/.test(local)) reasons.push("address looks generated");

  const links = message.match(/\bhttps?:\/\/[^\s<>"')]+|\bwww\.[^\s<>"')]+/gi) ?? [];
  const foreign = links.filter((l) => {
    try {
      const host = registrable(new URL(l.startsWith("http") ? l : `https://${l}`).hostname);
      return host !== domain && !host.endsWith(`.${domain}`) && !domain.endsWith(`.${host}`);
    } catch {
      return true;
    }
  });
  if (foreign.length) reasons.push(`links to a site that isn't theirs (${foreign.length})`);

  return reasons;
}

export type Verdict = { action: "drop" | "flag" | "ok"; reasons: string[] };

export function screen(req: Request, content: { email: string; message?: string }): Verdict {
  const body = req.body ?? {};
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return { action: "drop", reasons: ["honeypot filled"] };
  }
  const age = tokenAge(body.formToken);
  if (age !== null && age < MIN_AGE_MS) return { action: "drop", reasons: [`sent ${age}ms after the form loaded`] };

  const reasons: string[] = [];
  if (age === null) reasons.push("no valid form token (sent without loading the page)");
  else if (age > MAX_AGE_MS) reasons.push("form token older than two days");

  const signals = contentSignals(content.email, content.message ?? "");
  const flagged = reasons.length > 0 || signals.length >= 2;
  reasons.push(...signals);

  if (flagged) return { action: "flag", reasons };
  return { action: "ok", reasons };
}

export function logDrop(what: string, req: Request, v: Verdict) {
  console.warn(`[form-guard] dropped ${what} from ${clientIp(req)}: ${v.reasons.join("; ")}`);
}

export function registerFormGuardRoutes(app: Express) {
  app.get("/api/form-token", (_req, res) => {
    res.set("Cache-Control", "no-store");
    res.json({ token: issueFormToken() });
  });
}
