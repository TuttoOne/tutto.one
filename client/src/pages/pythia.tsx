import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

function SearchIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8eef8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="7" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="16.5" y1="16.5" x2="21" y2="21" stroke="#4a7cc7" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="8" y1="11" x2="14" y2="11" stroke="#4a7cc7" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="11" y1="8" x2="11" y2="14" stroke="#4a7cc7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function LockIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#fce8e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="5" y="11" width="14" height="10" rx="2" stroke="#c4623a" strokeWidth="1.5"/>
        <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="#c4623a" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="12" cy="16" r="1.5" fill="#c4623a"/>
      </svg>
    </div>
  );
}

function TimelineIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="3" x2="12" y2="21" stroke="#6b6b6b" strokeWidth="1.5"/>
        <circle cx="12" cy="6" r="2" fill="#6b6b6b"/>
        <circle cx="12" cy="12" r="2" fill="#6b6b6b"/>
        <circle cx="12" cy="18" r="2" fill="#6b6b6b"/>
        <line x1="12" y1="6" x2="18" y2="6" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="12" y1="12" x2="18" y2="12" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="12" y1="18" x2="18" y2="18" stroke="#6b6b6b" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

const capabilities = [
  {
    num: "i.",
    Icon: SearchIcon,
    title: "Ask in plain English",
    sub: "Semantic search · Cited answers",
    body: "Ask it the way you'd brief a junior. Every answer cites the source document and page number. No guessing. No hallucination from the AI's own knowledge.",
  },
  {
    num: "ii.",
    Icon: LockIcon,
    title: "Nothing leaves the office",
    sub: "On-premise · Zero cloud APIs",
    body: "OCR, inference, vector search, and storage all run locally on your hardware. No data sent to third parties. Satisfies Legal Professional Privilege architecturally.",
  },
  {
    num: "iii.",
    Icon: TimelineIcon,
    title: "Every document. Every format.",
    sub: "150,000+ files · All formats",
    body: "PDF, DOCX, MSG, EML, XLSX, TIF, and more. Pythia reads in your first disclosure set in a few weeks. New documents are added as they arrive.",
  },
];

const questions = [
  {
    tag: "A",
    q: "Find all documents referencing the March 2023 board meeting and summarise the key decisions.",
    a: "Found 14 relevant passages across 6 documents. Key decisions: approval of revised share structure (Exhibit C-112), appointment of interim CFO (Email D-0447), deferral of acquisition vote to Q3 2023 (Board Minutes C-089).",
  },
  {
    tag: "B",
    q: "Show me all emails between the claimant and defendant between January and April 2022.",
    a: "Retrieved 38 emails. Earliest: 4 Jan 2022 (REF: D-0012). Latest: 29 Apr 2022 (REF: D-0891). 12 marked confidential by producing side.",
  },
  {
    tag: "C",
    q: "Build a timeline of contractual deadlines mentioned across all documents.",
    a: "Extracted 23 deadline references. Key dates: 15 Feb 2022 (payment milestone, Contract §4.2), 1 Jun 2022 (option expiry, Addendum B), 30 Sep 2022 (longstop date, original SPA).",
  },
];

export default function Pythia() {
  useEffect(() => {
    document.title = "Pythia - Read every file. Miss nothing.";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .py-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .py-wrap { padding: 64px 32px 80px; } }

        .py-cols-3 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .py-cols-3 { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }

        .py-cols-2 { display: grid; grid-template-columns: 1fr; gap: 36px; align-items: start; }
        @media (min-width: 680px) { .py-cols-2 { grid-template-columns: 1fr 1fr; gap: 48px; } }

        .py-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }
      `}</style>
      <div className="py-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>
            What is Pythia?
          </p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>
            An AI that reads every document<br />
            in your firm. Miss nothing.
          </h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>
            Juniors spend days reading. Partners wait. The thing you miss is the thing that
            loses the case. Pythia reads everything - every file, every footnote - and lets
            you ask questions the way you'd brief a junior.
          </p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>
            It runs on your hardware. Nothing leaves your office. No cloud, no third-party
            APIs, no exposure. Legal Professional Privilege satisfied by architecture, not
            by policy.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="https://cal.com/tuttoone/30min"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d97706", color: "#fff", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            >
              Book a conversation →
            </a>
            <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>
              On-site · Private · UK-built
            </span>
          </div>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>Pythia · Legal Document Intelligence · V1</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            B i l l &nbsp;f o r &nbsp;T h i n k i n g, &nbsp;N o t &nbsp;S e a r c h i n g
          </p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
            Read every file.<br />
            Find what matters.<br />
            In hours, not days.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            Pythia is a self-hosted document intelligence platform for litigation and legal
            review. It processes entire disclosure sets locally - semantic search,
            conversational Q&A with citations, interactive timelines, and OCR. Ask it the way
            you'd brief a junior. It finds every relevant file, and shows you exactly why.
          </p>
        </div>

        {/* Section 01 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; How It Works</span>
          </div>
          <div className="py-cols-3">
            {capabilities.map((cap) => (
              <div key={cap.num} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 11, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{cap.num}</span>
                <cap.Icon />
                <h3 style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{cap.title}</h3>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 14 }}>{cap.sub}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{cap.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02 */}
        <div>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>02 &nbsp;&nbsp;&nbsp; Example Questions</span>
          </div>
          <div className="py-cols-2">

            {/* Stats column */}
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { stat: "3 days → 3 hours", label: "Document review per matter" },
                { stat: "Zero",             label: "Files leave your office" },
                { stat: "Every footnote",   label: "Found and explained" },
              ].map((s) => (
                <div key={s.stat} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5" }}>
                  <p style={{ ...ROBOTO, fontSize: 28, fontWeight: 900, color: "#1a1a1a", marginBottom: 6, letterSpacing: "-0.5px" }}>{s.stat}</p>
                  <p style={{ ...INTER, fontSize: 11, color: "#a8a092" }}>{s.label}</p>
                </div>
              ))}
            </div>

            {/* Q&A column */}
            <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, overflow: "hidden", background: "#faf8f5" }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid #e8e2d8", background: "#f9f6f1", display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#f87171" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#fbbf24" }} />
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#4ade80" }} />
                <span style={{ ...MONO, fontSize: 10, color: "#a8a092", marginLeft: 6 }}>Pythia · example session</span>
              </div>
              <div style={{ padding: "20px 20px", display: "flex", flexDirection: "column", gap: 20 }}>
                {questions.map((q) => (
                  <div key={q.tag}>
                    <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
                      <span style={{ ...MONO, fontSize: 9, fontWeight: 600, width: 16, height: 16, borderRadius: "50%", background: "#1a1a1a", color: "#f6f1ea", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{q.tag}</span>
                      <p style={{ ...INTER, fontSize: 11, color: "#3d3d3d", lineHeight: 1.6 }}>{q.q}</p>
                    </div>
                    <div style={{ marginLeft: 26 }}>
                      <p style={{ ...MONO, fontSize: 10, color: "#7a7568", lineHeight: 1.7, background: "#f0ebe3", borderRadius: 6, padding: "8px 12px" }}>{q.a}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Section 03 */}
        <div style={{ marginTop: 64 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>03 &nbsp;&nbsp;&nbsp; Engagement</span>
          </div>
          <div className="py-cols-3">
            {[
              { label: "The diagnostic sprint", price: "~£2,500", note: "Two weeks. We review your real documents and workflows and tell you exactly what Pythia can do for your practice." },
              { label: "The build", price: "From £20,000", note: "Hardware and custom build, scoped after the diagnostic. Typically four to eight weeks from sign-off to a system running on your premises." },
              { label: "Ongoing", price: "~20% p.a.", note: "Assessed during the build. Covers ingestion of new matter files, system maintenance, and keeping Pythia current as your work evolves." },
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
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 8 }}>Ready to see it in your practice?</p>
            <p style={{ ...INTER, fontSize: 14, color: "#3d3d3d", maxWidth: 380 }}>
              Book a thirty-minute conversation. We'll walk through your documents and tell you what's possible.
            </p>
          </div>
          <a
            href="https://cal.com/tuttoone/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#1a1a1a", color: "#f6f1ea", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 4, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          >
            Book a conversation →
          </a>
        </div>

        {/* Etymology */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>On the name</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 20, maxWidth: 620, fontStyle: "italic" }}>
            The Pythia was the Oracle at Delphi - the one you consulted when you needed an answer from everything that had been heard.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620 }}>
            Pythia was the title given to the high priestess of the Temple of Apollo at Delphi, who served as its oracle. The name derives from Python, the serpent Apollo slew at Delphi. To put a question to the Pythia was not to ask for a guess - it was to receive the distilled answer from everything the oracle had witnessed and absorbed. That is the model: every document, read; every question, answered from the record itself.
          </p>
        </div>

        {/* Doc footer */}
        <div className="py-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Pythia · Legal Document Intelligence</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Module 01 - Overview</span>
        </div>

      </div>
    </div>
  );
}
