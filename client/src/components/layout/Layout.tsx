import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PointerMark } from "@/components/brand/PointerMark";
import { LanguageToggle, CurrencyToggle } from "@/components/layout/PreferenceToggles";
import { copy, useT } from "@/lib/i18n";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useT();

  /* `external` marks a page that is served as static files from public/ rather
     than by the router. Those need a real anchor: a wouter Link would try to
     handle /usecase/ in the client and land on the 404 route. */
  const navItems = [
    { label: t(copy.nav.about), href: "/about" },
    { label: t(copy.nav.services), href: "/services" },
    { label: t(copy.nav.work), href: "/portfolio" },
    {
      label: t({ en: "Use cases", fr: "Cas d'usage" }),
      href: "/usecase/",
      external: true,
    },
    { label: t(copy.nav.praxis), href: "/praxis" },
    { label: t(copy.nav.pythia), href: "/pythia" },
    { label: t(copy.nav.thinking), href: "/blog" },
    { label: t(copy.nav.events), href: "/calendar" },
    { label: t(copy.nav.contact), href: "/contact" },
  ];

  /* The header is opaque rather than translucent-and-blurred. A backdrop-filter
     over a scrolling page is re-rasterised every frame, which is what made the
     scroll feel unsteady; against a background this close to white the blur was
     buying almost nothing to look at. Same for the mobile panel below. */
  return (
    <header className="fixed top-0 w-full z-50 bg-background border-b border-border/40">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
        <Link
          href="/"
          aria-label={t(copy.nav.home)}
          className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity shrink-0"
        >
          <PointerMark className="h-6 w-auto text-primary shrink-0" />
          <span className="font-serif font-semibold text-lg tracking-tight">
            Tutto<span className="text-primary">.</span>
          </span>
        </Link>

        {/* Breakpoints are set by the French labels, which run about 40% longer
            than the English: nine items plus the toggles only fit from xl, and
            the full row only fits from lg. Below that everything lives in the
            menu. Sizing this off the English overflowed /fr at 768 and 1024. */}
        <nav className="hidden lg:flex gap-3 xl:gap-5">
          {navItems.map((item) => {
            const className = cn(
              "text-sm font-medium transition-colors hover:text-primary cursor-pointer whitespace-nowrap",
              location === item.href ? "text-primary" : "text-muted-foreground",
            );
            return item.external ? (
              <a key={item.href} href={item.href} className={className}>
                {item.label}
              </a>
            ) : (
              <Link key={item.href} href={item.href} className={className}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Toggles need room; below xl they move into the menu. */}
        <div className="hidden xl:flex items-center gap-2 shrink-0">
          <LanguageToggle />
          <CurrencyToggle />
        </div>

        <button
          className="xl:hidden p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
          aria-label={t(copy.nav.menu)}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="xl:hidden border-t border-border/40 bg-background">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex flex-col gap-1 lg:hidden">
            {navItems.map((item) => {
              const className = cn(
                "text-sm font-medium py-3 px-3 rounded-lg transition-colors",
                location === item.href
                  ? "text-primary bg-primary/5"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              );
              return item.external ? (
                <a key={item.href} href={item.href} className={className}>
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={className}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="max-w-6xl mx-auto px-6 pb-5 pt-1 flex flex-wrap items-center gap-3">
            <LanguageToggle />
            <CurrencyToggle />
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const t = useT();
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/40 bg-background">
      {/* The disclosure sits on its own line above the legal row rather than
          beside it: at the width the copyright leaves it would wrap to three
          ragged lines on a laptop. Smaller and lighter than the row below,
          because it is a note about the site rather than part of its business. */}
      <div className="max-w-6xl mx-auto px-6 mb-5">
        <p className="text-xs text-muted-foreground/70 leading-relaxed max-w-2xl">
          {t(copy.footer.builtWith)}
        </p>
      </div>
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>
          © {new Date().getFullYear()} Tutto.{" "}
          {t({ en: "All rights reserved.", fr: "Tous droits réservés." })}
        </p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">
            {t({ en: "Privacy", fr: "Confidentialité" })}
          </a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      <Header />
      <main className={cn("flex-1 pt-16", className)}>{children}</main>
      <Footer />
    </div>
  );
}
