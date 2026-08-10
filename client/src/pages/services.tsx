import { Layout } from "@/components/layout/Layout";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { usePreferences } from "@/lib/preferences";
import { price } from "@/lib/pricing";
import { DEFAULT_SERVICES, localiseService, type ServiceItem } from "@/lib/services-content";
import { pick, copy, useT } from "@/lib/i18n";


export default function Services() {
  const { locale, currency } = usePreferences();
  const t = useT();
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
            {t(copy.services.title)}
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {t(copy.services.standfirst)}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const text = localiseService(service, locale);
            return (
            <div
              key={index}
              data-testid={`card-service-${index}`}
              className="bg-card border border-border/60 rounded-2xl p-8 hover:shadow-lg transition-all hover:-translate-y-1 duration-300 flex flex-col"
            >
              <h3 className="text-xl font-serif font-bold mb-4">
                {text.title}
              </h3>
              <p className="text-muted-foreground mb-8 text-sm leading-relaxed min-h-[80px]">
                {text.description}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {text.features.map((feature, i) => (
                  <li key={i} className="flex items-start text-sm">
                    <Check className="w-5 h-5 text-primary mr-3 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto">
                {service.note && (
                  <p className="text-xs text-muted-foreground leading-relaxed mb-4 pt-4 border-t border-border">
                    {pick(service.note, locale)}
                  </p>
                )}
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
                  <Link href="/contact">{t(copy.services.inquire)}</Link>
                </Button>
              </div>
            </div>
            );
          })}
        </div>

        <div className="mt-20 text-center bg-secondary/30 rounded-3xl p-12">
          <h2 className="text-3xl font-serif font-bold mb-4">
            {t(copy.services.notSureTitle)}
          </h2>
          <p className="text-muted-foreground mb-8">
            {t(copy.services.notSureBody)}
          </p>
          <Button className="rounded-full px-8 py-6 text-lg" asChild>
            <a href="/">
              {t(copy.services.runDiagnostic)} <ArrowRight className="ml-2" />
            </a>
          </Button>
        </div>
      </div>
    </Layout>
  );
}
