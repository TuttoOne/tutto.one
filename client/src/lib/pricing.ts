/**
 * Every price on the site, in one table.
 *
 * Two rules keep this honest:
 *
 * 1. These are NOT live FX conversions. Converting £100 at spot gives €118.37,
 *    which reads as an accident rather than a price. Each currency gets its own
 *    round figure, the way it would appear on a rate card.
 *
 * 2. Derived figures are COMPUTED, never typed in. The trainer split is 80/20
 *    of the session rate, and the annual figures are multiples of course
 *    tuition. Hardcoding those per currency guarantees they eventually
 *    contradict the numbers they are supposed to be derived from.
 *
 * ---------------------------------------------------------------------------
 * ONLY THE GBP COLUMN COMES FROM PUBLISHED COPY. The EUR and ZAR figures are
 * indicative, set at roughly 1.17x and 23.5x sterling and rounded to plausible
 * rate-card numbers. They are a commercial decision, not a calculation.
 * Review before relying on them. Change a number here and it changes
 * everywhere it appears on the site.
 * ---------------------------------------------------------------------------
 */
import type { Currency, Locale } from "./preferences";

export type PriceKey =
  // Praxis
  | "sessionStandard"
  | "sessionPromo"
  | "toolsMonthly"
  // Engagements
  | "sprint"
  | "build"
  // Services
  | "auditFrom"
  | "enablementFrom"
  // SharePoint
  | "spAuditFrom"
  | "spBuildFrom"
  | "spRetainerMonthly";

/** Base rates. Everything else on the site is derived from these. */
export const PRICES: Record<PriceKey, Record<Currency, number>> = {
  /** Standard one-hour Praxis session. */
  sessionStandard: { GBP: 200, EUR: 240, ZAR: 4800 },
  /** Current promotional session rate. */
  sessionPromo: { GBP: 100, EUR: 120, ZAR: 2400 },
  /** Third-party AI subscription, approx. Quoted at ~$20/mo at source. */
  toolsMonthly: { GBP: 16, EUR: 19, ZAR: 380 },

  /** Two-week diagnostic sprint (Praxis and Pythia both quote this). */
  sprint: { GBP: 2500, EUR: 2900, ZAR: 58000 },
  /** Pythia build, from. */
  build: { GBP: 20000, EUR: 23500, ZAR: 470000 },

  /** Data audit & knowledge mapping, from. */
  auditFrom: { GBP: 2000, EUR: 2350, ZAR: 47000 },
  /** Team enablement, from. */
  enablementFrom: { GBP: 3500, EUR: 4100, ZAR: 82000 },

  /** SharePoint audit, from. */
  spAuditFrom: { GBP: 500, EUR: 590, ZAR: 12000 },
  /** SharePoint build, from. */
  spBuildFrom: { GBP: 5000, EUR: 5900, ZAR: 118000 },
  /** SharePoint support retainer, monthly, from. */
  spRetainerMonthly: { GBP: 500, EUR: 590, ZAR: 12000 },
};

/** Share of tuition kept by the trainer who delivers the course. */
export const TRAINER_SHARE = 0.8;
/** Sessions in a full Praxis course. Course tuition is this times the rate. */
export const COURSE_SESSIONS = 8;
/** Sessions in the train-the-trainer track, charged at the standard rate. */
export const TRAINER_TRACK_SESSIONS = 4;
/** Students used in the worked annual example on the trainer page. */
export const EXAMPLE_STUDENTS = 24;

const SYMBOLS: Record<Currency, string> = { GBP: "£", EUR: "€", ZAR: "R" };

/**
 * Format an amount as a rate-card price: symbol, grouped thousands, no
 * decimals. Intl handles grouping so French renders 23 500, not 23,500.
 */
export function formatMoney(amount: number, currency: Currency, locale: Locale): string {
  const grouped = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
  return `${SYMBOLS[currency]}${grouped}`;
}

/** Look up a base price and format it for the active currency. */
export function price(key: PriceKey, currency: Currency, locale: Locale): string {
  return formatMoney(PRICES[key][currency], currency, locale);
}

/** Raw base amount, for deriving figures before formatting. */
export function amount(key: PriceKey, currency: Currency): number {
  return PRICES[key][currency];
}

/**
 * The trainer revenue split, derived from the session and course rates so the
 * two halves always add back up to the whole in every currency.
 */
export function trainerEconomics(currency: Currency, locale: Locale) {
  const session = amount("sessionStandard", currency);
  // Course tuition and the trainer track are multiples of the session rate,
  // because the page says so in words ("four sessions at the standard rate").
  // Deriving them means the words stay true in every currency.
  const course = session * COURSE_SESSIONS;
  const track = session * TRAINER_TRACK_SESSIONS;
  const yearTuition = course * EXAMPLE_STUDENTS;
  const f = (n: number) => formatMoney(n, currency, locale);

  return {
    sessionStandard: f(session),
    sessionYou: f(session * TRAINER_SHARE),
    sessionMine: f(session * (1 - TRAINER_SHARE)),
    courseTuition: f(course),
    courseYou: f(course * TRAINER_SHARE),
    courseMine: f(course * (1 - TRAINER_SHARE)),
    yearTuition: f(yearTuition),
    yearYou: f(yearTuition * TRAINER_SHARE),
    yearMine: f(yearTuition * (1 - TRAINER_SHARE)),
    trainerTrack: f(track),
    /** Praxis course plus the trainer track. */
    trainerTotal: f(course + track),
    /** Half-price referral rate, per session. */
    referralPerSession: f(session / 2),
  };
}
