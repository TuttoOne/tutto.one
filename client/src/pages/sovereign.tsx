import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  CardGrid,
  FeatureCard,
  PriceRow,
  Etymology,
  ClosingCta,
  Plate,
  PlateRow,
} from "@/components/product/ProductPage";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";
import { USE_CASE_RUNS } from "@/lib/usecase-runs";
import { USECASE_FR } from "@/lib/fr/usecase";
import { usePageTr } from "@/lib/page-fr";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * The general front door to Pythia, for a reader who is not a lawyer.
 *
 * /pythia stays exactly as it was — it works on the audience it was written
 * for. This page makes the same product legible to everybody else: it opens on
 * what the thing is, spends its longest section on jobs a person in accounts or
 * HR already does by hand, and only then produces the law firm as evidence.
 *
 * Almost nothing here is new argument. The local-first case belongs to
 * `copy.applied` on the home page and the recorded runs belong to /usecase;
 * both are compressed and linked rather than restated, so there is one place to
 * change each of them. Prices resolve through `pricing.ts` on the same keys as
 * /pythia, so the two pages cannot drift apart on cost.
 */
export default function Sovereign() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const p = (k: Parameters<typeof price>[0]) => price(k, currency, locale);

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "IA souveraine — Pythia | Tutto"
        : "Sovereign AI — Pythia | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const c = copy.sovereign;

  const what = [
    { numeral: "i.", title: t(c.c1Title), qualifier: t(c.c1Qual), body: t(c.c1Body) },
    { numeral: "ii.", title: t(c.c2Title), qualifier: t(c.c2Qual), body: t(c.c2Body) },
    { numeral: "iii.", title: t(c.c3Title), qualifier: t(c.c3Qual), body: t(c.c3Body) },
  ];

  /**
   * Six jobs. `href` is deliberately absent on the invoice and the paper-and-
   * scans cards: nothing has been recorded for either, and this site's promise
   * is that anything you can watch, really happened. `jNote` below says so out
   * loud rather than leaving the reader to spot the gap.
   */
  const jobs: {
    numeral: string;
    title: string;
    qualifier: string;
    body: string;
    href?: string;
    cta?: string;
    external?: boolean;
  }[] = [
    { numeral: "i.", title: t(c.j1Title), qualifier: t(c.j1Qual), body: t(c.j1Body) },
    {
      numeral: "ii.",
      title: t(c.j2Title),
      qualifier: t(c.j2Qual),
      body: t(c.j2Body),
      href: "/usecase/",
      cta: t(c.jWatch),
    },
    { numeral: "iii.", title: t(c.j3Title), qualifier: t(c.j3Qual), body: t(c.j3Body) },
    {
      numeral: "iv.",
      title: t(c.j4Title),
      qualifier: t(c.j4Qual),
      body: t(c.j4Body),
      href: "/pythia-demo/",
      cta: t(c.jDemo),
      external: true,
    },
    {
      numeral: "v.",
      title: t(c.j5Title),
      qualifier: t(c.j5Qual),
      body: t(c.j5Body),
      href: "/usecase/",
      cta: t(c.jWatch),
    },
    {
      numeral: "vi.",
      title: t(c.j6Title),
      qualifier: t(c.j6Qual),
      body: t(c.j6Body),
      href: "https://bomza.tutto.one/",
      cta: t(c.jProject),
      external: true,
    },
  ];

  const why = [
    { numeral: "i.", title: t(c.w1Title), body: t(c.w1Body) },
    { numeral: "ii.", title: t(c.w2Title), body: t(c.w2Body) },
    { numeral: "iii.", title: t(c.w3Title), body: t(c.w3Body) },
  ];

  const hardware = [
    { numeral: "i.", title: t(c.h1Title), body: t(c.h1Body) },
    { numeral: "ii.", title: t(c.h2Title), body: t(c.h2Body) },
    { numeral: "iii.", title: t(c.h3Title), body: t(c.h3Body) },
  ];

  const evidence = [
    {
      title: t(c.ev1Title),
      qualifier: t(c.ev1Qual),
      body: t(c.ev1Body),
      href: "/gtm-orchestrator",
    },
    { title: t(c.ev2Title), qualifier: t(c.ev2Qual), body: t(c.ev2Body), href: "/pythia" },
    {
      title: t(c.ev3Title),
      qualifier: t(c.ev3Qual),
      body: t(c.ev3Body),
      href: "https://bomza.tutto.one/",
      external: true,
    },
    {
      title: t(c.ev4Title),
      qualifier: t(c.ev4Qual),
      body: t(c.ev4Body),
      href: "https://entityvault.tutto.one/",
      external: true,
    },
  ];

  /* The runs are read from the same array /usecase renders, through the same
     French dictionary, so this strip cannot fall out of step with the
     recordings it is advertising. */
  const tr = usePageTr(USECASE_FR);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={t(c.eyebrow)}
          title={t(c.title)}
          standfirst={
            <>
              <p>{t(c.lead1)}</p>
              <p>{t(c.lead2)}</p>
            </>
          }
          primaryCta={{ label: t(copy.common.bookConversation), href: BOOKING }}
          secondaryCta={{ label: t(copy.common.seePortfolio), href: "/portfolio" }}
          meta={t(c.meta)}
        />

        <Section index="01" label={t(c.s1Label)}>
          <Plate
            src="/artwork/hands.webp"
            width={1254}
            height={1254}
            alt={t(copy.plates.hands)}
            caption={t(c.plateHandsCaption)}
            className="mb-10 max-w-sm"
          />
          <CardGrid cols={3}>
            {what.map((card) => (
              <FeatureCard
                key={card.numeral}
                numeral={card.numeral}
                title={card.title}
                qualifier={card.qualifier}
              >
                {card.body}
              </FeatureCard>
            ))}
          </CardGrid>
        </Section>

        <Section
          index="02"
          label={t(c.s2Label)}
          title={t(c.s2Title)}
          intro={<p>{t(c.s2Body)}</p>}
        >
          <div className="mb-10">
            <PlateRow
              items={[
                { src: "/artwork/woman.webp", alt: t(copy.plates.portraitB) },
                { src: "/artwork/man.webp", alt: t(copy.plates.portraitA) },
                { src: "/artwork/woman2.webp", alt: t(copy.plates.portraitC) },
              ]}
              caption={t(c.platePortraitsCaption)}
            />
          </div>

          <CardGrid cols={3}>
            {jobs.map((job) => (
              <div
                key={job.numeral}
                className="relative bg-card border border-border rounded-2xl p-6 flex flex-col"
              >
                <span className="absolute top-5 right-6 text-xs font-mono text-muted-foreground/40">
                  {job.numeral}
                </span>
                <h3 className="text-lg font-serif font-bold mb-1.5 pr-8">{job.title}</h3>
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">
                  {job.qualifier}
                </p>
                <p className="text-sm text-muted-foreground leading-relaxed flex-1">{job.body}</p>
                {job.href && job.cta && (
                  <div className="mt-5">
                    {job.external ? (
                      <a
                        href={job.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        {job.cta} <ArrowUpRight className="w-4 h-4" />
                      </a>
                    ) : (
                      <Link
                        href={job.href}
                        className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                      >
                        {job.cta} <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                )}
              </div>
            ))}
          </CardGrid>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {t(c.jNote)}
          </p>

          {/* The database-to-monthly-report example is already worked through in
              full on the home page; pointing at it beats writing a seventh card
              that says the same thing less well. */}
          <div className="mt-8 max-w-2xl rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-muted-foreground leading-relaxed">
              <b className="text-foreground">{t(c.reportTitle)}</b> {t(c.reportBody)}
            </p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
            >
              {t(c.reportCta)} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </Section>

        <Section index="03" label={t(c.s3Label)} intro={<p>{t(c.s3Body)}</p>}>
          <CardGrid cols={3}>
            {USE_CASE_RUNS.map((run) => (
              <Link
                key={run.id}
                href="/usecase/"
                className="group bg-card border border-border rounded-2xl p-6 block"
              >
                <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-3">
                  {tr(run.sector)}
                </p>
                <h3 className="text-base font-serif font-bold leading-snug group-hover:text-primary transition-colors">
                  {tr(run.title)}
                </h3>
                <p className="mt-4 text-sm text-muted-foreground tabular-nums">
                  {run.real}s · {tr(run.tab)}
                </p>
              </Link>
            ))}
          </CardGrid>
        </Section>

        <Section
          index="04"
          label={t(c.s4Label)}
          title={t(c.s4Title)}
          intro={<p>{t(c.s4Body)}</p>}
        >
          {/* The nav and the eyebrow both say "sovereign", which is a word that
              can float. This is where it gets cashed out, in the section that
              argues the constraint — the site defines its terms as it goes. */}
          <div className="mb-10 max-w-2xl rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-muted-foreground leading-relaxed">
              <b className="text-foreground">{t(c.sovereignTitle)}</b> {t(c.sovereignBody)}
            </p>
          </div>

          <div className="mb-10">
            <Plate
              src={`/artwork/skills-${locale === "fr" ? "fr" : "en"}.webp`}
              width={1672}
              height={941}
              alt={t(copy.plates.skills)}
              caption={t(c.plateSkillsCaption)}
            />
          </div>

          <CardGrid cols={3}>
            {why.map((card) => (
              <FeatureCard key={card.numeral} numeral={card.numeral} title={card.title}>
                {card.body}
              </FeatureCard>
            ))}
          </CardGrid>

          <p className="mt-6 text-sm text-muted-foreground leading-relaxed max-w-2xl">
            {t(c.wMore)}{" "}
            <Link href="/" className="text-primary hover:underline">
              {t(c.wMoreCta)}
            </Link>
            .
          </p>

          <h3 className="mt-12 mb-5 text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {t(c.hwLabel)}
          </h3>
          <CardGrid cols={3}>
            {hardware.map((card) => (
              <FeatureCard key={card.numeral} numeral={card.numeral} title={card.title}>
                {card.body}
              </FeatureCard>
            ))}
          </CardGrid>

          <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-secondary/30 p-6">
            <p className="text-muted-foreground leading-relaxed">
              <b className="text-foreground">{t(c.modelTitle)}</b> {t(c.modelBody)}
            </p>
          </div>
        </Section>

        <Section index="05" label={t(c.s5Label)} intro={<p>{t(c.s5Body)}</p>}>
          <CardGrid cols={2}>
            {evidence.map((item) => {
              const inner = (
                <>
                  <div className="flex items-start justify-between gap-3 mb-1.5">
                    <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    {item.external ? (
                      <ArrowUpRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1" />
                    ) : (
                      <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">
                    {item.qualifier}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
                </>
              );
              const className =
                "group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors block";
              return item.external ? (
                <a
                  key={item.title}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <Link key={item.title} href={item.href} className={className}>
                  {inner}
                </Link>
              );
            })}
          </CardGrid>
        </Section>

        <Section index="06" label={t(c.bringLabel)}>
          <div className="bg-secondary/30 border border-border rounded-2xl p-8">
            <p className="font-serif text-lg text-foreground leading-relaxed max-w-3xl">
              {t(c.bringBody)}
            </p>
          </div>
        </Section>

        {/* The build and ongoing lines are read straight off `pythia` — same
            product, same terms, and two pages that describe them differently is
            a problem waiting to happen. Only the diagnostic needed rewording,
            because Pythia's says "for your practice". */}
        <Section index="07" label={t(c.s6Label)} intro={<p>{t(c.s6Body)}</p>}>
          <CardGrid cols={3}>
            <PriceRow title={t(copy.pythia.e1Title)} price={p("sprint")}>
              {t(c.e1Body)}
            </PriceRow>
            <PriceRow
              title={t(copy.pythia.e2Title)}
              price={`${t(copy.pythia.e2Price)} ${p("build")}`}
            >
              {t(copy.pythia.e2Body)}
            </PriceRow>
            <PriceRow title={t(copy.pythia.e3Title)} price={t(copy.pythia.e3Price)}>
              {t(copy.pythia.e3Body)}
            </PriceRow>
          </CardGrid>

          <Link
            href="/pythia"
            className="group mt-8 flex items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
          >
            <div>
              <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                {t(c.legalTitle)}
              </p>
              <p className="text-sm text-muted-foreground mt-1 max-w-xl">{t(c.legalBody)}</p>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium text-primary shrink-0">
              {t(c.legalCta)}
              <ArrowRight className="w-4 h-4" />
            </span>
          </Link>
        </Section>

        <Etymology pull={t(copy.pythia.etymPull)}>
          <p>{t(copy.pythia.etymBody)}</p>
        </Etymology>

        <ClosingCta
          title={t(c.ctaTitle)}
          body={t(c.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookConversation)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
