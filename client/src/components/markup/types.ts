/**
 * Markup notes — the shape of one annotation.
 *
 * Coordinates are document pixels (page coordinates, not viewport), so a note
 * stays on the thing it was drawn over as the page scrolls. `docW` is recorded
 * alongside the items when they are saved, because the same y in a 1440-wide
 * layout and a 390-wide one are different places on the page.
 */
export type MarkupKind = "note" | "text" | "arrow" | "box" | "pen";

export interface MarkupItem {
  id: string;
  kind: MarkupKind;
  /** Origin, in document pixels. */
  x: number;
  y: number;
  /** note, text, box: size. Width is also the wrap measure for text. */
  w?: number;
  h?: number;
  /** arrow: the head end, in document pixels. */
  x2?: number;
  y2?: number;
  /** pen: the stroke, as document-pixel pairs. */
  points?: [number, number][];
  /** The instruction. Every kind can carry one. */
  text?: string;
  /**
   * What was under the pointer when this was drawn — a snippet of the page's
   * own copy, and the heading of the section it fell in. Captured at creation
   * because it is what makes the note legible to somebody who was not there:
   * "move this up" means nothing without knowing what "this" was.
   */
  anchor?: string;
  section?: string;
  createdAt: string;
}

export interface MarkupFile {
  page: string;
  /** Document width when the notes were taken. */
  docW: number;
  savedAt: string;
  items: MarkupItem[];
  /** A plain-text rendering of the same items, for reading rather than parsing. */
  readable: string[];
}
