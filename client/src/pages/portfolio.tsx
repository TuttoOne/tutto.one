import { Layout } from "@/components/layout/Layout";
import { PortfolioDisplay, type PortfolioTextOverride } from "@/components/portfolio/PortfolioDisplay";
import { useQuery } from "@tanstack/react-query";
import { copy, useT } from "@/lib/i18n";

export default function Portfolio() {
  const t = useT();
  const { data: portfolioContent } = useQuery<{ value: string }>({
    queryKey: ["/api/site-content/portfolio"],
    retry: false,
  });

  const overrides: PortfolioTextOverride[] | undefined = (() => {
    if (!portfolioContent) return undefined;
    try { return JSON.parse(portfolioContent.value); } catch { return undefined; }
  })();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
            data-testid="text-portfolio-title"
          >
            {t(copy.portfolio.title)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(copy.portfolio.standfirst)}
          </p>
        </div>

        <PortfolioDisplay overrides={overrides} />
      </div>
    </Layout>
  );
}
