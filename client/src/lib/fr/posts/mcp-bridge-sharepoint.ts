import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Un même schéma frustrant se répète dans presque tous les déploiements d'IA que nous voyons. L'équipe découvre que Claude ou ChatGPT peut l'aider dans son travail. Elle se met à copier-coller des données dans la fenêtre de discussion. L'IA donne des conseils utiles. Puis chacun reporte manuellement ces conseils dans SharePoint, Salesforce ou le système qu'il utilisait. Cela fonctionne. Mais c'est de la friction — et c'est dans la friction que meurt l'adoption.

Nous venons d'achever une mission qui supprime entièrement cette friction. Voici comment elle fonctionne, et pourquoi la technologie sous-jacente constitue l'un des basculements discrets les plus importants de l'écosystème de l'IA aujourd'hui.

## Ce qu'est réellement le MCP

MCP signifie Model Context Protocol. C'est une norme ouverte créée par Anthropic, aujourd'hui soutenue par la Linux Foundation, OpenAI, Google DeepMind et d'autres. En bref : c'est une prise universelle qui permet aux assistants IA de se connecter directement à des outils et à des sources de données externes.

[VISUAL:mcp-architecture]

Avant le MCP, chaque intégration entre une IA et un outil était développée sur mesure. Vous recrutiez un développeur, il écrivait une intégration spécifique entre, par exemple, Claude et votre base de données, et quand l'API changeait (elle change toujours), il fallait la mettre à jour. Le MCP normalise le contrat. Une passerelle, construite une fois, fonctionne avec Claude, ChatGPT et toute autre plateforme compatible.

Il existe déjà plus de 500 serveurs MCP couvrant des plateformes comme Slack, Salesforce, GitHub, Google Drive, Jira, PostgreSQL et bien d'autres. L'écosystème croît rapidement, ce qui signifie que l'investissement consenti pour relier vos systèmes au MCP rapporte à mesure que les capacités de l'IA s'étendent.

## La mission : SharePoint et Power Automate

L'équipe opérationnelle de notre client gérait un enchevêtrement de listes SharePoint, de relations de recherche et de flux Power Automate. Elle consacrait un temps considérable à des tâches de gestion de données — interroger des enregistrements, créer et mettre à jour des éléments, dépanner des automatisations défaillantes — que l'IA pouvait traiter en quelques secondes si elle y avait un accès direct.

Nous avons construit une passerelle MCP qui donne précisément cet accès à Claude. Quatre domaines de capacité :

**Listes et structure SharePoint.** L'IA peut créer des listes, ajouter des colonnes de tout type (texte, nombre, recherche, calculée, champs de personne), établir des relations entre listes et inspecter les schémas complets. Ce qui exigeait auparavant de naviguer dans l'interface de SharePoint ou d'écrire des appels à son API REST devient une conversation.

**Gestion des données.** Interroger des éléments avec filtres et tris. Créer, mettre à jour et supprimer des enregistrements. Exécuter des transformations en masse. L'IA construit les bons appels d'API, les exécute et restitue les résultats sous une forme lisible.

**Diagnostic Power Automate.** Lister tous les flux, inspecter leurs définitions, extraire l'historique d'exécution avec le détail des erreurs, et déclencher des flux manuels à la demande. Quand un flux casse à deux heures du matin et qu'il faut comprendre pourquoi, on peut demander plutôt que de fouiller les journaux.

**Documentation à jour.** C'est ce qui a le plus surpris le client. Avant cette passerelle, les réponses de Claude sur l'API Graph de SharePoint ou les connecteurs Power Automate étaient parfois périmées : les modèles avaient été entraînés sur une documentation plus ancienne. Désormais, l'IA consulte la documentation Microsoft en vigueur avant de répondre aux questions techniques. Le gain de justesse a été immédiatement perceptible.

## À quoi ressemble une session

Voici une version condensée d'un échange réel issu de la mission :

*« Liste toutes les listes SharePoint de mon site. »*
Claude renvoie un tableau net : 8 listes trouvées — Tâches, Clients, Projets, Factures, Contacts, Documents, Actifs, Paramètres.

*« Ajoute une colonne de recherche sur Tâches pointant vers la liste Clients. »*
Claude construit le bon appel à l'API Graph, l'exécute et confirme : « Colonne "Client" (recherche → Clients) ajoutée à la liste Tâches. »

*« Montre-moi les 5 dernières exécutions en échec du flux Invoice Sync. »*
Claude extrait l'historique : 5 échecs, l'erreur la plus récente étant un délai de connexion dépassé vers l'API Xero — survenue 3 fois au cours des dernières 24 heures.

La session entière prend quelques minutes. Le travail équivalent, via l'interface de SharePoint et les journaux de Power Automate, aurait occupé une bonne partie d'un après-midi.

## Le point plus large

Le MCP n'est pas une curiosité technique : il marque un changement dans la façon dont l'IA s'intègre. Au lieu que chaque entreprise construise des connexions sur mesure entre ses outils et les modèles, il existe désormais une norme. Le travail de raccordement de vos systèmes devient donc plus simple chaque mois, à mesure que de nouvelles plateformes proposent une prise en charge native.

Les entreprises qui prendront de l'avance ne sont pas celles qui ont les plus gros budgets. Ce sont celles qui repèrent où leurs équipes perdent du temps à déplacer des données et à passer d'un outil à l'autre, et qui suppriment méthodiquement cette friction.

Si vous vous demandez si le MCP a du sens pour une plateforme précise de votre environnement, l'échange de cadrage prend généralement une trentaine de minutes. La plupart des passerelles se construisent et se configurent en un à trois jours.`,
};
