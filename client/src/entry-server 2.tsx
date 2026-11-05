/**
 * The server render of the public pages (docs/seo-geo-plan.md, section 1), so
 * crawlers that don't run JavaScript get the text. The browser app replaces
 * this HTML with its own on load (`createRoot` in main.tsx).
 *
 * Only the allowlisted pages in shared/public-pages.ts are imported here, so
 * the student, trainer and admin code is not in the server bundle at all.
 */
import type { ComponentType } from "react";
import { renderToString } from "react-dom/server";
import { Router, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PreferencesProvider, type Locale } from "@/lib/preferences";
import type { PageKey } from "@shared/public-pages";

import Landing from "@/pages/landing";
import Applied from "@/pages/applied";
import About from "@/pages/about";
import AboutMe from "@/pages/about-me";
import Services from "@/pages/services";
import Portfolio from "@/pages/portfolio";
import UseCase from "@/pages/usecase";
import Praxis from "@/pages/praxis";
import PraxisProgramme from "@/pages/praxis-programme";
import Calendar from "@/pages/calendar";
import Pythia from "@/pages/pythia";
import Sovereign from "@/pages/sovereign";
import Blog from "@/pages/blog";
import BlogPost from "@/pages/blog-post";
import Contact from "@/pages/contact";
import Article4 from "@/pages/article4";
import Souverainete from "@/pages/souverainete";
import GtmOrchestrator from "@/pages/gtm-orchestrator";
import BecomeATrainer from "@/pages/become-a-trainer";
import PeerGroups from "@/pages/peer-groups";
import DataPolicy from "@/pages/data-policy";
import { EventSeries } from "@/pages/soirees";

const PAGES: Record<PageKey, ComponentType> = {
  landing: Landing,
  applied: Applied,
  about: About,
  "about-me": AboutMe,
  services: Services,
  portfolio: Portfolio,
  usecase: UseCase,
  praxis: Praxis,
  "praxis-programme": PraxisProgramme,
  calendar: Calendar,
  sovereign: Sovereign,
  pythia: Pythia,
  blog: Blog,
  "blog-post": BlogPost,
  contact: Contact,
  "peer-groups": PeerGroups,
  "become-a-trainer": BecomeATrainer,
  "gtm-orchestrator": GtmOrchestrator,
  rieuzal: () => <EventSeries series="rieuzal" />,
  "data-policy": DataPolicy,
  "article-4": Article4,
  souverainete: Souverainete,
};

/** The queries a page reads, by the key it reads them under. */
export const PAGE_QUERIES: Partial<Record<PageKey, (slug?: string) => string[][]>> = {
  services: () => [["/api/site-content/services"]],
  portfolio: () => [["/api/site-content/portfolio"]],
  "about-me": () => [["/api/site-content/about-hero"]],
  blog: () => [["/api/blog"]],
  "blog-post": (slug) => [[`/api/blog/${slug}`]],
  rieuzal: () => [["/api/events/series", "rieuzal"]],
};

export type RenderInput = {
  key: PageKey;
  /** The request path, for wouter's useParams and useLocation. */
  path: string;
  locale: Locale;
  /** Query results, keyed by JSON.stringify(queryKey). */
  data: Record<string, unknown>;
};

export function render({ key, path, locale, data }: RenderInput): string {
  const client = new QueryClient({
    // Nothing is fetched during a server render: the data is passed in.
    defaultOptions: { queries: { staleTime: Infinity, retry: false, enabled: false, queryFn: async () => null } },
  });
  for (const [k, v] of Object.entries(data)) client.setQueryData(JSON.parse(k), v);

  const Page = PAGES[key];
  // A route pattern, so the blog post page's useParams gets its slug.
  const pattern = key === "blog-post" ? "/blog/:slug" : path;
  return renderToString(
    <QueryClientProvider client={client}>
      <PreferencesProvider initialLocale={locale}>
        <TooltipProvider>
          <Router ssrPath={path}>
            <RoutedPage pattern={pattern} Page={Page} />
          </Router>
        </TooltipProvider>
      </PreferencesProvider>
    </QueryClientProvider>,
  );
}

function RoutedPage({ pattern, Page }: { pattern: string; Page: ComponentType }) {
  return <Route path={pattern} component={Page} />;
}
