/**
 * The Rieuzal evenings, so /rieuzal is bookable the moment the site is published.
 *
 * Runs at boot and only inserts an evening whose slug isn't there yet, so once
 * it exists it belongs to the admin: a date moved or a theme rewritten there is
 * never undone by a restart. New evenings go in through the admin, not here.
 *
 * Times carry their own UTC offset. France changes clocks on 25 October 2026
 * and 28 March 2027.
 */
import { and, eq, inArray, isNull, ne, notInArray } from "drizzle-orm";
import { db } from "./db";
import { eventBookings, events } from "@shared/schema";
import type { ModuleIcon } from "@shared/learn-programmes";

const VENUE = "Manoir de Rieuzal";
const ADDRESS = "370 Chemin de Rieuzal, 46130 Loubressac";

type SeedEvent = { date: string; icon: ModuleIcon; offset: string; title: string; note: string; status?: "open" | "hidden" };

// The six ateliers announced on the poster (22 October 2026). Daniel plans six at a
// time, so this list is the whole public programme: any other Rieuzal row is hidden
// below. Every atelier works with Mistral, then takes one theme. February is left
// out for the zone C school holidays (6 to 22 February 2027).
const RIEUZAL: SeedEvent[] = [
  { date: "2026-11-24", icon: "terminal", offset: "+01:00", title: "Un dossier pour que l'agent travaille seul", note: "Préparer un dossier de travail pour qu'un agent Mistral avance sans vous" },
  { date: "2026-12-10", icon: "gear", offset: "+01:00", title: "Une machine toujours allumée", note: "Ordinateur ou serveur : où faire tourner vos agents" },
  { date: "2027-01-12", icon: "magnifier", offset: "+01:00", title: "La sécurité", note: "Ce que l'agent peut voir, faire et envoyer" },
  { date: "2027-01-28", icon: "rules", offset: "+01:00", title: "Votre charte IA", note: "Les règles de votre entreprise pour l'IA" },
  { date: "2027-03-02", icon: "scorecard", offset: "+01:00", title: "Une grille pour vos agents", note: "Noter le travail de vos agents" },
  { date: "2027-03-18", icon: "pencil", offset: "+01:00", title: "Vos agents, comme des sous-traitants", note: "Les briefer, les suivre et vérifier leur travail" },
];

/** The 22 October plan replaced every theme. Rows still showing one of these get the new one. */
const OLD_THEMES: Record<string, string> = {
  "2026-11-24": "Les règles d'abord",
  "2026-12-10": "C'est quoi, un bon travail ?",
  "2027-01-28": "Briefer une fois pour toutes",
};

/** The 12 November launch moved to 24 November, which already had its own row. Its bookings move across. */
const MERGED = { from: "2026-11-12", to: "2026-11-24" };

/** Evenings whose date changed after they were seeded. The launch went from 5 to 12 November. */
const MOVED = [{ from: "2026-11-05", to: "2026-11-12", offset: "+01:00" }];

/** What the first seed wrote, before each evening had a theme. Rows still showing it get their theme. */
const UNTHEMED = [
  { title: "Soirée IA avec Mistral", note: null },
  { title: "Soirée IA avec Mistral", note: "Soirée bonus" },
  { title: "Le Chonk : Mistral Large 4 en direct", note: "La soirée de lancement" },
];

export async function seedEvents(): Promise<void> {
  // Moves the row, and anyone booked on it, but only while it still has the seeded
  // time and nothing sits on the new date, so a date Daniel set in admin stays.
  for (const m of MOVED) {
    const [taken] = await db.select({ id: events.id }).from(events).where(eq(events.slug, `rieuzal-${m.to}`));
    if (taken) continue;
    const done = await db.update(events).set({
      slug: `rieuzal-${m.to}`,
      startsAt: new Date(`${m.to}T18:30:00${m.offset}`),
      endsAt: new Date(`${m.to}T20:00:00${m.offset}`),
    }).where(and(eq(events.slug, `rieuzal-${m.from}`), eq(events.startsAt, new Date(`${m.from}T18:30:00${m.offset}`))))
      .returning({ id: events.id });
    if (done.length) console.log(`[events] moved rieuzal-${m.from} to ${m.to}`);
  }

  const existing = new Set((await db.select({ slug: events.slug }).from(events)).map((e) => e.slug));

  // The first boot with the six-atelier plan (12 January isn't there yet) moves the
  // 12 November bookings to the 24th and hides every Rieuzal row outside the six.
  // It runs once, so a row Daniel reopens in admin later stays open.
  if (!existing.has("rieuzal-2027-01-12")) await switchToSix();

  const missing = RIEUZAL
    .map((e) => ({
      slug: `rieuzal-${e.date}`,
      series: "rieuzal",
      title: e.title,
      note: e.note,
      icon: e.icon,
      startsAt: new Date(`${e.date}T18:30:00${e.offset}`),
      endsAt: new Date(`${e.date}T20:00:00${e.offset}`),
      venue: VENUE,
      address: ADDRESS,
      capacity: 15,
      status: e.status ?? "open",
    }))
    .filter((e) => !existing.has(e.slug));
  if (missing.length) {
    await db.insert(events).values(missing);
    console.log(`[events] added ${missing.length} Rieuzal evenings`);
  }

  for (const e of RIEUZAL) {
    const old = OLD_THEMES[e.date];
    if (!old) continue;
    const done = await db.update(events).set({ title: e.title, note: e.note, icon: e.icon })
      .where(and(eq(events.slug, `rieuzal-${e.date}`), eq(events.title, old)))
      .returning({ id: events.id });
    if (done.length) console.log(`[events] gave rieuzal-${e.date} its new theme`);
  }

  // Evenings seeded before they had themes. Only touched while they still show the
  // old seed text, so anything Daniel has written in admin stays.
  for (const e of RIEUZAL) {
    for (const old of UNTHEMED) {
      const done = await db.update(events).set({ title: e.title, note: e.note })
        .where(and(
          eq(events.slug, `rieuzal-${e.date}`),
          eq(events.title, old.title),
          old.note === null ? isNull(events.note) : eq(events.note, old.note),
        ))
        .returning({ id: events.id });
      if (done.length) console.log(`[events] gave rieuzal-${e.date} its theme`);
    }
    // Icons came after themes: fill in any evening that has none yet.
    await db.update(events).set({ icon: e.icon })
      .where(and(eq(events.slug, `rieuzal-${e.date}`), isNull(events.icon)));
  }
}

async function switchToSix(): Promise<void> {
  const [from] = await db.select({ id: events.id }).from(events).where(eq(events.slug, `rieuzal-${MERGED.from}`));
  const [to] = await db.select({ id: events.id }).from(events).where(eq(events.slug, `rieuzal-${MERGED.to}`));
  if (from && to) {
    // Skip anyone already booked on the 24th, so nobody ends up with two bookings.
    const already = (await db.select({ email: eventBookings.email }).from(eventBookings)
      .where(and(eq(eventBookings.eventId, to.id), ne(eventBookings.status, "cancelled")))).map((b) => b.email);
    const moved = await db.update(eventBookings).set({ eventId: to.id })
      .where(and(eq(eventBookings.eventId, from.id), ne(eventBookings.status, "cancelled"),
        already.length ? notInArray(eventBookings.email, already) : undefined))
      .returning({ id: eventBookings.id });
    if (moved.length) console.log(`[events] moved ${moved.length} bookings from rieuzal-${MERGED.from} to ${MERGED.to}`);
  }
  const keep = RIEUZAL.map((e) => `rieuzal-${e.date}`);
  const hidden = await db.update(events).set({ status: "hidden" })
    .where(and(eq(events.series, "rieuzal"), notInArray(events.slug, keep), inArray(events.status, ["open", "closed"])))
    .returning({ slug: events.slug });
  if (hidden.length) console.log(`[events] hid ${hidden.length} Rieuzal evenings outside the six: ${hidden.map((h) => h.slug).join(", ")}`);
}
