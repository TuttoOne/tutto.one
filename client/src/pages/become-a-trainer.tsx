import { useEffect, useState } from "react";
import { usePageTr } from "@/lib/page-fr";
import { BECOME_A_TRAINER_FR } from "@/lib/fr/become-a-trainer";
import { Header } from "@/components/layout/Layout";
import { usePreferences } from "@/lib/preferences";
import {
  trainerEconomics,
  COURSE_SESSIONS,
  TRAINER_TRACK_SESSIONS,
  EXAMPLE_STUDENTS,
} from "@/lib/pricing";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6, color: "#f6f1ea",
  padding: "9px 12px", fontSize: 13,
  outline: "none",
  ...INTER,
};

const trainerSessions = [
  {
    n: "01",
    title: "The craft",
    body: "The thing that makes a trainer worth more than a free video: reading the person, not delivering slides. Intake, output before theory, naming the fear in the room and sitting with it, pacing, and the voice that keeps Praxis trusted instead of salesy.",
  },
  {
    n: "02",
    title: "The syllabus",
    body: "The spine you teach from, and how to pitch each idea for the person in front of you. The difference between AI and ordinary software, skill files as a firm's memory on disk, and the handful of objections every room raises. You learn it well enough to teach it without notes.",
  },
  {
    n: "03",
    title: "Live rehearsal",
    body: "You run the student tutor end to end as a learner, then deliver the core of it back to me cold. We find the rough edges while it is safe to find them.",
  },
  {
    n: "04",
    title: "Going live",
    body: "The readiness bar, an honest debrief, access to the private Praxis kit you will teach from, and exactly how clients reach you and get organised.",
  },
];

const faqs = [
  {
    q: "Do I have to do Praxis first?",
    a: "Yes. The trainer track builds on it. You cannot teach a path you have not walked yourself.",
  },
  {
    q: "How long until I am teaching?",
    a: "Four sessions and clearing the readiness bar. Most of the timing is down to how much you practise between sessions.",
  },
  {
    q: "Do I have to find my own clients?",
    a: "No. I find and organise the work with you. You are welcome to bring your own as well, and because you keep 80% of everything, bringing your own simply means you earn more.",
  },
  {
    q: "What is the 20% actually for?",
    a: "Finding and organising your lessons, the method and its ongoing updates, the private kit you teach from, and a hub that picks up the hard builds you escalate.",
  },
  {
    q: "What if a client needs something I cannot build?",
    a: "You bring it back to the hub. We take on the complex work and support your engagement, and you stay the relationship the client trusts.",
  },
  {
    q: "Is this an accredited trainer qualification?",
    a: "No. It is Praxis confirming you can teach Praxis well. We are clear about that, because overclaiming is exactly what we teach people not to do.",
  },
];

export default function BecomeATrainer() {
  const tr = usePageTr(BECOME_A_TRAINER_FR);
  const { locale, currency } = usePreferences();
  const econ = trainerEconomics(currency, locale);

  useEffect(() => {
    document.title = "Become a Praxis Trainer - teach it, and earn from it";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  const [form, setForm] = useState({ name: "", email: "", context: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: `Praxis Trainer Track enquiry\n\nWho is already asking them for help: ${form.context}`,
        }),
      });
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  };

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .bt-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .bt-wrap { padding: 64px 32px 80px; } }

        .bt-cols-2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .bt-cols-2 { grid-template-columns: 1fr 1fr; gap: 16px; } }

        .bt-sessions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 680px) { .bt-sessions { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .bt-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .bt-input::placeholder { color: rgba(246,241,234,0.3); }
        .bt-input:focus { border-color: rgba(217,119,6,0.6) !important; }

        .bt-faq-btn { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0; }
      `}</style>
      <div className="bt-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("Praxis Trainer Track")}</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>{tr("Teach Praxis.")}<br />{tr("Earn from it.")}</h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>{tr("Four sessions on top of Praxis turn you from someone who can build into someone who can teach it for a living. You teach, I find and organise the clients with you, and you keep 80% of the tuition.")}</p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>{tr("You have been through Praxis. You can build working tools with Claude Code, and you have felt how fast the people around you want the same thing.")}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#get-started"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d97706", color: "#fff", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em" }}
            >{tr("Book a call to start →")}</a>
            <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>{tr("Prerequisite: completion of the Praxis programme")}</span>
          </div>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>{tr("Praxis Trainer Track · Four Sessions · V1")}</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>{tr("T e a c h &nbsp;W h a t &nbsp;Y o u &nbsp;K n o w")}</p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>{tr("You built it.")}<br />{tr("Now teach it.")}</h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>{tr("People keep asking you how you did it, and you have started explaining it without being asked. This is how you turn that into an income: four more sessions, a readiness bar to clear, and then you are teaching Praxis under the same name, with clients I find and organise with you, keeping 80% of everything you earn.")}</p>
        </div>

        {/* Section 01 - Who this is for */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("01 &nbsp;&nbsp;&nbsp; Who This Is For")}</span>
          </div>
          <div className="bt-cols-2">
            {[
              { label: "Already done Praxis", body: "You have completed the programme and you can build, comfortably, on your own. This is the prerequisite. You cannot teach a path you have not walked." },
              { label: "People keep asking", body: "You have felt how fast the people around you want the same thing, and you have started explaining it without being asked." },
              { label: "Independent or freelance", body: "You are a freelancer, consultant, or independent who wants a real income stream from teaching, without building a business from scratch." },
              { label: "Plug in, not start from scratch", body: "You would rather plug into a method that works than invent one. The playbook, the materials, and the clients are already here." },
            ].map((item) => (
              <div key={item.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{tr(item.label)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(item.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02 - The deal */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("02 &nbsp;&nbsp;&nbsp; The Deal, in Plain Terms")}</span>
          </div>
          <div style={{ maxWidth: 700 }}>
            {[
              { label: "Complete Praxis", body: "The eight-session programme is the prerequisite. That is where you walk the path yourself." },
              { label: "Do four more sessions", body: "The trainer track teaches you how to teach it, not just how to do it." },
              { label: "Clear the readiness bar", body: "A single real session, or a full mock, with me watching, followed by an honest debrief. One standard to clear before you carry the name." },
              { label: "Start teaching", body: "I find and organise your clients, with your help. You deliver the sessions." },
              { label: "You keep 80%", body: "I keep 20% for finding the work, the method, the materials, and the support behind you. After that there is no fee to me - I earn only when you do." },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 20, marginBottom: i < 4 ? 28 : 0 }}>
                <div style={{ ...MONO, fontSize: 11, color: "#d97706", fontWeight: 700, flexShrink: 0, marginTop: 2, width: 20 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{tr(item.label)}</p>
                  <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(item.body)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 03 - The four sessions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 12 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("03 &nbsp;&nbsp;&nbsp; The Four Sessions")}</span>
          </div>
          <p style={{ ...INTER, fontSize: 13, color: "#7a7568", lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>{tr("One session a week, at the standard Praxis rate. Each session has a specific job.")}</p>
          <div className="bt-sessions">
            {trainerSessions.map((s) => (
              <div key={s.n} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 10, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{s.n}</span>
                <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, paddingRight: 24 }}>{tr(s.title)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(s.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 04 - What you get */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("04 &nbsp;&nbsp;&nbsp; What You Get")}</span>
          </div>
          <div className="bt-cols-2">
            {[
              { label: "The whole method", body: "The Praxis playbook, the framings that land, the objection answers, the student tutor. You are not starting from a blank page." },
              { label: "The private kit", body: "Repo access to the living materials, updated as the method improves. Your copy stays current." },
              { label: "Clients, organised", body: "I find and arrange the work with you. The more you bring yourself, the more you earn, because you keep 80% of all of it." },
              { label: "A hub behind you", body: "When you hit a build or integration you cannot handle, you bring it back. We pick up the hard work and support the engagement, so a roadblock becomes a bigger job rather than a dead end." },
              { label: "A network", body: "Other trainers doing the same thing, sharing what works." },
            ].map((item) => (
              <div key={item.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{tr(item.label)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(item.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 05 - Pricing & earnings */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("05 &nbsp;&nbsp;&nbsp; What It Costs, and What You Earn")}</span>
          </div>

          {/* Cost cards */}
          <div className="bt-cols-2" style={{ marginBottom: 32 }}>
            {[
              {
                label: "Trainer track",
                price: econ.trainerTrack,
                note: `${TRAINER_TRACK_SESSIONS} sessions at the standard ${econ.sessionStandard} rate.`,
              },
              {
                label: "All-in to qualify",
                price: econ.trainerTotal,
                note: `Praxis (${econ.courseTuition}) plus the trainer track (${econ.trainerTrack}). After that, no further fees.`,
                highlight: true,
              },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  border: p.highlight ? "1.5px solid #d97706" : "1px solid #d8d0c5",
                  borderRadius: 10,
                  padding: "24px 20px",
                  background: p.highlight ? "#fdf6ec" : "#faf8f5",
                  position: "relative",
                }}
              >
                {p.highlight && (
                  <span style={{ ...CAPS, fontSize: 8, color: "#d97706", letterSpacing: "0.12em", position: "absolute", top: -9, left: 16, background: "#fdf6ec", padding: "0 6px" }}>{tr("Total to qualify")}</span>
                )}
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>{tr(p.label)}</p>
                <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>{p.price}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: "#5a5248" }}>{tr(p.note)}</p>
              </div>
            ))}
          </div>

          {/* Earnings table */}
          <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, overflow: "hidden", maxWidth: 600, marginBottom: 24 }}>
            <div style={{ background: "#1a1a1a", padding: "14px 20px" }}>
              <p style={{ ...CAPS, fontSize: 9, color: "#d97706", margin: 0 }}>Per {COURSE_SESSIONS}-session course ({econ.courseTuition} tuition)</p>
            </div>
            <div style={{ background: "#faf8f5" }}>
              {[
                { label: "Per session", you: econ.sessionYou, daniel: econ.sessionMine },
                { label: "Per full course", you: econ.courseYou, daniel: econ.courseMine, bold: true },
              ].map((row) => (
                <div
                  key={row.label}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    padding: "14px 20px",
                    borderBottom: "1px solid #d8d0c5",
                    background: row.bold ? "#fdf6ec" : undefined,
                  }}
                >
                  <p style={{ ...INTER, fontSize: 12, color: "#5a5248", margin: 0, fontWeight: row.bold ? 600 : 400 }}>{tr(row.label)}</p>
                  <p style={{ ...ROBOTO, fontSize: row.bold ? 16 : 13, fontWeight: row.bold ? 800 : 400, color: "#1a1a1a", margin: 0 }}>You keep {row.you}</p>
                  <p style={{ ...INTER, fontSize: 12, color: "#a8a092", margin: 0 }}>I keep {row.daniel}</p>
                </div>
              ))}
              <div style={{ padding: "12px 20px" }}>
                <p style={{ ...INTER, fontSize: 11, color: "#7a7568", margin: 0 }}>{tr("80% yours / 20% mine, on every course you teach.")}</p>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div style={{ padding: "20px 24px", background: "#f0ece6", borderRadius: 8, maxWidth: 600 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 10 }}>{tr("An illustration, not a promise")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d" }}>
              Teach {EXAMPLE_STUDENTS} students through a full course over a year and that is{" "}
              {econ.yearTuition} of tuition.{" "}
              <strong style={{ color: "#1a1a1a" }}>You keep {econ.yearYou}.</strong>{" "}
              I keep {econ.yearMine} for keeping the clients coming and the method sharp. Teach more, earn more.
              Teach part-time, scale it to fit.
            </p>
          </div>
        </div>

        {/* Section 06 - The bar */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("06 &nbsp;&nbsp;&nbsp; The Bar, and Why It Is There")}</span>
          </div>
          <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "32px 28px", background: "#faf8f5", maxWidth: 620 }}>
            <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 14, letterSpacing: "-0.2px" }}>{tr("One standard, not a quiz.")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 16 }}>{tr("You will carry the Praxis name, so there is a standard to clear before you teach anyone for money. It is a demonstration: one real session, or a full mock if no client is ready yet, with me watching, then an honest conversation about what worked and what did not.")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 16 }}>{tr("This protects you as much as the brand. A trainer who is rushed out before they are ready loses their first clients and their confidence. We would rather get you genuinely ready.")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#5a5248", fontStyle: "italic" }}>{tr("To be straight about it: this is Praxis confirming you can teach Praxis to our standard. It is not an accredited qualification from an exam board, and we do not pretend otherwise. The honesty is the point, and it is exactly why clients trust the people who carry our name.")}</p>
          </div>
        </div>

        {/* Section 07 - Common questions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>{tr("07 &nbsp;&nbsp;&nbsp; Common Questions")}</span>
          </div>
          <div style={{ maxWidth: 680 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #d8d0c5",
                  paddingBottom: openFaq === i ? 20 : 0,
                  marginBottom: 0,
                }}
              >
                <button
                  className="bt-faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}
                >
                  <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "left" }}>{tr(faq.q)}</p>
                  <span style={{ ...MONO, fontSize: 14, color: "#a8a092", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d", paddingBottom: 4 }}>{tr(faq.a)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Get started */}
        <div id="get-started" style={{ marginTop: 64, borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 48px)" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("Get started")}</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.2px" }}>{tr("Tell me who is already asking you for help.")}</h2>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "rgba(246,241,234,0.65)", marginBottom: 32, maxWidth: 480 }}>{tr("We will map your path to teaching. The first step is a short call.")}</p>

          {formState === "sent" ? (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("Done - we'll be in touch.")}</p>
              <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.5)" }}>{tr("Expect a reply within one working day.")}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>{tr("Name")}</label>
                  <input
                    className="bt-input"
                    style={INPUT}
                    required
                    placeholder={tr("Jane Smith")}
                    value={tr(form.name)}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>{tr("Email")}</label>
                  <input
                    className="bt-input"
                    type="email"
                    style={INPUT}
                    required
                    placeholder={tr("jane@company.com")}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>{tr("Who is already asking you for help?")}</label>
                <textarea
                  className="bt-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 80 }}
                  placeholder={tr("e.g. Three colleagues who saw what I built and want to learn. A few clients who keep asking about AI tools...")}
                  value={form.context}
                  onChange={e => setForm(f => ({ ...f, context: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <p style={{ ...INTER, fontSize: 11, color: "rgba(246,241,234,0.3)", maxWidth: 340 }}>{tr("No marketing. Your details are used only to prepare for and respond to your enquiry.")}</p>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, background: formState === "sending" ? "rgba(255,255,255,0.1)" : "#d97706", color: "#fff", border: "none", borderRadius: 6, padding: "10px 22px", cursor: formState === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                >
                  {formState === "sending" ? "Sending..." : "Book a call →"}
                </button>
              </div>
              {formState === "error" && (
                <p style={{ ...INTER, fontSize: 12, color: "#f87171", marginTop: 10 }}>{tr("Something went wrong - please try again or email daniel@tutto.one")}</p>
              )}
            </form>
          )}

          <p style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.35)", marginTop: 20 }}>{tr("Or email directly: daniel@tutto.one")}</p>
        </div>

        {/* Closing note */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>{tr("On what this is not")}</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", maxWidth: 620, fontStyle: "italic" }}>{tr("It is not a franchise, and it is not a passive income scheme.")}</p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620, marginTop: 8 }}>{tr("You will do real work with real people. What it gives you is the method, the materials, the clients organised alongside you, and a hub that handles what you cannot. That is a more useful foundation than building from scratch, and it is exactly what it says it is.")}</p>
        </div>

        {/* Doc footer */}
        <div className="bt-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{tr("Praxis Trainer Track · tutto.one/become-a-trainer")}</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{tr("Four sessions · 80 / 20")}</span>
        </div>

      </div>
    </div>
  );
}
