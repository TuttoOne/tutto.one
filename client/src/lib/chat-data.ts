export type MessageType = "text" | "options" | "system";

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
}

export interface ChatOption {
  label: string;
  /** French label; falls back to `label` when absent. */
  labelFr?: string;
  value: string;
  action?: () => void;
}

export interface FlowStep {
  id: string;
  messages: string[]; // Array of messages to send sequentially
  /** French messages, same order; falls back to `messages` when absent. */
  messagesFr?: string[];
  options?: ChatOption[];
  next?: string; // Default next step if no option selected (usually undefined for options)
}

/** Resolve a step's messages for the active locale. */
export function stepMessages(step: FlowStep, locale: "en" | "fr"): string[] {
  return (locale === "fr" && step.messagesFr) || step.messages;
}

/** Resolve an option's label for the active locale. */
export function optionLabel(opt: ChatOption, locale: "en" | "fr"): string {
  return (locale === "fr" && opt.labelFr) || opt.label;
}

export const CHAT_FLOWS: Record<string, FlowStep> = {
  start: {
    id: "start",
    messages: [
      "How can I help you today?"
    ],
    messagesFr: [
      "Comment puis-je vous aider aujourd'hui ?",
    ],
    options: [
      { label: "Learn about AI Readiness", labelFr: "Comprendre la maturité face à l'IA", value: "readiness" },
      { label: "Run a quick diagnostic", labelFr: "Faire un diagnostic rapide", value: "diagnostic_start" },
      { label: "Talk to Tutto", labelFr: "Parler à Tutto", value: "contact" }
    ]
  },
  readiness: {
    id: "readiness",
    messages: [
      "AI readiness isn't just about having the latest tools.",
      "It's about having structured, accessible data that machines can actually understand.",
      "Most companies are sitting on a goldmine of unstructured data that AI simply can't read."
    ],
    messagesFr: [
      "La maturité face à l'IA ne se résume pas à disposer des derniers outils.",
      "Elle tient à des données structurées et accessibles, que la machine peut réellement comprendre.",
      "La plupart des entreprises sont assises sur une mine de données non structurées que l'IA ne sait tout simplement pas lire.",
    ],
    options: [
      { label: "Tell me more", labelFr: "En savoir plus", value: "readiness_more" },
      { label: "Back to start", labelFr: "Revenir au début", value: "start" }
    ]
  },
  readiness_more: {
    id: "readiness_more",
    messages: [
      "To be 'machine-readable', your internal knowledge needs to be documented, API-accessible, and logically structured.",
      "I help companies audit their information architecture to prepare for this transition."
    ],
    messagesFr: [
      "Pour être « lisible par la machine », votre savoir interne doit être documenté, accessible par API et structuré logiquement.",
      "J'aide les entreprises à auditer leur architecture de l'information pour préparer cette transition.",
    ],
    options: [
      { label: "How do we start?", labelFr: "Par où commence-t-on ?", value: "diagnostic_start" },
      { label: "I want to book a call", labelFr: "Je veux réserver un appel", value: "contact" }
    ]
  },
  diagnostic_start: {
    id: "diagnostic_start",
    messages: [
      "Let's run a quick 3-question diagnostic to see where you stand.",
      "Question 1: Do you have a central documentation repository (like Notion, Confluence) that is actively maintained?"
    ],
    messagesFr: [
      "Faisons un rapide diagnostic en trois questions pour situer votre organisation.",
      "Question 1 : disposez-vous d'un référentiel de documentation central (type Notion ou Confluence) réellement tenu à jour ?",
    ],
    options: [
      { label: "Yes, it's our bible", labelFr: "Oui, c'est notre référence", value: "diag_q2_good" },
      { label: "Sort of, but it's messy", labelFr: "Plus ou moins, mais c'est le désordre", value: "diag_q2_ok" },
      { label: "No, knowledge is in heads", labelFr: "Non, le savoir est dans les têtes", value: "diag_q2_bad" }
    ]
  },
  diag_q2_good: {
    id: "diag_q2_good",
    messages: ["That's a great start. Question 2: Is your customer data accessible via a unified API?"],
    messagesFr: [
      "Excellent point de départ. Question 2 : vos données clients sont-elles accessibles via une API unifiée ?",
    ],
    options: [
      { label: "Yes", labelFr: "Oui", value: "diag_q3" },
      { label: "No, it's siloed", labelFr: "Non, elles sont cloisonnées", value: "diag_q3" }
    ]
  },
  diag_q2_ok: {
    id: "diag_q2_ok",
    messages: ["Common scenario. Question 2: Is your customer data accessible via a unified API?"],
    messagesFr: [
      "Situation très courante. Question 2 : vos données clients sont-elles accessibles via une API unifiée ?",
    ],
    options: [
      { label: "Yes", labelFr: "Oui", value: "diag_q3" },
      { label: "No, it's siloed", labelFr: "Non, elles sont cloisonnées", value: "diag_q3" }
    ]
  },
  diag_q2_bad: {
    id: "diag_q2_bad",
    messages: ["I see. That's the first bottleneck we'd need to address. Question 2: Is your customer data accessible via a unified API?"],
    messagesFr: [
      "Je vois. C'est le premier goulet d'étranglement à traiter. Question 2 : vos données clients sont-elles accessibles via une API unifiée ?",
    ],
    options: [
      { label: "Yes", labelFr: "Oui", value: "diag_q3" },
      { label: "No, it's siloed", labelFr: "Non, elles sont cloisonnées", value: "diag_q3" }
    ]
  },
  diag_q3: {
    id: "diag_q3",
    messages: ["Last question: Have you automated any core business processes with AI agents yet?"],
    messagesFr: [
      "Dernière question : avez-vous déjà automatisé des processus métier clés avec des agents IA ?",
    ],
    options: [
      { label: "Yes, fully automated", labelFr: "Oui, entièrement automatisés", value: "result_advanced" },
      { label: "Experimenting now", labelFr: "Nous expérimentons", value: "result_intermediate" },
      { label: "Not yet", labelFr: "Pas encore", value: "result_beginner" }
    ]
  },
  result_advanced: {
    id: "result_advanced",
    messages: [
      "Impressive. You seem to be well on your way.",
      "At this stage, optimization and governance become the key challenges.",
      "I'd love to hear what you're building."
    ],
    messagesFr: [
      "Impressionnant. Vous semblez déjà bien avancé.",
      "À ce stade, l'optimisation et la gouvernance deviennent les vrais enjeux.",
      "J'aimerais beaucoup savoir ce que vous construisez.",
    ],
    options: [
      { label: "Book a chat", labelFr: "Réserver un échange", value: "contact" },
      { label: "Back to start", labelFr: "Revenir au début", value: "start" }
    ]
  },
  result_intermediate: {
    id: "result_intermediate",
    messages: [
      "You're in the 'Messy Middle'. This is where most valuable work happens.",
      "Structuring your data now will pay massive dividends as you scale these experiments."
    ],
    messagesFr: [
      "Vous êtes dans le « ventre mou » : c'est là que se joue le travail le plus utile.",
      "Structurer vos données maintenant rapportera énormément à mesure que vous passerez à l'échelle.",
    ],
    options: [
      { label: "Get help with this", labelFr: "Être accompagné là-dessus", value: "contact" },
      { label: "Back to start", labelFr: "Revenir au début", value: "start" }
    ]
  },
  result_beginner: {
    id: "result_beginner",
    messages: [
      "You have a blank canvas. That's actually an advantage.",
      "You can build 'AI-First' from day one without fighting decades of legacy debt.",
      "Start by documenting your core processes."
    ],
    messagesFr: [
      "Vous partez d'une page blanche. C'est en réalité un avantage.",
      "Vous pouvez bâtir « IA d'abord » dès le premier jour, sans vous battre contre des décennies de dette technique.",
      "Commencez par documenter vos processus clés.",
    ],
    options: [
      { label: "How can you help?", labelFr: "Comment pouvez-vous aider ?", value: "services" },
      { label: "Back to start", labelFr: "Revenir au début", value: "start" }
    ]
  },
  contact: {
    id: "contact",
    messages: [
      "We're currently taking on a limited number of consulting engagements.",
      "You can book a 15-minute intro chat directly on our calendar."
    ],
    messagesFr: [
      "Nous acceptons actuellement un nombre limité de missions de conseil.",
      "Vous pouvez réserver un premier échange de 15 minutes directement dans notre agenda.",
    ],
    options: [
      { label: "Open Calendar", labelFr: "Ouvrir l'agenda", value: "open_calendar" },
      { label: "Maybe later", labelFr: "Plus tard", value: "start" }
    ]
  },
  services: {
    id: "services",
    messages: [
      "I offer three main services:",
      "1. **Data Audit**: Mapping your knowledge for AI consumption.",
      "2. **Agent Architecture**: Designing the workflows for your AI workforce.",
      "3. **Team Training**: Teaching your humans to manage machines."
    ],
    messagesFr: [
      "Je propose trois prestations principales :",
      "1. **Audit des données** : cartographier votre savoir pour qu'il soit exploitable par l'IA.",
      "2. **Architecture d'agents** : concevoir les flux de travail de vos agents IA.",
      "3. **Formation des équipes** : apprendre à vos collaborateurs à encadrer les machines.",
    ],
    options: [
      { label: "Let's talk", labelFr: "Discutons-en", value: "contact" },
      { label: "Back to start", labelFr: "Revenir au début", value: "start" }
    ]
  }
};
