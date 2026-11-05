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
    name: "Tutto Applied AI: AI training for teams",
    summary: "For teams overwhelmed by what they hear about Claude. One track: the team course.",
    detail:
      "The site's front door. People say Claude is amazing, scary, expensive, that it hallucinates, is a sycophant, will steal their data or take their job. The page tells a visitor who feels left behind that it is still early, and invites them to get ahead together. AI is new and can seem complex, but the visitor knows their own work and business inside out, so Tutto starts there: first it sets up the team's AI around what they know, then builds on that setup together with the team, through rich conversations and worked examples. Tutto teaches, but the team does most of the talking, making and refining, and teaching it back to the group is how they come to understand it. The page sets out 4 steps to top AI work and prices the team course (eight topics, at /praxis-programme). One-to-one and small-group options are on /praxis.",
    offering: true,
  },
  {
    path: "/services",
    name: "Services: we build it, or you learn to",
    summary: "How we work, and the engagements underneath it.",
    detail:
      "We build it, or your team learns to. Either way it starts with the rules, a standard for good work and what to hand over. Below that, the engagements: the data audit and knowledge mapping diagnostic, building on your own infrastructure with your choice of models, and the team course at a fixed price. Build work and the diagnostic are quoted after a first call. The team course is priced in the currency the visitor has selected.",
    offering: true,
  },
  {
    path: "/sovereign",
    name: "Sovereign AI on your own hardware",
    summary: "Where the system runs, and whose model reads your data.",
    detail:
      "Written in plain language: we design and build a system that reads everything a business holds and answers from it, on hardware the client owns, in their building. Nothing is uploaded. Build work is quoted after a first call; the page gives indicative prices for the hardware it runs on. Linked from the site footer.",
    offering: true,
  },
  {
    path: "/pythia",
    name: "On-premise document AI for legal work",
    summary: "The same system as /sovereign, written for a legal reader.",
    detail:
      "A document system that organises scattered knowledge into a structured hierarchy, makes it semantically searchable, and connects an AI orchestration layer that can query it, reason across it, and instruct agents to act, without any of that data touching an external service. This page keeps the legal copy; /sovereign is the same system written for a general reader.",
    offering: true,
  },
  {
    path: "/praxis",
    name: "Training for your team: the Praxis method",
    summary: "Brief it once. It works every time. Training in order: rules, KPIs, what to hand over, then build.",
    detail:
      "Tutto Applied AI's hands-on training, built on the Praxis method. You don't need a proprietary platform or an account with us: an AI assistant subscription and a free code editor, both pointed at the same folder on your machine. That folder, and what's inside it, is your app. The page lays out the training ladder: free sessions, the team course (eight topics for an owner and up to four staff, in eight, six or four sessions), one-to-one (four private sessions) and a small group (the same four sessions with three peers, priced per person, at /peer-groups). Every CTA on the page opens a conversation rather than selling an hour.",
    offering: true,
  },
  {
    path: "/become-a-trainer",
    name: "Praxis Trainer Track",
    summary: "Teach Praxis, and earn from it: four sessions plus a readiness bar.",
    detail:
      "The Praxis Trainer Track is four sessions. You run the student tutor end to end as a learner, then deliver the core of it back cold, so the rough edges turn up while it is safe to find them. It covers the readiness bar, an honest debrief, access to the private Praxis kit you will teach from, and exactly how clients reach you and get organised. It builds on the client course. You cannot teach a path you have not walked yourself. It is not an accredited qualification; it is Praxis confirming you can teach Praxis well.",
    offering: true,
  },
  {
    path: "/peer-groups",
    name: "AI training in a small group",
    summary: "The four one-to-one sessions, taken in a group of four people with a similar background.",
    detail:
      "For people who ran a company and now work on their own. We put you in a group of four people with a similar background, so you work through your own tasks and hear how the others are thinking about theirs. The same four 90-minute sessions as one-to-one, online, at fixed weekly times. You put your name on the list with the times that suit you, book a 15-minute call, and a deposit holds your seat. The deposit is refunded in full if no group forms in time, and a group starts with three if the last seat stays open.",
    offering: true,
  },
  {
    path: "/rieuzal",
    name: "Ateliers IA à Rieuzal (in-person workshops, in French)",
    summary: "6 free 90-minute practical workshops from November 2026 to March 2027 at the Manoir de Rieuzal, Loubressac (Lot), with Mistral. 15 places, booking required.",
    detail:
      "In-person practical workshops (ateliers) in French for companies around the Lot, at the Manoir de Rieuzal, 370 Chemin de Rieuzal, Loubressac, 18:30 to 20:00. The six dates announced: Tuesday 24 November 2026, Thursday 10 December 2026, Tuesday 12 January 2027, Thursday 28 January 2027, Tuesday 2 March 2027 and Thursday 18 March 2027. Each one uses Mistral on real tasks, then a discussion. It teaches a method that works the same with Claude, ChatGPT or Mistral, on the infrastructure and in the region you choose. Themes in order: a working folder so an agent can run on its own, a machine that stays on, security, your AI policy, a scorecard for agents and agents as subcontractors. Free, 15 places, booked on the page for 1 to 4 people. When one is full, visitors can join the waiting list and get the place automatically when someone cancels.",
    offering: false,
  },
  {
    path: "/gtm-orchestrator",
    name: "On-premise sales outreach engine",
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
    name: "Use cases: recorded runs",
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
      "Tutto trains teams to use AI properly, then builds what's worth building. Staff already use AI and save nothing with it; Tutto fixes that in order (the rules, a KPI for each job, what to hand over), then builds tools, skills, automation and agents. A small team: Roxanne Northover (operations, process, practical AI) and Daniel Forsthofer (applied AI, architecture, delivery).",
    offering: false,
  },
  {
    path: "/blog",
    name: "Thinking: Tutto's writing",
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
