/**
 * Update emails to students: news that isn't a welcome or a sign-in link.
 * Each mailing has a key; student_mailings records who has had which, so
 * the admin can send one to a cohort without anyone getting it twice.
 *
 * Like learn-emails.ts, these are pure functions that hand back subject,
 * HTML and text, so the admin can preview before sending.
 */
import { escapeHtml } from "./enquiry-message";
import { AMBER, INK, MUTED, RULE, P, button, shell } from "./learn-emails";

export type MailingInput = { firstName: string; signInUrl: string; site: string; teamSize: number };
export type Mailing = {
  key: string;
  /** What the admin sees on the send button. */
  label: string;
  /** "one" goes to a single person (the sponsor) from their student row, not to the whole cohort. */
  audience?: "cohort" | "one";
  build: (o: MailingInput) => { subject: string; html: string; text: string };
};

const FILES = [
  { name: "AI charter", path: "/ai-charter/praxis-ai-charter.md" },
  { name: "Agent scorecard", path: "/agent-scorecard/praxis-agent-scorecard.md" },
  { name: "Hand-over check", path: "/handover-list/praxis-handover-check.md" },
  { name: "Use case card", path: "/use-case-card/praxis-use-case-card.md" },
];

const GUIDES = [
  { title: "Set up VS Code with Claude and Mistral", blurb: "Six steps from a fresh install to your first task with both agents. About 30 minutes.", path: "/vscode-setup", cta: "Open the setup guide" },
  { title: "Use the tool files with your AI", blurb: "Drop a file into your folder, start a chat and let your AI guide you. About 5 minutes.", path: "/ai-files", cta: "Open the guide" },
];

function guideCard(g: (typeof GUIDES)[number], site: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 12px;border:1px solid ${RULE};border-radius:8px;background:#ffffff;">
<tr><td style="padding:16px 18px;">
<p style="margin:0 0 4px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;color:${AMBER};">Guide</p>
<p style="margin:0 0 6px;font-size:16px;font-weight:700;color:${INK};">${escapeHtml(g.title)}</p>
<p style="margin:0 0 10px;font-size:14px;line-height:1.5;color:${MUTED};">${escapeHtml(g.blurb)}</p>
<a href="${escapeHtml(site + g.path)}" style="font-size:14px;font-weight:700;color:${AMBER};text-decoration:none;">${escapeHtml(g.cta)} &rarr;</a>
</td></tr></table>`;
}

const aiFiles: Mailing = {
  key: "ai-files-2026-10",
  label: "AI files update",
  build: ({ firstName, signInUrl, site }) => {
    const subject = "Your Praxis tools now work with your own AI";
    const intro = "Every tool we use in the programme now comes as a file you can give to your own AI: Claude, ChatGPT, Mistral, Gemini, Copilot or any other. Download the file, start a chat and your AI walks you through the same steps as the tool on the site.";
    const tip = "Answer the questions and let your AI guide you through. Tell it if parts aren't relevant to your task. Then test the result, ideally on something where you already know the answer. Showing it what good work looks like beats describing it, and doing both gives you the best results.";

    const body = `
<tr><td>
<p style="${P}">Hi ${escapeHtml(firstName)},</p>
<p style="${P}">${escapeHtml(intro)}</p>
<p style="margin:0 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">Two guides to get you going</p>
${GUIDES.map((g) => guideCard(g, site)).join("")}
<p style="margin:20px 0 8px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">The files</p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:15px;line-height:1.7;">${FILES.map((f) => `<li><a href="${escapeHtml(site + f.path)}" style="color:${AMBER};">${escapeHtml(f.name)}</a></li>`).join("")}</ul>
<p style="${P}">They're also on your dashboard, next to each tool, marked "Download for your AI (.md)".</p>
${button(signInUrl, "Open your dashboard")}
<p style="margin:0 0 16px;font-size:13px;color:${MUTED};">The button signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.</p>
<p style="${P}"><strong>A tip from me:</strong> ${escapeHtml(tip)}</p>
<p style="${P}">Your answers stay in your AI's chat, under that tool's terms, so leave out anything confidential unless your organisation has approved the tool.</p>
<p style="${P}">Any questions, just reply to this email.</p>
<p style="${P}">Daniel</p>
</td></tr>`;

    const text = [
      `Hi ${firstName},`,
      "",
      intro,
      "",
      "Two guides to get you going:",
      ...GUIDES.map((g) => `- ${g.title}: ${site}${g.path}\n  ${g.blurb}`),
      "",
      "The files:",
      ...FILES.map((f) => `- ${f.name}: ${site}${f.path}`),
      "",
      'They\'re also on your dashboard, next to each tool, marked "Download for your AI (.md)".',
      "",
      `Open your dashboard: ${signInUrl}`,
      "(The link signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.)",
      "",
      `A tip from me: ${tip}`,
      "",
      "Your answers stay in your AI's chat, under that tool's terms, so leave out anything confidential unless your organisation has approved the tool.",
      "",
      "Any questions, just reply to this email.",
      "",
      "Daniel",
    ].join("\n");

    return { subject, html: shell(subject, body), text };
  },
};

// To the sponsor after session 1: they're overwhelmed, so reassure them, then
// the setup, the accounts decision, setup calls and the policy.
const afterSession1: Mailing = {
  key: "after-session-1",
  label: "After session 1 (to the sponsor)",
  audience: "one",
  build: ({ firstName, signInUrl, site, teamSize }) => {
    const subject = "After our first session: setup and your next steps";
    const team = teamSize > 1 ? `${teamSize} accounts` : "an account";
    const paras = {
      thanks: "Thank you for your time in our first session.",
      overwhelmed: "I know you're feeling overwhelmed at this point. That's completely normal. As you use the tools during the course you'll gain more confidence in the things we discussed today, and we keep coming back to the concepts, so don't feel you need to remember everything (or even anything) from today.",
      setup: "The first task for everyone is to install VS Code using the setup guide. It takes about 30 minutes and the steps are all there with pictures.",
      accounts: `We recommend a Claude account for this work, at least while you're learning. It helps with the work you need to do after that too. Claude is already partly in your Copilot, but you'll get much more out of going straight to Claude Pro: ${team} for one month. After that you can decide who keeps one.`,
      shared: "If the cost of several accounts is a problem, one shared account can work and I can help set it up. Everyone would see everyone else's chat history in the Claude app, but the sessions on your own computers stay private. With several people on it you'd also use up the account's limits much faster.",
      calls: "I'm offering 15-minute calls this week for anyone who needs help with the setup. Please let me know when people have time and I'll fit around them.",
      policy: "The other thing to start this week is your AI policy. The charter tool walks you through it one question at a time. It doesn't need to be finished, just started.",
      close: "Again, I know it's a lot. Nobody expects you to have it all after one session. Today was the start of upskilling and improving the way we work with AI, and that takes time.",
    };
    const link = (path: string, label: string) =>
      `<a href="${escapeHtml(site + path)}" style="font-size:15px;font-weight:700;color:${AMBER};text-decoration:none;">${escapeHtml(label)} &rarr;</a>`;

    const body = `
<tr><td>
<p style="${P}">Hi ${escapeHtml(firstName)},</p>
<p style="${P}">${escapeHtml(paras.thanks)}</p>
<p style="${P}">${escapeHtml(paras.overwhelmed)}</p>
<p style="${P}">Your dashboard has the dates, the reading and the tools:</p>
${button(signInUrl, "Open your dashboard")}
<p style="margin:0 0 16px;font-size:13px;color:${MUTED};">The button signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.</p>
<p style="${P}">${escapeHtml(paras.setup)}</p>
<p style="${P}">${link("/vscode-setup", "Open the VS Code setup guide")}</p>
<p style="${P}">${escapeHtml(paras.accounts)}</p>
<p style="${P}">${escapeHtml(paras.shared)}</p>
<p style="${P}">${escapeHtml(paras.calls)}</p>
<p style="${P}">${escapeHtml(paras.policy)}</p>
<p style="${P}">${link("/ai-charter", "Open the charter tool")}</p>
<p style="${P}">${escapeHtml(paras.close)}</p>
<p style="${P}">Any questions, just reply to this email.</p>
<p style="${P}">Daniel</p>
</td></tr>`;

    const text = [
      `Hi ${firstName},`,
      "",
      paras.thanks,
      "",
      paras.overwhelmed,
      "",
      `Your dashboard has the dates, the reading and the tools: ${signInUrl}`,
      "(The link signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.)",
      "",
      paras.setup,
      `VS Code setup guide: ${site}/vscode-setup`,
      "",
      paras.accounts,
      "",
      paras.shared,
      "",
      paras.calls,
      "",
      paras.policy,
      `Charter tool: ${site}/ai-charter`,
      "",
      paras.close,
      "",
      "Any questions, just reply to this email.",
      "",
      "Daniel",
    ].join("\n");

    return { subject, html: shell(subject, body), text };
  },
};

// To the whole cohort after session 3: the handout, this week's task and what
// to bring. Each person's own list for session 4 goes separately, from Daniel.
const afterSession3: Mailing = {
  key: "after-session-3",
  label: "After session 3 (handout)",
  build: ({ firstName, signInUrl, site }) => {
    const subject = "After session 3: your handout and what to bring next time";
    const paras = {
      thanks: "Thank you for driving today. Seeing what you tried, including the parts that only half worked, is the most useful thing for all of us.",
      handout: "I've put what we covered on one page: how the hour ran, the three show-and-tell questions and how a scorecard decides whether an AI draft is good enough to send.",
      task: "This week, finish your scorecard and score one of your own recent pieces of work against it.",
      bring: "Next session we teach it to write like you, so bring samples of your own work, redacted or dummy. I'll send you your own list separately.",
      help: "Stuck on setup? Reply to this email and we'll book a short one-to-one before the next session.",
    };
    const link = (path: string, label: string) =>
      `<a href="${escapeHtml(site + path)}" style="font-size:15px;font-weight:700;color:${AMBER};text-decoration:none;">${escapeHtml(label)} &rarr;</a>`;

    const body = `
<tr><td>
<p style="${P}">Hi ${escapeHtml(firstName)},</p>
<p style="${P}">${escapeHtml(paras.thanks)}</p>
<p style="${P}">${escapeHtml(paras.handout)}</p>
<p style="${P}">${link("/session-3", "Open the session 3 handout")}</p>
<p style="${P}">${escapeHtml(paras.task)}</p>
<p style="${P}">${escapeHtml(paras.bring)}</p>
<p style="${P}">The handout is also on your dashboard, under session 3:</p>
${button(signInUrl, "Open your dashboard")}
<p style="margin:0 0 16px;font-size:13px;color:${MUTED};">The button signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.</p>
<p style="${P}">${escapeHtml(paras.help)}</p>
<p style="${P}">Daniel</p>
</td></tr>`;

    const text = [
      `Hi ${firstName},`,
      "",
      paras.thanks,
      "",
      paras.handout,
      `Session 3 handout: ${site}/session-3`,
      "",
      paras.task,
      "",
      paras.bring,
      "",
      `The handout is also on your dashboard, under session 3: ${signInUrl}`,
      "(The link signs you in. It works once and lasts 14 days. After that, go to tutto.one/learn and we'll email you a new one.)",
      "",
      paras.help,
      "",
      "Daniel",
    ].join("\n");

    return { subject, html: shell(subject, body), text };
  },
};

export const MAILINGS: Mailing[] = [aiFiles, afterSession1, afterSession3];
export const getMailing = (key: string) => MAILINGS.find((m) => m.key === key);
