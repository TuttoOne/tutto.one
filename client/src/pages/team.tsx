import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

// ── Design tokens (shared across the site) ───────────────────────────────────
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

// ── Team data ────────────────────────────────────────────────────────────────
// Each person is one object. To edit a profile, change the fields below.
// `placeholder: true` renders a muted "profile in progress" state so nothing
// half-written is presented as final.

type Experience = {
  period: string;
  role: string;
  org: string;
  note: string;
};

type Person = {
  name: string;
  role: string;
  photo?: string;
  linkedin?: string;
  tagline: string;
  bio: string[];
  focus: string[];
  grounding: string[];
  experience?: Experience[];
  placeholder?: boolean;
};

const TEAM: Person[] = [
  {
    name: "Daniel Forsthofer",
    role: "Founder — Tutto",
    photo: "/profile.jpg",
    linkedin: "https://www.linkedin.com/in/daniel-forsthofer/",
    tagline: "Learn by doing. Say yes and try.",
    bio: [
      "I'm the founder of Tutto — a business owner, father and entrepreneur. South African, now living in France, working in English and remote by design. Technology is my real skill; teaching is how I pass it on.",
      "I'm not a developer, and I'm not afraid of that. I leapt into these tools. My edge is turning human language into working systems with Claude Code — and connecting people's knowledge and workflows so they start to fire together.",
      "The flag I work under is simple: learn by doing. Any business, project or career turn is less daunting when you take the first step with a second brain beside you — carrying the admin, the capture and the coordination, and connecting you to the knowledge you need.",
      "Fear is the starting condition, not the enemy. People fear change and the unknown — so do I, still. The answer isn't bravado; it's a first step, then another, with someone in the room who's taken enough scary ones to like them. Not the expert above you — the experienced first-stepper beside you.",
    ],
    focus: [
      "Teaching second brains (Praxis)",
      "Systems with Claude Code",
      "Connecting knowledge & workflows",
      "TSplus — Nordics & Netherlands",
      "Tutto — remote-run catering",
    ],
    grounding: [
      "Learn by doing",
      "Fear is the starting condition",
      "Stoic: act on what you control",
      "Humble, not arrogant",
      "Start simple",
    ],
    experience: [
      {
        period: "2024 — present",
        role: "Head: Northern Europe",
        org: "TSplus (French software multinational)",
        note: "Grew direct sales >80% (YoY) across the Netherlands, Scandinavia and the Baltics from a standing start with no local team — and built an in-house AI outreach engine (ICP scoring, web research, country-tailored messaging) that replaced the paid SaaS.",
      },
      {
        period: "2020 — present",
        role: "Co-Founder",
        org: "Tutto Consulting Services",
        note: "AI-adoption consultancy that teaches clients to build and maintain their own systems. Flagship work: enterprise AI adoption for a major drinks group, a privacy-first legal RAG on a self-built NVIDIA DGX Spark, and AI-ready data warehouses queried over MCP.",
      },
      {
        period: "2012 — present",
        role: "Co-Founder / COO",
        org: "Tutto Food Co.",
        note: "Johannesburg's first paella-centric caterer, built with my wife from weekend cooking. Built the event-management and accounting/ERP system from scratch (replaced Sage, accountant-approved). Now run remotely from France — encode the process, let people execute.",
      },
      {
        period: "2021 — 2023",
        role: "Senior Consultant & Delivery Manager",
        org: "PPT Group",
        note: "Led the Spur Group branded-app delivery and moved the team from waterfall to agile (Azure DevOps + Jira); product owner of the OPUS4business field-service platform; enablement for Famous Brands. 30+ stakeholders; rollout to 2.5m+ customers.",
      },
      {
        period: "2012 — 2013",
        role: "Consultant",
        org: "Tidewave Steelworks",
        note: "Systematised an owner-run manufacturer and prepared it for acquisition, with cross-border operations in Botswana and Namibia.",
      },
      {
        period: "2011 — 2012",
        role: "Business Development & Account Executive",
        org: "Human Factors International",
        note: "Set up and grew the UX consultancy's South African office and ran its UX course modules across Johannesburg, Pretoria and Cape Town. Key account: Standard Bank.",
      },
      {
        period: "2010 — 2011",
        role: "Analyst, New Territories & Products",
        org: "Standard Bank",
        note: "R&D on bottom-of-the-pyramid mobile banking for Africa (Nigeria, Uganda, Zambia) — a precursor to TymeBank.",
      },
    ],
  },
  {
    // ⚠️ PLACEHOLDER — replace with real details, then remove `placeholder: true`.
    name: "Your colleague",
    role: "Consultant — Tutto",
    photo: undefined,
    linkedin: undefined,
    tagline: "Profile in progress.",
    bio: [
      "This profile is a placeholder. Once the details land, this card will describe who she is, what she believes in, and what she likes working on — grounded the same way Daniel's is.",
    ],
    focus: [],
    grounding: [],
    placeholder: true,
  },
];

// ── Person card ──────────────────────────────────────────────────────────────
function Initials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("");
  return (
    <div
      style={{
        width: "100%",
        aspectRatio: "1 / 1",
        maxHeight: 220,
        borderRadius: 8,
        background: "#ece5da",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#b7ac9c",
        ...ROBOTO,
        fontSize: 40,
        fontWeight: 900,
      }}
    >
      {initials || "?"}
    </div>
  );
}

function PersonCard({ person }: { person: Person }) {
  return (
    <article
      style={{
        border: `1px solid ${BORDER}`,
        borderRadius: 12,
        background: CARD,
        padding: "clamp(22px, 3vw, 32px)",
        opacity: person.placeholder ? 0.72 : 1,
      }}
    >
      <div className="tm-head">
        <div className="tm-photo">
          {person.photo ? (
            <img
              src={person.photo}
              alt={person.name}
              style={{
                width: "100%",
                borderRadius: 8,
                display: "block",
                objectFit: "cover",
                objectPosition: "center top",
                maxHeight: 220,
                aspectRatio: "1 / 1",
              }}
            />
          ) : (
            <Initials name={person.name} />
          )}
        </div>

        <div style={{ flex: 1 }}>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(20px, 3vw, 26px)", fontWeight: 900, color: DARK, letterSpacing: "-0.3px", marginBottom: 4 }}>
            {person.name}
          </h2>
          <p style={{ ...CAPS, fontSize: 10, color: AMBER, marginBottom: 12 }}>{person.role}</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.7, color: DARK, fontWeight: 500, fontStyle: "italic", marginBottom: 12 }}>
            {person.tagline}
          </p>
          {person.linkedin && (
            <a
              href={person.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...INTER, fontSize: 13, color: DARK, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 500 }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              LinkedIn
            </a>
          )}
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        {person.bio.map((para, i) => (
          <p key={i} style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: TEXT, marginBottom: 16 }}>
            {para}
          </p>
        ))}
      </div>

      {person.focus.length > 0 && (
        <div style={{ marginTop: 8 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>Focus areas</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {person.focus.map((item) => (
              <span
                key={item}
                style={{ ...INTER, fontSize: 12, color: TEXT, background: "#f0ebe2", border: `1px solid ${BORDER}`, borderRadius: 999, padding: "5px 12px" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {person.grounding.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>Grounding</p>
          {person.grounding.map((item) => (
            <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 9 }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: AMBER, flexShrink: 0, marginTop: 7 }} />
              <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: TEXT }}>{item}</span>
            </div>
          ))}
        </div>
      )}

      {person.experience && person.experience.length > 0 && (
        <div style={{ marginTop: 26, borderTop: `1px solid ${BORDER}`, paddingTop: 22 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 16 }}>Experience</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {person.experience.map((job) => (
              <div key={`${job.org}-${job.period}`} style={{ borderLeft: `2px solid ${BORDER}`, paddingLeft: 14 }}>
                <p style={{ ...INTER, fontSize: 10, color: MUTED, letterSpacing: "0.04em", marginBottom: 3 }}>{job.period}</p>
                <p style={{ ...INTER, fontSize: 13.5, fontWeight: 600, color: DARK, lineHeight: 1.35 }}>{job.role}</p>
                <p style={{ ...INTER, fontSize: 12.5, color: AMBER, marginBottom: 6 }}>{job.org}</p>
                <p style={{ ...INTER, fontSize: 12.5, lineHeight: 1.65, color: TEXT }}>{job.note}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────
export default function Team() {
  useEffect(() => {
    document.title = "Team - Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, []);

  return (
    <div style={{ background: BG, minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .tm-wrap { padding: 96px 20px 100px; }
        @media (min-width: 600px) { .tm-wrap { padding: 112px 32px 100px; } }
        .tm-grid { display: grid; grid-template-columns: 1fr; gap: 24px; align-items: start; }
        @media (min-width: 860px) { .tm-grid { grid-template-columns: 1fr 1fr; gap: 24px; } }
        .tm-head { display: flex; flex-direction: column; gap: 18px; }
        @media (min-width: 460px) { .tm-head { flex-direction: row; align-items: flex-start; gap: 22px; } }
        .tm-photo { width: 100%; }
        @media (min-width: 460px) { .tm-photo { width: 140px; flex-shrink: 0; } }
      `}</style>

      <div className="tm-wrap" style={{ maxWidth: 1000, margin: "0 auto" }}>
        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: DARK, padding: "clamp(28px, 5vw, 52px)", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 9, color: AMBER, marginBottom: 18 }}>The people behind Tutto</p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 900, lineHeight: 1.15, color: BG, letterSpacing: "-0.3px", marginBottom: 20 }}>
            The best combination is always the person plus the machine.
          </h1>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", maxWidth: 560 }}>
            Tutto is small, hands-on, and deliberately human. We work alongside AI rather than around it — and we think it matters who is doing that work, and why. Here's who we are and what we believe in.
          </p>
        </div>

        <div className="tm-grid">
          {TEAM.map((person) => (
            <PersonCard key={person.name} person={person} />
          ))}
        </div>
      </div>
    </div>
  );
}
