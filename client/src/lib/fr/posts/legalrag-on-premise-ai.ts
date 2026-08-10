import type { PostFr } from "./index";

export const post: PostFr = {
  content: `Le secret professionnel n'est pas une question de politique interne. C'est une question d'architecture.

Les plateformes d'IA en cloud — si performantes soient-elles — supposent d'envoyer vos données sur les serveurs d'un tiers. Pour des requêtes grand public ou de la rédaction commerciale, le compromis se défend. Pour des pièces couvertes par le secret professionnel dans un contentieux en cours, non. Le risque juridique est réel, les conséquences déontologiques sont sérieuses, et « nous faisons confiance aux conditions d'utilisation du fournisseur » n'est pas une réponse recevable face à une contestation du secret professionnel.

C'est le problème que LegalRAG a été conçu pour résoudre. Et la solution a exigé de repenser l'architecture de fond en comble.

## Amener l'IA aux données

Le modèle habituel de la revue documentaire assistée par IA consiste à envoyer vers le cloud et à récupérer des résultats. Les documents voyagent vers le modèle. LegalRAG inverse complètement ce schéma.

[VISUAL:legalrag-architecture]

Tous les composants s'exécutent sur une seule machine, physiquement située dans les locaux du client : ingestion des documents, OCR, extraction de texte, inférence, recherche vectorielle et stockage. Le système utilise des modèles à poids ouverts exécutés localement via Ollama — aucun appel d'API externe, aucune transmission de données, aucune dépendance au cloud. Le secret professionnel est satisfait par l'architecture, non par un engagement contractuel.

Le matériel est un NVIDIA DGX Spark : une machine compacte mais réellement puissante, dotée d'une superpuce GB10, de 128 Go de mémoire unifiée et d'un stockage NVMe. Elle tient sur un bureau. Elle gère plus de 150 000 documents et des millions de fragments interrogeables. Chaque client dispose de son propre appareil, configuré et déployé dans ses locaux.

## Ce que fait la plateforme

**Ingestion documentaire à grande échelle.** Des fonds documentaires entiers — PDF, documents Word, tableurs, courriels, images, HTML, XML et davantage — sont traités, découpés en passages interrogeables et vectorisés. Un système de points de reprise permet de lancer l'ingestion de nuit et de survivre aux interruptions. Le système retient quelle partie a produit chaque document, conserve les références issues des plateformes d'eDiscovery et maintient la traçabilité de bout en bout.

**Recherche sémantique.** Posez une question en langage courant. Récupérez les passages les plus pertinents de tout le corpus, avec la référence du document source et le numéro de page. Filtrez par partie productrice, type de document, période ou catégorie. Pas de correspondance de mots-clés : une véritable recherche par similarité vectorielle.

**Questions-réponses conversationnelles.** Une interface de dialogue entièrement ancrée dans le corpus documentaire. Chaque réponse cite sa source. L'IA synthétise à partir des passages retrouvés — elle n'invente pas depuis ses propres connaissances. Chaque réponse est traçable jusqu'au document d'origine. L'avocat examine ; l'IA assiste.

**Chronologie interactive.** Une vue chronologique repliable des événements du dossier, extraite des métadonnées : dates de courriels, dates de création, échéances contractuelles. Navigation de l'année au mois puis à l'événement, avec filtrage par type et par partie productrice. Elle fournit une carte chronologique immédiate de l'affaire, sans extraction manuelle.

**OCR et documents numérisés.** Reconnaissance optique de caractères pour les PDF numérisés et les images, avec gestion intelligente de la résolution. Les documents caviardés ou quasi vides sont automatiquement signalés plutôt que silencieusement perdus.

## Pourquoi cela compte pour les équipes juridiques

Le marché de l'IA juridique s'est scindé en deux catégories qui servent mal le cœur de la profession. Les plateformes d'entreprise comme Harvey sont réellement performantes, mais tarifées pour les plus grands cabinets. Les outils d'IA génériques (Claude, ChatGPT, Gemini via leurs interfaces standard) sont abordables mais fonctionnent dans le cloud — inadaptés aux pièces couvertes par le secret professionnel.

LegalRAG est conçu spécifiquement pour les cabinets d'avocats, les structures spécialisées en contentieux et les cabinets de taille intermédiaire de 10 à 100 avocats traitant des dossiers à forte charge documentaire. Fraude, droit de la famille, réglementaire, contentieux commercial : partout où le volume de pièces est un vrai problème et où le cloud est un vrai risque.

## Ce qui arrive

Deux fonctionnalités en cours de développement étendent sensiblement le système.

**Taxonomies sur mesure.** Un constructeur qui permet à l'équipe juridique de définir des grilles de classification propres au dossier : allégations, points en litige, parties, types d'opérations. L'IA classe ensuite chaque document selon la grille de l'avocat, créant des catégories interrogeables qui reflètent la structure réelle de l'affaire plutôt que des types de documents génériques.

**Carte des connaissances.** Un graphe visuel interactif montrant les liens entre documents : parties communes, dates qui se recoupent, renvois, opérations connexes. Les documents en nœuds, les relations en arêtes, dans une visualisation navigable. Elle met au jour, sur de grands ensembles, des régularités qu'une lecture linéaire manquerait entièrement.

## Le principe plus large

LegalRAG est une réponse précise à un problème précis. Mais le principe sous-jacent vaut plus largement : il existe des domaines — le droit, la santé, la défense, la finance — où l'IA en cloud crée des risques que le déploiement sur site supprime. Le matériel permettant d'exécuter localement des modèles performants existe aujourd'hui et devient plus abordable. La question est de savoir si les organisations des secteurs sensibles accepteront de considérer l'architecture de déploiement comme une question de conception de premier ordre, et non comme un détail traité après coup.

Pour les équipes de contentieux, la réponse est de plus en plus évidente. Le seul risque lié au secret professionnel y suffit.`,
};
