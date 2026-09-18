/**
 * The language and currency switches that sit in the header.
 *
 * Segmented controls rather than dropdowns: three options at most, and the
 * current choice should be readable without opening anything.
 */
import { cn } from "@/lib/utils";
import {
  usePreferences,
  LOCALES,
  CURRENCIES,
  type Locale,
  type Currency,
} from "@/lib/preferences";

function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: { value: T; label: string; title?: string }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
  className?: string;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-background/60 p-0.5",
        className,
      )}
    >
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(o.value)}
            aria-pressed={active}
            title={o.title}
            data-testid={`toggle-${label.toLowerCase()}-${o.value}`}
            className={cn(
              "px-2 py-0.5 text-[11px] font-medium rounded-full transition-colors cursor-pointer",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}

export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale } = usePreferences();
  return (
    <Segmented<Locale>
      label="Language"
      className={className}
      value={locale}
      onChange={setLocale}
      options={LOCALES.map((l) => ({ value: l.value, label: l.label, title: l.long }))}
    />
  );
}

export function CurrencyToggle({ className }: { className?: string }) {
  const { currency, setCurrency } = usePreferences();
  return (
    <Segmented<Currency>
      label="Currency"
      className={className}
      value={currency}
      onChange={setCurrency}
      options={CURRENCIES.map((c) => ({
        value: c.value,
        label: c.symbol,
        title: c.label,
      }))}
    />
  );
}
