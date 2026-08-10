/**
 * Price points per currency.
 *
 * These are deliberately NOT live FX conversions. Converting £100 at spot gives
 * €118.37, which reads as an accident rather than a price. Each currency gets
 * its own round figure, the way it would appear on a rate card.
 *
 * ---------------------------------------------------------------------------
 * THE GBP COLUMN IS THE ONLY ONE TAKEN FROM PUBLISHED COPY. The EUR and ZAR
 * figures are indicative, set at roughly 1.17x and 23.5x sterling and rounded.
 * They are a commercial decision, not a calculation — review before relying on
 * them. Change a number here and it changes everywhere it is shown.
 * ---------------------------------------------------------------------------
 */
import type { Currency, Locale } from "./preferences";

export type PriceKey =
  | "session"
  | "sessionWas"
  | "sprint"
  | "build"
  | "toolsMonthly";

export const PRICES: Record<PriceKey, Record<Currency, number>> = {
  /** One-hour Praxis session, current promotional rate. */
  session: { GBP: 100, EUR: 120, ZAR: 2400 },
  /** Its usual rate, shown struck through. */
  sessionWas: { GBP: 200, EUR: 240, ZAR: 4800 },
  /** Two-week diagnostic sprint (Praxis and Pythia both quote this). */
  sprint: { GBP: 2500, EUR: 2900, ZAR: 58000 },
  /** Pythia build, from. */
  build: { GBP: 20000, EUR: 23500, ZAR: 470000 },
  /** Third-party AI subscription, approx. Quoted at ~$20/mo at source. */
  toolsMonthly: { GBP: 16, EUR: 19, ZAR: 380 },
};

const SYMBOLS: Record<Currency, string> = { GBP: "£", EUR: "€", ZAR: "R" };

/**
 * Format an amount as a rate-card price: symbol, grouped thousands, no decimals.
 * Intl is used for grouping so French renders 23 500 rather than 23,500.
 */
export function formatMoney(amount: number, currency: Currency, locale: Locale): string {
  const grouped = new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    maximumFractionDigits: 0,
  }).format(amount);
  return `${SYMBOLS[currency]}${grouped}`;
}

/** Look up a published price and format it for the active currency. */
export function price(key: PriceKey, currency: Currency, locale: Locale): string {
  return formatMoney(PRICES[key][currency], currency, locale);
}
