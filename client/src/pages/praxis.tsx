import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  CardGrid,
  FeatureCard,
  PriceRow,
  Etymology,
  ClosingCta,
  Eyebrow,
} from "@/components/product/ProductPage";

const BOOKING = "https://cal.com/tuttoone/60-min-meeting";

const INGREDIENTS = [
  {
    numeral: "i.",
    title: "The editor",
    qualifier: "Where you work · Free",
    body: "An open code editor of your choice — these are usually free. It shows the files and lets you edit, search, and talk to your assistant in normal language. Nothing magical: the workshop bench.",
  },
  {
    numeral: "ii.",
    title: "The assistant",
    qualifier: "The intelligence · ~$20/mo",
    body: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version — that is what keeps the work fully secure.",
  },
  {
    numeral: "iii.",
    title: "Your filesystem",
    qualifier: "What you already own",
    body: "Plain folders, plain files, on the computer you already own. No cloud, no database, no proprietary format. The same disk you have been using for years — the thing that makes it yours.",
  },
];

const FOLDER = [
  { path: "SKILL.md", note: "the rules · written in plain English", tag: "A" },
  { path: "run.py", note: "the script · the work it does", tag: "B" },
  { path: "documents/", note: "your data · the inputs", tag: "C" },
  { path: "output/", note: "what gets produced", tag: "" },
];

const FOLDER_NOTES = [
  {
    tag: "A",
    title: "SKILL.md",
    body: "The instructions you'd give a new hire on day one, written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour.",
  },
  {
    tag: "B",
    title: "run.py",
    body: "A short script that does the actual work — pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you.",
  },
  {
    tag: "C",
    title: "documents/",
    body: "Whatever the work needs to process: PDFs, spreadsheets, transcripts, contracts. Drop files in, pull files out. There is no upload step.",
  },
];

export default function Praxis() {
  useEffect(() => {
    document.title = "Praxis — One hour that changes how you think about AI | Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow="Praxis · Client training"
          title={<>A one-hour call that changes how you think about AI.</>}
          standfirst={
            <>
              <p>
                No technical background needed. The first thirty minutes covers the theory and
                principles — what AI actually is, how the folder-based system works, and why it
                changes everything. No jargon.
              </p>
              <p>
                The second thirty minutes is practical: on your own computer, with your own files.
                You follow along live as we build the system together. By the end of the hour you
                have a working setup and the mental model to take it further.
              </p>
            </>
          }
          primaryCta={{ label: "Book the 1-hour session", href: BOOKING }}
          secondaryCta={{ label: "Talk about training a team", href: "/contact" }}
          meta="Teams or Google Meet · One hour · Theory then hands-on"
        />

        <Section
          index="01"
          label="The idea"
          title="The folder is the app. It runs on your machine. It belongs to you."
          intro={
            <p>
              You don't need a proprietary platform, or an account with us. The only thing you'll
              subscribe to is the AI assistant — about $20 a month — plus a free code editor. Point
              all three at the same folder on your machine. That folder, and what's inside it, is
              your app.
            </p>
          }
        />

        <Section index="02" label="The ingredients">
          <CardGrid cols={3}>
            {INGREDIENTS.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>
          <p className="mt-6 text-sm text-muted-foreground italic">
            Point all three at the same folder.
          </p>
        </Section>

        <Section
          index="03"
          label="The output"
          title="A folder on disk."
          intro={
            <p>
              Nothing here is exotic. What you leave the session with is four things in a directory,
              which you can read, edit, copy and back up with tools you already trust.
            </p>
          }
        >
          <div className="grid md:grid-cols-2 gap-5 items-start">
            <div className="bg-card border border-border rounded-2xl p-6 font-mono text-[13px] leading-relaxed">
              <p className="text-muted-foreground mb-3">~/Praxis/folder/</p>
              {FOLDER.map((f, i) => (
                <div key={f.path} className="flex gap-2 text-foreground">
                  <span className="text-muted-foreground/50 select-none">
                    {i === FOLDER.length - 1 ? "└──" : "├──"}
                  </span>
                  <span className="min-w-[7.5rem]">{f.path}</span>
                  <span className="text-muted-foreground/70 hidden sm:inline">— {f.note}</span>
                  {f.tag && <span className="ml-auto text-primary/60">[{f.tag}]</span>}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {FOLDER_NOTES.map((n) => (
                <div key={n.tag}>
                  <div className="flex items-baseline gap-2.5 mb-1.5">
                    <span className="text-xs font-mono text-primary">{n.tag}</span>
                    <h3 className="font-serif font-bold text-foreground">{n.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{n.body}</p>
                </div>
              ))}
              <div>
                <div className="flex items-baseline gap-2.5 mb-1.5">
                  <span className="text-xs font-mono text-muted-foreground/50">—</span>
                  <h3 className="font-serif font-bold text-foreground">Version control, optional</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Because it's a folder, the standard tools just work: git, Time Machine, Dropbox, a
                  USB stick. There is nothing special to back up.
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section index="04" label="What it costs">
          <CardGrid cols={3}>
            <PriceRow title="The tools" price="~$20/mo">
              A code editor is free. A paid AI assistant subscription is about $20 a month. That is
              the only recurring cost, and it is not paid to us.
            </PriceRow>
            <PriceRow title="The session" price="£100" was="£200">
              Spring special, limited time. One hour: thirty minutes of theory and principles, then
              thirty minutes hands-on on your own computer. You leave with a working setup.
            </PriceRow>
            <PriceRow title="Diagnostic sprint" price="~£2,500">
              Two weeks. We look at your real documents and workflows and tell you exactly what is
              possible.
            </PriceRow>
          </CardGrid>
        </Section>

        <Section index="05" label="Before the session">
          <div className="bg-secondary/30 border border-border rounded-2xl p-6 max-w-2xl">
            <Eyebrow className="mb-3 text-muted-foreground/70">Please set up in advance</Eyebrow>
            <p className="text-muted-foreground leading-relaxed">
              The practical half runs on your computer. To get the most from it, have your AI
              assistant installed with a paid subscription active before we start, and ideally a code
              editor too. Get in touch and we'll send you exactly what to set up.
            </p>
          </div>
        </Section>

        <Etymology pull="Praxis is the loop of putting theory into practice, then letting what you learn from doing it sharpen the theory.">
          Praxis means knowledge proven by doing. It comes from the Greek <em>prâxis</em> — action
          whose purpose lies in the action itself. Aristotle separated it from <em>theoria</em>{" "}
          (contemplation) and <em>poiesis</em> (making, which produces an object outside itself).
          Modern usage, after Freire, treats it as the loop of theory, action, reflection, sharper
          theory.
        </Etymology>

        <ClosingCta
          title="Ready to see it live?"
          body="Book a one-hour Praxis session. Theory first, then hands-on together — on your machine, with your files."
          href={BOOKING}
          label="Book a session"
        />
      </div>
    </Layout>
  );
}
