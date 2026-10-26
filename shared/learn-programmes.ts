/**
 * The modules a student works through on /learn, one list per programme.
 *
 * A cohort points at one of these by `programmeKey`. The dates, the call link
 * and the timezone belong to the cohort (in the database); what each session
 * covers belongs here, so it is edited like the rest of the site's copy and
 * reviewed against VOICE.md.
 *
 * Copy sources, so the dashboard says what the client was sold:
 * - `ai-fluent-team`: the sessions on /praxis-programme
 *   (client/src/pages/praxis-programme.tsx) and the artefacts in the HSA quote.
 * - `background-italia`: the 8 sessions in Alice Cappiello's proposal
 *   (30 September 2026), which is what Quote 00103 refers to.
 * - `solo-fast-track`: Alex Boshoff's 4 sessions, from our call on 2 October
 *   and her WhatsApp of 7 October (her own tools first, then the business idea).
 * - `hsa-content-team`: the 6 sessions in the HSA training plan (21 October 2026),
 *   as sent to Christine Venter.
 */

/** `claude` is the tool's Markdown version: the same steps, run with any AI assistant. */
export type Material = { label: string; href: string; claude?: string };

/** The hand-drawn icon for a session, drawn in client/src/components/learn/ModuleIcon.tsx. */
export type ModuleIcon = "rules" | "scorecard" | "signpost" | "pencil" | "plug" | "magnifier" | "gear" | "robot"
  // Drawn for the /rieuzal evenings: the launch, the bonus, accounts, front desk and sales.
  | "terminal" | "question" | "calculator" | "chat";

export const MODULE_ICONS: ModuleIcon[] = ["rules", "scorecard", "signpost", "pencil", "plug", "magnifier", "gear", "robot", "terminal", "question", "calculator", "chat"];

export type Module = {
  number: number;
  title: string;
  icon: ModuleIcon;
  what: string;
  /** The thing they take away. Some sessions are about practice and have none. */
  leaveWith?: string;
  /** The short task between this session and the next. */
  practice: string;
  materials: Material[];
  /** A note from us, shown on the dashboard once the session is marked done. One string per paragraph. */
  afterNote?: string[];
  /** Links that go with the note. */
  afterLinks?: Material[];
};

export type Programme = {
  key: string;
  /** Reads after "your": "Welcome to your Praxis programme". */
  name: string;
  modules: Module[];
};

// Shared reading, so the links are spelt once.
const M = {
  startHere: { label: "Start here", href: "/courses/00-praxis-start-here.html" },
  limits: { label: "What AI can and can't do", href: "/courses/10-praxis-ai-capabilities-and-limitations.html" },
  claude101: { label: "Claude 101", href: "/courses/01-praxis-claude-101.html" },
  claudeCode101: { label: "Claude Code 101", href: "/courses/02-praxis-claude-code-101.html" },
  cowork: { label: "Claude Cowork", href: "/courses/03-praxis-introduction-to-claude-cowork.html" },
  claudeCodeInAction: { label: "Claude Code in action", href: "/courses/04-praxis-claude-code-in-action.html" },
  fluency: { label: "AI fluency: the foundations", href: "/courses/05-praxis-ai-fluency-framework-foundations.html" },
  api: { label: "Building with the Claude API", href: "/courses/06-praxis-claude-with-the-anthropic-api.html" },
  mcp: { label: "Connecting tools with MCP", href: "/courses/07-praxis-introduction-to-model-context-protocol.html" },
  skills: { label: "Agent skills", href: "/courses/08-praxis-introduction-to-agent-skills.html" },
  subagents: { label: "Subagents", href: "/courses/09-praxis-introduction-to-subagents.html" },
  skillFile: { label: "Writing your skill file", href: "/praxis/learn/praxis-foundations/03-skill-file" },
  evals: { label: "Evals: proving the output is good", href: "/praxis/learn/praxis-foundations/05-evals" },
  charterTool: { label: "AI charter tool", href: "/ai-charter", claude: "/ai-charter/praxis-ai-charter.md" },
  charterToolMe: { label: "AI charter tool (just me)", href: "/ai-charter?for=me", claude: "/ai-charter/praxis-ai-charter.md" },
  scorecardTool: { label: "Agent scorecard tool", href: "/agent-scorecard", claude: "/agent-scorecard/praxis-agent-scorecard.md" },
  handoverTool: { label: "Hand-over check", href: "/handover-list", claude: "/handover-list/praxis-handover-check.md" },
} satisfies Record<string, Material>;

const AI_FLUENT_TEAM: Programme = {
  key: "ai-fluent-team",
  name: "AI-Fluent Team programme",
  modules: [
    {
      number: 1,
      title: "Rules first",
      icon: "rules",
      what: "What goes in, which tools and connections are allowed, what never leaves the building and what happens when the rule is broken. We set up your assistant safely while we write it.",
      leaveWith: "Your AI Use Charter",
      practice: "Pick one real task from your week that you'd like AI to help with, and bring it to session 2.",
      materials: [M.charterTool, M.startHere, M.limits],
    },
    {
      number: 2,
      title: "Define good",
      icon: "scorecard",
      what: "Pick the jobs that repeat. For each one, write down what good output looks like and how you'd score it. These are your evals: the standard every piece of AI work gets judged against.",
      leaveWith: "A KPI Scorecard per role",
      practice: "Score one piece of your own work against the scorecard and note where it falls short.",
      materials: [M.scorecardTool],
    },
    {
      number: 3,
      title: "Decide what to hand over",
      icon: "signpost",
      what: "Which jobs AI should do, which it shouldn't and what each one needs to run without you: the inputs, the rules, the check at the end.",
      leaveWith: "Your hand-over list",
      practice: "Run one more of your jobs through the hand-over check.",
      materials: [M.handoverTool, M.claude101],
    },
    {
      number: 4,
      title: "Brief it once",
      icon: "pencil",
      what: "Turn each job on the list into standing instructions: the audience, the constraints, an example of good. Written once, read by the assistant every time, so nobody explains the same job twice.",
      leaveWith: "Standing briefs for your top three jobs",
      practice: "Use your standing brief on a real job this week and write down what you still had to correct.",
      materials: [M.fluency, M.skillFile],
    },
    {
      number: 5,
      title: "Tools",
      icon: "plug",
      what: "Connect the assistant to your files and the apps you already use. Build the first small tools that do a job end to end, with you in control of what they can touch.",
      practice: "Use your first tool on a real job and keep a note of anything it got wrong.",
      materials: [M.cowork, M.mcp],
    },
    {
      number: 6,
      title: "Check it before it ships",
      icon: "magnifier",
      what: "Score the output against your KPIs. Where it falls short, fix the brief and leave the draft alone. Agree who signs off and what gets checked before anything leaves.",
      leaveWith: "Your Verification Protocol",
      practice: "Put one piece of AI work through the protocol before it goes out.",
      materials: [M.evals],
    },
    {
      number: 7,
      title: "Skills and automation",
      icon: "gear",
      what: "Package what works into skills the whole team can call, and schedule the jobs that should run without anyone asking.",
      practice: "Ask a colleague to use one of your skills and tell you where it tripped them up.",
      materials: [M.skills],
    },
    {
      number: 8,
      title: "Agents, and a clean handover",
      icon: "robot",
      what: "Your first agent: a job that runs on its own, on your data, checked against your scorecard. Then hand it over cleanly, so it is still changeable in a year.",
      practice: "For the next 30 days, send one piece of work a week for review.",
      materials: [M.subagents, M.claudeCodeInAction],
    },
  ],
};

const BACKGROUND_ITALIA: Programme = {
  key: "background-italia",
  name: "Praxis programme",
  modules: [
    {
      number: 1,
      title: "Rules first",
      icon: "rules",
      what: "What may go into the tools (client names, personal data, bank details, contracts), which connections are allowed (email, Google Drive or SharePoint) and what never leaves the office. We check the settings on each account, including switching off training on your data, and write it the way you'd brief a new hire.",
      leaveWith: "Your AI use policy, first draft",
      practice: "Pick one real task from your week and bring it to week 2. Until the policy is agreed, use a redacted or dummy version.",
      materials: [M.charterTool, M.startHere, M.limits],
    },
    {
      number: 2,
      title: "Define good",
      icon: "scorecard",
      what: "Pick the jobs that repeat, starting with the client reports that follow the same standard every time. For each one, write down what good looks like and how you'd score it: complete, correct data, no invented facts, no typos, sounds like you.",
      leaveWith: "A scorecard for each recurring job",
      practice: "Score one of your own recent reports against the scorecard and note where it falls short.",
      materials: [M.scorecardTool],
    },
    {
      number: 3,
      title: "Which tool, and what to hand over",
      icon: "signpost",
      what: "Claude, ChatGPT, Mistral or a model that runs on your own machine: which fits your policy and your clients, and which subscription makes sense for the team. Then which jobs AI should do, which it shouldn't and what each one needs.",
      leaveWith: "A tool and subscription recommendation, and your hand-over list",
      practice: "Run one more of your jobs through the hand-over check.",
      materials: [M.handoverTool, M.claude101],
    },
    {
      number: 4,
      title: "Brief it once",
      icon: "pencil",
      what: "Teach it to write like you and stop sounding like Claude. We take samples of your own writing, have it describe your style and put that where it's read every time. Your report-review prompt becomes standing instructions for the whole team.",
      leaveWith: "Standing instructions for your 3 key jobs",
      practice: "Use the standing instructions on a real job this week and write down what you still had to correct.",
      materials: [M.fluency, M.skillFile],
    },
    {
      number: 5,
      title: "Tools",
      icon: "plug",
      what: "Connect the assistant to your files within the rules from week 1. Replace copy and paste for the recurring client work with structured input from your own templates: report data, contract drafts with placeholders instead of real names, new landing pages from your existing structure.",
      leaveWith: "Your first small tools, set up on your own machines",
      practice: "Use your first tool on a real job and keep a note of anything it got wrong.",
      materials: [M.cowork, M.mcp],
    },
    {
      number: 6,
      title: "Check it before it ships",
      icon: "magnifier",
      what: "How every AI draft gets checked before a client sees it: sources, figures, names and dates, anything it may have made up. Where the output falls short, fix the brief rather than the draft. Agree who signs off.",
      leaveWith: "Your checking routine and sign-off",
      practice: "Put one AI draft through the checking routine before it goes to a client.",
      materials: [M.evals],
    },
    {
      number: 7,
      title: "Skills and automation",
      icon: "gear",
      what: "Package what works into skills the whole team can call (translation, polishing, report review) and schedule the jobs that should run without anyone asking.",
      leaveWith: "Shared skills your team can use",
      practice: "Ask a colleague to use one of your skills and tell you where it tripped them up.",
      materials: [M.skills],
    },
    {
      number: 8,
      title: "Agents, and what comes next",
      icon: "robot",
      what: "Your first agent: one recurring job that runs on its own, on your data, checked against your scorecard. Then we go through the list of bigger jobs that came up along the way and agree which are worth building in January.",
      leaveWith: "A working agent and your list of next builds",
      practice: "For the next 30 days, send one piece of work a week for review.",
      materials: [M.subagents, M.claudeCodeInAction],
    },
  ],
};

const SOLO_FAST_TRACK: Programme = {
  key: "solo-fast-track",
  name: "Praxis Solo Fast Track",
  // Built with the end in mind: the pieces of her own tools (figures in, UK tax
  // rules, a check, an alert) are the pieces of the app she wants to build for others.
  modules: [
    {
      number: 1,
      title: "Set up, and your first tools",
      icon: "rules",
      what: "We set up your UK-hosted machine so your financial data stays in the UK, get Claude working on it and move across the prompts you've built up in ChatGPT. We agree your own rules: what goes in, what stays out and where it all runs. Then we build your first tool: a watch on the stocks you follow that alerts you to big price moves and news.",
      leaveWith: "A working setup, your personal AI rules and a stock alert",
      practice: "Let the stock alert run for a fortnight and note every alert that was useless or missing.",
      materials: [M.charterToolMe, M.startHere, M.limits],
    },
    {
      number: 2,
      title: "Your tax year, and the business idea",
      icon: "pencil",
      what: "We build the tool that collects your figures as the year goes on, so the year-end return is mostly done when it arrives. The UK tax rules we write down for it become standing instructions your app will use too. Then we start on the business idea: who it's for, what it does for them and what a good answer looks like.",
      leaveWith: "A tax-year tool, your first skill file and a one-page brief for the app",
      practice: "Write down three people the app is for and the one question each of them would ask it.",
      materials: [M.skillFile, M.scorecardTool, M.fluency],
    },
    {
      number: 3,
      title: "Build the app with Claude Code",
      icon: "plug",
      what: "We build the first version of the app for others, one piece at a time, reusing what already works in your own tools. At each step I explain how and why, so you can carry on without me.",
      leaveWith: "A first working version of the app on your own machine",
      practice: "Add one small feature on your own and bring what went wrong.",
      materials: [M.claudeCode101, M.claudeCodeInAction],
    },
    {
      number: 4,
      title: "Agents, and AI inside your app",
      icon: "robot",
      what: "Your first agent, checked against what we agreed a good answer looks like. Then how to call Claude from inside your own app. We look at where the FCA draws the line between guidance and advice, what that means for the app and what comes next.",
      leaveWith: "A working agent and a plan for the app",
      practice: "For the next 30 days, send one piece of work a week for review.",
      materials: [M.api, M.mcp, M.evals],
    },
  ],
};

const HSA_CONTENT_TEAM: Programme = {
  key: "hsa-content-team",
  name: "AI training programme",
  modules: [
    {
      number: 1,
      title: "Foundations and ground rules",
      icon: "rules",
      what: "How these tools work and where they go wrong. What you can and can't share: learner data, your IP, Council rules and your own policy. We set up Copilot with Claude inside your own account, so your content stays with you. As a first try, we summarise a section of Stock Receiving.",
      leaveWith: "A one-page AI use policy and a working setup",
      practice: "Summarise one more section of Stock Receiving on your own and note where the summary needed correcting.",
      materials: [M.charterTool, M.startHere, M.limits],
      afterNote: [
        "Thank you for your time in our first session.",
        "I know you're feeling overwhelmed at this point. That's completely normal. As you use the tools during the course you'll gain more confidence in the things we discussed today, and we keep coming back to the concepts, so don't feel you need to remember everything (or even anything) from today.",
        "Your first task is to install VS Code using the setup guide below. It takes about 30 minutes and the steps are all there with pictures.",
        "We've recommended a Claude Pro account for each of you for the first month, at least while you're learning. It helps with the work you need to do after that too. Christine and I are sorting out the accounts this week, so check with her before you sign up for anything.",
        "I'm offering 15-minute calls this week for anyone who needs help with the setup. Let Christine or me know when you have time and I'll fit around you.",
        "The other thing to start this week is your AI policy, with the charter tool below. It doesn't need to be finished, just started.",
        "Again, I know it's a lot. Nobody expects you to have it all after one session. Today was the start of upskilling and improving the way we work with AI, and that takes time.",
        "Daniel",
      ],
      afterLinks: [{ label: "VS Code setup guide", href: "/vscode-setup" }, M.charterTool],
    },
    {
      number: 2,
      title: "Getting your content ready",
      icon: "pencil",
      what: "Turning the Word guides into clean text the AI can work with, and tagging each part by module, unit, outcome, assessment criteria, credits and notional hours. We build the tagging scheme together on Stock Receiving.",
      leaveWith: "A tagging template and a tagged pilot module",
      practice: "Tag one more unit with the template and bring anything that didn't fit.",
      materials: [M.claude101],
    },
    {
      number: 3,
      title: "Remapping the curriculum, part 1",
      icon: "signpost",
      what: "We load the old and new curriculum side by side and have the AI draft the crosswalk: old unit to new module, credits and hours moved, and what shifts between basic, post-basic and technician. Then we learn how to check every line of it against the source.",
      leaveWith: "A draft mapping document and a way to check it",
      practice: "Check 10 lines of the draft mapping against the source documents and mark any that are wrong.",
      materials: [M.scorecardTool],
    },
    {
      number: 4,
      title: "Remapping, part 2: gaps and new content",
      icon: "magnifier",
      what: "Find what's missing in the new structure, the new maths module for one. Teach the AI your house style so new material reads like what you already have, then draft one gap unit together in that style.",
      leaveWith: "A gap list, a house-style prompt and one drafted unit",
      practice: "Use the house-style prompt on one more piece of new material and note what you still had to change.",
      materials: [M.skillFile, M.fluency],
    },
    {
      number: 5,
      title: "What's possible for learning and assessment",
      icon: "robot",
      what: "Live demos on Stock Receiving: an audio summary or short podcast, a short explainer video, a clinical scenario or role play, voice answers in place of typing and auto-marked activities in place of the crossword. What Moodle can take, and when to keep paper or a plain PDF.",
      leaveWith: "An options menu: activity type, tool, effort and whether to do it yourselves or brief someone",
      practice: "Pick the 2 options from the menu you'd try first on Stock Receiving, and say why.",
      materials: [M.handoverTool],
    },
    {
      number: 6,
      title: "Putting it together",
      icon: "gear",
      what: "Redesign one Stock Receiving lesson as a blended journey: short digital chunks, then facilitator time. How to write a brief for a freelancer, or for us. Then plan the 10-month rescope, from mapping to Council submission.",
      leaveWith: "A lesson outline, a brief template and a 10-month roadmap",
      practice: "Share the roadmap with the team and bring back what they'd change.",
      materials: [M.scorecardTool, M.handoverTool],
    },
  ],
};

export const PROGRAMMES: Record<string, Programme> = {
  [AI_FLUENT_TEAM.key]: AI_FLUENT_TEAM,
  [BACKGROUND_ITALIA.key]: BACKGROUND_ITALIA,
  [SOLO_FAST_TRACK.key]: SOLO_FAST_TRACK,
  [HSA_CONTENT_TEAM.key]: HSA_CONTENT_TEAM,
};

export function getProgramme(key: string): Programme | undefined {
  return PROGRAMMES[key];
}
