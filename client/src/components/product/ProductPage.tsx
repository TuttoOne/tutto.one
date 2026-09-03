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

/** Priced line item. */
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

/** Closing call to action. */
export function ClosingCta({
  title,
  body,
  href,
  label,
  messageLabel = "Send a message",
}: {
  title: string;
  body: string;
  href: string;
  label: string;
  messageLabel?: string;
}) {
  return (
    <div className="mt-16 p-8 bg-secondary/30 rounded-2xl border border-border">
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
        <Link
          href="/contact"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          {messageLabel} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
