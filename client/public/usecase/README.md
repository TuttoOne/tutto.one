# Use-case demo

Static files, served with the site at `/usecase/`. No build step and no config.
Every path inside is relative, so it works under any prefix.

Linked from the home page, in section 02 (`AppliedExplainer.tsx`), under the
illustrative session — that page argues the case, this one shows it.

## The files

| File | What it is |
|---|---|
| `index.html` | The page. Copy is here, and so is the static copy of the site header and footer. |
| `app.css` | The styling. Plain CSS, tokens at the top. **Start here to restyle.** |
| `fonts.css` + `fonts/` | Inter and Roboto, vendored. |
| `pointer.svg` | The Tutto mark in the header, taken from `PointerMark.tsx`. |
| `player.js` | Plays the recorded runs. Pacing constants are the first few lines. |
| `data.js` | The three recorded runs and their output. Generated, do not hand-edit. |
| `files/` | The Excel, PowerPoint and image the runs produced. These are the downloads. |
| `rules-sheet.png` | The screenshot in the lower section. |

## Styling

The tokens at the top of `app.css` are the site's own, read across from
`client/src/index.css`, so this page and the React pages resolve to the same
colours, radii and type:

```css
:root{
  --paper:#FAF9F6;   /* --background        */
  --sunk:#F3F4F6;    /* --secondary         */
  --ink:#1F1F1F;     /* --foreground        */
  --slate:#6B7280;   /* --muted-foreground  */
  --amber:#DB7400;   /* --primary           */
  --rule:#E5E7EB;    /* --border            */
  --r-card:1rem;     /* rounded-2xl         */
}
```

Three things carry most of the resemblance, and are worth keeping if this is
ever restyled again:

- **Roboto for headings.** The site aliases Roboto as its `serif` and sets every
  heading in it. Source Serif 4 was dropped for that reason.
- **`--r-card` everywhere.** The site is a rounded-card site; sharp corners were
  the loudest tell that this page came from somewhere else.
- **The window strip on the console** (`.chrome`, built in `player.js`), which is
  the site's example-session card from `ProductPage.tsx`.

**Light only.** The site never sets its `.dark` class, so the dark variants were
removed. Following `prefers-color-scheme` here made this the one dark page on a
light site whenever a visitor's laptop was set that way.

## Two things not to break

**The page has no backend.** It cannot execute anything and there is nowhere to
upload to. That is the point, and it is what makes it a safe answer when a firm
asks where their data would go. Do not add a form or an endpoint. The fonts are
vendored for the same reason — nothing on this page is fetched from anywhere.

**The runs are real, the pace is not.** The stages, their order, the output lines
and the downloadable files are exactly what three real runs produced. Only the
speed is changed, and each panel says what the run actually took. If you edit
that copy, keep it true.

## Regenerating

From `marketing/use-case-videos` on the workstation:

```
.venv/bin/python site/build.py
```

That re-runs all three builds, re-records them, and refuses to publish a run
that failed.

**Check what it writes before you run it here.** The restyle above lives in
`index.html`, `app.css`, `fonts.css` and `player.js`. If `build.py` emits those
as well as `data.js`, running it will put the pre-restyle versions back. Either
carry these four files back into `site/` on the workstation so the generator
produces the styled page from now on, or take `data.js` from the rebuild and
leave the rest alone.
