export type MessageType = "text" | "options" | "system";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatOption {
  label: string;
  value: string;
  action?: () => void;
}

export interface FlowStep {
  id: string;
  messages: string[]; // Array of messages to send sequentially
  options?: ChatOption[];
  next?: string; // Default next step if no option selected (usually undefined for options)
}

export const CHAT_FLOWS: Record<string, FlowStep> = {
  start: {
    id: "start",
    messages: [
      "How can I help you today?"
    ],
    options: [
      { label: "Learn about AI Readiness", value: "readiness" },
      { label: "Run a quick diagnostic", value: "diagnostic_start" },
      { label: "Talk to Tutto", value: "contact" }
    ]
  },
  readiness: {
    id: "readiness",
    messages: [
      "AI readiness isn't just about having the latest tools.",
      "It's about having structured, accessible data that machines can actually understand.",
      "Most companies are sitting on a goldmine of unstructured data that AI simply can't read."
    ],
    options: [
      { label: "Tell me more", value: "readiness_more" },
      { label: "Back to start", value: "start" }
    ]
  },
  readiness_more: {
    id: "readiness_more",
    messages: [
      "To be 'machine-readable', your internal knowledge needs to be documented, API-accessible, and logically structured.",
      "I help companies audit their information architecture to prepare for this transition."
    ],
    options: [
      { label: "How do we start?", value: "diagnostic_start" },
      { label: "I want to book a call", value: "contact" }
    ]
  },
  diagnostic_start: {
    id: "diagnostic_start",
    messages: [
      "Let's run a quick 3-question diagnostic to see where you stand.",
      "Question 1: Do you have a central documentation repository (like Notion, Confluence) that is actively maintained?"
    ],
    options: [
      { label: "Yes, it's our bible", value: "diag_q2_good" },
      { label: "Sort of, but it's messy", value: "diag_q2_ok" },
      { label: "No, knowledge is in heads", value: "diag_q2_bad" }
    ]
  },
  diag_q2_good: {
    id: "diag_q2_good",
    messages: ["That's a great start. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q2_ok: {
    id: "diag_q2_ok",
    messages: ["Common scenario. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q2_bad: {
    id: "diag_q2_bad",
    messages: ["I see. That's the first bottleneck we'd need to address. Question 2: Is your customer data accessible via a unified API?"],
    options: [
      { label: "Yes", value: "diag_q3" },
      { label: "No, it's siloed", value: "diag_q3" }
    ]
  },
  diag_q3: {
    id: "diag_q3",
    messages: ["Last question: Have you automated any core business processes with AI agents yet?"],
    options: [
      { label: "Yes, fully automated", value: "result_advanced" },
      { label: "Experimenting now", value: "result_intermediate" },
      { label: "Not yet", value: "result_beginner" }
    ]
  },
  result_advanced: {
    id: "result_advanced",
    messages: [
      "Impressive. You seem to be well on your way.",
      "At this stage, optimization and governance become the key challenges.",
      "I'd love to hear what you're building."
    ],
    options: [
      { label: "Book a chat", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  },
  result_intermediate: {
    id: "result_intermediate",
    messages: [
      "You're in the 'Messy Middle'. This is where most valuable work happens.",
      "Structuring your data now will pay massive dividends as you scale these experiments."
    ],
    options: [
      { label: "Get help with this", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  },
  result_beginner: {
    id: "result_beginner",
    messages: [
      "You have a blank canvas. That's actually an advantage.",
      "You can build 'AI-First' from day one without fighting decades of legacy debt.",
      "Start by documenting your core processes."
    ],
    options: [
      { label: "How can you help?", value: "services" },
      { label: "Back to start", value: "start" }
    ]
  },
  contact: {
    id: "contact",
    messages: [
      "We're currently taking on a limited number of consulting engagements.",
      "You can book a 15-minute intro chat directly on our calendar."
    ],
    options: [
      { label: "Open Calendar", value: "open_calendar" },
      { label: "Maybe later", value: "start" }
    ]
  },
  services: {
    id: "services",
    messages: [
      "I offer three main services:",
      "1. **Data Audit**: Mapping your knowledge for AI consumption.",
      "2. **Agent Architecture**: Designing the workflows for your AI workforce.",
      "3. **Team Training**: Teaching your humans to manage machines."
    ],
    options: [
      { label: "Let's talk", value: "contact" },
      { label: "Back to start", value: "start" }
    ]
  }
};

export const BLOG_POSTS = [
  {
    slug: "machine-readable-knowledge",
    title: "Making Knowledge Machine-Readable",
    excerpt: "Brian Madden has built a public knowledge system that lets AI draw on his thinking in real time. The same methodology sits at the heart of Praxis — and he deserves the credit.",
    date: "Jun 4, 2026",
    readTime: "4 min read",
    content: `[Brian Madden](https://brianmadden.ai) has built something I wish existed when I started thinking about how AI should work with professional knowledge. His public knowledge repository at [brianmadden.ai](https://brianmadden.ai) is a worked example of an idea that most organisations are still trying to articulate: if you want AI to work well with your thinking, your thinking has to be structured in a way that AI can actually work with.

This post is about what he has built, why the principles matter, and why it connects directly to what Praxis teaches.

## What brianmadden.ai is — and what it is not

The FAQs on Brian's site are the best starting point and they are worth reading carefully. The distinctions he draws are precise, and each one rules out a different misunderstanding.

**Is it a chatbot?**

No. It is a data source your AI connects to. You talk to your AI, and it draws on Brian's knowledge when relevant. It is more like an always-updated context and knowledge source for your chatbot than a chatbot itself.

**Is it a digital twin?**

No. A digital twin simulates a person. This makes published thinking accessible. The distinction matters: a simulation tries to reproduce behaviour; a knowledge repository makes reasoning transparent and reusable.

**Where does it come from?**

Brian maintains a personal AI-powered knowledge system — sometimes called a second brain — which is how he uses AI on a daily basis. That system has everything he needs to work: content, ideas, his to-do list, thinking, meeting notes, documents, plans. [brianmadden.ai](https://brianmadden.ai) is a subset of that private system, updated daily. Content flows from the private system to the public repository using explicit publishing principles.

**How current is it?**

The "current thinking" file updates frequently. The synthesis updates when new posts are published. Crucially, the AI flags stale content rather than presenting old thinking as current — a design decision that most knowledge systems do not make.

**Can you fork it?**

Yes. The GitHub repo is the source of truth. Fork it, build on it, use the frameworks in your own work.

## Why these principles matter

What Brian has built is a demonstration of something important: the gap between "AI gives good answers" and "AI does my actual work reliably" is almost always a knowledge-structure problem, not a model problem.

A browser chatbot does not have access to your documents, your precedents, your institutional knowledge, or your professional judgement. It guesses what a reasonable answer looks like based on everything it was trained on. That is genuinely useful for one-off questions. It is a liability for anything you want to run consistently, at scale, with your specific standards applied.

The solution is not a better model. It is better-structured knowledge — explicit, current, machine-readable, and forkable.

## Why Praxis teaches this methodology

Praxis is the training programme that teaches you to build that structure for your own work. The skill file — the central artefact in every Praxis session — is the working implementation of exactly this idea. Professional knowledge written down in plain English, structured so that a script can read it and apply it the same way, every time.

The [Praxis course materials](https://github.com/TuttoOne/praxis) are themselves built on this principle. The course content is maintained as a structured knowledge repository — a folder of markdown files, organised by topic, written to be read by both humans and AI. You can explore it in the [Praxis course library](/praxis/learn).

## The credit

The terminology and framing I use in Praxis — machine-readable knowledge, the separation of the data layer from the reasoning layer, the idea that professional knowledge should be explicit and forkable — owes a direct debt to Brian's work. He articulated the architecture before I did, and he published it.

If this framing is useful to you, his site is the place to go deeper.

[brianmadden.ai](https://brianmadden.ai)`,
  },
  {
    slug: "praxis-closed-loop",
    title: "The Podcast That Clarified Why Praxis Exists",
    excerpt: "A Lenny's Newsletter article made something click for me about why most AI training fails. The answer was already in how Praxis was built — I just had not said it clearly enough.",
    date: "Jun 2, 2026",
    readTime: "5 min read",
    content: `A few months ago I read a piece on [Lenny's Newsletter](https://www.lennysnewsletter.com/p/how-to-build-ai-product-sense) that clarified something I had been circling. The article is by Tal Raviv and Aman Khan, and the argument is about what they call "AI product sense" — the ability to correctly anticipate what will be truly impactful for users and what is actually feasible with AI. Their claim: you do not build it by reading explainer posts. You build it by getting your hands into coding agents and doing real work with them.

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
    excerpt: "Anthropic's Project Glasswing scanned over 1,000 open-source projects and found 6,202 high or critical vulnerabilities — at 90% accuracy. The problem is not the finding. It is how long it takes to fix.",
    date: "May 27, 2026",
    readTime: "5 min read",
    content: `Anthropic published an initial update on [Project Glasswing](https://www.anthropic.com/research/glasswing-initial-update) this week. It is nominally an announcement about a security initiative. What it actually describes is a threshold being crossed — and most organisations have not thought through what that means.

## What Glasswing is

Glasswing is Anthropic's effort to use their most capable model, Claude Mythos Preview, to find vulnerabilities in critical software before attackers do. The launch partners include AWS, Apple, Cisco, Google, Microsoft, NVIDIA and JPMorganChase. Anthropic is committing $100 million in usage credits and $4 million in direct donations to open-source security organisations.

The headline framing is defensive: we are using AI to protect infrastructure. That framing is correct. It is also incomplete.

## What the numbers mean

Over the last few months, Mythos Preview scanned more than 1,000 open-source projects. It found 23,019 vulnerabilities in total. Of those, 6,202 were classified as high or critical severity.

Anthropic then sent 1,752 of the high/critical findings to six independent security research firms for assessment. 90.6% — 1,587 — were confirmed as valid true positives. 62.4% were confirmed high or critical.

Work through the arithmetic. At that true positive rate, Mythos Preview has surfaced close to 3,900 real high-or-critical vulnerabilities in open-source code from a scan that took months, not years. That number will continue rising: Anthropic says they intend to keep scanning.

The scale is not the story. The rate is. A 90% true positive rate on vulnerability discovery is not a research result. It is an operational capability.

## The benchmark saturation point

Anthropic notes that Mythos Preview has improved to the point where it "mostly saturates existing benchmarks" for vulnerability discovery. As a result, they have supported the creation of two new benchmarks — ExploitBench and ExploitGym — specifically to track frontier models' exploit development capabilities going forward.

When a model saturates a benchmark, the benchmark stops being informative. What replaces it is real-world testing, which is what Glasswing is. The move from benchmarks to production scanning is not a methodological choice. It is an acknowledgement that the capability has outgrown the measurement.

The implication is direct: AI systems can now find and construct exploits for software vulnerabilities at a level that surpasses all but the most skilled human security researchers. Anthropic states this explicitly in the update.

## wolfSSL

The concrete example in the update is worth sitting with. wolfSSL is an open-source cryptography library used by billions of devices — routers, embedded systems, IoT hardware. Mythos Preview found a vulnerability and constructed a working exploit that would allow an attacker to forge certificates, enabling them to impersonate banks or email providers to any device running the affected library.

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
    slug: "anthropic-managed-agents-architecture",
    title: "The Harness Problem: What Anthropic's Managed Agents Tell Us About Building on AI",
    excerpt: "Anthropic published a detailed account of how they architect long-running AI agents. The engineering is interesting. The implication for anyone building on top of Claude is more important.",
    date: "May 15, 2026",
    readTime: "6 min read",
    content: `Anthropic's engineering blog published a post in April titled [Scaling Managed Agents: Decoupling the brain from the hands](https://www.anthropic.com/engineering/managed-agents). It is worth reading in full if you build systems that run Claude for more than a single turn. If you don't have time for that, here is what matters and why it matters for you.

## The problem they are solving

When you build an AI agent, you write a harness - the loop of code that calls the model, routes its tool calls, and decides what to do with the results. The harness is where your assumptions live. You write it based on what Claude can and cannot do today.

The problem is that what Claude can and cannot do changes. Quickly.

Anthropic give a specific example. Claude Sonnet 4.5 would wrap up tasks prematurely as it sensed its context window approaching - a phenomenon they call "context anxiety." They fixed it in the harness by adding context resets. When they upgraded to Claude Opus 4.5, the anxiety was gone. The harness fix had become dead weight. The assumption they had encoded - that the model needed help managing context pressure - was no longer true.

This is the harness problem in its simplest form. Every assumption you bake in has an expiry date you cannot know in advance. Anthropic's solution is to build around interfaces that stay stable while everything underneath them changes.

## Pets vs cattle

The post introduces an infrastructure concept that is worth borrowing. In the original framing, a "pet" is a server you name, tend, and cannot afford to lose. "Cattle" are interchangeable - when one fails, you replace it.

Anthropic's first Managed Agents architecture put everything - the harness, the sandbox, the session log - into a single container. That container became a pet. When it failed, the session was lost. When it was unresponsive, engineers had to nurse it back. Debugging required opening a shell into a container that also held user data, which meant they essentially could not debug it.

The fix was decoupling. The harness (the brain) was separated from the sandbox (the hands) and the session log. Each became an independent interface. If a container died, the harness caught the failure as a tool-call error, passed it to Claude, and Claude could request a new one. No nursing required. The containers became cattle.

## What decoupling actually buys you

Three things worth noting.

**Speed.** When the brain and hands were coupled, every session paid the container setup cost upfront - even sessions that would never touch the sandbox. Once decoupled, containers are only provisioned when actually needed. The result: p50 time-to-first-token dropped roughly 60%. p95 dropped over 90%. That is not a rounding error. That is the difference between an agent that feels responsive and one that feels broken.

**Flexibility.** When the harness assumed it lived next to its tools, connecting to a client's own cloud meant either peering their network with Anthropic's or running Anthropic's harness in the client's environment. Neither is clean. Once the harness treats every execution environment as a remote tool call - \`execute(name, input) → string\` - it stops caring whether the sandbox is a container in Anthropic's cloud, a resource in your VPC, or something else entirely. The interface is the same.

**Security.** In the coupled design, credentials lived in the same container as the code Claude was generating. A prompt injection only had to convince Claude to read its own environment. Once the sandbox - where Claude's generated code runs - is separated from the harness, credentials can live in a vault the sandbox cannot reach. The structural fix removes the attack surface rather than just narrowing it.

## The session is not the context window

One of the less obvious insights in the post is about how long-horizon agents handle memory.

The conventional approach to long tasks is to manage context within the context window - compaction, trimming, summarisation. The problem with all of these is that they involve irreversible decisions. You cannot know in advance which tokens a future turn will need. Discard the wrong thing and the agent fails in ways that are hard to trace.

Anthropic's approach is to treat the session log as a separate object that lives outside the context window. It is append-only, durable, and independently queryable. The harness can pull any slice of the event history and pass it to Claude as needed. Nothing is discarded. What gets loaded into the context window at any given turn is a decision the harness makes - not an irreversible transformation of the record itself.

This is a meaningful design choice. It means you can change your context management strategy without losing history. It means a failed session can be resumed from any point. And it means the session log outlives any particular harness that reads from it.

## What this means if you are building on Claude

The Managed Agents post is partly an announcement of Anthropic's own hosted service. But the architectural thinking underneath it applies to anyone building agents, whether or not you use their managed infrastructure.

The central point is that the model is improving faster than most harnesses are designed to accommodate. Assumptions that were correct six months ago may not be correct now, and assumptions you make today will likely need revisiting before the end of the year. Building harnesses that are tightly coupled to current model behaviour means each model upgrade requires harness rework.

The practical implication is to think carefully about what you are encoding in your harness versus what you are leaving to the model. Every piece of scaffolding that compensates for something the model cannot do is a bet that the model will not be able to do it in future. Sometimes that bet is correct. Often it is not.

A few specific things worth auditing in your own setup:

- **Context management logic.** If you are aggressively trimming or summarising to handle long sessions, check whether the current model still needs it.
- **Error handling scaffolding.** Retry logic and fallback paths that were necessary for earlier models may be unnecessary overhead now, or may interact badly with improved model behaviour.
- **Tool routing assumptions.** If you built logic to decide which tool a model should use because it was unreliable at choosing, that logic is worth revisiting.

None of this means ripping out your harness. It means treating it as something that needs periodic review against current model capability, rather than something you write once and trust indefinitely.

The models are not standing still. Your harnesses probably should not either.`,
  },
  {
    slug: "legalrag-on-premise-ai",
    title: "LegalRAG: On-Premise AI for Document-Heavy Litigation",
    excerpt: "How we built a self-hosted document intelligence platform that gives litigation teams AI-powered review without a single byte of privileged material ever leaving the building.",
    date: "Apr 1, 2026",
    readTime: "7 min read",
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

LegalRAG is built specifically for barristers' chambers, litigation boutiques, and mid-market firms with 10–100 lawyers handling document-heavy matters. Fraud, family, regulatory, commercial litigation - anywhere that disclosure volume is a genuine problem and cloud is a genuine risk.

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

If you're curious whether MCP makes sense for a specific platform in your stack, the scoping conversation usually takes about 30 minutes. Most bridges take 1–3 days to build and configure.`,
  },
  {
    slug: "anthropic-labor-market-research",
    title: "What Anthropic's Labor Market Research Tells Us About AI Readiness",
    excerpt: "Anthropic's landmark study of one million AI conversations reveals which roles are most exposed to AI - and what businesses should do about it.",
    date: "Mar 14, 2026",
    readTime: "7 min read",
    content: `Anthropic recently published one of the most detailed looks at how AI is actually being used in the real world. By analysing over a million conversations with Claude - with user consent - they mapped which occupations, tasks, and industries are most exposed to AI assistance right now. The findings are striking, and they carry direct implications for any business trying to plan for an AI-first future.

## The Most-Used Task Categories

The first thing that jumps out is where people are spending their time with AI. Software development and coding dominate, making up well over a third of all conversations. Writing and editing come second. After that, you see a long tail of analytical, research, and creative tasks.

[VISUAL:task-breakdown]

This isn't just a snapshot of "what Claude users do." It's a leading indicator of where AI capability is deepest and where businesses have the most to gain - or the most to adapt to.

## The Wage Exposure Inversion

Previous waves of automation - think factory robots, ATMs, customer-service phone trees - disproportionately affected lower-wage, routine physical jobs. AI appears to work differently.

[VISUAL:wage-exposure]

The research found that **higher-wage occupations are more exposed to AI assistance, not less.** Lawyers, analysts, software engineers, researchers, writers - these are the roles where Claude is being used most intensively. For the first time, automation pressure is being felt at the top of the income ladder as much as the bottom.

This inverts the assumption many businesses have made: that AI is a back-office cost-cutting tool. It's increasingly a front-office capability tool.

## Augmentation, Not Replacement

Perhaps the most important nuance in the data: most AI use is **augmentative** - AI is helping humans do their jobs better and faster, not replacing them outright.

[VISUAL:augmentation-split]

This distinction matters enormously for how businesses should plan. A fully automated task requires you to redesign a workflow. An augmented task requires you to upskill the person doing it. Both need investment, but they're very different investments.

## The Capability Gap: Where the Real Opportunity Lives

The most striking chart in the entire study isn't any of the numbers above - it's a radar diagram that overlays two things: theoretical AI capability across occupational categories (blue), and how much AI is actually being used in those categories today (red).

[VISUAL:capability-gap]

Every sector where blue extends far beyond red is a place where businesses are leaving value on the table. The gap isn't a sign that AI isn't ready - it's a sign that the organisations in those sectors haven't caught up yet. Legal, management, education, architecture, life sciences, healthcare - in all of these areas, the tools already exist to do far more than most teams are doing with them. The wider the gap between theoretical coverage and observed usage, the bigger the untapped opportunity. And in many high-value sectors, that gap is enormous. Businesses that close it first will have an advantage that compounds over time, because they'll build the workflows, the institutional knowledge, and the data infrastructure that makes each subsequent improvement easier to capture.

## What This Means for Business Readiness

The research paints a clear picture of where AI capability is concentrated right now. If your business relies heavily on software development, writing, analysis, or research - you're operating in the highest-exposure zones. That's not a warning sign. It's an opportunity.

### The Readiness Gap

Most businesses fall into one of two failure modes:

- **The Pilot Trap**: They've run a proof-of-concept that worked brilliantly in isolation and now can't scale it into real operations.
- **The Waiting Room**: They're holding out for AI to "mature" before engaging - not realising the early movers are already compounding advantages.

The Anthropic data suggests the gap between AI-ready and AI-naive organisations is widening faster than most expect. The high-exposure roles - the ones being augmented most aggressively - belong disproportionately to the knowledge workers who drive revenue, strategy, and product.

### Three Actions Worth Taking Now

1. **Map your exposure.** Which roles in your organisation are in the high-exposure categories? Software developers and writers are obvious. But financial analysts, legal reviewers, and operations researchers are next in line.
2. **Audit your knowledge infrastructure.** Augmented workers need clean, structured, machine-readable information to work from. If your internal knowledge is buried in PDFs and tribal memory, you're capping what AI can do for you.
3. **Start with the highest-value augmentation target.** Not the cheapest task to automate - the most valuable one to accelerate. If your analysts spend 60% of their time gathering data and 40% actually analysing it, help them flip that ratio.

## The Bigger Picture

What Anthropic's research confirms is that the AI transition is not a future event. It's happening now, unevenly distributed, and concentrated in exactly the kinds of knowledge-intensive roles that most businesses depend on most. The organisations that come out ahead won't necessarily be the ones who deployed AI first. They'll be the ones who understood their own operations clearly enough to know where AI would make the biggest difference - and who had the information architecture in place to support it.

That's the work. And most businesses haven't started it yet.`,
  },
  {
    slug: "why-machine-readable-matters",
    title: "Why 'Machine-Readable' is the New 'Mobile-Friendly'",
    excerpt: "In 2010, you needed a responsive site. In 2026, you need responsive data.",
    date: "Feb 3, 2026",
    readTime: "5 min read",
    content: `Remember 2010? Every business scrambled to make their website "mobile-friendly." If your site didn't work on a smartphone, you were invisible to a growing chunk of your audience.

We're at a similar inflection point right now - except the audience isn't humans on phones. It's AI agents, large language models, and automated workflows trying to understand your business.

## The Shift No One's Talking About

Most businesses are optimised for human consumption. Beautiful websites, well-designed PDFs, polished pitch decks. But here's the problem: **AI can't read your pitch deck.**

When a potential client asks ChatGPT "Who are the best AI consultants in London?", the answer isn't pulled from your beautifully designed homepage. It's synthesised from structured data, clear documentation, and machine-readable content scattered across the web.

## What "Machine-Readable" Actually Means

Being machine-readable isn't about adding schema markup to your HTML (though that helps). It's a fundamental shift in how you think about your business information:

- **Your services** need to be described in clear, unambiguous language - not marketing fluff
- **Your expertise** needs to be documented in public, indexable formats
- **Your processes** need APIs, not just SOPs buried in Google Drive
- **Your pricing** needs structure, not "contact us for a quote"

## The Companies Getting This Right

The businesses winning in 2026 are the ones that made their knowledge accessible to machines *before* they needed to. They documented their processes. They structured their data. They built APIs into their workflows.

They didn't do this because they were "AI-first" evangelists. They did it because good information architecture is good business practice. AI readiness was a side effect of operational excellence.

## What You Can Do Today

1. **Audit your public information.** Can an AI accurately describe what you do from your web presence alone?
2. **Document your internal processes.** If a new hire can't find it, neither can an AI agent.
3. **Structure your data.** Move from prose to structured formats wherever possible.
4. **Think in entities, not pages.** Your business has products, services, team members, case studies - model them as data, not just web pages.

The mobile-friendly revolution rewarded companies that adapted early. The machine-readable revolution will do the same. The question is: will you be ready?`
  },
  {
    slug: "the-messy-middle-of-automation",
    title: "The Messy Middle of Automation",
    excerpt: "Why 90% of AI pilots fail to scale beyond the founder's laptop.",
    date: "Jan 20, 2026",
    readTime: "4 min read",
    content: `Every company I work with has the same story. The founder or a tech-savvy team lead built something clever - a GPT wrapper that summarises customer emails, a script that auto-categorises support tickets, a chatbot that answers basic product questions.

It works brilliantly. On their laptop. For about three weeks.

Then reality hits.

## The Pilot Trap

The initial AI pilot is intoxicating. You prompt an LLM, it produces something useful, and suddenly you feel like you've unlocked the future. The demo goes great. Leadership is excited. Budget is approved.

But scaling from "it works on my machine" to "it works for the whole company" is where 90% of these projects die. I call this **The Messy Middle**.

## Why Pilots Fail to Scale

The reasons are almost never technical. They're organisational:

**1. The data isn't ready.**
Your pilot worked because you hand-curated the input data. You cleaned it, formatted it, cherry-picked the good examples. In production, the data is messy, inconsistent, and full of edge cases nobody warned you about.

**2. Nobody owns it.**
The founder built it as a side project. Now it needs monitoring, maintenance, error handling, and someone to answer "why did it say *that*?" at 3am. Who's responsible? Usually nobody.

**3. Trust hasn't been earned.**
The team doesn't trust the AI's output because they've never seen it fail gracefully. One bad result and the whole project gets labelled "not ready."

**4. The process wasn't documented.**
The pilot bypassed your existing workflows. Now you need to integrate it into real business processes, and nobody wrote down how those processes actually work.

## Getting Through the Middle

The companies that successfully scale their AI pilots share three traits:

- **They invest in data infrastructure before they invest in AI.** Clean, structured, accessible data is the foundation. Without it, every AI project is built on sand.
- **They assign ownership.** Someone (a person, not a committee) is responsible for the AI's output quality, uptime, and continuous improvement.
- **They start with augmentation, not automation.** Instead of replacing a workflow, they enhance it. The human stays in the loop until trust is earned through track record.

## The Uncomfortable Truth

The Messy Middle isn't a problem to solve - it's a phase to endure. Every successful automation went through it. The difference between companies that emerge from the other side and those that don't isn't talent or budget.

It's patience, process, and a willingness to do the boring work of data preparation before the exciting work of AI deployment.

If you're stuck in the Messy Middle right now, that's actually a good sign. It means you started. Most companies haven't even done that.`
  },
  {
    slug: "documentation-is-code",
    title: "Documentation is Code",
    excerpt: "Treating your company wiki like a production database.",
    date: "Jan 8, 2026",
    readTime: "6 min read",
    content: `Here's a thought experiment: What if your company wiki went down for a week?

If the answer is "nobody would notice," you have a documentation problem. If the answer is "everything would grind to a halt," congratulations - you've accidentally built something valuable. Now treat it that way.

## The Wiki Graveyard

Most company wikis are where good intentions go to die. Someone creates a page during onboarding. It gets updated once. Then it sits there, slowly rotting, until it's so outdated that everyone knows to ignore it.

Sound familiar? You're not alone. But here's why this matters more than ever: **your documentation is now the training data for your AI tools.**

## Documentation as Infrastructure

When you deploy an AI assistant to help your team, what does it learn from? Your documentation. When you build a customer-facing chatbot, what knowledge base does it draw from? Your documentation. When you automate a workflow, what rules does it follow? Your documentation.

Bad docs don't just frustrate new hires anymore. They produce bad AI outputs, which produce bad business decisions, which cost real money.

## Treating Docs Like Code

Software engineers figured this out years ago. Code has:

- **Version control** - you can see what changed, when, and why
- **Reviews** - changes are reviewed before they go live
- **Testing** - automated checks ensure nothing is broken
- **Ownership** - every file has a maintainer
- **Standards** - consistent formatting, naming, and structure

Your documentation needs all of these things. Here's what that looks like in practice:

### Version Control
Don't just edit a wiki page. Track changes. Know who updated what and when. If something breaks, you need to roll back.

### Reviews
Major documentation changes should be reviewed, just like code. Not by committee - by the person who owns that process or domain.

### Testing
Can your AI assistant answer questions correctly using this documentation? Test it. Regularly. If the AI gives wrong answers, your docs are wrong.

### Ownership
Every document needs an owner. Not a team - a person. Someone who is responsible for keeping it accurate and current.

### Standards
Consistent structure makes documentation machine-readable. Use templates. Define what "done" looks like for a doc page. Enforce it.

## The Payoff

Companies that treat documentation as infrastructure get three things:

1. **Faster onboarding.** New hires (human and AI) get up to speed faster.
2. **Better AI outputs.** Your tools are only as good as the knowledge you feed them.
3. **Institutional resilience.** When someone leaves, their knowledge doesn't leave with them.

## Start Here

Pick one critical process in your business. Document it as if you were explaining it to a competent stranger who will need to do it tomorrow without any help. Use clear, structured language. No jargon. No assumptions.

Then feed that documentation to an AI and ask it questions. If it answers correctly, you've written good documentation. If it doesn't, revise until it does.

That's the bar now. Documentation isn't just for humans anymore. It's for machines too. And machines are much less forgiving of ambiguity.`
  }
];
