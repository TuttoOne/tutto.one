#!/usr/bin/env node
// Builds server/learn-index.json: the text of every handout, guide and course
// page in client/public, cut into sections at each <h2>, so the Library view on
// /learn can search inside them. Pages that aren't static text (the tools, and
// pages hosted elsewhere) get their text from scripts/learn-index-extra.json.
//
//   node scripts/build-learn-index.mjs
//
// Run it after adding or changing a handout, then commit the JSON with it.

import { readFileSync, writeFileSync, readdirSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const pub = path.join(root, "client/public");

// Folders in client/public that aren't reading material.
const SKIP_DIRS = new Set(["artwork", "blog", "logos", "pocket-praxis", "pythia-demo", "pythia-shots", "usecase", "courses"]);

const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", rsquo: "'", lsquo: "'", rdquo: '"', ldquo: '"', hellip: "…", middot: "·", times: "×", rarr: "→", larr: "←", euro: "€", ndash: "-", mdash: "-" };
function decode(s) {
  return s.replace(/&(#x?[0-9a-f]+|\w+);/gi, (m, e) => {
    if (e[0] === "#") return String.fromCodePoint(e[1].toLowerCase() === "x" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
    return ENTITIES[e.toLowerCase()] ?? m;
  });
}

function toText(html) {
  return decode(
    html
      .replace(/<\/(p|li|h3|h4|td|dt|figcaption)>/gi, ". ")
      .replace(/<(br|\/?(div|tr|th|dd|label|span|small|section|article|ol|ul|pre|code|blockquote|b|strong))\b[^>]*>/gi, " ")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .replace(/\s+([.,:;?!])/g, "$1")
    .replace(/([.?!:])\.+/g, "$1")
    .replace(/(\. ){2,}/g, ". ")
    .replace(/^[\s.]+|[\s.]+$/g, "")
    .replace(/^(Tutto\. ?)?(Your dashboard\.? ?)?/, "")
    .trim();
}

function sections(file) {
  let html = readFileSync(file, "utf-8");
  const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/i)?.[1] ?? html;
  html = body.replace(/<(script|style|svg|nav|header|footer|button)\b[\s\S]*?<\/\1>/gi, " ");
  const parts = html.split(/(<h2\b[^>]*>[\s\S]*?<\/h2>)/i);
  const out = [];
  let heading = "Introduction";
  let id = "";
  let lastSectionId = "";
  for (const part of parts) {
    const h2 = part.match(/^<h2\b([^>]*)>([\s\S]*?)<\/h2>$/i);
    if (h2) {
      heading = toText(h2[2]) || "Introduction";
      id = h2[1].match(/\bid="([^"]+)"/)?.[1] ?? lastSectionId;
      continue;
    }
    const text = toText(part);
    if (text.length >= 30) out.push({ h: heading, id, t: text.slice(0, 2500) });
    const ids = [...part.matchAll(/<section\b[^>]*\bid="([^"]+)"/gi)];
    if (ids.length) lastSectionId = ids[ids.length - 1][1];
  }
  return out;
}

const index = {};
for (const dir of readdirSync(pub, { withFileTypes: true })) {
  if (!dir.isDirectory() || SKIP_DIRS.has(dir.name)) continue;
  const file = path.join(pub, dir.name, "index.html");
  if (!existsSync(file)) continue;
  const secs = sections(file);
  if (secs.length) index[`/${dir.name}`] = secs;
}
for (const name of readdirSync(path.join(pub, "courses"))) {
  if (!/^\d.*\.html$/.test(name) || /-fr\.html$|teaching-notes|sketch/.test(name)) continue;
  const secs = sections(path.join(pub, "courses", name));
  if (secs.length) index[`/courses/${name}`] = secs;
}

const extra = JSON.parse(readFileSync(path.join(root, "scripts/learn-index-extra.json"), "utf-8"));
for (const [href, secs] of Object.entries(extra)) {
  if (href.startsWith("_")) continue;
  index[href] = [...(index[href] ?? []), ...secs];
}

writeFileSync(path.join(root, "server/learn-index.json"), JSON.stringify(index) + "\n");
const count = Object.values(index).reduce((n, s) => n + s.length, 0);
console.log(`learn-index.json: ${Object.keys(index).length} pages, ${count} sections.`);
