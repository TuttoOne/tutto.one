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
 */

export const landing = {
  /** Slim bar: one call, no links. The site is in the footer instead. */
  bar: {
    cta: "Book a call",
  },

  hero: {
    /**
     * What the reader already believes, struck through. Both of these are the
     * ordinary experience of AI at work, and both are what the page exists to
     * contradict — so they are on the sheet, crossed out, before the claim.
     */
    struck: [
      "AI just gives you generic answers.",
      "We are not allowed to use AI on our data.",
      "AI is going to replace my job.",
    ],
    /** Short. The whole proposition, and nothing above it competing. It leads
     *  with the concession — the technology is fine — so the blame lands on
     *  the thing we actually fix. */
    title: "Right tech. Wrong setup.",
    deck: "Built on a machine, living inside your own systems, working through the tasks your week is actually made of. That is a different thing from a chat window, and it takes an afternoon to set up.",
    cta: "Book a 30-minute call",
    /**
     * The promise, and then the explanation of it. These were two boxes either
     * side of the hero's grid, which read as two unrelated statements rather
     * than one leading into the other; they are a single column now.
     */
    promise:
      "What you get is a working prototype you can open and click through in hours, not days.",
  },

  /**
   * The five things we do, named. This section used to argue in the abstract
   * about why we are not the AI you have been sold, which left a reader unable
   * to tell which of these they were reading about. Naming them lets someone
   * find themselves on the page and go straight to the right one.
   */
  offersLabel: "Name the piece you need.",
  offers: [
    {
      name: "A built solution",
      href: "/services",
      body: "One specific task in your business, done by a system built for it and nothing else. Your data is read where it already sits; nothing is uploaded.",
    },
    {
      name: "Training",
      href: "/praxis",
      body: "Learn to build these yourself, one to one, on your own work rather than on a prepared example. You leave with a working tool, not notes about one.",
    },
    {
      /**
       * Pythia and the sovereign architecture were two rows, which read as two
       * products; they are one thing described at two altitudes — what it does
       * for you, and what it is built on. One heading, both halves.
       */
      name: "Sovereign",
      href: "/sovereign",
      body: "Everything you hold, made answerable on a machine standing in your building — ask in plain language, and every answer cites the document and page it came from. Open-weight models on hardware you own, nothing leaving the room, no bill per question, and you keep the folder.",
    },
    {
      name: "Diagnosis",
      href: "/services",
      body: "A short look at your real workflows first, so what gets built is what was actually costing you rather than what was easiest to describe.",
    },
  ],

  /** Numerals, set large. Every figure here is from delivered work. */
  proofLabel: "Built, running, in production.",
  proof: [
    {
      figure: "150,000",
      unit: "documents",
      body: "A litigation disclosure set, made answerable on a machine standing in the room. Every answer cites the page it came from.",
    },
    {
      figure: "6,675",
      unit: "prospects",
      body: "Profiled across nine countries on the client's own hardware, with identifying detail held back from anything that left it.",
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
   * here even once the video lands.
   */
  media: {
    src: "/artwork/lawyer.webp",
    poster: "/artwork/lawyer.webp",
  },

  plateCaption: "Nobody reads 150,000 documents in the time there is.",

  /**
   * Why now. This was three paragraphs about a closing "gap", which named
   * neither side of the gap and read as cleverness standing in for an argument.
   * The real reason to move is a competitor, so the section says so.
   */
  window: {
    label: "Why now, and not next year",
    /* The comma matters: without it, "faster than you using AI" reads as a
       comparison against you-already-using-AI, which is the opposite claim. */
    statement:
      "Someone in your field is about to get much faster than you, using AI.",
    body: [
      "Not because they are better at the work. Because they have learned to run a fleet of agents, each one specialised in a single task, covering ground they could not cover before. They turn work around faster, they give their clients more, and some of it is simply better.",
    ],
  },

  /**
   * The offer and the availability, in one block. The prototype is what earns
   * the call — something seen working beats a proposal read — and the lead time
   * is what makes it now.
   */
  offer: {
    label: "How this starts",
    statement: "You see it working before you commit to anything.",
    body: "The first thing we build is a free prototype: something you can open, click through, and watch do the actual task. Hours, not weeks. Trust comes from seeing it run, not from reading a proposal about it.",
    /**
     * A lead time rather than a named month. Months date the page and go stale
     * the moment one turns; "two weeks ahead" stays true and is the thing a
     * reader can actually act on.
     */
    scarcity:
      "We are a small, focused team, and every client gets individual attention, so availability is genuinely limited. Try to book at least two weeks ahead. Where there are cancellations we will reach out and slot you in. We look forward to our first conversation.",
  },

  close: {
    title: "What are the tasks that eat your week?",
    body: "Bring the specific ones, not the impressive ones. Thirty minutes is usually enough to tell you honestly whether this is worth your time — including when the answer is that it is not.",
    cta: "Book a 30-minute call",
    alt: "Or send a message",
    /** A broadside is signed. Named people are who a reader is dealing with;
     *  the size of the team is not stated anywhere on the page. */
    signature: "Daniel Forsthofer & Roxanne Northover",
    /* The place is set in the footer, forty pixels below this. Saying it twice
       made the signature read as a letterhead rather than a signature. */
    signatureNote: "Tutto — Applied AI",
  },

  footer: {
    note: "Built directly with Claude, and its hand shows throughout.",
    /** Where the seven-section version of this argument now lives. */
    longVersion: {
      label: "The long version of this argument",
      href: "/applied",
    },
    place: "France, South Africa & the UK",
    /**
     * The whole site, from the front door's foot.
     *
     * The page keeps a slim bar with one call in it, so this is the only place
     * the rest of the site is reachable from — which means it has to be
     * complete. Labels are written out here rather than read from i18n.ts
     * because this page is English only; a French label in an English page
     * would be the one thing on the sheet in the wrong language.
     */
    nav: [
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Work", href: "/portfolio" },
      { label: "Use cases", href: "/usecase/" },
      { label: "Training", href: "/praxis" },
      { label: "Events", href: "/calendar" },
      { label: "Sovereign", href: "/sovereign" },
      { label: "Pythia", href: "/pythia" },
      { label: "Thinking", href: "/blog" },
      { label: "Contact", href: "/contact" },
    ],
  },
} as const;
