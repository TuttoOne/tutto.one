"""Write the page-ready plates into client/public/artwork/.

WebP at 84 keeps the pen hatching clean and the paper grain from banding, at
roughly a tenth of the PNG. Full pixel dimensions are kept: several plates carry
small hand-lettered labels that have to survive a reader zooming in.
"""
import os
from PIL import Image

DST = 'client/public/artwork'
# recoloured masters
ORANGE = {
    'EN-4D':'4d-en', 'FR-4D':'4d-fr',
    'EN-Flow':'flow-en', 'FR-Flow':'flow-fr',
    'EN-Skills':'skills-en', 'FR-Skills':'skills-fr',
    'EN-Skills-Final':'skills-final-en', 'FR-Skills-Final':'skills-final-fr',
    'EN-Context':'context-en', 'FR-Context':'context-fr',
    'Hallucination':'hallucination',
    # 'People' is still processed but retired from the site, so it is not shipped
    'Lawyer':'lawyer', 'Teacher':'teacher', 'Builder':'builder', 'FileOnDisk':'file-on-disk', 'Calendar':'calendar',
    # 'Sovereign' and 'People' are still processed but not on any page, so not shipped
}
# no red of ours to move, so these come straight off the background pass
PLAIN = {'Hands':'hands', 'Man':'man', 'Woman':'woman', 'Woman2':'woman2'}

MAXW = 1800   # nothing is displayed wider than ~1000px, so this is already 2x
os.makedirs(DST, exist_ok=True)
for src_dir, table in (('artwork/orange', ORANGE), ('artwork/build/bg', PLAIN)):
    for src, dst in table.items():
        im = Image.open(os.path.join(src_dir, src+'.png')).convert('RGB')
        if im.width > MAXW:
            im = im.resize((MAXW, round(im.height*MAXW/im.width)), Image.LANCZOS)
        out = os.path.join(DST, dst+'.webp')
        im.save(out, 'WEBP', quality=84, method=6)
        print(f'  {dst+".webp":22s} {im.size[0]}x{im.size[1]}  {os.path.getsize(out)/1024:.0f} KB')
