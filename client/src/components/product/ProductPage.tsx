/**
 * Shared vocabulary for product pages (Praxis, Pythia, and anything that follows).
 *
 * Both product pages previously carried their own palette, fonts and layout
 * primitives inline, which is why they read as separate microsites rather than
 * pages of one site. Everything here is expressed in the site's design tokens,
 * so a change to the theme moves the product pages with it.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { PLATE_TILES } from "@/lib/plate-tiles";
import { copy, useT } from "@/lib/i18n";

/** Small amber eyebrow used above headings. */
export function Eyebrow({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "text-[11px] font-semibold uppercase tracking-[0.16em] text-primary",
        className,
      )}
    >
      {children}
    </p>
  );
}

/** Page opener: eyebrow, headline, standfirst, and calls to action. */
export function ProductHero({
  eyebrow,
  title,
  standfirst,
  meta,
  primaryCta,
  secondaryCta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  standfirst: React.ReactNode;
  meta?: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
}) {
  return (
    <header className="pt-8 pb-16">
      <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
      <h1 className="text-4xl md:text-5xl font-serif font-bold leading-[1.12] tracking-tight max-w-3xl">
        {title}
      </h1>
      <div className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl space-y-4">
        {standfirst}
      </div>
      {(primaryCta || secondaryCta) && (
        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          {primaryCta && (
            <a
              href={primaryCta.href}
              target={primaryCta.href.startsWith("http") ? "_blank" : undefined}
              rel={primaryCta.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              {primaryCta.label}
            </a>
          )}
          {secondaryCta && (
            <Link
              href={secondaryCta.href}
              className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
            >
              {secondaryCta.label} <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
      {meta && <p className="mt-5 text-sm text-muted-foreground">{meta}</p>}
    </header>
  );
}

/** Numbered section with a ruled header, matching the document feel of the originals. */
export function Section({
  index,
  label,
  title,
  intro,
  children,
}: {
  index?: string;
  label: string;
  title?: React.ReactNode;
  intro?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6 mt-16 first:mt-0">
      <div className="flex items-baseline gap-4 mb-8">
        {index && (
          <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums">{index}</span>
        )}
        <Eyebrow>{label}</Eyebrow>
      </div>
      {title && (
        <h2 className="text-2xl md:text-3xl font-serif font-bold tracking-tight mb-4 max-w-2xl">
          {title}
        </h2>
      )}
      {intro && (
        <div className="text-muted-foreground leading-relaxed max-w-2xl space-y-4 mb-10">{intro}</div>
      )}
      {children}
    </section>
  );
}

/**
 * A full-width illustrated plate.
 *
 * The lettering inside these drawings is part of the drawing, so there is one
 * file per language rather than one file with text laid over it; the page picks
 * the file and the alt text carries the same content for a reader who cannot
 * see it. The intrinsic size is declared so the caption does not jump when the
 * image lands, and the drawings' paper ground is a shade darker than the page,
 * so a border seats them without needing a panel behind.
 */
export function Plate({
  src,
  alt,
  caption,
  width,
  height,
  className,
}: {
  src: string;
  alt: string;
  caption?: React.ReactNode;
  width: number;
  height: number;
  /** Constrain the figure — the square spots would swamp a column at full width. */
  className?: string;
}) {
  return (
    <figure className={cn("my-2", className)}>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="w-full h-auto rounded-2xl border border-border"
      />
      {caption && (
        <figcaption className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * A wide plate that survives a phone.
 *
 * The drawn plates are laid out on a grid and lettered by hand, so shrinking one
 * to a 342px column puts its labels at four or five pixels. Above `md` the whole
 * drawing is shown as before; below it the same drawing appears cut along its own
 * gutters and stacked in reading order, which is what `05-slice.py` produces.
 *
 * A cell that is still wide for a phone — the widest here is 939px — gets a
 * horizontal scroll with a floor on the scale, rather than being shrunk past
 * legibility or cut through the middle of a drawing. Cells narrower than the
 * column never scroll, because their floor is below the space available.
 *
 * Only one of the two branches is ever displayed, so the alt text sits on
 * whichever image is showing and a screen reader hears the description once.
 */
export function ResponsivePlate({
  src,
  tileKey,
  alt,
  caption,
  width,
  height,
  floorScale = 0.6,
}: {
  src: string;
  /** Key into the generated tile manifest, e.g. "context-fr". */
  tileKey: string;
  alt: string;
  caption?: React.ReactNode;
  width: number;
  height: number;
  /** Smallest scale a cell is allowed to render at before it scrolls instead. */
  floorScale?: number;
}) {
  const tiles = PLATE_TILES[tileKey] ?? [];
  if (tiles.length === 0) {
    return <Plate src={src} alt={alt} caption={caption} width={width} height={height} />;
  }
  return (
    <figure className="my-2">
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
        className="hidden md:block w-full h-auto rounded-2xl border border-border"
      />

      <div className="md:hidden flex flex-col gap-3">
        {tiles.map((tile, i) => (
          // min-w-0: a flex item defaults to min-width:auto, which sizes it to
          // its content and lets the wide cells push the page sideways instead
          // of scrolling inside their own box.
          <div key={tile.src} className="min-w-0 overflow-x-auto rounded-2xl border border-border">
            <img
              src={tile.src}
              alt={i === 0 ? alt : ""}
              width={tile.w}
              height={tile.h}
              loading="lazy"
              decoding="async"
              style={{ minWidth: Math.round(tile.w * floorScale) }}
              className="block w-full h-auto"
            />
          </div>
        ))}
      </div>

      {caption && (
        <figcaption className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Three plates side by side under one caption — a row of portraits, say. */
export function PlateRow({
  items,
  caption,
}: {
  items: { src: string; alt: string }[];
  caption?: React.ReactNode;
}) {
  return (
    <figure className="my-2">
      <div className="grid grid-cols-3 gap-4 sm:gap-5">
        {items.map((item) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            loading="lazy"
            decoding="async"
            className="w-full h-auto rounded-2xl border border-border"
          />
        ))}
      </div>
      {caption && (
        <figcaption className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/** Responsive card grid. */
export function CardGrid({ cols = 3, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-5",
        cols === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {children}
    </div>
  );
}

/**
 * A single feature card: numeral, title, qualifier, body.
 *
 * With `href` the whole card becomes the link rather than just its heading —
 * a card that names a thing you can go and read is a bigger target than the
 * three words at the top of it, and on a phone that is the difference between
 * a tap that works and one that misses.
 */
export function FeatureCard({
  numeral,
  title,
  qualifier,
  href,
  children,
}: {
  numeral?: string;
  title: string;
  qualifier?: string;
  href?: string;
  children: React.ReactNode;
}) {
  const card = (
    <div
      className={cn(
        "relative bg-card border border-border rounded-2xl p-6 h-full",
        href && "transition-colors group-hover:border-primary/40",
      )}
    >
      {numeral && (
        <span className="absolute top-5 right-6 text-xs font-mono text-muted-foreground/40">
          {numeral}
        </span>
      )}
      <h3 className="text-lg font-serif font-bold mb-1.5 pr-8">
        {title}
        {href && (
          <ArrowRight
            aria-hidden
            className="inline-block w-4 h-4 ml-1.5 -translate-y-px text-primary opacity-0 transition-opacity group-hover:opacity-100"
          />
        )}
      </h3>
      {qualifier && (
        <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/70 mb-4">
          {qualifier}
        </p>
      )}
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );

  return href ? (
    <Link href={href} className="group block h-full">
      {card}
    </Link>
  ) : (
    card
  );
}

/**
 * Headline statistic.
 *
 * `accent` sets the figure in the accent and a size up. It is for the handful
 * of numbers a page is actually built on — the ones a reader should carry away
 * — and it stops working the moment every stat on the page asks for it.
 */
export function StatCard({
  stat,
  label,
  accent,
  children,
}: {
  stat: string;
  label: string;
  accent?: boolean;
  /** What the figure is, when the number and its unit do not say it alone. */
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 h-full">
      <p
        className={cn(
          "font-serif font-bold tracking-tight mb-1.5 tabular-nums",
          accent ? "text-3xl md:text-4xl text-primary" : "text-2xl",
        )}
      >
        {stat}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {children && (
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
          {children}
        </p>
      )}
    </div>
  );
}

/**
 * A continuously looping strip of client logos.
 *
 * WHY IT IS GREYSCALE AND NOT A SILHOUETTE.
 *
 * The eleven marks arrive as eleven different objects: white artwork meant for
 * a dark tile, black artwork meant for a light one, a gold hexagon, and a
 * spread of brand colours. Dropped on as supplied they fight, so the obvious
 * move is `brightness(0)` — collapse every opaque pixel to black and let the
 * alpha channel draw the shape.
 *
 * That was tried and it is wrong. Several of these are knockouts: Probe
 * Batteries is white lettering reversed out of a solid red banner, Opus is a
 * gold gear on a dark tile. Their alpha is opaque across the whole block, so
 * a silhouette renders them as a featureless slab — the logo becomes a brick.
 *
 * `grayscale` keeps the luminance differences that carry the letterforms, so
 * a knockout stays readable while the strip still reads as one texture. The
 * three marks supplied only as white artwork were recoloured in the files
 * themselves rather than filtered here; see client/public/logos.
 *
 * Colour and full opacity return on hover, which is affordable because the
 * strip also pauses then.
 *
 * WHY IT LOOPS THE WAY IT DOES.
 *
 * The track holds the sequence twice and slides exactly -50%, so the moment
 * the first copy leaves the frame the second is sitting precisely where it
 * started and the jump back to zero is invisible. Any other offset shows a
 * seam. The duplicate is `aria-hidden`, so a screen reader is read the client
 * list once rather than twice, and the animation is CSS rather than JS so it
 * costs nothing on the main thread.
 *
 * Motion is a decoration here, not information: `prefers-reduced-motion` stops
 * it dead and hands the strip back as something that can be scrolled by hand,
 * rather than freezing it and hiding the logos that happen to be off-frame.
 * Hovering pauses it, because a name you recognise sliding past is a name you
 * want to stop and read.
 */
export function LogoMarquee({
  items,
  seconds = 46,
}: {
  items: readonly {
    readonly name: string;
    readonly logo?: string;
    /**
     * Optical size, as a multiplier on the strip's base height.
     *
     * A single pixel height is the wrong instrument here: Bearstone is a
     * wordmark nine times wider than it is tall and Bulldog is a stacked
     * hexagon barely wider than tall, so setting both to 32px makes one
     * enormous and the other unreadable. Equal height is not equal presence,
     * and the correction has to be per mark and judged by eye.
     */
    readonly scale?: number;
  }[];
  /** One full pass of the list. Longer is slower; this is a texture, not a ride. */
  seconds?: number;
}) {
  const sequence = (hidden?: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-12 pr-12 sm:gap-16 sm:pr-16"
    >
      {items.map((item) => (
        <li key={item.name} className="flex shrink-0 items-center">
          {item.logo ? (
            <img
              src={item.logo}
              alt={hidden ? "" : item.name}
              loading="lazy"
              decoding="async"
              style={{ height: `calc(var(--logo-h) * ${item.scale ?? 1})` }}
              className="w-auto max-w-none object-contain opacity-75 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
            />
          ) : (
            /* The fallback for a client whose artwork has not arrived. Set in
               the site's own type so a gap reads as a decision rather than a
               broken image. */
            <span className="whitespace-nowrap text-[13px] font-medium uppercase tracking-[0.12em] text-muted-foreground/70">
              {item.name}
            </span>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div
      className="logo-marquee relative overflow-hidden py-2 [--logo-h:26px] sm:[--logo-h:32px]"
    >
      <div
        className="logo-marquee-track flex w-max"
        style={{ "--logo-marquee-seconds": `${seconds}s` } as React.CSSProperties}
      >
        {sequence()}
        {sequence(true)}
      </div>

      {/* The strip runs off both edges rather than stopping at one. Without the
          fades a logo is guillotined mid-letter at the container boundary,
          which reads as a layout bug rather than as movement. */}
      <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent sm:w-20" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent sm:w-20" />
    </div>
  );
}

/** Priced line item. */
/**
 * The hardware tiers that sit under a pricing grid.
 *
 * A labelled list rather than three more cards. These are machines the client
 * buys from Apple or NVIDIA, not things we sell, and giving them the same
 * weight as the engagement cards above read as though we were quoting for
 * them. The note carries the date because these prices move — hardware rose
 * sharply through 2026 — and a dated indicative figure is usable where an
 * undated one is a hostage.
 */
export function HardwareTiers({
  title,
  tiers,
  note,
}: {
  title: string;
  tiers: { label: string; body: string }[];
  note: string;
}) {
  return (
    <div className="mt-6 bg-secondary/30 border border-border rounded-2xl p-6">
      <h3 className="text-sm font-serif font-bold text-foreground mb-4">{title}</h3>
      <ul className="space-y-2.5">
        {tiers.map((tier) => (
          <li
            key={tier.label}
            className="text-sm text-muted-foreground leading-relaxed flex flex-col sm:flex-row sm:gap-4"
          >
            <span className="text-foreground font-medium shrink-0 sm:w-36">{tier.label}</span>
            <span>{tier.body}</span>
          </li>
        ))}
      </ul>
      <p className="text-xs text-muted-foreground/70 mt-5 leading-relaxed">{note}</p>
    </div>
  );
}

export function PriceRow({
  title,
  price,
  was,
  children,
}: {
  title: string;
  price: string;
  was?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 flex flex-col">
      <div className="flex items-baseline justify-between gap-4 mb-3">
        <h3 className="text-lg font-serif font-bold">{title}</h3>
        <p className="text-base font-semibold whitespace-nowrap">
          {was && <span className="text-muted-foreground/60 line-through mr-2 font-normal">{was}</span>}
          <span className="text-primary">{price}</span>
        </p>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{children}</p>
    </div>
  );
}

/**
 * Transcript-style example session. Renders a question and the system's answer
 * so the answer reads as machine output rather than prose.
 */
export function ExampleSession({
  caption,
  items,
}: {
  caption: string;
  items: { tag: string; q: string; a: string }[];
}) {
  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-secondary/40">
        <span className="w-2.5 h-2.5 rounded-full bg-destructive/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-primary/50" />
        <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 text-[11px] font-mono text-muted-foreground">{caption}</span>
      </div>
      <div className="p-5 space-y-6">
        {items.map((item) => (
          <div key={item.tag}>
            <div className="flex gap-3">
              <span className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-foreground text-background text-[10px] font-mono font-semibold inline-flex items-center justify-center">
                {item.tag}
              </span>
              <p className="text-sm text-foreground leading-relaxed">{item.q}</p>
            </div>
            <p className="ml-8 mt-2.5 text-[13px] font-mono leading-relaxed text-muted-foreground bg-secondary/50 rounded-lg px-3.5 py-3">
              {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Closing note on a product's name — kept quiet, at the foot of the page. */
export function Etymology({ pull, children }: { pull: string; children: React.ReactNode }) {
  const t = useT();
  return (
    <section className="mt-16 pt-10 border-t border-border">
      <Eyebrow className="mb-5 text-muted-foreground/70">{t(copy.common.onTheName)}</Eyebrow>
      <p className="font-serif text-lg italic text-foreground leading-relaxed max-w-2xl mb-5">
        {pull}
      </p>
      {/* A div rather than a p: the home page's note runs to two paragraphs.
          Callers supply their own <p> tags. */}
      <div className="text-sm text-muted-foreground leading-relaxed max-w-2xl space-y-4">
        {children}
      </div>
    </section>
  );
}

/**
 * Quiet panel.
 *
 * The ground `ClosingCta` sits on, available on its own for the one block on a
 * page that has to be read before anything else — a funding line, or a
 * condition that would otherwise be discovered at signature. It is a lighter
 * ground than a card, so it reads as a note the page is making rather than as
 * another item in a grid; the classes are `ClosingCta`'s so the two cannot
 * drift apart.
 */
export function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("bg-secondary/30 rounded-2xl border border-border p-6", className)}>
      {children}
    </div>
  );
}

/**
 * The offer, stated at headline scale.
 *
 * `PriceRow` is a line item: it sets the figure beside the title, which is
 * right when a page lists several and wrong when a page lists one. A price set
 * at body scale next to a heading reads as a right-aligned label, and the eye
 * slides off it — so on the one block a decision-first page has to sell, the
 * figure gets a line of its own.
 *
 * Nothing here is amber but the eyebrow. The block is already the loudest thing
 * below the hero by size alone, and the accent is spent on the button.
 *
 * It is laid out as a flex column with the note pushed to the foot so two of
 * these can sit side by side in a grid: grid children stretch to the tallest
 * in the row, and without `mt-auto` the shorter card ends up with its small
 * print stranded halfway up a panel of empty space. On a page that shows one
 * of these full width, height is auto, there is no free space to distribute,
 * and both rules are inert.
 */
export function HeadlinePrice({
  label,
  title,
  price,
  note,
  children,
}: {
  /** Omitted when the block already sits under a `Section` head. */
  label?: string;
  title: string;
  price: string;
  /** Set below a hairline, so it reads as a note and not a third paragraph. */
  note?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Panel className="flex h-full flex-col p-6 sm:p-8">
      {label && <Eyebrow className="mb-5">{label}</Eyebrow>}
      <h2 className="text-lg font-serif font-bold">{title}</h2>
      <p className="mt-3 mb-7 text-4xl md:text-5xl font-serif font-bold tracking-tight tabular-nums">
        {price}
      </p>
      <div className="mb-6 text-lg text-foreground leading-relaxed max-w-2xl">{children}</div>
      {note && (
        <div className="mt-auto pt-5 border-t border-border text-sm text-muted-foreground leading-relaxed max-w-2xl">
          {note}
        </div>
      )}
    </Panel>
  );
}

/**
 * A numbered document list.
 *
 * Six items in six bordered cards is a feature grid, and a curriculum is not a
 * feature grid: the boxes add five boundaries that carry no meaning, and a
 * 320px box pushes a title, a taxonomy label and a numeral into the same corner
 * until none of them can be read. This sets the same content as a list — a
 * hairline, the number, the title, one paragraph — which is what a course
 * outline looks like on paper.
 */
export function NumberedList({
  items,
}: {
  items: { n?: string; title: string; body: React.ReactNode }[];
}) {
  const numbered = items.some((item) => item.n);
  return (
    <ol className="border-t border-border">
      {items.map((item) => (
        <li
          key={item.title}
          /* The last rule is dropped: the next Section draws its own hairline
             directly below, and the two together read as a mistake. */
          className={cn(
            "border-b border-border last:border-b-0 py-6 grid gap-x-6 gap-y-1.5",
            numbered && "sm:grid-cols-[6rem_1fr]",
          )}
        >
          {numbered && (
            <span className="text-sm font-mono text-muted-foreground tabular-nums sm:pt-1 sm:text-right">
              {item.n}
            </span>
          )}
          <div>
            <h3 className="text-lg font-serif font-bold mb-1.5">{item.title}</h3>
            {/* ~68ch. The full column at 14px runs to 90 characters, which is
                what made six items read as one grey slab. */}
            <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{item.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/**
 * Figures set as rows rather than cards.
 *
 * Three statistics in three bordered boxes is the canonical generated feature
 * triplet, and it rags the moment the three bodies are different lengths — two
 * cards carry dead space so the third can fit. As rows they take the grammar of
 * The figure sits on the page's body axis with the claim beneath it. It does
 * NOT share `NumberedList`'s gutter: those numerals are a sequence and line up
 * as one, while these are a date, a deadline and a count — hung off a common
 * right edge they read as three misaligned numbers rather than a column. The
 * claim is a whole sentence, so it needs no caption under the figure.
 */
export function FigureRows({
  items,
}: {
  items: { figure: string; body: React.ReactNode }[];
}) {
  return (
    <ol className="border-t border-border">
      {items.map((item) => (
        <li
          key={item.figure}
          className="border-b border-border last:border-b-0 py-6"
        >
          {/* A step below the offer price: three figures at the same size as
              one price outweigh it, and the price is what the page is for. */}
          <p className="text-2xl font-serif font-bold tracking-tight tabular-nums mb-2">
            {item.figure}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">{item.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** Closing call to action. */
export function ClosingCta({
  title,
  body,
  href,
  label,
  messageLabel = "Send a message",
  footnote,
  rule,
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  /**
   * `null` drops the secondary link entirely. The decision-first pages are
   * built on one offer and one action, and a second button on them is not a
   * convenience but a way out.
   */
  messageLabel?: string | null;
  /**
   * A byline under the buttons, below a hairline. A line of attribution set
   * loose on the page between two panels reads as a paragraph someone forgot to
   * place; inside the panel it reads as a signature.
   */
  footnote?: React.ReactNode;
  /**
   * Draw the section hairline above the panel. On a page that announces every
   * other block with a rule, the closing panel arriving without one reads as
   * the rules having been abandoned two-thirds of the way down.
   */
  rule?: boolean;
}) {
  return (
    <div className={cn("mt-16", rule && "border-t border-border pt-10")}>
      <div className="p-6 sm:p-8 bg-secondary/30 rounded-2xl border border-border">
      <h3 className="text-xl font-serif font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-xl">{body}</p>
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          {label}
        </a>
        {messageLabel !== null && (
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
          >
            {messageLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {footnote && (
        <div className="mt-8 pt-5 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{footnote}</p>
        </div>
      )}
      </div>
    </div>
  );
}
