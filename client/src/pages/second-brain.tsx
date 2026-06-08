import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

const AMBER = "#d97706";
const DARK = "#1a1a1a";
const BG = "#f6f1ea";
const CARD = "#faf8f5";
const BORDER = "#d8d0c5";
const TEXT = "#3d3d3d";
const MUTED = "#7a7266";

function StepNumber({ n, color = AMBER }: { n: number; color?: string }) {
  return (
    <div style={{
      width: 28, height: 28, borderRadius: "50%", background: color,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
      ...ROBOTO, fontSize: 13, fontWeight: 800, color: "#fff"
    }}>{n}</div>
  );
}

function FileTag({ label }: { label: string }) {
  return (
    <div style={{
      ...INTER, fontSize: 11, color: TEXT, background: "#ede8e1",
      border: `1px solid ${BORDER}`, borderRadius: 6,
      padding: "5px 10px", whiteSpace: "nowrap"
    }}>{label}</div>
  );
}

function CaptureTag({ icon, label }: { icon: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 0" }}>
      <span style={{ fontSize: 15 }}>{icon}</span>
      <span style={{ ...INTER, fontSize: 12, color: TEXT }}>{label}</span>
    </div>
  );
}

export default function SecondBrain() {
  useEffect(() => {
    document.title = "Second Brain - Tutto";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .sb-wrap { padding: 64px 20px 100px; }
        @media (min-width: 600px) { .sb-wrap { padding: 64px 32px 100px; } }
        .sb-three { display: grid; grid-template-columns: 1fr; gap: 16px; }
        @media (min-width: 720px) { .sb-three { grid-template-columns: 1fr 1.4fr 1fr; } }
        .sb-loop { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 560px) { .sb-loop { grid-template-columns: 1fr 1fr; } }
        .sb-steps { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 600px) { .sb-steps { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .sb-steps { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        .sb-capture { display: flex; flex-wrap: wrap; gap: 0; border: 1px solid ${BORDER}; border-radius: 10px; overflow: hidden; background: ${CARD}; }
        .sb-capture-item { flex: 1 1 140px; padding: 14px 16px; border-right: 1px solid ${BORDER}; border-bottom: 1px solid ${BORDER}; }
        .sb-result-checks { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
        @media (min-width: 560px) { .sb-result-checks { grid-template-columns: 1fr 1fr 1fr 1fr; } }
      `}</style>

      <div className="sb-wrap" style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, letterSpacing: "0.14em", marginBottom: 16 }}>
            Second Brain
          </p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.3px" }}>
            A second brain captures knowledge and business processes - even when undocumented.
          </h1>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", maxWidth: 560 }}>
            Think and talk. Your second brain captures the invisible 80% - including how work really gets done.
          </p>
        </div>

        {/* Section 1: The Core System */}
        <div className="sb-three" style={{ marginBottom: 48 }}>

          {/* Think & Talk */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>Think & Talk</p>
            <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 14 }}>Any dictation</p>
            {[
              "Dictate your thinking",
              "Discuss with colleagues",
              "Share screens & artefacts",
              "Meetings & conversations",
              "Ideas, questions, push back",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 6 }} />
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Second Brain (centre) */}
          <div style={{ border: `2px solid ${AMBER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 6 }}>Your Second Brain</p>
            <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 16 }}>Plain-text files</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {["Frameworks & mental models", "Projects & initiatives", "Research & insights", "Writing & content", "Notes & conversations", "Artefacts & data"].map((f) => (
                <FileTag key={f} label={f} />
              ))}
            </div>

            {/* Conversation Loop */}
            <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "16px 16px 12px" }}>
              <p style={{ ...CAPS, fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 12, textAlign: "center" }}>Conversation Loop</p>
              <div className="sb-loop">
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 14px" }}>
                  <p style={{ ...ROBOTO, fontSize: 11, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>AI Reads Full Context</p>
                  <p style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: "rgba(246,241,234,0.55)" }}>Every conversation draws on your entire accumulated knowledge base.</p>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 14px" }}>
                  <p style={{ ...ROBOTO, fontSize: 11, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>AI Writes Back</p>
                  <p style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: "rgba(246,241,234,0.55)" }}>Updates files, connects insights, reconciles contradictions, and weaves new knowledge in unprompted.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compounds Daily */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>Compounds Daily</p>
            <p style={{ ...INTER, fontSize: 12, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>The base grows richer and more connected every day.</p>
            {[
              "Noticing patterns",
              "Surfacing connections",
              "Filling gaps",
              "Proposing better organisation",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#4a7cc7", flexShrink: 0, marginTop: 6 }} />
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Business Process Meta Layer */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "20px 24px", marginBottom: 24 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Meta Layer</p>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800, color: "#f6f1ea", marginBottom: 8 }}>
              Capturing Business Processes
            </h2>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.7, color: "rgba(246,241,234,0.6)", maxWidth: 580 }}>
              As you think and talk about how work gets done, your second brain captures and structures it into business process models - without interrupting your flow.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
            <div className="sb-steps">
              {[
                {
                  n: 1, title: "Observed in Conversation",
                  body: "You describe how work gets done - decisions, handoffs, tools, checks, exceptions, approvals.",
                },
                {
                  n: 2, title: "AI Extracts & Structures",
                  body: "AI identifies process steps, decision points, actors, inputs/outputs, systems used, and rules.",
                },
                {
                  n: 3, title: "Process Log Created",
                  body: "A process model is logged to the process layer with context, artefacts, and supporting evidence.",
                },
                {
                  n: 4, title: "Linked to Knowledge Base",
                  body: "The process connects to relevant knowledge, notes, documents, systems, and decisions.",
                },
              ].map(({ n, title, body }) => (
                <div key={n} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 18px", background: CARD }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <StepNumber n={n} />
                    <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: DARK }}>{title}</p>
                  </div>
                  <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: MUTED }}>{body}</p>
                </div>
              ))}
            </div>

            {/* Process Layer Meta + What Gets Captured */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 16 }}>
              <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 20px", background: CARD }}>
                <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>Process Layer (Meta)</p>
                <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 14 }}>Sits on top of your knowledge base</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                  {["Process maps & flows", "Roles & responsibilities", "Inputs / Outputs", "Policies & rules", "Systems & tools used", "Exceptions & variants", "Version history"].map((item) => (
                    <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                      <span style={{ width: 4, height: 4, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 6 }} />
                      <span style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: TEXT }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* What Gets Captured strip */}
          <div style={{ marginTop: 16, border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>What Gets Captured</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {[
                { icon: "⬛", label: "Steps & sequences" },
                { icon: "◇", label: "Decisions & criteria" },
                { icon: "→", label: "Handoffs & approvals" },
                { icon: "⬜", label: "Systems & tools used" },
                { icon: "☰", label: "Documents & artefacts" },
                { icon: "△", label: "Exceptions & edge cases" },
                { icon: "◷", label: "Timing & triggers" },
              ].map(({ icon, label }) => (
                <div key={label} style={{
                  ...INTER, fontSize: 11, color: TEXT,
                  background: "#ede8e1", border: `1px solid ${BORDER}`,
                  borderRadius: 6, padding: "6px 12px",
                  display: "flex", alignItems: "center", gap: 6
                }}>
                  <span style={{ fontSize: 10, opacity: 0.6 }}>{icon}</span>
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Verify & Evolve */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "20px 24px", marginBottom: 24 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>Living Documentation</p>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800, color: "#f6f1ea" }}>
              Verify & Evolve with the Business
            </h2>
          </div>

          <div className="sb-steps">
            {[
              {
                n: 1, title: "Share with Business Units",
                body: "Share the captured process for review and feedback.",
                color: "#4a7cc7",
              },
              {
                n: 2, title: "Confirm, Clarify, Correct",
                body: "Validate steps, fill gaps, clarify rules and exceptions.",
                color: "#4a7cc7",
              },
              {
                n: 3, title: "Update & Publish Authorised Version",
                body: "Incorporate feedback and publish the verified version.",
                color: "#4a7cc7",
              },
              {
                n: 4, title: "Keep Improving",
                body: "Processes evolve as work evolves. Your second brain keeps them current.",
                color: "#4a7cc7",
              },
            ].map(({ n, title, body, color }) => (
              <div key={n} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 18px", background: CARD }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <StepNumber n={n} color={color} />
                  <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: DARK }}>{title}</p>
                </div>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: MUTED }}>{body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Result callout */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(24px, 4vw, 40px)", display: "grid", gap: 24, gridTemplateColumns: "1fr" }}>
          <div>
            <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 12 }}>Result</p>
            <p style={{ ...ROBOTO, fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 700, color: "#f6f1ea", lineHeight: 1.5 }}>
              Your organisation builds a living map of how work really gets done - captured effortlessly, verified collaboratively, and continuously improved.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              "No manual documentation projects",
              "Always up to date",
              "Institutional knowledge retained",
              "Faster onboarding, fewer errors, better decisions",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <svg width="14" height="14" viewBox="0 0 16 16" style={{ flexShrink: 0, marginTop: 3 }}>
                  <circle cx="8" cy="8" r="7" fill="none" stroke={AMBER} strokeWidth="1.5"/>
                  <path d="M4.5 8l2.5 2.5 4.5-4.5" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                </svg>
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: "rgba(246,241,234,0.75)" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
