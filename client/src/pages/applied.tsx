import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { AppliedExplainer } from "@/components/product/AppliedExplainer";
import { AnimatedPointer } from "@/components/brand/AnimatedPointer";
import { Link } from "wouter";
import { ArrowDown } from "lucide-react";
import { SITE_TITLE, copy, useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";

/**
 * /applied — the long argument, at length.
 *
 * This was the home page until the broadside at `/` took the front door. It
 * keeps the site's full chrome and the seven-section explainer, and is what
 * "the long version of this argument" points at from the landing page's foot.
 */
export default function Applied() {
  const t = useT();
  const { locale } = usePreferences();

  useEffect(() => {
    document.title =
      locale === "fr"
        ? "L'IA en pratique | Tutto"
        : "Applied AI, at length | Tutto";
    return () => {
      document.title = SITE_TITLE;
    };
  }, [locale]);

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* The portfolio used to sit below this hero, duplicating /portfolio.
            The case for what we do earns the space better; the work is one
            click away from the nav and from section 04 of the explainer. */}
        <div className="text-center mb-20 pt-8">
          <div className="flex justify-center mb-6">
            <AnimatedPointer className="w-28 h-28 md:w-32 md:h-32" />
          </div>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 max-w-3xl mx-auto">
            {t(copy.home.title)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            {t(copy.home.standfirst)}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-book-call-hero"
            >
              {t(copy.common.bookCall)}
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
              data-testid="link-about-hero"
            >
              {t(copy.common.aboutUs)}
            </Link>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <p className="text-xs font-mono uppercase tracking-widest">
                {t(copy.home.scrollHint)}
              </p>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>

        <AppliedExplainer />
      </div>
    </Layout>
  );
}
