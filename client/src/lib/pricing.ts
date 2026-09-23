/**
 * Every price on the site, in one table.
 *
 * Four rules keep this honest:
 *
 * 1. EUR is the stated base — those are the figures that were set commercially.
 *    GBP and ZAR are the same price expressed for those markets, at roughly
 *    EUR/1.2 and EUR x 20. They are NOT live FX rates — they are fixed so the
 *    price is stable — but the figures are carried exactly rather than rounded
 *    to a tidier number.
 *
 * 2. Derived figures are COMPUTED, never typed in. Course tuition is eight
 *    sessions; what is left after the intro credit is the course less the intro;
 *    the referral cap is the credit times the number of credits allowed. Typing
 *    those per currency guarantees they eventually contradict the numbers they
 *    are supposed to come from — which is exactly what happened to the referral
 *    card, which was showing 80% of the course instead of half.
 *
 * 3. One thing, one key. The diagnostic on Pythia and the data audit on the
 *    services page are the same engagement, so they share `diagnosticDay`
 *    rather than drifting apart under two names.
 *
 * 4. Our fees are stated EX VAT. The hardware rows are the exception and are
 *    marked as such: they are someone else's retail prices, quoted the way the
 *    client will actually meet them at the till.
 */
import type { Currency, Locale } from "./preferences";

/** Sessions in a full Praxis course. Declared before PRICES, which uses it. */
const COURSE_SESSIONS_N = 8;

/**
 * Sessions in Fast track: the private route through the same work as Praxis,
 * one to one and at the client's pace, in half the sessions.
 */
const FAST_TRACK_SESSIONS_N = 4;

/**
 * Sessions in the in-company Article 4 engagement. Six, not eight: it is a
 * different product from the open programme, sold to a compliance obligation
 * rather than to a curriculum. Named apart from COURSE_SESSIONS_N so the two
 * cannot be confused at the call site.
 */
export const ARTICLE4_SESSIONS = 6;

export type PriceKey =
  // Praxis
  | "sessionStandard"
  | "sessionPromo"
  | "praxisIntro"
  | "fastTrack"
  | "teamRegular"
  | "fastTrackRegular"
  | "referralCredit"
  | "discoverySession"
  | "toolsMonthly"
  | "eveningClass"
  | "eveningSeries"
  | "praxisCohort"
  // Engagements
  | "diagnosticDay"
  | "sprint"
  | "sovereigntyDiagnostic"
  | "scriptBuildFrom"
  | "agentBuildFrom"
  | "agentMonthly"
  | "build"
  | "ongoingMinMonthly"
  | "enablementFrom"
  // Hardware, bought by the client
  | "hwMacMini"
  | "hwDgxSpark"
  | "hwMacStudio"
  // SharePoint
  | "spAuditFrom"
  | "spBuildFrom"
  | "spRetainerMonthly";

/**
 * Praxis in rand: the file's EUR x 20, then 25% off for South African
 * purchasing power, rounded to the nearest R50. Only the Praxis offers use it;
 * the engagements and hardware keep plain EUR x 20.
 */
function zarPraxis(eur: number): number {
  return Math.round((eur * 20 * 0.75) / 50) * 50;
}

/**
 * The session rate, for 90 minutes with a group of one to four. Course tuition
 * and team enablement are both eight of these, and Fast track is four.
 */
const SESSION = { GBP: 200, EUR: 250, ZAR: zarPraxis(250) };

/**
 * QuickStart: the paid 90-minute session. NOT shown on the site, on purpose:
 * a stranger books the free 15-minute call first, and the Cal.com link for
 * this (cal.com/tuttoone/90-min-meeting) is sent by hand after it. Kept here
 * so the figure has one home, and out of SELECTABLE_PRICES so the admin editor
 * cannot put it back on a page.
 *
 * It is the same figure as HOUR rather than a coincidence: the way in is sold
 * at the build rate, not above it. Stated EX VAT, like every fee here.
 */
const DISCOVERY = { GBP: 83, EUR: 100, ZAR: 2000 };

/** Build rate per hour. The scripting engagement is a multiple of this. */
const HOUR = { GBP: 83, EUR: 100, ZAR: 2000 };

/** One Applied AI Evening — a single online class. The pass is a multiple of this. */
const EVENING = { GBP: 40, EUR: 50, ZAR: 1000 };
/**
 * Paid classes in one month of the online course. The free session on the
 * first Tuesday is not one of them, so a month is three paid plus one free.
 */
export const EVENING_CLASSES = 3;
/**
 * Classes actually charged for in the pass: three run, two are paid for. The
 * pass price is computed from this so "three for the price of two" stays true
 * in every currency instead of being typed in three times and drifting.
 *
 * It has to stay below EVENING_CLASSES or the pass costs more than buying the
 * classes one at a time, which is what happened when the course was cut from
 * five to three and this was left at four.
 */
const EVENING_CLASSES_PAID = 2;
/**
 * Hours in the smallest scripting engagement we will take.
 *
 * This is the lever that sets the floor price, and it is set so that floor is
 * the same €3,000 the landing page quotes for an agent build — the two are the
 * same offer described to two different readers, and a visitor who compares
 * them should not find two numbers.
 *
 * It moved from 40 to 30 to bring those into line. The alternative was to drop
 * HOUR from €100 to €75 and keep 40 hours; scope was the honest lever, because
 * the rate is what was set commercially and the hours are what a "from" price
 * is a minimum of.
 */
export const SCRIPT_BUILD_HOURS = 30;

/**
 * The diagnostic, per day. One to two days for a simple project, up to two
 * weeks for something the size of a whole set of chambers.
 *
 * It replaced a flat two-week sprint at €2,400, which priced every diagnostic
 * as if it were the largest one and so overcharged the small jobs the site is
 * mostly asked for.
 */
const DIAGNOSTIC_DAY = { GBP: 500, EUR: 600, ZAR: 12000 };

/** Base rates. Everything else on the site is derived from these. */
export const PRICES: Record<PriceKey, Record<Currency, number>> = {
  /**
   * QuickStart, 90 minutes: discovery, preliminary setup and training, and the
   * policy and agent scorecard. Sold privately after a call — see DISCOVERY.
   */
  discoverySession: DISCOVERY,
  /** One Praxis session, 90 minutes. Course tuition is eight of these. */
  sessionStandard: SESSION,
  /** Fast track: four private sessions, computed from the session rate. */
  fastTrack: {
    GBP: SESSION.GBP * FAST_TRACK_SESSIONS_N,
    EUR: SESSION.EUR * FAST_TRACK_SESSIONS_N,
    ZAR: SESSION.ZAR * FAST_TRACK_SESSIONS_N,
  },
  /**
   * The regular prices of the two named Praxis offers — The AI-Fluent Team
   * (eight sessions, the course) and The Owner's Fast Track. Set commercially
   * from the offer stack, not derived: the session rate stays where it is
   * because the trainer split is computed from it.
   *
   * Shown struck through while the back-to-work special runs (see
   * SPECIAL_ENDS); the special IS the computed course and fastTrack figures.
   * When the special ends these become the only price on the page.
   *
   * ZAR is the Praxis rand rule (see zarPraxis), 25% under EUR x 20.
   */
  teamRegular: { GBP: 3900, EUR: 4500, ZAR: zarPraxis(4500) },
  fastTrackRegular: { GBP: 1700, EUR: 2000, ZAR: zarPraxis(2000) },
  /**
   * The Praxis intro session: two hours, credited in full against the
   * programme if the client goes on.
   *
   * No longer shown anywhere: QuickStart replaced it as the way in. Kept
   * defined, and out of SELECTABLE_PRICES, so stored admin content that still
   * references it resolves rather than throwing.
   *
   * The same figure as SESSION today, and its own key rather than an alias so
   * the credit can be repriced without dragging the hourly rate with it. The
   * remainder after the credit is computed, never typed — see praxisEconomics.
   */
  praxisIntro: SESSION,
  /**
   * Credit taken off a client's own programme for each person they refer who
   * enrols, up to REFERRAL_CREDITS_MAX of them.
   *
   * It replaced a scheme that halved the fee on one referral and refunded it
   * entirely on two, which made the second referral worth four times the
   * eighth and cost a full course to honour.
   */
  referralCredit: SESSION,
  /**
   * Promotional session rate — half the standard rate.
   *
   * No longer shown anywhere. Praxis is quoted as a total after discovery, so
   * the page that used to carry this now says so instead of naming a figure.
   * Kept defined, and out of SELECTABLE_PRICES, so stored admin content that
   * still references it resolves rather than throwing — but nothing new can
   * put a per-session price back on a client-facing page.
   */
  sessionPromo: { GBP: 100, EUR: 125, ZAR: 2500 },
  /** Third-party AI subscription, approx. Quoted at ~$20/mo at source. */
  toolsMonthly: { GBP: 16, EUR: 19, ZAR: 400 },
  /** One Applied AI Evening, online. The first class of the run is free. */
  eveningClass: EVENING,
  /** The whole course, computed so it cannot contradict the class rate. */
  eveningSeries: {
    GBP: EVENING.GBP * EVENING_CLASSES_PAID,
    EUR: EVENING.EUR * EVENING_CLASSES_PAID,
    ZAR: EVENING.ZAR * EVENING_CLASSES_PAID,
  },
  /**
   * The six-session in-company Article 4 engagement, for one cohort on the
   * client's own site.
   *
   * Deliberately NOT derived from the session rate. `sessionStandard` prices 90
   * minutes with one to four people; this prices six days inside a company, the travel,
   * the sector re-skin and the compliance documentation that comes out at the
   * end. Deriving it would make the two move together, and they should not.
   */
  praxisCohort: { GBP: 5000, EUR: 6000, ZAR: 120000 },

  /**
   * The diagnostic, charged per day. Pythia, the sovereign page, Praxis and the
   * services page all quote the same engagement, so they quote the same key.
   */
  diagnosticDay: DIAGNOSTIC_DAY,
  /**
   * Deprecated alias for `diagnosticDay`, kept alive on purpose.
   *
   * Services content can be overridden from the `site_content` table with a
   * stored `priceKey`, so a row saved before the day rate existed will still
   * ask for "sprint". Deleting the key would make `PRICES[key][currency]` throw
   * on a page the admin cannot then get back into to fix it. Pointing it at the
   * day rate means old stored content renders the current price rather than the
   * withdrawn €2,400 flat fee. Out of SELECTABLE_PRICES, so nothing new can
   * choose it.
   */
  sprint: DIAGNOSTIC_DAY,
  /**
   * Sovereignty diagnostic — the only thing for sale on /souverainete while the
   * full agent offer is held back. Credited in full against any build that
   * follows, which is why it is a separate key from `diagnosticDay`: it is a
   * fixed-scope engagement rather than a day rate.
   */
  sovereigntyDiagnostic: { GBP: 1250, EUR: 1500, ZAR: 30000 },
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
   * The same engagement as `scriptBuildFrom`, priced for the shop window.
   *
   * The landing page is where a stranger meets a number first, and
   * HOUR.GBP x 30 lands on £2,490 — an arithmetic result, not a price anybody
   * would set. Typed rather than derived for that reason alone; the EUR figure
   * is identical to scriptBuildFrom's and must stay that way, because the two
   * describe one offer to two readers.
   */
  agentBuildFrom: { GBP: 2500, EUR: 3000, ZAR: 60000 },
  /** Keeping a delivered agent running, monthly, from. */
  agentMonthly: { GBP: 170, EUR: 200, ZAR: 4000 },
  /**
   * Pythia build. Excludes hardware.
   *
   * An estimate drawn from builds already delivered, not a quote — which is
   * what the copy under it now says, and why the figure is a round number
   * rather than the exact converted 9,850 it used to carry. GBP and ZAR follow
   * the file's fixed EUR/1.2 and EUR x 20.
   */
  build: { GBP: 5833, EUR: 7000, ZAR: 140000 },
  /**
   * Floor under the ongoing support fee, monthly.
   *
   * £170 rather than the £167 the EUR/1.2 rule gives. This is the smallest
   * invoice a client will ever see from us and it repeats every month, so a
   * number that reads as a decision beats one that reads as a conversion.
   */
  ongoingMinMonthly: { GBP: 170, EUR: 200, ZAR: 4000 },
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

  /**
   * Hardware the client buys and we specify. Three rows that deliberately break
   * two of this file's rules, because they are not our prices.
   *
   * EUR/1.2 does not apply: these are vendor list prices in each market, taken
   * from Apple and NVIDIA directly, and Apple's UK figure is not Apple's euro
   * figure divided by anything. ZAR is the only derived column, at EUR x 20,
   * because neither vendor lists a rand price we could carry.
   *
   * They are also the only rows quoted INCLUDING VAT, since that is how a
   * retail box is sold and what the client will actually pay. The copy around
   * them says so, and says the figures are indicative and dated.
   *
   * Checked 16 September 2026. Re-check before publishing: hardware moved
   * sharply in 2026 and the DGX Spark alone rose 18% in February.
   */
  hwMacMini: { GBP: 1700, EUR: 2000, ZAR: 40000 },
  hwDgxSpark: { GBP: 5000, EUR: 4800, ZAR: 96000 },
  hwMacStudio: { GBP: 2500, EUR: 3000, ZAR: 60000 },

  /** SharePoint audit, from. */
  spAuditFrom: { GBP: 500, EUR: 600, ZAR: 12000 },
  /** SharePoint build, from. */
  spBuildFrom: { GBP: 5000, EUR: 6000, ZAR: 120000 },
  /** SharePoint support retainer, monthly, from. */
  spRetainerMonthly: { GBP: 500, EUR: 600, ZAR: 12000 },
};

/**
 * Share of tuition kept by the trainer, which now depends on who found the
 * client rather than being one number.
 *
 * A client is trainer-sourced only if their booking carries that trainer's
 * code; everything else is Tutto-sourced. The gap between the two is the whole
 * incentive — a trainer who brings their own work keeps a fifth more of it.
 */
export const TRAINER_SHARE_SOURCED = 0.8;
export const TRAINER_SHARE_TUTTO = 0.6;
/** Sessions in a full Praxis course. Course tuition is this times the rate. */
export const COURSE_SESSIONS = COURSE_SESSIONS_N;
/** Sessions in Fast track. Its price is this times the rate. */
export const FAST_TRACK_SESSIONS = FAST_TRACK_SESSIONS_N;
/** Sessions in the train-the-trainer track, charged at the standard rate. */
export const TRAINER_TRACK_SESSIONS = 4;
/** Students used in the worked annual example on the trainer page. */
export const EXAMPLE_STUDENTS = 24;
/**
 * Referral credits one client can stack. Four at the session rate is a full
 * course fee off, which is the cap the copy quotes.
 */
export const REFERRAL_CREDITS_MAX = 4;

/**
 * Ongoing support for a Pythia build, as a share of build cost per year.
 * A range rather than a figure: it is agreed during the project, and floored
 * by `ongoingMinMonthly` so a small build still covers the work.
 */
export const ONGOING_MIN_PCT = 10;
export const ONGOING_MAX_PCT = 20;

/** Price keys offered in the admin content editor. */
export const SELECTABLE_PRICES: { key: PriceKey; label: string }[] = [
  { key: "diagnosticDay", label: "Diagnostic / data audit, per day (€600)" },
  { key: "praxisCohort", label: "Praxis in-company, 6 sessions (€6,000)" },
  { key: "sovereigntyDiagnostic", label: "Sovereignty diagnostic (€1,500)" },
  { key: "agentBuildFrom", label: "Agent build, from (€3,000)" },
  { key: "scriptBuildFrom", label: "Scripting build, 30h (€3,000)" },
  { key: "enablementFrom", label: "AI-Fluent Team, special (€2,000)" },
  { key: "build", label: "Pythia build, excl. hardware (€7,000)" },
  { key: "sessionStandard", label: "Praxis session, 90 min (€250)" },
  { key: "fastTrack", label: "Owner's Fast Track, special (€1,000)" },
  { key: "teamRegular", label: "AI-Fluent Team, regular (€4,500)" },
  { key: "fastTrackRegular", label: "Owner's Fast Track, regular (€2,000)" },
  { key: "spAuditFrom", label: "SharePoint audit (€600)" },
  { key: "spBuildFrom", label: "SharePoint build (€6,000)" },
  { key: "spRetainerMonthly", label: "SharePoint retainer (€600/mo)" },
  { key: "toolsMonthly", label: "AI subscription (€19/mo)" },
];

const SYMBOLS: Record<Currency, string> = { GBP: "£", EUR: "€", ZAR: "R" };

/**
 * Format an amount as a rate-card price: symbol, grouped thousands, no
 * decimals. Intl handles grouping so French renders 7 000, not 7,000.
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
 * A rate, with its unit attached.
 *
 * The diagnostic is sold by the day and support by the month, and both read as
 * a total the moment the unit falls off — "€600" for a diagnostic is a very
 * different promise from "€600 per day". Keeping the suffix here means it
 * cannot be forgotten at one of the four call sites.
 */
export function perDay(key: PriceKey, currency: Currency, locale: Locale): string {
  return `${price(key, currency, locale)}${locale === "fr" ? " par jour" : " per day"}`;
}

export function perMonth(key: PriceKey, currency: Currency, locale: Locale): string {
  return `${price(key, currency, locale)}${locale === "fr" ? "/mois" : "/month"}`;
}

/**
 * The back-to-work special: the two Praxis offers at today's computed prices,
 * with the regular price struck through beside them. The last day it applies,
 * inclusive. A real date, because urgency that is not true is the part of the
 * playbook that reads as an infomercial — when it passes, `specialActive`
 * turns false and every page drops the strikethrough on its own.
 */
export const SPECIAL_ENDS = "2026-11-30";

export function specialActive(today: Date = new Date()): boolean {
  return today <= new Date(`${SPECIAL_ENDS}T23:59:59`);
}

/** The special's last day, written the way each language says a date. */
export function specialEndsLabel(locale: Locale): string {
  return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    day: "numeric",
    month: "long",
  }).format(new Date(`${SPECIAL_ENDS}T12:00:00`));
}

/**
 * The AI-Fluent Team stack: what the buyer gets, with a stated value for each.
 * EUR is set; GBP follows the file's EUR/1.2 and ZAR the Praxis rand rule, and the total
 * is summed, never typed, so it cannot disagree with its rows.
 *
 * `bonus` rows are the ones that answer a named objection rather than deliver
 * the core outcome; the page lists them after the core so the stack grows in
 * front of the reader.
 */
export type StackKey =
  | "charter"
  | "scorecard"
  | "handoverList"
  | "briefingLibrary"
  | "verification"
  | "sessions"
  | "fieldGuide"
  | "asyncReview"
  | "checkIn";

export const PRAXIS_STACK: { key: StackKey; eur: number; bonus: boolean }[] = [
  { key: "charter", eur: 1400, bonus: false },
  { key: "scorecard", eur: 1400, bonus: false },
  { key: "handoverList", eur: 1000, bonus: false },
  { key: "briefingLibrary", eur: 2300, bonus: false },
  { key: "verification", eur: 900, bonus: false },
  { key: "sessions", eur: 3700, bonus: false },
  { key: "fieldGuide", eur: 200, bonus: true },
  { key: "asyncReview", eur: 700, bonus: true },
  { key: "checkIn", eur: 400, bonus: true },
];

function fromEur(eur: number, currency: Currency): number {
  if (currency === "GBP") return Math.round(eur / 1.2);
  if (currency === "ZAR") return zarPraxis(eur);
  return eur;
}

/** One stack row's stated value, formatted. */
export function stackValue(key: StackKey, currency: Currency, locale: Locale): string {
  const row = PRAXIS_STACK.find((r) => r.key === key)!;
  return formatMoney(fromEur(row.eur, currency), currency, locale);
}

/**
 * The training ladder and the referral credit, all derived from the session
 * rate so no two of them can contradict each other.
 */
export function praxisEconomics(currency: Currency, locale: Locale) {
  const session = amount("sessionStandard", currency);
  const credit = amount("referralCredit", currency);
  const course = session * COURSE_SESSIONS;
  const f = (n: number) => formatMoney(n, currency, locale);
  const stackTotal = PRAXIS_STACK.reduce((sum, r) => sum + fromEur(r.eur, currency), 0);
  return {
    session: f(session),
    /** All eight sessions: The AI-Fluent Team at the special price. */
    course: f(course),
    /** Four private sessions: The Owner's Fast Track at the special price. */
    fastTrack: f(session * FAST_TRACK_SESSIONS_N),
    /** Regular prices, struck through while the special runs. */
    teamRegular: f(amount("teamRegular", currency)),
    fastTrackRegular: f(amount("fastTrackRegular", currency)),
    /** Sum of the stated values in PRAXIS_STACK. */
    stackTotal: f(stackTotal),
    specialActive: specialActive(),
    specialEnds: specialEndsLabel(locale),
    /** Taken off the client's own fee per referred enrolment. */
    referralCredit: f(credit),
    /** The ceiling on stacked credits. */
    referralCap: f(credit * REFERRAL_CREDITS_MAX),
    referralsForCap: REFERRAL_CREDITS_MAX,
  };
}

/**
 * The trainer revenue split, derived from the session and course rates so the
 * two halves always add back up to the whole in every currency — and now
 * computed twice, once per sourcing rate.
 */
export function trainerEconomics(currency: Currency, locale: Locale) {
  const session = amount("sessionStandard", currency);
  const intro = amount("praxisIntro", currency);
  const course = session * COURSE_SESSIONS;
  const track = session * TRAINER_TRACK_SESSIONS;
  const yearTuition = course * EXAMPLE_STUDENTS;
  const f = (n: number) => formatMoney(n, currency, locale);

  return {
    sessionStandard: f(session),
    intro: f(intro),
    courseTuition: f(course),
    courseAfterIntro: f(course - intro),
    yearTuition: f(yearTuition),

    /** Clients the trainer brings in themselves, carrying their own code. */
    sessionYouSourced: f(session * TRAINER_SHARE_SOURCED),
    sessionMineSourced: f(session * (1 - TRAINER_SHARE_SOURCED)),
    courseYouSourced: f(course * TRAINER_SHARE_SOURCED),
    courseMineSourced: f(course * (1 - TRAINER_SHARE_SOURCED)),
    yearYouSourced: f(yearTuition * TRAINER_SHARE_SOURCED),
    yearMineSourced: f(yearTuition * (1 - TRAINER_SHARE_SOURCED)),

    /** Clients Tutto found and placed with the trainer. */
    sessionYouTutto: f(session * TRAINER_SHARE_TUTTO),
    sessionMineTutto: f(session * (1 - TRAINER_SHARE_TUTTO)),
    courseYouTutto: f(course * TRAINER_SHARE_TUTTO),
    courseMineTutto: f(course * (1 - TRAINER_SHARE_TUTTO)),
    yearYouTutto: f(yearTuition * TRAINER_SHARE_TUTTO),
    yearMineTutto: f(yearTuition * (1 - TRAINER_SHARE_TUTTO)),

    /** Percentages, for copy that names the split rather than the money. */
    pctYouSourced: Math.round(TRAINER_SHARE_SOURCED * 100),
    pctMineSourced: Math.round((1 - TRAINER_SHARE_SOURCED) * 100),
    pctYouTutto: Math.round(TRAINER_SHARE_TUTTO * 100),
    pctMineTutto: Math.round((1 - TRAINER_SHARE_TUTTO) * 100),

    trainerTrack: f(track),
    /** Praxis course plus the trainer track. */
    trainerTotal: f(course + track),
  };
}
