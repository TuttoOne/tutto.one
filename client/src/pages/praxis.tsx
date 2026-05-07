import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis — Tutto";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  const mono: React.CSSProperties = { fontFamily: "'JetBrains Mono', 'Fira Mono', 'Courier New', monospace" };
  const serif: React.CSSProperties = { fontFamily: "'Source Serif 4', Georgia, serif" };

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", color: "#1a1a1a" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "60px 32px 100px" }}>

        {/* ── Window mockup ── */}
        <div style={{
          border: "1.5px solid #1a1a1a",
          borderRadius: 10,
          overflow: "hidden",
          boxShadow: "4px 4px 0 #1a1a1a",
          marginBottom: 56,
        }}>
          {/* Title bar */}
          <div style={{
            background: "#1a1a1a",
            padding: "10px 16px",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}>
            <div style={{ display: "flex", gap: 6 }}>
              {["#ff5f56","#ffbd2e","#27c93f"].map(c => (
                <span key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c, display: "block" }} />
              ))}
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
              <span style={{ ...mono, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 5, padding: "3px 18px", fontSize: 11, color: "rgba(255,255,255,0.45)" }}>
                ~/praxis-session — VS Code
              </span>
            </div>
          </div>

          {/* Editor body */}
          <div style={{ display: "flex", background: "#1e1e1e", minHeight: 280 }}>

            {/* File explorer */}
            <div style={{ width: 190, borderRight: "1px solid #2d2d2d", padding: "12px 0", flexShrink: 0 }}>
              <div style={{ ...mono, fontSize: 9, color: "#666", padding: "0 12px 8px", letterSpacing: "0.08em", textTransform: "uppercase" }}>Explorer</div>
              {[
                { label: "📁 praxis-session", indent: 0, dim: false },
                { label: "📄 skill.md", indent: 1, active: true, dim: false },
                { label: "📄 run.py", indent: 1, dim: false },
                { label: "📄 engagement-letter.pdf", indent: 1, dim: true },
                { label: "📄 meeting-notes.docx", indent: 1, dim: true },
                { label: "📄 output.md", indent: 1, dim: false },
              ].map((f: any) => (
                <div key={f.label} style={{
                  ...mono,
                  fontSize: 11,
                  padding: `5px ${8 + f.indent * 14}px`,
                  color: f.active ? "#e8d5b0" : f.dim ? "#444" : "#9d9d9d",
                  background: f.active ? "rgba(255,255,255,0.06)" : "transparent",
                  borderLeft: f.active ? "2px solid #d97706" : "2px solid transparent",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}>
                  {f.label}
                </div>
              ))}
            </div>

            {/* Code editor */}
            <div style={{ flex: 1, padding: "16px 20px", overflow: "hidden" }}>
              {[
                { ln: "1",  text: "# skill.md — House rules for this matter", color: "#6a9955" },
                { ln: "2",  text: "", color: "" },
                { ln: "3",  text: "## Output format", color: "#9cdcfe" },
                { ln: "4",  text: "- Always begin with a one-sentence summary.", color: "#d4d4d4" },
                { ln: "5",  text: "- Cite the source document and page number.", color: "#d4d4d4" },
                { ln: "6",  text: "- Flag anything uncertain with [REVIEW].", color: "#d4d4d4" },
                { ln: "7",  text: "", color: "" },
                { ln: "8",  text: "## Scope", color: "#9cdcfe" },
                { ln: "9",  text: "- Only use documents inside this folder.", color: "#d4d4d4" },
                { ln: "10", text: "- Do not infer facts not present in the files.", color: "#d4d4d4" },
                { ln: "11", text: "", color: "" },
                { ln: "12", text: "## Tone", color: "#9cdcfe" },
                { ln: "13", text: "- Plain English. No legal jargon unless quoting.", color: "#d4d4d4" },
              ].map(line => (
                <div key={line.ln} style={{ display: "flex", gap: 16, marginBottom: 2 }}>
                  <span style={{ ...mono, fontSize: 11, color: "#404040", minWidth: 16, textAlign: "right", userSelect: "none" }}>{line.ln}</span>
                  <span style={{ ...mono, fontSize: 11, color: line.color || "transparent" }}>{line.text || "\u00a0"}</span>
                </div>
              ))}
            </div>

          </div>

          {/* Terminal strip */}
          <div style={{ background: "#141414", borderTop: "1px solid #2d2d2d", padding: "10px 20px", display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ ...mono, fontSize: 11, color: "#27c93f" }}>→</span>
            <span style={{ ...mono, fontSize: 11, color: "#666" }}>python run.py</span>
            <span style={{ ...mono, fontSize: 11, color: "#888", marginLeft: 8 }}>✓ Done · 3 documents read · output.md written</span>
          </div>
        </div>

        {/* ── Heading ── */}
        <div style={{ marginBottom: 48 }}>
          <h1 style={{ ...serif, fontSize: "clamp(52px, 8vw, 80px)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-1.5px", marginBottom: 16 }}>
            Praxis.
          </h1>
          <p style={{ ...mono, fontSize: 11, color: "#a8a092", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            A thirty-minute session · Tutto
          </p>
        </div>

        <div style={{ height: 1, background: "#d8d0c5", marginBottom: 48 }} />

        {/* ── Letter body ── */}
        <div style={{ maxWidth: 620 }}>

          {/* Opening */}
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a", marginBottom: 20 }}>
            Praxis comes from the Greek <em>prâxis</em> — action whose purpose is in the action itself. Aristotle separated it from theory and from making. You do not learn it by reading about it. You learn it by watching it run, and then doing it yourself.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a", marginBottom: 40 }}>
            Thirty minutes ago, you watched three things happen in an empty folder, on a live screen. This page names what you actually saw.
          </p>

          <div style={{ height: 1, background: "#d8d0c5", marginBottom: 40 }} />

          {/* Three principles */}
          <div style={{ marginBottom: 36 }}>
            <p style={{ ...mono, fontSize: 10, color: "#d97706", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>What you saw first</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a" }}>
              A folder of realistic documents appeared from a single instruction. No templates. No setup screens. One sentence in plain English, and the folder was populated. The principle behind it is this: <strong>files are not passive storage</strong>. A folder, given the right contents, is an application. It has inputs, logic, and outputs. It just does not look like one until you see it run.
            </p>
          </div>

          <div style={{ marginBottom: 36 }}>
            <p style={{ ...mono, fontSize: 10, color: "#d97706", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>What you saw second</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a" }}>
              A skill file was written that captured house rules in plain English — how an output should be formatted, what counts as a complete answer, what to flag for review. That file is now executable. It runs every time. <strong>Language is the new interface.</strong> You do not configure software by clicking through menus any more. You write what you want, clearly, and the machine follows it.
            </p>
          </div>

          <div style={{ marginBottom: 40 }}>
            <p style={{ ...mono, fontSize: 10, color: "#d97706", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 14 }}>What you saw third</p>
            <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a" }}>
              A short script read the documents, followed the rules, and produced the same output three runs in a row. That is not what people expect from AI. AI is probabilistic — it does not guarantee consistency. But software wrapped around AI is deterministic. <strong>AI is a component, not the whole system.</strong> The folder, the skill file, the script — those are the system. AI does the reading. The logic does the rest.
            </p>
          </div>

          <div style={{ height: 1, background: "#d8d0c5", marginBottom: 40 }} />

          {/* Production scale */}
          <p style={{ ...mono, fontSize: 10, color: "#a8a092", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 20 }}>What is hard at production scale</p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a", marginBottom: 20 }}>
            What you saw takes thirty minutes to demonstrate. Getting it to work reliably across your real documents — mixed formats, inconsistent metadata, files that were never meant to be machine-readable — takes longer. Ingestion is solvable but not trivial. Retrieval quality depends on how your documents are structured. Integration with the systems you already use requires decisions about where data lives and who controls it. Governance is a question most organisations have not answered yet.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.8, color: "#2a2a2a", marginBottom: 48 }}>
            The next step is a two-week diagnostic sprint. We look at your actual documents and your actual workflows, and we tell you exactly what is possible and what it would cost. The sprint is paid. It produces a clear picture, not a slide deck. If we can help you further, we will say so. If we cannot, we will say that too.
          </p>

          {/* CTA */}
          <div style={{
            background: "#1a1a1a",
            borderRadius: 10,
            padding: "36px 40px",
            marginBottom: 56,
          }}>
            <p style={{ ...serif, fontSize: 22, fontWeight: 600, color: "#f6f1ea", marginBottom: 6 }}>Book the diagnostic sprint</p>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "rgba(246,241,234,0.55)", marginBottom: 24 }}>
              Two weeks. Your documents. A clear answer.
            </p>
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#d97706", color: "#fff",
                fontSize: 13, fontWeight: 600,
                padding: "11px 22px", borderRadius: 20,
                textDecoration: "none",
              }}
            >
              Schedule a call <ArrowRight size={13} />
            </a>
          </div>

          {/* Closing line */}
          <p style={{
            ...serif,
            fontSize: 24,
            fontWeight: 600,
            lineHeight: 1.4,
            fontStyle: "italic",
            borderLeft: "3px solid #1a1a1a",
            paddingLeft: 24,
            marginBottom: 64,
          }}>
            The folder was always the application.<br />You just needed to see it run.
          </p>

          {/* Footer */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 24, borderTop: "1px solid #d8d0c5", flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#a8a092" }}>Tutto Products and Services</span>
            <a href="mailto:daniel@tutto.one" style={{ fontSize: 12, color: "#7a7568", textDecoration: "none" }}>daniel@tutto.one</a>
          </div>
        </div>

      </div>
    </div>
  );
}
