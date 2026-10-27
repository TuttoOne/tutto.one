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

/**
 * The /learn tables. Created here rather than by db:push for the same reason
 * as the column above: nothing else would create them in production.
 */
export async function ensureLearnSchema(): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS cohorts (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug text NOT NULL UNIQUE,
    name text NOT NULL,
    organisation text,
    programme_key text NOT NULL,
    timezone text NOT NULL DEFAULT 'Europe/London',
    session_minutes integer NOT NULL DEFAULT 90,
    meet_url text,
    language text NOT NULL DEFAULT 'en',
    status text NOT NULL DEFAULT 'draft',
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS cohort_sessions (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cohort_id integer NOT NULL,
    module_number integer,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    title_override text,
    status text NOT NULL DEFAULT 'scheduled',
    is_spare boolean NOT NULL DEFAULT false
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS students (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    cohort_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    job_title text,
    linkedin_url text,
    background text,
    current_accounts text,
    task_to_bring text,
    setup_notes text,
    alt_contact_name text,
    alt_contact_email text,
    alt_contact_phone text,
    about_blurb text,
    invited_at timestamp,
    profile_completed_at timestamp,
    last_login_at timestamp,
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS students_cohort_email_idx ON students (cohort_id, email)`,
  );
  await db.execute(sql`CREATE TABLE IF NOT EXISTS student_progress (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id integer NOT NULL,
    module_number integer NOT NULL,
    status text NOT NULL DEFAULT 'not_started',
    practice_note text,
    updated_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS student_progress_student_module_idx ON student_progress (student_id, module_number)`,
  );
  // Use case cards were saved to the server for a few hours on 7 October 2026. Under the
  // data policy the tools keep work in the browser and we only hold what is shared, so
  // that table goes. Safe to remove this line once it has run in production.
  await db.execute(sql`DROP TABLE IF EXISTS use_case_cards`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS shared_records (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    tool text NOT NULL,
    title text NOT NULL DEFAULT '',
    data jsonb NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    organisation text,
    note text,
    student_id integer,
    policy_version text NOT NULL,
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS shared_records_email_idx ON shared_records (email)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS shared_records_student_idx ON shared_records (student_id)`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS deletion_log (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reference text NOT NULL UNIQUE,
    subject_hash text,
    reason text NOT NULL,
    counts jsonb NOT NULL,
    note text,
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS policy_version text`);
  await db.execute(sql`ALTER TABLE students ADD COLUMN IF NOT EXISTS policy_accepted_at timestamp`);
  await db.execute(sql`ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS retain_until timestamp`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS login_tokens (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id integer NOT NULL,
    token_hash text NOT NULL UNIQUE,
    expires_at timestamp NOT NULL,
    used_at timestamp
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS student_mailings (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    student_id integer NOT NULL,
    mailing text NOT NULL,
    sent_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(
    sql`CREATE UNIQUE INDEX IF NOT EXISTS student_mailings_student_mailing_idx ON student_mailings (student_id, mailing)`,
  );
}

/** The event tables (/rieuzal and any later series). */
export async function ensureEventsSchema(): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS events (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    slug text NOT NULL UNIQUE,
    series text NOT NULL,
    title text NOT NULL,
    note text,
    starts_at timestamptz NOT NULL,
    ends_at timestamptz NOT NULL,
    venue text NOT NULL,
    address text NOT NULL,
    capacity integer NOT NULL DEFAULT 15,
    status text NOT NULL DEFAULT 'open',
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS event_bookings (
    id integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    event_id integer NOT NULL,
    name text NOT NULL,
    email text NOT NULL,
    company text,
    seats integer NOT NULL DEFAULT 1,
    status text NOT NULL,
    token_hash text NOT NULL UNIQUE,
    policy_version text NOT NULL,
    promoted_at timestamp,
    reminder_sent_at timestamp,
    cancelled_at timestamp,
    created_at timestamp NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`ALTER TABLE events ADD COLUMN IF NOT EXISTS icon text`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS event_bookings_event_idx ON event_bookings (event_id)`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS event_bookings_email_idx ON event_bookings (email)`);
}

/** The Pocket Praxis account tables (/pocket-praxis). Emails are stored lowercased. */
export async function ensurePocketSchema(): Promise<void> {
  await db.execute(sql`CREATE TABLE IF NOT EXISTS pocket_users (
    id bigserial PRIMARY KEY,
    email text NOT NULL UNIQUE,
    name text,
    created_at timestamptz NOT NULL DEFAULT now(),
    last_seen_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS pocket_login_codes (
    id bigserial PRIMARY KEY,
    email text NOT NULL,
    code_hmac bytea NOT NULL,
    expires_at timestamptz NOT NULL,
    attempts integer NOT NULL DEFAULT 0,
    created_at timestamptz NOT NULL DEFAULT now()
  )`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pocket_login_codes_email_idx ON pocket_login_codes (email)`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS pocket_sessions (
    token_hash bytea PRIMARY KEY,
    user_id bigint NOT NULL REFERENCES pocket_users(id) ON DELETE CASCADE,
    created_at timestamptz NOT NULL DEFAULT now(),
    expires_at timestamptz NOT NULL
  )`);
  await db.execute(sql`CREATE INDEX IF NOT EXISTS pocket_sessions_user_idx ON pocket_sessions (user_id)`);
  await db.execute(sql`CREATE TABLE IF NOT EXISTS pocket_progress (
    user_id bigint PRIMARY KEY REFERENCES pocket_users(id) ON DELETE CASCADE,
    data jsonb NOT NULL,
    updated_at timestamptz NOT NULL DEFAULT now()
  )`);
}
