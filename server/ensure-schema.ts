/**
 * Additive schema changes the production database has to have before the
 * routes that use them can work.
 *
 * The Replit deploy builds and runs the app but never runs `npm run db:push`,
 * so a column added to shared/schema.ts reaches the code and not the table.
 * Drizzle names every column in an insert, so one missing column fails every
 * insert into that table — which is how trainer_code took down both enquiry
 * forms (/contact and /praxis-programme) with a 500.
 *
 * Every statement here is idempotent and additive only. Nothing is dropped or
 * altered in place; that still needs a deliberate db:push.
 */
import { sql } from "drizzle-orm";
import { db } from "./db";

export async function ensureSchema(): Promise<void> {
  await db.execute(
    sql`ALTER TABLE contact_submissions ADD COLUMN IF NOT EXISTS trainer_code text`,
  );
}
