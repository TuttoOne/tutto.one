/* Three screens. Plain ES modules, no framework, no build step, nothing fetched from
 * anywhere but this directory.
 *
 * No PDF library either: every page was rendered to an image at build time, so the viewer is
 * an <img> with a positioned <div> over it. The highlight rectangle comes from the pipeline —
 * PDF points, converted here to image pixels using the page size the build recorded. That is
 * why the maths is exact rather than approximate.
 *
 * The rectangles are NOT the generator's. The corpus ships with a manifest that knows exactly
 * where every field was placed, and using it would light up the right words on a document the
 * pipeline had failed to read. web/build.py fails the build if that file ever reaches here.
 */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

const state = {
  corpus: [],
  register: null,
  events: [],
  filtered: [],
  sort: { key: 'folder', dir: 1 },
  run: { i: 0, timer: null, speed: 8, playing: false, tally: {}, exceptions: 0 },
};

const fmt = {
  date: (iso) => (iso ? iso.split('-').reverse().join('/') : '—'),
  bytes: (n) => (n > 1e6 ? (n / 1e6).toFixed(1) + ' Mo' : Math.round(n / 1024) + ' ko'),
  clock: (ms) => {
    const s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
  },
};

const esc = (s) =>
  String(s ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---------------------------------------------------------------- boot

async function boot() {
  const [corpus, register, runlog, graph] = await Promise.all([
    fetch('data/corpus-index.json').then((r) => r.json()),
    fetch('data/gap-register.json').then((r) => r.json()),
    fetch('data/runlog.ndjson').then((r) => r.text()),
    fetch('data/graph.json').then((r) => r.json()).catch(() => null),
  ]);
  state.graph = graph;
  state.corpus = corpus;
  state.byId = new Map(corpus.map((d) => [d.id, d]));
  state.byPath = new Map(corpus.map((d) => [d.path, d]));
  state.register = register;
  state.events = runlog
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      try { return JSON.parse(line); } catch { return null; }
    })
    .filter(Boolean);

  buildFilters();
  renderCorpus();
  renderFinding();
  wireTabs();
  wireRun();
  wireViewer();
  if (graph) renderMap();
}

// ---------------------------------------------------------------- 1. the corpus

function buildFilters() {
  const classes = new Map();
  const langues = new Set();
  for (const d of state.corpus) {
    if (d.lisible) classes.set(d.classe, d.classe_label);
    if (d.langue) langues.add(d.langue);
  }
  const classSel = $('#f-classe');
  for (const [key, label] of [...classes].sort((a, b) => a[1].localeCompare(b[1], 'fr'))) {
    classSel.insertAdjacentHTML('beforeend', `<option value="${esc(key)}">${esc(label)}</option>`);
  }
  const langSel = $('#f-langue');
  for (const l of [...langues].sort()) {
    langSel.insertAdjacentHTML('beforeend', `<option value="${esc(l)}">${l === 'fr' ? 'Français' : 'Anglais'}</option>`);
  }

  for (const el of [$('#q'), $('#f-classe'), $('#f-etat'), $('#f-langue')]) {
    el.addEventListener('input', renderCorpus);
  }
  for (const th of $$('#corpus th[data-sort]')) {
    th.addEventListener('click', () => {
      const key = th.dataset.sort;
      state.sort.dir = state.sort.key === key ? -state.sort.dir : 1;
      state.sort.key = key;
      renderCorpus();
    });
  }
}

function renderCorpus() {
  const q = $('#q').value.trim().toLowerCase();
  const classe = $('#f-classe').value;
  const etat = $('#f-etat').value;
  const langue = $('#f-langue').value;

  let rows = state.corpus.filter((d) => {
    if (classe && d.classe !== classe) return false;
    if (etat === 'lisible' && !d.lisible) return false;
    if (etat === 'illisible' && d.lisible) return false;
    if (langue && d.langue !== langue) return false;
    if (q && !(d.filename + ' ' + d.folder + ' ' + (d.classe_label || '')).toLowerCase().includes(q)) return false;
    return true;
  });

  const { key, dir } = state.sort;
  rows.sort((a, b) => {
    const x = a[key] ?? '', y = b[key] ?? '';
    if (typeof x === 'number' && typeof y === 'number') return (x - y) * dir;
    return String(x).localeCompare(String(y), 'fr', { numeric: true }) * dir;
  });
  state.filtered = rows;

  const unreadable = rows.filter((d) => !d.lisible).length;
  $('#count').textContent =
    `${rows.length} document${rows.length > 1 ? 's' : ''} sur ${state.corpus.length}` +
    (unreadable ? ` — ${unreadable} illisible${unreadable > 1 ? 's' : ''}` : '');

  $('#corpus tbody').innerHTML = rows
    .map((d) => {
      const etatCell = d.lisible
        ? '<span class="tag good">lisible</span>'
        : `<span class="tag bad">illisible</span> <span class="small">${esc(d.motif_fr || '')}</span>`;
      const classeCell = d.lisible
        ? esc(d.classe_label)
        : '<span class="tag muted">non déterminée</span>';
      return `<tr class="clickable${d.lisible ? '' : ' unreadable'}" data-id="${d.id}">
        <td class="file">${esc(d.filename)}</td>
        <td class="folder">${esc(d.folder)}</td>
        <td>${classeCell}</td>
        <td>${fmt.date(d.date)}</td>
        <td class="num">${d.pages || '—'}</td>
        <td>${d.langue ? (d.langue === 'fr' ? 'FR' : 'EN') : '—'}</td>
        <td>${etatCell}</td>
      </tr>`;
    })
    .join('');

  for (const tr of $$('#corpus tbody tr')) {
    tr.addEventListener('click', () => openDoc(tr.dataset.id, 1, null));
  }
}

// ---------------------------------------------------------------- 2. the run

function wireRun() {
  $('#play').addEventListener('click', togglePlay);
  $('#reset').addEventListener('click', resetRun);
  for (const b of $$('.speeds button')) {
    b.addEventListener('click', () => {
      $$('.speeds button').forEach((x) => x.classList.remove('active'));
      b.classList.add('active');
      state.run.speed = Number(b.dataset.speed);
      if (state.run.speed === 0) { finishRun(); }
      else if (state.run.playing) { schedule(); }
    });
  }
}

function togglePlay() {
  state.run.playing = !state.run.playing;
  $('#play').textContent = state.run.playing ? 'Pause' : 'Reprendre';
  if (state.run.playing) schedule();
  else clearTimeout(state.run.timer);
}

function resetRun() {
  clearTimeout(state.run.timer);
  state.run = { i: 0, timer: null, speed: state.run.speed, playing: false, tally: {}, exceptions: 0 };
  $('#play').textContent = 'Lancer';
  $('#ticker').innerHTML = '';
  $('#exceptions').innerHTML = '';
  $('#classtally tbody').innerHTML = '';
  $('#excount').textContent = '0';
  $('#stage').textContent = 'en attente';
  $('#bar').style.width = '0';
  $('#clock').textContent = '00:00';
}

function schedule() {
  const { events } = state;
  const run = state.run;
  if (run.i >= events.length) { run.playing = false; $('#play').textContent = 'Terminé'; return; }
  const current = events[run.i];
  const next = events[run.i + 1];
  // Real pacing, divided by the chosen speed. The gap between events is what makes the run
  // look like work rather than an animation, so it is preserved rather than invented.
  const gap = next ? Math.max(0, next.t_rel_ms - current.t_rel_ms) : 0;
  applyEvent(current);
  run.i += 1;
  const delay = Math.min(400, gap / (run.speed || 1));
  run.timer = setTimeout(() => { if (run.playing) schedule(); }, delay);
}

function finishRun() {
  clearTimeout(state.run.timer);
  state.run.playing = false;
  while (state.run.i < state.events.length) { applyEvent(state.events[state.run.i]); state.run.i += 1; }
  $('#play').textContent = 'Terminé';
}

const STAGE_FR = {
  run: 'Ouverture de la passe',
  inventory: 'Inventaire : lecture de chaque fichier',
  fields: 'Relevé des champs par type de document',
  checks: 'Rapprochements entre documents',
  status: 'Position par chapitre du référentiel',
};

function applyEvent(e) {
  const run = state.run;
  $('#clock').textContent = fmt.clock(e.t_rel_ms);
  $('#bar').style.width = ((run.i + 1) / state.events.length * 100).toFixed(1) + '%';

  if (e.type === 'stage_start') { $('#stage').textContent = STAGE_FR[e.stage] || e.stage; return; }
  if (e.type === 'stage_end' && e.stage === 'status') { $('#stage').textContent = 'Passe terminée'; return; }

  if (e.stage === 'inventory' && e.type === 'document') {
    const d = e.data || {};
    push('#ticker', `<span class="cls">${esc(d.label || d.doc_class || '')}</span> ${esc(shortPath(d.path))}`);
    const key = d.label || d.doc_class || 'inconnu';
    run.tally[key] = (run.tally[key] || 0) + 1;
    renderTally();
    return;
  }

  if (e.stage === 'inventory' && e.type === 'exception') {
    const d = e.data || {};
    run.exceptions += 1;
    $('#excount').textContent = String(run.exceptions);
    push('#exceptions', `${esc(shortPath(d.path))} <span class="why">— ${esc(d.reason_fr || d.reason || '')}</span>`);
    return;
  }

  if (e.stage === 'checks' && e.type === 'finding') {
    const d = e.data || {};
    push('#ticker', `<span class="cls">constat ${esc(d.clause)}</span> ${esc(d.title || '')}`);
  }
}

function shortPath(path) {
  if (!path) return '';
  const parts = String(path).split('/');
  return parts[parts.length - 1];
}

function push(sel, html) {
  const list = $(sel);
  list.insertAdjacentHTML('afterbegin', `<li>${html}</li>`);
  while (list.children.length > 60) list.lastElementChild.remove();
}

function renderTally() {
  const rows = Object.entries(state.run.tally).sort((a, b) => b[1] - a[1]);
  $('#classtally tbody').innerHTML = rows
    .map(([label, n]) => `<tr><td>${esc(label)}</td><td class="num">${n}</td></tr>`)
    .join('');
}

// ---------------------------------------------------------------- 3. the finding

const STATUS_CLASS = { evidenced: 'good', partial: 'bad', absent: 'warn', non_evalue: 'muted' };

function renderFinding() {
  const reg = state.register;
  const s = reg.summary;

  $('#kpis').innerHTML = [
    kpi(s.documents, 'documents'),
    kpi(s.pages, 'pages'),
    kpi(s.documents_unreadable, 'illisibles', s.documents_unreadable > 0),
    kpi(s.clauses_assessable, 'chapitres évaluables'),
    kpi(s.partial, 'chapitres incomplets', s.partial > 0),
    kpi(s.absent, 'chapitres sans preuve'),
    kpi(s.findings, 'constats'),
  ].join('');

  $('#disclaimer').innerHTML =
    `<strong>${esc(reg.disclaimer_fr)}</strong><br>${esc(reg.absence_fr)}`;

  const findings = reg.clauses.flatMap((c) => c.findings);
  $('#findings').innerHTML = findings.length
    ? findings.map(renderOneFinding).join('')
    : `<p class="small">Aucun constat. ${esc(reg.absence_fr)}</p>`;

  for (const btn of $$('#findings .cite')) {
    btn.addEventListener('click', () => {
      const doc = state.byPath.get(btn.dataset.path);
      if (doc) openDoc(doc.id, Number(btn.dataset.page) || 1, btn.dataset.rect ? JSON.parse(btn.dataset.rect) : null);
    });
  }

  // What the checks could not examine. Neither a finding nor a clean bill, and it bounds what
  // the coverage figures above are worth — so it goes on the screen, not in a log.
  const limits = reg.clauses.flatMap((c) => [
    ...(c.unexamined || []).map((u) => ({ clause: c.clause, titre: c.titre, texte: u.reason_fr })),
    ...(c.checks_blocked || []).map((b) => ({
      clause: c.clause, titre: c.titre, texte: `Vérification impossible : ${b.reason_fr}`,
    })),
  ]);
  const limitsHost = $('#limits');
  if (limits.length) {
    limitsHost.hidden = false;
    limitsHost.innerHTML =
      `<h2 class="sectiontitle">Ce qui n'a pas pu être vérifié</h2>
       <ul class="limits">${limits
         .map((l) => `<li><strong>${esc(l.clause)} ${esc(l.titre)}.</strong> ${esc(l.texte)}</li>`)
         .join('')}</ul>
       <p class="small">Ces points ne sont ni des constats ni des conformités. Ils délimitent ce
       que l'examen a réellement couvert.</p>`;
  } else {
    limitsHost.hidden = true;
  }

  $('#clausenote').textContent =
    `${s.clauses_total} chapitres au référentiel. ${s.clauses_assessable} peuvent être examinés ` +
    `sur pièces ; ${s.clauses_not_assessable} ne peuvent pas l'être et sont signalés comme tels ` +
    `plutôt que comptés comme couverts. ${esc(reg.note_fr)}`;

  $('#clauses tbody').innerHTML = reg.clauses
    .map((c) => {
      const note = c.status === 'non_evalue' && c.reason_fr
        ? `<br><span class="small">${esc(c.reason_fr)}</span>` : '';
      return `<tr>
        <td class="num">${esc(c.clause)}</td>
        <td>${esc(c.titre)}${note}</td>
        <td><span class="tag ${STATUS_CLASS[c.status] || ''}">${esc(c.status_fr)}</span></td>
        <td class="num">${c.coverage.considered || '—'}</td>
      </tr>`;
    })
    .join('');
}

function kpi(n, label, alert = false) {
  return `<div${alert ? ' class="alert"' : ''}><span class="n">${n}</span><span class="l">${esc(label)}</span></div>`;
}

function renderOneFinding(f) {
  const shown = f.evidence.slice(0, 8);
  const extra = f.documents.length - shown.length;
  const cites = shown
    .map((p) => {
      const pageOnly = !p.region_available;
      const label = `${esc(p.filename)} <span class="pg">p.${p.page}</span>`;
      return `<li><button class="cite${pageOnly ? ' pageonly' : ''}"
        data-path="${esc(p.path)}" data-page="${p.page}"
        ${p.rect ? `data-rect='${JSON.stringify(p.rect)}'` : ''}
        title="${pageOnly ? 'Renvoi à la page : document numérisé, région non déterminée' : 'Ouvrir à la région citée'}"
        >${label}</button></li>`;
    })
    .join('');
  const more = extra > 0 ? `<span class="morecites">et ${extra} autres documents concernés</span>` : '';
  return `<div class="finding">
    <div class="clause">Chapitre ${esc(f.clause)} — ${esc(f.severity)}</div>
    <h3>${esc(f.title_fr)}</h3>
    <p>${esc(f.statement_fr)}</p>
    <p class="missing"><strong>Ce qui manque.</strong> ${esc(f.missing_fr)}</p>
    <div class="cites"><span class="lbl">Pièces citées</span><ul>${cites}${more}</ul></div>
  </div>`;
}

// ---------------------------------------------------------------- the viewer

const viewer = { doc: null, page: 1, rect: null, citedPage: null };

function wireViewer() {
  $('#v-close').addEventListener('click', closeDoc);
  $('#v-prev').addEventListener('click', () => gotoPage(viewer.page - 1));
  $('#v-next').addEventListener('click', () => gotoPage(viewer.page + 1));
  document.addEventListener('keydown', (e) => {
    if ($('#viewer').hidden) return;
    if (e.key === 'Escape') closeDoc();
    if (e.key === 'ArrowLeft') gotoPage(viewer.page - 1);
    if (e.key === 'ArrowRight') gotoPage(viewer.page + 1);
  });
  $('#viewer').addEventListener('click', (e) => { if (e.target.id === 'viewer') closeDoc(); });
}

function openDoc(id, page, rect) {
  const doc = state.byId.get(id);
  if (!doc) return;
  viewer.doc = doc;
  viewer.rect = rect;
  // The rectangle belongs to the page the citation named. Paging away from it must not carry
  // the highlight along, or the demo shows a box around unrelated words.
  viewer.citedPage = rect ? page || 1 : null;
  $('#viewer').hidden = false;
  $('#v-name').textContent = doc.filename;
  $('#v-meta').textContent =
    [doc.folder, doc.lisible ? doc.classe_label : 'illisible', fmt.date(doc.date), fmt.bytes(doc.octets)]
      .filter(Boolean)
      .join(' · ');
  gotoPage(page || 1);
}

function gotoPage(page) {
  const doc = viewer.doc;
  if (!doc) return;
  const images = doc.images || [];

  if (!images.length) {
    // Nothing to show, and that is the finding. Say which of the reasons it was.
    $('#v-stage').hidden = true;
    $('#v-note').hidden = false;
    $('#v-note').innerHTML = `<h3>Ce document n'a pas pu être lu</h3>
      <p>${esc(doc.motif_fr || 'Motif non déterminé')}.</p>
      <p class="small">Aucune image de page ne peut être produite. Son contenu ne peut être versé
      au dossier de preuve, quel qu'il soit — c'est le constat lui-même, pas une limite de cet écran.</p>`;
    $('#v-page').textContent = '—';
    $('#v-prev').disabled = $('#v-next').disabled = true;
    return;
  }

  $('#v-note').hidden = true;
  $('#v-stage').hidden = false;
  viewer.page = Math.min(Math.max(1, page), images.length);
  const info = images[viewer.page - 1];
  const img = $('#v-img');
  img.src = info.file;
  img.alt = `${doc.filename}, page ${viewer.page}`;
  $('#v-page').textContent = `page ${viewer.page} / ${images.length}`;
  $('#v-prev').disabled = viewer.page <= 1;
  $('#v-next').disabled = viewer.page >= images.length;

  const highlight = $('#v-hl');
  highlight.hidden = true;
  // Only highlight on the page the citation named, and only when the pipeline gave us a
  // rectangle. Scale from PDF points to rendered pixels using the size recorded at build.
  if (viewer.rect && info.width && viewer.page === viewer.citedPage) {
    const place = () => {
      const scale = img.clientWidth / info.width;
      const [x0, y0, x1, y1] = viewer.rect;
      const pad = 2;
      Object.assign(highlight.style, {
        left: (x0 * scale - pad) + 'px',
        top: (y0 * scale - pad) + 'px',
        width: ((x1 - x0) * scale + pad * 2) + 'px',
        height: ((y1 - y0) * scale + pad * 2) + 'px',
      });
      highlight.hidden = false;
    };
    if (img.complete) place(); else img.onload = place;
    window.addEventListener('resize', place, { once: true });
  }
}

function closeDoc() {
  $('#viewer').hidden = true;
  $('#v-hl').hidden = true;
  viewer.doc = null;
  viewer.rect = null;
  viewer.citedPage = null;
}

// ---------------------------------------------------------------- 4. the map
//
// Node coordinates arrive already laid out (pipeline/relations.py). The browser draws and
// handles interaction; it never simulates. That keeps the map identical on every open — worth
// having when you have rehearsed pointing at a particular cluster — and keeps a projector
// laptop from spending two seconds of CPU settling a force graph while a room watches.

const SVG_NS = 'http://www.w3.org/2000/svg';
const KIND_CLASS = {
  document: 'n-doc', instrument: 'n-instrument', part: 'n-part', person: 'n-person',
  supplier: 'n-supplier', procedure: 'n-procedure', heat: 'n-heat',
};

const map = { nodes: [], edges: [], byId: new Map(), neighbours: new Map(), view: null, selected: null };

function el(name, attrs = {}) {
  const node = document.createElementNS(SVG_NS, name);
  for (const [k, v] of Object.entries(attrs)) if (v !== null && v !== undefined) node.setAttribute(k, v);
  return node;
}

function nodeRadius(n) {
  if (n.kind === 'document') return 3.1;
  // Hubs grow with how much runs through them, but slowly — a 20-document instrument should
  // read as bigger than a 3-document one without swamping the picture.
  return 5 + Math.min(7, Math.sqrt(n.degree) * 1.5);
}

function renderMap() {
  const g = state.graph;
  map.nodes = g.nodes;
  map.edges = g.edges;
  map.byId = new Map(g.nodes.map((n) => [n.id, n]));

  // Adjacency, for the hover highlight and the side panel.
  map.neighbours = new Map(g.nodes.map((n) => [n.id, []]));
  for (const e of g.edges) {
    map.neighbours.get(e.s).push({ id: e.t, relation: e.r, constats: e.constats });
    map.neighbours.get(e.t).push({ id: e.s, relation: e.r, constats: e.constats });
  }

  const svg = $('#map');
  svg.innerHTML = '';
  const extent = {
    x0: Math.min(...g.nodes.map((n) => n.x)) - 40,
    y0: Math.min(...g.nodes.map((n) => n.y)) - 40,
    x1: Math.max(...g.nodes.map((n) => n.x)) + 40,
    y1: Math.max(...g.nodes.map((n) => n.y)) + 40,
  };
  map.view = { ...extent };
  applyViewBox();

  const edgeLayer = el('g', { class: 'edges' });
  const nodeLayer = el('g', { class: 'nodes' });
  const labelLayer = el('g', { class: 'labels' });
  svg.append(edgeLayer, nodeLayer, labelLayer);

  for (const e of g.edges) {
    const a = map.byId.get(e.s), b = map.byId.get(e.t);
    if (!a || !b) continue;
    const line = el('line', {
      x1: a.x, y1: a.y, x2: b.x, y2: b.y,
      class: 'edge' + (e.constats ? ' finding' : ''),
    });
    line.dataset.s = e.s;
    line.dataset.t = e.t;
    line.dataset.r = e.r;
    edgeLayer.append(line);
  }

  for (const n of g.nodes) {
    const group = el('g', { class: 'node' });
    group.dataset.id = n.id;
    let cls = KIND_CLASS[n.kind] || 'n-doc';
    if (n.constats) cls = 'n-finding';
    else if (n.kind === 'document' && n.isolement) cls = 'n-isolated';
    // Entities are diamonds, documents circles. Shape distinguishes the two sides of the
    // graph even in a photograph of a projector screen where colour is unreliable.
    if (n.kind === 'document') {
      group.append(el('circle', { cx: n.x, cy: n.y, r: nodeRadius(n), class: cls }));
    } else {
      const r = nodeRadius(n);
      const points = [[n.x, n.y - r], [n.x + r, n.y], [n.x, n.y + r], [n.x - r, n.y]]
        .map((p) => p.join(',')).join(' ');
      group.append(el('polygon', { points, class: cls }));
    }
    nodeLayer.append(group);

    // Label position comes from the pipeline, which de-collided them once (relations.place_labels)
    // so the SVG and the PNG preview agree and the map reads the same every time it opens.
    if (n.kind !== 'document' && !n.lhide) {
      const label = el('text', { x: n.x + (n.ldx ?? 8), y: n.y + (n.ldy ?? 0) + 3.2, class: 'label' });
      label.textContent = n.label;
      label.dataset.for = n.id;
      labelLayer.append(label);
    }
  }

  // The band of unlinked documents gets a rule and a caption, so it reads as a deliberate
  // holding area rather than as debris that drifted to the edge.
  const isolated = g.nodes.filter((n) => n.isolement);
  if (isolated.length) {
    const x = Math.min(...isolated.map((n) => n.x)) - 16;
    const rule = el('line', { x1: x, y1: extent.y0 + 20, x2: x, y2: extent.y1 - 20, class: 'bandrule' });
    const caption = el('text', { x: x + 6, y: extent.y0 + 34, class: 'bandlabel' });
    caption.textContent = `${isolated.length} documents sans lien`;
    svg.insertBefore(rule, edgeLayer);
    labelLayer.append(caption);
  }

  const kindSelect = $('#m-kind');
  for (const [key, label] of Object.entries(g.relations)) {
    kindSelect.insertAdjacentHTML('beforeend', `<option value="${esc(key)}">${esc(label)}</option>`);
  }

  $('#m-note').textContent =
    `${g.counts.documents} documents, ${g.counts.entities} entités, ${g.counts.edges} liens. ` +
    `${g.counts.unlinked_documents} documents ne se rattachent à rien : ` +
    `${g.counts.unlinked_because_unreadable} illisibles, ` +
    `${g.counts.unlinked_because_no_field} lisibles mais sans champ exploitable — ` +
    `sur un formulaire numérisé, la structure du tableau ne survit pas toujours à la lecture.`;

  wireMap();
  applyMapFilter();
}

function applyViewBox() {
  const v = map.view;
  $('#map').setAttribute('viewBox', `${v.x0} ${v.y0} ${v.x1 - v.x0} ${v.y1 - v.y0}`);
}

function wireMap() {
  const svg = $('#map');

  svg.addEventListener('mousemove', (e) => {
    const group = e.target.closest('.node');
    if (!group) { hideTip(); if (!map.selected) clearHighlight(); return; }
    const node = map.byId.get(group.dataset.id);
    if (!node) return;
    showTip(node, e);
    if (!map.selected) highlight(node.id);
  });
  svg.addEventListener('mouseleave', () => { hideTip(); if (!map.selected) clearHighlight(); });

  svg.addEventListener('click', (e) => {
    const group = e.target.closest('.node');
    if (!group) { map.selected = null; $('#m-panel').hidden = true; clearHighlight(); return; }
    const node = map.byId.get(group.dataset.id);
    map.selected = node.id;
    highlight(node.id);
    openPanel(node);
  });

  // Pan and zoom. Wheel zooms about the cursor so you can dig into a cluster.
  let dragging = null;
  svg.addEventListener('mousedown', (e) => {
    if (e.target.closest('.node')) return;
    dragging = { x: e.clientX, y: e.clientY, view: { ...map.view } };
    svg.classList.add('dragging');
  });
  window.addEventListener('mouseup', () => { dragging = null; svg.classList.remove('dragging'); });
  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const rect = svg.getBoundingClientRect();
    const scale = (dragging.view.x1 - dragging.view.x0) / rect.width;
    const dx = (e.clientX - dragging.x) * scale;
    const dy = (e.clientY - dragging.y) * scale;
    map.view = {
      x0: dragging.view.x0 - dx, x1: dragging.view.x1 - dx,
      y0: dragging.view.y0 - dy, y1: dragging.view.y1 - dy,
    };
    applyViewBox();
  });
  svg.addEventListener('wheel', (e) => {
    e.preventDefault();
    const rect = svg.getBoundingClientRect();
    const v = map.view;
    const px = v.x0 + ((e.clientX - rect.left) / rect.width) * (v.x1 - v.x0);
    const py = v.y0 + ((e.clientY - rect.top) / rect.height) * (v.y1 - v.y0);
    const factor = e.deltaY > 0 ? 1.14 : 1 / 1.14;
    map.view = {
      x0: px - (px - v.x0) * factor, x1: px + (v.x1 - px) * factor,
      y0: py - (py - v.y0) * factor, y1: py + (v.y1 - py) * factor,
    };
    applyViewBox();
  }, { passive: false });

  $('#m-reset').addEventListener('click', () => {
    map.view = {
      x0: Math.min(...map.nodes.map((n) => n.x)) - 40,
      y0: Math.min(...map.nodes.map((n) => n.y)) - 40,
      x1: Math.max(...map.nodes.map((n) => n.x)) + 40,
      y1: Math.max(...map.nodes.map((n) => n.y)) + 40,
    };
    applyViewBox();
    map.selected = null;
    $('#m-panel').hidden = true;
    clearHighlight();
  });

  $('#m-findings').addEventListener('change', applyMapFilter);
  $('#m-kind').addEventListener('change', applyMapFilter);
  $('#m-search').addEventListener('input', applyMapFilter);
  $('#m-labels').addEventListener('change', () => {
    $('#map').querySelector('.labels').style.display = $('#m-labels').checked ? '' : 'none';
  });
  $('#m-panel-close').addEventListener('click', () => {
    map.selected = null; $('#m-panel').hidden = true; clearHighlight();
  });
}

function applyMapFilter() {
  const onlyFindings = $('#m-findings').checked;
  const relation = $('#m-kind').value;
  const query = $('#m-search').value.trim().toLowerCase();

  const keep = new Set();
  for (const n of map.nodes) {
    if (onlyFindings && !n.constats) continue;
    if (query && !(n.label + ' ' + (n.sublabel || '')).toLowerCase().includes(query)) continue;
    keep.add(n.id);
  }
  // A node passing the filter drags in whatever it connects to, or the map shows nodes with
  // their relationships cut off — which is the one thing a relationship map must not do.
  if (query || onlyFindings) {
    for (const id of [...keep]) for (const nb of map.neighbours.get(id) || []) keep.add(nb.id);
  }

  const svg = $('#map');
  for (const group of svg.querySelectorAll('.node')) {
    group.classList.toggle('dim', !keep.has(group.dataset.id));
  }
  for (const label of svg.querySelectorAll('.label')) {
    label.classList.toggle('dim', !keep.has(label.dataset.for));
  }
  for (const line of svg.querySelectorAll('.edge')) {
    const visible = keep.has(line.dataset.s) && keep.has(line.dataset.t)
      && (!relation || line.dataset.r === relation);
    line.classList.toggle('dim', !visible);
  }

  const shown = [...keep].filter((id) => map.byId.get(id)?.kind === 'document').length;
  $('#m-count').textContent = `${shown} documents affichés sur ${state.graph.counts.documents}`;
}

function highlight(id) {
  const near = new Set([id, ...(map.neighbours.get(id) || []).map((n) => n.id)]);
  const svg = $('#map');
  for (const group of svg.querySelectorAll('.node')) {
    group.classList.toggle('hot', group.dataset.id === id);
  }
  for (const line of svg.querySelectorAll('.edge')) {
    line.classList.toggle('hot', line.dataset.s === id || line.dataset.t === id);
  }
  void near;
}

function clearHighlight() {
  const svg = $('#map');
  for (const g of svg.querySelectorAll('.node.hot')) g.classList.remove('hot');
  for (const l of svg.querySelectorAll('.edge.hot')) l.classList.remove('hot');
}

function showTip(node, event) {
  const tip = $('#m-tip');
  const kindLabel = node.kind === 'document'
    ? (node.classe ? (state.byPath.get(node.path)?.classe_label || node.sublabel) : node.sublabel)
    : state.graph.entity_labels[node.kind];
  const bits = [`<strong>${esc(node.label)}</strong>`, `<span class="t-sub">${esc(kindLabel)}</span>`];
  if (node.kind === 'document' && node.date) bits.push(`<span class="t-sub">${fmt.date(node.date)}</span>`);
  if (node.kind !== 'document') bits.push(`<span class="t-sub">${node.degree} documents</span>`);
  if (node.isolement) bits.push(`<span class="t-flag">sans lien — ${esc(node.isolement)}</span>`);
  if (node.constats) bits.push(`<span class="t-flag">constat ${node.constats.join(', ')}</span>`);
  tip.innerHTML = bits.join('<br>');
  tip.hidden = false;

  const wrap = $('.mapwrap').getBoundingClientRect();
  const x = event.clientX - wrap.left + 14;
  const y = event.clientY - wrap.top + 14;
  tip.style.left = Math.min(x, wrap.width - tip.offsetWidth - 8) + 'px';
  tip.style.top = Math.min(y, wrap.height - tip.offsetHeight - 8) + 'px';
}

function hideTip() { $('#m-tip').hidden = true; }

function openPanel(node) {
  const panel = $('#m-panel');
  const body = $('#m-panel-body');
  const isDoc = node.kind === 'document';
  const kindLabel = isDoc ? 'Document' : state.graph.entity_labels[node.kind];

  const parts = [`<h3>${esc(node.label)}</h3>`, `<div class="p-kind">${esc(kindLabel)}</div>`];

  if (node.constats) {
    parts.push(
      `<div class="p-flag">Impliqué dans un constat au chapitre ${esc(node.constats.join(', '))}.</div>`
    );
  }
  if (node.isolement) {
    parts.push(
      `<div class="p-flag">Ce document ne se rattache à rien : ${esc(node.isolement)}.</div>`
    );
  }

  if (isDoc) {
    const doc = state.byPath.get(node.path);
    parts.push(
      `<ul>
         <li>${esc(doc?.classe_label || node.sublabel)}</li>
         <li>${node.date ? fmt.date(node.date) : 'sans date'}</li>
         <li class="rel">${esc(doc?.folder || '')}</li>
       </ul>`
    );
    if (doc) parts.push(`<h4>Ouvrir</h4><ul><li><button data-open="${esc(doc.id)}">Voir le document</button></li></ul>`);
  }

  const links = map.neighbours.get(node.id) || [];
  if (links.length) {
    const grouped = new Map();
    for (const link of links) {
      const other = map.byId.get(link.id);
      if (!other) continue;
      const label = state.graph.relations[link.relation] || link.relation;
      if (!grouped.has(label)) grouped.set(label, []);
      grouped.get(label).push({ other, constats: link.constats });
    }
    for (const [label, items] of grouped) {
      parts.push(`<h4>${esc(label)} — ${items.length}</h4><ul>`);
      for (const { other, constats } of items.slice(0, 40)) {
        const open = other.kind === 'document' && other.path
          ? `<button data-open="${esc(state.byPath.get(other.path)?.id || '')}">${esc(other.label)}</button>`
          : `<button data-focus="${esc(other.id)}">${esc(other.label)}</button>`;
        const flag = constats ? ` <span class="rel">constat ${esc(constats.join(', '))}</span>` : '';
        const when = other.date ? ` <span class="rel">${fmt.date(other.date)}</span>` : '';
        parts.push(`<li>${open}${when}${flag}</li>`);
      }
      if (items.length > 40) parts.push(`<li class="rel">et ${items.length - 40} autres</li>`);
      parts.push('</ul>');
    }
  }

  body.innerHTML = parts.join('');
  panel.hidden = false;

  for (const button of body.querySelectorAll('[data-open]')) {
    button.addEventListener('click', () => {
      const id = button.dataset.open;
      if (id) openDoc(id, 1, null);
    });
  }
  for (const button of body.querySelectorAll('[data-focus]')) {
    button.addEventListener('click', () => {
      const target = map.byId.get(button.dataset.focus);
      if (!target) return;
      map.selected = target.id;
      highlight(target.id);
      openPanel(target);
      focusOn(target);
    });
  }
}

function focusOn(node) {
  const span = 220;
  map.view = { x0: node.x - span, x1: node.x + span, y0: node.y - span * 0.66, y1: node.y + span * 0.66 };
  applyViewBox();
}

// ---------------------------------------------------------------- tabs

function wireTabs() {
  for (const tab of $$('.tabs button')) {
    tab.addEventListener('click', () => {
      $$('.tabs button').forEach((t) => t.classList.remove('active'));
      $$('.view').forEach((v) => v.classList.remove('active'));
      tab.classList.add('active');
      $('#view-' + tab.dataset.view).classList.add('active');
    });
  }
}

boot();
