/**
 * The allowlist for search (docs/seo-geo-plan.md, sections 0 and 1).
 *
 * Only the paths here are rendered on the server, get their own head tags and
 * go in the sitemap. Anything else, including every student, trainer and admin
 * route, gets the plain index.html shell exactly as before, so a route added
 * later is kept out of search until someone puts it here on purpose.
 *
 * Titles are the ones each page already sets in its own effect; keep them in
 * step when a page's title changes. The description is taken from the page's
 * first paragraph at render time unless one is given here.
 */

export type PageKey =
  | "landing"
  | "applied"
  | "about"
  | "about-me"
  | "services"
  | "portfolio"
  | "usecase"
  | "praxis"
  | "praxis-programme"
  | "calendar"
  | "sovereign"
  | "pythia"
  | "blog"
  | "blog-post"
  | "contact"
  | "peer-groups"
  | "become-a-trainer"
  | "gtm-orchestrator"
  | "rieuzal"
  | "data-policy"
  | "article-4"
  | "souverainete";

export type PageSchema = "Course" | "EventSeries" | "Service" | "AboutPage" | "ContactPage" | "Blog" | "ProfilePage";

export type PublicPage = {
  /** The canonical path. `/blog/:slug` is matched separately. */
  path: string;
  key: PageKey;
  /** The page's own tab title. Without one, the first heading plus " | Tutto". */
  title?: { en: string; fr?: string };
  /** Overrides the first-paragraph description. */
  description?: { en: string; fr?: string };
  /** Sitemap priority, 0 to 1. */
  priority: number;
  /** What the JSON-LD says this page is, beyond the site-wide Organization. */
  schema?: PageSchema;
  /** The language the page is written in when it isn't English. */
  lang?: "fr";
};

export const SITE_URL = "https://www.tutto.one";

export const PUBLIC_PAGES: PublicPage[] = [
  { path: "/", key: "landing", title: { en: "Tutto | AI that never leaves the building." }, priority: 1 },
  { path: "/praxis", key: "praxis", title: { en: "Praxis: Brief it once. It works every time | Tutto" }, priority: 0.9, schema: "Course" },
  { path: "/praxis-programme", key: "praxis-programme", title: { en: "The AI-Fluent Team | Praxis | Tutto" }, priority: 0.9, schema: "Course" },
  { path: "/peer-groups", key: "peer-groups", title: { en: "Peer Groups | Praxis | Tutto" }, priority: 0.8, schema: "Course" },
  { path: "/become-a-trainer", key: "become-a-trainer", title: { en: "Become a Praxis Trainer - teach it, and earn from it" }, priority: 0.7, schema: "Course" },
  { path: "/article-4", key: "article-4", title: { en: "Article 4: AI literacy training | Tutto", fr: "Article 4 : Formation IA en entreprise | Tutto" }, priority: 0.8, schema: "Course" },
  { path: "/services", key: "services", title: { en: "Services: we build it, or you learn to | Tutto", fr: "Prestations : nous le construisons, ou vous apprenez | Tutto" }, priority: 0.9, schema: "Service" },
  { path: "/sovereign", key: "sovereign", title: { en: "Sovereign AI | Pythia | Tutto", fr: "IA souveraine | Pythia | Tutto" }, priority: 0.8, schema: "Service" },
  { path: "/pythia", key: "pythia", title: { en: "Pythia: On-premise document intelligence | Tutto", fr: "Pythia : intelligence documentaire sur site | Tutto" }, priority: 0.7, schema: "Service" },
  { path: "/gtm-orchestrator", key: "gtm-orchestrator", title: { en: "GTM: On-premise sales outreach engine | Tutto", fr: "GTM : moteur de prospection sur site | Tutto" }, priority: 0.5, schema: "Service" },
  { path: "/souverainete", key: "souverainete", title: { en: "Sovereignty: diagnostic | Tutto", fr: "Souveraineté : diagnostic | Tutto" }, priority: 0.6 },
  { path: "/calendar", key: "calendar", title: { en: "Applied AI Evenings | Praxis | Tutto", fr: "Les soirées IA appliquée | Praxis | Tutto" }, priority: 0.6 },
  { path: "/rieuzal", key: "rieuzal", title: { en: "Ateliers IA à Rieuzal | Tutto" }, priority: 0.7, schema: "EventSeries", lang: "fr" },
  { path: "/applied", key: "applied", title: { en: "Applied AI, at length | Tutto", fr: "L'IA en pratique | Tutto" }, priority: 0.6 },
  { path: "/usecase/", key: "usecase", priority: 0.6 },
  { path: "/portfolio", key: "portfolio", priority: 0.5 },
  { path: "/about", key: "about", title: { en: "About - Tutto", fr: "À propos - Tutto" }, priority: 0.7, schema: "AboutPage" },
  { path: "/about/me", key: "about-me", title: { en: "About me - Daniel Forsthofer", fr: "À propos de moi - Daniel Forsthofer" }, priority: 0.6, schema: "ProfilePage" },
  { path: "/blog", key: "blog", priority: 0.8, schema: "Blog" },
  { path: "/contact", key: "contact", priority: 0.6, schema: "ContactPage" },
  { path: "/data-policy", key: "data-policy", title: { en: "How we handle your data | Tutto" }, priority: 0.3 },
];

/** `/usecase` is the same page as `/usecase/`, the URL already in the wild. */
const ALIASES: Record<string, string> = { "/usecase": "/usecase/" };

const BY_PATH = new Map(PUBLIC_PAGES.map((p) => [p.path, p]));

export type PublicMatch = { page: PublicPage; slug?: string };

/** The allowlisted page for a request path, or null when the path is not public. */
export function matchPublicPage(pathname: string): PublicMatch | null {
  const path = ALIASES[pathname] ?? pathname;
  const page = BY_PATH.get(path);
  if (page) return { page };
  const post = /^\/blog\/([a-z0-9-]+)\/?$/.exec(pathname);
  if (post) {
    return {
      page: { path: pathname, key: "blog-post", priority: 0.7 },
      slug: post[1],
    };
  }
  return null;
}

/**
 * Every other path the browser app answers, so that anything outside both
 * lists can return a real 404. The fenced areas are matched by prefix: any
 * path under them keeps answering exactly as it did before.
 */
const FENCED_PREFIXES = ["/admin", "/learn", "/praxis/learn", "/rieuzal/annuler"];
const OTHER_APP_PATHS = new Set([
  "/sharepoint",
  "/fiche-capacites",
  "/how-ai-works-here",
  "/next",
  "/ways-in",
  "/courses",
]);

export function isKnownAppPath(pathname: string): boolean {
  const path = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
  if (matchPublicPage(pathname) || matchPublicPage(path)) return true;
  if (OTHER_APP_PATHS.has(path)) return true;
  return FENCED_PREFIXES.some((p) => path === p || path.startsWith(p + "/"));
}
