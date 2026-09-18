/**
 * A flat index of a copy object's `{ en, fr }` leaves, by dotted path.
 *
 * The pages read copy through `useT(landing.hero.promise)` — an object
 * reference, which carries no name at runtime. The browser copy editor needs
 * the name: to write "hero.promise" back to the server it has to know that is
 * what the sentence on screen is called. Walking the object once at module
 * load gives every leaf a path, and paths are what the write endpoint resolves
 * against the file's AST.
 *
 * Array members take their index as a segment, so the second step of the
 * sequence is `sequence.steps.1.title`.
 */

export type CopyLeaf = { path: string; en: string; fr: string };

export type Locale = "en" | "fr";

function isLeaf(value: unknown): value is { en: string; fr: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).en === "string" &&
    typeof (value as Record<string, unknown>).fr === "string"
  );
}

export function indexCopy(node: unknown, prefix = ""): CopyLeaf[] {
  if (isLeaf(node)) return [{ path: prefix, en: node.en, fr: node.fr }];
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => indexCopy(item, prefix ? `${prefix}.${i}` : String(i)));
  }
  if (typeof node === "object" && node !== null) {
    return Object.entries(node).flatMap(([key, value]) =>
      indexCopy(value, prefix ? `${prefix}.${key}` : key),
    );
  }
  /* Plain strings — an href, a numeral — are not translated copy and are not
     editable here. Dropping them is deliberate: making a route contentEditable
     is a good way to break a link by leaning on the keyboard. */
  return [];
}

/** Words, counted the way a brief counts them: whitespace-separated tokens. */
export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}
