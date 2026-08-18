import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { ClosingCta, ProductHero, Section } from "@/components/product/ProductPage";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

const BOOKING = "https://cal.com/tuttoone/15min";

interface Want {
  /** 01–06, so the six map back to the list they came from. */
  numeral: string;
  /** The ask in the client's own words, quote marks included. */
  quote: string;
  body: string;
}

/**
 * One side of the split. Both columns are the same shape on purpose: the point
 * of the page is that the two are alternatives, not a ladder, so neither may
 * look like the upsell of the other.
 */
function Column({
  heading,
  qualifier,
  wants,
  cta,
}: {
  heading: string;
  qualifier: string;
  wants: Want[];
  cta: { label: string; href: string };
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-7 flex flex-col">
      {/* Roboto 900 is loaded (see index.html), so font-black is a real weight
          rather than a synthesised one. Both headings are the same length, so
          they wrap identically and the two columns stay level. */}
      <h2 className="text-3xl md:text-4xl font-serif font-black tracking-tight leading-[1.1] text-foreground">
        {heading}
      </h2>
      <p className="mt-3 text-sm text-muted-foreground">{qualifier}</p>

      <ul className="mt-8 pt-8 border-t border-border space-y-8 flex-1">
        {wants.map((w) => (
          <li key={w.numeral} className="relative pr-8">
            <span className="absolute top-1 right-0 text-[11px] font-mono text-muted-foreground/40 tabular-nums">
              {w.numeral}
            </span>
            <p className="font-serif text-lg leading-snug text-foreground">{w.quote}</p>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.body}</p>
          </li>
        ))}
      </ul>

      <Link
        href={cta.href}
        className="mt-9 inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        {cta.label} <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

/**
 * What the nav opens. /services is the priced detail, one click down.
 *
 * The services page sells three named packages. This one does not sell
 * anything by name — it asks the only question that actually changes the
 * engagement (who owns the system at the end) and quotes one price rather than
 * six, on the grounds that six priced cards read as a rate card. Anyone who
 * wants the packages is one link away; nobody has to read them to work out
 * whether they are in the right place.
 */
export default function WaysIn() {
  const t = useT();
  const { locale, currency } = usePreferences();

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "Deux portes d'entrée — notre façon de travailler | Tutto"
        : "Two ways in — how we work | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const build: Want[] = [
    { numeral: "01", quote: t(copy.waysIn.b1Q), body: t(copy.waysIn.b1Body) },
    { numeral: "02", quote: t(copy.waysIn.b2Q), body: t(copy.waysIn.b2Body) },
    { numeral: "03", quote: t(copy.waysIn.b3Q), body: t(copy.waysIn.b3Body) },
  ];

  const learn: Want[] = [
    { numeral: "04", quote: t(copy.waysIn.l1Q), body: t(copy.waysIn.l1Body) },
    { numeral: "05", quote: t(copy.waysIn.l2Q), body: t(copy.waysIn.l2Body) },
    { numeral: "06", quote: t(copy.waysIn.l3Q), body: t(copy.waysIn.l3Body) },
  ];

  const sprint = price("sprint", currency, locale);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <ProductHero
          eyebrow={t(copy.waysIn.eyebrow)}
          title={t(copy.waysIn.title)}
          standfirst={
            <>
              <p>{t(copy.waysIn.lead1)}</p>
              <p>{t(copy.waysIn.lead2)}</p>
            </>
          }
          primaryCta={{ label: t(copy.common.bookCall), href: BOOKING }}
          secondaryCta={{ label: t(copy.common.sendMessage), href: "/contact" }}
          meta={t(copy.waysIn.meta)}
        />

        <Section index="01" label={t(copy.waysIn.s1Label)}>
          <div className="grid md:grid-cols-2 gap-5">
            <Column
              heading={t(copy.waysIn.buildHeading)}
              qualifier={t(copy.waysIn.buildQualifier)}
              wants={build}
              cta={{ label: t(copy.waysIn.buildCta), href: "/portfolio" }}
            />
            <Column
              heading={t(copy.waysIn.learnHeading)}
              qualifier={t(copy.waysIn.learnQualifier)}
              wants={learn}
              cta={{ label: t(copy.waysIn.learnCta), href: "/praxis" }}
            />
          </div>
        </Section>

        <Section
          index="02"
          label={t(copy.waysIn.s2Label)}
          title={t(copy.waysIn.s2Title)}
          intro={
            <>
              {/* The figure is read from the pricing table rather than written
                  into the sentence, so it follows the currency toggle. */}
              <p>{t(copy.waysIn.priceBody1).replace("{price}", sprint)}</p>
              <p>{t(copy.waysIn.priceBody2)}</p>
            </>
          }
        >
          <Link
            href="/services"
            className="group inline-flex items-baseline gap-3 border-t border-border pt-5 w-full max-w-2xl"
          >
            <span className="text-sm font-medium text-primary group-hover:underline">
              {t(copy.waysIn.detailLabel)}
            </span>
            <span className="text-sm text-muted-foreground">{t(copy.waysIn.detailBody)}</span>
            <ArrowRight className="w-4 h-4 text-primary self-center ml-auto shrink-0" />
          </Link>
        </Section>

        <ClosingCta
          title={t(copy.waysIn.ctaTitle)}
          body={t(copy.waysIn.ctaBody)}
          href={BOOKING}
          label={t(copy.common.bookCall)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
