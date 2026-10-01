/**
 * Turns an enquiry's message into HTML for the notification email.
 *
 * The forms build their message as one "Label: value" line per answer. The
 * email used to rely on `white-space: pre-line` to keep those lines apart,
 * which mail clients strip, so every answer ran together into one paragraph.
 * Each answer is now its own block, label above value, in markup no client
 * can collapse.
 */

/** The message is typed by a visitor, so nothing in it reaches the email as markup. */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * A form answer: a short label with no sentence punctuation, a colon, then
 * the value. The length cap keeps an ordinary sentence with a colon in it
 * from being read as one.
 */
const FIELD = /^([A-Z][^:.!?]{1,60}):\s*(.*)$/;

const LABEL = "color: #a8a092; font-size: 10px; text-transform: uppercase; letter-spacing: 0.12em; margin: 0 0 4px;";
const VALUE = "color: #1a1a1a; font-size: 15px; line-height: 1.6; margin: 0 0 16px;";
const TITLE = "color: #1a1a1a; font-size: 16px; font-weight: 700; line-height: 1.4; margin: 0 0 18px;";
const TEXT = "color: #1a1a1a; font-size: 14px; line-height: 1.75; margin: 0 0 12px;";

export function enquiryMessageHtml(message: string): string {
  const lines = message.split(/\r?\n/).map((l) => l.trim());
  const answers = lines.slice(1).filter((l) => FIELD.test(l)).length;

  /* Free text from the contact page: keep the writer's own line breaks and
     leave the words alone. */
  if (answers < 2) {
    return `<p style="${TEXT} margin: 0 0 16px;">${lines.map(escapeHtml).join("<br>")}</p>`;
  }

  /* A form: the first line says which one, the rest are its answers. */
  const [title, ...rest] = lines;
  const blocks = rest
    .filter((l) => l !== "")
    .map((line) => {
      const field = line.match(FIELD);
      if (!field) return `<p style="${TEXT}">${escapeHtml(line)}</p>`;
      const [, label, value] = field;
      const given = value !== "" && value !== "-";
      // An answer with several choices arrives joined by " | ": one per line.
      const shown = given ? value.split(" | ").map(escapeHtml).join("<br>") : "Not given";
      return (
        `<p style="${LABEL}">${escapeHtml(label)}</p>` +
        `<p style="${VALUE}${given ? "" : " color: #a8a092;"}">${shown}</p>`
      );
    });
  return `<p style="${TITLE}">${escapeHtml(title)}</p>${blocks.join("")}`;
}
