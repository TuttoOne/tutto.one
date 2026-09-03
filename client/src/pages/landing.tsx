import { useEffect, useState } from "react";
import { Link } from "wouter";
import { PointerMark } from "@/components/brand/PointerMark";
import { SITE_TITLE, copy, useT } from "@/lib/i18n";
import { landing } from "@/lib/landing-copy";
import { MarkupLayer } from "@/components/markup/MarkupLayer";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * The site's front door, at `/` (and still at `/next`, for links already sent).
 *
 * Deliberately not wrapped in <Layout>. The site's header carries nine links,
 * which is nine ways to leave a page whose only job is one booking; this one
 * keeps a wordmark and a single call at the top, routes the four offers from
 * the middle of the sheet, and carries the whole site in its foot. That is the
 * trade a landing page makes when it is also a home page: navigation exists,
 * but it is below the argument rather than above it.
 *
 * The form is a broadside, and four rules hold it together:
 *
 *   - Density. A broadside is ink-heavy because paper costs money. Spacing has
 *     exactly two values, and the tighter of the two is the default.
 *   - A rule at every boundary, spanning the sheet, at one weight. Rules are
 *     what separate the blocks; whitespace is not doing that job here.
 *   - One dialectic. Every block below the hero is the same argument shape —
 *     the claim in columns 1-5, what backs it from column 6 — so the page has
 *     a spine rather than an alternation of full-width and narrow sections.
 *   - Two inks, one accent. Running text is warm near-black, as ink on paper
 *     is, and grey is kept for microcopy; amber is on the figures and the call.
 *
 * It departs from the site's house style in two places on purpose — squared
 * buttons rather than pills, and Source Serif 4 rather than the grotesk the
 * `--font-serif` token resolves to — because a rounded amber pill is the most
 * SaaS-native object there is and this page argues the opposite. Both changes
 * are scoped here, so the control it is measured against is untouched.
 */
export default function Landing() {
  useEffect(() => {
    document.title = "Tutto — AI that does the job, not AI that describes it";
    return () => {
      document.title = SITE_TITLE;
    };
  }, []);

  return (
    <div className="broadside min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      <Bar />

      <main className="flex-1">
        <Hero />
        <Offers />
        <Proof />
        <Window />
        <Offer />
        <Close />
      </main>

      <Foot />

      {/* Review overlay: notes, arrows and text boxes drawn straight onto the
          page, saved where an agent can read them. Development only — the
          import is tree-shaken out of a production build by this guard. */}
      {import.meta.env.DEV && <MarkupLayer page="landing" />}
    </div>
  );
}

/* One gutter, one grid, one dialectic: the claim in 1-5, its evidence from 6. */
const SHEET = "max-w-5xl mx-auto px-6 md:px-10";
const GRID = "grid md:grid-cols-12 gap-x-6 lg:gap-x-8";
const WIDE = "md:col-span-10";
/** A reading measure that starts at column 1, for the hero's single column. */
const PROSE = "md:col-span-8";
const COL_L = "md:col-span-5";
const COL_R = "md:col-start-6 md:col-span-7";

/* Two vertical values, so spacing paces the page rather than filling it. */
const TIGHT = "py-12 md:py-14";
const BLOCK = "mt-7";

/** Row dividers. */
const RULE = "border-t border-border";
/** Section boundaries, at twice the weight, so the sheet has a coarse grain
 *  and a fine one rather than one undifferentiated ladder of hairlines. */
const RULE_MAJOR = "border-t-2 border-border";

const H2 =
  "font-bold text-[1.75rem] md:text-[1.9rem] leading-[1.15] tracking-tight";
const BODY = "text-[17px] ink leading-relaxed";
const LABEL =
  "text-xs font-mono uppercase tracking-[0.1em] text-muted-foreground";

/**
 * Squared and lettered rather than a pill, and at a size that can hold its own
 * against a 112px numeral: the page's only job is this one booking.
 */
function BookButton({ label }: { label: string }) {
  return (
    <a
      href={BOOKING}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center bg-primary text-primary-foreground rounded-[2px] px-10 py-5 text-[13px] font-semibold uppercase tracking-[0.12em] hover:bg-foreground transition-colors"
    >
      {label}
    </a>
  );
}

/** A rule-underlined line, for the calls that are not the one amber slab. */
function QuietLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "text-sm text-foreground/70 hover:text-foreground transition-colors border-b border-foreground/25 hover:border-foreground pb-0.5";
  return external ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function Bar() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div
        className={`${SHEET} h-[4.5rem] md:h-16 flex items-center justify-between gap-4`}
      >
        {/* -ml-1 optically seats the mark's ink on the same left edge as the
            stem of the headline below it; its box carries whitespace. */}
        <Link
          href="/"
          className="-ml-1 flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <PointerMark className="h-6 w-auto text-primary shrink-0" />
          <span className="broadside-serif font-semibold text-lg tracking-tight">
            Tutto<span className="text-primary">.</span>
          </span>
        </Link>
        <QuietLink href={BOOKING} external>
          {landing.bar.cta}
        </QuietLink>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className={`${SHEET} ${GRID} pt-14 pb-14 md:pt-20 md:pb-16`}>
      {/* What the reader already believes, struck through, before the claim
          that contradicts it. The rule is drawn in the accent rather than in
          the ink: it should read as a correction, not as deleted text. */}
      <ul className={`${WIDE} mb-7 space-y-1.5`}>
        {landing.hero.struck.map((line) => (
          <li
            key={line}
            className="text-lg md:text-xl text-muted-foreground line-through decoration-primary decoration-[1.5px]"
          >
            {line}
          </li>
        ))}
      </ul>

      <h1
        className={`${WIDE} font-bold tracking-tight text-[2.6rem] leading-[1.02] sm:text-6xl md:text-[4.5rem] md:leading-[0.98]`}
      >
        {landing.hero.title}
      </h1>

      {/* One column, and one thought: the promise, then what makes it possible,
          then the call. These were two boxes either side of the grid, which put
          the strongest sentence on the page in a margin and made the reader
          choose which half to read first. */}
      <div className={`${PROSE} ${BLOCK}`}>
        <p className="text-xl md:text-[1.5rem] ink leading-snug font-medium">
          {landing.hero.promise}
        </p>
        <p className={`mt-5 ${BODY} text-[17px] md:text-lg`}>
          {landing.hero.deck}
        </p>
        <div className="mt-8">
          <BookButton label={landing.hero.cta} />
        </div>
      </div>
    </section>
  );
}

/**
 * A block of the page's one argument shape. The hairline between claim and
 * evidence survives the collapse to a single column on a phone, where the two
 * would otherwise read as an ordinary heading and its paragraph.
 */
function Block({
  claim,
  children,
  className = "",
  pad = TIGHT,
}: {
  claim: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  pad?: string;
}) {
  return (
    <div className={`${GRID} ${RULE} ${pad} ${className}`}>
      <div className={COL_L}>{claim}</div>
      <div
        className={`${COL_R} max-md:mt-4 max-md:pt-4 max-md:border-t max-md:border-border`}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * The five things we do, named and linked.
 *
 * This section used to argue in the abstract that we are not the AI you have
 * been sold, which left a reader unable to tell which of the five it applied
 * to. Naming them lets somebody find themselves on the sheet and leave for the
 * right page — the one place on this landing page where an exit is the point.
 */
function Offers() {
  return (
    <section className={SHEET}>
      <div className={`${GRID} ${RULE_MAJOR} pt-12 md:pt-14 pb-6`}>
        <h2 className={`${WIDE} ${H2}`}>{landing.offersLabel}</h2>
      </div>
      {landing.offers.map((row) => (
        <Block
          key={row.name}
          pad="py-6"
          claim={
            <h3 className="font-bold text-[1.15rem] md:text-[1.3rem] leading-tight tracking-tight">
              <Link
                href={row.href}
                className="group inline-flex items-baseline gap-2 hover:text-primary transition-colors"
              >
                {row.name}
                <span
                  aria-hidden
                  className="text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  →
                </span>
              </Link>
            </h3>
          }
        >
          <p className={BODY}>{row.body}</p>
        </Block>
      ))}
    </section>
  );
}

/**
 * The sheet's one image, which may equally be its one video.
 *
 * Whether `landing.media.src` is a still or a video is read off the extension,
 * so swapping one for the other is a single line in the copy file and no change
 * here. Video is muted, looping, inline and autoplaying — it is illustration,
 * not something anybody asked to watch — and `prefers-reduced-motion` gets the
 * poster still instead, which is why a poster is kept even once video lands.
 *
 * The crop is upright on a phone and a wide band above it: the drawing is a
 * scene, and a scene at 390px wide either fills a tall frame or turns to mush
 * in a letterbox.
 */
const CROP =
  "w-full border-y border-border object-cover aspect-[4/5] object-[50%_40%] md:aspect-[2.6/1] md:object-[50%_52%]";

function Media({ alt }: { alt: string }) {
  const { src, poster } = landing.media;
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  const [still, setStill] = useState(false);
  useEffect(() => {
    const q = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(q.matches);
    const onChange = () => setStill(q.matches);
    q.addEventListener("change", onChange);
    return () => q.removeEventListener("change", onChange);
  }, []);

  if (!isVideo || still) {
    return (
      <img
        src={isVideo ? poster : src}
        width={1800}
        height={1347}
        loading="lazy"
        decoding="async"
        alt={alt}
        className={CROP}
      />
    );
  }

  return (
    <video
      src={src}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={alt}
      className={CROP}
    />
  );
}

/**
 * The figures, at poster scale, in the page's argument shape.
 *
 * The evidence column is bottom-aligned rather than top-aligned: against a
 * 112px numeral a top-aligned paragraph leaves a hole under itself and the
 * three rows stop reading as a table.
 *
 * The optical nudges are per-glyph, not a system: a lining `1` carries a wide
 * left sidebearing and a round `0` overshoots its box, so both hang slightly
 * left of the metric edge to look aligned against the `6` between them.
 */
const NUDGE: Record<string, string> = {
  "150,000": "-0.045em",
  "0": "-0.035em",
};

function Proof() {
  const t = useT();

  return (
    <>
      <section className={SHEET}>
        <div className={`${GRID} ${RULE_MAJOR} pt-12 md:pt-14 pb-6`}>
          <h2 className={`${WIDE} ${H2}`}>{landing.proofLabel}</h2>
        </div>

        {landing.proof.map((p, i) => {
          const large = i === landing.proof.length - 1;
          const figure = (
            <p
              style={{ marginLeft: NUDGE[p.figure] }}
              className={`broadside-serif font-bold text-primary tabular-nums tracking-[-0.03em] ${
                large
                  ? "text-[9.5rem] sm:text-[12rem] md:text-[13rem] leading-[0.78]"
                  : "text-[5rem] sm:text-[6.5rem] md:text-[7rem] leading-[0.82]"
              }`}
            >
              {p.figure}
            </p>
          );
          return (
            <Block
              key={p.figure}
              pad={large ? "pt-6 pb-10" : "py-6"}
              claim={
                /* One glyph cannot carry a three-word label beneath it — the
                 label ends up four times the width of the thing it names — so
                 the last row sets them side by side instead. */
                large ? (
                  <div className="flex items-baseline gap-5">
                    {figure}
                    <p className={`${LABEL} leading-snug whitespace-nowrap`}>
                      {p.unit}
                    </p>
                  </div>
                ) : (
                  <>
                    {figure}
                    <p className={`mt-3 ${LABEL}`}>{p.unit}</p>
                  </>
                )
              }
            >
              {/* Every evidence paragraph hangs from the same line, whatever the
                size of the numeral to its left, so the rows read as a table. */}
              <p className={`${BODY} md:pt-5`}>{p.body}</p>
            </Block>
          );
        })}
      </section>

      <figure className="mt-12">
        <Media alt={t(copy.plates.lawyer)} />
        <figcaption className={`${SHEET} ${GRID} mt-3`}>
          <span className="md:col-start-6 md:col-span-7 text-sm text-muted-foreground leading-relaxed">
            {landing.plateCaption}
          </span>
        </figcaption>
      </figure>
    </>
  );
}

/** The argument. A step below the hero: the reader should not get a second opening. */
function Window() {
  return (
    <section className={SHEET}>
      <div className={`${GRID} ${RULE_MAJOR} pt-12 md:pt-14 pb-6`}>
        <p className={`${WIDE} broadside-serif ${H2} text-balance`}>
          {landing.window.statement}
        </p>
      </div>
      <Block claim={<p className={LABEL}>{landing.window.label}</p>}>
        <div className={`space-y-5 ${BODY}`}>
          {landing.window.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </Block>
    </section>
  );
}

/**
 * The scarcity, in the same shape as every other claim on the sheet. It had an
 * amber bar down its left edge, which was the one blockquote on a hand-set
 * page; the constraint is real, so it is stated in the page's ordinary voice.
 */
/**
 * The offer and the scarcity, in one block.
 *
 * The promise is what earns the call — a prototype seen working beats a
 * proposal read — and the availability is what makes it now. Both are facts;
 * the months come from CAPACITY in the copy file, which is the only place they
 * are written down.
 */
function Offer() {
  return (
    <section className={SHEET}>
      <Block claim={<p className={LABEL}>{landing.offer.label}</p>}>
        <p className="broadside-serif font-bold text-2xl md:text-[1.9rem] tracking-tight">
          {landing.offer.statement}
        </p>
        <p className={`mt-4 ${BODY}`}>{landing.offer.body}</p>
        {/* The one place amber is used on something that is not an action or a
            figure: this is the sentence the page is asking to be believed. */}
        <p className="mt-5 border-l-2 border-primary pl-4 text-[17px] font-medium ink leading-relaxed">
          {landing.offer.scarcity}
        </p>
      </Block>
    </section>
  );
}

/** The conversion moment: the sheet signed on the left, the call on the right. */
function Close() {
  return (
    <section className={SHEET}>
      <div className={`${GRID} ${RULE_MAJOR} pt-12 md:pt-14 pb-6`}>
        <h2
          className={`${WIDE} font-bold text-[2.1rem] md:text-[2.9rem] tracking-tight leading-[1.08] text-balance`}
        >
          {landing.close.title}
        </h2>
      </div>

      <Block
        pad="pt-6 pb-14 md:pb-16"
        claim={
          <div>
            <p className="broadside-serif text-[1.6rem] md:text-[2rem] leading-tight italic text-foreground">
              {landing.close.signature}
            </p>
            <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
              {landing.close.signatureNote}
            </p>
          </div>
        }
      >
        <p className={BODY}>{landing.close.body}</p>
        <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
          <BookButton label={landing.close.cta} />
          <QuietLink href="/contact">{landing.close.alt}</QuietLink>
        </div>
      </Block>
    </section>
  );
}

/**
 * The foot of the sheet, and the whole site's navigation.
 *
 * The bar at the top holds one call and no links, so everything else on the
 * site is reachable from here. It is set as a printed colophon rather than the
 * usual four columns of link lists: the wordmark and where we are on the left,
 * the site in two columns on the right, the small print under a rule.
 */
function Foot() {
  return (
    <footer className={RULE_MAJOR}>
      <div className={`${SHEET} pt-12 pb-10`}>
        <div className={GRID}>
          <div className={COL_L}>
            <Link
              href="/"
              className="-ml-1 inline-flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <PointerMark className="h-6 w-auto text-primary shrink-0" />
              <span className="broadside-serif font-semibold text-lg tracking-tight">
                Tutto<span className="text-primary">.</span>
              </span>
            </Link>
            <p className="mt-3 text-[11px] font-mono uppercase tracking-[0.12em] text-muted-foreground">
              {landing.footer.place}
            </p>
            <p className="mt-5">
              <Link
                href={landing.footer.longVersion.href}
                className="text-sm ink border-b border-foreground/25 hover:border-foreground transition-colors pb-0.5"
              >
                {landing.footer.longVersion.label} →
              </Link>
            </p>
          </div>

          <nav
            aria-label="Site"
            className={`${COL_R} mt-8 md:mt-0 grid grid-cols-2 gap-x-6 gap-y-2.5`}
          >
            {landing.footer.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div
          className={`mt-10 pt-5 ${RULE} flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between text-xs text-muted-foreground`}
        >
          <p>© {new Date().getFullYear()} Tutto. All rights reserved.</p>
          <p>{landing.footer.note}</p>
        </div>
      </div>
    </footer>
  );
}
