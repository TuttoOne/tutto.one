/**
 * Per-page French lookup, keyed on the English string.
 *
 * The long-form pages (Praxis Programme, SharePoint, Become a Trainer, Second
 * Brain, GTM Orchestrator, LegalRAG) carry their copy inline across hundreds of
 * lines of styled markup. Restructuring them into the `copy` object would mean
 * rewriting each page wholesale; keying on the English sentence instead lets the
 * markup stay exactly as it is.
 *
 * Anything missing from a dictionary falls back to the English, so a new
 * sentence appears in both languages rather than rendering blank.
 */
import { usePreferences } from "./preferences";

export type FrDict = Record<string, string>;

/** `const tr = usePageTr(FR); ... tr("Some English sentence")` */
export function usePageTr(dict: FrDict) {
  const { locale } = usePreferences();
  return (en: string): string => (locale === "fr" ? (dict[en] ?? en) : en);
}
