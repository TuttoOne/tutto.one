import { useEffect } from "react";
import { usePageTr } from "@/lib/page-fr";
import { SECOND_BRAIN_FR } from "@/lib/fr/second-brain";
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
const BLUE = "#4a7cc7";

/* ── Illustration components ── */

function PersonSpeakIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ marginBottom: 14 }}>
      <circle cx="20" cy="16" r="7" stroke={TEXT} strokeWidth="1.5"/>
      <path d="M7 42c0-7.18 5.82-13 13-13s13 5.82 13 13" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="32" y="8" width="16" height="11" rx="2.5" stroke={AMBER} strokeWidth="1.5"/>
      <path d="M35 24l-1 3h-2" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <line x1="35" y1="12" x2="44" y2="12" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="35" y1="15" x2="41" y2="15" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function GrowthChartIcon() {
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" fill="none" style={{ marginBottom: 14 }}>
      <line x1="10" y1="42" x2="10" y2="10" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="10" y1="42" x2="44" y2="42" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="12,38 20,28 28,32 38,14 44,10" stroke={BLUE} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      <circle cx="12" cy="38" r="2.5" fill={BLUE}/>
      <circle cx="20" cy="28" r="2.5" fill={BLUE}/>
      <circle cx="28" cy="32" r="2.5" fill={BLUE}/>
      <circle cx="38" cy="14" r="2.5" fill={BLUE}/>
    </svg>
  );
}

function LoopArrowsIcon() {
  return (
    <div style={{ display: "flex", justifyContent: "center", margin: "8px 0 12px" }}>
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
        <path d="M24 8 A16 16 0 0 1 40 24" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M24 40 A16 16 0 0 1 8 24" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round"/>
        <polyline points="36,18 40,24 34,26" fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="12,30 8,24 14,22" fill="none" stroke={AMBER} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

function SpeechBubbleStepIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <rect x="4" y="5" width="24" height="17" rx="3" stroke={AMBER} strokeWidth="1.5"/>
      <line x1="9" y1="11" x2="22" y2="11" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="9" y1="15" x2="18" y2="15" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M10 22l-4 5h6" stroke={AMBER} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="26" r="6" stroke={TEXT} strokeWidth="1.2"/>
      <line x1="28" y1="23" x2="28" y2="27" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <circle cx="28" cy="29" r="0.8" fill={TEXT}/>
    </svg>
  );
}

function CPUStepIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <rect x="9" y="9" width="18" height="18" rx="2" stroke={AMBER} strokeWidth="1.5"/>
      <rect x="13" y="13" width="10" height="10" rx="1" stroke={AMBER} strokeWidth="1.2"/>
      <line x1="13" y1="4" x2="13" y2="9" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="18" y1="4" x2="18" y2="9" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="23" y1="4" x2="23" y2="9" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="13" y1="27" x2="13" y2="32" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="18" y1="27" x2="18" y2="32" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="23" y1="27" x2="23" y2="32" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="13" x2="9" y2="13" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="18" x2="9" y2="18" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="4" y1="23" x2="9" y2="23" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="27" y1="13" x2="32" y2="13" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="27" y1="18" x2="32" y2="18" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="27" y1="23" x2="32" y2="23" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function FlowchartStepIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <rect x="5" y="4" width="10" height="7" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
      <rect x="5" y="20" width="10" height="7" rx="1.5" stroke={AMBER} strokeWidth="1.5"/>
      <polygon points="26,4 36,10.5 26,17" stroke={AMBER} strokeWidth="1.5" strokeLinejoin="round" fill="none"/>
      <rect x="20" y="22" width="13" height="8" rx="1.5" stroke={TEXT} strokeWidth="1.2"/>
      <line x1="10" y1="11" x2="10" y2="20" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <polyline points="10,18 10,20 12,20" fill="none" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LinkStepIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <path d="M14 22l-2 2a5 5 0 0 1-7.07-7.07l5-5A5 5 0 0 1 17 13.07" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M22 14l2-2a5 5 0 0 1 7.07 7.07l-5 5A5 5 0 0 1 19 22.93" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="14" y1="22" x2="22" y2="14" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}

function SharePeopleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <circle cx="10" cy="12" r="5" stroke={BLUE} strokeWidth="1.5"/>
      <path d="M2 28c0-4.42 3.58-8 8-8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round"/>
      <circle cx="26" cy="12" r="5" stroke={BLUE} strokeWidth="1.5"/>
      <path d="M26 20c4.42 0 8 3.58 8 8" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="15" y1="18" x2="21" y2="18" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <polyline points="19,15 22,18 19,21" fill="none" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ChecklistIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <rect x="6" y="5" width="24" height="26" rx="2" stroke={BLUE} strokeWidth="1.5"/>
      <line x1="16" y1="13" x2="25" y2="13" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="19" x2="25" y2="19" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="16" y1="25" x2="22" y2="25" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <polyline points="9,12 11,14 15,10" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="9,18 11,20 15,16" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="11" cy="25" r="2" stroke={MUTED} strokeWidth="1.2"/>
    </svg>
  );
}

function PublishIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <rect x="6" y="14" width="24" height="18" rx="2" stroke={BLUE} strokeWidth="1.5"/>
      <line x1="18" y1="14" x2="18" y2="4" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="12,9 18,4 24,9" fill="none" stroke={BLUE} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <polyline points="11,22 14,25 22,18" fill="none" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function TrendUpIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" style={{ marginBottom: 12 }}>
      <line x1="5" y1="31" x2="5" y2="8" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round"/>
      <line x1="5" y1="31" x2="32" y2="31" stroke={TEXT} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="24" width="5" height="7" rx="1" fill={BLUE} opacity="0.3" stroke={BLUE} strokeWidth="1.2"/>
      <rect x="14" y="18" width="5" height="13" rx="1" fill={BLUE} opacity="0.5" stroke={BLUE} strokeWidth="1.2"/>
      <rect x="21" y="12" width="5" height="19" rx="1" fill={BLUE} opacity="0.7" stroke={BLUE} strokeWidth="1.2"/>
      <rect x="28" y="6" width="4" height="25" rx="1" fill={BLUE} stroke={BLUE} strokeWidth="1.2"/>
    </svg>
  );
}

/* ── Capture icon SVGs ── */
function StepsIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <line x1="2" y1="5" x2="18" y2="5" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="2" y1="10" x2="18" y2="10" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="2" y1="15" x2="14" y2="15" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function DiamondIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <polygon points="10,2 18,10 10,18 2,10" stroke={TEXT} strokeWidth="1.3" strokeLinejoin="round"/>
    </svg>
  );
}
function HandoffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 18" fill="none">
      <circle cx="5" cy="5" r="3.5" stroke={TEXT} strokeWidth="1.2"/>
      <circle cx="17" cy="5" r="3.5" stroke={TEXT} strokeWidth="1.2"/>
      <path d="M1 17c0-2.76 1.79-5 4-5" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M21 17c0-2.76-1.79-5-4-5" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="8" y1="10" x2="14" y2="10" stroke={AMBER} strokeWidth="1.3" strokeLinecap="round"/>
      <polyline points="12,7.5 14.5,10 12,12.5" fill="none" stroke={AMBER} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}
function MonitorIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 18" fill="none">
      <rect x="1" y="1" width="20" height="13" rx="2" stroke={TEXT} strokeWidth="1.3"/>
      <line x1="8" y1="17" x2="14" y2="17" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
      <line x1="11" y1="14" x2="11" y2="17" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
    </svg>
  );
}
function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 22" fill="none">
      <path d="M3 1h8l4 4v16H3V1z" stroke={TEXT} strokeWidth="1.3" strokeLinejoin="round"/>
      <polyline points="11,1 11,5 15,5" fill="none" stroke={TEXT} strokeWidth="1.2" strokeLinejoin="round"/>
      <line x1="6" y1="10" x2="12" y2="10" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="6" y1="14" x2="10" y2="14" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
    </svg>
  );
}
function WarningIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 22 20" fill="none">
      <polygon points="11,1 21,19 1,19" stroke={TEXT} strokeWidth="1.3" strokeLinejoin="round"/>
      <line x1="11" y1="8" x2="11" y2="13" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="11" cy="16" r="0.9" fill={TEXT}/>
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8" stroke={TEXT} strokeWidth="1.3"/>
      <line x1="10" y1="10" x2="10" y2="5" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
      <line x1="10" y1="10" x2="14" y2="13" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
}

function FileTag({ label }: { label: string }) {
  const tr = usePageTr(SECOND_BRAIN_FR);
  return (
    <div style={{
      ...INTER, fontSize: 11, color: TEXT, background: "#ede8e1",
      border: `1px solid ${BORDER}`, borderRadius: 6,
      padding: "5px 10px"
    }}>{tr(label)}</div>
  );
}

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

export default function SecondBrain() {
  const tr = usePageTr(SECOND_BRAIN_FR);
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
        @media (min-width: 480px) { .sb-loop { grid-template-columns: 1fr auto 1fr; align-items: center; } }
        .sb-steps { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 600px) { .sb-steps { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .sb-steps { grid-template-columns: 1fr 1fr 1fr 1fr; } }
        .sb-arrow { display: none; }
        @media (min-width: 900px) { .sb-arrow { display: flex; align-items: center; justify-content: center; color: #b0a898; font-size: 18px; } }
        .sb-steps-wrap { position: relative; }
      `}</style>

      <div className="sb-wrap" style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, letterSpacing: "0.14em", marginBottom: 16 }}>{tr("Second Brain")}</p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.3px" }}>{tr("A second brain captures knowledge and business processes - even when undocumented.")}</h1>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", maxWidth: 560 }}>{tr("Think and talk. Your second brain captures the invisible 80% - including how work really gets done.")}</p>
        </div>

        {/* Section 1: The Core System */}
        <div className="sb-three" style={{ marginBottom: 48 }}>

          {/* Think & Talk */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <PersonSpeakIcon />
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 8 }}>{tr("Think & Talk")}</p>
            <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 14 }}>{tr("Any dictation")}</p>
            {[
              "Dictate your thinking",
              "Discuss with colleagues",
              "Share screens & artefacts",
              "Meetings & conversations",
              "Ideas, questions, push back",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 6 }} />
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{tr(item)}</span>
              </div>
            ))}
          </div>

          {/* Second Brain (centre) */}
          <div style={{ border: `2px solid ${AMBER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 6 }}>{tr("Your Second Brain")}</p>
            <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 16 }}>{tr("Plain-text files")}</p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {["Frameworks & mental models", "Projects & initiatives", "Research & insights", "Writing & content", "Notes & conversations", "Artefacts & data"].map((f) => (
                <FileTag key={f} label={tr(f)} />
              ))}
            </div>

            {/* Conversation Loop */}
            <div style={{ background: "#1a1a1a", borderRadius: 8, padding: "16px 16px 14px" }}>
              <p style={{ ...CAPS, fontSize: 8, color: "rgba(255,255,255,0.4)", marginBottom: 4, textAlign: "center" }}>{tr("Conversation Loop")}</p>
              <LoopArrowsIcon />
              <div className="sb-loop">
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 14px" }}>
                  <p style={{ ...ROBOTO, fontSize: 11, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("AI Reads Full Context")}</p>
                  <p style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: "rgba(246,241,234,0.55)" }}>{tr("Every conversation draws on your entire accumulated knowledge base.")}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <line x1="2" y1="7" x2="12" y2="7" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "12px 14px" }}>
                  <p style={{ ...ROBOTO, fontSize: 11, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("AI Writes Back")}</p>
                  <p style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: "rgba(246,241,234,0.55)" }}>{tr("Updates files, connects insights, reconciles contradictions, and weaves new knowledge in unprompted.")}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Compounds Daily */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
            <GrowthChartIcon />
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 8 }}>{tr("Compounds Daily")}</p>
            <p style={{ ...INTER, fontSize: 12, color: MUTED, lineHeight: 1.7, marginBottom: 16 }}>{tr("The base grows richer and more connected every day.")}</p>
            {[
              "Noticing patterns",
              "Surfacing connections",
              "Filling gaps",
              "Proposing better organisation",
            ].map((item) => (
              <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: BLUE, flexShrink: 0, marginTop: 6 }} />
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{tr(item)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Business Process Meta Layer */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "20px 24px", marginBottom: 24 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{tr("Meta Layer")}</p>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800, color: "#f6f1ea", marginBottom: 8 }}>{tr("Capturing Business Processes")}</h2>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.7, color: "rgba(246,241,234,0.6)", maxWidth: 580 }}>{tr("As you think and talk about how work gets done, your second brain captures and structures it into business process models - without interrupting your flow.")}</p>
          </div>

          {/* 4-step flow with arrow connectors on desktop */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            <div className="sb-steps">
              {([
                { n: 1, Icon: SpeechBubbleStepIcon, title: "Observed in Conversation",
                  body: "You describe how work gets done - decisions, handoffs, tools, checks, exceptions, approvals." },
                { n: 2, Icon: CPUStepIcon, title: "AI Extracts & Structures",
                  body: "AI identifies process steps, decision points, actors, inputs/outputs, systems used, and rules." },
                { n: 3, Icon: FlowchartStepIcon, title: "Process Log Created",
                  body: "A process model is logged to the process layer with context, artefacts, and supporting evidence." },
                { n: 4, Icon: LinkStepIcon, title: "Linked to Knowledge Base",
                  body: "The process connects to relevant knowledge, notes, documents, systems, and decisions." },
              ] as const).map(({ n, Icon, title, body }) => (
                <div key={n} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 18px", background: CARD, position: "relative" }}>
                  <Icon />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <StepNumber n={n} />
                    <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: DARK }}>{tr(title)}</p>
                  </div>
                  <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: MUTED }}>{tr(body)}</p>
                  {n < 4 && (
                    <div className="sb-arrow" style={{
                      position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)",
                      zIndex: 2, width: 24, height: 24,
                      display: "flex", alignItems: "center", justifyContent: "center"
                    }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <line x1="2" y1="8" x2="12" y2="8" stroke={BORDER} strokeWidth="1.5" strokeLinecap="round"/>
                        <polyline points="9,5 12,8 9,11" fill="none" stroke={BORDER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Process Layer Meta */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 20px", background: CARD, marginBottom: 16 }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 6 }}>{tr("Process Layer (Meta)")}</p>
            <p style={{ ...INTER, fontSize: 11, color: MUTED, marginBottom: 14 }}>{tr("Sits on top of your knowledge base")}</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 8 }}>
              {["Process maps & flows", "Roles & responsibilities", "Inputs / Outputs", "Policies & rules", "Systems & tools used", "Exceptions & variants", "Version history"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                  <span style={{ width: 4, height: 4, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 6 }} />
                  <span style={{ ...INTER, fontSize: 11, lineHeight: 1.6, color: TEXT }}>{tr(item)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* What Gets Captured strip */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "16px 20px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>{tr("What Gets Captured")}</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {([
                { Icon: StepsIcon, label: "Steps & sequences" },
                { Icon: DiamondIcon, label: "Decisions & criteria" },
                { Icon: HandoffIcon, label: "Handoffs & approvals" },
                { Icon: MonitorIcon, label: "Systems & tools used" },
                { Icon: DocIcon, label: "Documents & artefacts" },
                { Icon: WarningIcon, label: "Exceptions & edge cases" },
                { Icon: ClockIcon, label: "Timing & triggers" },
              ] as const).map(({ Icon, label }) => (
                <div key={label} style={{
                  ...INTER, fontSize: 11, color: TEXT,
                  background: "#ede8e1", border: `1px solid ${BORDER}`,
                  borderRadius: 6, padding: "6px 12px",
                  display: "flex", alignItems: "center", gap: 7
                }}>
                  <Icon />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Verify & Evolve */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "20px 24px", marginBottom: 24 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.4)", marginBottom: 8 }}>{tr("Living Documentation")}</p>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(16px, 2.5vw, 22px)", fontWeight: 800, color: "#f6f1ea" }}>{tr("Verify & Evolve with the Business")}</h2>
          </div>

          <div className="sb-steps">
            {([
              { n: 1, Icon: SharePeopleIcon, title: "Share with Business Units",
                body: "Share the captured process for review and feedback." },
              { n: 2, Icon: ChecklistIcon, title: "Confirm, Clarify, Correct",
                body: "Validate steps, fill gaps, clarify rules and exceptions." },
              { n: 3, Icon: PublishIcon, title: "Update & Publish Authorised Version",
                body: "Incorporate feedback and publish the verified version." },
              { n: 4, Icon: TrendUpIcon, title: "Keep Improving",
                body: "Processes evolve as work evolves. Your second brain keeps them current." },
            ] as const).map(({ n, Icon, title, body }) => (
              <div key={n} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "20px 18px", background: CARD, position: "relative" }}>
                <Icon />
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <StepNumber n={n} color={BLUE} />
                  <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: DARK }}>{tr(title)}</p>
                </div>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: MUTED }}>{tr(body)}</p>
                {n < 4 && (
                  <div className="sb-arrow" style={{
                    position: "absolute", right: -18, top: "50%", transform: "translateY(-50%)",
                    zIndex: 2, width: 24, height: 24,
                    display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <line x1="2" y1="8" x2="12" y2="8" stroke={BORDER} strokeWidth="1.5" strokeLinecap="round"/>
                      <polyline points="9,5 12,8 9,11" fill="none" stroke={BORDER} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Result callout */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(24px, 4vw, 40px)", display: "grid", gap: 24, gridTemplateColumns: "1fr" }}>
          <div>
            <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 12 }}>{tr("Result")}</p>
            <p style={{ ...ROBOTO, fontSize: "clamp(15px, 2vw, 19px)", fontWeight: 700, color: "#f6f1ea", lineHeight: 1.5 }}>{tr("Your organisation builds a living map of how work really gets done - captured effortlessly, verified collaboratively, and continuously improved.")}</p>
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
                <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: "rgba(246,241,234,0.75)" }}>{tr(item)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
