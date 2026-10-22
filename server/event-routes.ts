/**
 * Booking places at in-person evenings (/rieuzal), with a waiting list.
 *
 * - Each evening has a fixed number of places. A booking is for 1 to
 *   MAX_SEATS_PER_BOOKING people. If it fits, it's confirmed; if not, it joins
 *   the waiting list.
 * - Every booking and cancellation locks its evening's row first, so two people
 *   booking the last place at the same moment can't both get it.
 * - When a place comes free (a cancellation, or more places added in admin),
 *   the waiting list is read in the order people joined and everyone whose
 *   group now fits is confirmed and emailed.
 * - Nobody has an account. Each booking email carries a link with a random
 *   token (only its hash is stored) that shows the booking and cancels it.
 * - The day before, everyone confirmed gets a reminder with that same link,
 *   which is when most no-shows can still free their place.
 */
import type { Express, Request } from "express";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { and, asc, eq, gt, inArray, isNull, lt, ne, sql } from "drizzle-orm";
import { db } from "./db";
import { requireAdmin } from "./admin-routes";
import { getResend } from "./email/resend";
import { siteUrl } from "./learn-routes";
import { escapeHtml } from "./email/enquiry-message";
import {
  buildCancelledEmail, buildConfirmedEmail, buildPromotedEmail, buildReminderEmail, buildWaitlistEmail,
  frWhen, type BookingMail, type Mail,
} from "./email/event-emails";
import { events, eventBookings, eventBookingInputSchema, MAX_SEATS_PER_BOOKING, type Event, type EventBooking } from "@shared/schema";
import { POLICY_VERSION } from "@shared/data-policy";
import { MODULE_ICONS, type ModuleIcon } from "@shared/learn-programmes";

const FROM = process.env.LEARN_FROM_EMAIL ?? "Daniel Forsthofer <daniel@tutto.one>";
const DANIEL = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

const norm = (email: string) => email.trim().toLowerCase();
const hash = (token: string) => createHash("sha256").update(token).digest("hex");
const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

// ── Sending ──────────────────────────────────────────────────────────────────

async function sendTo(to: string, mail: Mail) {
  const resend = getResend();
  if (!resend) {
    console.warn(`[events] RESEND_API_KEY not set, not sending "${mail.subject}"`);
    return false;
  }
  try {
    const { error } = await resend.emails.send({ from: FROM, to, replyTo: DANIEL, ...mail });
    if (error) {
      console.error(`[events] failed to send "${mail.subject}":`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`[events] failed to send "${mail.subject}":`, err);
    return false;
  }
}

/** A short note to Daniel for each booking or cancellation. Never blocks the visitor. */
function tellDaniel(subject: string, lines: string[], admin: string) {
  const html = `<div style="font-family:Inter,sans-serif;max-width:600px;margin:0 auto;padding:24px;background:#f6f1ea;">
<div style="background:#fff;border-radius:10px;padding:24px;">
<p style="margin:0 0 12px;font-size:18px;font-weight:700;">${escapeHtml(subject)}</p>
${lines.map((l) => `<p style="margin:0 0 8px;font-size:14px;">${escapeHtml(l)}</p>`).join("")}
<p style="margin:12px 0 0;"><a href="${escapeHtml(admin)}" style="color:#d97706;">Open in admin</a></p>
</div></div>`;
  void sendTo(DANIEL, { subject, html, text: [...lines, admin].join("\n") });
}

// ── Reading ──────────────────────────────────────────────────────────────────

type Counts = { confirmedSeats: number; waitlistBookings: number; waitlistSeats: number };

async function countsFor(ids: number[], q: Tx | typeof db = db): Promise<Map<number, Counts>> {
  const out = new Map<number, Counts>(ids.map((id) => [id, { confirmedSeats: 0, waitlistBookings: 0, waitlistSeats: 0 }]));
  if (!ids.length) return out;
  const rows = await q.select({
    eventId: eventBookings.eventId,
    status: eventBookings.status,
    seats: sql<number>`coalesce(sum(${eventBookings.seats}), 0)::int`,
    n: sql<number>`count(*)::int`,
  }).from(eventBookings)
    .where(and(inArray(eventBookings.eventId, ids), ne(eventBookings.status, "cancelled")))
    .groupBy(eventBookings.eventId, eventBookings.status);
  for (const r of rows) {
    const c = out.get(r.eventId)!;
    if (r.status === "confirmed") c.confirmedSeats = r.seats;
    if (r.status === "waitlist") { c.waitlistBookings = r.n; c.waitlistSeats = r.seats; }
  }
  return out;
}

function publicEvent(e: Event, c: Counts) {
  return {
    slug: e.slug,
    series: e.series,
    title: e.title,
    note: e.note,
    icon: e.icon,
    startsAt: e.startsAt,
    endsAt: e.endsAt,
    venue: e.venue,
    address: e.address,
    capacity: e.capacity,
    placesLeft: Math.max(0, e.capacity - c.confirmedSeats),
    waitlist: c.waitlistBookings,
    status: e.status,
  };
}

async function waitlistPosition(b: EventBooking, q: Tx | typeof db = db): Promise<number> {
  const [r] = await q.select({ n: sql<number>`count(*)::int` }).from(eventBookings)
    .where(and(eq(eventBookings.eventId, b.eventId), eq(eventBookings.status, "waitlist"), sql`${eventBookings.id} <= ${b.id}`));
  return r?.n ?? 1;
}

function mailFor(req: Request, e: Event, b: Pick<EventBooking, "name" | "seats">, token: string): BookingMail {
  const base = siteUrl(req);
  return {
    firstName: firstName(b.name),
    seats: b.seats,
    event: e,
    pageUrl: `${base}/${e.series}`,
    cancelUrl: `${base}/${e.series}/annuler?t=${token}`,
  };
}

// ── Changing ─────────────────────────────────────────────────────────────────

/** Locks one evening for the rest of the transaction, so its places are counted once. */
async function lockEvent(tx: Tx, id: number): Promise<Event | undefined> {
  await tx.execute(sql`SELECT id FROM events WHERE id = ${id} FOR UPDATE`);
  const [e] = await tx.select().from(events).where(eq(events.id, id));
  return e;
}

/**
 * Confirms people from the waiting list, in the order they joined, while their
 * group fits in the places left. A group too big for what's free keeps its
 * place in the queue; a smaller one behind it can still go in.
 */
async function promote(tx: Tx, e: Event): Promise<EventBooking[]> {
  if (e.status !== "open" || e.startsAt <= new Date()) return [];
  const c = (await countsFor([e.id], tx)).get(e.id)!;
  let left = e.capacity - c.confirmedSeats;
  if (left <= 0) return [];
  const waiting = await tx.select().from(eventBookings)
    .where(and(eq(eventBookings.eventId, e.id), eq(eventBookings.status, "waitlist")))
    .orderBy(asc(eventBookings.id));
  const moved: EventBooking[] = [];
  for (const w of waiting) {
    if (w.seats > left) continue;
    const [row] = await tx.update(eventBookings).set({ status: "confirmed", promotedAt: new Date() })
      .where(eq(eventBookings.id, w.id)).returning();
    moved.push(row);
    left -= w.seats;
    if (left <= 0) break;
  }
  return moved;
}

/**
 * Promoted people need their own cancel link in the email, but only the hash of
 * their first one is stored. So each gets a new token, and the old link stops working.
 */
async function emailPromoted(req: Request, e: Event, moved: EventBooking[]) {
  for (const b of moved) {
    const token = randomBytes(24).toString("base64url");
    await db.update(eventBookings).set({ tokenHash: hash(token) }).where(eq(eventBookings.id, b.id));
    await sendTo(b.email, buildPromotedEmail(mailFor(req, e, b, token)));
    tellDaniel(`${b.name} moved up from the waiting list`, [`${frWhen(e.startsAt)} · ${b.seats} seat(s) · ${b.email}`], `${siteUrl(req)}/admin`);
  }
}

class BookingError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}

type BookResult = { booking: EventBooking; event: Event; token: string; already: boolean };

async function book(eventId: number, input: z.infer<typeof eventBookingInputSchema>, opts: { force?: boolean; allowClosed?: boolean } = {}): Promise<BookResult> {
  return db.transaction(async (tx) => {
    const e = await lockEvent(tx, eventId);
    if (!e) throw new BookingError("Cet atelier n'existe pas.", 404);
    if (e.startsAt <= new Date()) throw new BookingError("Cet atelier a déjà eu lieu.");
    if (!opts.allowClosed && e.status !== "open") throw new BookingError("Les réservations pour cet atelier sont fermées.");

    const email = norm(input.email);
    const [existing] = await tx.select().from(eventBookings)
      .where(and(eq(eventBookings.eventId, e.id), sql`lower(${eventBookings.email}) = ${email}`, ne(eventBookings.status, "cancelled")));
    if (existing) return { booking: existing, event: e, token: "", already: true };

    const c = (await countsFor([e.id], tx)).get(e.id)!;
    const fits = e.capacity - c.confirmedSeats >= input.seats;
    const token = randomBytes(24).toString("base64url");
    const [booking] = await tx.insert(eventBookings).values({
      eventId: e.id,
      name: input.name,
      email,
      company: input.company || null,
      seats: input.seats,
      status: fits || opts.force ? "confirmed" : "waitlist",
      tokenHash: hash(token),
      policyVersion: POLICY_VERSION,
    }).returning();
    return { booking, event: e, token, already: false };
  });
}

async function cancel(bookingId: number): Promise<{ booking: EventBooking; event: Event; moved: EventBooking[]; wasWaitlist: boolean } | null> {
  return db.transaction(async (tx) => {
    const [b] = await tx.select().from(eventBookings).where(eq(eventBookings.id, bookingId));
    if (!b) return null;
    const e = await lockEvent(tx, b.eventId);
    if (!e) return null;
    if (b.status === "cancelled") return { booking: b, event: e, moved: [], wasWaitlist: false };
    const [row] = await tx.update(eventBookings).set({ status: "cancelled", cancelledAt: new Date() })
      .where(eq(eventBookings.id, b.id)).returning();
    const moved = b.status === "confirmed" ? await promote(tx, e) : [];
    return { booking: row, event: e, moved, wasWaitlist: b.status === "waitlist" };
  });
}

/** Sends the right first email for a new booking. */
async function sendBookingEmail(req: Request, r: BookResult) {
  const m = mailFor(req, r.event, r.booking, r.token);
  if (r.booking.status === "confirmed") return sendTo(r.booking.email, buildConfirmedEmail(m));
  return sendTo(r.booking.email, buildWaitlistEmail({ ...m, position: await waitlistPosition(r.booking) }));
}

// ── Reminders ────────────────────────────────────────────────────────────────

/** Everyone confirmed for an evening that starts in the next 26 hours (and not in the next 2) gets one reminder. */
export async function sendReminders(baseUrl: string, now = new Date()) {
  const from = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const to = new Date(now.getTime() + 26 * 60 * 60 * 1000);
  const soon = await db.select().from(events)
    .where(and(gt(events.startsAt, from), lt(events.startsAt, to), inArray(events.status, ["open", "closed"])));
  for (const e of soon) {
    const due = await db.select().from(eventBookings)
      .where(and(eq(eventBookings.eventId, e.id), eq(eventBookings.status, "confirmed"), isNull(eventBookings.reminderSentAt)));
    for (const b of due) {
      // Claim the row first, so two overlapping runs can't both send.
      const claimed = await db.update(eventBookings).set({ reminderSentAt: new Date() })
        .where(and(eq(eventBookings.id, b.id), isNull(eventBookings.reminderSentAt))).returning({ id: eventBookings.id });
      if (!claimed.length) continue;
      const token = randomBytes(24).toString("base64url");
      await db.update(eventBookings).set({ tokenHash: hash(token) }).where(eq(eventBookings.id, b.id));
      await sendTo(b.email, buildReminderEmail({
        firstName: firstName(b.name), seats: b.seats, event: e,
        pageUrl: `${baseUrl}/${e.series}`, cancelUrl: `${baseUrl}/${e.series}/annuler?t=${token}`,
      }));
    }
  }
}

export function scheduleReminders() {
  const base = (process.env.PUBLIC_SITE_URL ?? "https://tutto.one").replace(/\/$/, "");
  const run = () => sendReminders(base).catch((e) => console.error("[events] reminders failed:", e));
  setTimeout(run, 90 * 1000);
  setInterval(run, 30 * 60 * 1000);
}

// ── Routes ───────────────────────────────────────────────────────────────────

/** A handful of bookings per address per hour. In memory, so it resets on restart. */
const recent = new Map<string, number[]>();
function tooMany(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < 60 * 60 * 1000);
  hits.push(now);
  recent.set(ip, hits);
  return hits.length > 10;
}

function fail(res: any, error: unknown, what: string) {
  if (error instanceof z.ZodError) return res.status(400).json({ error: error.errors[0]?.message ?? "Saisie invalide" });
  if (error instanceof BookingError) return res.status(error.status).json({ error: error.message });
  console.error(`[events] failed to ${what}:`, error);
  return res.status(500).json({ error: "Une erreur s'est produite. Réessayez, ou écrivez à daniel@tutto.one." });
}

async function bookingFromToken(t: unknown) {
  const token = z.string().min(20).max(100).parse(t);
  const [b] = await db.select().from(eventBookings).where(eq(eventBookings.tokenHash, hash(token)));
  return b ?? null;
}

const adminEventInput = z.object({
  series: z.string().trim().regex(/^[a-z0-9-]+$/).max(60),
  title: z.string().trim().min(1).max(200),
  note: z.string().trim().max(300).optional().nullable(),
  icon: z.enum(MODULE_ICONS as [ModuleIcon, ...ModuleIcon[]]).optional().nullable(),
  startsAt: z.coerce.date(),
  minutes: z.coerce.number().int().min(15).max(600).default(90),
  venue: z.string().trim().min(1).max(200),
  address: z.string().trim().min(1).max(300),
  capacity: z.coerce.number().int().min(1).max(500),
  status: z.enum(["open", "closed", "hidden", "cancelled"]),
});

export function registerEventRoutes(app: Express) {
  // Every evening in a series that hasn't finished, for the public page.
  app.get("/api/events/series/:series", async (req, res) => {
    try {
      const series = z.string().regex(/^[a-z0-9-]+$/).parse(req.params.series);
      const rows = await db.select().from(events)
        .where(and(eq(events.series, series), ne(events.status, "hidden"), gt(events.endsAt, new Date())))
        .orderBy(asc(events.startsAt));
      const counts = await countsFor(rows.map((e) => e.id));
      res.json({ series, maxSeats: MAX_SEATS_PER_BOOKING, events: rows.map((e) => publicEvent(e, counts.get(e.id)!)) });
    } catch (error) {
      fail(res, error, "list events");
    }
  });

  app.post("/api/events/:slug/book", async (req, res) => {
    try {
      if (tooMany(req.ip ?? "?")) return res.status(429).json({ error: "Trop de réservations depuis cette connexion. Réessayez dans une heure." });
      const input = eventBookingInputSchema.parse(req.body);
      const [e] = await db.select().from(events).where(eq(events.slug, String(req.params.slug)));
      if (!e || e.status === "hidden") throw new BookingError("Cet atelier n'existe pas.", 404);
      const r = await book(e.id, input);
      if (r.already) {
        return res.json({
          status: r.booking.status,
          already: true,
          position: r.booking.status === "waitlist" ? await waitlistPosition(r.booking) : null,
        });
      }
      const position = r.booking.status === "waitlist" ? await waitlistPosition(r.booking) : null;
      res.json({ status: r.booking.status, already: false, position });
      void sendBookingEmail(req, r);
      const c = (await countsFor([e.id])).get(e.id)!;
      tellDaniel(
        r.booking.status === "confirmed" ? `${r.booking.name} booked ${frWhen(e.startsAt)}` : `${r.booking.name} joined the waiting list for ${frWhen(e.startsAt)}`,
        [
          `${r.booking.email}${r.booking.company ? ` · ${r.booking.company}` : ""} · ${r.booking.seats} seat(s)`,
          `Now ${c.confirmedSeats}/${e.capacity} confirmed, ${c.waitlistBookings} on the waiting list.`,
        ],
        `${siteUrl(req)}/admin`,
      );
    } catch (error) {
      fail(res, error, "book");
    }
  });

  // What the cancel link shows before anyone presses the button. GET never changes
  // anything, because mail scanners open links on their own.
  app.get("/api/events/booking", async (req, res) => {
    try {
      const b = await bookingFromToken(req.query.t);
      if (!b) return res.status(404).json({ error: "Ce lien ne fonctionne plus. Il a peut-être été remplacé par celui d'un mail plus récent." });
      const [e] = await db.select().from(events).where(eq(events.id, b.eventId));
      const c = (await countsFor([e.id])).get(e.id)!;
      res.json({
        firstName: firstName(b.name),
        seats: b.seats,
        status: b.status,
        position: b.status === "waitlist" ? await waitlistPosition(b) : null,
        event: publicEvent(e, c),
      });
    } catch (error) {
      fail(res, error, "load a booking");
    }
  });

  app.post("/api/events/cancel", async (req, res) => {
    try {
      const b = await bookingFromToken(req.body?.t);
      if (!b) return res.status(404).json({ error: "Ce lien ne fonctionne plus. Il a peut-être été remplacé par celui d'un mail plus récent." });
      if (b.status === "cancelled") return res.json({ ok: true, status: "cancelled" });
      const r = await cancel(b.id);
      if (!r) return res.status(404).json({ error: "Réservation introuvable." });
      res.json({ ok: true, status: "cancelled" });
      const token = randomBytes(24).toString("base64url");
      void sendTo(b.email, buildCancelledEmail({ ...mailFor(req, r.event, b, token), wasWaitlist: r.wasWaitlist }));
      tellDaniel(
        r.wasWaitlist ? `${b.name} left the waiting list for ${frWhen(r.event.startsAt)}` : `${b.name} cancelled ${frWhen(r.event.startsAt)}`,
        [`${b.email} · ${b.seats} seat(s)`, r.moved.length ? `Moved up from the waiting list: ${r.moved.map((m) => m.name).join(", ")}` : "Nobody was waiting for the place."],
        `${siteUrl(req)}/admin`,
      );
      void emailPromoted(req, r.event, r.moved);
    } catch (error) {
      fail(res, error, "cancel");
    }
  });

  // ── Admin ──

  app.get("/api/admin/events", requireAdmin, async (_req, res) => {
    try {
      const rows = await db.select().from(events).orderBy(asc(events.startsAt));
      const counts = await countsFor(rows.map((e) => e.id));
      res.json(rows.map((e) => ({ ...e, ...counts.get(e.id)! })));
    } catch (error) {
      fail(res, error, "list events");
    }
  });

  app.post("/api/admin/events", requireAdmin, async (req, res) => {
    try {
      const i = adminEventInput.parse(req.body);
      const day = new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Paris" }).format(i.startsAt);
      let slug = `${i.series}-${day}`;
      const [taken] = await db.select({ id: events.id }).from(events).where(eq(events.slug, slug));
      if (taken) slug = `${slug}-${randomBytes(2).toString("hex")}`;
      const [row] = await db.insert(events).values({
        slug, series: i.series, title: i.title, note: i.note || null, icon: i.icon || null,
        startsAt: i.startsAt, endsAt: new Date(i.startsAt.getTime() + i.minutes * 60 * 1000),
        venue: i.venue, address: i.address, capacity: i.capacity, status: i.status,
      }).returning();
      res.json(row);
    } catch (error) {
      fail(res, error, "add an evening");
    }
  });

  // Edits an evening. More places, or reopening it, moves people up from the waiting list.
  app.patch("/api/admin/events/:id", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const i = adminEventInput.partial().parse(req.body);
      const r = await db.transaction(async (tx) => {
        const before = await lockEvent(tx, id);
        if (!before) return null;
        const startsAt = i.startsAt ?? before.startsAt;
        const minutes = i.minutes ?? Math.round((before.endsAt.getTime() - before.startsAt.getTime()) / 60000);
        const [after] = await tx.update(events).set({
          ...(i.title !== undefined && { title: i.title }),
          ...(i.note !== undefined && { note: i.note || null }),
          ...(i.icon !== undefined && { icon: i.icon || null }),
          ...(i.venue !== undefined && { venue: i.venue }),
          ...(i.address !== undefined && { address: i.address }),
          ...(i.capacity !== undefined && { capacity: i.capacity }),
          ...(i.status !== undefined && { status: i.status }),
          startsAt,
          endsAt: new Date(startsAt.getTime() + minutes * 60 * 1000),
        }).where(eq(events.id, id)).returning();
        return { after, moved: await promote(tx, after) };
      });
      if (!r) return res.status(404).json({ error: "Not found" });
      res.json({ ...r.after, moved: r.moved.map((m) => m.name) });
      void emailPromoted(req, r.after, r.moved);
    } catch (error) {
      fail(res, error, "update the evening");
    }
  });

  app.get("/api/admin/events/:id/bookings", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const rows = await db.select({
        id: eventBookings.id, name: eventBookings.name, email: eventBookings.email, company: eventBookings.company,
        seats: eventBookings.seats, status: eventBookings.status, promotedAt: eventBookings.promotedAt,
        reminderSentAt: eventBookings.reminderSentAt, cancelledAt: eventBookings.cancelledAt, createdAt: eventBookings.createdAt,
      }).from(eventBookings).where(eq(eventBookings.eventId, id)).orderBy(asc(eventBookings.id));
      res.json(rows);
    } catch (error) {
      fail(res, error, "list bookings");
    }
  });

  // For people who booked by email or phone. `force` gives them a place even when it's full.
  app.post("/api/admin/events/:id/bookings", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const { force, notify, ...rest } = z.object({ force: z.boolean().default(false), notify: z.boolean().default(true) })
        .merge(eventBookingInputSchema).parse(req.body);
      const r = await book(id, rest, { force, allowClosed: true });
      if (r.already) return res.status(409).json({ error: `${r.booking.email} is already ${r.booking.status === "waitlist" ? "on the waiting list" : "booked"} for this evening.` });
      res.json({ status: r.booking.status });
      if (notify) void sendBookingEmail(req, r);
    } catch (error) {
      fail(res, error, "add the booking");
    }
  });

  app.post("/api/admin/bookings/:id/cancel", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const { notify } = z.object({ notify: z.boolean().default(true) }).parse(req.body ?? {});
      const r = await cancel(id);
      if (!r) return res.status(404).json({ error: "Not found" });
      res.json({ ok: true, moved: r.moved.map((m) => m.name) });
      if (notify) {
        const token = randomBytes(24).toString("base64url");
        void sendTo(r.booking.email, buildCancelledEmail({ ...mailFor(req, r.event, r.booking, token), wasWaitlist: r.wasWaitlist }));
      }
      void emailPromoted(req, r.event, r.moved);
    } catch (error) {
      fail(res, error, "cancel the booking");
    }
  });

  // Lets someone in from the waiting list even though the evening is full.
  app.post("/api/admin/bookings/:id/confirm", requireAdmin, async (req, res) => {
    try {
      const id = z.coerce.number().int().parse(req.params.id);
      const [row] = await db.update(eventBookings).set({ status: "confirmed", promotedAt: new Date() })
        .where(and(eq(eventBookings.id, id), eq(eventBookings.status, "waitlist"))).returning();
      if (!row) return res.status(404).json({ error: "That booking isn't on the waiting list." });
      const [e] = await db.select().from(events).where(eq(events.id, row.eventId));
      res.json({ ok: true });
      void emailPromoted(req, e, [row]);
    } catch (error) {
      fail(res, error, "confirm the booking");
    }
  });
}
