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
    /**
     * Points at /praxis, which keeps its name everywhere else. "Praxis"
     * in the bar told a first-time visitor nothing about what was behind
     * it; the page itself still opens on the name and explains it.
     *
     * The French is "Formation" rather than a translation of "Learn":
     * it is the word the French market actually uses for this, and the
     * one that signals fundable professional training.
     */
    praxis: { en: "Learn", fr: "Formation" },
    events: { en: "Events", fr: "Événements" },
    /**
     * The nav entry that used to read "Pythia" and point at /pythia. The name
     * meant nothing to a reader who was not a litigator, so the bar now names
     * the proposition and /pythia is reached from inside the page.
     *
     * The French is the noun, not the adjective: "souveraineté numérique" is
     * ordinary political vocabulary in France, so the word arrives already
     * meaning something. Bare "Souverain" would not.
     */
    sovereign: { en: "Sovereign", fr: "Souveraineté" },
    thinking: { en: "Thinking", fr: "Réflexions" },
    usecase: { en: "Use cases", fr: "Cas d'usage" },
    contact: { en: "Contact", fr: "Contact" },
    home: { en: "Tutto — home", fr: "Tutto — accueil" },
    menu: { en: "Toggle menu", fr: "Ouvrir le menu" },
  },

  footer: {
    /**
     * Sitewide disclosure. Kept to one sentence: it should read as a note the
     * site is comfortable making, not an apology, and it sits under every page
     * so length is what would make it tiresome.
     */
    builtWith: {
      en: "This site — its systems, copy and design — is built directly with Claude, and its hand shows throughout.",
      fr: "Ce site — ses systèmes, ses textes et son design — est construit directement avec Claude, dont la main se voit partout.",
    },
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
    runDiagnostic: { en: "Book a call", fr: "Réserver un appel" },
  },

  /**
   * The opening of /services, above the named engagements.
   *
   * The six things clients ask for collapse onto one axis — whether we end up
   * owning the system or they do — so it is two columns of three rather than
   * six cards. The numerals are kept because the six map back to a real list;
   * they are not decoration. Named `waysIn` after the headline rather than the
   * page, since the page also carries the `services` block below it.
   */
  waysIn: {
    /** Caption for the spot drawing in section 01. */
    plateTeacherCaption: {
      en: "The second way in. An evening in a room like this one is where most people find out the work is smaller than they feared.",
      fr: "La seconde façon d'entrer. Une soirée dans une salle comme celle-ci, c'est là que la plupart découvrent que le travail est plus petit qu'ils ne le craignaient.",
    },
    eyebrow: { en: "How we work", fr: "Notre façon de travailler" },
    title: { en: "Two ways in", fr: "Deux portes d'entrée" },
    lead1: {
      en: "Every engagement is scoped to what you actually want, so this is not a menu. It is the two shapes the work takes.",
      fr: "Chaque mission est cadrée sur ce que vous voulez vraiment : ceci n'est donc pas un catalogue, mais les deux formes que prend le travail.",
    },
    lead2: {
      en: "We build it, or you learn to build it. Most clients end up doing both.",
      fr: "Soit nous le construisons, soit vous apprenez à le construire. La plupart de nos clients finissent par faire les deux.",
    },
    meta: {
      en: "Scoped in one call. Nothing here is a package.",
      fr: "Cadré en un seul appel. Rien de tout ceci n'est un forfait.",
    },

    s1Label: { en: "What you want", fr: "Ce que vous voulez" },

    buildHeading: { en: "We build it", fr: "Nous le construisons" },
    buildQualifier: {
      en: "You end up with a system that runs.",
      fr: "Vous repartez avec un système qui tourne.",
    },
    buildCta: { en: "See what we have built", fr: "Voir ce que nous avons construit" },

    learnHeading: { en: "You build it", fr: "Vous le construisez" },
    learnQualifier: {
      en: "You end up able to build the next one.",
      fr: "Vous repartez capable de construire le suivant.",
    },
    learnCta: { en: "How Praxis works", fr: "Comment fonctionne Praxis" },

    b1Q: {
      en: "“I want something to just run.”",
      fr: "« Je veux quelque chose qui tourne, tout simplement. »",
    },
    b1Body: {
      en: "Automation, data plumbing, a script that ends a chore you repeat every week. It runs on infrastructure you already have.",
      fr: "Automatisation, mise en ordre des données, un script qui met fin à une corvée hebdomadaire. Le tout sur une infrastructure que vous avez déjà.",
    },
    b2Q: {
      en: "“I want it to make judgement calls, not just move data.”",
      fr: "« Je veux qu'il tranche, pas seulement qu'il déplace des données. »",
    },
    b2Body: {
      en: "A front end your team actually uses, with a model in the loop at the point where the decision is — triggered by the work itself, not by someone remembering to open a chat window.",
      fr: "Une interface que votre équipe utilise vraiment, avec un modèle dans la boucle là où se prend la décision — déclenché par le travail lui-même, et non parce que quelqu'un a pensé à ouvrir une fenêtre de conversation.",
    },
    b3Q: {
      en: "“I want it wired into what we already pay for.”",
      fr: "« Je veux que ce soit branché sur ce que nous payons déjà. »",
    },
    b3Body: {
      en: "API and MCP work. Your CRM, your SharePoint, your finance system — reachable by the AI your team already has open, instead of copy-pasted into it.",
      fr: "Travail d'API et de MCP. Votre CRM, votre SharePoint, votre outil comptable — accessibles à l'IA que votre équipe a déjà ouverte, au lieu d'y être recopiés à la main.",
    },

    l1Q: {
      en: "“I want to build my own.”",
      fr: "« Je veux construire les miens. »",
    },
    l1Body: {
      en: "We build the first one alongside you, on your problem, with your team watching how it is done. You build the rest without us.",
      fr: "Nous construisons le premier avec vous, sur votre problème, votre équipe voyant comment on s'y prend. Vous construisez les suivants sans nous.",
    },
    l2Q: {
      en: "“I want to actually be good at this.”",
      fr: "« Je veux vraiment savoir m'en servir. »",
    },
    l2Body: {
      en: "Praxis. One hour at a time, on your own work, until something you brought with you runs.",
      fr: "Praxis. Une heure à la fois, sur votre propre travail, jusqu'à ce que ce que vous avez apporté fonctionne.",
    },
    l3Q: {
      en: "“I want the whole organisation to be.”",
      fr: "« Je veux que toute l'organisation le soit. »",
    },
    l3Body: {
      en: "Discovery, then strategy. Implementation and change management if you want us for those, and support once it is live.",
      fr: "Diagnostic, puis stratégie. Mise en œuvre et conduite du changement si vous souhaitez nous confier ces étapes, et accompagnement une fois le système en service.",
    },

    s2Label: { en: "What it costs", fr: "Ce que cela coûte" },
    s2Title: { en: "Diagnostic", fr: "Diagnostic" },
    /** `{price}` is replaced with the two-week diagnostic, in the reader's currency. */
    priceBody1: {
      en: "Most engagements start with a two-week diagnostic — {price}. It ends with a written map of where the work is and what it is worth, and that map is yours whether or not we build anything.",
      fr: "La plupart des missions commencent par un diagnostic de deux semaines — {price}. Il se termine par une cartographie écrite de ce qu'il y a à faire et de ce que cela vaut, et cette cartographie vous appartient, que nous construisions ensuite quelque chose ou non.",
    },
    priceBody2: {
      en: "After that, nothing here is a package. Build work is quoted from the scope the diagnostic found. Training is priced per session. We will tell you on the first call if we think the answer is smaller than you expected.",
      fr: "Ensuite, rien de tout ceci n'est un forfait. Le développement est chiffré à partir du périmètre révélé par le diagnostic. La formation est facturée à la séance. Nous vous dirons dès le premier appel si nous pensons que la réponse est plus modeste que ce que vous imaginiez.",
    },

    ctaTitle: {
      en: "Not sure which column you are in?",
      fr: "Vous ne savez pas dans quelle colonne vous êtes ?",
    },
    ctaBody: {
      en: "Almost nobody is, at the start. Thirty minutes is usually enough to tell — and we will say so if the honest answer is that you do not need us.",
      fr: "Au début, presque personne ne le sait. Trente minutes suffisent généralement à le déterminer — et nous vous le dirons si la réponse honnête est que vous n'avez pas besoin de nous.",
    },
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

  /**
   * Alt text for the drawn plates. It lives here rather than beside a page's
   * captions because it describes the drawing, not the argument the drawing is
   * being used for — and the Skills plate now appears on two pages, which is
   * exactly how a duplicated description starts to drift.
   */
  plates: {
    fourD: {
      en: "Four pinned notes around a desk: delegation decides what is worth doing together, description makes the picture clear, discernment judges what is true, useful and worth keeping, and diligence plans, executes, checks and improves.",
      fr: "Quatre notes épinglées autour d'un bureau : la délégation décide de ce qui mérite d'être fait ensemble, la description clarifie la situation, le discernement juge ce qui est vrai, utile et à conserver, et la diligence planifie, exécute, vérifie et améliore.",
    },
    flow: {
      en: "The same request for a weekly update, made twice. Carrying context, skills, connected systems, rules and examples, it arrives as the report that was wanted; missing them, it produces confusing output, misaligned goals and rework.",
      fr: "La même demande de point hebdomadaire, formulée deux fois. Portant contexte, compétences, systèmes connectés, règles et exemples, elle donne le rapport attendu ; privée de ces éléments, elle produit un résultat confus, des objectifs à côté et des reprises.",
    },
    hands: {
      en: "A woman at the centre of a brain, a mail client, a code editor and a spreadsheet, each joined to her by a single line.",
      fr: "Une femme au centre d'un cerveau, d'une messagerie, d'un éditeur de code et d'un tableur, chacun relié à elle par un trait.",
    },
    fileOnDisk: {
      en: "An orange document folder, thick with papers, standing upright on an outsized floppy disk.",
      fr: "Un dossier orange, épais de papiers, dressé sur une disquette surdimensionnée.",
    },
    hallucination: {
      en: "The same Paris street twice. In the first a puzzle piece is missing from the sky, marked with a question mark. In the second the gap has been filled with a hot-air balloon shaped like a beret.",
      fr: "La même rue parisienne, deux fois. Sur la première, une pièce de puzzle manque dans le ciel, marquée d'un point d'interrogation. Sur la seconde, le trou a été comblé par une montgolfière en forme de béret.",
    },
    teacher: {
      en: "A speaker in an orange shirt standing in front of a seated audience, gesturing at a chart of six rising bars on the wall behind him.",
      fr: "Un intervenant en chemise orange devant un public assis, désignant un graphique de six barres croissantes sur le mur derrière lui.",
    },
    calendar: {
      en: "A spiral desk calendar with an orange header band and an orange pencil lying across it, against a pale sky with ink-drawn clouds.",
      fr: "Un calendrier à spirale au bandeau orange, un crayon orange posé en travers, sur un ciel pâle aux nuages dessinés à l'encre.",
    },
    builder: {
      en: "Someone in a hard hat holding a large plan open behind a computer case with its side off, surrounded by tools, rolled drawings, a monitor and a keyboard.",
      fr: "Quelqu'un en casque de chantier déployant un grand plan derrière un boîtier d'ordinateur ouvert, entouré d'outils, de plans roulés, d'un écran et d'un clavier.",
    },
    portraitA: {
      en: "A drawn portrait of a man in glasses, a jacket and a tie.",
      fr: "Portrait dessiné d'un homme à lunettes, en veste et cravate.",
    },
    portraitB: {
      en: "A drawn portrait of a woman in a striped collar, looking straight out.",
      fr: "Portrait dessiné d'une femme au col rayé, le regard droit.",
    },
    portraitC: {
      en: "A drawn portrait of a woman resting her chin on her hand.",
      fr: "Portrait dessiné d'une femme, le menton posé sur la main.",
    },
    context: {
      en: "A strip explaining a context window. A brain fills with notes and faces until a gauge reads full and nothing more will go in; then two ways round it — looking things up in an outside store when needed, and summarising old memories to free space.",
      fr: "Une planche expliquant la fenêtre de contexte. Un cerveau se remplit de notes et de visages jusqu'à ce qu'une jauge affiche « plein » et que plus rien n'entre ; puis deux façons de contourner le problème — aller chercher l'information dans une réserve extérieure au moment voulu, et résumer les anciens souvenirs pour libérer de la place.",
    },
    lawyer: {
      en: "Seen from behind, someone in an orange jumper at a desk buried in paper: stacks either side, an open book, a typewriter, and pages pinned across the bookshelves and hanging from the ceiling.",
      fr: "Vu de dos, quelqu'un en pull orange à un bureau enseveli sous le papier : des piles de chaque côté, un livre ouvert, une machine à écrire, et des feuilles punaisées sur les rayonnages et suspendues au plafond.",
    },
    skills: {
      en: "Claude, Mistral and a code editor on one side, Hugging Face, Kimi and Ollama on the other, around a basket of specialists labelled research, writing, data, automation, design and communication. The banner reads: skills = specialists.",
      fr: "Claude, Mistral et un éditeur de code d'un côté, Hugging Face, Kimi et Ollama de l'autre, autour d'un panier de spécialistes étiquetés recherche, rédaction, données, automatisation, conception et communication. La banderole indique : skills = spécialistes.",
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
      en: "Teams or Google Meet · One hour · One to one, on your own files",
      fr: "Teams ou Google Meet · Une heure · En tête-à-tête, sur vos propres fichiers",
    },
    /** What separates this from the group evenings on /calendar. */
    tailoredLabel: { en: "Send your own work first", fr: "Envoyez d'abord votre propre travail" },
    tailored: {
      en: "This is one to one, and it is built on your material. When you book, send the use cases you actually care about — the quote you rewrite every week, the report nobody wants to do — and we learn on those rather than on a demonstration I prepared earlier. The group evenings run on generic examples by design; this does not.",
      fr: "C'est un tête-à-tête, et il se construit sur vos documents. Au moment de réserver, envoyez les cas d'usage qui comptent vraiment pour vous — le devis que vous réécrivez chaque semaine, le rapport dont personne ne veut — et nous apprenons sur ceux-là plutôt que sur une démonstration préparée à l'avance. Les soirées collectives fonctionnent volontairement sur des exemples génériques ; celle-ci non.",
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

    /**
     * Captions for the two drawn plates. They are captions, not descriptions:
     * each says what the picture is for at that point in the argument, and the
     * alt text carries the content of the drawing for a reader who cannot see
     * it. The lettering is inside the artwork, so each plate ships as an English
     * file and a French one.
     */
    plate4dCaption: {
      en: "Four habits, not four tools. Deciding what is worth handing over, describing it clearly, judging what comes back, and following it through — the session drills all four on your own work, and they outlast whatever the folder ends up doing.",
      fr: "Quatre réflexes, pas quatre outils. Décider ce qui mérite d'être confié, le décrire clairement, juger ce qui revient, aller au bout — la séance travaille les quatre sur vos propres dossiers, et ils vous restent quoi que fasse le dossier ensuite.",
    },
    plateHallucinationCaption: {
      en: "Why the third of them is discernment. Asked for something it does not have, a model will not leave the gap open: it fills it with whatever fits the shape — plausibly, confidently, and wrong.",
      fr: "Pourquoi le troisième d'entre eux est le discernement. Sollicité sur ce qu'il n'a pas, un modèle ne laisse pas le trou béant : il le comble avec ce qui en épouse la forme — de façon plausible, assurée, et fausse.",
    },
    plateFlowCaption: {
      en: "The three ingredients above are what you install. This is what you put into a request once they are in place — and what happens to the same request when it goes out without them.",
      fr: "Les trois ingrédients ci-dessus sont ce que vous installez. Voici ce que vous mettez dans une demande une fois l'installation faite — et ce que devient cette même demande quand elle part sans eux.",
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
    plateContextCaption: {
      en: "The assistant's memory is a room, not a warehouse. Fill it and the oldest things fall out — which is why the folder holds the rules on disk, where they are read fresh each time rather than remembered.",
      fr: "La mémoire de l'assistant est une pièce, pas un entrepôt. Remplissez-la et les plus anciens éléments tombent — d'où les règles conservées sur le disque, relues à chaque fois plutôt que mémorisées.",
    },
    plateFileOnDiskCaption: {
      en: "This is the whole artefact. Not an account and not a platform: a folder you can copy, back up, and open on any machine you own.",
      fr: "C'est là tout l'objet. Pas un compte, pas une plateforme : un dossier que vous pouvez copier, sauvegarder et ouvrir sur n'importe quelle machine qui vous appartient.",
    },
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

    /**
     * Everything above this point is written for litigation. Somebody who is
     * not a lawyer has usually worked out by now that it might apply to them
     * anyway; this is where they are told so, and sent somewhere written for
     * them rather than left to translate the rest themselves.
     */
    generalTitle: { en: "Not a law firm?", fr: "Vous n'êtes pas un cabinet d'avocats ?" },
    generalBody: {
      en: "The same system, on the same hardware, doing the work an accounts department or a machine shop already does by hand. There is a page written that way round.",
      fr: "Le même système, sur le même matériel, faisant le travail qu'un service comptable ou un atelier accomplit déjà à la main. Une page est écrite dans ce sens-là.",
    },
    generalCta: { en: "See it for any business", fr: "Le voir pour toute entreprise" },

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
   * The general front door at /sovereign.
   *
   * `pythia` above opens in legal register — disclosure sets, privilege, the
   * Oracle at Delphi — so a reader who is not a litigator has to work out on
   * their own that any of it applies to them. This block makes the general case
   * first and puts the law firm where it belongs: in the evidence, not in the
   * definition. Same product, same prices, different door.
   *
   * Most of the argument was already written elsewhere on this site — `applied`
   * for the local-first case, `usecase` for the recorded runs. Where that is so,
   * this block carries the compressed version and links out, rather than
   * re-arguing it in slightly worse words.
   */
  sovereign: {
    eyebrow: { en: "Pythia · Sovereign AI", fr: "Pythia · IA souveraine" },
    title: {
      en: "Everything your business holds, readable. Without any of it leaving the building.",
      fr: "Tout ce que votre entreprise conserve, enfin lisible. Sans que rien ne sorte de vos murs.",
    },
    lead1: {
      en: "Every business keeps more written material than anyone can read. Invoices, CVs, supplier certificates, contracts, signed delivery notes, photographs of paper, fifteen years of email. The answers are in there. Finding one is somebody's afternoon, every time.",
      fr: "Toute entreprise conserve plus d'écrits que personne ne peut en lire. Factures, CV, certificats fournisseurs, contrats, bons de livraison signés, photographies de documents papier, quinze ans de courriels. Les réponses s'y trouvent. Aller en chercher une, c'est l'après-midi de quelqu'un, à chaque fois.",
    },
    lead2: {
      en: "Pythia reads all of it and answers questions from it — and it runs on a computer you own, in your building. No cloud account, no upload, no file going anywhere. For a lot of businesses that is not a preference. It is the condition of doing the work at all.",
      fr: "Pythia lit l'ensemble et répond aux questions à partir de ces documents — sur un ordinateur qui vous appartient, dans vos locaux. Aucun compte en ligne, aucun téléversement, aucun fichier qui s'en va ailleurs. Pour beaucoup d'entreprises, ce n'est pas une préférence. C'est la condition même pour que le travail puisse se faire.",
    },
    meta: {
      en: "Your hardware · Nothing uploaded · 30 minutes",
      fr: "Votre matériel · Rien n'est téléversé · 30 minutes",
    },

    s1Label: { en: "What it actually is", fr: "De quoi il s'agit" },
    c1Title: { en: "A machine that has read everything", fr: "Une machine qui a tout lu" },
    c1Qual: { en: "Your files · Not the internet", fr: "Vos fichiers · Pas l'internet" },
    c1Body: {
      en: "Point it at your shared drive, your accounting system, your email archive. It reads what is there — including the scans and the photographs of paper — and it answers from those files rather than from whatever a model happens to know.",
      fr: "On le branche sur votre disque partagé, votre logiciel comptable, vos archives de courriels. Il lit ce qui s'y trouve — y compris les documents scannés et les photographies de papier — et répond à partir de ces fichiers, non de ce qu'un modèle sait par ailleurs.",
    },
    c2Title: { en: "A box in your building", fr: "Une machine dans vos murs" },
    c2Qual: { en: "Your hardware · Your network", fr: "Votre matériel · Votre réseau" },
    c2Body: {
      en: "It sits on hardware you own, on your own network. Nothing is uploaded and there is no account to cancel. If your internet goes down, it keeps working.",
      fr: "Il tourne sur du matériel qui vous appartient, sur votre propre réseau. Rien n'est téléversé et il n'y a aucun abonnement à résilier. Si votre connexion tombe, il continue de fonctionner.",
    },
    c3Title: { en: "It shows its working", fr: "Il montre d'où vient sa réponse" },
    c3Qual: { en: "Every answer, sourced", fr: "Chaque réponse, sourcée" },
    c3Body: {
      en: "Every answer comes back with the document and the page it came from. Nobody has to take it on trust, and a new starter can check it.",
      fr: "Chaque réponse revient avec le document et la page dont elle provient. Personne n'a à la croire sur parole, et un nouvel arrivant peut la vérifier.",
    },

    s2Label: { en: "Jobs it does", fr: "Ce qu'il fait" },
    s2Title: {
      en: "The work somebody is already doing by hand",
      fr: "Le travail que quelqu'un fait déjà à la main",
    },
    s2Body: {
      en: "Six jobs, in six different departments. None of them is exotic. All of them are somebody's week.",
      fr: "Six tâches, dans six services différents. Aucune n'a rien d'exotique. Toutes constituent la semaine de quelqu'un.",
    },
    /**
     * Cards 1 and 3 carry no link and no figures on purpose: nothing has been
     * recorded for either, and `usecase.recordedBody` promises that a number on
     * this site came out of a run that really happened. `jNote` says so rather
     * than leaving the reader to notice.
     */
    j1Title: { en: "Invoices for payment", fr: "Les factures à payer" },
    j1Qual: { en: "Accounts payable", fr: "Comptabilité fournisseurs" },
    j1Body: {
      en: "Supplier invoices arrive as PDFs, as scans, as photographs taken on a phone. Each one has to be matched to a purchase order, checked against the rate that was agreed, and stopped if it is a duplicate or the VAT is wrong. What comes back is the short list a person actually needs to look at.",
      fr: "Les factures fournisseurs arrivent en PDF, en scan, en photographie prise au téléphone. Chacune doit être rapprochée du bon de commande, contrôlée au regard du tarif convenu, et bloquée s'il s'agit d'un doublon ou si la TVA est erronée. Ce qui revient, c'est la courte liste qu'une personne doit réellement examiner.",
    },
    j2Title: { en: "CVs and applications", fr: "CV et candidatures" },
    j2Qual: { en: "Recruitment", fr: "Recrutement" },
    j2Body: {
      en: "Twelve hundred applications, five channels, six jobs, and no two written the same way. The rules go down in plain language before anything arrives. Then every application is screened against them, and every no carries the rule that stopped it.",
      fr: "Mille deux cents candidatures, cinq canaux, six postes, et pas deux rédigées de la même façon. Les règles sont consignées en langage courant avant la première arrivée. Puis chaque candidature est examinée à leur aune, et chaque refus porte la règle qui l'a arrêtée.",
    },
    j3Title: { en: "Paper and scans", fr: "Le papier et les scans" },
    j3Qual: { en: "Reading what was never typed", fr: "Lire ce qui n'a jamais été saisi" },
    j3Body: {
      en: "Delivery notes, signed forms, a certificate that arrived as a photograph. It reads them, pulls out the fields that matter, and tells you which ones it could not read rather than guessing at them.",
      fr: "Bons de livraison, formulaires signés, un certificat arrivé sous forme de photographie. Il les lit, en extrait les champs qui comptent, et vous signale ceux qu'il n'a pas pu lire au lieu de les deviner.",
    },
    j4Title: { en: "Quality and supplier records", fr: "Qualité et dossiers fournisseurs" },
    j4Qual: { en: "ISO 9001 · EN 9100", fr: "ISO 9001 · EN 9100" },
    j4Body: {
      en: "A twelve-person machine shop with three hundred documents and an auditor coming. Which certificates have lapsed, which procedure was never signed, which non-conformity has no closure record against it.",
      fr: "Un atelier de mécanique de douze salariés, trois cents documents, et un auditeur qui arrive. Quels certificats sont périmés, quelle procédure n'a jamais été signée, quelle non-conformité n'a aucun enregistrement de clôture.",
    },
    j5Title: { en: "Regulatory returns", fr: "Les déclarations réglementaires" },
    j5Qual: { en: "Reporting", fr: "Reporting réglementaire" },
    j5Body: {
      en: "Sixty-two thousand rows out of the core system every quarter, and some of them are wrong. Eight rules decide what can be reported, and somebody has to be able to defend every figure in it.",
      fr: "Soixante-deux mille lignes sorties du système central chaque trimestre, dont certaines sont fausses. Huit règles déterminent ce qui peut être déclaré, et quelqu'un doit pouvoir défendre chacun des chiffres.",
    },
    j6Title: { en: "Checking against a standard", fr: "Le contrôle au regard d'une norme" },
    j6Qual: { en: "Compliance", fr: "Conformité" },
    j6Body: {
      en: "Plans and documents checked against a published rulebook, with every finding traced back to the clause it came from.",
      fr: "Des plans et des documents contrôlés au regard d'un référentiel publié, chaque constat étant rattaché à l'article dont il découle.",
    },
    jNote: {
      en: "Four of these you can open or watch, and they are linked above. The other two are the same shape of work, described: we have not recorded a run of either, and would rather say so than let a number imply one.",
      fr: "Quatre d'entre elles peuvent être ouvertes ou regardées, et les liens sont ci-dessus. Les deux autres sont la même forme de travail, décrite : nous n'en avons enregistré aucune exécution, et préférons le dire plutôt que de laisser un chiffre le faire croire.",
    },
    jWatch: { en: "Watch it run", fr: "Voir l'exécution" },
    jDemo: { en: "Open the demonstration", fr: "Ouvrir la démonstration" },
    jProject: { en: "See the project", fr: "Voir le projet" },
    reportTitle: {
      en: "And the monthly report nobody has time to run.",
      fr: "Et le rapport mensuel que personne n'a le temps de produire.",
    },
    reportBody: {
      en: "The database you already own, asked a question directly instead of exported to a spreadsheet once a month and rebuilt by hand. That one is worked through in full on the home page.",
      fr: "La base de données que vous possédez déjà, interrogée directement au lieu d'être exportée vers un tableur une fois par mois et reconstruite à la main. Cet exemple est développé en entier sur la page d'accueil.",
    },
    reportCta: { en: "Read it there", fr: "Le lire là-bas" },

    s3Label: { en: "Three you can watch", fr: "Trois à regarder" },
    s3Body: {
      en: "Three of the jobs above were recorded on an ordinary desktop machine. The longest took just over three seconds. Press the button and watch one happen.",
      fr: "Trois des tâches ci-dessus ont été enregistrées sur un ordinateur de bureau ordinaire. La plus longue a pris un peu plus de trois secondes. Appuyez sur le bouton et regardez-en une se dérouler.",
    },

    sovereignTitle: { en: "What sovereign means here.", fr: "Ce que « souverain » veut dire ici." },
    sovereignBody: {
      en: "The data, the machine it runs on, and the decision about what happens to either one all belong to you. Not a clause in somebody's contract and not a setting in somebody's preferences page — a fact about where the wires go.",
      fr: "Les données, la machine sur laquelle elles sont traitées, et la décision de ce qu'il advient de l'une comme de l'autre vous appartiennent. Pas une clause dans le contrat d'un tiers ni une case dans son écran de réglages : un fait, qui tient au trajet des câbles.",
    },

    /**
     * Caption for the drawn plate in this section. The banner in the drawing
     * says "skills" in both languages on purpose: it names the thing the
     * assistant actually loads, and "compétences" would send a French reader
     * looking for a person.
     */
    plateSkillsCaption: {
      en: "The specialists in the basket are skills, not staff: folders of written instructions the assistant picks up when the work calls for them. Which model reads them stays your choice — including open ones running on your own machine, on your own files.",
      fr: "Les spécialistes du panier sont des skills, pas des salariés : des dossiers d'instructions écrites que l'assistant reprend quand le travail l'exige. Le modèle qui les lit reste votre choix — y compris un modèle ouvert, sur votre machine et sur vos fichiers.",
    },
    platePortraitsCaption: {
      en: "Somebody in accounts, somebody in recruitment, somebody in quality. The six jobs below are theirs, and all six are being done by hand this week.",
      fr: "Quelqu'un à la comptabilité, quelqu'un au recrutement, quelqu'un à la qualité. Les six tâches ci-dessous sont les leurs, et toutes les six se font à la main cette semaine.",
    },

    s4Label: { en: "Why it runs in your building", fr: "Pourquoi il tourne chez vous" },
    s4Title: {
      en: "Four different reasons, one identical constraint",
      fr: "Quatre raisons différentes, une contrainte identique",
    },
    s4Body: {
      en: "Some businesses cannot send their files anywhere at all. A law firm cannot, because privilege forbids it. A manufacturer cannot, because the standard is licensed and the drawings are export-controlled. A clinic cannot, because of the patients. An accountant cannot, because of the clients. The reasons have nothing to do with one another. The constraint is the same one every time: the documents stay in the building.",
      fr: "Certaines entreprises ne peuvent envoyer leurs fichiers nulle part. Un cabinet d'avocats ne le peut pas : le secret professionnel l'interdit. Un industriel ne le peut pas : la norme est sous licence et les plans sous contrôle export. Un cabinet médical ne le peut pas, à cause des patients. Un expert-comptable ne le peut pas, à cause de ses clients. Les raisons n'ont rien à voir entre elles. La contrainte, elle, est chaque fois la même : les documents restent dans les murs.",
    },
    w1Title: { en: "Privacy, obviously", fr: "La confidentialité, bien sûr" },
    w1Body: {
      en: "On-premise is not a setting somebody switches on in a preferences page. It is an architecture, and it is either true of your system or it is not.",
      fr: "Le sur-site n'est pas une case à cocher dans un écran de réglages. C'est une architecture, et elle est vraie de votre système ou elle ne l'est pas.",
    },
    w2Title: { en: "It does not change under you", fr: "Rien ne bouge sous vos pieds" },
    w2Body: {
      en: "A cloud service is updated on somebody else's schedule, and a process that was defensible in March can quietly stop being so in June. A system on your own machine changes when you change it.",
      fr: "Un service en nuage est mis à jour au calendrier d'un autre, et un processus défendable en mars peut cesser de l'être en juin sans que nul ne vous prévienne. Un système installé sur votre machine ne change que lorsque vous le changez.",
    },
    w3Title: { en: "The cost curve bends the other way", fr: "La courbe des coûts s'inverse" },
    w3Body: {
      en: "Cloud AI is priced per question, so the better it works for you the more of it you buy. Hardware you own is priced once.",
      fr: "L'IA en nuage se facture à la question : mieux elle vous sert, plus vous en achetez. Le matériel que vous possédez se paie une fois.",
    },
    wMore: {
      en: "That case is made properly on the home page, along with what running a model on your own machine actually involves — trade-offs included.",
      fr: "Cet argument est développé comme il se doit sur la page d'accueil, avec ce qu'implique réellement l'exécution d'un modèle sur votre propre machine — arbitrages compris.",
    },
    wMoreCta: { en: "The longer argument", fr: "L'argument développé" },

    hwLabel: { en: "What it runs on", fr: "Sur quoi il tourne" },
    h1Title: { en: "One machine", fr: "Une seule machine" },
    h1Body: {
      en: "A tower with a good graphics card, standing in the same cupboard as your server. Not a data centre, and not a rack.",
      fr: "Une tour équipée d'une bonne carte graphique, posée dans le même placard que votre serveur. Pas un centre de données, pas une baie.",
    },
    h2Title: { en: "You own it", fr: "Elle vous appartient" },
    h2Body: {
      en: "You buy the hardware, or we specify it and you buy it. There is no monthly fee keeping the software alive.",
      fr: "Vous achetez le matériel, ou nous le spécifions et vous l'achetez. Aucun abonnement mensuel ne conditionne le fonctionnement du logiciel.",
    },
    h3Title: { en: "Or somewhere else entirely", fr: "Ou bien tout ailleurs" },
    h3Body: {
      en: "A private cloud, or a machine we host. The same system either way, and the choice is yours — which is what Your Infrastructure, Your Models already promises on the services page.",
      fr: "Un nuage privé, ou une machine que nous hébergeons. Le même système dans tous les cas, et le choix vous revient — c'est ce que promet déjà « Votre infrastructure, vos modèles » sur la page des prestations.",
    },
    modelTitle: {
      en: "And the model is a component, not the commitment.",
      fr: "Et le modèle est un composant, pas un engagement.",
    },
    modelBody: {
      en: "What you are handed at the end is a folder: your instructions in plain language, the scripts that do the work, your data. An open-weight model on hardware in your own building will run it. So will Mistral, or a frontier model, if that is what the work turns out to want. The choice stays reversible.",
      fr: "Ce qu'on vous remet au bout du compte est un dossier : vos instructions en langage courant, les scripts qui font le travail, vos données. Un modèle à poids ouverts installé chez vous saura les exécuter. Mistral aussi, ou un modèle de premier plan si le travail l'exige. Le choix reste réversible.",
    },

    s5Label: { en: "Already running this way", fr: "Déjà en fonctionnement" },
    s5Body: {
      en: "Four systems built on the same principle, in four rooms that have nothing else in common.",
      fr: "Quatre systèmes bâtis sur le même principe, dans quatre contextes qui n'ont rien d'autre en commun.",
    },
    ev1Title: {
      en: "A sales system, on the client's own hardware",
      fr: "Un système commercial, sur le matériel du client",
    },
    ev1Qual: { en: "Business development", fr: "Développement commercial" },
    ev1Body: {
      en: "6,675 prospects researched and profiled on a machine standing in the building. Open-weight models do the bulk of the reading and writing; a frontier model is called across one auditable boundary, with identifying detail held back.",
      fr: "6 675 prospects recherchés et profilés sur une machine présente dans les locaux. Des modèles à poids ouverts assurent l'essentiel de la lecture et de la rédaction ; un modèle de premier plan n'est appelé qu'à travers une frontière unique et auditable, les éléments identifiants étant retenus.",
    },
    ev2Title: { en: "A law firm's document set", fr: "Le fonds documentaire d'un cabinet d'avocats" },
    ev2Qual: {
      en: "Litigation · The hardest version",
      fr: "Contentieux · La version la plus exigeante",
    },
    ev2Body: {
      en: "High volume, high stakes, and a privilege requirement that rules out the cloud entirely — the version of this problem where sending a file outside ends a career. It was built there first, which is why the rest of this page is not a promise.",
      fr: "Gros volumes, enjeux élevés, et une exigence de secret professionnel qui exclut totalement le nuage — la version du problème où envoyer un fichier au-dehors met fin à une carrière. C'est là qu'il a d'abord été construit, et c'est pourquoi le reste de cette page n'est pas une promesse.",
    },
    ev3Title: { en: "Bomza", fr: "Bomza" },
    ev3Qual: {
      en: "Building regulations · South Africa",
      fr: "Réglementation du bâtiment · Afrique du Sud",
    },
    ev3Body: {
      en: "Building plans verified against a published national standard, with every finding traced back to the clause it comes from.",
      fr: "Des plans de construction vérifiés au regard d'une norme nationale publiée, chaque constat étant rattaché à l'article dont il découle.",
    },
    ev4Title: { en: "EntityVault", fr: "EntityVault" },
    ev4Qual: {
      en: "Entity management · Consent-based sharing",
      fr: "Gestion des entités · Partage sous consentement",
    },
    ev4Body: {
      en: "Tokenised storage and consent-based collaboration, so records can be shared between parties without exposing the underlying data to any of them.",
      fr: "Stockage tokenisé et collaboration sous consentement : les dossiers peuvent être partagés entre parties sans exposer à aucune d'elles les données sous-jacentes.",
    },

    bringLabel: { en: "What you would need to bring", fr: "Ce qu'il faudrait apporter" },
    bringBody: {
      en: "The work you already repeat. A few examples of it done properly. The software you already licence. And a person who can tell a right answer from a wrong one — that last one does not go away. Checking the output is the new job, and it is the part worth being clear about.",
      fr: "Le travail que vous répétez déjà. Quelques exemples bien faits. Les logiciels sous licence que vous avez déjà. Et une personne capable de distinguer une bonne réponse d'une mauvaise : celle-là ne disparaît pas. Vérifier le résultat est le nouveau métier, et c'est la part sur laquelle il faut être clair.",
    },

    s6Label: { en: "Engagement", fr: "Modalités d'intervention" },
    s6Body: {
      en: "Three stages, each one a decision point rather than a commitment to the next. The same three whatever the trade.",
      fr: "Trois étapes, chacune constituant un point de décision plutôt qu'un engagement pour la suivante. Les mêmes trois, quel que soit le métier.",
    },
    /** The general reading of `pythia.e1Body`, which says "for your practice". */
    e1Body: {
      en: "Two weeks. We look at your real documents and the way the work actually moves, and tell you what this would and would not do for you.",
      fr: "Deux semaines. Nous examinons vos documents réels et la façon dont le travail circule vraiment, puis nous vous disons ce que cela ferait — et ne ferait pas — pour vous.",
    },

    legalTitle: {
      en: "If your constraint is privilege",
      fr: "Si votre contrainte est le secret professionnel",
    },
    legalBody: {
      en: "There is a page written for litigation in particular — disclosure sets, cited answers, and the audit checks that go with them.",
      fr: "Une page est écrite pour le contentieux en particulier : fonds de pièces, réponses sourcées, et les contrôles qui les accompagnent.",
    },
    legalCta: { en: "Read the Pythia page", fr: "Lire la page Pythia" },

    ctaTitle: {
      en: "What is the job that eats your week?",
      fr: "Quelle est la tâche qui dévore votre semaine ?",
    },
    ctaBody: {
      en: "Bring us the specific one, not the impressive one. Thirty minutes is usually enough to tell you honestly whether this is worth your time.",
      fr: "Apportez-nous la tâche précise, pas la plus impressionnante. Trente minutes suffisent en général pour vous dire honnêtement si cela vaut votre temps.",
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

    /** Sits above section 03. Short: the section heading below does the arguing. */
    plateSkillsCaption: {
      en: "Skills are written instructions, not staff — and the model that reads them can be one you run yourself.",
      fr: "Les skills sont des instructions écrites, pas des salariés — et le modèle qui les lit peut être un modèle que vous faites tourner vous-même.",
    },
    plateLawyerCaption: {
      en: "One of those rooms. A disclosure set runs to 150,000 documents and nobody can read it in the time there is, so the work is not reading faster: it is making the pile answerable.",
      fr: "Une de ces pièces. Un dossier de communication de pièces compte 150 000 documents que personne ne peut lire dans le temps imparti ; le travail n'est donc pas de lire plus vite, mais de rendre la pile interrogeable.",
    },
    plateBuilderCaption: {
      en: "Local first is a building decision before it is a privacy one. The case comes off, the plan is on the table, and the machine it runs on is one you can put a hand on.",
      fr: "Le local d'abord est un choix de construction avant d'être un choix de confidentialité. Le boîtier s'ouvre, le plan est sur la table, et la machine qui le fait tourner, vous pouvez la toucher de la main.",
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
      en: "Praxis: one to one, on your own use cases, from an hour to eight sessions. You leave with a working tool for your own work, not with notes about one. There are group evenings too, cheaper and more general, if you would rather look before you commit.",
      fr: "Praxis : en tête-à-tête, sur vos propres cas d'usage, d'une heure à huit séances. Vous repartez avec un outil qui fonctionne pour votre propre travail, et non avec des notes à son sujet. Il existe aussi des soirées collectives, moins chères et plus générales, si vous préférez regarder avant de vous engager.",
    },
    r2Title: { en: "Have it built", fr: "Le faire construire" },
    r2Body: {
      en: "A short diagnostic on your real workflows comes first, so that what gets built is the thing that was actually costing you, rather than the thing that was easiest to describe.",
      fr: "Un court diagnostic sur vos processus réels vient d'abord, afin que ce qui sera construit soit ce qui vous coûtait vraiment, et non ce qui était le plus facile à décrire.",
    },
    r3Title: { en: "See a whole system", fr: "Voir un système entier" },
    r3Body: {
      en: "Pythia in full — a system that reads everything you hold and answers from it, on a machine you own. What it does, what it costs, and an open demonstration you can click through without speaking to anybody.",
      fr: "Pythia en entier — un système qui lit tout ce que vous conservez et répond à partir de là, sur une machine qui vous appartient. Ce qu'il fait, ce qu'il coûte, et une démonstration ouverte que vous pouvez parcourir sans parler à personne.",
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

  /**
   * The Applied AI Evenings calendar. Prices are never inside a sentence here:
   * the header currency toggle rewrites them, so the copy is split into
   * fragments that read correctly in both languages around an inserted figure.
   */
  calendar: {
    plateCalendarCaption: {
      en: "Dates, not a course. Nothing assumes you were there last time, so pick the evening that suits and come to that one.",
      fr: "Des dates, pas un cursus. Rien ne suppose que vous étiez là la fois précédente : choisissez la soirée qui vous convient et venez à celle-là.",
    },
    /** Caption for the drawing under the header. */
    plateHandsCaption: {
      en: "What an evening is for: one person, and the tools they already had, wired to talk to each other.",
      fr: "C'est à cela que sert une soirée : une personne, et les outils qu'elle avait déjà, reliés entre eux.",
    },
    eyebrow: { en: "Praxis · Autumn 2026", fr: "Praxis · Automne 2026" },
    title: { en: "Applied AI Evenings", fr: "Les soirées IA appliquée" },
    leadA: {
      en: "The same four sessions online every month, the first one free, and an evening in person in the Lot every fortnight. After work, an hour online or ninety minutes in a hall.",
      fr: "Les quatre mêmes séances en ligne chaque mois, la première gratuite, et une soirée en présentiel dans le Lot tous les quinze jours. Après le travail : une heure en ligne, ou quatre-vingt-dix minutes dans une salle.",
    },
    leadStrong: {
      en: "Every date stands on its own.",
      fr: "Chaque date se suffit à elle-même.",
    },
    leadB: {
      en: "Take a whole month, or drop into the one you need. Nothing assumes you were there last time, and if you miss a month it comes round again.",
      fr: "Prenez un mois entier, ou venez seulement à celle qu'il vous faut. Rien ne suppose que vous étiez là la fois précédente, et si vous manquez un mois, tout revient le mois suivant.",
    },

    factFirstFree: { en: "First Tuesday free", fr: "Premier mardi gratuit" },
    factPerClass: { en: "a class,", fr: "la séance," },
    factAllSix: { en: "for all three", fr: "les trois" },
    factHour: { en: "One hour, 20:00 CET", fr: "Une heure, 20h00 CET" },
    factLotFree: { en: "Lot evenings free", fr: "Soirées du Lot gratuites" },

    onlineTitle: { en: "Online, every month", fr: "En ligne, chaque mois" },
    onlineIntro: {
      en: "Tuesday evenings, 20:00 to 21:00 Paris time, in English. The same four come round every month: the first Tuesday is free and stands alone, then the three classes. Take a whole month, or drop into the one you need. Each class is recorded, so if a date does not suit you, ask for the recording.",
      fr: "Le mardi soir, de 20h00 à 21h00 heure de Paris, en anglais. Les quatre mêmes séances reviennent chaque mois : le premier mardi est gratuit et se suffit à lui-même, puis les trois séances du parcours. Prenez un mois entier, ou seulement celle qu'il vous faut. Chaque séance est enregistrée : si une date ne vous convient pas, demandez l'enregistrement.",
    },
    /** Marks a session's place in the monthly cycle, in place of a date. */
    nthTuesday: { en: "Tue of the month", fr: "mardi du mois" },
    /** Ordinal suffix set superscript against the session number. */
    ord1: { en: "st", fr: "er" },
    ord2: { en: "nd", fr: "e" },
    ord3: { en: "rd", fr: "e" },
    ord4: { en: "th", fr: "e" },
    datesLabel: { en: "The Tuesdays", fr: "Les mardis" },
    datesNote: {
      en: "The run opens in October. When a month has five Tuesdays the last one is skipped, so the cycle stays four long.",
      fr: "Le parcours démarre en octobre. Quand un mois compte cinq mardis, le dernier saute, pour que le cycle reste à quatre séances.",
    },

    lotTitle: { en: "In the Lot, in person", fr: "Dans le Lot, en présentiel" },
    lotIntro: {
      en: "Every second Thursday, 20:30 to 22:00, in French. Ninety minutes in a village hall, open to anyone, and free. It is the same evening each time in a different commune, so come to whichever is nearest. There is nothing to catch up on and no order to follow.",
      fr: "Un jeudi sur deux, de 20h30 à 22h00, en français. Quatre-vingt-dix minutes dans une salle des fêtes, ouvertes à tous, et gratuites. C'est la même soirée à chaque fois, dans une commune différente ; venez à la plus proche. Rien à rattraper, aucun ordre à suivre.",
    },
    lotDatesLabel: { en: "The Thursdays", fr: "Les jeudis" },
    lotDatesNote: {
      en: "Each falls two days after that week's online session, so you can watch it online first if you want to. Venues are being confirmed, and go out with the reminder.",
      fr: "Chacune tombe deux jours après la séance en ligne de la semaine, si vous voulez d'abord la voir à distance. Les lieux sont en cours de confirmation et sont annoncés avec le rappel.",
    },

    tagFree: { en: "Free", fr: "Gratuit" },

    oct: { en: "Oct", fr: "oct." },
    nov: { en: "Nov", fr: "nov." },
    tue: { en: "Tue", fr: "mar." },
    thu: { en: "Thu", fr: "jeu." },

    /**
     * The recurring free one. It is the front door for the whole run, so it is
     * an overview of where these systems actually are as much as a demo.
     */
    o1Title: {
      en: "What AI can do now, seen working",
      fr: "Ce que l'IA sait faire aujourd'hui, en action",
    },
    o1Body: {
      en: "Where these systems actually are today, watched working in real time rather than described. What they can do, what they still cannot, and an empty folder becoming a working tool while you watch. Start here if you have only ever used AI in a chat box.",
      fr: "Où en sont réellement ces systèmes aujourd'hui, montrés en train de travailler en temps réel plutôt que décrits. Ce qu'ils savent faire, ce qu'ils ne savent toujours pas faire, et un dossier vide qui devient un outil qui fonctionne sous vos yeux. Commencez ici si vous n'avez jamais utilisé l'IA que dans une fenêtre de conversation.",
    },
    o2Title: { en: "The build loop", fr: "La boucle de construction" },
    o2Body: {
      en: "You describe what you want in plain English. It gets built. You look at it and say what is wrong. What that loop looks like from the outside, and where a person still has to think.",
      fr: "Vous décrivez ce que vous voulez en langage courant. C'est construit. Vous regardez le résultat et dites ce qui ne va pas. À quoi ressemble cette boucle vue de l'extérieur, et où une personne doit encore réfléchir.",
    },
    /** Data-and-cost merged with hosting-and-safety: one session on exposure. */
    o3Title: { en: "Safety, data, and what it costs", fr: "Sécurité, données, et ce que cela coûte" },
    o3Body: {
      en: "The questions everyone asks and few answer plainly. Where your files go, what is kept, what “training on your data” does and does not mean, and the real monthly number. Then where a tool runs once it leaves your laptop, what that exposes, and how to protect yourself when work goes online.",
      fr: "Les questions que tout le monde pose et auxquelles peu répondent clairement. Où vont vos fichiers, ce qui est conservé, ce que « l'entraînement sur vos données » signifie et ne signifie pas, et le vrai montant mensuel. Puis où tourne un outil une fois qu'il a quitté votre ordinateur, ce que cela expose, et comment vous protéger quand le travail passe en ligne.",
    },
    /** Rules, connectors and the real build, merged into the closing session. */
    o4Title: {
      en: "Your rules, your connections, and something real",
      fr: "Vos règles, vos connexions, et quelque chose de réel",
    },
    o4Body: {
      en: "Write down the rules your work already follows, so a tool applies them the same way every time, including the day you are not there. Connect it to your calendar, your drive, your documents, with you deciding what it can touch. Then one build end to end on a job that comes round every week, your own MCP included, the small piece that lets an assistant reach a system you already use.",
      fr: "Mettez par écrit les règles que votre travail suit déjà, pour qu'un outil les applique de la même façon à chaque fois, y compris le jour où vous n'êtes pas là. Reliez-le à votre agenda, votre espace de stockage, vos documents, en décidant vous-même de ce qu'il peut toucher. Puis une construction de bout en bout sur une tâche qui revient chaque semaine, votre propre MCP compris, la petite pièce qui permet à un assistant d'atteindre un système que vous utilisez déjà.",
    },

    /** One description, since it is the same talk in each commune. */
    lotEveningTitle: { en: "L'IA concrète", fr: "L'IA concrète" },
    lotEveningBody: {
      en: "A carpenter's devis system built live, from the job notes to a quote that comes out the same every time, mentions légales included. Then what applied AI means for a small business, for your children, and what building safely looks like.",
      fr: "Un système de devis pour un menuisier construit en direct, des notes de chantier au devis qui sort identique à chaque fois, mentions légales comprises. Puis ce que l'IA appliquée signifie pour une petite entreprise, pour vos enfants, et à quoi ressemble une construction sûre.",
    },

    note1Title: { en: "Nothing to prepare", fr: "Rien à préparer" },
    note1Body: {
      en: "Turn up and watch. If you would rather follow along, bring a laptop, but it is not expected and nobody will be waiting for you.",
      fr: "Venez et regardez. Si vous préférez suivre en pratiquant, apportez un ordinateur portable, mais ce n'est pas attendu et personne ne vous attendra.",
    },
    note2Title: { en: "Built live, not recorded", fr: "Construit en direct, pas préenregistré" },
    note2Body: {
      en: "The part that matters has no slides. Things occasionally go wrong on screen, which is the useful bit, and the part a polished video will never show you.",
      fr: "La partie qui compte n'a pas de diapositives. Il arrive que les choses se passent mal à l'écran, et c'est justement le plus utile : ce qu'une vidéo bien léchée ne vous montrera jamais.",
    },
    /**
     * The distinction that matters commercially: these are group workshops on
     * generic examples, and Praxis proper is one to one on the client's own
     * material. Stated as a comparison rather than prose so neither side can
     * be skim-read into the other.
     */
    compareTitle: { en: "These evenings, or Praxis?", fr: "Ces soirées, ou Praxis ?" },
    compareIntro: {
      en: "Both are Praxis teaching and they are not the same thing. Come to an evening to work out whether any of this applies to you. Take Praxis one to one when you want it applied to your own work.",
      fr: "Les deux relèvent de Praxis, et ce ne sont pas la même chose. Venez à une soirée pour déterminer si tout cela vous concerne. Prenez Praxis en tête-à-tête quand vous voulez l'appliquer à votre propre travail.",
    },
    compareAHead: { en: "These evenings", fr: "Ces soirées" },
    compareA1: {
      en: "In a group. Other people are there, asking their own questions.",
      fr: "En groupe. D'autres personnes sont là, avec leurs propres questions.",
    },
    compareA2: {
      en: "Generic examples: a carpenter's quote, a report that comes round every week. Not your files.",
      fr: "Des exemples génériques : le devis d'un menuisier, un rapport qui revient chaque semaine. Pas vos fichiers.",
    },
    compareA3: {
      en: "Short. A free hour, or three classes if you want the course.",
      fr: "Court. Une heure gratuite, ou trois séances si vous voulez le parcours.",
    },
    compareA4: {
      en: "Higher level: what this is good for and what it asks of you, rather than how to build it line by line.",
      fr: "Plus haut niveau : à quoi cela sert et ce que cela exige de vous, plutôt que comment le construire ligne à ligne.",
    },
    compareBHead: { en: "Praxis, one to one", fr: "Praxis, en tête-à-tête" },
    compareB1: { en: "Just you and me. Nobody else's questions.", fr: "Vous et moi. Les questions de personne d'autre." },
    compareB2: {
      en: "Your own use cases. Send your examples when you register and we learn on those, from the first session.",
      fr: "Vos propres cas d'usage. Envoyez vos exemples à l'inscription et nous apprenons sur ceux-là, dès la première séance.",
    },
    compareB3: { en: "Longer. Eight sessions, over two months.", fr: "Plus long. Huit séances, sur deux mois." },
    compareB4: {
      en: "How to build, in your hands, until you can carry on without me.",
      fr: "Comment construire, entre vos mains, jusqu'à pouvoir continuer sans moi.",
    },

    note3Title: { en: "Not a pitch", fr: "Ce n'est pas un argumentaire" },
    note3Body: {
      en: "There is a longer programme for people who want to go further, and these classes are not a sales run at it. Come, learn something, leave. If you do go further, what you paid here comes off the price.",
      fr: "Il existe un programme plus long pour celles et ceux qui veulent aller plus loin, et ces séances ne sont pas une opération commerciale à son profit. Venez, apprenez quelque chose, repartez. Si vous allez plus loin, ce que vous avez payé ici est déduit du prix.",
    },

    joinTitle: { en: "Coming to one", fr: "Venir à une séance" },
    joinA: { en: "Write to", fr: "Écrivez à" },
    joinB: {
      en: "and say which date. You get a link the day before and a reminder an hour ahead. No account, no sign-up form.",
      fr: "en indiquant la date. Vous recevez un lien la veille et un rappel une heure avant. Pas de compte, pas de formulaire d'inscription.",
    },
    joinPay: {
      en: "The first Tuesday of the month and every Lot evening are free, so for those there is nothing else to do. For the three classes you get a payment link with the confirmation, and you can pay for one or for all three.",
      fr: "Le premier mardi du mois et toutes les soirées dans le Lot sont gratuits : pour ceux-là, il n'y a rien d'autre à faire. Pour les trois séances, vous recevez un lien de paiement avec la confirmation, et vous pouvez régler une séance ou les trois.",
    },
    joinReschedule: {
      en: "If a date does not work, say so. Everything here runs again, and there is a recording of every class.",
      fr: "Si une date ne vous convient pas, dites-le. Tout ce qui est ici sera reprogrammé, et chaque séance est enregistrée.",
    },

    independence: {
      en: "These evenings are independent and are not run on behalf of Anthropic.",
      fr: "Ces soirées sont indépendantes et ne sont pas organisées pour le compte d'Anthropic.",
    },

    programmeTitle: { en: "The Praxis Programme", fr: "Le programme Praxis" },
    programmeBody: {
      en: "Eight sessions, one to one, built on use cases you send before we start. Where you learn to build rather than to apply. What you pay for these evenings comes off the price.",
      fr: "Huit séances, en tête-à-tête, construites à partir de cas d'usage que vous envoyez avant de commencer. C'est là que l'on apprend à construire, et non seulement à appliquer. Ce que vous payez pour ces soirées est déduit du prix.",
    },
    programmeLink: { en: "See the programme", fr: "Voir le programme" },

    /** Card on /praxis pointing here. Its job is to draw the contrast. */
    fromPraxisTitle: {
      en: "Applied AI Evenings — the group version",
      fr: "Les soirées IA appliquée — la version collective",
    },
    fromPraxisBody: {
      en: "The same four sessions online every month — the first free — and an evening in the Lot every fortnight. In a group, on generic examples, and pitched higher: applying rather than building. The one to one on this page is the tailored version.",
      fr: "Les quatre mêmes séances en ligne chaque mois — la première gratuite — et une soirée dans le Lot tous les quinze jours. En groupe, sur des exemples génériques, et à un niveau plus élevé : appliquer plutôt que construire. Le tête-à-tête présenté sur cette page en est la version sur mesure.",
    },
    fromPraxisLink: { en: "See the dates", fr: "Voir les dates" },
  },
  /**
   * The worked-examples page. The runs themselves are generated data, so their
   * French lives in `lib/fr/usecase.ts` keyed on the English; what is here is
   * the page's own furniture — the opener, the console's controls, and the
   * argument underneath.
   *
   * The pacing sentences are split into parts because a figure sits inside
   * them. That is the same shape the calendar and home leads use.
   */
  usecase: {
    eyebrow: { en: "A demonstration · applied AI", fr: "Une démonstration · IA appliquée" },
    title: {
      en: "What building with AI actually looks like",
      fr: "À quoi ressemble vraiment un travail construit avec l'IA",
    },
    lede: {
      en: "Three pieces of real work, in three different trades. Messy information goes in, rules somebody wrote get applied, and out comes the format their organisation already expects. Press the button and watch one happen.",
      fr: "Trois travaux réels, dans trois métiers différents. Des informations en désordre entrent, des règles écrites par quelqu'un s'appliquent, et il en sort le format que son organisation attend déjà. Appuyez sur le bouton et regardez.",
    },

    /* The console */
    recorded: { en: "recorded run", fr: "exécution enregistrée" },
    run: { en: "Run it", fr: "Lancer" },
    running: { en: "Running", fr: "En cours" },
    runAgain: { en: "Run it again", fr: "Relancer" },
    pacingA: { en: "The real run takes", fr: "L'exécution réelle prend" },
    pacingB: { en: "seconds. Played back over", fr: "secondes. Rejouée sur" },
    pacingC: {
      en: "seconds, slowly enough to read what it is doing.",
      fr: "secondes, assez lentement pour qu'on puisse lire ce qu'elle fait.",
    },
    pacingSeconds: { en: "seconds.", fr: "secondes." },
    pacingDuring: {
      en: "Reading the data and applying the rules.",
      fr: "Lecture des données et application des règles.",
    },
    finished: { en: "Finished", fr: "Terminé" },
    finishedSubA: { en: "The run took", fr: "L'exécution a pris" },
    finishedSubB: {
      en: "seconds on an ordinary desktop machine.",
      fr: "secondes sur un ordinateur de bureau ordinaire.",
    },
    filesMade: { en: "The files it produced", fr: "Les fichiers produits" },
    /** File sizes on the download list. */
    unitKb: { en: "KB", fr: "Ko" },
    unitMb: { en: "MB", fr: "Mo" },

    /* The argument underneath */
    shapeKicker: { en: "The shape of it", fr: "La forme de la chose" },
    shapeTitle: {
      en: "The same five beats, every time",
      fr: "Les mêmes cinq temps, à chaque fois",
    },
    shapeBody: {
      en: "Whatever the trade, this work has the same five parts. Once you can see them you start spotting them in your own week, which is the only thing this page is for.",
      fr: "Quel que soit le métier, ce travail comporte les mêmes cinq parties. Une fois qu'on les voit, on se met à les repérer dans sa propre semaine — et cette page ne sert à rien d'autre.",
    },

    beat1: { en: "The mess", fr: "Le désordre" },
    beat1Body: {
      en: "The real input, at real volume, in the software you already use.",
      fr: "Les vraies données, au vrai volume, dans les logiciels que vous utilisez déjà.",
    },
    beat2: { en: "The rules", fr: "Les règles" },
    beat2Body: {
      en: "Written by a person, in their own words, once. Applied to every record, every time.",
      fr: "Écrites par une personne, avec ses mots, une seule fois. Appliquées à chaque enregistrement, à chaque fois.",
    },
    beat3: { en: "The run", fr: "L'exécution" },
    beat3Body: {
      en: "On your own machine. Nothing has to leave the building.",
      fr: "Sur votre propre machine. Rien n'a besoin de sortir des murs.",
    },
    beat4: { en: "The catch", fr: "Ce qui est attrapé" },
    beat4Body: {
      en: "What it found that a person would have missed, and what it hands back for a decision.",
      fr: "Ce qu'elle a trouvé et qu'une personne aurait manqué, et ce qu'elle renvoie pour décision.",
    },
    beat5: { en: "The output", fr: "Le résultat" },
    beat5Body: {
      en: "The format your organisation already expects, with the figures carried through rather than re-typed.",
      fr: "Le format que votre organisation attend déjà, avec des chiffres repris tels quels plutôt que ressaisis.",
    },

    figureAlt: {
      en: "A spreadsheet listing eight rules in plain English, each with what it does, its outcome, and how many records it affected.",
      fr: "Un tableur listant huit règles en langage clair, chacune avec ce qu'elle fait, son résultat, et le nombre d'enregistrements concernés.",
    },
    figureCaption: {
      en: "The fourth beat is the one that sells, and this is where it lives. Every run prints the rules it applied, in plain English, with what each one caught. Nobody has to take the result on trust, and a new starter can read it.",
      fr: "Le quatrième temps est celui qui convainc, et c'est ici qu'il se joue. Chaque exécution imprime les règles qu'elle a appliquées, en langage clair, avec ce que chacune a attrapé. Personne n'a à croire le résultat sur parole, et un nouvel arrivant peut le lire.",
    },

    bringTitle: { en: "What you would need to bring.", fr: "Ce qu'il faudrait apporter." },
    bringBody: {
      en: "The work you already repeat, a few examples of it done properly, the software you already licence, and a person who can tell a right answer from a wrong one. That last one does not go away. Checking the output is the new job, and it is the part worth being clear about.",
      fr: "Le travail que vous répétez déjà, quelques exemples bien faits, les logiciels sous licence que vous avez déjà, et une personne capable de distinguer une bonne réponse d'une mauvaise. Cette dernière ne disparaît pas. Vérifier le résultat est le nouveau métier, et c'est la part sur laquelle il faut être clair.",
    },
    inventedTitle: {
      en: "None of this is anyone's real data.",
      fr: "Rien ici n'est la vraie donnée de qui que ce soit.",
    },
    inventedBody: {
      en: "Every firm, record and candidate here is invented, generated by code, and reproducible from a fixed starting number. We do not demonstrate on a client's material, and we will not ask for yours until there is an agreement.",
      fr: "Chaque entreprise, enregistrement et candidat présentés ici sont inventés, générés par du code, et reproductibles à partir d'un nombre de départ fixe. Nous ne faisons pas de démonstration sur le matériel d'un client, et nous ne demanderons pas le vôtre tant qu'il n'y a pas d'accord.",
    },
    recordedTitle: {
      en: "These are recordings of runs that really happened",
      fr: "Ce sont des enregistrements d'exécutions qui ont réellement eu lieu",
    },
    recordedBody: {
      en: ", captured on 13 August 2026 by the same code that draws the live progress list. The stages, their order, the notes and the files are exactly what those runs produced. The pace is slowed so it can be read, and each demo states what the run really took. The page itself has no backend: it cannot execute anything and there is nowhere to upload a document to. That is deliberate.",
      fr: ", capturées le 13 août 2026 par le code même qui dessine la liste de progression. Les étapes, leur ordre, les lignes affichées et les fichiers sont exactement ce que ces exécutions ont produit. Le rythme est ralenti pour être lisible, et chaque démonstration indique la durée réelle. La page elle-même n'a pas de serveur : elle ne peut rien exécuter et il n'y a nulle part où déposer un document. C'est délibéré.",
    },

    ctaTitle: {
      en: "What is the job that eats your week?",
      fr: "Quelle est la tâche qui dévore votre semaine ?",
    },
    ctaBody: {
      en: "Bring us the specific one, not the impressive one. Thirty minutes is usually enough to tell you honestly whether this is worth your time.",
      fr: "Apportez-nous la tâche précise, pas la plus impressionnante. Trente minutes suffisent en général pour vous dire honnêtement si cela vaut votre temps.",
    },

    /**
     * The third beat says "on your own machine", and until now the page left it
     * at that. This names the system that does it and gives the reader
     * somewhere to go and read about it.
     */
    hardwareTitle: { en: "Where these actually run.", fr: "Où tout cela s'exécute." },
    hardwareBody: {
      en: "On a machine in the building, reading files that never leave it. That is a system in its own right, and it has a page of its own.",
      fr: "Sur une machine présente dans les locaux, qui lit des fichiers qui n'en sortent jamais. C'est un système à part entière, et il a sa propre page.",
    },
    hardwareCta: { en: "Sovereign AI", fr: "L'IA souveraine" },
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
