import { Layout } from "@/components/layout/Layout";
import { PortfolioDisplay } from "@/components/portfolio/PortfolioDisplay";

export default function Portfolio() {
  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1
            className="text-4xl md:text-5xl font-serif font-bold mb-6"
            data-testid="text-portfolio-title"
          >
            Portfolio
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Systems we've designed and built — from concept to production.
          </p>
        </div>

        <PortfolioDisplay />
      </div>
    </Layout>
  );
}
