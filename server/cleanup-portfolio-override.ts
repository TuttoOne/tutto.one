/**
 * One-off cleanup for a stale portfolio content override.
 *
 * The admin editor keeps its own copy of the portfolio defaults. Opening it and
 * saving writes that copy into site_content, and overrides win over source — so
 * a snapshot of the defaults, saved without any edit, silently pins the text and
 * every later change in code stops appearing on the site.
 *
 * That is what happened: the stored row was byte-identical to the defaults as
 * they stood, carrying no author intent, and it was masking edits to Pythia's
 * subheading and description.
 *
 * This removes that row, but ONLY when it still matches the snapshot below
 * exactly. If any field has since been edited deliberately, the row is left
 * alone and the reason is logged — a stale default is worth clearing, someone's
 * actual writing is not.
 *
 * Safe to leave in place: once the row is gone, or once anyone edits it, this
 * does nothing. It can be deleted after the next deploy.
 */
import { db } from "./db";
import { siteContent } from "@shared/schema";
import { eq } from "drizzle-orm";

type Entry = { id?: string; name?: string; tagline?: string; description?: string; url?: string };

/** The exact content that was saved from the defaults, and carries no edits. */
const STALE: Record<string, Omit<Entry, "id">> = {
  pythia: {
    name: "Pythia",
    tagline: "On-Premise AI · Legal Document Intelligence",
    description:
      "A self-hosted document intelligence platform for litigation and legal review - built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design.",
    url: "/pythia",
  },
  "mcp-bridge-sharepoint-power-automate": {
    name: "MCP Bridge - SharePoint & Power Automate",
    tagline: "Model Context Protocol · Consulting Engagement",
    description:
      "We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records - and diagnose broken automations - through natural conversation.",
    url: "https://modelcontextprotocol.io",
  },
  entityvault: {
    name: "EntityVault",
    tagline: "entityvault.tutto.one",
    description:
      "A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.",
    url: "https://entityvault.tutto.one",
  },
  "ai-roi-portal": {
    name: "AI ROI Portal",
    tagline: "tracker.tutto.one",
    description:
      "A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.",
    url: "https://tracker.tutto.one",
  },
};

const FIELDS = ["name", "tagline", "description", "url"] as const;

export async function clearStalePortfolioOverride(): Promise<void> {
  let row;
  try {
    [row] = await db.select().from(siteContent).where(eq(siteContent.key, "portfolio"));
  } catch (err) {
    // Never let a cleanup stop the server from starting.
    console.warn("[portfolio-override] could not read site_content:", err);
    return;
  }
  if (!row) return;

  let entries: Entry[];
  try {
    entries = JSON.parse(row.value);
    if (!Array.isArray(entries)) throw new Error("not an array");
  } catch {
    console.warn("[portfolio-override] stored value is not valid JSON — left untouched");
    return;
  }

  const ids = entries.map((e) => e.id ?? "");
  const staleIds = Object.keys(STALE);
  const sameSet =
    ids.length === staleIds.length && staleIds.every((id) => ids.includes(id));

  const differences: string[] = [];
  if (!sameSet) {
    differences.push(`entry list differs (stored: ${ids.join(", ") || "none"})`);
  } else {
    for (const entry of entries) {
      const expected = STALE[entry.id!];
      for (const f of FIELDS) {
        if (entry[f] !== expected[f]) differences.push(`${entry.id}.${f}`);
      }
    }
  }

  if (differences.length > 0) {
    console.log(
      `[portfolio-override] keeping the stored override — it has been edited: ${differences
        .slice(0, 5)
        .join(", ")}${differences.length > 5 ? ` (+${differences.length - 5} more)` : ""}`,
    );
    return;
  }

  await db.delete(siteContent).where(eq(siteContent.key, "portfolio"));
  console.log(
    "[portfolio-override] cleared a stored override that exactly matched the old defaults; " +
      "the portfolio now reads from source again",
  );
}
