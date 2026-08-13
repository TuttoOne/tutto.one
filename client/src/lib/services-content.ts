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
  /**
   * Where the card's button goes. Defaults to the contact form, but a service
   * with a page of its own should send the reader there instead — someone
   * weighing up training wants to see what it involves before enquiring.
   */
  href?: string;
  ctaLabel?: { en: string; fr: string };
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
     * A stated price, not "custom scoping". One scripting engagement is about
     * forty hours; the hosting caveat is the only genuine variable, so it is
     * stated as a caveat rather than smuggled into an open-ended quote.
     */
    note: {
      en: "Priced on deployment to hosting or hardware you specify, where running it costs you nothing further. If we have to host it, that is quoted separately.",
      fr: "Tarif établi pour un déploiement sur l'hébergement ou le matériel que vous indiquez, dont l'exploitation ne vous coûte rien de plus. Si l'hébergement nous incombe, il est chiffré à part.",
    },
    priceKey: "scriptBuildFrom",
    pricePrefix: STARTS_AT,
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
      en: "Every referral who signs up and pays takes 50% off your own fee. Two referrals and the training costs you nothing — we refund it in full.",
      fr: "Chaque personne que vous parrainez, si elle s'inscrit et règle sa formation, réduit votre propre tarif de 50 %. Deux parrainages et la formation ne vous coûte rien : nous vous remboursons intégralement.",
    },
    priceKey: "enablementFrom",
    pricePrefix: STARTS_AT,
    href: "/praxis-programme",
    ctaLabel: { en: "See the programme", fr: "Voir le programme" },
  },
];
