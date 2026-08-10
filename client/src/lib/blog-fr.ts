/**
 * French overlay for blog posts, keyed by slug.
 *
 * Posts are database rows rather than page copy, so the listing text cannot be
 * translated the way the rest of the site is. Rather than add locale columns to
 * the schema — which would need a migration and a second editing surface in the
 * admin — the listing text is overlaid here at render.
 *
 * Anything missing falls back to English, so a newly published post appears in
 * both languages immediately instead of vanishing from the French listing.
 *
 * NOTE: this covers the listing only — title, standfirst, date and read time.
 * Article bodies are still served in English in both locales.
 */
export type BlogFr = {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
};

export const BLOG_FR: Record<string, BlogFr> = {
  "the-best-combination": {
    title: "La meilleure combinaison",
    excerpt:
      "Un principe. Pourquoi l'humain plus la machine reste toujours la meilleure combinaison — et pourquoi abaisser les barrières autant que possible est le seul choix logique.",
    date: "5 juin 2026",
    readTime: "4 min de lecture",
  },
  "machine-readable-knowledge": {
    title: "Rendre le savoir lisible par la machine",
    excerpt:
      "Brian Madden a bâti un système de connaissances public qui permet à l'IA de puiser dans sa pensée en temps réel. La même méthode est au cœur de Praxis — et le mérite lui revient.",
    date: "4 juin 2026",
    readTime: "4 min de lecture",
  },
  "praxis-closed-loop": {
    title: "Le podcast qui a clarifié la raison d'être de Praxis",
    excerpt:
      "Un article de Lenny's Newsletter m'a fait comprendre pourquoi la plupart des formations à l'IA échouent. La réponse était déjà dans la conception de Praxis — je ne l'avais simplement pas énoncée assez clairement.",
    date: "2 juin 2026",
    readTime: "5 min de lecture",
  },
  "glasswing-security-threshold": {
    title: "L'IA a franchi le seuil de la sécurité. Pas votre cycle de correctifs.",
    excerpt:
      "Le projet Glasswing d'Anthropic a analysé plus de 1 000 projets open source et relevé 6 202 vulnérabilités critiques ou élevées, avec 90 % de précision. Le problème n'est pas la détection, mais le délai de correction.",
    date: "27 mai 2026",
    readTime: "5 min de lecture",
  },
  "important-steps-ai-journey": {
    title: "Les étapes qui comptent dans tout parcours vers l'IA",
    excerpt:
      "Avant que les outils n'aient de l'importance, le savoir doit être en place. Trois choses à faire, à peu près dans cet ordre, dans toute adoption sérieuse de l'IA.",
    date: "20 mai 2026",
    readTime: "4 min de lecture",
  },
  "legalrag-on-premise-ai": {
    title: "LegalRAG : l'IA sur site pour les contentieux à forte charge documentaire",
    excerpt:
      "Comment nous avons construit une plateforme d'intelligence documentaire auto-hébergée qui offre aux équipes contentieux une revue assistée par IA, sans qu'un seul octet couvert par le secret professionnel ne quitte le bâtiment.",
    date: "1 avril 2026",
    readTime: "7 min de lecture",
  },
  "mcp-bridge-sharepoint": {
    title: "Comment nous avons donné à Claude un accès direct au SharePoint d'un client",
    excerpt:
      "Une présentation concrète du MCP — la norme ouverte qui transforme discrètement la façon dont l'IA se connecte aux outils métier — et d'une mission réelle où nous l'avons mise en œuvre.",
    date: "28 mars 2026",
    readTime: "6 min de lecture",
  },
  "anthropic-labor-market-research": {
    title: "Ce que l'étude d'Anthropic sur le marché du travail dit de la maturité face à l'IA",
    excerpt:
      "L'étude de référence d'Anthropic, portant sur un million de conversations avec l'IA, révèle quels métiers y sont le plus exposés — et ce que les entreprises devraient en faire.",
    date: "14 mars 2026",
    readTime: "7 min de lecture",
  },
};
