/**
 * Every price on the site, in one table.
 *
 * Three rules keep this honest:
 *
 * 1. EUR is the stated base — those are the figures that were set commercially.
 *    GBP and ZAR are the same price expressed for those markets, at roughly
 *    EUR/1.2 and EUR x 20. They are NOT live FX rates — they are fixed so the
 *    price is stable — but the figures are carried exactly rather than rounded
 *    to a tidier number.
 *
 * 2. Derived figures are COMPUTED, never typed in. Course tuition is eight
 *    sessions; the referral rate is half the course; the trainer split is 80/20.
 *    Typing those per currency guarantees they eventually contradict the
 *    numbers they are supposed to come from — which is exactly what happened to
 *    the referral card, which was showing 80% of the course instead of half.
 *
 * 3. One thing, one key. The diagnostic sprint and the data audit are the same
 *    engagement, so they share `sprint` rather than drifting apart under two
 *    names.
 */
import type { Currency, Locale } from "./preferences";

/** Sessions in a full Praxis course. Declared before PRICES, which uses it. */
const COURSE_SESSIONS_N = 8;

export type PriceKey =
  // Praxis
  | "sessionStandard"
  | "sessionPromo"
  | "toolsMonthly"
  // Engagements
  | "sprint"
  | "scriptBuildFrom"
  | "build"
  | "enablementFrom"
  // SharePoint
  | "spAuditFrom"
  | "spBuildFrom"
  | "spRetainerMonthly";

/** The session rate. Course tuition and team enablement are both eight of these. */
const SESSION = { GBP: 200, EUR: 250, ZAR: 5000 };

/** Build rate per hour. The scripting engagement is a multiple of this. */
const HOUR = { GBP: 83, EUR: 100, ZAR: 2000 };
/**
 * Hours in one scripting engagement, taken from a delivered piece of work
 * rather than estimated. Exported so the figure can be quoted alongside the
 * price instead of being restated in prose that then drifts from it.
 */
export const SCRIPT_BUILD_HOURS = 40;

/** Base rates. Everything else on the site is derived from these. */
export const PRICES: Record<PriceKey, Record<Currency, number>> = {
  /** Standard one-hour Praxis session. Course tuition is eight of these. */
  sessionStandard: SESSION,
  /** Promotional session rate — half the standard rate. */
  sessionPromo: { GBP: 100, EUR: 125, ZAR: 2500 },
  /** Third-party AI subscription, approx. Quoted at ~$20/mo at source. */
  toolsMonthly: { GBP: 16, EUR: 19, ZAR: 400 },

  /**
   * Two-week diagnostic sprint — the data audit and knowledge map. Pythia and
   * the services page quote the same engagement, so they quote the same key.
   */
  sprint: { GBP: 2000, EUR: 2400, ZAR: 48000 },
  /**
   * One scripting build: a working solution on infrastructure the client
   * already has. Computed from the hourly rate and the hours, so the two can
   * never contradict each other. Assumes the client's own hosting or hardware;
   * anything we have to host is quoted separately.
   */
  scriptBuildFrom: {
    GBP: HOUR.GBP * SCRIPT_BUILD_HOURS,
    EUR: HOUR.EUR * SCRIPT_BUILD_HOURS,
    ZAR: HOUR.ZAR * SCRIPT_BUILD_HOURS,
  },
  /**
   * Pythia build. Excludes hardware. Carried at the exact converted figure
   * rather than rounded to a tidier number.
   */
  build: { GBP: 8208, EUR: 9850, ZAR: 197000 },
  /**
   * Team enablement IS the training — the same eight sessions as the course,
   * computed from the session rate so the two can never show different prices
   * for the same thing.
   */
  enablementFrom: {
    GBP: SESSION.GBP * COURSE_SESSIONS_N,
    EUR: SESSION.EUR * COURSE_SESSIONS_N,
    ZAR: SESSION.ZAR * COURSE_SESSIONS_N,
  },

  /** SharePoint audit, from. */
  spAuditFrom: { GBP: 500, EUR: 600, ZAR: 12000 },
  /** SharePoint build, from. */
  spBuildFrom: { GBP: 5000, EUR: 6000, ZAR: 120000 },
  /** SharePoint support retainer, monthly, from. */
  spRetainerMonthly: { GBP: 500, EUR: 600, ZAR: 12000 },
};

/** Share of tuition kept by the trainer who delivers the course. */
export const TRAINER_SHARE = 0.8;
/** Sessions in a full Praxis course. Course tuition is this times the rate. */
export const COURSE_SESSIONS = COURSE_SESSIONS_N;
/** Sessions in the train-the-trainer track, charged at the standard rate. */
export const TRAINER_TRACK_SESSIONS = 4;
/** Students used in the worked annual example on the trainer page. */
export const EXAMPLE_STUDENTS = 24;
/** Referrals that reduce the course fee to nothing. */
export const REFERRALS_FOR_FREE = 2;

/**
 * Ongoing support for a Pythia build, as a share of build cost per year.
 * A range rather than a figure: it is agreed during the project.
 */
export const ONGOING_MIN_PCT = 10;
export const ONGOING_MAX_PCT = 20;

/** Price keys offered in the admin content editor. */
export const SELECTABLE_PRICES: { key: PriceKey; label: string }[] = [
  { key: "sprint", label: "Diagnostic sprint / data audit (€2,400)" },
  { key: "scriptBuildFrom", label: "Scripting build, 40h (€4,000)" },
  { key: "enablementFrom", label: "Team enablement / training (€2,000)" },
  { key: "build", label: "Pythia build, excl. hardware (€9,850)" },
  { key: "sessionStandard", label: "Praxis session, standard (€250)" },
  { key: "sessionPromo", label: "Praxis session, promo (€125)" },
  { key: "spAuditFrom", label: "SharePoint audit (€600)" },
  { key: "spBuildFrom", label: "SharePoint build (€6,000)" },
  { key: "spRetainerMonthly", label: "SharePoint retainer (€600/mo)" },
  { key: "toolsMonthly", label: "AI subscription (€19/mo)" },
];

const SYMBOLS: Record<Currency, string> = { GBP: "£", EUR: "€", ZAR: "R" };

/**
 * Format an amount as a rate-card price: symbol, grouped thousands, no
 * decimals. Intl handles grouping so French renders 9 850, not 9,850.
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

/** Course tuition and the referral ladder, all derived from the session rate. */
export function courseEconomics(currency: Currency, locale: Locale) {
  const session = amount("sessionStandard", currency);
  const course = session * COURSE_SESSIONS;
  const f = (n: number) => formatMoney(n, currency, locale);
  return {
    session: f(session),
    /** Full course, no referrals. */
    course: f(course),
    /** Each paying referral takes 50% of the original off. */
    courseWithOneReferral: f(course / 2),
    /** Two referrals: nothing to pay, the fee is refunded in full. */
    referralsForFree: REFERRALS_FOR_FREE,
  };
}

/**
 * The trainer revenue split, derived from the session and course rates so the
 * two halves always add back up to the whole in every currency.
 */
export function trainerEconomics(currency: Currency, locale: Locale) {
  const session = amount("sessionStandard", currency);
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
    /** Half-price course rate, after one referral. */
    courseWithOneReferral: f(course / 2),
  };
}
