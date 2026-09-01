import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { ClosingCta, Plate, ProductHero, Section } from "@/components/product/ProductPage";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";
import { DEFAULT_SERVICES, localiseService, type ServiceItem } from "@/lib/services-content";
import { pick, copy, useT, SITE_TITLE } from "@/lib/i18n";

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
 * of the section is that the two are alternatives, not a ladder, so neither may
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
 * One page, read top to bottom: how the work is shaped, what the first step
 * costs, then the named engagements.
 *
 * The six things clients ask for collapse onto one axis — whether we end up
 * owning the system or they do — so the opening is two columns of three rather
 * than six cards. The priced engagements still sit on this page rather than
 * one click away: someone who already knows what they want should not have to
 * navigate to find it, and someone who does not gets the framing first.
 */
export default function Services() {
  const { locale, currency } = usePreferences();
  const t = useT();
  const { data: servicesContent } = useQuery<{ value: string }>({
    queryKey: ["/api/site-content/services"],
    retry: false,
  });

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "Prestations — deux portes d'entrée | Tutto"
        : "Services — two ways in | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const services: ServiceItem[] = (() => {
    if (!servicesContent) return DEFAULT_SERVICES;
    try {
      return JSON.parse(servicesContent.value);
    } catch {
      return DEFAULT_SERVICES;
    }
  })();

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
          <Plate
            src="/artwork/teacher.webp"
            width={1800}
            height={1347}
            alt={t(copy.plates.teacher)}
            caption={t(copy.waysIn.plateTeacherCaption)}
            className="mb-10"
          />

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
        />

        {/* The named engagements, still editable from the admin dashboard. */}
        <Section
          index="03"
          label={t(copy.services.title)}
          intro={<p>{t(copy.services.standfirst)}</p>}
        >
          <div className="grid md:grid-cols-3 gap-5">
            {services.map((service, index) => {
              const text = localiseService(service, locale);
              return (
                <div
                  key={index}
                  data-testid={`card-service-${index}`}
                  className="bg-card border border-border rounded-2xl p-7 flex flex-col"
                >
                  <h3 className="text-lg font-serif font-bold mb-3">{text.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-7">
                    {text.description}
                  </p>

                  <ul className="space-y-3 mb-7 flex-1">
                    {text.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-sm">
                        <Check className="w-4 h-4 text-primary mr-3 mt-0.5 shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-auto">
                    {service.note && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-4 pt-4 border-t border-border">
                        {pick(service.note, locale)}
                      </p>
                    )}
                    <div className="text-sm font-medium mb-4">
                      {service.priceKey
                        ? `${service.pricePrefix ? pick(service.pricePrefix, locale) + " " : ""}${price(service.priceKey, currency, locale)}`
                        : service.priceLabel
                          ? pick(service.priceLabel, locale)
                          : service.price}
                    </div>
                    <Button className="w-full rounded-full" variant="outline" asChild>
                      <Link href={service.href ?? "/contact"}>
                        {service.ctaLabel ? pick(service.ctaLabel, locale) : t(copy.services.inquire)}
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </Section>

        <ClosingCta
          title={t(copy.waysIn.ctaTitle)}
          body={t(copy.waysIn.ctaBody)}
          href={BOOKING}
          label={t(copy.services.runDiagnostic)}
          messageLabel={t(copy.common.sendMessage)}
        />
      </div>
    </Layout>
  );
}
