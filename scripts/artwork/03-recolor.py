"""Shift the character's beanie and lips from red to the site's amber accent.

The site's --primary is hsl(32 95% 44%) = #D97706. The red is rotated onto that
hue and its saturation lifted to match, with value left alone, so every fold,
highlight and pen stroke in the hat survives the change. Only the beanie and the
lips move: the checkmarks, pins, numerals and hearts stay red, as do the Claude
and Mistral brand marks, which is why this works on boxed regions rather than on
every red pixel in the frame.
"""
import numpy as np, os
from PIL import Image

SRC='artwork/build/bg'; OUT='artwork/orange'
os.makedirs(OUT,exist_ok=True)
TARGET_H, TARGET_S = 32.0, 0.95

HAT_LIPS_SKILLS=[(720,195,970,370),(802,418,892,462)]
# name: (source, regions to act on — None means the whole frame, boxes to protect)
JOBS={
 'EN-4D':   ('EN-4D', [(735,90,950,262),(812,288,878,326)]),
 'FR-4D':   ('FR-4D', [(735,90,950,262),(812,288,878,326)]),
 'EN-Flow': ('EN-Flow', [(78,98,198,218),(588,128,690,222),(1378,136,1482,238),
                         (78,686,198,798),(398,728,502,834),(1382,691,1500,806)]),
 'FR-Flow': ('FR-Flow', [(78,98,198,218),(588,128,690,222),(1378,136,1482,238),
                         (78,690,198,802),(398,733,502,838),(1382,695,1500,810)]),
 'EN-Skills': ('EN-Skills', HAT_LIPS_SKILLS),
 'FR-Skills': ('FR-Skills', HAT_LIPS_SKILLS),
 # The final crops sit 180px higher and lose the headline band, so they need
 # their own boxes. Both keep the Mistral mark and the banner hearts clear.
 'EN-Skills-Final': ('EN-Skills-Final', [(720,5,970,190),(802,238,890,285)]),
 'FR-Skills-Final': ('FR-Skills-Final', [(720,5,970,190),(802,238,890,285)]),
 # Four characters, so four beanie-and-lips boxes. The red X, the RAG label and
 # the lightbulb sit outside them and stay red, like the 4D checkmarks.
 'EN-Context': ('EN-Context', [(100,115,275,295),(1460,170,1630,335),
                               (68,560,222,716),(1482,598,1630,750)]),
 'FR-Context': ('FR-Context', [(100,115,275,295),(1460,170,1630,335),
                               (68,565,222,720),(1482,600,1630,752)]),
 # A square crop of the same cast, with no lettering, so it needs no language pair.
 'People':  ('People', [(335,100,705,392),(455,470,580,534)]),
 # Here the red is scenery, not an accent on one object: awnings, the bistro
 # chair weave, the beret-shaped balloon and the arrow all move together, or the
 # frame ends up with two reds and an amber in it. The tricolore on the basket
 # keeps its red — an amber stripe stops reading as the French flag.
 'Hallucination': ('Hallucination', None, [(1716,378,1752,416)]),
 # Both of these are red throughout rather than red in one place: the poster
 # ground is already gone by this point, so what is left is cabling, screen text
 # and signage, and it all moves together.
 'Sovereign': ('Sovereign', None),
 'Cafe':      ('Cafe', None),
}

def to_hsv(a):
    mx=a.max(2);mn=a.min(2);d=mx-mn
    r,g,b=a[:,:,0],a[:,:,1],a[:,:,2]
    h=np.zeros_like(mx);nz=d>1e-6
    i=nz&(mx==r); h[i]=((g-b)[i]/d[i])%6
    i=nz&(mx==g)&(mx!=r); h[i]=((b-r)[i]/d[i])+2
    i=nz&(mx==b)&(mx!=r)&(mx!=g); h[i]=((r-g)[i]/d[i])+4
    return h*60, np.where(mx>0,d/np.maximum(mx,1e-6),0), mx

def to_rgb(h,s,v):
    h=np.mod(h,360)/60.0; i=np.floor(h).astype(int); f=h-i
    p=v*(1-s); q=v*(1-s*f); t=v*(1-s*(1-f)); i%=6
    o=np.zeros(h.shape+(3,),np.float32)
    for k,(R,G,B) in enumerate([(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]):
        m=i==k; o[m,0]=R[m]; o[m,1]=G[m]; o[m,2]=B[m]
    return o

for name,job in JOBS.items():
    src,boxes = job[0],job[1]
    protect = job[2] if len(job)>2 else []
    a=np.asarray(Image.open(os.path.join(SRC,src+'.png')).convert('RGB')).astype(np.float32)/255
    h,s,v=to_hsv(a)
    dh=np.minimum(np.abs(h),np.abs(360-h))
    w=np.clip((25.0-dh)/18.0,0,1)*np.clip((s-0.22)/0.20,0,1)   # soft "how red is it"
    if boxes is None:
        region=np.ones(w.shape,bool)
    else:
        region=np.zeros(w.shape,bool)
        for x0,y0,x1,y1 in boxes: region[y0:y1,x0:x1]=True
    for x0,y0,x1,y1 in protect: region[y0:y1,x0:x1]=False
    w*=region
    hn=np.where(w>0,h+(TARGET_H-np.where(h>180,h-360,h))*w,h)
    sn=s+(np.maximum(s,TARGET_S)-s)*w
    o=a*(1-w[...,None])+to_rgb(hn,np.clip(sn,0,1),v)*w[...,None]
    Image.fromarray((np.clip(o,0,1)*255+.5).astype(np.uint8)).save(os.path.join(OUT,name+'.png'),optimize=True)
    print(f'{name:16s} <- {src:32s} {int((w>0.05).sum()):6d} px recoloured')
