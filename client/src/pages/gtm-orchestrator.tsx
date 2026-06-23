import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = {
  fontFamily: "'Roboto', -apple-system, sans-serif",
};
const INTER: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, sans-serif",
};
const CAPS: React.CSSProperties = {
  ...{ fontFamily: "'Inter', -apple-system, sans-serif" },
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const AMBER = "#d97706";
const DARK = "#1a1a1a";
const BG = "#f6f1ea";
const CARD = "#faf8f5";
const BORDER = "#d8d0c5";
const TEXT = "#3d3d3d";
const MUTED = "#7a7266";
const GREEN = "#4a9c6d";

/* ── Icons ── */

function ResearchIcon() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#ede8e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="10" cy="9" r="5.5" stroke={AMBER} strokeWidth="1.5" />
        <line
          x1="14"
          y1="13.5"
          x2="20"
          y2="19.5"
          stroke={AMBER}
          strokeWidth="2"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="9"
          x2="13"
          y2="9"
          stroke={TEXT}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="10"
          y1="6"
          x2="10"
          y2="12"
          stroke={TEXT}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function WriteIcon() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#ede8e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20h4l10-10-4-4L4 16v4z"
          stroke={AMBER}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M14 6l4 4"
          stroke={AMBER}
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <path
          d="M16 4l2 2"
          stroke={AMBER}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <line
          x1="7"
          y1="14"
          x2="10"
          y2="17"
          stroke={TEXT}
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function SendIcon() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#ede8e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M3 12L21 4l-4 17-6-7-8-2z"
          stroke={AMBER}
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <line
          x1="14"
          y1="10"
          x2="11"
          y2="14"
          stroke={TEXT}
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function IntegrateIcon() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#ede8e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="4"
          width="7"
          height="5"
          rx="1.5"
          stroke={AMBER}
          strokeWidth="1.4"
        />
        <rect
          x="15"
          y="4"
          width="7"
          height="5"
          rx="1.5"
          stroke={TEXT}
          strokeWidth="1.4"
        />
        <rect
          x="8.5"
          y="15"
          width="7"
          height="5"
          rx="1.5"
          stroke={TEXT}
          strokeWidth="1.4"
        />
        <line
          x1="5.5"
          y1="9"
          x2="5.5"
          y2="18"
          stroke={TEXT}
          strokeWidth="1.1"
          strokeDasharray="2 1.5"
        />
        <line
          x1="18.5"
          y1="9"
          x2="18.5"
          y2="18"
          stroke={TEXT}
          strokeWidth="1.1"
          strokeDasharray="2 1.5"
        />
        <line
          x1="5.5"
          y1="17.5"
          x2="9"
          y2="17.5"
          stroke={TEXT}
          strokeWidth="1.1"
        />
        <line
          x1="15"
          y1="17.5"
          x2="18.5"
          y2="17.5"
          stroke={TEXT}
          strokeWidth="1.1"
        />
      </svg>
    </div>
  );
}

function PipelineIcon() {
  return (
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: 12,
        background: "#ede8e1",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="2.5" fill={AMBER} />
        <circle cx="12" cy="12" r="2.5" stroke={AMBER} strokeWidth="1.3" />
        <circle cx="19" cy="12" r="2.5" stroke={TEXT} strokeWidth="1.3" />
        <line
          x1="7.5"
          y1="12"
          x2="9.5"
          y2="12"
          stroke={TEXT}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <line
          x1="14.5"
          y1="12"
          x2="16.5"
          y2="12"
          stroke={TEXT}
          strokeWidth="1.3"
          strokeLinecap="round"
        />
        <path
          d="M5 9 L5 7 L19 7 L19 9"
          stroke={TEXT}
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

const stats = [
  { value: "6,675", label: "Prospects researched & profiled" },
  { value: "9", label: "Countries covered (NL, SE, FI, DK, NO, Baltics)" },
  { value: "670", label: "Personalised emails drafted" },
  { value: "482", label: "Emails sent through the pipeline" },
  { value: "130", label: "Active multi-step campaign enrolments" },
  { value: "45", label: "Deep-research dossiers generated" },
  { value: "469", label: "Accounts under licence management" },
  {
    value: "3",
    label: "Custom integrations built (HubSpot, Apollo, Licence portal)",
  },
  { value: "~28,500", label: "Lines of code — full-stack Python + React" },
];

export default function GtmOrchestrator() {
  useEffect(() => {
    document.title = "GTM Orchestrator - Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .gtm-wrap { padding: 64px 20px 100px; }
        @media (min-width: 600px) { .gtm-wrap { padding: 64px 32px 100px; } }
        .gtm-features { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 600px) { .gtm-features { grid-template-columns: 1fr 1fr; } }
        @media (min-width: 900px) { .gtm-features { grid-template-columns: repeat(3, 1fr); } }
        .gtm-stats { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
        @media (min-width: 600px) { .gtm-stats { grid-template-columns: repeat(3, 1fr); } }
        .gtm-diffs { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 720px) { .gtm-diffs { grid-template-columns: repeat(3, 1fr); } }
        .gtm-cols { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media (min-width: 720px) { .gtm-cols { grid-template-columns: 1fr 1fr; } }
        .gtm-flows { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 600px) { .gtm-flows { grid-template-columns: repeat(3, 1fr); } }
      `}</style>

      <div className="gtm-wrap" style={{ maxWidth: 960, margin: "0 auto" }}>
        {/* Hero */}
        <div
          style={{
            borderRadius: 12,
            background: DARK,
            padding: "clamp(28px, 5vw, 52px)",
            marginBottom: 56,
            marginTop: 32,
          }}
        >
          <p
            style={{
              ...CAPS,
              fontSize: 9,
              color: AMBER,
              letterSpacing: "0.14em",
              marginBottom: 16,
            }}
          >
            GTM Orchestrator
          </p>
          <h1
            style={{
              ...ROBOTO,
              fontSize: "clamp(22px, 4vw, 38px)",
              fontWeight: 900,
              lineHeight: 1.2,
              color: "#f6f1ea",
              marginBottom: 16,
              letterSpacing: "-0.3px",
            }}
          >
            AI-Powered Sales Outreach Engine
          </h1>
          <p
            style={{
              ...INTER,
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(246,241,234,0.65)",
              maxWidth: 600,
            }}
          >
            A custom system designed and built to run B2B prospecting
            end-to-end. Researches prospects, writes personalised emails in the
            sender's voice, schedules and sends safely, and keeps every account
            moving — with a human reviewing, not retyping.
          </p>
        </div>

        {/* The Problem */}
        <div
          style={{
            border: `1px solid ${BORDER}`,
            borderRadius: 10,
            padding: "28px",
            background: CARD,
            marginBottom: 48,
          }}
        >
          <p style={{ ...CAPS, fontSize: 9, color: MUTED, marginBottom: 14 }}>
            The Problem
          </p>
          <p
            style={{
              ...ROBOTO,
              fontSize: "clamp(15px, 2vw, 19px)",
              fontWeight: 700,
              color: DARK,
              lineHeight: 1.45,
              marginBottom: 16,
            }}
          >
            Personalised outreach at scale is impossible by hand. Generic
            templates get ignored.
          </p>
          <p
            style={{
              ...INTER,
              fontSize: 13,
              lineHeight: 1.8,
              color: MUTED,
              maxWidth: 660,
            }}
          >
            Running outreach across the Nordics, Baltics and Netherlands —
            thousands of prospects, dozens of live accounts, and a CRM that does
            not research, write, or follow up on its own. Done manually, true
            personalisation does not scale. Done with templates, response rates
            collapse. This system eliminates that trade-off.
          </p>
        </div>

        {/* What it does */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              borderRadius: 10,
              background: "#2a2a2a",
              padding: "18px 24px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                ...CAPS,
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}
            >
              Capabilities
            </p>
            <h2
              style={{
                ...ROBOTO,
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: 800,
                color: "#f6f1ea",
              }}
            >
              What it does
            </h2>
          </div>
          <div className="gtm-features">
            {(
              [
                {
                  Icon: ResearchIcon,
                  title: "Researches every prospect automatically",
                  body: "A research engine profiles each company and contact — what they do, their tech stack, competitive replacement signals (Citrix, VPN, RDS), country-specific buying culture — and writes a structured dossier with a personalisation hook. 45 deep-research reports generated; 6,675 prospects profiled across 9 countries.",
                },
                {
                  Icon: WriteIcon,
                  title: "Writes in the sender's voice, not AI voice",
                  body: "A multi-stage writing pipeline drafts each message, then runs it through automated editorial gates — mechanics, fact-checking, voice-match, and an 'AI-tell' detector that strips the giveaways that get cold email deleted. Anything that fails is held back rather than sent.",
                },
                {
                  Icon: SendIcon,
                  title: "Sends safely and on schedule",
                  body: "A sequence scheduler enrols prospects into multi-step campaigns with a send-claim architecture — idempotency keys and fail-closed guards so nothing double-sends or loops. Every send is logged and auditable. 670 emails drafted, 482 sent, across 11 campaign types.",
                },
                {
                  Icon: IntegrateIcon,
                  title: "Connects without API access",
                  body: "Reverse-engineered session-replay integrations for HubSpot CRM, Apollo.io, and the TSplus licence portal where no developer API was available. Live CRM, enrichment and licensing data surfaces directly into the workflow. Website-visitor signals (790 companies tracked) feed warm leads in automatically.",
                },
                {
                  Icon: PipelineIcon,
                  title: "Keeps the pipeline warm on its own",
                  body: "Daily automations graduate new prospects into campaigns, draft follow-ups for deals that go quiet, and send a morning briefing — so accounts keep moving without manual chasing. Live opportunities at SSAB, Eidsiva, GleSYS, Vektus and others sourced through the system.",
                },
              ] as const
            ).map(({ Icon, title, body }) => (
              <div
                key={title}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "22px 20px",
                  background: CARD,
                }}
              >
                <Icon />
                <p
                  style={{
                    ...ROBOTO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: DARK,
                    marginBottom: 10,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    ...INTER,
                    fontSize: 12,
                    lineHeight: 1.75,
                    color: MUTED,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* By the numbers */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              borderRadius: 10,
              background: "#2a2a2a",
              padding: "18px 24px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                ...CAPS,
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}
            >
              Metrics
            </p>
            <h2
              style={{
                ...ROBOTO,
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: 800,
                color: "#f6f1ea",
              }}
            >
              By the numbers
            </h2>
          </div>
          <div className="gtm-stats">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "18px 16px",
                  background: CARD,
                }}
              >
                <p
                  style={{
                    ...ROBOTO,
                    fontSize: "clamp(20px, 3vw, 28px)",
                    fontWeight: 900,
                    color: AMBER,
                    lineHeight: 1,
                    marginBottom: 8,
                  }}
                >
                  {value}
                </p>
                <p
                  style={{
                    ...INTER,
                    fontSize: 11,
                    lineHeight: 1.55,
                    color: MUTED,
                  }}
                >
                  {label}
                </p>
              </div>
            ))}
          </div>
          <p
            style={{
              ...INTER,
              fontSize: 11,
              color: MUTED,
              marginTop: 12,
              fontStyle: "italic",
            }}
          >
            Figures pulled live from the system's database. Conversion and reply
            rates are deliberately omitted — not yet reliably tracked. The
            honest proof point: sourced live deals including SSAB, Eidsiva and
            GleSYS.
          </p>
        </div>

        {/* Privacy and Data Flow */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              borderRadius: 10,
              background: "#2a2a2a",
              padding: "18px 24px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                ...CAPS,
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}
            >
              Architecture
            </p>
            <h2
              style={{
                ...ROBOTO,
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: 800,
                color: "#f6f1ea",
              }}
            >
              Privacy and data flow
            </h2>
          </div>
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "24px",
              background: CARD,
              marginBottom: 14,
            }}
          >
            <p
              style={{
                ...INTER,
                fontSize: 13,
                lineHeight: 1.8,
                color: TEXT,
                marginBottom: 0,
              }}
            >
              The system runs on an NVIDIA DGX Spark — not on rented cloud
              infrastructure. Prospect records, CRM data, and licensing
              information live on the device and stay there. There are three
              data paths, separated by design.
            </p>
          </div>
          <div className="gtm-flows">
            {[
              {
                label: "Local-only automation",
                color: GREEN,
                body: "Pulling firmographics, enriching contacts, reconciling licences, and writing the results back to the CRM all run as deterministic processes on the device. No model is involved and nothing leaves the hardware.",
              },
              {
                label: "Local-model generation",
                color: AMBER,
                body: "Open-weight models running on the DGX Spark do the bulk of the drafting, research and editorial work. Prospect data is processed on-device and never transmitted.",
              },
              {
                label: "Controlled frontier escalation",
                color: "#c0392b",
                body: "When a task genuinely needs frontier reasoning, Claude (Opus) is called across a single, deliberate boundary — and only the minimum, abstracted context crosses it. Customer-identifying detail is held back on the device.",
              },
            ].map(({ label, color, body }) => (
              <div
                key={label}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "20px 18px",
                  background: CARD,
                  borderTop: `3px solid ${color}`,
                }}
              >
                <p style={{ ...CAPS, fontSize: 9, color, marginBottom: 10 }}>
                  {label}
                </p>
                <p
                  style={{
                    ...INTER,
                    fontSize: 12,
                    lineHeight: 1.75,
                    color: MUTED,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "20px 22px",
              background: CARD,
              marginTop: 14,
            }}
          >
            <p style={{ ...INTER, fontSize: 12, lineHeight: 1.8, color: TEXT }}>
              The orchestration layer is Claude running headlessly, directing
              the local models and reserving the frontier model for the few
              steps that actually require it. Every call out of the device
              passes through one auditable chokepoint, so escalation is the
              exception, not the default.
            </p>
          </div>
        </div>

        {/* What makes it different */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              borderRadius: 10,
              background: "#2a2a2a",
              padding: "18px 24px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                ...CAPS,
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}
            >
              Differentiators
            </p>
            <h2
              style={{
                ...ROBOTO,
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: 800,
                color: "#f6f1ea",
              }}
            >
              What makes it different
            </h2>
          </div>
          <div className="gtm-diffs">
            {[
              {
                title: "Privacy by architecture, not policy",
                body: "Generation, enrichment, CRM and licence operations run on a single device under direct control. The frontier model is an opt-in escalation across a controlled boundary, not the engine the system depends on.",
              },
              {
                title: "Frontier where it counts, local everywhere else",
                body: "Open-weight models handle volume and routine reasoning on-device; Opus is reserved for the hardest judgement calls. Cost and exposure both scale with how rarely the boundary is crossed.",
              },
              {
                title: "One egress chokepoint",
                body: "A single LLM client mediates every model call. The routing rule — local by default, frontier only when required, sensitive data never raw — is enforced in one place and is auditable.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: 10,
                  padding: "22px 20px",
                  background: CARD,
                }}
              >
                <p
                  style={{
                    ...ROBOTO,
                    fontSize: 14,
                    fontWeight: 700,
                    color: DARK,
                    marginBottom: 10,
                  }}
                >
                  {title}
                </p>
                <p
                  style={{
                    ...INTER,
                    fontSize: 12,
                    lineHeight: 1.75,
                    color: MUTED,
                  }}
                >
                  {body}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div style={{ marginBottom: 48 }}>
          <div
            style={{
              borderRadius: 10,
              background: "#2a2a2a",
              padding: "18px 24px",
              marginBottom: 20,
            }}
          >
            <p
              style={{
                ...CAPS,
                fontSize: 9,
                color: "rgba(255,255,255,0.4)",
                marginBottom: 6,
              }}
            >
              Technology
            </p>
            <h2
              style={{
                ...ROBOTO,
                fontSize: "clamp(15px, 2.2vw, 20px)",
                fontWeight: 800,
                color: "#f6f1ea",
              }}
            >
              Stack
            </h2>
          </div>
          <div
            style={{
              border: `1px solid ${BORDER}`,
              borderRadius: 10,
              padding: "24px 22px",
              background: CARD,
            }}
          >
            {[
              {
                label: "Hardware",
                value:
                  "NVIDIA DGX Spark — GB10 Superchip, 128GB unified memory, NVMe storage. Runs entirely on-device.",
              },
              {
                label: "AI Models",
                value:
                  "Open-weight models locally for drafting, research, and editorial gates. Claude (Opus) reached headlessly only when frontier reasoning is required.",
              },
              {
                label: "Orchestration",
                value:
                  "Claude running headlessly as the orchestrator — routes each step to a local model or the frontier model through a single LLM client.",
              },
              {
                label: "Backend",
                value:
                  "Python (FastAPI) services, a sequence scheduler with send-claim/idempotency architecture, and a React dashboard.",
              },
              {
                label: "Integrations",
                value:
                  "Reverse-engineered session-replay bridges to HubSpot CRM, Apollo.io where no developer API exists.",
              },
              {
                label: "Security",
                value:
                  "Hardened Linux, TOTP-gated administrative access, least-privilege read-only roles, and full audit logging of sends and model egress.",
              },
              {
                label: "Access",
                value:
                  "Tailscale peer-to-peer VPN — secure remote access without port forwarding.",
              },
            ].map(({ label, value }, i, arr) => (
              <div
                key={label}
                style={{
                  marginBottom: i < arr.length - 1 ? 14 : 0,
                  paddingBottom: i < arr.length - 1 ? 14 : 0,
                  borderBottom:
                    i < arr.length - 1 ? `1px solid ${BORDER}` : "none",
                }}
              >
                <p
                  style={{
                    ...CAPS,
                    fontSize: 8,
                    color: AMBER,
                    marginBottom: 4,
                  }}
                >
                  {label}
                </p>
                <p
                  style={{
                    ...INTER,
                    fontSize: 12,
                    lineHeight: 1.65,
                    color: TEXT,
                  }}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            borderRadius: 12,
            background: DARK,
            padding: "clamp(24px, 4vw, 40px)",
          }}
        >
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 12 }}>
            Built by Humanity³
          </p>
          <p
            style={{
              ...ROBOTO,
              fontSize: "clamp(14px, 2vw, 18px)",
              fontWeight: 700,
              color: "#f6f1ea",
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            A division of Tutto Products and Services
          </p>
          <p
            style={{
              ...INTER,
              fontSize: 13,
              lineHeight: 1.75,
              color: "rgba(246,241,234,0.6)",
              maxWidth: 560,
            }}
          >
            The system is a specific answer to a specific problem. The
            underlying principle applies broadly: most sales and GTM functions
            can be restructured so that the sensitive work stays on your
            hardware, the AI is directed rather than trusted, and the human in
            the loop reviews decisions instead of making them one at a time.
          </p>
        </div>
      </div>
    </div>
  );
}
