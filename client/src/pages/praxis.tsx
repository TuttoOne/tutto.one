import { useEffect } from "react";
import { Link } from "wouter";
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
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

const BOOKING = "https://cal.com/tuttoone/60-min-meeting";

export default function Praxis() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const p = (k: Parameters<typeof price>[0]) => price(k, currency, locale);

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "Praxis — une heure qui change votre façon de penser l'IA | Tutto"
        : "Praxis — One hour that changes how you think about AI | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const ingredients = [
    { numeral: "i.", title: t(copy.praxis.ing1Title), qualifier: t(copy.praxis.ing1Qual), body: t(copy.praxis.ing1Body) },
    { numeral: "ii.", title: t(copy.praxis.ing2Title), qualifier: t(copy.praxis.ing2Qual), body: t(copy.praxis.ing2Body) },
    { numeral: "iii.", title: t(copy.praxis.ing3Title), qualifier: t(copy.praxis.ing3Qual), body: t(copy.praxis.ing3Body) },
  ];

  const folder = [
    { path: "SKILL.md", note: t(copy.praxis.fileA), tag: "A" },
    { path: "run.py", note: t(copy.praxis.fileB), tag: "B" },
    { path: "documents/", note: t(copy.praxis.fileC), tag: "C" },
    { path: "output/", note: t(copy.praxis.fileD), tag: "" },
  ];

  const folderNotes = [
    { tag: "A", title: "SKILL.md", body: t(copy.praxis.noteA) },
    { tag: "B", title: "run.py", body: t(copy.praxis.noteB) },
    { tag: "C", title: "documents/", body: t(copy.praxis.noteC) },
  ];

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={t(copy.praxis.eyebrow)}
          title={t(copy.praxis.title)}
          standfirst={
            <>
              <p>{t(copy.praxis.lead1)}</p>
              <p>{t(copy.praxis.lead2)}</p>
            </>
          }
          primaryCta={{ label: t(copy.common.bookSession), href: BOOKING }}
          secondaryCta={{ label: t(copy.praxis.ctaSecondary), href: "/contact" }}
          meta={t(copy.praxis.meta)}
        />

        <Section
          index="01"
          label={t(copy.praxis.s1Label)}
          title={t(copy.praxis.s1Title)}
          intro={<p>{t(copy.praxis.s1Body)}</p>}
        />

        <Section index="02" label={t(copy.praxis.s2Label)}>
          <CardGrid cols={3}>
            {ingredients.map((c) => (
              <FeatureCard key={c.numeral} numeral={c.numeral} title={c.title} qualifier={c.qualifier}>
                {c.body}
              </FeatureCard>
            ))}
          </CardGrid>
          <p className="mt-6 text-sm text-muted-foreground italic">{t(copy.praxis.ingFoot)}</p>

          <div className="mt-8 bg-secondary/30 border border-border rounded-2xl p-6 max-w-2xl">
            <Eyebrow className="mb-3 text-muted-foreground/70">
              {t(copy.praxis.toolingNoteLabel)}
            </Eyebrow>
            <p className="text-muted-foreground leading-relaxed">{t(copy.praxis.toolingNote)}</p>
          </div>
        </Section>

        <Section
          index="03"
          label={t(copy.praxis.s3Label)}
          title={t(copy.praxis.s3Title)}
          intro={<p>{t(copy.praxis.s3Body)}</p>}
        >
          <div className="grid md:grid-cols-2 gap-5 items-start">
            {/* The note wraps rather than scrolling: a horizontal scrollbar inside
                a card hides content, and the French runs longer than the English. */}
            <div className="bg-card border border-border rounded-2xl p-6 font-mono text-[13px] leading-relaxed md:sticky md:top-24">
              <p className="text-muted-foreground mb-3 break-all">~/Praxis/folder/</p>
              {folder.map((f, i) => (
                <div key={f.path} className="flex items-start gap-2 text-foreground mb-1 last:mb-0">
                  <span className="shrink-0 text-muted-foreground/50 select-none">
                    {i === folder.length - 1 ? "└──" : "├──"}
                  </span>
                  <span className="shrink-0">{f.path}</span>
                  <span className="min-w-0 flex-1 text-muted-foreground/70 hidden sm:block break-words">
                    — {f.note}
                  </span>
                  {f.tag && <span className="shrink-0 text-primary/60">[{f.tag}]</span>}
                </div>
              ))}
            </div>

            <div className="space-y-5">
              {folderNotes.map((n) => (
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
                  <h3 className="font-serif font-bold text-foreground">
                    {t(copy.praxis.noteVcsTitle)}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(copy.praxis.noteVcs)}
                </p>
              </div>
            </div>
          </div>
        </Section>

        <Section index="04" label={t(copy.praxis.s4Label)}>
          <CardGrid cols={3}>
            <PriceRow title={t(copy.praxis.costToolsTitle)} price={`${p("toolsMonthly")}/mo`}>
              {t(copy.praxis.costTools)}
            </PriceRow>
            <PriceRow
              title={t(copy.praxis.costSessionTitle)}
              price={p("sessionPromo")}
              was={p("sessionStandard")}
            >
              {t(copy.praxis.costSession)}
            </PriceRow>
            <PriceRow title={t(copy.praxis.costSprintTitle)} price={p("sprint")}>
              {t(copy.praxis.costSprint)}
            </PriceRow>
          </CardGrid>
        </Section>

        <Section index="05" label={t(copy.praxis.s5Label)}>
          <div className="bg-secondary/30 border border-border rounded-2xl p-6 max-w-2xl">
            <Eyebrow className="mb-3 text-muted-foreground/70">{t(copy.praxis.prereqLabel)}</Eyebrow>
            <p className="text-muted-foreground leading-relaxed">{t(copy.praxis.prereq)}</p>
          </div>
        </Section>

        <Link
          href="/praxis-programme"
          className="mt-16 group flex items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
        >
          <div>
            <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {t(copy.praxis.programmeTitle)}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              {t(copy.praxis.programmeBody)}
            </p>
          </div>
          <span className="hidden sm:inline text-sm font-medium text-primary shrink-0">
            {t(copy.praxis.programmeLink)} →
          </span>
        </Link>

        <Etymology pull={t(copy.praxis.etymPull)}>
          {locale === "fr" ? (
            <p>
              Praxis désigne la connaissance éprouvée par l'action. Le mot vient du grec{" "}
              <em>prâxis</em> — l'action dont la finalité réside dans l'action elle-même. Aristote la
              distinguait de la <em>theoria</em> (la contemplation) et de la <em>poiesis</em> (la
              fabrication, qui produit un objet extérieur à elle). L'usage moderne, après Freire, y
              voit la boucle théorie, action, réflexion, théorie affinée.
            </p>
          ) : (
            <p>
              Praxis means knowledge proven by doing. It comes from the Greek <em>prâxis</em> —
              action whose purpose lies in the action itself. Aristotle separated it from{" "}
              <em>theoria</em> (contemplation) and <em>poiesis</em> (making, which produces an object
              outside itself). Modern usage, after Freire, treats it as the loop of theory, action,
              reflection, sharper theory.
            </p>
          )}
        </Etymology>

        <ClosingCta
          title={t(copy.praxis.ctaTitle)}
          body={t(copy.praxis.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookSession)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
