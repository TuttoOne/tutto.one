import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MarkupFile, MarkupItem, MarkupKind } from "./types";

/**
 * A markup layer for reviewing a page in the browser.
 *
 * Sticky notes, plain text boxes, arrows, boxes and a freehand pen, drawn over
 * the live page and stored in document coordinates so they stay put as it
 * scrolls. Notes survive a reload in localStorage; "Save" also writes them to
 * `.design/markup/<page>.json` through a development-only endpoint, so an agent
 * can read the instructions rather than being told about them second-hand.
 *
 * Every mark records what was under the pointer when it was made — a snippet of
 * the page's own copy and the heading of the section it fell in — because "move
 * this up" is not an instruction unless "this" is recoverable.
 *
 * Development only. It is gated on `import.meta.env.DEV` at the call site, so
 * none of this reaches a production bundle.
 */

type Tool = "select" | MarkupKind;

const TOOLS: { tool: Tool; key: string; label: string; hint: string }[] = [
  {
    tool: "select",
    key: "v",
    label: "Move",
    hint: "Select, drag and edit. Page links work.",
  },
  {
    tool: "note",
    key: "n",
    label: "Note",
    hint: "Click to drop a sticky note.",
  },
  {
    tool: "text",
    key: "t",
    label: "Text",
    hint: "Click to add a plain text box.",
  },
  {
    tool: "arrow",
    key: "a",
    label: "Arrow",
    hint: "Drag from a thing to where it should go.",
  },
  { tool: "box", key: "b", label: "Box", hint: "Drag to ring a region." },
  { tool: "pen", key: "p", label: "Pen", hint: "Draw freehand." },
];

const NOTE_W = 240;
const TEXT_W = 260;

const uid = () => Math.random().toString(36).slice(2, 9);

/** Document coordinates for a pointer event. */
function docPoint(e: { clientX: number; clientY: number }) {
  return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY };
}

/**
 * What the page says at this point. Walks the elements under the pointer,
 * skipping the overlay's own furniture, and takes the first that carries text.
 */
function describePoint(clientX: number, clientY: number) {
  const stack = document.elementsFromPoint(clientX, clientY) as HTMLElement[];
  const page = stack.find((el) => !el.closest("[data-markup]"));
  if (!page) return {};

  let el: HTMLElement | null = page;
  let anchor = "";
  while (el && !anchor) {
    const t = el.innerText?.trim().replace(/\s+/g, " ");
    if (t) anchor = t.length > 90 ? `${t.slice(0, 90)}…` : t;
    el = el.parentElement;
  }

  // The nearest section heading gives the note a place on the page.
  const section = page
    .closest("section")
    ?.querySelector("h1,h2,h3")
    ?.textContent?.trim()
    .replace(/\s+/g, " ");

  return { anchor: anchor || undefined, section: section || undefined };
}

function readable(items: MarkupItem[], docW: number): string[] {
  return items.map((it, i) => {
    const where = it.section ? ` [in: ${it.section}]` : "";
    const over = it.anchor ? ` (over: "${it.anchor}")` : "";
    const at = `x=${Math.round(it.x)} y=${Math.round(it.y)} of ${docW}px wide`;
    const said = it.text?.trim() ? ` — "${it.text.trim()}"` : " — (no text)";
    if (it.kind === "arrow") {
      return `${i + 1}. ARROW from ${at}${over} to x=${Math.round(it.x2 ?? 0)} y=${Math.round(
        it.y2 ?? 0,
      )}${where}${said}`;
    }
    if (it.kind === "box") {
      return `${i + 1}. BOX ${at}, ${Math.round(it.w ?? 0)}x${Math.round(
        it.h ?? 0,
      )}${over}${where}${said}`;
    }
    if (it.kind === "pen") {
      return `${i + 1}. PEN stroke of ${it.points?.length ?? 0} points from ${at}${where}${said}`;
    }
    return `${i + 1}. ${it.kind.toUpperCase()} at ${at}${over}${where}${said}`;
  });
}

export function MarkupLayer({ page }: { page: string }) {
  const storageKey = `tutto.markup.${page}`;

  const [on, setOn] = useState(false);
  const [tool, setTool] = useState<Tool>("select");
  const [items, setItems] = useState<MarkupItem[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [docH, setDocH] = useState(0);
  const [status, setStatus] = useState<string | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  /** Snapshots for undo. */
  const past = useRef<MarkupItem[][]>([]);
  /** The mark being drawn right now, before it is committed. */
  const [draft, setDraft] = useState<MarkupItem | null>(null);
  const dragRef = useRef<{ id: string; dx: number; dy: number } | null>(null);

  const commit = useCallback(
    (next: MarkupItem[] | ((prev: MarkupItem[]) => MarkupItem[])) => {
      setItems((prev) => {
        past.current.push(prev);
        if (past.current.length > 60) past.current.shift();
        return typeof next === "function" ? next(prev) : next;
      });
    },
    [],
  );

  /* Restore, preferring whatever was last written to the repo so notes survive
     a different browser, and falling back to this browser's own copy. */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const local = localStorage.getItem(storageKey);
      const fromLocal: MarkupItem[] = local ? JSON.parse(local) : [];
      try {
        const res = await fetch(`/api/markup/${page}`);
        const file = (await res.json()) as Partial<MarkupFile>;
        if (cancelled) return;
        const fromFile = file.items ?? [];
        setItems(fromFile.length >= fromLocal.length ? fromFile : fromLocal);
      } catch {
        if (!cancelled) setItems(fromLocal);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [page, storageKey]);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, storageKey]);

  /* The overlay has to be exactly as tall as the document, and the document
     changes height as notes are added and images load. */
  useEffect(() => {
    const measure = () => setDocH(document.documentElement.scrollHeight);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("load", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("load", measure);
    };
  }, [items]);

  const save = useCallback(async () => {
    const docW = document.documentElement.clientWidth;
    const body: MarkupFile = {
      page,
      docW,
      savedAt: new Date().toISOString(),
      items,
      readable: readable(items, docW),
    };
    try {
      const res = await fetch(`/api/markup/${page}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const out = await res.json();
      setStatus(
        res.ok
          ? `Saved ${items.length} to ${out.path}`
          : `Save failed: ${out.message}`,
      );
    } catch (err) {
      setStatus(`Save failed: ${(err as Error).message}`);
    }
    setTimeout(() => setStatus(null), 4000);
  }, [items, page]);

  const copyNotes = useCallback(async () => {
    const docW = document.documentElement.clientWidth;
    await navigator.clipboard.writeText(readable(items, docW).join("\n"));
    setStatus("Notes copied to clipboard");
    setTimeout(() => setStatus(null), 2500);
  }, [items]);

  /* Keyboard. Ignored while typing into a note. */
  useEffect(() => {
    const isTyping = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return (
        !!el &&
        (el.tagName === "TEXTAREA" ||
          el.tagName === "INPUT" ||
          el.isContentEditable)
      );
    };
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "m") {
        e.preventDefault();
        setOn((v) => !v);
        return;
      }
      if (!on || isTyping(e.target)) return;

      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        void save();
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "z") {
        e.preventDefault();
        const prev = past.current.pop();
        if (prev) setItems(prev);
        return;
      }
      if (e.key === "Escape") {
        setTool("select");
        setSelected(null);
        return;
      }
      if ((e.key === "Backspace" || e.key === "Delete") && selected) {
        e.preventDefault();
        commit((prev) => prev.filter((i) => i.id !== selected));
        setSelected(null);
        return;
      }
      const hit = TOOLS.find((t) => t.key === e.key.toLowerCase());
      if (hit) setTool(hit.tool);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [on, save, selected, commit]);

  /* Drawing on the capture surface. */
  const onSurfaceDown = (e: React.PointerEvent) => {
    if (tool === "select") return;
    e.preventDefault();
    const { x, y } = docPoint(e);
    const meta = describePoint(e.clientX, e.clientY);
    const base = { id: uid(), createdAt: new Date().toISOString(), ...meta };

    if (tool === "note" || tool === "text") {
      const item: MarkupItem = {
        ...base,
        kind: tool,
        x,
        y,
        w: tool === "note" ? NOTE_W : TEXT_W,
        text: "",
      };
      commit((prev) => [...prev, item]);
      setSelected(item.id);
      setTool("select");
      return;
    }

    if (tool === "arrow")
      setDraft({ ...base, kind: "arrow", x, y, x2: x, y2: y });
    if (tool === "box") setDraft({ ...base, kind: "box", x, y, w: 0, h: 0 });
    if (tool === "pen")
      setDraft({ ...base, kind: "pen", x, y, points: [[x, y]] });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onSurfaceMove = (e: React.PointerEvent) => {
    if (!draft) return;
    const { x, y } = docPoint(e);
    setDraft((d) => {
      if (!d) return d;
      if (d.kind === "arrow") return { ...d, x2: x, y2: y };
      if (d.kind === "box") return { ...d, w: x - d.x, h: y - d.y };
      if (d.kind === "pen")
        return { ...d, points: [...(d.points ?? []), [x, y]] };
      return d;
    });
  };

  const onSurfaceUp = () => {
    if (!draft) return;
    /* Normalise a box dragged up or left, and throw away an accidental click. */
    let item = draft;
    if (item.kind === "box") {
      const w = item.w ?? 0;
      const h = item.h ?? 0;
      item = {
        ...item,
        x: w < 0 ? item.x + w : item.x,
        y: h < 0 ? item.y + h : item.y,
        w: Math.abs(w),
        h: Math.abs(h),
      };
      if ((item.w ?? 0) < 8 || (item.h ?? 0) < 8) return setDraft(null);
    }
    if (item.kind === "arrow") {
      const d = Math.hypot((item.x2 ?? 0) - item.x, (item.y2 ?? 0) - item.y);
      if (d < 12) return setDraft(null);
    }
    if (item.kind === "pen" && (item.points?.length ?? 0) < 3)
      return setDraft(null);

    commit((prev) => [...prev, item]);
    setSelected(item.id);
    setDraft(null);
    setTool("select");
  };

  /* Dragging an existing mark. */
  const startDrag = (e: React.PointerEvent, it: MarkupItem) => {
    if (tool !== "select") return;
    e.stopPropagation();
    const { x, y } = docPoint(e);
    dragRef.current = { id: it.id, dx: x - it.x, dy: y - it.y };
    setSelected(it.id);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const { x, y } = docPoint(e);
    setItems((prev) =>
      prev.map((i) => {
        if (i.id !== d.id) return i;
        const nx = x - d.dx;
        const ny = y - d.dy;
        if (i.kind === "arrow") {
          return {
            ...i,
            x: nx,
            y: ny,
            x2: (i.x2 ?? 0) + (nx - i.x),
            y2: (i.y2 ?? 0) + (ny - i.y),
          };
        }
        if (i.kind === "pen") {
          const ox = nx - i.x;
          const oy = ny - i.y;
          return {
            ...i,
            x: nx,
            y: ny,
            points: i.points?.map(
              ([px, py]) => [px + ox, py + oy] as [number, number],
            ),
          };
        }
        return { ...i, x: nx, y: ny };
      }),
    );
  };

  const endDrag = () => {
    if (dragRef.current) past.current.push(items);
    dragRef.current = null;
  };

  const setText = (id: string, text: string) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, text } : i)));

  const remove = (id: string) => {
    commit((prev) => prev.filter((i) => i.id !== id));
    setSelected(null);
  };

  const drawing = tool !== "select";
  const strokes = useMemo(
    () => (draft ? [...items, draft] : items),
    [items, draft],
  );

  if (typeof document === "undefined") return null;

  return createPortal(
    <div data-markup>
      <Toolbar
        on={on}
        setOn={setOn}
        tool={tool}
        setTool={setTool}
        count={items.length}
        status={status}
        onSave={save}
        onCopy={copyNotes}
        onClear={() => {
          if (
            items.length &&
            confirm(`Delete all ${items.length} notes on this page?`)
          )
            commit([]);
        }}
        showHelp={showHelp}
        setShowHelp={setShowHelp}
      />

      {on && (
        <div
          className="absolute left-0 top-0 w-full"
          style={{ height: docH, zIndex: 45 }}
          onPointerMove={onDragMove}
          onPointerUp={endDrag}
        >
          {/* The capture surface. Transparent to the page unless a drawing tool
              is up, so links and scrolling behave normally while reviewing. */}
          <div
            className="absolute inset-0"
            style={{
              pointerEvents: drawing ? "auto" : "none",
              cursor: drawing ? "crosshair" : "default",
            }}
            onPointerDown={onSurfaceDown}
            onPointerMove={onSurfaceMove}
            onPointerUp={onSurfaceUp}
          />

          <svg
            className="absolute inset-0 w-full h-full overflow-visible"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <marker
                id="markup-head"
                viewBox="0 0 10 10"
                refX="9"
                refY="5"
                markerWidth="6"
                markerHeight="6"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#D92B2B" />
              </marker>
            </defs>
            {strokes.map((it) => {
              if (it.kind === "arrow") {
                return (
                  <line
                    key={it.id}
                    x1={it.x}
                    y1={it.y}
                    x2={it.x2}
                    y2={it.y2}
                    stroke="#D92B2B"
                    strokeWidth={selected === it.id ? 3.5 : 2.5}
                    markerEnd="url(#markup-head)"
                  />
                );
              }
              if (it.kind === "box") {
                return (
                  <rect
                    key={it.id}
                    x={(it.w ?? 0) < 0 ? it.x + (it.w ?? 0) : it.x}
                    y={(it.h ?? 0) < 0 ? it.y + (it.h ?? 0) : it.y}
                    width={Math.abs(it.w ?? 0)}
                    height={Math.abs(it.h ?? 0)}
                    fill="none"
                    stroke="#D92B2B"
                    strokeWidth={selected === it.id ? 3.5 : 2.5}
                    rx={3}
                  />
                );
              }
              if (it.kind === "pen") {
                return (
                  <polyline
                    key={it.id}
                    points={(it.points ?? [])
                      .map(([x, y]) => `${x},${y}`)
                      .join(" ")}
                    fill="none"
                    stroke="#D92B2B"
                    strokeWidth={selected === it.id ? 3.5 : 2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              }
              return null;
            })}
          </svg>

          {/* Hit targets and labels for the drawn marks. */}
          {items
            .filter(
              (it) =>
                it.kind === "arrow" || it.kind === "box" || it.kind === "pen",
            )
            .map((it) => {
              const at =
                it.kind === "arrow"
                  ? {
                      x: (it.x + (it.x2 ?? it.x)) / 2,
                      y: (it.y + (it.y2 ?? it.y)) / 2,
                    }
                  : { x: it.x, y: it.y - 4 };
              return (
                <div
                  key={it.id}
                  className="absolute"
                  style={{
                    left: at.x,
                    top: at.y,
                    pointerEvents: drawing ? "none" : "auto",
                  }}
                  onPointerDown={(e) => startDrag(e, it)}
                >
                  <Label
                    item={it}
                    selected={selected === it.id}
                    onSelect={() => setSelected(it.id)}
                    onChange={(v) => setText(it.id, v)}
                    onRemove={() => remove(it.id)}
                  />
                </div>
              );
            })}

          {/* Notes and text boxes. */}
          {items
            .filter((it) => it.kind === "note" || it.kind === "text")
            .map((it) => (
              <Panel
                key={it.id}
                item={it}
                selected={selected === it.id}
                interactive={!drawing}
                onDown={(e) => startDrag(e, it)}
                onSelect={() => setSelected(it.id)}
                onChange={(v) => setText(it.id, v)}
                onRemove={() => remove(it.id)}
              />
            ))}
        </div>
      )}
    </div>,
    document.body,
  );
}

/** A short instruction attached to an arrow, box or pen stroke. */
function Label({
  item,
  selected,
  onSelect,
  onChange,
  onRemove,
}: {
  item: MarkupItem;
  selected: boolean;
  onSelect: () => void;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  const empty = !item.text?.trim();
  if (empty && !selected) {
    return (
      <button
        onClick={onSelect}
        title="Add a note to this mark"
        className="w-4 h-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#D92B2B] text-white text-[9px] leading-none font-bold shadow"
      >
        +
      </button>
    );
  }
  return (
    <div className="-translate-y-1/2 flex items-start gap-1">
      <textarea
        value={item.text ?? ""}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onSelect}
        autoFocus={selected && empty}
        rows={1}
        placeholder="instruction…"
        className="w-44 resize-y rounded bg-[#FFF9C4] border border-[#D92B2B]/50 px-2 py-1 text-[12px] leading-snug text-neutral-900 shadow-sm outline-none focus:ring-1 focus:ring-[#D92B2B]"
      />
      {selected && <Kill onClick={onRemove} />}
    </div>
  );
}

/** A sticky note, or a plain text box. */
function Panel({
  item,
  selected,
  interactive,
  onDown,
  onSelect,
  onChange,
  onRemove,
}: {
  item: MarkupItem;
  selected: boolean;
  interactive: boolean;
  onDown: (e: React.PointerEvent) => void;
  onSelect: () => void;
  onChange: (v: string) => void;
  onRemove: () => void;
}) {
  const sticky = item.kind === "note";
  return (
    <div
      className="absolute"
      style={{
        left: item.x,
        top: item.y,
        width: item.w,
        pointerEvents: interactive ? "auto" : "none",
      }}
    >
      <div
        className={`flex items-start gap-1 ${
          sticky
            ? "bg-[#FFF9C4] border border-[#E0C400] shadow-md"
            : "bg-white/95 border border-[#D92B2B]/60 shadow-sm"
        } rounded ${selected ? "ring-2 ring-[#D92B2B]" : ""}`}
      >
        {/* Drag handle. The textarea keeps its own pointer events for typing. */}
        <span
          onPointerDown={onDown}
          title="Drag to move"
          className="shrink-0 self-stretch w-3 cursor-grab active:cursor-grabbing rounded-l bg-black/5"
        />
        <textarea
          value={item.text ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onSelect}
          autoFocus={selected && !item.text}
          placeholder={sticky ? "note…" : "text…"}
          rows={3}
          className="flex-1 resize-y bg-transparent px-1.5 py-1.5 text-[13px] leading-snug text-neutral-900 outline-none"
        />
        {selected && (
          <span className="p-1">
            <Kill onClick={onRemove} />
          </span>
        )}
      </div>
    </div>
  );
}

function Kill({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      title="Delete (or press Backspace)"
      className="shrink-0 w-4 h-4 rounded-full bg-neutral-800 text-white text-[10px] leading-none font-bold"
    >
      ×
    </button>
  );
}

function Toolbar({
  on,
  setOn,
  tool,
  setTool,
  count,
  status,
  onSave,
  onCopy,
  onClear,
  showHelp,
  setShowHelp,
}: {
  on: boolean;
  setOn: (f: (v: boolean) => boolean) => void;
  tool: Tool;
  setTool: (t: Tool) => void;
  count: number;
  status: string | null;
  onSave: () => void;
  onCopy: () => void;
  onClear: () => void;
  showHelp: boolean;
  setShowHelp: (v: boolean) => void;
}) {
  const active = TOOLS.find((t) => t.tool === tool);
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] flex flex-col items-center gap-2 font-sans">
      {status && (
        <div className="rounded bg-neutral-900 text-white text-xs px-3 py-1.5 shadow-lg">
          {status}
        </div>
      )}

      {on && showHelp && (
        <div className="max-w-md rounded-lg bg-neutral-900 text-neutral-200 text-xs leading-relaxed px-4 py-3 shadow-xl">
          <p className="mb-2 text-white font-semibold">Marking up this page</p>
          <ul className="space-y-1">
            {TOOLS.map((t) => (
              <li key={t.tool}>
                <kbd className="font-mono text-[10px] bg-white/15 rounded px-1">
                  {t.key}
                </kbd>{" "}
                <strong className="text-white">{t.label}</strong> — {t.hint}
              </li>
            ))}
            <li className="pt-1 border-t border-white/15 mt-1">
              Click the <strong className="text-white">+</strong> on an arrow or
              box to attach an instruction. Drag the grey edge of a note to move
              it. Backspace deletes what is selected.
            </li>
            <li>
              <kbd className="font-mono text-[10px] bg-white/15 rounded px-1">
                ⌘Z
              </kbd>{" "}
              undo ·{" "}
              <kbd className="font-mono text-[10px] bg-white/15 rounded px-1">
                ⌘S
              </kbd>{" "}
              save ·{" "}
              <kbd className="font-mono text-[10px] bg-white/15 rounded px-1">
                ⌘M
              </kbd>{" "}
              toggle markup
            </li>
          </ul>
        </div>
      )}

      <div className="flex items-center gap-1 rounded-full bg-neutral-900 px-2 py-2 shadow-xl">
        <button
          onClick={() => setOn((v) => !v)}
          className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
            on ? "bg-[#D92B2B] text-white" : "text-neutral-300 hover:text-white"
          }`}
          title="Toggle markup (⌘M)"
        >
          {on ? "Markup on" : "Markup"}
        </button>

        {on && (
          <>
            <span className="w-px h-5 bg-white/15 mx-1" />
            {TOOLS.map((t) => (
              <button
                key={t.tool}
                onClick={() => setTool(t.tool)}
                title={`${t.label} (${t.key}) — ${t.hint}`}
                className={`rounded-full px-2.5 py-1.5 text-xs transition-colors ${
                  tool === t.tool
                    ? "bg-white text-neutral-900 font-semibold"
                    : "text-neutral-300 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
            <span className="w-px h-5 bg-white/15 mx-1" />
            <span
              className="px-1 text-[11px] font-mono text-neutral-400 tabular-nums"
              title="Notes on this page"
            >
              {count}
            </span>
            <button
              onClick={onSave}
              title="Save for Claude (⌘S)"
              className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white hover:bg-white/20"
            >
              Save
            </button>
            <button
              onClick={onCopy}
              title="Copy the notes as text"
              className="rounded-full px-2 py-1.5 text-xs text-neutral-300 hover:text-white"
            >
              Copy
            </button>
            <button
              onClick={onClear}
              title="Delete every note on this page"
              className="rounded-full px-2 py-1.5 text-xs text-neutral-400 hover:text-[#ff8080]"
            >
              Clear
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              title="What the tools do"
              className="rounded-full w-6 h-6 text-xs text-neutral-300 hover:text-white border border-white/20"
            >
              ?
            </button>
          </>
        )}
      </div>

      {on && active && active.tool !== "select" && (
        <p className="text-[11px] text-neutral-500">{active.hint}</p>
      )}
    </div>
  );
}
