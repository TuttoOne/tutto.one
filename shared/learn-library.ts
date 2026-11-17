/**
 * The Library view on /learn: every handout, guide, tool and course a student
 * has been given, in one searchable list.
 *
 * Which items a student sees comes from their programme (the materials in
 * shared/learn-programmes.ts, plus EVERYONE below). This file only says what
 * each item is: its kind, its topic and one line about it. The searchable text
 * comes from server/learn-index.json, built by scripts/build-learn-index.mjs.
 */

export type LibraryKind = "Handout" | "Guide" | "Tool" | "Course";

export type LibraryTopic = { id: string; name: string; blurb: string };

export const LIBRARY_TOPICS: LibraryTopic[] = [
  { id: "rules", name: "Rules and privacy", blurb: "What can go into an AI tool, which accounts and who checks." },
  { id: "setup", name: "Getting set up", blurb: "Accounts, VS Code and the basics of working with Claude." },
  { id: "brief", name: "Writing it down once", blurb: "Instructions, scorecards and your house style, so you don't explain a job twice." },
  { id: "check", name: "Checking the work", blurb: "What good looks like and how a draft gets checked before anyone sees it." },
  { id: "tools", name: "Tools for the job", blurb: "Which AI for which task, connectors and automation." },
  { id: "team", name: "Working as a team", blurb: "Shared files, linked folders and GitHub." },
];

export type LibraryInfo = { kind: LibraryKind; topic: string; summary: string };

/** Keyed by href without its query string. */
export const LIBRARY_INFO: Record<string, LibraryInfo> = {
  "/courses/00-praxis-start-here.html": { kind: "Course", topic: "setup", summary: "How the programme works and how to talk to an AI like a colleague." },
  "/courses/10-praxis-ai-capabilities-and-limitations.html": { kind: "Course", topic: "check", summary: "Where AI is reliable, where it breaks and how to tell which you're looking at." },
  "/courses/01-praxis-claude-101.html": { kind: "Course", topic: "setup", summary: "What Claude is, the apps it comes in and how to work with it day to day." },
  "/courses/02-praxis-claude-code-101.html": { kind: "Course", topic: "setup", summary: "Claude working in your folders: reading, writing and running things for you." },
  "/courses/03-praxis-introduction-to-claude-cowork.html": { kind: "Course", topic: "tools", summary: "Handing whole tasks to Claude on your desktop, with your files." },
  "/courses/04-praxis-claude-code-in-action.html": { kind: "Course", topic: "tools", summary: "Claude Code on real jobs, from the brief to the finished files." },
  "/courses/05-praxis-ai-fluency-framework-foundations.html": { kind: "Course", topic: "brief", summary: "Delegating well, describing the job and checking what comes back." },
  "/courses/06-praxis-claude-with-the-anthropic-api.html": { kind: "Course", topic: "tools", summary: "Building your own tools on top of Claude." },
  "/courses/07-praxis-introduction-to-model-context-protocol.html": { kind: "Course", topic: "tools", summary: "How connectors work, so Claude can reach your apps and data." },
  "/courses/08-praxis-introduction-to-agent-skills.html": { kind: "Course", topic: "tools", summary: "Packaging what works into skills the whole team can call." },
  "/courses/09-praxis-introduction-to-subagents.html": { kind: "Course", topic: "tools", summary: "Handing a big job to a helper agent with its own instructions." },
  "/skill-file": { kind: "Guide", topic: "brief", summary: "How to write a standing brief Claude reads every time it does that job." },
  "/evals": { kind: "Guide", topic: "check", summary: "Scoring AI output against your scorecard before anything leaves." },
  "/ai-charter": { kind: "Tool", topic: "rules", summary: "Writes your AI charter from your answers. Your answers stay in your browser." },
  "/agent-scorecard": { kind: "Tool", topic: "check", summary: "Builds a scorecard for one recurring job: the checks every draft has to pass." },
  "/handover-list": { kind: "Tool", topic: "brief", summary: "For one task: what AI does, what it shouldn't do and what it needs to run without you." },
  "/use-case-card": { kind: "Tool", topic: "brief", summary: "Turns one real task into a card we can work on: what starts it, what goes in, what comes out." },
  "/vscode-setup": { kind: "Guide", topic: "setup", summary: "From a fresh install to a first task with Claude and Mistral, with a screenshot for every step." },
  "/session-2": { kind: "Handout", topic: "check", summary: "Writing down what good output is for each recurring job, so it can be scored." },
  "/toolkit": { kind: "Guide", topic: "tools", summary: "Extensions, tools and libraries that make Claude more useful, and when to use each." },
  "/session-3": { kind: "Handout", topic: "tools", summary: "Choosing your tool, and deciding which jobs AI should take." },
  "/hsa-session-2": { kind: "Handout", topic: "brief", summary: "Getting your content ready for Claude: what to convert, and how." },
  "/hsa-session-4": { kind: "Handout", topic: "brief", summary: "Where Claude looks for your rules, and how to write them once." },
  "/hsa-session-5": { kind: "Handout", topic: "tools", summary: "Sharing your work as artifacts, and scheduling the jobs that repeat." },
  "/bi-session-4": { kind: "Handout", topic: "brief", summary: "One folder per job, CLAUDE.md, scorecards and turning PDFs into text." },
  "/bi-specialist-tools": { kind: "Handout", topic: "tools", summary: "Picture searches, finding where a photo was taken, faces, scans and the office machine." },
  "/bi-team-files": { kind: "Handout", topic: "team", summary: "One team library for instructions and scorecards, and pointing to it from each case." },
  "/bi-github": { kind: "Handout", topic: "team", summary: "Why we start with one team repository, when a tool gets its own and how to set up your account." },
  "/lab-to-live": { kind: "Handout", topic: "team", summary: "Building tools without touching live systems: the team lab, the check before going live and who signs it off." },
  "/design-system": { kind: "Guide", topic: "brief", summary: "Set up your brand in Claude so what it makes looks like yours." },
  "/workspaces": { kind: "Guide", topic: "team", summary: "Link a shared folder into each project instead of copying it." },
  "/claude-privacy": { kind: "Guide", topic: "rules", summary: "Where the training switch is in each Claude app, and what it does and doesn't cover." },
  "/claude-schedules": { kind: "Guide", topic: "tools", summary: "Let Claude run the weekly jobs on a timetable, and check what it did." },
  "/folder-builder": { kind: "Tool", topic: "brief", summary: "Six questions build a rules folder for any AI." },
  "https://claude.ai/artifact/S7dHFnALQxEY3GWG8SmWC3": { kind: "Handout", topic: "rules", summary: "The 10 questions your AI rules answer, the 8 steps and how to finish the charter." },
};

/** On every student's dashboard whatever the programme, so in every Library. Listed under session 1. */
export const EVERYONE: { label: string; href: string }[] = [
  { label: "VS Code with Claude and Mistral", href: "/vscode-setup" },
  { label: "Use case card", href: "/use-case-card" },
];

export function hrefKey(href: string): string {
  return href.split(/[?#]/)[0].replace(/\/$/, "") || href;
}

export function libraryInfo(href: string): LibraryInfo {
  return LIBRARY_INFO[hrefKey(href)] ?? { kind: "Guide", topic: "tools", summary: "" };
}

/** What /api/learn/library sends. */
export type LibraryItem = {
  label: string;
  href: string;
  claude?: string;
  kind: LibraryKind;
  topic: string;
  summary: string;
  /** The first session it belongs to. */
  session: number;
  /** True for sessions that haven't happened yet: there to read ahead. */
  upcoming: boolean;
  sections: { h: string; id: string; t: string }[];
};
