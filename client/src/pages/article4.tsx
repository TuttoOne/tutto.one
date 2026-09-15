import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import {
  ProductHero,
  Section,
  HeadlinePrice,
  NumberedList,
  FigureRows,
  ClosingCta,
} from "@/components/product/ProductPage";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

/**
 * The scoping call. Thirty minutes, the same slot the rest of the site books —
 * a page whose whole argument is "one action" should not invent a second
 * calendar.
 */
const BOOKING = "https://cal.com/tuttoone/15min";

/** Engagements delivered per quarter. One person delivers, so this is capacity. */
const SLOTS_PER_QUARTER = 3;

/**
 * /article-4 — decision-first, for a buyer who has an obligation.
 *
 * The rest of the site is depth-first, which is right for a reader who already
 * wants to go deeper and wrong for one deciding whether to book. This page is
 * the other thing: one offer, one price, one action, and nothing that does not
 * move a reader toward the call.
 *
 * Three things are deliberately absent — the wider portfolio, the technical
 * architecture, and any mention of agents or automation. All of that is a
 * click away in the bar at the top, and a reader who wants it will use it.
 * Daniel's background is two lines and appears once, signed at the foot.
 *
 * Sections are unnumbered, as on `/`. The `index="01"` register belongs to the
 * document pages, where the numbering is telling a reader how far through an
 * argument they are; here there is no argument to be far through.
 *
 * Unlisted in the nav on purpose: this is a page you paste into an email.
 */
export default function Article4() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const c = copy.article4;

  useEffect(() => {
    document.title = t(c.pageTitle);
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  /**
   * The six sessions, set as a list rather than a grid of cards.
   *
   * They were six bordered boxes, and six boxes is a feature grid — which is
   * the one thing a curriculum must not look like. The sixth is the deliverable
   * rather than a subject, which is the point of the course: the file is
   * produced in the room, not written up afterwards.
   */
  const sessions = [
    { n: "01", title: t(c.s1Title), body: t(c.s1Body) },
    { n: "02", title: t(c.s2Title), body: t(c.s2Body) },
    { n: "03", title: t(c.s3Title), body: t(c.s3Body) },
    { n: "04", title: t(c.s4Title), body: t(c.s4Body) },
    { n: "05", title: t(c.s5Title), body: t(c.s5Body) },
    { n: "06", title: t(c.s6Title), body: t(c.s6Body) },
  ];

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* No secondary CTA. There is one action on this page. */}
        <ProductHero
          eyebrow={t(c.eyebrow)}
          title={t(c.title)}
          standfirst={<p>{t(c.standfirst)}</p>}
          meta={t(c.meta)}
          primaryCta={{ label: t(c.ctaLabel), href: BOOKING }}
        />

        {/*
          Funding sits directly under the call to action, ahead of any section.
          The handoff asks for it above the fold on a phone, which is not
          literally reachable with a hero above it; first thing after the button
          is the nearest honest reading, and shrinking the hero to fake it would
          cost more than it bought.

          It is a single panel, not a card inside a panel: the nested version put
          three near-identical off-whites inside each other and set the price
          beside the title, where it read as a right-aligned label on the block
          that has the most selling to do.
        */}
        <HeadlinePrice
          label={t(c.fundingLabel)}
          title={t(c.fundingTitle)}
          price={price("praxisCohort", currency, locale)}
          note={t(c.fundingNote)}
        >
          {t(c.fundingBody)}
        </HeadlinePrice>

        <Section label={t(c.getLabel)} title={t(c.getTitle)} intro={<p>{t(c.getIntro)}</p>}>
          <NumberedList items={sessions} />
        </Section>

        {/*
          The three urgency levers, and only these three. Each is checkable: a
          dated regulation, how OPCO budgets work, and one person's diary.

          Rows, not cards, and the same rows as the sessions above. As a boxed
          triplet this was the one place the page stopped being a document and
          became a feature grid — and with three bodies of different lengths,
          two of the three boxes carried dead space so the third could fit.
        */}
        <Section label={t(c.whyLabel)} title={t(c.whyTitle)}>
          <FigureRows
            items={[
              { figure: t(c.urgency1Stat), body: t(c.urgency1Body) },
              { figure: t(c.urgency2Stat), body: t(c.urgency2Body) },
              { figure: String(SLOTS_PER_QUARTER), body: t(c.urgency3Body) },
            ]}
          />
        </Section>

        {/*
          TODO(proof): one named client or one named sector, once Andros lands.
          Deliberately not shipped as an empty placeholder — a section headed
          "who has done this" with nothing under it reads worse to a buyer than
          no section at all. It goes here, as a Section with a named line, and
          nothing about it is invented in the meantime.
        */}

        {/* messageLabel={null}: one action, so no way out to /contact. */}
        <ClosingCta
          title={t(c.ctaTitle)}
          body={t(c.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookShort)}
          messageLabel={null}
          footnote={t(c.who)}
          rule
        />
      </div>
    </Layout>
  );
}
