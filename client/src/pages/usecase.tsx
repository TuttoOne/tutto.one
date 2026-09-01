import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "wouter";
import { Layout } from "@/components/layout/Layout";
import { copy, useT, useLocale, SITE_TITLE } from "@/lib/i18n";
import { usePageTr } from "@/lib/page-fr";
import { USECASE_FR } from "@/lib/fr/usecase";
import { USE_CASE_RUNS, type UseCaseRun } from "@/lib/usecase-runs";
import { cn } from "@/lib/utils";

const c = copy.usecase;

/**
 * Pacing, and telling the truth about it. The real runs take between a third of
 * a second and three seconds. Played at that speed a viewer sees a flicker and
 * learns nothing, so each stage is given room proportional to how much it
 * printed, and the panel states the real figure next to the paced one.
 *
 * What is never altered: the stages, their order, the notes they printed, or
 * the files they produced.
 */
const PER_NOTE = 820;
const BASE = 1500;
const MIN_STAGE = 2100;
const GAP = 260;

const stageMs = (notes: number) => Math.max(MIN_STAGE, BASE + notes * PER_NOTE);
const totalMs = (run: UseCaseRun) =>
  run.stages.reduce((t, s) => t + stageMs(s.notes.length) + GAP, 0);

/** One decimal place, with the French comma — used for seconds and megabytes. */
function oneDecimal(n: number, locale: string) {
  const s = n.toFixed(1);
  return locale === "fr" ? s.replace(".", ",") : s;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/* -------------------------------------------------------------------------- */

/**
 * One recorded run, played back.
 *
 * `stage` is the index of the stage currently running and `notes` how many of
 * its lines have printed; everything before it has finished and keeps its
 * lines on screen. That is the whole model — the timers only ever push those
 * two numbers forward.
 */
function RunConsole({ run }: { run: UseCaseRun }) {
  const t = useT();
  const tr = usePageTr(USECASE_FR);
  const locale = useLocale();

  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const [at, setAt] = useState({ stage: -1, notes: 0 });
  /** Bumped on every press, so the progress bars remount and restart. */
  const [attempt, setAttempt] = useState(0);

  const timers = useRef<number[]>([]);
  const stageRefs = useRef<(HTMLLIElement | null)[]>([]);
  const doneRef = useRef<HTMLDivElement | null>(null);
  /* Follow the run down the page, but stop the moment the viewer takes over. A
     demo that fights your scroll wheel is worse than one that does not scroll. */
  const follow = useRef(true);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => clearTimers, [clearTimers]);

  const reduced = prefersReducedMotion();

  const scrollTo = useCallback(
    (node: HTMLElement | null) => {
      if (!follow.current || !node) return;
      node.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    },
    [reduced],
  );

  const play = () => {
    clearTimers();
    setPhase("running");
    setAt({ stage: -1, notes: 0 });
    setAttempt((n) => n + 1);

    follow.current = true;
    const release = () => {
      follow.current = false;
    };
    window.addEventListener("wheel", release, { passive: true, once: true });
    window.addEventListener("touchmove", release, { passive: true, once: true });
    window.addEventListener("keydown", release, { once: true });

    const push = (fn: () => void, ms: number) => {
      timers.current.push(window.setTimeout(fn, ms));
    };

    let clock = 0;
    run.stages.forEach((stage, i) => {
      const dur = stageMs(stage.notes.length);
      const startedAt = clock;

      push(() => {
        setAt({ stage: i, notes: 0 });
        scrollTo(stageRefs.current[i]);
      }, startedAt);

      // Space the notes across the stage so each one has time to be read.
      const step = stage.notes.length ? (dur - 500) / stage.notes.length : 0;
      stage.notes.forEach((_, k) => {
        push(() => setAt({ stage: i, notes: k + 1 }), startedAt + 380 + k * step);
      });

      clock += dur + GAP;
    });

    push(() => {
      setPhase("done");
      setAt({ stage: run.stages.length, notes: 0 });
      // The panel has to be on the page before it can be scrolled to.
      push(() => scrollTo(doneRef.current), 60);
    }, clock + 200);
  };

  const total = totalMs(run);
  const running = phase === "running";

  const fmtSize = (n: number) =>
    n < 1048576
      ? `${(n / 1024).toFixed(0)} ${t(c.unitKb)}`
      : `${oneDecimal(n / 1048576, locale)} ${t(c.unitMb)}`;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card">
      {/* The window strip from the site's example-session card, so a run reads
          as machine output rather than as page furniture. */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary/40 px-4 py-3">
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-primary/50" />
        <span aria-hidden className="h-2.5 w-2.5 rounded-full bg-muted-foreground/30" />
        <span className="ml-2 font-mono text-[11px] text-muted-foreground">
          {t(c.recorded)} · {tr(run.tab).toLowerCase()}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-5 px-5 py-5 md:px-6">
        <button
          type="button"
          onClick={play}
          disabled={running}
          data-testid={`button-run-${run.id}`}
          className="rounded-full bg-primary px-8 py-3 font-medium text-primary-foreground
                     transition-colors hover:bg-primary/90
                     disabled:cursor-default disabled:bg-secondary disabled:text-muted-foreground"
        >
          {running ? t(c.running) : phase === "done" ? t(c.runAgain) : t(c.run)}
        </button>
        <p className="max-w-[42ch] text-[13px] leading-snug text-muted-foreground">
          {running ? (
            t(c.pacingDuring)
          ) : phase === "done" ? (
            <>
              {t(c.pacingA)} {oneDecimal(run.real, locale)} {t(c.pacingSeconds)}
            </>
          ) : (
            <>
              {t(c.pacingA)} {oneDecimal(run.real, locale)} {t(c.pacingB)}{" "}
              {Math.round(total / 1000)} {t(c.pacingC)}
            </>
          )}
        </p>
      </div>

      {/* Overall progress across the whole run. */}
      <div className="h-[3px] bg-border">
        {phase !== "idle" && (
          <i
            key={attempt}
            className="usecase-fill block h-full bg-primary"
            style={{ animationDuration: `${total}ms` }}
          />
        )}
      </div>

      <ol className="list-none">
        {run.stages.map((stage, i) => {
          const state = i < at.stage ? "done" : i === at.stage ? "running" : "waiting";
          const shown = state === "done" ? stage.notes.length : state === "running" ? at.notes : 0;
          return (
            <li
              key={stage.label + i}
              ref={(node) => {
                stageRefs.current[i] = node;
              }}
              className={cn(
                "border-t border-border px-5 pb-[18px] transition-opacity md:px-6",
                state === "waiting" ? "opacity-[0.35]" : "opacity-100",
              )}
            >
              <div className="flex items-start gap-3.5 pt-4">
                <span
                  className={cn(
                    "mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full border-[1.5px]",
                    "font-mono text-[11px] font-semibold tabular-nums",
                    state === "done"
                      ? "border-emerald-700 bg-emerald-700 text-white"
                      : state === "running"
                        ? "border-primary text-primary"
                        : "border-border text-muted-foreground/60",
                  )}
                >
                  {state === "done" ? "✓" : i + 1}
                </span>
                <span className="text-[15px] font-semibold leading-relaxed">
                  {tr(stage.label)}
                </span>
              </div>

              <div
                className={cn(
                  "ml-[38px] mt-3 h-[3px] overflow-hidden rounded-sm bg-border",
                  state === "done" && "opacity-30",
                )}
              >
                {state !== "waiting" && (
                  <i
                    key={`${attempt}-${i}`}
                    className={cn(
                      "usecase-fill block h-full",
                      state === "done" ? "bg-emerald-700" : "bg-primary",
                    )}
                    style={{ animationDuration: `${stageMs(stage.notes.length)}ms` }}
                  />
                )}
              </div>

              {/* The output block only earns its ground once something has
                  printed into it, so the padding and the tint arrive with the
                  first line rather than reserving an empty slab. */}
              {shown > 0 && (
                <div className="ml-[38px] mt-3 rounded-lg bg-secondary px-3.5 py-3 font-mono text-[13px] leading-[1.75] text-muted-foreground">
                  {stage.notes.slice(0, shown).map((note, k) => (
                    <div
                      key={`${k}-${note}`}
                      className={cn(
                        "usecase-note",
                        /matches$/.test(note) && "font-semibold text-emerald-700",
                      )}
                    >
                      {tr(note)}
                    </div>
                  ))}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {phase === "done" && (
        <div className="border-t border-border px-5 pb-1.5 pt-6 md:px-6">
          <div
            ref={doneRef}
            className="mb-5 rounded-2xl border border-border bg-secondary p-6"
          >
            <h3 className="font-serif text-xl font-bold tracking-tight">{t(c.finished)}</h3>
            <p className="mb-[18px] mt-1 text-sm text-muted-foreground">
              {t(c.finishedSubA)} {oneDecimal(run.real, locale)} {t(c.finishedSubB)}
            </p>

            <table className="w-full border-collapse text-[15px]">
              <tbody>
                {run.summary.map((row) => (
                  <tr key={row.key} className="border-b border-border last:border-b-0">
                    <td className="py-2 text-muted-foreground">{tr(row.key)}</td>
                    <td className="py-2 text-right font-semibold tabular-nums">
                      {tr(row.value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-[22px] grid">
              <b className="mb-1 text-[11px] font-medium uppercase tracking-[0.1em] text-muted-foreground/70">
                {t(c.filesMade)}
              </b>
              {run.downloads.map((file) => (
                <a
                  key={file.href}
                  href={file.href}
                  download
                  className="flex items-baseline justify-between gap-4 border-t border-border py-3
                             font-medium text-primary hover:underline"
                >
                  {file.name}
                  <i className="whitespace-nowrap text-[13px] font-normal not-italic text-muted-foreground/70">
                    {tr(file.kind)} · {fmtSize(file.size)}
                  </i>
                </a>
              ))}
            </div>
          </div>

          <p className="mb-5 rounded-2xl border border-border bg-primary/5 p-6 text-[15px] leading-relaxed">
            {tr(run.caught)}
          </p>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/** One of the five beats, in the list under the runs. */
function Beat({ n, title, body }: { n: number; title: string; body: string }) {
  return (
    <li className="relative border-b border-border py-4 pl-10">
      <span className="absolute left-0 top-[19px] font-mono text-[11px] leading-none tabular-nums text-primary">
        {String(n).padStart(2, "0")}
      </span>
      <b className="block font-semibold">{title}</b>
      <span className="text-[15px] text-muted-foreground">{body}</span>
    </li>
  );
}

export default function UseCase() {
  const t = useT();
  const tr = usePageTr(USECASE_FR);
  const locale = useLocale();
  const [active, setActive] = useState(USE_CASE_RUNS[0].id);

  const title = t(c.title);
  useEffect(() => {
    document.title = `${title} | Tutto`;
    return () => {
      document.title = SITE_TITLE;
    };
  }, [title]);

  const beats = [
    { title: t(c.beat1), body: t(c.beat1Body) },
    { title: t(c.beat2), body: t(c.beat2Body) },
    { title: t(c.beat3), body: t(c.beat3Body) },
    { title: t(c.beat4), body: t(c.beat4Body) },
    { title: t(c.beat5), body: t(c.beat5Body) },
  ];

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-6 py-12 md:py-16">
        <header>
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
            {t(c.eyebrow)}
          </p>
          <h1 className="mt-5 max-w-[20ch] font-serif text-4xl font-bold leading-[1.12] tracking-tight text-balance md:text-5xl">
            {t(c.title)}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            {t(c.lede)}
          </p>
        </header>

        <div role="tablist" className="mt-11 flex flex-wrap border-b border-border">
          {USE_CASE_RUNS.map((run) => {
            const on = run.id === active;
            return (
              <button
                key={run.id}
                type="button"
                role="tab"
                id={`tab-${run.id}`}
                aria-selected={on}
                aria-controls={`panel-${run.id}`}
                onClick={() => setActive(run.id)}
                data-testid={`tab-${run.id}`}
                className={cn(
                  "-mb-px flex-1 basis-[190px] border-b-2 pb-3 pr-3.5 pt-3.5 text-left",
                  on ? "border-primary" : "border-transparent",
                )}
              >
                <b
                  className={cn(
                    "block text-[15px] font-semibold transition-colors",
                    on ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  {tr(run.tab)}
                </b>
                <span
                  className={cn(
                    "mt-1 block text-[11px] uppercase tracking-[0.1em]",
                    on ? "text-primary" : "text-muted-foreground/60",
                  )}
                >
                  {tr(run.sector)}
                </span>
              </button>
            );
          })}
        </div>

        {USE_CASE_RUNS.map((run) => (
          <section
            key={run.id}
            id={`panel-${run.id}`}
            role="tabpanel"
            aria-labelledby={`tab-${run.id}`}
            hidden={run.id !== active}
            className="pb-14 pt-10"
          >
            <p className="text-[11px] uppercase tracking-[0.1em] text-muted-foreground/60">
              {tr(run.who)}
            </p>
            <h2 className="mt-3 max-w-[24ch] font-serif text-2xl font-bold leading-tight tracking-tight text-balance md:text-3xl">
              {tr(run.title)}
            </h2>
            <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
              {tr(run.problem)}
            </p>
            <RunConsole run={run} />
          </section>
        ))}

        <section className="mt-2 border-t border-border pb-14">
          <div className="flex items-baseline gap-4 pt-6">
            <span className="font-mono text-[11px] tabular-nums text-muted-foreground/60">01</span>
            <b className="text-[11px] font-semibold uppercase tracking-[0.16em] text-primary">
              {t(c.shapeKicker)}
            </b>
          </div>
          <h2 className="mt-7 max-w-[30ch] font-serif text-2xl font-bold leading-tight tracking-tight text-balance md:text-3xl">
            {t(c.shapeTitle)}
          </h2>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed">{t(c.shapeBody)}</p>

          <ol className="mt-8 list-none border-t border-border">
            {beats.map((beat, i) => (
              <Beat key={beat.title} n={i + 1} title={beat.title} body={beat.body} />
            ))}
          </ol>

          <figure className="mt-9">
            <img
              src="/usecase/rules-sheet.png"
              alt={t(c.figureAlt)}
              loading="lazy"
              className="block h-auto w-full rounded-2xl border border-border bg-white"
            />
            <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {t(c.figureCaption)}
            </figcaption>
          </figure>

          {/* The site's aside: a card rather than a rule in the margin. */}
          <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-secondary p-6">
            <p className="leading-relaxed text-muted-foreground">
              <b className="text-foreground">{t(c.bringTitle)}</b> {t(c.bringBody)}
            </p>
          </div>
          <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-secondary p-6">
            <p className="leading-relaxed text-muted-foreground">
              <b className="text-foreground">{t(c.inventedTitle)}</b> {t(c.inventedBody)}
            </p>
          </div>
          <div className="mt-6 max-w-2xl rounded-2xl border border-border bg-secondary p-6">
            <p className="leading-relaxed text-muted-foreground">
              <b className="text-foreground">{t(c.recordedTitle)}</b>
              {t(c.recordedBody)}
            </p>
          </div>
        </section>

        <section className="mb-14 rounded-2xl border border-border bg-secondary p-8">
          <h2 className="font-serif text-xl font-bold tracking-tight">{t(c.ctaTitle)}</h2>
          <p className="mb-6 mt-2 max-w-xl text-muted-foreground">{t(c.ctaBody)}</p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="https://cal.com/tuttoone/30min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-primary px-8 py-3
                         font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {t(copy.common.bookConversation)}
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-full border border-border
                         px-8 py-3 font-medium transition-colors hover:bg-foreground/[0.03]"
            >
              {t(copy.common.sendMessage)}
            </Link>
          </div>
        </section>
      </div>
    </Layout>
  );
}
