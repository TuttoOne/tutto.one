import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import {
  Section,
  CardGrid,
  FeatureCard,
  StatCard,
  ExampleSession,
  ClosingCta,
  Etymology,
  Eyebrow,
} from "@/components/product/ProductPage";
import { copy, useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * Illustrative exchange, not a transcript of a real engagement, so it is shown
 * in the reader's language — matching Pythia and the portfolio, which do the
 * same. The point of the third turn is that the work outlives the conversation.
 */
const SESSION_EN = [
  {
    tag: "A",
    q: "What is in this database? I have never seen the schema.",
    a: "14 tables. Core: orders (2.1M rows), customers (84k), line_items (7.4M), returns (61k). Orders link to customers on customer_id; line_items to orders on order_id. Dates run Jan 2019 to Jul 2026.",
  },
  {
    tag: "B",
    q: "Build the monthly margin report we do by hand — revenue, cost and margin by product category, last 24 months.",
    a: "Query written and run against the live database. 24 months x 9 categories. Cross-checked June against your finance export: revenue matches to the penny, margin differs by 0.3%. Your export excludes freight. Flagging rather than reconciling silently.",
  },
  {
    tag: "C",
    q: "Run it on the first of every month and put it in the shared folder.",
    a: "Scheduled. Writes monthly-margin.xlsx to /Finance/Reports at 06:00 on the 1st. If a run fails it emails you rather than failing quietly.",
  },
];

const SESSION_FR = [
  {
    tag: "A",
    q: "Qu'y a-t-il dans cette base ? Je n'en ai jamais vu la structure.",
    a: "14 tables. Principales : commandes (2,1 M de lignes), clients (84 k), lignes_commande (7,4 M), retours (61 k). Les commandes se rattachent aux clients par client_id ; les lignes aux commandes par commande_id. Période couverte : janvier 2019 à juillet 2026.",
  },
  {
    tag: "B",
    q: "Construis le rapport de marge mensuel que nous faisons à la main — chiffre d'affaires, coût et marge par catégorie, sur 24 mois.",
    a: "Requête écrite et exécutée sur la base en production. 24 mois x 9 catégories. Contrôle croisé de juin avec votre export comptable : le chiffre d'affaires concorde au centime, la marge diffère de 0,3 %. Votre export exclut le fret. Je le signale plutôt que de rapprocher en silence.",
  },
  {
    tag: "C",
    q: "Exécute-le le premier de chaque mois et dépose-le dans le dossier partagé.",
    a: "Planifié. Écrit marge-mensuelle.xlsx dans /Finance/Rapports le 1er à 06h00. En cas d'échec, vous recevez un courriel plutôt qu'un silence.",
  },
];

/**
 * The plain-language case for applied AI, from "what is a script" through to the
 * client systems. It sits on the home page under the hero, which is why it opens
 * with the leads rather than a hero of its own: the page above it has already
 * made the headline claim, and this is the argument for it.
 */
export function AppliedExplainer() {
  const t = useT();
  const { locale } = usePreferences();

  const niche = [
    { numeral: "i.", title: t(copy.applied.n1Title), qualifier: t(copy.applied.n1Qual), body: t(copy.applied.n1Body) },
    { numeral: "ii.", title: t(copy.applied.n2Title), qualifier: t(copy.applied.n2Qual), body: t(copy.applied.n2Body) },
    { numeral: "iii.", title: t(copy.applied.n3Title), qualifier: t(copy.applied.n3Qual), body: t(copy.applied.n3Body) },
  ];

  const field = [
    { numeral: "i.", title: t(copy.applied.f1Title), qualifier: t(copy.applied.f1Qual), body: t(copy.applied.f1Body) },
    { numeral: "ii.", title: t(copy.applied.f2Title), qualifier: t(copy.applied.f2Qual), body: t(copy.applied.f2Body) },
    { numeral: "iii.", title: t(copy.applied.f3Title), qualifier: t(copy.applied.f3Qual), body: t(copy.applied.f3Body) },
  ];

  const local = [
    { numeral: "i.", title: t(copy.applied.l1Title), qualifier: t(copy.applied.l1Qual), body: t(copy.applied.l1Body) },
    { numeral: "ii.", title: t(copy.applied.l2Title), qualifier: t(copy.applied.l2Qual), body: t(copy.applied.l2Body) },
    { numeral: "iii.", title: t(copy.applied.l3Title), qualifier: t(copy.applied.l3Qual), body: t(copy.applied.l3Body) },
  ];

  const stats = [
    { stat: t(copy.applied.stat1), label: t(copy.applied.stat1Label) },
    { stat: t(copy.applied.stat2), label: t(copy.applied.stat2Label) },
    { stat: t(copy.applied.stat3), label: t(copy.applied.stat3Label) },
  ];

  const routes = [
    { href: "/praxis", title: t(copy.applied.r1Title), body: t(copy.applied.r1Body) },
    { href: "/services", title: t(copy.applied.r2Title), body: t(copy.applied.r2Body) },
    { href: "/sovereign", title: t(copy.applied.r3Title), body: t(copy.applied.r3Body) },
  ];

  return (
    <>
      <div className="max-w-2xl mb-16">
        <Eyebrow className="mb-5">{t(copy.applied.eyebrow)}</Eyebrow>
        <div className="text-lg text-muted-foreground leading-relaxed space-y-4">
          <p>{t(copy.applied.lead1)}</p>
          <p>{t(copy.applied.lead2)}</p>
        </div>
      </div>

      {/* No cards here: they restated the intro three times over. */}
      <Section
        index="01"
        label={t(copy.applied.s1Label)}
        title={t(copy.applied.s1Title)}
        intro={<p>{t(copy.applied.s1Body)}</p>}
      />

      <Section
        index="02"
        label={t(copy.applied.s2Label)}
        title={t(copy.applied.s2Title)}
        intro={
          <>
            <p>{t(copy.applied.s2Body1)}</p>
            <p>{t(copy.applied.s2Body2)}</p>
          </>
        }
      >
        <div className="grid md:grid-cols-2 gap-5 items-start">
          {/* Sticky on desktop, as the portfolio entries are: the shorter column
              rides down to fill the gap the taller one leaves. top-24 clears the
              fixed header. Mobile stacks, so it stays static there. */}
          <div className="flex flex-col gap-4 md:sticky md:top-24">
            {stats.map((s) => (
              <StatCard key={s.stat} stat={s.stat} label={s.label} />
            ))}
          </div>
          <ExampleSession
            caption={t(copy.applied.sessionCaption)}
            items={locale === "fr" ? SESSION_FR : SESSION_EN}
          />
        </div>

        <p className="mt-8 font-serif text-lg text-foreground leading-relaxed max-w-2xl">
          {t(copy.applied.s2Body3)}
        </p>
      </Section>

      <Section
        index="03"
        label={t(copy.applied.s3Label)}
        title={t(copy.applied.s3Title)}
        intro={
          <>
            <p>{t(copy.applied.s3Body1)}</p>
            <p>{t(copy.applied.s3Body2)}</p>
          </>
        }
      >
        <CardGrid cols={3}>
          {niche.map((c) => (
            <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
              {c.body}
            </FeatureCard>
          ))}
        </CardGrid>
      </Section>

      <Section
        index="04"
        label={t(copy.applied.s4Label)}
        title={t(copy.applied.s4Title)}
        intro={<p>{t(copy.applied.s4Body)}</p>}
      >
        <CardGrid cols={3}>
          {field.map((c) => (
            <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
              {c.body}
            </FeatureCard>
          ))}
        </CardGrid>

        <p className="mt-6 text-sm text-muted-foreground">
          {t(copy.applied.portfolioNote)}{" "}
          <Link href="/portfolio" className="text-primary hover:underline">
            {t(copy.common.ourWork)} →
          </Link>
        </p>
      </Section>

      <Section index="05" label={t(copy.applied.s5Label)} title={t(copy.applied.s5Title)}>
        <CardGrid cols={3}>
          {local.map((c) => (
            <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
              {c.body}
            </FeatureCard>
          ))}
        </CardGrid>
      </Section>

      <Section
        index="06"
        label={t(copy.applied.s6Label)}
        title={t(copy.applied.s6Title)}
        intro={
          <>
            <p>{t(copy.applied.s6Body1)}</p>
            <p>{t(copy.applied.s6Body2)}</p>
          </>
        }
      >
        <div className="bg-secondary/30 border border-border rounded-2xl p-6 max-w-2xl">
          <Eyebrow className="mb-3 text-muted-foreground/70">{t(copy.applied.localLabel)}</Eyebrow>
          <p className="text-muted-foreground leading-relaxed">{t(copy.applied.localBody)}</p>
        </div>
      </Section>

      <Section index="07" label={t(copy.applied.s7Label)} intro={<p>{t(copy.applied.s7Body)}</p>}>
        <CardGrid cols={3}>
          {routes.map((r) => (
            <Link
              key={r.href}
              href={r.href}
              className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors flex flex-col"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors">
                  {r.title}
                </h3>
                <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1.5" />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{r.body}</p>
            </Link>
          ))}
        </CardGrid>
      </Section>

      <Etymology pull={t(copy.applied.namePull)}>
        <p>{t(copy.applied.nameBody1)}</p>
        <p>{t(copy.applied.nameBody2)}</p>
      </Etymology>

      <ClosingCta
        title={t(copy.applied.ctaTitle)}
        body={t(copy.applied.ctaBody)}
        href={BOOKING}
        label={t(copy.common.bookConversation)}
        messageLabel={t(copy.common.sendMessage)}
      />
    </>
  );
}
