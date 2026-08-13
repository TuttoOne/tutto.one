/**
 * Site copy in English and French, kept in one place so a translator can work
 * from a single file without touching components.
 *
 * The French is not a gloss of the English. Where the English is idiomatic
 * ("shelfware", "the messy middle") the French says the same thing the way it
 * would be said in French, rather than tracking the English word order.
 *
 * `**double asterisks**` mark emphasis; render with <Rich> so translators do
 * not have to write JSX.
 */
import { usePreferences, type Locale } from "./preferences";

/**
 * The tab title every page restores on unmount. It had been written out by hand
 * in eight files, which is how it stayed on the old "AI Consulting" wording long
 * after the positioning moved on; keep it here so the next rename is one edit.
 */
export const SITE_TITLE = "Tutto | Applied AI";

export const copy = {
  nav: {
    about: { en: "About", fr: "À propos" },
    services: { en: "Services", fr: "Prestations" },
    work: { en: "Work", fr: "Réalisations" },
    praxis: { en: "Praxis", fr: "Praxis" },
    pythia: { en: "Pythia", fr: "Pythia" },
    thinking: { en: "Thinking", fr: "Réflexions" },
    contact: { en: "Contact", fr: "Contact" },
    home: { en: "Tutto — home", fr: "Tutto — accueil" },
    menu: { en: "Toggle menu", fr: "Ouvrir le menu" },
  },

  common: {
    bookCall: { en: "Book a 30-minute call", fr: "Réserver un appel de 30 minutes" },
    bookConversation: { en: "Book a conversation", fr: "Réserver un échange" },
    bookSession: { en: "Book a session", fr: "Réserver une séance" },
    sendMessage: { en: "Send a message", fr: "Envoyer un message" },
    aboutUs: { en: "About us", fr: "À propos" },
    ourWork: { en: "Our work", fr: "Nos réalisations" },
    seePortfolio: { en: "See the wider portfolio", fr: "Voir l'ensemble des réalisations" },
    onTheName: { en: "On the name", fr: "À propos du nom" },
    readyToTalk: { en: "Ready to talk?", fr: "Envie d'en parler ?" },
  },

  about: {
    title: { en: "About", fr: "À propos" },
    standfirst: {
      en: "A small team with laser focus on your problems.",
      fr: "Une petite équipe entièrement concentrée sur vos problèmes.",
    },
    ctaBody: {
      en: "30 minutes. We'll tell you honestly what we think.",
      fr: "Trente minutes. Nous vous dirons honnêtement ce que nous en pensons.",
    },
    personalEyebrow: { en: "The person behind it", fr: "La personne derrière" },
    personalTitle: { en: "About me", fr: "À propos de moi" },
    personalBody: {
      en: "How I got here, how I work, and how to reach me.",
      fr: "Mon parcours, ma façon de travailler, et comment me joindre.",
    },
  },

  contact: {
    label: { en: "Get in touch", fr: "Me contacter" },
    address: { en: "Address", fr: "Adresse" },
    phone: { en: "Telephone", fr: "Téléphone" },
    email: { en: "Email", fr: "Courriel" },
    title: { en: "Get in Touch", fr: "Nous contacter" },
    bookLabel: { en: "Book a call", fr: "Réserver un appel" },
    bookSub: { en: "Book a 15-min intro", fr: "Réserver une présentation de 15 min" },
    location: { en: "Location", fr: "Implantation" },
    locationValue: {
      en: "Scotland, London, France, South Africa (remote friendly)",
      fr: "Écosse, Londres, France, Afrique du Sud (travail à distance)",
    },
    sent: { en: "Message sent", fr: "Message envoyé" },
    sentBody: { en: "We'll get back to you soon.", fr: "Nous vous répondrons rapidement." },
    sendError: {
      en: "Failed to send message. Please try again.",
      fr: "L'envoi du message a échoué. Veuillez réessayer.",
    },
    fieldName: { en: "Name", fr: "Nom" },
    fieldEmail: { en: "Email", fr: "Courriel" },
    fieldMessage: { en: "Message", fr: "Message" },
    phName: { en: "Jane Doe", fr: "Marie Dupont" },
    phEmail: { en: "jane@company.com", fr: "marie@entreprise.fr" },
    phMessage: {
      en: "Tell me about your project...",
      fr: "Parlez-moi de votre projet…",
    },
    submit: { en: "Send message", fr: "Envoyer le message" },
    sending: { en: "Sending...", fr: "Envoi en cours…" },
  },

  portfolio: {
    title: { en: "Portfolio", fr: "Réalisations" },
    standfirst: {
      en: "Systems we've designed and built - from concept to production.",
      fr: "Des systèmes que nous avons conçus et construits — du concept à la production.",
    },
    badgeClientEngagement: { en: "Client Engagement", fr: "Mission client" },
    exampleConversations: { en: "Example conversations", fr: "Exemples d'échanges" },
    prevShot: { en: "Previous screenshot", fr: "Capture précédente" },
    nextShot: { en: "Next screenshot", fr: "Capture suivante" },
    speakerYou: { en: "You", fr: "Vous" },
    speakerAi: { en: "AI", fr: "IA" },
    visit: { en: "Visit", fr: "Voir" },
  },

  blog: {
    title: { en: "Thinking", fr: "Réflexions" },
    standfirst: {
      en: "Essays on the intersection of organizational knowledge, AI architecture, and the future of work.",
      fr: "Des articles à la croisée du savoir organisationnel, de l'architecture de l'IA et de l'avenir du travail.",
    },
    loadError: {
      en: "Failed to load posts. Please try again.",
      fr: "Impossible de charger les articles. Veuillez réessayer.",
    },
  },

  services: {
    title: { en: "Services", fr: "Prestations" },
    standfirst: {
      en: "Preparing your organization for the automated workforce.",
      fr: "Préparer votre organisation à une main-d'œuvre automatisée.",
    },
    inquire: { en: "Inquire", fr: "Nous consulter" },
    notSureTitle: { en: "Not sure where to start?", fr: "Vous ne savez pas par où commencer ?" },
    notSureBody: {
      en: "Book a thirty-minute call. We'll tell you honestly which of these fits, or whether none of them does.",
      fr: "Réservez un appel de trente minutes. Nous vous dirons honnêtement laquelle de ces prestations vous convient — ou si aucune ne convient.",
    },
    runDiagnostic: { en: "Book a call", fr: "Réserver un appel" },
  },

  blogPost: {
    back: { en: "Back to Thinking", fr: "Retour aux réflexions" },
    notFound: { en: "Article not found", fr: "Article introuvable" },
    notFoundBody: { en: "This article doesn't exist.", fr: "Cet article n'existe pas." },
  },

  notFound: {
    title: { en: "404 — page not found", fr: "404 — page introuvable" },
    body: {
      en: "That page does not exist. Try the navigation above.",
      fr: "Cette page n'existe pas. Utilisez la navigation ci-dessus.",
    },
  },

  home: {
    /**
     * The full name, carried untranslated in both locales because it is a name
     * rather than a description. It replaced "Technology Consulting", which
     * claimed more than we do and said less.
     */
    title: { en: "Tutto Applied AI", fr: "Tutto Applied AI" },
    standfirst: {
      en: "We build the systems, bridges, and infrastructure that let AI work inside your organisation - not just beside it.",
      fr: "Je construis les systèmes, les passerelles et l'infrastructure qui permettent à l'IA de travailler au sein de votre organisation, et non à côté d'elle.",
    },
    /** Labels the arrow under the hero. It used to read "our work", because the
     *  portfolio sat below; what sits below now is the case for the work. */
    scrollHint: { en: "How it works", fr: "En pratique" },
  },

  praxis: {
    eyebrow: { en: "Praxis · Client training", fr: "Praxis · Formation client" },
    title: {
      en: "A one-hour call that changes how you think about AI.",
      fr: "Une heure d'échange qui change votre façon de penser l'IA.",
    },
    lead1: {
      en: "No technical background needed. The first thirty minutes covers the theory and principles - what AI actually is, how the folder-based system works, and why it changes everything. No jargon.",
      fr: "Aucune compétence technique n'est requise. Les trente premières minutes portent sur la théorie et les principes : ce qu'est réellement l'IA, comment fonctionne le système fondé sur un simple dossier, et pourquoi cela change tout. Sans jargon.",
    },
    lead2: {
      en: "The second thirty minutes is practical: on your own computer, with your own files. You follow along live as we build the system together. By the end of the hour you have a working setup and the mental model to take it further.",
      fr: "Les trente minutes suivantes sont pratiques : sur votre propre ordinateur, avec vos propres fichiers. Vous suivez en direct pendant que nous construisons le système ensemble. Au bout d'une heure, vous disposez d'une installation qui fonctionne et du modèle mental pour aller plus loin.",
    },
    meta: {
      en: "Teams or Google Meet · One hour · Theory then hands-on",
      fr: "Teams ou Google Meet · Une heure · Théorie puis pratique",
    },
    ctaSecondary: { en: "Talk about training a team", fr: "Former une équipe" },
    programmeTitle: { en: "The eight-session programme", fr: "Le programme en huit séances" },
    programmeBody: {
      en: "The one-hour session is the introduction. The full programme takes it further, over two months.",
      fr: "La séance d'une heure est l'introduction. Le programme complet va plus loin, sur deux mois.",
    },
    programmeLink: { en: "See the Praxis Programme", fr: "Voir le programme Praxis" },

    s1Label: { en: "The idea", fr: "L'idée" },
    s1Title: {
      en: "The folder is the app. It runs on your machine. It belongs to you.",
      fr: "Le dossier est l'application. Elle tourne sur votre machine. Elle vous appartient.",
    },
    s1Body: {
      en: "You don't need a proprietary platform, or an account with us. The only thing you'll subscribe to is the AI assistant - about $20 a month - plus a free code editor. Point all three at the same folder on your machine. That folder, and what's inside it, is your app.",
      fr: "Vous n'avez besoin ni d'une plateforme propriétaire, ni d'un compte chez nous. Le seul abonnement à prendre est celui de l'assistant IA — environ 20 $ par mois — auquel s'ajoute un éditeur de code gratuit. Dirigez les trois vers le même dossier sur votre machine. Ce dossier, et ce qu'il contient, est votre application.",
    },

    s2Label: { en: "The ingredients", fr: "Les ingrédients" },
    ing1Title: { en: "The editor", fr: "L'éditeur" },
    ing1Qual: { en: "Where you work · Free", fr: "Votre plan de travail · Gratuit" },
    ing1Body: {
      en: "An open code editor of your choice - these are usually free. It shows the files and lets you edit, search, and talk to your assistant in normal language. Nothing magical: the workshop bench.",
      fr: "Un éditeur de code ouvert, à votre choix — ils sont généralement gratuits. Il affiche les fichiers et vous permet de modifier, chercher et dialoguer avec votre assistant en langage courant. Rien de magique : c'est l'établi.",
    },
    ing2Title: { en: "The assistant", fr: "L'assistant" },
    ing2Qual: { en: "The intelligence · ~$20/mo", fr: "L'intelligence · ~20 $/mois" },
    ing2Body: {
      en: "An AI assistant that reads your folder, follows your written instructions, edits files, and runs scripts on your behalf. Use a paid version - that is what keeps the work fully secure.",
      fr: "Un assistant IA qui lit votre dossier, suit vos instructions écrites, modifie les fichiers et exécute des scripts pour vous. Utilisez une version payante : c'est ce qui garantit la sécurité du travail.",
    },
    ing3Title: { en: "Your filesystem", fr: "Votre système de fichiers" },
    ing3Qual: { en: "What you already own", fr: "Ce que vous possédez déjà" },
    ing3Body: {
      en: "Plain folders, plain files, on the computer you already own. No cloud, no database, no proprietary format. The same disk you have been using for years - the thing that makes it yours.",
      fr: "Des dossiers ordinaires, des fichiers ordinaires, sur l'ordinateur que vous possédez déjà. Pas de cloud, pas de base de données, pas de format propriétaire. Le même disque que vous utilisez depuis des années — c'est ce qui fait qu'il vous appartient.",
    },
    toolingNoteLabel: { en: "On the choice of assistant", fr: "Sur le choix de l'assistant" },
    toolingNote: {
      en: "We teach with Claude as the worked example, because it is the one most people arrive with. It is not a requirement. The same method works with Mistral, with OpenAI, or with open-weight models running entirely on your own machine — which is the right answer when the work cannot leave the building. You choose the assistant; we set it up with you in the first session.",
      fr: "Nous enseignons avec Claude comme exemple, parce que c'est celui avec lequel la plupart des gens arrivent. Ce n'est pas une obligation. La même méthode fonctionne avec Mistral, avec OpenAI, ou avec des modèles à poids ouverts exécutés entièrement sur votre propre machine — ce qui est la bonne réponse lorsque le travail ne peut pas sortir de vos locaux. Vous choisissez l'assistant ; nous l'installons avec vous dès la première séance.",
    },
    ingFoot: {
      en: "Point all three at the same folder.",
      fr: "Dirigez les trois vers le même dossier.",
    },

    s3Label: { en: "The output", fr: "Le résultat" },
    s3Title: { en: "A folder on disk.", fr: "Un dossier sur le disque." },
    s3Body: {
      en: "Nothing here is exotic. What you leave the session with is four things in a directory, which you can read, edit, copy and back up with tools you already trust.",
      fr: "Rien d'exotique ici. Vous repartez de la séance avec quatre éléments dans un répertoire, que vous pouvez lire, modifier, copier et sauvegarder avec les outils auxquels vous faites déjà confiance.",
    },
    fileA: { en: "the rules · written in plain language", fr: "les règles · en langage courant" },
    fileB: { en: "the script · the work it does", fr: "le script · le travail effectué" },
    fileC: { en: "your data · the inputs", fr: "vos données · les entrées" },
    fileD: { en: "what gets produced", fr: "ce qui est produit" },
    noteA: {
      en: "The instructions you'd give a new hire on day one, written once, in plain language. The assistant reads this every time and follows it. Change the file, change the behaviour.",
      fr: "Les consignes que vous donneriez à une nouvelle recrue le premier jour, écrites une fois, en langage courant. L'assistant les relit à chaque fois et les applique. Modifiez le fichier, vous modifiez le comportement.",
    },
    noteB: {
      en: "A short script that does the actual work - pulls data, transforms a document, sends an email. The assistant writes it with you and runs it for you.",
      fr: "Un court script qui fait le travail réel : récupérer des données, transformer un document, envoyer un courriel. L'assistant l'écrit avec vous et l'exécute pour vous.",
    },
    noteC: {
      en: "Whatever the work needs to process: PDFs, spreadsheets, transcripts, contracts. Drop files in, pull files out. There is no upload step.",
      fr: "Tout ce que le travail doit traiter : PDF, tableurs, transcriptions, contrats. Vous déposez des fichiers, vous en retirez. Il n'y a aucune étape de téléversement.",
    },
    noteVcsTitle: { en: "Version control, optional", fr: "Gestion de versions, facultative" },
    noteVcs: {
      en: "Because it's a folder, the standard tools just work: git, Time Machine, Dropbox, a USB stick. There is nothing special to back up.",
      fr: "Puisqu'il s'agit d'un dossier, les outils habituels fonctionnent : git, Time Machine, Dropbox, une clé USB. Il n'y a rien de particulier à sauvegarder.",
    },

    s4Label: { en: "What it costs", fr: "Les tarifs" },
    costToolsTitle: { en: "The tools", fr: "Les outils" },
    costTools: {
      en: "A code editor is free. A paid AI assistant subscription is about $20 a month. That is the only recurring cost, and it is not paid to us.",
      fr: "Un éditeur de code est gratuit. Un abonnement payant à un assistant IA coûte environ 20 $ par mois. C'est le seul coût récurrent, et il ne nous est pas versé.",
    },
    costSessionTitle: { en: "The session", fr: "La séance" },
    costSession: {
      en: "One hour: thirty minutes of theory and principles, then thirty minutes hands-on on your own computer. You leave with a working setup.",
      fr: "Une heure : trente minutes de théorie et de principes, puis trente minutes de pratique sur votre propre ordinateur. Vous repartez avec une installation qui fonctionne.",
    },
    costSprintTitle: { en: "Diagnostic sprint", fr: "Sprint de diagnostic" },
    costSprint: {
      en: "Two weeks. We look at your real documents and workflows and tell you exactly what is possible.",
      fr: "Deux semaines. Nous examinons vos documents et vos processus réels et vous disons précisément ce qui est possible.",
    },

    s5Label: { en: "Before the session", fr: "Avant la séance" },
    prereqLabel: { en: "Please set up in advance", fr: "À préparer à l'avance" },
    prereq: {
      en: "The practical half runs on your computer. To get the most from it, have your AI assistant installed with a paid subscription active before we start, and ideally a code editor too. Get in touch and we'll send you exactly what to set up.",
      fr: "La partie pratique se déroule sur votre ordinateur. Pour en tirer le meilleur parti, installez votre assistant IA avec un abonnement payant actif avant de commencer, et idéalement un éditeur de code. Contactez-nous et nous vous enverrons précisément la liste à préparer.",
    },

    etymPull: {
      en: "Praxis is the loop of putting theory into practice, then letting what you learn from doing it sharpen the theory.",
      fr: "La praxis est la boucle qui consiste à mettre la théorie en pratique, puis à laisser ce que l'on apprend en faisant affiner la théorie.",
    },
    ctaTitle: { en: "Ready to see it live?", fr: "Envie de le voir en direct ?" },
    ctaBody: {
      en: "Book a one-hour Praxis session. Theory first, then hands-on together - on your machine, with your files.",
      fr: "Réservez une séance Praxis d'une heure. La théorie d'abord, puis la pratique ensemble — sur votre machine, avec vos fichiers.",
    },
  },

  pythia: {
    eyebrow: { en: "Pythia · Document intelligence", fr: "Pythia · Intelligence documentaire" },
    title: {
      en: "Read every file. Find what matters. In hours, not days.",
      fr: "Lire chaque fichier. Trouver ce qui compte. En heures, pas en jours.",
    },
    lead1: {
      en: "Juniors spend days reading. Partners wait. The thing you miss is the thing that loses the case. Pythia reads everything - every file, every footnote - and lets you ask questions the way you'd brief a junior.",
      fr: "Les collaborateurs passent des journées à lire. Les associés attendent. Ce qui vous échappe est précisément ce qui fait perdre le dossier. Pythia lit tout — chaque fichier, chaque note de bas de page — et vous laisse poser vos questions comme vous les poseriez à un collaborateur.",
    },
    lead2: {
      en: "It runs on your hardware. Nothing leaves your office. No cloud, no third-party APIs, no exposure.",
      fr: "Le système tourne sur votre matériel. Rien ne sort de vos bureaux. Pas de cloud, pas d'API tierces, aucune exposition.",
    },
    meta: {
      en: "On-premise · Private · 30 minutes",
      fr: "Sur site · Confidentiel · 30 minutes",
    },

    s1Label: { en: "How it works", fr: "Fonctionnement" },
    s1Title: {
      en: "A self-hosted document intelligence platform for document-heavy work.",
      fr: "Une plateforme d'intelligence documentaire auto-hébergée, pour les métiers à forte charge documentaire.",
    },
    s1Body: {
      en: "Pythia processes entire disclosure sets locally: semantic search, conversational Q&A with citations, interactive timelines, and OCR. It finds every relevant file, and shows you exactly why it surfaced.",
      fr: "Pythia traite localement des fonds documentaires entiers : recherche sémantique, questions-réponses avec citations, chronologies interactives et OCR. Le système trouve chaque fichier pertinent et vous montre exactement pourquoi il ressort.",
    },
    c1Title: { en: "Ask in plain language", fr: "Poser la question en langage courant" },
    c1Qual: { en: "Semantic search · Cited answers", fr: "Recherche sémantique · Réponses sourcées" },
    c1Body: {
      en: "Ask it the way you'd brief a junior. Every answer cites the source document and page number. No guessing, and no answer drawn from the model's own knowledge rather than your files.",
      fr: "Formulez la demande comme vous la formuleriez à un collaborateur. Chaque réponse cite le document source et le numéro de page. Aucune supposition, et aucune réponse tirée des connaissances propres du modèle plutôt que de vos fichiers.",
    },
    c2Title: { en: "Nothing leaves the office", fr: "Rien ne sort des bureaux" },
    c2Qual: { en: "On-premise · Zero cloud APIs", fr: "Sur site · Aucune API cloud" },
    c2Body: {
      en: "OCR, inference, vector search and storage all run locally on your hardware. No data is sent to third parties. Legal Professional Privilege is satisfied by architecture, not by policy.",
      fr: "OCR, inférence, recherche vectorielle et stockage s'exécutent localement sur votre matériel. Aucune donnée n'est transmise à des tiers. Le secret professionnel est garanti par l'architecture, non par une politique interne.",
    },
    c3Title: { en: "Every document, every format", fr: "Chaque document, chaque format" },
    c3Qual: { en: "150,000+ files · All formats", fr: "150 000+ fichiers · Tous formats" },
    c3Body: {
      en: "PDF, DOCX, MSG, EML, XLSX, TIF and more. Pythia reads in your first disclosure set in a few weeks, and new documents are added as they arrive.",
      fr: "PDF, DOCX, MSG, EML, XLSX, TIF et bien d'autres. Pythia intègre votre premier fonds documentaire en quelques semaines, et les nouveaux documents sont ajoutés au fil de leur arrivée.",
    },

    s2Label: { en: "What it looks like in use", fr: "En pratique" },
    shotsLabel: { en: "The system", fr: "Le système" },
    shotsTitle: {
      en: "Running on a client's own hardware.",
      fr: "En fonctionnement sur le matériel d'un client.",
    },
    shotsBody: {
      en: "Screens from a live deployment. Names and identifying detail are not shown.",
      fr: "Captures d'un déploiement en production. Les noms et éléments identifiants ne sont pas affichés.",
    },
    shot1: {
      en: "Describe a legal task in plain language. The system routes it to the relevant skills, drafts against the corpus, and verifies every claim against a cited source.",
      fr: "Décrivez une tâche juridique en langage courant. Le système l'oriente vers les compétences pertinentes, rédige à partir du corpus et vérifie chaque affirmation par rapport à sa source citée.",
    },
    shot2: {
      en: "Corpus readiness across a 234,000-document estate — what is ingested, embedded, classified and summarised, and what is not yet.",
      fr: "État de préparation du corpus sur un fonds de 234 000 documents : ce qui est intégré, vectorisé, classé et résumé — et ce qui ne l'est pas encore.",
    },
    demoTitle: { en: "Try it yourself", fr: "Essayez par vous-même" },
    demoBody: {
      en: "The Atelier Vallon demonstration is open — the same system, on the fictional corpus, with nothing to install and no sign-up. It is in French.",
      fr: "La démonstration Atelier Vallon est ouverte à tous : le même système, sur le corpus fictif, sans rien à installer ni inscription.",
    },
    demoCta: { en: "Open the demonstration", fr: "Ouvrir la démonstration" },
    fitLabel: { en: "Where it fits", fr: "À qui cela s'adresse" },
    fitBody: {
      en: "Pythia suits anything legal, regulatory or commercially sensitive that cannot be sent to a cloud service or a US-hosted model — privileged material, regulated records, contractual or export-controlled data. The constraint is the same wherever it comes from: the documents cannot leave. Everything runs on hardware you control.",
      fr: "Pythia convient à tout ce qui relève du juridique, du réglementaire ou du secret des affaires et ne peut être transmis à un service en cloud ou à un modèle hébergé aux États-Unis : pièces couvertes par le secret professionnel, données réglementées, informations contractuelles ou sous contrôle export. La contrainte est la même quelle qu'en soit l'origine : les documents ne peuvent pas sortir. Tout s'exécute sur du matériel que vous maîtrisez.",
    },
    languageNote: {
      en: "We work in French as well as English. The screen above is the French interface; engagements, sessions and written work are delivered in either language.",
      fr: "Nous travaillons en français comme en anglais. L'écran ci-dessus montre l'interface française ; les missions, les séances et les livrables écrits sont assurés dans l'une ou l'autre langue.",
    },
    shot4: {
      en: "The knowledge map, built on Atelier Vallon — a fictional workshop made for demonstration, so no client document is ever used. Documents rarely cite each other; they connect through an instrument, a part, a person, a procedure.",
      fr: "La carte des connaissances, sur l'Atelier Vallon — un atelier fictif conçu pour la démonstration, afin qu'aucun document de client ne soit jamais utilisé. Les documents ne se citent pas entre eux : ils se rejoignent par un instrument, une pièce, une personne, une procédure.",
    },
    shot3: {
      en: "Statistical checks over the disclosure list: numbering gaps, doc-type droughts and volume cliffs, each with wording to put to the other side.",
      fr: "Contrôles statistiques sur la liste des pièces : ruptures de numérotation, absences prolongées d'un type de document et chutes de volume, chacun assorti d'une formulation à adresser à la partie adverse.",
    },
    stat1: { en: "3 days → 3 hours", fr: "3 jours → 3 heures" },
    stat1Label: { en: "Document review per matter", fr: "Revue documentaire par dossier" },
    stat2: { en: "Zero", fr: "Zéro" },
    stat2Label: { en: "Files that leave your office", fr: "Fichier sortant de vos bureaux" },
    stat3: { en: "Every footnote", fr: "Chaque note" },
    stat3Label: { en: "Found, cited and explained", fr: "Trouvée, citée et expliquée" },
    sessionCaption: { en: "Pythia · example session", fr: "Pythia · session type" },

    s3Label: { en: "Beyond legal", fr: "Au-delà du juridique" },
    s3Title: {
      en: "The same architecture, pointed at any body of knowledge.",
      fr: "La même architecture, appliquée à n'importe quel corpus de connaissances.",
    },
    s3Body: {
      en: "Litigation is the hardest version of the problem: high volume, high stakes, and a privilege requirement that rules out the cloud entirely. Solve it there and it transfers. The same system runs over operations, research, compliance or engineering records - a private second brain that acts, on your hardware.",
      fr: "Le contentieux est la version la plus exigeante du problème : gros volumes, enjeux élevés, et une exigence de confidentialité qui exclut totalement le cloud. Résolu là, le problème est résolu ailleurs. Le même système s'applique aux données d'exploitation, de recherche, de conformité ou d'ingénierie — un second cerveau privé capable d'agir, sur votre matériel.",
    },
    b1Title: { en: "A hierarchy of knowledge", fr: "Une hiérarchie de la connaissance" },
    b1Qual: { en: "Structured · Searchable · Yours", fr: "Structurée · Interrogeable · La vôtre" },
    b1Body: {
      en: "Every document, note and decision organised into a structure you define, with semantic search across all of it. Ask anything and it answers from the record rather than from a guess.",
      fr: "Chaque document, note et décision organisé selon une structure que vous définissez, avec une recherche sémantique sur l'ensemble. Posez n'importe quelle question : la réponse vient des pièces, non d'une supposition.",
    },
    b2Title: { en: "AI as orchestrator, not custodian", fr: "L'IA comme chef d'orchestre, non comme dépositaire" },
    b2Qual: { en: "Local-first · Zero cloud exposure", fr: "Local d'abord · Aucune exposition cloud" },
    b2Body: {
      en: "The AI connects to your knowledge base and instructs agents to act on it. It orchestrates; it never holds. Your data stays on your hardware at every step.",
      fr: "L'IA se connecte à votre base de connaissances et donne des instructions à des agents pour agir dessus. Elle orchestre ; elle ne détient jamais. Vos données restent sur votre matériel à chaque étape.",
    },
    b3Title: { en: "Self-improving by design", fr: "Conçu pour s'améliorer" },
    b3Qual: { en: "Each session sharpens the system", fr: "Chaque session affine le système" },
    b3Body: {
      en: "Every question, correction and refinement feeds back in. The structure grows more accurate and the retrieval improves, without anything leaving your environment.",
      fr: "Chaque question, correction et ajustement alimente le système. La structure gagne en précision et la recherche s'améliore, sans que rien ne quitte votre environnement.",
    },
    appliedIntro: {
      en: "Two projects already running on the same principle:",
      fr: "Deux projets qui appliquent déjà le même principe :",
    },
    app1Domain: {
      en: "Building regulations · South Africa",
      fr: "Réglementation du bâtiment · Afrique du Sud",
    },
    app1Body: {
      en: "Verification of building plans against the South African National Building Regulations. Documents checked against a published standard, with every finding traced back to the clause it comes from.",
      fr: "Vérification de plans de construction au regard de la réglementation nationale sud-africaine du bâtiment. Des documents contrôlés contre une norme publiée, chaque constat étant rattaché à l'article dont il découle.",
    },
    app2Domain: {
      en: "Entity management · Consent-based sharing",
      fr: "Gestion des entités · Partage sous consentement",
    },
    app2Body: {
      en: "Tokenised storage and consent-based collaboration, so records can be shared between parties without exposing the underlying data to any of them.",
      fr: "Stockage tokenisé et collaboration sous consentement : les dossiers peuvent être partagés entre parties sans exposer à aucune d'elles les données sous-jacentes.",
    },

    s4Label: { en: "Engagement", fr: "Modalités d'intervention" },
    s4Body: {
      en: "Three stages, each one a decision point rather than a commitment to the next.",
      fr: "Trois étapes, chacune constituant un point de décision plutôt qu'un engagement pour la suivante.",
    },
    e1Title: { en: "Diagnostic sprint", fr: "Sprint de diagnostic" },
    e1Body: {
      en: "Two weeks. We review your real documents and workflows and tell you exactly what Pythia can do for your practice.",
      fr: "Deux semaines. Nous examinons vos documents et vos processus réels et vous disons précisément ce que Pythia peut apporter à votre cabinet.",
    },
    e2Title: { en: "The build", fr: "La réalisation" },
    e2Price: { en: "From", fr: "À partir de" },
    e2Body: {
      en: "Custom build, scoped after the diagnostic. Excludes hardware. Typically four to eight weeks from sign-off to a system running on your premises.",
      fr: "Développement sur mesure, cadré après le diagnostic. Hors matériel. Généralement quatre à huit semaines entre la validation et un système en fonctionnement dans vos locaux.",
    },
    e3Title: { en: "Ongoing", fr: "Suivi" },
    e3Price: { en: "10–20% p.a.", fr: "10–20 % par an" },
    e3Body: {
      en: "Agreed during the project, not fixed up front. Covers ingestion of new matter files, system maintenance, and keeping Pythia current as your work evolves.",
      fr: "Convenu pendant le projet, et non fixé d'avance. Couvre l'intégration des pièces des nouveaux dossiers, la maintenance du système et sa mise à jour à mesure que votre activité évolue.",
    },

    etymPull: {
      en: "The Pythia was the Oracle at Delphi - the one you consulted when you needed an answer from everything that had been heard.",
      fr: "La Pythie était l'oracle de Delphes — celle que l'on consultait lorsqu'on voulait une réponse tirée de tout ce qui avait été entendu.",
    },
    etymBody: {
      en: "Pythia was the title given to the high priestess of the Temple of Apollo at Delphi, who served as its oracle. The name derives from Python, the serpent Apollo slew at Delphi. To put a question to the Pythia was not to ask for a guess - it was to receive the distilled answer from everything the oracle had witnessed and absorbed. That is the model: every document, read; every question, answered from the record itself.",
      fr: "Pythie était le titre porté par la grande prêtresse du temple d'Apollon à Delphes, qui en était l'oracle. Le nom vient de Python, le serpent qu'Apollon terrassa à Delphes. Poser une question à la Pythie, ce n'était pas demander une supposition : c'était recevoir la réponse distillée de tout ce que l'oracle avait vu et absorbé. C'est le modèle : chaque document, lu ; chaque question, répondue à partir des pièces elles-mêmes.",
    },
    ctaTitle: { en: "Ready to see it in your practice?", fr: "Envie de le voir dans votre cabinet ?" },
    ctaBody: {
      en: "Book a thirty-minute conversation. We'll walk through your documents and tell you what's possible.",
      fr: "Réservez un échange de trente minutes. Nous parcourons vos documents et vous disons ce qui est possible.",
    },
  },

  /**
   * The plain-language explainer at /how-ai-works-here.
   *
   * Praxis starts at the folder and Pythia starts at one finished product; a
   * reader whose only experience of AI is a chat window has nowhere to stand in
   * either. This page is that missing ground floor, so it defines its terms as
   * it goes and does not reach the client systems until the idea has landed.
   */
  applied: {
    eyebrow: { en: "The applied view", fr: "L'IA en pratique" },
    title: {
      en: "AI that runs where your work already is.",
      fr: "Une IA qui travaille là où se trouve déjà votre travail.",
    },
    lead1: {
      en: "Most people have met AI as a chat window. You ask a question, you get an answer, you copy it somewhere useful. That is real, and it is the smallest thing this technology does.",
      fr: "La plupart des gens ont rencontré l'IA sous la forme d'une fenêtre de conversation. On pose une question, on obtient une réponse, on la recopie quelque part. C'est utile — et c'est la plus petite chose que cette technologie sache faire.",
    },
    lead2: {
      en: "The systems on this site differ in one specific way. The AI goes to your files, your database, your machine, and does the particular job your work is actually made of — on the first of every month, or every time a document lands, without being asked again.",
      fr: "Les systèmes présentés ici fonctionnent autrement, sur un point précis. L'IA vient à vos fichiers, à votre base de données, à votre machine, et y accomplit la tâche dont votre métier est réellement fait — le premier de chaque mois, ou à chaque document reçu, sans qu'on ait à le redemander.",
    },
    meta: {
      en: "Written for anyone who has used ChatGPT and wondered what else there was. No technical background assumed.",
      fr: "Écrit pour quiconque a utilisé ChatGPT et s'est demandé ce qu'il y avait d'autre. Aucune connaissance technique requise.",
    },

    /** Closes the page in an Etymology block, as Praxis and Pythia do. */
    namePull: {
      en: "A pointer's entire job is to find the thing you are looking for and point straight at it.",
      fr: "Tout le métier d'un pointer consiste à trouver ce que vous cherchez et à le désigner sans détour.",
    },
    nameBody1: {
      en: "That is step one, and it is step one of everything on this page. Out of all the material you are sitting on — the files, the database, fifteen years of email — the first useful thing anyone can do is find what matters and show you exactly where it is. Nothing else can start until that has happened.",
      fr: "C'est la première étape, et c'est la première étape de tout ce que décrit cette page. De toute la matière dont vous disposez — les fichiers, la base de données, quinze ans de courriels — la première chose utile à faire est de trouver ce qui compte et de vous montrer exactement où cela se trouve. Rien d'autre ne peut commencer avant cela.",
    },
    nameBody2: {
      en: "Step two is how far you let it carry you. Some stop at the finding, which is already most of the value. Others let the scripts run the rest of the way: the report assembled, the rule applied, the work done before anybody thinks to ask for it. Where you draw that line is yours to decide.",
      fr: "La deuxième étape, c'est jusqu'où vous le laissez vous porter. Certains s'arrêtent à la découverte, ce qui représente déjà l'essentiel de la valeur. D'autres laissent les scripts aller jusqu'au bout : le rapport assemblé, la règle appliquée, le travail fait avant que quiconque songe à le demander. C'est à vous de placer ce curseur.",
    },

    s1Label: { en: "Start here", fr: "Pour commencer" },
    s1Title: {
      en: "A chat window answers you. A script does the work.",
      fr: "Une conversation vous répond. Un script fait le travail.",
    },
    s1Body: {
      en: "A script is nothing exotic. It is a written set of instructions your computer carries out on its own, in order, without you sitting there. Payroll is a script. So is the spreadsheet macro somebody in accounts wrote in 2014 that everyone is now afraid to touch. What has changed is not what a script is. What has changed is who can write one.",
      fr: "Un script n'a rien d'exotique. C'est une suite d'instructions écrites que votre ordinateur exécute seul, dans l'ordre, sans que vous soyez devant. La paie est un script. La macro qu'un collègue de la comptabilité a écrite en 2014 et que plus personne n'ose toucher en est un aussi. Ce qui a changé, ce n'est pas ce qu'est un script. C'est qui peut en écrire un.",
    },
    s2Label: { en: "A worked example", fr: "Un exemple concret" },
    s2Title: {
      en: "The report nobody has time to run",
      fr: "Le rapport que personne n'a le temps de produire",
    },
    s2Body1: {
      en: "Almost every organisation is sitting on a database — the system that records the orders, or the patients, or the cases, or the stock. Almost none of them can ask it a question. So somebody exports it to a spreadsheet once a month and rebuilds the same charts by hand, and the answer to anything urgent is: give me two days.",
      fr: "Presque toutes les organisations disposent d'une base de données — le système qui enregistre les commandes, les patients, les dossiers, les stocks. Presque aucune ne sait lui poser une question. Alors quelqu'un l'exporte vers un tableur une fois par mois et reconstruit les mêmes graphiques à la main, et la réponse à toute urgence devient : donnez-moi deux jours.",
    },
    s2Body2: {
      en: "Point an assistant at that database and the two days become one afternoon, once. It reads the shape of the tables. You describe the report the way you would describe it to a new colleague. It writes the queries, runs them against the real data, checks the totals against a month whose answer you already know, and tells you where they disagree rather than papering over it. Then you tell it to do that on the first of every month, and it does.",
      fr: "Donnez à un assistant accès à cette base et les deux jours deviennent un après-midi, une seule fois. Il lit la structure des tables. Vous décrivez le rapport comme vous le décririez à un nouveau collègue. Il écrit les requêtes, les exécute sur les données réelles, confronte les totaux à un mois dont vous connaissez déjà la réponse, et vous signale les écarts au lieu de les masquer. Puis vous lui demandez de recommencer le premier de chaque mois, et il le fait.",
    },
    s2Body3: {
      en: "Notice what did not happen. Nothing was uploaded. The queries ran against your database, where it already lives. The assistant wrote the instructions; your own machine did the work.",
      fr: "Remarquez ce qui n'a pas eu lieu. Rien n'a été téléversé. Les requêtes ont été exécutées sur votre base, là où elle se trouve déjà. L'assistant a écrit les instructions ; c'est votre machine qui a fait le travail.",
    },
    sessionCaption: {
      en: "illustrative session — a database the assistant has not seen before",
      fr: "échange illustratif — une base que l'assistant découvre",
    },
    stat1: { en: "Nothing uploaded", fr: "Rien n'est téléversé" },
    stat1Label: {
      en: "The database is read where it sits. No copy of it leaves the building.",
      fr: "La base est lue là où elle est. Aucune copie ne quitte les locaux.",
    },
    stat2: { en: "Once, then monthly", fr: "Une fois, puis chaque mois" },
    stat2Label: {
      en: "The effort sits in the first afternoon, not in every repetition of it.",
      fr: "L'effort tient dans le premier après-midi, non dans chacune de ses répétitions.",
    },
    stat3: { en: "Every figure traceable", fr: "Chaque chiffre traçable" },
    stat3Label: {
      en: "Each number traces back to the query that produced it, so it can be checked.",
      fr: "Chaque nombre renvoie à la requête qui l'a produit, et reste donc vérifiable.",
    },

    s3Label: { en: "Why this matters", fr: "Ce qui change vraiment" },
    s3Title: {
      en: "The awkward, specific jobs are the whole point",
      fr: "Les tâches ingrates et très particulières sont tout l'enjeu",
    },
    s3Body1: {
      en: "A general-purpose AI product is built for the average of everybody's work, which is another way of saying it is built for nobody's in particular. The jobs that actually eat your week are the ones no product was ever made for: the reconciliation only your firm does, the return in the exact layout your regulator insists on, the check that exists because of something that went wrong in 2019 and must never happen again.",
      fr: "Un produit d'IA généraliste est conçu pour la moyenne du travail de tout le monde, ce qui revient à dire qu'il n'est conçu pour celui de personne en particulier. Les tâches qui dévorent réellement votre semaine sont celles pour lesquelles aucun produit n'a jamais été fait : le rapprochement que seul votre cabinet pratique, la déclaration dans la présentation exacte qu'exige votre régulateur, le contrôle qui n'existe que parce que quelque chose a mal tourné en 2019 et ne doit jamais se reproduire.",
    },
    s3Body2: {
      en: "None of those were ever worth building software for. The market for each one is a single company, sometimes a single department, occasionally a single person. That arithmetic is what has changed. Work that would once have justified a fortnight of a developer's time now justifies an afternoon of yours — which puts the long tail of small, specific, unglamorous work within reach for the first time.",
      fr: "Aucune n'a jamais justifié le développement d'un logiciel. Le marché de chacune se compte en une entreprise, parfois un service, parfois une seule personne. C'est cette arithmétique qui a changé. Ce qui aurait autrefois exigé quinze jours de développement n'exige plus qu'un de vos après-midi — ce qui rend accessible, pour la première fois, toute la longue traîne des travaux modestes, spécifiques et sans prestige.",
    },
    n1Title: { en: "One firm's format", fr: "Le format d'une seule maison" },
    n1Qual: { en: "Returns and submissions", fr: "Déclarations et dépôts" },
    n1Body: {
      en: "The submission your regulator wants, in the layout it wants, assembled out of four systems that do not speak to one another. Nobody sells this, because you are the only possible buyer.",
      fr: "Le dépôt que votre régulateur exige, dans la présentation qu'il exige, assemblé à partir de quatre systèmes qui ne se parlent pas. Personne ne le vend, puisque vous en êtes le seul acheteur possible.",
    },
    n2Title: { en: "One team's judgement", fr: "Le jugement d'une seule équipe" },
    n2Qual: { en: "Rules that live in someone's head", fr: "Des règles qui vivent dans une tête" },
    n2Body: {
      en: "The reasons a claim gets flagged. The tells that make a supplier worth a second look. Written down once in plain language, then applied identically every time — including on the Friday afternoon when nobody is concentrating.",
      fr: "Les motifs pour lesquels un dossier est signalé. Les indices qui rendent un fournisseur digne d'un second examen. Consignés une fois en langage courant, puis appliqués à l'identique chaque fois — y compris le vendredi après-midi, quand plus personne n'est concentré.",
    },
    n3Title: { en: "One person's week", fr: "La semaine d'une seule personne" },
    n3Qual: { en: "The work between the systems", fr: "Le travail entre les systèmes" },
    n3Body: {
      en: "Reading the attachments, renaming the files, checking that two numbers agree, chasing the one that does not. Individually trivial. Collectively somebody's job.",
      fr: "Lire les pièces jointes, renommer les fichiers, vérifier que deux chiffres concordent, relancer sur celui qui ne concorde pas. Pris un à un, insignifiant. Pris ensemble, un poste à temps plein.",
    },

    s4Label: { en: "In the field", fr: "Sur le terrain" },
    s4Title: {
      en: "The same three moves, in very different rooms",
      fr: "Les mêmes trois gestes, dans des contextes très différents",
    },
    s4Body: {
      en: "Every system we have built has the same shape. Point it at the real data. Describe the job in the language of the people who do it. Keep the work on hardware the client controls. What changes is the room.",
      fr: "Tous les systèmes que nous avons construits ont la même forme. On les branche sur les données réelles. On décrit la tâche dans les mots de ceux qui l'accomplissent. On garde le traitement sur du matériel que le client maîtrise. Seul le contexte change.",
    },
    f1Title: { en: "Pythia", fr: "Pythia" },
    f1Qual: { en: "Litigation disclosure", fr: "Communication de pièces" },
    f1Body: {
      en: "150,000+ documents from a disclosure set, read on a machine standing in the room. Ask in plain language; every answer cites the document and page it came from, because an answer a lawyer cannot check is worse than no answer at all.",
      fr: "Plus de 150 000 documents d'un dossier de communication de pièces, traités sur une machine présente dans la pièce. On interroge en langage courant ; chaque réponse cite le document et la page dont elle provient, car une réponse qu'un avocat ne peut vérifier vaut moins que pas de réponse du tout.",
    },
    f2Title: { en: "GTM", fr: "GTM" },
    f2Qual: { en: "Business development", fr: "Développement commercial" },
    f2Body: {
      en: "6,675 prospects profiled across nine countries. Open-weight models on the client's own hardware do the bulk of the reading and writing; a frontier model is called across a single auditable boundary, with identifying detail held back.",
      fr: "6 675 prospects profilés dans neuf pays. Des modèles à poids ouverts, sur le matériel du client, assurent l'essentiel de la lecture et de la rédaction ; un modèle de premier plan n'est appelé qu'à travers une frontière unique et auditable, les éléments identifiants étant retenus.",
    },
    f3Title: { en: "The SharePoint bridge", fr: "Le pont SharePoint" },
    f3Qual: { en: "Microsoft 365", fr: "Microsoft 365" },
    f3Body: {
      en: "SharePoint records queried, created and corrected by asking, rather than by clicking through lists — and broken Power Automate flows diagnosed in conversation rather than by trawling run histories.",
      fr: "Des enregistrements SharePoint interrogés, créés et corrigés en le demandant, plutôt qu'en parcourant des listes — et des flux Power Automate défaillants diagnostiqués par la conversation plutôt qu'en dépouillant les historiques d'exécution.",
    },
    portfolioNote: {
      en: "Each of these has a fuller account, with screenshots and example sessions, in the portfolio.",
      fr: "Chacun de ces systèmes est présenté plus en détail, captures et exemples d'échanges à l'appui, dans les réalisations.",
    },

    s5Label: { en: "On your own machine", fr: "Sur votre propre machine" },
    s5Title: {
      en: "Local first, and not only for the reason you would guess",
      fr: "Local d'abord, et pas seulement pour la raison que l'on croit",
    },
    l1Title: { en: "Privacy, obviously", fr: "La confidentialité, bien sûr" },
    l1Qual: { en: "Some material cannot travel", fr: "Certaines pièces ne voyagent pas" },
    l1Body: {
      en: "Privileged legal documents. Patient records. An acquisition nobody has announced. On-premise is not a setting somebody switches on in a preferences page; it is an architecture, and it is either true of your system or it is not.",
      fr: "Des documents couverts par le secret professionnel. Des dossiers médicaux. Une acquisition que nul n'a encore annoncée. Le sur-site n'est pas une case à cocher dans un écran de réglages : c'est une architecture, et elle est vraie de votre système ou elle ne l'est pas.",
    },
    l2Title: { en: "It does not change under you", fr: "Rien ne bouge sous vos pieds" },
    l2Qual: { en: "Stability", fr: "Stabilité" },
    l2Body: {
      en: "A cloud service is updated on somebody else's schedule, and a process that was defensible in March can quietly stop being so in June. A script on your own machine does the same thing next year that it does today, and changes when you change it.",
      fr: "Un service en nuage est mis à jour au calendrier d'un autre, et un processus défendable en mars peut cesser de l'être en juin sans que nul ne vous prévienne. Un script sur votre machine fera l'an prochain ce qu'il fait aujourd'hui, et ne changera que lorsque vous le changerez.",
    },
    l3Title: { en: "The cost curve bends the other way", fr: "La courbe des coûts s'inverse" },
    l3Qual: { en: "Economics", fr: "Économie" },
    l3Body: {
      en: "Cloud AI is priced per question, so the better it works for you the more of it you buy. Hardware you own is priced once. Open-weight models run on it at no charge per use, and a frontier model gets called only for the parts that genuinely warrant one.",
      fr: "L'IA en nuage se facture à la question : mieux elle vous sert, plus vous en achetez. Le matériel que vous possédez se paie une fois. Les modèles à poids ouverts y tournent sans coût à l'usage, et un modèle de premier plan n'est sollicité que pour les étapes qui le méritent vraiment.",
    },

    s6Label: { en: "Which AI", fr: "Quelle IA" },
    s6Title: {
      en: "The model is a component, not the commitment",
      fr: "Le modèle est un composant, pas un engagement",
    },
    s6Body1: {
      en: "People ask which AI we use as though the answer settles everything. It settles less than you would think. We build with Claude most of the time, because it is currently the best at writing and repairing the code.",
      fr: "On nous demande quelle IA nous utilisons comme si la réponse réglait tout. Elle règle moins qu'on ne l'imagine. Nous construisons le plus souvent avec Claude, parce qu'il est aujourd'hui le meilleur pour écrire et réparer le code.",
    },
    s6Body2: {
      en: "But what you are handed at the end is a folder: your instructions in plain language, the scripts that do the work, your data. Mistral will run it. So will an open-weight model on hardware in your own building, with nothing leaving the room. The choice is yours, and — this is the part that matters — it stays reversible.",
      fr: "Mais ce qu'on vous remet au bout du compte est un dossier : vos instructions en langage courant, les scripts qui font le travail, vos données. Mistral saura les exécuter. Un modèle à poids ouverts sur du matériel installé chez vous aussi, sans que rien ne sorte de la pièce. Le choix vous appartient et — c'est là l'essentiel — il reste réversible.",
    },
    localLabel: { en: "On running a model locally", fr: "Sur l'exécution d'un modèle en local" },
    localBody: {
      en: "Running a model locally means downloading its weights — the file that is the model — and running it on hardware you own. No account, no charge per question, no network call. It is a genuine trade rather than a free lunch: open-weight models trail the frontier ones, and a machine able to run a large one is a real purchase. The useful pattern is usually both, with the local model doing the volume and a frontier model called deliberately for the few steps that need the extra capability, across a boundary you can audit. We will tell you which parts of your work fall on which side before you buy anything.",
      fr: "Exécuter un modèle en local, c'est télécharger ses poids — le fichier qui constitue le modèle — et le faire tourner sur du matériel qui vous appartient. Pas de compte, pas de facturation à la question, aucun appel réseau. C'est un vrai arbitrage et non un repas gratuit : les modèles à poids ouverts restent en retrait des modèles de premier plan, et une machine capable d'en faire tourner un grand représente un achat réel. Le schéma le plus utile combine généralement les deux : le modèle local traite le volume, un modèle de premier plan n'est appelé délibérément que pour les rares étapes qui exigent davantage, à travers une frontière que vous pouvez auditer. Nous vous dirons de quel côté tombe chaque partie de votre travail avant que vous n'achetiez quoi que ce soit.",
    },

    s7Label: { en: "Where to start", fr: "Par où commencer" },
    s7Body: {
      en: "Three ways in, depending on whether you would rather build it, have it built, or simply see one working first.",
      fr: "Trois portes d'entrée, selon que vous préférez le construire, le faire construire, ou d'abord en voir un fonctionner.",
    },
    r1Title: { en: "Build it yourself", fr: "Le construire vous-même" },
    r1Body: {
      en: "Praxis: one hour to see how it is done, or eight sessions to become the person who does it. You leave with a working tool for your own work, not with notes about one.",
      fr: "Praxis : une heure pour voir comment on procède, ou huit séances pour devenir celui qui procède. Vous repartez avec un outil qui fonctionne pour votre propre travail, et non avec des notes à son sujet.",
    },
    r2Title: { en: "Have it built", fr: "Le faire construire" },
    r2Body: {
      en: "A short diagnostic on your real workflows comes first, so that what gets built is the thing that was actually costing you, rather than the thing that was easiest to describe.",
      fr: "Un court diagnostic sur vos processus réels vient d'abord, afin que ce qui sera construit soit ce qui vous coûtait vraiment, et non ce qui était le plus facile à décrire.",
    },
    r3Title: { en: "See a whole system", fr: "Voir un système entier" },
    r3Body: {
      en: "Pythia in full — what it does, what it costs, and an open demonstration you can click through without speaking to anybody.",
      fr: "Pythia en entier — ce qu'il fait, ce qu'il coûte, et une démonstration ouverte que vous pouvez parcourir sans parler à personne.",
    },

    ctaTitle: {
      en: "What is the job that eats your week?",
      fr: "Quelle est la tâche qui dévore votre semaine ?",
    },
    ctaBody: {
      en: "Bring us the specific one, not the impressive one. Thirty minutes is usually enough to tell you honestly whether this is worth your time.",
      fr: "Apportez-nous la tâche précise, pas la plus impressionnante. Trente minutes suffisent généralement pour vous dire honnêtement si cela vaut votre temps.",
    },
  },
} as const;

type Leaf = { en: string; fr: string };

/** Resolve a copy leaf for the active locale. */
export function pick(leaf: Leaf, locale: Locale): string {
  return leaf[locale] ?? leaf.en;
}

/** Hook form: `const t = useT(); t(copy.home.title)`. */
export function useT() {
  const { locale } = usePreferences();
  return (leaf: Leaf) => pick(leaf, locale);
}

export function useLocale(): Locale {
  return usePreferences().locale;
}
