/**
 * Build-time index of the routed marketing pages, used by the `browse_offerings`
 * and `ask_site` WebMCP tools. Summaries are taken from each page's own copy —
 * keep them in sync when a page's hero or intro changes.
 */

export type SiteOffering = {
  /** Route path in client/src/App.tsx */
  path: string;
  name: string;
  /** One line, in the page's own words */
  summary: string;
  /** Longer body used for keyword matching by ask_site */
  detail: string;
};

export const SITE_OFFERINGS: SiteOffering[] = [
  {
    path: "/praxis",
    name: "Praxis — client training",
    summary: "The folder is the app. It runs on your machine. It belongs to you.",
    detail:
      "Praxis is Tutto's hands-on client training. You don't need a proprietary platform or an account with us. The only thing you'll need to subscribe to is Claude - about $20 a month - and a free code editor. Point all three at the same folder on your machine. That folder, and what's inside it, is your app. Runs as an eight-session course, £1,600 tuition. The three pieces are the editor (free), the assistant (~$20/mo) and the folder itself.",
  },
  {
    path: "/become-a-trainer",
    name: "Praxis Trainer Track",
    summary: "Teach Praxis, and earn from it — four sessions plus a readiness bar.",
    detail:
      "The Praxis Trainer Track is four sessions. You run the student tutor end to end as a learner, then deliver the core of it back cold, so the rough edges turn up while it is safe to find them. It covers the readiness bar, an honest debrief, access to the private Praxis kit you will teach from, and exactly how clients reach you and get organised. It builds on the client course - you cannot teach a path you have not walked yourself. It is not an accredited qualification; it is Praxis confirming you can teach Praxis well.",
  },
  {
    path: "/pythia",
    name: "Pythia — private knowledge intelligence",
    summary: "Structure it. Search it. Act on it privately.",
    detail:
      "Most organisations have knowledge scattered across files, emails, and tools - findable only by the people who already know where to look. Pythia organises that knowledge into a structured hierarchy, makes it semantically searchable, and connects an AI orchestration layer that can query it, reason across it, and instruct agents to act - without any of that data ever touching an external service.",
  },
  {
    path: "/legalrag",
    name: "LegalRAG — on-premise AI for legal",
    summary: "On-premise AI document intelligence for litigation and legal review.",
    detail:
      "A self-hosted document intelligence platform built for litigation and legal review. All processing, AI inference, and storage stays on your hardware. No data ever leaves the device. Cloud AI creates unacceptable risk for privileged material under Legal Professional Privilege, GDPR and professional conduct rules, and manual review of large disclosure sets is prohibitively slow. LegalRAG brings the AI to the data, not the data to the AI.",
  },
  {
    path: "/gtm-orchestrator",
    name: "GTM Orchestrator — AI sales outreach engine",
    summary: "A custom system that runs B2B prospecting end-to-end.",
    detail:
      "An AI-powered sales outreach engine: a custom system designed and built to run B2B prospecting end-to-end. It researches prospects, writes personalised emails in the sender's voice, schedules and sends safely, and keeps every account in order.",
  },
  {
    path: "/second-brain",
    name: "Second brain — knowledge and process layer",
    summary: "Every conversation draws on your entire accumulated knowledge base.",
    detail:
      "You describe how work gets done - decisions, handoffs, tools, checks, exceptions, approvals. AI identifies process steps, decision points, actors, inputs and outputs, systems used, and rules. A process model is logged to the process layer with context, artefacts and supporting evidence, and connects to relevant knowledge, notes, documents, systems and decisions. Processes evolve as work evolves, and the second brain keeps them current. The base grows richer and more connected every day.",
  },
  {
    path: "/about",
    name: "About Tutto",
    summary: "Learn by doing — who Daniel is and how he works.",
    detail:
      "Making AI useful is a hands-on experience. The technology is new, moving fast, and genuinely powerful when used in the right way. Any leap is less daunting when you take the first step with someone beside you who's taken enough scary ones to like them.",
  },
  {
    path: "/blog",
    name: "Thinking — Tutto's writing",
    summary: "Daniel's published posts on AI, agents and making a business machine-readable.",
    detail:
      "The blog index. Individual posts are searchable through the ask_site tool, which reads them from the site's own blog API.",
  },
];
