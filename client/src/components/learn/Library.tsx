/**
 * The Library view on /learn/library: every handout, guide, tool and course in
 * the student's programme, searchable in one place. The text comes from
 * /api/learn/library (server/learn-index.json); reading it here saves opening
 * each page, and the full page is one click away for the diagrams.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { LibraryItem, LibraryKind, LibraryTopic } from "@shared/learn-library";

type SessionInfo = { number: number; title: string; when: string | null };
type View = "topic" | "session" | "az";
type Kind = "All" | LibraryKind;

const KINDS: LibraryKind[] = ["Handout", "Guide", "Tool", "Course"];
const SUGGESTIONS = ["scorecard", "CLAUDE.md", "privacy", "Mistral", "workspace", "redacted"];

const ICON: Record<LibraryKind, string> = {
  Handout: "M6 3.5h8l4 4v13H6z M14 3.5v4h4 M9 12h6 M9 15.5h6",
  Guide: "M4 5.5c3-1 5.5-1 8 1 2.5-2 5-2 8-1v13c-3-1-5.5-1-8 1-2.5-2-5-2-8-1z M12 6.5v13",
  Tool: "M14.5 6.5a4 4 0 0 0 5 5L13 18a2 2 0 0 1-3-3z M14.5 6.5 17 4l3 3-2.5 2.5",
  Course: "M3 9l9-4.5L21 9l-9 4.5z M7 11v5c3 2 7 2 10 0v-5",
};

function KindIcon({ kind, small }: { kind: LibraryKind; small?: boolean }) {
  return (
    <span className={`lib-ico k-${kind}${small ? " sm" : ""}`} aria-hidden="true">
      <svg viewBox="0 0 24 24"><path d={ICON[kind]} /></svg>
    </span>
  );
}

function terms(q: string) {
  return q.toLowerCase().split(/\s+/).filter((w) => w.length > 1);
}

function Hl({ text, ts }: { text: string; ts: string[] }) {
  if (!ts.length) return <>{text}</>;
  const re = new RegExp(`(${ts.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  return <>{text.split(re).map((part, i) => (i % 2 ? <mark key={i}>{part}</mark> : part))}</>;
}

function snippet(text: string, ts: string[]) {
  const low = text.toLowerCase();
  const at = ts.map((t) => low.indexOf(t)).filter((i) => i >= 0).sort((a, b) => a - b)[0];
  if (at === undefined) return text.length > 160 ? `${text.slice(0, 160)}…` : text;
  const start = Math.max(0, at - 70);
  const end = Math.min(text.length, at + 130);
  return `${start ? "…" : ""}${text.slice(start, end).trim()}${end < text.length ? "…" : ""}`;
}

function sharedLine(item: LibraryItem) {
  return item.upcoming ? "Read ahead" : `Session ${item.session}`;
}

export function Library({ sessions }: { sessions: SessionInfo[] }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/learn/library"],
    queryFn: async () => {
      const res = await fetch("/api/learn/library", { credentials: "same-origin" });
      if (!res.ok) throw new Error("We couldn't load the library. Refresh the page to try again.");
      return (await res.json()) as { topics: LibraryTopic[]; items: LibraryItem[] };
    },
  });
  const [q, setQ] = useState("");
  const [view, setView] = useState<View>("topic");
  const [kind, setKind] = useState<Kind>("All");
  const [open, setOpen] = useState<{ item: LibraryItem; section?: string } | null>(null);
  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== input.current && !open) { e.preventDefault(); input.current?.focus(); }
      if (e.key === "Escape" && open) setOpen(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const items = data?.items ?? [];
  const visible = useMemo(() => items.filter((i) => kind === "All" || i.kind === kind), [items, kind]);
  const ts = terms(q);
  const searching = q.trim().length > 1;

  const results = useMemo(() => {
    if (!searching) return [];
    return visible
      .map((item) => {
        const head = ts.every((t) => `${item.label} ${item.summary}`.toLowerCase().includes(t));
        const hits = item.sections.filter((s) => ts.every((t) => `${s.h} ${s.t}`.toLowerCase().includes(t)));
        return { item, hits, score: (head ? 10 : 0) + hits.length, head };
      })
      .filter((r) => r.head || r.hits.length)
      .sort((a, b) => b.score - a.score);
  }, [visible, searching, q]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <p className="lib-muted">Loading your library...</p>;
  if (error || !data) return <p>{(error as Error)?.message ?? "Something went wrong."}</p>;

  const topicName = (id: string) => data.topics.find((t) => t.id === id)?.name ?? "";
  const card = (item: LibraryItem) => (
    <li key={item.href}>
      <button type="button" className={`lib-doc k-${item.kind}${item.upcoming ? " upcoming" : ""}`} onClick={() => setOpen({ item })}>
        <KindIcon kind={item.kind} />
        <span className="lib-doc-title">{item.label}</span>
        {item.summary && <span className="lib-doc-sum">{item.summary}</span>}
        <span className="lib-tags"><b>{item.kind}</b><span>{sharedLine(item)}</span></span>
      </button>
    </li>
  );

  let body: React.ReactNode;
  if (searching) {
    const places = results.reduce((n, r) => n + Math.max(1, r.hits.length), 0);
    body = results.length === 0 ? (
      <div className="lib-empty">Nothing matches <b>{q}</b>. Try a shorter word, or ask Daniel and we'll add it.</div>
    ) : (
      <>
        <p className="lib-muted lib-count">{places} {places === 1 ? "place" : "places"} in {results.length} {results.length === 1 ? "document" : "documents"}</p>
        {results.map(({ item, hits }) => (
          <article key={item.href} className="lib-result">
            <div className="lib-rh">
              <KindIcon kind={item.kind} small />
              <div>
                <h3><Hl text={item.label} ts={ts} /></h3>
                <span className="lib-muted lib-small">{item.kind} · {sharedLine(item)} · {topicName(item.topic)}</span>
              </div>
            </div>
            <ul className="lib-hits">
              {(hits.length ? hits.slice(0, 4) : [null]).map((s, i) => (
                <li key={i}>
                  <button type="button" className="lib-hit" onClick={() => setOpen({ item, section: s?.h })}>
                    {s && <b><Hl text={s.h} ts={ts} /></b>}
                    <span><Hl text={s ? snippet(s.t, ts) : item.summary} ts={ts} /></span>
                  </button>
                </li>
              ))}
              {hits.length > 4 && <li className="lib-muted lib-small">and {hits.length - 4} more in this document</li>}
            </ul>
          </article>
        ))}
      </>
    );
  } else if (view === "topic") {
    body = data.topics.map((t) => {
      const list = visible.filter((i) => i.topic === t.id);
      if (!list.length) return null;
      return (
        <section key={t.id} className="lib-group">
          <div className="lib-ghead"><h2>{t.name}</h2><span>{t.blurb}</span></div>
          <ul className="lib-docs">{list.map(card)}</ul>
        </section>
      );
    });
  } else if (view === "session") {
    body = sessions.map((s) => {
      const list = visible.filter((i) => i.session === s.number);
      if (!list.length) return null;
      return (
        <section key={s.number} className="lib-group">
          <div className="lib-ghead">
            {s.when && <span className="lib-date">{s.when}</span>}
            <h2>Session {s.number}: {s.title}</h2>
          </div>
          <ul className="lib-docs">{list.map(card)}</ul>
        </section>
      );
    });
  } else {
    body = (
      <section className="lib-group">
        <ul className="lib-docs">{[...visible].sort((a, b) => a.label.localeCompare(b.label)).map(card)}</ul>
      </section>
    );
  }

  return (
    <div className="lib">
      <style>{CSS}</style>
      <div className="lib-search">
        <div className="lib-field">
          <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5" /><path d="M15.5 15.5 21 21" /></svg>
          <input
            ref={input}
            id="library-search"
            type="search"
            autoComplete="off"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search everything you've been given"
            aria-label="Search everything you've been given"
          />
          {q ? <button type="button" className="lib-clear" onClick={() => { setQ(""); input.current?.focus(); }}>Clear</button> : <span className="lib-kbd">/</span>}
        </div>
        <div className="lib-try">
          <span>Try:</span>
          {SUGGESTIONS.map((s) => <button key={s} type="button" onClick={() => setQ(s)}>{s}</button>)}
        </div>
        <div className="lib-controls">
          <div className="lib-tabs" role="tablist" aria-label="Browse by">
            {([["topic", "By topic"], ["session", "By session"], ["az", "A to Z"]] as [View, string][]).map(([v, label]) => (
              <button key={v} type="button" role="tab" aria-selected={!searching && view === v} onClick={() => { setView(v); setQ(""); }}>{label}</button>
            ))}
          </div>
          <div className="lib-kinds" role="group" aria-label="Show only">
            {(["All", ...KINDS] as Kind[]).map((k) => {
              const n = k === "All" ? items.length : items.filter((i) => i.kind === k).length;
              if (!n) return null;
              return (
                <button key={k} type="button" aria-pressed={kind === k} onClick={() => setKind(k)}>
                  {k === "All" ? "Everything" : `${k}s`} <span>{n}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lib-body" aria-live="polite">{body}</div>

      {open && <Reader item={open.item} section={open.section} ts={searching ? ts : []} topic={topicName(open.item.topic)} onClose={() => setOpen(null)} />}
    </div>
  );
}

function Reader({ item, section, ts, topic, onClose }: { item: LibraryItem; section?: string; ts: string[]; topic: string; onClose: () => void }) {
  const body = useRef<HTMLDivElement>(null);
  const close = useRef<HTMLButtonElement>(null);
  const [flash, setFlash] = useState<number | null>(null);

  const jump = (i: number) => {
    document.getElementById(`lib-sec-${i}`)?.scrollIntoView({ block: "start" });
    setFlash(i);
  };

  useEffect(() => {
    const before = document.activeElement as HTMLElement | null;
    close.current?.focus();
    body.current?.scrollTo(0, 0);
    if (section) {
      const i = item.sections.findIndex((s) => s.h === section);
      if (i >= 0) jump(i);
    }
    return () => before?.focus();
  }, [item, section]);

  const local = !item.href.startsWith("http");
  return (
    <>
      <div className="lib-shade" onClick={onClose} />
      <aside className="lib-reader" role="dialog" aria-modal="true" aria-labelledby="lib-reader-title">
        <div className="lib-rtop">
          <span>{item.kind} · {sharedLine(item)} · {topic}</span>
          <button ref={close} type="button" onClick={onClose}>Close</button>
        </div>
        <div className="lib-rbody" ref={body}>
          <h2 id="lib-reader-title">{item.label}</h2>
          {item.summary && <p className="lib-rsum">{item.summary}</p>}
          <div className="lib-ractions">
            <a className="lib-open" href={item.href} target="_blank" rel="noopener noreferrer">Open the full page</a>
            {item.claude && <a href={item.claude} download>Download for your AI (.md)</a>}
          </div>
          {item.upcoming && <p className="lib-muted lib-small">We cover this in a later session. It's here so you can read ahead.</p>}
          {item.sections.length > 1 && (
            <ul className="lib-rtoc">
              {item.sections.map((s, i) => (
                <li key={i}><a href={`#lib-sec-${i}`} onClick={(e) => { e.preventDefault(); jump(i); }}>{s.h}</a></li>
              ))}
            </ul>
          )}
          {item.sections.map((s, i) => (
            <section key={i} id={`lib-sec-${i}`} className={`lib-rsec${flash === i ? " flash" : ""}`} onAnimationEnd={() => setFlash(null)}>
              <h3><Hl text={s.h} ts={ts} /></h3>
              <p><Hl text={s.t} ts={ts} /></p>
              {s.id && local && <a className="lib-small" href={`${item.href}#${s.id}`} target="_blank" rel="noopener noreferrer">Open this part with its diagrams</a>}
            </section>
          ))}
          <p className="lib-muted lib-small lib-rnote">
            {item.sections.length
              ? "This is the text of the page, so you can search and read it here. Diagrams, screenshots and copy buttons are on the full page."
              : "This one is a tool, so open it to use it."}
          </p>
        </div>
      </aside>
    </>
  );
}

// Same palette as the rest of /learn (learn.tsx): warm paper, near-black ink, amber.
const CSS = `
.lib { --bg:#f6f1ea; --paper:#fff; --ink:#1a1a1a; --ink-2:#4a4540; --muted:#6b645a; --rule:#d8d0c5; --panel:#efe8de;
  --amber:#d97706; --amber-soft:#fcefdf; --amber-ink:#8a4700; --slate:#5b6b7c; --slate-soft:#e8edf2; --pass:#2f7d4f; --pass-soft:#e3f1e8; --mark:#ffe2b8; }
.lib button { font: inherit; color: inherit; }
.lib :focus-visible { outline: 2px solid var(--amber); outline-offset: 2px; border-radius: 4px; }
.lib mark { background: var(--mark); color: inherit; border-radius: 2px; padding: 0 1px; }
.lib-muted { color: var(--muted); }
.lib-small { font-size: 13px; }
.lib-search { position: sticky; top: 64px; z-index: 5; background: var(--bg); padding: 12px 0; border-bottom: 1px solid var(--rule); }
.lib-field { position: relative; }
.lib-field svg { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 20px; height: 20px; stroke: var(--muted); fill: none; stroke-width: 2; stroke-linecap: round; }
.lib-field input { width: 100%; box-sizing: border-box; font: 400 17px/1.3 'Inter', -apple-system, sans-serif; padding: 14px 80px 14px 48px; border: 1.5px solid var(--rule); border-radius: 10px; background: var(--paper); color: var(--ink); }
.lib-field input:focus { border-color: var(--amber); outline: none; box-shadow: 0 0 0 3px var(--amber-soft); }
.lib-kbd { position: absolute; right: 14px; top: 50%; transform: translateY(-50%); font: 500 12px ui-monospace, Menlo, monospace; color: var(--muted); border: 1px solid var(--rule); border-radius: 5px; padding: 2px 6px; background: var(--panel); }
.lib-clear { position: absolute; right: 10px; top: 50%; transform: translateY(-50%); border: 0; background: var(--panel); border-radius: 6px; padding: 5px 9px; font-size: 13px !important; cursor: pointer; }
.lib-try { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; margin-top: 10px; font-size: 13px; color: var(--muted); }
.lib-try button { border: 1px solid var(--rule); background: var(--paper); border-radius: 999px; padding: 3px 10px; cursor: pointer; font-size: 13px; color: var(--ink-2); }
.lib-try button:hover { border-color: var(--amber); }
.lib-controls { display: flex; justify-content: space-between; align-items: center; gap: 10px 16px; flex-wrap: wrap; margin-top: 12px; }
.lib-tabs { display: flex; gap: 4px; }
.lib-tabs button { border: 0; background: none; padding: 7px 12px; border-radius: 8px; cursor: pointer; font: 700 14px 'Roboto', sans-serif; color: var(--muted); }
.lib-tabs button[aria-selected="true"] { background: var(--ink); color: var(--bg); }
.lib-kinds { display: flex; gap: 6px; flex-wrap: wrap; }
.lib-kinds button { border: 1px solid var(--rule); background: var(--paper); border-radius: 999px; padding: 4px 11px; font-size: 13px; cursor: pointer; color: var(--ink-2); }
.lib-kinds button span { opacity: .7; font-variant-numeric: tabular-nums; }
.lib-kinds button[aria-pressed="true"] { border-color: var(--ink); background: var(--ink); color: var(--bg); }
.lib-body { padding: 20px 0 8px; }
.lib-group + .lib-group { margin-top: 30px; }
.lib-ghead { display: flex; align-items: baseline; gap: 4px 12px; flex-wrap: wrap; }
.lib-ghead h2 { font: 700 20px/1.25 'Roboto', sans-serif; margin: 0; }
.lib-ghead > span { font-size: 14px; color: var(--muted); }
.lib-ghead .lib-date { font: 700 12px/1 'Roboto', sans-serif; letter-spacing: .06em; text-transform: uppercase; color: var(--amber); width: 100%; }
.lib-docs { list-style: none; padding: 0; margin: 10px 0 0; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
.lib-doc { min-width: 0; width: 100%; height: 100%; display: grid; grid-template-columns: 38px minmax(0, 1fr); align-content: start; gap: 4px 12px; background: var(--paper); border: 1px solid var(--rule); border-radius: 10px; padding: 13px 14px; cursor: pointer; text-align: left; }
.lib-doc:hover { border-color: var(--amber); }
.lib-doc.upcoming { background: transparent; border-style: dashed; }
.lib-ico { width: 38px; height: 38px; border-radius: 9px; display: grid; place-items: center; grid-row: span 3; background: var(--amber-soft); color: var(--amber-ink); }
.lib-ico svg { width: 20px; height: 20px; stroke: currentColor; fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.lib-ico.sm { width: 30px; height: 30px; border-radius: 7px; grid-row: auto; flex: none; }
.lib-ico.sm svg { width: 16px; height: 16px; }
.lib-ico.k-Guide { background: var(--slate-soft); color: var(--slate); }
.lib-ico.k-Tool { background: var(--pass-soft); color: var(--pass); }
.lib-ico.k-Course { background: var(--panel); color: var(--ink-2); }
.lib-doc-title { font: 700 16px/1.3 'Roboto', sans-serif; }
.lib-doc-sum { font-size: 14px; line-height: 1.45; color: var(--ink-2); }
.lib-tags { display: flex; flex-wrap: wrap; gap: 4px 10px; font-size: 12px; color: var(--muted); margin-top: 4px; }
.lib-tags b { font-weight: 600; color: var(--ink-2); }
.lib-count { font-size: 14px; margin: 0 0 6px; }
.lib-result { background: var(--paper); border: 1px solid var(--rule); border-radius: 10px; padding: 14px 16px; margin-top: 10px; }
.lib-rh { display: flex; gap: 10px; align-items: center; }
.lib-result h3 { font: 700 16px/1.3 'Roboto', sans-serif; margin: 0; }
.lib-hits { list-style: none; padding: 0; margin: 10px 0 0; display: flex; flex-direction: column; gap: 6px; }
.lib-hit { width: 100%; text-align: left; background: var(--panel); border: 0; border-radius: 8px; padding: 9px 12px; cursor: pointer; }
.lib-hit:hover { box-shadow: inset 0 0 0 1.5px var(--amber); }
.lib-hit b { display: block; font: 700 13.5px/1.3 'Roboto', sans-serif; margin-bottom: 2px; }
.lib-hit span { font-size: 14px; color: var(--ink-2); line-height: 1.45; }
.lib-empty { background: var(--paper); border: 1px dashed var(--rule); border-radius: 10px; padding: 22px; color: var(--ink-2); }
.lib-shade { position: fixed; inset: 0; background: rgb(26 26 26 / .35); z-index: 60; }
.lib-reader { position: fixed; top: 0; right: 0; bottom: 0; width: min(640px, 100%); background: var(--paper); z-index: 61; display: flex; flex-direction: column; border-left: 1px solid var(--rule); box-shadow: -12px 0 40px rgb(0 0 0 / .12); padding-top: env(safe-area-inset-top, 0px); padding-bottom: env(safe-area-inset-bottom, 0px); }
.lib-rtop { display: flex; justify-content: space-between; align-items: center; gap: 10px; padding: 14px 20px; border-bottom: 1px solid var(--rule); }
.lib-rtop span { font: 700 11px/1.3 'Inter', sans-serif; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); }
.lib-rtop button { border: 1px solid var(--rule); background: var(--paper); border-radius: 8px; padding: 6px 12px; cursor: pointer; font-size: 14px; }
.lib-rbody { overflow-y: auto; padding: 22px 24px 40px; }
.lib-rbody h2 { font: 700 26px/1.15 'Roboto', sans-serif; margin: 0 0 8px; }
.lib-rsum { font-size: 16px; line-height: 1.5; color: var(--ink-2); margin: 0 0 14px; }
.lib-ractions { display: flex; flex-wrap: wrap; gap: 8px 16px; align-items: center; font-size: 13px; }
.lib-ractions a { color: var(--amber); }
.lib-ractions a.lib-open { background: var(--amber); color: #fff; text-decoration: none; font: 700 13px 'Roboto', sans-serif; letter-spacing: .04em; padding: 10px 16px; border-radius: 6px; }
.lib-rtoc { list-style: none; padding: 0; margin: 20px 0 0; border-top: 1px solid var(--rule); }
.lib-rtoc a { display: block; padding: 7px 0; border-bottom: 1px solid var(--rule); text-decoration: none; color: var(--ink); font-size: 14.5px; }
.lib-rtoc a:hover { color: var(--amber-ink); }
.lib-rsec { margin-top: 26px; scroll-margin-top: 10px; border-radius: 6px; }
.lib-rsec h3 { font: 700 18px/1.3 'Roboto', sans-serif; margin: 0 0 6px; }
.lib-rsec p { margin: 0 0 6px; font-size: 15px; line-height: 1.6; color: var(--ink-2); }
.lib-rsec a { color: var(--amber); }
.lib-rsec.flash { animation: lib-flash 1.6s ease-out; }
@keyframes lib-flash { from { background: var(--amber-soft); } to { background: transparent; } }
.lib-rnote { margin-top: 28px; border-top: 1px solid var(--rule); padding-top: 12px; }
@media (max-width: 700px) {
  .lib-docs { grid-template-columns: minmax(0, 1fr); }
  .lib-kbd { display: none; }
  .lib-field input { font-size: 16px; }
  .lib-controls { flex-direction: column; align-items: stretch; }
}
@media (prefers-reduced-motion: reduce) { .lib-rsec.flash { animation: none; } }
`;
