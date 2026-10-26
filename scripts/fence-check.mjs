#!/usr/bin/env node
// The fence check (docs/seo-geo-plan.md, section 0): admin, the student area,
// the course reader, the student tools and the course library must answer
// exactly as they did before the SEO work. This requests each fenced route
// from a running server and compares status, X-Robots-Tag and a hash of the
// body against scripts/fence-snapshot.json.
//
//   node scripts/fence-check.mjs [base-url]           compare (default http://localhost:5000)
//   node scripts/fence-check.mjs [base-url] --update  rewrite the snapshot
//
// Run it against a production build (`npm run build`, then `npm start`), since
// that is what Replit serves. Asset file names carry a content hash that moves
// whenever any client code changes, so they are blanked before hashing.

import { createHash } from "crypto";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const ROUTES = [
  // Admin
  "/admin",
  "/admin/login",
  "/admin/setup",
  "/api/admin/me",
  // Student area
  "/learn",
  "/learn/auth",
  "/learn/dashboard",
  "/learn/profile",
  "/learn/somewhere-else",
  "/api/learn/me",
  // Course reader
  "/praxis/learn/claude-101",
  "/praxis/learn/claude-101/1",
  // Student tools
  "/agent-scorecard",
  "/agent-scorecard/",
  "/ai-charter",
  "/handover-list",
  "/use-case-card",
  "/ai-files",
  "/vscode-setup",
  // Course library
  "/courses/",
  "/courses/00-praxis-start-here.html",
  "/courses/01-praxis-claude-101.html",
  "/courses/01-claude-101-teaching-notes.html",
  "/courses/trainer/scoping-worksheet.html",
  // Booking cancel
  "/rieuzal/annuler",
];

const here = path.dirname(fileURLToPath(import.meta.url));
const snapshotFile = path.join(here, "fence-snapshot.json");
const args = process.argv.slice(2);
const update = args.includes("--update");
const base = (args.find((a) => !a.startsWith("--")) ?? "http://localhost:5000").replace(/\/$/, "");

function hashBody(text) {
  const normalised = text.replace(/\/assets\/[\w.-]+?-[\w-]{8}\.(js|css)/g, "/assets/[asset].$1");
  return createHash("sha256").update(normalised).digest("hex").slice(0, 16);
}

const results = {};
for (const route of ROUTES) {
  const res = await fetch(base + route, { redirect: "manual" });
  results[route] = {
    status: res.status,
    robots: res.headers.get("x-robots-tag"),
    location: res.headers.get("location"),
    body: hashBody(await res.text()),
  };
}

if (update || !existsSync(snapshotFile)) {
  writeFileSync(snapshotFile, JSON.stringify(results, null, 2) + "\n");
  console.log(`Snapshot written: ${ROUTES.length} fenced routes.`);
  process.exit(0);
}

const snapshot = JSON.parse(readFileSync(snapshotFile, "utf-8"));
let failures = 0;
for (const route of ROUTES) {
  const before = snapshot[route];
  const now = results[route];
  if (!before) {
    console.log(`NEW   ${route} (not in the snapshot; run with --update once checked)`);
    failures++;
    continue;
  }
  for (const key of ["status", "robots", "location", "body"]) {
    if (before[key] !== now[key]) {
      console.log(`DIFF  ${route} ${key}: ${before[key]} -> ${now[key]}`);
      failures++;
    }
  }
}

if (failures) {
  console.log(`\nFence check failed: ${failures} difference(s).`);
  process.exit(1);
}
console.log(`Fence check passed: ${ROUTES.length} fenced routes unchanged.`);
