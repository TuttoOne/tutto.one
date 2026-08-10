import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertEmailLeadSchema } from "@shared/schema";
import { z } from "zod";
import { Resend } from "resend";
import { registerAdminRoutes } from "./admin-routes";

// Constructed lazily. `new Resend(undefined)` throws, and at module scope that
// crashes the whole server at import time in any environment without the key
// set — including local development.
let _resend: Resend | null = null;
function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) return null;
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";
const FROM_EMAIL = "Tutto <notifications@tutto.one>";

// GitHub content cache
const _ghCache = new Map<string, { data: string; exp: number }>();

async function fetchGithub(path: string): Promise<string> {
  const cacheKey = path;
  const hit = _ghCache.get(cacheKey);
  if (hit && hit.exp > Date.now()) return hit.data;

  const res = await fetch(
    `https://api.github.com/repos/TuttoOne/praxis/contents/${path}?ref=main`,
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.raw",
        "User-Agent": "tutto-one",
        "X-GitHub-Api-Version": "2022-11-28",
      },
    }
  );
  if (!res.ok) throw new Error(`GitHub ${res.status}: ${path}`);
  const text = await res.text();
  _ghCache.set(cacheKey, { data: text, exp: Date.now() + 5 * 60 * 1000 });
  return text;
}

function parseFrontmatter(text: string): { meta: Record<string, any>; content: string } {
  if (!text.startsWith("---")) return { meta: {}, content: text };
  const end = text.indexOf("\n---", 3);
  if (end === -1) return { meta: {}, content: text };
  const meta: Record<string, any> = {};
  for (const line of text.slice(3, end).trim().split("\n")) {
    const ci = line.indexOf(":");
    if (ci === -1) continue;
    const k = line.slice(0, ci).trim();
    const v = line.slice(ci + 1).trim().replace(/^["']|["']$/g, "");
    meta[k] = v;
  }
  return { meta, content: text.slice(end + 4).trim() };
}

async function sendNotificationEmail(subject: string, html: string) {
  const resend = getResend();
  if (!resend) {
    console.warn(`[email] skipped "${subject}" — RESEND_API_KEY is not set`);
    return;
  }
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFICATION_EMAIL,
      subject,
      html,
    });
  } catch (err) {
    console.error("Failed to send notification email:", err);
  }
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      const data = insertContactSubmissionSchema.parse(req.body);
      const submission = await storage.createContactSubmission(data);

      await sendNotificationEmail(
        `New enquiry from ${data.name}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Tutto Enquiry</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${data.name}</h2>
              <p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${data.email}</p>
            </div>
            <div style="background: #fff; border-radius: 10px; padding: 24px; border: 1px solid #d8d0c5;">
              <p style="color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 10px;">Message</p>
              <p style="color: #1a1a1a; font-size: 14px; line-height: 1.75; margin: 0; white-space: pre-line;">${data.message}</p>
            </div>
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true, submission });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Get all contact submissions (for admin view - would add auth in production)
  app.get("/api/contact", async (req, res) => {
    try {
      const submissions = await storage.getAllContactSubmissions();
      res.json(submissions);
    } catch (error) {
      console.error("Failed to fetch submissions:", error);
      res.status(500).json({ error: "Failed to fetch submissions" });
    }
  });

  // Email lead capture (SharePoint page)
  app.post("/api/leads", async (req, res) => {
    try {
      const data = insertEmailLeadSchema.parse(req.body);
      const lead = await storage.createEmailLead(data);

      await sendNotificationEmail(
        `New lead: ${data.email}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Lead Capture</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${data.email}</h2>
              <p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${data.source}</p>
            </div>
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true, lead });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Lead capture error:", error);
        res.status(500).json({ error: "Failed to capture lead" });
      }
    }
  });

  // Public blog routes
  app.get("/api/blog", async (req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(true);
      res.json(posts);
    } catch (error) {
      console.error("Failed to fetch blog posts:", error);
      res.status(500).json({ error: "Failed to fetch blog posts" });
    }
  });

  app.get("/api/blog/:slug", async (req, res) => {
    try {
      const post = await storage.getBlogPostBySlug(req.params.slug);
      if (!post || !post.published) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (error) {
      console.error("Failed to fetch blog post:", error);
      res.status(500).json({ error: "Failed to fetch blog post" });
    }
  });

  // Public site content
  app.get("/api/site-content/:key", async (req, res) => {
    try {
      const content = await storage.getSiteContent(req.params.key);
      if (!content) {
        return res.status(404).json({ error: "Content not found" });
      }
      res.json(content);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch content" });
    }
  });

  app.get("/api/courses", async (req, res) => {
    try {
      const manifest = JSON.parse(await fetchGithub("_manifest.json"));
      const files: string[] = (manifest.files ?? []).filter(
        (f: string) => f.startsWith("courses/") && f.endsWith(".md") && !f.endsWith("README.md")
      );
      const courses: Record<string, { meta: any; path: string }[]> = {};
      for (const path of files) {
        try {
          const { meta } = parseFrontmatter(await fetchGithub(path));
          if (!meta.course) continue;
          if (!courses[meta.course]) courses[meta.course] = [];
          courses[meta.course].push({ meta, path });
        } catch { /* skip files that 404 */ }
      }
      for (const arr of Object.values(courses)) {
        arr.sort((a, b) => Number(a.meta.order ?? 99) - Number(b.meta.order ?? 99));
      }
      res.json(courses);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/courses/:course/:lesson", async (req, res) => {
    const { course, lesson } = req.params;
    if (!/^[a-z0-9-]+$/.test(course) || !/^[a-z0-9-]+$/.test(lesson)) {
      return res.status(400).json({ error: "Invalid path" });
    }
    try {
      const { meta, content } = parseFrontmatter(await fetchGithub(`courses/${course}/${lesson}.md`));
      res.json({ meta, content });
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  });

  app.get("/api/courses/:course", async (req, res) => {
    const { course } = req.params;
    if (!/^[a-z0-9-]+$/.test(course)) {
      return res.status(400).json({ error: "Invalid path" });
    }
    try {
      const { meta, content } = parseFrontmatter(await fetchGithub(`courses/${course}/index.md`));
      res.json({ meta, content });
    } catch {
      res.status(404).json({ error: "Not found" });
    }
  });

  // Praxis France decks — served at extensionless URLs in both dev and prod.
  // Files live in client/public (dev) which vite copies to dist/public (prod).
  const deckDir =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(process.cwd(), "client", "public");
  app.get(["/praxisfrance-en", "/praxisfrance-fr"], (req, res) => {
    const lang = req.path.endsWith("-fr") ? "fr" : "en";
    res.sendFile(path.join(deckDir, `praxisfrance-${lang}.html`));
  });

  // Register admin routes
  registerAdminRoutes(app);

  return httpServer;
}
