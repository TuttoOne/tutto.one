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
    "Source : Anthropic Economic Index, parts approximatives, d'après les travaux publiés",

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
    "Source : Anthropic Economic Index, valeurs indicatives, illustrant l'ordre relatif rapporté par l'étude",

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
    "Source : Anthropic Economic Index, d'après la classification des tâches sur un échantillon de conversations",

  // Capability gap
  "Radar chart: Theoretical AI capability vs observed AI usage by occupational category":
    "Graphique en radar : capacité théorique de l'IA comparée à son usage observé, par catégorie professionnelle",
  "Source: Anthropic Economic Index - theoretical AI coverage (blue) vs observed AI usage (red) by occupational category":
    "Source : Anthropic Economic Index, couverture théorique de l'IA (en bleu) comparée à l'usage observé (en rouge), par catégorie professionnelle",

  // MCP architecture
  "How MCP connects AI to your business tools":
    "Comment le MCP relie l'IA à vos outils métier",
  "open standard": "norme ouverte",
  "Model Context Protocol": "Model Context Protocol",
  "One standard protocol - one bridge - works across all MCP-compatible AI platforms":
    "Un protocole normalisé, une seule passerelle, qui fonctionne avec toutes les plateformes compatibles MCP",

  // LegalRAG architecture
  "System architecture - everything runs on-premise":
    "Architecture du système : tout s'exécute sur site",
  "Zero data leaves the device": "Aucune donnée ne quitte l'appareil",
  "Each client receives their own DGX Spark unit, deployed and configured on-premises by Tutto":
    "Chaque client reçoit son propre appareil DGX Spark, déployé et configuré sur site par Tutto",
  Interface: "Interface",
  "AI & Search": "IA et recherche",
  Data: "Données",
  Hardware: "Matériel",

  // Jev: decision flow
  "One incoming email, three decisions": "Un e-mail entrant, trois décisions",
  "1 · You send the context": "1 · Vous envoyez le contexte",
  "The email itself, the sender's address, any attachment names, and a line saying what your business does.":
    "L'e-mail lui-même, l'adresse de l'expéditeur, le nom des pièces jointes et une ligne qui décrit votre activité.",
  "2 · You ask fixed questions, it picks from your answers":
    "2 · Vous posez des questions fermées, il choisit parmi vos réponses",
  "What kind of email is this?": "De quel type d'e-mail s'agit-il ?",
  "New enquiry · Support · Invoice · Spam": "Nouvelle demande · Support · Facture · Spam",
  Support: "Support",
  "How urgent is it?": "Quelle est l'urgence ?",
  "1 Can wait · 2 This week · 3 Today · 4 Now": "1 Peut attendre · 2 Cette semaine · 3 Aujourd'hui · 4 Tout de suite",
  "3 Today": "3 Aujourd'hui",
  "Is the sender an existing client?": "L'expéditeur est-il déjà client ?",
  "Yes or no": "Oui ou non",
  Yes: "Oui",
  "3 · Your software decides what happens, based on confidence":
    "3 · Votre logiciel décide de la suite, selon la confiance",
  "Act automatically": "Agir automatiquement",
  "Act, but flag for a check": "Agir, mais signaler pour vérification",
  "Hand it to a person": "Confier à une personne",
  "Illustrative example. Answer types and confidence bands follow TypeSafe's documentation; set your own thresholds on your own data.":
    "Exemple illustratif. Les types de réponse et les seuils de confiance suivent la documentation de TypeSafe ; fixez vos propres seuils sur vos propres données.",

  // Jev: four kinds of tool
  "Four jobs, four kinds of tool": "Quatre tâches, quatre types d'outils",
  Writes: "Rédige",
  Acts: "Agit",
  Chooses: "Choisit",
  Calculates: "Calcule",
  Assistant: "Assistant",
  Agent: "Agent",
  "Decision model": "Modèle de décision",
  "Plain code": "Code classique",
  "Drafts the reply to a client": "Rédige la réponse à un client",
  "Books the meeting and updates the CRM": "Planifie le rendez-vous et met à jour le CRM",
  "Decides which inbox the email belongs in": "Décide dans quelle boîte va l'e-mail",
  "Adds up the invoice and checks the due date": "Additionne la facture et vérifie l'échéance",
  "Most useful systems combine all four. The mistake is asking one of them to do another's job.":
    "Les systèmes les plus utiles combinent les quatre. L'erreur, c'est de demander à l'un de faire le travail d'un autre.",

  // Jev: SME fit map
  "Everyday small-business decisions: is a decision model the right tool?":
    "Décisions courantes en petite entreprise : un modèle de décision est-il le bon outil ?",
  "Sorting the shared inbox": "Trier la boîte e-mail partagée",
  "Qualifying website enquiries": "Qualifier les demandes reçues via le site",
  "Matching a question to the right help article": "Associer une question au bon article d'aide",
  "Spotting an unusual clause in a supplier contract": "Repérer une clause inhabituelle dans un contrat fournisseur",
  "Checking an invoice total or VAT": "Vérifier le total d'une facture ou la TVA",
  "Writing a proposal": "Rédiger une offre",
  "Approving a large discount": "Accorder une remise importante",
  Strong: "Oui",
  Partial: "En partie",
  No: "Non",
  "Decision model flags, a person reads": "Le modèle signale, une personne lit",
  "A person decides": "Une personne décide",
  "Tutto's assessment for typical small-business workflows.":
    "Évaluation de Tutto pour des processus typiques de petite entreprise.",

  // Jev: pitfalls
  "Six mistakes to avoid": "Six erreurs à éviter",
  "Asking it to count, add up or compare dates": "Lui demander de compter, d'additionner ou de comparer des dates",
  "Do the maths in code and send it the result.": "Faites le calcul dans le code et envoyez-lui le résultat.",
  "Sending everything you have": "Tout lui envoyer",
  "Send only what a colleague would need. Extra noise lowers accuracy.":
    "N'envoyez que ce dont un collègue aurait besoin. Le bruit en trop fait baisser la précision.",
  "No way to say \"none of these\"": "Aucun moyen de répondre « aucune de ces options »",
  "Add an \"other\" or \"not sure\" answer so it isn't forced to guess.":
    "Ajoutez une réponse « autre » ou « incertain » pour qu'il ne soit pas forcé de deviner.",
  "One question doing two jobs": "Une question qui en cache deux",
  "Split it into two questions and combine the answers in your software.":
    "Séparez-la en deux questions et combinez les réponses dans votre logiciel.",
  "Copying someone else's thresholds": "Copier les seuils de quelqu'un d'autre",
  "Set your own cut-offs on a few hundred of your own labelled examples.":
    "Fixez vos propres seuils sur quelques centaines de vos exemples étiquetés.",
  "Letting the model version float": "Laisser la version du modèle changer toute seule",
  "Pin the exact version and re-test before you upgrade.":
    "Figez la version exacte et refaites vos tests avant de passer à la suivante.",
  "Based on TypeSafe's published notes on where Jev 1.13 is weak, and on our own practice.":
    "D'après les notes publiées par TypeSafe sur les points faibles de Jev 1.13, et notre propre pratique.",

  // Bias: not an isolated case
  "Four sectors, the same gap in the data": "Quatre secteurs, le même manque dans les données",
  Recruitment: "Recrutement",
  Dermatology: "Dermatologie",
  "Face recognition": "Reconnaissance faciale",
  Diagnosis: "Diagnostic",
  "10 years": "10 ans",
  "Light skin": "Peaux claires",
  "0.8% and 34.7%": "0,8 % et 34,7 %",
  "22%": "22 %",
  "of mostly male CVs trained Amazon's sorting tool. It marked women's applications down (2015 to 2018).":
    "de CV majoritairement masculins ont entraîné l'outil de tri d'Amazon. Il pénalisait les candidatures féminines (2015 à 2018).",
  "is what skin cancer models learned from. They do worse on dark skin (Daneshjou et al., 2021).":
    "c'est sur elles que les modèles de détection du cancer de la peau ont appris. Ils sont moins performants sur peaux foncées (Daneshjou et al., 2021).",
  "The error rate for light-skinned men and for dark-skinned women (Gender Shades, MIT, 2018).":
    "Le taux d'erreur pour les hommes à peau claire et pour les femmes à peau foncée (Gender Shades, MIT, 2018).",
  "of cases where GPT-4o was less accurate for women, across 10,000 clinical prompts (2025 study).":
    "des cas où GPT-4o était moins précis pour les femmes, sur 10 000 prompts cliniques (étude de 2025).",
  "Figures as presented by Céline Chantry-Daron, Toulouse, 2 October 2026.":
    "Chiffres présentés par Céline Chantry-Daron, Toulouse, 2 octobre 2026.",

  // Bias: AI Act deadlines
  "AI Act: the next deadlines": "AI Act : les prochaines échéances",
  "2 August 2026": "2 août 2026",
  "2 December 2026": "2 décembre 2026",
  "2 December 2027": "2 décembre 2027",
  "2 August 2028": "2 août 2028",
  "Already applies": "Déjà applicable",
  Transparency: "Transparence",
  "End of the transition": "Fin de la transition",
  "High risk, Annex III": "Haut risque, annexe III",
  "High risk, Annex I": "Haut risque, annexe I",
  "Obligations for certain AI systems and for content generated or changed by AI (Article 50).":
    "Obligations pour certains systèmes d'IA et pour les contenus générés ou modifiés par IA (article 50).",
  "Article 50(2) for systems already on the market, and the new prohibitions in Article 5.":
    "Article 50(2) pour les systèmes déjà sur le marché, et les nouvelles interdictions de l'article 5.",
  "Biometrics, critical infrastructure, education, employment, essential services including credit, law enforcement, migration and justice.":
    "Biométrie, infrastructures critiques, éducation, emploi, services essentiels dont le crédit, forces de l'ordre, migration et justice.",
  "AI built into products that are already regulated, including some medical devices.":
    "IA intégrée à des produits déjà réglementés, dont certains dispositifs médicaux.",
  "Compliance is built in from the design, long before the date it applies.":
    "La conformité se construit dès la conception, bien avant la date d'application.",
  "Dates from the speaker's slide: Article 113 of the AI Act, as amended by Regulation (EU) 2026/1744 of 8 July 2026 (the Digital Omnibus on AI).":
    "Dates tirées de la diapositive de l'intervenante : article 113 de l'AI Act, tel que modifié par le règlement (UE) 2026/1744 du 8 juillet 2026 (le Digital Omnibus on AI).",
};
