# Artwork pipeline

The drawings arrive in `artwork/` as flat PNGs: red as the accent colour, grounds
ranging from plain white to poster red, and on the French Skills plate a banner
reading "COMPÉTENCES". Four steps, run from the repo root in order:

| step | does |
| --- | --- |
| `01-banner.py` | resets the French basket banner to `SKILLS = SPÉCIALISTES`, lifting the hand-lettered word off the English plate rather than typesetting it |
| `02-background.py` | maps every ground onto `#EADDD3`, the paper of the Skills plate |
| `03-recolor.py` | moves red to `hsl(32 95% 44%)`, the site's `--primary` |
| `04-export.py` | writes WebP into `client/public/artwork/`, capped at 1800px wide |

```sh
for s in scripts/artwork/0*.py; do python3 "$s"; done
```

Needs `numpy`, `scipy` and `Pillow`.

## Backgrounds

Each ground is mapped by a per-channel curve through `(0,0)`, `(source ground,
#EADDD3)` and `(255,255)`, so ink stays black, paper lands exactly on target and
nothing clips. A ground that is already white has nothing above it to preserve,
so that case is a straight gain. Sovereign is the exception — a curve steep
enough to carry poster red to cream would flatten every grey in the drawing, so
its ground is masked and replaced instead, keeping the grain.

## What each step recolours

`03-recolor.py` works from a table of named regions per file, not from "every red
pixel", because most of the red in this set is not ours to move:

| plate | moved | left alone |
| --- | --- | --- |
| 4D, Flow, Skills, Context, People | beanies, lips | checkmarks, pins, numerals, hearts, the RAG label, the red X, the Claude and Mistral marks |
| Hallucination | awnings, chair weave, balloon, arrow | the tricolore on the balloon basket |
| Lawyer, Teacher, Builder, FileOnDisk, Sovereign | everything — a jumper, pinned pages, a bar chart, a hard hat, a folder, cabling and screen text all move together | — |
| hands, man, woman, woman2 | nothing | the only red in `hands.png` is the Gmail and Mistral marks; the rest carry none |

Not everything processed is shipped. `04-export.py` writes only what a page
actually uses, so drawings that have been swapped out — the basket, the desk, the
brain-on-a-machine — stay available as masters under `artwork/orange/` without
adding weight to the build.

Region boxes and the glyph coordinates in `01-banner.py` are measured per file.
If a plate is redrawn they need re-measuring.

`*-Skills-final.png` arrive already cropped, already headline-free and already
saying SKILLS in both languages, so they skip step 01. The home page uses those;
/sovereign uses the full plate, which still needs its banner fixed.

`artwork/` holds the originals and should not be edited in place. Everything under
`artwork/build/`, `artwork/orange/` and `client/public/artwork/` is generated.
