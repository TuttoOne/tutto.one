import { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { CurrencyToggle } from "@/components/layout/PreferenceToggles";
import { cn } from "@/lib/utils";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

const MAILTO = "mailto:daniel@tutto.one?subject=Applied%20AI%20Evenings";

type Leaf = { en: string; fr: string };

type Evening = {
  /** Zero-padded so the numerals line up in the left column. */
  day: string;
  month: Leaf;
  weekday: Leaf;
  title: Leaf;
  body: Leaf;
  tag?: Leaf;
};

const c = copy.calendar;

/**
 * The paid course, Tuesdays 20:00–21:00 Paris, in English. The free overview
 * is not in here: it repeats every week, so it is shown once as a standing
 * slot above rather than as an identical row per Tuesday.
 */
const ONLINE: Evening[] = [
  { day: "15", month: c.sep, weekday: c.tue, title: c.o2Title, body: c.o2Body },
  { day: "22", month: c.sep, weekday: c.tue, title: c.o3Title, body: c.o3Body },
  { day: "29", month: c.sep, weekday: c.tue, title: c.o4Title, body: c.o4Body },
  { day: "06", month: c.oct, weekday: c.tue, title: c.o5Title, body: c.o5Body },
  { day: "13", month: c.oct, weekday: c.tue, title: c.o6Title, body: c.o6Body },
];

/**
 * Every second Thursday, 20:30–22:00, in French, in a village hall. The same
 * talk each time in a different commune, so the ordinals run in date order.
 * Each one sits two days after a Tuesday session — the course class that week,
 * or the free overview when the course is not running.
 */
const LOT: Evening[] = [
  { day: "10", month: c.sep, weekday: c.thu, title: c.l1Title, body: c.l1Body, tag: c.tagVenue },
  { day: "24", month: c.sep, weekday: c.thu, title: c.l2Title, body: c.l2Body, tag: c.tagVenue },
  { day: "08", month: c.oct, weekday: c.thu, title: c.l3Title, body: c.l3Body, tag: c.tagVenue },
  { day: "22", month: c.oct, weekday: c.thu, title: c.l4Title, body: c.l4Body, tag: c.tagVenue },
  { day: "05", month: c.nov, weekday: c.thu, title: c.l5Title, body: c.l5Body, tag: c.tagVenue },
  { day: "19", month: c.nov, weekday: c.thu, title: c.l6Title, body: c.l6Body, tag: c.tagVenue },
];

const NOTES: { title: Leaf; body: Leaf }[] = [
  { title: c.note1Title, body: c.note1Body },
  { title: c.note2Title, body: c.note2Body },
  { title: c.note3Title, body: c.note3Body },
];

function Listing({ evenings, className = "mt-8" }: { evenings: Evening[]; className?: string }) {
  const t = useT();
  return (
    <div className={className}>
      {evenings.map((e) => (
        <article
          key={`${e.month.en}-${e.day}`}
          className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-3 sm:gap-x-8 sm:gap-y-1 items-start
                     py-6 border-t border-border last:border-b"
        >
          {/* Tabular figures keep the day numerals on the same optical stem. */}
          <div className="flex items-baseline gap-2.5 sm:gap-2 tabular-nums">
            <span className="font-serif font-black text-primary text-4xl sm:text-[2.75rem] leading-[0.85] tracking-tighter">
              {e.day}
            </span>
            <span className="flex flex-row sm:flex-col gap-1.5 sm:gap-0 text-[11px] font-semibold uppercase tracking-[0.12em] leading-snug text-muted-foreground">
              <span>{t(e.month)}</span>
              <span>{t(e.weekday)}</span>
            </span>
          </div>

          <div className="flex flex-col gap-1.5">
            <h3 className="font-serif font-bold text-lg leading-snug text-balance">{t(e.title)}</h3>
            <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {t(e.body)}
            </p>
            {e.tag && (
              <span className="self-start mt-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                {t(e.tag)}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function Calendar() {
  const t = useT();
  const { locale, currency } = usePreferences();
  const p = (k: Parameters<typeof price>[0]) => price(k, currency, locale);

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "Les soirées IA appliquée — Praxis | Tutto"
        : "Applied AI Evenings — Praxis | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  const perClass = p("eveningClass");
  const allSix = p("eveningSeries");

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16">
        <header className="flex flex-col gap-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            {t(c.eyebrow)}
          </p>
          <h1 className="font-serif font-black text-5xl md:text-6xl lg:text-7xl leading-[0.95] tracking-tight text-balance">
            {t(c.title)}
          </h1>
          <p className="max-w-2xl text-lg leading-snug">
            {t(c.leadA)} <strong className="font-semibold">{t(c.leadStrong)}</strong> {t(c.leadB)}
          </p>

          <div className="flex flex-wrap gap-x-7 gap-y-2 pt-3 mt-1 border-t border-border text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">{t(c.factFirstFree)}</span>
            {/* The header's currency switch is hidden below lg, and this is a
                page people read to decide what it costs — so the switch is
                repeated next to the figures. Both drive the same stored
                preference, so they never disagree. */}
            <span className="inline-flex items-center gap-2">
              <b className="font-semibold text-foreground">{perClass}</b> {t(c.factPerClass)}{" "}
              <b className="font-semibold text-foreground">{allSix}</b> {t(c.factAllSix)}
              <CurrencyToggle className="ml-0.5" />
            </span>
            <span className="font-semibold text-foreground">{t(c.factHour)}</span>
            <span>{t(c.factZones)}</span>
            <span>{t(c.factLotFree)}</span>
          </div>
        </header>

        <section className="mt-14 md:mt-20">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.onlineTitle)}</h2>
          <p className="mt-1.5 max-w-prose text-[15px] text-muted-foreground">
            {t(c.onlineIntroA)} <span className="font-semibold text-foreground">{perClass}</span>{" "}
            {t(c.onlineIntroB)} <span className="font-semibold text-foreground">{allSix}</span>{" "}
            {t(c.onlineIntroC)}
          </p>
          {/* The recurring free session. A card rather than a dated row,
              because it has no single date to put in the left column. */}
          <div className="mt-8 rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-7 flex flex-col gap-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-primary">
              {t(c.standingWhen)}
            </p>
            <h3 className="font-serif font-bold text-xl leading-snug text-balance">
              {t(c.o1Title)}
            </h3>
            <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {t(c.o1Body)}
            </p>
            <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {t(c.standingNote)}
            </p>
            <span className="self-start mt-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
              {t(c.standingTag)}
            </span>
          </div>

          <p className="mt-10 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t(c.courseLabel)}
          </p>
          <Listing evenings={ONLINE} className="mt-3" />
        </section>

        <section className="mt-14 md:mt-20">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.lotTitle)}</h2>
          <p className="mt-1.5 max-w-prose text-[15px] text-muted-foreground">{t(c.lotIntro)}</p>
          <Listing evenings={LOT} />
        </section>

        {/* Set before the notes and the sign-up panel: someone deciding what to
            book needs to know these are group workshops on generic examples
            before they read how to come to one. */}
        <section className="mt-14 md:mt-20 pt-8 border-t-2 border-foreground">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.compareTitle)}</h2>
          <p className="mt-1.5 max-w-prose text-[15px] text-muted-foreground">
            {t(c.compareIntro)}
          </p>

          <div className="mt-7 grid gap-5 md:grid-cols-2">
            {[
              { head: c.compareAHead, points: [c.compareA1, c.compareA2, c.compareA3, c.compareA4], here: true },
              { head: c.compareBHead, points: [c.compareB1, c.compareB2, c.compareB3, c.compareB4], here: false },
            ].map((col) => (
              <div
                key={col.head.en}
                className={cn(
                  "rounded-2xl border p-6 flex flex-col gap-3",
                  col.here ? "border-primary/30 bg-primary/[0.04]" : "border-border bg-card",
                )}
              >
                <h3
                  className={cn(
                    "font-serif font-bold text-lg",
                    col.here ? "text-primary" : "text-foreground",
                  )}
                >
                  {t(col.head)}
                </h3>
                <ul className="flex flex-col gap-2.5">
                  {col.points.map((p) => (
                    <li
                      key={p.en}
                      className="grid grid-cols-[0.75rem_1fr] gap-2 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[0.6em] h-[3px] w-2 rounded-full",
                          col.here ? "bg-primary" : "bg-muted-foreground/40",
                        )}
                      />
                      <span>{t(p)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-14 md:mt-20 grid gap-7 sm:grid-cols-2 lg:grid-cols-3 pt-8 border-t border-border">
          {NOTES.map((n) => (
            <div key={n.title.en} className="flex flex-col gap-1.5">
              <h3 className="font-serif font-bold text-base">{t(n.title)}</h3>
              <p className="text-[15px] leading-relaxed text-muted-foreground">{t(n.body)}</p>
            </div>
          ))}
        </section>

        <section className="mt-14 md:mt-20 rounded-2xl bg-secondary/30 border border-border p-7 md:p-10 flex flex-col gap-3.5">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.joinTitle)}</h2>
          <p className="max-w-prose text-muted-foreground">
            {t(c.joinA)}{" "}
            <a
              href={MAILTO}
              className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-[3px] hover:text-primary transition-colors"
            >
              daniel@tutto.one
            </a>{" "}
            {t(c.joinB)}
          </p>
          <p className="max-w-prose text-muted-foreground">{t(c.joinPay)}</p>
          <p className="max-w-prose text-muted-foreground">{t(c.joinReschedule)}</p>
        </section>

        <Link
          href="/praxis-programme"
          className="mt-8 group flex items-center justify-between gap-6 p-6 bg-card border border-border rounded-2xl hover:border-primary/40 transition-colors"
        >
          <div>
            <p className="font-serif text-lg font-bold text-foreground group-hover:text-primary transition-colors">
              {t(c.programmeTitle)}
            </p>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">{t(c.programmeBody)}</p>
          </div>
          <span className="hidden sm:inline text-sm font-medium text-primary shrink-0">
            {t(c.programmeLink)} →
          </span>
        </Link>

        <p className="mt-12 pt-6 border-t border-border text-[13px] text-muted-foreground">
          {t(c.independence)}
        </p>
      </div>
    </Layout>
  );
}
