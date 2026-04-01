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
      "Hi, I'm Daniel from Tutto.",
      "We help businesses become machine-readable in an AI-first economy.",
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
    slug: "mcp-bridge-sharepoint",
    title: "How We Gave Claude Direct Access to a Client's SharePoint",
    excerpt: "A practical walkthrough of MCP — the open standard quietly transforming how AI connects to business tools — and a real engagement where we built it.",
    date: "Mar 28, 2026",
    readTime: "6 min read",
    content: `There's a frustrating pattern that repeats across almost every AI rollout we see. The team discovers that Claude or ChatGPT can help them with their work. They start copy-pasting data into the chat. The AI gives useful advice. Then they manually carry that advice back into SharePoint, Salesforce, or whatever system they were working in. It works. But it's friction — and friction is where adoption dies.

We just finished an engagement that removes that friction entirely. Here's how it works, and why the underlying technology is one of the most significant quiet shifts in the AI ecosystem right now.

## What MCP Actually Is

MCP stands for Model Context Protocol. It's an open standard created by Anthropic and now backed by the Linux Foundation, OpenAI, Google DeepMind, and others. The short version: it's a universal plug that lets AI assistants connect directly to external tools and data sources.

[VISUAL:mcp-architecture]

Before MCP, every AI-to-tool integration was custom-built. You'd hire a developer, they'd write a specific integration between, say, Claude and your database, and then when the API changed (it always changes) you'd need to update it. MCP standardises the contract. One bridge, built once, works across Claude, ChatGPT, and any other MCP-compatible AI platform.

There are already over 500 MCP servers covering platforms like Slack, Salesforce, GitHub, Google Drive, Jira, PostgreSQL, and more. The ecosystem is growing fast — which means the investment in connecting your systems to MCP pays dividends as AI capabilities expand.

## The Engagement: SharePoint & Power Automate

Our client's operations team was managing a complex web of SharePoint lists, lookup relationships, and Power Automate flows. They were spending significant time on data management tasks — querying records, creating and updating items, troubleshooting broken automations — that AI could handle in seconds if it had direct access.

We built an MCP bridge that gives Claude exactly that access. Four capability areas:

**SharePoint lists and structure.** The AI can create lists, add columns of any type (text, number, lookup, calculated, person fields), set up entity relationships between lists, and inspect full schemas. What used to require navigating SharePoint's UI or writing SharePoint REST API calls is now a conversation.

**Data management.** Query items with filters and sorting. Create, update, and delete records. Run bulk data transformations. The AI constructs the correct API calls, executes them, and returns results in readable form.

**Power Automate diagnostics.** List all flows, inspect their definitions, pull run history with error details, and trigger manual flows on demand. When a flow breaks at 2am and someone needs to understand why, they can ask instead of digging through logs.

**Live documentation.** This one surprised the client most. Before this bridge, Claude's answers about SharePoint's Graph API or Power Automate connectors were sometimes outdated — the models were trained on older documentation. Now the AI searches current Microsoft docs before answering technical questions. The accuracy improvement was immediately noticeable.

## What a Session Looks Like

Here's a condensed version of a real interaction from the engagement:

*"List all SharePoint lists on my site."*
Claude returns a clean table: 8 lists found — Tasks, Clients, Projects, Invoices, Contacts, Documents, Assets, Settings.

*"Add a lookup column on Tasks pointing to the Clients list."*
Claude constructs the correct Graph API call, executes it, confirms: "Column 'Client' (lookup → Clients) added to the Tasks list."

*"Show me the last 5 failed runs on the Invoice Sync flow."*
Claude pulls the run history: 5 failures, most recent error is a connection timeout to Xero API — occurred 3 times in the past 24 hours.

The entire session takes minutes. The equivalent work through SharePoint's UI and Power Automate's logs would have taken the better part of an afternoon.

## The Broader Point

MCP isn't just a technical curiosity — it represents a shift in how AI integration works. Instead of each business building bespoke connections between their tools and AI models, there's now a standard. That means the work of connecting your systems gets easier every month, as more platforms ship native MCP support.

The businesses that get ahead of this aren't the ones with the biggest budgets. They're the ones that identify where their teams are spending time on data movement and tool-switching, and methodically remove that friction.

If you're curious whether MCP makes sense for a specific platform in your stack, the scoping conversation usually takes about 30 minutes. Most bridges take 1–3 days to build and configure.`,
  },
  {
    slug: "anthropic-labor-market-research",
    title: "What Anthropic's Labor Market Research Tells Us About AI Readiness",
    excerpt: "Anthropic's landmark study of one million AI conversations reveals which roles are most exposed to AI — and what businesses should do about it.",
    date: "Mar 14, 2026",
    readTime: "7 min read",
    content: `Anthropic recently published one of the most detailed looks at how AI is actually being used in the real world. By analysing over a million conversations with Claude — with user consent — they mapped which occupations, tasks, and industries are most exposed to AI assistance right now. The findings are striking, and they carry direct implications for any business trying to plan for an AI-first future.

## The Most-Used Task Categories

The first thing that jumps out is where people are spending their time with AI. Software development and coding dominate, making up well over a third of all conversations. Writing and editing come second. After that, you see a long tail of analytical, research, and creative tasks.

[VISUAL:task-breakdown]

This isn't just a snapshot of "what Claude users do." It's a leading indicator of where AI capability is deepest and where businesses have the most to gain — or the most to adapt to.

## The Wage Exposure Inversion

Previous waves of automation — think factory robots, ATMs, customer-service phone trees — disproportionately affected lower-wage, routine physical jobs. AI appears to work differently.

[VISUAL:wage-exposure]

The research found that **higher-wage occupations are more exposed to AI assistance, not less.** Lawyers, analysts, software engineers, researchers, writers — these are the roles where Claude is being used most intensively. For the first time, automation pressure is being felt at the top of the income ladder as much as the bottom.

This inverts the assumption many businesses have made: that AI is a back-office cost-cutting tool. It's increasingly a front-office capability tool.

## Augmentation, Not Replacement

Perhaps the most important nuance in the data: most AI use is **augmentative** — AI is helping humans do their jobs better and faster, not replacing them outright.

[VISUAL:augmentation-split]

This distinction matters enormously for how businesses should plan. A fully automated task requires you to redesign a workflow. An augmented task requires you to upskill the person doing it. Both need investment, but they're very different investments.

## The Capability Gap: Where the Real Opportunity Lives

The most striking chart in the entire study isn't any of the numbers above — it's a radar diagram that overlays two things: theoretical AI capability across occupational categories (blue), and how much AI is actually being used in those categories today (red).

[VISUAL:capability-gap]

Every sector where blue extends far beyond red is a place where businesses are leaving value on the table. The gap isn't a sign that AI isn't ready — it's a sign that the organisations in those sectors haven't caught up yet. Legal, management, education, architecture, life sciences, healthcare — in all of these areas, the tools already exist to do far more than most teams are doing with them. The wider the gap between theoretical coverage and observed usage, the bigger the untapped opportunity. And in many high-value sectors, that gap is enormous. Businesses that close it first will have an advantage that compounds over time, because they'll build the workflows, the institutional knowledge, and the data infrastructure that makes each subsequent improvement easier to capture.

## What This Means for Business Readiness

The research paints a clear picture of where AI capability is concentrated right now. If your business relies heavily on software development, writing, analysis, or research — you're operating in the highest-exposure zones. That's not a warning sign. It's an opportunity.

### The Readiness Gap

Most businesses fall into one of two failure modes:

- **The Pilot Trap**: They've run a proof-of-concept that worked brilliantly in isolation and now can't scale it into real operations.
- **The Waiting Room**: They're holding out for AI to "mature" before engaging — not realising the early movers are already compounding advantages.

The Anthropic data suggests the gap between AI-ready and AI-naive organisations is widening faster than most expect. The high-exposure roles — the ones being augmented most aggressively — belong disproportionately to the knowledge workers who drive revenue, strategy, and product.

### Three Actions Worth Taking Now

1. **Map your exposure.** Which roles in your organisation are in the high-exposure categories? Software developers and writers are obvious. But financial analysts, legal reviewers, and operations researchers are next in line.
2. **Audit your knowledge infrastructure.** Augmented workers need clean, structured, machine-readable information to work from. If your internal knowledge is buried in PDFs and tribal memory, you're capping what AI can do for you.
3. **Start with the highest-value augmentation target.** Not the cheapest task to automate — the most valuable one to accelerate. If your analysts spend 60% of their time gathering data and 40% actually analysing it, help them flip that ratio.

## The Bigger Picture

What Anthropic's research confirms is that the AI transition is not a future event. It's happening now, unevenly distributed, and concentrated in exactly the kinds of knowledge-intensive roles that most businesses depend on most. The organisations that come out ahead won't necessarily be the ones who deployed AI first. They'll be the ones who understood their own operations clearly enough to know where AI would make the biggest difference — and who had the information architecture in place to support it.

That's the work. And most businesses haven't started it yet.`,
  },
  {
    slug: "why-machine-readable-matters",
    title: "Why 'Machine-Readable' is the New 'Mobile-Friendly'",
    excerpt: "In 2010, you needed a responsive site. In 2026, you need responsive data.",
    date: "Feb 3, 2026",
    readTime: "5 min read",
    content: `Remember 2010? Every business scrambled to make their website "mobile-friendly." If your site didn't work on a smartphone, you were invisible to a growing chunk of your audience.

We're at a similar inflection point right now — except the audience isn't humans on phones. It's AI agents, large language models, and automated workflows trying to understand your business.

## The Shift No One's Talking About

Most businesses are optimised for human consumption. Beautiful websites, well-designed PDFs, polished pitch decks. But here's the problem: **AI can't read your pitch deck.**

When a potential client asks ChatGPT "Who are the best AI consultants in London?", the answer isn't pulled from your beautifully designed homepage. It's synthesised from structured data, clear documentation, and machine-readable content scattered across the web.

## What "Machine-Readable" Actually Means

Being machine-readable isn't about adding schema markup to your HTML (though that helps). It's a fundamental shift in how you think about your business information:

- **Your services** need to be described in clear, unambiguous language — not marketing fluff
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
4. **Think in entities, not pages.** Your business has products, services, team members, case studies — model them as data, not just web pages.

The mobile-friendly revolution rewarded companies that adapted early. The machine-readable revolution will do the same. The question is: will you be ready?`
  },
  {
    slug: "the-messy-middle-of-automation",
    title: "The Messy Middle of Automation",
    excerpt: "Why 90% of AI pilots fail to scale beyond the founder's laptop.",
    date: "Jan 20, 2026",
    readTime: "4 min read",
    content: `Every company I work with has the same story. The founder or a tech-savvy team lead built something clever — a GPT wrapper that summarises customer emails, a script that auto-categorises support tickets, a chatbot that answers basic product questions.

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

The Messy Middle isn't a problem to solve — it's a phase to endure. Every successful automation went through it. The difference between companies that emerge from the other side and those that don't isn't talent or budget.

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

If the answer is "nobody would notice," you have a documentation problem. If the answer is "everything would grind to a halt," congratulations — you've accidentally built something valuable. Now treat it that way.

## The Wiki Graveyard

Most company wikis are where good intentions go to die. Someone creates a page during onboarding. It gets updated once. Then it sits there, slowly rotting, until it's so outdated that everyone knows to ignore it.

Sound familiar? You're not alone. But here's why this matters more than ever: **your documentation is now the training data for your AI tools.**

## Documentation as Infrastructure

When you deploy an AI assistant to help your team, what does it learn from? Your documentation. When you build a customer-facing chatbot, what knowledge base does it draw from? Your documentation. When you automate a workflow, what rules does it follow? Your documentation.

Bad docs don't just frustrate new hires anymore. They produce bad AI outputs, which produce bad business decisions, which cost real money.

## Treating Docs Like Code

Software engineers figured this out years ago. Code has:

- **Version control** — you can see what changed, when, and why
- **Reviews** — changes are reviewed before they go live
- **Testing** — automated checks ensure nothing is broken
- **Ownership** — every file has a maintainer
- **Standards** — consistent formatting, naming, and structure

Your documentation needs all of these things. Here's what that looks like in practice:

### Version Control
Don't just edit a wiki page. Track changes. Know who updated what and when. If something breaks, you need to roll back.

### Reviews
Major documentation changes should be reviewed, just like code. Not by committee — by the person who owns that process or domain.

### Testing
Can your AI assistant answer questions correctly using this documentation? Test it. Regularly. If the AI gives wrong answers, your docs are wrong.

### Ownership
Every document needs an owner. Not a team — a person. Someone who is responsible for keeping it accurate and current.

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
