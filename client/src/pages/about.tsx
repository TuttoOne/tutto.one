import { useEffect } from "react";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

export default function About() {
  useEffect(() => {
    document.title = "About - Daniel Forsthofer";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .ab-wrap { padding: 64px 20px 100px; }
        @media (min-width: 600px) { .ab-wrap { padding: 64px 32px 100px; } }
        .ab-cols { display: grid; grid-template-columns: 1fr; gap: 48px; }
        @media (min-width: 680px) { .ab-cols { grid-template-columns: 2fr 1fr; gap: 64px; } }
      `}</style>
      <div className="ab-wrap" style={{ maxWidth: 860, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 64, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>
            About
          </p>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(26px, 4.5vw, 42px)", fontWeight: 900, lineHeight: 1.15, color: "#f6f1ea", marginBottom: 20, letterSpacing: "-0.3px" }}>
            Exploring AI Practically
          </h1>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.65)", maxWidth: 520 }}>
            The basis for everything here is philosophy. What does it mean? What is the utility? Is it right or wrong? What can we change - and what simply isn't ours to control?
          </p>
        </div>

        <div className="ab-cols">

          {/* Bio */}
          <div>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              The background is philosophy - not as an academic pursuit, but as the practical foundation for everything else. What does it mean? What is the actual utility? Is this right or wrong? And - perhaps most usefully - what can we change, and what simply isn't ours to control?
            </p>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              That last question is where Stoicism becomes relevant. The Stoics were not pessimists; they were realists with a clear framework for action. Distinguish between what is within your control and what isn't. Accept the latter. Act on the former. The rest is noise.
            </p>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              AI falls into the second category. It is not a choice. It is the product of economic, technological, and scientific conditions that are still accelerating, and no individual decision - yours, your company's, your government's - will stop it. That is the part you don't control.
            </p>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              What you do control is whether you understand it, and whether you use it well.
            </p>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              The gap between people who understand these systems and people who don't is going to compound. The people who engage - who learn to work alongside AI rather than around it, who build things that help them rather than waiting for someone else to do it - will be in a different position to those who don't. That is not hype. It is just how tools work.
            </p>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.85, color: "#3d3d3d", marginBottom: 22 }}>
              Daniel works with businesses and individuals who want to understand what is actually happening: what these systems are, what they are genuinely good at, where they fail, and what a working setup looks like for their specific context. Some want strategy. Most want to build something useful and understand what they have built.
            </p>
            <p style={{ ...INTER, fontSize: 15, lineHeight: 1.85, color: "#1a1a1a", fontWeight: 500 }}>
              The teaching is the point. The technology is the method.
            </p>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
              <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 16 }}>Connect</p>
              <a
                href="https://www.linkedin.com/in/daniel-forsthofer/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ ...INTER, fontSize: 13, color: "#1a1a1a", textDecoration: "none", display: "flex", alignItems: "center", gap: 10, fontWeight: 500 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077b5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                Daniel Forsthofer
              </a>
            </div>

            <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
              <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 14 }}>Grounding</p>
              {["Philosophy first", "Stoic framework", "Utility over novelty", "Teach, don't just tell"].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#d97706", flexShrink: 0, marginTop: 7 }} />
                  <span style={{ ...INTER, fontSize: 12, lineHeight: 1.6, color: "#3d3d3d" }}>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
              <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>The position</p>
              <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d", fontStyle: "italic" }}>
                "It will happen with or without them. Better to at least lean in and learn."
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
