/**
 * The allowlist for search (docs/seo-geo-plan.md, sections 0 and 1).
 *
 * Only the paths here are rendered on the server, get their own head tags and
 * go in the sitemap. Anything else, including every student, trainer and admin
 * route, gets the plain index.html shell exactly as before, so a route added
 * later is kept out of search until someone puts it here on purpose.
 *
 * Titles are the ones each page already sets in its own effect; keep them in
 * step when a page's title changes. Every title ends in "Tutto Applied AI",
 * the searchable unit ("Tutto" alone is an everyday Italian word). Each main
 * page has a description written for what it sells (November 2026); without
 * one, it is taken from the page's first paragraph at render time.
 */

export type PageKey =
  | "landing"
  | "applied"
  | "about"
  | "about-me"
  | "services"
  | "portfolio"
  | "usecase"
  | "praxis-programme"
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
  { path: "/", key: "landing", title: { en: "Tutto Applied AI | AI training for teams", fr: "Tutto Applied AI | Formation IA pour les équipes" },
    description: { en: "AI training for teams, on your own work: the rules, a scorecard for each job, what to hand over, then the build. 8 topics, with a guarantee.", fr: "Formation IA pour les équipes, sur votre propre travail : les règles, une grille par tâche, ce qu'on délègue, puis la construction. 8 thèmes, avec garantie." },
    priority: 1 },
  { path: "/praxis-programme", key: "praxis-programme", title: { en: "AI training for teams and individuals | Tutto Applied AI", fr: "Formation IA pour les équipes et les particuliers | Tutto Applied AI" },
    description: { en: "Eight topics for you and up to four of your team, in eight, six or four sessions, on your own work. What you leave with, the guarantee and the price.", fr: "Huit thèmes pour vous et jusqu'à quatre personnes de votre équipe, en huit, six ou quatre séances. Ce que vous emportez, la garantie et le prix." },
    priority: 0.9, schema: "Course" },
  { path: "/peer-groups", key: "peer-groups", title: { en: "AI training in a small group | Tutto Applied AI", fr: "Formation IA en petit groupe | Tutto Applied AI" },
    description: { en: "Four 90-minute sessions with three people from a similar background, each of you on your own work. Priced per person, and a deposit holds your seat.", fr: "Quatre séances de 90 minutes avec trois personnes au parcours proche, chacun sur son propre travail. Prix par personne, un acompte réserve votre place." },
    priority: 0.8, schema: "Course" },
  { path: "/become-a-trainer", key: "become-a-trainer", title: { en: "Become a Praxis trainer: teach it, and earn from it | Tutto Applied AI", fr: "Devenez formateur Praxis | Tutto Applied AI" },
    description: { en: "Four sessions that turn someone who can build with AI into someone who can teach it. You keep 80% of the tuition on the clients you bring in.", fr: "Quatre séances pour passer de quelqu'un qui construit avec l'IA à quelqu'un qui l'enseigne. Vous gardez 80 % des honoraires sur vos propres clients." },
    priority: 0.7, schema: "Course" },
  { path: "/article-4", key: "article-4", title: { en: "Article 4: AI literacy training | Tutto Applied AI", fr: "Article 4 : Formation IA en entreprise | Tutto Applied AI" },
    description: { en: "What Article 4 of the EU AI Act asks of employers, and the training that covers it, ending in the documentation that shows you have.", fr: "Ce que l'article 4 du règlement européen sur l'IA impose aux employeurs, et la formation qui y répond, jusqu'au dossier qui le prouve." },
    priority: 0.8, schema: "Course" },
  { path: "/services", key: "services", title: { en: "Services: we build it, or you learn to | Tutto Applied AI", fr: "Prestations : nous le construisons, ou vous apprenez | Tutto Applied AI" },
    description: { en: "We train your team to use AI properly, then build what's worth building. Either way it starts with the rules and a standard for good work.", fr: "Nous formons votre équipe à bien utiliser l'IA, puis nous construisons ce qui en vaut la peine. Toujours en commençant par les règles et un standard." },
    priority: 0.9, schema: "Service" },
  { path: "/sovereign", key: "sovereign", title: { en: "Sovereign AI on your own hardware | Tutto Applied AI", fr: "IA souveraine, sur votre matériel | Tutto Applied AI" },
    description: { en: "A system that reads everything your business holds and answers from it, on hardware you own, in your building. Nothing is uploaded.", fr: "Un système qui lit tout ce que votre entreprise conserve et y répond, sur un matériel qui vous appartient, dans vos locaux. Rien n'est téléversé." },
    priority: 0.8, schema: "Service" },
  { path: "/pythia", key: "pythia", title: { en: "On-premise document AI for legal work | Tutto Applied AI", fr: "IA documentaire sur site pour le juridique | Tutto Applied AI" },
    description: { en: "Document AI for disclosure sets and privileged material: search, cited answers and timelines, on a machine in your own office.", fr: "IA documentaire pour les fonds de pièces et les documents couverts par le secret : recherche, réponses citées et chronologies, dans vos bureaux." },
    priority: 0.7, schema: "Service" },
  { path: "/gtm-orchestrator", key: "gtm-orchestrator", title: { en: "On-premise sales outreach engine | Tutto Applied AI", fr: "Moteur de prospection sur site | Tutto Applied AI" },
    description: { en: "A custom system that researches prospects, writes in the sender's voice and sends safely, with open-weight models on the client's own hardware.", fr: "Un système sur mesure qui étudie les prospects, écrit dans la voix de l'expéditeur et envoie en sûreté, avec des modèles locaux sur le matériel du client." },
    priority: 0.5, schema: "Service" },
  { path: "/souverainete", key: "souverainete", title: { en: "Sovereignty: diagnostic | Tutto", fr: "Souveraineté : diagnostic | Tutto" }, priority: 0.6 },
  { path: "/rieuzal", key: "rieuzal", title: { en: "Ateliers IA à Rieuzal | Tutto" }, priority: 0.7, schema: "EventSeries", lang: "fr" },
  { path: "/applied", key: "applied", title: { en: "Applied AI, at length | Tutto Applied AI", fr: "L'IA en pratique | Tutto Applied AI" },
    description: { en: "The long version: how we set AI up on your own machine and your own data, with worked examples and the trade-offs.", fr: "La version longue : comment nous installons l'IA sur votre machine et vos données, avec des exemples concrets et les compromis." },
    priority: 0.6 },
  { path: "/usecase/", key: "usecase", priority: 0.6 },
  { path: "/portfolio", key: "portfolio", title: { en: "Work | Tutto Applied AI", fr: "Réalisations | Tutto Applied AI" },
    description: { en: "Systems we have built with clients: document search for litigation, a SharePoint bridge, a sales outreach engine and more.", fr: "Les systèmes construits avec nos clients : recherche documentaire en contentieux, pont SharePoint, moteur de prospection et d'autres." },
    priority: 0.5 },
  { path: "/about", key: "about", title: { en: "About | Tutto Applied AI", fr: "À propos | Tutto Applied AI" },
    description: { en: "We fix how your team uses AI. Then we build what's worth building. Who we are, how we work and who we've worked with.", fr: "Nous corrigeons la façon dont votre équipe utilise l'IA, puis nous construisons ce qui en vaut la peine. Qui nous sommes et comment nous travaillons." },
    priority: 0.7, schema: "AboutPage" },
  { path: "/about/me", key: "about-me", title: { en: "About me - Daniel Forsthofer", fr: "À propos de moi - Daniel Forsthofer" }, priority: 0.6, schema: "ProfilePage" },
  { path: "/blog", key: "blog", title: { en: "Thinking | Tutto Applied AI", fr: "Réflexions | Tutto Applied AI" },
    description: { en: "Our writing on AI, agents and setting a business up so AI can work inside it.", fr: "Nos articles sur l'IA, les agents et la façon d'organiser une entreprise pour que l'IA y travaille." },
    priority: 0.8, schema: "Blog" },
  { path: "/contact", key: "contact", title: { en: "Contact | Tutto Applied AI", fr: "Contact | Tutto Applied AI" },
    description: { en: "Book a free 15-minute call, or send us a message about the job you keep repeating.", fr: "Réservez un appel gratuit de 15 minutes, ou écrivez-nous au sujet de la tâche que vous répétez." },
    priority: 0.6, schema: "ContactPage" },
  { path: "/data-policy", key: "data-policy", title: { en: "How we handle your data | Tutto Applied AI", fr: "Comment nous traitons vos données | Tutto Applied AI" }, priority: 0.3 },
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
