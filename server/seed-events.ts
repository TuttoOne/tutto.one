/**
 * The Rieuzal evenings, so /rieuzal is bookable the moment the site is published.
 *
 * Runs at boot and only inserts an evening whose slug isn't there yet, so once
 * it exists it belongs to the admin: a date moved or a guest added there is
 * never undone by a restart. New evenings go in through the admin, not here.
 *
 * Times carry their own UTC offset. France changes clocks on 25 October 2026
 * and 28 March 2027.
 */
import { db } from "./db";
import { events } from "@shared/schema";

const VENUE = "Manoir de Rieuzal";
const ADDRESS = "370 Chemin de Rieuzal, 46130 Loubressac";

type SeedEvent = { date: string; offset: string; title?: string; note?: string; status?: "open" | "hidden" };

const RIEUZAL: SeedEvent[] = [
  { date: "2026-11-05", offset: "+01:00", title: "Le Chonk : Mistral Large 4 en direct", note: "La soirée de lancement" },
  { date: "2026-11-24", offset: "+01:00" },
  { date: "2026-12-10", offset: "+01:00" },
  // A bonus evening Daniel is keeping in reserve. Hidden until he opens it in admin.
  { date: "2026-12-15", offset: "+01:00", note: "Soirée bonus", status: "hidden" },
  { date: "2027-01-14", offset: "+01:00" },
  { date: "2027-01-28", offset: "+01:00" },
  { date: "2027-02-04", offset: "+01:00" },
  { date: "2027-02-25", offset: "+01:00" },
  { date: "2027-03-11", offset: "+01:00" },
  { date: "2027-03-25", offset: "+01:00" },
  { date: "2027-04-22", offset: "+02:00" },
  { date: "2027-05-04", offset: "+02:00" },
];

export async function seedEvents(): Promise<void> {
  const existing = new Set((await db.select({ slug: events.slug }).from(events)).map((e) => e.slug));
  const missing = RIEUZAL
    .map((e) => ({
      slug: `rieuzal-${e.date}`,
      series: "rieuzal",
      title: e.title ?? "Soirée IA avec Mistral",
      note: e.note ?? null,
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
}
