import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { countWords, indexCopy, type CopyLeaf } from "@/lib/copy-index";
import { useLocale } from "@/lib/i18n";

/**
 * Edit a page's copy in the browser, in the layout, and write it back to the
 * source file.
 *
 * WHY IT WORKS ON THE DOM RATHER THAN ON THE COMPONENTS.
 *
 * The obvious build is an editable <T> component the page renders in place of
 * every string. It was not built, because half the strings on a page are not
 * rendered as children at all: `HeadlinePrice` takes `price: string`,
 * `Section` takes `label: string`, `ClosingCta` takes `title: string`. Making
 * those editable means widening a dozen prop types to ReactNode across pages
 * that have nothing to do with editing, in production code, to serve a
 * development tool. So this reaches the text where it has already landed:
 * it walks the rendered page, matches each text node against the copy table,
 * and makes the ones it recognises contentEditable. Not one line of the page
 * or of any shared component knows this exists.
 *
 * The cost of that choice is that the wrapping is DOM surgery underneath
 * React, which React will trample the moment it re-renders the subtree. That
 * is survivable because edit mode is a still page — nothing re-renders while
 * somebody is typing into it — and because leaving edit mode reloads.
 *
 * Strings that appear twice on a page (the booking button is `hero.cta` and
 * `close.cta`, worded identically) bind to every path they match, and editing
 * one changes both. That is what you want from a button label appearing twice,
 * and the toolbar says so when it happens.
 *
 * Development only. Its endpoint writes to `client/src/lib` with no auth and
 * is not mounted in production.
 */

/** The brief for the landing page. Shown live because the word cap is the
 *  constraint the page was written to, and a budget you cannot see while
 *  writing is a budget you have already broken. Raised from 350 once the
 *  client band and the longer hero had earned the room. */
const BUDGET = 400;

type Props = {
  /** The copy object to index, e.g. `landing`. */
  copy: unknown;
  /** The key the write endpoint knows this file by, e.g. "landing". */
  name: string;
  /** Only text inside this element is made editable. Defaults to <main>, then body. */
  rootSelector?: string;
};

type Bound = { el: HTMLElement; paths: string[]; original: string };

export function CopyEditor({ copy, name, rootSelector = "main" }: Props) {
  const locale = useLocale();
  const leaves = useMemo(() => indexCopy(copy), [copy]);

  const [open, setOpen] = useState(false);
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const bound = useRef<Bound[]>([]);

  /* True only once the wrap effect has run for this session of edit mode.
     The persist effect must not touch storage before then: on the render
     where `open` flips to true, `edits` is still empty, and an unguarded
     persist would delete the draft a moment before the restore reads it. */
  const [ready, setReady] = useState(false);

  /** How many unsaved changes are sitting in storage while the editor is shut,
   *  so the closed pill can say there is work to come back to. */
  const [pending, setPending] = useState(0);

  /* Unsaved work is kept in localStorage, per file and per language, because
     the first version of this lost a session's rewriting to a mis-click: the
     Done button dropped every pending change without asking. Typing into a
     page should be at least as safe as typing into a text box, so the draft
     now survives Done, a reload, a closed tab and a dead server, and is only
     cleared when the file has actually been written. */
  const draftKey = `tutto.copydraft.${name}.${locale}`;

  const forget = useCallback(() => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      /* Private mode, or storage disabled. Nothing to clean up. */
    }
  }, [draftKey]);

  /** Live count for the language being edited, with unsaved changes applied. */
  const words = useMemo(() => {
    return leaves.reduce((total, leaf) => {
      const value = edits[leaf.path] ?? leaf[locale];
      return total + countWords(value);
    }, 0);
  }, [leaves, edits, locale]);

  const changed = Object.keys(edits).length;

  useEffect(() => {
    /* Only while the editor is open. On a cold page load `edits` is empty and
       an unguarded effect would delete the draft it exists to protect —
       which is the whole failure this mechanism was added to prevent. */
    if (!open || !ready) return;
    try {
      if (Object.keys(edits).length) localStorage.setItem(draftKey, JSON.stringify(edits));
      else localStorage.removeItem(draftKey);
    } catch {
      /* Storage is a convenience here, never the source of truth. */
    }
  }, [open, ready, edits, draftKey]);

  /* What is waiting in storage, read on load and whenever the editor closes. */
  useEffect(() => {
    if (open) return;
    try {
      const saved = localStorage.getItem(draftKey);
      setPending(saved ? Object.keys(JSON.parse(saved)).length : 0);
    } catch {
      setPending(0);
    }
  }, [open, draftKey]);

  /* The browser's own guard, for the tab closed with work in it. */
  useEffect(() => {
    if (!Object.keys(edits).length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [edits]);

  /* Enter edit mode: find every text node that is a copy leaf and wrap it in a
     contentEditable span. Exit: unwrap, putting the original text nodes back,
     so cancelling leaves the DOM exactly as React built it. */
  useEffect(() => {
    if (!open) return;

    const root =
      (document.querySelector(rootSelector) as HTMLElement | null) ?? document.body;

    /* Exact, whole-node matches only. A leaf that happens to be a substring of
       a longer sentence is not the same sentence, and half-matching would make
       the editor silently write the wrong string to the file. */
    const byText = new Map<string, string[]>();
    for (const leaf of leaves) {
      const text = leaf[locale as "en" | "fr"];
      byText.set(text, [...(byText.get(text) ?? []), leaf.path]);
    }

    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        // Our own toolbar, and anything already wrapped.
        if (parent.closest("[data-copy-editor]")) return NodeFilter.FILTER_REJECT;
        return byText.has((node.textContent ?? "").trim())
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      },
    });

    const targets: Text[] = [];
    for (let n = walker.nextNode(); n; n = walker.nextNode()) targets.push(n as Text);

    const list: Bound[] = [];
    for (const node of targets) {
      const text = (node.textContent ?? "").trim();
      const paths = byText.get(text);
      if (!paths) continue;

      const span = document.createElement("span");
      span.setAttribute("data-copy-field", paths.join(","));
      span.setAttribute("contenteditable", "plaintext-only");
      span.setAttribute("spellcheck", "true");
      span.title =
        paths.length > 1
          ? `${paths.join(", ")}: the same words in ${paths.length} places; editing changes all of them`
          : paths[0];
      span.textContent = text;
      node.parentNode?.replaceChild(span, node);
      list.push({ el: span, paths, original: text });
    }
    bound.current = list;

    /* Put a restored draft back on the page, so re-entering edit mode shows
       the words as they were left rather than as the file still has them. */
    let restored = 0;
    try {
      const saved = localStorage.getItem(draftKey);
      const draft: Record<string, string> = saved ? JSON.parse(saved) : {};
      const live: Record<string, string> = {};
      for (const b of list) {
        const value = b.paths.map((path) => draft[path]).find(Boolean);
        if (!value || value === b.original) continue;
        b.el.textContent = value;
        for (const path of b.paths) live[path] = value;
        restored += 1;
      }
      if (restored) setEdits(live);
    } catch {
      /* A malformed draft is not worth failing edit mode over. */
    }
    if (restored) {
      setStatus(`Restored ${restored} unsaved change${restored === 1 ? "" : "s"} from last time.`);
    }

    const onInput = (e: Event) => {
      const el = (e.target as HTMLElement)?.closest?.("[data-copy-field]") as HTMLElement | null;
      if (!el) return;
      const entry = list.find((b) => b.el === el);
      if (!entry) return;
      const value = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      setEdits((prev) => {
        const next = { ...prev };
        for (const path of entry.paths) {
          if (value === entry.original) delete next[path];
          else next[path] = value;
        }
        return next;
      });
    };

    root.addEventListener("input", onInput);
    document.body.classList.add("copy-editing");
    setReady(true);

    return () => {
      setReady(false);
      root.removeEventListener("input", onInput);
      document.body.classList.remove("copy-editing");
      for (const b of list) {
        b.el.replaceWith(document.createTextNode(b.el.textContent ?? b.original));
      }
      bound.current = [];
    };
  }, [open, leaves, locale, rootSelector]);

  const save = useCallback(async () => {
    if (!changed) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch(`/api/copy/${name}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          edits: Object.entries(edits).map(([path, value]) => ({ path, locale, value })),
        }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.message ?? "Save failed");
      setStatus(
        body.missed?.length
          ? `Wrote ${body.written}. Could not place: ${body.missed.join(", ")}`
          : `Wrote ${body.written} to ${body.file}`,
      );
      /* Vite reloads the module the moment the file changes, which would strip
         the wrappers out from under us mid-edit. Leaving the mode first, then
         reloading, means the page comes back as plain rendered copy with the
         new words already in it. */
      setEdits({});
      forget();
      setTimeout(() => window.location.reload(), 900);
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Save failed");
      setSaving(false);
    }
  }, [changed, edits, locale, name, forget]);

  return (
    <>
      <style>{`
        .copy-editing [data-copy-field] {
          outline: 1px dashed color-mix(in srgb, currentColor 35%, transparent);
          outline-offset: 3px;
          border-radius: 2px;
          cursor: text;
        }
        .copy-editing [data-copy-field]:hover {
          background: color-mix(in srgb, currentColor 6%, transparent);
        }
        .copy-editing [data-copy-field]:focus {
          outline: 2px solid rgb(217 119 6);
          outline-offset: 3px;
          background: color-mix(in srgb, rgb(217 119 6) 8%, transparent);
        }
      `}</style>

      <div
        data-copy-editor
        className="fixed bottom-4 left-4 z-[80] flex flex-col items-start gap-2 font-sans"
      >
        {status && (
          <div className="max-w-xs rounded-lg bg-neutral-900 px-3 py-2 text-xs leading-relaxed text-white shadow-lg">
            {status}
          </div>
        )}

        {open ? (
          <div className="flex items-center gap-2 rounded-full bg-neutral-900 px-2 py-2 text-white shadow-lg">
            <span className="px-2 text-xs tabular-nums">
              <strong className={words > BUDGET ? "text-red-400" : "text-emerald-400"}>
                {words}
              </strong>
              <span className="text-white/50"> / {BUDGET} words · {locale.toUpperCase()}</span>
            </span>
            <span className="text-xs text-white/50">
              {changed ? `${changed} changed` : "no changes"}
            </span>
            <button
              onClick={save}
              disabled={!changed || saving}
              className="rounded-full bg-amber-500 px-3 py-1.5 text-xs font-medium text-neutral-900 disabled:opacity-40"
            >
              {saving ? "Saving…" : "Save to file"}
            </button>
            {/* Leaves edit mode without touching the draft: the words stay
                where they were typed, and come back on the next Edit copy. */}
            <button
              onClick={() => {
                setOpen(false);
                setStatus(
                  changed
                    ? `${changed} change${changed === 1 ? "" : "s"} kept but NOT written to the file. Press Edit copy to get them back.`
                    : null,
                );
              }}
              className="rounded-full px-3 py-1.5 text-xs text-white/70 hover:text-white"
            >
              Close
            </button>
            {changed > 0 && (
              <button
                onClick={() => {
                  if (!confirm(`Throw away ${changed} unsaved change${changed === 1 ? "" : "s"}?`)) return;
                  for (const b of bound.current) b.el.textContent = b.original;
                  setEdits({});
                  forget();
                  setStatus(null);
                }}
                className="rounded-full px-3 py-1.5 text-xs text-white/40 hover:text-red-300"
              >
                Discard
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-lg hover:bg-neutral-800"
          >
            Edit copy
            {pending > 0 && (
              <span className="ml-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] text-neutral-900">
                {pending} unsaved
              </span>
            )}
          </button>
        )}
      </div>
    </>
  );
}
