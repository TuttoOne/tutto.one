# Tutto — Full Site Content

*Exported from tutto.one · May 2026*

---

## Table of Contents

1. [Home](#home)
2. [About](#about)
3. [Services](#services)
4. [Portfolio](#portfolio)
5. [SharePoint Bridge](#sharepoint-bridge)
6. [Praxis](#praxis)
7. [Pythia](#pythia)
8. [Contact](#contact)
9. [Blog: LegalRAG — On-Premise AI for Document-Heavy Litigation](#blog-legalrag)
10. [Blog: How We Gave Claude Direct Access to a Client's SharePoint](#blog-mcp-sharepoint)
11. [Blog: What Anthropic's Labor Market Research Tells Us About AI Readiness](#blog-anthropic-research)
12. [Blog: Why "Machine-Readable" is the New "Mobile-Friendly"](#blog-machine-readable)
13. [Blog: The Messy Middle of Automation](#blog-messy-middle)
14. [Blog: Documentation is Code](#blog-documentation-is-code)

---

## Home

*This is the AI era.*

# Technology Consulting

We build the systems, bridges, and infrastructure that let AI work inside your organisation — not just beside it.

[Book a 30-minute call](https://cal.com/tuttoone/15min) · [About us](/about)

---

### Our Work

**Pythia** — On-Premise AI · Legal Document Intelligence
A self-hosted document intelligence platform for litigation and legal review — built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design.

**MCP Bridge — SharePoint & Power Automate** — Model Context Protocol · Consulting Engagement
We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records — and diagnose broken automations — through natural conversation.

**EntityVault** — entityvault.tutto.one
A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.

**AI ROI Portal** — tracker.tutto.one
A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.

---

## About

# About Us

*A small team with laser focus on your problems.*

We're Tutto — a tight group of AI consultants and builders who work at the intersection of operations, data, and AI. We don't do slide decks and frameworks. We get into the detail of your actual problems, build the thing that solves them, and make sure it works in production.

Our work spans the full range of what AI readiness actually requires. Sometimes that means building an **MCP bridge** that gives your team's AI assistant direct access to SharePoint or Salesforce — so they're asking instead of copy-pasting. Sometimes it means deploying a **self-contained document intelligence platform** on-premise so a legal team can run AI-powered review across 150,000 privileged documents without a single byte leaving the building. Sometimes it means helping a business understand why their AI pilot worked brilliantly in isolation and fails to scale — and fixing the information architecture underneath it.

The common thread: most AI adoption problems aren't AI problems. They're **information architecture problems**. Your knowledge is buried in Slack threads, PDFs, institutional memory, and processes nobody has documented. Humans navigate that ambiguity. AI cannot. Our job is to structure the chaos — turning implicit organisational knowledge into explicit, machine-consumable assets.

### What We Believe

AI is already being used most intensively in exactly the roles that drive the most value — software engineers, analysts, lawyers, researchers, writers. The gap isn't in the tools; it's between what AI can theoretically do for an organisation and what they're actually doing with it today. That gap is where we work.

We believe the businesses that come out ahead won't be the ones who deployed AI first. They'll be the ones who understood their own operations clearly enough to know where AI would make the biggest difference — and had the information infrastructure in place to support it. Building that infrastructure is unglamorous work. It's also the most valuable work we do.

### How We Work

We're small by design. That means every client gets direct access to the people doing the work — not a junior team briefed secondhand. We scope every engagement in a single call, move fast, and ship things that actually run in production. No handoffs to implementation partners. No shelfware.

Most engagements start with a 30-minute conversation. We'll tell you honestly whether we think we can help, and what that looks like.

**Ready to talk?** [Book a Call](https://cal.com/tuttoone/15min) · [Send a message](/contact)

---

## Services

# Services

*Preparing your organisation for the automated workforce.*

### Data Audit & Knowledge Mapping
We audit your existing documentation, databases, and communication channels to create a structured map of your organisational knowledge.

- Audit of Files/CRMs/Software/Drives
- API Readiness Score
- Knowledge Graph Architecture

**Starts at £2k**

---

### AI Agent Architecture
Design and implement specific agent workflows to automate core business processes using your structured data.

- Custom Agent Workflows
- Human-in-the-loop Design
- Tool Selection & Integration

**Custom Scoping**

---

### Team Enablement
Workshops and training to help your team understand how to write for machines and manage AI workers.

- Prompt Engineering Training
- Documentation Standards
- AI Governance Frameworks

**Starts at £3.5k**

---

*Not sure where to start? Run the diagnostic in the chat interface to get a personalised recommendation.*

---

## Portfolio

### Pythia — On-Premise AI · Legal Document Intelligence

**Client Engagement**

A self-hosted document intelligence platform for litigation and legal review — built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design.

**Capabilities:**

- **Document Ingestion at Scale** — 150,000+ files across all formats (PDF, DOCX, MSG, EML, XLSX, TIF, and more). Checkpoint-based processing survives interruptions.
- **Semantic Search & RAG Q&A** — Ask questions in plain English. Every answer cites its source document and page number — no hallucination from the AI's own knowledge.
- **Interactive Timeline** — Chronological view of case events extracted from metadata. Drill from year to month to individual events, filtered by disclosure side.
- **Complete On-Premise Privacy** — OCR, inference, vector search, and storage all run locally on DGX Spark. No cloud APIs. Satisfies Legal Professional Privilege architecturally.

**Example conversations:**

> "Find all documents referencing the March 2023 board meeting and summarise the key decisions."
> Found 14 relevant passages across 6 documents. Key decisions recorded: approval of revised share structure (Exhibit C-112), appointment of interim CFO (Email D-0447), deferral of acquisition vote to Q3 2023 (Board Minutes C-089).

> "Show me all emails between the claimant and defendant between January and April 2022."
> Retrieved 38 emails. Earliest: 4 Jan 2022 (REF: D-0012). Latest: 29 Apr 2022 (REF: D-0891). 12 marked confidential by producing side.

> "Build a timeline of contractual deadlines mentioned across all documents."
> Extracted 23 deadline references. Key dates: 15 Feb 2022 (payment milestone, Contract §4.2), 1 Jun 2022 (option expiry, Addendum B), 30 Sep 2022 (longstop date, original SPA).

---

### MCP Bridge — SharePoint & Power Automate — Model Context Protocol · Consulting Engagement

**Client Engagement**

We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records — and diagnose broken automations — through natural conversation.

**Capabilities:**

- **SharePoint Lists & Structure** — Create lists, add columns of any type, model entity relationships, inspect full schemas.
- **Data Management** — Query items with filters and sorting, create, update, and delete records, run bulk transforms.
- **Power Automate** — List flows, inspect definitions, view run history with error diagnostics, trigger manual flows.
- **Live Documentation** — AI searches current Microsoft docs before answering — no outdated or hallucinated API guidance.

**Example conversations:**

> "List all SharePoint lists on my site."
> Found 8 lists: Tasks, Clients, Projects, Invoices, Contacts, Documents, Assets, Settings.

> "Add a lookup column on Tasks pointing to the Clients list."
> Column 'Client' (lookup → Clients) added to the Tasks list successfully.

> "Show me the last 5 failed Power Automate runs on 'Invoice Sync'."
> Found 5 failed runs. Most recent error: 'Connection timeout to Xero API' — occurred 3 times in the last 24 hours.

---

### EntityVault — entityvault.tutto.one

A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.

[Visit EntityVault](https://entityvault.tutto.one)

---

### AI ROI Portal — tracker.tutto.one

A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.

[Visit AI ROI Portal](https://tracker.tutto.one)

---

## SharePoint Bridge

*Open Source · MCP Server · Free Forever*

# Give AI Direct Access to Your SharePoint

The SharePoint Bridge connects Claude directly to your SharePoint Online environment — search documents, read pages, and surface institutional knowledge without copy-pasting or manual lookups. Just ask.

Free and open source. Used by legal, finance, and operations teams.

[Get Started Free](#how-it-works) · [Book a Walkthrough](/contact) · [View on GitHub](https://github.com/TuttoOne/sp-mcp)

---

### What It Does

Three capabilities that transform how your organisation interacts with SharePoint knowledge.

**Audit**
Claude analyses your SharePoint structure, surfaces stale content, broken permissions, and metadata gaps — producing a prioritised AI-readiness report in minutes.

**Restructure**
Use Claude's findings to rationalise libraries, align content types, and fix site architecture so your SharePoint becomes truly machine-readable.

**Build**
Once your SharePoint is clean and structured, the Bridge lets Claude query it in real time — powering custom AI agents and knowledge workflows for your team.

---

### How It Works

Set up in under 15 minutes. No infrastructure, no middleware, no data exports required.

**01 — Register & Configure**
Create an Azure AD application with Sites.Read.All permissions, clone the repo, and add your tenant ID, client ID, and client secret to a .env file. Full instructions in the README.

**02 — Connect to Claude**
Add one entry to your Claude Desktop MCP config pointing at the server. Restart Claude — your SharePoint is now available as a live tool in every conversation.

**03 — Ask and Act**
Ask Claude to find a document, summarise a page, or run the audit prompt below. The Bridge queries SharePoint in real time and returns the answer in seconds.

[View on GitHub](https://github.com/TuttoOne/sp-mcp)

---

### Free SharePoint Audit Prompt

Not sure if your SharePoint is AI-ready? Paste this prompt into Claude to get an instant structural audit — no MCP setup required. Claude will work through five key areas and give you a prioritised action plan with an AI-readiness score.

```
You are an expert SharePoint consultant helping organisations prepare for AI integration. Audit my SharePoint Online environment and produce a structured report.

Please cover these five areas:

1. Site Architecture - map the current site structure, hub sites, and navigation patterns. Flag any structural issues that will complicate AI indexing or search.

2. Content & Metadata - inventory document libraries, lists, and content types. Identify missing or inconsistent metadata schemas that reduce machine-readability.

3. Permissions & Access - assess the permissions model, broken inheritance points, and access groups. Note any configurations that could expose sensitive content to an AI tool unintentionally.

4. Data Quality - flag stale content (not modified in 12+ months), duplicate files, orphaned sites, and naming inconsistencies that will degrade AI retrieval quality.

5. AI Readiness Score - rate the environment from 1-10 and list the top 5 prioritised actions to make it machine-readable, with estimated effort (Low / Medium / High) for each.

My SharePoint environment:
[Describe your setup here - number of sites, approximate document count, key teams that use it, and any existing metadata or content type work]
```

---

### Industry Templates

Pre-built query templates and audit prompts tailored to SharePoint patterns common in your sector.

| Industry | Status | Examples |
|---|---|---|
| Private Investigation | LIVE | Case file search, Evidence document lookup, Chain of custody |
| Legal Practice | Coming Soon | Contract clause lookup, Matter file search, Policy retrieval |
| Property Management | Coming Soon | Lease document search, Maintenance records, Compliance docs |
| Professional Services | Coming Soon | Client file retrieval, Project knowledge base, Invoice history |

---

### Custom SharePoint Solutions

The open-source bridge handles the common case. For teams that need write-back capabilities, multi-tenant support, on-premises SharePoint, or a fully managed AI workflow built on their document estate — we build it.

| Service | Price | Description |
|---|---|---|
| Data Audit & Knowledge Mapping | From £500 | Understand what you have before you build. We map your SharePoint structure, metadata gaps, and AI-readiness — and hand you a prioritised action plan. |
| Custom MCP Bridge Build | From £5,000 | A bespoke MCP server tailored to your SharePoint environment — custom tools, schemas, permissions model, and end-to-end testing. |
| AI Agent Architecture | From £5,000 | We design and build the AI agents that sit on top of your SharePoint Bridge — automating workflows, surfacing knowledge, and acting on your behalf. |
| Ongoing Support & Training | From £500/month | Monthly retainer covering template updates, model upgrades, usage monitoring, and team training as your SharePoint and AI stack evolve. |

First bridge setup includes a free consultation to scope your integration needs.

[Book a Discovery Call](/contact)

---

## Praxis

*Praxis · Client Training One-Pager · V1*

*A Mental Model in One Page*

---

### What is Praxis?

# A one-hour Teams call that changes how you think about AI.

No technical background needed. The session runs in two halves. The first thirty minutes covers the theory and principles — what AI actually is, how the folder-based system works, and why it changes everything. No jargon.

The second thirty minutes is practical — on your own computer, with your own files. You follow along live as we build the system together. By the end of the hour, you have a working setup and the mental model to take it further.

[Book the 1-hour session](https://cal.com/tuttoone/60-min-meeting) — Teams or Google Meet

**Before the session:** The practical half runs on your computer. To get the most from it, please have Claude installed and a paid subscription active before we start — and ideally Visual Studio Code too. Fill in the form and we'll send you exactly what to set up in advance.

---

# The folder is the app. It runs on your machine. It belongs to you.

You don't need a proprietary platform or an account with us. The only thing you'll need to subscribe to is Claude — about $20 a month — and a free code editor. Point all three at the same folder on your machine. That folder, and what's inside it, is your app.

---

### 01 — The Ingredients

**i. The editor** — Where you work · Free
An open code editor of your choice — these are usually free. It shows the files and lets you edit, search, and talk to your chosen assistant in normal language. Nothing magical, just the workshop bench.

**ii. The assistant** — The intelligence · ~$20/mo
An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version (e.g. Claude at about $20/month) — that's what keeps the work fully secure.

**iii. Your filesystem** — What you already own
Plain folders, plain files — on the computer you already own. No cloud, no database, no proprietary format. Just the same disk you've been using for years. The thing that makes it yours.

*Point all three at the same folder.*

---

### 02 — The Output: A Folder on Disk

```
~/Praxis/folder/
├── SKILL.md       — the rules · written in plain English         [A]
├── run.py         — the script · the work it does                [B]
├── documents/     — your data · the inputs                       [C]
└── output/        — what gets produced
```

**A — SKILL.md**
The instructions you'd give a new hire on day one — written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour.

**B — run.py**
A short script that does the actual work — pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you.

**C — documents/**
Whatever the work needs to process — PDFs, spreadsheets, transcripts, contracts. Drop files in. Pull files out. No upload step.

**Version control, optional**
Because it's a folder, the standard tools just work — git, Time Machine, Dropbox, a USB stick. There's nothing special to back up.

---

### 03 — What It Costs

**The tools** — ~$20/mo
VS Code is free. Claude Pro is ~$20/month. That's the only recurring cost.

**The session · Spring special** — ~~£200~~ £100
Limited time only — usually £200. One hour: 30 minutes of theory and principles, then 30 minutes hands-on on your own computer. You leave with a working setup.

**The diagnostic sprint** — ~£2,500
Two weeks. We look at your real documents and workflows and tell you exactly what is possible.

---

*Ready to see it live?*

Book a one-hour Praxis session. Theory first, then hands-on together — on your machine, with your files.

[Book a session](https://cal.com/tuttoone/60-min-meeting)

---

*Praxis means knowledge proven by doing. It comes from the Greek praxis — action whose purpose is in the action itself. Aristotle separated it from theoria (contemplation) and poiesis (making). Modern usage, after Freire, treats it as the loop of theory, action, reflection, sharper theory.*

*Praxis is the loop of putting theory into practice, then letting what you learn from doing it sharpen the theory.*

---

## Pythia

*Pythia · Legal Document Intelligence · V1*

*Bill for Thinking, Not Searching*

---

### What is Pythia?

# An AI that reads every document. 100% local: at your home or office. A private second brain that can take action.

Juniors spend days reading. Partners wait. The thing you miss is the thing that loses the case. Pythia reads everything — every file, every footnote — and lets you ask questions the way you'd brief a junior.

It runs on your hardware. Nothing leaves your office. No cloud, no third-party APIs, no exposure. Legal Professional Privilege satisfied by architecture, not by policy.

[Book a conversation](https://cal.com/tuttoone/30min) — On-site · Private · UK-built

---

# Read every file. Find what matters. In hours, not days.

Pythia is a self-hosted document intelligence platform for litigation and legal review. It processes entire disclosure sets locally — semantic search, conversational Q&A with citations, interactive timelines, and OCR. Ask it the way you'd brief a junior. It finds every relevant file, and shows you exactly why.

---

### 01 — How It Works

**i. Ask in plain English** — Semantic search · Cited answers
Ask it the way you'd brief a junior. Every answer cites the source document and page number. No guessing. No hallucination from the AI's own knowledge.

**ii. Nothing leaves the office** — On-premise · Zero cloud APIs
OCR, inference, vector search, and storage all run locally on your hardware. No data sent to third parties. Satisfies Legal Professional Privilege architecturally.

**iii. Every document. Every format.** — 150,000+ files · All formats
PDF, DOCX, MSG, EML, XLSX, TIF, and more. Pythia reads in your first disclosure set in a few weeks. New documents are added as they arrive.

---

### 02 — Example Questions

| Stat | What it means |
|---|---|
| 3 days → 3 hours | Document review per matter |
| Zero | Files leave your office |
| Every footnote | Found and explained |

**Example session:**

> **A:** Find all documents referencing the March 2023 board meeting and summarise the key decisions.
> Found 14 relevant passages across 6 documents. Key decisions: approval of revised share structure (Exhibit C-112), appointment of interim CFO (Email D-0447), deferral of acquisition vote to Q3 2023 (Board Minutes C-089).

> **B:** Show me all emails between the claimant and defendant between January and April 2022.
> Retrieved 38 emails. Earliest: 4 Jan 2022 (REF: D-0012). Latest: 29 Apr 2022 (REF: D-0891). 12 marked confidential by producing side.

> **C:** Build a timeline of contractual deadlines mentioned across all documents.
> Extracted 23 deadline references. Key dates: 15 Feb 2022 (payment milestone, Contract §4.2), 1 Jun 2022 (option expiry, Addendum B), 30 Sep 2022 (longstop date, original SPA).

---

### 03 — Engagement

**The diagnostic sprint** — ~£2,500
Two weeks. We review your real documents and workflows and tell you exactly what Pythia can do for your practice.

**The build** — From £20,000
Hardware and custom build, scoped after the diagnostic. Typically four to eight weeks from sign-off to a system running on your premises.

**Ongoing** — ~20% p.a.
Assessed during the build. Covers ingestion of new matter files, system maintenance, and keeping Pythia current as your work evolves.

---

*Ready to see it in your practice?*

Book a thirty-minute conversation. We'll walk through your documents and tell you what's possible.

[Book a conversation](https://cal.com/tuttoone/30min)

---

### On the Name

*The Pythia was the Oracle at Delphi — the one you consulted when you needed an answer from everything that had been heard.*

Pythia was the title given to the high priestess of the Temple of Apollo at Delphi, who served as its oracle. The name derives from Python, the serpent Apollo slew at Delphi. To put a question to the Pythia was not to ask for a guess — it was to receive the distilled answer from everything the oracle had witnessed and absorbed. That is the model: every document, read; every question, answered from the record itself.

---

## Contact

# Get in Touch

We're currently accepting new clients for 2026. If you're interested in structuring your business for AI and/or Automation, we'd love to chat.

- **Email:** daniel (AT) tutto.one
- **Calendar:** [Book a 15-min intro](https://cal.com/tuttoone/15min)
- **Location:** Scotland, London, France, South Africa (Remote Friendly)

---

## Blog: LegalRAG — On-Premise AI for Document-Heavy Litigation {#blog-legalrag}

*Apr 1, 2026 · 7 min read*

Legal privilege is not a policy question. It is an architectural one.

Cloud AI platforms — however capable — require sending your data to someone else's servers. For consumer queries or marketing copy, that's a reasonable trade-off. For privileged case documents in active litigation, it isn't. The legal risk is real, the professional conduct implications are serious, and "we trust the provider's terms of service" is not a defensible answer to a professional privilege challenge.

This is the problem LegalRAG was built to solve. And the solution required rethinking the architecture from the ground up.

### Bring the AI to the Data

The conventional model for AI document review is cloud-in, results-out. Documents travel to the model. LegalRAG inverts this entirely.

Every component runs on a single device, physically located at the client's premises: document ingestion, OCR, text extraction, AI inference, vector search, and storage. The system uses open-weight AI models running locally via Ollama — no external API calls, no data transmission, no cloud dependency of any kind. Legal Professional Privilege is satisfied by architectural design, not by contractual promise.

The hardware is an NVIDIA DGX Spark — a compact but genuinely powerful machine with a GB10 Superchip, 128GB unified memory, and NVMe storage. It fits on a desk. It handles 150,000+ documents with millions of searchable chunks. Each client gets their own unit, configured and deployed at their premises.

### What It Does

**Document ingestion at scale.** Entire disclosure sets — PDFs, Word documents, spreadsheets, emails, images, HTML, XML, and more — are processed, chunked into searchable passages, and embedded as vectors. A checkpoint system means ingestion can run overnight and survive interruptions. The system tracks which side produced each document, preserves reference IDs from eDiscovery platforms, and maintains chain of custody throughout.

**Semantic search.** Ask a question in plain English. Retrieve the most relevant passages across the entire corpus, with citations to specific source documents and page numbers. Filter by disclosure side, document type, date range, or category. No keyword matching — genuine vector similarity search.

**Conversational Q&A.** A chat interface grounded entirely in the document corpus. Every answer cites its source material. The AI synthesises from retrieved passages — it does not hallucinate from its own knowledge. Every answer is traceable back to the original document. The lawyer reviews; the AI assists.

**Interactive timeline.** A collapsible chronological view of case events extracted from document metadata — email dates, creation dates, contractual deadlines. Drill from year to month to individual events, filter by type and disclosure side. Provides an immediate chronological map of the case without manual extraction.

**OCR and scanned document handling.** Optical character recognition for scanned PDFs and image files, with intelligent DPI management. Documents that are redacted or contain minimal text are automatically tagged rather than silently lost.

### Why This Matters for Legal Teams

The market for legal AI has split into two categories that don't serve the middle of the profession well. Enterprise platforms like Harvey are genuinely capable but priced for Magic Circle and Big Law. Generic AI tools (Claude, ChatGPT, Gemini via their standard interfaces) are affordable but cloud-based — unsuitable for privileged material.

LegalRAG is built specifically for barristers' chambers, litigation boutiques, and mid-market firms with 10–100 lawyers handling document-heavy matters. Fraud, family, regulatory, commercial litigation — anywhere that disclosure volume is a genuine problem and cloud is a genuine risk.

### What's Coming

Two features currently in development extend the system significantly.

**Custom taxonomies.** A builder that lets the legal team define case-specific classification frameworks — allegations, issues, parties, transaction types. The AI then classifies every document against the lawyer's own framework, creating searchable categories that reflect how the case is actually structured rather than generic document types.

**Knowledge map.** An interactive visual graph showing connections between documents — shared parties, overlapping dates, cross-references, related transactions. Documents as nodes, relationships as edges, rendered as a navigable visualisation. Surfaces patterns across large document sets that linear review would miss entirely.

### The Broader Principle

LegalRAG is a specific answer to a specific problem. But the underlying principle applies more broadly: there are domains — legal, healthcare, defence, finance — where cloud AI creates risks that on-premise deployment eliminates. The hardware to run capable AI models locally exists now and is becoming more affordable. The question is whether organisations in sensitive sectors are willing to think about deployment architecture as a first-order design question, not an afterthought.

For litigation teams, the answer is increasingly obvious. The privilege risk alone makes it so.

---

## Blog: How We Gave Claude Direct Access to a Client's SharePoint {#blog-mcp-sharepoint}

*Mar 28, 2026 · 6 min read*

There's a frustrating pattern that repeats across almost every AI rollout we see. The team discovers that Claude or ChatGPT can help them with their work. They start copy-pasting data into the chat. The AI gives useful advice. Then they manually carry that advice back into SharePoint, Salesforce, or whatever system they were working in. It works. But it's friction — and friction is where adoption dies.

We just finished an engagement that removes that friction entirely. Here's how it works, and why the underlying technology is one of the most significant quiet shifts in the AI ecosystem right now.

### What MCP Actually Is

MCP stands for Model Context Protocol. It's an open standard created by Anthropic and now backed by the Linux Foundation, OpenAI, Google DeepMind, and others. The short version: it's a universal plug that lets AI assistants connect directly to external tools and data sources.

Before MCP, every AI-to-tool integration was custom-built. You'd hire a developer, they'd write a specific integration between, say, Claude and your database, and then when the API changed (it always changes) you'd need to update it. MCP standardises the contract. One bridge, built once, works across Claude, ChatGPT, and any other MCP-compatible AI platform.

There are already over 500 MCP servers covering platforms like Slack, Salesforce, GitHub, Google Drive, Jira, PostgreSQL, and more. The ecosystem is growing fast — which means the investment in connecting your systems to MCP pays dividends as AI capabilities expand.

### The Engagement: SharePoint & Power Automate

Our client's operations team was managing a complex web of SharePoint lists, lookup relationships, and Power Automate flows. They were spending significant time on data management tasks — querying records, creating and updating items, troubleshooting broken automations — that AI could handle in seconds if it had direct access.

We built an MCP bridge that gives Claude exactly that access. Four capability areas:

**SharePoint lists and structure.** The AI can create lists, add columns of any type (text, number, lookup, calculated, person fields), set up entity relationships between lists, and inspect full schemas. What used to require navigating SharePoint's UI or writing SharePoint REST API calls is now a conversation.

**Data management.** Query items with filters and sorting. Create, update, and delete records. Run bulk data transformations. The AI constructs the correct API calls, executes them, and returns results in readable form.

**Power Automate diagnostics.** List all flows, inspect their definitions, pull run history with error details, and trigger manual flows on demand. When a flow breaks at 2am and someone needs to understand why, they can ask instead of digging through logs.

**Live documentation.** This one surprised the client most. Before this bridge, Claude's answers about SharePoint's Graph API or Power Automate connectors were sometimes outdated — the models were trained on older documentation. Now the AI searches current Microsoft docs before answering technical questions. The accuracy improvement was immediately noticeable.

### What a Session Looks Like

Here's a condensed version of a real interaction from the engagement:

*"List all SharePoint lists on my site."*
Claude returns a clean table: 8 lists found — Tasks, Clients, Projects, Invoices, Contacts, Documents, Assets, Settings.

*"Add a lookup column on Tasks pointing to the Clients list."*
Claude constructs the correct Graph API call, executes it, confirms: "Column 'Client' (lookup → Clients) added to the Tasks list."

*"Show me the last 5 failed runs on the Invoice Sync flow."*
Claude pulls the run history: 5 failures, most recent error is a connection timeout to Xero API — occurred 3 times in the past 24 hours.

The entire session takes minutes. The equivalent work through SharePoint's UI and Power Automate's logs would have taken the better part of an afternoon.

### The Broader Point

MCP isn't just a technical curiosity — it represents a shift in how AI integration works. Instead of each business building bespoke connections between their tools and AI models, there's now a standard. That means the work of connecting your systems gets easier every month, as more platforms ship native MCP support.

The businesses that get ahead of this aren't the ones with the biggest budgets. They're the ones that identify where their teams are spending time on data movement and tool-switching, and methodically remove that friction.

If you're curious whether MCP makes sense for a specific platform in your stack, the scoping conversation usually takes about 30 minutes. Most bridges take 1–3 days to build and configure.

---

## Blog: What Anthropic's Labor Market Research Tells Us About AI Readiness {#blog-anthropic-research}

*Mar 14, 2026 · 7 min read*

Anthropic recently published one of the most detailed looks at how AI is actually being used in the real world. By analysing over a million conversations with Claude — with user consent — they mapped which occupations, tasks, and industries are most exposed to AI assistance right now. The findings are striking, and they carry direct implications for any business trying to plan for an AI-first future.

### The Most-Used Task Categories

The first thing that jumps out is where people are spending their time with AI. Software development and coding dominate, making up well over a third of all conversations. Writing and editing come second. After that, you see a long tail of analytical, research, and creative tasks.

This isn't just a snapshot of "what Claude users do." It's a leading indicator of where AI capability is deepest and where businesses have the most to gain — or the most to adapt to.

### The Wage Exposure Inversion

Previous waves of automation — think factory robots, ATMs, customer-service phone trees — disproportionately affected lower-wage, routine physical jobs. AI appears to work differently.

The research found that **higher-wage occupations are more exposed to AI assistance, not less.** Lawyers, analysts, software engineers, researchers, writers — these are the roles where Claude is being used most intensively. For the first time, automation pressure is being felt at the top of the income ladder as much as the bottom.

This inverts the assumption many businesses have made: that AI is a back-office cost-cutting tool. It's increasingly a front-office capability tool.

### Augmentation, Not Replacement

Perhaps the most important nuance in the data: most AI use is **augmentative** — AI is helping humans do their jobs better and faster, not replacing them outright.

This distinction matters enormously for how businesses should plan. A fully automated task requires you to redesign a workflow. An augmented task requires you to upskill the person doing it. Both need investment, but they're very different investments.

### The Capability Gap: Where the Real Opportunity Lives

The most striking chart in the entire study isn't any of the numbers above — it's a radar diagram that overlays two things: theoretical AI capability across occupational categories (blue), and how much AI is actually being used in those categories today (red).

Every sector where blue extends far beyond red is a place where businesses are leaving value on the table. The gap isn't a sign that AI isn't ready — it's a sign that the organisations in those sectors haven't caught up yet. Legal, management, education, architecture, life sciences, healthcare — in all of these areas, the tools already exist to do far more than most teams are doing with them.

The wider the gap between theoretical coverage and observed usage, the bigger the untapped opportunity. And in many high-value sectors, that gap is enormous. Businesses that close it first will have an advantage that compounds over time, because they'll build the workflows, the institutional knowledge, and the data infrastructure that makes each subsequent improvement easier to capture.

### What This Means for Business Readiness

The research paints a clear picture of where AI capability is concentrated right now. If your business relies heavily on software development, writing, analysis, or research — you're operating in the highest-exposure zones. That's not a warning sign. It's an opportunity.

#### The Readiness Gap

Most businesses fall into one of two failure modes:

- **The Pilot Trap:** They've run a proof-of-concept that worked brilliantly in isolation and now can't scale it into real operations.
- **The Waiting Room:** They're holding out for AI to "mature" before engaging — not realising the early movers are already compounding advantages.

The Anthropic data suggests the gap between AI-ready and AI-naive organisations is widening faster than most expect. The high-exposure roles — the ones being augmented most aggressively — belong disproportionately to the knowledge workers who drive revenue, strategy, and product.

#### Three Actions Worth Taking Now

1. **Map your exposure.** Which roles in your organisation are in the high-exposure categories? Software developers and writers are obvious. But financial analysts, legal reviewers, and operations researchers are next in line.
2. **Audit your knowledge infrastructure.** Augmented workers need clean, structured, machine-readable information to work from. If your internal knowledge is buried in PDFs and tribal memory, you're capping what AI can do for you.
3. **Start with the highest-value augmentation target.** Not the cheapest task to automate — the most valuable one to accelerate. If your analysts spend 60% of their time gathering data and 40% actually analysing it, help them flip that ratio.

### The Bigger Picture

What Anthropic's research confirms is that the AI transition is not a future event. It's happening now, unevenly distributed, and concentrated in exactly the kinds of knowledge-intensive roles that most businesses depend on most. The organisations that come out ahead won't necessarily be the ones who deployed AI first. They'll be the ones who understood their own operations clearly enough to know where AI would make the biggest difference — and who had the information architecture in place to support it.

That's the work. And most businesses haven't started it yet.

---

## Blog: Why "Machine-Readable" is the New "Mobile-Friendly" {#blog-machine-readable}

*Feb 3, 2026 · 5 min read*

Remember 2010? Every business scrambled to make their website "mobile-friendly." If your site didn't work on a smartphone, you were invisible to a growing chunk of your audience.

We're at a similar inflection point right now — except the audience isn't humans on phones. It's AI agents, large language models, and automated workflows trying to understand your business.

### The Shift No One's Talking About

Most businesses are optimised for human consumption. Beautiful websites, well-designed PDFs, polished pitch decks. But here's the problem: **AI can't read your pitch deck.**

When a potential client asks ChatGPT "Who are the best AI consultants in London?", the answer isn't pulled from your beautifully designed homepage. It's synthesised from structured data, clear documentation, and machine-readable content scattered across the web.

### What "Machine-Readable" Actually Means

Being machine-readable isn't about adding schema markup to your HTML (though that helps). It's a fundamental shift in how you think about your business information:

- **Your services** need to be described in clear, unambiguous language — not marketing fluff
- **Your expertise** needs to be documented in public, indexable formats
- **Your processes** need APIs, not just SOPs buried in Google Drive
- **Your pricing** needs structure, not "contact us for a quote"

### The Companies Getting This Right

The businesses winning in 2026 are the ones that made their knowledge accessible to machines *before* they needed to. They documented their processes. They structured their data. They built APIs into their workflows.

They didn't do this because they were "AI-first" evangelists. They did it because good information architecture is good business practice. AI readiness was a side effect of operational excellence.

### What You Can Do Today

1. **Audit your public information.** Can an AI accurately describe what you do from your web presence alone?
2. **Document your internal processes.** If a new hire can't find it, neither can an AI agent.
3. **Structure your data.** Move from prose to structured formats wherever possible.
4. **Think in entities, not pages.** Your business has products, services, team members, case studies — model them as data, not just web pages.

The mobile-friendly revolution rewarded companies that adapted early. The machine-readable revolution will do the same. The question is: will you be ready?

---

## Blog: The Messy Middle of Automation {#blog-messy-middle}

*Jan 20, 2026 · 4 min read*

Every company I work with has the same story. The founder or a tech-savvy team lead built something clever — a GPT wrapper that summarises customer emails, a script that auto-categorises support tickets, a chatbot that answers basic product questions.

It works brilliantly. On their laptop. For about three weeks.

Then reality hits.

### The Pilot Trap

The initial AI pilot is intoxicating. You prompt an LLM, it produces something useful, and suddenly you feel like you've unlocked the future. The demo goes great. Leadership is excited. Budget is approved.

But scaling from "it works on my machine" to "it works for the whole company" is where 90% of these projects die. I call this **The Messy Middle**.

### Why Pilots Fail to Scale

The reasons are almost never technical. They're organisational:

**1. The data isn't ready.**
Your pilot worked because you hand-curated the input data. You cleaned it, formatted it, cherry-picked the good examples. In production, the data is messy, inconsistent, and full of edge cases nobody warned you about.

**2. Nobody owns it.**
The founder built it as a side project. Now it needs monitoring, maintenance, error handling, and someone to answer "why did it say *that*?" at 3am. Who's responsible? Usually nobody.

**3. Trust hasn't been earned.**
The team doesn't trust the AI's output because they've never seen it fail gracefully. One bad result and the whole project gets labelled "not ready."

**4. The process wasn't documented.**
The pilot bypassed your existing workflows. Now you need to integrate it into real business processes, and nobody wrote down how those processes actually work.

### Getting Through the Middle

The companies that successfully scale their AI pilots share three traits:

- **They invest in data infrastructure before they invest in AI.** Clean, structured, accessible data is the foundation. Without it, every AI project is built on sand.
- **They assign ownership.** Someone (a person, not a committee) is responsible for the AI's output quality, uptime, and continuous improvement.
- **They start with augmentation, not automation.** Instead of replacing a workflow, they enhance it. The human stays in the loop until trust is earned through track record.

### The Uncomfortable Truth

The Messy Middle isn't a problem to solve — it's a phase to endure. Every successful automation went through it. The difference between companies that emerge from the other side and those that don't isn't talent or budget.

It's patience, process, and a willingness to do the boring work of data preparation before the exciting work of AI deployment.

If you're stuck in the Messy Middle right now, that's actually a good sign. It means you started. Most companies haven't even done that.

---

## Blog: Documentation is Code {#blog-documentation-is-code}

*Jan 8, 2026 · 6 min read*

Here's a thought experiment: What if your company wiki went down for a week?

If the answer is "nobody would notice," you have a documentation problem. If the answer is "everything would grind to a halt," congratulations — you've accidentally built something valuable. Now treat it that way.

### The Wiki Graveyard

Most company wikis are where good intentions go to die. Someone creates a page during onboarding. It gets updated once. Then it sits there, slowly rotting, until it's so outdated that everyone knows to ignore it.

Sound familiar? You're not alone. But here's why this matters more than ever: **your documentation is now the training data for your AI tools.**

### Documentation as Infrastructure

When you deploy an AI assistant to help your team, what does it learn from? Your documentation. When you build a customer-facing chatbot, what knowledge base does it draw from? Your documentation. When you automate a workflow, what rules does it follow? Your documentation.

Bad docs don't just frustrate new hires anymore. They produce bad AI outputs, which produce bad business decisions, which cost real money.

### Treating Docs Like Code

Software engineers figured this out years ago. Code has:

- **Version control** — you can see what changed, when, and why
- **Reviews** — changes are reviewed before they go live
- **Testing** — automated checks ensure nothing is broken
- **Ownership** — every file has a maintainer
- **Standards** — consistent formatting, naming, and structure

Your documentation needs all of these things. Here's what that looks like in practice:

**Version Control**
Don't just edit a wiki page. Track changes. Know who updated what and when. If something breaks, you need to roll back.

**Reviews**
Major documentation changes should be reviewed, just like code. Not by committee — by the person who owns that process or domain.

**Testing**
Can your AI assistant answer questions correctly using this documentation? Test it. Regularly. If the AI gives wrong answers, your docs are wrong.

**Ownership**
Every document needs an owner. Not a team — a person. Someone who is responsible for keeping it accurate and current.

**Standards**
Consistent structure makes documentation machine-readable. Use templates. Define what "done" looks like for a doc page. Enforce it.

### The Payoff

Companies that treat documentation as infrastructure get three things:

1. **Faster onboarding.** New hires (human and AI) get up to speed faster.
2. **Better AI outputs.** Your tools are only as good as the knowledge you feed them.
3. **Institutional resilience.** When someone leaves, their knowledge doesn't leave with them.

### Start Here

Pick one critical process in your business. Document it as if you were explaining it to a competent stranger who will need to do it tomorrow without any help. Use clear, structured language. No jargon. No assumptions.

Then feed that documentation to an AI and ask it questions. If it answers correctly, you've written good documentation. If it doesn't, revise until it does.

That's the bar now. Documentation isn't just for humans anymore. It's for machines too. And machines are much less forgiving of ambiguity.

---

*tutto.one · daniel@tutto.one · Scotland, London, France, South Africa*
