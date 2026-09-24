# Writing in Daniel's voice

Every word on tutto.one should sound like Daniel said it. Claude drafts most of
the copy, and Claude has habits of its own that readers now recognise. This
file is the check: what Daniel sounds like, what Claude slips into, how to spot
it, and what to write instead.

Run the automatic part before finishing any copy change:

```
node scripts/voice-check.mjs                 # whole site
node scripts/voice-check.mjs client/src/lib/landing-copy.ts   # one file
```

It greps for the rows marked **auto** below. The rest need a read. One hit
proves little; three or more different tells in the same paragraph means the
paragraph was written by Claude, so rewrite it in his voice rather than
patching words.

Sources: Daniel's `context/voice.md` (second-brain repo), the voice rules at the
top of `client/src/lib/landing-copy.ts`, lines he typed himself, and a sweep of
current research on AI writing (Wikipedia's "Signs of AI writing", The
Economist's July 2026 study, Kobak et al. and Reinhart et al. on LLM
vocabulary, Anthropic's own prompting guides, and community lists of Claude
habits). Researched 24 September 2026.

## What Daniel sounds like

- **Short, then long.** A few words to open, then one long spoken sentence that
  loops through the detail. "Claude works fast. Now checking takes hours. Learn
  a better setup." then "The best results come when we work through your
  setup, your files, your tasks and at each step explain how and why we
  optimise the way we do."
- **We and you.** "We teach you", "your systems", "we're with you every step of
  the way". "I" on the personal pages and the blog.
- **Together, not delivered.** Value is what happens with you: "We build it
  together so your systems work every day." Not an outcome promised from above.
- **Plain verbs and ordinary idioms.** make sure, set up, work every day, tried
  and tested. He doesn't reach for a clever metaphor.
- **Explains the why.** Teaching is the pitch: show how and why, one real thing
  at a time.
- **Proof from principle and experience,** in the present tense. No hype, no
  "will unlock".
- **Repeats a concrete word for weight** ("your setup, your files, your
  tasks"). That's his, and it's fine. A list of three polished abstract nouns
  is not.
- **British spelling,** loose punctuation, no Oxford comma, numerals for counts
  ("3 steps").
- **Humble and self-implicating** on the blog ("I'm as guilty as anyone"), with
  the joke aimed at jargon and broken process, never at a person. Swearing is
  for the blog, not the product pages.
- **French** is Claude's, not his (he says so). Keep it plain, "vous", French
  typography, and apply the same structure and vocabulary rows.

## The matrix

**auto** means `scripts/voice-check.mjs` flags it. The ID is what the script
prints.

### Punctuation and format

| ID | Look for | How to spot it | Change it to |
|---|---|---|---|
| P1 | Em dash (—), Claude's strongest current tell | **auto** | Comma or brackets for an aside, colon before an explanation, full stop between two thoughts, " \| " in page titles |
| P2 | En dash or "--" used instead of an em dash | **auto** (spaced – or --) | Same as P1. En dashes in number ranges are fine |
| P3 | Two balanced clauses held by a semicolon ("Training is fixed; build work is scoped") | **auto** (semicolons in copy) | Two sentences, or join with "and" / "so" the way he'd say it |
| P4 | American spelling: organization, optimize, analyze, center, color, behavior, program (for a course) | **auto** | organisation, optimise, analyse, centre, colour, behaviour, programme |
| P5 | Oxford comma ("X, Y, and Z") | **auto** | "X, Y and Z" |
| P6 | Unicode arrows and bullets in prose (→ ⇒ •) | **auto** | Words: "then", "to", "so" |
| P7 | Bold label bullets, a heading every few lines, bold sprinkled through prose | Read: more structure than content | Plain paragraphs. Structure only for a real list or comparison |

### Sentence and argument shape

| ID | Look for | How to spot it | Change it to |
|---|---|---|---|
| S1 | "X, not Y" and "It's not X, it's Y" / "isn't X. It's Y" | **auto** | Say the positive plainly. At most one per page. "Four habits, not four tools" becomes "Four habits you use every day" |
| S2 | "No X. No Y. Just Z." | **auto** | One ordinary sentence: "It's just your files and an hour" |
| S3 | Fragment drama: "Not a detail. A design decision." | **auto** (short "Not a..." sentence pairs) | A full sentence with a subject and a verb |
| S4 | Abstract rule of three: "the admin, the capture, the coordination" | Read: three polished nouns or adjectives in a row | Keep the one that matters, or use his concrete repeated form ("your setup, your files, your tasks") |
| S5 | Aphorism to close a paragraph: "The rest is noise." "That's the job." | Read: last sentence under 8 words restating the point | End on the practical thing or the next step: "so put your energy where you can change something" |
| S6 | Colon reveal and suspense hook: "The fix is simple:", "Here's the thing:", "This has a name." | **auto** | State it straight. (A spoken "here's the thing though" is his, on the blog only) |
| S7 | Question answered straight away: "Why does this matter? Because..." | **auto** | State the answer. Keep real questions the reader would ask |
| S8 | "The real question is", "The question isn't X" | **auto** | Just ask the question |
| S9 | Mirrored halves, chiasmus, alliteration ("a component, not the commitment") | Read: sounds clever when read aloud | The plain version: "You can swap the model later. Your instructions and your data stay yours." |
| S10 | Participle tail: ", ensuring...", ", highlighting...", ", reflecting..." | **auto** | New sentence where someone does the verb: "so your team..." |
| S11 | "serves as", "stands as", "functions as", "acts as" | **auto** | "is" |
| S12 | Future-tense value: "will unlock", "could scale", "will drive", "will transform" | **auto** | Present tense, what happens in the session: "you leave with your first scorecard" |
| S13 | Litotes: "not unreasonable", "not difficult", "not trivial" | **auto** | Say it: "easy", "fair", "hard" |
| S14 | "It would be tempting to...", "It's easy to think..." then rebuttal | **auto** | Cut the straw man, make the point |
| S15 | Every sentence the same long length | Read aloud: no short ones | His rhythm: a short opener, then one longer spoken run |
| S16 | Announced structure: "Three things matter here", "Let's break it down" | **auto** | Just say the three things |

### Vocabulary

| ID | Look for | How to spot it | Change it to |
|---|---|---|---|
| W1 | His banned verbs: leverage, transform, empower, unlock | **auto** | The real verb: use, change, let, get |
| W2 | Claude's mannered metaphors: load-bearing, carries the argument, doing the heavy lifting, earns its keep, survive contact, the tell, the trap, the unlock, seam, substrate, surface (as a verb), belt-and-suspenders | **auto** | The literal statement: "this is the assumption everything else depends on" |
| W3 | Intensifiers: genuinely, structurally, quietly, truly, deeply | **auto** | Cut the word |
| W4 | Candour flags: honestly, frankly, to be direct, the honest answer | **auto** | Cut on product pages. On the blog one spoken "honestly" is his |
| W5 | Throat-clearing: "worth noting", "it's important to note", "at its core", "when it comes to", "worth sitting with" | **auto** | Cut the frame, keep the point |
| W6 | GPT-era words: delve, tapestry, testament, underscore, pivotal, intricate, meticulous, vibrant, foster, showcase, landscape, interplay, deep dive | **auto** | Plain words: look at, shows, important, detailed |
| W7 | Corporate filler: robust, comprehensive, seamless, holistic, crucial, cutting-edge, game-changer | **auto** | What it actually does |
| W8 | Consultant-speak: unpack, lean into, north star, circle back, pressure-test, double-click, synergy, organizational knowledge | **auto** | What he'd say: "what's in people's heads and files", "check it" |
| W9 | "the real X", "full stop" for emphasis | **auto** | Cut |
| W10 | Moreover, Furthermore, Additionally at the start | **auto** | "And", "Also", or nothing |
| W11 | Vague crowd: "most teams", "experts say", "many businesses" | **auto** | A named client, or one thing he saw himself |

### Tone

| ID | Look for | How to spot it | Change it to |
|---|---|---|---|
| T1 | Outcome promise from above: "We deliver", "Get results" | Read | Done with you: "we build it together", "we're with you every step of the way" |
| T2 | Wrong person: "I" on service pages, "we" in a personal story | Read | We/you on the site, I on About me and the blog |
| T3 | A claim with no why | Read | Add the how and why in one line; that's the teaching |
| T4 | Clever, above the reader, polished essay | Read: would he say it across a table? | Warmer and a bit looser. "The moment a draft drifts into polished Claude-essay, it's failed." |
| T5 | Stacked hedges: tends to, largely, arguably, may, somewhat | Read: more than one per sentence | One clear claim |
| T6 | Copy that could sit on a competitor's site | Read | Add the concrete noun that only Tutto has: the scorecard, the client, the 60 minutes |
