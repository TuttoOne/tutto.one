import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Layout";

const ROBOTO: React.CSSProperties = { fontFamily: "'Roboto', -apple-system, sans-serif" };
const INTER: React.CSSProperties = { fontFamily: "'Inter', -apple-system, sans-serif" };
const MONO: React.CSSProperties = { fontFamily: "'JetBrains Mono','Fira Mono','Courier New',monospace" };
const CAPS: React.CSSProperties = { ...INTER, textTransform: "uppercase", letterSpacing: "0.12em" };

function EditorIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#e8eef8", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="3" width="20" height="16" rx="2" stroke="#4a7cc7" strokeWidth="1.5"/>
        <line x1="2" y1="8" x2="22" y2="8" stroke="#4a7cc7" strokeWidth="1.5"/>
        <rect x="5" y="11" width="8" height="1.5" rx="0.75" fill="#4a7cc7"/>
        <rect x="5" y="14" width="5" height="1.5" rx="0.75" fill="#4a7cc7"/>
      </svg>
    </div>
  );
}

function AssistantIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#fce8e0", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="12" y1="4" x2="12" y2="20" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="4" y1="12" x2="20" y2="12" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="6.5" y1="6.5" x2="17.5" y2="17.5" stroke="#c4623a" strokeWidth="1.5"/>
        <line x1="17.5" y1="6.5" x2="6.5" y2="17.5" stroke="#c4623a" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

function FilesystemIcon() {
  return (
    <div style={{ width: 52, height: 52, borderRadius: 12, background: "#ebebeb", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="2" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="3" y1="9" x2="21" y2="9" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="3" y1="15" x2="21" y2="15" stroke="#6b6b6b" strokeWidth="1.5"/>
        <line x1="9" y1="9" x2="9" y2="21" stroke="#6b6b6b" strokeWidth="1.5"/>
      </svg>
    </div>
  );
}

const INPUT: React.CSSProperties = {
  width: "100%", boxSizing: "border-box",
  background: "rgba(255,255,255,0.07)",
  border: "1px solid rgba(255,255,255,0.15)",
  borderRadius: 6, color: "#f6f1ea",
  padding: "9px 12px", fontSize: 13,
  outline: "none",
  ...INTER,
};

function CoursesSection() {
  const { data: courses, isLoading } = useQuery<
    Record<string, { meta: Record<string, any>; path: string }[]>
  >({
    queryKey: ["/api/courses"],
    queryFn: async () => {
      const r = await fetch("/api/courses");
      if (!r.ok) throw new Error("courses unavailable");
      return r.json();
    },
  });

  const MOCK_COURSES: Record<string, { meta: Record<string, any>; path: string }[]> = {
    "praxis-foundations": [
      { meta: { order: 0, title: "Course overview", description: "The mental model behind Praxis — what the folder system is and why it works." }, path: "courses/praxis-foundations/index.md" },
      { meta: { order: 1, title: "The folder is the app" }, path: "courses/praxis-foundations/01-the-folder-is-the-app.md" },
      { meta: { order: 2, title: "SKILL.md — writing instructions that stick" }, path: "courses/praxis-foundations/02-skill-md.md" },
      { meta: { order: 3, title: "Your first run.py" }, path: "courses/praxis-foundations/03-first-run-py.md" },
      { meta: { order: 4, title: "Working with documents" }, path: "courses/praxis-foundations/04-working-with-documents.md" },
    ],
    "train-the-trainer": [
      { meta: { order: 0, title: "Course overview", description: "How to deliver a Praxis session — facilitation, pacing, and handling different rooms." }, path: "courses/train-the-trainer/index.md" },
      { meta: { order: 1, title: "Reading the room" }, path: "courses/train-the-trainer/01-reading-the-room.md" },
      { meta: { order: 2, title: "The intake conversation" }, path: "courses/train-the-trainer/02-intake-conversation.md" },
      { meta: { order: 3, title: "Handling the practical half" }, path: "courses/train-the-trainer/03-practical-half.md" },
    ],
  };

  const display = (!isLoading && courses) ? courses : MOCK_COURSES;

  const labels: Record<string, string> = {
    "praxis-foundations": "Praxis Foundations",
    "train-the-trainer": "Train the Trainer",
  };

  return (
    <section className="py-16 bg-gray-50 border-t border-gray-200">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="text-xl font-semibold mb-2">Self-study course material</h2>
        <p className="text-gray-500 text-sm mb-8">
          Work through the concepts at your own pace before a live session, or revisit them after.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          {Object.entries(display).map(([slug, lessons]) => {
            const overview = lessons.find((l) => l.meta.order === "0" || l.meta.order === 0);
            const numbered = lessons.filter((l) => Number(l.meta.order) > 0);
            return (
              <div key={slug} className="bg-white rounded border border-gray-200 p-6">
                <h3 className="font-semibold mb-1">{labels[slug] ?? slug}</h3>
                {overview && (
                  <p className="text-gray-500 text-xs mb-4">{overview.meta.description}</p>
                )}
                <ol className="space-y-1.5">
                  {numbered.map((l) => {
                    const file = l.path.split("/").pop()?.replace(".md", "");
                    return (
                      <li key={l.path} className="flex gap-2 items-start">
                        <span className="text-gray-300 text-xs w-4 shrink-0 pt-0.5">
                          {l.meta.order}.
                        </span>
                        <Link
                          href={`/praxis/learn/${slug}/${file}`}
                          className="text-sm text-gray-700 hover:text-black leading-snug"
                        >
                          {l.meta.title}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
                <Link
                  href={`/praxis/learn/${slug}`}
                  className="inline-block mt-5 text-xs text-gray-400 hover:text-gray-700 underline"
                >
                  Course overview →
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

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

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis - Client Training";
    return () => { document.title = "Tutto | AI Consulting"; };
  }, []);

  const [form, setForm] = useState({ name: "", email: "", industry: "", goals: "", aiHistory: "" });
  const [formState, setFormState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState("sending");
    try {
      const message = [
        `Industry: ${form.industry}`,
        `What they want from AI: ${form.goals}`,
        `Previous AI usage: ${form.aiHistory}`,
      ].join("\n\n");
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, message }),
      });
      if (!res.ok) throw new Error();
      setFormState("sent");
    } catch {
      setFormState("error");
    }
  };

  const cols = [
    {
      num: "i.",
      Icon: EditorIcon,
      title: "The editor",
      sub: "Where you work · Free",
      body: "An open code editor of your choice - these are usually free. It shows the files and lets you edit, search, and talk to your chosen assistant in normal language. Nothing magical, just the workshop bench.",
    },
    {
      num: "ii.",
      Icon: AssistantIcon,
      title: "The assistant",
      sub: "The intelligence · ~$20/mo",
      body: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version (e.g. Claude at about $20/month) - that's what keeps the work fully secure.",
    },
    {
      num: "iii.",
      Icon: FilesystemIcon,
      title: "Your filesystem",
      sub: "What you already own",
      body: "Plain folders, plain files - on the computer you already own. No cloud, no database, no proprietary format. Just the same disk you've been using for years. The thing that makes it yours.",
    },
  ];

  const items = [
    { tag: "A", name: "SKILL.md", body: "The instructions you'd give a new hire on day one - written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour." },
    { tag: "B", name: "run.py", body: "A short script that does the actual work - pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you." },
    { tag: "C", name: "documents/", body: "Whatever the work needs to process - PDFs, spreadsheets, transcripts, contracts. Drop files in. Pull files out. No upload step." },
    { tag: "D", name: "Version control, optional", body: "Because it's a folder, the standard tools just work - git, Time Machine, Dropbox, a USB stick. There's nothing special to back up." },
  ];

  return (
    <div style={{ background: "#f6f1ea", minHeight: "100vh", ...INTER }}>
      <Header />
      <style>{`
        .px-wrap { padding: 64px 20px 80px; }
        @media (min-width: 600px) { .px-wrap { padding: 64px 32px 80px; } }

        .px-cols-3 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .px-cols-3 { grid-template-columns: 1fr 1fr 1fr; gap: 16px; } }

        .px-cols-2 { display: grid; grid-template-columns: 1fr; gap: 36px; align-items: start; }
        @media (min-width: 680px) { .px-cols-2 { grid-template-columns: 1fr 1fr; gap: 48px; } }

        .pp-cols-2 { display: grid; grid-template-columns: 1fr; gap: 14px; }
        @media (min-width: 680px) { .pp-cols-2 { grid-template-columns: 1fr 1fr; gap: 16px; } }

        .pp-sessions { display: grid; grid-template-columns: 1fr; gap: 12px; }
        @media (min-width: 680px) { .pp-sessions { grid-template-columns: 1fr 1fr; gap: 14px; } }

        .px-connector { display: flex; align-items: center; gap: 10px; margin-top: 24px; }
        .px-connector-line { flex: 1; height: 1px; background: #c8bfb3; }
        .px-connector-dot { width: 7px; height: 7px; border-radius: 50%; background: #1a1a1a; flex-shrink: 0; }
        @media (max-width: 679px) {
          .px-connector-line, .px-connector-dot { display: none; }
          .px-connector { justify-content: center; }
        }

        .px-tree-label { font-family: 'JetBrains Mono','Fira Mono','Courier New',monospace; font-size: 10px; color: #a8a092; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        @media (max-width: 479px) { .px-tree-label { display: none; } }

        .px-footer-bar { display: flex; justify-content: space-between; align-items: center; border-top: 1.5px solid #1a1a1a; margin-top: 48px; padding-top: 14px; gap: 8px; flex-wrap: wrap; }

        .px-input::placeholder { color: rgba(246,241,234,0.3); }
        .px-input:focus { border-color: rgba(217,119,6,0.6) !important; }

        .pp-faq-btn { width: 100%; text-align: left; background: none; border: none; cursor: pointer; padding: 0; }
      `}</style>
      <div className="px-wrap" style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* ── Preamble ── */}
        <div style={{ borderRadius: 10, background: "#1a1a1a", padding: "clamp(22px, 4vw, 40px)", marginBottom: 48, marginTop: 32 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.14em", marginBottom: 14 }}>
            What Praxis is
          </p>
          <p style={{ ...ROBOTO, fontSize: "clamp(16px, 2.8vw, 22px)", fontWeight: 700, lineHeight: 1.35, color: "#f6f1ea", marginBottom: 14, maxWidth: 540 }}>
            Coaching, teaching, and guiding people through what setting up AI looks like for them.
          </p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "rgba(246,241,234,0.6)", maxWidth: 520 }}>
            Every session is built around your context, your files, and your work. No generic demos. You leave with a working system and the understanding to keep building on your own.
          </p>
        </div>

        {/* Doc header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #1a1a1a", padding: "18px 0", marginBottom: 64 }}>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>Praxis · Client Training One-Pager · V1</span>
          <span style={{ ...CAPS, fontSize: 10, color: "#1a1a1a" }}>01 / 01</span>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <p style={{ ...CAPS, fontSize: 10, letterSpacing: "0.28em", color: "#1a1a1a" }}>
            A &nbsp;M e n t a l &nbsp;M o d e l &nbsp;i n &nbsp;O n e &nbsp;P a g e
          </p>
        </div>

        {/* Hero */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ ...ROBOTO, fontSize: "clamp(36px, 6vw, 60px)", fontWeight: 900, lineHeight: 1.1, letterSpacing: "-0.5px", color: "#1a1a1a" }}>
            The folder is the app.<br />
            It runs on your machine.<br />
            It belongs to you.
          </h1>
        </div>

        {/* Intro */}
        <div style={{ maxWidth: 620, marginBottom: 64 }}>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d" }}>
            You don't need a proprietary platform or an account with us. The only thing you'll
            need to subscribe to is Claude - about $20 a month - and a free code editor. Point
            all three at the same folder on your machine. That folder, and what's inside it,
            is your app.
          </p>
        </div>

        {/* Section 01 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>01 &nbsp;&nbsp;&nbsp; The Ingredients</span>
          </div>
          <div className="px-cols-3">
            {cols.map((col) => (
              <div key={col.num} style={{ border: "1px solid #d8d0c5", borderRadius: 10, padding: "24px 20px", background: "#faf8f5", position: "relative" }}>
                <span style={{ ...MONO, fontSize: 11, color: "#b0a898", position: "absolute", top: 16, right: 18 }}>{col.num}</span>
                <col.Icon />
                <h3 style={{ ...ROBOTO, fontSize: 20, fontWeight: 700, color: "#1a1a1a", marginBottom: 6 }}>{col.title}</h3>
                <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 14 }}>{col.sub}</p>
                <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{col.body}</p>
              </div>
            ))}
          </div>
          <div className="px-connector">
            <div className="px-connector-line" />
            <div className="px-connector-dot" />
            <div className="px-connector-line" />
            <div style={{ border: "1px solid #c8bfb3", borderRadius: 20, padding: "5px 16px", flexShrink: 0, background: "#f6f1ea" }}>
              <span style={{ ...MONO, fontSize: 11, color: "#5a5248" }}>point all three at the same folder ↓</span>
            </div>
            <div className="px-connector-line" />
            <div className="px-connector-dot" />
            <div className="px-connector-line" />
          </div>
        </div>

        {/* Section 02 */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 36 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>02 &nbsp;&nbsp;&nbsp; The Output - A Folder on Disk</span>
          </div>
          <div className="px-cols-2">
            <div>
              <p style={{ ...MONO, fontSize: 12, color: "#7a7568", marginBottom: 16 }}>~/Praxis/folder</p>
              <div style={{ border: "1px solid #c8bfb3", borderRadius: 8, overflow: "hidden", background: "#fff" }}>
                <div style={{ padding: "10px 16px", borderBottom: "1px solid #e8e2d8", background: "#f9f6f1" }}>
                  <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a" }}><span style={{ marginRight: 6 }}>▾</span> folder/</span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092", marginLeft: 12 }}>your project</span>
                </div>
                {[
                  { name: "SKILL.md",   label: "the rules · written in plain English", tag: "A" },
                  { name: "run.py",     label: "the script · the work it does",        tag: "B" },
                  { name: "documents/", label: "your data · the inputs",               tag: "C" },
                  { name: "output/",    label: "what gets produced",                   tag: "" },
                ].map((row) => (
                  <div key={row.name} style={{ padding: "8px 16px", borderBottom: "1px solid #f0ece6", display: "flex", gap: 12, alignItems: "center" }}>
                    {row.tag
                      ? <span style={{ ...MONO, fontSize: 9, fontWeight: 600, width: 16, height: 16, borderRadius: "50%", background: "#1a1a1a", color: "#f6f1ea", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{row.tag}</span>
                      : <span style={{ width: 16, flexShrink: 0 }} />
                    }
                    <span style={{ ...MONO, fontSize: 11, color: "#1a1a1a", minWidth: 110 }}>- {row.name}</span>
                    <span className="px-tree-label">{row.label}</span>
                  </div>
                ))}
                <div style={{ padding: "8px 16px", background: "#f9f6f1", display: "flex", justifyContent: "space-between" }}>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>4 items · ~12 KB</span>
                  <span style={{ ...MONO, fontSize: 10, color: "#a8a092" }}>opens in any editor · runs anywhere</span>
                </div>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
              {items.map((item) => (
                <div key={item.tag} style={{ display: "flex", gap: 16 }}>
                  <span style={{ ...MONO, fontSize: 10, fontWeight: 600, width: 20, height: 20, borderRadius: "50%", background: "#1a1a1a", color: "#f6f1ea", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>{item.tag}</span>
                  <div>
                    <p style={{ ...ROBOTO, fontSize: 12, fontWeight: 700, color: "#1a1a1a", marginBottom: 5 }}>{item.name}</p>
                    <p style={{ ...INTER, fontSize: 12, lineHeight: 1.75, color: "#3d3d3d" }}>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── The Praxis Programme ── */}
        <div style={{ borderTop: "2px solid #1a1a1a", paddingTop: 24, marginBottom: 64, marginTop: 72 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#d97706", letterSpacing: "0.18em", marginBottom: 8 }}>The Praxis Programme</p>
          <h2 style={{ ...ROBOTO, fontSize: "clamp(24px, 4vw, 38px)", fontWeight: 900, lineHeight: 1.15, color: "#1a1a1a", letterSpacing: "-0.3px" }}>
            You will not learn to code.<br />
            You will learn to build.
          </h2>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.75, color: "#3d3d3d", maxWidth: 620, marginTop: 20 }}>
            Eight sessions over two months. For people who have used AI in a chat box
            and want to go further. You will build small, working tools that do your
            repetitive work for you, in plain English, with someone sitting beside you
            who has done it before.
          </p>
        </div>

        {/* PP Section 01 - Who this is for */}
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

        {/* PP Section 02 - Why a person */}
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

        {/* PP Section 03 - What you'll be able to do */}
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

        {/* PP Section 04 - The eight sessions */}
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

        {/* PP Section 05 - What you finish with */}
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

        {/* PP Section 06 - How it works */}
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

        {/* PP Section 08 - Common questions */}
        <div style={{ marginBottom: 56 }}>
          <div style={{ borderTop: "1.5px solid #1a1a1a", paddingTop: 14, marginBottom: 28 }}>
            <span style={{ ...CAPS, fontSize: 10 }}>07 &nbsp;&nbsp;&nbsp; Common Questions</span>
          </div>
          <div style={{ maxWidth: 680 }}>
            {faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #d8d0c5",
                  paddingBottom: openFaq === i ? 20 : 0,
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

        {/* What this will not do */}
        <div style={{ marginBottom: 56, paddingTop: 8 }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>A note on expectations</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", maxWidth: 620, fontStyle: "italic" }}>
            It will not make you a software engineer in eight weeks.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620, marginTop: 8 }}>
            It will make you someone who can build genuinely useful things, and who knows when a job is
            big enough to call in a developer, and how to brief them when you do. That is a more
            valuable place to stand than it sounds.
          </p>
        </div>

        {/* Etymology */}
        <div style={{ marginTop: 56, paddingTop: 40, borderTop: "1px solid #d8d0c5" }}>
          <p style={{ ...CAPS, fontSize: 9, color: "#a8a092", marginBottom: 20 }}>On the word</p>
          <p style={{ ...INTER, fontSize: 14, lineHeight: 1.8, color: "#3d3d3d", marginBottom: 20, maxWidth: 620, fontStyle: "italic" }}>
            Praxis is the loop of putting theory into practice, then letting what you learn from doing it sharpen the theory.
          </p>
          <p style={{ ...INTER, fontSize: 13, lineHeight: 1.85, color: "#7a7568", maxWidth: 620 }}>
            Praxis comes from the Greek <em>prâxis</em> (πρᾶξις), meaning "doing" or "action," from the verb <em>prattein</em>, "to do" or "to act." Aristotle used it to distinguish lived action from two other modes of human activity - <em>theoria</em> (contemplation) and <em>poiesis</em> (making). Where <em>poiesis</em> produces an object outside itself, praxis is action whose end lies in the doing itself, the conduct of a life rather than the manufacture of a thing.
          </p>
        </div>

        {/* Doc footer */}
        <div className="px-footer-bar">
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Praxis · Client Training</span>
          <span style={{ ...CAPS, fontSize: 9, color: "#1a1a1a" }}>Module 01 - Foundations</span>
        </div>

      </div>
      <CoursesSection />
    </div>
  );
}
