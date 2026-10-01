/**
 * Peer groups: the Solo Fast Track taken in a group of four solo people,
 * matched by background.
 *
 * Everything that changes from one round of groups to the next lives here, so
 * a new round is an edit to this file and nothing on the page. The prices are
 * in pricing.ts with every other price (`peerGroupSeat`, `peerGroupDeposit`).
 *
 * The times are fixed up front on purpose. Finding a slot that suits four
 * diaries is the slow part of forming a group, so people choose from the
 * standing slots and we only have to match the people.
 */
import type { Currency, Locale } from "./preferences";

export type PeerSlot = {
  /** Stable id, used as the React key and in the form state. */
  id: string;
  /**
   * First session of the next group in this slot, YYYY-MM-DD. The weekday on
   * the page is read from this date, so the two cannot disagree. Once it has
   * passed the page says the next date is to be confirmed until this is moved.
   */
  starts: string;
  /** 24-hour, in PEER_GROUPS.timezone. */
  from: string;
  to: string;
};

export const PEER_GROUPS = {
  /** Seats in a group. */
  size: 4,
  /** A group starts with this many if the last seat has not filled. */
  minimum: 3,
  /** Weeks we give a group to form before the deposit goes back. */
  formWeeks: 6,
  timezone: { en: "Paris time", fr: "heure de Paris" } as Record<Locale, string>,
  /** The 15-minute call offered once the form is in, beside the deposit. */
  callLink: "https://cal.com/tuttoone/15min",
  slots: [
    { id: "tue-am", starts: "2026-10-13", from: "10:00", to: "11:30" },
    { id: "thu-pm", starts: "2026-10-15", from: "14:30", to: "16:00" },
  ] as PeerSlot[],
};

/**
 * Stripe payment links for a seat, one pair per currency. The page sends the
 * visitor to the deposit link for the currency they have selected once the
 * form is in. The balance link is sent by hand when the group is confirmed.
 * The amounts are set in Stripe, so a change to `peerGroupSeat` or
 * `peerGroupDeposit` in pricing.ts needs new links here.
 */
export const PEER_GROUP_PAYMENT_LINKS: Record<Currency, { deposit: string; balance: string }> = {
  GBP: {
    deposit: "https://buy.stripe.com/3cIcN7bZRfcf7y13NVcQU03",
    balance: "https://buy.stripe.com/bJebJ37JBd479G93NVcQU05",
  },
  EUR: {
    deposit: "https://buy.stripe.com/7sY3cx4xpfcf2dH0BJcQU04",
    balance: "https://buy.stripe.com/eVqaEZ3tle8b3hL1FNcQU06",
  },
  ZAR: {
    deposit: "https://buy.stripe.com/cNiaEZ4xp6FJ7y1acjcQU01",
    balance: "https://buy.stripe.com/dRm14p0h93tx2dHeszcQU07",
  },
};

const intl = (locale: Locale) => (locale === "fr" ? "fr-FR" : "en-GB");
const noon = (iso: string) => new Date(`${iso}T12:00:00`);

/** "Tuesdays" / "Le mardi" */
export function slotDay(slot: PeerSlot, locale: Locale): string {
  const weekday = new Intl.DateTimeFormat(intl(locale), { weekday: "long" }).format(noon(slot.starts));
  return locale === "fr" ? `Le ${weekday}` : `${weekday}s`;
}

/** "10:00 to 11:30" / "10 h 00 à 11 h 30" */
export function slotHours(slot: PeerSlot, locale: Locale): string {
  return locale === "fr"
    ? `${slot.from.replace(":", " h ")} à ${slot.to.replace(":", " h ")}`
    : `${slot.from} to ${slot.to}`;
}

/** "3 November" / "3 novembre", or null once the date has passed. */
export function slotStart(slot: PeerSlot, locale: Locale, today: Date = new Date()): string | null {
  const date = noon(slot.starts);
  if (date < today) return null;
  return new Intl.DateTimeFormat(intl(locale), { day: "numeric", month: "long" }).format(date);
}

/** One line for the enquiry email, always in English. */
export function slotSummary(slot: PeerSlot): string {
  const start = slotStart(slot, "en");
  return `${slotDay(slot, "en")} ${slotHours(slot, "en")}${start ? `, from ${start}` : ""}`;
}
