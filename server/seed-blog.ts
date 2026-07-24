import { storage } from "./storage";

// ─────────────────────────────────────────────────────────────────────────────
// This is the SINGLE source of truth for seeding blog posts into the database.
// The live site reads posts from the DB (edit them via the /admin dashboard);
// this array only seeds an empty database.
//
// ⚠️  `content` and `excerpt` are backtick-delimited template literals. If your
//     text needs a literal backtick (`) — e.g. for inline code — you MUST escape
//     it as \` , otherwise the string ends early and the whole build breaks.
//     The blog renderer supports inline code with single backticks in the OUTPUT,
//     so in source write it as:  \`like this\`
//     (The old duplicate copy of this data in client/src/lib/chat-data.ts was
//      removed — do not reintroduce it.)
// ─────────────────────────────────────────────────────────────────────────────
export const BLOG_SEED_DATA = [
  {
    slug: "the-best-combination",
    title: "The Best Combination",
    excerpt: "A principle. Why the person plus the machine is always the best combination - and why bringing down the barriers as low as possible is the only logical move.",
    date: "Jun 5, 2026",
    readTime: "4 min read",
    introCard: JSON.stringify({
      tagline: "A principle",
      headline: "The best combination is always the person plus the machine.",
      sub: "Why unlocking this for everyone is the only logical move.",
    }),
    published: true,
    content: `After losing to Deep Blue in 1997, Kasparov didn't walk away from chess or from computers. He invented Advanced Chess - a format where humans and machines play together. The best combination, he found, wasn't one or the other. It was both.

That's the idea everything here is built on.

The goal is to make awareness about the systems at work so accessible that it's easy enough for every person to use machines to their maximum capabilities. There are rules, complexities, and a world of creativity in the unlikely combinations of things - combinations that have been part of the unlikelihood of life itself - which we have to learn from.

People are afraid of what they don't know, of losing control, of not being the top dogs, of losing their livelihoods. These fears are real and they're reasonable. But if the best combination in every situation is the person plus the machine - which allows each one of us to be a better version of ourselves for the benefit of the whole - then the logical move is to bring down the barriers as low as we possibly can.

No matter how fast we can build things in code, there is always a time constraint. Anything we build takes time to get right. It's in iteration, and in absorbing more content to learn from, that we can fabricate better systems. We can continually provide reasons for a situation being right - but just as important, we must show the systems we create what wrong means and looks like in every situation. Training runs in both directions.

If we can go through a process of creating training and coaching that is perfectly geared to each individual's context, we will be in a position we have never been in before. It's similar to the notion that we could be at the dawn of creating content that is instantaneously built - a world of choose your own adventure that is context and content aware at a level we cannot yet comprehend.

Imagine if this were the case for education within every aspect of our lives. The ability to teach in the right way, with examples that land, with tone so precisely suited to your current state of mind that you stay engaged - and more than that, lean deeper and participate in the creation of artefacts in order to improve yourself and the world around you. Not a course, not a manual. Something that moves at your pace and meets you where you are.

We tune each other. We lean on each other. And we have mechanisms of being the physical and thinking companions to one another that we've only really dreamed of in the past. This really does feel like a world of science fiction.

This is the dream.

To get there practically, each gap needs to be assessed by a couple of criteria: is the task a knowledge gap or an action gap? Often both, and that's fine. But in order to work towards a limitless world of opportunity and creation, we need to be able to categorise the gap, triage the solution, and plan and execute the delivery.

The foundational aspect of this solution-based approach is teaching and coaching people to lean into the world of AI so that we can all play our part in refining the tasks we encounter. Everyone needs to learn how to use it. It's an exploration. We can all understand it because it speaks our language. We can see its shortcomings, and we must report these and create lasting fixes - not work around them.

The question is distribution. How do we get this to everyone - as ubiquitous as Coca-Cola? We need to put the fridge everywhere. We must grant access to everyone at the highest possible level. We must provide the ability to self-train. We must have guides that we trust.

That's the work.`,
  },
  {
    slug: "machine-readable-knowledge",
    title: "Making Knowledge Machine-Readable",
    excerpt: "Brian Madden has built a public knowledge system that lets AI draw on his thinking in real time. The same methodology sits at the heart of Praxis - and he deserves the credit.",
    date: "Jun 4, 2026",
    readTime: "4 min read",
    introCard: null,
    published: true,
    content: `[Brian Madden](https://brianmadden.ai) has built something I wish existed when I started thinking about how AI should work with professional knowledge. His public knowledge repository at [brianmadden.ai](https://brianmadden.ai) is a worked example of an idea that most organisations are still trying to articulate: if you want AI to work well with your thinking, your thinking has to be structured in a way that AI can actually work with.

This post is about what he has built, why the principles matter, and why it connects directly to what Praxis teaches.

## What brianmadden.ai is - and what it is not

The FAQs on Brian's site are the best starting point and they are worth reading carefully. The distinctions he draws are precise, and each one rules out a different misunderstanding.

**Is it a chatbot?**

No. It is a data source your AI connects to. You talk to your AI, and it draws on Brian's knowledge when relevant. It is more like an always-updated context and knowledge source for your chatbot than a chatbot itself.

**Is it a digital twin?**

No. A digital twin simulates a person. This makes published thinking accessible. The distinction matters: a simulation tries to reproduce behaviour; a knowledge repository makes reasoning transparent and reusable.

**Where does it come from?**

Brian maintains a personal AI-powered knowledge system - sometimes called a second brain - which is how he uses AI on a daily basis. That system has everything he needs to work: content, ideas, his to-do list, thinking, meeting notes, documents, plans. [brianmadden.ai](https://brianmadden.ai) is a subset of that private system, updated daily. Content flows from the private system to the public repository using explicit publishing principles.

**How current is it?**

The "current thinking" file updates frequently. The synthesis updates when new posts are published. Crucially, the AI flags stale content rather than presenting old thinking as current - a design decision that most knowledge systems do not make.

**Can you fork it?**

Yes. The GitHub repo is the source of truth. Fork it, build on it, use the frameworks in your own work.

## Why these principles matter

What Brian has built is a demonstration of something important: the gap between "AI gives good answers" and "AI does my actual work reliably" is almost always a knowledge-structure problem, not a model problem.

A browser chatbot does not have access to your documents, your precedents, your institutional knowledge, or your professional judgement. It guesses what a reasonable answer looks like based on everything it was trained on. That is genuinely useful for one-off questions. It is a liability for anything you want to run consistently, at scale, with your specific standards applied.

The solution is not a better model. It is better-structured knowledge - explicit, current, machine-readable, and forkable.

## Why Praxis teaches this methodology

Praxis is the training programme that teaches you to build that structure for your own work. The skill file - the central artefact in every Praxis session - is the working implementation of exactly this idea. Professional knowledge written down in plain English, structured so that a script can read it and apply it the same way, every time.

The Praxis course materials are themselves built on this principle. The course content is maintained as a structured knowledge repository - a folder of markdown files, organised by topic, written to be read by both humans and AI. You can explore it in the [Praxis course library](https://tutto.one/praxis/learn/praxis-foundations).

## The credit

The idea of publishing a personal knowledge system as a GitHub repo - open, shareable, and forkable by anyone - is something Brian pioneered, and I want to attribute that to him directly.

If this framing is useful to you, his site is the place to go deeper.

[brianmadden.ai](https://brianmadden.ai)`,
  },
  {
    slug: "praxis-closed-loop",
    title: "The Podcast That Clarified Why Praxis Exists",
    excerpt: "A Lenny's Newsletter article made something click for me about why most AI training fails. The answer was already in how Praxis was built - I just had not said it clearly enough.",
    date: "Jun 2, 2026",
    readTime: "5 min read",
    introCard: null,
    published: true,
    content: `A few months ago I read a piece on [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense) that clarified something I had been circling. The article is by Tal Raviv and Aman Khan, and the argument is about what they call "AI product sense" - the ability to correctly anticipate what will be truly impactful for users and what is actually feasible with AI. Their claim: you do not build it by reading explainer posts. You build it by getting your hands into coding agents and doing real work with them.

The reason, they argue, is that consumer tools like ChatGPT are opaque. You type, something comes back. You have no idea why it came back that way, what the model was doing, or where it broke down. Coding agents like Claude Code are different: you can read the reasoning, watch the tool calls, see the context window fill up. You hit the same walls that engineers hit. And in hitting them, you start to actually understand how the thing works.

Reading that, I thought: that is exactly the problem Praxis was built to solve. And I had not been saying it clearly enough.

## Most AI training is the wrong kind of hard

There is a lot of AI training available right now. Most of it is either too abstract or too tutorial-ised. The abstract kind teaches you concepts without letting you touch anything - you leave knowing what a context window is but not feeling it run out on a real task. The tutorial kind walks you through a pre-baked exercise where everything goes right and you leave with a screenshot but not a skill.

Anthropic's own learning platform at [anthropic.skilljar.com](https://anthropic.skilljar.com/) is genuinely good. The courses are well-made. They cover the ground properly - from the basics of what Claude is and how to use it, through Claude Code, the API, Model Context Protocol, agents and subagents, and specialist tracks for educators, small businesses, and nonprofits. The content is correct and the theory is solid.

What it cannot do is sit next to you.

## What Praxis adds

Praxis is built on the Anthropic curriculum. The [course library](https://tutto.one/courses) contains the materials from sixteen of those courses - everything from Claude 101 through to Introduction to Subagents and AI Fluency for Small Businesses - adapted for guided sessions. Every session starts from the theory the Anthropic course establishes and then does one more thing: you build something real with it, in the session, while I watch.

The difference this makes is the same difference Tal and Aman describe in the article. When you are building live - when the tool does something unexpected, or the context runs out, or the first version of the tool does not quite do what you needed - you feel those moments and we work through them together. That is where the understanding actually forms. Not in reading about it, but in hitting the problem and finding your way out of it with someone who has done it before.

The sessions cover the same ground as the Anthropic courses but in a different order: output before theory. You see what the thing does before I explain why it works that way. Most people find that the theory lands twice as hard once they have already seen the behaviour.

## The closed loop

Here is the part that I think is genuinely useful: Anthropic offers certification. Once you have been through the programme, you have the theory from the curriculum, the practical experience from the sessions, and the ability to sit the Anthropic tests and get certified.

That is the closed loop. Theory, practice, and a credential that means something because it comes from the people who built the model.

The [Praxis course library](https://tutto.one/courses) covers sixteen tracks:

- **Claude 101** and **Claude Code 101** - the foundations, including how the tools work and what they are actually good for
- **Claude Code in Action** and the **Anthropic API** track - getting into the practical layer, connecting tools, building real things
- **Model Context Protocol** - how AI connects to the software you already use
- **Agent Skills** and **Subagents** - how to build things that can take actions, not just answer questions
- **AI Fluency** tracks for educators, students, small businesses, and nonprofits - the same foundations applied to specific contexts

Each of these has a corresponding Praxis session: a guided, practical hour where you work through the material on something from your own work rather than a generic exercise.

## Who this is for

If you have already started exploring AI tools and you want to get further - faster, with less confusion, and with a clear path to certification - this is the practical layer the Anthropic curriculum does not provide on its own.

If you are an educator, a consultant, or someone who wants to teach this material yourself, the [Praxis trainer track](/become-a-trainer) builds on the same foundation.

The Lenny's article is worth reading if you want to understand the argument for why hands-on matters. The short version is that you cannot build intuition about a tool from the outside. You have to use it, break it, and understand what just happened. That is what Praxis is for.

Details and booking at [/praxis](/praxis) and [/praxis-programme](/praxis-programme).`,
  },
  {
    slug: "glasswing-security-threshold",
    title: "AI Has Crossed the Security Threshold. Your Patch Cycle Has Not.",
    excerpt: "Anthropic's Project Glasswing scanned over 1,000 open-source projects and found 6,202 high or critical vulnerabilities - at 90% accuracy. The problem is not the finding. It is how long it takes to fix.",
    date: "May 27, 2026",
    readTime: "5 min read",
    introCard: null,
    published: true,
    content: `Anthropic published an initial update on [Project Glasswing](https://www.anthropic.com/research/glasswing-initial-update) this week. It is nominally an announcement about a security initiative. What it actually describes is a threshold being crossed - and most organisations have not thought through what that means.

## What Glasswing is

Glasswing is Anthropic's effort to use their most capable model, Claude Mythos Preview, to find vulnerabilities in critical software before attackers do. The launch partners include AWS, Apple, Cisco, Google, Microsoft, NVIDIA and JPMorganChase. Anthropic is committing $100 million in usage credits and $4 million in direct donations to open-source security organisations.

The headline framing is defensive: we are using AI to protect infrastructure. That framing is correct. It is also incomplete.

## What the numbers mean

Over the last few months, Mythos Preview scanned more than 1,000 open-source projects. It found 23,019 vulnerabilities in total. Of those, 6,202 were classified as high or critical severity.

Anthropic then sent 1,752 of the high/critical findings to six independent security research firms for assessment. 90.6% - 1,587 - were confirmed as valid true positives. 62.4% were confirmed high or critical.

Work through the arithmetic. At that true positive rate, Mythos Preview has surfaced close to 3,900 real high-or-critical vulnerabilities in open-source code from a scan that took months, not years. That number will continue rising: Anthropic says they intend to keep scanning.

The scale is not the story. The rate is. A 90% true positive rate on vulnerability discovery is not a research result. It is an operational capability.

## The benchmark saturation point

Anthropic notes that Mythos Preview has improved to the point where it "mostly saturates existing benchmarks" for vulnerability discovery. As a result, they have supported the creation of two new benchmarks - ExploitBench and ExploitGym - specifically to track frontier models' exploit development capabilities going forward.

When a model saturates a benchmark, the benchmark stops being informative. What replaces it is real-world testing, which is what Glasswing is. The move from benchmarks to production scanning is not a methodological choice. It is an acknowledgement that the capability has outgrown the measurement.

The implication is direct: AI systems can now find and construct exploits for software vulnerabilities at a level that surpasses all but the most skilled human security researchers. Anthropic states this explicitly in the update.

## wolfSSL

The concrete example in the update is worth sitting with. wolfSSL is an open-source cryptography library used by billions of devices - routers, embedded systems, IoT hardware. Mythos Preview found a vulnerability and constructed a working exploit that would allow an attacker to forge certificates, enabling them to impersonate banks or email providers to any device running the affected library.

This is not an academic finding. Certificate forgery at scale enables phishing and man-in-the-middle attacks that are effectively undetectable by end users. The device trusts the certificate. The user trusts the device.

wolfSSL has been notified. The fix exists. The question, as always, is how quickly it reaches the billions of devices that are running the vulnerable version.

## The real problem: asymmetry

The threat model that most security teams are operating under assumes a rough parity between attacker capability and defender response time. Attackers find vulnerabilities. Security researchers validate them. Patches are developed. Organisations apply them on a quarterly cycle, or when a critical advisory arrives.

What Glasswing demonstrates is that the finding side of this equation has been radically accelerated. A model can scan 1,000 projects in months. It can construct working exploits, not just flag potential weaknesses. It can do this continuously, at scale, and the capability is improving.

The fixing side has not changed. Patch testing, deployment pipelines, dependency management, and the organisational friction involved in pushing updates to production systems all operate on the same timelines they did five years ago.

That gap is the actual problem. The Glasswing initiative is Anthropic putting defenders on the right side of it. But defenders only benefit if they can absorb and act on findings faster than the vulnerability window stays open.

## What this means in practice

The update cites NIST and the UK's NCSC recommending that defenders shorten patch testing and deployment timelines, harden network default configurations, enforce multi-factor authentication, and maintain comprehensive logs. These are not new recommendations. They are newly urgent ones.

A few things worth assessing in your own organisation:

- **Patch velocity.** How long does it take from a critical advisory to confirmed deployment across your estate? If the answer is measured in weeks or months, that gap is your exposure window. Mythos Preview can construct a working exploit in the time it takes your change management process to schedule a maintenance window.

- **Dependency inventory.** Do you know which of your systems depends on wolfSSL, or any of the other 1,000 projects that Glasswing has scanned? If your software bill of materials is incomplete or out of date, advisory notifications will not reach the right people in time.

- **MFA coverage.** The banking example in the update involved a threat actor who compromised a customer email account and used it to social-engineer a wire transfer. The entry point was not a zero-day. It was a credential. MFA is not a sophisticated control. The absence of it remains one of the most common factors in successful attacks.

The Glasswing initiative is genuinely good news. Anthropic is using a capability that could be used offensively to get ahead of the attack surface. But the benefit only materialises if organisations on the receiving end can actually move at the speed the threat now requires.

The threshold has been crossed. The question is whether your operational tempo has caught up with it.`,
  },
  {
    slug: "important-steps-ai-journey",
    title: "Important Steps in Any AI Journey",
    excerpt: "Before the tools matter, the knowledge has to be there. Three things that need to happen in roughly this order in any serious AI adoption.",
    date: "May 20, 2026",
    readTime: "4 min read",
    introCard: null,
    published: true,
    content: `Most organisations approach AI the wrong way around. They start with the tools - which model, which platform, which chat interface - and wonder why the outputs are inconsistent and the productivity gains are smaller than expected.

The tools are fine. The problem is that the tools have nothing solid to work with. Good AI outputs depend on well-structured inputs: clear documentation, mapped processes, explicit rules. Most organisations do not have these. Not because they have not tried, but because until now there was no external pressure to be that precise.

AI changes the pressure. Here are three things that need to happen in roughly this order.

## Know what knowledge you actually have

The first step is a data audit and knowledge mapping exercise. Not a technology project - a knowledge project.

You are trying to answer three questions: what information exists in your organisation, where does it live, and how consistent is it? Most organisations find the answer surprising. Knowledge is distributed across email threads, shared drives, individual hard drives, tribal memory, and software systems that do not talk to each other.

The output of this exercise is a map: what you have, what format it is in, where the gaps are, and what an AI agent would need to do useful work with any of it. It also produces a practical assessment of what is already accessible to AI versus what needs to be restructured first.

This work does not require any AI tools to do it. It requires honest investigation and clear documentation.

## Design workflows before automating them

The second step is designing the specific workflows that AI can run reliably.

The mistake here is rushing to automation before you have a deterministic description of the process. A language model will generate something plausible. Plausible is not the same as correct, and it is not the same as consistent. Before you automate anything, you need to be able to describe exactly what the correct output looks like, what inputs it depends on, and what rules it follows.

That description becomes the skill file - the plain-English specification that governs what the agent does. The agent runs the same rules against the same inputs and produces the same output, every time.

This is where most organisations slow down. The work of making tacit knowledge explicit - pulling the rules out of people's heads and onto paper - is harder than it sounds and more valuable than it looks.

## Build capability in your team

The third step is team enablement: training the people who will use, maintain, and extend these systems.

This is not prompt engineering training. It is something more durable: teaching people to write for machines. To document their expertise as if they were briefing a very capable, very literal colleague who has no context and will follow instructions exactly as written.

Teams that develop this capability get compounding returns. Every process they document becomes usable by AI. Every rule they write explicitly becomes part of an organisational knowledge base that outlasts any individual.

Teams that skip this step find themselves dependent on whoever set up the initial system, unable to change it when things shift.

## In order

These three steps are not independent. The audit reveals what is worth structuring. The architecture turns structured knowledge into working systems. The training builds the people who keep those systems honest.

Doing them in a different order is not impossible. But starting with the tools without the knowledge is the most common way to spend significant money and end up back where you started.`,
  },
  {
    slug: "legalrag-on-premise-ai",
    title: "LegalRAG: On-Premise AI for Document-Heavy Litigation",
    excerpt: "How we built a self-hosted document intelligence platform that gives litigation teams AI-powered review without a single byte of privileged material ever leaving the building.",
    date: "Apr 1, 2026",
    readTime: "7 min read",
    introCard: null,
    published: true,
    content: `Legal privilege is not a policy question. It is an architectural one.

Cloud AI platforms - however capable - require sending your data to someone else's servers. For consumer queries or marketing copy, that's a reasonable trade-off. For privileged case documents in active litigation, it isn't. The legal risk is real, the professional conduct implications are serious, and "we trust the provider's terms of service" is not a defensible answer to a professional privilege challenge.

This is the problem LegalRAG was built to solve. And the solution required rethinking the architecture from the ground up.

## Bring the AI to the Data

The conventional model for AI document review is cloud-in, results-out. Documents travel to the model. LegalRAG inverts this entirely.

[VISUAL:legalrag-architecture]

Every component runs on a single device, physically located at the client's premises: document ingestion, OCR, text extraction, AI inference, vector search, and storage. The system uses open-weight AI models running locally via Ollama - no external API calls, no data transmission, no cloud dependency of any kind. Legal Professional Privilege is satisfied by architectural design, not by contractual promise.

The hardware is an NVIDIA DGX Spark - a compact but genuinely powerful machine with a GB10 Superchip, 128GB unified memory, and NVMe storage. It fits on a desk. It handles 150,000+ documents with millions of searchable chunks. Each client gets their own unit, configured and deployed at their premises.

## What It Does

**Document ingestion at scale.** Entire disclosure sets - PDFs, Word documents, spreadsheets, emails, images, HTML, XML, and more - are processed, chunked into searchable passages, and embedded as vectors. A checkpoint system means ingestion can run overnight and survive interruptions. The system tracks which side produced each document, preserves reference IDs from eDiscovery platforms, and maintains chain of custody throughout.

**Semantic search.** Ask a question in plain English. Retrieve the most relevant passages across the entire corpus, with citations to specific source documents and page numbers. Filter by disclosure side, document type, date range, or category. No keyword matching - genuine vector similarity search.

**Conversational Q&A.** A chat interface grounded entirely in the document corpus. Every answer cites its source material. The AI synthesises from retrieved passages - it does not hallucinate from its own knowledge. Every answer is traceable back to the original document. The lawyer reviews; the AI assists.

**Interactive timeline.** A collapsible chronological view of case events extracted from document metadata - email dates, creation dates, contractual deadlines. Drill from year to month to individual events, filter by type and disclosure side. Provides an immediate chronological map of the case without manual extraction.

**OCR and scanned document handling.** Optical character recognition for scanned PDFs and image files, with intelligent DPI management. Documents that are redacted or contain minimal text are automatically tagged rather than silently lost.

## Why This Matters for Legal Teams

The market for legal AI has split into two categories that don't serve the middle of the profession well. Enterprise platforms like Harvey are genuinely capable but priced for Magic Circle and Big Law. Generic AI tools (Claude, ChatGPT, Gemini via their standard interfaces) are affordable but cloud-based - unsuitable for privileged material.

LegalRAG is built specifically for barristers' chambers, litigation boutiques, and mid-market firms with 10-100 lawyers handling document-heavy matters. Fraud, family, regulatory, commercial litigation - anywhere that disclosure volume is a genuine problem and cloud is a genuine risk.

## What's Coming

Two features currently in development extend the system significantly.

**Custom taxonomies.** A builder that lets the legal team define case-specific classification frameworks - allegations, issues, parties, transaction types. The AI then classifies every document against the lawyer's own framework, creating searchable categories that reflect how the case is actually structured rather than generic document types.

**Knowledge map.** An interactive visual graph showing connections between documents - shared parties, overlapping dates, cross-references, related transactions. Documents as nodes, relationships as edges, rendered as a navigable visualisation. Surfaces patterns across large document sets that linear review would miss entirely.

## The Broader Principle

LegalRAG is a specific answer to a specific problem. But the underlying principle applies more broadly: there are domains - legal, healthcare, defence, finance - where cloud AI creates risks that on-premise deployment eliminates. The hardware to run capable AI models locally exists now and is becoming more affordable. The question is whether organisations in sensitive sectors are willing to think about deployment architecture as a first-order design question, not an afterthought.

For litigation teams, the answer is increasingly obvious. The privilege risk alone makes it so.`,
  },
  {
    slug: "mcp-bridge-sharepoint",
    title: "How We Gave Claude Direct Access to a Client's SharePoint",
    excerpt: "A practical walkthrough of MCP - the open standard quietly transforming how AI connects to business tools - and a real engagement where we built it.",
    date: "Mar 28, 2026",
    readTime: "6 min read",
    introCard: null,
    published: true,
    content: `There's a frustrating pattern that repeats across almost every AI rollout we see. The team discovers that Claude or ChatGPT can help them with their work. They start copy-pasting data into the chat. The AI gives useful advice. Then they manually carry that advice back into SharePoint, Salesforce, or whatever system they were working in. It works. But it's friction - and friction is where adoption dies.

We just finished an engagement that removes that friction entirely. Here's how it works, and why the underlying technology is one of the most significant quiet shifts in the AI ecosystem right now.

## What MCP Actually Is

MCP stands for Model Context Protocol. It's an open standard created by Anthropic and now backed by the Linux Foundation, OpenAI, Google DeepMind, and others. The short version: it's a universal plug that lets AI assistants connect directly to external tools and data sources.

[VISUAL:mcp-architecture]

Before MCP, every AI-to-tool integration was custom-built. You'd hire a developer, they'd write a specific integration between, say, Claude and your database, and then when the API changed (it always changes) you'd need to update it. MCP standardises the contract. One bridge, built once, works across Claude, ChatGPT, and any other MCP-compatible AI platform.

There are already over 500 MCP servers covering platforms like Slack, Salesforce, GitHub, Google Drive, Jira, PostgreSQL, and more. The ecosystem is growing fast - which means the investment in connecting your systems to MCP pays dividends as AI capabilities expand.

## The Engagement: SharePoint & Power Automate

Our client's operations team was managing a complex web of SharePoint lists, lookup relationships, and Power Automate flows. They were spending significant time on data management tasks - querying records, creating and updating items, troubleshooting broken automations - that AI could handle in seconds if it had direct access.

We built an MCP bridge that gives Claude exactly that access. Four capability areas:

**SharePoint lists and structure.** The AI can create lists, add columns of any type (text, number, lookup, calculated, person fields), set up entity relationships between lists, and inspect full schemas. What used to require navigating SharePoint's UI or writing SharePoint REST API calls is now a conversation.

**Data management.** Query items with filters and sorting. Create, update, and delete records. Run bulk data transformations. The AI constructs the correct API calls, executes them, and returns results in readable form.

**Power Automate diagnostics.** List all flows, inspect their definitions, pull run history with error details, and trigger manual flows on demand. When a flow breaks at 2am and someone needs to understand why, they can ask instead of digging through logs.

**Live documentation.** This one surprised the client most. Before this bridge, Claude's answers about SharePoint's Graph API or Power Automate connectors were sometimes outdated - the models were trained on older documentation. Now the AI searches current Microsoft docs before answering technical questions. The accuracy improvement was immediately noticeable.

## What a Session Looks Like

Here's a condensed version of a real interaction from the engagement:

*"List all SharePoint lists on my site."*
Claude returns a clean table: 8 lists found - Tasks, Clients, Projects, Invoices, Contacts, Documents, Assets, Settings.

*"Add a lookup column on Tasks pointing to the Clients list."*
Claude constructs the correct Graph API call, executes it, confirms: "Column 'Client' (lookup → Clients) added to the Tasks list."

*"Show me the last 5 failed runs on the Invoice Sync flow."*
Claude pulls the run history: 5 failures, most recent error is a connection timeout to Xero API - occurred 3 times in the past 24 hours.

The entire session takes minutes. The equivalent work through SharePoint's UI and Power Automate's logs would have taken the better part of an afternoon.

## The Broader Point

MCP isn't just a technical curiosity - it represents a shift in how AI integration works. Instead of each business building bespoke connections between their tools and AI models, there's now a standard. That means the work of connecting your systems gets easier every month, as more platforms ship native MCP support.

The businesses that get ahead of this aren't the ones with the biggest budgets. They're the ones that identify where their teams are spending time on data movement and tool-switching, and methodically remove that friction.

If you're curious whether MCP makes sense for a specific platform in your stack, the scoping conversation usually takes about 30 minutes. Most bridges take 1-3 days to build and configure.`,
  },
  {
    slug: "anthropic-labor-market-research",
    title: "What Anthropic's Labor Market Research Tells Us About AI Readiness",
    excerpt: "Anthropic's landmark study of one million AI conversations reveals which roles are most exposed to AI - and what businesses should do about it.",
    date: "Mar 14, 2026",
    readTime: "7 min read",
    introCard: null,
    published: true,
    content: `Anthropic recently published one of the most detailed looks at how AI is actually being used in the real world. By analysing over a million conversations with Claude - with user consent - they mapped which occupations, tasks, and industries are most exposed to AI assistance right now. The findings are striking, and they carry direct implications for any business trying to plan for an AI-first future.

## The Most-Used Task Categories

The first thing that jumps out is where people are spending their time with AI. Software development and coding dominate, making up well over a third of all conversations. Writing and editing come second. After that, you see a long tail of analytical, research, and creative tasks.

[VISUAL:task-breakdown]

This isn't just a snapshot of "what Claude users do." It's a leading indicator of where AI capability is deepest and where businesses have the most to gain - or the most to adapt to.

## The Wage Exposure Inversion

One of the more counterintuitive findings in the research: AI exposure is highest for high-wage workers, not low-wage ones. The jobs most likely to involve AI-augmentable tasks are software engineers, lawyers, financial analysts - roles that command top-quartile salaries.

[VISUAL:wage-exposure]

This inverts the usual automation narrative. Previous waves of automation - assembly lines, basic software - displaced routine, lower-wage work. The current wave is hitting knowledge work at the top of the income distribution first. The policy and business implications are different from what most people expect.

## Augmentation vs Automation

The study also breaks down how AI is being used: augmentation (the human stays in control, AI assists) versus automation (AI handles the task end-to-end). The split is roughly 57% augmentation to 43% automation.

[VISUAL:augmentation-split]

That's more automation than most people would guess. But the more important finding is directional: automation's share is growing. Tasks that started as augmented workflows often become automated as users develop confidence and the tooling matures.

## The Capability Gap

Perhaps the most striking visualisation in the research shows the gap between AI's theoretical capability coverage across occupational categories and actual observed usage.

[VISUAL:capability-gap]

For most occupations, observed usage is substantially below theoretical coverage. People are using AI for a subset of what it could do in their role. The capability is there. The adoption - and the organisational readiness to use it - is not.

## What This Means for Your Business

Three things stand out as actionable from this research.

**The productivity gap is real and measurable.** If your team is using AI at all, there's almost certainly a gap between what they're doing and what's possible. The research gives you a framework for where to look: which tasks in high-exposure roles are still being done without AI assistance, and why.

**Augmentation is the entry point, automation is the destination.** Don't wait until you're ready to fully automate a process before starting. Start with augmentation - have AI assist with the first draft, the first analysis, the initial research. Automation follows naturally as confidence builds.

**Readiness is the bottleneck, not capability.** The capability gap in the visualisation is a readiness gap. The AI can do more than your team is asking it to do. The constraint is structured knowledge, clear processes, and people trained to use the tools effectively.

That last point is where most of the work actually sits. And it's the work that pays the highest dividends.`,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // DRAFTS pulled from the second-brain repo (2026-07). published: false — these
  // stay OFF the public blog and are visible only in /admin until Daniel gives
  // the explicit go to publish. Do not flip `published` without his sign-off.
  // ───────────────────────────────────────────────────────────────────────────
  {
    slug: "learn-by-doing",
    title: "Learn by doing",
    excerpt: "Fifteen years ago my wife and I said yes to paella. We didn't really know what we were doing - we did it anyway. The skill was never paella. It was saying yes before I felt ready, and learning by doing.",
    date: "Jun 5, 2026",
    readTime: "3 min read",
    introCard: JSON.stringify({
      tagline: "A principle",
      headline: "Learn by doing.",
      sub: "Fifteen years ago my wife and I said yes to paella. We didn't really know what we were doing. We did it anyway.",
    }),
    published: false,
    content: `Fifteen years ago my wife and I said yes to paella.

It wasn't a plan. It was a weekend thing - cook, feed people, be part of the street food scene that was growing back home in South Africa. We didn't really know what we were doing.

We did it anyway.

I loved it. The early starts. The setup when it's still quiet. The same faces every week. Selling out and then picking apart why one week beat the last. It was physical, it was a rush, and it paid.

So we reinvested. Then more. Then more. Bigger premises. A longer menu. More fridges. More staff. We overbuilt - and the wheels were coming off before we saw them. Covid just made it impossible to ignore.

So we stripped it back. Launched a cheaper version overnight to stay alive. It worked. We made it.

And somewhere in that mess I noticed something. The thing I was actually good at wasn't paella. It was the figuring-out. Helping the thing adapt. Explaining why. Making a scary moment feel like something you could handle.

That's the part I keep coming back to.

Because the skill was never paella. It was saying yes before I felt ready, and learning by doing. I'd done it years earlier teaching teenagers guitar - I was never a great player, I was just patient, and I could make it click. Same thing.

Now I do the same thing with AI.

People will always be afraid of change. Of the unknown. So am I - still. I just found a way through it: you take a first step. Then another. The doing teaches you.

You don't have to become an expert before you're allowed to start. And it's easier with someone in the room who's taken enough scary first steps to have got a taste for them. That's me now. That's the part I like.

I still don't have all the answers. I've just stopped waiting for them.

Learn by doing.`,
  },

  {
    slug: "second-brain-not-a-metaphor",
    title: "Your second brain is not a metaphor",
    excerpt: "We say 'second brain' like we say 'my other half' - fond exaggeration nobody really means. After three months building these systems and watching them start to connect, I've stopped treating it as a figure of speech.",
    date: "Jun 5, 2026",
    readTime: "6 min read",
    introCard: JSON.stringify({
      tagline: "Philosophy",
      headline: "Your second brain is not a metaphor.",
      sub: 'We throw the phrase around like "my other half" - fond exaggeration nobody really means. I think we should mean it.',
    }),
    published: false,
    content: `I've spent the last three months building systems.

Not one. Several. A separate setup for each part of my life - the work I do, the ideas I'm chasing, the businesses I run, the things I just care about. Each one built on its own, for its own reason, in its own corner.

This brain - the personal one - is the latest. Plain-text files an AI can read: my paella story, the way I talk, what I'm trying to build and why.

The tidy part I expected. Filing things into folders. That's not what got me.

What got me is what happens when you start connecting them.

Each system was an island. Useful alone. But wire them together - let the personal brain see the work, the ideas meet the businesses - and it stops behaving like storage. It starts behaving like a network. Something in one corner lights up something in another. I asked it about my own life and it tied the way I run a catering business from another continent to the way I want to teach - a connection I'd never made out loud myself.

That's the part that's getting wild. It's less like a filing cabinet every day, and more like a neural network - a lot of separate things, built for different reasons, starting to fire together.

And it's why I've stopped treating "second brain" as a figure of speech.

We throw the phrase around like "my other half." A bit of fond exaggeration. Nobody really means it.

I think we should mean it.

Back in 1998 two philosophers, Andy Clark and David Chalmers, made an argument that sounds mad until it doesn't. They said the mind doesn't stop at the skull.

Their example was a man called Otto. Otto's memory is failing, so he writes everything down in a notebook and trusts it completely. His friend Inga just remembers things the normal way. When they both decide to go to the museum, Inga recalls the address; Otto looks it up. The notebook is doing the exact job Inga's memory does.

So why, they asked, call one of them "mind" and the other "just a notebook"? If a process would count as thinking when it happens in your head, it still counts when it happens on the page. The page is part of the thinking.

You already live this. You just don't notice.

You don't hold phone numbers in your head anymore. Or half the dates you're meant to remember. Or how to get to the place you drove to last week. Your phone holds them. And you trust it like memory - you'd sooner doubt your own recall than the calendar.

That's an extended mind. It's been in your pocket for years.

What's different now is that the new part doesn't just hold things. It thinks back. You put something in, and it answers. The notebook started talking. And when you connect enough notebooks, they start talking to each other.

That changes what "I'll get to it later" actually means.

If a second brain were just another app, putting it off would cost you a little convenience. No drama. But if it's really an extension of your mind - a place your thinking can live, connect, and grow - then putting it off isn't skipping a tool. It's choosing how much of your own head to build, and how soon.

I said somewhere else that building one of these is like saving. Small deposits, compounding quietly. This is why it's not just a line. You're not saving up points or productivity. You're saving up mind. The person who starts a few rough notes today and keeps going isn't a little ahead in three years. They're thinking with more than they were born with.

Now the part the excitable people skip.

If your mind can grow into a tool, it can also shrink into one.

Lean on it to remember for you, and your memory gets lazy - you've felt that already, with the phone numbers. Lean on it to think for you, and the same thing happens to your thinking. You get a little smaller each time you hand over the part that was yours to do.

So the line I hold is simple. Extend yourself. Don't replace yourself. Use it to reach further than you could alone - not to stop reaching. The day it's doing the thinking and you're just nodding along, you've built something. But it isn't a second brain. It's a first one you've stopped using.

I'm three months in. The systems exist. Connecting them is what I'm doing now - and that's where it's getting wild. I don't know all of what it becomes. That's fine - I've stopped waiting to know before I start.

But the question has already changed for me. It was never "should I use AI." It's quieter than that, and harder.

What do I want to keep in my own head - and what am I willing to think with?`,
  },

  {
    slug: "never-just-one-reason",
    title: "It's never just one reason",
    excerpt: "When someone tells me why they haven't started with AI, it's never just one reason. Too busy, not allowed, scared of doing it wrong - usually all at once. Here's what I've actually stopped doing.",
    date: "Jun 5, 2026",
    readTime: "3 min read",
    introCard: JSON.stringify({
      tagline: "Reasons people don't start",
      headline: "It's never just one reason.",
      sub: "Too busy. Company won't allow it. Scared of doing it wrong. Usually it's more than one - at once, on the same Tuesday.",
    }),
    published: false,
    content: `When someone tells me why they haven't started with AI, it's never just one reason.

They're too busy. Their company won't allow it. They're scared of doing it wrong - losing money, being out of their depth. Or they tried it once, got generic slop back, and wrote the whole thing off.

Usually it's more than one. At once. On the same Tuesday.

That's not weakness. That's just life. Life isn't singular. I feel most of these too, depending on the day. I'm not perfect, and I've stopped pretending the perfect moment is coming.

And the slop one - that's fair. The first go is often rubbish. It's not magic, and it's not the right tool for every job. But generic results usually mean the steering was off, not that the thing is useless. That part you learn by doing.

What I've actually stopped doing is waiting. You'll never wake up un-busy, fully allowed, and unafraid on the same morning. Wait for that and you wait forever.

So borrow the line people use about money. The best time to start saving was ten years ago. The second best time is today.

A second brain is the same. It's an asset - just a different kind. You don't build it in one big heroic go. You build it the way you build savings: small, regular deposits. A thought here. A note there. A few minutes that would've gone to the scroll.

It compounds. Quietly, then all at once. I've been making those deposits into my own systems for fifteen years without calling it that - and the ones who start small and keep going end up miles ahead of the ones still waiting to begin properly.

You don't need the perfect moment. You need to open the account.

First step: put one thing in today. One thought, one note, one question worth answering. That's the deposit. Tomorrow, make another.

Which one's loudest for you right now?`,
  },

  {
    slug: "climbing-k2-yang-zhilin",
    title: "The Mountain With No Summit: Yang Zhilin on Agents and the Data Wall",
    excerpt: "Moonshot AI's founder gave his first proper interview in eighteen months and spent it on first principles instead of the business questions everyone wanted answered. Three of his claims are worth stealing.",
    date: "Jul 24, 2026",
    readTime: "6 min read",
    introCard: null,
    published: false,
    content: `Yang Zhilin, the founder of Moonshot AI, gave his first in-depth interview in about eighteen months shortly after shipping Kimi K2. Everyone wanted him to talk about the commercial position - Kimi sliding down China's app rankings, DeepSeek eating the oxygen, an API price war that had compressed margins to nothing. He mostly refused. He spent ninety minutes on technical strategy and first principles instead.

Read carefully, that's not an evasion. It's an answer to the business question, just delivered sideways.

## A mountain with no summit

His organising metaphor is a snowy mountain that doesn't have a top. He takes it from David Deutsch's *The Beginning of Infinity*, a book he says he's read several times, and from it he pulls two lines worth carving somewhere visible: problems are inevitable, and problems are solvable. Every solved problem lifts you a few hundred metres and reveals the next one. He says he hopes the mountain has no summit.

That's also his answer on AGI. He rejects the idea of it as a moment where a switch flips. It's a direction, not a step. Models already beat 99% of humans at maths and programming competitions, and those wins arrived piecemeal, benchmark by benchmark. He compares it to the steam engine - the mechanical breakthrough came fast, the economic reorganisation took a century.

I find this useful well beyond model labs. A roadmap built around "reaching AI transformation" optimises for a headline. A roadmap built around crossing specific capability thresholds tracks what's actually happening. Most of the AI adoption plans I see are the first kind. The second kind is harder to write and much easier to act on.

The name K2 comes from the same place. K2 isn't the highest peak, but it's arguably the hardest to climb. Yang admits the naming is a bit confusing and entirely deliberate: the current shift from chat to agents is a harder stretch than more scaling of chat models ever was.

## Brains in vats

The central technical claim in the interview is that reasoning and agentic capability are two different scaling paths, not one.

A pure reasoning model is what he calls a brain in a vat - a brain in a fish tank with no connection to the outside world. It thinks in isolation and only touches reality when it emits a final answer. An agent breaks the glass. It searches, writes code, reads what came back, and adjusts based on what actually happened. Both spend the same underlying resource - tokens before committing - but one spends them thinking and the other spends them acting and checking.

His example is Claude. He points out that Claude's raw reasoning benchmark scores aren't the highest in the field, while its performance as an agent is very high. His read: agentic capability is a deliberate technical bet built on environment interaction and feedback, not a side effect of being clever. An agent iterating against live feedback beats a smarter model that only thinks.

If you've ever wondered why a model that looks brilliant in a chat window turns out mediocre when you wire it into a real workflow, that's the gap. Benchmarks measure the brain in the vat. Your business runs on the other thing.

He extends it to coding agents with a good image: coding is the fingertips of the hand, not the whole hand. Code is the easiest domain to verify - tests pass or they don't - which is exactly why every lab raced there first and why coding agents improved faster than anything else. But he notes that lawyers, PMs and designers already use coding tools for work that has nothing to do with software, because code is the universal language for automating anything digital. Moonshot's target is a general agent that happens to be excellent at coding, not a coding tool that also answers questions.

The implied warning is sharp: being ahead on coding agents doesn't automatically make you ahead on agents.

## The data wall

Yang is blunter than most founders about the constraint. "Scaling has a data wall. I think this is an objective fact." High-quality training data is growing too slowly to keep feeding bigger models on the pretraining recipe alone.

Moonshot's answer is to extract more intelligence per token rather than hunt for more tokens. Two things carry that. The first is optimiser research - the team adopted Muon in place of Adam, the optimiser that's dominated deep learning for a decade. Yang's claim is that Muon roughly doubles data efficiency, because it accounts for dependencies between parameters that Adam treats as independent. At K2's scale of roughly 30 trillion high-quality tokens, that behaves like having 60 trillion. He mentions that training went largely as predicted apart from one instability that only appeared at full scale - the kind of problem no small experiment will ever show you.

The second is shifting compute out of pretraining and into reinforcement learning. RL is on-policy: the model learns from samples it generates itself rather than from a fixed dataset, which scales better once the data wall bites.

Underneath both sits a principle he stated in an earlier interview and I keep coming back to: if a problem can be solved with scale, don't solve it with a new algorithm. The value of a new algorithm is that it lets you scale better.

## Managing with RL instead of SFT

The part that stuck with me most isn't technical. Yang says his co-founder tells him daily to manage with an RL approach rather than an SFT approach.

Supervised fine-tuning, applied to people, is telling the team exactly how to do the thing. Safe, and it kills initiative. Reinforcement learning is defining the reward and letting people find their own path. But the failure mode transfers along with the method: "The biggest problem with managing via RL is that you can easily be hacked." Teams, like models, optimise the metric rather than the goal. Which makes defining the reward the single most important design decision you make.

He admits he hasn't solved the balance and is learning it live. That's the honest version, and it's the same problem every organisation hits the moment it puts a number on something.

## Open source, read with clear eyes

A year before this interview, Yang had argued that a market leader wouldn't open-source. K2 shipped open-weight. Asked about the reversal, he was unusually direct: "Because we are not yet the absolute global leader." Open-sourcing shares know-how, accelerates everyone, and lets companies that would otherwise be pure competitors climb the mountain together.

Worth taking the metaphor off for a second. At the time of recording Kimi had slipped from second to fourth in China on monthly actives, behind DeepSeek and Doubao, and the price war had done its damage. Open-sourcing was the move available to a technically excellent lab losing the distribution war - a way to compete on developer mindshare instead of app rankings. From here in mid-2026, with K2's successors getting serious attention from Western developers, the gamble has aged well. But it was a gamble made under pressure, and to his credit he more or less says so.

## What I'd actually take from it

Three claims are load-bearing and worth tracking against reality.

**Reasoning and agentic capability are separable.** The Claude observation supports it and the trajectory of agent-first products since has largely borne it out. Practically: stop choosing tools on benchmark scores and start testing them on your actual loop.

**Token efficiency beats parameter count as the competitive edge.** More intelligence out of the same data, rather than more data. The organisational version of this is the one I care about - most companies don't have a model problem, they have a "the knowledge isn't in a form anything can use" problem.

**Open-sourcing from behind can convert a distribution disadvantage into an ecosystem advantage.** The most contingent of the three, and the one where the philosophy and the survival strategy are hardest to tell apart.

The mountain image is the bit I'll keep, though. Not because it's profound - because it sets the right expectation. There is no release, no rollout, no launch after which you're finished. Every problem you solve lifts you a few hundred metres and shows you the next one. That's not a warning. On a good day it's the whole appeal.

---

*Sources: the Zhang Xiaojun podcast interview with Yang Zhilin (published August 2025). Direct transcript access was blocked, so quotes and claims here come from published translations and detailed coverage of the same interview - primarily China Story's translated analysis and The AI Corner's breakdown, plus contextual reporting on Kimi's 2025 user rankings. Quoted lines are translations from Mandarin and vary between sources; treat them as faithful paraphrases rather than verbatim English. Where I've added assessment - the open-source section, the management section, and the closing - that's mine, not his.*`,
  },
];

const DEFAULT_PORTFOLIO_JSON = JSON.stringify([
  { id: "pythia", name: "Pythia", tagline: "On-Premise AI · Legal Document Intelligence", description: "A self-hosted document intelligence platform for litigation and legal review - built on NVIDIA DGX Spark hardware. Processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. No data ever leaves the device, satisfying Legal Professional Privilege by design.", url: "/pythia" },
  { id: "mcp-bridge-sharepoint-power-automate", name: "MCP Bridge - SharePoint & Power Automate", tagline: "Model Context Protocol · Consulting Engagement", description: "We built an MCP (Model Context Protocol) bridge that gives Claude direct access to a client's SharePoint environment and Power Automate flows. Instead of copy-pasting data into a chat, the team can ask AI to query, create, and update SharePoint records - and diagnose broken automations - through natural conversation.", url: "https://modelcontextprotocol.io" },
  { id: "entityvault", name: "EntityVault", tagline: "entityvault.tutto.one", description: "A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.", url: "https://entityvault.tutto.one" },
  { id: "ai-roi-portal", name: "AI ROI Portal", tagline: "tracker.tutto.one", description: "A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.", url: "https://tracker.tutto.one" },
]);

const DEFAULT_ABOUT_HERO_JSON = JSON.stringify({
  headline: "Exploring AI Practically",
  sub: "Making LLM-based AI systems useful is a very hands-on experience. The technology is new; it's moving very fast and it is extremely powerful if used in the right way. This is an exploration of one step in making all of that possible. I don't pretend to have all the answers, but I trust in the process because I've seen it work over and over again - and I want to share that with you.",
});

type SeedPost = (typeof BLOG_SEED_DATA)[number];

async function createSeedPost(post: SeedPost) {
  await storage.createBlogPost({
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    date: post.date,
    readTime: post.readTime,
    content: post.content,
    introCard: post.introCard ?? null,
    published: post.published,
  });
}

export async function seedBlogPostsIfEmpty() {
  const count = await storage.getBlogPostCount();
  if (count === 0) {
    console.log("Seeding blog posts...");
    for (const post of BLOG_SEED_DATA) {
      await createSeedPost(post);
    }
    console.log(`Seeded ${BLOG_SEED_DATA.length} blog posts.`);
  } else {
    // DB already seeded: insert only slugs that don't exist yet (e.g. drafts
    // added to the seed after first run). Existing posts are never modified or
    // deleted, so live edits made via /admin are always preserved.
    let added = 0;
    for (const post of BLOG_SEED_DATA) {
      const existing = await storage.getBlogPostBySlug(post.slug);
      if (!existing) {
        await createSeedPost(post);
        added++;
      }
    }
    if (added > 0) console.log(`Added ${added} new blog post(s) from seed.`);
  }

  // Seed default site content if not yet stored
  const portfolioContent = await storage.getSiteContent("portfolio");
  if (!portfolioContent) {
    await storage.upsertSiteContent("portfolio", DEFAULT_PORTFOLIO_JSON);
    console.log("Seeded default portfolio content.");
  }

  const aboutContent = await storage.getSiteContent("about-hero");
  if (!aboutContent) {
    await storage.upsertSiteContent("about-hero", DEFAULT_ABOUT_HERO_JSON);
    console.log("Seeded default about-hero content.");
  }
}
