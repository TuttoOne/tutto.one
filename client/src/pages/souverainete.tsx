import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  HeadlinePrice,
  NumberedList,
  ClosingCta,
} from "@/components/product/ProductPage";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

/** The same thirty-minute slot as /article-4. One calendar for both doors. */
const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * /souverainete — the diagnostic-only page.
 *
 * This is the deliberately incomplete half of the pair. The full agent offer is
 * not published here, and the reason is that it cannot yet be evidenced: it
 * waits on one named reference workflow with a measured before and after, and
 * on signed per-server hosting terms. Publishing the whole offer now would mean
 * publishing claims that cannot be fulfilled, so what ships is the first step
 * and nothing else.
 *
 * The page says that out loud rather than hiding it. On a site whose whole
 * argument is that this work is plain and checkable, "we are not selling that
 * yet, and here is why" reads as rigour rather than as an absence.
 *
 * The offer sits directly under the hero, as the cohort price does on
 * /article-4. It had been two-thirds down, behind a definition section and a
 * loan panel — the same template as its sibling making the opposite decision,
 * on the page with less to say.
 */
export default function Souverainete() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const c = copy.souverainete;

  useEffect(() => {
    document.title = t(c.pageTitle);
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  /**
   * Sovereignty stated as three physical facts, not as a positioning claim.
   *
   * Unnumbered: they are parallel and independently true, not a sequence, and
   * numbering them made a definition read as a spec sheet. The loan rows below
   * keep their ordinals, where 01/02 genuinely means "the offer, then the
   * condition on it".
   */
  const facts = [
    { title: t(c.f1Title), body: t(c.f1Body) },
    { title: t(c.f2Title), body: t(c.f2Body) },
    { title: t(c.f3Title), body: t(c.f3Body) },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={t(c.eyebrow)}
          title={t(c.title)}
          standfirst={<p>{t(c.standfirst)}</p>}
          primaryCta={{ label: t(copy.common.bookCall), href: BOOKING }}
        />

        {/*
          The only thing for sale, stated before anything else. The explanation
          of why it is the only thing has moved to the closing byline: in here
          it was the largest block of copy in the box, which made the panel
          argue with an objection nobody had made and pushed the price to third
          place in its own panel.
        */}
        <HeadlinePrice
          label={t(c.offerLabel)}
          title={t(c.priceTitle)}
          price={price("sovereigntyDiagnostic", currency, locale)}
          note={t(c.priceBody2)}
        >
          <p>{t(c.priceBody)}</p>
        </HeadlinePrice>

        <Section label={t(c.factsLabel)} title={t(c.factsTitle)}>
          <NumberedList items={facts} />
        </Section>

        {/*
          The condition is the one most likely to kill this loan, and a reader
          who finds it at signature rather than here has been handled rather
          than told. So it gets a rule, a label of its own and the soft black,
          while the terms it qualifies stay grey — the loan and its gate carry
          equal weight without being set in identical type, which is how the
          qualifier disappeared into the pitch the first time.

          No panel around it: these are a third party's terms, secondary to the
          offer above, and a grey box here would have given the financing more
          furniture than the thing being sold. For the same reason the figures
          stay literal in the copy instead of resolving through pricing.ts —
          the currency toggle must not rewrite somebody else's product.
        */}
        <Section label={t(c.finLabel)} title={t(c.finSectionTitle)}>
          <NumberedList
            items={[
              { n: "01", title: t(c.finTitle), body: t(c.finBody) },
              { n: "02", title: t(c.finConditionLabel), body: t(c.finQualifier) },
            ]}
          />
        </Section>

        {/* messageLabel={null}: one action, as on /article-4. */}
        <ClosingCta
          title={t(c.ctaTitle)}
          body={t(c.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookShort)}
          messageLabel={null}
          footnote={t(c.holdNote)}
          rule
        />
      </div>
    </Layout>
  );
}
