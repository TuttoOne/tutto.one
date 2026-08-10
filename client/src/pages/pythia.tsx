import { useEffect } from "react";
import { ArrowUpRight } from "lucide-react";
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
import { copy, useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * Illustrative exchange, not a transcript of a real matter, so it is shown in
 * the reader's language — matching the portfolio, which does the same.
 */
const SESSION_EN = [
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

const SESSION_FR = [
  {
    tag: "A",
    q: "Trouve tous les documents mentionnant le conseil d'administration de mars 2023 et résume les décisions principales.",
    a: "14 passages pertinents trouvés dans 6 documents. Décisions consignées : approbation de la nouvelle structure du capital (pièce C-112), nomination d'un directeur financier par intérim (courriel D-0447), report du vote sur l'acquisition au 3e trimestre 2023 (procès-verbal C-089).",
  },
  {
    tag: "B",
    q: "Montre-moi tous les courriels échangés entre le demandeur et le défendeur entre janvier et avril 2022.",
    a: "38 courriels récupérés. Le plus ancien : 4 janvier 2022 (réf. D-0012). Le plus récent : 29 avril 2022 (réf. D-0891). 12 marqués confidentiels par la partie productrice.",
  },
  {
    tag: "C",
    q: "Établis une chronologie des échéances contractuelles mentionnées dans l'ensemble des documents.",
    a: "23 échéances extraites. Dates clés : 15 février 2022 (jalon de paiement, contrat §4.2), 1er juin 2022 (expiration de l'option, avenant B), 30 septembre 2022 (date butoir, contrat de cession initial).",
  },
];

export default function Pythia() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const p = (k: Parameters<typeof price>[0]) => price(k, currency, locale);

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "Pythia — intelligence documentaire sur site | Tutto"
        : "Pythia — On-premise document intelligence | Tutto";
    return () => {
      document.title = "Tutto | AI Consulting";
    };
  }, [locale]);

  const howItWorks = [
    { numeral: "i.", title: t(copy.pythia.c1Title), qualifier: t(copy.pythia.c1Qual), body: t(copy.pythia.c1Body) },
    { numeral: "ii.", title: t(copy.pythia.c2Title), qualifier: t(copy.pythia.c2Qual), body: t(copy.pythia.c2Body) },
    { numeral: "iii.", title: t(copy.pythia.c3Title), qualifier: t(copy.pythia.c3Qual), body: t(copy.pythia.c3Body) },
  ];

  const beyondLegal = [
    { numeral: "i.", title: t(copy.pythia.b1Title), qualifier: t(copy.pythia.b1Qual), body: t(copy.pythia.b1Body) },
    { numeral: "ii.", title: t(copy.pythia.b2Title), qualifier: t(copy.pythia.b2Qual), body: t(copy.pythia.b2Body) },
    { numeral: "iii.", title: t(copy.pythia.b3Title), qualifier: t(copy.pythia.b3Qual), body: t(copy.pythia.b3Body) },
  ];

  const stats = [
    { stat: t(copy.pythia.stat1), label: t(copy.pythia.stat1Label) },
    { stat: t(copy.pythia.stat2), label: t(copy.pythia.stat2Label) },
    { stat: t(copy.pythia.stat3), label: t(copy.pythia.stat3Label) },
  ];

  const applied = [
    {
      name: "Bomza — SANS 10400",
      domain: t(copy.pythia.app1Domain),
      body: t(copy.pythia.app1Body),
      href: "https://bomza.tutto.one/",
    },
    {
      name: "EntityVault",
      domain: t(copy.pythia.app2Domain),
      body: t(copy.pythia.app2Body),
      href: "https://entityvault.tutto.one/",
    },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={t(copy.pythia.eyebrow)}
          title={t(copy.pythia.title)}
          standfirst={
            <>
              <p>{t(copy.pythia.lead1)}</p>
              <p>{t(copy.pythia.lead2)}</p>
            </>
          }
          primaryCta={{ label: t(copy.common.bookConversation), href: BOOKING }}
          secondaryCta={{ label: t(copy.common.seePortfolio), href: "/portfolio" }}
          meta={t(copy.pythia.meta)}
        />

        <Section
          index="01"
          label={t(copy.pythia.s1Label)}
          title={t(copy.pythia.s1Title)}
          intro={<p>{t(copy.pythia.s1Body)}</p>}
        >
          <CardGrid cols={3}>
            {howItWorks.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section index="02" label={t(copy.pythia.s2Label)}>
          <div className="grid md:grid-cols-2 gap-5 items-start">
            <div className="flex flex-col gap-4">
              {stats.map((s) => (
                <StatCard key={s.stat} stat={s.stat} label={s.label} />
              ))}
            </div>
            <ExampleSession caption={t(copy.pythia.sessionCaption)} items={locale === "fr" ? SESSION_FR : SESSION_EN} />
          </div>
        </Section>

        <Section
          index="03"
          label={t(copy.pythia.shotsLabel)}
          title={t(copy.pythia.shotsTitle)}
          intro={<p>{t(copy.pythia.shotsBody)}</p>}
        >
          <div className="space-y-8">
            {[
              { src: "/pythia/orchestrator.webp", caption: t(copy.pythia.shot1) },
              { src: "/pythia/dashboard.webp", caption: t(copy.pythia.shot2) },
              { src: "/pythia/disclosure-audit.webp", caption: t(copy.pythia.shot3) },
              { src: "/pythia/knowledge-map.webp", caption: t(copy.pythia.shot4) },
            ].map((shot) => (
              <figure key={shot.src}>
                <img
                  src={shot.src}
                  alt=""
                  width={1600}
                  loading="lazy"
                  decoding="async"
                  className="w-full rounded-2xl border border-border bg-card"
                />
                <figcaption className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  {shot.caption}
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {t(copy.pythia.languageNote)}
          </p>

          <a
            href="https://pythia-demo.tutto.one/"
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-8 flex items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
          >
            <div>
              <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {t(copy.pythia.demoTitle)}
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                {t(copy.pythia.demoBody)}
              </p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary shrink-0">
              {t(copy.pythia.demoCta)}
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </a>
        </Section>

        <Section
          index="04"
          label={t(copy.pythia.s3Label)}
          title={t(copy.pythia.s3Title)}
          intro={<p>{t(copy.pythia.s3Body)}</p>}
        >
          <CardGrid cols={3}>
            {beyondLegal.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>

          <p className="mt-12 mb-5 text-sm text-muted-foreground">{t(copy.pythia.appliedIntro)}</p>
          <CardGrid cols={2}>
            {applied.map((a) => (
              <a
                key={a.name}
                href={a.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-3 mb-1.5">
                  <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors">
                    {a.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1" />
                </div>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">
                  {a.domain}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed">{a.body}</p>
              </a>
            ))}
          </CardGrid>
        </Section>

        <Section index="05" label={t(copy.pythia.fitLabel)}>
          <div className="bg-secondary/30 border border-border rounded-2xl p-8">
            <p className="font-serif text-lg text-foreground leading-relaxed max-w-3xl">
              {t(copy.pythia.fitBody)}
            </p>
          </div>
        </Section>

        <Section index="06" label={t(copy.pythia.s4Label)} intro={<p>{t(copy.pythia.s4Body)}</p>}>
          <CardGrid cols={3}>
            <PriceRow title={t(copy.pythia.e1Title)} price={p("sprint")}>
              {t(copy.pythia.e1Body)}
            </PriceRow>
            <PriceRow title={t(copy.pythia.e2Title)} price={`${t(copy.pythia.e2Price)} ${p("build")}`}>
              {t(copy.pythia.e2Body)}
            </PriceRow>
            <PriceRow title={t(copy.pythia.e3Title)} price={t(copy.pythia.e3Price)}>
              {t(copy.pythia.e3Body)}
            </PriceRow>
          </CardGrid>
        </Section>

        <Etymology pull={t(copy.pythia.etymPull)}>{t(copy.pythia.etymBody)}</Etymology>

        <ClosingCta
          title={t(copy.pythia.ctaTitle)}
          body={t(copy.pythia.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookConversation)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
