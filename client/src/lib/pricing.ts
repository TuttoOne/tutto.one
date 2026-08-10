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

/**
 * Base rates. Everything else on the site is derived from these.
 *
 * The session rate is the keystone: course tuition, the trainer track and the
 * annual example are all multiples of it. EUR 250 and ZAR 5,000 were chosen so
 * those multiples land on round numbers (EUR 2,000 / 1,000 / 3,000;
 * ZAR 40,000 / 20,000 / 60,000) rather than on the ragged figures a straight
 * conversion produces. The promotional rate is half the standard rate in every
 * currency, as it is in sterling.
 */
export const PRICES: Record<PriceKey, Record<Currency, number>> = {
  /** Standard one-hour Praxis session. */
  sessionStandard: { GBP: 200, EUR: 250, ZAR: 5000 },
  /** Current promotional session rate — half the standard rate. */
  sessionPromo: { GBP: 100, EUR: 125, ZAR: 2500 },
  /** Third-party AI subscription, approx. Quoted at ~$20/mo at source. */
  toolsMonthly: { GBP: 16, EUR: 19, ZAR: 400 },

  /** Two-week diagnostic sprint (Praxis and Pythia both quote this). */
  sprint: { GBP: 2500, EUR: 3000, ZAR: 60000 },
  /** Pythia build, from. */
  build: { GBP: 20000, EUR: 24000, ZAR: 480000 },

  /** Data audit & knowledge mapping, from. */
  auditFrom: { GBP: 2000, EUR: 2400, ZAR: 48000 },
  /** Team enablement, from. */
  enablementFrom: { GBP: 3500, EUR: 4200, ZAR: 84000 },

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
export const COURSE_SESSIONS = 8;
/** Sessions in the train-the-trainer track, charged at the standard rate. */
export const TRAINER_TRACK_SESSIONS = 4;
/** Students used in the worked annual example on the trainer page. */
export const EXAMPLE_STUDENTS = 24;

/**
 * Price keys offered in the admin content editor, so a price can be chosen
 * there without typing a literal amount that would ignore the currency toggle.
 * Labels show the sterling figure purely as a recognisable handle.
 */
export const SELECTABLE_PRICES: { key: PriceKey; label: string }[] = [
  { key: "auditFrom", label: "Data audit (£2,000)" },
  { key: "enablementFrom", label: "Team enablement (£3,500)" },
  { key: "sprint", label: "Diagnostic sprint (£2,500)" },
  { key: "build", label: "Pythia build (£20,000)" },
  { key: "sessionStandard", label: "Praxis session, standard (£200)" },
  { key: "sessionPromo", label: "Praxis session, promo (£100)" },
  { key: "spAuditFrom", label: "SharePoint audit (£500)" },
  { key: "spBuildFrom", label: "SharePoint build (£5,000)" },
  { key: "spRetainerMonthly", label: "SharePoint retainer (£500/mo)" },
  { key: "toolsMonthly", label: "AI subscription (£16/mo)" },
];

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
