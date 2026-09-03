import { useEffect, useState } from "react";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import {
  CardGrid,
  ClosingCta,
  Eyebrow,
  FeatureCard,
  Section,
  StatCard,
} from "@/components/product/ProductPage";
import { SITE_TITLE, copy, useT } from "@/lib/i18n";
import { landing } from "@/lib/landing-copy";
import { MarkupLayer } from "@/components/markup/MarkupLayer";

const BOOKING = "https://cal.com/tuttoone/30min";

/**
 * The site's front door, at `/` (and still at `/next`, for links already sent).
 *
 * This was set as a broadside — hand-ruled, squared buttons, Source Serif 4
 * over the site's grotesk, its own bar and its own colophon. It read well on
 * its own and read as a different company next to every other page, which is
 * the one thing a front door cannot do. It is now built from the same
 * vocabulary as /praxis, /pythia and /sovereign: `Layout` for the chrome,
 * `Section` for the ruled section heads, `CardGrid` and `FeatureCard` for the
 * offers, `StatCard` for the figures, `ClosingCta` for the call.
 *
 * What survived the move is the argument, not the setting: the struck-through
 * beliefs before the headline, four named offers rather than an abstract claim,
 * three figures from delivered work, one plate, and one booking. All of it is
 * in `client/src/lib/landing-copy.ts`.
 *
 * Nothing here defines its own type, colour or spacing. If this page needs to
 * look different, the token or the component is the place to change it, so the
 * rest of the site moves with it.
 */
export default function Landing() {
  useEffect(() => {
    document.title = "Tutto — AI that does the job, not AI that describes it";
    return () => {
      document.title = SITE_TITLE;
    };
  }, []);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <Hero />
        <Offers />
        <Proof />
        <Window />
        <Offer />
        <Close />
      </div>

      {/* Review overlay: notes, arrows and text boxes drawn straight onto the
          page, saved where an agent can read them. Development only — the
          import is tree-shaken out of a production build by this guard. */}
      {import.meta.env.DEV && <MarkupLayer page="landing" />}
    </Layout>
  );
}

/** The site's primary call, in the shape every other page sets it. */
function BookButton({ label }: { label: string }) {
  return (
    <a
      href={BOOKING}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
    >
      {label}
    </a>
  );
}

/**
 * The opener.
 *
 * `ProductHero` is the house component for this and would have been the
 * straight reuse, but it takes the eyebrow, the headline and the standfirst in
 * that fixed order and this page has to get three struck-through sentences in
 * before the headline — the whole rhetorical move is that the reader sees what
 * they already believe, crossed out, and then reads the line that contradicts
 * it. So the classes are `ProductHero`'s, copied deliberately rather than
 * invented, and the block sits in the same rhythm as every other page opener.
 */
function Hero() {
  return (
    <header className="pt-8 pb-16">
      <Eyebrow className="mb-5">{landing.hero.eyebrow}</Eyebrow>

      {/* Struck in the accent rather than in the ink: it should read as a
          correction, not as deleted text. */}
      <ul className="mb-6 space-y-1.5 max-w-2xl">
        {landing.hero.struck.map((line) => (
          <li
            key={line}
            className="text-lg text-muted-foreground line-through decoration-primary decoration-[1.5px]"
          >
            {line}
          </li>
        ))}
      </ul>

      <h1 className="text-4xl md:text-6xl font-serif font-bold leading-[1.12] tracking-tight max-w-3xl">
        {landing.hero.title}
      </h1>

      <div className="mt-6 max-w-2xl space-y-4">
        <p className="text-xl text-foreground leading-relaxed">
          {landing.hero.promise}
        </p>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {landing.hero.deck}
        </p>
      </div>

      <div className="mt-9 flex flex-col sm:flex-row gap-4">
        <BookButton label={landing.hero.cta} />
        <Link
          href={landing.footer.longVersion.href}
          className="inline-flex items-center justify-center gap-2 px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
        >
          {landing.hero.secondaryCta} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </header>
  );
}

/**
 * The four things we do, named and linked.
 *
 * Two columns rather than three: the bodies are sentences, not feature bullets,
 * and at a third of the measure the Sovereign card runs to eleven lines against
 * the Diagnosis card's four.
 */
function Offers() {
  return (
    <Section label={landing.offersEyebrow} title={landing.offersLabel}>
      <CardGrid cols={2}>
        {landing.offers.map((row) => (
          <FeatureCard
            key={row.name}
            title={row.name}
            qualifier={row.qualifier}
            href={row.href}
          >
            {row.body}
          </FeatureCard>
        ))}
      </CardGrid>
    </Section>
  );
}

/**
 * The figures, and the plate.
 *
 * Every number here is from delivered work, so all three take the accent — this
 * is the one section on the page where `StatCard`'s emphasis is the point
 * rather than a decoration.
 */
function Proof() {
  const t = useT();

  return (
    <Section label={landing.proofEyebrow} title={landing.proofLabel}>
      {/* Figure, unit and what it was, in one card each. These were a row of
          bare figures with the three explanations repeated underneath, which
          set every number on the page twice. */}
      <CardGrid cols={3}>
        {landing.proof.map((p) => (
          <StatCard key={p.figure} stat={p.figure} label={p.unit} accent>
            {p.body}
          </StatCard>
        ))}
      </CardGrid>

      <Media alt={t(copy.plates.lawyer)} caption={landing.plateCaption} />
    </Section>
  );
}

/**
 * The sheet's one image, which may equally be its one video.
 *
 * This is `Plate` with a video branch. Whether `landing.media.src` is a still
 * or a video is read off the extension, so swapping one for the other is a
 * single line in the copy file. Video is muted, looping, inline and
 * autoplaying — it is illustration, not something anybody asked to watch — and
 * `prefers-reduced-motion` gets the poster still instead, which is why a poster
 * is kept even once video lands. The frame is `Plate`'s exactly, so the two
 * cannot drift apart.
 */
const FRAME = "w-full h-auto rounded-2xl border border-border";

function Media({ alt, caption }: { alt: string; caption: React.ReactNode }) {
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

  return (
    <figure className="mt-10">
      {!isVideo || still ? (
        <img
          src={isVideo ? poster : src}
          width={1800}
          height={1347}
          loading="lazy"
          decoding="async"
          alt={alt}
          className={FRAME}
        />
      ) : (
        <video
          src={src}
          poster={poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label={alt}
          className={FRAME}
        />
      )}
      <figcaption className="mt-3 max-w-2xl text-sm text-muted-foreground leading-relaxed">
        {caption}
      </figcaption>
    </figure>
  );
}

/** Why now. */
function Window() {
  return (
    <Section
      label={landing.window.label}
      title={landing.window.statement}
      intro={landing.window.body.map((p) => (
        <p key={p.slice(0, 24)}>{p}</p>
      ))}
    />
  );
}

/**
 * The offer and the availability.
 *
 * The prototype is what earns the call — a thing seen working beats a proposal
 * read — and the lead time is what makes it now. The availability sits in the
 * house panel rather than behind the amber bar it used to have: an accent rule
 * down the left of a paragraph is a device this site does not otherwise use.
 */
function Offer() {
  return (
    <Section
      label={landing.offer.label}
      title={landing.offer.statement}
      intro={<p>{landing.offer.body}</p>}
    >
      <div className="p-6 bg-secondary/30 rounded-2xl border border-border max-w-2xl">
        <p className="text-muted-foreground leading-relaxed">
          {landing.offer.scarcity}
        </p>
      </div>
    </Section>
  );
}

/** The conversion moment, signed. */
function Close() {
  return (
    <>
      <ClosingCta
        title={landing.close.title}
        body={landing.close.body}
        href={BOOKING}
        label={landing.close.cta}
        messageLabel={landing.close.alt}
      />
      <div className="mt-8">
        <p className="font-serif font-bold text-lg">
          {landing.close.signature}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {landing.close.signatureNote} — {landing.footer.place}
        </p>
      </div>
    </>
  );
}
