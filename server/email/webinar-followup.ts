/**
 * Follow-up email for the « Aborde ta rentrée IA avec Claude » webinar.
 *
 * French first, then English. The FAQ comes from the same module as the blog
 * post, so the email and the article always say the same thing. The webinar
 * was run jointly, so the email is co-branded Tutto × Altiplane and takes
 * Altiplane's palette (navy, orange, cream; from altiplane.fr). Written as
 * tables with inline CSS for mail clients.
 */
import { FAQ_EN, FAQ_FR, type FaqItem } from "@shared/webinar-rentree-ia";

export type WebinarEmailOptions = {
  /** Full URL of the blog post. */
  blogUrl: string;
  /** Replay URL. Leave empty until the cut is uploaded; the button is then hidden. */
  replayUrl?: string;
  /** Recipient's first name, if known. */
  firstName?: string;
  /** Where the logo image is served from. Defaults to the live site. */
  assetBaseUrl?: string;
};

// Altiplane palette
const CREAM = "#fffef0";
const NAVY = "#0b2f5c";
const INK = "#22314a";
const ORANGE = "#ff9e5e";
const LINK = "#c2560f"; // orange darkened enough to read as body-text links
const MUTED = "#5b6475";
const RULE = "#e8e3d6";
const FONT = "Manrope, -apple-system, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif";
const LOGO_PATH = "/blog/rentree-ia/tutto-x-altiplane.png";

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** **bold**, [text](url) and `code` from the blog's mini-markdown. */
function inlineHtml(text: string): string {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, `<strong style="color:${INK};">$1</strong>`)
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      `<a href="$2" style="color:${LINK};text-decoration:underline;">$1</a>`,
    )
    .replace(/`([^`]+)`/g, `<code style="font-family:Menlo,Consolas,monospace;font-size:13px;">$1</code>`);
}

function inlineText(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/`([^`]+)`/g, "$1");
}

const P = `margin:0 0 12px;font-size:14px;line-height:1.7;color:${MUTED};`;

/** A FAQ answer: paragraphs and "- " lists. */
function answerHtml(markdown: string): string {
  const out: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (list.length === 0) return;
    out.push(
      `<ul style="margin:0 0 12px;padding-left:20px;">${list
        .map((li) => `<li style="font-size:14px;line-height:1.7;color:${MUTED};margin:0 0 4px;">${inlineHtml(li)}</li>`)
        .join("")}</ul>`,
    );
    list = [];
  };
  for (const line of markdown.split("\n")) {
    if (line.startsWith("- ")) {
      list.push(line.slice(2));
    } else if (line.trim() !== "") {
      flush();
      out.push(`<p style="${P}">${inlineHtml(line)}</p>`);
    }
  }
  flush();
  return out.join("");
}

function faqHtml(items: FaqItem[]): string {
  return items
    .map(
      (item) => `
        <tr><td style="padding:20px 0 0;border-top:1px solid ${RULE};">
          <p style="margin:0 0 10px;font-size:15px;line-height:1.5;font-weight:700;color:${NAVY};">${escapeHtml(item.q)}</p>
          ${answerHtml(item.a)}
        </td></tr>`,
    )
    .join("");
}

function faqText(items: FaqItem[]): string {
  return items
    .map((item) => {
      const body = item.a
        .split("\n")
        .map((line) => (line.startsWith("- ") ? `  • ${inlineText(line.slice(2))}` : inlineText(line)))
        .join("\n");
      return `${item.q}\n${body}`;
    })
    .join("\n\n");
}

function button(label: string, href: string, primary: boolean): string {
  const bg = primary ? NAVY : ORANGE;
  const color = primary ? CREAM : NAVY;
  const border = primary ? NAVY : ORANGE;
  return `<a href="${escapeHtml(href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 20px;border-radius:8px;border:1px solid ${border};background:${bg};color:${color};font-size:14px;font-weight:600;text-decoration:none;">${escapeHtml(label)}</a>`;
}

function card(inner: string): string {
  return `<tr><td style="background:#ffffff;border:1px solid ${RULE};border-radius:10px;padding:28px;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${inner}</table>
  </td></tr>
  <tr><td style="height:20px;line-height:20px;">&nbsp;</td></tr>`;
}

function row(html: string): string {
  return `<tr><td>${html}</td></tr>`;
}

function label(text: string): string {
  return `<p style="margin:0 0 10px;font-size:10px;text-transform:uppercase;letter-spacing:0.12em;color:${LINK};">${escapeHtml(text)}</p>`;
}

function h2(text: string): string {
  return `<p style="margin:0 0 14px;font-size:18px;line-height:1.35;font-weight:800;color:${NAVY};">${escapeHtml(text)}</p>`;
}

type Copy = {
  label: string;
  headline: string;
  hello: (name?: string) => string;
  thanks: string[];
  readRecap: string;
  watchReplay: string;
  replayPending: string;
  essentialsTitle: string;
  essentials: string[];
  startTitle: string;
  start: string;
  faqTitle: string;
  faq: FaqItem[];
  nextTitle: string;
  next: string[];
  signoff: string;
};

const FR: Copy = {
  label: "Tutto × Altiplane · Webinaire",
  headline: "Merci d'avoir été là !",
  hello: (name) => (name ? `Bonjour ${name},` : "Bonjour,"),
  thanks: [
    "Merci d'avoir participé lundi soir à « Aborde ta rentrée IA avec Claude ». Vos questions ont rendu la session vivante, et elles nous ont donné de quoi préparer la suite.",
    "Comme promis, le compte rendu complet est en ligne : chaque étape de la démo en captures d'écran, tous les prompts, les instructions du projet et les deux skills, prêts à copier.",
  ],
  readRecap: "Lire le compte rendu",
  watchReplay: "Voir le replay",
  replayPending: "Le replay sera ajouté à l'article dès qu'il sera prêt.",
  essentialsTitle: "L'essentiel en quatre lignes",
  essentials: [
    "**Les connecteurs donnent les outils** : Claude lit vos mails, votre agenda et vos fichiers, et prépare des actions.",
    "**Le projet donne le contexte** : instructions et fichiers ajoutés une fois, plus besoin de tout réexpliquer.",
    "**Les skills donnent la méthode** : une procédure écrite une fois, que Claude suit à chaque demande.",
    "**Les routines donnent le rendez-vous** : une tâche qui fonctionne, programmée pour tourner sans vous.",
  ],
  startTitle: "Par où commencer",
  start:
    "Prenez de la hauteur avant d'automatiser : choisissez une seule tâche que vous connaissez bien et que vous refaites sans cesse. Donnez le contexte, testez sur un cas concret, vérifiez le résultat, puis améliorez. N'automatisez pas tout d'un coup.",
  faqTitle: "Vos questions, nos réponses complètes",
  faq: FAQ_FR,
  nextTitle: "D'autres sessions arrivent",
  next: [
    "Ce webinaire était le premier d'une série. Les prochains seront plus ciblés, pour aller plus loin sur les sujets qui vous ont le plus intéressés : les tokens et les coûts, la mémoire, la confidentialité, les skills partagés en entreprise. Nous vous préviendrons dès que les dates seront fixées.",
    "Une question d'ici là ? Répondez simplement à ce mail.",
  ],
  signoff: "À très bientôt,<br><strong>Franz Kubach</strong>, Altiplane<br><strong>Daniel Forsthofer</strong>, Tutto",
};

const EN: Copy = {
  label: "Tutto × Altiplane · Webinar",
  headline: "Thank you for joining us!",
  hello: (name) => (name ? `Hi ${name},` : "Hi,"),
  thanks: [
    "Thank you for joining « Aborde ta rentrée IA avec Claude » on Monday evening. Your questions made the session come alive, and they've given us plenty to build on.",
    "As promised, the full recap is online: every step of the demo with screenshots, all the prompts, the project instructions and both skills, ready to copy.",
  ],
  readRecap: "Read the recap",
  watchReplay: "Watch the replay",
  replayPending: "The replay will be added to the post as soon as it's ready.",
  essentialsTitle: "The essentials in four lines",
  essentials: [
    "**Connectors give the tools**: Claude reads your email, calendar and files, and prepares actions.",
    "**The project gives the context**: instructions and files added once, no more re-explaining.",
    "**Skills give the method**: a procedure written once that Claude follows every time.",
    "**Routines give the schedule**: a task that works, scheduled to run without you.",
  ],
  startTitle: "Where to start",
  start:
    "Get a clear view before you automate: pick one task you know well and keep repeating. Give the context, test it on a real case, check the result, then improve. Don't automate everything at once.",
  faqTitle: "Your questions, fully answered",
  faq: FAQ_EN,
  nextTitle: "More sessions are coming",
  next: [
    "This webinar was the first in a series. The next ones will be more focused, going deeper on the topics you were most interested in: tokens and costs, memory, privacy, and skills shared across a company. We'll let you know as soon as dates are set.",
    "Any questions in the meantime? Just reply to this email.",
  ],
  signoff: "Speak soon,<br><strong>Franz Kubach</strong>, Altiplane<br><strong>Daniel Forsthofer</strong>, Tutto",
};

function sectionHtml(copy: Copy, opts: WebinarEmailOptions): string {
  const buttons =
    button(copy.readRecap, opts.blogUrl, true) + (opts.replayUrl ? button(copy.watchReplay, opts.replayUrl, false) : "");
  const replayNote = opts.replayUrl ? "" : `<p style="${P}margin-top:4px;font-size:13px;">${escapeHtml(copy.replayPending)}</p>`;

  return [
    `<tr><td style="background:${NAVY};border-radius:10px;padding:28px;">
      <p style="margin:0 0 8px;font-size:11px;text-transform:uppercase;letter-spacing:0.12em;color:${ORANGE};">${escapeHtml(copy.label)}</p>
      <p style="margin:0;font-size:24px;line-height:1.25;font-weight:800;color:${CREAM};">${escapeHtml(copy.headline)}</p>
    </td></tr>
    <tr><td style="height:20px;line-height:20px;">&nbsp;</td></tr>`,
    card(
      row(
        `<p style="${P}color:${INK};">${escapeHtml(copy.hello(opts.firstName))}</p>` +
          copy.thanks.map((t) => `<p style="${P}">${escapeHtml(t)}</p>`).join("") +
          `<div style="margin-top:8px;">${buttons}</div>${replayNote}`,
      ),
    ),
    card(
      row(
        h2(copy.essentialsTitle) +
          answerHtml(copy.essentials.map((e) => `- ${e}`).join("\n")) +
          `<p style="margin:16px 0 8px;font-size:15px;font-weight:700;color:${NAVY};">${escapeHtml(copy.startTitle)}</p>` +
          `<p style="${P}margin-bottom:0;">${escapeHtml(copy.start)}</p>`,
      ),
    ),
    card(row(label("FAQ") + h2(copy.faqTitle)) + faqHtml(copy.faq)),
    card(
      row(
        h2(copy.nextTitle) +
          copy.next.map((t) => `<p style="${P}">${escapeHtml(t)}</p>`).join("") +
          `<p style="margin:16px 0 0;font-size:14px;line-height:1.7;color:${INK};">${copy.signoff}</p>`,
      ),
    ),
  ].join("");
}

function sectionText(copy: Copy, opts: WebinarEmailOptions): string {
  return [
    copy.headline.toUpperCase(),
    "",
    copy.hello(opts.firstName),
    "",
    ...copy.thanks.flatMap((t) => [t, ""]),
    `${copy.readRecap} : ${opts.blogUrl}`,
    opts.replayUrl ? `${copy.watchReplay} : ${opts.replayUrl}` : copy.replayPending,
    "",
    copy.essentialsTitle.toUpperCase(),
    ...copy.essentials.map((e) => `• ${inlineText(e)}`),
    "",
    copy.startTitle.toUpperCase(),
    copy.start,
    "",
    copy.faqTitle.toUpperCase(),
    "",
    faqText(copy.faq),
    "",
    copy.nextTitle.toUpperCase(),
    ...copy.next,
    "",
    copy.signoff.replace(/<br>/g, "\n").replace(/<\/?strong>/g, ""),
  ].join("\n");
}

export function buildWebinarEmail(opts: WebinarEmailOptions): { subject: string; html: string; text: string } {
  const subject = "Merci ! Le récap du webinaire « Aborde ta rentrée IA avec Claude »";

  const logo = `${opts.assetBaseUrl ?? "https://tutto.one"}${LOGO_PATH}`;
  const header = `<tr><td style="padding:4px 0 24px;">
      <img src="${escapeHtml(logo)}" width="222" height="40" alt="Tutto × Altiplane" style="display:block;border:0;height:40px;width:222px;font-size:16px;font-weight:700;color:${NAVY};">
    </td></tr>`;

  const divider = `<tr><td style="padding:12px 0 32px;text-align:center;">
      <p style="margin:0;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:${MUTED};">English version below</p>
    </td></tr>`;

  const html = `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${escapeHtml(subject)}</title></head>
<body style="margin:0;padding:0;background:${CREAM};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:${CREAM};">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;font-family:${FONT};">
        ${header}
        ${sectionHtml(FR, opts)}
        ${divider}
        ${sectionHtml(EN, opts)}
        <tr><td style="padding:8px 0 0;text-align:center;">
          <p style="margin:0 0 6px;font-size:11px;line-height:1.6;color:${MUTED};">Vous recevez ce mail car vous étiez inscrit·e au webinaire du 21 septembre 2026. · You're receiving this because you registered for the webinar on 21 September 2026.</p>
          <p style="margin:0;font-size:11px;color:${MUTED};">Tutto × Altiplane · <a href="https://altiplane.fr" style="color:${MUTED};">altiplane.fr</a> · <a href="https://tutto.one" style="color:${MUTED};">tutto.one</a></p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const text = [
    sectionText(FR, opts),
    "",
    "———————— English version ————————",
    "",
    sectionText(EN, opts),
    "",
    "Tutto × Altiplane · https://altiplane.fr · https://tutto.one",
  ].join("\n");

  return { subject, html, text };
}
