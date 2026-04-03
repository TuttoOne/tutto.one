import { db } from "./db";
import {
  type ContactSubmission, type InsertContactSubmission, contactSubmissions,
  type EmailLead, type InsertEmailLead, emailLeads,
} from "@shared/schema";

export interface IStorage {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createEmailLead(lead: InsertEmailLead): Promise<EmailLead>;
  getAllEmailLeads(): Promise<EmailLead[]>;
}

export class DatabaseStorage implements IStorage {
  async createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission> {
    const [result] = await db.insert(contactSubmissions).values(submission).returning();
    return result;
  }

  async getAllContactSubmissions(): Promise<ContactSubmission[]> {
    return await db.select().from(contactSubmissions).orderBy(contactSubmissions.createdAt);
  }

  async createEmailLead(lead: InsertEmailLead): Promise<EmailLead> {
    const [result] = await db.insert(emailLeads).values(lead).returning();
    return result;
  }

  async getAllEmailLeads(): Promise<EmailLead[]> {
    return await db.select().from(emailLeads).orderBy(emailLeads.createdAt);
  }
}

export const storage = new DatabaseStorage();
