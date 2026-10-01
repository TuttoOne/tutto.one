import { useEffect, useRef, useState } from "react";
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
  const title = t(landing.hero.titleSecond).replace(/\n/g, " ");
  useEffect(() => {
    document.title = `Tutto | ${title}`;
    return () => {
      document.title = SITE_TITLE;
    };
  }, [title]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 pt-6 pb-12">
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
  const second = t(landing.hero.titleSecond);
  const third = t(landing.hero.titleThird);
  const headline = useFittedHeadline(
    t(landing.hero.title),
    landing.hero.titleCycle.map((w) => t(w)),
    [second, third],
  );

  return (
    <header>

      {/* "Claude" stays put and the rest of the line is typed out. The second
          and third lines are fixed.

          From `sm` up it is three lines, none of which wraps, and the type is
          sized so the longest one runs the full width, to the right edge of
          the testimonial. On a phone each line folds in two at a hand-set
          break (the typed words drop under "Claude"), which lets the type be
          larger and leaves no single word on a line of its own.

          The size comes from `useFittedHeadline`. The class is only what
          shows before it has run. */}
      <h1
        ref={headline}
        className="text-[clamp(1.3rem,7vw,3.5rem)] font-serif font-bold leading-[1.05] tracking-tight"
      >
        <span className="block whitespace-nowrap">
          {t(landing.hero.title)}{" "}
          <span className="block sm:inline">
            <TypedWords />
          </span>
        </span>
        <span className="block whitespace-pre-line sm:whitespace-nowrap">{second}</span>
        <span className="block whitespace-pre-line sm:whitespace-nowrap">{third}</span>
      </h1>

      {/* Two columns from `lg` up: the deck and the tracks on the left, the
          testimonial on the right. The headline stays above both at full
          width, because its first line is too long to share a row. Below `lg`
          the testimonial drops under the tracks, so the buttons stay first.

          Side by side, both columns are justified and start and end on the
          same lines. The card's width and padding and the deck's type size are
          picked so the columns come out close to each other in both languages.
          The grid stretches the shorter one, and the spare height goes between
          the deck's two paragraphs and the buttons (their wrapper steps aside
          at `lg` so all three share it), or above the card's signature. */}
      <div className="mt-3 lg:grid lg:grid-cols-[minmax(0,1fr)_28rem] lg:gap-10">
        <div className="lg:flex lg:flex-col lg:justify-between">
          <div className="max-w-2xl space-y-4 lg:contents">
            <p className="text-[0.9375rem] lg:text-sm text-foreground leading-relaxed lg:leading-relaxed text-justify">
              {t(landing.hero.deck)}
            </p>
            <p className="text-[0.9375rem] lg:text-sm text-foreground leading-relaxed lg:leading-relaxed text-justify">
              {t(landing.hero.deckTeach)}
            </p>
          </div>

          {/* The two tracks. Every button on this page goes to one or the other.
              They are stacked, the same width, each with what it is beside it.
              On a phone the note drops under its button, centred like the
              button's own label. */}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-[auto_minmax(0,1fr)] gap-x-5 gap-y-2 sm:gap-y-3 sm:items-center">
            <Link
              href={landing.tracks.work.href}
              className="flex items-center justify-center gap-2 px-8 py-2.5 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {t(landing.tracks.work.label)} <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed text-center sm:text-left">
              {t(landing.tracks.work.note)}
            </p>
            <Link
              href={landing.tracks.life.href}
              className="mt-3 sm:mt-0 flex items-center justify-center gap-2 px-8 py-2.5 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {t(landing.tracks.life.label)} <ArrowRight className="w-4 h-4" />
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed text-center sm:text-left">
              {t(landing.tracks.life.note)}
            </p>
          </div>
        </div>

        <Testimonial />
      </div>
    </header>
  );
}

/** The caret after the typed words: its width and margin in `.hero-caret`. */
const CARET_EM = 0.12;

/** The largest the headline goes on a phone, where each line is folded in two.
 *  Just under `sm` the halves are short for the width, and without a cap the
 *  type would be far larger than it is on the other side of the breakpoint. */
const FOLDED_MAX_PX = 48;

/**
 * Sizes the headline so its longest line runs the full width of the hero.
 *
 * Which line is longest depends on the language and on how the lines are
 * folded, so it is measured here; a size written into the class would be
 * right for one language at one width. From `sm` up the lines are "Claude"
 * with each typed phrase, and each fixed line whole. On a phone they are
 * "Claude", each typed phrase, and each half of each fixed line.
 *
 * It measures on a canvas, in the headline's own font, so nothing is added to
 * the page for the copy editor to trip over. Returns the ref for the `h1`.
 */
function useFittedHeadline(lead: string, typed: string[], fixed: string[]) {
  const ref = useRef<HTMLHeadingElement>(null);
  const lines = [lead, ...typed, ...fixed].join("|");

  useEffect(() => {
    const h1 = ref.current;
    const pen = document.createElement("canvas").getContext("2d");
    if (!h1 || !pen) return;
    const whole = window.matchMedia("(min-width: 640px)");

    const fit = () => {
      const style = getComputedStyle(h1);
      const tracking = parseFloat(style.letterSpacing) / parseFloat(style.fontSize) || 0;
      pen.font = `${style.fontWeight} 100px ${style.fontFamily}`;
      const em = (s: string, extra = 0) =>
        pen.measureText(s).width / 100 + s.length * tracking + extra;

      const widths = whole.matches
        ? [
            ...typed.map((w) => em(`${lead} ${w}`, CARET_EM)),
            ...fixed.map((l) => em(l.replace(/\n/g, " "))),
          ]
        : [
            em(lead),
            ...typed.map((w) => em(w, CARET_EM)),
            ...fixed.flatMap((l) => l.split("\n").map((half) => em(half))),
          ];

      /* A hair under the full width, so a rounding error cannot push the
         longest line past the edge. */
      const size = (h1.clientWidth / Math.max(...widths)) * 0.995;
      h1.style.fontSize = `${whole.matches ? size : Math.min(size, FOLDED_MAX_PX)}px`;
    };

    fit();
    /* The first measure can be in the fallback font. */
    document.fonts.ready.then(fit);

    /* Refit when the width changes, and only then: a new size changes the
       headline's height, which the observer also reports, and resizing from
       inside its own callback is a "ResizeObserver loop" error. So the work
       is put off to the next frame and a report with the same width is
       dropped. */
    let width = h1.clientWidth;
    let frame = 0;
    const watch = new ResizeObserver(() => {
      if (h1.clientWidth === width) return;
      width = h1.clientWidth;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(fit);
    });
    watch.observe(h1);
    whole.addEventListener("change", fit);
    return () => {
      watch.disconnect();
      cancelAnimationFrame(frame);
      whole.removeEventListener("change", fit);
    };
    /* `lines` stands in for the three arguments, which are new arrays on
       every render. */
  }, [lines]);

  return ref;
}

/**
 * One client, in their own words, beside the hero.
 *
 * White on black, the one dark block on the page, so it is read as somebody
 * else's voice. The only amber is the quote mark. It keeps a border in dark
 * mode, where the page is nearly as dark as the card.
 *
 * From `lg` up it starts level with the deck and ends level with the second
 * button. The quote is set a touch larger than the deck there, which is what
 * brings the two columns out at the same height.
 */
function Testimonial() {
  const t = useT();

  return (
    <figure className="mt-10 lg:mt-0 max-w-2xl bg-neutral-900 rounded-2xl border border-neutral-900 dark:border-neutral-700 p-6 lg:flex lg:flex-col">
      <Quote className="w-6 h-6 text-primary" aria-hidden="true" />
      <blockquote className="mt-4 text-sm lg:text-[0.9375rem] text-white leading-relaxed lg:leading-relaxed text-justify">
        {t(testimonial.quote)}
      </blockquote>
      <figcaption className="mt-5 lg:mt-auto lg:pt-5 text-sm">
        <span className="font-medium text-white">{testimonial.name}</span>
        <span className="text-white/60">, {t(testimonial.place)}</span>
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
 *
 * `tight`, and the hero above is kept short, so the logos are on screen
 * before the reader scrolls on a laptop.
 */
function Clients() {
  const t = useT();

  return (
    <Section tight label={t(landing.clients.label)}>
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
