import { useEffect } from "react";

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

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis - Client Training";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

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
      sub: "The intelligence · ~£20/mo",
      body: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version (e.g. Claude at about £20/month) - that's what keeps the work fully secure.",
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
    {
      tag: "A",
      name: "SKILL.md",
      body: "The instructions you'd give a new hire on day one - written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour.",
    },
    {
      tag: "B",
      name: "run.py",
      body: "A short script that does the actual work - pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you.",
    },
    {
      tag: "C",
      name: "documents/",
      body: "Whatever the work needs to process - PDFs, spreadsheets, transcripts, contracts. Drop files in. Pull files out. No upload step.",
    },
    {
      tag: "D",
      name: "Version control, optional",
      body: "Because it's a folder, the standard tools just work - git, Time Machine, Dropbox, a USB stick. There's nothing special to back up.",
    },
  ];

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <style>{`
        .px-wrap { padding: 0 20px 80px; }
        @media (min-width: 600px) { .px-wrap { padding: 0 32px 80px; } }

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
      `}</style>
      <div className="px-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Plain-English intro ── */}
        <div style={{
          borderRadius: 12,
          background: "#1a1a1a",
          padding: "clamp(28px, 5vw, 52px)",
          marginBottom: 56,
          marginTop: 32,
        }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>
            What is Praxis?
          </p>
          <h2 style={{
            ...ROBOTO,
            fontSize: "clamp(22px, 4vw, 36px)",
            fontWeight: 800,
            lineHeight: 1.2,
            color: "#f6f1ea",
            marginBottom: 24,
            letterSpacing: "-0.3px",
          }}>
            A 30-minute Teams call that changes<br />
            how you think about AI.
          </h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>
            No technical background needed. No slides. We share our screen, open a plain folder
            on a normal computer, and show you - live - how three tools you already use can work
            together as a proper AI system that you own and control.
          </p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>
            Most people come in thinking AI is a chat box. They leave understanding it as
            infrastructure. That shift - from tool to system - is what the session is designed
            to give you, in thirty minutes, without any jargon.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#d97706", color: "#fff",
                ...ROBOTO, fontSize: 13, fontWeight: 700,
                padding: "12px 24px", borderRadius: 6,
                textDecoration: "none", letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              Book the 30-minute session →
            </a>
            <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>
              Free · Teams or Google Meet · No preparation required
            </span>
          </div>
        </div>

        {/* Doc header */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64,
        }}>
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
          <h1 style={{
            ...ROBOTO,
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            color: "#1a1a1a",
          }}>
            The folder is the app.<br />
            It runs on your machine.<br />
            It belongs to you.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            You don't need a platform. You don't need an account. You need three tools you
            already use - pointed at the same folder on your machine. That folder, and what's
            inside it, is your app.
          </p>
        </div>

        {/* Section 01 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; The Ingredients</span>
          </div>

          {/* Cards */}
          <div className="px-cols-3">
            {cols.map((col) => (
              <div key={col.num} style={{
                border: "1px solid #d8d0c5",
                borderRadius: 10,
                padding: "24px 20px",
                background: "#faf8f5",
                position: "relative",
              }}>
                <span style={{
                  ...MONO, fontSize: 11, color: "#b0a898",
                  position: "absolute", top: 16, right: 18,
                }}>{col.num}</span>
                <col.Icon />
                <h3 style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{col.title}</h3>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 14 }}>{col.sub}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{col.body}</p>
              </div>
            ))}
          </div>

          {/* Connector row */}
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

            {/* Folder tree */}
            <div>
              <p style={{ ...MONO, fontSize: 12, color: "#7a7568", marginBottom: 16 }}>~/Praxis/folder</p>
              <div style={{ border: "1px solid #c8bfb3", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #e8e2d8", background: "#f9f6f1" }}>
                  <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a" }}>
                    <span style={{ marginRight: 6 }}>▾</span> folder/
                  </span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092", marginLeft: 12 }}>your project</span>
                </div>
                {[
                  { name: "SKILL.md",    label: "the rules · written in plain English", tag: "A" },
                  { name: "run.py",      label: "the script · the work it does",        tag: "B" },
                  { name: "documents/",  label: "your data · the inputs",               tag: "C" },
                  { name: "output/",     label: "what gets produced",                   tag: "" },
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

            {/* A-D descriptions */}
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
              {
                label: "The tools",
                price: "~£20/mo",
                note: "VS Code is free. Claude Pro is ~£20/month. That's the only recurring cost.",
              },
              {
                label: "The session",
                price: "£250",
                note: "Thirty minutes, live on your machine. You leave with a working folder and the mental model to build more.",
              },
              {
                label: "The diagnostic sprint",
                price: "£2,500",
                note: "Two weeks. We look at your real documents and workflows and tell you exactly what is possible.",
              },
            ].map((p) => (
              <div key={p.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5" }}>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>{p.label}</p>
                <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>{p.price}</p>
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
              Book a thirty-minute Praxis session. We build it in front of you, on your machine, with your files.
            </p>
          </div>
          <a
            href="https://cal.com/tuttoone/15min"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#1a1a1a", color: "#f6f1ea",
              ...ROBOTO, fontSize: 13, fontWeight: 700,
              padding: "12px 24px", borderRadius: 4,
              textDecoration: "none", letterSpacing: "0.04em",
              whiteSpace: "nowrap",
            }}
          >
            Book a session →
          </a>
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
