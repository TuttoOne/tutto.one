import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  ClosingCta,
  HeadlinePrice,
  LogoMarquee,
  NumberedList,
  Section,
} from "@/components/product/ProductPage";
import { SITE_TITLE, useT } from "@/lib/i18n";
import { landing } from "@/lib/landing-copy";
import { praxisEconomics } from "@/lib/pricing";
import { usePreferences } from "@/lib/preferences";
import { MarkupLayer } from "@/components/markup/MarkupLayer";
import { CopyEditor } from "@/components/copy/CopyEditor";

/* The free 60-minute session described under the hero button: an
   introduction, a start on the scorecard and policy tools, a first artefact,
   and formal training booked. Other pages book the
   15-minute intro call. The paid 90-minute QuickStart is not linked from the
   site: it is sent by hand after a call. */
const BOOKING = "https://cal.com/tuttoone/60-min-meeting";

/**
 * The site's front door, at `/`.
 *
 * It sells one thing — output you don't rewrite — and it is 400 words in each language
 * because the reader is deciding whether to give us half an hour, not whether
 * to sign. The version before this one offered four things at once and was
 * forgettable for it; the sequence (chat, workspace, agent) replaced the four
 * doors because a reader cannot see what to buy until they can see where they
 * currently are.
 *
 * Blocks in the order somebody decides in: the pain and the offer, the
 * evidence, the order the work happens in, what it costs, and the call.
 * Nothing here defines its own type, colour or spacing — it is `Layout` for the
 * chrome, `Section` for the ruled heads, `NumberedList` for the sequence and
 * `HeadlinePrice` for the price, so the front door moves when the rest of
 * the site does. All the words are in `client/src/lib/landing-copy.ts`.
 */
export default function Landing() {
  const t = useT();

  /* The tab title is the headline, so it is translated for free and there is
     no second sentence to keep in step with the first. */
  const title = `${t(landing.hero.title)} ${t(landing.hero.titleSecond)}`.replace(/\.$/, "");
  useEffect(() => {
    document.title = `Tutto — ${title}`;
    return () => {
      document.title = SITE_TITLE;
    };
  }, [title]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Hero />
        <Clients />
        <Sequence />
        <Pricing />
        <Close />
      </div>

      {/* Review overlay: notes, arrows and text boxes drawn straight onto the
          page, saved where an agent can read them. Development only — the
          import is tree-shaken out of a production build by this guard. */}
      {import.meta.env.DEV && <MarkupLayer page="landing" />}

      {/* Copy editing: makes every sentence on this page contentEditable and
          writes the changed ones back to client/src/lib/landing-copy.ts, with a
          live word count against the 350-word brief. Development only. */}
      {import.meta.env.DEV && <CopyEditor copy={landing} name="landing" />}
    </Layout>
  );
}

/**
 * The opener.
 *
 * `ProductHero` would be the straight reuse and is not used, for one reason:
 * this headline is set larger than every other page's, and at that size the
 * house hero's measure (`max-w-3xl`) breaks it in the wrong place; `max-w-2xl`
 * gives two even lines. The classes are `ProductHero`'s otherwise, copied rather than
 * invented, so the two cannot drift apart.
 */
function Hero() {
  const t = useT();

  return (
    <header className="pt-8 pb-4">

      {/* One sentence per line, kept whole from `sm` up. The sizes are set so
          the longest line (the French second sentence, about 16em) fits the
          container at each breakpoint; on a phone the lines wrap instead of
          shrinking to fit. */}
      <h1 className="text-4xl sm:text-[2.25rem] md:text-[2.75rem] lg:text-[3.5rem] font-serif font-bold leading-[1.1] tracking-tight">
        <span className="block sm:whitespace-nowrap">{t(landing.hero.title)}</span>
        <span className="block sm:whitespace-nowrap">{t(landing.hero.titleSecond)}</span>
      </h1>
      <p className="mt-4 text-2xl sm:text-3xl font-serif font-bold tracking-tight text-primary">
        {t(landing.hero.subtitle)}
      </p>

      <div className="mt-6 max-w-2xl space-y-4">
        <p className="text-xl text-foreground leading-relaxed">
          {t(landing.hero.deck)}
        </p>
      </div>

      <div className="mt-9 flex flex-col sm:flex-row gap-4">
        <a
          href={BOOKING}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          {t(landing.hero.cta)}
        </a>
        <Link
          href={landing.footer.longVersion.href}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          {t(landing.hero.secondaryCta)} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
      <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed">
        {t(landing.hero.ctaNote)}
      </p>
    </header>
  );
}

/**
 * The client band.
 *
 * Second on the page, directly under the hero, because everything above it is
 * a claim and this is the only evidence on the sheet. It carries no heading of
 * its own beyond the section label — a client wall that has to explain itself
 * is not working.
 */
function Clients() {
  const t = useT();

  return (
    <Section label={t(landing.clients.label)}>
      <LogoMarquee items={landing.clients.items} />
    </Section>
  );
}

/**
 * The argument: three steps, numbered.
 *
 * `NumberedList` rather than three cards. A sequence has an order and cards do
 * not show one — side by side they read as three options to choose between,
 * which is the exact misreading this section exists to prevent.
 */
function Sequence() {
  const t = useT();

  return (
    <Section label={t(landing.sequence.label)} title={t(landing.sequence.title)}>
      <NumberedList
        items={landing.sequence.steps.map((step) => ({
          n: step.n,
          title: t(step.title),
          body: t(step.body),
        }))}
      />
    </Section>
  );
}

/**
 * The one price on the front door: The AI-Fluent Team, with its regular price
 * struck through while the back-to-work special runs. Everything else — the
 * stack, the guarantee, Fast Track — is on /praxis-programme, one click on.
 */
function Pricing() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const econ = praxisEconomics(currency, locale);
  const { offer } = landing.pricing;

  return (
    <Section label={t(landing.pricing.label)}>
      <HeadlinePrice
        title={t(offer.title)}
        price={econ.course}
        was={econ.specialActive ? econ.teamRegular : undefined}
        note={
          <>
            {econ.specialActive && (
              <>{t(offer.special).replace("{date}", econ.specialEnds)} </>
            )}
            <Link href="/praxis-programme" className="text-primary hover:underline">
              {t(offer.link)} →
            </Link>
          </>
        }
      >
        {t(offer.body)}
      </HeadlinePrice>
    </Section>
  );
}

/** The conversion moment. */
function Close() {
  const t = useT();

  return (
    <ClosingCta
      rule
      title={t(landing.close.title)}
      body={t(landing.close.body)}
      href={BOOKING}
      label={t(landing.close.cta)}
      messageLabel={t(landing.close.alt)}
      footnote={
        <>
          {t(landing.close.signatureNote)}, {t(landing.footer.place)}
        </>
      }
    />
  );
}
