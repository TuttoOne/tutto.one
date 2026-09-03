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
 * WHO THIS PAGE IS FOR, which is the only decision on it that matters.
 *
 * It is for somebody who has been told no. A compliance officer, a regulator,
 * a partner, an IT policy — somebody has forbidden them from putting client
 * files into a cloud AI, and they have spent two years watching everybody else
 * get faster while their own files stayed exactly where they were.
 *
 * That is a small group. It is meant to be. They cannot use what everybody
 * else uses, they are frustrated about it, and — this is the part that matters
 * — they talk to each other, because there are not many of them and they meet
 * at the same conferences. A page that spoke to every business with a busy
 * week reached all of them weakly and none of them enough to be repeated.
 *
 * So the page turns people away on purpose. "If your files can go in the
 * cloud, use the cloud" is not modesty; it is the sentence that tells the
 * right reader they have been found. Do not soften it to widen the funnel.
 * Widening it is what made the previous version forgettable.
 *
 * ---
 *
 * On the voice.
 *
 * Short sentences. Full stops where a lesser page would use a comma. Concrete
 * nouns — documents, folders, hardware, an afternoon — and no abstract ones:
 * nothing here leverages, transforms, empowers or unlocks.
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
    /** Names the condition rather than the product. A reader who has never
     *  been blocked will not know what this refers to, which is the point. */
    eyebrow: "When the cloud is not an option",

    /**
     * What this reader has been told, struck through. Not objections to AI in
     * general — the three specific sentences somebody says when they have been
     * refused. A reader who has heard one of these out loud this year knows
     * within two seconds that the page is about them.
     */
    struck: [
      "We can't put client files in that.",
      "Legal said no.",
      "Maybe when the regulator catches up.",
    ],

    /**
     * The concession first. Every competitor tells this reader their fears are
     * overblown, which is both wrong and insulting: the files really were
     * being copied to somebody else's computer. Agreeing with them is the
     * unexpected move, and it buys the right to make the claim underneath.
     */
    title: "Legal said no. They were right.",

    /** What was actually wrong, and the one structural difference. */
    promise:
      "Every AI you have been offered copies your clients' files onto somebody else's computer. Ours does not leave the building.",

    /** How that is possible, in concrete nouns. */
    deck: "A machine that stands in your office and reads your files where they already sit. Every answer cites the document and the page it came from. You own the hardware, there is no bill per question, and when we are finished we go home and it keeps working.",

    cta: "Book a 30-minute call",
    /** The secondary call. Short on purpose: the footer's fuller wording,
     *  "The long version of this argument", wraps a pill to two lines on a
     *  phone. */
    secondaryCta: "The long version",
  },

  /**
   * The four ways in.
   *
   * Named as verbs, in parallel, so a reader finds themselves in one pass. The
   * label underneath does the single job of the whole section: whichever door
   * they pick, the answer to "but where does the data go" is the same.
   */
  offersEyebrow: "Four doors",
  offersLabel: "Four ways in. All of them stay in your building.",
  offers: [
    {
      name: "We build it.",
      qualifier: "Built solutions",
      href: "/services",
      body: "One job — the review nobody has time for, the archive nobody has opened. One machine built for that job and nothing else, reading your files where they already sit.",
    },
    {
      name: "You build it.",
      qualifier: "Training",
      href: "/praxis",
      body: "One to one, on your own files rather than on a prepared example. You leave with a tool that runs inside your own walls, not notes about one.",
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
      body: "Everything you hold, answerable on a machine standing in your building. Open-weight models, your hardware, no bill per question. You keep the folder.",
    },
    {
      name: "We look first.",
      qualifier: "Diagnosis",
      href: "/services",
      body: "A short look at which of your files are actually the bottleneck, before anybody builds anything or quotes for it.",
    },
  ],

  /**
   * The figures.
   *
   * "The last one is the point" sends the eye to the zero. For this reader the
   * first two numbers are competence and the third is the only one that
   * decides whether they are allowed to proceed.
   */
  proofEyebrow: "Already running",
  proofLabel: "Three numbers. The last one is the point.",
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
   * Who this is not for.
   *
   * The most important section on the page, and the one most likely to be
   * softened by somebody trying to help. Turning away every reader whose files
   * could go in the cloud costs almost nothing — they were never going to buy
   * a machine — and it is the only thing on the sheet that proves to the
   * remaining reader that the page was written for them specifically.
   *
   * The second paragraph is the urgency, and it is aimed at the same person:
   * their competitor did not get cleverer, they got unblocked.
   */
  window: {
    label: "Who this is not for",
    statement: "If your files can go in the cloud, use the cloud.",
    body: [
      "There are good tools, they cost about forty euros a month, and we would be a poor use of your money. We will say so on the call rather than sell you something.",
      "But somebody in your field has already solved this, and they did not get cleverer — they got unblocked. They are turning work around faster than you now, and there will be no announcement.",
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
    body: "We build a working prototype before you commit to anything. You open it, you click it, you watch it do the actual job on your actual files. Hours, not weeks. Trust comes from watching a thing run, not from reading a proposal about it.",
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
     * The question this reader has an immediate answer to, because there is a
     * specific folder they have been staring at for two years. "Not allowed"
     * rather than "not able": the obstacle was never the technology.
     */
    title: "What have you not been allowed to do?",
    body: "Bring the blocked one, not the impressive one — the review nobody has time for, the archive nobody has opened. Thirty minutes is usually enough to tell you honestly whether this is worth your time, including when the answer is that it is not.",
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
