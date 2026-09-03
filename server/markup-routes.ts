/**
 * Markup notes — a development-only read/write endpoint.
 *
 * The markup overlay on a page (see client/src/components/markup) keeps its
 * annotations in the browser's localStorage, which is fine for the person
 * drawing them and useless to anybody else. This writes the same notes into
 * the repo at `.design/markup/<page>.json` so an agent working on the page
 * can read what was asked for, in the words and at the positions it was
 * asked in.
 *
 * `.design/` is gitignored, so nothing here is committed.
 *
 * NOT mounted in production. There is no authentication on it and it writes to
 * disk; it exists so a designer and an agent can pass notes on a laptop.
 */
import type { Express } from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.resolve(process.cwd(), ".design", "markup");

/** Page keys are used as filenames, so they are a strict slug and nothing else. */
const SLUG = /^[a-z0-9][a-z0-9-]{0,63}$/;

function fileFor(page: string): string | null {
  if (!SLUG.test(page)) return null;
  const file = path.join(DIR, `${page}.json`);
  // Belt and braces: the slug already forbids separators and dots.
  return file.startsWith(DIR + path.sep) ? file : null;
}

export function registerMarkupRoutes(app: Express) {
  if (process.env.NODE_ENV === "production") return;

  app.get("/api/markup/:page", async (req, res) => {
    const file = fileFor(req.params.page);
    if (!file) return res.status(400).json({ message: "Bad page key" });
    try {
      const raw = await readFile(file, "utf8");
      return res.json(JSON.parse(raw));
    } catch {
      // Nothing saved yet is the normal case, not an error.
      return res.json({ page: req.params.page, items: [] });
    }
  });

  app.put("/api/markup/:page", async (req, res) => {
    const file = fileFor(req.params.page);
    if (!file) return res.status(400).json({ message: "Bad page key" });
    const body = req.body;
    if (!body || !Array.isArray(body.items)) {
      return res.status(400).json({ message: "Expected { items: [...] }" });
    }
    try {
      await mkdir(DIR, { recursive: true });
      await writeFile(file, JSON.stringify(body, null, 2) + "\n", "utf8");
      return res.json({ ok: true, path: path.relative(process.cwd(), file), count: body.items.length });
    } catch (err) {
      console.error("Failed to write markup notes:", err);
      return res.status(500).json({ message: "Could not write notes" });
    }
  });
}
