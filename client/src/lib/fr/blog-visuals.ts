import type { FrDict } from "../page-fr";

/**
 * French for the diagrams embedded in blog articles — the charts the
 * [VISUAL:...] markers place. Without these, a translated article still
 * rendered its illustrations in English.
 */
export const BLOG_VISUALS_FR: FrDict = {
  // Task breakdown
  "Share of Claude conversations by task category":
    "Part des conversations avec Claude par catégorie de tâche",
  "Software & Coding": "Logiciel et développement",
  "Writing & Editing": "Rédaction et révision",
  "Data & Analysis": "Données et analyse",
  "Research & Learning": "Recherche et apprentissage",
  "Creative Work": "Travail créatif",
  "Business & Finance": "Gestion et finance",
  Other: "Autres",
  "Source: Anthropic Economic Index - approximate shares based on published research":
    "Source : Anthropic Economic Index — parts approximatives, d'après les travaux publiés",

  // Wage exposure
  "AI exposure index by wage quartile (higher = more exposure)":
    "Indice d'exposition à l'IA par quartile de revenu (plus élevé = plus exposé)",
  "Top 25%\n(>$80k)": "25 % supérieurs\n(> 80 k$)",
  "50–75%\n($50–80k)": "50–75 %\n(50–80 k$)",
  "25–50%\n($30–50k)": "25–50 %\n(30–50 k$)",
  "Bottom 25%\n(<$30k)": "25 % inférieurs\n(< 30 k$)",
  "Software engineers, lawyers, analysts": "Ingénieurs logiciel, avocats, analystes",
  "Nurses, technicians, educators": "Personnel soignant, techniciens, enseignants",
  "Admin assistants, sales reps": "Assistants administratifs, commerciaux",
  "Retail, food service, manual labour": "Commerce, restauration, travail manuel",
  "Source: Anthropic Economic Index - index values are illustrative of relative ordering reported in research":
    "Source : Anthropic Economic Index — valeurs indicatives, illustrant l'ordre relatif rapporté par l'étude",

  // Augmentation vs automation
  "How AI is being used: augmentation vs automation":
    "Comment l'IA est utilisée : assistance ou automatisation",
  Augmentation: "Assistance",
  "AI assists the human - the person remains in control and directs the output":
    "L'IA épaule l'humain : la personne garde la main et oriente le résultat",
  Automation: "Automatisation",
  "AI handles the task end-to-end with minimal ongoing human direction":
    "L'IA traite la tâche de bout en bout, avec une intervention humaine minimale",
  "Source: Anthropic Economic Index - based on task classification across sampled conversations":
    "Source : Anthropic Economic Index — d'après la classification des tâches sur un échantillon de conversations",

  // Capability gap
  "Radar chart: Theoretical AI capability vs observed AI usage by occupational category":
    "Graphique en radar : capacité théorique de l'IA comparée à son usage observé, par catégorie professionnelle",
  "Source: Anthropic Economic Index - theoretical AI coverage (blue) vs observed AI usage (red) by occupational category":
    "Source : Anthropic Economic Index — couverture théorique de l'IA (en bleu) comparée à l'usage observé (en rouge), par catégorie professionnelle",

  // MCP architecture
  "How MCP connects AI to your business tools":
    "Comment le MCP relie l'IA à vos outils métier",
  "open standard": "norme ouverte",
  "Model Context Protocol": "Model Context Protocol",
  "One standard protocol - one bridge - works across all MCP-compatible AI platforms":
    "Un protocole normalisé, une seule passerelle, qui fonctionne avec toutes les plateformes compatibles MCP",

  // LegalRAG architecture
  "System architecture - everything runs on-premise":
    "Architecture du système — tout s'exécute sur site",
  "Zero data leaves the device": "Aucune donnée ne quitte l'appareil",
  "Each client receives their own DGX Spark unit, deployed and configured on-premises by Tutto":
    "Chaque client reçoit son propre appareil DGX Spark, déployé et configuré sur site par Tutto",
  Interface: "Interface",
  "AI & Search": "IA et recherche",
  Data: "Données",
  Hardware: "Matériel",
};
