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
import { and, eq, isNull } from "drizzle-orm";
import { db } from "./db";
import { events } from "@shared/schema";

const VENUE = "Manoir de Rieuzal";
const ADDRESS = "370 Chemin de Rieuzal, 46130 Loubressac";

type SeedEvent = { date: string; offset: string; title: string; note: string; status?: "open" | "hidden" };

// Each evening starts with the same foundations (setting up Mistral, what an agent
// is) and then has its own theme and one task done live, following the Praxis
// programme in order, with two evenings for particular jobs (accounts, front desk
// and sales). Guests are not announced yet, so no evening names one.
const RIEUZAL: SeedEvent[] = [
  { date: "2026-11-05", offset: "+01:00", title: "Le Chonk : Mistral Large 4 en direct", note: "On installe Mistral et on crée un premier agent" },
  { date: "2026-11-24", offset: "+01:00", title: "Les règles d'abord", note: "On écrit la charte IA de votre entreprise" },
  { date: "2026-12-10", offset: "+01:00", title: "C'est quoi, un bon travail ?", note: "Une grille pour juger ce que l'IA produit" },
  // A bonus evening Daniel is keeping in reserve. Hidden until he opens it in admin.
  { date: "2026-12-15", offset: "+01:00", title: "Soirée bonus", note: "Vos questions, sur vos tâches", status: "hidden" },
  { date: "2027-01-14", offset: "+01:00", title: "Que confier à l'IA ?", note: "La liste de ce qu'on lui confie, et de ce qu'on garde" },
  { date: "2027-01-28", offset: "+01:00", title: "Briefer une fois pour toutes", note: "Des instructions permanentes pour vos tâches qui reviennent" },
  { date: "2027-02-04", offset: "+01:00", title: "Mistral relié à vos outils", note: "Vos fichiers, vos mails et votre agenda" },
  { date: "2027-02-25", offset: "+01:00", title: "Vérifier avant d'envoyer", note: "Relire, noter et valider le travail de l'IA" },
  { date: "2027-03-11", offset: "+01:00", title: "La compta avec Mistral", note: "Une vraie tâche comptable, en direct" },
  { date: "2027-03-25", offset: "+01:00", title: "Accueil et commercial", note: "Devis, relances et réponses aux clients" },
  { date: "2027-04-22", offset: "+02:00", title: "Automatiser", note: "Des tâches qui tournent toutes seules" },
  { date: "2027-05-04", offset: "+02:00", title: "Votre premier agent, et le garder en main", note: "Un agent sur vos données, et comment le faire évoluer" },
];

/** What the first seed wrote, before each evening had a theme. Rows still showing it get their theme. */
const UNTHEMED = [
  { title: "Soirée IA avec Mistral", note: null },
  { title: "Soirée IA avec Mistral", note: "Soirée bonus" },
  { title: "Le Chonk : Mistral Large 4 en direct", note: "La soirée de lancement" },
];

export async function seedEvents(): Promise<void> {
  const existing = new Set((await db.select({ slug: events.slug }).from(events)).map((e) => e.slug));
  const missing = RIEUZAL
    .map((e) => ({
      slug: `rieuzal-${e.date}`,
      series: "rieuzal",
      title: e.title,
      note: e.note,
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
  }
}
