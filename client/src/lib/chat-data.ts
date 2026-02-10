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
