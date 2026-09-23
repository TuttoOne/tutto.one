/**
 * The services list, shared by the public page and the admin editor.
 *
 * These were previously two separate copies of the same shape and the same
 * defaults, which is how the editor ended up able to write a literal price
 * string the public page could not convert. One definition, imported twice.
 *
 * French lives in optional *Fr fields rather than {en, fr} pairs so that
 * content saved by the admin editor — which writes plain strings — still
 * loads without migration. Missing French falls back to English.
 */
import type { PriceKey } from "./pricing";
import type { Locale } from "./preferences";

export interface ServiceItem {
  title: string;
  titleFr?: string;
  description: string;
  descriptionFr?: string;
  features: string[];
  featuresFr?: string[];
  /**
   * Legacy literal price text. Retained so content saved before the currency
   * toggle still renders, but no longer offered in the editor — a typed-in
   * amount cannot follow the toggle.
   */
  price?: string;
  /** Resolved against the pricing table at render, so it follows the toggle. */
  priceKey?: PriceKey;
  /** Shown before the amount, e.g. "Starts at". */
  pricePrefix?: { en: string; fr: string };
  /** Unit, for anything sold by the day or the month rather than as a total. */
  priceSuffix?: { en: string; fr: string };
  /** For cards with no fixed amount, e.g. "Custom scoping". */
  priceLabel?: { en: string; fr: string };
  /** Extra terms shown under the price, e.g. the referral scheme. */
  note?: { en: string; fr: string };
  /**
   * Where the card's button goes. Defaults to the contact form, but a service
   * with a page of its own should send the reader there instead — someone
   * weighing up training wants to see what it involves before enquiring.
   */
  href?: string;
  ctaLabel?: { en: string; fr: string };
}

export const STARTS_AT = { en: "Starts at", fr: "À partir de" };
/** For the diagnostic, which is a rate and reads as a total without this. */
export const PER_DAY = { en: "per day", fr: "par jour" };

/** Resolve a service's text for the active locale, falling back to English. */
export function localiseService(s: ServiceItem, locale: Locale) {
  const fr = locale === "fr";
  return {
    title: (fr && s.titleFr) || s.title,
    description: (fr && s.descriptionFr) || s.description,
    features: (fr && s.featuresFr) || s.features,
  };
}

export const DEFAULT_SERVICES: ServiceItem[] = [
  {
    title: "Data Audit & Knowledge Mapping",
    titleFr: "Audit des données et cartographie du savoir",
    description:
      "We audit your existing documentation, databases, and communication channels to create a structured map of your organizational knowledge.",
    descriptionFr:
      "Nous auditons votre documentation, vos bases de données et vos canaux de communication pour établir une carte structurée du savoir de votre organisation.",
    features: [
      "Audit of Files/CRMs/Software/Drives",
      "API Readiness Score",
      "Knowledge Graph Architecture",
    ],
    featuresFr: [
      "Audit des fichiers, CRM, logiciels et disques",
      "Évaluation de la maturité des API",
      "Architecture du graphe de connaissances",
    ],
    priceKey: "diagnosticDay",
    pricePrefix: STARTS_AT,
    priceSuffix: PER_DAY,
  },
  {
    /**
     * Named for the choice, not the technique. "AI Agent Architecture" described
     * how the thing is built; what clients actually weigh is where it runs and
     * whose model reads their data, so the card leads on both.
     */
    title: "Your Infrastructure, Your Models",
    titleFr: "Votre infrastructure, vos modèles",
    description:
      "We design and build the working system, then deploy it wherever you choose: your own hardware, a private or public cloud, or a hosted environment. Where a model is needed, you choose that too.",
    descriptionFr:
      "Nous concevons et construisons le système, puis le déployons là où vous le décidez : votre propre matériel, un nuage privé ou public, ou un environnement hébergé. Là où un modèle est nécessaire, vous le choisissez également.",
    features: [
      "Local, Private or Public Deployment",
      "Open-weight or Frontier Models",
      "Human-in-the-loop Workflows",
      "Tool Selection & Integration",
    ],
    featuresFr: [
      "Déploiement local, privé ou public",
      "Modèles à poids ouverts ou de premier plan",
      "Flux avec supervision humaine",
      "Choix et intégration des outils",
    ],
    /**
     * A stated price, not "custom scoping". The floor is thirty hours, and it
     * is deliberately the same figure the landing page quotes for an agent
     * build — same offer, two readers. The hosting caveat is the only genuine
     * variable, so it is stated as a caveat rather than smuggled into an
     * open-ended quote.
     */
    note: {
      en: "Priced on deployment to hosting or hardware you specify, where running it costs you nothing further. If we have to host it, that is quoted separately.",
      fr: "Tarif établi pour un déploiement sur l'hébergement ou le matériel que vous indiquez, dont l'exploitation ne vous coûte rien de plus. Si l'hébergement nous incombe, il est chiffré à part.",
    },
    priceKey: "scriptBuildFrom",
    pricePrefix: STARTS_AT,
    /**
     * Sends the reader to the page that argues this card at length, the way
     * The AI-Fluent Team below sends them to the programme. Someone weighing up
     * where their data would run wants to see it before enquiring.
     */
    href: "/sovereign",
    ctaLabel: { en: "See how it runs", fr: "Voir comment cela fonctionne" },
  },
  {
    title: "The AI-Fluent Team",
    titleFr: "L'équipe à l'aise avec l'IA",
    description:
      "Eight sessions to stop repeating yourself: the rules, a KPI for each job, what to hand over, then the build. With a guarantee.",
    descriptionFr:
      "Huit séances pour arrêter de vous répéter : les règles, un indicateur par tâche, ce qu'on délègue, puis la construction. Avec une garantie.",
    features: [
      "AI Use Charter",
      "KPI Scorecard per role",
      "Hand-over list",
      "Briefing Library and Verification Protocol",
    ],
    featuresFr: [
      "Charte d'usage de l'IA",
      "Grille d'évaluation par rôle",
      "Liste de délégation",
      "Bibliothèque de consignes et protocole de vérification",
    ],
    /**
     * The referral terms belong with the training service. Amounts are
     * resolved from the pricing table at render so they follow the currency
     * toggle rather than being written into the copy.
     */
    note: {
      en: "Every person you refer who enrols takes {credit} off your own fee, up to {cap}. Credits apply to courses taught by participating trainers.",
      fr: "Chaque personne que vous parrainez et qui s'inscrit réduit votre propre tarif de {credit}, jusqu'à {cap}. Les crédits s'appliquent aux cours animés par des formateurs participants.",
    },
    /* A fixed programme, not a floor, so no "Starts at". The figure is the
       back-to-work price; the regular price is on the programme page. */
    priceKey: "enablementFrom",
    href: "/praxis-programme",
    ctaLabel: { en: "See the programme", fr: "Voir le programme" },
  },
];
