import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { PointerMark } from "@/components/brand/PointerMark";

export function Header() {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Work", href: "/portfolio" },
    { label: "Praxis", href: "/praxis" },
    { label: "Pythia", href: "/pythia" },
    { label: "Thinking", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-border/40">
      <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          aria-label="Tutto — home"
          className="group flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <PointerMark className="h-6 w-auto text-primary shrink-0" />
          <span className="font-serif font-semibold text-lg tracking-tight">
            Tutto<span className="text-primary">.</span>
          </span>
        </Link>

        <nav className="hidden md:flex gap-5 lg:gap-7">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary cursor-pointer",
                location === item.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 -mr-2 text-foreground/70 hover:text-foreground transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          data-testid="button-mobile-menu"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-md">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "text-sm font-medium py-3 px-3 rounded-lg transition-colors",
                  location === item.href
                    ? "text-primary bg-primary/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="w-full py-8 mt-auto border-t border-border/40 bg-background">
      <div className="max-w-5xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Tutto. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
        </div>
      </div>
    </footer>
  );
}

export function Layout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-foreground selection:bg-primary/20">
      <Header />
      <main className={cn("flex-1 pt-16", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
