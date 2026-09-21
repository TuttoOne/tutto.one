/**
 * Copy for the landing page at `/`.
 *
 * English and French, in `{ en, fr }` leaves, resolved through `useT()` from
 * i18n.ts. It stays in its own file rather than in i18n.ts because this is the
 * page most likely to be rewritten wholesale, and it should be rewritable
 * without touching the file every other page depends on. The French is not a
 * gloss: prices take French typography (3 000 €, not €3,000) and the sentences
 * are the ones a French reader would actually be told.
 *
 * ---
 *
 * WHAT THIS PAGE SAYS, which is the only decision on it that matters.
 *
 * One thing: we build agents. The page's whole job is to get a reader from
 * "I have a chat window open and I am not sure why" to "somebody could build
 * me the thing that does the job", and it does that with a sequence — chat,
 * then a workspace that remembers, then an agent — because a reader who does
 * not see the sequence cannot see where they are on it.
 *
 * The previous version sold four offers at once and was forgettable for it.
 * If a new offer needs a home, give it a page; do not add a fifth door here.
 *
 * ---
 *
 * THE WORD BUDGET IS THE POINT: 400 words per language of rendered prose. It
 * is short because the reader is deciding whether to spend thirty minutes, not
 * whether to sign. Adding a paragraph means cutting one.
 *
 * It started at 350 and was raised once the client band and a longer hero had
 * earned the room. Two things are outside it, deliberately: the client names,
 * which are proper nouns in a list a reader scans rather than prose they read,
 * and any leaf that is not rendered on the page. The live counter in the
 * browser copy editor is the one that matters — see components/copy.
 *
 * On the voice: short sentences, concrete nouns, no verb that leverages,
 * transforms, empowers or unlocks. If a sentence could be pasted onto a
 * competitor's site without anybody noticing, it is not finished.
 */

export const landing = {
  hero: {
    eyebrow: { en: "What we do", fr: "Ce que nous faisons" },

    /** The whole positioning, in three words. Nothing else in the hero is
     *  allowed to be longer than the sentence it supports. */
    title: { en: "We build agents.", fr: "Nous construisons des agents." },

    promise: {
      en: "AI is more than an advanced search engine: with tools it can do work. It can read data, create documents and run calculations.",
      fr: "L'IA est plus qu'un moteur de recherche perfectionné : avec les bons outils, elle travaille. Elle lit vos données, rédige vos documents, fait vos calculs.",
    },

    deck: {
      en: "We don't replace people. We help them get the most out of their time with new skills and AI assistants that don't sleep.",
      fr: "Nous ne remplaçons personne. Nous faisons gagner du temps à vos équipes : de nouvelles compétences, et des assistants IA qui ne dorment jamais.",
    },

    cta: { en: "Book the 90-minute session", fr: "Réserver la séance de 90 min" },
    secondaryCta: { en: "The long version", fr: "La version longue" },
  },

  /**
   * The client band, second on the page.
   *
   * It sits directly under the hero because "we build agents" is a claim and
   * this is the only thing on the sheet that is evidence. A reader deciding
   * whether to spend thirty minutes wants to know somebody else already did.
   *
   * The names are plain strings, not `{ en, fr }` leaves, for two reasons:
   * a company name is the same in both languages, and the copy tooling walks
   * for leaves — so names stay out of the browser editor, out of the markdown
   * round-trip, and out of the 350-word budget, which is about prose a reader
   * has to get through rather than a list they scan.
   *
   * `logo` is the path to a file in `client/public/logos/`, and every one of
   * these now has first-party artwork. The strip renders them as a single
   * monochrome texture rather than in brand colours — see `LogoMarquee` for
   * why, and for what a new file has to satisfy: real transparency, because
   * the alpha channel is the only thing separating the mark from its box.
   *
   * Where `logo` is absent the name is set in the site's own type instead, so
   * a client whose artwork has not arrived reads as a decision rather than a
   * broken image.
   *
   * PROVENANCE AND PERMISSION. Every file here came from a first-party source
   * — the owner's own site or annual report — assembled and checked on
   * 7 September 2026. Three were supplied as white artwork for a dark tile and
   * were recoloured to the site's ink in the files themselves, since the page
   * is off-white; Standard Bank's blue shield is untouched and only its
   * wordmark was changed.
   *
   * Santova and Howdens were added on 8 September 2026 from artwork Daniel
   * supplied, and he confirmed both as cleared on the same terms.
   *
   * These remain trademarks of their owners, and a downloadable logo is not
   * permission to imply a client relationship. Permission for the marks on
   * this list was confirmed as cleared by Daniel on 7 September 2026 —
   * including Spur Corporation and Standard Bank, which both require prior
   * consent for use of their marks specifically.
   *
   * That clearance covers the names below and nothing else — the last two
   * on 8 September 2026, the rest the day before. A logo added later needs
   * its own; do not read the cleared list as a cleared category.
   */
  clients: {
    label: { en: "16 years of analytics and consulting work for", fr: "16 ans d'analyses et de conseil pour" },
    items: [
      { name: "Standard Bank", logo: "/logos/standard-bank.svg", scale: 1 },
      { name: "Spur Corporation", logo: "/logos/spur-corporation.png", scale: 1.15 },
      { name: "Famous Brands", logo: "/logos/famous-brands.png", scale: 1.15 },
      { name: "Probe Batteries", logo: "/logos/probe-batteries.png", scale: 1 },
      /* Probe IMT became IMT — Integrated Mining Technologies on 2 August
         2026. The current mark is used; the pack also carries the legacy Probe
         IMT artwork if the relationship is better placed under the old name. */
      { name: "IMT Mining", logo: "/logos/imt-mining.png", scale: 1.1 },
      { name: "Bulldog Group", logo: "/logos/bulldog-group.png", scale: 1.25 },
      { name: "Bearstone Global", logo: "/logos/bearstone-global.svg", scale: 0.42 },
      /* "ABI" here is the Association of British Investigators — not
         Amalgamated Beverage Industries, which is what a South African list
         reads it as, and not the Association of British Insurers. Spelled out
         because the initials alone are actively misleading in this company. */
      {
        name: "Association of British Investigators",
        logo: "/logos/association-of-british-investigators.svg",
        scale: 1.15,
      },
      {
        name: "Human Factors International",
        logo: "/logos/human-factors-international.svg",
        scale: 0.95,
      },
      { name: "TSplus", logo: "/logos/tsplus.png", scale: 0.75 },
      { name: "Opus4Business", logo: "/logos/opus4business.png", scale: 0.95 },
      /* Supplied as a dark and a white wordmark; the dark one is filed here
         because the strip sits on the off-white page and the white one would
         be invisible on it. Trimmed of its transparent margin so it sits on
         the same optical baseline as the rest. */
      { name: "RGBC", logo: "/logos/rgbc.png", scale: 1.35 },
      /* Supplied as the tagline lockup — the navy block sitting above a white
         strip carrying "innovative solutions - endless possibilities" in type
         six pixels tall. Only the block is filed. The strapline is under three
         pixels at strip height and would have read as smudge, and the white
         strip behind it is opaque, since the source is a JPEG and has no
         alpha, so it would have sat on the page as a paler rectangle.
         Held well below the rest because the block is the widest thing on the
         strip: at nearly 5:1 it covers twice the ground of Probe's banner at
         the same height. Sized on the wordmark inside it, not the block. */
      { name: "Santova", logo: "/logos/santova.png", scale: 0.75 },
      /* Takes the opposite correction to Santova. It is the stacked mark, so
         the rooster and the wordmark sit inside a deep red margin and matching
         the others on height would have left the name small. Scaled up until
         HOWDENS carries the weight of the wordmarks either side of it. */
      { name: "Howdens", logo: "/logos/howdens.svg", scale: 1.3 },
    ],
  },

  /**
   * The sequence, which is the argument.
   *
   * Three steps, and the reader is meant to place themselves on step one or
   * two and see that there is a third. Step two is deliberately described as
   * where the market currently is: it flatters the reader who has got that
   * far and it makes step three the unclaimed ground.
   */
  sequence: {
    label: { en: "The sequence", fr: "La progression" },
    title: {
      en: "Three steps we'll take you through in 90 minutes:",
      fr: "Trois étapes, parcourues avec vous en 90 minutes :",
    },
    steps: [
      {
        n: "01",
        title: { en: "The best setup for your AI", fr: "La bonne configuration pour votre IA" },
        body: {
          en: "What the tools can do, where they can help YOU and what to avoid. The basics and some tips and tricks.",
          fr: "Ce que les outils savent faire, là où ils peuvent VOUS aider, et ce qu'il faut éviter. Les bases, plus quelques astuces.",
        },
      },
      {
        n: "02",
        title: { en: "Move it into your work", fr: "Passer dans un environnement de travail" },
        body: {
          en: "Move out of the chat box and into an environment. AI needs a place to work — just like you.",
          fr: "Sortez de la conversation pour un véritable environnement. L'IA a besoin d'un lieu de travail — comme vous.",
        },
      },
      {
        n: "03",
        title: { en: "Build the agent", fr: "Construire l'agent" },
        body: {
          en: "If you can explain your goal, then it can run jobs itself, on your data, inside your environment.",
          fr: "Si vous savez expliquer votre objectif, il exécute le travail lui-même, sur vos données, dans votre environnement.",
        },
      },
    ],
  },

  /**
   * The two priced things, in the order they are bought: the agent is what we
   * sell, the class is how a stranger gets to a quote for one. Both figures
   * are floors — "from" is load-bearing and should survive every edit, because
   * the number that is actually charged comes out of discovery.
   */
  pricing: {
    label: { en: "What it costs", fr: "Ce que cela coûte" },

    /**
     * The two figures above are sold through different channels and so carry
     * VAT differently, which is why this is one sentence about each rather
     * than a single blanket line.
     *
     * The session is paid by card at booking, and the card is charged the
     * figure shown — Cal.com bills one flat amount and cannot add tax for some
     * buyers and not others. So for the minority of bookers who are UK-based
     * that figure is VAT-inclusive, and saying "excludes VAT" of a €100 charge
     * that is exactly €100 would simply be untrue. Build work is invoiced, and
     * an invoice can carry VAT properly, so it is quoted ex VAT as B2B work
     * normally is.
     */
    vat: {
      en: "The session is charged in full at booking, and the price includes UK VAT where it applies. Build work is quoted ex VAT and invoiced — EU business clients under reverse charge.",
      fr: "La séance est réglée intégralement à la réservation, et le prix inclut la TVA britannique le cas échéant. Les projets sont chiffrés hors taxes et facturés — en autoliquidation pour les clients professionnels de l'UE.",
    },

    build: {
      title: {
        en: "An agent, built and kept running",
        fr: "Un agent, construit et maintenu",
      },
      /**
       * `{price}` and `{monthly}` are filled from the pricing table at render.
       *
       * They used to be written into the sentence as euros, which meant a
       * visitor who switched the toggle to £ read "£83" for the session beside
       * "From €3,000" for the agent — two currencies in one pricing block.
       */
      pricePrefix: { en: "From", fr: "À partir de" },
      body: {
        en: "Built for one job, in an environment we set up and hand over.",
        fr: "Construit pour un travail précis, dans un environnement que nous installons et vous remettons.",
      },
      /** The scope line: what the "from" figure actually buys. */
      scope: {
        en: "From {price} for a simple, single-task agent. Most projects are priced after discovery.",
        fr: "À partir de {price} pour un agent simple, dédié à une seule tâche. La plupart des projets sont chiffrés après la découverte.",
      },
      note: {
        en: "Then from {monthly} to keep it running. The real figure depends on the job, which is what discovery is for.",
        fr: "Puis à partir de {monthly} pour le maintenir. Le chiffre dépend du travail : c'est l'objet de la découverte.",
      },
    },

    /** The entry point, and the reason it is priced this low: the discovery
     *  happens inside the session, so one class pays for itself twice. The
     *  note also names the way on — Praxis, per session — for a reader who
     *  wants more than a start. `{session}` is filled from the price table. */
    class: {
      title: { en: "QuickStart — 90 minutes", fr: "QuickStart — 90 minutes" },
      body: {
        en: "For one to four people. The sequence above, the tools worth using now, how to work with them safely — and your AI policy and agent scorecard to keep.",
        fr: "De une à quatre personnes. La progression ci-dessus, les outils qui comptent, comment les utiliser sans rien exposer — et votre politique IA et grille d'évaluation d'agent, que vous gardez.",
      },
      note: {
        en: "Part of the session is discovery: the job you want an agent for, whether it is worth building, and roughly what it would cost. The rest is high-level training — enough for a self-starter to get going, with the right resources to follow. To go deeper, and learn how these systems work through your own use case, continue with Praxis at {session} a session.",
        fr: "Une partie de la séance est consacrée à la découverte : la tâche que vous voulez confier à un agent, si elle vaut la peine, et à quel prix environ. Le reste est une formation d'ensemble — de quoi démarrer seul, avec les bonnes ressources pour la suite. Pour aller plus loin et comprendre ces systèmes à partir de votre propre cas, poursuivez avec Praxis, à {session} la séance.",
      },
    },
  },

  /**
   * The safety half of the class, said out loud on the page because it is the
   * question that stops people using any of this. Naming the vendors is the
   * whole value: a reader who has been told "it's secure" by three suppliers
   * recognises the first page that tells them where the data physically goes.
   */
  data: {
    label: { en: "Where your data goes", fr: "Où vont vos données" },
    statement: {
      en: "Claude and OpenAI are American companies.",
      fr: "Claude et OpenAI sont des entreprises américaines.",
    },
    body: {
      en: "Neither guarantees your data stays out of American data centres. If yours has to stay in the EU, we recommend Mistral if you can use the cloud, otherwise we build a custom system which runs on your own computer or server.",
      fr: "Ni l'un ni l'autre ne garantit que vos données resteront hors des centres américains. Si les vôtres doivent rester dans l'UE : Mistral si le cloud est permis, sinon un système sur mesure sur votre machine ou votre serveur.",
    },
  },

  close: {
    title: {
      en: "What do you do by hand?",
      fr: "Que faites-vous à la main ?",
    },
    body: {
      en: "Let's discuss your repetitive tasks. Ninety minutes is enough time to discover whether an agent is worth building or not. You'll also get foundational training in how to set up and run an agent, which you then take further with some self-study. Or we can take you through it in Praxis: we walk through your actual case with you, and use it to learn how to build systems and agents with AI coding.",
      fr: "Parlons de vos tâches répétitives. Quatre-vingt-dix minutes suffisent pour découvrir si un agent vaut la peine d'être construit, ou non. Vous recevez aussi une formation de base pour installer et faire tourner un agent, que vous prolongez ensuite en autonomie. Ou nous vous accompagnons dans Praxis : nous parcourons votre cas réel avec vous, et nous nous en servons pour apprendre à construire des systèmes et des agents en codant avec l'IA.",
    },
    cta: { en: "Book the 90-minute session", fr: "Réserver la séance de 90 min" },
    alt: { en: "Or send a message", fr: "Ou écrivez-nous" },
    /** Named people are who a reader is dealing with. A leaf like everything
     *  else, with the same string on both sides, so the browser copy editor
     *  can reach it — names get corrected too. */
    signature: {
      en: "Daniel Forsthofer & Roxanne Northover",
      fr: "Daniel Forsthofer & Roxanne Northover",
    },
    signatureNote: { en: "Tutto — Applied AI", fr: "Tutto — IA appliquée" },
  },

  footer: {
    longVersion: {
      label: { en: "More details (more reading)", fr: "Plus de détails (lecture plus longue)" },
      href: "/applied",
    },
    place: {
      en: "France, South Africa & the UK",
      fr: "France, Afrique du Sud & Royaume-Uni",
    },
  },
} as const;
