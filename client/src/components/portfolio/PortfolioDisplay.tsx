import { ExternalLink, ChevronLeft, ChevronRight, Plug } from "lucide-react";
import { useState } from "react";

import cfeDashboard from "@assets/screenshot-1773752954601.png";
import cfeFormats from "@assets/Screenshot_2026-03-17_at_14.15.25_1773753570040.png";
import cfePlugin from "@assets/Screenshot_2026-03-17_at_14.19.11_1773753570040.png";

import evHome from "@assets/Screenshot_2026-03-17_at_14.14.24_1773753293404.png";
import evEntities from "@assets/Screenshot_2026-03-17_at_14.13.51_1773753293404.png";
import evCollab from "@assets/Screenshot_2026-03-17_at_14.14.02_1773753293404.png";

import trackerDashboard from "@assets/Screenshot_2026-03-17_at_14.11.56_1773753293404.png";
import trackerUsage from "@assets/Screenshot_2026-03-17_at_14.11.24_1773753293403.png";
import trackerProjects from "@assets/Screenshot_2026-03-17_at_14.11.38_1773753293403.png";

export interface ProductEntry {
  type: "product";
  name: string;
  tagline: string;
  description: string;
  url: string;
  screenshots: string[];
  screenshotLabels: string[];
}

export interface ProjectEntry {
  type: "project";
  name: string;
  tagline: string;
  description: string;
  url?: string;
  urlLabel?: string;
  badge: string;
  capabilities: { title: string; detail: string }[];
  conversations: { user: string; assistant: string }[];
}

export type PortfolioEntry = ProductEntry | ProjectEntry;

export const portfolioEntries: PortfolioEntry[] = [
  {
    type: "project",
    name: "LegalRAG",
    tagline: "On-Premise AI · Legal Document Intelligence",
    badge: "Client Engagement",
    description:
      "A self-hosted document intelligence platform for litigation and legal review — built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design.",
    capabilities: [
      {
        title: "Document Ingestion at Scale",
        detail: "150,000+ files across all formats (PDF, DOCX, MSG, EML, XLSX, TIF, and more). Checkpoint-based processing survives interruptions.",
      },
      {
        title: "Semantic Search & RAG Q&A",
        detail: "Ask questions in plain English. Every answer cites its source document and page number — no hallucination from the AI's own knowledge.",
      },
      {
        title: "Interactive Timeline",
        detail: "Chronological view of case events extracted from metadata. Drill from year to month to individual events, filtered by disclosure side.",
      },
      {
        title: "Complete On-Premise Privacy",
        detail: "OCR, inference, vector search, and storage all run locally on DGX Spark. No cloud APIs. Satisfies Legal Professional Privilege architecturally.",
      },
    ],
    conversations: [
      {
        user: "Find all documents referencing the March 2023 board meeting and summarise the key decisions",
        assistant: "Found 14 relevant passages across 6 documents. Key decisions recorded: approval of revised share structure (Exhibit C-112), appointment of interim CFO (Email D-0447), deferral of acquisition vote to Q3 2023 (Board Minutes C-089).",
      },
      {
        user: "Show me all emails between the claimant and defendant between January and April 2022",
        assistant: "Retrieved 38 emails. Earliest: 4 Jan 2022 (REF: D-0012). Latest: 29 Apr 2022 (REF: D-0891). 12 marked confidential by producing side.",
      },
      {
        user: "Build a timeline of contractual deadlines mentioned across all documents",
        assistant: "Extracted 23 deadline references. Key dates: 15 Feb 2022 (payment milestone, Contract §4.2), 1 Jun 2022 (option expiry, Addendum B), 30 Sep 2022 (longstop date, original SPA).",
      },
    ],
  },
  {
    type: "project",
    name: "MCP Bridge — SharePoint & Power Automate",
    tagline: "Model Context Protocol · Consulting Engagement",
    badge: "Client Engagement",
    description:
      "We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records — and diagnose broken automations — through natural conversation.",
    url: "https://modelcontextprotocol.io",
    urlLabel: "What is MCP?",
    capabilities: [
      {
        title: "SharePoint Lists & Structure",
        detail: "Create lists, add columns of any type, model entity relationships, inspect full schemas.",
      },
      {
        title: "Data Management",
        detail: "Query items with filters and sorting, create, update, and delete records, run bulk transforms.",
      },
      {
        title: "Power Automate",
        detail: "List flows, inspect definitions, view run history with error diagnostics, trigger manual flows.",
      },
      {
        title: "Live Documentation",
        detail: "AI searches current Microsoft docs before answering — no outdated or hallucinated API guidance.",
      },
    ],
    conversations: [
      {
        user: "List all SharePoint lists on my site",
        assistant: "Found 8 lists: Tasks, Clients, Projects, Invoices, Contacts, Documents, Assets, Settings.",
      },
      {
        user: "Add a lookup column on Tasks pointing to the Clients list",
        assistant: "Column 'Client' (lookup → Clients) added to the Tasks list successfully.",
      },
      {
        user: "Show me the last 5 failed Power Automate runs on 'Invoice Sync'",
        assistant: "Found 5 failed runs. Most recent error: 'Connection timeout to Xero API' — occurred 3 times in the last 24 hours.",
      },
    ],
  },
  {
    type: "product",
    name: "Creative Format Engine",
    tagline: "cfe.tutto.one",
    description:
      "A format specification and campaign management tool for creative production — e-commerce banners, social media assets, and more. Includes a Photoshop plugin for seamless designer workflows.",
    url: "https://cfe.tutto.one",
    screenshots: [cfeDashboard, cfeFormats, cfePlugin],
    screenshotLabels: ["Dashboard", "Format Specifications", "Photoshop Plugin"],
  },
  {
    type: "product",
    name: "EntityVault",
    tagline: "entityvault.tutto.one",
    description:
      "A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.",
    url: "https://entityvault.tutto.one",
    screenshots: [evHome, evEntities, evCollab],
    screenshotLabels: ["Home", "My Entities", "Collaboration Requests"],
  },
  {
    type: "product",
    name: "AI ROI Portal",
    tagline: "tracker.tutto.one",
    description:
      "A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.",
    url: "https://tracker.tutto.one",
    screenshots: [trackerDashboard, trackerUsage, trackerProjects],
    screenshotLabels: ["ROI Dashboard", "AI Usage Tracking", "Projects"],
  },
];

function ImageCarousel({
  screenshots,
  labels,
  productName,
}: {
  screenshots: string[];
  labels: string[];
  productName: string;
}) {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));
  const slug = productName.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-3">
      <div className="relative group rounded-xl overflow-hidden border border-border/60 bg-muted/30">
        <img
          src={screenshots[current]}
          alt={`${productName} — ${labels[current]}`}
          className="w-full aspect-[16/10] object-cover object-top"
          data-testid={`img-screenshot-${slug}-${current}`}
        />
        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Previous screenshot"
          data-testid={`button-prev-${slug}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Next screenshot"
          data-testid={`button-next-${slug}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex items-center justify-center gap-2">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              i === current
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-testid={`button-dot-${slug}-${i}`}
          >
            {labels[i]}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectShowcase({ entry }: { entry: ProjectEntry }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {entry.capabilities.map((cap) => (
          <div
            key={cap.title}
            className="rounded-xl border border-border/60 bg-secondary/20 p-4"
            data-testid={`card-capability-${cap.title.toLowerCase().replace(/\s+/g, "-")}`}
          >
            <p className="text-sm font-semibold text-foreground mb-1">{cap.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{cap.detail}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border border-border/60 bg-muted/20 overflow-hidden">
        <div className="px-4 py-2.5 border-b border-border/40 flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
          <span className="ml-2 text-xs font-mono text-muted-foreground">Example conversations</span>
        </div>
        <div className="p-4 space-y-4">
          {entry.conversations.map((conv, i) => (
            <div key={i} className="space-y-1.5">
              <div className="flex gap-2 items-start">
                <span className="text-xs font-mono text-muted-foreground shrink-0 mt-0.5">You</span>
                <p className="text-xs text-foreground bg-primary/8 rounded-lg px-3 py-2 leading-relaxed">
                  {conv.user}
                </p>
              </div>
              <div className="flex gap-2 items-start">
                <span className="text-xs font-mono text-primary shrink-0 mt-0.5">AI</span>
                <p className="text-xs text-muted-foreground bg-secondary/40 rounded-lg px-3 py-2 leading-relaxed">
                  {conv.assistant}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function PortfolioDisplay({ entries = portfolioEntries }: { entries?: PortfolioEntry[] }) {
  return (
    <div className="space-y-24">
      {entries.map((entry, index) => {
        const slug = entry.name.toLowerCase().replace(/[\s&—]+/g, "-").replace(/-+/g, "-");
        return (
          <section
            key={entry.name}
            className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-start`}
            data-testid={`section-product-${slug}`}
          >
            <div className="w-full md:w-3/5">
              {entry.type === "product" ? (
                <ImageCarousel
                  screenshots={entry.screenshots}
                  labels={entry.screenshotLabels}
                  productName={entry.name}
                />
              ) : (
                <ProjectShowcase entry={entry} />
              )}
            </div>

            <div className="w-full md:w-2/5 md:sticky md:top-24">
              {entry.type === "project" && (
                <span className="inline-flex items-center gap-1.5 text-xs font-mono text-primary bg-primary/10 border border-primary/20 rounded-full px-3 py-1 mb-3">
                  <Plug className="w-3 h-3" />
                  {entry.badge}
                </span>
              )}
              <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-2 mt-2">
                {entry.tagline}
              </p>
              <h2
                className="text-2xl md:text-3xl font-serif font-bold mb-4"
                data-testid={`text-product-name-${slug}`}
              >
                {entry.name}
              </h2>
              <p
                className="text-muted-foreground leading-relaxed mb-6"
                data-testid={`text-product-desc-${slug}`}
              >
                {entry.description}
              </p>
              {entry.url && (
                <a
                  href={entry.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
                  data-testid={`link-visit-${slug}`}
                >
                  {entry.type === "project" && entry.urlLabel ? entry.urlLabel : `Visit ${entry.name}`}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
