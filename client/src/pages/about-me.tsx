import { useEffect } from "react";
import { Header, Layout } from "@/components/layout/Layout";
import { useQuery } from "@tanstack/react-query";
import { usePreferences } from "@/lib/preferences";
import { SITE_TITLE } from "@/lib/i18n";
import { FicheSheet } from "@/pages/fiche-capacites";

const ROBOTO: React.CSSProperties = {
  fontFamily: "'Roboto', -apple-system, sans-serif",
};
const INTER: React.CSSProperties = {
  fontFamily: "'Inter', -apple-system, sans-serif",
};
const CAPS: React.CSSProperties = {
  ...INTER,
  textTransform: "uppercase",
  letterSpacing: "0.12em",
};

const DEFAULT_HERO = {
  headline: "Learn by doing",
  sub: "Making AI useful is a hands-on experience. The technology is new, moving fast, and genuinely powerful when used in the right way. Any leap is less daunting when you take the first step with someone beside you who's taken enough scary ones to like them. I don't pretend to have all the answers - I've just stopped waiting for them, and I want to share what I've found.",
};

export default function About() {
  const { locale } = usePreferences();

  useEffect(() => {
    document.title =
      locale === "fr" ? "À propos de moi - Daniel Forsthofer" : "About me - Daniel Forsthofer";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const { data: heroContent } = useQuery<{ value: string }>({
    queryKey: ["/api/site-content/about-hero"],
    retry: false,
  });

  const hero = (() => {
    if (!heroContent) return DEFAULT_HERO;
    try { return { ...DEFAULT_HERO, ...JSON.parse(heroContent.value) }; } catch { return DEFAULT_HERO; }
  })();

  // The French About is the capability sheet — written for the French market
  // rather than translated from the English page, which is a different pitch.
  if (locale === "fr") {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto px-6 py-12">
          <FicheSheet />
        </div>
      </Layout>
    );
  }

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
        <div
          style={{
            borderRadius: 12,
            background: "#1a1a1a",
            padding: "clamp(28px, 5vw, 52px)",
            marginBottom: 64,
            marginTop: 32,
          }}
        >
          <h1
            style={{
              ...ROBOTO,
              fontSize: "clamp(26px, 4.5vw, 42px)",
              fontWeight: 900,
              lineHeight: 1.15,
              color: "#f6f1ea",
              marginBottom: 20,
              letterSpacing: "-0.3px",
            }}
          >
            {hero.headline}
          </h1>
          <p
            style={{
              ...INTER,
              fontSize: 15,
              lineHeight: 1.8,
              color: "rgba(246,241,234,0.65)",
              maxWidth: 520,
            }}
          >
            {hero.sub}
          </p>
        </div>

        <div className="ab-cols">
          {/* Bio */}
          <div>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
                fontWeight: "normal",
              }}
            >
              My background is in philosophy - not as an academic pursuit, but
              as the practical foundation for working with technology.
              <br />
              <br />
              "What does it mean to use AI systems?"
              <br />
              "What is the utility / ROI?"
              <br />
              "Is AI a good fit for me, for my organisation?"
              <br />
              "What can we control, and what do we have no say over?"
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
              }}
              className="font-bold">
              Distinguish between what is within your control and what isn't.
              Accept the latter. Act on the former. The rest is noise.
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
              }}
            >
              AI falls into the second category. It is not a choice. It is the
              product of economic, technological, and scientific conditions that
              are still accelerating, and no individual decision - yours, your
              company's, your government's - will stop it. That is the part we
              don't control.
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
              }}
            >
              What you do control is whether you understand it, and whether you
              use it well. Don't bury your head in the sand because you don't
              like AI, and what it's doing to the world. Try to understand it
              and how it can be used to improve the world. Even a small action
              can have a big impact, so lean in!
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
              }}
            >
              The gap between people who understand these systems and people who
              don't is going to compound. The people who engage - who learn to
              work alongside AI rather than around it, who build things that
              help them rather than waiting for someone else to do it - will be
              in a different position to those who don't. That is not hype. It
              is just how tools work.
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 14,
                lineHeight: 1.85,
                color: "#3d3d3d",
                marginBottom: 22,
              }}
            >
              Fear is the starting condition here, not the enemy. People fear
              change and the unknown - so do I, still. The answer isn't bravado;
              it's a first step, then another. My role is not to be the expert
              above you, but the experienced first-stepper beside you.
              <br />
              <br />
              I work with businesses and individuals who want to understand what
              is actually happening: what these systems are, what they are
              genuinely good at, where they fail, and what a working setup looks
              like for their specific context. Some want strategy. Most want to
              build something useful and understand what they have built.
            </p>
            <p
              style={{
                ...INTER,
                fontSize: 15,
                lineHeight: 1.85,
                color: "#1a1a1a",
                fontWeight: 500,
              }}
            >
              We learn by doing & AI is a participant.
              <br />
              You have nothing to lose, everything to gain.
            </p>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div
              style={{
                border: "1px solid #d8d0c5",
                borderRadius: 10,
                padding: "22px 20px",
                background: "#faf8f5",
              }}
            >
              <p
                style={{
                  ...CAPS,
                  fontSize: 9,
                  color: "#a8a092",
                  marginBottom: 16,
                }}
              >
                Connect
              </p>
              <a
                href="https://www.linkedin.com/in/daniel-forsthofer/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  ...INTER,
                  fontSize: 13,
                  color: "#1a1a1a",
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  fontWeight: 500,
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077b5">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
                Daniel Forsthofer
              </a>
              <img
                src="/profile.jpg"
                alt="Daniel Forsthofer"
                style={{
                  width: "100%",
                  height: "auto",
                  borderRadius: 8,
                  marginTop: 16,
                  display: "block",
                }}
              />
            </div>

            {/* Direct contact details — this is the personal page, so they
                belong here rather than on the company About. English only:
                French visitors are returned the capability sheet above, which
                carries the same details in its header. */}
            <div
              style={{
                border: "1px solid #d8d0c5",
                borderRadius: 10,
                padding: "22px 20px",
                background: "#faf8f5",
                marginBottom: 20,
              }}
            >
              <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 16 }}>
                Get in touch
              </p>
              {[
                {
                  label: "Address",
                  value: "Loubressac, Lot 46130, France",
                  href: null,
                },
                {
                  label: "Telephone",
                  value: "+33 6 84 20 56 38",
                  href: "tel:+33684205638",
                },
                {
                  label: "Email",
                  value: "daniel@tutto.one",
                  href: "mailto:daniel@tutto.one",
                },
              ].map((row) => (
                <div key={row.label} style={{ marginBottom: 12 }}>
                  <p style={{ ...CAPS, fontSize: 8, color: "#b0a898", marginBottom: 3 }}>
                    {row.label}
                  </p>
                  {row.href ? (
                    <a
                      href={row.href}
                      style={{
                        ...INTER,
                        fontSize: 13,
                        color: "#1a1a1a",
                        textDecoration: "none",
                        fontWeight: 500,
                      }}
                    >
                      {row.value}
                    </a>
                  ) : (
                    <p style={{ ...INTER, fontSize: 13, color: "#1a1a1a", margin: 0 }}>
                      {row.value}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid #d8d0c5",
                borderRadius: 10,
                padding: "22px 20px",
                background: "#faf8f5",
              }}
            >
              <p
                style={{
                  ...CAPS,
                  fontSize: 9,
                  color: "#a8a092",
                  marginBottom: 14,
                }}
              >
                Grounding
              </p>
              {[
                "Philosophy first",
                "Stoic framework",
                "Utility over novelty",
                "Practice, don't just teach",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 10,
                  }}
                >
                  <span
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: "50%",
                      background: "#d97706",
                      flexShrink: 0,
                      marginTop: 7,
                    }}
                  />
                  <span
                    style={{
                      ...INTER,
                      fontSize: 12,
                      lineHeight: 1.6,
                      color: "#3d3d3d",
                    }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div
              style={{
                border: "1px solid #d8d0c5",
                borderRadius: 10,
                padding: "22px 20px",
                background: "#faf8f5",
              }}
            >
              <p
                style={{
                  ...CAPS,
                  fontSize: 9,
                  color: "#a8a092",
                  marginBottom: 12,
                }}
              >
                The position
              </p>
              <p
                style={{
                  ...INTER,
                  fontSize: 12,
                  lineHeight: 1.75,
                  color: "#3d3d3d",
                  fontStyle: "italic",
                }}
              >
                "It will happen with or without us. Better to lean in and
                learn."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
