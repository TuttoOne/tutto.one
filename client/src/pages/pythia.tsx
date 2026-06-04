import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

function HierarchyIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8eef8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="9" y="2" width="6" height="4" rx="1" stroke="#4a7cc7" strokeWidth="1.5"/>
        <rect x="2" y="10" width="6" height="4" rx="1" stroke="#4a7cc7" strokeWidth="1.5"/>
        <rect x="9" y="10" width="6" height="4" rx="1" stroke="#4a7cc7" strokeWidth="1.5"/>
        <rect x="16" y="10" width="6" height="4" rx="1" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="12" y1="6" x2="12" y2="10" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="5" y1="8" x2="19" y2="8" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="5" y1="8" x2="5" y2="10" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="19" y1="8" x2="19" y2="10" stroke="#4a7cc7" strokeWidth="1.5"/>
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

function LoopIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <path d="M4 12a8 8 0 0 1 14.93-4H16" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M20 12a8 8 0 0 1-14.93 4H8" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="19 5 19.93 8 17 8" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="5 19 4.07 16 7 16" stroke="#6b6b6b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

const capabilities = [
  {
    num: "i.",
    Icon: HierarchyIcon,
    title: "A hierarchy of knowledge",
    sub: "Structured · Searchable · Yours",
    body: "Every document, note, and decision organised into a structured hierarchy you define. Semantic search runs across all of it. Ask anything — it finds the answer in the record, not in a guess.",
  },
  {
    num: "ii.",
    Icon: LockIcon,
    title: "AI as orchestrator, not custodian",
    sub: "Local-first · Zero cloud exposure",
    body: "The AI connects to your knowledge base and instructs agents to act on it. Your data stays on your hardware at every step. Nothing is sent to third-party APIs. The AI orchestrates — it never holds.",
  },
  {
    num: "iii.",
    Icon: LoopIcon,
    title: "Self-improving by design",
    sub: "Each session sharpens the system",
    body: "Every question, correction, and refinement feeds back into the system. The hierarchy grows more accurate, the search improves, and the agents get better instructions — without any data leaving your environment.",
  },
];

const questions = [
  {
    tag: "A",
    q: "Summarise everything we know about the Hartwell account and flag any unresolved issues.",
    a: "Found 34 relevant entries across notes, emails, and project files. 3 unresolved issues flagged: outstanding approval from legal (noted 14 Mar), unanswered pricing question (thread from 2 Apr), and a decision logged as provisional in the project record.",
  },
  {
    tag: "B",
    q: "What decisions have we made about the product roadmap in the last 90 days?",
    a: "18 logged decisions. Key changes: deprioritised v2 export module (12 Feb), approved new onboarding flow (3 Mar), deferred API redesign to Q4 (27 Mar). Sources: 6 meeting notes, 2 Slack threads, 1 board summary.",
  },
  {
    tag: "C",
    q: "Find everything connected to the compliance audit and build a timeline.",
    a: "Traced 27 documents. Timeline starts 8 Jan (initial scope). Key gaps: no sign-off recorded between 14 Feb and 9 Mar. Flagged 2 policy documents with conflicting revision dates.",
  },
];

export default function Pythia() {
  useEffect(() => {
    document.title = "Pythia - A private second brain that acts.";
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
            A private second brain.<br />
            AI as the orchestrator.<br />
            Agents that act. Data that stays.
          </h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>
            Pythia creates a hierarchy of your information — structured, searchable, and entirely on your own hardware. You ask questions in plain language. The AI figures out what you need and instructs agents to find it, cross-reference it, or act on it.
          </p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>
            At no point does your data leave. The AI is detached from the knowledge base — it orchestrates, it doesn't store. Each interaction makes the system sharper.
          </p>
          <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>
            Local-first · Any knowledge domain · Self-improving
          </span>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>Pythia · Private Knowledge Intelligence · V1</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            Y o u r &nbsp;K n o w l e d g e. &nbsp;Y o u r &nbsp;H a r d w a r e. &nbsp;Y o u r &nbsp;R u l e s.
          </p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
            Structure it.<br />
            Search it.<br />
            Act on it privately.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            Most organisations have knowledge scattered across files, emails, and tools — findable only by the people who already know where to look. Pythia organises that knowledge into a structured hierarchy, makes it semantically searchable, and connects an AI orchestration layer that can query it, reason across it, and instruct agents to act — without any of that data ever touching an external service.
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
                { stat: "Zero",           label: "Data sent to external services" },
                { stat: "Any domain",     label: "Legal, medical, ops, research — your choice" },
                { stat: "Better each time", label: "Self-improving with every session" },
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

        {/* Etymology */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>On the name</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 20, maxWidth: 620, fontStyle: "italic" }}>
            The Pythia was the Oracle at Delphi — the one you consulted when you needed an answer from everything that had been heard.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620 }}>
            Pythia was the title given to the high priestess of the Temple of Apollo at Delphi, who served as its oracle. The name derives from Python, the serpent Apollo slew at Delphi. To put a question to the Pythia was not to ask for a guess — it was to receive the distilled answer from everything the oracle had witnessed and absorbed. That is the model: every document, read; every question, answered from the record itself.
          </p>
        </div>

        {/* Doc footer */}
        <div className="py-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Pythia · Private Knowledge Intelligence</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Module 01 - Overview</span>
        </div>

      </div>
    </div>
  );
}
