import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Layout";

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

const sessions = [
  {
    n: "01",
    title: "Foundations and your first build",
    body: "See it work before any theory. Understand where AI is brilliant and where it has to be exact, whether your files are safe, and what it costs. Build your first small working thing, live.",
  },
  {
    n: "02",
    title: "The build loop, and capturing your know-how",
    body: "Describe what you want and watch Claude Code build it. Then write down the rules your work follows, in plain English, so the tool applies them every single time. Build a real tool for your own work.",
  },
  {
    n: "03",
    title: "Your tools and surfaces",
    body: "The Claude app and the move into your own files. Connecting Claude to the apps you already use. Letting it do safe work for you, with you in control of what it is allowed to touch.",
  },
  {
    n: "04",
    title: "Keeping versions, and safe handover",
    body: "How to keep versions of your work, hand a tool to a colleague or developer cleanly, and build so it is still changeable in a year rather than a tangle you cannot undo.",
  },
  {
    n: "05",
    title: "How your tools talk to other software",
    body: "What you are paying for and what you are not. What an API is, in plain terms. Keeping everything in one place instead of a knot of half-connected apps. And what 'training an AI' actually means, so you can stop worrying your data is being swallowed.",
  },
  {
    n: "06",
    title: "Build something real, end to end",
    body: "A full build for your own work, mostly driven by you, with me reading the room. You finish the core programme with a tool you use and a certificate that shows what you built.",
  },
  {
    n: "07",
    title: "Going deeper",
    body: "Fixing things when they break. Bigger, multi-part builds. And whichever surface fits your work: design, the web, your documents.",
  },
  {
    n: "08",
    title: "A first integration, and your final build",
    body: "Connect your tool to something else you use. Understand hosting and automation at a level you can act on. Ship your final build.",
  },
];

const faqs = [
  {
    q: "Do I need to know how to code?",
    a: "No. You describe what you want in plain English. Claude Code writes the code. We use the time to make sure you understand what you are building and why.",
  },
  {
    q: "I have only ever used AI in a chat box. Is this for me?",
    a: "Yes. That is exactly the starting point this is built for.",
  },
  {
    q: "Is my data safe?",
    a: "Your files stay on your own machine. You choose the folder Claude Code works in, and that folder is the boundary. It asks before going any further. For regulated or sensitive work, we map your IT and compliance questions before touching anything.",
  },
  {
    q: "What will it cost me to run afterwards?",
    a: "About twenty dollars a month for the subscription. The tools you build run locally and do not charge per use.",
  },
  {
    q: "What if I get stuck between sessions?",
    a: "You get a practice task and a clear way to get unstuck. When something breaks, the fix is usually one screenshot away, and learning that habit is part of the programme.",
  },
  {
    q: "One-to-one or a group?",
    a: "Both are available. Tell me which suits you and we will shape it accordingly.",
  },
];

export default function PraxisProgramme() {
  useEffect(() => {
    document.title = "Praxis — Learn to Build Your Own Tools with Claude Code";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  const [form, setForm] = useState({ name: "", email: "", task: "" });
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
          message: `Praxis Programme enquiry\n\nTask that eats their week: ${form.task}`,
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
        .pp-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .pp-wrap { padding: 64px 32px 80px; } }

        .pp-cols-3 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .pp-cols-3 { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }

        .pp-cols-2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .pp-cols-2 { grid-template-columns: 1fr 1fr; gap: 16px; } }

        .pp-sessions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 680px) { .pp-sessions { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .pp-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .pp-input::placeholder { color: rgba(246,241,234,0.3); }
        .pp-input:focus { border-color: rgba(217,119,6,0.6) !important; }

        .pp-faq-btn { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0; }
      `}</style>
      <div className="pp-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>
            The Praxis Programme
          </p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>
            Build your own tools<br />
            with Claude Code.
          </h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>
            Eight sessions over two months. For people who have used AI in a chat box
            and want to go further. You will build small, working tools that do your
            repetitive work for you, in plain English, with someone sitting beside you
            who has done it before.
          </p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 32, maxWidth: 560 }}>
            No coding background needed. By the end you will have built something you
            actually use, and you will know how to keep building on your own.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a
              href="#get-started"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d97706", color: "#fff", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em", whiteSpace: "nowrap" }}
            >
              Book an intro call →
            </a>
            <span style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)" }}>
              One-to-one or small group · Online or in person
            </span>
          </div>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>Praxis Programme · Eight Sessions · V1</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            B u i l d &nbsp;T h i n g s &nbsp;T h a t &nbsp;W o r k
          </p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(32px, 5.5vw, 56px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
            You will not learn to code.<br />
            You will learn to build.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            You have typed questions into ChatGPT or Claude and got useful answers back. This is the next
            step: using Claude Code to build small, working tools that do your repetitive work for you.
            The internet is full of free tutorials. What a video cannot do is see where you are stuck
            and hear what you are unsure about. That gap - between "I have heard of Claude Code" and
            "I am building" - is the whole reason this programme exists.
          </p>
        </div>

        {/* Section 01 - Who this is for */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; Who This Is For</span>
          </div>
          <div className="pp-cols-2">
            {[
              { label: "Hit the ceiling", body: "You have used AI as a chat assistant and reached the limit of what copy-and-paste can do." },
              { label: "A task that repeats", body: "You have a task you do every week that you suspect a machine could do for you." },
              { label: "Not a developer", body: "You are not trying to become one. You want to make useful things. That is a different goal, and this programme is built around it." },
              { label: "Rather be shown", body: "You would rather be shown than left alone with a pile of conflicting videos. It works for professionals, small teams, and anyone whose week is full of work that repeats." },
            ].map((item) => (
              <div key={item.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{item.label}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02 - Why a person */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>02 &nbsp;&nbsp;&nbsp; Why a Person, Not Another Video</span>
          </div>
          <div style={{ maxWidth: 700 }}>
            {[
              { label: "Tailored to your actual work", body: "Not a generic example you have to translate. We start with the task that eats your week and build from there." },
              { label: "We meet you where you are", body: "No burying you in tools you have never heard of to look clever. Every session starts from where you actually are." },
              { label: "The fiddly parts are where a guide earns their keep", body: "Installing the tool, the first setup, the moment something breaks: that is exactly the part the free videos skip, and exactly where most people quietly give up." },
            ].map((item, i) => (
              <div key={item.label} style={{ display: "flex", gap: 20, marginBottom: i < 2 ? 28 : 0 }}>
                <div style={{ ...MONO, fontSize: 11, color: "#d97706", fontWeight: 700, flexShrink: 0, marginTop: 2, width: 20 }}>
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{item.label}</p>
                  <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 03 - What you'll be able to do */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>03 &nbsp;&nbsp;&nbsp; What You Will Be Able to Do by the End</span>
          </div>
          <div className="pp-cols-2">
            {[
              { body: "Build small working tools for your own work, by describing what you want in plain English." },
              { body: "Capture your own rules and judgement so a tool works the way you do, every time." },
              { body: "Understand what is safe, what it costs, and what it can and cannot do." },
              { body: "Hand a tool to a colleague or a developer cleanly, with no black box." },
              { body: "Keep building on your own after the programme ends." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", border: "1px solid #d8d0c5", borderRadius: 10, padding: "18px 20px", background: "#faf8f5" }}>
                <span style={{ ...MONO, fontSize: 9, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", background: "#d97706", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </span>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d", margin: 0 }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 04 - The eight sessions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 12 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>04 &nbsp;&nbsp;&nbsp; The Eight Sessions</span>
          </div>
          <p style={{ ...INTER, fontSize: 13, color: "#7a7568", lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>
            Weekly, over roughly two months. The first six get you to a confident, independent builder.
            The last two take you deeper, into the kind of work that usually needs a developer.
          </p>
          <div className="pp-sessions">
            {sessions.map((s) => (
              <div key={s.n} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 10, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{s.n}</span>
                <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, paddingRight: 24 }}>{s.title}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 05 - What you finish with */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>05 &nbsp;&nbsp;&nbsp; What You Finish With</span>
          </div>
          <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "32px 28px", background: "#faf8f5", maxWidth: 620 }}>
            <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 14, letterSpacing: "-0.2px" }}>
              The actual tools you built along the way.
            </p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 16 }}>
              A certificate confirming you completed the programme — and, more to the point, the
              tools you built during it. The certificate records what you made, not just that you
              turned up. That is the proof that matters.
            </p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#5a5248" }}>
              A note on honesty, because it sets the right expectation: you will get most of the way
              there yourself. On anything complex, the last stretch you finish by hand or hand off.
              Even getting most of the way is a large saving on how the work is done today — and that
              is the saving we are after.
            </p>
          </div>
        </div>

        {/* Section 06 - How it works */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>06 &nbsp;&nbsp;&nbsp; How It Works</span>
          </div>
          <div className="pp-cols-2">
            {[
              { label: "Format", body: "One-to-one or small group. You choose what suits you." },
              { label: "Cadence", body: "One session a week, about an hour each, over roughly two months. A short practice task between each session." },
              { label: "Where", body: "Online, via Teams or Google Meet. In person on request." },
              { label: "What you need", body: "A laptop — Mac or Windows. A Claude account. We set up everything else together in the first session." },
            ].map((item) => (
              <div key={item.label} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 10 }}>{item.label}</p>
                <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 07 - Pricing */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>07 &nbsp;&nbsp;&nbsp; What It Costs</span>
          </div>
          <div className="pp-cols-3">
            {[
              {
                label: "Per session",
                price: "£200",
                note: "One hour each. Pay as you go, or commit to the full programme.",
              },
              {
                label: "Full programme",
                price: "£1,600",
                note: "All eight sessions. The intro session counts as the first.",
              },
              {
                label: "Refer a friend",
                price: "£800",
                note: "Refer someone who signs up, and the whole course is half price for you — £100 per session.",
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
                  <span style={{ ...CAPS, fontSize: 8, color: "#d97706", letterSpacing: "0.12em", position: "absolute", top: -9, left: 16, background: "#fdf6ec", padding: "0 6px" }}>
                    Best value
                  </span>
                )}
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>{p.label}</p>
                <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-1px" }}>{p.price}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: "#5a5248" }}>{p.note}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#f0ece6", borderRadius: 8, maxWidth: 560 }}>
            <p style={{ ...INTER, fontSize: 12, color: "#5a5248", lineHeight: 1.7 }}>
              Running the tools you build costs about <strong style={{ color: "#1a1a1a" }}>$20/month</strong> for the Claude Code subscription.
              The tools themselves run on your own machine — no per-use charges.
            </p>
          </div>
        </div>

        {/* Section 08 - Common questions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>08 &nbsp;&nbsp;&nbsp; Common Questions</span>
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
                  className="pp-faq-btn"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ padding: "18px 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16 }}
                >
                  <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", margin: 0, textAlign: "left" }}>{faq.q}</p>
                  <span style={{ ...MONO, fontSize: 14, color: "#a8a092", flexShrink: 0 }}>{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d", paddingBottom: 4 }}>{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Get started */}
        <div id="get-started" style={{ marginTop: 64, borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 48px)" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>Get started</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.2px" }}>
            Tell me the task that eats your week.
          </h2>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "rgba(246,241,234,0.65)", marginBottom: 32, maxWidth: 480 }}>
            I will tell you honestly whether this is the right thing for you. The first step is a
            short call.
          </p>

          {formState === "sent" ? (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>Done - we'll be in touch.</p>
              <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.5)" }}>Expect a reply within one working day.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>Name</label>
                  <input
                    className="pp-input"
                    style={INPUT}
                    required
                    placeholder="Jane Smith"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>Email</label>
                  <input
                    className="pp-input"
                    type="email"
                    style={INPUT}
                    required
                    placeholder="jane@company.com"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>The task that eats your week</label>
                <textarea
                  className="pp-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 80 }}
                  placeholder="e.g. I spend three hours every Monday compiling a report from five different spreadsheets..."
                  value={form.task}
                  onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <p style={{ ...INTER, fontSize: 11, color: "rgba(246,241,234,0.3)", maxWidth: 340 }}>
                  No marketing. Your details are used only to prepare for and respond to your enquiry.
                </p>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, background: formState === "sending" ? "rgba(255,255,255,0.1)" : "#d97706", color: "#fff", border: "none", borderRadius: 6, padding: "10px 22px", cursor: formState === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                >
                  {formState === "sending" ? "Sending..." : "Book an intro call →"}
                </button>
              </div>
              {formState === "error" && (
                <p style={{ ...INTER, fontSize: 12, color: "#f87171", marginTop: 10 }}>Something went wrong - please try again or email daniel@tutto.one</p>
              )}
            </form>
          )}

          <p style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.35)", marginTop: 20 }}>
            Or email directly: daniel@tutto.one
          </p>
        </div>

        {/* Etymology / footer note */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>On what this will not do</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", maxWidth: 620, fontStyle: "italic" }}>
            It will not make you a software engineer in eight weeks.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620, marginTop: 8 }}>
            It will make you someone who can build genuinely useful things, and who knows when a job is
            big enough to call in a developer, and how to brief them when you do. That is a more
            valuable place to stand than it sounds.
          </p>
        </div>

        {/* Doc footer */}
        <div className="pp-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Praxis Programme · tutto.one/praxis-programme</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Eight sessions · Two months</span>
        </div>

      </div>
    </div>
  );
}
