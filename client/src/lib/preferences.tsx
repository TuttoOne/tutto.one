/**
 * Site-wide viewer preferences: language and currency.
 *
 * Both are header toggles that must survive navigation and reloads, so they
 * live in one context backed by localStorage rather than in page state.
 */
import { createContext, useContext, useEffect, useState } from "react";

export type Locale = "en" | "fr";
export type Currency = "GBP" | "EUR" | "ZAR";

export const LOCALES: { value: Locale; label: string; long: string }[] = [
  { value: "en", label: "EN", long: "English" },
  { value: "fr", label: "FR", long: "Français" },
];

export const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "EUR", label: "EUR", symbol: "€" },
  { value: "GBP", label: "GBP", symbol: "£" },
  { value: "ZAR", label: "ZAR", symbol: "R" },
];

const LOCALE_KEY = "tutto.locale";
const CURRENCY_KEY = "tutto.currency";

type PreferencesValue = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

function readStored<T extends string>(key: string, allowed: readonly T[]): T | null {
  try {
    const v = localStorage.getItem(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : null;
  } catch {
    return null; // private mode / storage disabled
  }
}

/** First visit: follow the browser, so a French visitor lands in French. */
function detectLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  return navigator.languages?.some((l) => l.toLowerCase().startsWith("fr")) ? "fr" : "en";
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    () => readStored<Locale>(LOCALE_KEY, ["en", "fr"]) ?? detectLocale(),
  );
  // EUR is the default: it is the currency the rate card is set in, and the
  // market the site is being pointed at. A returning visitor's own choice still
  // wins, since that is read first.
  const [currency, setCurrencyState] = useState<Currency>(
    () => readStored<Currency>(CURRENCY_KEY, ["GBP", "EUR", "ZAR"]) ?? "EUR",
  );

  // Keep <html lang> honest — it drives screen-reader pronunciation and hyphenation.
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const setLocale = (l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(LOCALE_KEY, l);
    } catch {
      /* non-fatal */
    }
  };

  const setCurrency = (c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_KEY, c);
    } catch {
      /* non-fatal */
    }
  };

  return (
    <PreferencesContext.Provider value={{ locale, setLocale, currency, setCurrency }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error("usePreferences must be used inside <PreferencesProvider>");
  return ctx;
}
