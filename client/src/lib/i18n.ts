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
  },

  home: {
    eyebrow: { en: "This is the AI era.", fr: "Nous sommes à l'ère de l'IA." },
    title: { en: "Technology Consulting", fr: "Conseil en technologie" },
    standfirst: {
      en: "We build the systems, bridges, and infrastructure that let AI work inside your organisation - not just beside it.",
      fr: "Je construis les systèmes, les passerelles et l'infrastructure qui permettent à l'IA de travailler au sein de votre organisation, et non à côté d'elle.",
    },
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
    fileA: { en: "the rules · written in plain English", fr: "les règles · en langage courant" },
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
    c1Title: { en: "Ask in plain English", fr: "Poser la question en langage courant" },
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
      en: "Hardware and custom build, scoped after the diagnostic. Typically four to eight weeks from sign-off to a system running on your premises.",
      fr: "Matériel et développement sur mesure, cadrés après le diagnostic. Généralement quatre à huit semaines entre la validation et un système en fonctionnement dans vos locaux.",
    },
    e3Title: { en: "Ongoing", fr: "Suivi" },
    e3Price: { en: "~20% p.a.", fr: "~20 % par an" },
    e3Body: {
      en: "Assessed during the build. Covers ingestion of new matter files, system maintenance, and keeping Pythia current as your work evolves.",
      fr: "Évalué pendant la réalisation. Couvre l'intégration des pièces des nouveaux dossiers, la maintenance du système et sa mise à jour à mesure que votre activité évolue.",
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
