import { Layout } from "@/components/layout/Layout";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { usePreferences } from "@/lib/preferences";
import { price, type PriceKey } from "@/lib/pricing";
import { pick } from "@/lib/i18n";

interface ServiceItem {
  title: string;
  description: string;
  features: string[];
  /**
   * Literal price text. Only set by the admin content editor, which stores a
   * plain string and cannot know about the currency toggle — when present it
   * wins, and that card stops following the toggle.
   */
  price?: string;
  /** Currency-aware price, resolved against the pricing table at render. */
  priceKey?: PriceKey;
  /** Shown before the amount, e.g. "Starts at". */
  pricePrefix?: { en: string; fr: string };
  /** Cards with no fixed price at all. */
  priceLabel?: { en: string; fr: string };
}

const STARTS_AT = { en: "Starts at", fr: "À partir de" };

const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Data Audit & Knowledge Mapping",
    description:
      "We audit your existing documentation, databases, and communication channels to create a structured map of your organizational knowledge.",
    features: [
      "Audit of Files/CRMs/Software/Drives",
      "API Readiness Score",
      "Knowledge Graph Architecture",
    ],
    priceKey: "auditFrom",
    pricePrefix: STARTS_AT,
  },
  {
    title: "AI Agent Architecture",
    description:
      "Design and implement specific agent workflows to automate core business processes using your structured data.",
    features: [
      "Custom Agent Workflows",
      "Human-in-the-loop Design",
      "Tool Selection & Integration",
    ],
    priceLabel: { en: "Custom scoping", fr: "Cadrage sur mesure" },
  },
  {
    title: "Team Enablement",
    description:
      "Workshops and training to help your team understand how to write for machines and manage AI workers.",
    features: [
      "Prompt Engineering Training",
      "Documentation Standards",
      "AI Governance Frameworks",
    ],
    priceKey: "enablementFrom",
    pricePrefix: STARTS_AT,
  },
];

export default function Services() {
  const { locale, currency } = usePreferences();
  const { data: servicesContent } = useQuery<{ value: string }>({
    queryKey: ["/api/site-content/services"],
    retry: false,
  });

  const services: ServiceItem[] = (() => {
    if (!servicesContent) return DEFAULT_SERVICES;
    try {
      return JSON.parse(servicesContent.value);
    } catch {
      return DEFAULT_SERVICES;
    }
  })();

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6">
            Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Preparing your organization for the automated workforce.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              data-testid={`card-service-${index}`}
              className="bg-card border border-border/60 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex flex-col"
            >
              <h3 className="text-xl font-serif font-bold mb-4">
                {service.title}
              </h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed min-h-[80px]">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                <div className="text-sm font-medium text-muted-foreground mb-4">
                  {service.priceKey
                    ? `${service.pricePrefix ? pick(service.pricePrefix, locale) + " " : ""}${price(service.priceKey, currency, locale)}`
                    : service.priceLabel
                      ? pick(service.priceLabel, locale)
                      : service.price}
                </div>
                <Button
                  className="w-full rounded-full"
                  variant={index === 1 ? "default" : "outline"}
                  asChild
                >
                  <Link href="/contact">Inquire</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20 text-center bg-secondary/30 rounded-3xl p-12">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Not sure where to start?
          </h2>
          <p className="text-muted-foreground mb-8">
            Run the diagnostic in the chat interface to get a personalized
            recommendation.
          </p>
          <Button className="rounded-full px-8 py-6 text-lg" asChild>
            <a href="/">
              Run Diagnostic <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
