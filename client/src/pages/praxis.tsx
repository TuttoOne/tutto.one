import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

function EditorIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8eef8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="16" rx="2" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="2" y1="8" x2="22" y2="8" stroke="#4a7cc7" strokeWidth="1.5"/>
        <rect x="5" y="11" width="8" height="1.5" rx="0.75" fill="#4a7cc7"/>
        <rect x="5" y="14" width="5" height="1.5" rx="0.75" fill="#4a7cc7"/>
      </svg>
    </div>
  );
}

function AssistantIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#fce8e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="12" y1="4" x2="12" y2="20" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="4" y1="12" x2="20" y2="12" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="6.5" y1="6.5" x2="17.5" y2="17.5" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="17.5" y1="6.5" x2="6.5" y2="17.5" stroke="#c4623a" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

function FilesystemIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="3" y1="15" x2="21" y2="15" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="9" y1="9" x2="9" y2="21" stroke="#6b6b6b" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6, color: "#f6f1ea",
  padding: "9px 12px", fontSize: 13,
  outline: "none",
  ...INTER,
};

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis - Client Training";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  const [form, setForm] = useState({ name: "", email: "", industry: "", goals: "", aiHistory: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    try {
      const message = [
        `Industry: ${form.industry}`,
        `What they want from AI: ${form.goals}`,
        `Previous AI usage: ${form.aiHistory}`,
      ].join("\n\n");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      });
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  };

  const cols = [
    {
      num: "i.",
      Icon: EditorIcon,
      title: "The editor",
      sub: "Where you work · Free",
      body: "An open code editor of your choice - these are usually free. It shows the files and lets you edit, search, and talk to your chosen assistant in normal language. Nothing magical, just the workshop bench.",
    },
    {
      num: "ii.",
      Icon: AssistantIcon,
      title: "The assistant",
      sub: "The intelligence · ~$20/mo",
      body: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version (e.g. Claude at about $20/month) - that's what keeps the work fully secure.",
    },
    {
      num: "iii.",
      Icon: FilesystemIcon,
      title: "Your filesystem",
      sub: "What you already own",
      body: "Plain folders, plain files - on the computer you already own. No cloud, no database, no proprietary format. Just the same disk you've been using for years. The thing that makes it yours.",
    },
  ];

  const items = [
    { tag: "A", name: "SKILL.md", body: "The instructions you'd give a new hire on day one - written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour." },
    { tag: "B", name: "run.py", body: "A short script that does the actual work - pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you." },
    { tag: "C", name: "documents/", body: "Whatever the work needs to process - PDFs, spreadsheets, transcripts, contracts. Drop files in. Pull files out. No upload step." },
    { tag: "D", name: "Version control, optional", body: "Because it's a folder, the standard tools just work - git, Time Machine, Dropbox, a USB stick. There's nothing special to back up." },
  ];

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .px-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .px-wrap { padding: 64px 32px 80px; } }

        .px-cols-3 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .px-cols-3 { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }

        .px-cols-2 { display: grid; grid-template-columns: 1fr; gap: 36px; align-items: start; }
        @media (min-width: 680px) { .px-cols-2 { grid-template-columns: 1fr 1fr; gap: 48px; } }

        .px-connector { display: flex; align-items: center; gap: 10px; margin-top: 24px; }
        .px-connector-line { flex: 1; height: 1px; background: #c8bfb3; }
        .px-connector-dot { width: 7px; height: 7px; border-radius: 50%; background: #1a1a1a; flex-shrink: 0; }
        @media (max-width: 679px) {
          .px-connector-line, .px-connector-dot { display: none; }
          .px-connector { justify-content: center; }
        }

        .px-tree-label { font-family: 'JetBrains Mono','Fira Mono','Courier New',monospace; font-size: 10px; color: #a8a092; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media (max-width: 479px) { .px-tree-label { display: none; } }

        .px-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .px-input::placeholder { color: rgba(246,241,234,0.3); }
        .px-input:focus { border-color: rgba(217,119,6,0.6) !important; }
      `}</style>
      <div className="px-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Plain-English intro ── */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>
            What is Praxis?
          </p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>
            A one-hour Teams call that changes<br />
            how you think about AI.
          </h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>
            No technical background needed. The session runs in two halves. The first
            thirty minutes covers the theory and principles - what AI actually is, how the
            folder-based system works, and why it changes everything. No jargon.
          </p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>
            The second thirty minutes is practical - on your own computer, with your own
            files. You follow along live as we build the system together. By the end of the
            hour, you have a working setup and the mental model to take it further.
          </p>

          {/* Book button */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", marginBottom: 28 }}>
            <a
              href="https://cal.com/tuttoone/1hr"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d97706", color: "#fff", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            >
              Book the 1-hour session →
            </a>
            <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>
              Teams or Google Meet · No preparation required
            </span>
          </div>

          {/* Pre-session requirements */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: 24, marginBottom: 28 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 10 }}>Before the session</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "rgba(246,241,234,0.55)", maxWidth: 520 }}>
              The practical half runs on your computer. To get the most from it, please have
              Claude installed and a paid subscription active before we start - and ideally
              Visual Studio Code too. Fill in the form below and we'll send you exactly what
              to set up in advance.
            </p>
          </div>

          {/* Quick form */}
          {formState === "sent" ? (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>Done - we'll be in touch.</p>
              <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.5)" }}>Book the 1-hour session above and we'll send setup instructions in advance.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "24px" }}>
              <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: "rgba(246,241,234,0.7)", marginBottom: 18 }}>
                Fill this in and we'll send you setup instructions before the session
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>Name</label>
                  <input
                    className="px-input"
                    style={INPUT}
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>Email</label>
                  <input
                    className="px-input"
                    type="email"
                    style={INPUT}
                    required
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>Industry</label>
                <input
                  className="px-input"
                  style={INPUT}
                  placeholder="e.g. Legal, Finance, Healthcare, Consulting..."
                  value={form.industry}
                  onChange={e => setForm(f => ({ ...f, industry: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>What would you like to get out of AI?</label>
                <textarea
                  className="px-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 72 }}
                  placeholder="Save time on document review, automate a report, understand what's possible..."
                  value={form.goals}
                  onChange={e => setForm(f => ({ ...f, goals: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>How have you used AI so far?</label>
                <textarea
                  className="px-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 60 }}
                  placeholder="Occasionally use ChatGPT, tried Copilot, haven't started yet..."
                  value={form.aiHistory}
                  onChange={e => setForm(f => ({ ...f, aiHistory: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <p style={{ ...INTER, fontSize: 11, color: "rgba(246,241,234,0.3)", maxWidth: 340 }}>
                  No marketing. Your details are stored only to prepare for and respond to your session enquiry.
                </p>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, background: formState === "sending" ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.12)", color: "#f6f1ea", border: "1px solid rgba(255,255,255,0.2)", borderRadius: 6, padding: "10px 22px", cursor: formState === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                >
                  {formState === "sending" ? "Sending..." : "Submit"}
                </button>
              </div>
              {formState === "error" && (
                <p style={{ ...INTER, fontSize: 12, color: "#f87171", marginTop: 10 }}>Something went wrong - please try again.</p>
              )}
            </form>
          )}
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>Praxis · Client Training One-Pager · V1</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            A &nbsp;M e n t a l &nbsp;M o d e l &nbsp;i n &nbsp;O n e &nbsp;P a g e
          </p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
            The folder is the app.<br />
            It runs on your machine.<br />
            It belongs to you.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            You don't need a proprietary platform or an account with us. The only thing you'll
            need to subscribe to is Claude - about $20 a month - and a free code editor. Point
            all three at the same folder on your machine. That folder, and what's inside it,
            is your app.
          </p>
        </div>

        {/* Section 01 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; The Ingredients</span>
          </div>
          <div className="px-cols-3">
            {cols.map((col) => (
              <div key={col.num} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 11, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{col.num}</span>
                <col.Icon />
                <h3 style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{col.title}</h3>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 14 }}>{col.sub}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{col.body}</p>
              </div>
            ))}
          </div>
          <div className="px-connector">
            <div className="px-connector-line" />
            <div className="px-connector-dot" />
            <div className="px-connector-line" />
            <div style={{ border: "1px solid #c8bfb3", borderRadius: 20, padding: "5px 16px", flexShrink: 0, background: "#f6f1ea" }}>
              <span style={{ ...MONO, fontSize: 11, color: "#5a5248" }}>point all three at the same folder ↓</span>
            </div>
            <div className="px-connector-line" />
            <div className="px-connector-dot" />
            <div className="px-connector-line" />
          </div>
        </div>

        {/* Section 02 */}
        <div>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>02 &nbsp;&nbsp;&nbsp; The Output - A Folder on Disk</span>
          </div>
          <div className="px-cols-2">
            <div>
              <p style={{ ...MONO, fontSize: 12, color: "#7a7568", marginBottom: 16 }}>~/Praxis/folder</p>
              <div style={{ border: "1px solid #c8bfb3", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #e8e2d8", background: "#f9f6f1" }}>
                  <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a" }}><span style={{ marginRight: 6 }}>▾</span> folder/</span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092", marginLeft: 12 }}>your project</span>
                </div>
                {[
                  { name: "SKILL.md",   label: "the rules · written in plain English", tag: "A" },
                  { name: "run.py",     label: "the script · the work it does",        tag: "B" },
                  { name: "documents/", label: "your data · the inputs",               tag: "C" },
                  { name: "output/",    label: "what gets produced",                   tag: "" },
                ].map((row) => (
                  <div key={row.name} style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: "1px solid #f0ebe3", gap: 10 }}>
                    {row.tag
                      ? <span style={{ ...MONO, fontSize: 9, fontWeight: 600, width: 16, height: 16, borderRadius: "50%", background: "#1a1a1a", color: "#f6f1ea", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.tag}</span>
                      : <span style={{ width: 16, flexShrink: 0 }} />
                    }
                    <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a", minWidth: 110 }}>- {row.name}</span>
                    <span className="px-tree-label">{row.label}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 16px", background: "#f9f6f1", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>4 items · ~12 KB</span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>opens in any editor · runs anywhere</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((item) => (
                <div key={item.tag} style={{ display: "flex", gap: 16 }}>
                  <span style={{ ...MONO, fontSize: 10, fontWeight: 600, width: 20, height: 20, borderRadius: "50%", background: "#1a1a1a", color: "#f6f1ea", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{item.tag}</span>
                  <div>
                    <p style={{ ...ROBOTO, fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 5 }}>{item.name}</p>
                    <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing section */}
        <div style={{ marginTop: 64 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>03 &nbsp;&nbsp;&nbsp; What It Costs</span>
          </div>
          <div className="px-cols-3">
            {[
              { label: "The tools", price: "~$20/mo", note: "VS Code is free. Claude Pro is ~$20/month. That's the only recurring cost." },
              { label: "The session · Spring special", price: "£100", strikethrough: "£200", note: "Limited time only — usually £200. One hour: 30 minutes of theory and principles, then 30 minutes hands-on on your own computer. You leave with a working setup." },
              { label: "The diagnostic sprint", price: "~£2,500", note: "Two weeks. We look at your real documents and workflows and tell you exactly what is possible." },
            ].map((p) => (
              <div key={p.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5" }}>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>{p.label}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 12 }}>
                  <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-1px", margin: 0 }}>{p.price}</p>
                  {"strikethrough" in p && <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 700, color: "#c8bfb3", textDecoration: "line-through", margin: 0 }}>{(p as any).strikethrough}</p>}
                </div>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: "#5a5248" }}>{p.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 48, borderTop: "1px solid #d8d0c5", paddingTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 8 }}>Ready to see it live?</p>
            <p style={{ ...INTER, fontSize: 14, color: "#3d3d3d", maxWidth: 380 }}>
              Book a one-hour Praxis session. Theory first, then hands-on together — on your machine, with your files.
            </p>
          </div>
          <a
            href="https://cal.com/tuttoone/1hr"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#f6f1ea", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          >
            Book a session →
          </a>
        </div>

        {/* Etymology */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>On the word</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 20, maxWidth: 620, fontStyle: "italic" }}>
            Praxis is the loop of putting theory into practice, then letting what you learn from doing it sharpen the theory.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620 }}>
            Praxis comes from the Greek <em>prâxis</em> (πρᾶξις), meaning "doing" or "action," from the verb <em>prattein</em>, "to do" or "to act." Aristotle used it to distinguish lived action from two other modes of human activity - <em>theoria</em> (contemplation) and <em>poiesis</em> (making). Where <em>poiesis</em> produces an object outside itself, praxis is action whose end lies in the doing itself, the conduct of a life rather than the manufacture of a thing.
          </p>
        </div>

        {/* Doc footer */}
        <div className="px-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Praxis · Client Training</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Module 01 - Foundations</span>
        </div>

      </div>
    </div>
  );
}
