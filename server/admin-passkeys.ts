/**
 * Passkey sign-in for /admin (WebAuthn, via @simplewebauthn/server).
 *
 * A passkey replaces both login steps: the device itself checks Face ID,
 * Touch ID or a PIN (userVerification "required"), and the key is bound to
 * the site's domain so it can't be phished. Password + authenticator code
 * keeps working as the fallback.
 *
 * - Adding or removing a passkey needs an admin session (requireAdmin).
 * - Signing in uses discoverable credentials, so the login page never lists
 *   credential IDs to an anonymous visitor.
 * - Challenges travel in a signed 5-minute token and are single-use.
 *
 * Passkeys belong to a domain. In production that's PUBLIC_SITE_URL's host
 * (tutto.one, which also covers www); a passkey made on the Replit preview or
 * on localhost only works there.
 */
import type { Express, Request, Response } from "express";
import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from "@simplewebauthn/server";
import type { AuthenticatorTransportFuture } from "@simplewebauthn/server";
import { isoBase64URL, isoUint8Array } from "@simplewebauthn/server/helpers";
import { db } from "./db";
import { adminPasskeys } from "@shared/schema";
import { requireAdmin, issueAdminSession, signStepToken, verifyStepToken } from "./admin-routes";

const RP_NAME = "Tutto Admin";
// One admin, so every passkey belongs to the same WebAuthn user.
const ADMIN_USER_ID = isoUint8Array.fromUTF8String("tutto-admin");

function relyingParty(req: Request): { rpID: string; origins: string[] } {
  if (process.env.NODE_ENV === "production") {
    const host = new URL(process.env.PUBLIC_SITE_URL ?? "https://tutto.one").hostname;
    const rpID = host.replace(/^www\./, "");
    return { rpID, origins: [`https://${rpID}`, `https://www.${rpID}`] };
  }
  // Development: whatever host this was opened on (localhost or the Replit preview).
  const host = req.get("host") ?? "localhost";
  const proto = (req.get("x-forwarded-proto") ?? req.protocol).split(",")[0].trim();
  return { rpID: host.split(":")[0], origins: [`${proto}://${host}`] };
}

// Challenges already answered, so a captured response can't be replayed
// inside the token's five minutes. In memory is enough: one server process.
const usedChallenges = new Map<string, number>();
function consumeChallenge(challenge: string): boolean {
  const now = Date.now();
  usedChallenges.forEach((expires, c) => {
    if (expires < now) usedChallenges.delete(c);
  });
  if (usedChallenges.has(challenge)) return false;
  usedChallenges.set(challenge, now + 6 * 60 * 1000);
  return true;
}

type ChallengePayload = { purpose: "passkey-register" | "passkey-login"; challenge: string };

function readChallenge(token: string, purpose: ChallengePayload["purpose"]): string | null {
  const payload = verifyStepToken<ChallengePayload>(token);
  if (!payload || payload.purpose !== purpose) return null;
  if (!consumeChallenge(payload.challenge)) return null;
  return payload.challenge;
}

const parseTransports = (t: string | null): AuthenticatorTransportFuture[] | undefined =>
  t ? (JSON.parse(t) as AuthenticatorTransportFuture[]) : undefined;

const verifyBody = z.object({
  challengeToken: z.string(),
  response: z.any(),
});

export function registerAdminPasskeyRoutes(app: Express) {
  // ── Managing passkeys (signed in) ──────────────────────────────────────────

  app.get("/api/admin/passkeys", requireAdmin, async (_req, res) => {
    const rows = await db
      .select({
        id: adminPasskeys.id,
        name: adminPasskeys.name,
        createdAt: adminPasskeys.createdAt,
        lastUsedAt: adminPasskeys.lastUsedAt,
      })
      .from(adminPasskeys)
      .orderBy(desc(adminPasskeys.createdAt));
    res.json(rows);
  });

  app.post("/api/admin/passkeys/register/options", requireAdmin, async (req, res) => {
    try {
      const { rpID } = relyingParty(req);
      const existing = await db.select().from(adminPasskeys);
      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID,
        userID: ADMIN_USER_ID,
        userName: "admin",
        userDisplayName: "Tutto admin",
        attestationType: "none",
        excludeCredentials: existing.map((p) => ({
          id: p.credentialId,
          transports: parseTransports(p.transports),
        })),
        authenticatorSelection: { residentKey: "required", userVerification: "required" },
      });
      const challengeToken = signStepToken({ purpose: "passkey-register", challenge: options.challenge });
      res.json({ options, challengeToken });
    } catch (error) {
      console.error("Passkey register options error:", error);
      res.status(500).json({ error: "Couldn't start adding a passkey" });
    }
  });

  app.post("/api/admin/passkeys/register/verify", requireAdmin, async (req, res) => {
    try {
      const body = verifyBody.extend({ name: z.string().trim().min(1).max(60) }).parse(req.body);
      const expectedChallenge = readChallenge(body.challengeToken, "passkey-register");
      if (!expectedChallenge) {
        return res.status(400).json({ error: "That took too long. Try again." });
      }
      const { rpID, origins } = relyingParty(req);
      const verification = await verifyRegistrationResponse({
        response: body.response,
        expectedChallenge,
        expectedOrigin: origins,
        expectedRPID: rpID,
        requireUserVerification: true,
      });
      if (!verification.verified || !verification.registrationInfo) {
        return res.status(400).json({ error: "The passkey couldn't be verified" });
      }
      const { credential } = verification.registrationInfo;
      const [row] = await db
        .insert(adminPasskeys)
        .values({
          credentialId: credential.id,
          publicKey: isoBase64URL.fromBuffer(credential.publicKey),
          counter: credential.counter,
          transports: credential.transports ? JSON.stringify(credential.transports) : null,
          name: body.name,
        })
        .returning({ id: adminPasskeys.id, name: adminPasskeys.name });
      res.json(row);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Give the passkey a name" });
      }
      console.error("Passkey register verify error:", error);
      res.status(400).json({ error: "The passkey couldn't be verified" });
    }
  });

  app.delete("/api/admin/passkeys/:id", requireAdmin, async (req, res) => {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) return res.status(400).json({ error: "Invalid id" });
    const deleted = await db.delete(adminPasskeys).where(eq(adminPasskeys.id, id)).returning({ id: adminPasskeys.id });
    if (!deleted.length) return res.status(404).json({ error: "Not found" });
    res.json({ success: true });
  });

  // ── Signing in with a passkey ──────────────────────────────────────────────

  app.post("/api/admin/login/passkey/options", async (req, res) => {
    try {
      const { rpID } = relyingParty(req);
      const options = await generateAuthenticationOptions({
        rpID,
        userVerification: "required",
        allowCredentials: [],
      });
      const challengeToken = signStepToken({ purpose: "passkey-login", challenge: options.challenge });
      res.json({ options, challengeToken });
    } catch (error) {
      console.error("Passkey login options error:", error);
      res.status(500).json({ error: "Couldn't start passkey sign-in" });
    }
  });

  app.post("/api/admin/login/passkey/verify", async (req: Request, res: Response) => {
    const fail = () => res.status(401).json({ error: "That passkey isn't recognised" });
    try {
      const body = verifyBody.parse(req.body);
      const credentialId = typeof body.response?.id === "string" ? body.response.id : null;
      if (!credentialId) return fail();

      const expectedChallenge = readChallenge(body.challengeToken, "passkey-login");
      if (!expectedChallenge) {
        return res.status(401).json({ error: "That took too long. Try again." });
      }

      const [passkey] = await db.select().from(adminPasskeys).where(eq(adminPasskeys.credentialId, credentialId));
      if (!passkey) return fail();

      const { rpID, origins } = relyingParty(req);
      const verification = await verifyAuthenticationResponse({
        response: body.response,
        expectedChallenge,
        expectedOrigin: origins,
        expectedRPID: rpID,
        requireUserVerification: true,
        credential: {
          id: passkey.credentialId,
          publicKey: isoBase64URL.toBuffer(passkey.publicKey),
          counter: passkey.counter,
          transports: parseTransports(passkey.transports),
        },
      });
      if (!verification.verified) return fail();

      await db
        .update(adminPasskeys)
        .set({ counter: verification.authenticationInfo.newCounter, lastUsedAt: new Date() })
        .where(eq(adminPasskeys.id, passkey.id));

      issueAdminSession(res);
      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) return res.status(400).json({ error: "Invalid request" });
      console.error("Passkey login verify error:", error);
      return fail();
    }
  });
}
