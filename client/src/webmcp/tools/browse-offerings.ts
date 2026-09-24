import { defineTool } from "@nekuda/webmcp-sdk";
import { DEFAULT_SERVICES, type ServiceItem } from "@/lib/services-content";
import { price } from "@/lib/pricing";
import type { Currency } from "@/lib/preferences";
import { SITE_PAGES } from "../site-index";

/**
 * The currency the visitor is actually being shown, so a quoted price matches
 * the page. Same storage key the preferences provider writes.
 */
function shownCurrency(): Currency {
  try {
    const stored = localStorage.getItem("tutto.currency");
    if (stored === "GBP" || stored === "EUR" || stored === "ZAR") return stored;
  } catch {
    /* private mode / storage disabled */
  }
  return "EUR";
}

/** Resolve a service's price the way the services page renders it. */
function priceOf(service: ServiceItem, currency: Currency): string | null {
  if (service.priceLabel) return service.priceLabel.en;
  if (service.priceKey) {
    const amount = price(service.priceKey, currency, "en");
    return [service.pricePrefix?.en, amount, service.priceSuffix?.en]
      .filter(Boolean)
      .join(" ");
  }
  return service.price ?? null;
}

export const browseOfferings = defineTool({
  stableKey: "tutto.browse_offerings",
  name: "browse_offerings",
  title: "Browse Tutto's services and programmes",
  description:
    "List what Tutto sells: the services with their prices, plus the programme and product pages such as Praxis training, the trainer track, Pythia and the Applied AI evenings, each with a summary and the page path. Use this first when a visitor asks what Tutto offers, what it costs, or which option fits them, then use ask_site for detail on one of them. Returns services with price and features, and pages with a summary, all with paths.",
  inputSchema: {
    type: "object",
    properties: {},
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  async execute() {
    const currency = shownCurrency();

    // The services page renders whatever the admin has saved, falling back to
    // the defaults in the repo. Resolve it the same way so the tool and the
    // page never disagree.
    let items: ServiceItem[] = DEFAULT_SERVICES;
    try {
      const res = await fetch("/api/site-content/services");
      if (res.ok) {
        const parsed = JSON.parse(((await res.json()) as { value: string }).value);
        if (Array.isArray(parsed) && parsed.length > 0) items = parsed;
      }
    } catch {
      /* not configured, or invalid JSON — the defaults are the page's fallback too */
    }

    const services = items.map((service) => ({
      name: service.title,
      summary: service.description,
      features: service.features,
      price: priceOf(service, currency),
      note: service.note?.en ?? null,
      path: service.href ?? "/services",
    }));

    const pages = SITE_PAGES.filter((page) => page.offering).map(
      ({ name, summary, path }) => ({ name, summary, path }),
    );

    if (services.length === 0 && pages.length === 0) {
      throw new Error("browse_offerings found no services or offering pages");
    }

    return {
      services,
      pages,
      currency,
      note: "Prices are shown in the currency the visitor has selected. Use ask_site for detail on any of these, or book_intro_call for a free 15-minute intro with Daniel.",
    };
  },
});
