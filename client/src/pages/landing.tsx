import { useEffect } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  ClosingCta,
  Eyebrow,
  HeadlinePrice,
  LogoMarquee,
  NumberedList,
  Section,
} from "@/components/product/ProductPage";
import { SITE_TITLE, useT } from "@/lib/i18n";
import { landing } from "@/lib/landing-copy";
import { price, perMonth } from "@/lib/pricing";
import { usePreferences } from "@/lib/preferences";
import { MarkupLayer } from "@/components/markup/MarkupLayer";
import { CopyEditor } from "@/components/copy/CopyEditor";

/* The 90-minute booking, which is the guided lesson this page prices at €100
   and the sequence describes as taking 90 minutes — not the 15-minute intro call
   the other pages book. Both CTA labels and the closing line are worded to match;
   a button that says one duration and books another is the fastest way to lose
   somebody at the last click. */
const BOOKING = "https://cal.com/tuttoone/90-min-meeting";

/**
 * The site's front door, at `/`.
 *
 * It sells one thing — we build agents — and it is 350 words in each language
 * because the reader is deciding whether to give us half an hour, not whether
 * to sign. The version before this one offered four things at once and was
 * forgettable for it; the sequence (chat, workspace, agent) replaced the four
 * doors because a reader cannot see what to buy until they can see where they
 * currently are.
 *
 * Four blocks, in the order somebody decides in: what we do, the sequence they
 * are on, what it costs, and the question they are actually worried about.
 * Nothing here defines its own type, colour or spacing — it is `Layout` for the
 * chrome, `Section` for the ruled heads, `NumberedList` for the sequence and
 * `HeadlinePrice` for the two figures, so the front door moves when the rest of
 * the site does. All the words are in `client/src/lib/landing-copy.ts`.
 */
export default function Landing() {
  const t = useT();

  /* The tab title is the headline, so it is translated for free and there is
     no second sentence to keep in step with the first. */
  const title = t(landing.hero.title).replace(/\.$/, "");
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
        <Data />
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
 * this headline is three words and every other page's is a sentence, so the
 * house hero's measure (`max-w-3xl`) leaves "We build agents." floating in half
 * a line of air. The classes are `ProductHero`'s otherwise, copied rather than
 * invented, so the two cannot drift apart.
 */
/**
 * The session figure, from the price table rather than the copy file.
 *
 * It appears three times on this page — both buttons and the rate card — and
 * it used to be typed into each. `pricing.ts` is the only place it lives now,
 * so a change there moves all three and the copy editor cannot reach it to
 * set one of them to something else.
 */
function useEntryPrice() {
  const { locale, currency } = usePreferences();
  return price("discoverySession", currency, locale);
}

function Hero() {
  const t = useT();
  const entryPrice = useEntryPrice();

  return (
    <header className="pt-8 pb-4">
      <Eyebrow className="mb-5">{t(landing.hero.eyebrow)}</Eyebrow>

      <h1 className="text-5xl md:text-7xl font-serif font-bold leading-[1.05] tracking-tight">
        {t(landing.hero.title)}
      </h1>

      <div className="mt-6 max-w-2xl space-y-4">
        <p className="text-xl text-foreground leading-relaxed">
          {t(landing.hero.promise)}
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
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
          {t(landing.hero.cta)} — {entryPrice}
        </a>
        <Link
          href={landing.footer.longVersion.href}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          {t(landing.hero.secondaryCta)} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
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
 * Both figures, stated plainly.
 *
 * The agent first because it is what is being sold, the class second because it
 * is how somebody who is not ready to buy one gets to a number for theirs. Both
 * prices are floors: "from" is doing real work and should survive editing.
 *
 * Side by side rather than stacked. Two prices in a column are read in
 * sequence — the second arrives as an afterthought to the first, a scroll
 * later — and these are meant to be compared: €3,000 for the thing we build
 * against €100 for the way in. Comparison needs them in the eye at once.
 * They stack again below `md`, where a column is the only honest option.
 */
function Pricing() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const entryPrice = useEntryPrice();
  const { build, class: entry } = landing.pricing;
  const buildPrice = price("agentBuildFrom", currency, locale);
  const buildMonthly = perMonth("agentMonthly", currency, locale);

  return (
    <Section label={t(landing.pricing.label)}>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2">
        <HeadlinePrice
          title={t(build.title)}
          price={`${t(build.pricePrefix)} ${buildPrice}`}
          note={t(build.note).replace("{monthly}", buildMonthly)}
        >
          {t(build.body)}{" "}
          {t(build.scope).replace("{price}", buildPrice)}
        </HeadlinePrice>

        <HeadlinePrice
          title={t(entry.title)}
          price={entryPrice}
          note={t(entry.note)}
        >
          {t(entry.body)}
        </HeadlinePrice>
      </div>

      <p className="mt-4 text-sm text-muted-foreground">{t(landing.pricing.vat)}</p>
    </Section>
  );
}

/** The question that stops people using any of this, answered with vendor
 *  names rather than reassurance. */
function Data() {
  const t = useT();

  return (
    <Section
      label={t(landing.data.label)}
      title={t(landing.data.statement)}
      intro={<p>{t(landing.data.body)}</p>}
    />
  );
}

/** The conversion moment, signed. */
function Close() {
  const t = useT();
  const entryPrice = useEntryPrice();

  return (
    <ClosingCta
      rule
      title={t(landing.close.title)}
      body={t(landing.close.body)}
      href={BOOKING}
      label={`${t(landing.close.cta)} — ${entryPrice}`}
      messageLabel={t(landing.close.alt)}
      footnote={
        <>
          <span className="font-serif font-bold text-foreground">
            {t(landing.close.signature)}
          </span>
          {" — "}
          {t(landing.close.signatureNote)}, {t(landing.footer.place)}
        </>
      }
    />
  );
}
