# Use-case demo — the files behind /usecase

The page itself is no longer here. It used to be a standalone static site with
its own copy of the header, its own CSS and its own English-only copy, which
meant it missed the site's navigation, the language and currency toggles, and
the French translation. It is now an ordinary React route like every other page:

| Where | What |
|---|---|
| `client/src/pages/usecase.tsx` | The page. Copy, tabs, and the player. |
| `client/src/lib/usecase-runs.ts` | The three recorded runs, typed. **Generated — do not hand-edit.** |
| `client/src/lib/fr/usecase.ts` | French for everything the runs print, keyed on the English. |
| `client/src/lib/i18n.ts` | French for the page's own copy, under `copy.usecase`. |
| `client/src/index.css` | The two keyframes the progress bars and printed lines animate on. |

What still lives in this folder is only what the page loads over HTTP:

| File | What it is |
|---|---|
| `data.js` | The three recorded runs, as the recorder writes them. The drop point for a rebuild. |
| `files/` | The Excel, PowerPoint and image the runs produced. These are the downloads. |
| `rules-sheet.png` | The screenshot in the lower section. |

## Two things not to break

**The page has no backend.** It cannot execute anything and there is nowhere to
upload to. That is the point, and it is what makes it a safe answer when a firm
asks where their data would go. Do not add a form or an endpoint.

**The runs are real, the pace is not.** The stages, their order, the output lines
and the downloadable files are exactly what three real runs produced. Only the
speed is changed, and each panel says what the run actually took. If you edit
that copy, keep it true. The French keeps every figure exactly as the run printed
it — "62,400", not "62 400" — for the same reason.

## Regenerating

From `marketing/use-case-videos` on the workstation:

```
.venv/bin/python site/build.py
```

That re-runs all three builds, re-records them, and refuses to publish a run
that failed. **Take `data.js` and the files under `files/` from the rebuild, and
ignore whatever else it emits** — the generator still writes the old standalone
`index.html`, `app.css`, `fonts.css` and `player.js`, and those are dead now.

Then, back here:

```
node script/usecase-runs.mjs
```

which rewrites `client/src/lib/usecase-runs.ts` from `data.js`. Any line the
rebuild reworded falls back to its English on the French page until it is added
to `client/src/lib/fr/usecase.ts`; nothing renders blank.
