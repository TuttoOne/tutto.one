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

export type MailingInput = { firstName: string; signInUrl: string; site: string };
export type Mailing = {
  key: string;
  /** What the admin sees on the send button. */
  label: string;
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

export const MAILINGS: Mailing[] = [aiFiles];
export const getMailing = (key: string) => MAILINGS.find((m) => m.key === key);
