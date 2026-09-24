import { useEffect, useState } from "react";
import { usePageTr } from "@/lib/page-fr";
import { PRAXIS_PROGRAMME_FR } from "@/lib/fr/praxis-programme";
import { usePreferences } from "@/lib/preferences";
import { useTrainerCode, bookingHref } from "@/lib/trainer-code";
import { landing } from "@/lib/landing-copy";
import { SITE_TITLE, useT } from "@/lib/i18n";
import { praxisEconomics, trainerEconomics, perMonth, PRAXIS_STACK, stackValue, type StackKey } from "@/lib/pricing";
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

const CTA_PRIMARY: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: 8,
  background: "#d97706", color: "#fff", border: "1px solid #d97706",
  ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "12px 24px",
  borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em",
};
const CTA_SECONDARY: React.CSSProperties = {
  ...CTA_PRIMARY, background: "transparent", color: "#1a1a1a", borderColor: "#1a1a1a",
};

const LABEL: React.CSSProperties = {
  ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6,
};

const FIGURE: React.CSSProperties = {
  display: "block", width: "100%", height: "auto",
  borderRadius: 10, border: "1px solid #d8d0c5",
};

const sessions = [
  {
    n: "01",
    artefact: "You leave with: your AI Use Charter",
    title: "Rules first",
    body: "What goes in, which tools and connections are allowed, what never leaves the building, and what happens when the rule is broken. We set up your assistant safely while we write it.",
  },
  {
    n: "02",
    artefact: "You leave with: a KPI Scorecard per role",
    title: "Define good",
    body: "Pick the jobs that repeat. For each one, write down what good output looks like and how you'd score it. These are your evals: the standard every piece of AI work gets judged against.",
  },
  {
    n: "03",
    artefact: "You leave with: the list of what AI takes over",
    title: "Decide what to hand over",
    body: "Which jobs AI should do, which it shouldn't, and what each one needs to run without you: the inputs, the rules, the check at the end.",
  },
  {
    n: "04",
    artefact: "You leave with: standing briefs for your top three jobs",
    title: "Brief it once",
    body: "Turn each job on the list into standing instructions: the audience, the constraints, an example of good. Written once, read by the assistant every time, so nobody explains the same job twice.",
  },
  {
    n: "05",
    title: "Tools",
    body: "Connect the assistant to your files and the apps you already use. Build the first small tools that do a job end to end, with you in control of what they can touch.",
  },
  {
    n: "06",
    artefact: "You leave with: your Verification Protocol",
    title: "Check it before it ships",
    body: "Score the output against your KPIs. Where it falls short, fix the brief, not the draft. Agree who signs off and what gets checked before anything leaves.",
  },
  {
    n: "07",
    title: "Skills and automation",
    body: "Package what works into skills the whole team can call, and schedule the jobs that should run without anyone asking.",
  },
  {
    n: "08",
    title: "Agents, and a clean handover",
    body: "Your first agent: a job that runs on its own, on your data, checked against your scorecard. Then hand it over cleanly, so it is still changeable in a year.",
  },
];

/**
 * The offer stack, in the order it is read: the core artefacts, then the
 * bonuses, each bonus named with the objection it answers. Values come from
 * PRAXIS_STACK in pricing.ts; only the words live here.
 */
const STACK_COPY: Record<StackKey, { title: string; body: string }> = {
  charter: {
    title: "AI Use Charter",
    body: "What may go into the tools, which tools and connections are allowed, and what happens if the rule is broken. Written in session one.",
  },
  scorecard: {
    title: "KPI Scorecard per role",
    body: "What good output looks like for each job, written down, so feedback stops being \"make it better\".",
  },
  handoverList: {
    title: "Hand-over list",
    body: "Which jobs AI takes over, which it doesn't, and what each one needs to run without you. Decided in session three.",
  },
  briefingLibrary: {
    title: "Briefing Library",
    body: "Standing instructions for your top three jobs, so nobody writes the same brief twice.",
  },
  verification: {
    title: "Verification Protocol",
    body: "How output is checked before it ships, and who signs it off.",
  },
  sessions: {
    title: "Eight live working sessions",
    body: "On your own work, not exercises. Nothing is homework that could be done in the room.",
  },
  fieldGuide: {
    title: "Bonus: The Field Guide",
    body: "For \"my team won't remember this\": every principle on one page per person.",
  },
  asyncReview: {
    title: "Bonus: 30 days of async review",
    body: "For \"it won't stick once you're gone\": one piece of work a week, reviewed.",
  },
  checkIn: {
    title: "Bonus: 90-day check-in call",
    body: "For \"we'll drift back in three months\": we look at what slipped and fix it.",
  },
};

const faqs = [
  {
    q: "Do I need to know how to code?",
    a: "No. You describe what you want in plain language. The assistant writes the code. We use the time to make sure you understand what you are building and why.",
  },
  {
    q: "I have only ever used AI in a chat box. Is this for me?",
    a: "Yes. That is exactly the starting point this is built for.",
  },
  {
    q: "Is my data safe?",
    a: "Your files stay on your own machine. You choose the folder the assistant works in, and that folder is the boundary. It asks before going any further. For regulated or sensitive work, we map your IT and compliance questions before touching anything.",
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
    a: "The AI-Fluent Team is for you and up to four of your team. The Owner's Fast Track is private: one to one, in four sessions, and credited in full if your team follows.",
  },
  {
    q: "What if it doesn't work for us?",
    a: "Pick one recurring piece of work before we start. If by the last session your team can't produce it with AI to the standard on your own scorecard, I keep working with you at no charge until they can. The only condition is that you attend and answer the questions.",
  },
];

/** Prefills the Cal.com booking with what the form already asked for. */
function withContact(href: string, name: string, email: string): string {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}`;
}

export default function PraxisProgramme() {
  const tr = usePageTr(PRAXIS_PROGRAMME_FR);
  const { locale, currency } = usePreferences();
  const econ = praxisEconomics(currency, locale);
  const trainer = trainerEconomics(currency, locale);
  const toolsMonthly = perMonth("toolsMonthly", currency, locale);
  /**
   * Figures go into the sentence at render, so the French stays in the
   * dictionary rather than being branched on in the markup, and the currency
   * toggle reaches copy that is otherwise a plain sentence.
   */
  const fill = (en: string, subs: Record<string, string>) =>
    Object.entries(subs).reduce((acc, [k, v]) => acc.replace(`{${k}}`, v), tr(en));
  useEffect(() => {
    document.title = "The AI-Fluent Team | Praxis | Tutto";
    return () => { document.title = SITE_TITLE; };
  }, []);

  const [form, setForm] = useState({
    name: "", email: "", company: "", teamSize: "", programme: "team", task: "", trainerCode: "",
  });
  const trainerCode = useTrainerCode();
  const t = useT();
  /* Two steps, in this order. The free 60-minute session is the proof, the
     same offer and label as the home page. Booking the course comes after:
     a short form, then the 15-minute call to say hello and set dates, which
     is offered once the form is in. Both carry the referring trainer's code. */
  const proofSession = bookingHref("https://cal.com/tuttoone/60-min-meeting", trainerCode);
  const greetingCall = bookingHref("https://cal.com/tuttoone/15min", trainerCode);
  // Seed the field from the visit's attribution once it is known, but never
  // overwrite something the visitor has typed themselves.
  useEffect(() => {
    if (trainerCode) setForm(f => (f.trainerCode ? f : { ...f, trainerCode }));
  }, [trainerCode]);
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
          message: [
            "Praxis Programme: course booking",
            `Programme: ${form.programme === "fastTrack" ? "The Owner's Fast Track" : "The AI-Fluent Team"}`,
            `Company: ${form.company || "-"}`,
            `Team size: ${form.teamSize || "-"}`,
            "",
            `The job they keep repeating: ${form.task || "-"}`,
          ].join("\n"),
          trainerCode: form.trainerCode.trim() || null,
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

        .pp-split { display: grid; grid-template-columns: 1fr; gap: 28px; align-items: center; }
        @media (min-width: 760px) { .pp-split { grid-template-columns: 1.25fr 1fr; gap: 36px; } }

        @media (min-width: 680px) { .pp-fill { height: 0 !important; min-height: max(100%, 230px); object-fit: cover; object-position: center 30%; } }

        .pp-sessions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 680px) { .pp-sessions { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .pp-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .pp-form-row { display: grid; grid-template-columns: 1fr; gap: 12px; margin-bottom: 12px; }
        @media (min-width: 520px) { .pp-form-row { grid-template-columns: 1fr 1fr; } }
        .pp-input option { color: #1a1a1a; }

        .pp-input::placeholder { color: rgba(246,241,234,0.3); }
        .pp-input:focus { border-color: rgba(217,119,6,0.6) !important; }

        .pp-faq-btn { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0; }
      `}</style>
      <div className="pp-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Dark intro card */}
        <div style={{ borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 52px)", marginBottom: 56, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("The Praxis Programme")}</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(22px, 4vw, 36px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 24, letterSpacing: "-0.3px" }}>{tr("Eight sessions.")}<br />{tr("Your team stops repeating itself.")}</h2>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 16, maxWidth: 560 }}>{tr("Your staff already use AI, and it saves them nothing: ask, fix, ask again. Over eight sessions we fix it in order, on your own work. The rules, a KPI for each job, what to hand over. Then the tools, skills and automations that do it without you.")}</p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.8, color: "rgba(246,241,234,0.72)", marginBottom: 20, maxWidth: 560 }}>{tr("No coding background needed. You leave with the charter, the scorecards, the briefs and the checks, and the jobs that used to repeat, handed over.")}</p>
          <p style={{ ...INTER, fontSize: 15, lineHeight: 1.7, fontWeight: 600, color: "#f6f1ea", marginBottom: 24, maxWidth: 560 }}>{t(landing.close.body)}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <a href={proofSession} target="_blank" rel="noopener noreferrer" style={CTA_PRIMARY}>{t(landing.hero.cta)} →</a>
            <a href="#get-started" style={{ ...CTA_SECONDARY, color: "#f6f1ea", borderColor: "rgba(246,241,234,0.3)" }}>{tr("Book your first course")}</a>
          </div>
          <p style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.4)", marginTop: 16 }}>{tr("You and up to four of your team · Online or in person")}</p>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>{tr("The AI-Fluent Team · Eight Sessions")}</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* The problem, then the picture of it: the reader should recognise
            their own team before being told who the programme is for. */}
        <div className="pp-split" style={{ marginBottom: 64 }}>
          <div>
            <h1 style={{ ...ROBOTO, fontSize: "clamp(30px, 4.6vw, 46px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a", marginBottom: 24 }}>{tr("Most teams start with the tools.")}<br />{tr("That's why nothing sticks.")}</h1>
            <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>{tr("Your staff have typed questions into ChatGPT or Claude. Some answers were useful. Most needed fixing, and the time saved went on the fixing. The problem isn't the tool. Nobody set the rules, defined what good looks like, or decided what to hand over. This programme does those three first, on your own work, then builds on them.")}</p>
          </div>
          <img src="/artwork/team-at-screens.webp" width={1400} height={1048} loading="lazy" alt={tr("A small team around a desk of screens, working through AI output together")} style={FIGURE} />
        </div>

        {/* Section 01 - Who this is for */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("Who This Is For")}</h2>
          </div>
          <div className="pp-cols-2">
            {[
              { label: "Your team already uses AI", body: "And it takes as long as before, because every answer gets checked, fixed and asked again." },
              { label: "A job that repeats", body: "The quote, the report, the weekly export. Work a machine could do, if someone set it up properly." },
              { label: "You can't see what goes in", body: "Client files and personal data, pasted into tools nobody vetted. You want a rule before it becomes a problem." },
              { label: "Nobody needs to code", body: "Nobody on your team has to become a developer. You want the work done once, not a new hobby." },
            ].map((item) => (
              <div key={tr(item.label)} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", marginBottom: 8 }}>{tr(item.label)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(item.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 02 - What you'll be able to do */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("What You Will Be Able to Do by the End")}</h2>
          </div>
          <div className="pp-cols-2">
            {[
              { body: "Set the rules: what goes in, which tools, and what never leaves the building." },
              { body: "Judge AI output against a KPI for each job, not a feeling." },
              { body: "Decide which jobs to hand over, and what each needs to run without you." },
              { body: "Build the tools, skills and automations that do those jobs, by describing them in plain language." },
              { body: "Keep building on your own after the programme ends." },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 14, alignItems: "flex-start", border: "1px solid #d8d0c5", borderRadius: 10, padding: "18px 20px", background: "#faf8f5" }}>
                <span style={{ ...MONO, fontSize: 9, fontWeight: 700, width: 18, height: 18, borderRadius: "50%", background: "#d97706", color: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                  {i + 1}
                </span>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d", margin: 0 }}>{tr(item.body)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 03 - The eight sessions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 12 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("The Eight Sessions")}</h2>
          </div>
          <p style={{ ...INTER, fontSize: 13, color: "#7a7568", lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>{tr("Weekly, over roughly two months. The first four set the foundations: the rules, the standard, the decisions, the briefs. The last four build on them.")}</p>
          <div className="pp-sessions">
            {sessions.map((s) => (
              <div key={s.n} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 10, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{s.n}</span>
                <p style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, color: "#1a1a1a", marginBottom: 8, paddingRight: 24 }}>{tr(s.title)}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(s.body)}</p>
                {s.artefact && (
                  <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#d97706", marginTop: 10 }}>{tr(s.artefact)}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 04 - What you finish with */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("What You Finish With")}</h2>
          </div>
          <div className="pp-split">
          <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "32px 28px", background: "#faf8f5" }}>
            <p style={{ ...ROBOTO, fontSize: 18, fontWeight: 800, color: "#1a1a1a", marginBottom: 14, letterSpacing: "-0.2px" }}>{tr("The rules, the scorecards, and the jobs handed over.")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 16 }}>{tr("Your charter, a KPI scorecard for each role, standing briefs and checks for your top three jobs, and the tools you built on them. A certificate records what you made, not just that you turned up.")}</p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#5a5248" }}>{tr("A note on honesty, because it sets the right expectation: you will get most of the way there yourself. On anything complex, the last stretch you finish by hand or hand off. Even getting most of the way is a large saving on how the work is done today - and that is the saving we are after.")}</p>
          </div>
          <img src="/artwork/agent-scorecard.webp" width={1400} height={1048} loading="lazy" alt={tr("An agent scorecard on a clipboard, filled in by hand next to a laptop and a calculator")} style={FIGURE} />
          </div>
        </div>

        {/* Section 05 - Why a person, placed after the deliverables and before the price */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("Why a Person, Not Another Video")}</h2>
          </div>
          <div style={{ maxWidth: 700 }}>
            {[
              { label: "Tailored to your actual work", body: "Not a generic example you have to translate. We start with the task that eats your week and build from there." },
              { label: "We meet you where you are", body: "No burying you in tools you have never heard of to look clever. Every session starts from where you actually are." },
              { label: "The fiddly parts are where a guide earns their keep", body: "Installing the tool, the first setup, the moment something breaks: that is exactly the part the free videos skip, and exactly where most people quietly give up." },
            ].map((item, i) => (
              <div key={tr(item.label)} style={{ display: "flex", gap: 20, marginBottom: i < 2 ? 28 : 0 }}>
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

        {/* Section 06 - How it works */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("How It Works")}</h2>
          </div>
          <div className="pp-cols-2">
            {[
              { label: "Format", body: "You and up to four of your team. For one to one, take The Owner's Fast Track. Either way it is built on your own work, not a syllabus." },
              { label: "Your use cases", body: "Before we start, send the jobs you keep repeating: the quote, the report, the weekly export. We work on those from the first session. The group evenings use generic examples. This doesn't." },
              { label: "Cadence", body: "One session a week, 90 minutes each, over roughly two months. A short practice task between each session." },
              { label: "Where", body: "Online, via Teams or Google Meet. In person on request." },
              { label: "What you need", body: "A laptop - Mac or Windows. An account with the AI assistant of your choice. We set up everything else together in the first session." },
            ].map((item) => (
              <div key={tr(item.label)} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "22px 20px", background: "#faf8f5" }}>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 10 }}>{tr(item.label)}</p>
                <p style={{ ...INTER, fontSize: 13, lineHeight: 1.75, color: "#3d3d3d" }}>{tr(item.body)}</p>
              </div>
            ))}
            {/* Five cards leave the grid one short; the repeating job fills it. */}
            <img src="/artwork/weekly-desk-job.webp" width={1400} height={1048} loading="lazy" alt={tr("A desk with the weekly report on screen, a calculator, and a red thread running between them")} className="pp-fill" style={FIGURE} />
          </div>
        </div>

        {/* Choice of assistant */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ background: "#f0ece6", borderRadius: 10, padding: "24px 26px", maxWidth: 660 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 10 }}>
              {tr("On the choice of assistant")}
            </p>
            <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d" }}>
              {tr("We teach with Claude as the worked example, because it is the one most people arrive with. It is not a requirement. The same method works with Mistral, with OpenAI, or with open-weight models running entirely on your own machine, which is the right answer when the work cannot leave the building. You choose the assistant; we set it up with you in the first session.")}
            </p>
          </div>
        </div>

        {/* Section 07 - Pricing */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("Everything You Get, and What It's Worth")}</h2>
          </div>
          <p style={{ ...INTER, fontSize: 13, color: "#7a7568", lineHeight: 1.6, marginBottom: 28, maxWidth: 560 }}>{tr("Each piece priced as if you bought it on its own. Then the guarantee, then what you actually pay.")}</p>
          {/* Hormozi order: the stack, then the guarantee, then the price — so
              the number lands after the risk has been taken away. */}
          <div style={{ border: "1px solid #d8d0c5", borderRadius: 10, background: "#faf8f5", maxWidth: 680 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", padding: "20px 22px 0" }}>{tr("The AI-Fluent Team · what you get")}</p>
            {PRAXIS_STACK.map((row) => (
              <div key={row.key} style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "14px 22px", borderBottom: "1px solid #e8e1d7" }}>
                <div>
                  <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 700, color: row.bonus ? "#d97706" : "#1a1a1a", marginBottom: 4 }}>{tr(STACK_COPY[row.key].title)}</p>
                  <p style={{ ...INTER, fontSize: 12, lineHeight: 1.65, color: "#5a5248", margin: 0 }}>{tr(STACK_COPY[row.key].body)}</p>
                </div>
                <p style={{ ...MONO, fontSize: 12, color: "#7a7568", whiteSpace: "nowrap", margin: 0 }}>{stackValue(row.key, currency, locale)}</p>
              </div>
            ))}
            <div style={{ display: "flex", justifyContent: "space-between", gap: 16, padding: "16px 22px" }}>
              <p style={{ ...ROBOTO, fontSize: 14, fontWeight: 800, color: "#1a1a1a", margin: 0 }}>{tr("Total stated value")}</p>
              <p style={{ ...MONO, fontSize: 14, fontWeight: 700, color: "#1a1a1a", margin: 0 }}>{econ.stackTotal}</p>
            </div>
          </div>
          {econ.specialActive && (
            <p style={{ ...INTER, fontSize: 12, color: "#5a5248", lineHeight: 1.7, marginTop: 12, maxWidth: 680 }}>
              {fill("The 30 days of async review is included for anyone who starts by {date}. After that it is an extra.", { date: econ.specialEnds })}
            </p>
          )}

          <div style={{ marginTop: 28, marginBottom: 28, borderRadius: 10, background: "#1a1a1a", padding: "24px 26px", maxWidth: 680 }}>
            <p style={{ ...CAPS, fontSize: 9, color: "#d97706", marginBottom: 12 }}>{tr("The guarantee")}</p>
            <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, lineHeight: 1.55, color: "#f6f1ea", marginBottom: 10 }}>{tr("Pick one recurring piece of work before we start. By the last session your team produces it with AI to the standard on your own scorecard, or I keep working with you at no charge until they do.")}</p>
            <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: "rgba(246,241,234,0.6)", margin: 0 }}>{tr("The only condition is that you attend the sessions and answer the questions.")}</p>
          </div>

          <p style={{ ...CAPS, fontSize: 10, color: "#1a1a1a", marginBottom: 14 }}>{tr("What you pay")}</p>
          <div className="pp-cols-2">
            {[
              {
                label: "The AI-Fluent Team",
                was: econ.teamRegular,
                price: econ.course,
                note: tr("Eight 90-minute sessions for you and up to four of your team. Everything in the stack above."),
              },
              {
                label: "The Owner's Fast Track",
                was: econ.fastTrackRegular,
                price: econ.fastTrack,
                note: tr("Four 90-minute sessions, private and one to one. The same artefacts, scoped to you, with the Field Guide and 30 days of async review. Credited in full if your team follows."),
              },
            ].map((p) => (
              <div
                key={p.label}
                style={{
                  border: "1px solid #d8d0c5",
                  borderRadius: 10,
                  padding: "24px 20px",
                  background: "#faf8f5",
                  position: "relative",
                }}
              >
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 12 }}>{tr(p.label)}</p>
                <p style={{ ...ROBOTO, fontSize: 32, fontWeight: 900, color: "#1a1a1a", marginBottom: 4, letterSpacing: "-1px" }}>
                  {econ.specialActive && (
                    <s style={{ fontSize: 20, fontWeight: 400, color: "#a8a092", marginRight: 12, letterSpacing: 0 }}>{p.was}</s>
                  )}
                  {econ.specialActive ? p.price : p.was}
                </p>
                {econ.specialActive && (
                  <p style={{ ...INTER, fontSize: 11, fontWeight: 600, color: "#d97706", marginBottom: 12 }}>
                    {fill("Back-to-work price until {date}", { date: econ.specialEnds })}
                  </p>
                )}
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.7, color: "#5a5248" }}>{p.note}</p>
              </div>
            ))}
          </div>

          {/* Ask for the call while the price and the guarantee are on screen,
              rather than only at the foot of the page after the questions. */}
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center", marginTop: 24 }}>
            <a href={proofSession} target="_blank" rel="noopener noreferrer" style={CTA_PRIMARY}>{t(landing.hero.cta)} →</a>
            <a href="#get-started" style={CTA_SECONDARY}>{tr("Book your first course")}</a>
          </div>

          {/* The referral used to be a fourth card with a "best value" badge on
              it, which sold the discount harder than the programme. It is a
              term of the programme, so it reads as one. */}
          <div style={{ marginTop: 20, padding: "16px 20px", border: "1px solid #d8d0c5", borderRadius: 8, maxWidth: 560 }}>
            <p style={{ ...INTER, fontSize: 12, color: "#5a5248", lineHeight: 1.7 }}>
              {fill(
                "Refer a friend: {credit} off your programme for every person you refer who enrols, up to {cap}.",
                { credit: econ.referralCredit, cap: econ.referralCap },
              )}
            </p>
            <p style={{ ...INTER, fontSize: 11, color: "#8a8276", lineHeight: 1.7, marginTop: 8 }}>
              {tr("Referral credits apply to courses taught by participating trainers.")}
            </p>
          </div>
          <p style={{ ...INTER, fontSize: 12, color: "#5a5248", lineHeight: 1.7, marginTop: 20, maxWidth: 560 }}>
            {tr("Start with the free 60-minute session: proof on one of your own jobs before you spend anything. When you book the course, a 15-minute call to say hello and set the dates comes with it. Both programmes are invoiced, ex VAT.")}{" "}
            {tr("We also run free sessions from time to time. They are general rather than built around your use case:")}{" "}
            <a href="/calendar" style={{ color: "#d97706" }}>{tr("see Events")}</a>.
          </p>
          <div style={{ marginTop: 20, padding: "16px 20px", background: "#f0ece6", borderRadius: 8, maxWidth: 560 }}>
            <p style={{ ...INTER, fontSize: 12, color: "#5a5248", lineHeight: 1.7 }}>
              {tr("Running the tools you build costs about")}{" "}
              <strong style={{ color: "#1a1a1a" }}>{toolsMonthly}</strong>{" "}
              {tr(
                "for a subscription to a frontier AI system (Claude, Mistral or OpenAI), or nothing at all if you run open-weight models on your own hardware. The tools themselves run on your machine, with no per-use charges.",
              )}
            </p>
          </div>
        </div>

        {/* Section 08 - Common questions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <h2 style={{ ...ROBOTO, fontSize: 22, fontWeight: 800, color: "#1a1a1a", letterSpacing: "-0.2px", margin: 0 }}>{tr("Common Questions")}</h2>
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

        {/* Etymology / footer note */}
        <div style={{ marginBottom: 8, paddingTop: 8 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>{tr("On what this will not do")}</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", maxWidth: 620, fontStyle: "italic" }}>{tr("It will not make you a software engineer in eight weeks.")}</p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620, marginTop: 8 }}>{tr("It will make you someone who can build genuinely useful things, and who knows when a job is big enough to call in a developer, and how to brief them when you do. That is a more valuable place to stand than it sounds.")}</p>
        </div>

        {/* Get started */}
        <div id="get-started" style={{ marginTop: 64, borderRadius: 12, background: "#1a1a1a", padding: "clamp(28px, 5vw, 48px)" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 18 }}>{tr("Book your first course")}</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 800, lineHeight: 1.2, color: "#f6f1ea", marginBottom: 16, letterSpacing: "-0.2px" }}>{tr("Tell me about your team. Then we pick the dates.")}</h2>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "rgba(246,241,234,0.65)", marginBottom: 32, maxWidth: 480 }}>{tr("A few details so the first session starts on your work, not on introductions. Once they're in, you book a 15-minute call to say hello and set the dates.")}</p>

          {formState === "sent" ? (
            <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 8, padding: "28px 24px", textAlign: "center" }}>
              <p style={{ ...ROBOTO, fontSize: 16, fontWeight: 700, color: "#f6f1ea", marginBottom: 6 }}>{tr("Got it. One step left.")}</p>
              <p style={{ ...INTER, fontSize: 13, color: "rgba(246,241,234,0.6)", marginBottom: 20 }}>{tr("Pick a time for the 15-minute call: we say hello, check the fit, and set the dates.")}</p>
              <a href={withContact(greetingCall, form.name, form.email)} target="_blank" rel="noopener noreferrer" style={CTA_PRIMARY}>{tr("Book the 15-minute call")} →</a>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, padding: "24px" }}>
              <div className="pp-form-row">
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>{tr("Name")}</label>
                  <input
                    className="pp-input"
                    style={INPUT}
                    required
                    placeholder={tr("Jane Smith")}
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>{tr("Email")}</label>
                  <input
                    className="pp-input"
                    type="email"
                    style={INPUT}
                    required
                    placeholder={tr("jane@company.com")}
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  />
                </div>
              </div>
              <div className="pp-form-row">
                <div>
                  <label style={LABEL}>{tr("Company")}</label>
                  <input
                    className="pp-input"
                    style={INPUT}
                    required
                    placeholder={tr("Company name")}
                    value={form.company}
                    onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
                  />
                </div>
                <div>
                  <label style={LABEL}>{tr("Who takes part")}</label>
                  <select
                    className="pp-input"
                    style={INPUT}
                    required
                    value={form.teamSize}
                    onChange={e => setForm(f => ({ ...f, teamSize: e.target.value }))}
                  >
                    <option value="" disabled>{tr("Choose")}</option>
                    <option value="Just me">{tr("Just me")}</option>
                    <option value="2-3 people">{tr("2 to 3 people")}</option>
                    <option value="4-5 people">{tr("4 to 5 people")}</option>
                    <option value="More than 5">{tr("More than 5")}</option>
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <label style={LABEL}>{tr("Programme")}</label>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { value: "team", label: "The AI-Fluent Team" },
                    { value: "fastTrack", label: "The Owner's Fast Track" },
                  ].map((o) => (
                    <button
                      key={o.value}
                      type="button"
                      aria-pressed={form.programme === o.value}
                      onClick={() => setForm(f => ({ ...f, programme: o.value }))}
                      style={{
                        ...INTER, fontSize: 13, padding: "9px 14px", borderRadius: 6, cursor: "pointer",
                        background: form.programme === o.value ? "rgba(217,119,6,0.18)" : "rgba(255,255,255,0.07)",
                        border: `1px solid ${form.programme === o.value ? "#d97706" : "rgba(255,255,255,0.15)"}`,
                        color: "#f6f1ea",
                      }}
                    >{tr(o.label)}</button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={LABEL}>{tr("The job you keep repeating")}</label>
                <textarea
                  className="pp-input"
                  style={{ ...INPUT, resize: "vertical", minHeight: 80 }}
                  placeholder={tr("e.g. I spend three hours every Monday compiling a report from five different spreadsheets...")}
                  value={form.task}
                  onChange={e => setForm(f => ({ ...f, task: e.target.value }))}
                />
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ ...CAPS, fontSize: 9, color: "rgba(246,241,234,0.4)", display: "block", marginBottom: 6 }}>
                  {tr("Trainer code")}{" "}
                  <span style={{ textTransform: "none", letterSpacing: 0, color: "rgba(246,241,234,0.25)" }}>{tr("(optional)")}</span>
                </label>
                {/* Prefilled from ?trainer= on any page of this visit. Left
                    editable so somebody handed a code on paper can type it. */}
                <input
                  className="pp-input"
                  style={INPUT}
                  placeholder={tr("If a trainer sent you here")}
                  value={form.trainerCode}
                  onChange={e => setForm(f => ({ ...f, trainerCode: e.target.value }))}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <p style={{ ...INTER, fontSize: 11, color: "rgba(246,241,234,0.3)", maxWidth: 340 }}>{tr("No marketing. Your details are used only to prepare for and respond to your enquiry.")}</p>
                <button
                  type="submit"
                  disabled={formState === "sending"}
                  style={{ ...ROBOTO, fontSize: 13, fontWeight: 700, background: formState === "sending" ? "rgba(255,255,255,0.1)" : "#d97706", color: "#fff", border: "none", borderRadius: 6, padding: "10px 22px", cursor: formState === "sending" ? "default" : "pointer", whiteSpace: "nowrap" }}
                >
                  {formState === "sending" ? tr("Sending...") : tr("Next: pick a call time →")}
                </button>
              </div>
              {formState === "error" && (
                <p style={{ ...INTER, fontSize: 12, color: "#f87171", marginTop: 10 }}>{tr("Something went wrong - please try again or email daniel@tutto.one")}</p>
              )}
            </form>
          )}

          <p style={{ ...INTER, fontSize: 12, color: "rgba(246,241,234,0.35)", marginTop: 20 }}>{tr("Not ready to book?")}{" "}
            <a href={proofSession} target="_blank" rel="noopener noreferrer" style={{ color: "#d97706" }}>{t(landing.hero.cta)}</a>
            {" · "}{tr("Or email directly: daniel@tutto.one")}
          </p>
        </div>

        {/* Trainer track teaser */}
        <div style={{ marginTop: 64, borderRadius: 12, border: "1.5px solid #d97706", background: "#fdf6ec", padding: "clamp(24px, 4vw, 44px)" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 16 }}>{tr("What comes next")}</p>
          <div style={{ display: "flex", gap: 32, flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between" }}>
            <div style={{ maxWidth: 480 }}>
              <h3 style={{ ...ROBOTO, fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 800, color: "#1a1a1a", marginBottom: 12, letterSpacing: "-0.2px", lineHeight: 1.2 }}>{tr("Become a Praxis trainer.")}<br />{tr("Teach it, and earn from it.")}</h3>
              <p style={{ ...INTER, fontSize: 13, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 0 }}>{tr("Four sessions on top of the programme turn you into a trainer. Clients you bring in yourself: you keep 80% of the tuition they pay. Clients Tutto brings in: you keep 60%. I find and organise the clients with you, you deliver the sessions, and a hub is behind you for the hard jobs.")}</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
              <div style={{ border: "1px solid #f0d9b0", borderRadius: 8, padding: "12px 16px", background: "#fff8ee", minWidth: 160 }}>
                <p style={{ ...CAPS, fontSize: 8, color: "#a8a092", marginBottom: 6 }}>{tr("Trainer track")}</p>
                <p style={{ ...ROBOTO, fontSize: 24, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.5px" }}>{trainer.trainerTrack}</p>
                <p style={{ ...INTER, fontSize: 11, color: "#7a7568" }}>{tr("Four sessions")}</p>
              </div>
              <div style={{ border: "1px solid #f0d9b0", borderRadius: 8, padding: "12px 16px", background: "#fff8ee" }}>
                <p style={{ ...CAPS, fontSize: 8, color: "#a8a092", marginBottom: 6 }}>{tr("You keep")}</p>
                <p style={{ ...ROBOTO, fontSize: 24, fontWeight: 900, color: "#d97706", letterSpacing: "-0.5px" }}>{trainer.pctYouSourced}%</p>
                <p style={{ ...INTER, fontSize: 11, color: "#7a7568" }}>{tr("on the clients you bring in yourself")}</p>
              </div>
            </div>
          </div>
          <div style={{ marginTop: 28 }}>
            <a
              href="/become-a-trainer"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#d97706", color: "#fff", ...ROBOTO, fontSize: 13, fontWeight: 700, padding: "11px 22px", borderRadius: 6, textDecoration: "none", letterSpacing: "0.04em" }}
            >{tr("See the trainer track →")}</a>
          </div>
        </div>

        {/* Doc footer */}
        <div className="pp-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{tr("Praxis Programme · tutto.one/praxis-programme")}</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>{tr("Eight sessions · Two months")}</span>
        </div>

      </div>
    </div>
  );
}
