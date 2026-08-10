/**
 * The services list, shared by the public page and the admin editor.
 *
 * These were previously two separate copies of the same shape and the same
 * defaults, which is how the editor ended up able to write a literal price
 * string the public page could not convert. One definition, imported twice.
 */
import type { PriceKey } from "./pricing";

export interface ServiceItem {
  title: string;
  description: string;
  features: string[];
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
}

export const STARTS_AT = { en: "Starts at", fr: "À partir de" };

export const DEFAULT_SERVICES: ServiceItem[] = [
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
