"""Reset the French basket banner to read SKILLS = SPÉCIALISTES.

"Compétences" is the dictionary translation but not the word the product uses;
the banner has to name the thing. The word SKILLS is lifted from the English
plate rather than typeset, so the hand lettering stays the same hand, scaled to
the French cap height and re-seated on the banner's curved baseline. The two
hearts move inward to close up the gap the shorter line leaves.
"""
import numpy as np, os
from PIL import Image
from scipy import ndimage
from scipy.ndimage import map_coordinates, uniform_filter, gaussian_filter, grey_dilation

A='artwork/'
os.makedirs(A+'build', exist_ok=True)
en=np.asarray(Image.open(A+'EN-Skills.png').convert('RGB')).astype(np.float64)/255
fr=np.asarray(Image.open(A+'FR-Skills.png').convert('RGB')).astype(np.float64)/255

# baseline arcs, fitted to the glyph bottoms of each plate
EN_PTS=[(670,817),(693,819),(710,820),(727.5,821),(747.5,822),(768,823),(841,824),(862,824),
        (883,823),(902.5,823),(918.5,822),(935,821),(955.5,820),(969.5,819),(985.5,819),
        (1003.5,817),(1023.5,816)]
FR_PTS=[(647.5,808),(665,810),(686,814),(705.5,814),(721.5,816),(736.5,817),(752.5,818),
        (768.5,819),(786.5,820),(804,820),(819,821),(873,820),(889,820),(904.5,819),
        (919.5,819),(931,818),(944.5,817),(961,816),(971,815),(982.5,814),(997,812),
        (1013,810),(1026.5,808)]
en_arc=np.polyfit(*zip(*EN_PTS),2); fr_arc=np.polyfit(*zip(*FR_PTS),2)

def hsv_parts(p):
    mx=p.max(2); mn=p.min(2)
    return p.mean(2), np.where(mx>0,(mx-mn)/np.maximum(mx,1e-6),0)

# ---- the two hearts, cut to their own outline (they sit on decorative hatching) ----
g_all,s_all=hsv_parts(fr)
red=(s_all>0.35)&(g_all>0.20)&(fr[:,:,0]>fr[:,:,1]+0.18)&(fr[:,:,0]>fr[:,:,2]+0.18)
lb,_=ndimage.label(red,np.ones((3,3)))
heart_a=np.zeros(fr.shape[:2])
for hx,hy in ((620,778),(1046,778)):
    comp=(lb==lb[hy,hx])
    heart_a=np.maximum(heart_a,gaussian_filter(grey_dilation(comp,size=(9,9)).astype(float),1.1))

# ---- 1. tight mask of the existing lettering + the hearts -------------------
X0,Y0,X1,Y1=608,758,1060,824
p=fr[Y0:Y1,X0:X1]; g,sat=hsv_parts(p)
m=(g<0.66)|(sat>0.24)
lbl,n=ndimage.label(m,np.ones((3,3))); objs=ndimage.find_objects(lbl)
sz=ndimage.sum(m,lbl,range(1,n+1))
keep=np.zeros_like(m)
for i in range(n):
    s=objs[i]; h=s[0].stop-s[0].start; w=s[1].stop-s[1].start
    cx=X0+(s[1].start+s[1].stop)/2
    if s[0].start==0 or s[1].start==0 or s[0].stop==Y1-Y0 or s[1].stop==X1-X0: continue
    if sz[i]<12 or w>=90 or h>=70: continue
    if sz[i]<70 and not (635<cx<1040): continue          # panel rivets, not lettering
    keep|=(lbl==i+1)
# the strokes carry a soft halo past that threshold; take it too, or a ghost survives
keep=keep|(grey_dilation(keep,size=(17,17))&((g<0.82)|(sat>0.16)))

# ---- 2. rebuild the paper from a local mean of genuine paper pixels ---------
valid=(~grey_dilation(keep,size=(7,7))).astype(float)
plate=p.copy()
for W in (31,61,121):
    den=uniform_filter(valid,size=(W,W))
    est=uniform_filter(plate*valid[...,None],size=(W,W,1))/np.maximum(den,1e-6)[...,None]
    ok=den>0.06
    plate=np.where(ok[...,None],est,plate); valid=np.maximum(valid,ok.astype(float))
plate=uniform_filter(plate,size=(5,5,1))
soft=np.clip(uniform_filter(grey_dilation(keep.astype(float),size=(5,5)),size=(5,5)),0,1)
out=fr.copy(); out[Y0:Y1,X0:X1]=p*(1-soft[...,None])+plate*soft[...,None]

# ---- 3. re-set the line ----------------------------------------------------
S=40.0/43.0                                  # French cap height / English cap height
def place(img,arc,sx0,sx1,sy0,sy1,dx0,s,amask=None,pad=7):
    q=img[sy0:sy1,sx0-pad:sx1+pad]
    paper=np.percentile(q.reshape(-1,3),92,axis=0)
    if amask is None:
        a=np.clip((paper.mean()-q.mean(2))/(paper.mean()-0.14),0,1)
        col=np.where(a[...,None]>0.04,(q-paper*(1-a[...,None]))/np.maximum(a[...,None],1e-3),q)
    else:
        a=amask[sy0:sy1,sx0-pad:sx1+pad]; col=q
    col=np.clip(col,0,1)
    dw=int(round((sx1-sx0)*s))+2*pad; dh=int(round((sy1-sy0)*s))+2*pad
    dy0=int(round(np.polyval(fr_arc,dx0)-(np.polyval(arc,sx0)-sy0)*s))-pad
    dxs=np.arange(dw)+int(round(dx0))-pad
    DX,DY=np.meshgrid(dxs,np.arange(dh)+dy0)
    XS=(sx0-pad)+(DX-(dx0-pad))/s
    YS=np.polyval(arc,XS)+(DY-np.polyval(fr_arc,DX))/s
    ci=np.stack([map_coordinates(col[:,:,k],[YS-sy0,XS-(sx0-pad)],order=1,mode='nearest')
                 for k in range(3)],-1)
    ai=np.clip(map_coordinates(a,[YS-sy0,XS-(sx0-pad)],order=1,mode='constant',cval=0),0,1)[...,None]
    sl=(slice(dy0,dy0+dh),slice(dxs[0],dxs[0]+dw))
    out[sl]=out[sl]*(1-ai)+np.clip(ci,0,1)*ai

place(fr,fr_arc,610,631,764,794,654.0,1.0,amask=heart_a,pad=3)   # left heart, moved in
place(en,en_arc,661,777,762,830,675.5,S)                          # SKILLS, from the English
place(fr,fr_arc,838,854,786,818,795.4,1.0)                        # =
place(fr,fr_arc,866,1033,756,830,823.4,1.0,pad=4)                 # SPÉCIALISTES
place(fr,fr_arc,1037,1058,764,794,996.0,1.0,amask=heart_a,pad=3)  # right heart, moved in

Image.fromarray((np.clip(out,0,1)*255+.5).astype(np.uint8)).save(A+'build/FR-Skills-banner.png',optimize=True)
print('wrote artwork/build/FR-Skills-banner.png')
