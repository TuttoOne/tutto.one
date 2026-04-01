import { Layout } from "@/components/layout/Layout";
import { PortfolioDisplay } from "@/components/portfolio/PortfolioDisplay";
import { Link } from "wouter";
import { ArrowDown } from "lucide-react";

export default function Home() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-20 pt-8">
          <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">
            AI Consulting
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6 max-w-3xl mx-auto">
            Helping businesses become machine-readable in an AI-first economy.
          </h1>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            We build the systems, bridges, and infrastructure that let AI work inside your organisation — not just beside it.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://cal.com/tuttoone/15min"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
              data-testid="link-book-call-hero"
            >
              Book a 30-minute call
            </a>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-8 py-3 border border-border rounded-full font-medium text-foreground hover:bg-muted/50 transition-colors"
              data-testid="link-about-hero"
            >
              About us
            </Link>
          </div>
          <div className="mt-16 flex justify-center">
            <div className="flex flex-col items-center gap-2 text-muted-foreground/50">
              <p className="text-xs font-mono uppercase tracking-widest">Our work</p>
              <ArrowDown className="w-4 h-4 animate-bounce" />
            </div>
          </div>
        </div>

        <PortfolioDisplay />
      </div>
    </Layout>
  );
}
