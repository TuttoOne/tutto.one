/**
 * Trainer attribution: which trainer, if any, sent this visitor.
 *
 * A trainer links to the site as `?trainer=CODE`. That code decides their share
 * of the tuition — 80% on a client who arrives on their own code, 60% on one
 * Tutto found — so it has to survive the whole way from the link they posted to
 * the enquiry that eventually comes in, which may be days and several pages
 * later. localStorage, like the language and currency preferences, for the same
 * reason: it is the only thing here that outlives a navigation.
 *
 * What this file CANNOT do is attach the code to a booking. Bookings are
 * Cal.com events on an external calendar that this codebase never sees, and
 * there is no purchase record on our side at all. So attribution is captured
 * here, passed to Cal.com as a prefilled booking question, and stored against
 * any enquiry the visitor sends. Matching an enquiry to a later programme sale
 * is still done by email, by hand.
 */
import { useEffect, useState } from "react";

const TRAINER_KEY = "tutto.trainer";
/** The query parameter a trainer puts in their own links. */
const TRAINER_PARAM = "trainer";
/**
 * The Cal.com booking-question slug the code is prefilled into. Cal.com must
 * carry a question with exactly this slug or the prefill is silently dropped.
 */
const CAL_FIELD = "trainerCode";

/**
 * Codes are handed out by us, so this is a shape check rather than a security
 * boundary: it stops a pasted URL fragment or an injection attempt being
 * written to storage and echoed back into a form. An unrecognised code simply
 * makes the client Tutto-sourced, which is the safe default.
 */
function clean(raw: string | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim().toUpperCase();
  return /^[A-Z0-9][A-Z0-9-]{0,31}$/.test(trimmed) ? trimmed : null;
}

function read(): string | null {
  try {
    return clean(localStorage.getItem(TRAINER_KEY));
  } catch {
    return null; // private mode / storage disabled
  }
}

function write(code: string) {
  try {
    localStorage.setItem(TRAINER_KEY, code);
  } catch {
    /* non-fatal: the code still applies for this page view */
  }
}

/**
 * The trainer code in force for this visitor, if any.
 *
 * A code in the URL wins over a stored one and replaces it — a visitor who
 * follows a second trainer's link is that trainer's referral from then on.
 */
export function useTrainerCode(): string | null {
  const [code, setCode] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    const fromUrl = clean(new URLSearchParams(window.location.search).get(TRAINER_PARAM));
    if (fromUrl) {
      write(fromUrl);
      return fromUrl;
    }
    return read();
  });

  // The router swaps pages without reloading, so a code arriving on a later
  // navigation would otherwise be missed.
  useEffect(() => {
    const fromUrl = clean(new URLSearchParams(window.location.search).get(TRAINER_PARAM));
    if (fromUrl && fromUrl !== code) {
      write(fromUrl);
      setCode(fromUrl);
    }
  }, [code]);

  return code;
}

/**
 * A Cal.com booking URL carrying the trainer code, so the booking itself
 * records who sent the client rather than relying on them to mention it.
 */
export function bookingHref(base: string, code: string | null): string {
  if (!code) return base;
  const sep = base.includes("?") ? "&" : "?";
  return `${base}${sep}${CAL_FIELD}=${encodeURIComponent(code)}`;
}
