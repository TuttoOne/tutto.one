import type { FrDict } from "../page-fr";

/** French for the LegalRAG page, keyed on the English string. */
export const LEGALRAG_FR: FrDict = {
  "On-Premise AI Document Intelligence for Legal":
    "Intelligence documentaire sur site pour les métiers du droit",
  "A self-hosted document intelligence platform built for litigation and legal review. All processing, AI inference, and storage stays on your hardware. No data ever leaves the device.":
    "Une plateforme d'intelligence documentaire auto-hébergée, conçue pour le contentieux et la revue juridique. Traitement, inférence et stockage restent sur votre matériel. Aucune donnée ne quitte l'appareil.",

  "The Problem": "Le problème",
  "Cloud AI creates unacceptable risk for privileged material. Manual review of large disclosure sets is prohibitively slow.":
    "L'IA en cloud fait courir un risque inacceptable aux pièces couvertes par le secret professionnel. La revue manuelle de grands fonds documentaires est d'une lenteur rédhibitoire.",
  Capabilities: "Fonctionnalités",
  "What it does": "Ce que fait la plateforme",
  Differentiators: "Points distinctifs",
  "What makes it different": "Ce qui la distingue",
  Roadmap: "Feuille de route",
  "Planned features": "Fonctionnalités prévues",
  "Custom Taxonomies": "Taxonomies sur mesure",
  "Knowledge Map": "Carte des connaissances",
  "Technology Stack": "Socle technique",
  "Who it's for": "À qui elle s'adresse",
  "Deployment Model": "Modèle de déploiement",
  "Built by Humanity³": "Réalisé par Humanity³",
  "A division of Tutto Products and Services":
    "Une division de Tutto Products and Services",

  "Document Ingestion at Scale": "Ingestion documentaire à grande échelle",
  "Processes entire disclosure sets — hundreds of thousands of files. PDF, DOCX, XLSX, MSG, EML, PPTX, HTML, CSV, XML, TIF, JPG and more. Each document is extracted, chunked, and embedded for semantic search. A checkpoint system allows ingestion to be paused and resumed at any point.":
    "Traite des fonds documentaires entiers — des centaines de milliers de fichiers. PDF, DOCX, XLSX, MSG, EML, PPTX, HTML, CSV, XML, TIF, JPG et davantage. Chaque document est extrait, découpé et vectorisé pour la recherche sémantique. Un système de points de reprise permet d'interrompre et de relancer l'ingestion à tout moment.",
  "Semantic Search": "Recherche sémantique",
  "Natural language search across the entire corpus using vector similarity. Retrieve the most relevant passages with citations to specific source documents and page numbers. Filter by disclosure side, document type, date range, or custom categories.":
    "Recherche en langage naturel sur l'ensemble du corpus, par similarité vectorielle. Les passages les plus pertinents sont restitués avec la référence du document source et le numéro de page. Filtrage par partie productrice, type de document, période ou catégories personnalisées.",
  "Conversational Q&A": "Questions-réponses conversationnelles",
  "A chat interface grounded in the document corpus. Questions are answered with citations to source material — the AI synthesises answers from retrieved passages rather than generating from its own knowledge. Every answer is traceable to the original documents.":
    "Une interface de dialogue ancrée dans le corpus documentaire. Les réponses citent les pièces d'origine : l'IA synthétise à partir des passages retrouvés, et non à partir de ses propres connaissances. Chaque réponse est traçable jusqu'aux documents sources.",
  "Interactive Timeline": "Chronologie interactive",
  "A collapsible chronological view of case events extracted from document metadata — email dates, creation dates, contractual deadlines. Drill down from year to month to individual events. Filter by event type and disclosure side.":
    "Une vue chronologique repliable des événements du dossier, extraite des métadonnées : dates de courriels, dates de création, échéances contractuelles. Navigation de l'année au mois puis à l'événement. Filtrage par type d'événement et par partie productrice.",
  "OCR for Scanned Documents": "OCR pour les documents numérisés",
  "Optical character recognition for scanned PDFs and image files, with intelligent DPI management and low-content detection. Documents that are redacted or contain minimal text are automatically tagged rather than lost.":
    "Reconnaissance optique de caractères pour les PDF numérisés et les images, avec gestion intelligente de la résolution et détection des documents peu fournis. Les pièces caviardées ou quasi vides sont automatiquement signalées plutôt que perdues.",

  "Complete Privacy by Design": "Confidentialité totale dès la conception",
  "Every component runs on a single device. OCR, text extraction, AI inference, vector search, and storage — all on-premise. No cloud APIs, no external model providers, no data transmission. Satisfies Legal Professional Privilege requirements by architectural design, not policy promise.":
    "Tous les composants s'exécutent sur une seule machine. OCR, extraction de texte, inférence, recherche vectorielle et stockage : tout sur site. Aucune API cloud, aucun fournisseur de modèle externe, aucune transmission de données. Les exigences du secret professionnel sont satisfaites par l'architecture, non par un engagement de politique interne.",
  "Built for Legal Workflows": "Conçu pour les processus juridiques",
  "The system understands disclosure structure — it tracks which side produced each document, preserves document reference IDs from eDiscovery platforms, and maintains the chain of custody from production to search result.":
    "Le système comprend la structure de la production de pièces : il retient quelle partie a produit chaque document, conserve les références issues des plateformes d'eDiscovery et maintient la chaîne de traçabilité, de la production au résultat de recherche.",
  "Scale Without Compromise": "Passer à l'échelle sans concession",
  "Handles 150,000+ documents with millions of searchable chunks. Checkpoint-based processing means ingestion can run overnight and survive interruptions. Resource monitoring prevents the system from overloading the hardware.":
    "Gère plus de 150 000 documents et des millions de fragments interrogeables. Le traitement par points de reprise permet de lancer l'ingestion de nuit et de survivre aux interruptions. La surveillance des ressources évite de saturer le matériel.",
  "Transparency Over Trust": "La transparence plutôt que la confiance aveugle",
  "Every search result cites its source. Every timeline event links to its document. The AI assists the lawyer's review — it does not replace the lawyer's judgment.":
    "Chaque résultat de recherche cite sa source. Chaque événement de la chronologie renvoie à son document. L'IA assiste la revue de l'avocat ; elle ne remplace pas son jugement.",

  Hardware: "Matériel",
  "AI Models": "Modèles d'IA",
  Database: "Base de données",
  Security: "Sécurité",
  Access: "Accès",

  "Barristers and chambers handling document-heavy commercial litigation":
    "Avocats et cabinets traitant des contentieux commerciaux à forte charge documentaire",
  "Law firms with privacy-sensitive practices — fraud, family, regulatory":
    "Cabinets aux dossiers sensibles : fraude, droit de la famille, réglementaire",
  "Any legal team that needs AI-powered document review but cannot use cloud platforms":
    "Toute équipe juridique qui a besoin d'une revue documentaire assistée par IA mais ne peut recourir au cloud",
  "Mid-market firms (10-100 lawyers) priced out of enterprise platforms like Harvey":
    "Cabinets de taille intermédiaire (10 à 100 avocats) pour qui les plateformes d'entreprise comme Harvey sont hors de prix",

  "Legal teams handling large-scale disclosure face a fundamental tension: cloud AI platforms offer powerful document analysis, but sending privileged case material to external servers creates unacceptable risks under Legal Professional Privilege, GDPR, and professional conduct rules. LegalRAG eliminates this tension. It brings the AI to the data, not the data to the AI.":
    "Les équipes juridiques qui traitent de vastes productions de pièces font face à une tension de fond : les plateformes d'IA en cloud offrent une analyse documentaire puissante, mais transmettre à des serveurs externes des pièces couvertes par le secret professionnel crée des risques inacceptables au regard du secret professionnel, du RGPD et des règles déontologiques. LegalRAG supprime cette tension : il amène l'IA aux données, et non les données à l'IA.",
  "A taxonomy builder that allows the legal team to define case-specific classification frameworks — allegations, issues, parties, transaction types. The AI classifies every document against the lawyer's own framework, creating bespoke searchable categories that reflect how the case is actually structured.":
    "Un constructeur de taxonomies qui permet à l'équipe juridique de définir des grilles de classification propres au dossier : allégations, points en litige, parties, types d'opérations. L'IA classe chaque document selon la grille de l'avocat, créant des catégories interrogeables sur mesure qui reflètent la structure réelle de l'affaire.",
  "An interactive visual graph showing connections between documents — shared parties, overlapping dates, cross-references, related transactions. Documents as nodes, relationships as edges, rendered as a navigable hub-and-spoke visualisation. Surfaces patterns across large document sets that linear review would miss.":
    "Un graphe visuel interactif montrant les liens entre documents : parties communes, dates qui se recoupent, renvois, opérations connexes. Les documents en nœuds, les relations en arêtes, dans une visualisation navigable en étoile. Il met au jour, sur de grands ensembles, des régularités qu'une lecture linéaire laisserait passer.",
  "Each client receives their own DGX Spark unit, configured and deployed at their premises. The system is self-contained — no ongoing cloud dependency. Setup, ingestion, and training are handled as a managed service.":
    "Chaque client reçoit son propre appareil DGX Spark, configuré et déployé dans ses locaux. Le système est autonome, sans dépendance permanente au cloud. L'installation, l'ingestion et la formation sont assurées en service géré.",
  "LegalRAG is a specific answer to a specific problem. The underlying principle applies broadly: there are domains where cloud AI creates risks that on-premise deployment eliminates. The hardware to run capable AI models locally exists now — and is becoming more affordable. The question is whether organisations in sensitive sectors are willing to treat deployment architecture as a first-order design question, not an afterthought.":
    "LegalRAG est une réponse précise à un problème précis. Le principe sous-jacent vaut largement : il existe des domaines où l'IA en cloud crée des risques que le déploiement sur site supprime. Le matériel permettant d'exécuter localement des modèles performants existe aujourd'hui, et devient plus abordable. La question est de savoir si les organisations des secteurs sensibles accepteront de traiter l'architecture de déploiement comme une question de conception de premier ordre, et non comme un détail traité après coup.",
};
