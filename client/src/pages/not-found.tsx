import { Layout } from "@/components/layout/Layout";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import { copy, useT } from "@/lib/i18n";

export default function NotFound() {
  const t = useT();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-6">404</p>
        <h1 className="text-4xl md:text-5xl font-serif font-bold mb-5">{t(copy.notFound.title)}</h1>
        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          {t(copy.notFound.body)}
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:bg-primary/90 transition-colors"
        >
          {t(copy.nav.home)} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </Layout>
  );
}
