import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.14em" };

export default function Pythia() {
  useEffect(() => {
    document.title = "Pythia - Read every file. Miss nothing.";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: "#0e0e0e", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .py-wrap { max-width: 800px; margin: 0 auto; padding: 100px 24px 100px; }
        @media (min-width: 600px) { .py-wrap { padding: 120px 40px 120px; } }

        .py-stat-grid { display: grid; grid-template-columns: 1fr; gap: 1px; background: rgba(255,255,255,0.08); border-radius: 12px; overflow: hidden; margin: 56px 0; }
        @media (min-width: 580px) { .py-stat-grid { grid-template-columns: 1fr 1fr 1fr; } }

        .py-stat-cell { background: #141414; padding: 32px 28px; }

        .py-divider { border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 56px 0; }

        .py-section { margin-bottom: 48px; }
        .py-section h3 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.18em; color: rgba(255,255,255,0.35); margin-bottom: 18px; font-family: 'Inter', sans-serif; }
        .py-section p { font-size: 17px; line-height: 1.75; color: rgba(255,255,255,0.72); font-family: 'Inter', sans-serif; }
      `}</style>

      <div className="py-wrap">

        {/* Eyebrow */}
        <p style={{ ...CAPS, fontSize: 10, color: "rgba(255,255,255,0.3)", marginBottom: 32, letterSpacing: "0.22em" }}>
          Pythia &nbsp;·&nbsp; by Humanity³
        </p>

        {/* Headline */}
        <h1 style={{
          ...ROBOTO,
          fontSize: "clamp(40px, 7vw, 72px)",
          fontWeight: 900,
          lineHeight: 1.05,
          letterSpacing: "-1.5px",
          color: "#f6f1ea",
          marginBottom: 24,
        }}>
          Read every file.<br />
          <em style={{ fontStyle: "italic", color: "rgba(246,241,234,0.45)" }}>Miss nothing.</em>
        </h1>

        {/* Sub-headline */}
        <p style={{ ...INTER, fontSize: "clamp(16px, 2.5vw, 20px)", lineHeight: 1.65, color: "rgba(246,241,234,0.55)", maxWidth: 580, marginBottom: 0 }}>
          An AI that reads every document in your firm — and helps your team find what matters in hours, not days.
        </p>

        {/* Stats */}
        <div className="py-stat-grid">
          {[
            { stat: "3 days → 3 hours", label: "Document review per matter" },
            { stat: "Zero",             label: "Files leave your office" },
            { stat: "Every footnote",   label: "Found and explained" },
          ].map((s) => (
            <div key={s.stat} className="py-stat-cell">
              <p style={{ ...ROBOTO, fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 800, color: "#f6f1ea", marginBottom: 10, letterSpacing: "-0.5px" }}>{s.stat}</p>
              <p style={{ ...INTER, fontSize: 12, color: "rgba(255,255,255,0.35)", lineHeight: 1.5 }}>{s.label}</p>
            </div>
          ))}
        </div>

        <hr className="py-divider" />

        {/* Problem */}
        <div className="py-section">
          <h3>The problem</h3>
          <p>
            Juniors spend days reading. Partners wait. The thing you miss is the thing that loses the case.
          </p>
        </div>

        {/* What it does */}
        <div className="py-section">
          <h3>What Pythia does</h3>
          <p>
            Ask it the way you'd brief a junior. It finds every relevant file, and shows you why.
          </p>
        </div>

        <hr className="py-divider" />

        {/* Setup note */}
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "28px 32px", marginBottom: 56 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.3)", marginBottom: 12 }}>Setup</p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.75, color: "rgba(255,255,255,0.55)" }}>
            A few weeks for Pythia to read in your first set of files. New documents are added as they arrive.
          </p>
        </div>

        {/* Tagline */}
        <p style={{
          ...ROBOTO,
          fontSize: "clamp(22px, 4vw, 38px)",
          fontWeight: 800,
          color: "#f6f1ea",
          letterSpacing: "-0.5px",
          lineHeight: 1.2,
          marginBottom: 40,
        }}>
          Bill for <em style={{ fontStyle: "italic", color: "rgba(246,241,234,0.4)" }}>thinking</em>, not searching.
        </p>

        {/* Tags + CTA */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 20 }}>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["On-site", "Private", "UK-built"].map((tag) => (
              <span key={tag} style={{ ...CAPS, fontSize: 9, color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 20, padding: "6px 14px" }}>
                {tag}
              </span>
            ))}
          </div>
          <a
            href="https://cal.com/tuttoone/30min"
            target="_blank"
            rel="noopener noreferrer"
            style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, background: "#f6f1ea", color: "#0e0e0e", padding: "12px 24px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
          >
            Book a conversation →
          </a>
        </div>

      </div>
    </div>
  );
}
