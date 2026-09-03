/**
 * Copy for the landing page at `/` — the short argument, against the long one
 * that now lives at /applied.
 *
 * Kept here rather than in i18n.ts on purpose. This is the page that will be
 * split into one per offer — training, Sovereign, and the rest — so it should
 * stay rewritable and forkable without touching a file the whole site depends
 * on. It is English only, so the shape is a plain string rather than an
 * { en, fr } pair; French comes when the structure has settled.
 *
 * Everything on the page is in this file. If a sentence is wrong, it is wrong
 * here and nowhere else.
 *
 * ---
 *
 * On the voice.
 *
 * Short sentences. Full stops where a lesser page would use a comma. Concrete
 * nouns — documents, folders, hardware, an afternoon — and no abstract ones:
 * nothing here leverages, transforms, empowers or unlocks. No exclamation
 * marks, no adjective doing a verb's job, and not one sentence that would
 * survive being pasted onto a competitor's site.
 *
 * The page makes one claim and repeats it in different clothes: the machine
 * stands in your building, does a job you already hate, and you own it
 * afterwards. That is the only genuinely remarkable thing here, so it is the
 * only thing said loudly. Everything else — the training, the diagnosis, the
 * figures — is evidence for it, set quietly. A page that shouts four things
 * shouts nothing.
 *
 * The rule for edits: if a sentence could be pasted onto a competitor's site
 * without anybody noticing, it is not finished.
 */

export const landing = {
  /** Slim bar: one call, no links. The site is in the footer instead. */
  bar: {
    cta: "Book a call",
  },

  hero: {
    /** The amber eyebrow the site sets above every page opener. */
    eyebrow: "Applied AI",

    /**
     * What the reader already believes, struck through. These are the three
     * things people actually say out loud about AI at work — written the way
     * they say them, not the way a brochure would tidy them up — and all three
     * are what the page exists to contradict.
     */
    struck: [
      "AI gives generic answers.",
      "We can't put our data in that.",
      "It's coming for my job.",
    ],

    /**
     * The reframe. Not "AI is hard" or "AI is powerful", both of which the
     * reader has heard until they mean nothing — but an accusation about their
     * actual experience, which is that they have sat through demonstrations
     * for two years and still do not own a single thing that works.
     */
    title: "Everybody shows you AI. Nobody hands you any.",

    /** The offer in one breath: a job, an afternoon, no invoice.
     *
     *  It ends on money deliberately, and on the fact that money comes after.
     *  An earlier draft ended "yours whether or not we ever work together",
     *  which is a promise about keeping the prototype that nothing else on the
     *  site makes — check with Daniel before writing that back in. */
    promise:
      "Give us one job you hate. In an afternoon, you will watch a machine do it. Free, and before anybody mentions money.",

    /** What makes that possible, said plainly and without a single abstraction. */
    deck: "Not a chat window you visit. A machine that sits in your building, reads your files where they already are, and works through the jobs your week is actually made of.",

    cta: "Book a 30-minute call",
    /** The secondary call. Short on purpose: the footer's fuller wording,
     *  "The long version of this argument", wraps a pill to two lines on a
     *  phone. */
    secondaryCta: "The long version",
  },

  /**
   * The four things we do.
   *
   * Named as verbs, in parallel, so a reader finds themselves on the page in
   * one pass: we build it, you build it, it never leaves, we look first. The
   * product name goes in the card's qualifier underneath, because a reader
   * needs to know what the thing does before they need to know what we call it.
   */
  offersEyebrow: "Four doors",
  offersLabel: "Pick the one that sounds like your week.",
  offers: [
    {
      name: "We build it.",
      qualifier: "Built solutions",
      href: "/services",
      body: "One job. One machine built for that job and nothing else. It reads your data where it already sits. Nothing is uploaded.",
    },
    {
      name: "You build it.",
      qualifier: "Training",
      href: "/praxis",
      body: "One to one, on your own work rather than on a prepared example. You leave with a tool that runs, not notes about one.",
    },
    {
      /**
       * Pythia and the sovereign architecture were two rows, which read as two
       * products; they are one thing described at two altitudes — what it does
       * for you, and what it is built on. One heading, both halves.
       */
      name: "It never leaves.",
      qualifier: "Sovereign",
      href: "/sovereign",
      body: "Everything you hold, answerable on a machine standing in your building. Every answer cites its document and its page. Open-weight models, your hardware, no bill per question. You keep the folder.",
    },
    {
      name: "We look first.",
      qualifier: "Diagnosis",
      href: "/services",
      body: "A short look at what actually eats your week — so we build the thing that was costing you, not the thing that was easiest to describe.",
    },
  ],

  /**
   * The figures.
   *
   * "Already running" is doing the work here: the reader has been shown a lot
   * of AI that was going to be able to do things. An earlier draft said
   * "Nothing rounded up", which reads well and which the first figure on the
   * page visibly breaks — do not claim precision over a number ending in three
   * zeroes.
   */
  proofEyebrow: "Already running",
  proofLabel: "Three numbers, from systems that are running now.",
  proof: [
    {
      figure: "150,000",
      unit: "documents",
      body: "A litigation disclosure set, answerable on a machine standing in the room. Every answer cites the page it came from.",
    },
    {
      figure: "6,675",
      unit: "prospects",
      body: "Profiled across nine countries on the client's own hardware. The identifying detail never left it.",
    },
    {
      figure: "0",
      unit: "copies that left",
      body: "Across every system on this page. Local is an architecture, not a checkbox. It is either true of your system or it is not.",
    },
  ],

  /**
   * The one piece of imagery on the sheet.
   *
   * `src` may be a still (.webp/.png/.jpg) or a video (.mp4/.webm) — the page
   * looks at the extension and renders an <img> or a muted, looping, inline
   * <video> accordingly, so swapping one for the other is this one line. Put
   * video in `client/public/video/` and reference it as `/video/name.mp4`.
   *
   * `poster` is what a video shows before it plays, and what anybody who has
   * asked their system for reduced motion sees instead of it. Keep a still
   * here even once video lands.
   */
  media: {
    src: "/artwork/lawyer.webp",
    poster: "/artwork/lawyer.webp",
  },

  plateCaption: "Nobody reads 150,000 documents in the time there is.",

  /**
   * Why now.
   *
   * The honest reason to move is not a closing "gap" or a revolution — it is
   * one specific competitor who is already doing this and has no reason to
   * mention it. Urgency that names a rival is worth more than urgency that
   * names a trend, and the last line is the one meant to keep somebody on the
   * page: there will be no announcement.
   */
  window: {
    label: "Why now",
    statement: "Somebody in your field is quietly getting much faster than you.",
    body: [
      "Not because they are cleverer. Because they stopped asking one chat window questions and started running a dozen small machines, each one good at exactly one thing.",
      "They turn work around faster. They give their clients more. Some of it is simply better. There will be no announcement.",
    ],
  },

  /**
   * The offer and the availability.
   *
   * "The first one is free" is the business model in five words, and it is the
   * sentence most likely to be disbelieved — so the paragraph under it spends
   * its length on what free actually means rather than on adjectives about how
   * good the work is.
   */
  offer: {
    label: "How this starts",
    statement: "The first one is free.",
    body: "We build a working prototype before you commit to anything. You open it, you click it, you watch it do the actual job. Hours, not weeks. Trust comes from watching a thing run, not from reading a proposal about it.",
    /**
     * A lead time rather than a named month. Months date the page and go stale
     * the moment one turns; "two weeks ahead" stays true and is the thing a
     * reader can actually act on. The size of the team is deliberately not
     * stated — only that it is small enough to run out.
     */
    scarcity:
      "We are small on purpose. Every client gets one of us properly, which means we cannot take everybody at once. Book about two weeks out. If somebody cancels, we will come and find you.",
  },

  close: {
    /**
     * A question rather than a headline, and one a reader can only answer by
     * thinking about their own Tuesday. "Hand over" does quiet work too: it
     * says the job leaves them, not that they leave.
     */
    title: "Which job would you hand over first?",
    body: "Bring the boring one, not the impressive one. Thirty minutes is usually enough to tell you honestly whether this is worth your time — including when the answer is that it is not.",
    cta: "Book a 30-minute call",
    alt: "Or send a message",
    /** Named people are who a reader is dealing with. */
    signature: "Daniel Forsthofer & Roxanne Northover",
    signatureNote: "Tutto — Applied AI",
  },

  footer: {
    /** Where the seven-section version of this argument now lives. */
    longVersion: {
      label: "The long version of this argument",
      href: "/applied",
    },
    place: "France, South Africa & the UK",
  },
} as const;
