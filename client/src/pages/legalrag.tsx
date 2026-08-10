import { useEffect } from "react";
import { usePageTr } from "@/lib/page-fr";
import { LEGALRAG_FR } from "@/lib/fr/legalrag";
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

/* ── Icons ── */

function IngestIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede8e1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M4 4h10l4 4v12H4V4z" stroke={AMBER} strokeWidth="1.5" strokeLinejoin="round"/>
        <polyline points="14,4 14,8 18,8" fill="none" stroke={AMBER} strokeWidth="1.3" strokeLinejoin="round"/>
        <line x1="7" y1="12" x2="15" y2="12" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="7" y1="15" x2="13" y2="15" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function SearchIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede8e1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="10" r="6" stroke={AMBER} strokeWidth="1.5"/>
        <line x1="14.5" y1="14.5" x2="20" y2="20" stroke={AMBER} strokeWidth="2" strokeLinecap="round"/>
        <line x1="7" y1="10" x2="13" y2="10" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="10" y1="7" x2="10" y2="13" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ChatIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede8e1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="4" width="15" height="10" rx="2" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M6 17l-2 3h4" stroke={AMBER} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="6" y1="8" x2="13" y2="8" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="6" y1="11" x2="10" y2="11" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="12" y="10" width="9" height="7" rx="2" stroke={TEXT} strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

function TimelineIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede8e1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <line x1="4" y1="12" x2="20" y2="12" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="7" cy="12" r="2.5" fill={AMBER}/>
        <circle cx="13" cy="12" r="2.5" fill={AMBER}/>
        <circle cx="19" cy="12" r="2.5" stroke={AMBER} strokeWidth="1.3" fill={CARD}/>
        <line x1="7" y1="6" x2="7" y2="9" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="13" y1="6" x2="13" y2="9" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="19" y1="15" x2="19" y2="18" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function OcrIcon() {
  return (
    <div style={{ width: 48, height: 48, borderRadius: 12, background: "#ede8e1", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="2" stroke={TEXT} strokeWidth="1.3"/>
        <rect x="7" y="7" width="10" height="10" rx="1" stroke={AMBER} strokeWidth="1.3"/>
        <line x1="9" y1="10" x2="15" y2="10" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <line x1="9" y1="13" x2="13" y2="13" stroke={TEXT} strokeWidth="1.2" strokeLinecap="round"/>
        <rect x="1" y="1" width="4" height="4" rx="0.5" stroke={AMBER} strokeWidth="1.2"/>
        <rect x="19" y="1" width="4" height="4" rx="0.5" stroke={AMBER} strokeWidth="1.2"/>
        <rect x="1" y="19" width="4" height="4" rx="0.5" stroke={AMBER} strokeWidth="1.2"/>
        <rect x="19" y="19" width="4" height="4" rx="0.5" stroke={AMBER} strokeWidth="1.2"/>
      </svg>
    </div>
  );
}

function LockIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <svg width="20" height="20" viewBox="0 0 22 24" fill="none">
        <rect x="2" y="10" width="18" height="13" rx="2" stroke={AMBER} strokeWidth="1.5"/>
        <path d="M6 10V7a5 5 0 0 1 10 0v3" stroke={AMBER} strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="11" cy="16" r="2" fill={AMBER}/>
        <line x1="11" y1="18" x2="11" y2="20" stroke={AMBER} strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function ScalesIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <line x1="12" y1="3" x2="12" y2="21" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
        <line x1="5" y1="8" x2="19" y2="8" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
        <path d="M5 8 L3 14 Q5 17 7 14 L5 8" stroke={AMBER} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
        <path d="M19 8 L17 14 Q19 17 21 14 L19 8" stroke={AMBER} strokeWidth="1.3" strokeLinejoin="round" fill="none"/>
        <line x1="9" y1="21" x2="15" y2="21" stroke={TEXT} strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    </div>
  );
}

function StackIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M12 3 L22 8 L12 13 L2 8 Z" stroke={AMBER} strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M2 12 L12 17 L22 12" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M2 16 L12 21 L22 16" stroke={TEXT} strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      </svg>
    </div>
  );
}

function EyeIcon() {
  return (
    <div style={{ width: 44, height: 44, borderRadius: 10, background: "#f0ebe4", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path d="M2 12 C4 7 8 4 12 4 C16 4 20 7 22 12 C20 17 16 20 12 20 C8 20 4 17 2 12Z" stroke={AMBER} strokeWidth="1.5" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3.5" stroke={TEXT} strokeWidth="1.3"/>
        <circle cx="12" cy="12" r="1.2" fill={AMBER}/>
      </svg>
    </div>
  );
}

export default function LegalRag() {
  const tr = usePageTr(LEGALRAG_FR);
  useEffect(() => {
    document.title = "LegalRAG - On-Premise AI for Legal";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .lr-wrap { padding: 64px 20px 100px; }
        @media (min-width: 600px) { .lr-wrap { padding: 64px 32px 100px; } }
        .lr-features { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 600px) { .lr-features { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .lr-features { grid-template-columns: repeat(3, 1fr); } }
        .lr-diffs { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 600px) { .lr-diffs { grid-template-columns: 1fr 1fr; } }
        .lr-cols { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 720px) { .lr-cols { grid-template-columns: 1fr 1fr; } }
        .lr-planned { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 600px) { .lr-planned { grid-template-columns: 1fr 1fr; } }
      `}</style>

      <div className="lr-wrap" style={{ maxWidth: 920, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, letterSpacing: "0.14em", marginBottom: 16 }}>{tr("LegalRAG")}</p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.3px" }}>{tr("On-Premise AI Document Intelligence for Legal")}</h1>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", maxWidth: 580 }}>{tr("A self-hosted document intelligence platform built for litigation and legal review. All processing, AI inference, and storage stays on your hardware. No data ever leaves the device.")}</p>
        </div>

        {/* The Problem */}
        <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "28px 28px", background: CARD, marginBottom: 48 }}>
          <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>{tr("The Problem")}</p>
          <p style={{ ...ROBOTO, fontSize: "clamp(15px, 2vw, 20px)", fontWeight: 700, color: DARK, lineHeight: 1.45, marginBottom: 16 }}>{tr("Cloud AI creates unacceptable risk for privileged material. Manual review of large disclosure sets is prohibitively slow.")}</p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: MUTED, maxWidth: 640 }}>{tr("Legal teams handling large-scale disclosure face a fundamental tension: cloud AI platforms offer powerful document analysis, but sending privileged case material to external servers creates unacceptable risks under Legal Professional Privilege, GDPR, and professional conduct rules. LegalRAG eliminates this tension. It brings the AI to the data, not the data to the AI.")}</p>
        </div>

        {/* What it does */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "18px 24px", marginBottom: 20 }}>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(18px, 2.6vw, 24px)", fontWeight: 800, color: "#f6f1ea", margin: 0 }}>{tr("What it does")}</h2>
          </div>
          <div className="lr-features">
            {([
              {
                Icon: IngestIcon,
                title: "Document Ingestion at Scale",
                body: "Processes entire disclosure sets — hundreds of thousands of files. PDF, DOCX, XLSX, MSG, EML, PPTX, HTML, CSV, XML, TIF, JPG and more. Each document is extracted, chunked, and embedded for semantic search. A checkpoint system allows ingestion to be paused and resumed at any point.",
              },
              {
                Icon: SearchIcon,
                title: "Semantic Search",
                body: "Natural language search across the entire corpus using vector similarity. Retrieve the most relevant passages with citations to specific source documents and page numbers. Filter by disclosure side, document type, date range, or custom categories.",
              },
              {
                Icon: ChatIcon,
                title: "Conversational Q&A",
                body: "A chat interface grounded in the document corpus. Questions are answered with citations to source material — the AI synthesises answers from retrieved passages rather than generating from its own knowledge. Every answer is traceable to the original documents.",
              },
              {
                Icon: TimelineIcon,
                title: "Interactive Timeline",
                body: "A collapsible chronological view of case events extracted from document metadata — email dates, creation dates, contractual deadlines. Drill down from year to month to individual events. Filter by event type and disclosure side.",
              },
              {
                Icon: OcrIcon,
                title: "OCR for Scanned Documents",
                body: "Optical character recognition for scanned PDFs and image files, with intelligent DPI management and low-content detection. Documents that are redacted or contain minimal text are automatically tagged rather than lost.",
              },
            ] as const).map(({ Icon, title, body }) => (
              <div key={title} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
                <Icon />
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10 }}>{tr(title)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: MUTED }}>{tr(body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* What makes it different */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "18px 24px", marginBottom: 20 }}>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(18px, 2.6vw, 24px)", fontWeight: 800, color: "#f6f1ea", margin: 0 }}>{tr("What makes it different")}</h2>
          </div>
          <div className="lr-diffs">
            {([
              {
                Icon: LockIcon,
                title: "Complete Privacy by Design",
                body: "Every component runs on a single device. OCR, text extraction, AI inference, vector search, and storage — all on-premise. No cloud APIs, no external model providers, no data transmission. Satisfies Legal Professional Privilege requirements by architectural design, not policy promise.",
              },
              {
                Icon: ScalesIcon,
                title: "Built for Legal Workflows",
                body: "The system understands disclosure structure — it tracks which side produced each document, preserves document reference IDs from eDiscovery platforms, and maintains the chain of custody from production to search result.",
              },
              {
                Icon: StackIcon,
                title: "Scale Without Compromise",
                body: "Handles 150,000+ documents with millions of searchable chunks. Checkpoint-based processing means ingestion can run overnight and survive interruptions. Resource monitoring prevents the system from overloading the hardware.",
              },
              {
                Icon: EyeIcon,
                title: "Transparency Over Trust",
                body: "Every search result cites its source. Every timeline event links to its document. The AI assists the lawyer's review — it does not replace the lawyer's judgment.",
              },
            ] as const).map(({ Icon, title, body }) => (
              <div key={title} style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
                <Icon />
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: DARK, marginBottom: 10 }}>{tr(title)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: MUTED }}>{tr(body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Planned features */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ borderRadius: 10, background: "#2a2a2a", padding: "18px 24px", marginBottom: 20 }}>
            <h2 style={{ ...ROBOTO, fontSize: "clamp(18px, 2.6vw, 24px)", fontWeight: 800, color: "#f6f1ea", margin: 0 }}>{tr("Planned features")}</h2>
          </div>
          <div className="lr-planned">
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
              <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 10 }}>{tr("Custom Taxonomies")}</p>
              <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: MUTED }}>{tr("A taxonomy builder that allows the legal team to define case-specific classification frameworks — allegations, issues, parties, transaction types. The AI classifies every document against the lawyer's own framework, creating bespoke searchable categories that reflect how the case is actually structured.")}</p>
            </div>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "22px 20px", background: CARD }}>
              <p style={{ ...CAPS, fontSize: 9, color: BLUE, marginBottom: 10 }}>{tr("Knowledge Map")}</p>
              <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: MUTED }}>{tr("An interactive visual graph showing connections between documents — shared parties, overlapping dates, cross-references, related transactions. Documents as nodes, relationships as edges, rendered as a navigable hub-and-spoke visualisation. Surfaces patterns across large document sets that linear review would miss.")}</p>
            </div>
          </div>
        </div>

        {/* Stack + Who it's for */}
        <div className="lr-cols" style={{ marginBottom: 48 }}>

          {/* Tech stack */}
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "24px 22px", background: CARD }}>
            <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 16 }}>{tr("Technology Stack")}</p>
            {([
              { label: "Hardware", value: "NVIDIA DGX Spark — GB10 Superchip, 128GB unified memory, NVMe storage" },
              { label: "AI Models", value: "Open-weight models via Ollama — reasoning + embeddings, fully local" },
              { label: "Database", value: "PostgreSQL with pgvector — hybrid text and vector search" },
              { label: "Security", value: "ClamAV, AppArmor, UFW, Fail2ban, AIDE, auditd — hardened Linux with daily scanning" },
              { label: "Access", value: "Tailscale peer-to-peer VPN — secure remote access, no port forwarding" },
            ]).map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${BORDER}` }}>
                <p style={{ ...CAPS, fontSize: 8, color: AMBER, marginBottom: 4 }}>{tr(label)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{value}</p>
              </div>
            ))}
          </div>

          {/* Who it's for + deployment */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "24px 22px", background: CARD }}>
              <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>{tr("Who it's for")}</p>
              {[
                "Barristers and chambers handling document-heavy commercial litigation",
                "Law firms with privacy-sensitive practices — fraud, family, regulatory",
                "Any legal team that needs AI-powered document review but cannot use cloud platforms",
                "Mid-market firms (10-100 lawyers) priced out of enterprise platforms like Harvey",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ ...INTER, fontSize: 12, lineHeight: 1.65, color: TEXT }}>{tr(item)}</span>
                </div>
              ))}
            </div>

            <div style={{ border: `1px solid ${BORDER}`, borderRadius: 10, padding: "24px 22px", background: CARD }}>
              <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>{tr("Deployment Model")}</p>
              <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: TEXT }}>{tr("Each client receives their own DGX Spark unit, configured and deployed at their premises. The system is self-contained — no ongoing cloud dependency. Setup, ingestion, and training are handled as a managed service.")}</p>
            </div>
          </div>
        </div>

        {/* Footer callout */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(24px, 4vw, 40px)" }}>
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 12 }}>{tr("Built by Humanity³")}</p>
          <p style={{ ...ROBOTO, fontSize: "clamp(14px, 2vw, 18px)", fontWeight: 700, color: "#f6f1ea", lineHeight: 1.5, marginBottom: 16 }}>{tr("A division of Tutto Products and Services")}</p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "rgba(246,241,234,0.6)", maxWidth: 520 }}>{tr("LegalRAG is a specific answer to a specific problem. The underlying principle applies broadly: there are domains where cloud AI creates risks that on-premise deployment eliminates. The hardware to run capable AI models locally exists now — and is becoming more affordable. The question is whether organisations in sensitive sectors are willing to treat deployment architecture as a first-order design question, not an afterthought.")}</p>
        </div>

      </div>
    </div>
  );
}
