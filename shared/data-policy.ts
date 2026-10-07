/**
 * The numbers the data policy promises, in one place, so the policy page, the
 * clean-up job and the consent records can't drift apart.
 *
 * Change POLICY_VERSION whenever the policy's meaning changes: everyone who
 * agreed to an older version is asked again. The tools' shared script
 * (client/public/praxis-data.js) keeps its own copy of the version and the
 * browser expiry, because it runs without a build step. Keep them in step.
 */
export const POLICY_VERSION = "2026-10-07";

/** Months we keep a client's data after the last session, unless their contract says otherwise. */
export const RETENTION_MONTHS = 6;

/** Days a tool keeps unsaved work in the browser after it was last opened. */
export const BROWSER_DAYS = 30;

/** Days a deleted record can still sit in the database host's backups. Check against the host's plan. */
export const BACKUP_DAYS = 7;

export const POLICY_PATH = "/data-policy";

/**
 * Tools that can share a copy of someone's work with us: their name, their link
 * and the localStorage key each keeps its work under (so admin can open a shared
 * copy in the tool). Keep in step with each tool's own KEY.
 */
export const SHARE_TOOLS = {
  "agent-scorecard": { label: "Agent scorecard", path: "/agent-scorecard", storageKey: "praxis-agent-scorecard-v2" },
  "ai-charter": { label: "AI charter", path: "/ai-charter", storageKey: "praxis_charter_v2" },
  "handover-list": { label: "Hand-over check", path: "/handover-list", storageKey: "praxis-handover-list-v1" },
  "use-case-card": { label: "Use case card", path: "/use-case-card", storageKey: "praxis-scoping-worksheet-v1" },
} as const;

export type ShareTool = keyof typeof SHARE_TOOLS;

/**
 * Where the site and its database are hosted. Confirmed by Daniel on 7 October 2026
 * from Replit's settings: North America. (The workspace's `$PGHOST` is "helium",
 * Replit's internal development database, which doesn't name a region.)
 */
export const DATABASE_REGION: string | null = "North America";
