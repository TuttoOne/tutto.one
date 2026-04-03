import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";
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
