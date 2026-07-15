import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean as pgBoolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const contactSubmissions = pgTable("contact_submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertContactSubmissionSchema = createInsertSchema(contactSubmissions).pick({
  name: true,
  email: true,
  message: true,
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
