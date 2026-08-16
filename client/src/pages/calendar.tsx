import { useEffect } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";
import { copy, useT, SITE_TITLE } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";

const MAILTO = "mailto:daniel@tutto.one?subject=Applied%20AI%20Events";

type Leaf = { en: string; fr: string };

const c = copy.calendar;

/**
 * One month of the online run, and every month is the same four. Describing
 * the cycle once and listing the dates separately keeps the page from
 * repeating itself twelve times over an autumn.
 */
const SESSIONS: { n: string; ord: Leaf; title: Leaf; body: Leaf; free?: boolean }[] = [
  { n: "1", ord: c.ord1, title: c.o1Title, body: c.o1Body, free: true },
  { n: "2", ord: c.ord2, title: c.o2Title, body: c.o2Body },
  { n: "3", ord: c.ord3, title: c.o3Title, body: c.o3Body },
  { n: "4", ord: c.ord4, title: c.o4Title, body: c.o4Body },
];

/**
 * The Tuesdays each cycle lands on. September runs 1–22 and drops the 29th:
 * a month with five Tuesdays skips the last, so the cycle stays four long.
 */
const TUESDAYS: { month: Leaf; days: string[] }[] = [
  { month: c.sep, days: ["1", "8", "15", "22"] },
  { month: c.oct, days: ["6", "13", "20", "27"] },
  { month: c.nov, days: ["3", "10", "17", "24"] },
];

/** Every second Thursday, 20:30–22:00, the same talk in a different commune. */
const THURSDAYS: { month: Leaf; days: string[] }[] = [
  { month: c.sep, days: ["10", "24"] },
  { month: c.oct, days: ["8", "22"] },
  { month: c.nov, days: ["5", "19"] },
];

const NOTES: { title: Leaf; body: Leaf }[] = [
  { title: c.note1Title, body: c.note1Body },
  { title: c.note2Title, body: c.note2Body },
  { title: c.note3Title, body: c.note3Body },
];

/** The dates, as a strip of month rows rather than a row per event. */
function Dates({
  label,
  groups,
  note,
}: {
  label: Leaf;
  groups: { month: Leaf; days: string[] }[];
  note: Leaf;
}) {
  const t = useT();
  return (
    <div className="mt-8 rounded-2xl border border-border bg-card p-6 md:p-7">
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {t(label)}
      </p>
      <div className="mt-4 flex flex-col gap-2.5">
        {groups.map((g) => (
          <div key={g.month.en} className="flex items-center gap-4">
            <span className="w-12 shrink-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {t(g.month)}
            </span>
            {/* Each date boxed, so the strip reads as days on a calendar. */}
            <span className="flex flex-wrap gap-2 tabular-nums">
              {g.days.map((d) => (
                <span
                  key={d}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-xl
                             border border-primary/25 bg-primary/[0.06]
                             font-serif font-black text-xl leading-none tracking-tight text-primary"
                >
                  {d}
                </span>
              ))}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 max-w-prose text-[14px] leading-relaxed text-muted-foreground">
        {t(note)}
      </p>
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
  const allThree = p("eveningSeries");

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

          {/* One line each on a phone, a single wrapped row from sm up. */}
          <div className="flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-7 sm:gap-y-2 pt-3 mt-1 border-t border-border text-[13px] text-muted-foreground">
            <span className="font-semibold text-foreground">{t(c.factFirstFree)}</span>
            <span>
              <b className="font-semibold text-foreground">{perClass}</b> {t(c.factPerClass)}{" "}
              <b className="font-semibold text-foreground">{allThree}</b> {t(c.factAllSix)}
            </span>
            <span className="font-semibold text-foreground">{t(c.factHour)}</span>
            <span>{t(c.factLotFree)}</span>
          </div>
        </header>

        <section className="mt-14 md:mt-20">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.onlineTitle)}</h2>
          <p className="mt-1.5 max-w-prose text-[15px] text-muted-foreground">{t(c.onlineIntro)}</p>

          <div className="mt-8">
            {SESSIONS.map((s) => (
              <article
                key={s.n}
                className="grid grid-cols-1 sm:grid-cols-[9rem_1fr] gap-3 sm:gap-x-8 sm:gap-y-1
                           items-start py-6 border-t border-border last:border-b"
              >
                {/* Position in the month, where a one-off listing would show a date. */}
                <div className="flex items-baseline gap-2.5 sm:gap-2">
                  <span className="font-serif font-black text-primary text-4xl sm:text-[2.75rem] leading-[0.85] tracking-tighter tabular-nums">
                    {s.n}
                    {/* Ordinal set small and high, off the numeral's top right. */}
                    <sup className="text-[0.36em] font-bold tracking-normal">{t(s.ord)}</sup>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-[0.12em] leading-snug text-muted-foreground">
                    {t(c.nthTuesday)}
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  <h3 className="font-serif font-bold text-lg leading-snug text-balance">
                    {t(s.title)}
                  </h3>
                  <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
                    {t(s.body)}
                  </p>
                  {s.free && (
                    <span className="self-start mt-1 rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-primary-foreground">
                      {t(c.tagFree)}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>

          <Dates label={c.datesLabel} groups={TUESDAYS} note={c.datesNote} />
        </section>

        <section className="mt-14 md:mt-20">
          <h2 className="font-serif font-bold text-2xl tracking-tight">{t(c.lotTitle)}</h2>
          <p className="mt-1.5 max-w-prose text-[15px] text-muted-foreground">{t(c.lotIntro)}</p>

          <div className="mt-8 pt-6 border-t border-border flex flex-col gap-1.5">
            <h3 className="font-serif font-bold text-lg leading-snug">{t(c.lotEveningTitle)}</h3>
            <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
              {t(c.lotEveningBody)}
            </p>
          </div>

          <Dates label={c.lotDatesLabel} groups={THURSDAYS} note={c.lotDatesNote} />
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
                  {col.points.map((pt) => (
                    <li
                      key={pt.en}
                      className="grid grid-cols-[0.75rem_1fr] gap-2 text-[15px] leading-relaxed text-muted-foreground"
                    >
                      <span
                        aria-hidden
                        className={cn(
                          "mt-[0.6em] h-[3px] w-2 rounded-full",
                          col.here ? "bg-primary" : "bg-muted-foreground/40",
                        )}
                      />
                      <span>{t(pt)}</span>
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
