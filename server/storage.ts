import { db } from "./db";
import { eq } from "drizzle-orm";
import {
  type ContactSubmission, type InsertContactSubmission, contactSubmissions,
  type EmailLead, type InsertEmailLead, emailLeads,
  type BlogPost, type InsertBlogPost, type UpdateBlogPost, blogPosts,
  type AdminConfig, adminConfig,
  type SiteContent, siteContent,
} from "@shared/schema";

export interface IStorage {
  createContactSubmission(submission: InsertContactSubmission): Promise<ContactSubmission>;
  getAllContactSubmissions(): Promise<ContactSubmission[]>;
  createEmailLead(lead: InsertEmailLead): Promise<EmailLead>;
  getAllEmailLeads(): Promise<EmailLead[]>;
  // Blog
  getAllBlogPosts(publishedOnly?: boolean): Promise<BlogPost[]>;
  getBlogPostBySlug(slug: string): Promise<BlogPost | undefined>;
  createBlogPost(post: InsertBlogPost): Promise<BlogPost>;
  updateBlogPost(slug: string, post: UpdateBlogPost): Promise<BlogPost | undefined>;
  deleteBlogPost(slug: string): Promise<boolean>;
  getBlogPostCount(): Promise<number>;
  // Admin config
  getAdminConfig(): Promise<AdminConfig | undefined>;
  createAdminConfig(passwordHash: string): Promise<AdminConfig>;
  updateAdminConfig(id: number, data: Partial<AdminConfig>): Promise<AdminConfig | undefined>;
  // Site content
  getSiteContent(key: string): Promise<SiteContent | undefined>;
  upsertSiteContent(key: string, value: string): Promise<SiteContent>;
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

  async getAllBlogPosts(publishedOnly = false): Promise<BlogPost[]> {
    if (publishedOnly) {
      return await db.select().from(blogPosts)
        .where(eq(blogPosts.published, true))
        .orderBy(blogPosts.createdAt);
    }
    return await db.select().from(blogPosts).orderBy(blogPosts.createdAt);
  }

  async getBlogPostBySlug(slug: string): Promise<BlogPost | undefined> {
    const [result] = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug));
    return result;
  }

  async createBlogPost(post: InsertBlogPost): Promise<BlogPost> {
    const [result] = await db.insert(blogPosts).values(post).returning();
    return result;
  }

  async updateBlogPost(slug: string, post: UpdateBlogPost): Promise<BlogPost | undefined> {
    const [result] = await db.update(blogPosts)
      .set(post)
      .where(eq(blogPosts.slug, slug))
      .returning();
    return result;
  }

  async deleteBlogPost(slug: string): Promise<boolean> {
    const result = await db.delete(blogPosts).where(eq(blogPosts.slug, slug)).returning();
    return result.length > 0;
  }

  async getBlogPostCount(): Promise<number> {
    const result = await db.select().from(blogPosts);
    return result.length;
  }

  async getAdminConfig(): Promise<AdminConfig | undefined> {
    const [result] = await db.select().from(adminConfig);
    return result;
  }

  async createAdminConfig(passwordHash: string): Promise<AdminConfig> {
    const [result] = await db.insert(adminConfig).values({ passwordHash }).returning();
    return result;
  }

  async updateAdminConfig(id: number, data: Partial<AdminConfig>): Promise<AdminConfig | undefined> {
    const [result] = await db.update(adminConfig)
      .set(data)
      .where(eq(adminConfig.id, id))
      .returning();
    return result;
  }

  async getSiteContent(key: string): Promise<SiteContent | undefined> {
    const [result] = await db.select().from(siteContent).where(eq(siteContent.key, key));
    return result;
  }

  async upsertSiteContent(key: string, value: string): Promise<SiteContent> {
    const existing = await this.getSiteContent(key);
    if (existing) {
      const [result] = await db.update(siteContent)
        .set({ value, updatedAt: new Date() })
        .where(eq(siteContent.key, key))
        .returning();
      return result;
    }
    const [result] = await db.insert(siteContent).values({ key, value }).returning();
    return result;
  }
}

export const storage = new DatabaseStorage();
