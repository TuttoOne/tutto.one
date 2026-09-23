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
 * One thing: the reader's team uses AI and the owner still rewrites the output.
 * The page names that, names the three fixes (brief, check, rule), prices the
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
  hero: {
    eyebrow: { en: "For firms of 5 to 50", fr: "Pour les entreprises de 5 à 50 personnes" },

    /** The reader's own complaint, said back to them. Nothing else in the
     *  hero is allowed to be longer than the sentence it supports. */
    title: { en: "Stop rewriting what AI writes.", fr: "Arrêtez de réécrire ce que l'IA écrit." },

    promise: {
      en: "Your team already uses ChatGPT or Claude. You still fix every draft, and you don't know what they paste into it.",
      fr: "Votre équipe utilise déjà ChatGPT ou Claude. Vous corrigez encore chaque brouillon, et vous ne savez pas ce qu'elle y colle.",
    },

    deck: {
      en: "We teach them to brief AI like a good intern, check what comes back, and keep client data where it belongs.",
      fr: "Nous leur apprenons à briefer l'IA comme un bon stagiaire, à vérifier ce qui revient, et à garder les données clients là où elles doivent rester.",
    },

    cta: {
      en: "Bring the job that's bugging you: 15 minutes, free",
      fr: "Venez avec la tâche qui vous pèse : 15 minutes, gratuit",
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
   * The three things the offer fixes, in the order they bite: the brief, the
   * check, the rule. Each is one of the artefacts the programme hands over, so
   * the page and the price card below it describe the same thing.
   */
  sequence: {
    label: { en: "What changes", fr: "Ce qui change" },
    title: {
      en: "Three fixes. Most teams are missing all of them:",
      fr: "Trois corrections. La plupart des équipes n'en ont aucune :",
    },
    steps: [
      {
        n: "01",
        title: { en: "Brief it properly", fr: "Bien le briefer" },
        body: {
          en: "Nobody hands an intern a task on day one and complains when it's wrong. Tell it the audience, the constraints and what good looks like, once, and keep the brief.",
          fr: "Personne ne confie une tâche à un stagiaire dès le premier jour pour se plaindre ensuite. Donnez-lui le public, les contraintes et ce qu'est un bon résultat, une fois, et gardez la consigne.",
        },
      },
      {
        n: "02",
        title: { en: "Check it before it ships", fr: "Le vérifier avant envoi" },
        body: {
          en: "Confident nonsense reads just like the truth. A scorecard and a short check mean nothing goes out that you haven't signed off.",
          fr: "Une erreur affirmée avec aplomb ressemble à la vérité. Une grille et une vérification courte : rien ne part sans votre validation.",
        },
      },
      {
        n: "03",
        title: { en: "Set the rule on what goes in", fr: "Fixer la règle sur ce qui entre" },
        body: {
          en: "A one-page charter: which tools, which data, and what never leaves the building. Written with you, not handed down.",
          fr: "Une charte d'une page : quels outils, quelles données, et ce qui ne sort jamais de l'entreprise. Écrite avec vous, pas imposée.",
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
        en: "The AI-Fluent Team — eight sessions to output you don't rewrite",
        fr: "L'équipe à l'aise avec l'IA — huit séances pour des résultats que vous ne réécrivez plus",
      },
      body: {
        en: "You and up to four of your team. Your AI-use charter, a scorecard for each role, standing briefs for your top three jobs, and a way to check the output before it ships — all built on your own work.",
        fr: "Vous et jusqu'à quatre personnes de votre équipe. Votre charte d'usage de l'IA, une grille d'évaluation par rôle, des consignes permanentes pour vos trois tâches clés, et une méthode pour vérifier le résultat avant qu'il parte — le tout construit sur votre propre travail.",
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
      en: "Which job are you still rewriting?",
      fr: "Quelle tâche réécrivez-vous encore ?",
    },
    body: {
      en: "Bring the one job that's bugging you. In fifteen minutes you'll know whether it can be unblocked, how, and what the next step is. No slides, no pitch you didn't ask for.",
      fr: "Venez avec la tâche qui vous pèse. En quinze minutes, vous saurez si elle peut être débloquée, comment, et quelle est la suite. Pas de présentation, pas de discours commercial non sollicité.",
    },
    cta: {
      en: "Bring the job that's bugging you: 15 minutes, free",
      fr: "Venez avec la tâche qui vous pèse : 15 minutes, gratuit",
    },
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
