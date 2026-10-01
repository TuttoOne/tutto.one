import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight, Quote } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  ClosingCta,
  HeadlinePrice,
  LogoMarquee,
  NumberedList,
  Section,
} from "@/components/product/ProductPage";
import { SITE_TITLE, useT } from "@/lib/i18n";
import { landing, testimonial } from "@/lib/landing-copy";
import { praxisEconomics, price } from "@/lib/pricing";
import { usePreferences } from "@/lib/preferences";
import { MarkupLayer } from "@/components/markup/MarkupLayer";
import { CopyEditor } from "@/components/copy/CopyEditor";

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
 * Blocks in the order somebody decides in: the pain and the two tracks, the
 * evidence, the order the work happens in, what it costs, and the tracks again.
 * Nothing here defines its own type, colour or spacing — it is `Layout` for the
 * chrome, `Section` for the ruled heads, `NumberedList` for the sequence and
 * `HeadlinePrice` for the price, so the front door moves when the rest of
 * the site does. All the words are in `client/src/lib/landing-copy.ts`.
 */
export default function Landing() {
  const t = useT();

  /* The tab title is the second line of the headline, so it is translated for
     free. The first line cycles, which a tab title cannot. */
  const title = t(landing.hero.titleSecond).replace(/\.$/, "");
  useEffect(() => {
    document.title = `Tutto | ${title}`;
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

      {/* "Claude" stays put and the rest of the line is typed out. The line never
          wraps, so the type scales with the viewport: the longest line
          ("Claude peut tout construire" in French, about 11.6em) has to fit a phone, and
          the size is capped at the old headline size from `lg` up. The second
          line is fixed. */}
      <h1 className="text-[clamp(1.3rem,7vw,3.5rem)] font-serif font-bold leading-[1.1] tracking-tight">
        <span className="block whitespace-nowrap">
          {t(landing.hero.title)} <TypedWords />
        </span>
        <span className="block whitespace-nowrap">{t(landing.hero.titleSecond)}</span>
      </h1>

      {/* Two columns from `lg` up: the deck and the tracks on the left, the
          testimonial on the right. The headline stays above both at full
          width, because its first line is too long to share a row. Below `lg`
          the testimonial drops under the tracks, so the buttons stay first.

          Side by side, both columns are justified and end on the same line:
          the grid stretches the left column to the foot of the card and the
          spare height is shared between the deck, the buttons and the note.
          The deck gives up its hand-set line breaks there, because a line
          that ends on a forced break cannot be justified. */}
      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-10">
        <div className="lg:flex lg:flex-col lg:justify-between">
          <div className="max-w-2xl space-y-4">
            <p className="text-xl text-foreground leading-relaxed sm:whitespace-pre-line lg:whitespace-normal lg:text-justify">
              {t(landing.hero.deck)}
            </p>
          </div>

          {/* The two tracks. Every button on this page goes to one or the other. */}
          <div className="mt-9 flex flex-col sm:flex-row gap-4">
            <Link
              href={landing.tracks.work.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {t(landing.tracks.work.label)} <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={landing.tracks.life.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {t(landing.tracks.life.label)} <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground leading-relaxed lg:text-justify">
            {t(landing.hero.tracksNote)}
          </p>
        </div>

        <Testimonial />
      </div>
    </header>
  );
}

/**
 * One client, in their own words, beside the hero.
 *
 * `Panel`'s ground, so it reads as a note on the page rather than a third
 * button. The only amber is the quote mark.
 *
 * From `lg` up it is pulled up beside the headline's second line, which is
 * short and fixed. It stays clear of the first line, which runs wider than
 * the column. If the second line gets longer than the left column, drop the
 * `lg:-mt-14`. The left column stretches to the foot of the card either way.
 */
function Testimonial() {
  const t = useT();

  return (
    <figure className="mt-10 lg:-mt-14 max-w-2xl bg-secondary/30 rounded-2xl border border-border p-6">
      <Quote className="w-6 h-6 text-primary" aria-hidden="true" />
      <blockquote className="mt-4 text-base text-foreground leading-relaxed text-justify">
        {t(testimonial.quote)}
      </blockquote>
      <figcaption className="mt-5 text-sm">
        <span className="font-medium text-foreground">{testimonial.name}</span>
        <span className="text-muted-foreground">, {t(testimonial.place)}</span>
      </figcaption>
    </figure>
  );
}

/** The pace of the headline's first line: a letter typed, a letter rubbed
 *  out, and how long a finished phrase stays up before it goes. */
const TYPE_MS = 60;
const RUB_OUT_MS = 30;
const HOLD_MS = 1600;

/**
 * The cycling half of the headline, one of `hero.titleCycle` at a time: the
 * phrase is typed out, held, rubbed out a letter at a time and replaced by
 * the next.
 *
 * It stops while the copy editor is open, because the editor wraps text nodes
 * underneath React and a re-render would undo that. With reduced motion the
 * phrases swap whole, with no typing. A screen reader gets the first one and
 * no updates.
 */
function TypedWords() {
  const t = useT();
  const words = landing.hero.titleCycle.map((w) => t(w));
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(words[0].length);
  const [rubbing, setRubbing] = useState(false);

  const word = words[i % words.length];
  const full = shown >= word.length;

  useEffect(() => {
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const next = () => {
      if (document.body.classList.contains("copy-editing")) return;
      if (still) {
        setI((n) => (n + 1) % words.length);
        setShown(Infinity);
      } else if (rubbing && shown <= 0) {
        setI((n) => (n + 1) % words.length);
        setRubbing(false);
      } else if (rubbing) {
        setShown(Math.min(shown, word.length) - 1);
      } else if (full) {
        setRubbing(true);
      } else {
        setShown(shown + 1);
      }
    };
    const wait = full && !rubbing ? HOLD_MS : rubbing ? RUB_OUT_MS : TYPE_MS;
    /* An interval, so a tick skipped while the copy editor is open is tried
       again; every other tick changes state and so restarts the effect. */
    const id = window.setInterval(next, wait);
    return () => window.clearInterval(id);
  }, [shown, rubbing, full, word.length, words.length]);

  return (
    <>
      <span className="sr-only">{words[0]}</span>
      <span aria-hidden="true" className="text-primary">
        {word.slice(0, Math.max(shown, 0))}
        <span className="hero-caret" />
      </span>
    </>
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
 * Under it, the For Life track as a block of its own, to /peer-groups.
 */
function Pricing() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const econ = praxisEconomics(currency, locale);
  const { offer, peer } = landing.pricing;

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
      <Link
        href={landing.tracks.life.href}
        className="mt-4 group flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
      >
        <div>
          <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
            {t(peer.title)}
          </p>
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">
            {t(peer.body).replace("{price}", price("peerGroupSeat", currency, locale))}
          </p>
        </div>
        <span className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-full text-sm font-medium shrink-0">
          {t(peer.link)} <ArrowRight className="w-4 h-4" />
        </span>
      </Link>
    </Section>
  );
}

/** The conversion moment: the same two tracks as the hero. */
function Close() {
  const t = useT();

  return (
    <ClosingCta
      rule
      title={t(landing.close.title)}
      body={t(landing.close.body)}
      href={landing.tracks.work.href}
      label={t(landing.tracks.work.label)}
      secondary={{ href: landing.tracks.life.href, label: t(landing.tracks.life.label) }}
      messageLabel={t(landing.close.alt)}
      footnote={
        <>
          {t(landing.close.signatureNote)}, {t(landing.footer.place)}
        </>
      }
    />
  );
}
