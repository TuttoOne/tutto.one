/**
 * French overlay for the portfolio entries, keyed by entry name.
 *
 * Kept separate from the entry data so the English source stays readable and a
 * translator has one file to work in. Anything absent here falls back to the
 * English, so a new entry appears immediately rather than disappearing.
 *
 * Example conversations are deliberately NOT translated: they are transcripts
 * of machine output over English-language documents, and translating a quoted
 * record would misrepresent what the system actually returned.
 */
export type PortfolioFr = {
  tagline?: string;
  badge?: string;
  description?: string;
  urlLabel?: string;
  capabilities?: Record<string, { title: string; detail: string }>;
  /** Captions under the product screenshots, in source order. */
  screenshotLabels?: string[];
};

export const PORTFOLIO_FR: Record<string, PortfolioFr> = {
  Pythia: {
    tagline: "IA sur site · Intelligence documentaire juridique",
    badge: "Mission client",
    description:
      "Une plateforme d'intelligence documentaire auto-hébergée pour le contentieux et la revue juridique, bâtie sur du matériel NVIDIA DGX Spark. Elle traite localement des fonds documentaires entiers : recherche sémantique, questions-réponses avec citations, chronologies interactives et OCR. Aucune donnée ne quitte l'appareil, ce qui satisfait le secret professionnel par conception.",
    urlLabel: "En savoir plus sur Pythia",
    capabilities: {
      "Document Ingestion at Scale": {
        title: "Ingestion documentaire à grande échelle",
        detail:
          "Plus de 150 000 fichiers, tous formats confondus (PDF, DOCX, MSG, EML, XLSX, TIF et autres). Le traitement par points de reprise résiste aux interruptions.",
      },
      "Semantic Search & RAG Q&A": {
        title: "Recherche sémantique et questions-réponses",
        detail:
          "Posez vos questions en langage courant. Chaque réponse cite le document source et le numéro de page — aucune invention tirée des connaissances propres du modèle.",
      },
      "Interactive Timeline": {
        title: "Chronologie interactive",
        detail:
          "Vue chronologique des événements du dossier, extraite des métadonnées. Naviguez de l'année au mois puis à l'événement, avec filtrage par partie productrice.",
      },
      "Complete On-Premise Privacy": {
        title: "Confidentialité totale, sur site",
        detail:
          "OCR, inférence, recherche vectorielle et stockage s'exécutent localement sur le DGX Spark. Aucune API cloud. Le secret professionnel est satisfait par l'architecture.",
      },
    },
  },

  "MCP Bridge - SharePoint & Power Automate": {
    tagline: "Model Context Protocol · Mission de conseil",
    badge: "Mission client",
    description:
      "Nous avons construit une passerelle MCP (Model Context Protocol) qui donne à Claude un accès direct à l'environnement SharePoint et aux flux Power Automate d'un client. Au lieu de copier-coller des données dans une conversation, l'équipe peut demander à l'IA d'interroger, de créer et de mettre à jour des enregistrements SharePoint — et de diagnostiquer les automatisations défaillantes — en langage naturel.",
    urlLabel: "Qu'est-ce que le MCP ?",
    capabilities: {
      "SharePoint Lists & Structure": {
        title: "Listes et structure SharePoint",
        detail:
          "Créer des listes, ajouter des colonnes de tout type, modéliser les relations entre entités, inspecter les schémas complets.",
      },
      "Data Management": {
        title: "Gestion des données",
        detail:
          "Interroger les éléments avec filtres et tris, créer, mettre à jour et supprimer des enregistrements, exécuter des transformations en masse.",
      },
      "Power Automate": {
        title: "Power Automate",
        detail:
          "Lister les flux, inspecter leurs définitions, consulter l'historique d'exécution avec diagnostic des erreurs, déclencher des flux manuels.",
      },
      "Live Documentation": {
        title: "Documentation à jour",
        detail:
          "L'IA consulte la documentation Microsoft en vigueur avant de répondre — pas de conseils d'API périmés ou inventés.",
      },
    },
  },

  EntityVault: {
    description:
      "Une plateforme de gestion des entités pensée d'abord pour la confidentialité : stockage tokenisé, demandes de collaboration et recherche d'entités. Conçue pour les organisations qui prennent la protection des données au sérieux.",
    screenshotLabels: ["Accueil", "Mes entités", "Demandes de collaboration"],
  },

  "AI ROI Portal": {
    description:
      "Un tableau de bord de conseil pour suivre le retour sur investissement de l'adoption de l'IA, les indicateurs d'usage, les jalons de projet et les économies réalisées. Il aide les équipes à mesurer l'impact réel de l'automatisation.",
    screenshotLabels: ["Tableau de bord ROI", "Suivi de l'usage de l'IA", "Projets"],
  },
};
