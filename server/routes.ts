import type { Express } from "express";
import { createServer, type Server } from "http";
import path from "path";
import { storage } from "./storage";
import { insertContactSubmissionSchema, insertEmailLeadSchema } from "@shared/schema";
import { z } from "zod";
import { registerAdminRoutes, requireAdmin } from "./admin-routes";
import { registerAdminPasskeyRoutes } from "./admin-passkeys";
import { enquiryMessageHtml, escapeHtml } from "./email/enquiry-message";
import { getResend } from "./email/resend";
import { registerLearnRoutes } from "./learn-routes";
import { registerDataRoutes } from "./data-routes";
import { registerEventRoutes } from "./event-routes";
import { registerPocketRoutes } from "./pocket-routes";
import { registerSeoRoutes } from "./seo";
import { logDrop, overLimit, registerFormGuardRoutes, screen } from "./form-guard";

const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL ?? "daniel@tutto.one";
const FROM_EMAIL = "Tutto <notifications@tutto.one>";

// The schema only says these are strings, so cap them and check the address here.
const contactInputSchema = insertContactSubmissionSchema.extend({
  name: z.string().trim().min(1).max(200),
  email: z.string().trim().email().max(320),
  message: z.string().trim().min(1).max(20000),
  trainerCode: z.string().trim().max(100).nullish(),
});

/** Why a flagged submission was flagged, shown under it in the notification. */
function spamNoteHtml(reasons: string[]) {
  return `<div style="background: #fdecec; border-radius: 10px; padding: 16px 24px; border: 1px solid #f0b0b0; margin-top: 16px;">
              <p style="color: #a85050; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">Likely spam</p>
              <p style="color: #1a1a1a; font-size: 13px; margin: 0;">${reasons.map(escapeHtml).join("<br>")}</p>
            </div>`;
}

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

  // robots.txt, sitemap.xml and llms.txt (docs/seo-geo-plan.md, section 3).
  registerSeoRoutes(app);

  // Hands each public form a signed timestamp (server/form-guard.ts).
  registerFormGuardRoutes(app);

  // Contact form submission
  app.post("/api/contact", async (req, res) => {
    try {
      if (overLimit(req, "contact", 5)) {
        return res.status(429).json({ error: "Too many messages from this connection. Try again in an hour, or email daniel@tutto.one." });
      }
      const data = contactInputSchema.parse(req.body);
      const verdict = screen(req, { email: data.email, message: data.message });
      if (verdict.action === "drop") {
        logDrop("enquiry", req, verdict);
        return res.json({ success: true });
      }
      await storage.createContactSubmission(data);
      const spam = verdict.action === "flag";

      await sendNotificationEmail(
        `${spam ? "[Likely spam] " : ""}New enquiry from ${data.name}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Tutto Enquiry</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${escapeHtml(data.name)}</h2>
              <p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${escapeHtml(data.email)}</p>
            </div>
            <div style="background: #fff; border-radius: 10px; padding: 24px 24px 8px; border: 1px solid #d8d0c5;">
              ${enquiryMessageHtml(data.message)}
            </div>
            ${spam ? spamNoteHtml(verdict.reasons) : ""}
            ${
              data.trainerCode
                ? `<div style="background: #fdf6ec; border-radius: 10px; padding: 16px 24px; border: 1px solid #f0d9b0; margin-top: 16px;">
              <p style="color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 6px;">Trainer code</p>
              <p style="color: #1a1a1a; font-size: 14px; font-weight: 600; margin: 0;">${escapeHtml(data.trainerCode)}</p>
            </div>`
                : ""
            }
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid input", details: error.errors });
      } else {
        console.error("Contact submission error:", error);
        res.status(500).json({ error: "Failed to submit contact form" });
      }
    }
  });

  // Every enquiry ever sent, names and emails included, so admin only.
  app.get("/api/contact", requireAdmin, async (req, res) => {
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
      if (overLimit(req, "leads", 5)) {
        return res.status(429).json({ error: "Too many sign-ups from this connection. Try again in an hour." });
      }
      const data = insertEmailLeadSchema.parse(req.body);
      const verdict = screen(req, { email: data.email });
      if (verdict.action === "drop") {
        logDrop("lead", req, verdict);
        return res.json({ success: true });
      }
      await storage.createEmailLead(data);
      const spam = verdict.action === "flag";

      await sendNotificationEmail(
        `${spam ? "[Likely spam] " : ""}New lead: ${data.email}`,
        `
          <div style="font-family: Inter, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; background: #f6f1ea;">
            <div style="background: #1a1a1a; border-radius: 10px; padding: 28px; margin-bottom: 24px;">
              <p style="color: #d97706; font-size: 11px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 8px;">New Lead Capture</p>
              <h2 style="color: #f6f1ea; font-size: 22px; margin: 0;">${escapeHtml(data.email)}</h2>
              <p style="color: rgba(246,241,234,0.5); font-size: 13px; margin: 4px 0 0;">${escapeHtml(data.source)}</p>
            </div>
            ${spam ? spamNoteHtml(verdict.reasons) : ""}
            <p style="color: #a8a092; font-size: 11px; margin: 20px 0 0; text-align: center;">Tutto · tutto.one</p>
          </div>
        `
      );

      res.json({ success: true });
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

  // Praxis agent scorecard — a standalone tool shared by link only. It is kept out of the
  // navigation, the sitemap and the WebMCP site index, and asks search engines not to index it.
  app.get(["/agent-scorecard", "/agent-scorecard/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "agent-scorecard", "index.html"));
  });

  // Praxis AI charter wizard — same arrangement as the scorecard: link only, not indexed.
  // Its scripts and styles are plain static files under /ai-charter/.
  app.get(["/ai-charter", "/ai-charter/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "ai-charter", "index.html"));
  });

  // Praxis hand-over check (session three): same arrangement, link only, not indexed.
  // Its script and styles are plain static files under /handover-list/.
  app.get(["/handover-list", "/handover-list/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "handover-list", "index.html"));
  });

  // Praxis use case card (the T1 scoping worksheet): same arrangement, link only, not indexed.
  // Opened from /learn with ?card=, it saves to the student's account.
  app.get(["/use-case-card", "/use-case-card/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "use-case-card", "index.html"));
  });

  // The tools' Markdown versions download as files, also when opened from a link in an email.
  app.use((req, res, next) => {
    if (/^\/[a-z-]+\/praxis-[a-z-]+\.md$/.test(req.path)) {
      res.setHeader("Content-Disposition", `attachment; filename="${path.basename(req.path)}"`);
    }
    next();
  });

  // How to use those Markdown files with your own AI: same arrangement, link only, not indexed.
  app.get(["/ai-files", "/ai-files/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "ai-files", "index.html"));
  });

  // Praxis VS Code setup pack (Claude and Mistral Vibe): same arrangement, link only, not indexed.
  // Its screenshots are plain static files under /vscode-setup/img/.
  app.get(["/vscode-setup", "/vscode-setup/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "vscode-setup", "index.html"));
  });

  // Design system guide (making one from the Claude app home, or from code with Claude Code):
  // same arrangement, link only, not indexed. Its screenshots are plain static files under /design-system/img/.
  app.get(["/design-system", "/design-system/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "design-system", "index.html"));
  });

  // Workspaces guide (link a shared folder into each VS Code project instead of copying it):
  // same arrangement, link only, not indexed. Its screenshots are plain static files under /workspaces/img/.
  app.get(["/workspaces", "/workspaces/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "workspaces", "index.html"));
  });

  // Claude privacy guide (switch off training on your chats in Settings, Privacy):
  // same arrangement, link only, not indexed. Its screenshots are plain static files under /claude-privacy/img/.
  app.get(["/claude-privacy", "/claude-privacy/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "claude-privacy", "index.html"));
  });

  // Session 2 handout (Define good: Claude in VS Code, the brand file, PDF, Excel, Word and a chart):
  // same arrangement, link only, not indexed.
  app.get(["/session-2", "/session-2/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "session-2", "index.html"));
  });

  // Session 3 handout (the show and tell, and how a scorecard decides if a draft is good):
  // same arrangement, link only, not indexed.
  app.get(["/session-3", "/session-3/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "session-3", "index.html"));
  });

  // HSA session 2 handout (clean text and the six tags, on Stock Receiving):
  // same arrangement, link only, not indexed.
  app.get(["/hsa-session-2", "/hsa-session-2/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "hsa-session-2", "index.html"));
  });

  // HSA session 4 handout (what the team built, sign-off, and where Claude's rules live):
  // same arrangement, link only, not indexed.
  app.get(["/hsa-session-4", "/hsa-session-4/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "hsa-session-4", "index.html"));
  });

  // HSA session 5 handout (the Claude app: artifacts, projects and scheduled tasks):
  // same arrangement, link only, not indexed.
  app.get(["/hsa-session-5", "/hsa-session-5/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "hsa-session-5", "index.html"));
  });

  // Background Italia session 4 handout (scorecards, CLAUDE.md, PDFs into text, workspaces, the design system):
  // same arrangement, link only, not indexed.
  app.get(["/bi-session-4", "/bi-session-4/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "bi-session-4", "index.html"));
  });

  // The toolkit (VS Code extensions, command-line tools and Python libraries, and which to get):
  // same arrangement, link only, not indexed.
  app.get(["/toolkit", "/toolkit/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "toolkit", "index.html"));
  });

  // The skill file and evals lessons from the Praxis Foundations course, copied here so they
  // don't depend on the GitHub token behind /praxis/learn: same arrangement, link only, not indexed.
  app.get(["/skill-file", "/skill-file/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "skill-file", "index.html"));
  });
  app.get(["/evals", "/evals/"], (_req, res) => {
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "evals", "index.html"));
  });

  // /calendar was the Applied AI Evenings page. The events are the Rieuzal
  // ateliers now, so old links, blog posts and search results land there.
  app.get(["/calendar", "/calendar/"], (_req, res) => res.redirect(301, "/rieuzal"));

  // /praxis was the training overview. Retired in November 2026: the team
  // course page says it better, so the nav and old links go there. Only the
  // bare path: /praxis/learn is the course reader and stays where it is.
  app.get(["/praxis", "/praxis/"], (_req, res) => res.redirect(301, "/praxis-programme"));

  // Pocket Praxis, the course decks as a phone game: link only, not indexed. Served from
  // the folder with a trailing slash, because its scripts, course files and offline
  // service worker all load relative to it.
  app.get(["/pocket-praxis", "/pocket-praxis/index.html"], (req, res) => {
    const [pathname, query] = req.originalUrl.split("?");
    if (pathname === "/pocket-praxis") {
      return res.redirect(301, "/pocket-praxis/" + (query !== undefined ? "?" + query : ""));
    }
    res.setHeader("X-Robots-Tag", "noindex, nofollow");
    res.sendFile(path.join(deckDir, "pocket-praxis", "index.html"));
  });
  registerPocketRoutes(app);

  // Register admin routes
  registerAdminRoutes(app);
  registerAdminPasskeyRoutes(app);

  // Student sign-in, dashboard and the admin side of cohorts (/learn)
  registerLearnRoutes(app);
  registerDataRoutes(app);

  // Booking places at the in-person evenings (/rieuzal), with a waiting list
  registerEventRoutes(app);

  return httpServer;
}
