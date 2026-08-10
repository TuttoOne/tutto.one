/**
 * Links from the portfolio through to the full write-ups.
 *
 * These pages exist and are worth reading, but putting each one in the top
 * navigation would push it to eleven items. They belong here instead: you meet
 * the work in summary, then follow a link to go deeper.
 */
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { copy, useT } from "@/lib/i18n";

export function GoDeeper() {
  const t = useT();

  const items = [
    { href: "/legalrag", name: "LegalRAG", blurb: t(copy.portfolio.legalragBlurb) },
    { href: "/gtm-orchestrator", name: "GTM", blurb: t(copy.portfolio.gtmBlurb) },
    { href: "/sharepoint", name: "SharePoint Bridge", blurb: t(copy.portfolio.sharepointBlurb) },
  ];

  return (
    <section className="mt-16 pt-10 border-t border-border">
      <h2 className="text-2xl font-serif font-bold tracking-tight mb-2">
        {t(copy.portfolio.deeperTitle)}
      </h2>
      <p className="text-muted-foreground mb-8 max-w-xl">{t(copy.portfolio.deeperBody)}</p>

      <div className="grid gap-4 sm:gap-5 md:grid-cols-3">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="text-lg font-serif font-bold group-hover:text-primary transition-colors">
                {item.name}
              </h3>
              <ArrowRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary transition-colors shrink-0 mt-1.5" />
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.blurb}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
