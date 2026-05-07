import { useEffect } from "react";
import { ArrowRight } from "lucide-react";

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis — Tutto";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{
      background: "#f6f1ea",
      minHeight: "100vh",
      fontFamily: "'Inter', -apple-system, sans-serif",
      color: "#1a1a1a",
    }}>

      {/* Page */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "80px 40px 100px" }}>

        {/* Masthead */}
        <div style={{ marginBottom: 64, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: 20, fontWeight: 600 }}>Tutto</span>
          <span style={{ fontSize: 12, color: "#a8a092", letterSpacing: "0.04em" }}>daniel@tutto.one</span>
        </div>

        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.12em", textTransform: "uppercase", color: "#a8a092", marginBottom: 16 }}>
            Praxis — a thirty-minute session
          </p>
          <h1 style={{
            fontFamily: "'Source Serif 4', serif",
            fontSize: "clamp(36px, 6vw, 56px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.5px",
            marginBottom: 0,
          }}>
            What you just saw,<br />and why it matters.
          </h1>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#d8d0c5", marginBottom: 48 }} />

        {/* Opening — etymology */}
        <div style={{ marginBottom: 40 }}>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a" }}>
            Praxis comes from the Greek <em>prâxis</em> — action whose purpose is in the action itself. Aristotle separated it from theory and from making. The point is not the output. The point is that doing it changes how you see.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a", marginTop: 20 }}>
            Thirty minutes ago, you watched something get built from scratch, in an empty folder, on a live screen. This page is the leave-behind. It names what you actually saw.
          </p>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#d8d0c5", marginBottom: 48 }} />

        {/* Middle section — three principles */}
        <div style={{ marginBottom: 48 }}>

          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", marginBottom: 12 }}>
              What you saw first
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a" }}>
              A folder of realistic documents appeared from a single instruction. No templates. No configuration screens. One sentence, in plain English, and the folder was populated. The principle behind it: <strong>files are not passive storage.</strong> A folder, given the right contents, is an application. It has inputs, logic, and outputs. It just doesn't look like one yet.
            </p>
          </div>

          <div style={{ marginBottom: 36 }}>
            <p style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", marginBottom: 12 }}>
              What you saw second
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a" }}>
              A short file was written — a skill file — that captured your firm's house rules in plain English. Who reviews what. How a decision gets formatted. What counts as a complete output. That file is now executable. It runs every time. The principle: <strong>language is the new interface.</strong> You do not configure software by clicking through menus any more. You write what you want, clearly, and the machine follows it.
            </p>
          </div>

          <div style={{ marginBottom: 0 }}>
            <p style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "#d97706", marginBottom: 12 }}>
              What you saw third
            </p>
            <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a" }}>
              A script read the documents, followed the rules, and produced the same answer three runs in a row. That is not how people describe AI. AI is probabilistic — it does not guarantee consistency. But software wrapped around AI is deterministic. <strong>AI is a component, not the whole system.</strong> The folder, the skill file, the script — those are the system. AI does the reading. The logic does the rest.
            </p>
          </div>

        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#d8d0c5", marginBottom: 48 }} />

        {/* Closing — what's hard at scale */}
        <div style={{ marginBottom: 48 }}>
          <p style={{ fontSize: 11, fontFamily: "monospace", letterSpacing: "0.1em", textTransform: "uppercase", color: "#a8a092", marginBottom: 20 }}>
            What is hard at production scale
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a", marginBottom: 20 }}>
            What you saw takes thirty minutes to demonstrate. Getting it to work reliably across your real documents — mixed formats, inconsistent metadata, files that were never meant to be machine-readable — takes longer. Ingestion is solvable but not trivial. Retrieval quality depends on how your documents are structured and how your questions are framed. Integration with the systems you already use requires decisions about where data lives and who controls it. Governance — who can ask what, and what gets logged — is a question most organisations have not answered yet.
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.75, color: "#2a2a2a" }}>
            The next step is a two-week diagnostic sprint. We look at your actual documents, your actual workflows, and we tell you exactly what is possible and what it would cost. The sprint is paid. It produces a clear picture, not a slide deck. If we can help you further, we will say so. If we cannot, we will say that too.
          </p>
        </div>

        {/* CTA */}
        <div style={{
          background: "#1a1a1a",
          borderRadius: 12,
          padding: "36px 40px",
          marginBottom: 56,
        }}>
          <p style={{ fontFamily: "'Source Serif 4', serif", fontSize: 22, fontWeight: 600, color: "#f6f1ea", marginBottom: 8 }}>
            Book the diagnostic sprint
          </p>
          <p style={{ fontSize: 14, color: "rgba(246,241,234,0.6)", marginBottom: 24, lineHeight: 1.6 }}>
            Two weeks. Your documents. A clear answer.
          </p>
          <a
            href="https://cal.com/tuttoone/15min"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: "#d97706", color: "#fff",
              fontSize: 14, fontWeight: 600,
              padding: "12px 24px", borderRadius: 24,
              textDecoration: "none",
            }}
          >
            Schedule a call <ArrowRight size={14} />
          </a>
        </div>

        {/* Closing line */}
        <p style={{
          fontFamily: "'Source Serif 4', serif",
          fontSize: 22,
          fontWeight: 600,
          lineHeight: 1.4,
          color: "#1a1a1a",
          fontStyle: "italic",
          borderLeft: "3px solid #d97706",
          paddingLeft: 24,
          marginBottom: 56,
        }}>
          The folder was always the application. You just needed to see it run.
        </p>

        {/* Footer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 24, borderTop: "1px solid #d8d0c5" }}>
          <span style={{ fontSize: 13, color: "#a8a092" }}>Tutto Products and Services</span>
          <a href="mailto:daniel@tutto.one" style={{ fontSize: 13, color: "#7a7568", textDecoration: "none" }}>daniel@tutto.one</a>
        </div>

      </div>
    </div>
  );
}
