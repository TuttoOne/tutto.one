/**
 * robots.txt, sitemap.xml and llms.txt (docs/seo-geo-plan.md, section 3).
 *
 * The sitemap lists the allowlist in shared/public-pages.ts, the published
 * blog posts and the public course pages, and nothing else: no student,
 * trainer or admin route is ever in it. robots.txt only disallows /api/, so
 * the noindex headers on the private areas stay visible to crawlers.
 */
import type { Express } from "express";
import fs from "fs";
import path from "path";
import { storage } from "./storage";
import { PUBLIC_PAGES, SITE_URL } from "@shared/public-pages";
import { SITE_PAGES } from "../client/src/webmcp/site-index";

// Training and search crawlers alike are welcome (plan, question 4). They
// are named so the choice is on the record, and so a later change is one line.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Google-Extended",
  "Applebot-Extended",
  "MistralAI-User",
];

const ROBOTS = [
  "User-agent: *",
  "Disallow: /api/",
  "",
  ...AI_CRAWLERS.flatMap((bot) => [`User-agent: ${bot}`, "Allow: /", "Disallow: /api/", ""]),
  `Sitemap: ${SITE_URL}/sitemap.xml`,
  "",
].join("\n");

export function registerSeoRoutes(app: Express) {
  const publicDir =
    process.env.NODE_ENV === "production"
      ? path.resolve(__dirname, "public")
      : path.resolve(process.cwd(), "client", "public");

  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(ROBOTS);
  });

  app.get("/sitemap.xml", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(true);
      const entries = [
        ...PUBLIC_PAGES.map((p) => ({ loc: SITE_URL + p.path, priority: p.priority })),
        ...posts.map((post) => ({ loc: `${SITE_URL}/blog/${post.slug}`, priority: 0.7, lastmod: isoDate(post.date) })),
        ...coursePages(publicDir).map((p) => ({ loc: SITE_URL + p, priority: 0.5 })),
      ];
      const xml = [
        `<?xml version="1.0" encoding="UTF-8"?>`,
        `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
        ...entries.map(
          (e) =>
            `  <url><loc>${xmlEsc(e.loc)}</loc>${"lastmod" in e && e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}<priority>${e.priority.toFixed(1)}</priority></url>`,
        ),
        `</urlset>`,
        "",
      ].join("\n");
      res.type("application/xml").send(xml);
    } catch (error) {
      console.error("Failed to build the sitemap:", error);
      res.status(500).type("text/plain").send("Sitemap unavailable");
    }
  });

  app.get("/llms.txt", async (_req, res) => {
    try {
      const posts = await storage.getAllBlogPosts(true);
      res.type("text/plain").send(llmsTxt(posts));
    } catch (error) {
      console.error("Failed to build llms.txt:", error);
      res.status(500).type("text/plain").send("llms.txt unavailable");
    }
  });
}

/**
 * The course pages students and the public may read: the library index and
 * the decks in English and French. The teaching notes (noindex) and the
 * trainer folder are left out.
 */
function coursePages(publicDir: string): string[] {
  const root = path.join(publicDir, "courses");
  const pages = ["/courses/"];
  for (const dir of ["", "first-steps", "specialist"]) {
    let files: string[];
    try {
      files = fs.readdirSync(path.join(root, dir));
    } catch {
      continue;
    }
    for (const f of files.sort()) {
      if (/^\d+[a-z]?-praxis-.+\.html$/.test(f)) pages.push(`/courses/${dir ? dir + "/" : ""}${f}`);
    }
  }
  return pages;
}

function llmsTxt(posts: { slug: string; title: string; excerpt: string }[]): string {
  const summary = new Map(SITE_PAGES.map((p) => [p.path, p]));
  const line = (p: string) => {
    const page = summary.get(p);
    return page ? `- [${page.name}](${SITE_URL}${p}): ${page.summary}` : null;
  };
  const section = (title: string, paths: string[], extra: string[] = []) =>
    [`## ${title}`, "", ...paths.map(line).filter(Boolean), ...extra, ""].join("\n");

  return [
    "# Tutto",
    "",
    "> We fix how your team uses AI. Then we build what's worth building.",
    "",
    "Tutto is Daniel Forsthofer's AI training and consulting practice, working in English and French, online and in person in the Lot. Praxis is the training: your team learns to brief AI once, with rules, a standard for good work and what to hand over, so it works every time. On the build side, Pythia is AI that runs on your own machines and reads your files where they already sit.",
    "",
    section("Training", ["/", "/praxis", "/calendar", "/peer-groups", "/become-a-trainer", "/rieuzal"], [
      "- [The AI-Fluent Team](" + SITE_URL + "/praxis-programme): the Praxis programme for a whole team.",
      "- [Article 4: AI literacy training](" + SITE_URL + "/article-4): what the EU AI Act asks of employers, and the training that covers it.",
    ]),
    section("Building", ["/services", "/sovereign", "/pythia", "/gtm-orchestrator", "/usecase"]),
    section("About", ["/about", "/applied", "/portfolio", "/contact"]),
    "## Writing",
    "",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug}): ${p.excerpt}`),
    "",
  ].join("\n");
}

function isoDate(date: string): string | undefined {
  const d = new Date(date);
  return isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10);
}

function xmlEsc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
