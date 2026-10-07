/**
 * The first three cohorts, so /learn has them the moment the site is
 * published, with no shell work on Replit.
 *
 * Runs at boot and only inserts a cohort whose slug isn't there yet, so once
 * a cohort exists it belongs to the admin: edits made there are never undone
 * by a restart. New cohorts go in through the admin, not here.
 *
 * Times carry their own UTC offset. Italy, France and the UK all change clocks
 * on 25 October 2026, which is why the offsets change part-way through.
 */
import { eq } from "drizzle-orm";
import { db } from "./db";
import { cohorts, cohortSessions, students } from "@shared/schema";

type SeedSession = { module: number | null; start: string; spare?: boolean };
type SeedCohort = {
  slug: string;
  name: string;
  organisation: string | null;
  programmeKey: string;
  timezone: string;
  sessionMinutes: number;
  meetUrl: string | null;
  status: "draft" | "active";
  sessions: SeedSession[];
  students: { name: string; email: string }[];
};

const SEED: SeedCohort[] = [
  {
    // Quote 00103, signed 6 October 2026; INV-0005 due 13 October. Draft (read-only
    // dashboard) until it's paid, then set to active in admin. Wednesdays 10:00 to 11:00 Milan time.
    slug: "background-italia-2026",
    name: "Background Italia",
    organisation: "Background Italia S.r.l.",
    programmeKey: "background-italia",
    timezone: "Europe/Rome",
    sessionMinutes: 60,
    meetUrl: "https://meet.google.com/epd-krnx-ujn",
    status: "draft",
    sessions: [
      { module: 1, start: "2026-10-14T10:00:00+02:00" },
      { module: 2, start: "2026-10-21T10:00:00+02:00" },
      { module: 3, start: "2026-10-28T10:00:00+01:00" },
      { module: 4, start: "2026-11-04T10:00:00+01:00" },
      { module: 5, start: "2026-11-11T10:00:00+01:00" },
      { module: 6, start: "2026-11-18T10:00:00+01:00" },
      { module: 7, start: "2026-11-25T10:00:00+01:00" },
      { module: 8, start: "2026-12-02T10:00:00+01:00" },
      { module: null, start: "2026-12-09T10:00:00+01:00", spare: true },
      { module: null, start: "2026-12-16T10:00:00+01:00", spare: true },
    ],
    students: [
      { name: "Alice Cappiello", email: "alice@backgrounditalia.it" },
      { name: "Veronica Pirovano", email: "veronica@backgrounditalia.it" },
      { name: "Manuela Vanotti", email: "manuela@backgrounditalia.it" },
      { name: "Gabriel Prieto", email: "gabriel@backgrounditalia.it" },
      { name: "Riccardo Pezzoli", email: "riccardo@backgrounditalia.it" },
    ],
  },
  {
    // Paid through Stripe on 30 September 2026. Fortnightly Mondays, 17:00 Paris (16:00 UK).
    slug: "alex-boshoff-2026",
    name: "Alex Boshoff",
    organisation: null,
    programmeKey: "solo-fast-track",
    timezone: "Europe/London",
    sessionMinutes: 90,
    meetUrl: "https://meet.google.com/pbs-taaa-pud",
    status: "active",
    sessions: [
      { module: 1, start: "2026-10-12T17:00:00+02:00" },
      { module: 2, start: "2026-10-26T17:00:00+01:00" },
      { module: 3, start: "2026-11-09T17:00:00+01:00" },
      { module: 4, start: "2026-11-23T17:00:00+01:00" },
    ],
    students: [{ name: "Alex Boshoff", email: "aboshoff@me.com" }],
  },
  {
    // Quote QUO0013536, sent 7 October 2026 and not yet signed. Draft until it's
    // signed and paid: a draft cohort can't be invited and its dashboard is read-only.
    slug: "health-science-academy-2026",
    name: "Health Science Academy",
    organisation: "Health Science Academy",
    programmeKey: "ai-fluent-team",
    timezone: "Africa/Johannesburg",
    sessionMinutes: 90,
    meetUrl: null,
    status: "draft",
    sessions: [],
    students: [{ name: "Christine Venter", email: "christinev@healthscience.co.za" }],
  },
];

export async function seedLearnCohorts(): Promise<void> {
  for (const c of SEED) {
    const [existing] = await db.select({ id: cohorts.id }).from(cohorts).where(eq(cohorts.slug, c.slug));
    if (existing) continue;

    const [cohort] = await db.insert(cohorts).values({
      slug: c.slug,
      name: c.name,
      organisation: c.organisation,
      programmeKey: c.programmeKey,
      timezone: c.timezone,
      sessionMinutes: c.sessionMinutes,
      meetUrl: c.meetUrl,
      status: c.status,
    }).returning();

    if (c.sessions.length) {
      await db.insert(cohortSessions).values(c.sessions.map((s) => {
        const startsAt = new Date(s.start);
        return {
          cohortId: cohort.id,
          moduleNumber: s.module,
          startsAt,
          endsAt: new Date(startsAt.getTime() + c.sessionMinutes * 60 * 1000),
          isSpare: !!s.spare,
        };
      }));
    }
    if (c.students.length) {
      await db.insert(students).values(c.students.map((s) => ({ ...s, cohortId: cohort.id })));
    }
    console.log(`[learn] seeded cohort ${c.slug}`);
  }
}
