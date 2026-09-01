import { Layout } from "@/components/layout/Layout";
import { AppliedExplainer } from "@/components/product/AppliedExplainer";
import { AnimatedPointer } from "@/components/brand/AnimatedPointer";
import { Link } from "wouter";
import { ArrowDown } from "lucide-react";
import { copy, useT } from "@/lib/i18n";
import { usePreferences } from "@/lib/preferences";
import { Plate } from "@/components/product/ProductPage";

export default function Home() {
  const t = useT();
  const { locale } = usePreferences();

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

        {/* The plate sits between the hero and the explainer: it is what the
            scroll hint above points at, and it states the whole argument in one
            picture before the explainer takes it apart. Drawn per language,
            because the lettering is inside the drawing.

            This is the final crop rather than the full plate: no headline, and
            tighter around the basket. The hero directly above has already made
            that claim in larger type, and the drawing repeating it in hand
            lettering read as the page saying the same thing twice. */}
        <div className="mb-20">
          <Plate
            src={`/artwork/skills-final-${locale === "fr" ? "fr" : "en"}.webp`}
            width={1672}
            height={761}
            alt={t(copy.plates.skills)}
            caption={t(copy.home.plateSkillsCaption)}
          />
        </div>

        <AppliedExplainer />
      </div>
    </Layout>
  );
}
