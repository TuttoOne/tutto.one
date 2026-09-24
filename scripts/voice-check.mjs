#!/usr/bin/env node
/**
 * Flags Claude's writing habits in site copy. The rules and what to write
 * instead are in VOICE.md; the IDs here match its matrix.
 *
 *   node scripts/voice-check.mjs                 whole site
 *   node scripts/voice-check.mjs <file|dir>...   just these
 *   node scripts/voice-check.mjs --summary       counts per rule only
 *
 * It reads copy only: string literals and JSX text in code, visible text and
 * text attributes in HTML. Comments, class names, <style> and <script> blocks
 * are skipped. It is advisory, so it always exits 0 unless --strict is given.
 */
import fs from "node:fs";
import path from "node:path";

const RULES = [
  ["P1", "em dash", /—/g],
  ["P2", "en dash or -- as a dash", / – | -- /g],
  ["P3", "semicolon joining clauses", /[a-zà-ÿ] ?; [a-zà-ÿ]/g],
  ["P4", "American spelling", /\b(organiz\w*|optimiz\w*|analyz\w*|prioritiz\w*|recogniz\w*|realiz\w*|summariz\w*|standardiz\w*|customiz\w*|categoriz\w*|behavior\w*|center(s|ed)?|colors?|favorite)\b/gi],
  ["P5", "Oxford comma", /, [^,.;:()\n]{1,30}, (and|or) /g],
  ["P6", "unicode arrow or bullet in prose", /[A-Za-zà-ÿ,] [→⇒•] [a-zà-ÿ][^.]{25}/g],
  ["S1", "X, not Y / it's not X, it's Y", /, not (a |an |the |just |only )?\w+|, pas (un |une |des |le |la |les |de |du |que )?\w+|\b(isn'?t|is not|it'?s not|not just|not only)\b[^.!?]{0,60}[.,;:] (it'?s|but|it is)\b/gi],
  ["S2", "No X. No Y. Just Z.", /\bNo \w+[^.]{0,30}\. No \w+[^.]{0,30}\. (Just|Only)\b/g],
  ["S3", "fragment drama", /(^|[.!?] )Not an? [^.]{1,25}\. An? [^.]{1,25}\./g],
  ["S6", "colon reveal / suspense hook", /\bhere'?s the (thing|kicker|catch|twist)\b|\bhas a name\.|\bthe (fix|answer|catch|point|problem|trick) is (simple|this):|\bcomes down to this\b|\bis this:/gi],
  ["S7", "question answered straight away", /\?\s+(Because|Simple|The answer)\b/g],
  ["S8", "the real question", /\bthe (real|better|right) question\b|\bthe question isn'?t\b/gi],
  ["S10", "participle tail", /, (ensuring|highlighting|underscoring|emphasi[sz]ing|reflecting|showcasing|fostering|contributing to)\b/gi],
  ["S11", "serves as / stands as", /\b(serves|stands|functions|acts) as\b/gi],
  ["S12", "future-tense value claim", /\bwill (unlock|transform|drive|revolutioni[sz]e|empower|supercharge)\b|\bcould (scale|transform)\b/gi],
  ["S13", "litotes", /\bnot (unreasonable|difficult|trivial|insignificant|uncommon)\b/gi],
  ["S14", "straw man setup", /\b(it would be|it'?s) (tempting|easy) to (think|assume|say|call|believe)\b/gi],
  ["S16", "announced structure", /\blet'?s (break|dive|unpack)\b|\b(two|three|four|five) (things|points|reasons|caveats) (matter|to know|stand out)\b/gi],
  ["W1", "leverage / transform / empower / unlock", /\b(leverag\w*|transformative|transform(s|ed|ing)?|empower\w*|unlock\w*)\b/gi],
  ["W2", "Claude's mannered metaphors", /\bload[- ]bearing\b|\b(carr(y|ies)|holds? up) the (argument|point)\b|\bheavy lifting\b|\bearns? its keep\b|\bsurvives? contact\b|\bthe (tell|trap|unlock)\b|\bseams?\b|\bsubstrate\b|\bbelt[- ]and[- ](braces|suspenders)\b|\bsurfaces? (the|this|that|what)\b/gi],
  ["W3", "intensifier", /\b(genuine(ly)?|structurally|quiet(ly)?|truly|deeply)\b/gi],
  ["W4", "candour flag", /\b(honest(ly)?|frankly|candidly)\b|\bto be (direct|blunt)\b/gi],
  ["W5", "throat-clearing", /\bworth (noting|stating|mentioning|sitting with|flagging)\b|\bit'?s important to note\b|\bat its core\b|\bwhen it comes to\b/gi],
  ["W6", "GPT-era word", /\b(delv\w*|tapestry|testament|underscor\w*|pivotal|intricat\w*|meticulous\w*|vibrant|foster\w*|showcas\w*|landscape|interplay|deep dive)\b/gi],
  ["W7", "corporate filler", /\b(robust|comprehensive|seamless(ly)?|holistic|crucial|cutting[- ]edge|game[- ]chang\w*)\b/gi],
  ["W8", "consultant-speak", /\b(unpack|lean(ing)? into|north star|circle back|pressure[- ]test|double[- ]click|synerg\w*|organi[sz]ational knowledge)\b/gi],
  ["W9", "the real X / full stop", /\bthe real (problem|issue|answer|risk|work)\b|, full stop\b/gi],
  ["W10", "Moreover / Furthermore / Additionally", /(^|[.!?]\s+)(Moreover|Furthermore|Additionally),/g],
  ["W11", "vague crowd", /\bmost (teams|people|businesses|companies|founders)\b|\bexperts (say|agree|argue)\b|\bmany (businesses|companies|teams)\b/gi],
];

const DEFAULT_TARGETS = ["client/src", "client/public", "server/seed-blog.ts"];
const EXTS = new Set([".ts", ".tsx", ".js", ".html", ".md"]);

const args = process.argv.slice(2);
const summary = args.includes("--summary");
const strict = args.includes("--strict");
const targets = args.filter((a) => !a.startsWith("--"));

function walk(p, out) {
  if (path.basename(p).includes(" 2.") || p.includes("node_modules")) return;
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    for (const f of fs.readdirSync(p)) walk(path.join(p, f), out);
  } else if (EXTS.has(path.extname(p)) && st.size < 400_000) {
    out.push(p);
  }
}

/** Blank out a match but keep its newlines, so line numbers stay right. */
const blank = (m) => m.replace(/[^\n]/g, " ");

/** Returns [startIndex, text] for every piece of copy in a file. */
function copyChunks(file, src) {
  const ext = path.extname(file);
  const chunks = [];
  if (ext === ".md") return [[0, src]];
  if (ext === ".html") {
    const s = src
      .replace(/<!--[\s\S]*?-->/g, blank)
      .replace(/<(style|script|pre|code|kbd)\b[\s\S]*?<\/\1>/gi, blank);
    for (const m of s.matchAll(/>([^<]+)</g)) chunks.push([m.index + 1, m[1]]);
    for (const m of s.matchAll(/\b(alt|title|aria-label|content)="([^"]*)"/g))
      chunks.push([m.index, m[2]]);
    return chunks;
  }
  const s = src
    .replace(/\/\*[\s\S]*?\*\//g, blank)
    .replace(/(^|[^:"'`\w\\])\/\/.*$/gm, (m, pre) => pre + blank(m.slice(pre.length)));
  const strRe = ext === ".js"
    ? /"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`/g
    : /"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
  for (const m of s.matchAll(strRe)) {
    const text = m[0].slice(1, -1);
    const before = s.slice(Math.max(0, m.index - 12), m.index);
    if (!text.includes(" ") || /class(Name)?=\{?$/.test(before)) continue;
    if (/^[@./]/.test(text)) continue;
    chunks.push([m.index + 1, text]);
  }
  if (ext === ".tsx") {
    for (const m of s.matchAll(/>([^<>{}]*[A-Za-z]{3,}[^<>{}]*)</g)) {
      if (/[=;()]/.test(m[1]) || !m[1].trim().includes(" ")) continue;
      chunks.push([m.index + 1, m[1]]);
    }
  }
  return chunks;
}

const files = [];
for (const t of targets.length ? targets : DEFAULT_TARGETS) {
  if (fs.existsSync(t)) walk(t, files);
  else console.error(`not found: ${t}`);
}

const counts = Object.fromEntries(RULES.map(([id]) => [id, 0]));
const lineOf = (src, i) => src.slice(0, i).split("\n").length;

for (const file of files.sort()) {
  const src = fs.readFileSync(file, "utf8");
  const hits = [];
  for (const [start, raw] of copyChunks(file, src)) {
    const text = raw.replace(/&#?\w+;/g, (e) => "_".padEnd(e.length, "_")); // HTML entities, same length
    if (/\{[^}]*:[^}]*;/.test(text)) continue; // CSS inside a template string
    for (const [id, name, re] of RULES) {
      for (const m of text.matchAll(re)) {
        counts[id]++;
        const from = Math.max(0, m.index - 40);
        const snippet = text.slice(from, m.index + m[0].length + 40).replace(/\s+/g, " ").trim();
        hits.push([lineOf(src, start + m.index), id, name, snippet]);
      }
    }
  }
  if (!summary && hits.length) {
    hits.sort((a, b) => a[0] - b[0]);
    for (const [line, id, name, snippet] of hits)
      console.log(`${file}:${line}  ${id} ${name}  "${snippet}"`);
  }
}

const total = Object.values(counts).reduce((a, b) => a + b, 0);
console.log(`\n${total} flags in ${files.length} files`);
for (const [id, name] of RULES) if (counts[id]) console.log(`  ${id.padEnd(4)} ${String(counts[id]).padStart(5)}  ${name}`);
console.log("\nWhat to write instead: VOICE.md");
process.exit(strict && total ? 1 : 0);
