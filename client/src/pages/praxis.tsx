import { useEffect } from "react";

const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const SERIF: React.CSSProperties = { fontFamily: "'Source Serif 4',Georgia,serif" };
const SANS: React.CSSProperties = { fontFamily: "'Inter',-apple-system,sans-serif" };
const CAPS: React.CSSProperties = { ...MONO, textTransform: "uppercase", letterSpacing: "0.12em" };

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis — Client Training";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...SANS }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 32px 80px" }}>

        {/* ── Doc header ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderBottom: "1px solid #1a1a1a",
          padding: "18px 0",
          marginBottom: 64,
        }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>
            Praxis · Client Training One-Pager · V1
          </span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* ── Tagline ── */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            A &nbsp;M e n t a l &nbsp;M o d e l &nbsp;i n &nbsp;O n e &nbsp;P a g e
          </p>
        </div>

        {/* ── Hero ── */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{
            ...SERIF,
            fontSize: "clamp(36px, 6vw, 60px)",
            fontWeight: 700,
            lineHeight: 1.12,
            letterSpacing: "-0.5px",
            marginBottom: 0,
            color: "#1a1a1a",
          }}>
            The folder is the app.<br />
            It runs on your machine.<br />
            It belongs to you.
          </h1>
        </div>

        {/* ── Intro para ── */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            You don't need a platform. You don't need an account. You need three tools you
            already use — pointed at the same folder on your machine. That folder, and what's
            inside it, is your app.
          </p>
        </div>

        {/* ── Section 01 ── */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; The Ingredients</span>
          </div>

          {/* Three columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 0 }}>
            {[
              {
                num: "i.",
                title: "The editor",
                sub: "Where you work · Free",
                body: "An open code editor of your choice — these are usually free. It shows the files and lets you edit, search, and talk to your chosen assistant in normal language. Nothing magical, just the workshop bench.",
              },
              {
                num: "ii.",
                title: "The assistant",
                sub: "The intelligence · ~£20/mo",
                body: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version — that's what keeps the work fully secure.",
              },
              {
                num: "iii.",
                title: "Your filesystem",
                sub: "What you already own",
                body: "Plain folders, plain files — on the computer you already own. No cloud, no database, no proprietary format. Just the same disk you've been using for years. The thing that makes it yours.",
              },
            ].map((col, i) => (
              <div key={col.num} style={{
                borderLeft: i === 0 ? "none" : "1px solid #d8d0c5",
                padding: i === 0 ? "0 32px 0 0" : "0 32px",
              }}>
                <div style={{ ...MONO, fontSize: 20, fontWeight: 400, color: "#a8a092", marginBottom: 20 }}>{col.num}</div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", marginBottom: 4 }}>{col.title}</p>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 16 }}>{col.sub}</p>
                <p style={{ fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{col.body}</p>
              </div>
            ))}
          </div>

          {/* Arrow */}
          <div style={{ textAlign: "center", marginTop: 40, paddingTop: 32, borderTop: "1px solid #d8d0c5" }}>
            <span style={{ ...MONO, fontSize: 11, color: "#7a7568" }}>
              point all three at the same folder ↓
            </span>
          </div>
        </div>

        {/* ── Section 02 ── */}
        <div>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>02 &nbsp;&nbsp;&nbsp; The Output — A Folder on Disk</span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "start" }}>

            {/* Left: folder tree */}
            <div>
              <p style={{ ...MONO, fontSize: 12, color: "#7a7568", marginBottom: 16 }}>~/Praxis/folder</p>

              <div style={{
                border: "1px solid #c8bfb3",
                borderRadius: 8,
                overflow: "hidden",
                background: "#fff",
              }}>
                {/* Tree header */}
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #e8e2d8", background: "#f9f6f1" }}>
                  <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a" }}>
                    <span style={{ marginRight: 6 }}>▾</span> folder/
                  </span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092", marginLeft: 12 }}>your project</span>
                </div>

                {/* Tree rows */}
                {[
                  { name: "SKILL.md",      label: "the rules · written in plain English",  tag: "A" },
                  { name: "run.py",        label: "the script · the work it does",          tag: "B" },
                  { name: "documents/",   label: "your data · the inputs",                  tag: "C" },
                  { name: "output/",      label: "what gets produced",                       tag: "" },
                ].map((row) => (
                  <div key={row.name} style={{
                    display: "flex",
                    alignItems: "center",
                    padding: "8px 16px",
                    borderBottom: "1px solid #f0ebe3",
                    gap: 10,
                  }}>
                    {row.tag && (
                      <span style={{
                        ...MONO, fontSize: 9, fontWeight: 600,
                        width: 16, height: 16, borderRadius: "50%",
                        background: "#1a1a1a", color: "#f6f1ea",
                        display: "inline-flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }}>{row.tag}</span>
                    )}
                    {!row.tag && <span style={{ width: 16, flexShrink: 0 }} />}
                    <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a", minWidth: 110 }}>— {row.name}</span>
                    <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>{row.label}</span>
                  </div>
                ))}

                {/* Footer */}
                <div style={{
                  padding: "8px 16px",
                  background: "#f9f6f1",
                  display: "flex",
                  justifyContent: "space-between",
                }}>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>4 items · ~12 KB</span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>opens in any editor · runs anywhere</span>
                </div>
              </div>
            </div>

            {/* Right: A-D descriptions */}
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {[
                {
                  tag: "A",
                  name: "SKILL.md",
                  body: "The instructions you'd give a new hire on day one — written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour.",
                },
                {
                  tag: "B",
                  name: "run.py",
                  body: "A short script that does the actual work — pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you.",
                },
                {
                  tag: "C",
                  name: "documents/",
                  body: "Whatever the work needs to process — PDFs, spreadsheets, transcripts, contracts. Drop files in. Pull files out. No upload step.",
                },
                {
                  tag: "D",
                  name: "Version control, optional",
                  body: "Because it's a folder, the standard tools just work — git, Time Machine, Dropbox, a USB stick. There's nothing special to back up.",
                },
              ].map((item) => (
                <div key={item.tag} style={{ display: "flex", gap: 16 }}>
                  <span style={{
                    ...MONO, fontSize: 10, fontWeight: 600,
                    width: 20, height: 20, borderRadius: "50%",
                    background: "#1a1a1a", color: "#f6f1ea",
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 2,
                  }}>{item.tag}</span>
                  <div>
                    <p style={{ ...MONO, fontSize: 11, fontWeight: 600, color: "#1a1a1a", marginBottom: 6 }}>{item.name}</p>
                    <p style={{ fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{ marginTop: 64, borderTop: "1px solid #d8d0c5", paddingTop: 40, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 20 }}>
          <div>
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 8 }}>Ready to see it live?</p>
            <p style={{ fontSize: 14, color: "#3d3d3d", maxWidth: 380 }}>
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
              fontSize: 12, fontWeight: 600, ...MONO,
              padding: "11px 24px", borderRadius: 4,
              textDecoration: "none", letterSpacing: "0.05em",
              whiteSpace: "nowrap",
            }}
          >
            Book a session →
          </a>
        </div>

        {/* ── Doc footer ── */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          borderTop: "1.5px solid #1a1a1a",
          marginTop: 48,
          paddingTop: 14,
        }}>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Praxis · Client Training</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Module 01 — Foundations</span>
        </div>

      </div>
    </div>
  );
}
