import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  CardGrid,
  FeatureCard,
  StatCard,
  PriceRow,
  ExampleSession,
  Etymology,
  ClosingCta,
} from "@/components/product/ProductPage";

const HOW_IT_WORKS = [
  {
    numeral: "i.",
    title: "Ask in plain English",
    qualifier: "Semantic search · Cited answers",
    body: "Ask it the way you'd brief a junior. Every answer cites the source document and page number. No guessing, and no answer drawn from the model's own knowledge rather than your files.",
  },
  {
    numeral: "ii.",
    title: "Nothing leaves the office",
    qualifier: "On-premise · Zero cloud APIs",
    body: "OCR, inference, vector search and storage all run locally on your hardware. No data is sent to third parties. Legal Professional Privilege is satisfied by architecture, not by policy.",
  },
  {
    numeral: "iii.",
    title: "Every document, every format",
    qualifier: "150,000+ files · All formats",
    body: "PDF, DOCX, MSG, EML, XLSX, TIF and more. Pythia reads in your first disclosure set in a few weeks, and new documents are added as they arrive.",
  },
];

const STATS = [
  { stat: "3 days → 3 hours", label: "Document review per matter" },
  { stat: "Zero", label: "Files that leave your office" },
  { stat: "Every footnote", label: "Found, cited and explained" },
];

const SESSION = [
  {
    tag: "A",
    q: "Find all documents referencing the March 2023 board meeting and summarise the key decisions.",
    a: "Found 14 relevant passages across 6 documents. Key decisions: approval of revised share structure (Exhibit C-112), appointment of interim CFO (Email D-0447), deferral of acquisition vote to Q3 2023 (Board Minutes C-089).",
  },
  {
    tag: "B",
    q: "Show me all emails between the claimant and defendant between January and April 2022.",
    a: "Retrieved 38 emails. Earliest: 4 Jan 2022 (REF: D-0012). Latest: 29 Apr 2022 (REF: D-0891). 12 marked confidential by producing side.",
  },
  {
    tag: "C",
    q: "Build a timeline of contractual deadlines mentioned across all documents.",
    a: "Extracted 23 deadline references. Key dates: 15 Feb 2022 (payment milestone, Contract §4.2), 1 Jun 2022 (option expiry, Addendum B), 30 Sep 2022 (longstop date, original SPA).",
  },
];

const BEYOND_LEGAL = [
  {
    numeral: "i.",
    title: "A hierarchy of knowledge",
    qualifier: "Structured · Searchable · Yours",
    body: "Every document, note and decision organised into a structure you define, with semantic search across all of it. Ask anything and it answers from the record rather than from a guess.",
  },
  {
    numeral: "ii.",
    title: "AI as orchestrator, not custodian",
    qualifier: "Local-first · Zero cloud exposure",
    body: "The AI connects to your knowledge base and instructs agents to act on it. It orchestrates; it never holds. Your data stays on your hardware at every step.",
  },
  {
    numeral: "iii.",
    title: "Self-improving by design",
    qualifier: "Each session sharpens the system",
    body: "Every question, correction and refinement feeds back in. The structure grows more accurate and the retrieval improves, without anything leaving your environment.",
  },
];

export default function Pythia() {
  useEffect(() => {
    document.title = "Pythia — On-premise document intelligence | Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow="Pythia · Document intelligence"
          title={<>Read every file. Find what matters. In hours, not days.</>}
          standfirst={
            <>
              <p>
                Juniors spend days reading. Partners wait. The thing you miss is the thing that
                loses the case. Pythia reads everything — every file, every footnote — and lets you
                ask questions the way you'd brief a junior.
              </p>
              <p>
                It runs on your hardware. Nothing leaves your office. No cloud, no third-party APIs,
                no exposure.
              </p>
            </>
          }
          primaryCta={{ label: "Book a conversation", href: "https://cal.com/tuttoone/30min" }}
          secondaryCta={{ label: "See the wider portfolio", href: "/portfolio" }}
          meta="On-premise · Private · 30 minutes"
        />

        <Section
          index="01"
          label="How it works"
          title="A self-hosted document intelligence platform for document-heavy work."
          intro={
            <p>
              Pythia processes entire disclosure sets locally: semantic search, conversational Q&amp;A
              with citations, interactive timelines, and OCR. It finds every relevant file, and shows
              you exactly why it surfaced.
            </p>
          }
        >
          <CardGrid cols={3}>
            {HOW_IT_WORKS.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section index="02" label="What it looks like in use">
          <div className="grid md:grid-cols-2 gap-5 items-start">
            <div className="flex flex-col gap-4">
              {STATS.map((s) => (
                <StatCard key={s.stat} stat={s.stat} label={s.label} />
              ))}
            </div>
            <ExampleSession caption="Pythia · example session" items={SESSION} />
          </div>
        </Section>

        <Section
          index="03"
          label="Beyond legal"
          title="The same architecture, pointed at any body of knowledge."
          intro={
            <p>
              Litigation is the hardest version of the problem: high volume, high stakes, and a
              privilege requirement that rules out the cloud entirely. Solve it there and it
              transfers. The same system runs over operations, research, compliance or engineering
              records — a private second brain that acts, on your hardware.
            </p>
          }
        >
          <CardGrid cols={3}>
            {BEYOND_LEGAL.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section
          index="04"
          label="Engagement"
          intro={<p>Three stages, each one a decision point rather than a commitment to the next.</p>}
        >
          <CardGrid cols={3}>
            <PriceRow title="Diagnostic sprint" price="~£2,500">
              Two weeks. We review your real documents and workflows and tell you exactly what Pythia
              can do for your practice.
            </PriceRow>
            <PriceRow title="The build" price="From £20,000">
              Hardware and custom build, scoped after the diagnostic. Typically four to eight weeks
              from sign-off to a system running on your premises.
            </PriceRow>
            <PriceRow title="Ongoing" price="~20% p.a.">
              Assessed during the build. Covers ingestion of new matter files, system maintenance,
              and keeping Pythia current as your work evolves.
            </PriceRow>
          </CardGrid>
        </Section>

        <Etymology pull="The Pythia was the Oracle at Delphi — the one you consulted when you needed an answer from everything that had been heard.">
          Pythia was the title given to the high priestess of the Temple of Apollo at Delphi, who
          served as its oracle. The name derives from Python, the serpent Apollo slew at Delphi. To
          put a question to the Pythia was not to ask for a guess — it was to receive the distilled
          answer from everything the oracle had witnessed and absorbed. That is the model: every
          document, read; every question, answered from the record itself.
        </Etymology>

        <ClosingCta
          title="Ready to see it in your practice?"
          body="Book a thirty-minute conversation. We'll walk through your documents and tell you what's possible."
          href="https://cal.com/tuttoone/30min"
          label="Book a conversation"
        />
      </div>
    </Layout>
  );
}
