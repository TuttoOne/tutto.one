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
  /** For cards with no fixed amount, e.g. "Custom scoping". */
  priceLabel?: { en: string; fr: string };
  /** Extra terms shown under the price, e.g. the referral scheme. */
  note?: { en: string; fr: string };
}

export const STARTS_AT = { en: "Starts at", fr: "À partir de" };

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
    priceKey: "sprint",
    pricePrefix: STARTS_AT,
  },
  {
    title: "AI Agent Architecture",
    titleFr: "Architecture d'agents IA",
    description:
      "Design and implement specific agent workflows to automate core business processes using your structured data.",
    descriptionFr:
      "Conception et mise en œuvre de flux d'agents dédiés, pour automatiser vos processus métier à partir de vos données structurées.",
    features: [
      "Custom Agent Workflows",
      "Human-in-the-loop Design",
      "Tool Selection & Integration",
    ],
    featuresFr: [
      "Flux d'agents sur mesure",
      "Conception avec supervision humaine",
      "Choix et intégration des outils",
    ],
    priceLabel: { en: "Custom scoping", fr: "Cadrage sur mesure" },
  },
  {
    title: "Team Enablement",
    titleFr: "Montée en compétence des équipes",
    description:
      "Workshops and training to help your team understand how to write for machines and manage AI workers.",
    descriptionFr:
      "Ateliers et formations pour apprendre à vos équipes à écrire pour la machine et à encadrer des agents IA.",
    features: [
      "Prompt Engineering Training",
      "Documentation Standards",
      "AI Governance Frameworks",
    ],
    featuresFr: [
      "Formation à la rédaction d'instructions",
      "Normes de documentation",
      "Cadres de gouvernance de l'IA",
    ],
    /**
     * The referral terms belong with the training service. Amounts are
     * resolved from the pricing table at render so they follow the currency
     * toggle rather than being written into the copy.
     */
    note: {
      en: "Refer one person who takes the course and your own fee halves. Refer two and it costs you nothing — we refund it in full.",
      fr: "Parrainez une personne qui suit la formation et votre tarif est divisé par deux. Parrainez-en deux et la formation ne vous coûte rien : nous vous remboursons intégralement.",
    },
    priceKey: "enablementFrom",
    pricePrefix: STARTS_AT,
  },
];
