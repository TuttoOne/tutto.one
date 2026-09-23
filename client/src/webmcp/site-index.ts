/**
 * Index of the routed pages, used by the `ask_site` and `browse_offerings`
 * WebMCP tools. Summaries are taken from each page's own copy — keep them in
 * sync when a page's title or intro changes, and drop the entry when a route
 * goes away, or the tools will advertise a 404.
 *
 * The priced services themselves are NOT listed here: `browse_offerings` reads
 * those from the site's own services data (`lib/services-content.ts`, plus
 * whatever the admin has saved), so there is one definition, not two.
 */

export type SitePage = {
  /** Route path in client/src/App.tsx */
  path: string;
  name: string;
  /** One line, in the page's own words */
  summary: string;
  /** Longer body used for keyword matching by ask_site */
  detail: string;
  /** True when this page is something Tutto sells, rather than background. */
  offering: boolean;
};

export const SITE_PAGES: SitePage[] = [
  {
    path: "/",
    name: "Tutto — stop repeating yourself",
    summary: "For firms of 5 to 50 whose staff use AI and save no time with it. The way in is a free 15-minute call.",
    detail:
      "The site's front door. Staff already use AI, and most take as long as before while burning tokens. The page sets out the order that fixes it — a use policy, KPIs as evals, deciding what to hand over, then tools, skills, automation and agents — and prices one offer, The AI-Fluent Team, at its back-to-work price. Both buttons book the free 15-minute intro call.",
    offering: true,
  },
  {
    path: "/services",
    name: "Services — we build it, or you learn to",
    summary: "How we work, and the priced engagements underneath it.",
    detail:
      "We build it, or your team learns to; either way it starts with the rules, a standard for good work and what to hand over. Below that, the priced engagements: the data audit and knowledge mapping diagnostic charged by the day, building on your own infrastructure with your choice of models, and The AI-Fluent Team training programme at a fixed price. Each is priced in the currency the visitor has selected.",
    offering: true,
  },
  {
    path: "/sovereign",
    name: "Sovereign AI — Pythia",
    summary: "Where the system runs, and whose model reads your data.",
    detail:
      "The general front door to Pythia, written in plain language: we design and build the working system, then deploy it wherever you choose — your own hardware, a private or public cloud, or a hosted environment. Where a model is needed, you choose that too. Local, private or public deployment, open-weight or frontier models, human-in-the-loop workflows, and tool selection and integration.",
    offering: true,
  },
  {
    path: "/pythia",
    name: "Pythia — on-premise document intelligence",
    summary: "The same product as /sovereign, written for a legal reader.",
    detail:
      "Pythia organises scattered knowledge into a structured hierarchy, makes it semantically searchable, and connects an AI orchestration layer that can query it, reason across it, and instruct agents to act — without any of that data touching an external service. This page keeps the legal copy; /sovereign is the same product written for a general reader.",
    offering: true,
  },
  {
    path: "/praxis",
    name: "Praxis — client training",
    summary: "Brief it once. It works every time. Training in order: rules, KPIs, what to hand over, then build.",
    detail:
      "Praxis is Tutto's hands-on training. You don't need a proprietary platform or an account with us — an AI assistant subscription and a free code editor, both pointed at the same folder on your machine. That folder, and what's inside it, is your app. The page lays out the training ladder: free sessions, The AI-Fluent Team (eight sessions for an owner and up to four staff), and The Owner's Fast Track (four private sessions), both at a back-to-work price with the regular price struck through. Every CTA on the page opens a conversation rather than selling an hour.",
    offering: true,
  },
  {
    path: "/calendar",
    name: "Applied AI Evenings",
    summary: "The monthly cycle of evening classes, with the dates.",
    detail:
      "The Applied AI Evenings calendar, run as one monthly cycle rather than a list of one-off dates. Marked off from the Praxis course proper.",
    offering: true,
  },
  {
    path: "/become-a-trainer",
    name: "Praxis Trainer Track",
    summary: "Teach Praxis, and earn from it — four sessions plus a readiness bar.",
    detail:
      "The Praxis Trainer Track is four sessions. You run the student tutor end to end as a learner, then deliver the core of it back cold, so the rough edges turn up while it is safe to find them. It covers the readiness bar, an honest debrief, access to the private Praxis kit you will teach from, and exactly how clients reach you and get organised. It builds on the client course — you cannot teach a path you have not walked yourself. It is not an accredited qualification; it is Praxis confirming you can teach Praxis well.",
    offering: true,
  },
  {
    path: "/gtm-orchestrator",
    name: "GTM — on-premise sales outreach engine",
    summary: "A custom system that runs B2B prospecting end-to-end.",
    detail:
      "A custom system designed and built to run B2B prospecting end-to-end. It researches prospects, writes personalised emails in the sender's voice, schedules and sends safely, and keeps every account in order.",
    offering: true,
  },
  {
    path: "/applied",
    name: "Applied AI, at length",
    summary: "The long version of the argument the front door makes briefly.",
    detail:
      "The long-form explainer, which was the home page until the landing page took the root route. The front door links here as the long version of its argument.",
    offering: false,
  },
  {
    path: "/usecase",
    name: "Use cases — recorded runs",
    summary: "Worked examples of the systems actually running.",
    detail:
      "Recorded runs shown as worked examples, so a reader can watch what one of these systems does before commissioning one.",
    offering: false,
  },
  {
    path: "/portfolio",
    name: "Portfolio",
    summary: "Selected work.",
    detail: "The portfolio of past and current engagements.",
    offering: false,
  },
  {
    path: "/about",
    name: "About Tutto",
    summary: "Who is behind Tutto, and how they work.",
    detail:
      "Making AI useful is a hands-on experience. The technology is new, moving fast, and genuinely powerful when used in the right way. Any leap is less daunting when you take the first step with someone beside you who's taken enough scary ones to like them.",
    offering: false,
  },
  {
    path: "/blog",
    name: "Thinking — Tutto's writing",
    summary: "Published posts on AI, agents and making a business machine-readable.",
    detail:
      "The blog index. Individual posts are searchable through the ask_site tool, which reads them from the site's own blog API.",
    offering: false,
  },
  {
    path: "/contact",
    name: "Contact",
    summary: "The contact form, and the link to book a call.",
    detail:
      "The contact page carries the enquiry form and the booking link. The submit_enquiry tool posts to the same intake this form uses.",
    offering: false,
  },
];
