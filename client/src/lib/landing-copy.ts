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
 * One thing: the staff use AI and it saves them nothing. The page names that,
 * sets out the order that fixes it (rules, KPIs, decisions, then build), prices the
 * programme that installs them, and books a free 15-minute call. It was "we
 * build agents" until September 2026; that is the upsell, not the way in.
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
  /**
   * The label every OTHER page uses for the free 15-minute intro call. Kept
   * here so they all ask the same way; the home page itself books the
   * 60-minute session instead (see hero.cta).
   */
  introCall: {
    en: "Bring the job that's bugging you: 15 minutes, free",
    fr: "Venez avec la tâche qui vous pèse : 15 minutes, gratuit",
  },

  hero: {
    eyebrow: { en: "For firms of 5 to 50", fr: "Pour les entreprises de 5 à 50 personnes" },

    /** The pain in the reader's own units: minutes to write, an hour to
     *  check. Two sentences, set one per line, so it is two leaves rather
     *  than one string the browser breaks wherever it likes. */
    title: { en: "Claude writes in minutes.", fr: "Claude rédige en quelques minutes." },
    titleSecond: {
      en: "Checking it still takes an hour.",
      fr: "Le vérifier prend encore une heure.",
    },

    /** What we sell, as the third line: teaching, by doing it properly. */
    subtitle: {
      en: "Learn to do it right, the first time.",
      fr: "Apprenez à bien faire, du premier coup.",
    },

    promise: {
      en: "Your reviewers reread everything because nothing tells them where to look.",
      fr: "Vos relecteurs relisent tout, parce que rien ne leur dit où regarder.",
    },

    deck: {
      en: "We teach your team on your own documents and process: write your standards down once, then build the scorecard Claude checks itself against, with sources, before anyone opens the draft. Your team reviews the flags, not the whole thing.",
      fr: "Nous formons votre équipe sur vos propres documents et processus : écrire vos standards une fois, puis construire la grille sur laquelle Claude se vérifie lui-même, sources à l'appui, avant que quiconque n'ouvre le brouillon. Votre équipe relit les alertes, pas tout le document.",
    },

    /** What the reader brings, and what they leave with. Set apart from the
     *  deck because it is the offer, not the argument. */
    offer: {
      en: "Bring me one document your team spends too long checking. In 60 minutes we'll build the scorecard, run it on that document, and time the review.",
      fr: "Apportez-moi un document que votre équipe met trop de temps à vérifier. En 60 minutes, nous construisons la grille, l'appliquons à ce document, et chronométrons la relecture.",
    },

    /** Books the free 60-minute session the offer line describes. */
    cta: {
      en: "Book the 60-minute session, free",
      fr: "Réserver la séance de 60 min, gratuite",
    },
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
   * The order the work happens in, which is the argument: nothing gets built
   * until there is a rule for what goes in, a standard to judge it by and a
   * decision about what to hand over. Steps one and two are the charter and
   * the scorecard the programme hands over, so the page and the price card
   * below it describe the same thing.
   */
  sequence: {
    label: { en: "The order", fr: "L'ordre" },
    title: {
      en: "Four steps. Most teams skip straight to the fourth:",
      fr: "Quatre étapes. La plupart des équipes sautent directement à la quatrième :",
    },
    steps: [
      {
        n: "01",
        title: { en: "Set the rules", fr: "Fixer les règles" },
        body: {
          en: "A one-page policy: which tools, which data, and what never leaves the building. Written with you, not handed down.",
          fr: "Une politique d'une page : quels outils, quelles données, et ce qui ne sort jamais de l'entreprise. Écrite avec vous, pas imposée.",
        },
      },
      {
        n: "02",
        title: { en: "Define good", fr: "Définir le bon résultat" },
        body: {
          en: "A KPI for each job, so AI output is judged against a standard, not a feeling. Those are your evals.",
          fr: "Un indicateur par tâche, pour juger le travail de l'IA sur un standard, pas sur une impression. Ce sont vos évaluations.",
        },
      },
      {
        n: "03",
        title: { en: "Decide what to hand over", fr: "Décider quoi déléguer" },
        body: {
          en: "Which jobs AI should do, which it shouldn't, and what each one needs to run without you.",
          fr: "Les tâches que l'IA doit faire, celles qu'elle ne doit pas faire, et ce qu'il faut à chacune pour tourner sans vous.",
        },
      },
      {
        n: "04",
        title: { en: "Then build", fr: "Ensuite, construire" },
        body: {
          en: "Tools, skills, automation, agents — in that order, on your own work. Built on the first three, so it does the job once and keeps doing it.",
          fr: "Outils, compétences, automatisation, agents — dans cet ordre, sur votre propre travail. Construits sur les trois premières étapes, pour faire le travail une fois et continuer à le faire.",
        },
      },
    ],
  },

  /**
   * The one priced thing on the front door: the team offer, named after the
   * outcome rather than the calendar. The price itself comes from pricing.ts;
   * `{date}` is the last day of the back-to-work special.
   */
  pricing: {
    label: { en: "What it costs", fr: "Ce que cela coûte" },

    offer: {
      title: {
        en: "The AI-Fluent Team — eight sessions to stop repeating yourself",
        fr: "L'équipe à l'aise avec l'IA — huit séances pour arrêter de vous répéter",
      },
      body: {
        en: "You and up to four of your team. Your use policy, a KPI for each role, the call on what AI takes over, and standing briefs and checks for your top three jobs — built on your own work, so it's done once, not every day.",
        fr: "Vous et jusqu'à quatre personnes de votre équipe. Votre politique d'usage, un indicateur par rôle, la décision sur ce que l'IA prend en charge, et des consignes et contrôles permanents pour vos trois tâches clés — construits sur votre propre travail, pour le faire une fois, pas tous les jours.",
      },
      special: {
        en: "Back-to-work price until {date}.",
        fr: "Prix de rentrée jusqu'au {date}.",
      },
      link: {
        en: "What's included, and the guarantee",
        fr: "Ce qui est inclus, et la garantie",
      },
    },
  },

  close: {
    title: {
      en: "Which job do you keep repeating?",
      fr: "Quelle tâche répétez-vous encore ?",
    },
    body: {
      en: "Bring the one job that's bugging you. In an hour we'll build its scorecard, run it, and time the review. No slides, no pitch you didn't ask for.",
      fr: "Venez avec la tâche qui vous pèse. En une heure, nous construisons sa grille, l'appliquons, et chronométrons la relecture. Pas de présentation, pas de discours commercial non sollicité.",
    },
    cta: {
      en: "Book the 60-minute session, free",
      fr: "Réserver la séance de 60 min, gratuite",
    },
    alt: { en: "Or send a message", fr: "Ou écrivez-nous" },
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
