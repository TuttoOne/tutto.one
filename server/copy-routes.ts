/**
 * Copy editing — a development-only write endpoint.
 *
 * The copy overlay (see client/src/components/copy) makes every string on a
 * page contentEditable in the browser and posts the changed ones here. This
 * writes them back into the source file the page reads from, so a sentence
 * reworded in the browser is a sentence reworded in the repo — not a note
 * somebody has to transcribe afterwards.
 *
 * It edits the file through the TypeScript AST rather than by search and
 * replace. The copy files are mostly doc comment — the reasoning behind each
 * sentence is the valuable half — and a regex rewrite would either destroy
 * that or match inside it. Locating the exact string literal node and splicing
 * its span leaves every comment, every trailing comma and the file's whole
 * shape untouched.
 *
 * NOT mounted in production. There is no authentication on it and it writes
 * into `client/src/lib`; it exists so a writer and an agent can work on the
 * same sentences on a laptop.
 */
import type { Express } from "express";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";

/**
 * The files the endpoint will write, by key. An allowlist rather than a path
 * parameter: this route resolves a name to a file, so no request can name one.
 */
const FILES: Record<string, { file: string; root: string }> = {
  landing: { file: "client/src/lib/landing-copy.ts", root: "landing" },
};

type Edit = { path: string; locale: "en" | "fr"; value: string };

/** Copy leaves are single-line prose. Anything a contentEditable region picked
 *  up as a line break becomes a space, so a stray Enter cannot break the file. */
function clean(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

/** A double-quoted TS string literal. Non-ASCII stays as itself — the file is
 *  UTF-8 and the French reads better in the source unescaped. */
function literal(value: string): string {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

/** The object literal a `const x = {...} as const` declaration is built from. */
function rootObject(source: ts.SourceFile, name: string): ts.ObjectLiteralExpression | null {
  for (const stmt of source.statements) {
    if (!ts.isVariableStatement(stmt)) continue;
    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name) || decl.name.text !== name) continue;
      let init = decl.initializer;
      // `as const` wraps the object one level down.
      while (init && (ts.isAsExpression(init) || ts.isParenthesizedExpression(init))) {
        init = init.expression;
      }
      if (init && ts.isObjectLiteralExpression(init)) return init;
    }
  }
  return null;
}

/** Walk `a.b.2.c` from an object literal down to the node it names. */
function resolve(node: ts.Node, segments: string[]): ts.Node | null {
  let current: ts.Node = node;
  for (const segment of segments) {
    if (ts.isArrayLiteralExpression(current)) {
      const index = Number(segment);
      const element = Number.isInteger(index) ? current.elements[index] : undefined;
      if (!element) return null;
      current = element;
      continue;
    }
    if (!ts.isObjectLiteralExpression(current)) return null;
    const property = current.properties.find(
      (p): p is ts.PropertyAssignment =>
        ts.isPropertyAssignment(p) &&
        (ts.isIdentifier(p.name) || ts.isStringLiteral(p.name)) &&
        p.name.text === segment,
    );
    if (!property) return null;
    current = property.initializer;
  }
  return current;
}

export function registerCopyRoutes(app: Express) {
  if (process.env.NODE_ENV === "production") return;

  /** The current strings, so the browser can tell a leaf it can edit from one
   *  that merely looks like it on screen. */
  app.get("/api/copy/:name", async (req, res) => {
    const target = FILES[req.params.name];
    if (!target) return res.status(404).json({ message: "Unknown copy file" });
    try {
      const text = await readFile(path.resolve(process.cwd(), target.file), "utf8");
      return res.json({ name: req.params.name, file: target.file, text });
    } catch (err) {
      console.error("Failed to read copy file:", err);
      return res.status(500).json({ message: "Could not read the copy file" });
    }
  });

  app.put("/api/copy/:name", async (req, res) => {
    const target = FILES[req.params.name];
    if (!target) return res.status(404).json({ message: "Unknown copy file" });

    const edits: Edit[] = Array.isArray(req.body?.edits) ? req.body.edits : [];
    if (!edits.length) return res.status(400).json({ message: "Expected { edits: [...] }" });

    const file = path.resolve(process.cwd(), target.file);
    let text: string;
    try {
      text = await readFile(file, "utf8");
    } catch (err) {
      console.error("Failed to read copy file:", err);
      return res.status(500).json({ message: "Could not read the copy file" });
    }

    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const root = rootObject(source, target.root);
    if (!root) return res.status(500).json({ message: `No \`${target.root}\` object in the file` });

    /* Collected first, applied last, back to front: every splice moves the
       offsets of everything after it, so the edits are made in descending
       order of position and each one lands where the AST said it would. */
    const splices: { start: number; end: number; value: string }[] = [];
    const missed: string[] = [];

    for (const edit of edits) {
      if (edit.locale !== "en" && edit.locale !== "fr") {
        missed.push(`${edit.path} (bad locale)`);
        continue;
      }
      const segments = [...edit.path.split("."), edit.locale];
      const node = resolve(root, segments);
      if (!node || !ts.isStringLiteral(node)) {
        missed.push(edit.path);
        continue;
      }
      splices.push({
        start: node.getStart(source),
        end: node.getEnd(),
        value: literal(clean(edit.value)),
      });
    }

    splices.sort((a, b) => b.start - a.start);
    let next = text;
    for (const s of splices) {
      next = next.slice(0, s.start) + s.value + next.slice(s.end);
    }

    try {
      await writeFile(file, next, "utf8");
    } catch (err) {
      console.error("Failed to write copy file:", err);
      return res.status(500).json({ message: "Could not write the copy file" });
    }

    return res.json({ ok: true, file: target.file, written: splices.length, missed });
  });
}
