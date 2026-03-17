import { Layout } from "@/components/layout/Layout";
import { ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import cfeDashboard from "@assets/screenshot-1773752954601.png";
import cfeFormats from "@assets/Screenshot_2026-03-17_at_14.15.25_1773753570040.png";
import cfePlugin from "@assets/Screenshot_2026-03-17_at_14.19.11_1773753570040.png";

import evHome from "@assets/Screenshot_2026-03-17_at_14.14.24_1773753293404.png";
import evEntities from "@assets/Screenshot_2026-03-17_at_14.13.51_1773753293404.png";
import evCollab from "@assets/Screenshot_2026-03-17_at_14.14.02_1773753293404.png";

import trackerDashboard from "@assets/Screenshot_2026-03-17_at_14.11.56_1773753293404.png";
import trackerUsage from "@assets/Screenshot_2026-03-17_at_14.11.24_1773753293403.png";
import trackerProjects from "@assets/Screenshot_2026-03-17_at_14.11.38_1773753293403.png";

interface Product {
  name: string;
  tagline: string;
  description: string;
  url: string;
  screenshots: string[];
  screenshotLabels: string[];
}

const products: Product[] = [
  {
    name: "Creative Format Engine",
    tagline: "cfe.tutto.one",
    description:
      "A format specification and campaign management tool for creative production — e-commerce banners, social media assets, and more. Includes a Photoshop plugin for seamless designer workflows.",
    url: "https://cfe.tutto.one",
    screenshots: [cfeDashboard, cfeFormats, cfePlugin],
    screenshotLabels: ["Dashboard", "Format Specifications", "Photoshop Plugin"],
  },
  {
    name: "EntityVault",
    tagline: "entityvault.tutto.one",
    description:
      "A privacy-first entity management platform with tokenized data storage, collaboration requests, and entity search. Built for organisations that take data privacy seriously.",
    url: "https://entityvault.tutto.one",
    screenshots: [evHome, evEntities, evCollab],
    screenshotLabels: ["Home", "My Entities", "Collaboration Requests"],
  },
  {
    name: "AI ROI Portal",
    tagline: "tracker.tutto.one",
    description:
      "A consulting dashboard for tracking AI adoption ROI, usage metrics, project milestones, and cost savings. Helps teams measure the real impact of automation.",
    url: "https://tracker.tutto.one",
    screenshots: [trackerDashboard, trackerUsage, trackerProjects],
    screenshotLabels: ["ROI Dashboard", "AI Usage Tracking", "Projects"],
  },
];

function ImageCarousel({
  screenshots,
  labels,
  productName,
}: {
  screenshots: string[];
  labels: string[];
  productName: string;
}) {
  const [current, setCurrent] = useState(0);

  const prev = () =>
    setCurrent((c) => (c === 0 ? screenshots.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === screenshots.length - 1 ? 0 : c + 1));

  return (
    <div className="space-y-3">
      <div className="relative group rounded-xl overflow-hidden border border-border/60 bg-muted/30">
        <img
          src={screenshots[current]}
          alt={`${productName} — ${labels[current]}`}
          className="w-full aspect-[16/10] object-cover object-top"
          data-testid={`img-screenshot-${productName.toLowerCase().replace(/\s+/g, "-")}-${current}`}
        />

        <button
          onClick={prev}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Previous screenshot"
          data-testid={`button-prev-${productName.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={next}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-sm border border-border/60 rounded-full p-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-background"
          aria-label="Next screenshot"
          data-testid={`button-next-${productName.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center justify-center gap-2">
        {screenshots.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`text-xs px-3 py-1 rounded-full transition-colors ${
              i === current
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
            data-testid={`button-dot-${productName.toLowerCase().replace(/\s+/g, "-")}-${i}`}
          >
            {labels[i]}
          </button>
        ))}
      </div>
    </div>
  );
}

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

        <div className="space-y-24">
          {products.map((product, index) => (
            <section
              key={product.name}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 md:gap-12 items-start`}
              data-testid={`section-product-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
            >
              <div className="w-full md:w-3/5">
                <ImageCarousel
                  screenshots={product.screenshots}
                  labels={product.screenshotLabels}
                  productName={product.name}
                />
              </div>

              <div className="w-full md:w-2/5 md:sticky md:top-24">
                <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase mb-2">
                  {product.tagline}
                </p>
                <h2
                  className="text-2xl md:text-3xl font-serif font-bold mb-4"
                  data-testid={`text-product-name-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {product.name}
                </h2>
                <p
                  className="text-muted-foreground leading-relaxed mb-6"
                  data-testid={`text-product-desc-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  {product.description}
                </p>
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
                  data-testid={`link-visit-${product.name.toLowerCase().replace(/\s+/g, "-")}`}
                >
                  Visit {product.name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </section>
          ))}
        </div>
      </div>
    </Layout>
  );
}
