"""Put every plate on the same paper.

The drawings arrived on grounds that ranged from plain white (man) through
sketchbook tan (woman2) to a flat poster red (Sovereign). Side by side on a page
they read as clippings from different books. This maps each one onto the ground
of the Skills plate, #EADDD3, which is the reference because it is the drawing
the site leans on hardest.

The mapping is a per-channel curve through (0,0), (source ground, target ground)
and (255,255), so black ink stays black, paper lands exactly on the target, and
nothing clips. Where the ground is already white there is nothing above it to
preserve, so that case is a straight gain instead.

Sovereign is the exception: its ground is a saturated red, and a curve steep
enough to carry red to cream would flatten every grey in the drawing. There the
ground is masked and replaced, keeping its grain.
"""
import numpy as np, os
from PIL import Image
from scipy import ndimage

TARGET = np.array([234.0, 221.0, 211.0])          # #EADDD3, sampled off EN-Skills
SRC, OUT = 'artwork', 'artwork/build/bg'

# source file -> canonical name used by every later step
FILES = {
 'EN-4D.png':'EN-4D', 'FR-4D.png':'FR-4D',
 'EN-Full Flow.png':'EN-Flow', 'FR-Full Flow Infographic.png':'FR-Flow',
 'EN-Skills.png':'EN-Skills', 'build/FR-Skills-banner.png':'FR-Skills',
 # Supplied already cropped and already saying SKILLS in both languages, so they
 # skip step 01 entirely; the home page uses these instead of the full plate.
 'EN-Skills-final.png':'EN-Skills-Final', 'FR-Skills-final.png':'FR-Skills-Final',
 'EN-ContextWindow.png':'EN-Context', 'FR-ContextWindow.png':'FR-Context',
 'computer.png':'Computer', 'hands.png':'Hands', 'people.png':'People',
 'hallicination.png':'Hallucination', 'man.png':'Man', 'woman.png':'Woman',
 'woman2.png':'Woman2', 'Cafe.png':'Cafe', 'Sovreign.webp':'Sovereign',
}

def ground(a):
    """Modal colour among the lighter half of the frame — the paper, not the ink."""
    lum = a.mean(2)
    sel = lum >= np.percentile(lum, 55)
    q = (a[sel] // 6).astype(np.int32)
    key = q[:,0]*2048 + q[:,1]*64 + q[:,2]
    vals, counts = np.unique(key, return_counts=True)
    return a[sel][key == vals[counts.argmax()]].mean(0)

def curve(src, dst):
    x = np.arange(256, dtype=np.float64)
    if src >= 248:                                  # nothing above the ground to keep
        y = x * (dst / 255.0)
    else:
        y = np.where(x <= src, x * (dst / max(src,1e-6)),
                     dst + (x - src) * (255.0 - dst) / (255.0 - src))
    return np.clip(y, 0, 255)

def redness(a):
    f = a.astype(np.float32)/255
    mx, mn = f.max(2), f.min(2); d = mx-mn
    r,g,b = f[:,:,0],f[:,:,1],f[:,:,2]
    h = np.zeros_like(mx); nz = d > 1e-6
    i = nz&(mx==r); h[i] = ((g-b)[i]/d[i]) % 6
    i = nz&(mx==g)&(mx!=r); h[i] = ((b-r)[i]/d[i]) + 2
    i = nz&(mx==b)&(mx!=r)&(mx!=g); h[i] = ((r-g)[i]/d[i]) + 4
    s = np.where(mx>0, d/np.maximum(mx,1e-6), 0)
    return h*60, s, mx

def swap_red_ground(a):
    """Sovereign: lift the poster red off and lay the drawing on paper."""
    h,s,v = redness(a)
    red = (((h<=25)|(h>=340)) & (s>0.28) & (v>0.25))
    # The cables and headphones are drawn in a dark red that reads as black
    # against the poster ground. Without a brightness floor the flood fill runs
    # straight down them and bleaches the drawing.
    bright = red & (v > 0.60)
    lbl,n = ndimage.label(bright, np.ones((3,3)))
    if n == 0: return a
    # Every patch of ground reaches an edge — including the pieces the cables cut
    # off from the main field, and the thin rule around the frame. Interior red
    # (the power light under the screen) touches no edge and is left alone.
    edge = np.unique(np.concatenate([lbl[0],lbl[-1],lbl[:,0],lbl[:,-1]]))
    bg = np.isin(lbl, edge[edge > 0])
    # the frame is ruled in a darker red than the field; take any red in the
    # outermost few pixels so the plate does not keep a red hairline border
    band = np.zeros(bg.shape, bool)
    band[:6] = band[-6:] = True; band[:,:6] = band[:,-6:] = True
    bg |= (red & band)
    bg = ndimage.binary_closing(bg, np.ones((3,3)))
    lum = a[bg].mean(1)
    ratio = np.clip(lum / max(lum.mean(), 1e-6), 0.80, 1.18)   # keep the grain
    out = a.astype(np.float64).copy()
    out[bg] = np.clip(ratio[:,None] * TARGET, 0, 255)
    return out

os.makedirs(OUT, exist_ok=True)
for src, name in FILES.items():
    a = np.asarray(Image.open(os.path.join(SRC, src)).convert('RGB')).astype(np.float64)
    g = ground(a.astype(np.uint8))
    if name == 'Sovereign':
        out = swap_red_ground(a.astype(np.uint8))
        note = 'red ground masked and replaced'
    else:
        luts = [curve(g[k], TARGET[k]) for k in range(3)]
        out = np.stack([luts[k][a[:,:,k].astype(np.uint8)] for k in range(3)], -1)
        note = f'#{int(g[0]):02X}{int(g[1]):02X}{int(g[2]):02X} -> #EADDD3'
    Image.fromarray(np.clip(out,0,255).astype(np.uint8)).save(os.path.join(OUT, name+'.png'))
    print(f'  {name:14s} {note}')
