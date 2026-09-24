// Autofill from the French company register (browser only), a website or uploaded documents (via server.py).
// Nothing is written until the person accepts it in the review panel.

import { state, get, fill, isTouched, commit } from './state.js';
import { ORG_TYPES, ORG_SIZES, MATURITY, SCOPES, STAKEHOLDERS, VALUES, REGULATION, labelOf } from './schema.js';
import { esc } from './render.js';
import { hosted, sampleFn, loadScript } from './host.js';

let proposals = null; // { source, sourceLabel, items: [{ path, label, value, display, quote, basis }] }
let busy = '';
let message = '';
let results = [];
let onDone = () => {};

// 'server': python3 server.py with Claude set up. 'sample': a claude.ai artifact viewer. 'none': neither.
let mode = null;

export async function checkAI() {
  if (mode !== null) return mode;
  if (!hosted) {
    try {
      const r = await fetch('/api/status', { cache: 'no-store' });
      if (r.ok && (await r.json()).ai) return (mode = 'server');
    } catch { /* no local server */ }
    return (mode = 'none');
  }
  return (mode = (await sampleFn()) ? 'sample' : 'none');
}

// --- Company register (recherche-entreprises.api.gouv.fr) ---------------------------------------

const NAF_SECTIONS = {
  A: 'Agriculture, forestry and fishing', B: 'Mining and quarrying', C: 'Manufacturing', D: 'Energy supply',
  E: 'Water supply and waste management', F: 'Construction', G: 'Wholesale and retail trade', H: 'Transport and storage',
  I: 'Accommodation and food services', J: 'Information and communication', K: 'Finance and insurance', L: 'Real estate',
  M: 'Professional, scientific and technical services', N: 'Administrative and support services', O: 'Public administration',
  P: 'Education', Q: 'Health and social work', R: 'Arts, entertainment and recreation', S: 'Other services',
  T: 'Households as employers', U: 'Extraterritorial organisations',
};

function sizeFromRegister(r) {
  const t = r.tranche_effectif_salarie;
  if (['00', '01', '02', '03', '11', '12'].includes(t)) return ['small', 'stated'];
  if (['21', '22', '31', '32'].includes(t)) return ['medium', 'stated'];
  if (['41', '42', '51'].includes(t)) return ['large', 'stated'];
  if (['52', '53'].includes(t)) return ['xlarge', 'stated'];
  if (r.categorie_entreprise === 'GE') return ['xlarge', 'inferred'];
  if (r.categorie_entreprise === 'ETI') return ['large', 'inferred'];
  return [null];
}

function typeFromRegister(r) {
  const c = r.complements || {};
  const section = r.section_activite_principale;
  if (c.est_association) return ['nonprofit', 'stated'];
  if (c.est_administration || c.collectivite_territoriale || c.est_service_public || section === 'O' || String(r.nature_juridique || '').startsWith('7')) return ['public', 'stated'];
  if (section === 'P' || c.est_uai) return ['education', 'inferred'];
  if (section === 'Q' || c.est_finess) return ['healthcare', 'inferred'];
  if (String(r.activite_principale || '').startsWith('72')) return ['research', 'inferred'];
  return ['private', 'inferred'];
}

async function searchRegister(q) {
  const url = `https://recherche-entreprises.api.gouv.fr/search?q=${encodeURIComponent(q)}&per_page=6&etat_administratif=A`;
  const r = await fetch(url);
  if (!r.ok) throw new Error(r.status === 429 ? 'Too many searches. Wait a few seconds and try again.' : 'The register did not respond.');
  return (await r.json()).results || [];
}

function registerProposals(r) {
  const items = [];
  const siege = r.siege || {};
  const quote = [r.nom_complet, siege.adresse, r.activite_principale && `NAF ${r.activite_principale}`].filter(Boolean).join(' · ');
  const add = (path, label, value, display, basis = 'stated') => value != null && value !== '' && items.push({ path, label, value, display: display ?? value, quote: '', basis });
  add('org.name', 'Organisation name', titleCase(r.nom_complet));
  const [type, tb] = typeFromRegister(r); add('org.type', 'Type of organisation', type, labelOf(ORG_TYPES, type), tb);
  const [size, sb] = sizeFromRegister(r); add('org.size', 'Size', size, labelOf(ORG_SIZES, size), sb);
  add('org.sector', 'Sector', NAF_SECTIONS[r.section_activite_principale]);
  add('org.country', 'Country', 'France');
  add('org.siren', 'SIREN number', r.siren);
  return { source: 'register', sourceLabel: 'the French company register', note: `Register entry: ${quote}`, items };
}

const titleCase = s => (s || '').toLowerCase().replace(/(^|[\s\-'’(])([a-zà-ÿ])/g, (m, a, b) => a + b.toUpperCase());

// --- Website and documents (server.py + Claude) ------------------------------------------------------

const FIELD_MAP = {
  name: ['org.name', 'Organisation name'], website: ['org.website', 'Website'], contact_email: ['org.contact', 'Contact email'],
  org_type: ['org.type', 'Type of organisation', ORG_TYPES], size: ['org.size', 'Size', ORG_SIZES], sector: ['org.sector', 'Sector'],
  scope: ['org.scope', 'Geographic scope', SCOPES], country: ['org.country', 'Country'], description: ['org.description', 'Context and motivation'],
  ai_maturity: ['org.maturity', 'Where you are with AI', MATURITY], stakeholders: ['org.stakeholders', 'Who the charter affects', STAKEHOLDERS],
  values: ['vision.values', 'Values', VALUES], vision: ['vision.statement', 'Vision statement'], ai_uses: ['org.aiUses', 'Where you already use AI'],
  existing_policies: ['org.existingPolicies', 'Related policies'],
};

function serverProposals(data, source, sourceLabel) {
  const items = [];
  for (const [key, f] of Object.entries(data.fields || {})) {
    if (!f || f.value == null || f.value === '' || (Array.isArray(f.value) && !f.value.length)) continue;
    if (key === 'regulated_sector') {
      if (f.value === true) items.push({ path: 'governance.regulation', label: 'Regulation', value: 'high', display: labelOf(REGULATION, 'high'), quote: f.source_quote, basis: f.basis });
      continue;
    }
    const m = FIELD_MAP[key];
    if (!m) continue;
    const [path, label, options] = m;
    let value = f.value;
    let display = value;
    if (key === 'values') {
      const known = value.map(v => VALUES.find(o => o.value === v.toLowerCase() || o.label.toLowerCase() === v.toLowerCase())?.value);
      const extra = value.filter((v, i) => !known[i]).map(v => v.charAt(0).toUpperCase() + v.slice(1));
      value = known.filter(Boolean);
      if (extra.length) items.push({ path: 'vision.customValues', label: 'Other values', value: extra, display: extra.join(', '), quote: f.source_quote, basis: f.basis });
      if (!value.length) continue;
      display = value.map(v => labelOf(VALUES, v)).join(', ');
    } else if (Array.isArray(value)) {
      display = value.map(v => labelOf(options, v)).join(', ');
    } else if (options) {
      display = labelOf(options, value);
    }
    items.push({ path, label, value, display, quote: f.source_quote, basis: f.basis });
  }
  return { source, sourceLabel, items };
}

async function postJSON(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || `The server returned ${r.status}.`);
  return data;
}

const readAsBase64 = file => new Promise((resolve, reject) => {
  const fr = new FileReader();
  fr.onload = () => resolve(String(fr.result).split(',')[1] || '');
  fr.onerror = () => reject(new Error(`Could not read ${file.name}.`));
  fr.readAsDataURL(file);
});

// --- In the artifact viewer: read files in the page, ask Claude through the viewer ------------------

const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
const MAMMOTH = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';

async function fileText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith('.pdf') || file.type === 'application/pdf') {
    await loadScript(PDFJS + 'pdf.min.js');
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js';
    const pdf = await window.pdfjsLib.getDocument({ data: await file.arrayBuffer() }).promise;
    const pages = [];
    for (let i = 1; i <= Math.min(pdf.numPages, 60); i++) {
      const content = await (await pdf.getPage(i)).getTextContent();
      pages.push(content.items.map(it => it.str).join(' '));
    }
    return pages.join('\n\n');
  }
  if (name.endsWith('.docx')) {
    await loadScript(MAMMOTH);
    return (await window.mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() })).value;
  }
  if (/\.(txt|md|markdown)$/.test(name) || file.type.startsWith('text/')) return file.text();
  throw new Error(`${file.name}: use PDF, Word (.docx), text or Markdown.`);
}

const FIELD_GUIDE = `name: organisation name
website: main website URL
contact_email: general or governance contact email, only if written in the source
org_type: one of private, public, education, nonprofit, research, healthcare, community, other
size: one of small (1-50 people), medium (50-500), large (500-5000), xlarge (over 5000), na
sector: sector or main activity in a few words
scope: one of local, regional, national, international, global
country: country of the head office, in English
description: two or three sentences on what the organisation does and why AI matters to it, first person plural
ai_maturity: one of planning (not using AI yet), exploring (pilots), adopting (some tools in everyday use), integrating (several AI systems), centric (AI is core)
stakeholders: list from staff, students, teachers, parents, clients, patients, public, partners, researchers, developers, regulators, other
values: list of the organisation's stated values, one or two words each
vision: one or two sentences on how the organisation uses or wants to use AI, first person plural
ai_uses: AI tools, products or projects mentioned
existing_policies: related policies mentioned (data protection, ethics, IT use, codes of conduct)
regulated_sector: true only if it works in a heavily regulated sector such as health, finance or critical infrastructure`;

async function askClaude(sourceText, sourceName) {
  const sample = await sampleFn();
  if (!sample) throw new Error('Claude is not available in this view.');
  const prompt = `You extract facts about an organisation to pre-fill an AI charter questionnaire.

Reply with only a JSON object. Its keys are the field names below. Each value is an object {"value": ..., "quote": "...", "basis": "stated" | "inferred"}:
- value: the answer, or null if the source says nothing about it. Never guess names, emails or numbers.
- quote: a short verbatim excerpt (under 200 characters) from the source that supports the value, or null.
- basis: "stated" if the source says it directly, "inferred" if you worked it out.
Write free text in British English, plainly, without marketing language.

Fields:
${FIELD_GUIDE}

Source (${sourceName}):
"""
${sourceText.slice(0, 40000)}
"""`;
  let data;
  try {
    data = await sample.json(prompt);
  } catch (e) {
    const copy = {
      not_granted: 'Claude was not allowed for this page, so autofill is off.',
      rate_limited: 'Claude is busy. Try again in a minute.',
      refused: 'Claude declined to read this source.',
      invalid_json: 'Claude’s answer could not be read. Try again.',
      prompt_too_large: 'That is too much text. Use a shorter extract.',
    };
    throw new Error(copy[e?.code] || 'Claude could not read this source. Try again.');
  }
  const fields = {};
  for (const [k, f] of Object.entries(data || {})) {
    if (!f || typeof f !== 'object') continue;
    fields[k] = { value: f.value ?? null, source_quote: f.quote || null, basis: f.basis === 'stated' ? 'stated' : 'inferred' };
  }
  return { fields };
}

// --- UI ------------------------------------------------------------------------------------------

function currentDisplay(item) {
  const v = get(item.path);
  if (v == null || v === '' || (Array.isArray(v) && !v.length)) return '';
  const opts = { 'org.type': ORG_TYPES, 'org.size': ORG_SIZES, 'org.scope': SCOPES, 'org.maturity': MATURITY, 'org.stakeholders': STAKEHOLDERS, 'vision.values': VALUES, 'governance.regulation': REGULATION }[item.path];
  if (Array.isArray(v)) return v.map(x => (opts ? labelOf(opts, x) : x)).join(', ');
  return opts ? labelOf(opts, v) : String(v);
}

function reviewHtml() {
  if (!proposals) return '';
  if (!proposals.items.length) {
    return `<div class="callout" id="review"><p>Nothing usable was found in ${esc(proposals.sourceLabel)}.</p><button type="button" class="btn btn-ghost btn-sm" data-af="discard">Close</button></div>`;
  }
  const rows = proposals.items.map((it, i) => {
    const current = currentDisplay(it);
    const own = current && isTouched(it.path) && !state.provenance[it.path];
    return `<div class="review-row"><label class="check"><input type="checkbox" data-af-item="${i}"${own ? '' : ' checked'}>` +
      `<span><span class="review-label">${esc(it.label)} <span class="tag">${it.basis === 'inferred' ? 'Inferred' : 'Stated'}</span></span>` +
      `<span class="review-value">${esc(it.display)}</span>` +
      (current && current !== String(it.display) ? `<span class="review-current">Currently: ${esc(current)}</span>` : '') +
      (it.quote ? `<span class="review-quote">“${esc(it.quote)}”</span>` : '') +
      '</span></label></div>';
  }).join('');
  return `<section class="review card" id="review" aria-labelledby="review-title">
    <span class="eyebrow">Check before using</span>
    <h2 id="review-title">Found in ${esc(proposals.sourceLabel)}</h2>
    ${proposals.note ? `<p class="review-quote">${esc(proposals.note)}</p>` : ''}
    <p class="field-hint">Untick anything that is wrong. Values marked inferred were worked out rather than stated. You can change everything later.</p>
    <div class="review-rows">${rows}</div>
    <div class="actions"><button type="button" class="btn btn-primary" data-af="accept">Use selected values</button>
    <button type="button" class="btn btn-ghost" data-af="discard">Discard</button></div>
  </section>`;
}

function resultsHtml() {
  if (!results.length) return '';
  return `<ul class="results">${results.map((r, i) => `<li><button type="button" class="result" data-af="pick" data-index="${i}">` +
    `<span class="result-name">${esc(titleCase(r.nom_complet))}</span>` +
    `<span class="result-meta">${esc([r.siege?.libelle_commune && titleCase(r.siege.libelle_commune), NAF_SECTIONS[r.section_activite_principale], r.siren && `SIREN ${r.siren}`].filter(Boolean).join(' · '))}</span></button></li>`).join('')}</ul>`;
}

export function sourcesHtml() {
  const off = mode === 'none';
  const offNote = off
    ? `<p class="field-hint">${hosted ? 'Claude is not available in this view.' : 'Needs the local server with Claude set up. See the README.'}</p>`
    : '';
  const register = hosted ? '' : `<div class="source card">
      <h2 class="source-title">Company register</h2>
      <p class="field-hint">French organisations. Name, SIREN or SIRET. Free and runs in your browser.</p>
      <form data-af-form="register" class="inline-form"><label class="sr-only" for="af-q">Organisation name or SIREN</label>
        <input id="af-q" type="search" placeholder="Organisation name or SIREN" autocomplete="organization">
        <button class="btn btn-ghost" type="submit"${busy ? ' disabled' : ''}>Search</button></form>
      ${resultsHtml()}
    </div>`;
  const website = mode === 'sample' || (hosted && off) ? `<div class="source card${off ? ' is-disabled' : ''}">
      <h2 class="source-title">Your website</h2>
      <p class="field-hint">Paste the text of your about or mission page. Claude suggests answers from it.</p>
      <form data-af-form="paste" class="inline-form"><label class="sr-only" for="af-paste">Text from your website</label>
        <textarea id="af-paste" rows="4" placeholder="Paste text here"${off ? ' disabled' : ''}></textarea>
        <button class="btn btn-ghost" type="submit"${busy || off ? ' disabled' : ''}>Read text</button></form>
      ${offNote}
    </div>` : `<div class="source card${off ? ' is-disabled' : ''}">
      <h2 class="source-title">Your website</h2>
      <p class="field-hint">Claude reads your home, about and mission pages and suggests answers.</p>
      <form data-af-form="url" class="inline-form"><label class="sr-only" for="af-url">Website address</label>
        <input id="af-url" type="url" placeholder="https://example.org" value="${esc(state.org.website)}"${off ? ' disabled' : ''}>
        <button class="btn btn-ghost" type="submit"${busy || off ? ' disabled' : ''}>Read site</button></form>
      ${offNote}
    </div>`;
  // On the website there is no Claude behind the page: offer the register search only.
  if (!hosted && off) return `<div class="sources">${register}</div>
  <p class="status" role="status" aria-live="polite">${esc(busy || message)}</p>
  ${reviewHtml()}`;
  return `<div class="sources">
    ${register}
    ${website}
    <div class="source card${off ? ' is-disabled' : ''}">
      <h2 class="source-title">Your documents</h2>
      <p class="field-hint">An existing policy, staff handbook or annual report. PDF, Word, text or Markdown, up to 5 files.</p>
      <form data-af-form="docs" class="inline-form"><label class="sr-only" for="af-files">Documents</label>
        <input id="af-files" type="file" multiple accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain,text/markdown"${off ? ' disabled' : ''}>
        <button class="btn btn-ghost" type="submit"${busy || off ? ' disabled' : ''}>Read documents</button></form>
      ${offNote}
    </div>
  </div>
  <p class="status" role="status" aria-live="polite">${esc(busy || message)}</p>
  ${reviewHtml()}`;
}

export function mountSources(el, done) {
  onDone = done;
  const redraw = () => {
    el.innerHTML = sourcesHtml();
    if (proposals) el.querySelector('#review')?.scrollIntoView({ block: 'nearest' });
  };
  redraw();
  if (mode === null) checkAI().then(redraw);

  el.onsubmit = async e => {
    e.preventDefault();
    const kind = e.target.dataset.afForm;
    message = '';
    try {
      if (kind === 'register') {
        const q = el.querySelector('#af-q').value.trim();
        if (q.length < 3) { message = 'Enter at least three characters.'; redraw(); return; }
        busy = 'Searching the register…'; redraw();
        results = await searchRegister(q);
        message = results.length ? `${results.length} match${results.length === 1 ? '' : 'es'}. Choose yours.` : 'No active organisation found. Try another spelling or the SIREN number.';
      } else if (kind === 'url') {
        let url = el.querySelector('#af-url').value.trim();
        if (!url) { message = 'Enter your website address.'; redraw(); return; }
        if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
        busy = 'Reading your website. This usually takes under a minute…'; redraw();
        const data = await postJSON('/api/extract/url', { url });
        proposals = serverProposals(data, 'website', new URL(url).hostname);
        if (!proposals.items.some(i => i.path === 'org.website')) proposals.items.push({ path: 'org.website', label: 'Website', value: url, display: url, quote: '', basis: 'stated' });
      } else if (kind === 'paste') {
        const text = el.querySelector('#af-paste').value.trim();
        if (text.length < 40) { message = 'Paste a paragraph or more of text.'; redraw(); return; }
        busy = 'Reading the text. This usually takes under a minute…'; redraw();
        proposals = serverProposals(await askClaude(text, 'pasted website text'), 'website', 'the pasted text');
      } else if (kind === 'docs' && mode === 'sample') {
        const files = [...el.querySelector('#af-files').files];
        if (!files.length) { message = 'Choose at least one file.'; redraw(); return; }
        if (files.length > 5) { message = 'Choose up to five files.'; redraw(); return; }
        busy = `Reading ${files.length === 1 ? files[0].name : `${files.length} documents`}…`; redraw();
        const texts = [];
        for (const f of files) {
          try { texts.push(`--- ${f.name} ---\n${await fileText(f)}`); } catch (err) { throw new Error(err.message?.includes(f.name) ? err.message : `Could not read ${f.name}. Paste its text instead.`); }
        }
        const joined = texts.join('\n\n');
        if (joined.replace(/---.*---/g, '').trim().length < 40) throw new Error('No readable text found. A scanned PDF has no text layer; paste its text instead.');
        proposals = serverProposals(await askClaude(joined, files.map(f => f.name).join(', ')), 'document', files.length === 1 ? files[0].name : 'your documents');
      } else if (kind === 'docs') {
        const files = [...el.querySelector('#af-files').files];
        if (!files.length) { message = 'Choose at least one file.'; redraw(); return; }
        if (files.length > 5) { message = 'Choose up to five files.'; redraw(); return; }
        const tooBig = files.find(f => f.size > 20 * 1024 * 1024);
        if (tooBig) { message = `${tooBig.name} is over 20 MB.`; redraw(); return; }
        busy = `Reading ${files.length === 1 ? files[0].name : `${files.length} documents`}. Longer documents take a minute or two…`; redraw();
        const payload = await Promise.all(files.map(async f => ({ filename: f.name, mime: f.type, data_base64: await readAsBase64(f) })));
        const data = await postJSON('/api/extract/document', { files: payload });
        proposals = serverProposals(data, 'document', files.length === 1 ? files[0].name : 'your documents');
      }
    } catch (err) {
      message = err.message || 'Something went wrong.';
    }
    busy = '';
    redraw();
  };

  el.onclick = e => {
    const btn = e.target.closest('[data-af]');
    if (!btn) return;
    const act = btn.dataset.af;
    if (act === 'pick') {
      proposals = registerProposals(results[Number(btn.dataset.index)]);
      results = [];
      message = '';
    } else if (act === 'discard') {
      proposals = null;
    } else if (act === 'accept') {
      const chosen = [...el.querySelectorAll('[data-af-item]')].filter(c => c.checked).map(c => proposals.items[Number(c.dataset.afItem)]);
      chosen.forEach(it => fill(it.path, structuredClone(it.value), proposals.source));
      const n = chosen.length;
      proposals = null;
      message = '';
      commit({ source: 'autofill' });
      onDone(n);
      return;
    }
    redraw();
  };
}
