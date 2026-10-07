import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean as pgBoolean, uniqueIndex, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  /**
   * The trainer whose link brought this visitor in, if any.
   *
   * Nullable on purpose: no code means the client is Tutto-sourced, which is
   * the rule the trainer split turns on. It is the enquiry's attribution, not
   * the booking's — bookings live in Cal.com — so a sale is still matched back
   * to this row by email.
   */
  trainerCode: text("trainer_code"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// `.pick()` drops anything not listed here silently, so a field added to the
// form but forgotten below posts fine and vanishes.
export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
  trainerCode: true,
});

export type InsertContactSubmission = z.infer<typeof insertContactSubmissionSchema>;
export type ContactSubmission = typeof contactSubmissions.$inferSelect;

export const emailLeads = pgTable("email_leads", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: text("email").notNull(),
  source: text("source").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertEmailLeadSchema = createInsertSchema(emailLeads).pick({
  email: true,
  source: true,
}).extend({
  email: z.string().email(),
});

export type InsertEmailLead = z.infer<typeof insertEmailLeadSchema>;
export type EmailLead = typeof emailLeads.$inferSelect;

export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  date: text("date").notNull(),
  readTime: text("read_time").notNull(),
  content: text("content").notNull(),
  introCard: text("intro_card"),
  published: pgBoolean("published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

const introCardRefinement = (data: { introCard?: string | null }, ctx: z.RefinementCtx) => {
  if (data.introCard) {
    try {
      JSON.parse(data.introCard);
    } catch {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ["introCard"], message: "introCard must be valid JSON" });
    }
  }
};

const baseBlogPostSchema = createInsertSchema(blogPosts).omit({ createdAt: true });

export const insertBlogPostSchema = baseBlogPostSchema.superRefine(introCardRefinement);
export const updateBlogPostSchema = baseBlogPostSchema.partial().omit({ slug: true }).superRefine(introCardRefinement);

export type InsertBlogPost = z.infer<typeof insertBlogPostSchema>;
export type UpdateBlogPost = z.infer<typeof updateBlogPostSchema>;
export type BlogPost = typeof blogPosts.$inferSelect;

export const adminConfig = pgTable("admin_config", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  passwordHash: text("password_hash").notNull(),
  totpSecret: text("totp_secret"),
  isSetupComplete: pgBoolean("is_setup_complete").notNull().default(false),
});

export type AdminConfig = typeof adminConfig.$inferSelect;

export const siteContent = pgTable("site_content", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type SiteContent = typeof siteContent.$inferSelect;

export const conversations = pgTable("conversations", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const messages = pgTable("messages", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  conversationId: integer("conversation_id").notNull(),
  role: text("role").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ── Learn: cohorts, students and their progress ──────────────────────────────
//
// The modules themselves are not in the database. They live in
// shared/learn-programmes.ts, keyed by `programmeKey`, so the copy is edited
// like the rest of the site. A cohort only carries what is particular to one
// client: its dates, its timezone, its call link.
//
// Deploys don't run db:push, so every table here is also created in
// server/ensure-schema.ts.

export const cohorts = pgTable("cohorts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  organisation: text("organisation"),
  programmeKey: text("programme_key").notNull(),
  timezone: text("timezone").notNull().default("Europe/London"),
  sessionMinutes: integer("session_minutes").notNull().default(90),
  meetUrl: text("meet_url"),
  language: text("language").notNull().default("en"),
  /** draft: set up, nobody contacted yet. active: running. done: finished. */
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Cohort = typeof cohorts.$inferSelect;

export const cohortSessions = pgTable("cohort_sessions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cohortId: integer("cohort_id").notNull(),
  /** Which module this session teaches. Null for a spare date. */
  moduleNumber: integer("module_number"),
  startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
  endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
  /** The client's own wording for this session, if it differs from the programme's. */
  titleOverride: text("title_override"),
  /** scheduled, done or moved. */
  status: text("status").notNull().default("scheduled"),
  isSpare: pgBoolean("is_spare").notNull().default(false),
});

export type CohortSession = typeof cohortSessions.$inferSelect;

export const students = pgTable("students", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  cohortId: integer("cohort_id").notNull(),
  name: text("name").notNull(),
  /** Stored lower-case. Unique within a cohort, so one person can join two. */
  email: text("email").notNull(),
  jobTitle: text("job_title"),
  linkedinUrl: text("linkedin_url"),
  background: text("background"),
  currentAccounts: text("current_accounts"),
  taskToBring: text("task_to_bring"),
  setupNotes: text("setup_notes"),
  altContactName: text("alt_contact_name"),
  altContactEmail: text("alt_contact_email"),
  altContactPhone: text("alt_contact_phone"),
  /** Written by us after reading the profile. Never shown to other students. */
  aboutBlurb: text("about_blurb"),
  invitedAt: timestamp("invited_at"),
  profileCompletedAt: timestamp("profile_completed_at"),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("students_cohort_email_idx").on(t.cohortId, t.email)]);

export type Student = typeof students.$inferSelect;

/** What a student may change about themselves. Everything else is ours. */
export const studentProfileSchema = z.object({
  name: z.string().trim().min(1).max(200),
  jobTitle: z.string().trim().max(200).optional().default(""),
  linkedinUrl: z.string().trim().max(500).optional().default(""),
  background: z.string().trim().max(5000).optional().default(""),
  currentAccounts: z.string().trim().max(1000).optional().default(""),
  taskToBring: z.string().trim().max(3000).optional().default(""),
  setupNotes: z.string().trim().max(2000).optional().default(""),
  altContactName: z.string().trim().max(200).optional().default(""),
  altContactEmail: z.string().trim().max(200).optional().default(""),
  altContactPhone: z.string().trim().max(100).optional().default(""),
});

export type StudentProfile = z.infer<typeof studentProfileSchema>;

export const studentProgress = pgTable("student_progress", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id").notNull(),
  moduleNumber: integer("module_number").notNull(),
  /** not_started, in_progress or done. */
  status: text("status").notNull().default("not_started"),
  practiceNote: text("practice_note"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [uniqueIndex("student_progress_student_module_idx").on(t.studentId, t.moduleNumber)]);

export type StudentProgress = typeof studentProgress.$inferSelect;

/**
 * A student's use case cards: each one is a whole scoping worksheet
 * (client/public/courses/trainer/scoping-worksheet.html), saved as the page keeps it.
 * `title` is the card's sentence, or the task, so lists don't have to open the JSON.
 */
export const useCaseCards = pgTable("use_case_cards", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id").notNull(),
  title: text("title").notNull().default(""),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
}, (t) => [index("use_case_cards_student_idx").on(t.studentId)]);

export type UseCaseCard = typeof useCaseCards.$inferSelect;

export const loginTokens = pgTable("login_tokens", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  studentId: integer("student_id").notNull(),
  /** sha256 of the token in the link. The token itself is never stored. */
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  usedAt: timestamp("used_at"),
});
